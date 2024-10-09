import React, {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from "@/store";
import {useRouter} from "next/router";
import {setPageTitle} from "@/store/slices/themeConfigSlice";
import PageWrapper from "@/components/PageWrapper";
import {ButtonType, ButtonVariant, IconType} from "@/utils/enums";
import ContractForm from '@/pages/apps/hrm/contracts/contractForm';  

import AppLayout from '@/components/Layouts/AppLayout';
import { clearContractState } from '@/store/slices/contractSlice';

const Create = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const {employee, loading, success} = useAppSelector(state => state.employee);

    useEffect(() => {
        dispatch(setPageTitle('New Contract'));
    }, []);

    useEffect(() => {
        if (employee && success) {
            dispatch(clearContractState());
            router.push('');
        }
    }, [employee, success]);

    return (
        <PageWrapper
        embedLoader={false}
        breadCrumbItems={[]}
        loading={false}
        title="Create Contract"
        buttons={[
            {
                text: 'Back',
                type: ButtonType.link,
                variant: ButtonVariant.primary,
                icon: IconType.back,
                link: '/apps/hrm/contracts'
            }
        ]}
    >
        <ContractForm />  
    </PageWrapper>
    );
};

// Create.getLayout = (page: any) => <AppLayout>{page}</AppLayout>;
export default Create;
