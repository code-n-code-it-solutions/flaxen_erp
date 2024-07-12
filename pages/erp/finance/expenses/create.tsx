import React, {useEffect} from 'react';
import PageWrapper from "@/components/PageWrapper";
import {ButtonType, ButtonVariant, IconType} from "@/utils/enums";
import {useAppDispatch, useAppSelector} from "@/store";
import ExpenseForm from "@/pages/erp/finance/expenses/ExpenseForm";
import {setAuthToken} from "@/configs/api.config";
import {setPageTitle} from "@/store/slices/themeConfigSlice";
import {clearExpenseState} from "@/store/slices/expenseSlice";
import {useRouter} from "next/router";

const Create = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const {token} = useAppSelector(state => state.user);
    const {expense, success, loading} = useAppSelector(state => state.expense);
    const breadcrumbItem = [
        {
            title: 'Main Dashboard',
            href: '/erp/main',
        },
        {
            title: 'Finance Dashboard',
            href: '/erp/finance',
        },
        {
            title: 'All Expenses',
            href: '/erp/finance/expenses',
        },
        {
            title: 'Add Expense',
            href: '#',
        },
    ]

    useEffect(() => {
        dispatch(setPageTitle('New Expense'));
        setAuthToken(token);
    }, []);

    useEffect(() => {
        if (expense && success) {
            dispatch(clearExpenseState());
            router.push('/erp/finance/expenses');
        }
    }, [expense, success]);

    return (
        <PageWrapper
            embedLoader={true}
            loading={loading}
            breadCrumbItems={breadcrumbItem}
            title='Add Expense'
            buttons={[
                {
                    text: 'Back',
                    type: ButtonType.link,
                    variant: ButtonVariant.primary,
                    icon: IconType.back,
                    link: '/erp/hr/employee'
                }
            ]}
        >
            <ExpenseForm/>
        </PageWrapper>
    );
};

export default Create;
