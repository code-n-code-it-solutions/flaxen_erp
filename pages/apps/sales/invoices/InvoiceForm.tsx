import React, { Fragment, useEffect, useRef, useState } from 'react';
import { Input } from '@/components/form/Input';
import { useAppDispatch, useAppSelector } from '@/store';
import { generateCode } from '@/store/slices/utilSlice';
import { setAuthToken, setContentType } from '@/configs/api.config';
import { Dropdown } from '@/components/form/Dropdown';
import { clearDeliveryNoteState, getDeliveryNoteItems, pendingDeliveryNotes } from '@/store/slices/deliveryNoteSlice';
import Button from '@/components/Button';
import { ButtonType, ButtonVariant } from '@/utils/enums';
import { storeSaleInvoice } from '@/store/slices/saleInvoiceSlice';
import { calculateDateFromDays } from '@/utils/helper';
import { Tab } from '@headlessui/react';
import { getAccountsTypes } from '@/store/slices/accountSlice';
import Option from '@/components/form/Option';
import { getCustomers } from '@/store/slices/customerSlice';
import AgGridComponent from '@/components/apps/AgGridComponent';
import { AgGridReact } from 'ag-grid-react';

const InvoiceForm = () => {
    const dispatch = useAppDispatch();
    const gridRef = useRef<AgGridReact<any>>(null);
    const { token } = useAppSelector((state) => state.user);
    const { code, latestRecord } = useAppSelector((state) => state.util);
    const { deliveryNotes, deliveryNoteItems } = useAppSelector((state) => state.deliveryNote);
    const { customers } = useAppSelector((state) => state.customer);

    const [formData, setFormData] = useState<any>({});
    const [errors, setErrors] = useState<any>({});
    const [customerOptions, setCustomerOptions] = useState<any[]>([]);
    const [contactPersonOptions, setContactPersonOptions] = useState<any[]>([]);
    const [deliveryNoteOptions, setDeliveryNoteOptions] = useState<any[]>([]);
    const [receivableAmount, setReceivableAmount] = useState<number>(0);
    const [grandTotalSum, setGrandTotalSum] = useState<number>(0);
    const [totalBeforeDiscount, setTotalBeforeDiscount] = useState<number>(0);
    const [colDefs, setColDefs] = useState<any>([]);
    const [invoiceForOptions] = useState<any[]>([
        { label: 'Finished Goods', value: 1 },
        { label: 'Materials', value: 2 }
    ]);

    const handleChange = (name: string, value: any, required: boolean) => {
        if (required && value === '') {
            setErrors({
                ...errors,
                [name]: 'This field is required'
            });
        } else {
            setErrors((err: any) => {
                delete err[name];
                return err;
            });
        }

        if (name === 'payment_terms') {
            setFormData({ ...formData, due_date: calculateDateFromDays(parseInt(value)) });
            return;
        }

        if (name === 'discount_amount') {
            setFormData({ ...formData, [name]: parseFloat(value) });
            recalculateReceivableAmount(deliveryNoteItems, parseFloat(value));
        } else {
            setFormData({ ...formData, [name]: value });
        }

        if (name === 'invoice_type' || name === 'discount_amount') {
            recalculateReceivableAmount(deliveryNoteItems, parseFloat(formData.discount_amount || 0));
        }

        setFormData({ ...formData, [name]: value });

        if (name === 'paid_amount') {
            const parsedValue = parseFloat(value);
            if (!isNaN(parsedValue) && parsedValue <= grandTotalSum) {
                setFormData({ ...formData, [name]: parsedValue });
            }
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setAuthToken(token);
        dispatch(storeSaleInvoice(formData));
    };

    useEffect(() => {
        setAuthToken(token);
        setContentType('application/json');
        dispatch(generateCode('sale_invoice'));
        setFormData({ ...formData, discount_amount: 0 });
        dispatch(getAccountsTypes({}));
        dispatch(getCustomers());
    }, []);

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
            setFormData({ ...formData, sale_invoice_code: code['sale_invoice'] });
        }
    }, [code]);

    useEffect(() => {
        if (deliveryNotes) {
            setDeliveryNoteOptions(deliveryNotes.map((item: any) => ({
                value: item.id,
                label: item.delivery_note_code,
                delivery_note: item
            })));
        }
    }, [deliveryNotes]);

    useEffect(() => {
        if (deliveryNoteItems.length > 0) {
            recalculateReceivableAmount(deliveryNoteItems, parseFloat(formData.discount_amount || 0));
            const totalGrandSum = deliveryNoteItems.reduce((acc, item) => acc + parseFloat(item.grand_total), 0);
            setGrandTotalSum(totalGrandSum);
            setTotalBeforeDiscount(totalGrandSum);
            setFormData({ ...formData, paid_amount: totalGrandSum - parseFloat(formData.discount_amount || 0) });
        }
    }, [deliveryNoteItems, formData.discount_amount]);

    const recalculateReceivableAmount = (items: any[], discount: number) => {
        const totalCost = items.reduce((acc: number, item: any) => acc + parseFloat(item.grand_total), 0);
        setReceivableAmount(totalCost - discount);
        setFormData({ ...formData, paid_amount: totalCost - discount });
    };

    useEffect(() => {
        if (latestRecord) {
            setFormData((prevFormData: any) => ({
                ...prevFormData,
                receiving_account_id: latestRecord.receiving_account?.code
            }));
        }
    }, [latestRecord]);

    useEffect(() => {
        dispatch(clearDeliveryNoteState());
        let defaultColDef = [
            {
                headerName: 'Q.Qty',
                field: 'quantity',
                cellRenderer: (params: any) => params.node?.rowPinned ? params.value : params.value,
                minWidth: 150,
                filter: false,
                floatingFilter: false
            },
            {
                headerName: 'D.Qty',
                field: 'delivered_quantity',
                cellRenderer: (params: any) => params.node?.rowPinned ? params.value : params.value,
                minWidth: 150,
                filter: false,
                floatingFilter: false
            },
            {
                headerName: 'S.Price',
                field: 'sale_price',
                cellRenderer: (params: any) => params.node?.rowPinned ? params.value : params.value,
                minWidth: 150,
                filter: false,
                floatingFilter: false
            },
            {
                headerName: 'S.Total',
                field: 'sub_total',
                valueGetter: (params: any) => {
                    return (params.data.delivered_quantity || 0) * params.data.sale_price;
                },
                cellRenderer: (params: any) => params.node?.rowPinned ? params.value : params.value,
                minWidth: 150,
                filter: false,
                floatingFilter: false
            },
            {
                headerName: 'VAT@5%',
                field: 'tax_amount',
                valueGetter: (params: any) => {
                    return params.data.sale_price * (params.data.delivered_quantity || 0) * 0.05;
                },
                cellRenderer: (params: any) => params.node?.rowPinned ? params.value : params.value,
                minWidth: 150,
                filter: false,
                floatingFilter: false
            },
            {
                headerName: 'Total',
                field: 'grand_total',
                valueGetter: (params: any) => {
                    const subTotal = params.data.sale_price * (params.data.delivered_quantity || 0);
                    const tax = subTotal * 0.05;
                    return subTotal + tax;
                },
                cellRenderer: (params: any) => params.node?.rowPinned ? params.value : params.value,
                minWidth: 150,
                filter: false,
                floatingFilter: false
            },
        ];

        if (formData.invoice_for === 1) {
            const finishGoodsColDefs = [
                {
                    headerName: 'Q.Code',
                    field: 'quotation.quotation_code',
                    cellRenderer: (params: any) => params.node?.rowPinned ? params.value : params.value,
                    minWidth: 150,
                    filter: false,
                    floatingFilter: false
                },
                {
                    headerName: 'D.Note Code',
                    field: 'delivery_note.delivery_note_code',
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
        } else if (formData.invoice_for === 2) {
            const rawProductColDefs = [
                {
                    headerName: 'Q.Code',
                    field: 'quotation.quotation_code',
                    cellRenderer: (params: any) => params.node?.rowPinned ? params.value : params.value,
                    minWidth: 150,
                    filter: false,
                    floatingFilter: false
                },
                {
                    headerName: 'D.Note Code',
                    field: 'delivery_note.delivery_note_code',
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
    }, [formData.invoice_for]);

    useEffect(() => {
        if(formData.invoice_for && formData.customer_id && formData.contact_person_id) {
            dispatch(pendingDeliveryNotes({
                invoice_for: formData.invoice_for,
                customer_id: formData.customer_id,
                contact_person_id: formData.contact_person_id
            }));
        }
    }, [formData.invoice_for, formData.customer_id, formData.contact_person_id]);

    return (
        <form onSubmit={(e) => handleSubmit(e)}>
            <Input
                divClasses="w-full md:w-1/2"
                className="text-xl font-light py-3"
                label="Invoice Number"
                type="text"
                name="sale_invoice_code"
                value={formData.sale_invoice_code}
                onChange={(e) => handleChange(e.target.name, e.target.value, e.target.required)}
                isMasked={false}
                disabled={true}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="w-full flex flex-col gap-3">
                    <h4 className="text-xl font-semibold text-gray-600 py-3">Invoice Details</h4>
                    <Dropdown
                        divClasses="w-full"
                        label="Invoice For"
                        name="invoice_for"
                        options={invoiceForOptions}
                        value={formData.invoice_for}
                        onChange={(e: any) => {
                            setFormData({
                                ...formData,
                                invoice_for: e?.value
                            });
                        }}
                    />
                    <Dropdown
                        divClasses="w-full"
                        label="Customer"
                        name="customer_id"
                        options={customerOptions}
                        value={formData.customer_id}
                        onChange={(e) => {
                            setFormData({
                                ...formData,
                                customer_id: e?.value
                            });
                            if (e && typeof e !== 'undefined') {
                                const customerOption = customerOptions.find(customer => customer.value === e.value);
                                setContactPersonOptions(customerOption.customer?.contact_persons.map((contactPerson: any) => ({
                                    label: contactPerson.name,
                                    value: contactPerson.id,
                                    contactPerson
                                })));
                            } else {
                                setContactPersonOptions([]);
                            }
                        }}
                        isMulti={false}
                    />
                    <Dropdown
                        divClasses="w-full"
                        label="Contact Person"
                        name="contact_person_id"
                        options={contactPersonOptions}
                        value={formData.contact_person_id}
                        onChange={(e) => {
                            if (e && typeof e !== 'undefined') {
                                setFormData({
                                    ...formData,
                                    contact_person_id: e.value
                                });
                            } else {
                                setFormData({
                                    ...formData,
                                    contact_person_id: ''
                                });
                            }
                        }}
                        isMulti={false}
                    />
                    <div className="flex gap-3 items-center">
                        <h3 className="text-md">Receivable Amount: </h3>
                        <h3 className="text-lg font-bold">{receivableAmount.toFixed(2)}</h3>
                    </div>
                </div>
                <div className="w-full flex flex-col gap-3">
                    <h4 className="text-xl font-semibold text-gray-600 py-3">Invoice Params</h4>

                    <Input
                        divClasses="w-full"
                        label="PO # (optional)"
                        type="text"
                        name="po_number"
                        value={formData.payment_refernce}
                        onChange={(e) => handleChange(e.target.name, e.target.value, e.target.required)}
                        placeholder="Enter Purchase Order number"
                        isMasked={false}
                    />

                    <Input
                        divClasses="w-full"
                        label="Internal Document # (optional)"
                        type="text"
                        name="internal_document_no"
                        value={formData.internal_document_no}
                        onChange={(e) => handleChange(e.target.name, e.target.value, e.target.required)}
                        placeholder="Enter Internal Document"
                        isMasked={false}
                    />

                    <Dropdown
                        divClasses="w-full"
                        label="Delivery Note"
                        name="delivery_note_ids"
                        options={deliveryNoteOptions}
                        value={formData.delivery_note_ids}
                        onChange={(e) => {
                            if (e && typeof e !== 'undefined' && e.length > 0) {
                                setFormData({
                                    ...formData,
                                    delivery_note_ids: e.map((item: any) => item.value).join(','),
                                    due_date: calculateDateFromDays(e[0].delivery_note.customer.due_in_days),
                                    payment_terms: e[0].delivery_note.customer.due_in_days
                                });
                                dispatch(getDeliveryNoteItems(e.map((item: any) => item.value)));
                                // setDeliveryNoteItems(e.map((item: any) => item.delivery_note.delivery_note_items).flat());
                            } else {
                                setFormData({
                                    ...formData,
                                    delivery_note_ids: '',
                                    payment_terms: '',
                                    due_date: ''
                                });
                                dispatch(clearDeliveryNoteState());
                                setReceivableAmount(0);
                                setGrandTotalSum(0);
                                setTotalBeforeDiscount(0);
                            }
                        }}
                        isMulti={true}
                    />

                    <Option
                        label="Is credit invoice"
                        type="checkbox"
                        name="is_credit_invoice"
                        value="1"
                        defaultChecked={formData.is_credit_invoice === 1}
                        onChange={(e) => handleChange('is_credit_invoice', e.target.checked ? 1 : 0, false)}
                    />

                    {formData.is_credit_invoice === 1 && (
                        <div className="flex flex-col gap-3 justify-start items-start">
                            <span><strong>Payment Terms (Days):</strong> {formData.payment_terms}</span>
                            <span><strong>Due Date:</strong> {formData.due_date}</span>
                        </div>
                    )}
                </div>
            </div>

            <Tab.Group>
                <Tab.List className="mt-3 flex flex-wrap border-b border-white-light dark:border-[#191e3a]">
                    <Tab as={Fragment}>
                        {({ selected }) => (
                            <button
                                className={`${
                                    selected ? '!border-white-light !border-b-white text-primary !outline-none dark:!border-[#191e3a] dark:!border-b-black ' : ''
                                } -mb-[1px] block border border-transparent p-3.5 py-2 hover:text-primary dark:hover:border-b-black`}
                            >
                                Details
                            </button>
                        )}
                    </Tab>
                </Tab.List>
                <Tab.Panels className="rounded-none py-3">
                    <Tab.Panel>
                        <div className="active">
                            <AgGridComponent
                                gridRef={gridRef}
                                data={deliveryNoteItems}
                                colDefs={colDefs}
                                pagination={false}
                                // pinnedBottomRowData={pinnedBottomRowData}
                                height={400}
                            />
                        </div>
                        {/*<div className="table-responsive mt-3 active">*/}
                        {/*    <table>*/}
                        {/*        <thead>*/}
                        {/*        <tr>*/}
                        {/*            <th>Product</th>*/}
                        {/*            <th>Filling</th>*/}
                        {/*            <th>Capacity</th>*/}
                        {/*            <th>Quantity</th>*/}
                        {/*            <th>Unit Price</th>*/}
                        {/*            <th>Before Tax</th>*/}
                        {/*            <th>Tax</th>*/}
                        {/*            <th>Discount</th>*/}
                        {/*            <th className="text-center">Grand Total</th>*/}
                        {/*        </tr>*/}
                        {/*        </thead>*/}
                        {/*        <tbody>*/}
                        {/*        {deliveryNoteItems.length > 0 ? (*/}
                        {/*            deliveryNoteItems.map((item: any, index: number) => (*/}
                        {/*                <tr key={index}>*/}
                        {/*                    <td>{item.product_assembly.formula_name}</td>*/}
                        {/*                    <td>{item.product.title}</td>*/}
                        {/*                    <td>{item.capacity}</td>*/}
                        {/*                    <td>{item.delivered_quantity}</td>*/}
                        {/*                    <td>{item.retail_price}</td>*/}
                        {/*                    <td>*/}
                        {/*                        {(parseFloat(item.delivered_quantity) * parseFloat(item.retail_price)).toFixed(2)}*/}
                        {/*                    </td>*/}
                        {/*                    <td>*/}
                        {/*                        {item.tax_category ? (*/}
                        {/*                            <div className="flex flex-col">*/}
                        {/*                                <span><strong>Tax: </strong>{item.tax_category.name} ({item.tax_rate}%)</span>*/}
                        {/*                                <span><strong>Amount: </strong>{item.tax_amount.toFixed(2)}*/}
                        {/*                                </span>*/}
                        {/*                            </div>*/}
                        {/*                        ) : (*/}
                        {/*                            <span>N/A</span>*/}
                        {/*                        )}*/}
                        {/*                    </td>*/}
                        {/*                    <td>*/}
                        {/*                        {item.discount_type ? (*/}
                        {/*                            <div className="flex flex-col">*/}
                        {/*                                <span><strong>Type: </strong>{capitalize(item.discount_type)}*/}
                        {/*                                </span>*/}
                        {/*                                <span><strong>Rate: </strong>*/}
                        {/*                                    {item.discount_amount_rate.toFixed(2)}{item.discount_type === 'percentage' ? '%' : ''}*/}
                        {/*                                </span>*/}
                        {/*                            </div>*/}
                        {/*                        ) : (*/}
                        {/*                            <span>N/A</span>*/}
                        {/*                        )}*/}
                        {/*                    </td>*/}
                        {/*                    <td className="text-center">*/}
                        {/*                        {item.total_cost.toFixed(2)}*/}
                        {/*                    </td>*/}
                        {/*                </tr>*/}
                        {/*            ))*/}
                        {/*        ) : (*/}
                        {/*            <tr>*/}
                        {/*                <td colSpan={9} className="text-center">No items found</td>*/}
                        {/*            </tr>*/}
                        {/*        )}*/}
                        {/*        </tbody>*/}
                        {/*        <tfoot>*/}
                        {/*        <tr>*/}
                        {/*            <td colSpan={8} className="text-center font-bold">Total</td>*/}
                        {/*            <td className="text-center font-bold">{deliveryNoteItems.reduce((acc, item) => acc + item.total_cost, 0).toFixed(2)}</td>*/}
                        {/*        </tr>*/}
                        {/*        </tfoot>*/}
                        {/*    </table>*/}
                        {/*</div>*/}
                    </Tab.Panel>
                </Tab.Panels>
            </Tab.Group>
            <div className="flex justify-center items-center mt-5">
                <Button
                    type={ButtonType.submit}
                    text="Save"
                    variant={ButtonVariant.primary}
                />
            </div>
        </form>
    );
};

export default InvoiceForm;
