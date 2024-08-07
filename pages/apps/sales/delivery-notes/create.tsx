import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import PageWrapper from '@/components/PageWrapper';
import { AppBasePath } from '@/utils/enums';
import { setPageTitle } from '@/store/slices/themeConfigSlice';
import { useRouter } from 'next/router';
import { clearDeliveryNoteState } from '@/store/slices/deliveryNoteSlice';
import useSetActiveMenu from '@/hooks/useSetActiveMenu';
import DetailPageHeader from '@/components/apps/DetailPageHeader';
import DeliveryNoteForm from '@/pages/apps/sales/delivery-notes/DeliveryNoteForm';

const Create = () => {
    useSetActiveMenu(AppBasePath.Delivery_Note);
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { deliveryNote, success } = useAppSelector((state) => state.deliveryNote);

    useEffect(() => {
        dispatch(setPageTitle('Create Delivery Note'));
    }, []);

    useEffect(() => {
        if (deliveryNote && success) {
            router.push('/apps/sales/delivery-notes');
            dispatch(clearDeliveryNoteState());
        }
    }, [deliveryNote, success]);

    return (
        <div className="flex flex-col gap-3">
            <DetailPageHeader
                appBasePath={AppBasePath.Delivery_Note}
                title="Create Delivery Note"
                middleComponent={{
                    show: false
                }}
                backButton={{
                    show: true,
                    backLink: '/apps/sales/delivery-notes'
                }}
            />
            <PageWrapper
                breadCrumbItems={[]}
                embedLoader={true}
                loading={false}
            >
                <DeliveryNoteForm />
            </PageWrapper>
        </div>
    );
};

// Create.getLayout = (page: any) => <AppLayout>{page}</AppLayout>;
export default Create;
