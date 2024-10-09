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
import { clearCreditNoteState, getCreditNoteDetail } from '@/store/slices/creditNoteSlice';
import { getGeneralPaymentVoucherDetail } from '@/store/slices/generalPaymentVoucherSlice';

const View = () => {
    useSetActiveMenu(AppBasePath.General_Payment_Voucher);
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { token } = useAppSelector(state => state.user);
    const { generalPaymentVoucherDetails, loading } = useAppSelector(state => state.generalPaymentVoucher);
    const [ids, setIds] = useState<string[]>([]);

    useEffect(() => {
        setAuthToken(token);
        dispatch(setPageTitle('General Payment Voucher Details'));
        dispatch(clearCreditNoteState());

        const creditNoteIds = router.query.id;

        if (creditNoteIds) {
            setIds(Array.isArray(creditNoteIds) ? creditNoteIds : [creditNoteIds]);
            const id = Array.isArray(creditNoteIds) ? creditNoteIds[0] : creditNoteIds;
            dispatch(getGeneralPaymentVoucherDetail(parseInt(id)));
        }
    }, [router.query.id, dispatch]);

    return (
        <div className="flex flex-col gap-3">
            <DetailPageHeader
                appBasePath={AppBasePath.Credit_Notes}
                title="General Payment Voucher Details"
                middleComponent={{
                    show: true,
                    edit: {
                        show: false
                    },
                    print: {
                        show: true,
                        onClick: () => router.push('/apps/accounting/general-voucher/payment-voucher/print/' + ids.join('/'))
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
                    backLink: '/apps/accounting/general-voucher/payment-voucher'
                }}
            />
            <PageWrapper
                loading={loading}
                embedLoader={true}
            >
                {generalPaymentVoucherDetails && (
                    <div>
                        <div className="flex justify-between items-center flex-col md:flex-row w-full gap-3">
                            <div className="flex flex-col gap-2 justify-start items-start">
                                <span>
                                    <strong>GPV Code: </strong>
                                    {generalPaymentVoucherDetails?.payment_voucher_code}
                                </span>
                                <span>
                                    <strong>GPV Date: </strong>
                                    {generalPaymentVoucherDetails?.payment_date}
                                </span>
                                <span>
                                    <strong>Reference #: </strong>
                                    {generalPaymentVoucherDetails?.reference_no}
                                </span>
                                <span>
                                    <strong>Paying Account: </strong>
                                    {generalPaymentVoucherDetails?.paying_account?.code + ' - ' + generalPaymentVoucherDetails?.paying_account?.name}
                                </span>
                                <span>
                                    <strong>Payment Method: </strong>
                                    {generalPaymentVoucherDetails?.payment_method?.name}
                                </span>
                                {generalPaymentVoucherDetails.payment_method?.name === 'Bank' && (generalPaymentVoucherDetails.payment_sub_method == 'credit-card' || generalPaymentVoucherDetails.payment_sub_method === 'online-transfer')
                                    ? (
                                        <>
                                            <span>
                                                <strong>Payment Sub method: </strong>
                                                {generalPaymentVoucherDetails?.payment_sub_method}
                                            </span>
                                            <span>
                                                <strong>Transaction Number: </strong>
                                                {generalPaymentVoucherDetails?.transaction_number}
                                            </span>
                                        </>
                                    ) : generalPaymentVoucherDetails.payment_method?.name === 'Bank' && generalPaymentVoucherDetails.payment_sub_method == 'cheque'
                                        ? (
                                            <span>
                                                <strong>Payment Sub method: </strong>
                                                {generalPaymentVoucherDetails?.payment_sub_method}
                                            </span>
                                        ) : <></>}
                            </div>
                            <div className="flex flex-col gap-2 justify-start items-start">
                                <span>
                                    <strong>Payment To: </strong>
                                    {generalPaymentVoucherDetails?.subject_category}
                                </span>
                                <span>
                                    <strong>Paid To: </strong>
                                    {generalPaymentVoucherDetails?.subject?.name}
                                </span>
                                <span>
                                    <strong>Created At: </strong>
                                    {new Date(generalPaymentVoucherDetails?.created_at).toLocaleDateString()}
                                </span>
                                <span>
                                    <strong>Created By: </strong>
                                    {generalPaymentVoucherDetails?.created_by?.name}
                                </span>
                            </div>
                        </div>
                        <div className="my-3">
                            <h3 className="font-bold text-lg">
                                Narration:
                            </h3>
                            <p>{generalPaymentVoucherDetails?.description}</p>
                        </div>
                        {generalPaymentVoucherDetails.payment_method?.name === 'Bank' && generalPaymentVoucherDetails.payment_sub_method == 'cheque' && (
                            <>
                                <h5 className="text-lg font-semibold dark:text-white-light pt-5">Cheque Details</h5>
                                <div className="table-responsive mt-3">
                                    <table>
                                        <thead>
                                        <tr>
                                            <th>Bank</th>
                                            <th>Name on Cheque</th>
                                            <th>Cheque Number</th>
                                            <th>Cheque Date</th>
                                            <th>Cheque Amount</th>
                                            <th>Is PDC</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {generalPaymentVoucherDetails.cheques.length > 0
                                            ? (generalPaymentVoucherDetails.cheques.map((item: any, index: number) => (
                                                    <tr key={index}>
                                                        <td>{item.bank?.name}</td>
                                                        <td>{item.cheque_name}</td>
                                                        <td>{item.cheque_number}</td>
                                                        <td>{item.cheque_date}</td>
                                                        <td>{item.cheque_amount}</td>
                                                        <td>{item.is_pdc ? 'Yes' : 'No'}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={5} className="text-center">No cheque found</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        )}

                        <h5 className="text-lg font-semibold dark:text-white-light pt-5">Item Details</h5>
                        <div className="table-responsive mt-3">
                            <table>
                                <thead>
                                <tr>
                                    <th>Expanse Account</th>
                                    <th>Payment For</th>
                                    <th>Quantity</th>
                                    <th>Unit Cost</th>
                                    <th>Before Tax</th>
                                    <th>Discount</th>
                                    <th>Sub Total</th>
                                    <th>Tax@5%</th>
                                    <th className="text-center">Grand Total</th>
                                </tr>
                                </thead>
                                <tbody>
                                {generalPaymentVoucherDetails.payment_items.length > 0
                                    ? (generalPaymentVoucherDetails.payment_items.map((item: any, index: number) => (
                                            <tr key={index}>
                                                <td>{item.expanse_account?.code + ' - ' + item.expanse_account?.name}</td>
                                                <td>{item.payment_for}</td>
                                                <td>{item.quantity}</td>
                                                <td>{item.amount}</td>
                                                <td>
                                                    {(item.quantity * item.amount).toLocaleString(undefined, {
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2
                                                    })}
                                                </td>
                                                <td>{item.discount ? item.discount : 'N/A'}</td>
                                                <td>
                                                    {((item.quantity * item.amount) - item.discount).toLocaleString(undefined, {
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2
                                                    })}
                                                </td>
                                                <td>
                                                    {item.has_tax
                                                        ? (
                                                            <span>{item.tax_amount}</span>
                                                        ) : (
                                                            <span>N/A</span>
                                                        )}
                                                </td>
                                                <td className="text-center">
                                                    {item.grand_total.toLocaleString(undefined, {
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2
                                                    })}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={9} className="text-center">No items found</td>
                                        </tr>
                                    )}
                                </tbody>
                                <tfoot>
                                <tr>
                                    <td colSpan={2} className="text-center font-bold">Total</td>
                                    <td className="ps-4 font-bold">
                                        {generalPaymentVoucherDetails.payment_items
                                            .reduce((acc: number, item: any) => acc + item.quantity, 0)
                                            .toLocaleString(undefined, {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2
                                            })}
                                    </td>
                                    <td className="ps-4 font-bold"></td>
                                    <td className="ps-4 font-bold">
                                        {generalPaymentVoucherDetails.payment_items
                                            .reduce((acc: number, item: any) => acc + (item.quantity * item.amount), 0)
                                            .toLocaleString(undefined, {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2
                                            })}
                                    </td>
                                    <td className="ps-4 font-bold">
                                        {generalPaymentVoucherDetails.payment_items
                                            .reduce((acc: number, item: any) => acc + item.discount, 0)
                                            .toLocaleString(undefined, {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2
                                            })}
                                    </td>
                                    <td className="ps-4 font-bold">
                                        {generalPaymentVoucherDetails.payment_items
                                            .reduce((acc: number, item: any) => acc + ((item.quantity * item.amount) - item.discount), 0)
                                            .toLocaleString(undefined, {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2
                                            })}
                                    </td>
                                    <td className="ps-4 font-bold"></td>
                                    <td className="text-center font-bold">
                                        {generalPaymentVoucherDetails.payment_items
                                            .reduce((acc: number, item: any) => acc + item.grand_total, 0)
                                            .toLocaleString(undefined, {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2
                                            })}
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

// View.getLayout = (page: any) => <AppLayout>{page}</AppLayout>;
export default View;
