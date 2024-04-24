import React, {useEffect} from 'react';
import PrintLayout from "@/components/Layouts/PrintLayout";
import {useAppDispatch, useAppSelector} from "@/store";
import {useRouter} from "next/router";
import {setPageTitle} from "@/store/slices/themeConfigSlice";
import {clearLocalPurchaseOrderState, showDetails} from "@/store/slices/localPurchaseOrderSlice";
import ContentLoader from "@/components/ContentLoader";
import {setAuthToken} from "@/configs/api.config";

const Print = () => {

    const dispatch = useAppDispatch();
    const router = useRouter();
    const {token} = useAppSelector(state => state.user)
    const {loading, LPODetail} = useAppSelector(state => state.localPurchaseOrder);

    useEffect(() => {
        setAuthToken(token)
        dispatch(setPageTitle('Local Purchase Order Details'));
        dispatch(clearLocalPurchaseOrderState());

        const lpoId = router.query.id;

        if (lpoId) {
            const id = Array.isArray(lpoId) ? lpoId[0] : lpoId;
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
                                Purchase Order
                            </h1>
                        </div>
                        <div className="flex justify-between items-center mb-5">
                            <div className="flex flex-col gap-1">
                                <span>
                                    <strong>LPO No:</strong> {LPODetail?.lpo_number}
                                </span>
                                <span>
                                    <strong>Date:</strong> {(new Date(LPODetail?.created_at)).toDateString()}
                                </span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span>
                                    <strong>Requisition Code:</strong> {LPODetail?.purchase_requisition?.pr_code}
                                </span>
                                <span>
                                    <strong>Requested By:</strong> {LPODetail?.purchase_requisition?.employee?.name}
                                </span>
                                <span>
                                    <strong>Internal Document No:</strong> {LPODetail?.internal_document_number}
                                </span>
                            </div>
                        </div>
                        <div className="flex justify-between items-center mt-5">
                            <div className="flex flex-col">
                                <span className="uppercase font-bold">TO</span>
                                <span className=" font-bold">{LPODetail?.vendor?.name}</span>
                                <span>{LPODetail?.vendor?.address + ' ' + LPODetail?.vendor?.city?.name + ', ' + LPODetail?.vendor?.state?.name}</span>
                                <span>{LPODetail?.vendor?.country?.name + ' ' + LPODetail?.vendor?.postal_code}</span>
                                <span className="">{LPODetail?.vendor?.phone}</span>
                                <span className=" font-bold">Rep: {LPODetail?.vendor_representative.name}</span>
                                <span className=" font-bold">Rep Ph: {LPODetail?.vendor_representative.phone}</span>
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
                        <div className="my-5">
                            <table className="w-full">
                                <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Item</th>
                                    <th>Unit</th>
                                    {/*<th>Description</th>*/}
                                    <th>Quantity</th>
                                    <th>Unit Price</th>
                                    <th>Tax Category</th>
                                    <th>Tax Rate</th>
                                    <th>Tax Amount</th>
                                    <th>Total</th>
                                </tr>
                                </thead>
                                <tbody>
                                {LPODetail?.items.map((item: any, index: number) => (
                                    <tr key={index}>
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
                                        {/*<td>{item.description}</td>*/}
                                        <td>{item.quantity}</td>
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
                                    <td colSpan={8} className="text-right">
                                        Total Without Tax
                                    </td>
                                    <td className="text-left ps-5">
                                        {LPODetail?.items?.reduce((acc: number, item: any) => acc + item.sub_total, 0).toFixed(2)}
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan={8} className="text-right">
                                        VAT
                                    </td>
                                    <td className="text-left ps-5">
                                        {LPODetail?.items?.reduce((acc: number, item: any) => acc + item.tax_amount, 0).toFixed(2)}
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan={8} className="text-right">
                                        Grand Total
                                    </td>
                                    <td className="text-left ps-5">
                                        {LPODetail?.items?.reduce((acc: number, item: any) => acc + item.grand_total, 0).toFixed(2)}
                                    </td>
                                </tr>
                                </tfoot>
                            </table>
                        </div>
                        <div className="p-2.5">
                            <div>
                                <span className="font-bold mt-5">Terms and Conditions</span>
                                <div dangerouslySetInnerHTML={{__html: LPODetail?.terms_conditions}}/>
                            </div>
                        </div>
                    </div>
                )}
        </div>
    );
};

Print.getLayout = (page: any) => (<PrintLayout>{page}</PrintLayout>)
export default Print;
