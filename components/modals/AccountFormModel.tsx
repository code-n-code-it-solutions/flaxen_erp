import React, {useEffect, useState} from 'react';
import {useSelector} from "react-redux";
import {IRootState, useAppDispatch} from "@/store";
import Modal from "@/components/Modal";
import Button from "@/components/Button";
import {ButtonType, ButtonVariant} from "@/utils/enums";
import {Input} from "@/components/form/Input";
import Textarea from "@/components/form/Textarea";
import {Dropdown} from "@/components/form/Dropdown";
import {clearAccountState, getAccounts, storeAccount, updateAccount} from "@/store/slices/accountSlice";

interface IProps {
    modalOpen: boolean;
    setModalOpen: (value: boolean) => void;
    modalFormData: any;
    setModalFormData?: (value: any) => void;
    accounts?: any[];
}

const AccountFormModel = ({modalOpen, setModalOpen, modalFormData, setModalFormData, accounts}: IProps) => {
    const dispatch = useAppDispatch();
    const {account, success, loading} = useSelector((state: IRootState) => state.account);

    const [formData, setFormData] = useState<any>({});
    const [errors, setErrors] = useState<any>({});
    const [parentOptions, setParentOptions] = useState<any[]>([]);
    const [accountTypes, setAccountTypes] = useState<any>([
        {label: '100 - Asset', value: 1},
        {label: '200 - Liability', value: 2},
        {label: '300 - Equity', value: 3},
        {label: '400 - Revenue', value: 4},
        {label: '500 - Expense', value: 5},
        {label: '600 - Owner', value: 6},
    ]);

    const handleChange = (name: string, value: any, required: boolean) => {
        if (required && !value) {
            setErrors({...errors, [name]: 'This field is required'})
        } else {
            setErrors((prev: any) => {
                delete prev[name];
                return prev;
            })
        }
        switch (name) {
            // case 'parent_id':
            //     if (value && typeof value !== 'undefined') {
            //         setFormData({...formData, 'parent_id': value.value})
            //     } else {
            //         setFormData({...formData, 'parent_id': ''})
            //     }
            //     break;
            case 'account_type':
                if (value && typeof value !== 'undefined') {
                    setFormData({...formData, 'account_type': value.value})
                    setParentOptions(accounts?.filter(account => account.account_type === value.value)
                        .map(account => ({
                            label: `${account.account_code} - ${account.name}`,
                            value: account.id,
                            options: account.children_recursive?.map((child: any) => ({
                                label: `${child.account_code}-${child.name}`,
                                value: child.id
                            })) || []
                        })) || [])
                } else {
                    setFormData({...formData, 'account_type': ''})
                    setParentOptions([])
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
            dispatch(updateAccount({
                id: modalFormData.id,
                accountData: {
                    parent_id: formData.parent_id,
                    account_type: formData.account_type,
                    name: formData.name,
                    opening_balance: formData.opening_balance,
                    description: formData.description
                }
            }))
            dispatch(clearAccountState())
            if (setModalFormData) {
                setModalFormData({})
            }
        } else {
            dispatch(storeAccount(formData))
            dispatch(clearAccountState())
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
                setParentOptions(accounts?.filter(account => account.account_type === modalFormData.account_type)
                    .map(account => ({
                        label: `${account.account_code} - ${account.name}`,
                        value: account.id,
                        options: account.children_recursive?.map((child: any) => ({
                            label: `${child.account_code}-${child.name}`,
                            value: child.id
                        })) || []
                    })) || [])
            } else {
                setParentOptions([]);
            }
        }
    }, [modalOpen]);

    // console.log(modalFormData)

    useEffect(() => {
        if (account && success) {
            setModalOpen(false);
            dispatch(clearAccountState());
            dispatch(getAccounts())
        }
    }, [account, success]);

    return (
        <Modal
            show={modalOpen}
            setShow={setModalOpen}
            title={Object.keys(modalFormData).length > 0 && modalFormData.name ? 'Update Account' : 'Add Account'}
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
                label="Account Type"
                name="account_type"
                options={accountTypes}
                value={formData.account_type}
                onChange={(e) => handleChange("account_type", e, true)}
                required={true}
                errorMessage={errors.account_type}
            />

            <div className="w-full">
                <label htmlFor="parent_id" className="form-label">Parent Account</label>
                <select
                    name="parent_id"
                    id="parent_id"
                    className="form-select"
                    value={formData.parent_id ? formData.parent_id : formData.id}
                    defaultValue={formData.parent_id ? formData.parent_id : formData.id}
                    onChange={(e) => handleChange(e.target.name, e.target.value, e.target.required)}
                >
                    <option value="">Select Parent Account</option>
                    {parentOptions.map((option) => (
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

            {/*<Dropdown*/}
            {/*    key={parentOptions.length}*/}
            {/*    divClasses="w-full"*/}
            {/*    label="Parent Account"*/}
            {/*    name="parent_id"*/}
            {/*    options={parentOptions}*/}
            {/*    value={formData.parent_id}*/}
            {/*    onChange={(e) => handleChange("parent_id", e, true)}*/}
            {/*    required={true}*/}
            {/*    errorMessage={errors.parent_id}*/}
            {/*/>*/}

            <Input
                divClasses="w-full"
                label="Name"
                type="text"
                name="name"
                value={formData.name}
                onChange={(e) => handleChange(e.target.name, e.target.value, e.target.required)}
                placeholder='Account Name'
                isMasked={false}
                required={true}
                errorMessage={errors.name}
            />

            <Input
                divClasses="w-full"
                label="Opening Balance"
                type="number"
                name="opening_balance"
                value={formData.opening_balance}
                onChange={(e) => handleChange(e.target.name, e.target.value, e.target.required)}
                placeholder='Opening Balance'
                isMasked={false}
            />

            <Textarea
                divClasses="w-full"
                label="Description (Optional)"
                name="description"
                value={formData.description}
                onChange={(e) => handleChange(e.target.name, e.target.value, e.target.required)}
                placeholder='Account type description'
                isReactQuill={false}
            />
        </Modal>
    );
};

export default AccountFormModel;
