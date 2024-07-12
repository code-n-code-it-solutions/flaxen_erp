import React, { useEffect, useState } from 'react';
import { Input } from '@/components/form/Input';
import { Dropdown } from '@/components/form/Dropdown';
import { IRootState, useAppDispatch, useAppSelector } from '@/store';
import Button from '@/components/Button';
import { ButtonSize, ButtonType, ButtonVariant, FORM_CODE_TYPE, IconType } from '@/utils/enums';
import { getIcon } from '@/utils/helper';
import Textarea from '@/components/form/Textarea';
import { setAuthToken, setContentType } from '@/configs/api.config';
import Option from '@/components/form/Option';
import Alert from '@/components/Alert';
import IconButton from '@/components/IconButton';
import { getProductAssemblies } from '@/store/slices/productAssemblySlice';
import { clearUtilState, generateCode } from '@/store/slices/utilSlice';
import { getFillingProducts, getRawProducts } from '@/store/slices/rawProductSlice';
import { clearFillingState, getFinishedGoodStock } from '@/store/slices/fillingSlice';
import { storeQuotation } from '@/store/slices/quotationSlice';
import { getEmployees } from '@/store/slices/employeeSlice';
import { getCustomers } from '@/store/slices/customerSlice';
import FinishedGoodModal from '@/components/modals/FinishedGoodModal';
import { capitalize } from 'lodash';
import { getTaxCategories } from '@/store/slices/taxCategorySlice';
import { useSelector } from 'react-redux';

const QuotationForm = () => {
    const dispatch = useAppDispatch();
    const { token } = useAppSelector((state) => state.user);
    const { code } = useAppSelector((state) => state.util);
    const { employees } = useAppSelector((state) => state.employee);
    const { customers } = useAppSelector((state) => state.customer);
    const { fillingProducts } = useAppSelector((state) => state.rawProduct);
    const { allProductAssemblies } = useAppSelector((state) => state.productAssembly);
    const { taxCategories } = useSelector((state: IRootState) => state.taxCategory);

    const [fillingMaterials, setFillingMaterials] = useState<any[]>([]);
    const [formData, setFormData] = useState<any>({});
    const [quotationItems, setQuotationItems] = useState<any[]>([]);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [productAssemblyOptions, setProductAssemblyOptions] = useState<any[]>([]);
    const [customerOptions, setCustomerOptions] = useState<any[]>([]);
    const [contactPersonOptions, setContactPersonOptions] = useState<any[]>([]);
    const [salesmanOptions, setSalesmanOptions] = useState<any[]>([]);
    const [quotationForOptions] = useState<any[]>([
        { label: 'Finished Goods', value: 1 },
        { label: 'Materials', value: 2 }
    ]);
    const [validations, setValidations] = useState<any>({});
    const [formError, setFormError] = useState<any>('');

    const handleChange = (name: string, value: any, required = false) => {
        // Directly handle validation for required fields and specific conditions
        // if (required && (value === '' || (['salesman_id', 'contact_person_id', 'customer_id'].includes(name) && value === 0))) {
        //     handleValidation(name, 'add');
        //     return;
        // }

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

    const handleQuotationItemSubmit = (item: any) => {
        console.log(item);
        setQuotationItems((prev) => {
            const existingRow = prev.find(row => row.raw_product_id === item.raw_product_id && row.product_assembly_id === item.product_assembly_id && row.batch_number === item.batch_number);
            if (existingRow) {
                return prev.map(row => row.raw_product_id === item.raw_product_id && row.product_assembly_id === item.product_assembly_id && row.batch_number === item.batch_number ? item : row);
            } else {
                return [...prev, item];
            }
        });
        setModalOpen(false);
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
        setModalOpen(false);
    }, []);

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

            // console.log(quotationItems)

            let quotationData: any = {
                product_assembly_id: formData.product_assembly_id,
                quotation_for: formData.quotation_for,
                receipt_delivery_due_days: formData.receipt_delivery_due_days,
                delivery_due_in_days: formData.delivery_due_in_days,
                delivery_due_date: formData.delivery_due_date,
                salesman_id: formData.salesman_id,
                skip_delivery_note: formData.skip_delivery_note,
                print_as_performa: formData.print_as_performa,
                customer_id: formData.customer_id,
                contact_person_id: formData.contact_person_id,
                quotation_items: quotationItems.map((item: any) => ({
                    product_assembly_id: item.product_assembly_id,
                    batch_number: item.batch_number,
                    raw_product_id: item.raw_product_id,
                    filling_id: item.filling_id,
                    production_id: item.production_id,
                    available_quantity: item.final_stock,
                    quantity: item.quantity,
                    retail_price: item.retail_price,
                    tax_category_id: item.tax_category_id,
                    tax_rate: item.tax_rate,
                    tax_amount: item.tax_amount,
                    discount_type: item.discount_type,
                    discount_amount_rate: item.discount_amount_rate,
                    total_cost: item.total_cost
                })),
                terms_conditions: formData.terms_conditions
            };
            if (formData.skip_delivery_note) {
                quotationData.delivery_note = {
                    delivery_due_in_days: formData.delivery_due_in_days,
                    delivery_due_date: formData.delivery_due_date,
                    customer_id: formData.customer_id,
                    contact_person_id: formData.contact_person_id,
                    salesman_id: formData.salesman_id,
                    terms_conditions: formData.terms_conditions,
                    items: quotationItems.map((item: any) => ({
                        product_assembly_id: item.product_assembly_id,
                        batch_number: item.batch_number,
                        filling_id: item.filling_id,
                        production_id: item.production_id,
                        raw_product_id: item.raw_product_id,
                        available_quantity: item.final_stock,
                        quantity: item.quantity,
                        capacity: item.capacity,
                        retail_price: item.retail_price,
                        tax_category_id: item.tax_category_id,
                        tax_rate: item.tax_rate,
                        tax_amount: item.tax_amount,
                        discount_type: item.discount_type,
                        discount_amount_rate: item.discount_amount_rate,
                        total_cost: item.total_cost
                    }))
                };
            }
            dispatch(storeQuotation(quotationData));
        }
    };

    const calculateTotal = (item: any) => {
        let totalCost = parseFloat(item.retail_price) * parseFloat(item.quantity);
        let taxAmount = item.tax_rate ? (totalCost * parseFloat(item.tax_rate)) / 100 : 0;
        let discountAmount = item.discount_type
            ? item.discount_type === 'percentage'
                ? (totalCost * parseFloat(item.discount_amount_rate)) / 100
                : parseFloat(item.discount_amount_rate)
            : 0;
        return totalCost + taxAmount - discountAmount;
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

    useEffect(() => {
        if (fillingProducts) {
            setFillingMaterials(fillingProducts);
        }
    }, [fillingProducts]);

    useEffect(() => {
        if (allProductAssemblies) {
            setProductAssemblyOptions(allProductAssemblies.map((assembly: any) => ({
                label: assembly.formula_name,
                value: assembly.id,
                assembly
            })));
        }
    }, [allProductAssemblies]);

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

                        <Option
                            divClasses="w-full"
                            label="Skip Delivery Note"
                            type="checkbox"
                            name="skip_delivery_note"
                            value={formData.skip_delivery_note}
                            defaultChecked={formData.skip_delivery_note === 1}
                            onChange={(e: any) => handleChange(e.target.name, e.target.checked ? 1 : 0, e.target.required)}
                        />

                        <Option
                            divClasses="w-full"
                            label="Print As Performa Invoice"
                            type="checkbox"
                            name="print_as_performa"
                            value={formData.print_as_performa}
                            defaultChecked={formData.print_as_performa === 1}
                            onChange={(e: any) => handleChange(e.target.name, e.target.checked ? 1 : 0, e.target.required)}
                        />

                        <Option
                            divClasses="w-full"
                            label="Consider Out of Stock as Well"
                            type="checkbox"
                            name="unprepared_stock"
                            value={formData.unprepared_stock}
                            defaultChecked={formData.unprepared_stock === 1}
                            onChange={(e: any) => handleChange(e.target.name, e.target.checked ? 1 : 0, e.target.required)}
                        />
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
                    <Button
                        type={ButtonType.button}
                        text={
                            <span className="flex items-center">
                                {getIcon(IconType.add)}
                                Add Finish Good
                            </span>
                        }
                        variant={ButtonVariant.primary}
                        onClick={() => setModalOpen(true)}
                        size={ButtonSize.small}
                    />
                </div>
                <table>
                    <thead>
                    <tr>
                        <th>Product</th>
                        <th>Batch #</th>
                        <th>Filling Material</th>
                        <th>Capacity</th>
                        <th>Available</th>
                        <th>Quantity</th>
                        <th>Retail Price</th>
                        <th>Before Tax</th>
                        <th>Tax</th>
                        <th>Discount</th>
                        <th>Total</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {quotationItems.length > 0
                        ? quotationItems.map((item: any, index: number) => {
                            let product = fillingMaterials.find((material: any) => material.id === item.raw_product_id);
                            let taxCategory = taxCategories?.find((tax: any) => tax.id === item.tax_category_id);
                            return (
                                <tr key={index}>
                                    <td>
                                        {productAssemblyOptions.find((assembly: any) => assembly.value === item.product_assembly_id)?.label}
                                    </td>
                                    <td>{item.batch_number}</td>
                                    <td>{product.title}</td>
                                    <td>{item.capacity.toFixed(2)}</td>
                                    <td>{item.final_stock.toFixed(2)}</td>
                                    <td>{item.quantity.toFixed(2)}</td>
                                    <td>{item.retail_price.toFixed(2)}</td>
                                    <td>
                                        {(item.retail_price * item.quantity).toFixed(2)}
                                    </td>
                                    <td>
                                        {taxCategory
                                            ? (
                                                <div className="flex flex-col">
                                                    <span><strong>Tax: </strong>{taxCategory.name} ({item.tax_rate}%)</span>
                                                    <span><strong>Amount: </strong>{item.tax_amount.toFixed(2)}</span>
                                                </div>
                                            ) : (
                                                <span>N/A</span>
                                            )}
                                    </td>
                                    <td>
                                        {item.discount_type
                                            ? (
                                                <div className="flex flex-col">
                                                    <span><strong>Type: </strong>{capitalize(item.discount_type)}</span>
                                                    <span><strong>Rate: </strong>
                                                        {item.discount_amount_rate.toFixed(2)}{item.discount_type === 'percentage' ? '%' : ''}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span>N/A</span>
                                            )}
                                    </td>
                                    <td>{calculateTotal(item).toFixed(2)}</td>
                                    <td>
                                        <IconButton
                                            icon={IconType.delete}
                                            color={ButtonVariant.danger}
                                            onClick={() => {
                                                let updatedItems = quotationItems.filter((qItem: any) => qItem.raw_product_id !== item.raw_product_id);
                                                setQuotationItems(updatedItems);
                                            }}
                                        />
                                    </td>
                                </tr>
                            );
                        })
                        : (
                            <tr>
                                <td colSpan={12} className="text-center">No Quotation Items Added</td>
                            </tr>
                        )}
                    </tbody>
                    <tfoot>
                    <tr>
                        <td colSpan={10} className="text-center">Total</td>
                        {/*<td className="pl-4">{quotationItems.reduce((acc, item) => acc + item.quantity, 0).toFixed(2)}</td>*/}
                        {/*<td className="pl-4">{quotationItems.reduce((acc, item) => acc + item.retail_price, 0).toFixed(2)}</td>*/}
                        <td className="pl-4">{quotationItems.reduce((acc, item) => acc + item.total_cost, 0).toFixed(2)}</td>
                        <td></td>
                    </tr>
                    </tfoot>
                </table>
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

            <FinishedGoodModal
                considerOutOfStock={formData.unprepared_stock}
                modalFor="quotation"
                modalOpen={modalOpen}
                setModalOpen={setModalOpen}
                handleSubmit={(item) => handleQuotationItemSubmit(item)}
            />
        </form>
    );
};

export default QuotationForm;
