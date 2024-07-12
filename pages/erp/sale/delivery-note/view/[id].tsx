import React, {useEffect} from 'react';
import {ButtonType, ButtonVariant, IconType} from "@/utils/enums";
import PageWrapper from "@/components/PageWrapper";
import {useAppDispatch, useAppSelector} from "@/store";
import {useRouter} from "next/router";
import {setPageTitle} from "@/store/slices/themeConfigSlice";
import {setAuthToken} from "@/configs/api.config";
import {capitalize} from "lodash";
import {clearDeliveryNoteState, showDetails} from "@/store/slices/deliveryNoteSlice";

const View = () => {
    const dispatch = useAppDispatch()
    const router = useRouter()
    const {token} = useAppSelector(state => state.user)
    const {deliveryNoteDetail, loading} = useAppSelector(state => state.deliveryNote)

    const breadcrumbItems = [
        {
            title: 'Home',
            href: '/erp/main'
        },
        {
            title: 'Sale Dashboard',
            href: '/erp/sale'
        },
        {
            title: 'All Delivery Notes',
            href: '/erp/sale/delivery-note'
        },
        {
            title: 'View Delivery Note',
            href: '#'
        }
    ];

    const calculateTotal = (item: any) => {
        let totalCost = parseFloat(item.retail_price) * parseFloat(item.quantity);
        let taxAmount = (totalCost * parseFloat(item.tax_rate)) / 100;
        let discountAmount = item.discount_type === 'percentage' ? (totalCost * parseFloat(item.discount_amount_rate)) / 100 : parseFloat(item.discount_amount_rate);
        return totalCost + taxAmount - discountAmount;
    }

    useEffect(() => {
        setAuthToken(token)
        dispatch(setPageTitle('Delivery Note Details'))
        dispatch(clearDeliveryNoteState())

        const quotationId = router.query.id;

        if (quotationId) {
            const id = Array.isArray(quotationId) ? quotationId[0] : quotationId;
            dispatch(showDetails(parseInt(id)));
        }
    }, [router.query.id, dispatch]);

    return (
        <PageWrapper
            embedLoader={true}
            loading={loading}
            breadCrumbItems={breadcrumbItems}
            title="Delivery Note Details"
            buttons={[
                // {
                //     text: 'Edit',
                //     type: ButtonType.link,
                //     variant: ButtonVariant.info,
                //     icon: IconType.edit,
                //     link: '/erp/sale/quotation/edit/' + router.query.id
                // },
                {
                    text: 'Print',
                    type: ButtonType.link,
                    variant: ButtonVariant.success,
                    icon: IconType.print,
                    link: '/erp/sale/delivery-note/print/' + router.query.id
                },
                {
                    text: 'Back',
                    type: ButtonType.link,
                    variant: ButtonVariant.primary,
                    icon: IconType.back,
                    link: '/erp/sale/delivery-note'
                }
            ]}
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
                                <strong>Quotation Code: </strong>
                                {deliveryNoteDetail?.quotation.quotation_code}
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
                                <th>Batch #</th>
                                <th>Product</th>
                                <th>Available</th>
                                <th>Retail Price</th>
                                <th>Qty</th>
                                <th>Tax</th>
                                <th>Discount</th>
                                <th>Total Cost</th>
                            </tr>
                            </thead>
                            <tbody className="text-center">

                            {deliveryNoteDetail?.delivery_note_items?.map((item: any, index: any) => (

                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{item.batch_number}</td>
                                    <td>{item.product?.title}</td>
                                    <td>{item.available_quantity}</td>
                                    <td>{item.retail_price.toFixed(2)}</td>
                                    <td>{item.quantity.toFixed(2)}</td>
                                    <td>
                                        <div className="flex flex-col">
                                            <span><strong>Tax: </strong>{item.tax_category.name} ({item.tax_rate}%)</span>
                                            <span><strong>Amount: </strong>{item.tax_amount.toFixed(2)}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="flex flex-col">
                                            <span><strong>Type: </strong>{capitalize(item.discount_type)}</span>
                                            <span><strong>Rate: </strong>
                                                {item.discount_amount_rate.toFixed(2)}{item.discount_type === 'percentage' ? '%' : ''}
                                            </span>
                                        </div>
                                    </td>

                                    <td>{calculateTotal(item).toFixed(2)}</td>

                                </tr>
                            ))}
                            </tbody>
                            <tfoot>
                            <tr>
                                <td colSpan={8} className="text-center py-2">Total</td>
                                <td className="ps-4 py-2">
                                    {deliveryNoteDetail?.delivery_note_items
                                        ?.reduce((total: number, item: any) => total + calculateTotal(item), 0)
                                        .toFixed(2)}
                                </td>
                            </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            )}
        </PageWrapper>
    );
};

export default View;
