import React, {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from "@/store";
import PageWrapper from "@/components/PageWrapper";
import Button from "@/components/Button";
import {ButtonSize, ButtonType, ButtonVariant, IconType} from "@/utils/enums";
import {getIcon} from "@/utils/helper";
import {setPageTitle} from "@/store/slices/themeConfigSlice";
import DeliveryNoteForm from "@/pages/erp/sale/delivery-note/DeliveryNoteForm";
import {useRouter} from "next/router";
import {clearDeliveryNoteState} from "@/store/slices/deliveryNoteSlice";

const Create = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const {deliveryNote, success} = useAppSelector((state) => state.deliveryNote);
    const breadcrumb = [
        {
            title: 'Home',
            href: '/main'
        },
        {
            title: 'Sale Dashboard',
            href: '/sale'
        },
        {
            title: 'All Delivery Notes',
            href: '/sale/delivery-note'
        },
        {
            title: 'Create Delivery Note',
            href: '#'
        }
    ];

    useEffect(() => {
        dispatch(setPageTitle('Create Delivery Note'));
    }, []);

    useEffect(() => {
        if (deliveryNote && success) {
            router.push('/erp/sale/delivery-note')
            dispatch(clearDeliveryNoteState());
        }
    }, [deliveryNote, success]);

    return (
        <PageWrapper
            embedLoader={false}
            breadCrumbItems={breadcrumb}
        >
            <div className="mb-5 flex items-center justify-between">
                <h5 className="text-lg font-semibold dark:text-white-light">Create Delivery Note</h5>
                <Button
                    type={ButtonType.link}
                    text={
                        <span className="flex items-center">
                            {getIcon(IconType.back)}
                            Back
                        </span>
                    }
                    variant={ButtonVariant.primary}
                    link={'/sale/delivery-note'}
                    size={ButtonSize.small}
                />
            </div>
            <DeliveryNoteForm/>
        </PageWrapper>
    );
};

export default Create;
