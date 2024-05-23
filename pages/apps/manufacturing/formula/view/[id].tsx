import React, {useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from '@/store';
import {useRouter} from 'next/router';
import {setPageTitle} from '@/store/slices/themeConfigSlice';
import {clearProductAssemblyState, showDetails} from '@/store/slices/productAssemblySlice';
import PageWrapper from '@/components/PageWrapper';
import {ButtonType, ButtonVariant, IconType} from '@/utils/enums';
import AppLayout from '@/components/Layouts/AppLayout';

const View = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const {loading, productAssemblyDetail} = useAppSelector(state => state.productAssembly);

    useEffect(() => {
        dispatch(setPageTitle('Product Formula'));
        dispatch(clearProductAssemblyState());
        const productAssemblyId = router.query.id;
        if (productAssemblyId) {
            const id = Array.isArray(productAssemblyId) ? productAssemblyId[0] : productAssemblyId;
            dispatch(showDetails(parseInt(id)));
        }
    }, [router.query.id, dispatch]);

    return (
        <PageWrapper
            loading={loading}
            breadCrumbItems={[]}
            embedLoader={true}
            title="Formula Details"
            buttons={[
                // {
                //     text: 'Edit',
                //     type: ButtonType.link,
                //     variant: ButtonVariant.info,
                //     icon: IconType.edit,
                //     link: '/erp/inventory/product-assembly/edit/' + router.query.id
                // },
                {
                    text: 'Print',
                    type: ButtonType.link,
                    variant: ButtonVariant.success,
                    icon: IconType.print,
                    link: '/apps/manufacturing/formula/print/' + router.query.id
                },
                {
                    text: 'Back',
                    type: ButtonType.link,
                    variant: ButtonVariant.primary,
                    icon: IconType.back,
                    link: '/apps/manufacturing/formula'
                }
            ]}
        >
            {productAssemblyDetail && (
                <div className="my-5">
                    <div className="flex items-start justify-between my-5">
                        <div className="flex flex-col gap-3">
                            <span className="text-base">
                                <strong>Formula Name: </strong> {productAssemblyDetail?.formula_name}
                            </span>
                            <span className="text-base">
                                <strong>Formula Code: </strong> {productAssemblyDetail?.formula_code}
                            </span>
                        </div>
                        <div className="flex flex-col gap-3">
                            <span className="text-base">
                                <strong>Color
                                    Code: </strong> {productAssemblyDetail?.color_code?.name + ' (' + productAssemblyDetail?.color_code?.hex_code + ')'}
                            </span>
                            <span className="text-base">
                                <strong>Category: </strong> {productAssemblyDetail?.category?.name}
                            </span>
                        </div>
                    </div>
                    <h3 className="text-lg font-bold">Formula Product Details:</h3>
                    <table>
                        <thead>
                        <tr>
                            <th>Sr. No</th>
                            <th>Product</th>
                            <th>Unit</th>
                            <th>Unit Price</th>
                            <th>Qty</th>
                            <th>Total</th>
                        </tr>
                        </thead>
                        <tbody>
                        {productAssemblyDetail?.product_assembly_items.map((item: any, index: any) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>
                                    <div className="flex justify-start flex-col items-start">
                                        <span style={{fontSize: 8}}>Code: {item.product?.item_code}</span>
                                        <span>{item.product?.title}</span>
                                        <span style={{fontSize: 8}}>VM: {item.product?.valuation_method}</span>
                                    </div>
                                </td>
                                <td>{item.unit?.name}</td>
                                <td>{item.cost}</td>
                                <td>{item.quantity}</td>
                                <td>{(parseFloat(item.cost) * parseFloat(item.quantity)).toFixed(2)}</td>
                            </tr>
                        ))}
                        </tbody>
                        <tfoot>
                        <tr>
                            <th colSpan={3}>Total</th>
                            <td>
                                {productAssemblyDetail?.product_assembly_items.reduce((totalCost: number, item: any) => totalCost + parseFloat(item.cost), 0).toFixed(2)}
                            </td>
                            <td>
                                {productAssemblyDetail?.product_assembly_items.reduce((totalQuantity: number, item: any) => totalQuantity + parseFloat(item.quantity), 0).toFixed(2)}
                            </td>
                            <td>
                                {productAssemblyDetail?.product_assembly_items
                                    .reduce((total: number, item: any) => total + parseFloat(item.cost) * parseFloat(item.quantity), 0)
                                    .toFixed(2)}
                            </td>
                        </tr>
                        </tfoot>
                    </table>
                </div>
            )}
        </PageWrapper>
    );
};

View.getLayout = (page: any) => <AppLayout>{page}</AppLayout>;
export default View;
