import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { useRouter } from 'next/router';
import { setPageTitle } from '@/store/slices/themeConfigSlice';
import { clearFillingState, showDetails } from '@/store/slices/fillingSlice';
import PageWrapper from '@/components/PageWrapper';
import { AppBasePath, ButtonType, ButtonVariant, IconType } from '@/utils/enums';
import AppLayout from '@/components/Layouts/AppLayout';
import DetailPageHeader from '@/components/apps/DetailPageHeader';
import useSetActiveMenu from '@/hooks/useSetActiveMenu';
import { getFillingProducts } from '@/store/slices/rawProductSlice';

const View = () => {
    useSetActiveMenu(AppBasePath.Filling);
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { loading, fillingDetail } = useAppSelector((state) => state.filling);
    const [ids, setIds] = useState<string[]>([]);
    const [batchCalculations, setBatchCalculations] = useState<any[]>([]);
    const [itemWiseCalculations, setItemWiseCalculations] = useState([]);

    const calculateItemWise = () => {
        const calculations = fillingDetail.filling_calculations.map((calculation: any) => {
            const perKgCost = calculation.product_assembly.product_assembly_items.reduce((acc: number, item: any) => acc + parseFloat(item.total), 0);
            const rawProduct = calculation.product;
            const totalCost = ((parseFloat(calculation.capacity) * perKgCost) + parseFloat(rawProduct.valuated_unit_price)) * calculation.required_quantity;
            const totalSalePrice = ((parseFloat(calculation.capacity) * perKgCost) + (parseFloat(rawProduct.retail_price)) * calculation.required_quantity);

            return {
                productId: rawProduct.id,
                productTitle: rawProduct.title,
                ...calculation,
                costOfGoods: totalCost,
                salePrice: totalSalePrice
            };
        });
        setItemWiseCalculations(calculations);
    };

    const calculateBatchCalculation = () => {
        // Get the batch usage order (FIFO or LIFO)
        const batchUsageOrder = fillingDetail.batch_usage_order;

        // Sort the production fillings based on the batch usage order
        const sortedBatches = [...fillingDetail.production_fillings].sort((a: any, b: any) => {
            const dateA: any = new Date(a.production.created_at);
            const dateB: any = new Date(b.production.created_at);
            return batchUsageOrder === 'first-in-first-out' ? dateA - dateB : dateB - dateA;
        });

        let totalUsed = 0;
        const fillingQuantity = fillingDetail.filling_calculations.reduce((acc: number, item: any) => acc + parseFloat(item.filling_quantity), 0);
        console.log(fillingQuantity);
        const batchCalculations = sortedBatches.map((batch: any) => {
            console.log(batch);
            const batchQuantity = batch.production.no_of_quantity;
            let used = 0;

            if (fillingQuantity - totalUsed > 0) {
                used = Math.min(batchQuantity, fillingQuantity - totalUsed);
                totalUsed += used;
            }

            return {
                batch_number: batch.production.batch_number,
                quantity: batchQuantity,
                used,
                remaining: batchQuantity - used,
                created_at: batch.production.created_at
            };
        });

        setBatchCalculations(batchCalculations);
    };

    useEffect(() => {
        if (fillingDetail) {
            calculateItemWise();
            calculateBatchCalculation();
        }
    }, [fillingDetail]);

    useEffect(() => {
        dispatch(setPageTitle('Fillings Details'));
        dispatch(clearFillingState());
        const fillingId = router.query.id;

        if (fillingId) {
            setIds(Array.isArray(fillingId) ? fillingId : [fillingId]);
            const id = Array.isArray(fillingId) ? fillingId[0] : fillingId;
            dispatch(showDetails(parseInt(id)));
        }

    }, [router.query.id, dispatch]);

    return (
        <div>
            <DetailPageHeader
                appBasePath={AppBasePath.Filling}
                title="Filling Details"
                middleComponent={{
                    show: true,
                    edit: {
                        show: false
                    },
                    print: {
                        show: true,
                        onClick: () => router.push('/apps/manufacturing/operations/fillings/print/' + ids.join('/'))
                    },
                    delete: {
                        show: false
                    },
                    duplicate: {
                        show: true,
                        onClick: () => console.log('duplicate')
                    },
                    email: {
                        show: true,
                        onClick: () => console.log('email')
                    }
                }}
                backButton={{
                    show: true,
                    backLink: '/apps/manufacturing/operations/fillings'
                }}
            />
            <PageWrapper
                loading={loading}
                breadCrumbItems={[]}
                embedLoader={true}
            >
                {fillingDetail && (
                    <div className="w-full">
                        <div className="flex flex-col md:flex-row justify-between items-start gap-3">
                            <div className="flex flex-col justify-start items-start gap-1">
                                <span>
                                    <strong>Filling Code: </strong>
                                    {fillingDetail?.filling_code}
                                </span>
                                <span>
                                    <strong>Filling Date: </strong>
                                    {fillingDetail?.filling_date}
                                </span>
                                <span>
                                    <strong>Filling Time: </strong>
                                    {fillingDetail?.filling_time}
                                </span>
                            </div>
                            <div className="flex flex-col justify-start items-start gap-1">
                                <span>
                                    <strong>Batch Number: </strong>
                                    {fillingDetail?.production?.batch_number}
                                </span>
                                <span>
                                    <strong>Filling Shift: </strong>
                                    {fillingDetail?.filling_shift_id}
                                </span>
                                <span>
                                    <strong>Created At: </strong>
                                    {(new Date(fillingDetail?.created_at)).toLocaleDateString()}
                                </span>
                            </div>
                        </div>

                        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-5">
                            {/*<div className="table-responsive">*/}
                            {/*    <h5 className="text-lg font-semibold dark:text-white-light mb-3">Cost Calculation</h5>*/}
                            {/*    <table>*/}
                            {/*        <thead>*/}
                            {/*        <tr>*/}
                            {/*            <th>Filling</th>*/}
                            {/*            <th>No of Fillings</th>*/}
                            {/*            <th>Cost Goods</th>*/}
                            {/*            <th>Sale Price</th>*/}
                            {/*            <th>Total Sale Cost</th>*/}
                            {/*        </tr>*/}
                            {/*        </thead>*/}
                            {/*        <tbody>*/}
                            {/*        {itemWiseCalculations.length > 0*/}
                            {/*            ? (*/}
                            {/*                itemWiseCalculations.map((item: any, index: number) => (*/}
                            {/*                    <tr key={index}>*/}
                            {/*                        <td>*/}
                            {/*                            <div className="flex justify-start flex-col items-start">*/}
                            {/*                                <span*/}
                            {/*                                    style={{ fontSize: 8 }}>Code: {item.product?.item_code}</span>*/}
                            {/*                                <span>{item.product?.title}</span>*/}
                            {/*                                <span*/}
                            {/*                                    style={{ fontSize: 8 }}>VM: {item.product?.valuation_method}</span>*/}
                            {/*                            </div>*/}
                            {/*                        </td>*/}
                            {/*                        <td>{item.filling_quantity + '(Kg) / ' + item.required_quantity}</td>*/}
                            {/*                        <td>{parseFloat(item.costOfGoods).toFixed(2)}</td>*/}
                            {/*                        <td>{parseFloat(item.salePrice).toFixed(2)}</td>*/}
                            {/*                        <td>{(parseFloat(item.salePrice) * parseFloat(item.required_quantity)).toFixed(2)}</td>*/}
                            {/*                    </tr>*/}
                            {/*                ))*/}
                            {/*            ) : (*/}
                            {/*                <tr>*/}
                            {/*                    <td colSpan={5} className="text-center">No data found</td>*/}
                            {/*                </tr>*/}
                            {/*            )}*/}
                            {/*        </tbody>*/}
                            {/*    </table>*/}
                            {/*</div>*/}

                            <div className="table-responsive">
                                <h5 className="text-lg font-semibold dark:text-white-light mb-3">Fillings</h5>
                                <table>
                                    <thead>
                                    <tr>
                                        <th>Sr.No</th>
                                        <th>Product Name</th>
                                        <th>Unit</th>
                                        <th>Unit Cost</th>
                                        {/*<th>Qty</th>*/}
                                        <th>Capacity</th>
                                        {/*<th>Required</th>*/}
                                        <th>No Of Fillings</th>
                                        <th>Sale Price/Filling</th>
                                    </tr>
                                    </thead>
                                    <tbody>

                                    {fillingDetail?.filling_calculations.map((item: any, index: any) => (

                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>
                                                <div className="flex justify-start flex-col items-start">
                                                    <span style={{ fontSize: 8 }}>Code: {item.product?.item_code}</span>
                                                    <span>{item.product?.title}</span>
                                                    <span
                                                        style={{ fontSize: 8 }}>VM: {item.product?.valuation_method}</span>
                                                </div>
                                            </td>
                                            <td>{item.unit?.name}</td>
                                            <td>{item.unit_price}</td>
                                            {/*<td>{item.filling_quantity}</td>*/}
                                            <td>{item.capacity}</td>
                                            {/*<td>{item.required_quantity.toFixed(5)}</td>*/}
                                            <td>
                                                {item.filling_quantity + '(Kg) / ' + item.required_quantity}
                                            </td>
                                            <td>{item.retail_price.toFixed(2)}</td>

                                        </tr>
                                    ))}
                                    </tbody>
                                    {/*<tfoot>*/}
                                    {/*<tr>*/}
                                    {/*    <td colSpan={3} className="text-center">Total</td>*/}
                                    {/*    <td>*/}
                                    {/*        {fillingDetail?.filling_calculations?.reduce((totalCost: number, item: any) => totalCost + parseFloat(item.unit_price), 0)}*/}
                                    {/*    </td>*/}
                                    {/*    /!*<td>*!/*/}
                                    {/*    /!*    {fillingDetail?.filling_calculations?.reduce((totalQuantity: number, item: any) => totalQuantity + parseFloat(item.filling_quantity), 0)}*!/*/}
                                    {/*    /!*</td>*!/*/}
                                    {/*    <td>*/}
                                    {/*        {fillingDetail?.filling_calculations?.reduce((total_capacity: number, item: any) => total_capacity + parseFloat(item.capacity), 0)}*/}
                                    {/*    </td>*/}
                                    {/*    /!*<td>*!/*/}
                                    {/*    /!*    {fillingDetail?.filling_calculations?.reduce((total_require_quntity: number, item: any) => total_require_quntity + parseFloat(item.required_quantity), 0).toFixed(2)}*!/*/}
                                    {/*    /!*</td>*!/*/}
                                    {/*    <td></td>*/}
                                    {/*    <td>*/}
                                    {/*        {fillingDetail?.filling_calculations*/}
                                    {/*            ?.reduce((total: number, item: any) => total + parseFloat(item.unit_price) * parseFloat(item.required_quantity), 0)*/}
                                    {/*            .toFixed(2)}*/}
                                    {/*    </td>*/}
                                    {/*</tr>*/}
                                    {/*</tfoot>*/}
                                </table>
                                <div className="flex  items-end flex-col gap-2 w-full md:pe-8 py-5">
                                    <div>
                                        <strong>Cost of Goods: </strong>
                                        {fillingDetail?.filling_calculations.reduce((acc: number, item: any) => {
                                            const perKgCost = item.product_assembly.product_assembly_items.reduce((acc: number, item: any) => acc + parseFloat(item.total), 0);
                                            const rawProduct = item.product;
                                            const totalCost = ((parseFloat(item.capacity) * perKgCost) + parseFloat(rawProduct.valuated_unit_price)) * item.required_quantity;
                                            return acc + totalCost;
                                        }, 0).toFixed(3)}
                                    </div>
                                    <div>
                                        <strong>Total Sale Price: </strong>
                                        {fillingDetail?.filling_calculations.reduce((acc: number, item: any) => {
                                            return acc + item.required_quantity * item.retail_price;
                                        }, 0).toFixed(3)}
                                    </div>
                                </div>
                            </div>

                            <div className="table-responsive">
                                <h5 className="text-lg font-semibold dark:text-white-light mb-3">Batch Used</h5>
                                <table>
                                    <thead>
                                    <tr>
                                        <th>Batch</th>
                                        <th>Quantity</th>
                                        <th>Used</th>
                                        <th>Remaining</th>
                                        <th>Created At</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {batchCalculations.length > 0
                                        ? (
                                            batchCalculations.map((row, index) => (
                                                <tr key={index}>
                                                    <td>{row.batch_number}</td>
                                                    <td>{row.quantity}</td>
                                                    <td>{row.used}</td>
                                                    <td>{row.remaining}</td>
                                                    <td>{new Date(row.created_at).toLocaleDateString() + ' ' + new Date(row.created_at).toLocaleTimeString()}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={4} className="text-center">No batch selected</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </PageWrapper>
        </div>
    );
};

// View.getLayout = (page: any) => <AppLayout>{page}</AppLayout>;
export default View;
