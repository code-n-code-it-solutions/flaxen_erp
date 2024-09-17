import React, { Fragment, useEffect, useState } from 'react';
import Button from '@/components/Button';
import { ButtonSize, ButtonType, ButtonVariant } from '@/utils/enums';
import { Input } from '@/components/form/Input';
import { useAppDispatch, useAppSelector } from '@/store';
import { setAuthToken, setContentType } from '@/configs/api.config';
import { clearLatestRecord, generateCode, getLatestRecord } from '@/store/slices/utilSlice';
import Option from '@/components/form/Option';
import { Dropdown } from '@/components/form/Dropdown';
import { getPaymentMethods } from '@/store/slices/paymentMethodSlice';
import { storeVendorPayment } from '@/store/slices/vendorPayments';
import { getVendors } from '@/store/slices/vendorSlice';
import { clearVendorBillState, getPendingVendorBills } from '@/store/slices/vendorBillSlice';
import { Tab } from '@headlessui/react';
import dynamic from 'next/dynamic';
import useTransformToSelectOptions from '@/hooks/useTransformToSelectOptions';
import { getAccountsTypes } from '@/store/slices/accountSlice';
import Modal from '@/components/Modal';
import { clearBankState, getBanks, storeBank } from '@/store/slices/bankSlice';
import { PlusCircleIcon } from 'lucide-react';
import BankFormModal from '@/components/modals/BankFormModal';
import Swal from 'sweetalert2';

const TreeSelect = dynamic(() => import('antd/es/tree-select'), { ssr: false });

const PaymentForm = () => {
    const dispatch = useAppDispatch();
    const accountOptions = useTransformToSelectOptions(useAppSelector(state => state.account).accountTypes);
    const { token } = useAppSelector((state) => state.user);
    const { banks, bank } = useAppSelector((state) => state.bank);
    const { code, latestRecord } = useAppSelector((state) => state.util);
    const { pendingBills, loading } = useAppSelector((state) => state.vendorBill);
    const { allVendors } = useAppSelector((state) => state.vendor);
    const { paymentMethods } = useAppSelector((state) => state.paymentMethod);

    const [formData, setFormData] = useState<any>({});
    const [errors, setErrors] = useState<any>({});
    const [bankOptions, setBankOptions] = useState<any[]>([]);
    const [vendorOptions, setVendorOptions] = useState<any[]>([]);
    const [paymentMethodOptions, setPaymentMethodOptions] = useState<any[]>([]);
    const [bills, setBills] = useState<any[]>([]);
    const [chequeModal, setChequeModal] = useState<boolean>(false);
    const [chequeList, setChequeList] = useState<any[]>([]);
    const [chequeDetails, setChequeDetails] = useState<any>({});
    const [bankModal, setBankModal] = useState<boolean>(false);
    const [totalPaidAmount, setTotalPaidAmount] = useState<number>(0);

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
            return {
                id: bill.id,
                bill_number: bill.bill_number,
                bill_reference: bill.bill_reference,
                bill_date: bill.bill_date,
                due_date: bill.due_date,
                payment_terms: bill.payment_terms,
                total_amount: totalAmount,
                due_amount: bill.vendor_payments?.length > 0 ? (totalAmount - bill.vendor_payments.reduce((acc: number, item: any) => acc + parseFloat(item.paid_amount), 0)) : totalAmount,
                paid_amount: 0,
                cheque_amount: 0,
                cash_amount: 0
            };
        }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        let finalData = {
            ...formData,
            total_paid: bills.reduce((acc: number, item: any) => acc + parseFloat(item.paid_amount), 0),
            payment_details: bills.map((billDetail: any) => ({
                vendor_bill_id: billDetail.id,
                due_amount: billDetail.due_amount,
                paid_amount: billDetail.paid_amount,
                cheque_amount: billDetail.cheque_amount,
                cash_amount: billDetail.cash_amount
            })),
            cheques: chequeList
        };
        dispatch(storeVendorPayment(finalData));
    };

    useEffect(() => {
        setAuthToken(token);
        setContentType('application/json');
        dispatch(generateCode('vendor_bill_payment'));
        dispatch(getVendors());
        dispatch(getPaymentMethods());
        setBills([]);
        setChequeDetails({});
        setFormData({
            ...formData,
            payment_date: new Date()
        });
        dispatch(clearLatestRecord());
        dispatch(getAccountsTypes({}));
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
        if (pendingBills) {
            handleSetBillsList(pendingBills.map((bill: any) => bill));
        }
    }, [pendingBills]);

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

    useEffect(() => {
        if (banks) {
            setBankOptions(banks.map((bank: any) => ({
                value: bank.id,
                label: bank.name
            })));
        }
    }, [banks]);

    useEffect(() => {
        if (bank) {
            dispatch(getBanks());
            setBankModal(false);
            setChequeModal(true);
            dispatch(clearBankState());
        }
    }, [bank]);

    useEffect(() => {
        if (latestRecord) {
            setFormData((prevFormData: any) => ({
                ...prevFormData,
                paying_account_id: latestRecord.paying_account?.code
            }));
        }
    }, [latestRecord]);

    const allocateChequeAmount = (chequeAmount: number) => {
        let remainingAmount = chequeAmount;
        const newBills = bills.map((bill) => {
            if (remainingAmount <= 0) {
                return bill;
            }
            const amountToAllocate = Math.min(bill.due_amount - bill.paid_amount, remainingAmount);
            remainingAmount -= amountToAllocate;
            return {
                ...bill,
                paid_amount: bill.paid_amount + amountToAllocate,
                cheque_amount: bill.cheque_amount + amountToAllocate,
            };
        });
        setBills(newBills);
        return remainingAmount;
    };

    const handleAddCheque = () => {
        const totalChequeAmount = chequeDetails.cheque_amount;
        const totalPaidAmount = bills.reduce((sum, bill) => sum + bill.paid_amount, 0);
        const totalDueAmount = bills.reduce((sum, bill) => sum + bill.due_amount, 0);

        if (totalPaidAmount + totalChequeAmount > totalDueAmount) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'The total cheque amount exceeds the total due amount. Please check the cheques and try again.'
            });
            return;
        }

        const remainingChequeAmount = allocateChequeAmount(totalChequeAmount);
        if (remainingChequeAmount > 0) {
            setTotalPaidAmount((prev) => prev + remainingChequeAmount);
        }
        setChequeList((prevCheques) => [...prevCheques, chequeDetails]);
        setChequeModal(false);
        setChequeDetails({});
    };

    const handleRemoveCheque = (index: number) => {
        const chequeToRemove = chequeList[index];
        const newChequeList = chequeList.filter((_, i) => i !== index);
        setChequeList(newChequeList);

        let remainingAmount = chequeToRemove.cheque_amount;
        const newBills = bills.map((bill) => {
            if (remainingAmount <= 0) {
                return bill;
            }
            const amountToDeallocate = Math.min(bill.cheque_amount, remainingAmount);
            remainingAmount -= amountToDeallocate;
            return {
                ...bill,
                paid_amount: bill.paid_amount - amountToDeallocate,
                cheque_amount: bill.cheque_amount - amountToDeallocate,
            };
        });
        setBills(newBills);
    };

    const handlePaidAmountChange = (index: number, value: number) => {
        const newBills = [...bills];
        const bill = newBills[index];
        const chequeAmount = bill.cheque_amount;

        if (value < chequeAmount) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: `The paid amount cannot be less than the cheque amount (${chequeAmount}).`
            });
            return;
        }

        bill.paid_amount = value;
        bill.cash_amount = value - chequeAmount;
        setBills(newBills);
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
                    <Option
                        label="Internal Transfer"
                        type="checkbox"
                        name="is_internal_transfer"
                        value={formData.is_internal_transfer}
                        defaultChecked={formData.is_internal_transfer === 1}
                        onChange={(e) => handleChange(e.target.name, e.target.checked ? 1 : 0, e.target.required)}
                    />
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
                                setBills([]);
                                dispatch(clearVendorBillState());
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
                                {!loading
                                    ? (bills.map((billDetail: any, index: number) => (
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
                                                    step="any"
                                                    name={`bills[${index}][paid_amount]`}
                                                    value={billDetail.paid_amount}
                                                    onChange={(e) => {
                                                        const paidAmount = parseFloat(e.target.value);
                                                        if (paidAmount > billDetail.due_amount) {
                                                            setErrors({
                                                                ...errors,
                                                                [`bills[${index}][paid_amount]`]: 'Paid amount cannot exceed due amount'
                                                            });
                                                        } else {
                                                            setErrors((prevErrors: any) => {
                                                                const {
                                                                    [`bills[${index}][paid_amount]`]: removedError,
                                                                    ...restErrors
                                                                } = prevErrors;
                                                                return restErrors;
                                                            });
                                                        }
                                                        handlePaidAmountChange(index, paidAmount);
                                                    }}
                                                    placeholder="Enter Paid Amount"
                                                    isMasked={false}
                                                />
                                                {errors[`bills[${index}][paid_amount]`] && (
                                                    <div
                                                        className="text-red-500 text-xs">{errors[`bills[${index}][paid_amount]`]}</div>
                                                )}
                                            </td>
                                        </tr>
                                    ))) : (
                                        <tr>
                                            <td colSpan={7} className="text-center">Loading...</td>
                                        </tr>
                                    )}
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
                                        dispatch(getLatestRecord('vendor-bill-payments'));
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
                                            <label>Paying Account</label>
                                            <TreeSelect
                                                showSearch
                                                style={{ width: '100%' }}
                                                value={latestRecord ? latestRecord.paying_account?.code : formData.paying_account_id}
                                                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                                placeholder="Please select paying account"
                                                allowClear
                                                treeDefaultExpandAll
                                                onChange={(e) => handleChange('paying_account_id', e, true)}
                                                treeData={accountOptions}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Tab.Panel>
                    {formData.payment_sub_method === 'cheque' && (
                        <Tab.Panel>
                            <div className="table-responsive my-5">
                                <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                                    <h3 className="font-bold text-lg mb-5">Cheques</h3>
                                    <Button
                                        type={ButtonType.button}
                                        text="Add Cheque"
                                        variant={ButtonVariant.primary}
                                        size={ButtonSize.small}
                                        onClick={() => {
                                            setChequeModal(true);
                                            setChequeDetails({});
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
                                        <th>PDC Date</th>
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
                                                <td>{cheque.pdc_date}</td>
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
                    )}
                </Tab.Panels>
            </Tab.Group>
            <div className="flex justify-center items-center mt-3">
                <Button
                    type={ButtonType.submit}
                    text="Confirm Payment"
                    variant={ButtonVariant.primary}
                />
            </div>

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
                <Option
                    divClasses="mb-5"
                    label="Is PDC"
                    type="checkbox"
                    name="is_pdc"
                    value="1"
                    defaultChecked={chequeDetails.is_pdc === 1}
                    onChange={(e) => {
                        setChequeDetails((prev: any) => ({
                            ...prev,
                            is_pdc: e.target.checked ? 1 : 0
                        }));
                    }}
                />
                {chequeDetails.is_pdc === 1 && (
                    <Input
                        divClasses="w-full"
                        label="PDC Date"
                        type="date"
                        name="pdc_date"
                        value={chequeDetails.pdc_date}
                        onChange={(e) => setChequeDetails((prev: any) => ({
                            ...prev,
                            pdc_date: e[0] ? e[0].toLocaleDateString() : ''
                        }))
                        }
                        placeholder="Enter PDC Date"
                        isMasked={false}
                    />
                )}
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
