import React, {useEffect, useState} from 'react';
import {capitalize} from "lodash";
import {useAppDispatch, useAppSelector} from "@/store";
import {useRouter} from "next/router";
import {setAuthToken} from "@/configs/api.config";
import {setPageTitle} from "@/store/slices/themeConfigSlice";
import {clearVendorBillState} from "@/store/slices/vendorBillSlice";
import PrintLayout from "@/components/Layouts/PrintLayout";

const BillHistory = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const {token} = useAppSelector(state => state.user);
    const {vendorBillDetail} = useAppSelector(state => state.vendorBill);
    const [paymentRows, setPaymentRows] = useState<React.ReactElement[]>([]);

    useEffect(() => {
        setAuthToken(token)
        dispatch(setPageTitle('Print Vendor Bill'));
        dispatch(clearVendorBillState());

        const billId = router.query.id;

        if (billId) {
            const id = Array.isArray(billId) ? billId[0] : billId;
            // dispatch(getVendorBillDetail(parseInt(id)));
        }
    }, [router.query.id, dispatch]);

    useEffect(() => {
        // Assuming `content.vendor_bill_payments` is an array of payments sorted by date
        if (vendorBillDetail) {
            const payments = [...vendorBillDetail.vendor_bill_payments].reverse();
            let remainingBalance = parseFloat(vendorBillDetail?.bill_amount.replace(/,/g, ''));

            const newPaymentRows = payments.map((item, index) => {
                remainingBalance -= parseFloat(item.payment_amount.replace(/,/g, ''));
                return (
                    <tr key={index}>
                        <td>{vendorBillDetail.vendor_bill_payments.length - index}</td>
                        <td>{item.payment_date}</td>
                        <td>{capitalize(item.payment_method)}</td>
                        <td>{item.payment_reference}</td>
                        <td>{item.payment_amount}</td>
                        <td>{remainingBalance.toFixed(2)}</td>
                    </tr>
                );
            });

            setPaymentRows(newPaymentRows.reverse());
        }

    }, [vendorBillDetail]);

    return (
        <div className="print-container">
            <div className="flex flex-col justify-center items-center my-2.5">
                <h1 className="text-xl font-bold">
                    Payment History
                </h1>
                <span>
                    <strong>Status: </strong>
                    {capitalize(vendorBillDetail?.status)}
                </span>

            </div>
            <div className="flex justify-between items-center">
                <div className="flex flex-col gap-1.25">
                    <span>
                        <strong>Bill Number: </strong>
                        {vendorBillDetail?.bill_number}
                    </span>
                    <span>
                        <strong>Bill Amount: </strong>
                        {vendorBillDetail?.bill_amount}
                    </span>
                    <span>
                        <strong>Bill Created At: </strong>
                        {(new Date(vendorBillDetail?.created_at)).toDateString()}
                    </span>
                </div>
                <div className="flex flex-col gap-1.25">
                    <span>
                        <strong>Requisition #: </strong>
                        {vendorBillDetail?.purchase_requistion?.pr_code}
                    </span>
                    <span>
                        <strong>LPO #: </strong>
                        {vendorBillDetail?.local_purchase_order?.lpo_number}
                    </span>
                    <span>
                        <strong>Good Receive Note #: </strong>
                        {vendorBillDetail?.good_receive_note?.grn_number}
                    </span>

                </div>
            </div>

            <div className="mt-5">
                <table className="w-full border-collapse">
                    <thead className="bg-gray-50 border-b-2 border-gray-200">
                    <tr>
                        <th className="text-left px-1.25 py-0.5">#</th>
                        <th className="text-left px-1.25 py-0.5">Payment Date</th>
                        <th className="text-left px-1.25 py-0.5">Payment Method</th>
                        <th className="text-left px-1.25 py-0.5">Ref #</th>
                        <th className="text-left px-1.25 py-0.5">Amount</th>
                        <th className="text-left px-1.25 py-0.5">Balance</th>
                    </tr>
                    </thead>
                    <tbody>
                    {paymentRows}
                    <tr>
                        <td>{vendorBillDetail?.vendor_bill_payments.length + 1}</td>
                        <td>{(new Date(vendorBillDetail?.created_at)).toDateString()}</td>
                        <td>N/A</td>
                        <td>N/A</td>
                        <td>0.0</td>
                        <td>{parseFloat(vendorBillDetail?.bill_amount).toFixed(2).replace(/,/g, '')}</td>
                    </tr>
                    </tbody>
                </table>
            </div>

        </div>
    );
};
BillHistory.getLayout = (page: any) => (<PrintLayout>{page}</PrintLayout>)
export default BillHistory;
