import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {ThunkDispatch} from "redux-thunk";
import {IRootState} from "@/store";
import {AnyAction} from "redux";
import {useRouter} from "next/router";
import {setPageTitle} from "@/store/slices/themeConfigSlice";
import {clearVendorState, editVendor} from "@/store/slices/vendorSlice";
import PageWrapper from "@/components/PageWrapper";
import {ButtonSize, ButtonType, ButtonVariant} from "@/utils/enums";
import Button from "@/components/Button";
import VendorForm from '../VendorForm';

interface IFormData {
    vendor_number: string;
    name: string;
    vendor_type_id: number;
    opening_balance: number,
    phone: string,
    email: string,
    due_in_days: number,
    postal_code: string,
    website_url: string,
    tax_reg_no: string,
    address: string,
    country_id: number,
    state_id: number,
    city_id: number,
    image: File | null;
    representatives: any[];
    addresses: any[];
    is_active: boolean;
}

const Edit = () => {
    const dispatch = useDispatch<ThunkDispatch<IRootState, any, AnyAction>>();
    const router = useRouter();
    const {vendor, loading} = useSelector((state: IRootState) => state.vendor);
    dispatch(setPageTitle('Edit Vendor Details'));
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
        if (vendor) {
            dispatch(clearVendorState());
            router.push('/erp/admin/vendors');
        }
    }, [vendor]);

    useEffect(() => {
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
        >
            <div>
                <div className="mb-5 flex items-center justify-between">
                    <h5 className="text-lg font-semibold dark:text-white-light">Enter Details of Raw Materials</h5>
                    <Button
                        text={<span className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ltr:mr-2 rtl:ml-2" width="24"
                                 height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M15 5L9 12L15 19" stroke="currentColor" strokeWidth="1.5"
                                      strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Back
                        </span>}
                        type={ButtonType.link}
                        variant={ButtonVariant.primary}
                        link="/admin/vendors"
                        size={ButtonSize.small}
                    />
                </div>
                <VendorForm id={router.query.id}/>
            </div>
        </PageWrapper>
    );
};

export default Edit;
