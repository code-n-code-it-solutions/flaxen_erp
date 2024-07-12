import React, { useEffect, useState } from 'react';
import Button from '@/components/Button';
import { ButtonType, ButtonVariant } from '@/utils/enums';
import { Input } from '@/components/form/Input';
import { useAppDispatch, useAppSelector } from '@/store';
import { setAuthToken, setContentType } from '@/configs/api.config';
import { generateCode } from '@/store/slices/utilSlice';
import Option from '@/components/form/Option';
import { Dropdown } from '@/components/form/Dropdown';
import { getPaymentMethods } from '@/store/slices/paymentMethodSlice';
import { storeVendorPayment } from '@/store/slices/vendorPayments';
import { getVendors } from '@/store/slices/vendorSlice';
import { getPendingVendorBills } from '@/store/slices/vendorBillSlice';

const PaymentForm = () => {
    const dispatch = useAppDispatch();
    const { token } = useAppSelector((state) => state.user);
    const { code } = useAppSelector((state) => state.util);
    const { vendorBills } = useAppSelector((state) => state.vendorBill);
    const { allVendors } = useAppSelector((state) => state.vendor);
    const { paymentMethods } = useAppSelector((state) => state.paymentMethod);

    const [formData, setFormData] = useState<any>({});
    const [errors, setErrors] = useState<any>({});
    const [vendorOptions, setVendorOptions] = useState<any[]>([]);
    const [paymentMethodOptions, setPaymentMethodOptions] = useState<any[]>([]);
    const [bills, setBills] = useState<any[]>([]);

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

    const handleSetBillsList = (billDetails: any) => {
        setBills(billDetails.map((bill: any) => {
            const totalAmount = bill.good_receive_note_vendor_bill
                .flatMap((vendorBill: any) => vendorBill.good_receive_note.raw_products)
                .reduce((acc: number, item: any) => acc + item.total_price, 0);
            console.log(bill);
            return {
                id: bill.id,
                bill_number: bill.bill_number,
                bill_reference: bill.bill_reference,
                bill_date: bill.bill_date,
                due_date: bill.due_date,
                payment_terms: bill.payment_terms,
                total_amount: totalAmount,
                due_amount: bill.vendor_payments?.length > 0 ? (totalAmount - bill.vendor_payments.reduce((acc: number, item: any) => acc + parseFloat(item.paid_amount), 0)) : totalAmount,
                paid_amount: 0
            };
        }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(bills);
        let finalData = {
            ...formData,
            payment_details: bills.map((billDetail: any) => ({
                vendor_bill_id: billDetail.id,
                due_amount: billDetail.due_amount,
                paid_amount: billDetail.paid_amount
            }))
        };
        // console.log(finalData);
        dispatch(storeVendorPayment(finalData));
    };

    useEffect(() => {
        setAuthToken(token);
        setContentType('application/json');
        dispatch(generateCode('vendor_bill_payment'));
        dispatch(getVendors());
        dispatch(getPaymentMethods());
        setBills([])
    }, []);

    useEffect(() => {
        if (code) {
            setFormData({
                ...formData,
                payment_code: code['vendor_bill_payment']
            });
        }
    }, [code]);

    useEffect(() => {
        if (vendorBills) {
            // console.log(vendorBills.map((bill: any) => bill));
            handleSetBillsList(vendorBills.map((bill: any) => bill));
        }
    }, [vendorBills]);

    useEffect(() => {
        if (allVendors) {
            setVendorOptions(allVendors.map((vendor: any) => ({
                value: vendor.id,
                label: vendor.name + ' (' + vendor.vendor_number + ')'
            })));
        }
    }, [allVendors]);

    useEffect(() => {
        if (paymentMethods) {
            setPaymentMethodOptions(paymentMethods.map((method: any) => ({
                value: method.id,
                label: method.name
            })));
        }
    }, [paymentMethods]);

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
                        label="Vendor"
                        name="vendor_id"
                        value={formData.vendor_id}
                        options={vendorOptions}
                        onChange={(e) => {
                            if (e && typeof e !== 'undefined') {
                                handleChange('vendor_id', e.value, false);
                                dispatch(getPendingVendorBills(e.value));
                            } else {
                                handleChange('vendor_id', '', false);
                            }
                        }}
                    />

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
                        <th>Bill Code</th>
                        <th>Ref #</th>
                        <th>Bill Date</th>
                        <th>Due Date/Terms</th>
                        <th>Total Amount</th>
                        <th>Due Amount</th>
                        <th>Paid Amount</th>
                    </tr>
                    </thead>
                    <tbody>
                    {bills.map((billDetail: any, index: number) => (
                        <tr key={index}>
                            <td>{billDetail.bill_number}</td>
                            <td>{billDetail.bill_reference}</td>
                            <td>{billDetail.bill_date}</td>
                            <td>{billDetail.due_date ? billDetail.due_date : billDetail.payment_terms + ' Days'}</td>
                            <td>{billDetail.total_amount.toFixed(2)}</td>
                            <td>{billDetail.due_amount.toFixed(2)}</td>
                            <td>
                                <Input
                                    divClasses="w-full"
                                    type="number"
                                    name={`invoices[${index}][paid_amount]`}
                                    value={billDetail.paid_amount}
                                    onChange={(e) => {
                                        const paidAmount = parseFloat(e.target.value);
                                        if (paidAmount > billDetail.due_amount) {
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
                                        setBills((invoices: any) => {
                                            return invoices.map((inv: any, i: number) => {
                                                if (i === index) {
                                                    return {
                                                        ...inv,
                                                        paid_amount: paidAmount > billDetail.due_amount ? billDetail.due_amount : paidAmount
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
