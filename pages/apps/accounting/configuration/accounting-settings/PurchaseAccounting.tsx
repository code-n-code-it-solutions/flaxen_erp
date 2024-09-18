import React, { Dispatch, SetStateAction, useEffect } from 'react';
import { Dropdown } from '@/components/form/Dropdown';
import dynamic from 'next/dynamic';
import AccountingRow from '@/pages/apps/accounting/configuration/accounting-settings/AccountingRow';

const TreeSelect = dynamic(() => import('antd/es/tree-select'), { ssr: false });

interface IProps {
    accountOptions: any[];
    formData: any;
    setFormData: Dispatch<SetStateAction<any[]>>;
}

const PurchaseAccounting = ({ accountOptions, formData, setFormData }: IProps) => {

    return (
        <div className="">
            <table>
                <thead>
                <tr>
                    <th>Account For</th>
                    <th>Account</th>
                    <th>Increase</th>
                    <th>Decrease</th>
                </tr>
                </thead>
                <tbody>

                <AccountingRow
                    accountOptions={accountOptions}
                    accountingCategory="purchases"
                    title="Un-Billed Payable"
                    name="un_billed_payable_account_id"
                    formData={formData}
                    setFormData={setFormData}
                />

                <AccountingRow
                    accountOptions={accountOptions}
                    accountingCategory="purchases"
                    title="Payable"
                    name="payable_account_id"
                    formData={formData}
                    setFormData={setFormData}
                />

                <AccountingRow
                    accountOptions={accountOptions}
                    accountingCategory="purchases"
                    title="VAT Input"
                    name="vat_input_account_id"
                    formData={formData}
                    setFormData={setFormData}
                />

                </tbody>
            </table>
        </div>
    );
};

export default PurchaseAccounting;
