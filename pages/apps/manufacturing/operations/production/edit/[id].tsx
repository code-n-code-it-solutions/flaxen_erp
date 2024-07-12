import React, {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from "@/store";
import {useRouter} from "next/router";
import {setPageTitle} from "@/store/slices/themeConfigSlice";
import {clearProductionState, editProduction} from "@/store/slices/productionSlice";
import {ButtonType, ButtonVariant, IconType} from "@/utils/enums";
import PageWrapper from "@/components/PageWrapper";
import ProductionForm from "@/pages/erp/inventory/productions/ProductionForm";
import {setAuthToken} from "@/configs/api.config";

const Edit = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const {production, success, loading} = useAppSelector(state => state.production);
    const {token} = useAppSelector(state => state.user);

    const breadCrumbItems = [
        {title: 'Home', href: '/erp/main'},
        {title: 'Inventory Dashboard', href: '/erp/inventory'},
        {title: 'All Productions', href: '/erp/inventory/productions'},
        {title: 'Update', href: '#'},
    ];

    useEffect(() => {
        setAuthToken(token);
        dispatch(setPageTitle('Edit Productions'));
        const {id} = router.query;
        if (typeof id === 'string' && id) {
            dispatch(clearProductionState());
            dispatch(editProduction(parseInt(id)))
        }
    }, [router.query]);

    useEffect(() => {
        if (production && success) {
            dispatch(clearProductionState());
            router.push('/erp/inventory/productions');
        }
    }, [production, success]);

    return (
        <PageWrapper
            breadCrumbItems={breadCrumbItems}
            embedLoader={true}
            loading={false}
            title="Edit Productions"
            buttons={[
                {
                    text: 'Print',
                    type: ButtonType.link,
                    variant: ButtonVariant.success,
                    icon: IconType.print,
                    link: '/erp/inventory/productions/print/' + router.query.id
                },
                {
                    text: 'Back',
                    type: ButtonType.link,
                    variant: ButtonVariant.primary,
                    icon: IconType.back,
                    link: '/erp/inventory/productions'
                }
            ]}
        >
            <ProductionForm id={router.query.id}/>
        </PageWrapper>
    );
};

export default Edit;
