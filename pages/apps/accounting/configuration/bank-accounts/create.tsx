import React, { useEffect } from 'react';
import DetailPageHeader from '@/components/apps/DetailPageHeader';
import { AppBasePath } from '@/utils/enums';
import PageWrapper from '@/components/PageWrapper';
import useSetActiveMenu from '@/hooks/useSetActiveMenu';
import { useAppDispatch, useAppSelector } from '@/store';
import { setPageTitle } from '@/store/slices/themeConfigSlice';
import { useRouter } from 'next/router';
import BankAccountForm from '@/pages/apps/accounting/configuration/bank-accounts/BankAccountForm';
import { clearBankAccountState } from '@/store/slices/bankAccountSlice';

const Create = () => {
    useSetActiveMenu(AppBasePath.Bank_Accounts);
    const dispatch = useAppDispatch();
    const router = useRouter();

    const { bankAccount, success } = useAppSelector(state => state.bankAccount);

    useEffect(() => {
        dispatch(clearBankAccountState());
        dispatch(setPageTitle('New Bank Account'));
    }, []);

    useEffect(() => {
        if (success && bankAccount) {
            router.push(AppBasePath.Bank_Accounts);
        }
    }, [success, bankAccount]);

    return (
        <div className="flex flex-col gap-3">
            <DetailPageHeader
                appBasePath={AppBasePath.Bank_Accounts}
                title="Create Bank Account"
                middleComponent={{
                    show: false
                }}
                backButton={{
                    show: true,
                    backLink: AppBasePath.Bank_Accounts
                }}
            />
            <PageWrapper>
                <BankAccountForm />
            </PageWrapper>
        </div>
    );
};

export default Create;
