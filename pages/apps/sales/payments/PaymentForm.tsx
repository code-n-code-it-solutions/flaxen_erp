import React, { Fragment, useEffect, useState } from 'react';
import Button from '@/components/Button';
import { ButtonType, ButtonVariant } from '@/utils/enums';
import { Input } from '@/components/form/Input';
import { useAppDispatch, useAppSelector } from '@/store';
import { setAuthToken, setContentType } from '@/configs/api.config';
import { clearLatestRecord, generateCode, getLatestRecord } from '@/store/slices/utilSlice';
import { pendingDeliveryNotes } from '@/store/slices/deliveryNoteSlice';
import { getPendingSaleInvoices } from '@/store/slices/saleInvoiceSlice';
import Option from '@/components/form/Option';
import { Dropdown } from '@/components/form/Dropdown';
import { getCustomers } from '@/store/slices/customerSlice';
import { getPaymentMethods } from '@/store/slices/paymentMethodSlice';
import { storeCustomerPayment } from '@/store/slices/customerPayment';
import { PlusCircleIcon } from 'lucide-react';
import BankDetailModal from '@/components/modals/BankDetailModal';
import { getAccountsByCustomer, storeBankAccount } from '@/store/slices/bankAccountSlice';
import { Tab } from '@headlessui/react';
import dynamic from 'next/dynamic';
import useTransformToSelectOptions from '@/hooks/useTransformToSelectOptions';
import { getAccountsTypes } from '@/store/slices/accountSlice';
import Swal from 'sweetalert2';

const TreeSelect = dynamic(() => import('antd/es/tree-select'), { ssr: false });

const PaymentForm = () => {
    const dispatch = useAppDispatch();
    const accountOptions = useTransformToSelectOptions(useAppSelector(state => state.account).accountTypes);
    const { token } = useAppSelector((state) => state.user);
    const { code, latestRecord } = useAppSelector((state) => state.util);
    const { saleInvoices } = useAppSelector((state) => state.saleInvoice);
    const { customers } = useAppSelector((state) => state.customer);
    const { paymentMethods } = useAppSelector((state) => state.paymentMethod);
    const { bankAccounts, bankAccount, success } = useAppSelector((state) => state.bankAccount);

    const [formData, setFormData] = useState<any>({});
    const [errors, setErrors] = useState<any>({});
    const [pendingInvoiceOptions, setPendingInvoiceOptions] = useState<any[]>([]);
    const [customerOptions, setCustomerOptions] = useState<any[]>([]);
    const [paymentMethodOptions, setPaymentMethodOptions] = useState<any[]>([]);
    const [invoices, setInvoices] = useState<any[]>([]);
    const [bankAccountOptions, setBankAccountOptions] = useState<any[]>([]);
    const [bankAccountModal, setBankAccountModal] = useState<boolean>(false);
    const [receivableAmount, setReceivableAmount] = useState<number>(0);

    const handleChange = (name: string, value: any, required: boolean) => {
        if (required && value === '') {
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

        if (name === 'discount_amount') {
            setFormData({ ...formData, [name]: parseFloat(value) });
        } else {
            setFormData({ ...formData, [name]: value });
        }

        if (name === 'discount_amount') {
            recalculateReceivableAmount(invoices, parseFloat(value || 0));
        }
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
                due_amount: invoice.customer_payments?.length > 0 ? (totalAmount - invoice.customer_payments.reduce((acc: number, item: any) => acc + parseFloat(item.received_amount), 0)) : totalAmount,
                received_amount: 0
            };
        }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        let finalData = {
            ...formData,
            customer_payment_details: invoices.map((invoice: any) => ({
                sale_invoice_id: invoice.id,
                due_amount: invoice.due_amount,
                received_amount: invoice.received_amount
            }))
        };
        if (!formData.receiving_account_id) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please select receiving account'
            });
        } else {
            dispatch(storeCustomerPayment(finalData));
        }
    };

    const handleAddAccount = (value: any) => {
        let finalData = {
            ...value,
            account_of: 2,
            account_of_id: formData.customer_id
        };
        dispatch(storeBankAccount(finalData));
    };

    useEffect(() => {
        setAuthToken(token);
        setContentType('application/json');
        dispatch(generateCode('customer_payment'));
        dispatch(getCustomers());
        dispatch(getPaymentMethods());
        dispatch(clearLatestRecord());
        dispatch(getAccountsTypes({}));
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
        if (bankAccounts) {
            setBankAccountOptions(bankAccounts.map((account: any) => ({
                value: account.id,
                label: account.account_number + ' (' + account.bank.name + ')'
            })));
        }
    }, [bankAccounts]);

    useEffect(() => {
        if (bankAccount && success) {
            setBankAccountModal(false);
            dispatch(getAccountsByCustomer(formData.customer_id));
        }
    }, [bankAccount, success]);

    useEffect(() => {
        if (invoices.length > 0) {
            recalculateReceivableAmount(invoices, parseFloat(formData.discount_amount || 0));
        }
    }, [invoices, formData.discount_amount]);

    const recalculateReceivableAmount = (items: any[], discount: number) => {
        const totalCost = items.reduce((acc: number, item: any) => acc + parseFloat(item.total_amount), 0);
        setReceivableAmount(totalCost - discount);
    };

    useEffect(() => {
        if (latestRecord) {
            setFormData((prevFormData: any) => ({
                ...prevFormData,
                receiving_account_id: latestRecord.receiving_account?.code
            }));
        }
    }, [latestRecord]);

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

                    <Dropdown
                        label="Payment Method"
                        name="payment_method_id"
                        value={formData.payment_method_id}
                        options={paymentMethodOptions}
                        onChange={(e) => {
                            if (e && typeof e !== 'undefined') {
                                if (e.value === 2) {
                                    dispatch(getAccountsByCustomer(formData.customer_id));
                                }
                                handleChange('payment_method_id', e.value, true);
                            } else {
                                handleChange('payment_method_id', '', true);
                            }
                        }}
                    />

                    {formData.customer_id !== '' ?
                        (formData.payment_method_id === 2 && (
                            <>
                                <div className="flex flex-col md:flex-row gap-3">
                                    <div className="flex items-end gap-1 w-full">
                                        <Dropdown
                                            divClasses="w-full"
                                            label="Bank Accounts"
                                            name="bank_account_id"
                                            value={formData.bank_account_id}
                                            options={bankAccountOptions}
                                            onChange={(e) => {
                                                if (e && typeof e !== 'undefined') {
                                                    handleChange('bank_account_id', e.value, true);
                                                } else {
                                                    handleChange('bank_account_id', '', true);
                                                }
                                            }}
                                        />
                                        <Button
                                            type={ButtonType.button}
                                            text={<PlusCircleIcon size={18} />}
                                            variant={ButtonVariant.primary}
                                            onClick={() => setBankAccountModal(true)}
                                        />
                                    </div>

                                    <Dropdown
                                        divClasses="w-full"
                                        label="Bank Options"
                                        name="bank_option"
                                        value={formData.bank_option}
                                        options={[
                                            { value: 'Bank Transfer', label: 'Bank Transfer' },
                                            { value: 'Cheque', label: 'Cheque' },
                                            { value: 'Credit Card', label: 'Credit Card' }
                                        ]}
                                        onChange={(e) => {
                                            if (e && typeof e !== 'undefined') {
                                                handleChange('bank_option', e.value, true);
                                            } else {
                                                handleChange('bank_option', '', true);
                                            }
                                        }}
                                    />

                                    {(formData.bank_option === 'Cheque' || formData.bank_option === 'Credit Card') && (
                                        <Input
                                            divClasses="w-full"
                                            label="Cheque No/Credit Card Number"
                                            type="text"
                                            name="cheque_card_no"
                                            value={formData.cheque_card_no}
                                            onChange={(e) => handleChange(e.target.name, e.target.value, e.target.required)}
                                            placeholder="Enter Card or Cheque Number"
                                            isMasked={false}
                                        />
                                    )}
                                </div>
                                {formData.bank_option === 'Cheque' && (
                                    <div className="flex md:items-end flex-col md:flex-row gap-3">
                                        <Dropdown
                                            label="Is PDC"
                                            name="is_pdc"
                                            value={formData.is_pdc}
                                            options={[
                                                { value: 1, label: 'Yes' },
                                                { value: 0, label: 'No' }
                                            ]}
                                            onChange={(e) => {
                                                if (e && typeof e !== 'undefined') {
                                                    handleChange('is_pdc', e.value, false);
                                                } else {
                                                    handleChange('is_pdc', '', false);
                                                }
                                            }}
                                        />
                                        {formData.is_pdc === 1 && (
                                            <Input
                                                label="PDC Date"
                                                type="date"
                                                name="pdc_date"
                                                value={formData.pdc_date}
                                                onChange={(e) => handleChange('pdc_date', e[0] ? e[0].toLocaleDateString() : '', true)}
                                                placeholder="Enter PDC Date"
                                                isMasked={false}
                                            />
                                        )}
                                    </div>
                                )}
                            </>
                        )) : (<></>)}
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

                    <Input
                        divClasses="w-full"
                        label="Discount Amount"
                        type="number"
                        step="any"
                        name="discount_amount"
                        value={formData.discount_amount}
                        onChange={(e) => handleChange(e.target.name, e.target.value, e.target.required)}
                        placeholder="Enter Discount Amount"
                        isMasked={false}
                    />
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
                    <Tab as={Fragment}>
                        {({ selected }) => (
                            <button
                                className={`${
                                    selected ? '!border-white-light !border-b-white  text-primary !outline-none dark:!border-[#191e3a] dark:!border-b-black ' : ''
                                } -mb-[1px] block border border-transparent p-3.5 py-2 hover:text-primary dark:hover:border-b-black`}
                            >
                                Accounting
                            </button>
                        )}
                    </Tab>
                </Tab.List>
                <Tab.Panels className="panel rounded-none">
                    <Tab.Panel>
                        <div className="active table-responsive">
                            <table>
                                <thead>
                                <tr>
                                    <th>Invoice Code</th>
                                    <th>Ref #</th>
                                    <th>Invoice Date</th>
                                    <th>Due Date/Terms</th>
                                    <th>Total Amount</th>
                                    <th>Due Amount</th>
                                    <th>Received Amount</th>
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
                                                step="any"
                                                name={`invoices[${index}][received_amount]`}
                                                value={invoice.received_amount}
                                                onChange={(e) => {
                                                    const receivedAmount = parseFloat(e.target.value);
                                                    if (receivedAmount > invoice.due_amount) {
                                                        setErrors({
                                                            ...errors,
                                                            [`invoices[${index}][received_amount]`]: 'Received amount cannot exceed due amount'
                                                        });
                                                    } else {
                                                        setErrors((prevErrors: any) => {
                                                            const {
                                                                [`invoices[${index}][received_amount]`]: removedError,
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
                                                                    received_amount: receivedAmount > invoice.due_amount ? invoice.due_amount : receivedAmount
                                                                };
                                                            }
                                                            return inv;
                                                        });
                                                    });
                                                }}
                                                placeholder="Enter Received Amount"
                                                isMasked={false}
                                            />
                                            {errors[`invoices[${index}][received_amount]`] && (
                                                <div className="text-red-500 text-xs">
                                                    {errors[`invoices[${index}][received_amount]`]}
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </Tab.Panel>
                    <Tab.Panel>
                        <div>
                            <Option
                                divClasses="mb-5"
                                label="Use Previous Item Accounting"
                                type="checkbox"
                                name="use_previous_accounting"
                                value="1"
                                defaultChecked={formData.use_previous_accounting}
                                onChange={(e) => {
                                    setFormData((prevFormData: any) => ({
                                        ...prevFormData,
                                        use_previous_accounting: e.target.checked ? 1 : 0
                                    }));
                                    dispatch(clearLatestRecord());
                                    if (e.target.checked) {
                                        dispatch(getLatestRecord('customer-payments'));
                                    } else {
                                        dispatch(clearLatestRecord());
                                    }
                                }}
                            />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                    <h3 className="font-bold text-lg mb-5 border-b">Accounts</h3>
                                    <div className="space-y-3">
                                        <div>
                                            <label>Receiving Account</label>
                                            <TreeSelect
                                                showSearch
                                                style={{ width: '100%' }}
                                                value={latestRecord ? latestRecord.receiving_account?.code : formData.receiving_account_id}
                                                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                                placeholder="Please select receiving account"
                                                allowClear
                                                treeDefaultExpandAll
                                                onChange={(e) => handleChange('receiving_account_id', e, true)}
                                                treeData={accountOptions}
                                                // onPopupScroll={onPopupScroll}
                                                treeNodeFilterProp="title"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Tab.Panel>
                </Tab.Panels>
            </Tab.Group>
            <div className="flex justify-between items-center mt-3">
                <div className="flex gap-3 items-center">
                    <h3 className="text-md">Receivable Amount: </h3>
                    <h3 className="text-lg font-bold">{receivableAmount.toFixed(2)}</h3>
                </div>
                <Button
                    type={ButtonType.submit}
                    text="Confirm Payment"
                    variant={ButtonVariant.primary}
                />
            </div>
            <BankDetailModal
                modalOpen={bankAccountModal}
                setModalOpen={setBankAccountModal}
                handleSubmit={(value) => handleAddAccount(value)}
                title="New Account"
            />
        </form>
    );
};

export default PaymentForm;
