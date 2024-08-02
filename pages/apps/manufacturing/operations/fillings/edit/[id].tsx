import React, {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from "@/store";
import {useRouter} from "next/router";
import {setPageTitle} from "@/store/slices/themeConfigSlice";
import {setAuthToken} from "@/configs/api.config";
import {ButtonType, ButtonVariant, IconType} from "@/utils/enums";
import PageWrapper from "@/components/PageWrapper";
import {clearFillingState, editFilling} from "@/store/slices/fillingSlice";
import FillingForm from '@/pages/apps/manufacturing/operations/fillings/FillingForm';

const Edit = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const {token} = useAppSelector(state => state.user);
    const {filling, success, loading} = useAppSelector(state => state.filling);

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
            router.push('/apps/manufacturing/operations/fillings');
        }
    }, [filling, success]);

    return (
        <PageWrapper
            embedLoader={true}
            loading={false}
            title="Edit Fillings"
            buttons={[
                {
                    text: 'Back',
                    type: ButtonType.link,
                    variant: ButtonVariant.primary,
                    icon: IconType.back,
                    link: '/apps/manufacturing/operations/fillings'
                }
            ]}
        >
            <FillingForm id={router.query.id}/>
        </PageWrapper>
    );
};

export default Edit;
