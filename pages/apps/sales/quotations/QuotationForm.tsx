import React, { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/form/Input';
import { Dropdown } from '@/components/form/Dropdown';
import { useAppDispatch, useAppSelector } from '@/store';
import Button from '@/components/Button';
import { ButtonSize, ButtonType, ButtonVariant, FORM_CODE_TYPE, IconType } from '@/utils/enums';
import { getIcon } from '@/utils/helper';
import Textarea from '@/components/form/Textarea';
import { setAuthToken, setContentType } from '@/configs/api.config';
import Option from '@/components/form/Option';
import Alert from '@/components/Alert';
import { getProductAssemblies } from '@/store/slices/productAssemblySlice';
import { clearUtilState, generateCode } from '@/store/slices/utilSlice';
import { getFillingProducts, getRawProducts } from '@/store/slices/rawProductSlice';
import { storeQuotation } from '@/store/slices/quotationSlice';
import { getEmployees } from '@/store/slices/employeeSlice';
import { getCustomers } from '@/store/slices/customerSlice';
import { getTaxCategories } from '@/store/slices/taxCategorySlice';
import AgGridComponent from '@/components/apps/AgGridComponent';
import { AgGridReact } from 'ag-grid-react';
import IconButton from '@/components/IconButton';

const QuotationForm = () => {
    const dispatch = useAppDispatch();
    const gridRef = useRef<AgGridReact<any>>(null);
    const { token } = useAppSelector((state) => state.user);
    const { code } = useAppSelector((state) => state.util);
    const { employees } = useAppSelector((state) => state.employee);
    const { customers } = useAppSelector((state) => state.customer);
    const { fillingProducts, allRawProducts } = useAppSelector((state) => state.rawProduct);
    const { allProductAssemblies } = useAppSelector((state) => state.productAssembly);

    const [formData, setFormData] = useState<any>({});
    const [quotationItems, setQuotationItems] = useState<any[]>([]);
    const [customerOptions, setCustomerOptions] = useState<any[]>([]);
    const [contactPersonOptions, setContactPersonOptions] = useState<any[]>([]);
    const [pinnedBottomRowData, setPinnedBottomRowData] = useState<any[]>([]);
    const [salesmanOptions, setSalesmanOptions] = useState<any[]>([]);
    const [quotationForOptions] = useState<any[]>([
        { label: 'Finished Goods', value: 1 },
        { label: 'Materials', value: 2 }
    ]);
    const [validations, setValidations] = useState<any>({});
    const [formError, setFormError] = useState<any>('');
    const [colDefs, setColDefs] = useState<any>([]);

    const handleRemoveRow = (row: any) => {
        const updatedItems = quotationItems.filter((item) => item.id !== row.id);
        setQuotationItems(updatedItems);
    };

    useEffect(() => {
        console.log(quotationItems);
    }, [quotationItems])

    const calculateTotals = () => {
        const totalQuantity = quotationItems.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
        const totalSalePrice = quotationItems.reduce((sum, item) => sum + Number(item.sale_price || 0), 0);
        const totalSubTotal = quotationItems.reduce((sum, item) => sum + Number(item.quantity * item.sale_price || 0), 0);
        const totalVAT = totalSubTotal * 0.05; // Assuming VAT is 5%
        const totalGrandTotal = totalSubTotal + totalVAT;

        setPinnedBottomRowData([{
            product_assembly_id: 'Total',
            raw_product_id: '',
            capacity: '',
            quantity: totalQuantity,
            sale_price: totalSalePrice.toFixed(4),
            sub_total: totalSubTotal.toFixed(4),
            tax_amount: totalVAT.toFixed(4),
            grand_total: totalGrandTotal.toFixed(4)
        }]);
    };

    useEffect(() => {
        setQuotationItems([]);
        let defaultColDef = [
            {
                headerName: 'Qty',
                field: 'quantity',
                editable: (params: any) => !params.node.rowPinned, // Disable editing in pinned row
                cellRenderer: (params: any) => params.node?.rowPinned ? params.value : params.value,
                minWidth: 150,
                filter: false,
                floatingFilter: false
            },
            {
                headerName: 'S.Price',
                field: 'sale_price',
                editable: (params: any) => !params.node.rowPinned, // Disable editing in pinned row
                cellRenderer: (params: any) => params.node?.rowPinned ? params.value : params.value,
                minWidth: 150,
                filter: false,
                floatingFilter: false
            },
            {
                headerName: 'S.Total',
                field: 'sub_total',
                valueGetter: (params: any) => params.data.quantity * params.data.sale_price,
                cellRenderer: (params: any) => params.node?.rowPinned ? params.value : params.value,
                minWidth: 150,
                filter: false,
                floatingFilter: false
            },
            {
                headerName: 'VAT@5%',
                field: 'tax_amount',
                valueGetter: (params: any) => params.data.sale_price * params.data.quantity * 0.05,
                cellRenderer: (params: any) => params.node?.rowPinned ? params.value : params.value,
                minWidth: 150,
                filter: false,
                floatingFilter: false
            },
            {
                headerName: 'Total',
                field: 'grand_total',
                valueGetter: (params: any) => {
                    const subTotal = params.data.sale_price * params.data.quantity;
                    const tax = subTotal * 0.05;
                    return subTotal + tax;
                },
                cellRenderer: (params: any) => params.node?.rowPinned ? params.value : params.value,
                minWidth: 150,
                filter: false,
                floatingFilter: false
            },
            {
                headerName: '',
                field: 'remove',
                cellRenderer: (params: any) => (
                    !params.node?.rowPinned &&
                    <IconButton
                        color={ButtonVariant.danger}
                        icon={IconType.delete}
                        onClick={() => handleRemoveRow(params.data)}
                    />
                ),
                // minWidth: 50,
                // maxWidth: 50,
                editable: false,
                filter: false,
                floatingFilter: false,
                sortable: false
            }
        ];

        if (formData.quotation_for === 1) {
            const finishGoodsColDefs = [
                {
                    headerName: 'Product',
                    field: 'product_assembly_id',
                    editable: (params: any) => !params.node.rowPinned, // Disable editing in pinned row
                    cellEditor: 'agSelectCellEditor',
                    cellEditorParams: {
                        values: allProductAssemblies ? allProductAssemblies.map((option: any) => option.id) : []
                    },
                    valueFormatter: (params: any) => {
                        if (params.node?.rowPinned) return 'Total';  // No formatting for pinned row, just return 'Total'
                        const selectedOption = allProductAssemblies?.find((option: any) => option.id === params.value);
                        return selectedOption ? selectedOption.formula_name : '';
                    },
                    cellRenderer: (params: any) => {
                        if (params.node?.rowPinned) return 'Total';  // Show 'Total' for pinned row
                        const selectedOption = allProductAssemblies?.find((option: any) => option.id === params.value);
                        return selectedOption ? selectedOption.formula_name : '';
                    },
                    minWidth: 150,
                    filter: false,
                    floatingFilter: false
                },
                {
                    headerName: 'Filling',
                    field: 'raw_product_id',
                    editable: (params: any) => !params.node.rowPinned, // Disable editing in pinned row
                    cellEditor: 'agSelectCellEditor',
                    cellEditorParams: {
                        values: fillingProducts ? fillingProducts.map((material: any) => material.id) : []
                    },
                    valueFormatter: (params: any) => {
                        if (params.node?.rowPinned) return '';  // No formatting for pinned row
                        const selectedOption = fillingProducts?.find((material: any) => material.id === params.value);
                        return selectedOption ? selectedOption.title : '';
                    },
                    cellRenderer: (params: any) => {
                        if (params.node?.rowPinned) return '';  // Show empty text for pinned row
                        const selectedOption = fillingProducts?.find((material: any) => material.id === params.value);
                        return selectedOption ? selectedOption.title : '';
                    },
                    minWidth: 150,
                    filter: false,
                    floatingFilter: false
                },
                {
                    headerName: 'Capacity',
                    field: 'capacity',
                    editable: (params: any) => !params.node.rowPinned, // Disable editing in pinned row
                    cellRenderer: (params: any) => params.node?.rowPinned ? '' : params.value,
                    minWidth: 150,
                    filter: false,
                    floatingFilter: false
                }
            ];

            setColDefs([...finishGoodsColDefs, ...defaultColDef]);
        } else if (formData.quotation_for === 2) {
            const rawProductColDefs = [
                {
                    headerName: 'Product',
                    field: 'raw_product_id',
                    editable: (params: any) => !params.node.rowPinned, // Disable editing in pinned row
                    cellEditor: 'agSelectCellEditor',
                    cellEditorParams: {
                        values: allRawProducts ? allRawProducts.map((option: any) => option.id) : []
                    },
                    valueFormatter: (params: any) => {
                        if (params.node?.rowPinned) return 'Total';  // No formatting for pinned row, just return 'Total'
                        const selectedOption = allRawProducts?.find((option: any) => option.id === params.value);
                        return selectedOption ? selectedOption.title : '';
                    },
                    cellRenderer: (params: any) => {
                        if (params.node?.rowPinned) return 'Total';  // Show 'Total' for pinned row
                        const selectedOption = allRawProducts?.find((option: any) => option.id === params.value);
                        return selectedOption ? selectedOption.title : '';
                    },
                    minWidth: 150,
                    filter: false,
                    floatingFilter: false
                }
            ];

            setColDefs([...rawProductColDefs, ...defaultColDef]);
        } else {
            setColDefs([]);
        }
    }, [formData.quotation_for]);

    const handleChange = (name: string, value: any, required = false) => {
        handleValidation(name, 'remove');
        switch (name) {
            case 'delivery_due_in_days':
                // Adjust date based on input value
                const dueDate = new Date();
                dueDate.setDate(dueDate.getDate() + parseInt(value));
                setFormData((prev: any) => ({
                    ...prev,
                    delivery_due_in_days: value,
                    delivery_due_date: dueDate.toDateString()
                }));
                break;
            case 'quotation_for':
            case 'contact_person_id':
            case 'salesman_id':
            case 'customer_id':
                if (value && typeof value !== 'undefined') {
                    setFormData((prev: any) => ({ ...prev, [name]: value.value }));
                    if (name === 'customer_id') {
                        const customerOption = customerOptions.find(customer => customer.value === value.value);
                        setContactPersonOptions(customerOption.customer?.contact_persons.map((contactPerson: any) => ({
                            label: contactPerson.name,
                            value: contactPerson.id,
                            contactPerson
                        })));
                    }
                } else {
                    if (name === 'customer_id') {
                        setContactPersonOptions([]);
                    }
                    setFormData((prev: any) => ({ ...prev, [name]: '' }));
                }
                break;
            default:
                setFormData((prev: any) => ({ ...prev, [name]: value }));
                break;
        }
    };

    const handleValidation = (name: string, type: string) => {
        if (type === 'remove') {
            if (validations[name]) {
                setValidations((prev: any) => {
                    delete prev[name];
                    return prev;
                });
            }
        } else {
            setValidations({ ...validations, [name]: 'Required Field' });
        }
    };

    useEffect(() => {
        setAuthToken(token);
        setContentType('application/json');
        dispatch(clearUtilState());
        dispatch(generateCode(FORM_CODE_TYPE.QUOTATION));
        dispatch(getEmployees());
        dispatch(getFillingProducts(['filling-material', 'packing-material']));
        dispatch(getCustomers());
        dispatch(getProductAssemblies());
        dispatch(getTaxCategories());
        dispatch(getRawProducts([]));
    }, []);

    // useEffect(() => {
    //     calculateTotals();
    // }, [quotationItems]);


    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        e.currentTarget.querySelectorAll('input, select, textarea').forEach((field: any) => {
            if (field.required) {
                if ((!formData[field.name] || formData[field.name] === 0) && !validations[field.name] && field.value === '') {
                    setValidations({ ...validations, [field.name]: 'Required Field' });
                }
            }
        });

        if (Object.keys(validations).length > 0) {
            setFormError('Please fill all required fields');
            return;
        } else {

            let quotationData: any = {
                // product_assembly_id: formData.product_assembly_id,
                quotation_for: formData.quotation_for,
                receipt_delivery_due_days: formData.receipt_delivery_due_days,
                delivery_due_in_days: formData.delivery_due_in_days,
                delivery_due_date: formData.delivery_due_date,
                salesman_id: formData.salesman_id,
                print_as_performa: formData.print_as_performa,
                customer_id: formData.customer_id,
                contact_person_id: formData.contact_person_id,
                quotation_items: quotationItems,
                terms_conditions: formData.terms_conditions
            };
            // console.log(quotationData);
            dispatch(storeQuotation(quotationData));
        }
    };

    useEffect(() => {
        if (validations && Object.keys(validations).length > 0) {
            setFormError('Please fill all required fields');
        } else {
            setFormError('');
        }
    }, [validations]);

    useEffect(() => {
        if (employees) {
            setSalesmanOptions(employees.map((employee: any) => ({
                label: employee.name + ' - ' + employee.employee?.employee_code,
                value: employee.id
            })));
        }
    }, [employees]);

    useEffect(() => {
        if (customers) {
            setCustomerOptions(customers.map((customer: any) => ({
                label: customer.name + ' (' + customer.customer_code + ')',
                value: customer.id,
                customer
            })));
        }
    }, [customers]);

    useEffect(() => {
        if (code) {
            setFormData({ ...formData, quotation_code: code[FORM_CODE_TYPE.QUOTATION] });
        }
    }, [code]);

    return (
        <form onSubmit={(e) => handleSubmit(e)}>
            {validations && Object.keys(validations).length > 0 && (
                <Alert message={formError} setMessages={setFormError} alertType="error" />
            )}

            <div className="flex w-full flex-row items-start justify-between gap-3 mt-3">
                <div className="flex w-full flex-col items-start justify-start space-y-3">

                    <Dropdown
                        divClasses="w-full"
                        label="Quotation For"
                        name="quotation_for"
                        options={quotationForOptions}
                        value={formData.quotation_for}
                        onChange={(e: any) => handleChange('quotation_for', e, true)}
                        required={true}
                        errorMessage={validations.quotation_for}
                    />

                    <Input
                        divClasses="w-full"
                        label="Quotation Code"
                        type="text"
                        name="quotation_code"
                        value={formData.quotation_code}
                        onChange={(e) => handleChange(e.target.name, e.target.value, e.target.required)}
                        placeholder="Enter Quotation Code"
                        isMasked={false}
                        disabled={true}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                        <Input
                            divClasses="w-full"
                            label="Receipt Delivery Due Days"
                            type="number"
                            step="any"
                            name="receipt_delivery_due_days"
                            value={formData.receipt_delivery_due_days?.toString()}
                            onChange={(e) => handleChange(e.target.name, e.target.value, e.target.required)}
                            isMasked={false}
                            placeholder="Receipt Delivery Due Days"
                            required={true}
                            errorMessage={validations.receipt_delivery_due_days}
                        />

                        <Input
                            divClasses="w-full"
                            label="Delivery Due days"
                            type="number"
                            step="any"
                            name="delivery_due_in_days"
                            value={formData.delivery_due_in_days}
                            onChange={(e) => handleChange(e.target.name, e.target.value, e.target.required)}
                            isMasked={false}
                            placeholder="Receipt Delivery Days"
                            required={true}
                            errorMessage={validations.delivery_due_in_days}
                        />

                        <Input
                            divClasses="w-full"
                            label="Delivery Due Date"
                            type="text"
                            name="delivery_due_date"
                            value={formData.delivery_due_date}
                            onChange={(e) => handleChange(e.target.name, e.target.value, e.target.required)}
                            isMasked={false}
                            placeholder="Receipt Delivery Due Date"
                            disabled={true}
                            required={true}
                            errorMessage={validations.delivery_due_date}
                        />

                        <Dropdown
                            divClasses="w-full"
                            label="Salesman"
                            name="salesman_id"
                            options={salesmanOptions}
                            value={formData.salesman_id}
                            onChange={(e: any) => handleChange('salesman_id', e, true)}
                            required={true}
                            errorMessage={validations.salesman_id}
                        />

                        <div className="flex w-full justify-between flex-col md:flex-row gap-3 col-span-2">
                            <Dropdown
                                divClasses="w-full"
                                label="Customer"
                                name="customer_id"
                                options={customerOptions}
                                value={formData.customer_id}
                                onChange={(e: any) => handleChange('customer_id', e, true)}
                            />
                            <Dropdown
                                divClasses="w-full"
                                label="Contact Person"
                                name="contact_person_id"
                                options={contactPersonOptions}
                                value={formData.contact_person_id}
                                onChange={(e: any) => handleChange('contact_person_id', e, true)}
                            />
                        </div>

                        <Input
                            divClasses="w-full"
                            label="Discount Amount"
                            type="number"
                            name="discount_amount"
                            value={formData.discount_amount}
                            onChange={(e) => handleChange(e.target.name, e.target.value, e.target.required)}
                            isMasked={false}
                            placeholder="Discount Amount"
                        />

                        <div className="flex justify-start md:items-end">
                            <Option
                                divClasses="w-full"
                                label="Print As Performa Invoice"
                                type="checkbox"
                                name="print_as_performa"
                                value={formData.print_as_performa}
                                defaultChecked={formData.print_as_performa === 1}
                                onChange={(e: any) => handleChange(e.target.name, e.target.checked ? 1 : 0, e.target.required)}
                            />
                        </div>
                    </div>

                </div>
                <div className="w-full border rounded p-5 hidden md:block">
                    <h5 className="text-lg font-semibold dark:text-white-light mb-3">Quotation Instructions</h5>
                    <ul className="list-decimal list-inside space-y-2">
                        <li>Quotation For: Select the type of Quotation you want to create.</li>
                        <li>Quotation Code: This will be auto generated.</li>
                        <li>Receipt Delivery Due Days: Enter the number of days for receipt delivery.</li>
                        <li>Delivery Due Days: Enter the number of days for delivery.</li>
                        <li>Delivery Due Date: This will be auto generated based on Delivery Due Days.</li>
                        <li>Salesman: Select the salesman for this quotation.</li>
                        <li>Skip Delivery Note: Check this if you want to skip delivery note.</li>
                        <li>Print As Performa Invoice: Check this if you want to print as performa invoice.</li>
                        <li>Select Formula and add production quantity to it in case of custom quotation</li>
                    </ul>
                </div>
            </div>

            <div className="my-5 table-responsive">
                <div
                    className="flex mb-3 justify-start items-start md:justify-between md:items-center gap-3 flex-col md:flex-row">
                    <h3 className="text-lg font-semibold">Quotation Items</h3>

                    {formData.quotation_for && (
                        <Button
                            type={ButtonType.button}
                            text={
                                <span className="flex items-center">
                                    {getIcon(IconType.add)}
                                    Add
                                </span>
                            }
                            variant={ButtonVariant.primary}
                            onClick={() => {
                                setQuotationItems((prev: any) => {
                                    return [...prev, {
                                        id: prev.length ? prev[prev.length - 1].id + 1 : 1,
                                        product_assembly_id: 0,
                                        raw_product_id: 0,
                                        capacity: 0,
                                        quantity: 0,
                                        sale_price: 0,
                                        sub_total: 0,
                                        tax_category_id: 0,
                                        tax_rate: 5,
                                        tax_amount: 0,
                                        grand_total: 0
                                    }];
                                });
                            }}
                            size={ButtonSize.small}
                        />
                    )}
                </div>
                <AgGridComponent
                    gridRef={gridRef}
                    data={quotationItems}
                    colDefs={colDefs}
                    pagination={false}
                    // pinnedBottomRowData={pinnedBottomRowData}
                    height={400}
                />

            </div>

            <Textarea
                divClasses="w-full"
                label="Terms & Conditions"
                name="terms_conditions"
                value={formData.terms_conditions}
                onChange={(e) => handleChange('terms_conditions', e, false)}
                isReactQuill={true}
            />

            <div className="w-full flex justify-center items-center flex-col md:flex-row gap-3 mt-5">
                <Button
                    type={ButtonType.link}
                    text="Preview"
                    variant={ButtonVariant.success}
                    disabled={false}
                    link="/apps/sales/orders/quotations/preview"
                />
                <Button
                    type={ButtonType.submit}
                    text="Submit"
                    variant={ButtonVariant.primary}
                    disabled={false}
                />
                <Button
                    type={ButtonType.button}
                    text="Clear"
                    variant={ButtonVariant.info}
                    disabled={false}
                    onClick={() => window?.location?.reload()}
                />
            </div>

        </form>
    );
};

export default QuotationForm;
