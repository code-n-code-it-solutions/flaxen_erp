import React, {useEffect} from 'react';
import PrintLayout from "@/components/Layouts/PrintLayout";
import {useRouter} from "next/router";
import {useAppDispatch, useAppSelector} from "@/store";
import {setAuthToken} from "@/configs/api.config";
import {clearFillingState, showDetails} from "@/store/slices/fillingSlice";
import ContentLoader from "@/components/ContentLoader";

const Print = () => {
    const router = useRouter();
    const dispatch = useAppDispatch()
    const {fillingDetail, loading} = useAppSelector((state) => state.filling)
    const {token} = useAppSelector((state) => state.user)

    useEffect(() => {
        dispatch(clearFillingState());
        setAuthToken(token)
        const query = router.query.id;
        if (query) {
            const id = Array.isArray(query) ? query[0] : query;
            dispatch(showDetails(parseInt(id)));
        }
    }, [router.query, dispatch]);

    return (
        <div className="print-container">
            {loading
                ? (
                    <div className="my-5">
                        <ContentLoader/>
                    </div>
                ) : (
                    <div>
                        <div className="flex flex-col items-center justify-center my-2">
                            <h1 className="text-xl font-bold">
                                Filling Details
                            </h1>
                            <span className="text-base mt-1 mb-2">
                                <strong>Batch Number: </strong> {fillingDetail?.production?.batch_number}
                            </span>
                        </div>
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
                                    <strong>No of Quantity (KG): </strong>
                                    {fillingDetail?.production.no_of_quantity}
                                </span>
                                <span>
                                    <strong>Created At: </strong>
                                    {(new Date(fillingDetail?.created_at)).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                        {/*<h5 className="text-lg font-semibold dark:text-white-light pt-10">Item Details</h5>*/}
                        {/*<div className="table-responsive">*/}
                        {/*    <table>*/}
                        {/*        <thead>*/}
                        {/*        <tr>*/}
                        {/*            <th>Sr.No</th>*/}
                        {/*            <th>Product</th>*/}
                        {/*            <th>Unit</th>*/}
                        {/*            <th>Unit Price</th>*/}
                        {/*            <th>Qty</th>*/}
                        {/*            <th>Available Qty</th>*/}
                        {/*            <th>Req Qty</th>*/}
                        {/*            <th>Total Cost</th>*/}
                        {/*        </tr>*/}
                        {/*        </thead>*/}
                        {/*        <tbody>*/}
                        {/*        {fillingDetail?.filling_items.map((item: any, index: any) => (*/}
                        {/*            <tr key={index}>*/}
                        {/*                <td>{index + 1}</td>*/}
                        {/*                <td>*/}
                        {/*                    <div className="flex justify-start flex-col items-start">*/}
                        {/*                        <span style={{fontSize: 8}}>Code: {item.product?.item_code}</span>*/}
                        {/*                        <span>{item.product?.title}</span>*/}
                        {/*                        <span*/}
                        {/*                            style={{fontSize: 8}}>VM: {item.product?.valuation_method}</span>*/}
                        {/*                    </div>*/}
                        {/*                </td>*/}
                        {/*                <td>{item.unit?.name}</td>*/}
                        {/*                <td>{item.quantity}</td>*/}
                        {/*                <td>{(item.unit_cost * item.quantity).toFixed(2)}</td>*/}
                        {/*                <td>{item.available_quantity}</td>*/}
                        {/*                <td>{item.required_quantity}</td>*/}
                        {/*                <td>{(parseFloat(item.unit_cost) * parseFloat(item.quantity) * parseFloat(item.required_quantity)).toFixed(2)}</td>*/}
                        {/*            </tr>*/}
                        {/*        ))}*/}
                        {/*        </tbody>*/}
                        {/*        <tfoot>*/}
                        {/*        <tr>*/}
                        {/*            <td colSpan={3} className="text-center">Total</td>*/}
                        {/*            <td>*/}
                        {/*                {fillingDetail?.filling_items?.reduce((total: number, item: any) => total + parseFloat(item.quantity), 0).toFixed(2)}*/}
                        {/*            </td>*/}
                        {/*            <td>*/}
                        {/*                {fillingDetail?.filling_items?.reduce((total: number, item: any) => total + (parseFloat(item.unit_cost) * parseFloat(item.quantity)), 0).toFixed(2)}*/}
                        {/*            </td>*/}
                        {/*            <td>*/}
                        {/*                {fillingDetail?.filling_items?.reduce((total: number, item: any) => total + parseFloat(item.available_quantity), 0).toFixed(2)}*/}
                        {/*            </td>*/}
                        {/*            <td>*/}
                        {/*                {fillingDetail?.filling_items?.reduce((total: number, item: any) => total + parseFloat(item.required_quantity), 0).toFixed(2)}*/}
                        {/*            </td>*/}
                        {/*            <td>*/}
                        {/*                {fillingDetail?.filling_items*/}
                        {/*                    ?.reduce((total: number, item: any) => total + parseFloat(item.unit_cost) * parseFloat(item.quantity) *parseFloat(item.required_quantity), 0)*/}
                        {/*                    .toFixed(2)}*/}
                        {/*            </td>*/}
                        {/*        </tr>*/}
                        {/*        </tfoot>*/}
                        {/*    </table>*/}
                        {/*</div>*/}
                        {/* Filling Calculation */}
                        <div className="mt-5">
                            <div className="table-responsive">
                                <h5 className="text-lg font-semibold dark:text-white-light mb-3">Final Calculation</h5>
                                <table>
                                    <thead>
                                    <tr>
                                        <th>Filling</th>
                                        <th>No of Fillings</th>
                                        <th>Per Filling Cost</th>
                                        <th>Total Cost</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {fillingDetail?.filling_calculations.length > 0
                                        ? (fillingDetail?.filling_calculations.map((item: any, index: number) => {

                                                const totalMaterialCost = fillingDetail?.filling_items.reduce((acc: number, item: any) => acc + ((parseFloat(item.unit_cost) * parseFloat(item.quantity) * parseFloat(fillingDetail?.production?.no_of_quantity)) / parseFloat(item.quantity)), 0);
                                                const perFillingCost = (totalMaterialCost / fillingDetail?.production.no_of_quantity * item.capacity) + item.unit_price;
                                                const totalFillingCost = perFillingCost * item.required_quantity;
                                                return (
                                                    <tr key={index}>
                                                        <td>
                                                            <span>{item.product?.item_code}</span>
                                                            {/*<div className="flex justify-start flex-col items-start">*/}
                                                            {/*<span style={{fontSize: 8}}>Code: {item.product?.item_code}</span>*/}
                                                            {/*<span style={{fontSize: 8}}>VM: {item.product?.valuation_method}</span>*/}
                                                            {/*</div>*/}
                                                        </td>
                                                        <td>{item.filling_quantity + '(Kg) / ' + item.required_quantity}</td>
                                                        <td>{perFillingCost.toFixed(2)}</td>
                                                        <td>{totalFillingCost.toFixed(2)}</td>
                                                    </tr>
                                                );
                                            })
                                        ) : (
                                            <tr>
                                                <td colSpan={4} className='text-center'>No data found</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <h5 className="text-lg font-semibold dark:text-white-light pt-10">Filling Calculation</h5>
                        <div className="table-responsive">
                            <table>
                                <thead>
                                <tr>
                                    <th>Sr.No</th>
                                    <th>Product Name</th>
                                    <th>Unit</th>
                                    <th>Unit Cost</th>
                                    <th>Qty</th>
                                    <th>Capacity</th>
                                    <th>Required</th>
                                    <th>Total Cost</th>
                                </tr>
                                </thead>
                                <tbody>

                                {fillingDetail?.filling_calculations.map((item: any, index: any) => (

                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>
                                            <span>{item.product?.item_code}</span>
                                            {/*<div className="flex justify-start flex-col items-start">*/}
                                            {/*<span style={{fontSize: 8}}>{item.product?.item_code}</span>*/}
                                            {/*<span style={{fontSize: 8}}>{item.product?.valuation_method}</span>*/}
                                            {/*</div>*/}
                                        </td>
                                        <td>{item.unit?.name}</td>
                                        <td>{item.unit_price}</td>
                                        <td>{item.filling_quantity}</td>
                                        <td>{item.capacity}</td>
                                        <td>{item.required_quantity.toFixed(2)}</td>

                                        <td>{(parseFloat(item.unit_price) * parseFloat(item.required_quantity)).toFixed(2)}</td>

                                    </tr>
                                ))}
                                </tbody>
                                <tfoot>
                                <tr>
                                    <td></td>
                                    <td colSpan={2}>Total</td>
                                    <td>
                                        {fillingDetail?.filling_calculations?.reduce((totalCost: number, item: any) => totalCost + parseFloat(item.unit_price), 0)}
                                    </td>
                                    <td>
                                        {fillingDetail?.filling_calculations?.reduce((totalQuantity: number, item: any) => totalQuantity + parseFloat(item.filling_quantity), 0)}
                                    </td>
                                    <td>
                                        {fillingDetail?.filling_calculations?.reduce((total_capacity: number, item: any) => total_capacity + parseFloat(item.capacity), 0)}
                                    </td>
                                    <td>
                                        {fillingDetail?.filling_calculations?.reduce((total_require_quntity: number, item: any) => total_require_quntity + parseFloat(item.required_quantity), 0).toFixed(2)}
                                    </td>
                                    <td>
                                        {fillingDetail?.filling_calculations
                                            ?.reduce((total: number, item: any) => total + parseFloat(item.unit_price) * parseFloat(item.required_quantity), 0)
                                            .toFixed(2)}
                                    </td>
                                </tr>
                                </tfoot>
                            </table>
                        </div>


                    </div>
                )}
        </div>
    );
};
Print.getLayout = (page: any) => (<PrintLayout>{page}</PrintLayout>)
export default Print;
