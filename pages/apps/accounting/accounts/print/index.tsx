import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '@/store';
import { setAuthToken, setContentType } from '@/configs/api.config';
import PrintContent from './PrintContent';
import BlankLayout from '@/components/Layouts/BlankLayout';
import { PDFViewer, Document } from '@react-pdf/renderer';
import { setPageTitle } from '@/store/slices/themeConfigSlice';
import { getAccounts } from '@/store/slices/accountSlice';
import useSetActiveMenu from '@/hooks/useSetActiveMenu';
import { AppBasePath } from '@/utils/enums';

const Print = () => {
    useSetActiveMenu(AppBasePath.Report_Accounts);
    const dispatch = useAppDispatch();

    const { token, user } = useAppSelector((state) => state.user);
    const { accounts, loading } = useAppSelector((state) => state.account);

    useEffect(() => {
        setAuthToken(token);
        dispatch(setPageTitle('Accounts Report'));
        setContentType('application/json');
        dispatch(getAccounts());
    }, []);

    const calculateTotals = () => {
        let totalDebit = 0;
        let totalCredit = 0;
        let totalBalance = 0;

        accounts && accounts?.forEach((accountType: any) => {
            accountType.accounts.forEach((account: any) => {
                totalDebit += account.totals.debit;
                totalCredit += account.totals.credit;
                totalBalance += account.totals.balance;
            });
        });

        return { totalDebit, totalCredit, totalBalance };
    };

    const { totalDebit, totalCredit, totalBalance } = calculateTotals();
    return (
        !loading && accounts && (
            <PDFViewer
                style={{
                    width: '100%',
                    height: '100vh'
                }}
                showToolbar={true}
            >
                <Document
                    title="Account Report Preview"
                    author="Flaxen Paints Industry LLC"
                    subject="Account Report Preview"
                    keywords="account, pdf, flaxen, flaxen paints, report, preview, flaxen paints industry llc"
                >
                    <PrintContent accounts={accounts} totals={{ totalDebit, totalCredit, totalBalance }} />
                </Document>
            </PDFViewer>

        )
    );
};

Print.getLayout = (page: any) => (<BlankLayout>{page}</BlankLayout>);

export default Print;
