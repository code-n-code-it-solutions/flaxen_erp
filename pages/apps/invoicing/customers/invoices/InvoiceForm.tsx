import React, { useEffect, useState } from 'react';
import { Input } from '@/components/form/Input';
import { useAppDispatch, useAppSelector } from '@/store';
import { generateCode } from '@/store/slices/utilSlice';
import { setAuthToken, setContentType } from '@/configs/api.config';
import { Dropdown } from '@/components/form/Dropdown';
import { pendingDeliveryNotes } from '@/store/slices/deliveryNoteSlice';
import Button from '@/components/Button';
import { ButtonType, ButtonVariant } from '@/utils/enums';
import { capitalize } from 'lodash';
import { storeSaleInvoice } from '@/store/slices/saleInvoiceSlice';

const InvoiceForm = () => {
    const dispatch = useAppDispatch();
    const { token } = useAppSelector((state) => state.user);
    const { code } = useAppSelector((state) => state.util);
    const { deliveryNotes } = useAppSelector((state) => state.deliveryNote);

    const [formData, setFormData] = useState<any>({});
    const [errors, setErrors] = useState<any>({});
    const [deliveryNoteOptions, setDeliveryNoteOptions] = useState<any[]>([]);
    const [customer, setCustomer] = useState<any>({});
    const [contactPerson, setContactPerson] = useState<any>({});
    const [salesman, setSalesman] = useState<any>({});
    const [deliveryNoteItems, setDeliveryNoteItems] = useState<any[]>([]);

    const handleChange = (name: string, value: string, required: boolean) => {
        if (required) {
            if (value === '') {
                setErrors({
                    ...errors,
                    [name]: 'This field is required'
                });
                return;
            } else {
                setErrors((err: any) => {
                    delete err[name];
                    return err;
                });
            }
        }
        if(name==='payment_terms') {
            if(value !== '') {
                setFormData({ ...formData, payment_terms: value, due_date: '' });
                return;
            }
        }

        if(name==='due_date') {
            if(value !== '') {
                setFormData({ ...formData, due_date: value, payment_terms: '' });
                return;
            }
        }
        setFormData({ ...formData, [name]: value });
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
        dispatch(pendingDeliveryNotes());
    }, []);

    useEffect(() => {
        if (code) {
            setFormData({
                ...formData,
                sale_invoice_code: code['sale_invoice']
            });
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <span className="font-semibold text-gray-600">Customer Name: </span>
                        <span>{customer.name}</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <span className="font-semibold text-gray-600">Contact Person Name: </span>
                        <span>{contactPerson.name}</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <span className="font-semibold text-gray-600">Salesman Name: </span>
                        <span>{salesman.name}</span>
                    </div>
                    {/* eslint-disable-next-line react/jsx-no-undef */}
                    <Dropdown
                        divClasses="w-full"
                        label="Delivery Note"
                        name="delivery_note_ids"
                        options={deliveryNoteOptions}
                        value={formData.delivery_note_ids}
                        onChange={(e) => {
                            if (e && typeof e !== 'undefined' && e.length > 0) {
                                console.log(e);
                                setFormData({
                                    ...formData,
                                    delivery_note_ids: e.map((item: any) => item.value).join(','),
                                    customer_id: e[0].delivery_note.delivery_note_items[0].quotation.customer_id,
                                    contact_person_id: e[0].delivery_note.delivery_note_items[0].quotation.contact_person_id,
                                    salesman_id: e[0].delivery_note.delivery_note_items[0].quotation.salesman_id
                                });
                                setCustomer(e[0].delivery_note.delivery_note_items[0].quotation.customer);
                                setContactPerson(e[0].delivery_note.delivery_note_items[0].quotation.contact_person);
                                setSalesman(e[0].delivery_note.delivery_note_items[0].quotation.salesman);
                                setDeliveryNoteItems(e.map((item: any) => item.delivery_note.delivery_note_items).flat());
                            } else {
                                setFormData({
                                    ...formData,
                                    delivery_note_ids: '',
                                    customer_id: '',
                                    contact_person_id: '',
                                    salesman_id: ''
                                });
                                setCustomer({});
                                setContactPerson({});
                                setSalesman({});
                                setDeliveryNoteItems([]);
                            }
                        }}
                        isMulti={true}
                    />
                </div>
                <div className="w-full flex flex-col gap-3">
                    <h4 className="text-xl font-semibold text-gray-600 py-3">Invoice Params</h4>
                    <Input
                        divClasses="w-full"
                        label="Invoice Date"
                        type="date"
                        name="invoice_date"
                        value={formData.invoice_date}
                        onChange={(e) => handleChange('invoice_date', e[0] ? e[0].toLocaleDateString() : '', true)}
                        placeholder="Enter Invoice Date"
                        isMasked={false}
                    />
                    <Input
                        divClasses="w-full"
                        label="Payment Reference (optional)"
                        type="text"
                        name="payment_reference"
                        value={formData.payment_refernce}
                        onChange={(e) => handleChange(e.target.name, e.target.value, e.target.required)}
                        placeholder="Enter Payment Reference"
                        isMasked={false}
                    />
                    <div className="flex flex-col gap-3 md:flex-row justify-between items-end">
                        <Input
                            divClasses="w-full"
                            label="Due Date"
                            type="date"
                            name="due_date"
                            value={formData.due_date}
                            onChange={(e) => handleChange('due_date', e[0] ? e[0].toLocaleDateString() : '', true)}
                            placeholder="Enter Due Date"
                            isMasked={false}
                        />
                        <span className="w-full text-center">OR</span>
                        <Input
                            divClasses="w-full"
                            label="Payment Terms (Days)"
                            type="number"
                            name="payment_terms"
                            value={formData.payment_terms}
                            onChange={(e) => handleChange(e.target.name, e.target.value, e.target.required)}
                            placeholder="Enter Payment Terms"
                            isMasked={false}
                        />
                    </div>
                </div>
            </div>

            <div className="table-responsive mt-3">
                <table>
                    <thead>
                    <tr>
                        <th>Product</th>
                        <th>Filling</th>
                        <th>Capacity</th>
                        <th>Quantity</th>
                        <th>Unit Price</th>
                        <th>Before Tax</th>
                        <th>Tax</th>
                        <th>Discount</th>
                        <th className="text-center">Grand Total</th>
                    </tr>
                    </thead>
                    <tbody>
                    {deliveryNoteItems.length > 0
                        ? (deliveryNoteItems.map((item: any, index: number) => (
                                <tr key={index}>
                                    <td>{item.product_assembly.formula_name}</td>
                                    <td>{item.product.title}</td>
                                    <td>{item.capacity}</td>
                                    <td>{item.delivered_quantity}</td>
                                    <td>{item.retail_price}</td>
                                    <td>
                                        {(parseFloat(item.delivered_quantity) * parseFloat(item.retail_price)).toFixed(2)}
                                    </td>
                                    <td>
                                        {item.tax_category
                                            ? (
                                                <div className="flex flex-col">
                                                    <span><strong>Tax: </strong>{item.tax_category.name} ({item.tax_rate}%)</span>
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
                                    <td className="text-center">
                                        {item.total_cost.toFixed(2)}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={9} className="text-center">No items found</td>
                            </tr>
                        )}
                    </tbody>
                    <tfoot>
                    <tr>
                        <td colSpan={8} className="text-center font-bold">Total</td>
                        <td className="text-center font-bold">{deliveryNoteItems.reduce((acc, item) => acc + item.total_cost, 0).toFixed(2)}</td>
                    </tr>
                    </tfoot>
                </table>
            </div>
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
