import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {ThunkDispatch} from 'redux-thunk';
import {IRootState} from '@/store';
import {AnyAction} from 'redux';
import {useRouter} from 'next/router';
import {setPageTitle} from '@/store/slices/themeConfigSlice';
import {clearPurchaseRequisitionState, showDetails} from "@/store/slices/purchaseRequisitionSlice";
import PageWrapper from '@/components/PageWrapper';
import {generatePDF, getIcon, imagePath} from '@/utils/helper';
import Image from 'next/image';
import Button from '@/components/Button';
import {ButtonSize, ButtonType, ButtonVariant, IconType} from '@/utils/enums';
import Preview from '@/pages/purchase/purchase-requisition/preview';

const View = () => {
    const dispatch = useDispatch<ThunkDispatch<IRootState, any, AnyAction>>();
    const router = useRouter();
    const {loading, purchaseRequestDetail} = useSelector((state: IRootState) => state.purchaseRequisition);
    const [printLoading, setPrintLoading] = useState<boolean>(false);
    const breadCrumbItems = [
        {
            title: 'Home',
            href: '/main',
        },
        {
            title: 'All Product Assembly',
            href: '/purchase/purchase-requisition',
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
        // console.log('purchaseRequisition ID:', purchaseRequisitionId);

        if (purchaseRequisitionId) {
            // If the productId is an array (with catch-all routes), take the first element.
            const id = Array.isArray(purchaseRequisitionId) ? purchaseRequisitionId[0] : purchaseRequisitionId;
            dispatch(showDetails(parseInt(id)));
        }
    }, [router.query.id, dispatch]);

    useEffect(() => {
        if (purchaseRequestDetail) {
            console.log("Purchase Req Detail:", purchaseRequestDetail);
        }
    }, [purchaseRequestDetail])

    return (
        <PageWrapper loading={loading} breadCrumbItems={breadCrumbItems} embedLoader={true}>
            <div>
                <div className="mb-5 flex items-center justify-between">
                    <h5 className="text-lg font-semibold dark:text-white-light">Details of Purchase Requisition</h5>
                    <div className="flex justify-end gap-3">
                        <Button
                            text={
                                printLoading ? (
                                    'Generating...'
                                ) : (
                                    <span className="flex items-center">
                                        {getIcon(IconType.print, 0, 0, 'h-5 w-5 ltr:mr-2 rtl:ml-2')}
                                        Print
                                    </span>
                                )
                            }
                            type={ButtonType.button}
                            variant={ButtonVariant.success}
                            size={ButtonSize.small}
                            disabled={printLoading}
                            onClick={() => generatePDF(<Preview content={purchaseRequestDetail}/>, setPrintLoading)}
                        />
                        <Button
                            text={
                                <span className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ltr:mr-2 rtl:ml-2"
                                         width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path d="M15 5L9 12L15 19" stroke="currentColor" strokeWidth="1.5"
                                              strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    Back
                                </span>
                            }
                            type={ButtonType.link}
                            variant={ButtonVariant.primary}
                            link="/purchase/purchase-requisition"
                            size={ButtonSize.small}
                        />
                    </div>
                </div>
                {purchaseRequestDetail && (
                    <div className="h-950 p-10">
                        <div className="flex justify-center flex-col items-center mt-10 gap-10 mb-10">
                            <h1 className="text-lg font-bold">Purchase Requisition</h1>
                            <span>{purchaseRequestDetail.requisition_date}</span>
                            <span>{purchaseRequestDetail.status}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="flex flex-col gap-5">
                                <span className="text-xs">
                                    <strong>Requisition Title:</strong> {purchaseRequestDetail.pr_title}
                                </span>
                                <span className="text-xs">
                                    <strong>Requisition Code:</strong> {purchaseRequestDetail.pr_code}
                                </span>
                                <span className="text-xs">
                                    <strong>Date:</strong> {(new Date(purchaseRequestDetail.created_at)).toDateString()}
                                </span>
                            </div>
                            <div className="flex flex-col gap-5">
                                <span className="text-xs">
                                    <strong>Requested By:</strong> {purchaseRequestDetail.employee?.name}
                                </span>
                                <span className="text-xs">
                                    <strong>Department:</strong> {purchaseRequestDetail.department?.name}
                                </span>
                                <span className="text-xs">
                                    <strong>Designation:</strong> {purchaseRequestDetail.designation?.name}
                                </span>
                            </div>
                        </div>

                        <div className="mt-5">
                            <table>
                                {purchaseRequestDetail?.type === 'Material'
                                    ? (
                                        <>
                                            <thead>

                                            <tr>
                                                <th>
                                                    #
                                                </th>
                                                <th>
                                                    Item
                                                </th>
                                                <th>
                                                    Description
                                                </th>
                                                <th>
                                                    Unit
                                                </th>
                                                <th>
                                                    Unit Price
                                                </th>
                                                <th>
                                                    Quantity
                                                </th>
                                                <th>
                                                    Total
                                                </th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {purchaseRequestDetail?.purchase_requisition_items?.map((item: any, index: number) => (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{item.raw_product?.title + ' (' + item.raw_product?.item_code + ')'}</td>
                                                    <td>{item.unit?.name}</td>
                                                    <td>{item.description}</td>
                                                    <td>{item.unit_price}</td>
                                                    <td>{item.quantity}</td>
                                                    <td>{item.total_price}</td>
                                                </tr>
                                            ))}
                                            </tbody>
                                            <tfoot>
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
                                            </tfoot>
                                        </>
                                    )
                                    : (
                                        <>
                                            <thead>

                                            <tr>
                                                <th>
                                                    #
                                                </th>
                                                <th>
                                                    Assets
                                                </th>
                                                <th>
                                                    Service Name
                                                </th>
                                                <th>
                                                    Description
                                                </th>
                                                <th>
                                                    Quantity
                                                </th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {purchaseRequestDetail?.purchase_requisition_services?.map((item: any, index: number) => (
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
                                        </>
                                    )}
                            </table>
                        </div>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            alignItems: 'flex-end',
                            marginTop: '50px'
                        }}>
                            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '32px'}}>
                                <span style={{fontWeight: 'bold'}}>Approved By</span>
                                <span>________________________</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </PageWrapper>
    );
};

export default View;
