import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { useRouter } from 'next/router';
import { setPageTitle } from '@/store/slices/themeConfigSlice';
import {
    clearPurchaseRequisitionState,
    markRequisitionItemComplete,
    showDetails
} from '@/store/slices/purchaseRequisitionSlice';
import PageWrapper from '@/components/PageWrapper';
import { AppBasePath, ButtonSize, ButtonType, ButtonVariant, IconType } from '@/utils/enums';
import Button from '@/components/Button';
import Option from '@/components/form/Option';
import { setAuthToken } from '@/configs/api.config';
import AppLayout from '@/components/Layouts/AppLayout';
import DetailPageHeader from '@/components/apps/DetailPageHeader';
import useSetActiveMenu from '@/hooks/useSetActiveMenu';

const View = () => {
    useSetActiveMenu(AppBasePath.Purchase_Requisition);
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { token } = useAppSelector(state => state.user);
    const {
        purchaseRequests,
        success,
        loading,
        purchaseRequestDetail
    } = useAppSelector(state => state.purchaseRequisition);

    const [selectedItems, setSelectedItems] = useState<any[]>([]);
    const [ids, setIds] = useState<string[]>([]);

    const getDetails = () => {
        setAuthToken(token);
        const purchaseRequisitionId = router.query.id;

        if (purchaseRequisitionId) {
            setIds(Array.isArray(purchaseRequisitionId) ? purchaseRequisitionId : [purchaseRequisitionId]);
            const id = Array.isArray(purchaseRequisitionId) ? purchaseRequisitionId[0] : purchaseRequisitionId;
            dispatch(showDetails(parseInt(id)));
        }
    };

    useEffect(() => {
        dispatch(setPageTitle('Purchase Requisition Details'));
        dispatch(clearPurchaseRequisitionState());
        getDetails();
    }, [router.query.id, dispatch]);

    const handleSelectAllClick = (e: any) => {
        if (e.target.checked) {
            const allItemIds = purchaseRequestDetail.purchase_requisition_items.map((item: any) => item.id);
            setSelectedItems(allItemIds);
        } else {
            setSelectedItems([]);
        }
    };

    const handleSelectItemClick = (id: number, isChecked: boolean) => {
        if (isChecked) {
            setSelectedItems([...selectedItems, id]);
        } else {
            setSelectedItems(selectedItems.filter(itemId => itemId !== id));
        }
    };

    const handleMarkComplete = () => {
        setAuthToken(token);
        if (selectedItems.length === 0) {
            alert('Please select at least one item to mark as complete');
            return;
        } else {
            dispatch(markRequisitionItemComplete(selectedItems));
            getDetails();
        }
    };

    return (
        <div className="flex flex-col gap-3">
            <DetailPageHeader
                appBasePath={AppBasePath.Filling}
                title="PR Details"
                middleComponent={{
                    show: true,
                    edit: {
                        show: false
                    },
                    print: {
                        show: true,
                        onClick: () => router.push('/apps/purchase/purchase-requisition/print/' + ids.join('/'))
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
                    backLink: '/apps/purchase/purchase-requisition'
                }}
            />
            <PageWrapper
                loading={loading}
                embedLoader={true}
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
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center mt-5 mb-2">
                            <h1 className="text-lg font-bold mt-5">Requested Items</h1>
                            {purchaseRequestDetail?.purchase_requisition_items?.filter((item: any) => item.status === 'Pending' || item.status === 'Partial').length > 0 && (
                                <Button
                                    type={ButtonType.button}
                                    text="Bulk Mark Complete"
                                    variant={ButtonVariant.primary}
                                    size={ButtonSize.small}
                                    onClick={() => handleMarkComplete()}
                                />
                            )}
                        </div>

                        <div className="table-responsive">
                            <table>
                                <thead>
                                {purchaseRequestDetail?.type === 'Material'
                                    ? (
                                        <tr>
                                            <th>#</th>
                                            <th>
                                                <div className="flex justify-start items-center gap-2">
                                                    {purchaseRequestDetail?.purchase_requisition_items?.filter((item: any) => item.status === 'Pending' || item.status === 'Partial').length > 0 && (
                                                        <Option
                                                            label=""
                                                            type="checkbox"
                                                            name="bulk_select"
                                                            defaultChecked={selectedItems.length === purchaseRequestDetail?.purchase_requisition_items?.length}
                                                            value={1}
                                                            onChange={handleSelectAllClick}
                                                        />
                                                    )}
                                                    <span>Item</span>
                                                </div>
                                            </th>
                                            <th>Description</th>
                                            <th>Unit</th>
                                            <th>Unit Price</th>
                                            <th>Requested Qty</th>
                                            <th>Processed Qty</th>
                                            <th>Remaining Qty</th>
                                            <th>Total</th>
                                            <th>Status</th>
                                            <th>Action</th>
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
                                                <div className="flex justify-start items-center gap-2">
                                                    {(item.status === 'Pending' || item.status === 'Partial') && (
                                                        <Option
                                                            label=""
                                                            type="checkbox"
                                                            name="bulk_select"
                                                            defaultChecked={selectedItems.includes(item.id)}
                                                            value={item.id}
                                                            onChange={(e) => handleSelectItemClick(item.id, e.target.checked)}
                                                        />
                                                    )}
                                                    <div className="flex justify-start flex-col items-start">
                                                        <span
                                                            style={{ fontSize: 8 }}>{item.raw_product?.item_code}</span>
                                                        <span>{item.raw_product?.title}</span>
                                                        <span
                                                            style={{ fontSize: 8 }}>{item.raw_product?.valuation_method}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>{item.description}</td>
                                            <td>{item.unit?.name}</td>
                                            <td>{parseFloat(item.unit_price).toFixed(2)}</td>
                                            <td>{parseFloat(item.request_quantity).toFixed(2)}</td>
                                            <td>{parseFloat(item.processed_quantity).toFixed(2)}</td>
                                            <td>{parseFloat(item.remaining_quantity).toFixed(2)}</td>
                                            <td>{(parseFloat(item.request_quantity) * parseFloat(item.unit_price)).toFixed(2)}</td>
                                            <td>
                                                <span
                                                    className={`badge bg-${item.status === 'Pending' ? 'danger' : item.status === 'Partial' ? 'warning' : 'success'}`}>
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td>
                                                {(item.status === 'Pending' || item.status === 'Partial') && (
                                                    <Button
                                                        type={ButtonType.button}
                                                        text="Mark Complete"
                                                        variant={ButtonVariant.primary}
                                                        size={ButtonSize.small}
                                                        onClick={() => handleMarkComplete()}
                                                    />
                                                )}
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
                                            <td colSpan={4} style={{ 'textAlign': 'center' }}>
                                                <strong>Total</strong>
                                            </td>
                                            <td>
                                                {purchaseRequestDetail?.purchase_requisition_items?.reduce((acc: any, item: any) => acc + parseFloat(item.unit_price), 0).toFixed(2)}
                                            </td>
                                            <td>
                                                {purchaseRequestDetail?.purchase_requisition_items?.reduce((acc: any, item: any) => acc + parseInt(item.request_quantity), 0).toFixed(2)}
                                            </td>
                                            <td>
                                                {purchaseRequestDetail?.purchase_requisition_items?.reduce((acc: any, item: any) => acc + parseInt(item.processed_quantity), 0).toFixed(2)}
                                            </td>
                                            <td>
                                                {purchaseRequestDetail?.purchase_requisition_items?.reduce((acc: any, item: any) => acc + parseInt(item.remaining_quantity), 0).toFixed(2)}
                                            </td>
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
        </div>
    );
};

// View.getLayout = (page: any) => <AppLayout>{page}</AppLayout>;
export default View;
