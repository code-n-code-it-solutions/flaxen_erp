import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {ThunkDispatch} from "redux-thunk";
import {IRootState} from "@/store";
import {AnyAction} from "redux";
import {useRouter} from "next/router";
import {setPageTitle} from "@/store/slices/themeConfigSlice";
import {clearRawProductState, showDetails} from "@/store/slices/rawProductSlice";
import PageWrapper from "@/components/PageWrapper";
import {generatePDF, getIcon, imagePath} from "@/utils/helper";
import Image from "next/image";
import Button from "@/components/Button";
import {ButtonSize, ButtonType, ButtonVariant, IconType} from "@/utils/enums";
import Preview from "@/pages/inventory/products/preview";

const View = () => {
    const dispatch = useDispatch<ThunkDispatch<IRootState, any, AnyAction>>();
    const router = useRouter();
    const {loading, rawProductDetail} = useSelector((state: IRootState) => state.rawProduct);
    const [printLoading, setPrintLoading] = useState<boolean>(false)
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
            title: 'Product Details',
            href: '#',
        },
    ];

    useEffect(() => {
        dispatch(setPageTitle('Details Raw Material'));
        dispatch(clearRawProductState());

        const productId = router.query.id;
        // console.log('Product ID:', productId);

        if (productId) {
            // If the productId is an array (with catch-all routes), take the first element.
            const id = Array.isArray(productId) ? productId[0] : productId;
            dispatch(showDetails(parseInt(id)));
        }

    }, [router.query.id, dispatch]);

    return (
        <PageWrapper
            loading={loading}
            breadCrumbItems={breadCrumbItems}
            embedLoader={true}
        >
            <div>
                <div className="mb-5 flex items-center justify-between">
                    <h5 className="text-lg font-semibold dark:text-white-light">
                        Details of Raw Materials
                    </h5>
                    <div className="flex justify-end gap-3">
                        <Button
                            text={
                                printLoading
                                    ? 'Generating...'
                                    : <span className="flex items-center">
                                        {getIcon(IconType.print, 0, 0, 'h-5 w-5 ltr:mr-2 rtl:ml-2')}
                                        Print
                                    </span>
                            }
                            type={ButtonType.button}
                            variant={ButtonVariant.success}
                            size={ButtonSize.small}
                            disabled={printLoading}
                            onClick={() => generatePDF(<Preview content={rawProductDetail}/>, setPrintLoading)}
                        />
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
                </div>
                {console.log(rawProductDetail)}
                {rawProductDetail && (
                    <div className='flex w-full flex-col justify-center items-center'>
                        <div className='w-full flex justify-center items-center'>
                            <Image width={24} height={24} src={imagePath(rawProductDetail?.thumbnail)}
                                   alt="product image"
                                   className="w-24 h-24 object-cover"/>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full mt-3">
                            <div className="flex flex-col md:flex-row justify-start items-center gap-3">
                                <strong>Item Code: </strong>
                                <span>{rawProductDetail.item_code}</span>
                            </div>
                            <div className="flex flex-col md:flex-row justify-start items-center gap-3">
                                <strong>Title: </strong>
                                <span>{rawProductDetail.title}</span>
                            </div>
                            <div className="flex flex-col md:flex-row justify-start items-center gap-3">
                                <strong>Main Unit: </strong>
                                <span>{rawProductDetail.unit?.name}</span>
                            </div>
                            <div className="flex flex-col md:flex-row justify-start items-center gap-3">
                                <strong>Sub Unit: </strong>
                                <span>{rawProductDetail.sub_unit?.name}</span>
                            </div>
                            <div className="flex flex-col md:flex-row justify-start items-center gap-3">
                                <strong>Min Stock Alert: </strong>
                                <span>{rawProductDetail.min_stock_level + ' (' + rawProductDetail.unit?.name + ')'}</span>
                            </div>
                            <div className="flex flex-col md:flex-row justify-start items-center gap-3">
                                <strong>Opening Stock: </strong>
                                <span>{rawProductDetail.opening_stock + ' (' + rawProductDetail.sub_unit?.name + ')'}</span>
                            </div>
                            <div className="flex flex-col md:flex-row justify-start items-center gap-3">
                                <strong>Opening Stock Balance: </strong>
                                <span>{rawProductDetail.opening_stock_unit_balance}</span>
                            </div>
                            <div className="flex flex-col md:flex-row justify-start items-center gap-3">
                                <strong>Opening Stock Total Balance: </strong>
                                <span>{rawProductDetail.opening_stock_total_balance}</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full mt-3">
                            <div className="flex flex-col justify-start items-start gap-3">
                                <strong>Purchase Description: </strong>
                                <span>{rawProductDetail.purchase_description}</span>
                            </div>
                            <div className="flex flex-col md:flex-row justify-start items-start gap-3">
                                <strong>Sale Description: </strong>
                                <span>{rawProductDetail.sale_description}</span>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </PageWrapper>
    );
};

export default View;
