import React, {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from "@/store";
import {useRouter} from "next/router";
import {setPageTitle} from "@/store/slices/themeConfigSlice";
import {clearVendorState, editVendor} from "@/store/slices/vendorSlice";
import PageWrapper from "@/components/PageWrapper";
import { AppBasePath, ButtonSize, ButtonType, ButtonVariant, IconType } from '@/utils/enums';
import Button from "@/components/Button";
import VendorForm from '@/pages/apps/purchase/configuration/vendor/VendorForm';
import {getIcon} from "@/utils/helper";
import AppLayout from '@/components/Layouts/AppLayout';
import DetailPageHeader from '@/components/apps/DetailPageHeader';
import useSetActiveMenu from '@/hooks/useSetActiveMenu';

const Edit = () => {
    useSetActiveMenu(AppBasePath.Vendor);
    const dispatch = useAppDispatch();
    const router = useRouter();
    const {vendor, loading, success} = useAppSelector(state => state.vendor);

    useEffect(() => {
        if (vendor && success) {
            dispatch(clearVendorState());
            router.push('/apps/purchase/configuration/vendor');
        }
    }, [vendor, success]);

    useEffect(() => {
        dispatch(setPageTitle('Edit Vendor Details'));
        const {id} = router.query;
        if (typeof id === 'string' && id) {
            dispatch(editVendor(parseInt(id)))
        }
    }, [router.query]);

    return (
        <div>
            <DetailPageHeader
                appBasePath={AppBasePath.Vendor}
                title="Edit Vendor"
                middleComponent={{
                    show: false,
                }}
                backButton={{
                    show: true,
                    backLink: '/apps/purchase/configuration/vendor'
                }}
            />
            <PageWrapper
                embedLoader={true}
                loading={loading}
            >
                <VendorForm id={router.query.id}/>
            </PageWrapper>
        </div>
    );
};

// Edit.getLayout = (page: any) => <AppLayout>{page}</AppLayout>;
export default Edit;
