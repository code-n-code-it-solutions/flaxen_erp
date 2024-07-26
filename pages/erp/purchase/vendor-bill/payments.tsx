import React, {useEffect, useState} from 'react';
import PageWrapper from "@/components/PageWrapper";
import {useAppDispatch, useAppSelector} from "@/store";
import {setAuthToken, setContentType} from "@/configs/api.config";
import {setPageTitle} from "@/store/slices/themeConfigSlice";
import GenericTable from "@/components/GenericTable";
import Button from "@/components/Button";
import {ButtonType, ButtonVariant, IconType} from "@/utils/enums";
import {clearVendorBillState, getVendorBillPayments, storeBillPayments} from "@/store/slices/vendorBillSlice";
import {capitalize} from "lodash";
import IconButton from "@/components/IconButton";
import Modal from "@/components/Modal";
import {Input} from "@/components/form/Input";
import {Dropdown} from "@/components/form/Dropdown";
import {getAccounts} from "@/store/slices/accountSlice";
import Alert from "@/components/Alert";

const Payments = () => {
    const dispatch = useAppDispatch();
    const {token} = useAppSelector(state => state.user);
    const {accounts} = useAppSelector(state => state.account);
    const {payments, loading, success, payment} = useAppSelector(state => state.vendorBill);
    const [rowData, setRowData] = useState([]);
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState<any>({});
    const [accountsList, setAccountsList] = useState<any[]>([]);
    const [formError, setFormError] = useState<string>('')
    const [errorMessages, setErrorMessages] = useState<any>({})

    const [paymentMethodOptions] = useState<any[]>([
        {label: 'Cash', value: 'cash'},
        {label: 'Bank', value: 'bank'},
        {label: 'Cheque', value: 'cheque'},
    ]);

    const [billDetail, setBillDetail] = useState<any>({});
    const breadCrumbItems = [
        {
            title: 'Home',
            href: '/erp/main',
        },
        {
            title: 'Purchase Dashboard',
            href: '/erp/purchase',
        },
        {
            title: 'Vendor Bills',
            href: '/erp/purchase/vendor-bill',
        },
        {
            title: 'Payments',
            href: '#',
        },
    ];

    const [accountTypes, setAccountTypes] = useState<any>([
        {label: '100 - Asset', value: 1},
        {label: '200 - Liability', value: 2},
        {label: '300 - Equity', value: 3},
        {label: '400 - Revenue', value: 4},
        {label: '500 - Expense', value: 5},
        {label: '600 - Owner', value: 6},
    ]);

    useEffect(() => {
        dispatch(setPageTitle('All Vendor Bills Payments'));
        setAuthToken(token)
        setContentType('application/json')
        dispatch(getVendorBillPayments());
        setOpen(false)
        setBillDetail({})
        dispatch(getAccounts())
    }, []);

    useEffect(() => {
        if (payments) {
            setRowData(payments)
        }
    }, [payments]);

    const handleChange = (name: string, value: any, required: boolean) => {
        if (required && !value) {
            setFormError('This field is required')
            setErrorMessages((prev: any) => ({...prev, [name]: 'This field is required'}))
            return;
        } else {
            setErrorMessages((prev: any) => {
                delete prev[name]
                return prev
            })

            if (name === 'payment_amount') {
                if (parseFloat(value) > (billDetail?.bill_amount - billDetail?.vendor_bill_payments?.reduce((acc: any, item: any) => acc + parseFloat(item.payment_amount), 0))) {
                    setFormData((prev: any) => ({
                        ...prev,
                        'payment_amount': (billDetail?.bill_amount - billDetail?.vendor_bill_payments?.reduce((acc: any, item: any) => acc + parseFloat(item.payment_amount), 0))
                    }));
                } else {
                    setFormData((prev: any) => ({...prev, 'payment_amount': parseFloat(value)}));
                }
            } else if (name === 'account_type') {
                setFormData((prev: any) => ({...prev, 'account_type': value}));
                let options = accounts?.filter((account: any) => account.account_type === value)
                    .map((account: any) => {
                        if (account.children_recursive.length > 0) {
                            return account.children_recursive?.map((child: any) => ({
                                label: `${child.account_code}-${child.name} (${child.current_balance.toFixed(2)}/-)`,
                                value: child.id,
                                current_balance: child.current_balance,
                            })) || []
                        } else {
                            return {
                                label: `${account.account_code} - ${account.name} (${account.current_balance.toFixed(2)}/-)`,
                                value: account.id,
                                current_balance: account.current_balance,
                            }
                        }
                    }) || []
                setAccountsList(options)
            } else {
                setFormData((prev: any) => ({...prev, [name]: value}));
            }
        }
    }

    const handleSubmit = () => {
        if (formData.current_balance <= 0) {
            setFormError('Account balance is not sufficient to make this payment')
            setErrorMessages((prev: any) => ({
                ...prev,
                'account_id': 'Account balance is not sufficient to make this payment'
            }))
        } else {
            if (billDetail.id) {
                if (Object.keys(errorMessages).length > 0) {
                    setFormError('Please fill all required fields')
                    return;
                } else {
                    dispatch(storeBillPayments({
                        vendor_bill_id: billDetail.id,
                        account_id: formData.account_id,
                        payment_method: formData.payment_method,
                        payment_reference: formData.payment_reference,
                        payment_amount: formData.payment_amount,
                        payment_date: formData.payment_date
                    }));
                }
            } else {
                setErrorMessages((prev: any) => ({...prev, 'vendor_bill_id': 'Bill not found. Try again'}))
                setFormError('Bill not found. Try again')
            }
        }
    }

    useEffect(() => {
        if (success && payment) {
            setOpen(false);
            dispatch(getVendorBillPayments());
            dispatch(clearVendorBillState());
            setBillDetail({})
        }
    }, [success, payment]);

    return (
        <PageWrapper
            embedLoader={false}
            breadCrumbItems={breadCrumbItems}
            title="All Bill Payments"
        >
            <GenericTable
                rowData={rowData}
                loading={loading}
                exportTitle={'all-payments-' + Date.now()}
                rowStyle={(row: any) => (theme: any) => ({backgroundColor: row.status === 'pending' ? theme.colors.yellow[1] : row.status === 'partial' ? theme.colors.red[1] : row.status === 'paid' ? theme.colors.green[1] : 'auto'})}
                columns={[
                    {
                        title: 'Bill Number',
                        accessor: 'bill_number',
                        sortable: true,
                    },
                    // {
                    //     title: 'Invoice Number',
                    //     accessor: 'invoice_number',
                    //     sortable: true,
                    // },
                    {
                        title: 'GRN Number',
                        accessor: 'good_receive_note.grn_number',
                        sortable: true,
                    },
                    {
                        title: 'Bill Amount',
                        accessor: 'bill_amount',
                        sortable: true,
                        render: (row: any) => (<span>{parseFloat(row.bill_amount).toFixed(2)}</span>)
                    },
                    {
                        title: 'Paid Amount',
                        accessor: 'paid_amount',
                        sortable: true,
                        render: (row: any) => {
                            // console.log(row.vendor_bill_payments.flatMap((item: any) => parseInt(item.payment_amount)))
                            return (
                                <span>
                                    {(row.vendor_bill_payments.reduce((acc: any, item: any) => acc + parseFloat(item.payment_amount.replace(/,/g, '')), 0)).toFixed(2)}
                                </span>
                            )
                        }
                    },
                    {
                        title: 'Balance',
                        accessor: 'balance',
                        sortable: true,
                        render: (row: any) => (
                            <span>
                                {(row.bill_amount - row.vendor_bill_payments.reduce((acc: any, item: any) => acc + parseFloat(item.payment_amount.replace(/,/g, '')), 0)).toFixed(2)}
                            </span>
                        )
                    },
                    {
                        title: 'Status',
                        accessor: 'status',
                        sortable: true,
                        render: (row: any) => (<span
                            className={`badge ${row.status === 'pending' ? 'bg-warning' : row.status === 'partial' ? 'bg-danger' : 'bg-success'}`}>{capitalize((row.status))}</span>)
                    },
                    {
                        accessor: 'actions',
                        title: 'Actions',
                        render: (row: any) => (
                            <div className="flex items-center gap-3">
                                <IconButton
                                    icon={IconType.print}
                                    color={ButtonVariant.secondary}
                                    tooltip="Print"
                                    link={'/erp/purchase/vendor-bill/bill-history/' + row.id}
                                />
                                {(row.status === 'pending' || row.status === 'partial') && (
                                    <IconButton
                                        icon={IconType.edit}
                                        color={ButtonVariant.primary}
                                        tooltip="Add Payment"
                                        onClick={() => {
                                            setBillDetail(row)
                                            setFormData({})
                                            setOpen(true)
                                        }}
                                    />
                                )}
                            </div>
                        )
                    }
                ]}
            />
            <Modal
                show={open}
                setShow={setOpen}
                title="Add Payment"
                footer={
                    <div className="mt-8 flex items-center justify-end gap-2">
                        <Button
                            type={ButtonType.button}
                            text="Discard"
                            variant={ButtonVariant.danger}
                            onClick={() => {
                                setBillDetail({})
                                setFormData({})
                                setOpen(false)
                            }}
                        />

                        <Button
                            type={ButtonType.button}
                            text="Add"
                            variant={ButtonVariant.primary}
                            onClick={() => handleSubmit()}
                        />
                    </div>
                }
            >
                <div>
                    {formError && (
                        <Alert alertType="error" message={formError} setMessages={setFormError}/>
                    )}
                    <div className="flex justify-start items-center m-0 gap-3">
                        <span className="font-bold">Bill Number:</span>
                        <span>{billDetail?.bill_number}</span>
                    </div>
                    <div className="flex justify-start items-center m-0 gap-3">
                        <span className="font-bold">Invoice Number:</span>
                        <span>{billDetail?.invoice_number}</span>
                    </div>
                    <div className="flex justify-start items-center m-0 gap-3">
                        <span className="font-bold">Bill Amount:</span>
                        <span>{parseFloat(billDetail?.bill_amount).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-start items-center m-0 gap-3">
                        <span className="font-bold">Paid Amount:</span>
                        <span>{(billDetail?.vendor_bill_payments?.reduce((acc: any, item: any) => acc + parseFloat(item.payment_amount.replace(/,/g, '')), 0)).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-start items-center m-0 gap-3">
                        <span className="font-bold">Balance Amount:</span>
                        <span>{(billDetail?.bill_amount - billDetail?.vendor_bill_payments?.reduce((acc: any, item: any) => acc + parseFloat(item.payment_amount.replace(/,/g, '')), 0)).toFixed(2)}</span>
                    </div>
                </div>
                <Dropdown
                    divClasses="w-full"
                    label="Payment Method"
                    name="payment_method"
                    options={paymentMethodOptions}
                    value={formData.payment_method}
                    onChange={(e: any) => {
                        if (e && typeof e !== 'undefined') {
                            handleChange('payment_method', e.value, true)
                        } else {
                            handleChange('payment_method', '', true)
                        }
                    }}
                    required={true}
                    errorMessage={errorMessages.payment_method}
                />

                <Dropdown
                    label="Account"
                    name="account_type"
                    options={accountTypes}
                    value={formData.account_type}
                    onChange={(e: any) => {
                        if (e && typeof e !== 'undefined') {
                            handleChange('account_type', e.value, true)
                        } else {
                            handleChange('account_type', '', true)
                        }
                    }}
                    required={true}
                    errorMessage={errorMessages.account_type}
                />
                <Dropdown
                    label="Account"
                    name="account_id"
                    options={accountsList}
                    value={formData.account_id}
                    onChange={(e: any) => {
                        if (e && typeof e !== 'undefined') {
                            handleChange('account_id', e.value, true)
                            setFormData((prev: any) => ({...prev, 'current_balance': e.current_balance}))
                        } else {
                            handleChange('account_id', '', true)
                            setFormData((prev: any) => ({...prev, 'current_balance': 0}))
                        }
                    }}
                    required={true}
                    errorMessage={errorMessages.account_id}
                />

                <Input
                    divClasses="w-full"
                    label="Payment Reference (e.g cheque number, transaction id, etc)"
                    type="text"
                    name="payment_reference"
                    value={formData.payment_reference}
                    onChange={(e) => handleChange(e.target.name, e.target.value, e.target.required)}
                    isMasked={false}
                    required={true}
                    errorMessage={errorMessages.payment_reference}
                />

                <Input
                    divClasses="w-full"
                    label="Payment Amount"
                    type="number"
                    step="any"
                    name="payment_amount"
                    value={formData.payment_amount}
                    onChange={(e) => handleChange(e.target.name, e.target.value, e.target.required)}
                    isMasked={false}
                    required={true}
                    errorMessage={errorMessages.payment_amount}
                />

                <Input
                    divClasses="w-full"
                    label="Payment Date"
                    type="date"
                    name="payment_date"
                    value={formData.payment_date}
                    onChange={(e) => handleChange('payment_date', e[0].toLocaleDateString(), true)}
                    isMasked={false}
                    required={true}
                    errorMessage={errorMessages.payment_date}
                />
            </Modal>
        </PageWrapper>
    );
};

export default Payments;
