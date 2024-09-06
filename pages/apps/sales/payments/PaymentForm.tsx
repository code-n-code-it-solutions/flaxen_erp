import React, { Fragment, useEffect, useState } from 'react';
import Button from '@/components/Button';
import { ButtonSize, ButtonType, ButtonVariant } from '@/utils/enums';
import { Input } from '@/components/form/Input';
import { useAppDispatch, useAppSelector } from '@/store';
import { setAuthToken, setContentType } from '@/configs/api.config';
import { clearLatestRecord, generateCode, getLatestRecord } from '@/store/slices/utilSlice';
import { clearSaleInvoiceListState, getPendingSaleInvoices } from '@/store/slices/saleInvoiceSlice';
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
import { clearBankState, getBanks, storeBank } from '@/store/slices/bankSlice';
import Modal from '@/components/Modal';
import BankFormModal from '@/components/modals/BankFormModal';

const TreeSelect = dynamic(() => import('antd/es/tree-select'), { ssr: false });

const PaymentForm = () => {
    const dispatch = useAppDispatch();
    const accountOptions = useTransformToSelectOptions(useAppSelector(state => state.account).accountTypes);
    const { token } = useAppSelector((state) => state.user);
    const { code, latestRecord } = useAppSelector((state) => state.util);
    const { saleInvoices } = useAppSelector((state) => state.saleInvoice);
    const { banks, bank } = useAppSelector((state) => state.bank);
    const { customers } = useAppSelector((state) => state.customer);
    const { paymentMethods } = useAppSelector((state) => state.paymentMethod);
    const { bankAccounts, bankAccount, success } = useAppSelector((state) => state.bankAccount);

    const [selectedIndex, setSelectedIndex] = useState(0);
    const [formData, setFormData] = useState<any>({});
    const [errors, setErrors] = useState<any>({});
    const [customerOptions, setCustomerOptions] = useState<any[]>([]);
    const [paymentMethodOptions, setPaymentMethodOptions] = useState<any[]>([]);
    const [bankOptions, setBankOptions] = useState<any[]>([]);
    const [invoices, setInvoices] = useState<any[]>([]);
    const [bankAccountOptions, setBankAccountOptions] = useState<any[]>([]);
    const [bankAccountModal, setBankAccountModal] = useState<boolean>(false);
    const [receivableAmount, setReceivableAmount] = useState<number>(0);
    const [chequeModal, setChequeModal] = useState<boolean>(false);
    const [chequeList, setChequeList] = useState<any[]>([]);
    const [chequeDetails, setChequeDetails] = useState<any>({});
    const [cashAmount, setCashAmount] = useState<number>(0);
    const [bankModal, setBankModal] = useState<boolean>(false);
    const [receivingAmount, setReceivingAmount] = useState<number>(0)

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

        if (name === 'discount_amount') {
            setFormData({ ...formData, discount_amount: parseFloat(value) });
            recalculateReceivableAmount(invoices, parseFloat(value || 0));
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSetInvoiceList = (invoices: any) => {
        let totalDueAmount = 0;
        const updatedInvoices = invoices.map((invoice: any) => {
            const totalAmount = invoice.delivery_note_sale_invoices
                .flatMap((invoice: any) => invoice.delivery_note.delivery_note_items)
                .reduce((acc: number, item: any) => acc + item.grand_total, 0);

            const dueAmount = invoice.customer_payments?.length > 0
                ? totalAmount - invoice.customer_payments.reduce((acc: number, item: any) => acc + parseFloat(item.received_amount), 0)
                : totalAmount;

            const discountAmount = invoice.customer_payments.reduce((acc: number, item: any) => acc + parseFloat(item.customer_payment.discount_amount), 0);
            totalDueAmount += dueAmount - discountAmount;

            return {
                id: invoice.id,
                sale_invoice_code: invoice.sale_invoice_code,
                payment_reference: invoice.payment_reference,
                invoice_date: invoice.invoice_date,
                due_date: invoice.due_date,
                payment_terms: invoice.payment_terms,
                total_amount: totalAmount,
                due_amount: dueAmount - discountAmount,
                received_amount: 0,
                cheque_amount: 0,
                cash_amount: 0
            };
        });
        setInvoices(updatedInvoices);

        // Set receivableAmount when invoices are added for the first time.
        if (receivableAmount === 0) {
            setReceivableAmount(totalDueAmount);
        }
    };

    const isPDC = (chequeDate: string, paymentDate: string) => {
        if (!chequeDate || !paymentDate) return false;
        const cheque = new Date(chequeDate);
        const payment = new Date(paymentDate);
        return cheque > payment;
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        let finalData = {
            ...formData,
            total_received: invoices.reduce((acc, invoice) => acc + invoice.received_amount, 0),
            customer_payment_details: invoices.map((invoice: any) => ({
                sale_invoice_id: invoice.id,
                due_amount: invoice.due_amount,
                received_amount: invoice.received_amount,
                cheque_amount: invoice.cheque_amount,
                cash_amount: invoice.cash_amount
            })),
            cheques: chequeList
        };
        if (!formData.receiving_account_id) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please select receiving account'
            });
        } else {
            console.log(finalData);
            // dispatch(storeCustomerPayment(finalData));
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
        setChequeDetails({});
        setInvoices([]);
        setReceivableAmount(0);
        dispatch(clearSaleInvoiceListState());
    }, []);

    useEffect(() => {
        if (chequeDetails.cheque_date && formData.payment_date) {
            setChequeDetails({
                ...chequeDetails,
                is_pdc: isPDC(chequeDetails.cheque_date, formData.payment_date) ? 1 : 0
            });
        }
    }, [chequeDetails.cheque_date, formData.payment_date]);

    useEffect(() => {
        const updatedCheques = chequeList.map((cheque: any) => ({
            ...cheque,
            is_pdc: isPDC(cheque.cheque_date, formData.payment_date) ? 1 : 0
        }));
        setChequeList(updatedCheques);
    }, [formData.payment_date]);


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
        const totalReceived = items.reduce((acc: number, item: any) => acc + parseFloat(item.received_amount || 0), 0);
        setReceivableAmount(totalReceived - discount);  // Adjust the receivable amount based on discount.
    };

    const calculateRemainingReceivableAmount = () => {
        const totalChequeAmount = chequeList.reduce((acc, cheque) => acc + cheque.cheque_amount, 0);
        return receivableAmount - totalChequeAmount;
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
        if (bank) {
            dispatch(getBanks());
            setBankModal(false);
            setChequeModal(true);
            dispatch(clearBankState());
        }
    }, [bank]);

    useEffect(() => {
        if (banks) {
            setBankOptions(banks.map((bank: any) => ({
                value: bank.id,
                label: bank.name
            })));
        }
    }, [banks]);

    const allocateChequeAmount = (chequeAmount: number) => {
        let remainingAmount = chequeAmount;
        const newInvoices = invoices.map((invoice) => {
            if (remainingAmount <= 0) {
                return invoice;
            }
            const amountToAllocate = Math.min(invoice.due_amount - invoice.received_amount, remainingAmount);
            remainingAmount -= amountToAllocate;
            return {
                ...invoice,
                received_amount: invoice.received_amount + amountToAllocate,
                cheque_amount: invoice.cheque_amount + amountToAllocate
            };
        });
        setInvoices(newInvoices);
        return remainingAmount;
    };

    // When cheques are added, adjust the receivingAmount
    const handleAddCheque = () => {
        const totalChequeAmount = chequeDetails.cheque_amount;
        const totalReceivedAmount = invoices.reduce((sum, invoice) => sum + invoice.received_amount, 0);
        const totalDueAmount = invoices.reduce((sum, invoice) => sum + invoice.due_amount, 0);

        if (totalReceivedAmount + totalChequeAmount > totalDueAmount) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'The total cheque amount exceeds the total due amount. Please check the cheques and try again.'
            });
            return;
        }

        const remainingChequeAmount = allocateChequeAmount(totalChequeAmount);
        if (remainingChequeAmount > 0) {
            setCashAmount((prev) => prev + remainingChequeAmount);
        }
        setChequeList((prevCheques) => [...prevCheques, chequeDetails]);

        const totalReceived = invoices.reduce((sum, inv) => sum + inv.received_amount, 0);
        setReceivingAmount(totalReceived + totalChequeAmount);

        setChequeModal(false);
        setChequeDetails({});
    };

    const handleRemoveCheque = (index: number) => {
        const chequeToRemove = chequeList[index];
        const newChequeList = chequeList.filter((_, i) => i !== index);
        setChequeList(newChequeList);

        let remainingAmount = chequeToRemove.cheque_amount;
        const newInvoices = invoices.map((invoice) => {
            if (remainingAmount <= 0) {
                return invoice;
            }
            const amountToDeallocate = Math.min(invoice.cheque_amount, remainingAmount);
            remainingAmount -= amountToDeallocate;
            return {
                ...invoice,
                received_amount: invoice.received_amount - amountToDeallocate,
                cheque_amount: invoice.cheque_amount - amountToDeallocate
            };
        });
        setInvoices(newInvoices);
    };

    // Update receivingAmount when cheque amount or received amount changes
    const handleReceivedAmountChange = (index: number, value: number) => {
        const newInvoices = [...invoices];
        const invoice = newInvoices[index];
        const chequeAmount = invoice.cheque_amount;

        if (value < chequeAmount) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: `The received amount cannot be less than the cheque amount (${chequeAmount}).`
            });
        } else {
            invoice.received_amount = value;
            invoice.cash_amount = value - chequeAmount;
            setInvoices(newInvoices);

            // Update the receivingAmount with the total of received amounts
            const totalReceived = newInvoices.reduce((acc, inv) => acc + inv.received_amount, 0);
            setReceivingAmount(totalReceived);
        }
    };

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
                                setInvoices([]);
                                setReceivableAmount(0);
                                setChequeList([]);
                                dispatch(clearSaleInvoiceListState());
                            }
                        }}
                    />
                    {formData.customer_id !== '' ? (
                        <>
                            <Dropdown
                                label="Payment Method"
                                name="payment_method_id"
                                value={formData.payment_method_id}
                                options={paymentMethodOptions}
                                onChange={(e) => {
                                    if (e && typeof e !== 'undefined') {
                                        if (e.value === 2) {
                                            dispatch(getBanks());
                                        } else {
                                            setChequeList([]);
                                        }
                                        handleChange('payment_method_id', e.value, true);
                                    } else {
                                        handleChange('payment_method_id', '', true);
                                    }
                                }}
                            />
                            {formData.payment_method_id === 2 && (
                                <>
                                    <Dropdown
                                        label="Payment Sub Method"
                                        name="payment_sub_method"
                                        value={formData.payment_sub_method}
                                        options={[
                                            { label: 'Credit Card', value: 'credit-card' },
                                            { label: 'Cheque', value: 'cheque' },
                                            { label: 'Online Transfer', value: 'online-transfer' }
                                        ]}
                                        onChange={(e) => {
                                            if (e && typeof e !== 'undefined') {
                                                if (e.value !== 'cheque') {
                                                    setChequeList([]);
                                                }
                                                handleChange('payment_sub_method', e.value, true);
                                            } else {
                                                handleChange('payment_sub_method', '', true);
                                            }
                                        }}
                                    />
                                    {(formData.payment_sub_method === 'credit-card' || formData.payment_sub_method === 'online-transfer') && (
                                        <Input
                                            divClasses="w-full"
                                            label="Transaction Number (Optional)"
                                            type="text"
                                            name="transaction_number"
                                            value={formData.transaction_number}
                                            onChange={(e) => handleChange(e.target.name, e.target.value, e.target.required)}
                                            placeholder="Enter Transaction Number"
                                            isMasked={false}
                                        />
                                    )}
                                </>
                            )}
                        </>
                    ) : null}
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
            <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
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
                    {formData.payment_sub_method === 'cheque' && (
                        <Tab as={Fragment}>
                            {({ selected }) => (
                                <button
                                    className={`${
                                        selected ? '!border-white-light !border-b-white  text-primary !outline-none dark:!border-[#191e3a] dark:!border-b-black ' : ''
                                    } -mb-[1px] block border border-transparent p-3.5 py-2 hover:text-primary dark:hover:border-b-black`}
                                >
                                    Cheques
                                </button>
                            )}
                        </Tab>
                    )}
                </Tab.List>
                <Tab.Panels className="py-3 rounded-none">
                    <Tab.Panel>
                        <div className="active table-responsive">
                            <table>
                                <thead>
                                <tr>
                                    <th>Invoice Code</th>
                                    <th>Ref #</th>
                                    <th>Invoice Date</th>
                                    {/*<th>Due Date/Terms</th>*/}
                                    <th>Total Amount</th>
                                    <th>Due Amount</th>
                                    <th>Received Amount</th>
                                </tr>
                                </thead>
                                <tbody>
                                {invoices.map((invoice: any, index: number) => {
                                    return (
                                        <tr key={index}>
                                            <td>{invoice.sale_invoice_code}</td>
                                            <td>{invoice.payment_reference}</td>
                                            <td>{invoice.invoice_date}</td>
                                            {/*<td>{invoice.due_date ? invoice.due_date : invoice.payment_terms + ' Days'}</td>*/}
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
                                                        handleReceivedAmountChange(index, receivedAmount);
                                                    }}
                                                    placeholder="Enter Received Amount"
                                                    disabled={formData.payment_sub_method === 'cheque'}
                                                    isMasked={false}
                                                />
                                                {errors[`invoices[${index}][received_amount]`] && (
                                                    <div className="text-red-500 text-xs">
                                                        {errors[`invoices[${index}][received_amount]`]}
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
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
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Tab.Panel>
                    <Tab.Panel>
                        <div className="table-responsive">
                            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-3">
                                <h3 className="font-bold text-md">Cheques</h3>
                                <Button
                                    type={ButtonType.button}
                                    text="Add Cheque"
                                    variant={ButtonVariant.primary}
                                    size={ButtonSize.small}
                                    onClick={() => {
                                        const remainingAmount = calculateRemainingReceivableAmount();
                                        setChequeDetails({
                                            ...chequeDetails,
                                            cheque_amount: remainingAmount > 0 ? remainingAmount : 0
                                        });
                                        setChequeModal(true);
                                    }}
                                />

                            </div>
                            <table>
                                <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Cheque #</th>
                                    <th>Bank</th>
                                    <th>Amount</th>
                                    <th>Cheque Date</th>
                                    <th>Is PDC</th>
                                    <th>Action</th>
                                </tr>
                                </thead>
                                <tbody>
                                {chequeList.length > 0
                                    ? (chequeList.map((cheque: any, index: number) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{cheque.cheque_number}</td>
                                            <td>{bankOptions?.find((bank: any) => bank.value === cheque.bank_id)?.label}</td>
                                            <td>{cheque.cheque_amount}</td>
                                            <td>{cheque.cheque_date}</td>
                                            <td>{cheque.is_pdc === 1 ? 'Yes' : 'No'}</td>
                                            <td>
                                                <Button
                                                    type={ButtonType.button}
                                                    text="Remove"
                                                    variant={ButtonVariant.danger}
                                                    size={ButtonSize.small}
                                                    onClick={() => handleRemoveCheque(index)}
                                                />
                                            </td>
                                        </tr>
                                    ))) : (
                                        <tr>
                                            <td colSpan={8} className="text-center">No Cheques Added</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Tab.Panel>
                </Tab.Panels>
            </Tab.Group>
            <div className="flex justify-between items-center mt-3">
                <div className="flex gap-3 items-center">
                    <h3 className="text-md">Receivable Amount: </h3>
                    <h3 className="text-lg font-bold">{receivableAmount.toFixed(2)}</h3>
                </div>
                <div className="flex gap-3 items-center">
                    <h3 className="text-md">Receiving Amount: </h3>
                    <h3 className="text-lg font-bold">{receivingAmount.toFixed(2)}</h3>
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
            <Modal
                title="Add Cheque"
                show={chequeModal}
                setShow={setChequeModal}
                footer={
                    <div className="flex justify-end items-center gap-3">
                        <Button
                            type={ButtonType.button}
                            text="Cancel"
                            variant={ButtonVariant.secondary}
                            onClick={() => {
                                setChequeModal(false);
                                setChequeDetails({});
                            }}
                        />
                        <Button
                            type={ButtonType.button}
                            text="Add Cheque"
                            variant={ButtonVariant.primary}
                            onClick={handleAddCheque}
                        />
                    </div>
                }
            >
                <div className="flex items-end w-full gap-1">
                    <Dropdown
                        divClasses="w-full"
                        label="Bank"
                        name="bank_id"
                        value={chequeDetails.bank_id}
                        options={bankOptions}
                        onChange={(e) => {
                            if (e && typeof e !== 'undefined') {
                                setChequeDetails((prev: any) => ({
                                    ...prev,
                                    bank_id: e.value
                                }));
                            } else {
                                setChequeDetails((prev: any) => ({
                                    ...prev,
                                    bank_id: ''
                                }));
                            }
                        }}
                    />
                    <Button
                        type={ButtonType.button}
                        text={<PlusCircleIcon size={18} />}
                        variant={ButtonVariant.primary}
                        onClick={() => setBankModal(true)}
                    />
                </div>
                <Input
                    divClasses="w-full"
                    label="Cheque #"
                    type="text"
                    name="cheque_number"
                    value={chequeDetails.cheque_number}
                    onChange={(e) => setChequeDetails((prev: any) => ({
                        ...prev,
                        cheque_number: e.target.value
                    }))}
                    placeholder="Enter Cheque Number"
                    isMasked={false}
                />
                <Input
                    divClasses="w-full"
                    label="Cheque Name"
                    type="text"
                    name="cheque_name"
                    value={chequeDetails.cheque_name}
                    onChange={(e) => setChequeDetails((prev: any) => ({
                        ...prev,
                        cheque_name: e.target.value
                    }))}
                    placeholder="Enter Cheque Name"
                    isMasked={false}
                />
                <Input
                    divClasses="w-full"
                    label="Cheque Amount"
                    type="number"
                    step="any"
                    name="cheque_amount"
                    value={chequeDetails.cheque_amount}
                    onChange={(e) => setChequeDetails((prev: any) => ({
                        ...prev,
                        cheque_amount: parseFloat(e.target.value)
                    }))}
                    placeholder="Enter Cheque Amount"
                    isMasked={false}
                />
                <Input
                    divClasses="w-full"
                    label="Cheque Date"
                    type="date"
                    name="cheque_date"
                    value={chequeDetails.cheque_date}
                    onChange={(e) => setChequeDetails((prev: any) => ({
                        ...prev,
                        cheque_date: e[0] ? e[0].toLocaleDateString() : ''
                    }))}
                    placeholder="Enter Cheque Date"
                    isMasked={false}
                />
            </Modal>
            <BankFormModal
                modalOpen={bankModal}
                setModalOpen={setBankModal}
                handleSubmit={(value) => {
                    dispatch(storeBank({
                        name: value.name,
                        phone: value.phone,
                        email: value.email,
                        country_id: value.country_id,
                        state_id: value.state_id,
                        city_id: value.city_id,
                        postal_code: value.postal_code,
                        address: value.address,
                        is_active: value.is_active
                    }));
                }}
            />
        </form>
    );
};

export default PaymentForm;
