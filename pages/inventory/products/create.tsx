import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {ThunkDispatch} from "redux-thunk";
import {IRootState} from "@/store";
import {AnyAction} from "redux";
import {useRouter} from "next/router";
import {setPageTitle} from "@/store/slices/themeConfigSlice";
import ProductForm from "@/pages/inventory/products/ProductForm";
import {clearRawProductState} from "@/store/slices/rawProductSlice";
import PageWrapper from "@/components/PageWrapper";
import {ButtonSize, ButtonType, ButtonVariant} from "@/utils/enums";
import Button from "@/components/Button";

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
            href: '/inventory/products',
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
            router.push('/inventory/products');
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
                        text={<span className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ltr:mr-2 rtl:ml-2" width="24"
                                 height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M15 5L9 12L15 19" stroke="currentColor" strokeWidth="1.5"
                                      strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Back
                        </span>}
                        type={ButtonType.link}
                        variant={ButtonVariant.primary}
                        link="/inventory/products"
                        size={ButtonSize.small}
                    />
                </div>
                <ProductForm/>
            </div>
        </PageWrapper>
    );
};

export default Create;
