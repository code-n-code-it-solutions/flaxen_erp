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
import { Trash2Icon } from 'lucide-react';
import Option from '@/components/form/Option';
import useTransformToSelectOptions from '@/hooks/useTransformToSelectOptions';
import dynamic from 'next/dynamic';
import { getAccountsTypes } from '@/store/slices/accountSlice';

const TreeSelect = dynamic(() => import('antd/es/tree-select'), { ssr: false });

const ReceiptVoucherForm = () => {
    const dispatch = useAppDispatch();
    const accountOptions = useTransformToSelectOptions(useAppSelector(state => state.account).accountTypes);
    const { token } = useAppSelector((state) => state.user);
    const { code } = useAppSelector((state) => state.util);
    const { loading } = useAppSelector((state) => state.generalPaymentVoucher);

    const [formData, setFormData] = useState<any>({});
    const [errors, setErrors] = useState<any>({});
    const [subjectTypeOptions] = useState<any[]>([
        { label: 'Custom', value: 'custom' },
        { label: 'Customers', value: 'App\\Models\\Customer' },
        { label: 'Vendors', value: 'App\\Models\\Vendor' },
        { label: 'Employees', value: 'App\\Models\\User' }
    ]);

    const [paymentMethodOptions] = useState<any[]>([
        { label: 'Transfer', value: 'transfer' },
        { label: 'Cheque', value: 'cheque' },
        { label: 'Card', value: 'card' },
        { label: 'Cash', value: 'cash' }
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

    const handleSubmit = (e: any) => {
        e.preventDefault();
        setAuthToken(token);
        console.log(formData);
    };

    useEffect(() => {
        setAuthToken(token);
        setContentType('application/json');
        dispatch(generateCode('receipt_voucher_code'));
        setFormData({ received_date: calculateDateFromDays(0) });
        dispatch(getAccountsTypes({}));
    }, [dispatch, token]);

    useEffect(() => {
        if (code) {
            setFormData({ ...formData, payment_voucher_code: code['receipt_voucher_code'] });
        }
    }, [code]);

    const handleRemoveItem = (item: any) => {
        setPaymentItems(paymentItems.filter((creditNoteItem) => creditNoteItem.id !== item.id));
    };

    const updatePaymentItem = (id: number, updatedValues: any) => {
        setPaymentItems((prevItems) =>
            prevItems.map((item) => (item.id === id ? { ...item, ...updatedValues } : item))
        );
    };

    const calculateSubTotal = (item: any) => item.quantity * item.amount;
    const calculateTax = (item: any) => (item.has_tax ? calculateSubTotal(item) * 0.05 : 0);
    const calculateGrandTotal = (item: any) => calculateSubTotal(item) - item.discount + calculateTax(item);

    return (
        <form onSubmit={handleSubmit}>
            <Input
                divClasses="w-full md:w-1/2"
                className="text-xl font-light py-3"
                label="GRV Code"
                type="text"
                name="receipt_voucher_code"
                value={formData.receipt_voucher_code}
                onChange={(e) => handleChange(e.target.name, e.target.value, e.target.required)}
                isMasked={false}
                disabled
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 my-3">
                <Dropdown
                    divClasses="w-full"
                    label="Payment Method"
                    name="payment_method"
                    options={paymentMethodOptions}
                    value={formData.payment_method}
                    onChange={(e) => handleChange('payment_method', e?.value || '', true)}
                    errorMessage={errors.payment_method}
                />

                <Input
                    divClasses="w-full"
                    label="Reference No (Card/Cheque/Bill/Transfer)"
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
                {formData.subject_type === 'custom'
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
                            label="Received From To"
                            name="subject_id"
                            options={subjectOptions}
                            value={formData.subject_id}
                            onChange={(e) => handleChange('subject_id', e?.value || '', true)}
                            errorMessage={errors.subject_id}
                        />
                    )}
                <Input
                    divClasses="w-full"
                    label="Receiving Date"
                    type="date"
                    name="received_date"
                    value={formData.received_date}
                    onChange={(e) => handleChange('received_date', e[0] ? e[0].toLocaleDateString() : '', true)}
                    placeholder="Enter Received Date"
                    isMasked={false}
                    errorMessage={errors.received_date}
                />
                <div>
                    <label>Received To</label>
                    <TreeSelect
                        showSearch
                        style={{ width: '100%' }}
                        value={formData.receiving_account_id}
                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                        placeholder="Please select Receiving account"
                        allowClear
                        treeDefaultExpandAll
                        onChange={(e) => handleChange('receiving_account_id', e, true)}
                        treeData={accountOptions}
                    />
                    {errors.receiving_account_id && <span className="text-red-500">{errors.receiving_account_id}</span>}
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
                                                received_for: '',
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
                                    <th>Received For</th>
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
                                                        value={item.received_for}
                                                        onChange={(e) => updatePaymentItem(item.id, { received_for: e.target.value })}
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
        </form>
    );
};

export default ReceiptVoucherForm;
