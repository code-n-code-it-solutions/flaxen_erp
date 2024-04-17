import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {ThunkDispatch} from "redux-thunk";
import {IRootState} from "@/store";
import {AnyAction} from "redux";
import {useRouter} from "next/router";
import {setPageTitle} from "@/store/slices/themeConfigSlice";
import ProductForm from "@/pages/erp/inventory/products/ProductForm";
import {clearRawProductState} from "@/store/slices/rawProductSlice";
import PageWrapper from "@/components/PageWrapper";
import {ButtonSize, ButtonType, ButtonVariant, IconType} from "@/utils/enums";
import Button from "@/components/Button";
import {getIcon} from "@/utils/helper";

const Create = () => {
    const dispatch = useDispatch<ThunkDispatch<IRootState, any, AnyAction>>();
    const router = useRouter();
    const {rawProduct} = useSelector((state: IRootState) => state.rawProduct);
    const breadCrumbItems = [
        {
            title: 'Home',
            href: '/main',
        },
        {
            title: 'All Raw Materials',
            href: '/erp/inventory/products',
        },
        {
            title: 'Create New',
            href: '#',
        },
    ];
    useEffect(() => {
        dispatch(setPageTitle('Create Raw Material'));
    }, []);

    useEffect(() => {
        if (rawProduct) {
            dispatch(clearRawProductState());
            router.push('/erp/inventory/products');
        }
    }, [rawProduct]);

    return (
        <PageWrapper
            embedLoader={false}
            breadCrumbItems={breadCrumbItems}
        >
            <div>
                <div className="mb-5 flex items-center justify-between">
                    <h5 className="text-lg font-semibold dark:text-white-light">Enter Details of Raw Materials</h5>
                    <Button
                        text={
                            <span className="flex items-center">
                                {getIcon(IconType.back)}
                                Back
                            </span>
                        }
                        type={ButtonType.link}
                        variant={ButtonVariant.primary}
                        link="/erp/inventory/products"
                        size={ButtonSize.small}
                    />
                </div>
                <ProductForm/>
            </div>
        </PageWrapper>
    );
};

export default Create;
