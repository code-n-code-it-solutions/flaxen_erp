import React, { useEffect, useState } from 'react';
import AppLayout from '@/components/Layouts/AppLayout';
import { setAuthToken } from '@/configs/api.config';
import { setPageTitle } from '@/store/slices/themeConfigSlice';
import useSetActiveMenu from '@/hooks/useSetActiveMenu';
import { AppBasePath } from '@/utils/enums';
import { useAppDispatch, useAppSelector } from '@/store';
import { useRouter } from 'next/router';
import DetailPageHeader from '@/components/apps/DetailPageHeader';
import PageWrapper from '@/components/PageWrapper';
import { capitalize } from 'lodash';
import { clearVendorPaymentState, showDetails } from '@/store/slices/vendorPayments';

const View = () => {
    useSetActiveMenu(AppBasePath.Vendor_Payment);
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { token } = useAppSelector(state => state.user);
    const { vendorPaymentDetail, loading } = useAppSelector(state => state.vendorPayment);
    const [ids, setIds] = useState<string[]>([]);

    useEffect(() => {
        setAuthToken(token);
        dispatch(setPageTitle('Vendor Payments'));
        dispatch(clearVendorPaymentState());

        const vendorPaymentId = router.query.id;

        if (vendorPaymentId) {
            setIds(Array.isArray(vendorPaymentId) ? vendorPaymentId : [vendorPaymentId]);
            const id = Array.isArray(vendorPaymentId) ? vendorPaymentId[0] : vendorPaymentId;
            dispatch(showDetails(parseInt(id)));
        }
    }, [router.query.id, dispatch]);

    return (
        <div className="flex flex-col gap-3">
            <DetailPageHeader
                appBasePath={AppBasePath.Vendor_Payment}
                title="Vendor Payment Details"
                middleComponent={{
                    show: true,
                    edit: {
                        show: false
                    },
                    print: {
                        show: true,
                        onClick: () => router.push('/apps/purchase/payments/print/' + ids.join('/'))
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
                    backLink: '/apps/purchase/payments'
                }}
            />
            <PageWrapper
                loading={loading}
                embedLoader={true}
            >
                {vendorPaymentDetail && (
                    <div>
                        <div className="flex justify-between items-center flex-col md:flex-row w-full gap-3">
                            <div className="flex flex-col gap-2 justify-start items-start">
                                <span>
                                    <strong>Payment Code: </strong>
                                    {vendorPaymentDetail?.payment_code}
                                </span>
                                <span>
                                    <strong>Payment Reference: </strong>
                                    {vendorPaymentDetail?.reference_no}
                                </span>
                                <span>
                                    <strong>Payment Date: </strong>
                                    {vendorPaymentDetail?.payment_date}
                                </span>
                                <span>
                                    <strong>Paying Account: </strong>
                                    {vendorPaymentDetail?.paying_account?.code + ' - ' + vendorPaymentDetail?.paying_account?.name}
                                </span>
                            </div>
                            <div className="flex flex-col gap-2 justify-start items-start">
                                <span>
                                    <strong>Payment Method: </strong>
                                    {vendorPaymentDetail?.payment_method?.name}
                                </span>
                                <span>
                                    <strong>Vendor: </strong>
                                    {vendorPaymentDetail?.vendor?.name}
                                </span>
                                <span>
                                    <strong>Created At: </strong>
                                    {new Date(vendorPaymentDetail?.created_at).toLocaleDateString()}
                                </span>
                                <span>
                                    <strong>Created By: </strong>
                                    {vendorPaymentDetail?.created_by?.name}
                                </span>
                            </div>
                        </div>

                        <h5 className="text-lg font-semibold dark:text-white-light pt-10">Item Details</h5>
                        <div className="table-responsive mt-3">
                            <table>
                                <thead>
                                <tr>
                                    <th>Bill Code</th>
                                    <th>Ref #</th>
                                    <th>Bill Date</th>
                                    <th>Due Date/Terms</th>
                                    {/*<th>Total Amount</th>*/}
                                    <th>Due Amount</th>
                                    <th>Paid Amount</th>
                                </tr>
                                </thead>
                                <tbody>
                                {vendorPaymentDetail?.vendor_bill_payment_details?.length > 0
                                    ? vendorPaymentDetail?.vendor_bill_payment_details?.map((item: any, index: number) => {
                                        return (
                                            <tr key={index}>
                                                <td>{item.vendor_bill?.bill_number}</td>
                                                <td>{item.vendor_bill?.bill_reference}</td>
                                                <td>{item.vendor_bill?.bill_date}</td>
                                                <td>{item.vendor_bill?.due_date ? item.vendor_bill?.due_date : item.vendor_bill?.payment_terms + ' Days'}</td>
                                                {/*<td>{item.bill_amount}</td>*/}
                                                <td>
                                                    {parseFloat(item.due_amount).toLocaleString(undefined, {
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2
                                                    })}
                                                </td>
                                                <td>
                                                    {parseFloat(item.paid_amount).toLocaleString(undefined, {
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2
                                                    })}
                                                </td>
                                            </tr>
                                        );
                                    })
                                    : (
                                        <tr>
                                            <td colSpan={6} className="text-center">No items found</td>
                                        </tr>
                                    )}
                                </tbody>
                                <tfoot>
                                <tr>
                                    <td colSpan={4} className="text-center">Total:</td>
                                    <td className="text-start ps-5">
                                        {vendorPaymentDetail
                                            ?.vendor_bill_payment_details
                                            ?.reduce((a: number, b: any) => a + parseFloat(b.due_amount), 0)
                                            .toLocaleString(undefined, {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2
                                            })
                                        }
                                    </td>
                                    <td className="text-start ps-5">
                                        {vendorPaymentDetail
                                            ?.vendor_bill_payment_details
                                            ?.reduce((a: number, b: any) => a + parseFloat(b.paid_amount), 0)
                                            .toLocaleString(undefined, {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2
                                            })
                                        }
                                    </td>
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
