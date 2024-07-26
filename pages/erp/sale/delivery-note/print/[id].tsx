import React, {useEffect} from 'react';
import PrintLayout from "@/components/Layouts/PrintLayout";
import {useAppDispatch, useAppSelector} from "@/store";
import {useRouter} from "next/router";
import {setAuthToken} from "@/configs/api.config";
import {setPageTitle} from "@/store/slices/themeConfigSlice";
import ContentLoader from "@/components/ContentLoader";
import {capitalize} from "lodash";
import {clearDeliveryNoteState, showDetails} from "@/store/slices/deliveryNoteSlice";

const Print = () => {
    const dispatch = useAppDispatch()
    const router = useRouter()
    const {token} = useAppSelector(state => state.user)
    const {deliveryNoteDetail, loading} = useAppSelector(state => state.deliveryNote)
    // console.log(deliveryNoteDetail)

    useEffect(() => {
        setAuthToken(token)
        dispatch(setPageTitle('Print Delivery Note'))
        dispatch(clearDeliveryNoteState())

        const deliveryNoteId = router.query.id;

        if (deliveryNoteId) {
            const id = Array.isArray(deliveryNoteId) ? deliveryNoteId[0] : deliveryNoteId;
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
                        <div className="flex justify-center items-center">
                            <h1 className="text-lg font-bold">
                                Delivery Note Details
                            </h1>
                        </div>

                        <div className="flex justify-between items-center w-full gap-3">
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
                                    <th>Qty</th>
                                </tr>
                                </thead>
                                <tbody className="text-center">

                                {deliveryNoteDetail?.delivery_note_items?.map((item: any, index: any) => (

                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{item.batch_number}</td>
                                        <td>{item.product?.item_code}</td>
                                        <td>{item.quantity.toFixed(2)}</td>

                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
        </div>
    );
};

Print.getLayout = (page: any) => (<PrintLayout>{page}</PrintLayout>)
export default Print;
