import React, {useEffect, useState} from 'react';
import PrintLayout from "@/components/Layouts/PrintLayout";
import {useRouter} from "next/router";
import {useAppDispatch, useAppSelector} from "@/store";
import {setAuthToken} from "@/configs/api.config";
import {clearProductAssemblyState, showDetails} from "@/store/slices/productAssemblySlice";
import ContentLoader from "@/components/ContentLoader";

const Print = () => {
    const router = useRouter();
    const dispatch = useAppDispatch()
    const {productAssemblyDetail, loading} = useAppSelector((state) => state.productAssembly)
    const {token} = useAppSelector((state) => state.user)

    const [content, setContent] = useState<any>({})

    useEffect(() => {
        dispatch(clearProductAssemblyState());
        setAuthToken(token)
        const query = router.query.id;
        if (query) {
            const id = Array.isArray(query) ? query[0] : query;
            dispatch(showDetails(parseInt(id)));
        }
    }, [router.query, dispatch]);

    useEffect(() => {
        if (productAssemblyDetail) {
            setContent(productAssemblyDetail)
        }
    }, [productAssemblyDetail]);

    return (
        loading
            ? <div className="my-5">
                <ContentLoader/>
            </div>
            : <div className="print-container">
                <div className="flex justify-center items-center flex-col my-2.5">
                    <h1 className="text-xl font-bold">
                        Product Formula
                    </h1>
                </div>
                <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-2">
                        <span className="mb-3.75 font-semibold"><strong>Formula Name:</strong> {content?.formula_name}</span>
                        <span className="mb-3.75 font-semibold"><strong>Formula Code:</strong> {content?.formula_code}</span>
                    </div>
                    <div className="flex flex-col gap-2">
                        <span className="mb-3.75 font-semibold">
                            <strong>Color Code:</strong> {content?.color_code?.name} ({content?.color_code?.hex_code})
                        </span>
                        <span className="mb-3.75 font-semibold"><strong>Category:</strong> {content?.category?.name}</span>
                        <span className="mb-3.75 font-semibold">
                            <strong>Created At:</strong> {new Date(content?.created_at).toDateString()}
                        </span>
                    </div>
                </div>
                <h3 className="my-4 text-base font-semibold">Formula Product Details:</h3>
                <table className="table-bordered">
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
                    {content?.product_assembly_items?.map((item: any, index: number) => (
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
                        <td colSpan={3}>Total</td>
                        <td>
                            {content?.product_assembly_items?.reduce((total: number, item: any) => total + parseFloat(item.cost), 0).toFixed(2)}
                        </td>
                        <td>
                            {content?.product_assembly_items?.reduce((total: number, item: any) => total + parseFloat(item.quantity), 0).toFixed(2)}
                        </td>
                        <td>
                            {content?.product_assembly_items?.reduce((total: number, item: any) => total + parseFloat(item.cost) * parseFloat(item.quantity), 0).toFixed(2)}
                        </td>
                    </tr>
                    </tfoot>
                </table>

            </div>
    );
};

Print.getLayout = (page: any) => (<PrintLayout>{page}</PrintLayout>)
export default Print;
