import React, {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from "@/store";
import {useRouter} from "next/router";
import {setPageTitle} from "@/store/slices/themeConfigSlice";
import VendorForm from "@/pages/apps/purchase/configuration/vendor/VendorForm";
import {clearVendorState} from "@/store/slices/vendorSlice";
import PageWrapper from "@/components/PageWrapper";
import { AppBasePath, ButtonType, ButtonVariant, IconType } from '@/utils/enums';
import AppLayout from '@/components/Layouts/AppLayout';
import DetailPageHeader from '@/components/apps/DetailPageHeader';
import useSetActiveMenu from '@/hooks/useSetActiveMenu';

const Create = () => {
    useSetActiveMenu(AppBasePath.Vendor);
    const dispatch = useAppDispatch();
    const router = useRouter();
    const {vendor, success, loading} = useAppSelector(state => state.vendor);

    useEffect(() => {
        dispatch(setPageTitle('Create Vendor'));
    }, []);

    useEffect(() => {
        if (vendor && success) {
            dispatch(clearVendorState());
            router.push('/apps/purchase/configuration/vendor');
        }
    }, [vendor, success]);

    return (
        <div className="flex flex-col gap-3">
            <DetailPageHeader
                appBasePath={AppBasePath.Vendor}
                title="Create Vendor"
                middleComponent={{
                    show: false
                }}
                backButton={{
                    show: true,
                    backLink: '/apps/purchase/configuration/vendor'
                }}
            />
            <PageWrapper
                loading={false}
                embedLoader={false}
                breadCrumbItems={[]}
            >
                <VendorForm/>
            </PageWrapper>
        </div>
    );
};

// Create.getLayout = (page: any) => <AppLayout>{page}</AppLayout>;
export default Create;
