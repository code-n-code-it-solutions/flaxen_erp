import React, {useEffect} from 'react';
import PrintLayout from "@/components/Layouts/PrintLayout";
import {useAppDispatch, useAppSelector} from "@/store";
import {useRouter} from "next/router";
import {setPageTitle} from "@/store/slices/themeConfigSlice";
import {clearPurchaseRequisitionState, showDetails} from "@/store/slices/purchaseRequisitionSlice";
import ContentLoader from "@/components/ContentLoader";
import {setAuthToken} from "@/configs/api.config";

const Print = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const {token} = useAppSelector(state => state.user)
    const {loading, purchaseRequestDetail} = useAppSelector(state => state.purchaseRequisition);

    useEffect(() => {
        setAuthToken(token)
        dispatch(setPageTitle('Purchase Requisition Details'));
        dispatch(clearPurchaseRequisitionState());

        const purchaseRequisitionId = router.query.id;

        if (purchaseRequisitionId) {
            const id = Array.isArray(purchaseRequisitionId) ? purchaseRequisitionId[0] : purchaseRequisitionId;
            dispatch(showDetails(parseInt(id)));
        }
    }, [router.query.id, dispatch]);

    return (
        <div className="print-container">
            <div className="flex flex-col items-center justify-center mt-2.5 gap-2.5 mb-2.5">
                <h1 className="text-lg font-bold">
                    Purchase Requisition
                </h1>
            </div>

            {loading
                ? (
                    <div className="my-5">
                        <ContentLoader/>
                    </div>
                )
                : (
                    <div>
                        <div className="flex justify-between items-center">
                            <div className="flex flex-col">
                                <span>
                                    <strong>Requisition Date: </strong> {purchaseRequestDetail?.requisition_date}
                                </span>
                                <span>
                                    <strong>Requisition Title: </strong> {purchaseRequestDetail?.pr_title}
                                </span>
                                <span>
                                    <strong>Requisition Code: </strong> {purchaseRequestDetail?.pr_code}
                                </span>
                                <span>
                                    <strong>Date: </strong> {(new Date(purchaseRequestDetail?.created_at)).toDateString()}
                                </span>
                            </div>
                            <div className="flex flex-col">
                                <span>
                                    <strong>Requisition Status: </strong> {purchaseRequestDetail?.status}
                                </span>
                                <span>
                                    <strong>Requested By: </strong> {purchaseRequestDetail?.employee?.name}
                                </span>
                                <span>
                                    <strong>Department: </strong> {purchaseRequestDetail?.department ? purchaseRequestDetail?.department?.name : 'N/A'}
                                </span>
                                <span>
                                    <strong>Designation: </strong> {purchaseRequestDetail?.designation ? purchaseRequestDetail?.designation?.name : 'N/A'}
                                </span>
                            </div>
                        </div>
                        <h1 className="font-bold mt-5 mb-2">Requested Items</h1>
                        <table className="text-[12px]">
                            <thead className="text-[12px]">
                            {purchaseRequestDetail?.type === 'Material'
                                ? (
                                    <tr className="text-[12px]">
                                        <th className="text-[12px]">#</th>
                                        <th className="text-[12px]">Item</th>
                                        <th className="text-[12px]">Unit</th>
                                        <th className="text-[12px]">Unit Price</th>
                                        <th className="text-[12px]">Quantity</th>
                                        <th className="text-[12px]">Total (Req)</th>
                                        <th className="text-[12px]">Status</th>
                                    </tr>
                                ) : (
                                    <tr>
                                        <th>#</th>
                                        <th>Assets</th>
                                        <th>Service Name</th>
                                        <th>Description</th>
                                        <th>Quantity</th>
                                    </tr>
                                )}

                            </thead>
                            <tbody className="text-[12px]">
                            {purchaseRequestDetail?.type === 'Material'
                                ? purchaseRequestDetail?.purchase_requisition_items?.map((item: any, index: number) => (
                                    <tr key={index} className="text-[12px]">
                                        <td className="text-[12px]">{index + 1}</td>
                                        <td className="text-[12px]">{item.raw_product?.item_code}</td>
                                        <td className="text-[12px]">{item.unit?.name}</td>
                                        <td className="text-[12px]">{parseFloat(item.unit_price).toFixed(2)}</td>
                                        <td className="text-[12px]">
                                            <div className="flex flex-col">
                                                <span><strong>Requested: </strong>{parseFloat(item.request_quantity).toFixed(2)}</span>
                                                <span><strong>Processed: </strong>{parseFloat(item.processed_quantity).toFixed(2)}</span>
                                                <span><strong>Remaining: </strong>{parseFloat(item.remaining_quantity).toFixed(2)}</span>
                                            </div>
                                        </td>
                                        <td className="text-[12px]">{(parseFloat(item.request_quantity) * parseFloat(item.unit_price)).toFixed(2)}</td>
                                        <td className="text-[12px]">
                                            <span
                                                className={`badge bg-${item.status === 'Pending' ? 'danger' : item.status === 'Partial' ? 'warning' : 'success'}`}>
                                                {item.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                                : purchaseRequestDetail?.purchase_requisition_services?.map((item: any, index: number) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>
                                            <div>
                                                {item.asset_ids?.map((asset: any, index: number) => (
                                                    <span
                                                        key={index}>{asset.name + ' (' + asset.code + ')'}</span>
                                                ))}
                                            </div>
                                        </td>
                                        <td>{item?.service_name}</td>
                                        <td>{item.description}</td>
                                        <td>{item.quantity}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                            {purchaseRequestDetail?.type === 'Material'
                                ? (
                                    <tr>
                                        <td colSpan={3} style={{"textAlign": "center"}}>
                                            <strong>Total</strong>
                                        </td>
                                        <td>
                                            {purchaseRequestDetail?.purchase_requisition_items?.reduce((acc: any, item: any) => acc + parseFloat(item.unit_price), 0).toFixed(2)}
                                        </td>
                                        <td></td>
                                        {/*<td>*/}
                                        {/*    {purchaseRequestDetail?.purchase_requisition_items?.reduce((acc: any, item: any) => acc + parseInt(item.request_quantity), 0).toFixed(2)}*/}
                                        {/*</td>*/}
                                        {/*<td>*/}
                                        {/*    {purchaseRequestDetail?.purchase_requisition_items?.reduce((acc: any, item: any) => acc + parseInt(item.processed_quantity), 0).toFixed(2)}*/}
                                        {/*</td>*/}
                                        {/*<td>*/}
                                        {/*    {purchaseRequestDetail?.purchase_requisition_items?.reduce((acc: any, item: any) => acc + parseInt(item.remaining_quantity), 0).toFixed(2)}*/}
                                        {/*</td>*/}
                                        <td>
                                            {purchaseRequestDetail?.purchase_requisition_items?.reduce((acc: any, item: any) => acc + parseFloat(item.unit_price) * parseFloat(item.request_quantity), 0).toFixed(2)}
                                        </td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                ) : (
                                    <></>
                                )}

                            </tfoot>
                        </table>
                        <div className="flex justify-end items-end mt-12">
                            <div className="flex flex-col items-center gap-12">
                                <span className="font-bold">Approved By</span>
                                <span>________________________</span>
                            </div>
                        </div>
                    </div>
                )}

        </div>
    );
};

Print.getLayout = (page: any) => (<PrintLayout>{page}</PrintLayout>)
export default Print;
