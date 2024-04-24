import React, {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from "@/store";
import {useRouter} from "next/router";
import {setPageTitle} from "@/store/slices/themeConfigSlice";
import {clearGoodReceiveNoteState} from "@/store/slices/goodReceiveNoteSlice";
import GoodReceiveNoteForm from "@/pages/erp/purchase/good-receive-note/GoodReceiveNoteForm";
import PageWrapper from "@/components/PageWrapper";
import {ButtonType, ButtonVariant, IconType} from "@/utils/enums";

const Create = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const {GRN, success, loading} = useAppSelector(state => state.goodReceiveNote);

    const breadcrumbItems = [
        {
            title: 'Main Dashboard',
            href: '/erp/main',
        },
        {
            title: 'Purchase Dashboard',
            href: '/erp/purchase',
        },
        {
            title: 'All Good Receive Note',
            href: '/erp/purchase/good-receive-note',
        },
        {
            title: 'Create New',
            href: '#',
        },
    ]

    useEffect(() => {
        dispatch(setPageTitle( 'New Good Receive Note'));
    }, []);

    useEffect(() => {
        if(GRN && success) {
            dispatch(clearGoodReceiveNoteState());
            router.push('/erp/purchase/good-receive-note');
        }
    }, [GRN, success]);

    return (
        <PageWrapper
            breadCrumbItems={breadcrumbItems}
            loading={false}
            embedLoader={false}
            title="New Good Receive Note"
            buttons={[
                {
                    text: 'Back',
                    icon: IconType.back,
                    type: ButtonType.link,
                    variant: ButtonVariant.primary,
                    link: '/erp/purchase/good-receive-note'
                }
            ]}
        >
            <GoodReceiveNoteForm/>
        </PageWrapper>
    );
};

export default Create;
