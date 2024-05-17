import React, {useEffect, useState} from 'react';
import PrintLayout from "@/components/Layouts/PrintLayout";
import {useAppDispatch, useAppSelector} from "@/store";
import {useRouter} from "next/router";
import {setAuthToken} from "@/configs/api.config";
import {setPageTitle} from "@/store/slices/themeConfigSlice";
import {clearQuotationState, showDetails} from "@/store/slices/quotationSlice";
import ContentLoader from "@/components/ContentLoader";
import {capitalize} from "lodash";

const Print = () => {
    const dispatch = useAppDispatch()
    const router = useRouter()
    const {token} = useAppSelector(state => state.user)
    const {quotationDetail, loading} = useAppSelector(state => state.quotation)

    const calculateTotal = (item: any) => {
        let totalCost = parseFloat(item.retail_price) * parseFloat(item.quantity);
        let taxAmount = (totalCost * parseFloat(item.tax_rate)) / 100;
        let discountAmount = item.discount_type === 'percentage' ? (totalCost * parseFloat(item.discount_amount_rate)) / 100 : parseFloat(item.discount_amount_rate);
        return totalCost + taxAmount - discountAmount;
    }

    useEffect(() => {
        setAuthToken(token)
        dispatch(setPageTitle('Print Quotation'))
        dispatch(clearQuotationState())

        const quotationId = router.query.id;

        if (quotationId) {
            const id = Array.isArray(quotationId) ? quotationId[0] : quotationId;
            dispatch(showDetails(parseInt(id)));
        }
    }, [router.query.id, dispatch]);

    return (
        <div className="print-container">
            {loading
                ? (
                    <div className="my-5">
                        <ContentLoader/>
                    </div>
                ) : (
                    <div className="my-5">
                        <div className="flex justify-center items-center">
                            <h1 className="text-lg font-bold">
                                Quotation Details
                            </h1>
                        </div>

                        <div className="flex justify-between items-center w-full gap-3">
                            <div className="flex flex-col gap-2 justify-start items-start">
                                <span>
                                    <strong>Quotation Code: </strong>
                                    {quotationDetail?.quotation_code}
                                </span>
                                <span>
                                    <strong>Receipt Delivery (Days): </strong>
                                    {quotationDetail?.receipt_delivery_due_days}
                                </span>
                                <span>
                                    <strong>Delivery: </strong>
                                    {quotationDetail?.delivery_due_in_days + ' - ' + quotationDetail?.delivery_due_date}
                                </span>
                                <span>
                                    <strong>Created At: </strong>
                                    {(new Date(quotationDetail?.created_at)).toLocaleDateString() + '  ' + (new Date(quotationDetail?.created_at)).toLocaleTimeString()}
                                </span>
                            </div>
                            <div className="flex flex-col gap-2 justify-start items-start">
                                <span>
                                    <strong>Salesman: </strong>
                                    {quotationDetail?.salesman?.name}
                                </span>
                                <span>
                                    <strong>Customer: </strong>
                                    {quotationDetail?.customer?.name}
                                </span>
                                <span>
                                    <strong>Contact Person: </strong>
                                    {quotationDetail?.contact_person?.name}
                                </span>
                                <span>
                                    <strong>Created By: </strong>
                                    {quotationDetail?.created_by?.name}
                                </span>
                            </div>
                        </div>

                        <h5 className="text-lg font-semibold dark:text-white-light pt-10">Item Details</h5>
                        <table>
                            <thead>
                            <tr>
                                <th>Sr.No</th>
                                <th>Product</th>
                                <th>Batch #</th>
                                <th>Filling</th>
                                <th>Available</th>
                                <th>Retail Price</th>
                                <th>Qty</th>
                                <th>Tax</th>
                                <th>Discount</th>
                                <th>Total Cost</th>
                            </tr>
                            </thead>
                            <tbody className="text-center">

                            {quotationDetail?.quotation_items.map((item: any, index: any) => (

                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{item.product_assembly.formula_name}</td>
                                    <td>{item.batch_number}</td>
                                    <td>{item.product?.item_code}</td>
                                    <td>{item.available_quantity}</td>
                                    <td>{item.retail_price.toFixed(2)}</td>
                                    <td>{item.quantity.toFixed(2)}</td>
                                    <td>{item.tax_amount.toFixed(2) + ' (' + item.tax_rate + '%)'}</td>
                                    <td>{item.discount_amount_rate.toFixed(2)}{item.discount_type === 'percentage' ? '%' : '/-'}</td>
                                    <td>{calculateTotal(item).toFixed(2)}</td>

                                </tr>
                            ))}
                            </tbody>
                            <tfoot className="text-center">
                            <tr>
                                <td colSpan={8} className="text-center py-2">Total</td>
                                <td className="ps-4 py-2">
                                    {quotationDetail?.quotation_items
                                        ?.reduce((total: number, item: any) => total + calculateTotal(item), 0)
                                        .toFixed(2)}
                                </td>
                            </tr>
                            </tfoot>
                        </table>
                    </div>
                )}
        </div>
    );
};

Print.getLayout = (page: any) => (<PrintLayout>{page}</PrintLayout>)
export default Print;
