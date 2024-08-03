import React, { useEffect, useState } from 'react';
import { Dropdown } from '@/components/form/Dropdown';
import dynamic from 'next/dynamic';

const TreeSelect = dynamic(() => import('antd/es/tree-select'), { ssr: false });

interface IProps {
    accountOptions: any[];
    accountingCategory: string;
    title: string;
    name: string;
    formData: any[];
    setFormData: (data: any) => void;
}

const AccountingRow = ({ accountOptions, accountingCategory, title, name, formData, setFormData }: IProps) => {

    const handleChange = (fieldName: string, value: any) => {
        setFormData((prevFormData: any) =>
            prevFormData.map((data: any) => {
                if (data.accounting_category === accountingCategory && data.name === name) {
                    return {
                        ...data,
                        [fieldName]: value
                    };
                }
                return data;
            })
        );
    };

    useEffect(() => {
        if (!formData.some(data => data.accounting_category === accountingCategory && data.name === name)) {
            setFormData((prevFormData: any) => [
                ...prevFormData,
                {
                    accounting_category: accountingCategory,
                    name: name,
                    account_id: null,
                    increase: '',
                    decrease: ''
                }
            ]);
        }
    }, [accountingCategory, name, formData, setFormData]);

    const currentData = formData.find(data => data.accounting_category === accountingCategory && data.name === name) || {};

    return (
        <tr>
            <td>{title}</td>
            <td>
                <TreeSelect
                    showSearch
                    style={{ width: '100%' }}
                    value={currentData.account_id}
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    placeholder={`Select ${title} account`}
                    allowClear
                    treeDefaultExpandAll
                    onChange={(value) => handleChange('account_id', value)}
                    treeData={accountOptions}
                    treeNodeFilterProp="title"
                />
            </td>
            <td>
                <Dropdown
                    name="increase"
                    options={[
                        { label: 'Debit', value: 'debit' },
                        { label: 'Credit', value: 'credit' }
                    ]}
                    value={currentData.increase}
                    onChange={(e) => {
                        if (e && typeof e !== 'undefined') {
                            handleChange('increase', e.value);
                        } else {
                            handleChange('increase', '');
                        }
                    }}
                />
            </td>
            <td>
                <Dropdown
                    name="decrease"
                    options={[
                        { label: 'Debit', value: 'debit' },
                        { label: 'Credit', value: 'credit' }
                    ]}
                    value={currentData.decrease}
                    onChange={(e) => {
                        if (e && typeof e !== 'undefined') {
                            handleChange('decrease', e.value);
                        } else {
                            handleChange('decrease', '');
                        }
                    }}
                />
            </td>
        </tr>
    );
};

export default AccountingRow;
