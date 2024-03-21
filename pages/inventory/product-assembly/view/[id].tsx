import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { IRootState } from '@/store';
import { AnyAction } from 'redux';
import { useRouter } from 'next/router';
import { setPageTitle } from '@/store/slices/themeConfigSlice';
import { clearProductAssemblyState, showDetails } from '@/store/slices/productAssemblySlice';
import PageWrapper from '@/components/PageWrapper';
import { generatePDF, getIcon, imagePath } from '@/utils/helper';
import Image from 'next/image';
import Button from '@/components/Button';
import { ButtonSize, ButtonType, ButtonVariant, IconType } from '@/utils/enums';
import Preview from '@/pages/inventory/product-assembly/preview';

const View = () => {
    const dispatch = useDispatch<ThunkDispatch<IRootState, any, AnyAction>>();
    const router = useRouter();
    const { loading, productAssemblyDetail } = useSelector((state: IRootState) => state.productAssembly);
    const [printLoading, setPrintLoading] = useState<boolean>(false);
    const breadCrumbItems = [
        {
            title: 'Home',
            href: '/main',
        },
        {
            title: 'All Product Assembly',
            href: '/inventory/product-assembly',
        },
        {
            title: 'Product Assembly Details',
            href: '#',
        },
    ];

    useEffect(() => {
        dispatch(setPageTitle('Product Assembly Details'));
        dispatch(clearProductAssemblyState());

        const productAssemblyId = router.query.id;
        // console.log('Product Assembly ID:', productAssemblyId);

        if (productAssemblyId) {
            // If the productId is an array (with catch-all routes), take the first element.
            const id = Array.isArray(productAssemblyId) ? productAssemblyId[0] : productAssemblyId;
            dispatch(showDetails(parseInt(id)));
        }
    }, [router.query.id, dispatch]);

    return (
        <PageWrapper loading={loading} breadCrumbItems={breadCrumbItems} embedLoader={true}>
            <div>
                <div className="mb-5 flex items-center justify-between">
                    <h5 className="text-lg font-semibold dark:text-white-light">Details of Product Assembly</h5>
                    <div className="flex justify-end gap-3">
                        <Button
                            text={
                                printLoading ? (
                                    'Generating...'
                                ) : (
                                    <span className="flex items-center">
                                        {getIcon(IconType.print, 0, 0, 'h-5 w-5 ltr:mr-2 rtl:ml-2')}
                                        Print
                                    </span>
                                )
                            }
                            type={ButtonType.button}
                            variant={ButtonVariant.success}
                            size={ButtonSize.small}
                            disabled={printLoading}
                            onClick={() => generatePDF(<Preview content={productAssemblyDetail} />, setPrintLoading)}
                        />
                        <Button
                            text={
                                <span className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ltr:mr-2 rtl:ml-2" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path d="M15 5L9 12L15 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    Back
                                </span>
                            }
                            type={ButtonType.link}
                            variant={ButtonVariant.primary}
                            link="/inventory/product-assembly"
                            size={ButtonSize.small}
                        />
                    </div>
                </div>
                {productAssemblyDetail && (
                            <div className="h-950 px-10">
                                <div className="mt-10 mb-5 flex flex-col items-center justify-center">
                                    <h1 className="font-bold text-2xl">Product Assembly</h1>
                                </div>
                                <div className="flex items-start justify-between p-10 mb-10">
                                    <div className="flex flex-col gap-5">
                                        <span className="mb-15 text-base">
                                            <strong>Formula Name: </strong> {productAssemblyDetail?.formula_name}
                                        </span>
                                        <span className="text-base mb-15">
                                            <strong>Formula Code: </strong> {productAssemblyDetail?.formula_code}
                                        </span>
                                    </div>
                                    <div className="flex flex-col gap-5">
                                        <span className="text-base mb-15">
                                            <strong>Color Code: </strong> {productAssemblyDetail?.color_code?.name + ' (' + productAssemblyDetail?.color_code?.hex_code + ')'}
                                        </span>
                                        <span className="text-base mb-15">
                                            <strong>Category: </strong> {productAssemblyDetail?.category?.name}
                                        </span>
                                    </div>
                                </div>
                                <h3 className="mb-8 text-xl font-bold">Formula Product Details:</h3>
                                <table>
                                    <thead>
                                        <tr>
                                            <th >Sr. No</th>
                                            <th >Product</th>
                                            <th>Unit</th>
                                            <th >Unit Price</th>
                                            <th >Qty</th>
                                            <th >Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {productAssemblyDetail?.product_assembly_items.map((item: any, index: any) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{item.product?.title}</td>
                                                <td>{item.unit?.name}</td>
                                                <td>{item.cost}</td>
                                                <td>{item.quantity}</td>
                                                <td>{(parseFloat(item.cost) * parseFloat(item.quantity)).toFixed(2)}</td>
                                            </tr>
                                        ))}
                                        <tr>
                                            <td></td>
                                            <th >Total</th>
                                            <td></td>
                                            <td>
                                                {productAssemblyDetail?.product_assembly_items.reduce((totalCost: number, item: any) => totalCost + parseFloat(item.cost), 0)}
                                            </td>
                                            <td>
                                                {productAssemblyDetail?.product_assembly_items.reduce((totalQuantity: number, item: any) => totalQuantity + parseFloat(item.quantity), 0)}
                                            </td>
                                            <td>
                                                {productAssemblyDetail?.product_assembly_items
                                                    .reduce((total: number, item: any) => total + parseFloat(item.cost) * parseFloat(item.quantity), 0)
                                                    .toFixed(2)}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                )}
            </div>
        </PageWrapper>
    );
};

export default View;
