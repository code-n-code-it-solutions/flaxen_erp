import React, { useEffect } from 'react';
import { Dropdown } from '@/components/form/Dropdown';
import { useAppDispatch, useAppSelector } from '@/store';
import { getAccountList, getAccountsTypes } from '@/store/slices/accountSlice';

interface IProp {
    // value: any;
    // onChange: any;
    formData: any;
    setFormData: any;
    accountNature: string;
}

const AccountDropdowns = ({ formData, setFormData, accountNature }: IProp) => {
    const dispatch = useAppDispatch();
    const { accountTypes, accountList } = useAppSelector((state) => state.account);
    const [accountTypeOptions, setAccountTypeOptions] = React.useState<any[]>([]);
    const [optionList, setOptionList] = React.useState<any>({});

    const onChange = (value: any) => {
        setFormData({
            ...formData,
            accounting_id: value
        });
    };

    const handleDropdownChange = (e: any, index: number) => {
        if (e && typeof e !== 'undefined') {
            setOptionList([
                ...optionList,
                {
                    key: 'account_' + index,
                    name: e.account.code + ' - ' + e.account.name,
                    options: e.account.accounts.map((account: any) => ({
                        label: account.code + ' - ' + account.name,
                        value: account.id,
                        account
                    }))
                }
            ]);
        } else {
            onChange('');
        }
    };

    useEffect(() => {
        if (accountList) {
            setOptionList(accountList.levels);
        }
    }, [accountList]);

    useEffect(() => {
        dispatch(getAccountsTypes({}));
    }, []);

    useEffect(() => {
        if (accountTypes) {
            setAccountTypeOptions(accountTypes.map((accountType: any) => ({
                label: accountType.code + ' - ' + accountType.name,
                value: accountType.id
            })));
        }
    }, [accountTypes]);

    return (
        <div className="flex gap-3">
            <Dropdown
                label="Account"
                name="accounting_id"
                value={accountNature === 'receivables' ? formData.receivables?.accounting_id : formData.payable?.accounting_id}
                options={accountTypeOptions}
                onChange={(e: any) => {
                    // handleDropdownChange(e, 0);
                    if (e && typeof e !== 'undefined') {
                        if (accountNature === 'receivables') {
                            setFormData({
                                ...formData,
                                receivables: {
                                    accounting_id: e.value
                                }
                            });
                        } else {
                            setFormData({
                                ...formData,
                                payable: {
                                    accounting_id: e.value
                                }
                            });
                        }
                        dispatch(getAccountList({ account_type_id: e.value }));
                    } else {
                        if (accountNature === 'receivables') {
                            setFormData({
                                ...formData,
                                receivables: {
                                    accounting_id: ''
                                }
                            });
                        } else {
                            setFormData({
                                ...formData,
                                payable: {
                                    accounting_id: ''
                                }
                            });
                        }
                    }
                }}
            />
            {Object.keys(optionList).length > 0 && (
                Object.keys(optionList).map((dropdown: any, index: number) => (
                    optionList[dropdown].length > 0 &&
                    <Dropdown
                        key={index}
                        label="Account"
                        name="accounting_id"
                        value={formData.accounting_id}
                        options={optionList[dropdown].map((option: any) => ({
                            
                        }))}
                        onChange={(e: any) => {
                            handleDropdownChange(e, index + 1);
                            // if (e && typeof e !== 'undefined') {
                            //     onChange(e.value);
                            // } else {
                            //     onChange('');
                            // }
                        }}
                    />
                ))
            )}
        </div>
    );
};

export default AccountDropdowns;
