import React, {useEffect} from 'react';
import Breadcrumb from "@/components/Breadcrumb";
import Link from "next/link";
import {useDispatch, useSelector} from "react-redux";
import {ThunkDispatch} from "redux-thunk";
import {IRootState, useAppDispatch, useAppSelector} from "@/store";
import {AnyAction} from "redux";
import {useRouter} from "next/router";
import {setPageTitle} from "@/store/slices/themeConfigSlice";
import {clearGoodReceiveNoteState} from "@/store/slices/goodReceiveNoteSlice";
import GoodReceiveNoteForm from "@/pages/erp/purchase/good-receive-note/GoodReceiveNoteForm";
import VendorBillForm from "@/pages/erp/purchase/vendor-bill/VendorBillForm";
import {clearVendorBillState} from "@/store/slices/vendorBillSlice";
import PageWrapper from '@/components/PageWrapper';
import {ButtonType, ButtonVariant, IconType} from "@/utils/enums";

const Create = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const {vendorBill, success, loading} = useAppSelector(state => state.vendorBill);
    const breadCrumbItems = [
        {
            title: 'Home',
            href: '/erp/main',
        },
        {
            title: 'Purchase Dashboard',
            href: '/erp/purchase',
        },
        {
            title: 'Vendor Bills',
            href: '/erp/purchase/vendor-bill',
        },
        {
            title: 'Create New',
            href: '#',
        },
    ];
    useEffect(() => {
        dispatch(setPageTitle('New Vendor Bill'));
    }, []);

    useEffect(() => {
        if (vendorBill && success) {
            dispatch(clearVendorBillState());
            router.push('/erp/purchase/vendor-bill');
        }
    }, [vendorBill, success]);

    return (
        <PageWrapper
            embedLoader={false}
            breadCrumbItems={breadCrumbItems}
            title="New Vendor Bill"
            buttons={[
                {
                    text: 'Back',
                    type: ButtonType.link,
                    variant: ButtonVariant.primary,
                    icon: IconType.back,
                    link: '/erp/purchase/vendor-bill'
                }
            ]}
        >
            <VendorBillForm/>
        </PageWrapper>
    );
};

export default Create;
