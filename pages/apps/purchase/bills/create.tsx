import React, { useEffect } from 'react';
import AppLayout from '@/components/Layouts/AppLayout';
import DetailPageHeader from '@/components/apps/DetailPageHeader';
import { AppBasePath } from '@/utils/enums';
import PageWrapper from '@/components/PageWrapper';
import useSetActiveMenu from '@/hooks/useSetActiveMenu';
import { useAppDispatch, useAppSelector } from '@/store';
import { setPageTitle } from '@/store/slices/themeConfigSlice';
import { useRouter } from 'next/router';
import { clearVendorBillState } from '@/store/slices/vendorBillSlice';
import BillForm from '@/pages/apps/purchase/bills/BillForm';

const Create = () => {
    useSetActiveMenu(AppBasePath.Vendor_Bill)
    const dispatch = useAppDispatch();
    const router = useRouter();

    const {vendorBill, success} = useAppSelector(state => state.vendorBill);

    useEffect(() => {
        dispatch(setPageTitle('New Bill'));
        dispatch(clearVendorBillState());
    }, []);

    useEffect(() => {
        if(success && vendorBill) {
            router.push('/apps/purchase/bills');
        }
    }, [success, vendorBill]);

    return (
        <div>
            <DetailPageHeader
                appBasePath={AppBasePath.Vendor_Bill}
                title="Create Bill"
                middleComponent={{
                    show: false
                }}
                backButton={{
                    show: true,
                    backLink: '/apps/purchase/bills'
                }}
            />
            <PageWrapper
                breadCrumbItems={[]}
                embedLoader={true}
                loading={false}
            >
                <BillForm />
            </PageWrapper>

        </div>
    );
};

// Create.getLayout = (page: any) => <AppLayout>{page}</AppLayout>;
export default Create;
