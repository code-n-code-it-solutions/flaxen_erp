import React, { Fragment, useEffect, useState } from 'react';
import { Input } from '@/components/form/Input';
import { useAppDispatch, useAppSelector } from '@/store';
import { generateCode } from '@/store/slices/utilSlice';
import { setAuthToken, setContentType } from '@/configs/api.config';
import { Dropdown } from '@/components/form/Dropdown';
import Button from '@/components/Button';
import { ButtonSize, ButtonType, ButtonVariant } from '@/utils/enums';
import { calculateDateFromDays } from '@/utils/helper';
import { Tab } from '@headlessui/react';
import Textarea from '@/components/form/Textarea';
import { PlusCircleIcon, Trash2Icon } from 'lucide-react';
import Option from '@/components/form/Option';
import useTransformToSelectOptions from '@/hooks/useTransformToSelectOptions';
import dynamic from 'next/dynamic';
import { getAccountsTypes } from '@/store/slices/accountSlice';
import { getPaymentMethods } from '@/store/slices/paymentMethodSlice';
import { storeBankAccount } from '@/store/slices/bankAccountSlice';
import BankDetailModal from '@/components/modals/BankDetailModal';
import Modal from '@/components/Modal';
import BankFormModal from '@/components/modals/BankFormModal';
import { storeBank } from '@/store/slices/bankSlice';
import Swal from 'sweetalert2';

const TreeSelect = dynamic(() => import('antd/es/tree-select'), { ssr: false });

const PaymentVoucherForm = () => {
    const dispatch = useAppDispatch();
    const accountOptions = useTransformToSelectOptions(useAppSelector(state => state.account).accountTypes);
    const { token } = useAppSelector((state) => state.user);
    const { code } = useAppSelector((state) => state.util);
    const { loading } = useAppSelector((state) => state.generalPaymentVoucher);
    const { paymentMethods } = useAppSelector((state) => state.paymentMethod);
    const { banks } = useAppSelector((state) => state.bank);
    const { bankAccounts } = useAppSelector((state) => state.bankAccount);

    const [chequeModal, setChequeModal] = useState<boolean>(false);
    const [chequeDetails, setChequeDetails] = useState<any>({});
    const [bankAccountOptions, setBankAccountOptions] = useState<any[]>([]);
    const [bankAccountModal, setBankAccountModal] = useState<boolean>(false);
    const [formData, setFormData] = useState<any>({});
    const [errors, setErrors] = useState<any>({});
    const [paymentMethodOptions, setPaymentMethodOptions] = useState<any[]>([]);
    const [chequeList, setChequeList] = useState<any[]>([]);
    const [bankOptions, setBankOptions] = useState<any[]>([]);
    const [cashAmount, setCashAmount] = useState<number>(0);
    const [bankModal, setBankModal] = useState<boolean>(false);
    const [subjectTypeOptions] = useState<any[]>([
        { label: 'Walk In', value: 'walk_in' },
        { label: 'Customers', value: 'App\\Models\\Customer' },
        { label: 'Vendors', value: 'App\\Models\\Vendor' },
        { label: 'Employees', value: 'App\\Models\\User' }
    ]);

    const [subjectOptions, setSubjectOptions] = useState<any[]>([]);
    const [paymentItems, setPaymentItems] = useState<any[]>([]);

    const handleChange = (name: string, value: any, required: boolean) => {
        if (required && value === '') {
            setErrors({ ...errors, [name]: 'This field is required' });
        } else {
            setErrors((err: any) => {
                delete err[name];
                return err;
            });
        }
        setFormData({ ...formData, [name]: value });
    };

    const handleAddAccount = (value: any) => {
        let finalData = {
            ...value,
            account_of: 2,
            account_of_id: formData.customer_id
        };
        dispatch(storeBankAccount(finalData));
    };

    const handleAddCheque = () => {
        if (paymentItems.length === 0) {
            Swal.fire({
                icon: 'error',
                title: 'No Payment Items',
                text: 'Please add payment items before adding cheques.'
            });
            return;
        }

        const totalChequeAmount = chequeDetails.cheque_amount;
        const totalGrandTotal = paymentItems.reduce((sum: number, item: any) => sum + item.grand_total, 0);
        const totalChequeListAmount = chequeList.reduce((sum: number, cheque: any) => sum + cheque.cheque_amount, 0);

        if (totalChequeListAmount + totalChequeAmount > totalGrandTotal) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'The total cheque amount exceeds the total payment items grand total. Please check the cheques and try again.'
            });
            return;
        }

        setChequeList((prevCheques) => [...prevCheques, chequeDetails]);
        setChequeModal(false);
        setChequeDetails({});
    };

    const handleRemoveCheque = (index: number) => {
        const newChequeList = chequeList.filter((_, i) => i !== index);
        setChequeList(newChequeList);
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();
        setAuthToken(token);
        console.log(formData);
    };

    useEffect(() => {
        setAuthToken(token);
        setContentType('application/json');
        dispatch(generateCode('general_payment_voucher'));
        setFormData({ payment_date: calculateDateFromDays(0) });
        dispatch(getAccountsTypes({}));
        dispatch(getPaymentMethods());
    }, [dispatch, token]);

    useEffect(() => {
        if (code) {
            setFormData({ ...formData, payment_voucher_code: code['general_payment_voucher'] });
        }
    }, [code]);

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
        if (bankAccounts) {
            setBankAccountOptions(bankAccounts.map((account: any) => ({
                value: account.id,
                label: account.account_number + ' (' + account.bank.name + ')'
            })));
        }
    }, [bankAccounts]);

    const handleRemoveItem = (item: any) => {
        setPaymentItems(paymentItems.filter((paymentItem) => paymentItem.id !== item.id));
    };

    const updatePaymentItem = (id: number, updatedValues: any) => {
        setPaymentItems((prevItems) =>
            prevItems.map((item) => (item.id === id ? { ...item, ...updatedValues } : item))
        );
    };

    const calculateSubTotal = (item: any) => item.quantity * item.amount;
    const calculateTax = (item: any) => (item.has_tax ? calculateSubTotal(item) * 0.05 : 0);
    const calculateGrandTotal = (item: any) => calculateSubTotal(item) - item.discount + calculateTax(item);

    useEffect(() => {
        console.log(formData);
    }, [formData]);

    return (
        <form onSubmit={handleSubmit}>
            <Input
                divClasses="w-full md:w-1/2"
                className="text-xl font-light py-3"
                label="GPV Code"
                type="text"
                name="payment_voucher_code"
                value={formData.payment_voucher_code}
                onChange={(e) => handleChange(e.target.name, e.target.value, e.target.required)}
                isMasked={false}
                disabled
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 my-3">
                <Dropdown
                    divClasses="w-full"
                    label="Payment Method"
                    name="payment_method_id"
                    options={paymentMethodOptions}
                    value={formData.payment_method_id}
                    onChange={(e) => handleChange('payment_method_id', e?.value || '', true)}
                    errorMessage={errors.payment_method}
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

                <Input
                    divClasses="w-full"
                    label="Reference No"
                    type="text"
                    name="reference_no"
                    value={formData.reference_no}
                    onChange={(e) => handleChange('reference_no', e.target.value, true)}
                    placeholder="Enter Reference No"
                    isMasked={false}
                    errorMessage={errors.reference_no}
                />

                <Dropdown
                    divClasses="w-full"
                    label="Payment To Category"
                    name="subject_type"
                    options={subjectTypeOptions}
                    value={formData.subject_type}
                    onChange={(e) => handleChange('subject_type', e?.value || '', true)}
                    errorMessage={errors.subject_type}
                />
                {formData.subject_type === 'walk_in'
                    ? (
                        <>
                            <Input
                                divClasses="w-full"
                                label="Name"
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value, true)}
                                placeholder="Enter Name"
                                isMasked={false}
                                errorMessage={errors.name}
                            />
                            <Input
                                divClasses="w-full"
                                label="Email"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={(e) => handleChange('email', e.target.value, true)}
                                placeholder="Enter Email"
                                isMasked={false}
                                errorMessage={errors.email}
                            />
                            <Input
                                divClasses="w-full"
                                label="Phone Number"
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={(e) => handleChange('phone', e.target.value, true)}
                                placeholder="Enter Phone number"
                                isMasked={false}
                                errorMessage={errors.phone}
                            />
                        </>
                    )
                    : (
                        <Dropdown
                            divClasses="w-full"
                            label="Payment To"
                            name="subject_id"
                            options={subjectOptions}
                            value={formData.subject_id}
                            onChange={(e) => handleChange('subject_id', e?.value || '', true)}
                            errorMessage={errors.subject_id}
                        />
                    )}
                <Input
                    divClasses="w-full"
                    label="Payment Date"
                    type="date"
                    name="payment_date"
                    value={formData.payment_date}
                    onChange={(e) => handleChange('payment_date', e[0] ? e[0].toLocaleDateString() : '', true)}
                    placeholder="Enter Payment Date"
                    isMasked={false}
                    errorMessage={errors.payment_date}
                />
                <div>
                    <label>Paying Account</label>
                    <TreeSelect
                        showSearch
                        style={{ width: '100%' }}
                        value={formData.paying_account_id}
                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                        placeholder="Please select paying account"
                        allowClear
                        treeDefaultExpandAll
                        onChange={(e) => handleChange('paying_account_id', e, true)}
                        treeData={accountOptions}
                    />
                    {errors.paying_account_id && <span className="text-red-500">{errors.paying_account_id}</span>}
                </div>
                <Textarea
                    divClasses="w-full col-span-2"
                    label="Narration"
                    name="description"
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value, false)}
                    isReactQuill={false}
                />
            </div>

            <Tab.Group>
                <Tab.List className="mt-3 flex flex-wrap border-b border-white-light dark:border-[#191e3a]">
                    <Tab as={Fragment}>
                        {({ selected }) => (
                            <button
                                className={`${
                                    selected ? '!border-white-light !border-b-white text-primary !outline-none dark:!border-[#191e3a] dark:!border-b-black' : ''
                                } -mb-[1px] block border border-transparent p-3.5 py-2 hover:text-primary dark:hover:border-b-black`}
                            >
                                Details
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
                <Tab.Panels className="rounded-none">
                    <Tab.Panel>
                        <div className="table-responsive mt-3 active">
                            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-3">
                                <h4 className="text-lg font-bold">Payment Details</h4>
                                <Button
                                    type={ButtonType.button}
                                    text="Add"
                                    variant={ButtonVariant.primary}
                                    size={ButtonSize.small}
                                    onClick={() => {
                                        setPaymentItems((prev) => [
                                            ...prev,
                                            {
                                                id: prev.length ? prev[prev.length - 1].id + 1 : 1,
                                                payment_for: '',
                                                quantity: 0,
                                                amount: 0,
                                                sub_total: 0,
                                                discount: 0,
                                                has_tax: 0,
                                                tax_category_id: '',
                                                tax_rate: 0,
                                                tax_amount: 0,
                                                grand_total: 0
                                            }
                                        ]);
                                    }}
                                />
                            </div>
                            <table>
                                <thead>
                                <tr>
                                    <th>Payment For</th>
                                    <th>Qty</th>
                                    <th>Amount</th>
                                    <th>Before Tax</th>
                                    <th>Discount</th>
                                    <th>VAT@5%</th>
                                    <th>Total</th>
                                </tr>
                                </thead>
                                <tbody>
                                {paymentItems.length > 0 ? (
                                    paymentItems.map((item, index: number) => (
                                        <tr key={index}>
                                            <td>
                                                <div className="flex items-center gap-1">
                                                    <Button
                                                        type={ButtonType.button}
                                                        text={<Trash2Icon size={18} />}
                                                        variant={ButtonVariant.danger}
                                                        size={ButtonSize.small}
                                                        onClick={() => handleRemoveItem(item)}
                                                    />
                                                    <Input
                                                        type="text"
                                                        name="payment_for"
                                                        value={item.payment_for}
                                                        onChange={(e) => updatePaymentItem(item.id, { payment_for: e.target.value })}
                                                        isMasked={false}
                                                    />
                                                </div>
                                            </td>
                                            <td>
                                                <Input
                                                    type="number"
                                                    name="quantity"
                                                    value={item.quantity}
                                                    onChange={(e) => {
                                                        const value = parseFloat(e.target.value);
                                                        updatePaymentItem(item.id, {
                                                            quantity: value,
                                                            sub_total: calculateSubTotal({ ...item, quantity: value }),
                                                            grand_total: calculateGrandTotal({
                                                                ...item,
                                                                quantity: value
                                                            })
                                                        });
                                                    }}
                                                    isMasked={false}
                                                />
                                            </td>
                                            <td>
                                                <Input
                                                    type="number"
                                                    name="amount"
                                                    value={item.amount}
                                                    onChange={(e) => {
                                                        const value = parseFloat(e.target.value);
                                                        updatePaymentItem(item.id, {
                                                            amount: value,
                                                            sub_total: calculateSubTotal({ ...item, amount: value }),
                                                            grand_total: calculateGrandTotal({ ...item, amount: value })
                                                        });
                                                    }}
                                                    isMasked={false}
                                                />
                                            </td>
                                            <td>{item.sub_total}</td>
                                            <td>
                                                <Input
                                                    type="number"
                                                    name="discount"
                                                    value={item.discount}
                                                    onChange={(e) => {
                                                        const value = parseFloat(e.target.value);
                                                        updatePaymentItem(item.id, {
                                                            discount: value,
                                                            grand_total: calculateGrandTotal({
                                                                ...item,
                                                                discount: value
                                                            })
                                                        });
                                                    }}
                                                    isMasked={false}
                                                />
                                            </td>
                                            <td>
                                                <div className="flex items-center gap-1">
                                                    <Option
                                                        type="checkbox"
                                                        name="has_tax"
                                                        value="1"
                                                        defaultChecked={item.has_tax}
                                                        onChange={(e) => {
                                                            const isChecked = e.target.checked;
                                                            updatePaymentItem(item.id, {
                                                                has_tax: isChecked ? 1 : 0,
                                                                tax_amount: calculateTax({
                                                                    ...item,
                                                                    has_tax: isChecked ? 1 : 0
                                                                }),
                                                                grand_total: calculateGrandTotal({
                                                                    ...item,
                                                                    has_tax: isChecked ? 1 : 0
                                                                })
                                                            });
                                                        }}
                                                    />
                                                    {item.has_tax && <span>{calculateTax(item)}</span>}
                                                </div>
                                            </td>
                                            <td>{item.grand_total}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="text-center">No items found</td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    </Tab.Panel>
                    <Tab.Panel>
                        <div className="table-responsive mt-3">
                            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-3">
                                <h3 className="font-bold text-md">Cheques</h3>
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
                </Tab.Panels>
            </Tab.Group>
            <div className="flex justify-center items-center mt-5">
                <Button
                    type={ButtonType.submit}
                    text={loading ? 'Loading...' : 'Save'}
                    disabled={loading}
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

export default PaymentVoucherForm;
