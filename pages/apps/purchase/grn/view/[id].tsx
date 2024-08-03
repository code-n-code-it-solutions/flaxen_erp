import React, { useEffect, useState } from 'react';
import PageWrapper from '@/components/PageWrapper';
import { useAppDispatch, useAppSelector } from '@/store';
import { AppBasePath, ButtonType, ButtonVariant, IconType } from '@/utils/enums';
import { useRouter } from 'next/router';
import { setPageTitle } from '@/store/slices/themeConfigSlice';
import { clearGoodReceiveNoteState, getGRNDetail } from '@/store/slices/goodReceiveNoteSlice';
import { setAuthToken } from '@/configs/api.config';
import AppLayout from '@/components/Layouts/AppLayout';
import useSetActiveMenu from '@/hooks/useSetActiveMenu';
import DetailPageHeader from '@/components/apps/DetailPageHeader';

const View = () => {
    useSetActiveMenu(AppBasePath.Good_Receive_Note);
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { token } = useAppSelector(state => state.user);
    const { GRNDetail, loading } = useAppSelector(state => state.goodReceiveNote);
    const [ids, setIds] = useState<string[]>([]);

    useEffect(() => {
        setAuthToken(token);
        dispatch(setPageTitle('Good Receive Note Details'));
        dispatch(clearGoodReceiveNoteState());
        const grnId = router.query.id;
        if (grnId) {
            setIds(Array.isArray(grnId) ? grnId : [grnId]);
            const id = Array.isArray(grnId) ? grnId[0] : grnId;
            dispatch(getGRNDetail(parseInt(id)));
        }
    }, [router.query.id, dispatch]);

    return (
        <div>
            <DetailPageHeader
                appBasePath={AppBasePath.Good_Receive_Note}
                title="GRN Details"
                middleComponent={{
                    show: true,
                    edit: {
                        show: true
                    },
                    print: {
                        show: true,
                        onClick: () => router.push('/apps/purchase/grn/print/' + ids.join('/'))
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
                    backLink: '/apps/purchase/grn'
                }}
            />
            <PageWrapper
                loading={loading}
                embedLoader={true}
            >
                {GRNDetail && (
                    <div>
                        <div className="flex justify-between items-center mb-5">
                            <div className="flex flex-col gap-1">
                                <span>
                                    <strong>GRN No:</strong> {GRNDetail?.grn_number}
                                </span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span>
                                    <strong>Created Date:</strong> {(new Date(GRNDetail?.created_at)).toDateString()}
                                </span>
                            </div>
                        </div>
                        <div className="flex justify-between items-center mt-5">
                            <div className="flex flex-col">
                                <span className="uppercase font-bold">TO</span>
                                <span
                                    className=" font-bold">{GRNDetail?.raw_products[0]?.local_purchase_order?.vendor?.name}</span>
                                <span>{GRNDetail?.raw_products[0]?.local_purchase_order?.vendor?.address + ' ' + GRNDetail?.raw_products[0]?.local_purchase_order?.vendor?.city?.name + ', ' + GRNDetail?.raw_products[0]?.local_purchase_order?.vendor?.state?.name}</span>
                                <span>{GRNDetail?.raw_products[0]?.local_purchase_order?.vendor?.country?.name + ' ' + GRNDetail?.raw_products[0]?.local_purchase_order?.vendor?.postal_code}</span>
                                <span
                                    className="">{GRNDetail?.raw_products[0]?.local_purchase_order?.vendor?.phone}</span>
                                <span className=" font-bold">
                                    Rep: {GRNDetail?.raw_products[0]?.local_purchase_order?.vendor_representative.name}
                                </span>
                                <span className=" font-bold">
                                    Rep
                                    Ph: {GRNDetail?.raw_products[0]?.local_purchase_order?.vendor_representative.phone}
                                </span>
                            </div>
                            <div className="flex flex-col">
                                <span className="uppercase font-bold">Address Correspondence To</span>
                                <span className="">Flaxen Paints Industry LLC</span>
                                <span className="">
                                    Plot # 593 Industrial Area <br />
                                    Umm Al Thuoob Umm Al Quwain, UAE
                                </span>
                                <span className="font-bold">Name: Anwar Ali</span>
                                <span className="font-bold">Email: info@flaxenpaints.com</span>
                                <span className="font-bold">Phone: +971544765504</span>
                            </div>
                        </div>
                        <div className="my-5 table-responsive">
                            <table className="w-full border-collapse">
                                <thead>
                                <tr>
                                    <th>#</th>
                                    <th>PR</th>
                                    <th>Item</th>
                                    <th>Unit</th>
                                    <th>Unit Price</th>
                                    <th>Qty</th>
                                    <th>Tax</th>
                                    <th>Total</th>
                                </tr>
                                </thead>
                                <tbody>
                                {GRNDetail?.raw_products?.map((item: any, index: number) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td className="text-[12px]">
                                            <div className="flex flex-col">
                                                <span>
                                                    <strong>PR: </strong>
                                                    {item.purchase_requisition?.pr_code}
                                                </span>
                                                <span>
                                                    <strong>By: </strong>
                                                    {item.purchase_requisition?.employee?.name}
                                                </span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="flex justify-start flex-col items-start">
                                                <span style={{ fontSize: 8 }}>Code: {item.raw_product?.item_code}</span>
                                                <span>{item.raw_product?.title}</span>
                                                <span
                                                    style={{ fontSize: 8 }}>VM: {item.raw_product?.valuation_method}</span>
                                            </div>
                                        </td>
                                        <td>{item.unit?.name}</td>
                                        <td>{item.unit_price.toFixed(2)}</td>
                                        <td className="text-[12px]">
                                            <div className="flex flex-col">
                                                <span>
                                                    <strong>Requested: </strong>
                                                    {item.quantity}
                                                </span>
                                                <span>
                                                    <strong>Received: </strong>
                                                    {item.received_quantity}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="text-[12px]">
                                            <div className="flex flex-col">
                                                <span>
                                                    <strong>Category: </strong>
                                                    {item.tax_category ? item.tax_category.name : 'None'}
                                                </span>
                                                <span>
                                                    <strong>Rate: </strong>
                                                    {item.tax_rate.toFixed(2)}
                                                </span>
                                                <span>
                                                    <strong>Amount: </strong>
                                                    {item.tax_amount.toFixed(2)}
                                                </span>
                                            </div>
                                        </td>
                                        <td>{item.grand_total.toFixed(2)}</td>
                                    </tr>
                                ))}
                                </tbody>
                                <tfoot>
                                <tr>
                                    <td colSpan={7} className="text-right">
                                        Total Without Tax
                                    </td>
                                    <td className="text-left ps-5">
                                        {GRNDetail?.raw_products?.reduce((acc: number, item: any) => acc + item.sub_total, 0).toFixed(2)}
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan={7} className="text-right">
                                        VAT
                                    </td>
                                    <td className="text-left ps-5">
                                        {GRNDetail?.raw_products?.reduce((acc: number, item: any) => acc + item.tax_amount, 0).toFixed(2)}
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan={7} className="text-right">
                                        Grand Total
                                    </td>
                                    <td className="text-left ps-5">
                                        {GRNDetail?.raw_products?.reduce((acc: number, item: any) => acc + item.grand_total, 0).toFixed(2)}
                                    </td>
                                </tr>
                                </tfoot>
                            </table>
                        </div>
                        <div className="p-2.5">
                            <div>
                                <span className="font-bold text-lg mt-5">Terms and Conditions</span>
                                <div
                                    dangerouslySetInnerHTML={{ __html: GRNDetail?.local_purchase_order?.terms_conditions }} />
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
