import React, {useEffect} from 'react';
import PrintLayout from "@/components/Layouts/PrintLayout";
import {useAppDispatch, useAppSelector} from "@/store";
import {useRouter} from "next/router";
import ContentLoader from "@/components/ContentLoader";
import {setPageTitle} from "@/store/slices/themeConfigSlice";
import {clearVendorBillState, getVendorBillDetail} from "@/store/slices/vendorBillSlice";
import {setAuthToken} from "@/configs/api.config";

const Print = () => {
    const dispatch = useAppDispatch()
    const router = useRouter()
    const {token} = useAppSelector(state => state.user)
    const {vendorBillDetail, loading} = useAppSelector(state => state.vendorBill)

    useEffect(() => {
        setAuthToken(token)
        dispatch(setPageTitle('Print Vendor Bill'));
        dispatch(clearVendorBillState());

        const billId = router.query.id;

        if (billId) {
            const id = Array.isArray(billId) ? billId[0] : billId;
            dispatch(getVendorBillDetail(parseInt(id)));
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
                                Vendor Bill
                            </h1>
                        </div>

                        <div className="flex justify-between items-center">
                            <div className="flex flex-col gap-1.25">
                                <span>
                                    <strong>Vendor Invoice #:</strong>
                                    {vendorBillDetail?.invoice_number}
                                </span>
                                <span>
                                    <strong>LPO No:</strong>
                                    {vendorBillDetail?.local_purchase_order.lpo_number}
                                </span>
                                <span>
                                    <strong>GRN No:</strong>
                                    {vendorBillDetail?.good_receive_note?.grn_number}
                                </span>
                                <span>
                                    <strong>Created Date:</strong>
                                    {(new Date(vendorBillDetail?.created_at)).toDateString()}
                                </span>
                            </div>
                            <div className="flex flex-col gap-1.25">
                                <span>
                                    <strong>Requisition Code: </strong>
                                    {vendorBillDetail?.purchase_requisition?.pr_code}
                                </span>
                                <span>
                                    <strong>Requested By:</strong>
                                    {vendorBillDetail?.purchase_requisition?.employee?.name}
                                </span>
                                <span>
                                    <strong>Internal Document No:</strong>
                                    {vendorBillDetail?.local_purchase_order.internal_document_number}
                                </span>
                            </div>
                        </div>

                        <div className="flex justify-between items-center my-2.5">
                            <div className="flex flex-col">
                                <span className="mb-1.25 font-bold">PAID TO</span>
                                <span
                                    className="text-base font-bold">{vendorBillDetail?.local_purchase_order.vendor?.name}</span>
                                <span
                                    className="text-base">{`${vendorBillDetail?.local_purchase_order.vendor?.address} ${vendorBillDetail?.local_purchase_order.vendor?.city?.name}, ${vendorBillDetail?.local_purchase_order.vendor?.state?.name}`}</span>
                                <span
                                    className="text-base">{`${vendorBillDetail?.local_purchase_order.vendor?.country?.name} ${vendorBillDetail?.local_purchase_order.vendor?.postal_code}`}</span>
                                <span
                                    className="text-base">{vendorBillDetail?.local_purchase_order.vendor?.phone}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="uppercase mb-1.25 font-bold">Address Correspondence To</span>
                                <span className="text-base">Flaxen Paints Industry LLC</span>
                                <span className="text-base">
                                    Plot # 593 Industrial Area <br/>
                                    Umm Al Thuoob Umm Al Quwain, UAE
                                </span>
                                <span className="text-base font-bold">Name: Anwar Ali</span>
                                <span className="text-base font-bold">Email: info@flaxenpaints.com</span>
                                <span className="text-base font-bold">Phone: +971544765504</span>
                            </div>
                        </div>

                        <div className="mt-5">
                            <table>
                                <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Item</th>
                                    <th>Unit</th>
                                    <th>Quantity</th>
                                    <th>Received Quantity</th>
                                    <th>Unit Price</th>
                                    <th>Tax Category</th>
                                    <th>Tax Rate</th>
                                    <th>Tax Amount</th>
                                    <th>Total</th>
                                </tr>
                                </thead>
                                <tbody>
                                {vendorBillDetail?.good_receive_note?.raw_products?.map((item: any, index: number) => (
                                    <tr>
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
                                        <td>{item.quantity}</td>
                                        <td>{item.received_quantity}</td>
                                        <td>{item.unit_price.toFixed(2)}</td>
                                        <td>{item.tax_category ? item.tax_category.name : 'None'}</td>
                                        <td>{item.tax_rate.toFixed(2)}</td>
                                        <td>{item.tax_amount.toFixed(2)}</td>
                                        <td>{item.grand_total.toFixed(2)}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="p-2.5">
                            <div>
                                <span className="font-bold mt-5 block">Terms and Conditions</span>
                                <div
                                    dangerouslySetInnerHTML={{__html: vendorBillDetail?.local_purchase_order.terms_conditions}}/>
                            </div>
                        </div>

                        <div className="flex justify-end items-end mt-8">
                            <div className="flex flex-col items-center">
                                <div className="flex flex-col items-center gap-8">
                                    <span className="font-bold">Approved By</span>
                                    <span>________________________</span>
                                </div>
                                <span
                                    className="font-bold">{vendorBillDetail?.good_receive_note?.verified_by?.name}</span>
                            </div>
                        </div>
                    </div>
                )}
        </div>
    );
};

Print.getLayout = (page: any) => (<PrintLayout>{page}</PrintLayout>)
export default Print;
