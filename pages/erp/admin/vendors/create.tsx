import React, {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from "@/store";
import {useRouter} from "next/router";
import {setPageTitle} from "@/store/slices/themeConfigSlice";
import VendorForm from "@/pages/erp/admin/vendors/VendorForm";
import {clearVendorState} from "@/store/slices/vendorSlice";
import PageWrapper from "@/components/PageWrapper";
import {ButtonType, ButtonVariant, IconType} from "@/utils/enums";

const Create = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const {vendor, success, loading} = useAppSelector(state => state.vendor);
    const breadcrumb = [
        {
            title: 'Main Dashboard',
            href: '/erp/main',
        },
        {
            title: 'Admin Dashboard',
            href: '/erp/admin',
        },
        {
            title: 'All Vendors',
            href: '/erp/admin/vendors',
        },
        {
            title: 'Create New',
            href: '#',
        },
    ];

    useEffect(() => {
        dispatch(setPageTitle('Create Vendor'));
    }, []);

    useEffect(() => {
        if (vendor && success) {
            dispatch(clearVendorState());
            router.push('/erp/admin/vendors');
        }
    }, [vendor, success]);

    return (
        <PageWrapper
            loading={false}
            embedLoader={false}
            breadCrumbItems={breadcrumb}
            title="Create Vendor"
            buttons={[
                {
                    text: 'Back',
                    type: ButtonType.link,
                    variant: ButtonVariant.primary,
                    icon: IconType.back,
                    link: '/erp/admin/vendors'
                }
            ]}
        >
            <VendorForm/>
        </PageWrapper>
    );
};

export default Create;
