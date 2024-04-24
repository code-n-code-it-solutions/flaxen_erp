import React, {useEffect} from 'react';
import PageWrapper from "@/components/PageWrapper";
import {useAppDispatch, useAppSelector} from "@/store";
import {ButtonType, ButtonVariant, IconType} from "@/utils/enums";
import {useRouter} from "next/router";
import {setPageTitle} from "@/store/slices/themeConfigSlice";
import {clearGoodReceiveNoteState, getGRNDetail} from "@/store/slices/goodReceiveNoteSlice";
import {setAuthToken} from "@/configs/api.config";

const View = () => {
    const dispatch = useAppDispatch()
    const {token} = useAppSelector(state => state.user)
    const {GRNDetail, loading} = useAppSelector(state => state.goodReceiveNote)
    const router = useRouter()

    const breadcrumbItems = [
        {
            title: 'Main Dashboard',
            href: '/erp/main',
        },
        {
            title: 'Purchase Dashboard',
            href: '/erp/purchase',
        },
        {
            title: 'All Good Receive Notes',
            href: '/erp/purchase/good-receive-note'
        },
        {
            title: 'Details',
            href: '#'
        },
    ];

    useEffect(() => {
        setAuthToken(token)
        dispatch(setPageTitle('Good Receive Note Details'));
        dispatch(clearGoodReceiveNoteState());

        const grnId = router.query.id;

        if (grnId) {
            const id = Array.isArray(grnId) ? grnId[0] : grnId;
            dispatch(getGRNDetail(parseInt(id)));
        }
    }, [router.query.id, dispatch]);

    return (
        <PageWrapper
            embedLoader={true}
            loading={loading}
            breadCrumbItems={breadcrumbItems}
            title="Good Receive Note Details"
            buttons={[
                // {
                //     text: 'Edit',
                //     type: ButtonType.link,
                //     variant: ButtonVariant.info,
                //     icon: IconType.edit,
                //     link: '/erp/purchase/lpo/edit/' + router.query.id
                // },
                {
                    text: 'Print',
                    type: ButtonType.link,
                    variant: ButtonVariant.success,
                    icon: IconType.print,
                    link: '/erp/purchase/good-receive-note/print/' + router.query.id
                },
                {
                    text: 'Back',
                    type: ButtonType.link,
                    variant: ButtonVariant.primary,
                    icon: IconType.back,
                    link: '/erp/purchase/good-receive-note'
                }
            ]}
        >
            {GRNDetail && (
                <div>
                    <div className="flex justify-between items-center mb-5">
                        <div className="flex flex-col gap-1">
                            <span>
                                <strong>GRN No:</strong> {GRNDetail?.grn_number}
                            </span>
                            <span>
                                <strong>LPO No:</strong> {GRNDetail?.local_purchase_order?.lpo_number}
                            </span>
                            <span>
                                <strong>Requisition Code:</strong>
                                {GRNDetail.local_purchase_order?.purchase_requisition?.pr_code}
                            </span>
                            <span>
                                <strong>Internal Document
                                    No:</strong> {GRNDetail?.local_purchase_order?.internal_document_number}
                            </span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span>
                                <strong>Created Date:</strong> {(new Date(GRNDetail?.created_at)).toDateString()}
                            </span>
                            <span>
                                <strong>Printed Date:</strong> {(new Date()).toDateString()}
                            </span>
                            <span>
                                <strong>Status:</strong> {GRNDetail?.status}
                            </span>
                            <span>
                                <strong>Requested
                                    By:</strong> {GRNDetail?.local_purchase_order?.purchase_requisition?.employee?.name}
                            </span>

                        </div>
                    </div>
                    <div className="flex justify-between items-center mt-5">
                        <div className="flex flex-col">
                            <span className="uppercase font-bold">TO</span>
                            <span className=" font-bold">{GRNDetail?.local_purchase_order?.vendor?.name}</span>
                            <span>{GRNDetail?.local_purchase_order?.vendor?.address + ' ' + GRNDetail?.local_purchase_order?.vendor?.city?.name + ', ' + GRNDetail?.local_purchase_order?.vendor?.state?.name}</span>
                            <span>{GRNDetail?.local_purchase_order?.vendor?.country?.name + ' ' + GRNDetail?.local_purchase_order?.vendor?.postal_code}</span>
                            <span className="">{GRNDetail?.local_purchase_order?.vendor?.phone}</span>
                            <span
                                className=" font-bold">Rep: {GRNDetail?.local_purchase_order?.vendor_representative.name}</span>
                            <span className=" font-bold">Rep
                                Ph: {GRNDetail?.local_purchase_order?.vendor_representative.phone}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="uppercase font-bold">Address Correspondence To</span>
                            <span className="">Flaxen Paints Industry LLC</span>
                            <span className="">
                                Plot # 593 Industrial Area <br/>
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
                                <th>Item</th>
                                <th>Unit</th>
                                {/*<th>Description</th>*/}
                                <th>Qty</th>
                                <th>R. Qty</th>
                                <th>Unit Price</th>
                                <th>Tax Category</th>
                                <th>Tax Rate</th>
                                <th>Tax Amount</th>
                                <th>Total</th>
                            </tr>
                            </thead>
                            <tbody>
                            {GRNDetail?.raw_products?.map((item: any, index: number) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <div className="flex justify-start flex-col items-start">
                                            <span style={{fontSize: 8}}>Code: {item.raw_product?.item_code}</span>
                                            <span>{item.raw_product?.title}</span>
                                            <span
                                                style={{fontSize: 8}}>VM: {item.raw_product?.valuation_method}</span>
                                        </div>
                                    </td>
                                    <td>{item.unit?.name}</td>
                                    {/*<td>{item.description}</td>*/}
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
                            <tfoot>
                            <tr>
                                <td colSpan={9} className="text-right">
                                    Total Without Tax
                                </td>
                                <td className="text-left ps-5">
                                    {GRNDetail?.raw_products?.reduce((acc: number, item: any) => acc + item.sub_total, 0).toFixed(2)}
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={9} className="text-right">
                                    VAT
                                </td>
                                <td className="text-left ps-5">
                                    {GRNDetail?.raw_products?.reduce((acc: number, item: any) => acc + item.tax_amount, 0).toFixed(2)}
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={9} className="text-right">
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
                            <div dangerouslySetInnerHTML={{__html: GRNDetail?.local_purchase_order?.terms_conditions}}/>
                        </div>
                    </div>
                </div>
            )}
        </PageWrapper>
    );
};

export default View;
