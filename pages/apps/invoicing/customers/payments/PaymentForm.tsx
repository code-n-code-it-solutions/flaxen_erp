import React, { useEffect, useState } from 'react';
import Button from '@/components/Button';
import { ButtonType, ButtonVariant } from '@/utils/enums';
import { Input } from '@/components/form/Input';
import { useAppDispatch, useAppSelector } from '@/store';
import { setAuthToken, setContentType } from '@/configs/api.config';
import { generateCode } from '@/store/slices/utilSlice';
import { pendingDeliveryNotes } from '@/store/slices/deliveryNoteSlice';
import { getPendingSaleInvoices } from '@/store/slices/saleInvoiceSlice';
import Option from '@/components/form/Option';
import { Dropdown } from '@/components/form/Dropdown';
import { getCustomers } from '@/store/slices/customerSlice';
import { getPaymentMethods } from '@/store/slices/paymentMethodSlice';
import { storeCustomerPayment } from '@/store/slices/customerPayment';

const PaymentForm = () => {
    const dispatch = useAppDispatch();
    const { token } = useAppSelector((state) => state.user);
    const { code } = useAppSelector((state) => state.util);
    const { saleInvoices } = useAppSelector((state) => state.saleInvoice);
    const { customers } = useAppSelector((state) => state.customer);
    const { paymentMethods } = useAppSelector((state) => state.paymentMethod);

    const [formData, setFormData] = useState<any>({});
    const [errors, setErrors] = useState<any>({});
    const [pendingInvoiceOptions, setPendingInvoiceOptions] = useState<any[]>([]);
    const [customerOptions, setCustomerOptions] = useState<any[]>([]);
    const [paymentMethodOptions, setPaymentMethodOptions] = useState<any[]>([]);
    const [invoices, setInvoices] = useState<any[]>([]);

    const handleChange = (name: string, value: any, required: boolean) => {
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
        setFormData({ ...formData, [name]: value });
    };

    const handleSetInvoiceList = (invoices: any) => {
        setInvoices(invoices.map((invoice: any) => {
            const totalAmount = invoice.delivery_note_sale_invoices
                .flatMap((invoice: any) => invoice.delivery_note.delivery_note_items)
                .reduce((acc: number, item: any) => acc + item.total_cost, 0);

            return {
                id: invoice.id,
                sale_invoice_code: invoice.sale_invoice_code,
                payment_reference: invoice.payment_reference,
                invoice_date: invoice.invoice_date,
                due_date: invoice.due_date,
                payment_terms: invoice.payment_terms,
                total_amount: totalAmount,
                due_amount: invoice.customer_payments.length > 0 ? (totalAmount - invoice.customer_payments.reduce((acc: number, item: any) => acc + parseFloat(item.received_amount), 0)) : totalAmount,
                paid_amount: 0
            };
        }));
        console.log(invoices);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        let finalData = {
            ...formData,
            customer_payment_details: invoices.map((invoice: any) => ({
                sale_invoice_id: invoice.id,
                due_amount: invoice.due_amount,
                received_amount: invoice.paid_amount
            }))
        };
        dispatch(storeCustomerPayment(finalData));
    };

    useEffect(() => {
        setAuthToken(token);
        setContentType('application/json');
        dispatch(generateCode('customer_payment'));
        dispatch(getCustomers());
        dispatch(getPaymentMethods());
    }, []);

    useEffect(() => {
        if (code) {
            setFormData({
                ...formData,
                payment_code: code['customer_payment']
            });
        }
    }, [code]);

    useEffect(() => {
        if (saleInvoices) {
            // setPendingInvoiceOptions(saleInvoices.map((invoice: any) => ({
            //     value: invoice.id,
            //     label: invoice.sale_invoice_code,
            //     invoice
            // })));
            console.log(saleInvoices);
            handleSetInvoiceList(saleInvoices.map((invoice: any) => invoice));
        }
    }, [saleInvoices]);

    useEffect(() => {
        if (customers) {
            setCustomerOptions(customers.map((customer: any) => ({
                value: customer.id,
                label: customer.name + ' (' + customer.customer_code + ')'
            })));
        }
    }, [customers]);

    useEffect(() => {
        if (paymentMethods) {
            setPaymentMethodOptions(paymentMethods.map((method: any) => ({
                value: method.id,
                label: method.name
            })));
        }
    }, [paymentMethods]);

    useEffect(() => {
        console.log(invoices);
    }, [invoices]);

    return (
        <form onSubmit={(e) => handleSubmit(e)}>
            <Input
                divClasses="w-full md:w-1/2"
                className="text-xl font-light py-3"
                label="Payment Code"
                type="text"
                name="payment_code"
                value={formData.payment_code}
                onChange={(e) => handleChange(e.target.name, e.target.value, e.target.required)}
                isMasked={false}
                disabled={true}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 my-3">
                <div className="w-full flex flex-col gap-3">
                    <Option
                        label="Internal Transfer"
                        type="checkbox"
                        name="is_internal_transfer"
                        value={formData.is_internal_transfer}
                        defaultChecked={formData.is_internal_transfer === 1}
                        onChange={(e) => handleChange(e.target.name, e.target.checked ? 1 : 0, e.target.required)}
                    />

                    <div className="flex gap-3">
                        <label>Payment Type</label>
                        <Option
                            label="Send"
                            type="radio"
                            name="payment_type"
                            value="Send"
                            defaultChecked={formData.payment_type === 'Send'}
                            onChange={(e) => handleChange(e.target.name, e.target.value, e.target.required)}
                        />
                        <Option
                            label="Receive"
                            type="radio"
                            name="payment_type"
                            value="Receive"
                            defaultChecked={formData.payment_type === 'Receive'}
                            onChange={(e) => handleChange(e.target.name, e.target.value, e.target.required)}
                        />
                    </div>

                    <Dropdown
                        label="Customer"
                        name="customer_id"
                        value={formData.customer_id}
                        options={customerOptions}
                        onChange={(e) => {
                            if (e && typeof e !== 'undefined') {
                                handleChange('customer_id', e.value, false);
                                dispatch(getPendingSaleInvoices(e.value));
                            } else {
                                handleChange('customer_id', '', false);
                                setPendingInvoiceOptions([]);
                            }
                        }}
                    />

                    {/*<Dropdown*/}
                    {/*    label="Pending Invoices"*/}
                    {/*    name="sale_invoice_ids"*/}
                    {/*    value={formData.sale_invoice_ids}*/}
                    {/*    options={pendingInvoiceOptions}*/}
                    {/*    isMulti={true}*/}
                    {/*    onChange={(e) => {*/}
                    {/*        if (e && e.length > 0 && typeof e !== 'undefined') {*/}
                    {/*            handleChange('sale_invoice_ids', e.map((invoice: any) => invoice.value).join(','), false);*/}
                    {/*            handleSetInvoiceList(e.map((invoice: any) => invoice.invoice));*/}
                    {/*        } else {*/}
                    {/*            handleChange('sale_invoice_ids', '', false);*/}
                    {/*        }*/}
                    {/*    }}*/}
                    {/*/>*/}
                    <Dropdown
                        label="Payment Method"
                        name="payment_method_id"
                        value={formData.payment_method_id}
                        options={paymentMethodOptions}
                        onChange={(e) => {
                            if (e && typeof e !== 'undefined') {
                                handleChange('payment_method_id', e.value, true);
                            } else {
                                handleChange('payment_method_id', '', true);
                            }
                        }}
                    />
                </div>
                <div className="w-full flex flex-col gap-3">
                    <Input
                        divClasses="w-full"
                        label="Reference No"
                        type="text"
                        name="reference_no"
                        value={formData.reference_no}
                        onChange={(e) => handleChange(e.target.name, e.target.value, e.target.required)}
                        placeholder="Enter Reference Number"
                        isMasked={false}
                    />

                    <Input
                        divClasses="w-full"
                        label="Payment Date"
                        type="date"
                        name="payment_date"
                        value={formData.payment_date}
                        onChange={(e) => handleChange('payment_date', e[0] ? e[0].toLocaleDateString() : '', true)}
                        placeholder="Enter Payment Date"
                        isMasked={false}
                    />

                </div>
            </div>

            <div className="table-responsive">
                <table>
                    <thead>
                    <tr>
                        <th>Invoice Code</th>
                        <th>Ref #</th>
                        <th>Invoice Date</th>
                        <th>Due Date/Terms</th>
                        <th>Total Amount</th>
                        <th>Due Amount</th>
                        <th>Paid Amount</th>
                    </tr>
                    </thead>
                    <tbody>
                    {invoices.map((invoice: any, index: number) => (
                        <tr key={index}>
                            <td>{invoice.sale_invoice_code}</td>
                            <td>{invoice.payment_reference}</td>
                            <td>{invoice.invoice_date}</td>
                            <td>{invoice.due_date ? invoice.due_date : invoice.payment_terms + ' Days'}</td>
                            <td>{invoice.total_amount.toFixed(2)}</td>
                            <td>{invoice.due_amount.toFixed(2)}</td>
                            <td>
                                <Input
                                    divClasses="w-full"
                                    type="number"
                                    name={`invoices[${index}][paid_amount]`}
                                    value={invoice.paid_amount}
                                    onChange={(e) => {
                                        const paidAmount = parseFloat(e.target.value);
                                        if (paidAmount > invoice.due_amount) {
                                            setErrors({
                                                ...errors,
                                                [`invoices[${index}][paid_amount]`]: 'Paid amount cannot exceed due amount'
                                            });
                                        } else {
                                            setErrors((prevErrors: any) => {
                                                const {
                                                    [`invoices[${index}][paid_amount]`]: removedError,
                                                    ...restErrors
                                                } = prevErrors;
                                                return restErrors;
                                            });
                                        }
                                        setInvoices((invoices: any) => {
                                            return invoices.map((inv: any, i: number) => {
                                                if (i === index) {
                                                    return {
                                                        ...inv,
                                                        paid_amount: paidAmount > invoice.due_amount ? invoice.due_amount : paidAmount
                                                    };
                                                }
                                                return inv;
                                            });
                                        });
                                    }}
                                    placeholder="Enter Paid Amount"
                                    isMasked={false}
                                />
                                {errors[`invoices[${index}][paid_amount]`] && (
                                    <div
                                        className="text-red-500 text-xs">{errors[`invoices[${index}][paid_amount]`]}</div>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-center items-center mt-3">
                <Button
                    type={ButtonType.submit}
                    text="Confirm Payment"
                    variant={ButtonVariant.primary}
                />
            </div>
        </form>
    );
};

export default PaymentForm;
