import React, {useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from "@/store";
import Modal from "@/components/Modal";
import Button from "@/components/Button";
import {ButtonType, ButtonVariant} from "@/utils/enums";
import {Input} from "@/components/form/Input";
import Textarea from "@/components/form/Textarea";
import {Dropdown} from "@/components/form/Dropdown";
import {getAccounts} from "@/store/slices/accountSlice";
import {
    clearTransactionState,
    getTransactions,
    storeTransaction,
    updateTransaction
} from "@/store/slices/transactionSlice";
import {setAuthToken} from "@/configs/api.config";

interface IProps {
    modalOpen: boolean;
    setModalOpen: (value: boolean) => void;
    modalFormData?: any;
    setModalFormData?: (value: any) => void;
    isOwner?: boolean;
    accounts?: any[];
}

const FundAddFormModal = ({
                              modalOpen,
                              setModalOpen,
                              modalFormData,
                              setModalFormData,
                              accounts,
                              isOwner = true
                          }: IProps) => {
    const dispatch = useAppDispatch();
    const {transaction, success, loading} = useAppSelector((state) => state.transaction);

    const [formData, setFormData] = useState<any>({});
    const [errors, setErrors] = useState<any>({});
    const [accountListFrom, setAccountListFrom] = useState<any[]>([]);
    const [accountListTo, setAccountListTo] = useState<any[]>([]);
    const [accountTypesFrom, setAccountTypesFrom] = useState<any>([]);
    const [accountTypesTo, setAccountTypesTo] = useState<any>([]);

    const transactionAddingOptions = [
        {label: '600 - Owner', value: 6},
    ]

    const transactionTransferOptions = [
        {label: '100 - Asset', value: 1},
        {label: '200 - Liability', value: 2},
        {label: '300 - Equity', value: 3},
        {label: '400 - Revenue', value: 4},
        {label: '500 - Expense', value: 5},
        {label: '600 - Owner', value: 6},
    ]

    const [transactionType, setTransactionType] = useState<any>([
        {label: 'Credit', value: 'credit'},
        {label: 'Debit', value: 'debit'},
    ]);

    const [transactionNature, setTransactionNature] = useState<any>([
        {label: 'Add', value: 'add'},
        {label: 'Transfer', value: 'transfer'},
    ]);

    const handleChange = (name: string, value: any, required: boolean) => {
        if (required && !value) {
            setErrors({...errors, [name]: 'This field is required'})
            return;
        } else {
            setErrors((prev: any) => {
                delete prev[name];
                return prev;
            })
        }
        switch (name) {
            case 'account_type_from':
                if (value && typeof value !== 'undefined') {
                    setFormData({...formData, 'account_type': value.value})
                    setAccountListFrom(accounts?.filter(account => account.account_type === value.value)
                        .map(account => ({
                            label: `${account.account_code} - ${account.name}`,
                            value: account.id,
                            options: account.children_recursive?.map((child: any) => ({
                                label: `${child.account_code}-${child.name}`,
                                value: child.id
                            })) || []
                        })) || [])
                } else {
                    setFormData({...formData, 'account_type_from': ''})
                    setAccountListFrom([])
                }
                break;
            case 'account_type_to':
                if (value && typeof value !== 'undefined') {
                    console.log(value)
                    setFormData({...formData, 'account_type': value.value})
                    setAccountListTo(accounts?.filter(account => account.account_type === value.value)
                        .map(account => ({
                            label: `${account.account_code} - ${account.name}`,
                            value: account.id,
                            options: account.children_recursive?.map((child: any) => ({
                                label: `${child.account_code}-${child.name}`,
                                value: child.id
                            })) || []
                        })) || [])
                } else {
                    setFormData({...formData, 'account_type_from': ''})
                    setAccountListFrom([])
                }
                break;
            case 'nature':
                if (value && typeof value !== 'undefined') {
                    setFormData({...formData, 'nature': value.value})
                    if (value.value === 'add') {
                        setAccountTypesFrom(transactionAddingOptions)
                        setAccountTypesTo(transactionAddingOptions)
                    } else {
                        setAccountTypesFrom(transactionTransferOptions)
                        setAccountTypesTo(transactionTransferOptions)
                    }
                } else {
                    setFormData({...formData, 'nature': ''})
                    setAccountTypesFrom([])
                    setAccountTypesTo([])
                    setAccountListFrom([])
                    setAccountListTo([])
                }
                break;
            default:
                setFormData({...formData, [name]: value})
                break;
        }

    }

    const handleSubmit = () => {
        // let formErrors = {...errors};
        // Object.keys(formData).forEach((key) => {
        //     if (!formData[key]) {
        //         formErrors[key] = 'This field is required'
        //     }
        // })
        // setErrors(formErrors);
        // console.log(formErrors)
        // if (Object.keys(formErrors).length === 0) {
        if (Object.keys(modalFormData).length > 0 && modalFormData.name) {
            dispatch(updateTransaction({
                id: modalFormData.id,
                accountData: {
                    nature: formData.nature,
                    account_from_id: formData.account_from_id,
                    account_to_id: formData.account_to_id,
                    amount: formData.amount,
                    type: formData.type,
                    description: formData.description,
                }
            }))
            dispatch(clearTransactionState())
            if (setModalFormData) {
                setModalFormData({})
            }
        } else {
            dispatch(storeTransaction({
                nature: formData.nature,
                account_from_id: formData.account_from_id,
                account_to_id: formData.account_to_id,
                amount: formData.amount,
                type: formData.type,
                description: formData.description,
            }))
            dispatch(clearTransactionState())
            if (setModalFormData) {
                setModalFormData({})
            }
        }
        // }
    }

    useEffect(() => {
        if (modalOpen) {
            setFormData(modalFormData);
            if (Object.keys(modalFormData || {}).length > 0) {
                setAccountTypesFrom(accounts?.filter(account => account.account_type === modalFormData.account_type_from)
                    .map(account => ({
                        label: `${account.account_code} - ${account.name}`,
                        value: account.id,
                        options: account.children_recursive?.map((child: any) => ({
                            label: `${child.account_code}-${child.name}`,
                            value: child.id
                        })) || []
                    })) || [])

                setAccountTypesTo(accounts?.filter(account => account.account_type === modalFormData.account_type_to)
                    .map(account => ({
                        label: `${account.account_code} - ${account.name}`,
                        value: account.id,
                        options: account.children_recursive?.map((child: any) => ({
                            label: `${child.account_code}-${child.name}`,
                            value: child.id
                        })) || []
                    })) || [])
            } else {
                setAccountTypesTo([]);
            }
        }
    }, [modalOpen]);

    // console.log(modalFormData)

    useEffect(() => {
        if (transaction && success) {
            setModalOpen(false);
            dispatch(clearTransactionState());
            dispatch(getTransactions())
        }
    }, [transaction, success]);

    return (
        <Modal
            show={modalOpen}
            setShow={setModalOpen}
            title={Object.keys(modalFormData).length > 0 && modalFormData.name ? 'Update Fund' : 'Add/Transfer Fund'}
            footer={(
                <div className="mt-8 gap-3 flex items-center justify-end">
                    <Button
                        type={ButtonType.button}
                        text="Discard"
                        variant={ButtonVariant.secondary}
                        onClick={() => setModalOpen(false)}
                    />
                    <Button
                        type={ButtonType.button}
                        text={Object.keys(modalFormData).length > 0 && modalFormData.name ? 'Update' : 'Add'}
                        variant={ButtonVariant.primary}
                        onClick={() => handleSubmit()}
                    />
                </div>
            )}
        >
            <Dropdown
                divClasses="w-full"
                label="Transaction Nature"
                name="nature"
                options={transactionNature}
                value={formData.nature}
                onChange={(e) => handleChange("nature", e, true)}
                required={true}
                errorMessage={errors.nature}
            />

            <div className="border rounded p-2" hidden={formData.nature === 'add' || !formData.nature}>
                <label className="border-b">Transfer From</label>
                <div className="flex items-center gap-3">
                    <Dropdown
                        divClasses="w-full"
                        label="Account Type"
                        name="account_type_from"
                        options={accountTypesFrom}
                        value={formData.account_type_from}
                        onChange={(e) => handleChange("account_type_from", e, true)}
                        required={true}
                        errorMessage={errors.account_type_from}
                    />

                    <div className="w-full">
                        <label htmlFor="account_from_id" className="form-label">Account</label>
                        <select
                            name="account_from_id"
                            id="account_from_id"
                            className="form-select"
                            value={formData.account_from_id ? formData.account_from_id : formData.id}
                            defaultValue={formData.account_from_id ? formData.account_from_id : formData.id}
                            onChange={(e) => handleChange(e.target.name, e.target.value, e.target.required)}
                        >
                            <option value="">Select Parent Account</option>
                            {accountListFrom.map((option) => (
                                option.options.length === 0
                                    ? <option key={option.value} value={option.value}>{option.label}</option>
                                    : <optgroup key={option.value} label={option.label}>
                                        <option value={option.value}>{option.label}</option>
                                        {option.options.map((child: any) => (
                                            <option key={child.value} value={child.value}>{child.label}</option>
                                        ))}
                                    </optgroup>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
            <div className="border rounded p-2">
                <label className="border-b">Transfer To</label>
                <div className="flex items-center gap-3">
                    <Dropdown
                        divClasses="w-full"
                        label="Account Type"
                        name="account_type_to"
                        options={accountTypesTo}
                        value={formData.account_type_to}
                        onChange={(e) => handleChange("account_type_to", e, true)}
                        required={true}
                        errorMessage={errors.account_type_to}
                    />

                    <div className="w-full">
                        <label htmlFor="account_to_id" className="form-label">Account</label>
                        <select
                            name="account_to_id"
                            id="account_to_id"
                            className="form-select"
                            value={formData.account_to_id ? formData.account_to_id : formData.id}
                            defaultValue={formData.account_to_id ? formData.account_to_id : formData.id}
                            onChange={(e) => handleChange(e.target.name, e.target.value, e.target.required)}
                        >
                            <option value="">Select Parent Account</option>
                            {accountListTo.map((option) => (
                                option.options.length === 0
                                    ? <option key={option.value} value={option.value}>{option.label}</option>
                                    : <optgroup key={option.value} label={option.label}>
                                        <option value={option.value}>{option.label}</option>
                                        {option.options.map((child: any) => (
                                            <option key={child.value} value={child.value}>{child.label}</option>
                                        ))}
                                    </optgroup>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <Input
                divClasses="w-full"
                label="Amount"
                type="number"
                name="amount"
                value={formData.amount}
                onChange={(e) => handleChange(e.target.name, e.target.value, e.target.required)}
                placeholder='Amount'
                isMasked={false}
            />

            {/*<div className="w-full" hidden={formData.nature === 'add' || !formData.nature}>*/}
            {/*    <Dropdown*/}
            {/*        divClasses="w-full"*/}
            {/*        label="Transaction Type"*/}
            {/*        name="type"*/}
            {/*        options={transactionType}*/}
            {/*        value={formData.type}*/}
            {/*        onChange={(e) => handleChange("type", e, true)}*/}
            {/*        required={true}*/}
            {/*        errorMessage={errors.type}*/}
            {/*    />*/}
            {/*</div>*/}
            <Textarea
                divClasses="w-full"
                label="Description (Optional)"
                name="description"
                value={formData.description}
                onChange={(e) => handleChange(e.target.name, e.target.value, e.target.required)}
                placeholder='fund description'
                isReactQuill={false}
            />
        </Modal>
    );
};

export default FundAddFormModal;
