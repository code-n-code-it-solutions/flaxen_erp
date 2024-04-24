import React, {useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from "@/store";
import {useRouter} from "next/router";
import {setPageTitle} from "@/store/slices/themeConfigSlice";
import {clearRawProductState, showDetails} from "@/store/slices/rawProductSlice";
import PageWrapper from "@/components/PageWrapper";
import {serverFilePath} from "@/utils/helper";
import Image from "next/image";
import {ButtonType, ButtonVariant, IconType} from "@/utils/enums";

const View = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const {loading, rawProductDetail} = useAppSelector((state) => state.rawProduct);
    const [printLoading, setPrintLoading] = useState<boolean>(false)
    const breadCrumbItems = [
        {
            title: 'Home',
            href: '/erp/main',
        },
        {
            title: 'Inventory Dashboard',
            href: '/erp/inventory',
        },
        {
            title: 'All Raw Materials',
            href: '/erp/inventory/products',
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
        if (productId) {
            const id = Array.isArray(productId) ? productId[0] : productId;
            dispatch(showDetails(parseInt(id)));
        }

    }, [router.query.id, dispatch]);

    return (
        <PageWrapper
            loading={loading}
            breadCrumbItems={breadCrumbItems}
            embedLoader={true}
            title="Details Raw Material"
            buttons={[
                {
                    text: 'Edit',
                    type: ButtonType.link,
                    variant: ButtonVariant.info,
                    icon: IconType.edit,
                    link: '/erp/inventory/products/edit/' + router.query.id
                },
                {
                    text: 'Print',
                    type: ButtonType.link,
                    variant: ButtonVariant.success,
                    icon: IconType.print,
                    link: '/erp/inventory/products/print/' + router.query.id
                },
                {
                    text: 'Back',
                    type: ButtonType.link,
                    variant: ButtonVariant.primary,
                    icon: IconType.back,
                    link: '/erp/inventory/products'
                }
            ]}
        >
            <div>

                {rawProductDetail && (
                    <div className='flex w-full flex-col justify-center items-center'>
                        <div className='w-full flex justify-center items-center'>
                            <Image priority={true} width={24} height={24} src={serverFilePath(rawProductDetail?.thumbnail?.path)}
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
                                <strong>Valuation Method: </strong>
                                <span>{rawProductDetail.valuation_method}</span>
                            </div>
                            <div className="flex flex-col md:flex-row justify-start items-center gap-3">
                                <strong>Valuated Price: </strong>
                                <span>{rawProductDetail.valuated_unit_price}</span>
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
