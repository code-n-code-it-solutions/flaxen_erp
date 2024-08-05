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
            setGoodReceiveNoteItems(vendorBillDetail.good_receive_note_vendor_bill.map((item: any) => item.good_receive_note.raw_products).flat());
        }
    }, [vendorBillDetail]);

    return (
        <div>
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
                                {vendorBillDetail?.payment_terms ? (
                                    <span>
                                        <strong>Payment Terms: </strong>
                                        {vendorBillDetail?.payment_terms} Days
                                    </span>
                                ) : <></>}
                                {vendorBillDetail?.due_date ? (
                                    <span>
                                        <strong>Due Date: </strong>
                                        {vendorBillDetail?.due_date}
                                    </span>
                                ) : <></>}
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
                                    <th>Tax</th>
                                    <th>Discount</th>
                                    <th className="text-center">Grand Total</th>
                                </tr>
                                </thead>
                                <tbody>
                                {goodReceiveNoteItems.length > 0
                                    ? (goodReceiveNoteItems.map((item: any, index: number) => {
                                            let grn = vendorBillDetail?.good_receive_note_vendor_bill.find((grn: any) => grn.good_receive_note_id === item.good_receive_note_id);
                                            return (
                                                <tr key={index}>
                                                    <td>{grn?.good_receive_note.grn_number}</td>
                                                    <td>{item.raw_product?.item_code}</td>
                                                    <td className="text-center">{item.received_quantity}</td>
                                                    <td className="text-center">{item.unit_price}</td>
                                                    <td className="text-center">{(item.unit_price * item.received_quantity).toFixed(2)}</td>
                                                    <td>
                                                        {item.tax_category
                                                            ? (
                                                                <div className="flex flex-col">
                                                                    <span><strong>Tax: </strong>{item.tax_category.name} ({item.tax_rate}%)</span>
                                                                    <span><strong>Amount: </strong>{item.tax_amount.toFixed(2)}
                                                                    </span>
                                                                </div>
                                                            ) : (
                                                                <span>N/A</span>
                                                            )}
                                                    </td>
                                                    <td>
                                                        {item.discount_type
                                                            ? (
                                                                <div className="flex flex-col">
                                                                    <span><strong>Type: </strong>{capitalize(item.discount_type)}
                                                                    </span>
                                                                    <span><strong>Rate: </strong>
                                                                        {item.discount_amount_rate.toFixed(2)}{item.discount_type === 'percentage' ? '%' : ''}
                                                                    </span>
                                                                </div>
                                                            ) : (
                                                                <span>N/A</span>
                                                            )}
                                                    </td>
                                                    <td className="text-center">
                                                        {item.total_price.toFixed(2)}
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan={8} className="text-center">No items found</td>
                                        </tr>
                                    )}
                                </tbody>
                                <tfoot>
                                <tr>
                                    <td colSpan={4} className="text-center font-bold">Total</td>
                                    <td className="text-center font-bold">{goodReceiveNoteItems.reduce((acc, item) => acc + (item.unit_price * item.received_quantity), 0).toFixed(2)}</td>
                                    <td colSpan={2}></td>
                                    <td className="text-center font-bold">{goodReceiveNoteItems.reduce((acc, item) => acc + item.total_price, 0).toFixed(2)}</td>
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

// View.getLayout = (page: any) => <AppLayout>{page}</AppLayout>;
export default View;
