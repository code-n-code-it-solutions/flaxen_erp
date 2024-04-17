import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {ThunkDispatch} from "redux-thunk";
import {IRootState} from "@/store";
import {AnyAction} from "redux";
import {useRouter} from "next/router";
import {setPageTitle} from "@/store/slices/themeConfigSlice";
import {clearProductionState, showDetails} from "@/store/slices/productionSlice";
import PageWrapper from "@/components/PageWrapper";
import {generatePDF, getIcon} from "@/utils/helper";
import Button from "@/components/Button";
import {ButtonSize, ButtonType, ButtonVariant, IconType} from "@/utils/enums";
import Preview from "@/pages/erp/inventory/productions/preview";


const View = () => {
    const dispatch = useDispatch<ThunkDispatch<IRootState, any, AnyAction>>();
    const router = useRouter();
    const {loading, productionDetail} = useSelector((state: IRootState) => state.production);
    console.log(productionDetail);
    const [printLoading, setPrintLoading] = useState<boolean>(false)
    const breadCrumbItems = [
        {
            title: 'Home',
            href: '/main',
        },
        {
            title: 'Inventory Dashboard',
            href: '/inventory',
        },
        {
            title: 'All Productions',
            href: '/inventory/production',
        },
        {
            title: 'Production Details',
            href: '#',
        },
    ];

    useEffect(() => {
        dispatch(setPageTitle('Production Details'));
        dispatch(clearProductionState());

        const productionId = router.query.id;

        if (productionId) {
            // If the productId is an array (with catch-all routes), take the first element.
            const id = Array.isArray(productionId) ? productionId[0] : productionId;
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
                        Production Details
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
                            onClick={() => generatePDF(<Preview content={productionDetail}/>, setPrintLoading)}
                        />
                        <Button
                            text={(
                                <span className="flex items-center">
                                    {getIcon(IconType.back)}
                                    Back
                                </span>
                            )}
                            type={ButtonType.link}
                            variant={ButtonVariant.primary}
                            link="/inventory/productions"
                            size={ButtonSize.small}
                        />
                    </div>
                </div>
                {productionDetail && (
                    <div className='flex w-full flex-col justify-center '>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full mt-3 ">
                            <div className='flex flex-col md:flex-row justify-start items-center gap-3'>
                                <strong>Batch Number: </strong>
                                <span>{productionDetail.batch_number}</span>

                            </div>
                            <div className="flex flex-col md:flex-row justify-start items-center gap-3">
                                <strong>Number of Quantity (Kg):</strong>
                                <span>{productionDetail?.no_of_quantity}</span>
                            </div>

                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full mt-3 ">
                            <div className="flex flex-col md:flex-row justify-start items-center gap-3">
                                <strong>Color Code : </strong>
                                <span>
                                    {productionDetail?.product_assembly?.color_code?.code}
                                </span>
                            </div>
                            <div className="flex flex-col md:flex-row justify-start items-center gap-3">
                                <strong>Formula Code:</strong>
                                <span> {productionDetail?.product_assembly?.formula_code} </span>
                            </div>

                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full mt-3 ">
                            <div className="flex flex-col md:flex-row justify-start items-center gap-3">
                                <strong>Category </strong>
                                <span>{productionDetail?.product_assembly?.category.name} </span>
                            </div>
                            <div className="flex flex-col md:flex-row justify-start items-center gap-3">
                                <strong>Print At:</strong>
                                <span>{(new Date()).toLocaleDateString()}</span>
                            </div>
                            <div className="flex flex-col md:flex-row justify-start items-center gap-3">
                                <strong>Created At:</strong>
                                <span>{productionDetail.created_at}</span>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex flex-col ">
                    <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                            <div className="overflow-hidden">
                                <table
                                    className="min-w-full text-left text-sm font-light text-surface dark:text-white">
                                    <thead
                                        className="border-b border-neutral-200 font-medium dark:border-white/10">
                                    <tr>
                                        <th scope="col" className="px-6 py-4">Sr.No</th>
                                        <th scope="col" className="px-6 py-4">Product</th>
                                        <th scope="col" className="px-6 py-4">Unit</th>
                                        <th scope="col" className="px-6 py-4">Unit Price</th>
                                        <th scope="col" className="px-6 py-4">Qty</th>
                                        <th scope="col" className="px-6 py-4">Available Qty</th>
                                        <th scope="col" className="px-6 py-4">Req Qty</th>
                                        <th scope="col" className="px-6 py-4">Total Cost</th>
                                    </tr>
                                    </thead>
                                    <tbody>

                                    {productionDetail?.production_items.map((item: any, index: any) => (

                                        <tr key={index}
                                            className="border-b border-neutral-200 transition duration-300 ease-in-out hover:bg-neutral-100 dark:border-white/10 dark:hover:bg-neutral-600">
                                            <td className="whitespace-nowrap px-6 py-4 font-medium">{index + 1}</td>
                                            <td className="whitespace-nowrap px-6 py-4">{item.product?.title}</td>
                                            <td className="whitespace-nowrap px-6 py-4">{item.unit?.name}</td>
                                            <td className="whitespace-nowrap px-6 py-4">{item.unit_cost}</td>
                                            <td className="whitespace-nowrap px-6 py-4">{item.quantity}</td>
                                            <td className="whitespace-nowrap px-6 py-4">{item.available_quantity}</td>
                                            <td className="whitespace-nowrap px-6 py-4">{item.required_quantity}</td>

                                            <td className="whitespace-nowrap px-6 py-4">{(parseFloat(item.unit_cost) * parseFloat(item.quantity)).toFixed(2)}</td>

                                        </tr>
                                    ))}
                                    <tr
                                        className="border-b border-neutral-200 transition duration-300 ease-in-out hover:bg-neutral-100 dark:border-white/10 dark:hover:bg-neutral-600">
                                        <td></td>
                                        <td colSpan={2} className="whitespace-nowrap px-6 py-4">Total</td>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            {productionDetail?.production_items.reduce((totalCost: number, item: any) => totalCost + parseFloat(item.unit_cost), 0)}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            {productionDetail?.production_items.reduce((totalQuantity: number, item: any) => totalQuantity + parseFloat(item.quantity), 0)}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            {productionDetail?.production_items.reduce((total_available_quntity: number, item: any) => total_available_quntity + parseFloat(item.available_quantity), 0)}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            {productionDetail?.production_items.reduce((total_require_quntity: number, item: any) => total_require_quntity + parseFloat(item.required_quantity), 0)}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            {productionDetail?.production_items
                                                .reduce((total: number, item: any) => total + parseFloat(item.unit_cost) * parseFloat(item.quantity), 0)
                                                .toFixed(2)}
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PageWrapper>
    );
};

export default View;
