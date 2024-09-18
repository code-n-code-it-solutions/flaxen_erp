import React, { useEffect, useState } from 'react';
import AppLayout from '@/components/Layouts/AppLayout';
import DetailPageHeader from '@/components/apps/DetailPageHeader';
import { AppBasePath } from '@/utils/enums';
import { useRouter } from 'next/router';
import useSetActiveMenu from '@/hooks/useSetActiveMenu';
import { useAppDispatch, useAppSelector } from '@/store';
import { setPageTitle } from '@/store/slices/themeConfigSlice';
import { setAuthToken } from '@/configs/api.config';
import { showDetails, clearCustomerPaymentState } from '@/store/slices/customerPayment';
import PageWrapper from '@/components/PageWrapper';

const View = () => {
    useSetActiveMenu(AppBasePath.Invoice_Payment);
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { token } = useAppSelector(state => state.user);
    const { customerPaymentDetail, loading } = useAppSelector(state => state.customerPayment);
    const [ids, setIds] = useState<string[]>([]);

    useEffect(() => {
        setAuthToken(token);
        dispatch(setPageTitle('Payment Details'));
        dispatch(clearCustomerPaymentState());
        const paymentId = router.query.id;

        if (paymentId) {
            setIds(Array.isArray(paymentId) ? paymentId : [paymentId]);
            const id = Array.isArray(paymentId) ? paymentId[0] : paymentId;
            dispatch(showDetails(parseInt(id)));
        }
    }, [router.query.id, dispatch]);

    return (
        <div className="flex flex-col gap-3">
            <DetailPageHeader
                appBasePath={AppBasePath.Invoice_Payment}
                title="Customer Payment Detail"
                middleComponent={{
                    show: true,
                    edit: {
                        show: false
                    },
                    print: {
                        show: true,
                        onClick: () => router.push('/apps/sales/payments/print/' + ids.join('/'))
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
                    backLink: '/apps/sales/payments'
                }}
            />
            <PageWrapper
                loading={loading}
                embedLoader={true}
            >
                {customerPaymentDetail && (
                    <div>
                        <div className="mb-4">
                            <h1 className="text-lg font-bold">Customer: {customerPaymentDetail?.customer?.name + ' (' + customerPaymentDetail?.customer?.customer_code + ')'}</h1>
                        </div>
                        <div className="grid grid-col-1 md:grid-cols-3 gap-3">
                            <div className="flex gap-2">
                                <span className="font-bold">Payment Code: </span>
                                <span>{customerPaymentDetail?.payment_code}</span>
                            </div>
                            <div className="flex gap-2">
                                <span className="font-bold">Reference No: </span>
                                <span>{customerPaymentDetail?.reference_no}</span>
                            </div>
                            <div className="flex gap-2">
                                <span className="font-bold">Payment Date: </span>
                                <span>{customerPaymentDetail?.payment_date}</span>
                            </div>
                            <div className="flex gap-2">
                                <span className="font-bold">Payment Method: </span>
                                <span>{customerPaymentDetail?.payment_method?.name}</span>
                            </div>
                            <div className="flex gap-2">
                                <span className="font-bold">Payment Sub Method: </span>
                                <span>{customerPaymentDetail?.payment_sub_method}</span>
                            </div>
                            {customerPaymentDetail?.payment_sub_method !== 'cheque' && (
                                <div className="flex gap-2">
                                    <span className="font-bold">Transaction No: </span>
                                    <span>{customerPaymentDetail?.transaction_number}</span>
                                </div>
                            )}
                        </div>
                        {customerPaymentDetail?.payment_sub_method === 'cheque' && (
                            <div className="table-responsive my-3">
                                <table>
                                    <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Cheque #</th>
                                        <th>Bank</th>
                                        <th>Amount</th>
                                        <th>Cheque Date</th>
                                        <th>Is PDC</th>
                                        <th>PDC Date</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {customerPaymentDetail?.cheques?.map((cheque: any, index: number) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{cheque.cheque_number}</td>
                                            <td>{cheque.bank?.name}</td>
                                            <td>{cheque.cheque_amount}</td>
                                            <td>{cheque.cheque_date}</td>
                                            <td>{cheque.is_pdc ? 'Yes' : 'No'}</td>
                                            <td>{cheque.is_pdc ? cheque.pdc_date : 'N/A'}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                        <div className="table-responsive my-3">
                            <table>
                                <thead>
                                <tr>
                                    <th>Invoice Code</th>
                                    <th>Ref #</th>
                                    <th>Invoice Date</th>
                                    <th>Due Date/Terms</th>
                                    <th>Total Amount</th>
                                    <th>Received Amount</th>
                                </tr>
                                </thead>
                                <tbody>
                                {customerPaymentDetail?.customer_payment_details?.map((invoice: any, index: number) => (
                                    <tr key={index}>
                                        <td>{invoice.sale_invoice.sale_invoice_code}</td>
                                        <td>{invoice.sale_invoice.po_number}</td>
                                        <td>{invoice.sale_invoice.invoice_date}</td>
                                        <td>{invoice.sale_invoice.due_date}</td>
                                        <td>
                                            {invoice.sale_invoice.total_amount}
                                        </td>
                                        <td>{invoice.received_amount}</td>
                                    </tr>
                                ))}
                                </tbody>
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
