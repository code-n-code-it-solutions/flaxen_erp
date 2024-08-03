import React, { Dispatch, SetStateAction, useEffect } from 'react';
import AccountingRow from '@/pages/apps/accounting/configuration/accounting-settings/AccountingRow';

interface IProps {
    accountOptions: any[];
    formData: any;
    setFormData: Dispatch<SetStateAction<any[]>>;
}

const SaleAccounting = ({ accountOptions, formData, setFormData }: IProps) => {

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
                    accountingCategory="sales"
                    title="Un-Billed Receivable"
                    name="un_billed_receivable_account_id"
                    formData={formData}
                    setFormData={setFormData}

                />

                <AccountingRow
                    accountOptions={accountOptions}
                    accountingCategory="sales"
                    title="Un-Earned Income"
                    name="un_earned_income_account_id"
                    formData={formData}
                    setFormData={setFormData}

                />

                <AccountingRow
                    accountOptions={accountOptions}
                    accountingCategory="sales"
                    title="Receivables"
                    name="receivable_account_id"
                    formData={formData}
                    setFormData={setFormData}

                />

                <AccountingRow
                    accountOptions={accountOptions}
                    accountingCategory="sales"
                    title="VAT Output"
                    name="vat_output_account_id"
                    formData={formData}
                    setFormData={setFormData}

                />

                <AccountingRow
                    accountOptions={accountOptions}
                    accountingCategory="sales"
                    title="Sales Income"
                    name="sale_income_account_id"
                    formData={formData}
                    setFormData={setFormData}

                />

                <AccountingRow
                    accountOptions={accountOptions}
                    accountingCategory="sales"
                    title="Cost of Goods Sold (Raw Materials)"
                    name="cost_of_good_sold_raw_material_account_id"
                    formData={formData}
                    setFormData={setFormData}

                />
                </tbody>
            </table>
        </div>
    );
};

export default SaleAccounting;
