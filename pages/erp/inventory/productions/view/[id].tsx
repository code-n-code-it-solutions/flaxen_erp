import React, {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from "@/store";
import {useRouter} from "next/router";
import {setPageTitle} from "@/store/slices/themeConfigSlice";
import {clearProductionState, showDetails} from "@/store/slices/productionSlice";
import PageWrapper from "@/components/PageWrapper";
import {ButtonType, ButtonVariant, IconType} from "@/utils/enums";


const View = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const {loading, productionDetail} = useAppSelector(state => state.production);
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
            title: 'All Productions',
            href: '/erp/inventory/production',
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
            const id = Array.isArray(productionId) ? productionId[0] : productionId;
            dispatch(showDetails(parseInt(id)));
        }

    }, [router.query.id, dispatch]);

    return (

        <PageWrapper
            loading={loading}
            breadCrumbItems={breadCrumbItems}
            embedLoader={true}
            title="Production Details"
            buttons={[
                // {
                //     text: 'Edit',
                //     type: ButtonType.link,
                //     variant: ButtonVariant.info,
                //     icon: IconType.edit,
                //     link: '/erp/inventory/productions/edit/' + router.query.id
                // },
                {
                    text: 'Print',
                    type: ButtonType.link,
                    variant: ButtonVariant.success,
                    icon: IconType.print,
                    link: '/erp/inventory/productions/print/' + router.query.id
                },
                {
                    text: 'Back',
                    type: ButtonType.link,
                    variant: ButtonVariant.primary,
                    icon: IconType.back,
                    link: '/erp/inventory/productions'
                }
            ]}
        >
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
                                    <th>Sr.No</th>
                                    <th>Product</th>
                                    <th>Unit</th>
                                    <th>Unit Price</th>
                                    <th>Qty</th>
                                    <th>Available Qty</th>
                                    <th>Req Qty</th>
                                    <th>Total Cost</th>
                                </tr>
                                </thead>
                                <tbody>

                                {productionDetail?.production_items.map((item: any, index: any) => (

                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>
                                            <div className="flex justify-start flex-col items-start">
                                                <span style={{fontSize: 8}}>{item.product?.item_code}</span>
                                                <span>{item.product?.title}</span>
                                                <span
                                                    style={{fontSize: 8}}>{item.product?.valuation_method}</span>
                                            </div>
                                        </td>
                                        <td>{item.unit?.name}</td>
                                        <td>{item.unit_cost}</td>
                                        <td>{item.quantity}</td>
                                        <td>{item.available_quantity}</td>
                                        <td>{item.required_quantity}</td>
                                        <td>{(parseFloat(item.unit_cost) * parseFloat(item.quantity)).toFixed(2)}</td>

                                    </tr>
                                ))}
                                </tbody>
                                <tfoot>
                                <tr>
                                    <td colSpan={3} className="text-center">Total</td>
                                    <td>
                                        {productionDetail?.production_items.reduce((total: number, item: any) => total + parseFloat(item.unit_cost), 0).toFixed(2)}
                                    </td>
                                    <td>
                                        {productionDetail?.production_items.reduce((total: number, item: any) => total + parseFloat(item.quantity), 0).toFixed(2)}
                                    </td>
                                    <td>
                                        {productionDetail?.production_items.reduce((total: number, item: any) => total + parseFloat(item.available_quantity), 0).toFixed(2)}
                                    </td>
                                    <td>
                                        {productionDetail?.production_items.reduce((total: number, item: any) => total + parseFloat(item.required_quantity), 0).toFixed(2)}
                                    </td>
                                    <td>
                                        {productionDetail?.production_items
                                            .reduce((total: number, item: any) => total + parseFloat(item.unit_cost) * parseFloat(item.quantity), 0)
                                            .toFixed(2)}
                                    </td>
                                </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </PageWrapper>
    );
};

export default View;
