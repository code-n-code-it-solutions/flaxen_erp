import React, {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from "@/store";
import {useRouter} from "next/router";
import {setPageTitle} from "@/store/slices/themeConfigSlice";
import {setAuthToken} from "@/configs/api.config";
import {ButtonType, ButtonVariant, IconType} from "@/utils/enums";
import PageWrapper from "@/components/PageWrapper";
import FillingForm from "@/pages/erp/inventory/fillings/FillingForm";
import {clearFillingState, editFilling} from "@/store/slices/fillingSlice";

const Edit = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const {token} = useAppSelector(state => state.user);
    const {filling, success, loading} = useAppSelector(state => state.filling);

    const breadCrumbItems = [
        {title: 'Home', href: '/erp/main'},
        {title: 'Inventory Dashboard', href: '/erp/inventory'},
        {title: 'All Productions', href: '/erp/inventory/productions'},
        {title: 'Update', href: '#'},
    ];

    useEffect(() => {
        setAuthToken(token);
        dispatch(setPageTitle('Edit Fillings'));
        const {id} = router.query;
        if (typeof id === 'string' && id) {
            dispatch(editFilling(parseInt(id)))
        }
    }, [router.query]);

    useEffect(() => {
        if (filling && success) {
            dispatch(clearFillingState());
            router.push('/erp/inventory/fillings');
        }
    }, [filling, success]);

    return (
        <PageWrapper
            breadCrumbItems={breadCrumbItems}
            embedLoader={true}
            loading={false}
            title="Edit Fillings"
            buttons={[
                {
                    text: 'Print',
                    type: ButtonType.link,
                    variant: ButtonVariant.success,
                    icon: IconType.print,
                    link: '/erp/inventory/fillings/print/' + router.query.id
                },
                {
                    text: 'Back',
                    type: ButtonType.link,
                    variant: ButtonVariant.primary,
                    icon: IconType.back,
                    link: '/erp/inventory/fillings'
                }
            ]}
        >
            <FillingForm id={router.query.id}/>
        </PageWrapper>
    );
};

export default Edit;
