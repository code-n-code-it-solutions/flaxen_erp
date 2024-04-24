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
                            <div className="flex flex-col gap-3">
                                <span>
                                    <strong>Requisition Date:</strong> {purchaseRequestDetail.requisition_date}
                                </span>
                                <span>
                                    <strong>Requisition Title:</strong> {purchaseRequestDetail.pr_title}
                                </span>
                                <span>
                                    <strong>Requisition Code:</strong> {purchaseRequestDetail.pr_code}
                                </span>
                                <span>
                                    <strong>Date:</strong> {(new Date(purchaseRequestDetail.created_at)).toDateString()}
                                </span>
                            </div>
                            <div className="flex flex-col gap-3">
                                <span>
                                    <strong>Requisition Status:</strong> {purchaseRequestDetail.status}
                                </span>
                                <span>
                                    <strong>Requested By:</strong> {purchaseRequestDetail.employee?.name}
                                </span>
                                <span>
                                    <strong>Department:</strong> {purchaseRequestDetail.department?.name}
                                </span>
                                <span>
                                    <strong>Designation:</strong> {purchaseRequestDetail.designation?.name}
                                </span>
                            </div>
                        </div>
                        <h1 className="text-lg font-bold mt-5">Requested Items</h1>
                        <table>
                            <thead>
                            {purchaseRequestDetail?.type === 'Material'
                                ? (
                                    <tr>

                                        <th>#</th>
                                        <th>Item</th>
                                        <th>Description</th>
                                        <th>Unit</th>
                                        <th>Unit Price</th>
                                        <th>Quantity</th>
                                        <th>Total</th>
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
                            <tbody>
                            {purchaseRequestDetail?.type === 'Material'
                                ? purchaseRequestDetail?.purchase_requisition_items?.map((item: any, index: number) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>
                                            <div className="flex justify-start flex-col items-start">
                                                <span style={{fontSize: 8}}>{item.raw_product?.item_code}</span>
                                                <span>{item.raw_product?.title}</span>
                                                <span
                                                    style={{fontSize: 8}}>{item.raw_product?.valuation_method}</span>
                                            </div>
                                        </td>
                                        <td>{item.unit?.name}</td>
                                        <td>{item.description}</td>
                                        <td>{item.unit_price}</td>
                                        <td>{item.quantity}</td>
                                        <td>{item.total_price}</td>
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
                                        <td colSpan={4} style={{"textAlign": "center"}}>
                                            <strong>Total</strong>
                                        </td>
                                        <td>
                                            {purchaseRequestDetail?.purchase_requisition_items?.reduce((acc: any, item: any) => acc + parseFloat(item.unit_price), 0).toFixed(2)}
                                        </td>
                                        <td>
                                            {purchaseRequestDetail?.purchase_requisition_items?.reduce((acc: any, item: any) => acc + parseInt(item.quantity), 0).toFixed(2)}
                                        </td>
                                        <td>
                                            {purchaseRequestDetail?.purchase_requisition_items?.reduce((acc: any, item: any) => acc + parseFloat(item.unit_price) * parseFloat(item.quantity), 0).toFixed(2)}
                                        </td>
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
