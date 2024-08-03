import React, { useEffect, useState } from 'react';
import { AppBasePath } from '@/utils/enums';
import PageWrapper from '@/components/PageWrapper';
import { useAppDispatch, useAppSelector } from '@/store';
import { useRouter } from 'next/router';
import { setPageTitle } from '@/store/slices/themeConfigSlice';
import { setAuthToken } from '@/configs/api.config';
import { capitalize } from 'lodash';
import { clearDeliveryNoteState, showDetails } from '@/store/slices/deliveryNoteSlice';
import useSetActiveMenu from '@/hooks/useSetActiveMenu';
import DetailPageHeader from '@/components/apps/DetailPageHeader';
import AppLayout from '@/components/Layouts/AppLayout';

const View = () => {
    useSetActiveMenu(AppBasePath.Delivery_Note);
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { token } = useAppSelector(state => state.user);
    const { deliveryNoteDetail, loading } = useAppSelector(state => state.deliveryNote);
    const [ids, setIds] = useState<string[]>([]);

    const calculateTotal = (item: any) => {
        let totalCost = parseFloat(item.retail_price) * parseFloat(item.quantity);
        let taxAmount = (totalCost * parseFloat(item.tax_rate)) / 100;
        let discountAmount = item.discount_type === 'percentage' ? (totalCost * parseFloat(item.discount_amount_rate)) / 100 : parseFloat(item.discount_amount_rate);
        return totalCost + taxAmount - discountAmount;
    };

    useEffect(() => {
        setAuthToken(token);
        dispatch(setPageTitle('Delivery Note Details'));
        dispatch(clearDeliveryNoteState());

        const quotationId = router.query.id;

        if (quotationId) {
            setIds(Array.isArray(quotationId) ? quotationId : [quotationId]);
            const id = Array.isArray(quotationId) ? quotationId[0] : quotationId;
            dispatch(showDetails(parseInt(id)));
        }
    }, [router.query.id, dispatch]);

    return (
        <div>
            <DetailPageHeader
                appBasePath={AppBasePath.Delivery_Note}
                title="Quotation Details"
                middleComponent={{
                    show: true,
                    edit: {
                        show: false
                    },
                    print: {
                        show: true,
                        onClick: () => router.push('/apps/sales/orders/delivery-notes/print/' + ids.join('/'))
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
                    backLink: '/apps/sales/orders/delivery-notes'
                }}
            />
            <PageWrapper
                loading={loading}
                breadCrumbItems={[]}
                embedLoader={true}
            >
                {deliveryNoteDetail && (
                    <div>
                        <div className="flex justify-between items-center flex-col md:flex-row w-full gap-3">
                            <div className="flex flex-col gap-2 justify-start items-start">
                                <span>
                                    <strong>Delivery Note Code: </strong>
                                    {deliveryNoteDetail?.delivery_note_code}
                                </span>
                                <span>
                                    <strong>Receipt Delivery (Days): </strong>
                                    {deliveryNoteDetail?.receipt_delivery_due_days}
                                </span>
                                <span>
                                    <strong>Delivery: </strong>
                                    {deliveryNoteDetail?.delivery_due_in_days + ' - ' + deliveryNoteDetail?.delivery_due_date}
                                </span>
                                <span>
                                    <strong>Created At: </strong>
                                    {(new Date(deliveryNoteDetail?.created_at)).toLocaleDateString() + '  ' + (new Date(deliveryNoteDetail?.created_at)).toLocaleTimeString()}
                                </span>
                            </div>
                            <div className="flex flex-col gap-2 justify-start items-start">
                                <span>
                                    <strong>Salesman: </strong>
                                    {deliveryNoteDetail?.salesman?.name}
                                </span>
                                <span>
                                    <strong>Customer: </strong>
                                    {deliveryNoteDetail?.customer?.name}
                                </span>
                                <span>
                                    <strong>Contact Person: </strong>
                                    {deliveryNoteDetail?.contact_person?.name}
                                </span>
                                <span>
                                    <strong>Created By: </strong>
                                    {deliveryNoteDetail?.created_by?.name}
                                </span>
                            </div>
                        </div>

                        <h5 className="text-lg font-semibold dark:text-white-light pt-10">Item Details</h5>
                        <div className="table-responsive">
                            <table>
                                <thead>
                                <tr>
                                    <th>Sr.No</th>
                                    <th>Product</th>
                                    {/*{!deliveryNoteDetail.skip_quotation && (<th>Quotation</th>)}*/}
                                    <th>Batch #</th>
                                    <th>Filling Product</th>
                                    <th>Delivered Quantity</th>
                                </tr>
                                </thead>
                                <tbody className="text-center">

                                {deliveryNoteDetail?.delivery_note_items?.map((item: any, index: any) => (

                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{item.product_assembly.formula_name}</td>
                                        {/*{!deliveryNoteDetail.skip_quotation && (*/}
                                        {/*    <td>{item.quotation.quotation_code}</td>*/}
                                        {/*)}*/}
                                        <td>
                                            {item.available_quantity ? (
                                                <div>
                                                    <span>{item.batch_number}</span><br />
                                                    <span>{item.filling.filling_code}</span>
                                                </div>
                                            ) : (
                                                <span className="text-red-500">Not Available</span>
                                            )}
                                        </td>
                                        <td>{item.product?.title}</td>
                                        <td>{item.delivered_quantity}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </PageWrapper>
        </div>
    );
};

// View.getLayout = (page: any) => <AppLayout>{page}</AppLayout>;
export default View;
