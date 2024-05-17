import React, {useEffect} from 'react';
import PrintLayout from "@/components/Layouts/PrintLayout";
import {useAppDispatch, useAppSelector} from "@/store";
import {useRouter} from "next/router";
import {setPageTitle} from "@/store/slices/themeConfigSlice";
import {clearLocalPurchaseOrderState, showDetails} from "@/store/slices/localPurchaseOrderSlice";
import ContentLoader from "@/components/ContentLoader";
import {setAuthToken} from "@/configs/api.config";

const Print = () => {

    const dispatch = useAppDispatch();
    const router = useRouter();
    const {token} = useAppSelector(state => state.user)
    const {loading, LPODetail} = useAppSelector(state => state.localPurchaseOrder);

    useEffect(() => {
        setAuthToken(token)
        dispatch(setPageTitle('Local Purchase Order Details'));
        dispatch(clearLocalPurchaseOrderState());

        const lpoId = router.query.id;

        if (lpoId) {
            const id = Array.isArray(lpoId) ? lpoId[0] : lpoId;
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
                        <div className="flex flex-col justify-center items-center">
                            <h1 className="text-lg font-bold">
                                Purchase Order
                            </h1>
                            <span className="text-sm">{LPODetail?.lpo_number}</span>
                            <span className="text-sm">{(new Date(LPODetail?.created_at)).toLocaleDateString() + ' ' + (new Date(LPODetail?.created_at)).toLocaleTimeString()}</span>
                        </div>
                        {/*<div className="flex justify-between items-center mb-5">*/}
                        {/*<span>*/}
                        {/*    <strong>LPO No: </strong>*/}
                        {/*    {LPODetail?.lpo_number}*/}
                        {/*</span>*/}
                        {/*<span>*/}
                        {/*    <strong>Requested By: </strong>*/}
                        {/*    {LPODetail?.purchase_requisition?.employee?.name}*/}
                        {/*</span>*/}
                        {/*</div>*/}
                        <div className="flex justify-between items-center mt-5">
                            <div className="flex flex-col">
                                <span className="uppercase font-bold">TO</span>
                                <span className=" font-bold">{LPODetail?.vendor?.name}</span>
                                <span>{LPODetail?.vendor?.address + ' ' + LPODetail?.vendor?.city?.name + ', ' + LPODetail?.vendor?.state?.name}</span>
                                <span>{LPODetail?.vendor?.country?.name + ' ' + LPODetail?.vendor?.postal_code}</span>
                                <span className="">{LPODetail?.vendor?.phone}</span>
                                <span className=" font-bold">Rep: {LPODetail?.vendor_representative.name}</span>
                                <span className=" font-bold">Rep Ph: {LPODetail?.vendor_representative.phone}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="uppercase font-bold">Address Correspondence To</span>
                                <span className="">Flaxen Paints Industry LLC</span>
                                <span className="">
                                    Plot # 593 Industrial Area <br/>
                                    Umm Al Thuoob Umm Al Quwain, UAE
                                </span>
                                <span className="font-bold">Name: Anwar Ali</span>
                                <span className="font-bold">Email: info@flaxenpaints.com</span>
                                <span className="font-bold">Phone: +971544765504</span>
                            </div>
                        </div>
                        <div className="my-5">
                            <table className="w-full text-[12px]">
                                <thead className="text-[12px]">
                                <tr>
                                    <th className="text-[12px]">#</th>
                                    <th className="text-[12px]">PR</th>
                                    <th className="text-[12px]">Item</th>
                                    <th className="text-[12px]">Unit</th>
                                    {/*<th>Description</th>*/}
                                    <th className="text-[12px]">Unit Price</th>
                                    <th className="text-[12px]">Qty</th>
                                    <th className="text-[12px]">Tax</th>
                                    <th className="text-[12px]">Total</th>
                                </tr>
                                </thead>
                                <tbody className="text-[12px]">
                                {LPODetail?.raw_materials?.map((item: any, index: number) => (
                                    <tr key={index}>
                                        <td className="text-[12px]">{index + 1}</td>
                                        <td className="text-[12px]">
                                            <div className="flex flex-col">
                                                <span>
                                                    <strong>PR: </strong>
                                                    {item.purchase_requisition?.pr_code}
                                                </span>
                                                <span>
                                                    <strong>By: </strong>
                                                    {item.purchase_requisition?.employee?.name}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="text-[12px]">{item.raw_product?.item_code}</td>
                                        <td className="text-[12px]">{item.unit?.name}</td>
                                        {/*<td>{item.description}</td>*/}
                                        <td className="text-[12px]">{item.unit_price.toFixed(2)}</td>
                                        <td className="text-[12px]">
                                            <div className="flex flex-col">
                                                <span>
                                                    <strong>Requested: </strong>
                                                    {item.request_quantity}
                                                </span>
                                                <span>
                                                    <strong>Processed: </strong>
                                                    {item.processed_quantity}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="text-[12px]">
                                            <div className="flex flex-col">
                                                <span>
                                                    <strong>Category: </strong>
                                                    {item.tax_category ? item.tax_category.name : 'None'}
                                                </span>
                                                <span>
                                                    <strong>Rate: </strong>
                                                    {item.tax_rate.toFixed(2)}
                                                </span>
                                                <span>
                                                    <strong>Amount: </strong>
                                                    {item.tax_amount.toFixed(2)}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="text-[12px]">{(parseFloat(item.processed_quantity) * parseFloat(item.unit_price)).toFixed(2)}</td>
                                    </tr>
                                ))}
                                </tbody>
                                {/*<tfoot className="text-[12px]">*/}
                                {/*<tr>*/}
                                {/*    <td colSpan={8} className="text-right">*/}
                                {/*        Total Without Tax*/}
                                {/*    </td>*/}
                                {/*    <td className="text-left ps-5">*/}
                                {/*        {LPODetail?.items?.reduce((acc: number, item: any) => acc + item.sub_total, 0).toFixed(2)}*/}
                                {/*    </td>*/}
                                {/*</tr>*/}
                                {/*<tr>*/}
                                {/*    <td colSpan={8} className="text-right">*/}
                                {/*        VAT*/}
                                {/*    </td>*/}
                                {/*    <td className="text-left ps-5">*/}
                                {/*        {LPODetail?.items?.reduce((acc: number, item: any) => acc + item.tax_amount, 0).toFixed(2)}*/}
                                {/*    </td>*/}
                                {/*</tr>*/}
                                {/*<tr>*/}
                                {/*    <td colSpan={8} className="text-right">*/}
                                {/*        Grand Total*/}
                                {/*    </td>*/}
                                {/*    <td className="text-left ps-5">*/}
                                {/*        {LPODetail?.items?.reduce((acc: number, item: any) => acc + (parseFloat(item.processed_quantity) * parseFloat(item.unit_price)), 0).toFixed(2)}*/}
                                {/*    </td>*/}
                                {/*</tr>*/}
                                {/*</tfoot>*/}
                            </table>
                        </div>
                        <div className="p-2.5">
                            <div>
                                <span className="font-bold mt-5">Terms and Conditions</span>
                                <div dangerouslySetInnerHTML={{__html: LPODetail?.terms_conditions}}/>
                            </div>
                        </div>
                    </div>
                )}
        </div>
    );
};

Print.getLayout = (page: any) => (<PrintLayout>{page}</PrintLayout>)
export default Print;
