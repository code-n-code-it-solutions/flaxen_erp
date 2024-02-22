import React, {useEffect, useState} from 'react';
import Breadcrumb from "@/components/Breadcrumb";
import ImageUploader from "@/components/ImageUploader";
import Select from 'react-select';
import Link from "next/link";
import {useDispatch, useSelector} from "react-redux";
import {ThunkDispatch} from "redux-thunk";
import {IRootState} from "@/store";
import {AnyAction} from "redux";
import {getUnits} from "@/store/slices/unitSlice";
import {setAuthToken, setContentType} from "@/configs/api.config";
import {clearRawProduct, storeRawProduct} from "@/store/slices/rawProductSlice";
import {useRouter} from "next/router";
import {setPageTitle} from "@/store/slices/themeConfigSlice";
import ProductForm from "@/pages/inventory/products/ProductForm";

interface IFormData {
    item_code: string;
    title: string;
    unit_id: string;
    sub_unit_id: string;
    purchase_description: string;
    value_per_unit: string;
    valuation_method: string;
    min_stock_level: string;
    opening_stock: string;
    opening_stock_balance: string;
    sale_description: string;
    image: File | null;
}

const Create = () => {
    const dispatch = useDispatch<ThunkDispatch<IRootState, any, AnyAction>>();
    const router = useRouter();
    dispatch(setPageTitle( 'Edit Raw Material'));

    return (
        <div>
            <Breadcrumb items={[
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
            ]}/>
            <div className="pt-5">
                <div className="panel">
                    <div className="mb-5 flex items-center justify-between">
                        <h5 className="text-lg font-semibold dark:text-white-light">Enter Details of Raw Materials</h5>
                        <Link href="/inventory/products"
                              className="btn btn-primary btn-sm m-1">
                            <span className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ltr:mr-2 rtl:ml-2" width="24"
                                     height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M15 5L9 12L15 19" stroke="currentColor" strokeWidth="1.5"
                                          strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                Back
                            </span>
                        </Link>
                    </div>
                    <ProductForm id={router.query.id} />
                </div>
            </div>
        </div>
    );
};

export default Create;
