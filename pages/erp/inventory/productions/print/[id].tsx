import React, {useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from "@/store";
import {useRouter} from "next/router";
import {setPageTitle} from "@/store/slices/themeConfigSlice";
import {clearProductionState, showDetails} from "@/store/slices/productionSlice";
import PrintLayout from "@/components/Layouts/PrintLayout";
import ContentLoader from "@/components/ContentLoader";
import {setAuthToken} from "@/configs/api.config";

const Print = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const {token} = useAppSelector((state) => state.user);
    const {loading, productionDetail} = useAppSelector((state) => state.production);
    const [content, setContent] = useState<any>({})

    useEffect(() => {
        setAuthToken(token)
        dispatch(setPageTitle('Production Print'));
        dispatch(clearProductionState());
        const query = router.query.id;
        if (query) {
            const id = Array.isArray(query) ? query[0] : query;
            dispatch(showDetails(parseInt(id)));
        }
    }, [router.query.id, dispatch]);

    useEffect(() => {
        if (productionDetail) {
            setContent(productionDetail)
        }
    }, [productionDetail]);

    return (
        loading
            ? <div className="my-5">
                <ContentLoader/>
            </div>
            : <div className="print-container">
                <div className="flex justify-center items-center flex-col mt-2 mb-2.5">
                    <h1 className="text-xl font-bold">
                        Production
                    </h1>
                    <span className="text-base mt-1 mb-2.5 font-semibold">
                        <strong>Batch Number: </strong> {content?.batch_number}
                    </span>
                </div>
                <div className="flex justify-between items-start mb-5">
                    <div className="flex flex-col gap-1">
                        <span className="font-semibold">
                            <strong>No of Quantity (KG): </strong> {content?.no_of_quantity}
                        </span>
                        <span className="font-semibold">
                            <strong>Formula Code: </strong> {content?.product_assembly?.formula_code}
                        </span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="font-semibold">
                            <strong>Color
                                Code: </strong> {content?.product_assembly?.color_code?.code} ({content?.product_assembly?.color_code?.hex_code})
                        </span>
                        <span className="font-semibold">
                            <strong>Category: </strong> {content?.product_assembly?.category?.name}
                        </span>
                        <span className="font-semibold">
                            <strong>Created At: </strong> {new Date(content?.created_at).toDateString()}
                        </span>
                    </div>
                </div>
                <h3 className="text-base font-semibold">Product Details:</h3>
                <table>
                    <thead>
                    <tr>
                        <th>Sr. No</th>
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
                    {content?.production_items?.map((item: any, index: number) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>
                                <span>{item.product?.item_code}</span>
                                {/*<div className="flex justify-start flex-col items-start">*/}
                                    {/*<span style={{fontSize: 8}}>Code: {item.product?.item_code}</span>*/}
                                    {/*<span style={{fontSize: 8}}>VM: {item.product?.valuation_method}</span>*/}
                                {/*</div>*/}
                            </td>
                            <td>{item.unit?.name}</td>
                            <td>{item.unit_cost}</td>
                            <td>{item.quantity}</td>
                            <td>{item.available_quantity}</td>
                            <td>{item.required_quantity}</td>
                            <td>{((parseFloat(item.unit_cost) * parseFloat(item.quantity) * parseFloat(productionDetail.no_of_quantity)) / parseFloat(item.quantity)).toFixed(2)}</td>
                        </tr>
                    ))}
                    </tbody>
                    <tfoot>
                    <tr>
                        <td colSpan={3}>Total</td>
                        <td>
                            {content?.production_items?.reduce((total: number, item: any) => total + parseFloat(item.unit_cost), 0).toFixed(2)}
                        </td>
                        <td>
                            {content?.production_items?.reduce((total: number, item: any) => total + parseFloat(item.quantity), 0).toFixed(2)}
                        </td>
                        <td>
                            {content?.production_items?.reduce((total: number, item: any) => total + parseFloat(item.available_quantity), 0).toFixed(2)}
                        </td>
                        <td>
                            {content?.production_items?.reduce((total: number, item: any) => total + parseFloat(item.required_quantity), 0).toFixed(2)}
                        </td>
                        <td>
                            {productionDetail?.production_items
                                .reduce((total: number, item: any) => total + ((parseFloat(item.unit_cost) * parseFloat(item.quantity) * parseFloat(productionDetail.no_of_quantity)) / parseFloat(item.quantity)), 0)
                                .toFixed(2)}
                        </td>
                    </tr>
                    </tfoot>
                </table>
            </div>
    );
};

Print.getLayout = (page: any) => (<PrintLayout>{page}</PrintLayout>)
export default Print;
