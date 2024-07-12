import React, {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from "@/store";
import {useRouter} from "next/router";
import {setPageTitle} from "@/store/slices/themeConfigSlice";
import { AppBasePath, ButtonType, ButtonVariant, IconType } from '@/utils/enums';
import PageWrapper from "@/components/PageWrapper";
import {clearFillingState} from "@/store/slices/fillingSlice";
import FillingForm from "@/pages/apps/manufacturing/operations/fillings/FillingForm";
import Swal from "sweetalert2";
import AppLayout from '@/components/Layouts/AppLayout';
import useSetActiveMenu from '@/hooks/useSetActiveMenu';

const Create = () => {
    useSetActiveMenu(AppBasePath.Filling);
    const dispatch = useAppDispatch();
    const router = useRouter();
    const {filling, success, loading} = useAppSelector(state => state.filling);

    const breadCrumbItems = [
        {title: 'Home', href: '/erp/main'},
        {title: 'Inventory Dashboard', href: '/erp/inventory'},
        {title: 'All Fillings', href: '/erp/inventory/fillings'},
        {title: 'Create New', href: '#'},
    ];

    useEffect(() => {
        dispatch(clearFillingState())
        dispatch(setPageTitle('Create Productions'));
    }, []);

    useEffect(() => {
        if (filling && success) {
            dispatch(clearFillingState());
            Swal.fire({
                title: 'Form Submitted!',
                text: 'Your data has been added/updated successfully.',
                icon: 'success',
                customClass: {
                    popup: 'sweet-alerts'
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    router.push('/apps/manufacturing/operations/fillings');
                }
            })
        }
    }, [filling, success]);

    return (
        <PageWrapper
            breadCrumbItems={breadCrumbItems}
            embedLoader={false}
            title="Create Filling"
            buttons={[
                {
                    text: 'Back',
                    type: ButtonType.link,
                    variant: ButtonVariant.primary,
                    icon: IconType.back,
                    link: '/apps/manufacturing/operations/fillings'
                }
            ]}
        >
            <FillingForm/>
        </PageWrapper>
    );
};

Create.getLayout = (page: any) => <AppLayout>{page}</AppLayout>
export default Create;
