import React, { useEffect, useState } from 'react';
import AppLayout from '@/components/Layouts/AppLayout';
import { setAuthToken } from '@/configs/api.config';
import { setPageTitle } from '@/store/slices/themeConfigSlice';
import useSetActiveMenu from '@/hooks/useSetActiveMenu';
import { AppBasePath } from '@/utils/enums';
import { useAppDispatch, useAppSelector } from '@/store';
import { useRouter } from 'next/router';
import { clearVendorBillState, showDetails } from '@/store/slices/vendorBillSlice';
import DetailPageHeader from '@/components/apps/DetailPageHeader';
import PageWrapper from '@/components/PageWrapper';
import { capitalize } from 'lodash';

const View = () => {
    useSetActiveMenu(AppBasePath.Vendor_Bill);
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { token } = useAppSelector(state => state.user);
    const { allGRNs } = useAppSelector((state) => state.goodReceiveNote);
    const { vendorBillDetail, loading } = useAppSelector(state => state.vendorBill);
    const [ids, setIds] = useState<string[]>([]);
    const [goodReceiveNoteItems, setGoodReceiveNoteItems] = useState<any[]>([]);

    useEffect(() => {
        setAuthToken(token);
        dispatch(setPageTitle('Vendor Bill Details'));
        dispatch(clearVendorBillState());

        const vendorBillId = router.query.id;

        if (vendorBillId) {
            setIds(Array.isArray(vendorBillId) ? vendorBillId : [vendorBillId]);
            const id = Array.isArray(vendorBillId) ? vendorBillId[0] : vendorBillId;
            dispatch(showDetails(parseInt(id)));
        }
    }, [router.query.id, dispatch]);

    useEffect(() => {
        if (vendorBillDetail) {
            // console.log(vendorBillDetail?.good_receive_note_vendor_bill.find((grn: any) => grn.good_receive_note));
            setGoodReceiveNoteItems(vendorBillDetail.good_receive_note_vendor_bill?.map((item: any) => item.good_receive_note.raw_products).flat());
        }
    }, [vendorBillDetail]);

    const calculateTotals = (items: any) => {
        let totalBeforeTax = 0;
        let totalDiscount = 0;
        let totalTax = 0;
        let grandTotal = 0;

        items.forEach((item: any) => {
            const beforeTax = item.unit_price * item.received_quantity;
            const discount = item.discount_type === 'percentage'
                ? (beforeTax * (item.discount_amount_rate / 100))
                : item.discount_amount_rate;

            const subTotal = beforeTax - discount;
            const tax = subTotal * 0.05; // 5% Tax
            const total = subTotal + tax;

            totalBeforeTax += beforeTax;
            totalDiscount += discount;
            totalTax += tax;
            grandTotal += total;
        });

        const subTotal = totalBeforeTax - totalDiscount;

        return {
            totalBeforeTax: totalBeforeTax.toFixed(2),
            totalDiscount: totalDiscount.toFixed(2),
            subTotal: subTotal.toFixed(2),
            totalTax: totalTax.toFixed(2),
            grandTotal: grandTotal.toFixed(2),
        };
    };

    const totals = calculateTotals(goodReceiveNoteItems);

    return (
        <div className="flex flex-col gap-3">
            <DetailPageHeader
                appBasePath={AppBasePath.Vendor_Bill}
                title="Bill Details"
                middleComponent={{
                    show: true,
                    edit: {
                        show: false
                    },
                    print: {
                        show: true,
                        onClick: () => router.push('/apps/purchase/bills/print/' + ids.join('/'))
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
                    backLink: '/apps/purchase/bills'
                }}
            />
            <PageWrapper
                loading={loading}
                embedLoader={true}
            >
                {vendorBillDetail && (
                    <div>
                        <div className="flex justify-between items-center flex-col md:flex-row w-full gap-3">
                            <div className="flex flex-col gap-2 justify-start items-start">
                                <span>
                                    <strong>Bill Code: </strong>
                                    {vendorBillDetail?.bill_number}
                                </span>
                                <span>
                                    <strong>Bill Reference: </strong>
                                    {vendorBillDetail?.bill_reference}
                                </span>
                                <span>
                                    <strong>Bill Date: </strong>
                                    {vendorBillDetail?.bill_date}
                                </span>
                            </div>
                            <div className="flex flex-col gap-2 justify-start items-start">
                                {vendorBillDetail?.payment_terms && (
                                    <span>
                                        <strong>Payment Terms: </strong>
                                        {vendorBillDetail?.payment_terms} Days
                                    </span>
                                )}
                                {vendorBillDetail?.due_date && (
                                    <span>
                                        <strong>Due Date: </strong>
                                        {vendorBillDetail?.due_date}
                                    </span>
                                )}
                                <span>
                                    <strong>Vendor: </strong>
                                    {vendorBillDetail?.vendor?.name}
                                </span>
                                <span>
                                    <strong>Created At: </strong>
                                    {new Date(vendorBillDetail?.created_at).toLocaleDateString()}
                                </span>
                                <span>
                                    <strong>Created By: </strong>
                                    {vendorBillDetail?.created_by?.name}
                                </span>
                            </div>
                        </div>

                        <h5 className="text-lg font-semibold dark:text-white-light pt-10">Item Details</h5>
                        <div className="table-responsive mt-3">
                            <table>
                                <thead>
                                <tr>
                                    <th>GRN</th>
                                    <th>Product</th>
                                    <th className="text-center">Quantity</th>
                                    <th className="text-center">Unit Price</th>
                                    <th className="text-center">Before Tax</th>
                                    <th>Discount</th>
                                    <th>Sub Total</th>
                                    <th>Tax@5%</th>
                                    <th className="text-center">Grand Total</th>
                                </tr>
                                </thead>
                                <tbody>
                                {goodReceiveNoteItems?.length > 0
                                    ? goodReceiveNoteItems.map((item: any, index: number) => {
                                        let grn = vendorBillDetail?.good_receive_note_vendor_bill.find(
                                            (grn: any) => grn.good_receive_note_id === item.good_receive_note_id
                                        );
                                        const beforeTax = (item.unit_price * item.received_quantity).toFixed(2);
                                        const discount = item.discount_type
                                            ? (item.discount_type === 'percentage'
                                                ? ((item.unit_price * item.received_quantity) * (item.discount_amount_rate / 100)).toFixed(2)
                                                : item.discount_amount_rate.toFixed(2))
                                            : 'N/A';
                                        const subTotal = (
                                            item.unit_price * item.received_quantity - (discount !== 'N/A' ? parseFloat(discount) : 0)
                                        ).toFixed(2);
                                        const tax = (parseFloat(subTotal) * 0.05).toFixed(2);
                                        const grandTotal = (parseFloat(subTotal) + parseFloat(tax)).toFixed(2);

                                        return (
                                            <tr key={index}>
                                                <td>{grn?.good_receive_note.grn_number}</td>
                                                <td>{item.raw_product?.item_code}</td>
                                                <td className="text-center">{item.received_quantity}</td>
                                                <td className="text-center">{item.unit_price}</td>
                                                <td className="text-center">{beforeTax}</td>
                                                <td>{discount}</td>
                                                <td>{subTotal}</td>
                                                <td>{tax}</td>
                                                <td className="text-center">{grandTotal}</td>
                                            </tr>
                                        );
                                    })
                                    : (
                                        <tr>
                                            <td colSpan={9} className="text-center">No items found</td>
                                        </tr>
                                    )}
                                </tbody>
                                <tfoot>
                                <tr>
                                    <td colSpan={8} className="text-end">Total Before Tax: </td>
                                    <td className="text-start ps-5">{totals.totalBeforeTax}</td>
                                </tr>
                                <tr>
                                    <td colSpan={8} className="text-end">Total Discount: </td>
                                    <td className="text-start ps-5">{totals.totalDiscount}</td>
                                </tr>
                                <tr>
                                    <td colSpan={8} className="text-end">Sub Total:</td>
                                    <td className="text-start ps-5">{totals.subTotal}</td>
                                </tr>
                                <tr>
                                    <td colSpan={8} className="text-end">Tax @5%:</td>
                                    <td className="text-start ps-5">{totals.totalTax}</td>
                                </tr>
                                <tr>
                                    <td colSpan={8} className="text-end">Grand Total:</td>
                                    <td className="text-start ps-5">{totals.grandTotal}</td>
                                </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                )}
            </PageWrapper>
        </div>
    );
};

export default View;
