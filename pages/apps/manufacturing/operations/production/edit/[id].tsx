import React, {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from "@/store";
import {useRouter} from "next/router";
import {setPageTitle} from "@/store/slices/themeConfigSlice";
import {clearProductionState, editProduction} from "@/store/slices/productionSlice";
import {ButtonType, ButtonVariant, IconType} from "@/utils/enums";
import PageWrapper from "@/components/PageWrapper";
import {setAuthToken} from "@/configs/api.config";
import ProductionForm from '@/pages/apps/manufacturing/operations/production/ProductionForm';

const Edit = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const {production, success, loading} = useAppSelector(state => state.production);
    const {token} = useAppSelector(state => state.user);

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
            router.push('/apps/manufacturing/operations/production');
        }
    }, [production, success]);

    return (
        <PageWrapper
            embedLoader={true}
            loading={false}
            title="Edit Productions"
            buttons={[
                {
                    text: 'Back',
                    type: ButtonType.link,
                    variant: ButtonVariant.primary,
                    icon: IconType.back,
                    link: '/apps/manufacturing/operations/production'
                }
            ]}
        >
            <ProductionForm id={router.query.id}/>
        </PageWrapper>
    );
};

export default Edit;
