import React, { Fragment, useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { setAuthToken, setContentType } from '@/configs/api.config';
import Alert from '@/components/Alert';
import { Dropdown } from '@/components/form/Dropdown';
import { Input } from '@/components/form/Input';
import Button from '@/components/Button';
import { ButtonSize, ButtonType, ButtonVariant, FORM_CODE_TYPE, IconType } from '@/utils/enums';
import Textarea from '@/components/form/Textarea';
import { getCustomers } from '@/store/slices/customerSlice';
import { generateCode } from '@/store/slices/utilSlice';
import { calculateDateFromDays, getIcon } from '@/utils/helper';
import IconButton from '@/components/IconButton';
import { getEmployees } from '@/store/slices/employeeSlice';
import { Tab } from '@headlessui/react';
import { clearQuotationState, getPendingQuotations } from '@/store/slices/quotationSlice';
import AgGridComponent from '@/components/apps/AgGridComponent';
import { AgGridReact } from 'ag-grid-react';
import Swal from 'sweetalert2';
import { storeDeliveryNote } from '@/store/slices/deliveryNoteSlice';

const DeliveryNoteForm = () => {
    const dispatch = useAppDispatch();
    const gridRef = useRef<AgGridReact<any>>(null);
    const { token } = useAppSelector((state) => state.user);
    const { pendingQuotations } = useAppSelector((state) => state.quotation);
    const { customers } = useAppSelector((state) => state.customer);
    const { code } = useAppSelector((state) => state.util);
    const { employees } = useAppSelector((state) => state.employee);

    const [colDefs, setColDefs] = useState<any>([]);
    const [showPreview, setShowPreview] = useState<boolean>(false);
    const [previewData, setPreviewData] = useState<any>({});
    const [previewItems, setPreviewItems] = useState<any[]>([]);
    const [formData, setFormData] = useState<any>({});
    const [customerOptions, setCustomerOptions] = useState<any[]>([]);
    const [contactPersonOptions, setContactPersonOptions] = useState<any[]>([]);
    const [salesmanOptions, setSalesmanOptions] = useState<any[]>([]);
    const [batchNumberOptions, setBatchNumberOptions] = useState<any[]>([]);
    const [deliveryNoteItems, setDeliveryNoteItems] = useState<any[]>([]);
    const [quotationOptions, setQuotationOptions] = useState<any[]>([]);
    const [quotationForOptions] = useState<any[]>([
        { label: 'Finished Goods', value: 1 },
        { label: 'Materials', value: 2 }
    ]);
    const [validations, setValidations] = useState<any>({});
    const [formError, setFormError] = useState<any>('');

    const handleRemoveRow = (row: any) => {
        const updatedItems = deliveryNoteItems.filter((item) => row.quoataion_id === item.quoataion_id && row.raw_product_id === item.raw_product_id);
        setDeliveryNoteItems(updatedItems);
    };

    useEffect(() => {
        setDeliveryNoteItems([]);
        let defaultColDef = [
            {
                headerName: 'Quantity',
                field: 'quantity',
                cellRenderer: (params: any) => params.node?.rowPinned ? params.value : params.value,
                minWidth: 150,
                filter: false,
                floatingFilter: false
            },
            {
                headerName: 'Delivered',
                field: 'delivered_quantity',
                editable: (params: any) => {
                    return params.data.stock_quantity >= params.data.quantity || !params.node.rowPinned;
                },
                valueSetter: (params: any) => {
                    const value = Number(params.newValue);

                    if (isNaN(value)) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Invalid input',
                            text: `Please enter a valid number`,
                        });
                        return false;
                    }

                    if (value > params.data.quantity) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: `Delivered quantity cannot be more than ${params.data.quantity}`
                        });
                        return false;
                    }

                    if (value > params.data.stock_quantity) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: `Delivered quantity cannot be more than available in stock ${params.data.stock_quantity}`
                        });
                        return false;
                    }

                    // Update the preview items
                    setPreviewItems(deliveryNoteItems.map((item) => {
                        if (item.id === params.data.id) {
                            return {
                                ...item,
                                delivered_quantity: value
                            };
                        }
                        return item;
                    }));

                    params.data.delivered_quantity = value; // Update the cell value
                    return true;
                },
                cellRenderer: (params: any) => params.node?.rowPinned ? params.value : params.value,
                onCellValueChanged: (params: any) => {
                    // This event will trigger when the cell's value has changed.
                    setPreviewItems(deliveryNoteItems.map((item) => {
                        if (item.id === params.data.id) {
                            return {
                                ...item,
                                delivered_quantity: params.data.delivered_quantity
                            };
                        }
                        return item;
                    }));
                },
                minWidth: 150,
                filter: false,
                floatingFilter: false
            },
            {
                headerName: '',
                field: 'remove',
                cellRenderer: (params: any) => {
                    return (
                        // <></>
                        !params.node?.rowPinned &&
                        <IconButton
                            color={ButtonVariant.danger}
                            icon={IconType.delete}
                            onClick={() => handleRemoveRow(params.data)}
                        />
                    );
                },
                editable: false,
                filter: false,
                floatingFilter: false,
                sortable: false
            }
        ];

        if (formData.delivery_note_for === 1) {
            const finishGoodsColDefs = [
                {
                    headerName: 'Q.Code',
                    field: 'quotation_code',
                    cellRenderer: (params: any) => params.node?.rowPinned ? params.value : params.value,
                    minWidth: 150,
                    filter: false,
                    floatingFilter: false
                },
                {
                    headerName: 'Product',
                    field: 'product_assembly_id',
                    valueGetter: (params: any) => params.data.product_assembly?.formula_name,
                    cellRenderer: (params: any) => params.node?.rowPinned ? params.value : params.value,
                    minWidth: 150,
                    filter: false,
                    floatingFilter: false
                },
                {
                    headerName: 'Filling',
                    field: 'raw_product_id',
                    valueGetter: (params: any) => params.data.product?.title,
                    cellRenderer: (params: any) => params.node?.rowPinned ? params.value : params.value,
                    minWidth: 150,
                    filter: false,
                    floatingFilter: false
                },
                {
                    headerName: 'Capacity',
                    field: 'capacity',
                    cellRenderer: (params: any) => params.node?.rowPinned ? '' : params.value,
                    minWidth: 150,
                    filter: false,
                    floatingFilter: false
                },
                {
                    headerName: 'Batch #',
                    field: 'batch_number',
                    editable: (params: any) => !params.node.rowPinned, // Disable editing in pinned row
                    cellEditor: 'agSelectCellEditor',
                    cellEditorParams: (params: any) => {
                        // Safely handle the case where params.data or stock might be null or undefined
                        const batchNumbers = (params.data && params.data.stock && Array.isArray(params.data.stock))
                            ? params.data.stock.map((batch: any) => batch.batch_number)
                            : [];
                        return {
                            values: batchNumbers
                        };
                    },
                    valueSetter: (params: any) => {
                        if (!params.data || !params.data.stock) return false;
                        const selectedBatch = params.data.stock.find((batch: any) => batch.batch_number === params.newValue);

                        if (selectedBatch) {
                            if (selectedBatch.quantity < params.data.quantity) {
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Stock Not Available',
                                    text: `The selected batch does not have enough stock. Available: ${selectedBatch.quantity}, Required: ${params.data.quantity}`
                                });
                                // Reset the batch number and available quantity
                                params.data.batch_number = null;
                                params.data.available_quantity = 0;
                                return false;
                            } else {
                                params.data.batch_number = selectedBatch.batch_number;
                                params.data.available_quantity = selectedBatch.quantity; // Update available_quantity
                                return true;
                            }
                        }
                        return false;
                    },
                    valueFormatter: (params: any) => {
                        if (params.node?.rowPinned) return '';  // No formatting for pinned row
                        if (!params.data) return ''; // Handle case where params.data is null
                        const selectedOption = params.data.stock?.find((batch: any) => batch.batch_number === params.value);
                        return selectedOption ? selectedOption.batch_number : '';
                    },
                    cellRenderer: (params: any) => {
                        if (params.node?.rowPinned) return '';  // Show empty text for pinned row
                        if (!params.data) return ''; // Handle case where params.data is null
                        const selectedOption = params.data.stock?.find((batch: any) => batch.batch_number === params.value);
                        return selectedOption ? selectedOption.batch_number : '';
                    },
                    minWidth: 150,
                    filter: false,
                    floatingFilter: false
                },
                {
                    headerName: 'A.Qty',
                    field: 'available_quantity',
                    cellRenderer: (params: any) => params.node?.rowPinned ? '' : params.value,
                    minWidth: 150,
                    filter: false,
                    floatingFilter: false
                }
            ];

            setColDefs([...finishGoodsColDefs, ...defaultColDef]);
        } else if (formData.delivery_note_for === 2) {
            const rawProductColDefs = [
                {
                    headerName: 'Q.Code',
                    field: 'quotation_code',
                    cellRenderer: (params: any) => params.node?.rowPinned ? params.value : params.value,
                    minWidth: 150,
                    filter: false,
                    floatingFilter: false
                },
                {
                    headerName: 'Product',
                    field: 'raw_product_id',
                    valueGetter: (params: any) => params.data.product?.title,
                    cellRenderer: (params: any) => params.node?.rowPinned ? params.value : params.value,
                    minWidth: 150,
                    filter: false,
                    floatingFilter: false
                },
                {
                    headerName: 'Stock',
                    field: 'stock_quantity',
                    valueGetter: (params: any) => params.data.product.stock_quantity,
                    cellRenderer: (params: any) => params.node?.rowPinned ? params.value : params.value,
                    minWidth: 150,
                    filter: false,
                    floatingFilter: false
                }
            ];

            setColDefs([...rawProductColDefs, ...defaultColDef]);
        } else {
            setColDefs([]);
        }
    }, [formData.delivery_note_for]);

    const handleChange = (name: string, value: any, required: boolean = false) => {
        if (required && value === '') {
            handleValidation(name, 'add');
            return;
        }

        if (name === 'delivery_due_in_days') {
            const date = new Date();
            date.setDate(date.getDate() + parseInt(value));
            setFormData((prev: any) => ({
                ...prev,
                delivery_due_in_days: value,
                delivery_due_date: date.toDateString()
            }));
            handleValidation(name, 'remove');
            return;
        }

        handleValidation(name, 'remove');
        setFormData({ ...formData, [name]: value });

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

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const invalidRows = deliveryNoteItems.filter(item => item.quantity > item.stock_quantity);
        if (invalidRows.length > 0) {
            setFormError('Some items have a quantity greater than the stock quantity. Please correct them before submitting.');
            return;
        }

        // console.log(deliveryNoteItems);

        // Proceed with form submission if there are no invalid rows

        if (deliveryNoteItems.length === 0) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please select a quotation to proceed'
            });
        } else {
            console.log({
                ...formData,
                delivery_note_items: deliveryNoteItems
            });
            // dispatch(storeDeliveryNote({
            //     ...formData,
            //     delivery_note_items: deliveryNoteItems
            // }));
        }
    };

    useEffect(() => {
        setAuthToken(token);
        setContentType('application/json');
        dispatch(getCustomers());
        dispatch(getEmployees());
        dispatch(generateCode(FORM_CODE_TYPE.DELIVERY_NOTE));
        dispatch(clearQuotationState());
        setShowPreview(false);
        setPreviewData({});
        setPreviewItems([]);
    }, []);

    useEffect(() => {
        if (validations && Object.keys(validations).length > 0) {
            setFormError('Please fill all required fields');
        } else {
            setFormError('');
        }
    }, [validations]);

    useEffect(() => {
        if (customers) {
            const customerOptions = customers.map((customer: any) => ({
                value: customer.id,
                label: customer.name,
                customer
            }));
            setCustomerOptions(customerOptions);
        }
    }, [customers]);

    useEffect(() => {
        if (employees) {
            setSalesmanOptions(employees.map((employee: any) => ({
                label: employee.name + ' - ' + employee.employee?.employee_code,
                value: employee.id
            })));
        }
    }, [employees]);

    useEffect(() => {
        if (code) {
            setFormData((prev: any) => ({
                ...prev,
                deliver_note_code: code[FORM_CODE_TYPE.DELIVERY_NOTE]
            }));

            setPreviewData({
                ...previewData,
                code: code[FORM_CODE_TYPE.DELIVERY_NOTE]
            });
        }
    }, [code]);

    useEffect(() => {
        if (formData.delivery_note_for && formData.customer_id && formData.contact_person_id) {
            dispatch(clearQuotationState());
            dispatch(getPendingQuotations({
                customer_id: formData.customer_id,
                contact_person_id: formData.contact_person_id,
                quotation_for: formData.delivery_note_for
            }));
        }
    }, [formData.delivery_note_for, formData.customer_id, formData.contact_person_id]);

    useEffect(() => {
        if (pendingQuotations) {
            const quotationOptions = pendingQuotations.map((quotation: any) => ({
                label: quotation.quotation_code,
                value: quotation.id,
                quotation
            }));
            setQuotationOptions(quotationOptions);
        }
    }, [pendingQuotations]);

    useEffect(() => {
        // console.log(deliveryNoteItems);
    }, [deliveryNoteItems]);

    return (
        <form onSubmit={(e) => handleSubmit(e)}>
            {validations && Object.keys(validations).length > 0 && (
                <Alert message={formError} setMessages={setFormError} alertType="error" />
            )}
            {/* Delivery Note Form */}
            <div className="flex w-full flex-row items-start justify-between gap-3 mt-3">
                <div className="flex w-full flex-col items-start justify-start space-y-3">
                    <Input
                        divClasses="w-full"
                        label="Delivery Note Code"
                        type="text"
                        name="deliver_note_code"
                        value={formData.deliver_note_code}
                        onChange={(e) => {
                            handleChange(e.target.name, e.target.value, e.target.required);
                            setPreviewData({
                                ...previewData,
                                code: e.target.value
                            });
                        }}
                        placeholder="Enter Delivery Note Code"
                        isMasked={false}
                        disabled={true}
                    />

                    <Dropdown
                        divClasses="w-full"
                        label="Deliver Note For"
                        name="delivery_note_for"
                        options={quotationForOptions}
                        value={formData.delivery_note_for}
                        onChange={(e: any) => {
                            handleChange('delivery_note_for', e?.value, true);
                            setPreviewData({
                                ...previewData,
                                delivery_note_for: e?.label
                            });
                        }}
                        required={true}
                        errorMessage={validations.delivery_note_for}
                    />

                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 w-full">
                        <Dropdown
                            divClasses="w-full"
                            label="Cutomer"
                            name="customer_id"
                            options={customerOptions}
                            value={formData.customer_id}
                            onChange={(e: any) => {
                                if (e && typeof e !== 'undefined') {
                                    const customerOption = customerOptions.find((customer: any) => customer.value === e?.value);
                                    setFormData({
                                        ...formData,
                                        delivery_due_date: calculateDateFromDays(customerOption.customer?.due_in_days),
                                        delivery_due_in_days: customerOption.customer?.due_in_days,
                                        customer_id: e?.value
                                    });

                                    setPreviewData({
                                        ...previewData,
                                        delivery_due_date: calculateDateFromDays(customerOption.customer?.due_in_days),
                                        delivery_due_in_days: customerOption.customer?.due_in_days,
                                        customer: e?.label
                                    });

                                    setContactPersonOptions(customerOption.customer?.contact_persons.map((contactPerson: any) => ({
                                        label: contactPerson.name,
                                        value: contactPerson.id,
                                        contactPerson
                                    })));
                                } else {
                                    setFormData({
                                        ...formData,
                                        delivery_due_date: '',
                                        delivery_due_in_days: '',
                                        customer_id: ''
                                    });

                                    setPreviewData({
                                        ...previewData,
                                        delivery_due_date: '',
                                        delivery_due_in_days: '',
                                        customer: ''
                                    });

                                    setContactPersonOptions([]);
                                }
                            }}
                            required={true}
                            errorMessage={validations.customer_id}
                        />

                        <Dropdown
                            divClasses="w-full"
                            label="Contact Person"
                            name="contact_person_id"
                            options={contactPersonOptions}
                            value={formData.contact_person_id}
                            onChange={(e: any) => {
                                handleChange('contact_person_id', e?.value, true);
                                setPreviewData({
                                    ...previewData,
                                    contact_person: e?.label
                                });
                            }}
                            required={true}
                            errorMessage={validations.contact_person_id}
                        />
                    </div>

                    <Dropdown
                        divClasses="w-full"
                        label="Quotation"
                        name="quotation_ids"
                        options={quotationOptions}
                        value={formData.quotation_ids}
                        onChange={(e: any) => {
                            if (e && typeof e !== 'undefined') {
                                let selectedQuotations = e.map((quotation: any) => quotation?.quotation);
                                let quotationItems = selectedQuotations.map((item: any, index: number) => {
                                    return item.quotation_items.map((qItem: any) => {
                                        return {
                                            ...qItem,
                                            id: `${item.id}-${index}`, // Assigning a unique ID
                                            quotation_code: selectedQuotations.find((q: any) => q.id === item.id)?.quotation_code,
                                            delivered_quantity: 0 // Initially set to zero
                                        };

                                    }).flat();
                                }).flat();

                                setDeliveryNoteItems(quotationItems);
                                setPreviewItems(quotationItems);

                                let ids = e.map((quotation: any) => quotation.value);
                                if (ids.includes(0)) {
                                    ids = [0];
                                    setFormData((prev: any) => ({
                                        ...prev,
                                        quotation_ids: ids.join(',')
                                    }));
                                } else {
                                    ids = ids.filter((id: any) => id !== 0);
                                    setFormData((prev: any) => ({
                                        ...prev,
                                        quotation_ids: ids.join(',')
                                    }));
                                }
                            } else {
                                setDeliveryNoteItems([]);
                                setPreviewItems([]);
                                setFormData((prev: any) => ({
                                    ...prev,
                                    quotation_ids: ''
                                }));
                            }
                        }}
                        isMulti={true}
                        required={true}
                        errorMessage={validations.quotation_id}
                    />

                    {formData.quotation_ids === '0' && (
                        <Dropdown
                            divClasses="w-full"
                            label="Salesman"
                            name="salesman_id"
                            options={salesmanOptions}
                            value={formData.salesman_id}
                            onChange={(e: any) => {
                                handleChange('salesman_id', e, true);
                                setPreviewData({
                                    ...previewData,
                                    salesman: e?.label
                                });
                            }}
                            required={true}
                            errorMessage={validations.salesman_id}
                        />
                    )}

                </div>
                <div className="w-full border rounded p-5 hidden md:block">
                    <h5 className="text-lg font-semibold dark:text-white-light mb-3">Delivery Note Instructions</h5>
                    <ul className="list-decimal list-inside space-y-2">
                        <li>Delivery Note Code will be auto generated</li>
                        <li>Delivery Due Date will be auto calculated based on Delivery Due Days</li>
                        <li>Delivery Due Days is required field</li>
                        <li>Select contact person from customer as delivery by</li>
                        <li>Terms & Conditions are optional</li>
                        <li>Double check the item details</li>
                    </ul>
                </div>
            </div>

            <Tab.Group>
                <Tab.List className="mt-3 flex flex-wrap border-b border-white-light dark:border-[#191e3a]">
                    <Tab as={Fragment}>
                        {({ selected }) => (
                            <button
                                className={`${
                                    selected ? '!border-white-light !border-b-white  text-primary !outline-none dark:!border-[#191e3a] dark:!border-b-black ' : ''
                                } -mb-[1px] block border border-transparent p-3.5 py-2 hover:text-primary dark:hover:border-b-black`}
                            >
                                Details
                            </button>
                        )}
                    </Tab>
                </Tab.List>
                <Tab.Panels className="rounded-none py-3">
                    <Tab.Panel>
                        <div
                            className="flex mb-3 justify-start items-start md:justify-between md:items-center gap-3 flex-col md:flex-row">
                            <h3 className="text-lg font-semibold">Quotation Items</h3>
                        </div>
                        <AgGridComponent
                            gridRef={gridRef}
                            data={deliveryNoteItems}
                            colDefs={colDefs}
                            pagination={false}
                            height={400}
                            rowClassRules={{
                                'bg-red-100': (params: any) => params.data.quantity > params.data.stock_quantity
                            }}
                        />
                    </Tab.Panel>
                </Tab.Panels>
            </Tab.Group>
            <Textarea
                divClasses="w-full mt-5"
                label="Terms & Conditions"
                name="terms_conditions"
                value={formData.terms_conditions}
                onChange={(e) => {
                    handleChange('terms_conditions', e, false);
                    setPreviewData({
                        ...previewData,
                        terms_conditions: e
                    });
                }}
                isReactQuill={true}
            />


            <div className="w-full flex justify-center items-center flex-col md:flex-row gap-3 mt-5">
                <Button
                    type={ButtonType.button}
                    text={showPreview ? 'Close Preview' : 'Show Preview'}
                    variant={ButtonVariant.success}
                    disabled={false}
                    onClick={() => {
                        setShowPreview(!showPreview);
                    }}
                    // link="/apps/sales/orders/quotations/preview"
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

export default DeliveryNoteForm;
