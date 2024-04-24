import React, {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from '@/store';
import {useRouter} from 'next/router';
import {setPageTitle} from '@/store/slices/themeConfigSlice';
import {clearPurchaseRequisitionState, showDetails} from "@/store/slices/purchaseRequisitionSlice";
import PageWrapper from '@/components/PageWrapper';
import {ButtonType, ButtonVariant, IconType} from '@/utils/enums';

const View = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const {loading, purchaseRequestDetail} = useAppSelector(state => state.purchaseRequisition);
    const breadCrumbItems = [
        {
            title: 'Home',
            href: '/erp/main',
        },
        {
            title: 'All Product Assembly',
            href: '/erp/purchase/purchase-requisition',
        },
        {
            title: 'Purchase Requisition Details',
            href: '#',
        },
    ];

    useEffect(() => {
        dispatch(setPageTitle('Purchase Requisition Details'));
        dispatch(clearPurchaseRequisitionState());

        const purchaseRequisitionId = router.query.id;

        if (purchaseRequisitionId) {
            const id = Array.isArray(purchaseRequisitionId) ? purchaseRequisitionId[0] : purchaseRequisitionId;
            dispatch(showDetails(parseInt(id)));
        }
    }, [router.query.id, dispatch]);

    return (
        <PageWrapper
            loading={loading}
            breadCrumbItems={breadCrumbItems}
            embedLoader={true}
            title={'Purchase Requisition Details'}
            buttons={[
                {
                    text: 'Edit',
                    type: ButtonType.link,
                    variant: ButtonVariant.info,
                    icon: IconType.edit,
                    link: '/erp/purchase/purchase-requisition/edit/' + router.query.id
                },
                {
                    text: 'Print',
                    type: ButtonType.link,
                    variant: ButtonVariant.success,
                    icon: IconType.print,
                    link: '/erp/purchase/purchase-requisition/print/' + router.query.id
                },
                {
                    text: 'Back',
                    type: ButtonType.link,
                    variant: ButtonVariant.primary,
                    icon: IconType.back,
                    link: '/erp/purchase/purchase-requisition'
                }
            ]}
        >
            {purchaseRequestDetail && (
                <div>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                        <div className="flex flex-col gap-2">
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
                        <div className="flex flex-col gap-2">
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
                    <div className="table-responsive">
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
                                                <span style={{fontSize: 8}}>Code: {item.raw_product?.item_code}</span>
                                                <span>{item.raw_product?.title}</span>
                                                <span
                                                    style={{fontSize: 8}}>VM: {item.raw_product?.valuation_method}</span>
                                            </div>
                                        </td>
                                        <td>{item.description}</td>
                                        <td>{item.unit?.name}</td>
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
                    </div>
                    <div className="flex justify-end items-end mt-12">
                        <div className="flex flex-col items-center gap-12">
                            <span className="font-bold">Approved By</span>
                            <span>________________________</span>
                        </div>
                    </div>
                </div>
            )}
        </PageWrapper>
    );
};

export default View;
