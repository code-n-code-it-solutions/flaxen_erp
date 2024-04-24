import React, {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from "@/store";
import {useRouter} from "next/router";
import {setPageTitle} from "@/store/slices/themeConfigSlice";
import {clearVendorState, editVendor} from "@/store/slices/vendorSlice";
import PageWrapper from "@/components/PageWrapper";
import {ButtonSize, ButtonType, ButtonVariant, IconType} from "@/utils/enums";
import Button from "@/components/Button";
import VendorForm from '@/pages/erp/admin/vendors/VendorForm';
import {getIcon} from "@/utils/helper";

const Edit = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const {vendor, loading, success} = useAppSelector(state => state.vendor);

    const breadCrumbItems = [
        {
            title: 'Home',
            href: '/erp/main',
        },
        {
            title: 'Admin Dashboard',
            href: '/erp/admin',
        },
        {
            title: 'All Vendors ',
            href: '/erp/vendors',
        },
        {
            title: 'Update vendor',
            href: '#',
        },
    ];

    useEffect(() => {
        if (vendor && success) {
            dispatch(clearVendorState());
            router.push('/erp/admin/vendors');
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
        <PageWrapper
            breadCrumbItems={breadCrumbItems}
            embedLoader={true}
            loading={loading}
            title="Edit Vendor"
            buttons={[
                {
                    text: 'Print',
                    type: ButtonType.link,
                    variant: ButtonVariant.success,
                    icon: IconType.print,
                    link: '/erp/admin/vendors/print/' + router.query.id
                },
                {
                    text: 'Back',
                    type: ButtonType.link,
                    variant: ButtonVariant.primary,
                    icon: IconType.back,
                    link: '/erp/admin/vendors'
                }
            ]}
        >
            <VendorForm id={router.query.id}/>
        </PageWrapper>
    );
};

export default Edit;
