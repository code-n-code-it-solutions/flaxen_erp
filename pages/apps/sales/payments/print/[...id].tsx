import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '@/store';
import { setAuthToken } from '@/configs/api.config';
import PrintContent from './PrintContent';
import BlankLayout from '@/components/Layouts/BlankLayout';
import { PDFViewer, Document } from '@react-pdf/renderer';
import { clearCustomerPaymentState, getCustomerPaymentsForPrint } from '@/store/slices/customerPayment';
import numberToWords from 'number-to-words';

const Print = () => {
    const dispatch = useAppDispatch();
    const { customerPaymentsForPrint: contents, loading } = useAppSelector((state) => state.customerPayment);
    const { token } = useAppSelector((state) => state.user);
    const router = useRouter();
    const [modifiedContents, setModifiedContents] = useState<any[]>([]);

    useEffect(() => {
        setAuthToken(token);
        dispatch(clearCustomerPaymentState());
        if (router.query.id) {
            dispatch(getCustomerPaymentsForPrint({ ids: router.query.id, type: 'detail' }));
        }
    }, [router.query.id]);

    useEffect(() => {
        if (contents) {
            console.log(contents);
            setModifiedContents(contents.map((content: any) => {
                return {
                    voucherNo: content.payment_code,
                    date: content.created_at,
                    receivedFrom: content.customer.name,
                    amount: content.amount,
                    amountInWords: numberToWords.toWords(content.customer_payment_details.map((detail: any) => detail.received_amount).reduce((a: any, b: any) => parseFloat(a) + parseFloat(b), 0) - Number(content.discount_amount)),
                    paymentMethod: content.payment_method.name,
                    refNo: content.reference_no,
                    bankOption: content.bank_option,
                    bank: content.bank_account?.bank?.name,
                    transferFrom: content.bankAccount ? content.bankAccount?.account_name + ' (' + content.bankAccount?.account_number + ')' : content.cheque_card_no,
                    items: content.customer_payment_details.map((detail: any) => ({
                        date: detail.sale_invoice.invoice_date,
                        invoiceNo: detail.sale_invoice.sale_invoice_code,
                        invoiceAmount: detail.sale_invoice.delivery_note_sale_invoices.map((invoice: any) => invoice.delivery_note.delivery_note_items.flatMap((item: any) => item.total_cost)).reduce((a: any, b: any) => parseFloat(a) + parseFloat(b), 0).toFixed(2),
                        outstanding: detail.due_amount,
                        paid: detail.received_amount,
                        balance: parseFloat(detail.due_amount) - parseFloat(detail.received_amount)
                    })),
                    total: content.customer_payment_details.map((detail: any) => detail.received_amount).reduce((a: any, b: any) => parseFloat(a) + parseFloat(b), 0).toFixed(2),
                    discount: Number(content.discount_amount),
                    netTotal: content.customer_payment_details.map((detail: any) => detail.received_amount).reduce((a: any, b: any) => parseFloat(a) + parseFloat(b), 0) - Number(content.discount_amount),
                    receivedBy: content.created_by.name,
                    preparedBy: content.created_by.name,
                    checkedBy: '',
                    approvedBy: '',
                    created_by: content.created_by,
                    created_at: content.created_at,
                };
            }));
        }
    }, [contents]);

    return (
        !loading && contents && (
            <PDFViewer
                style={{
                    width: '100%',
                    height: '100vh'
                }}
                showToolbar={true}
            >
                <Document
                    title="Report Preview"
                    author="Flaxen Paints Industry LLC"
                    subject="Report Preview"
                    keywords="pdf, flaxen, flaxen paints, report, preview, flaxen paints industry llc"
                >
                    {modifiedContents && modifiedContents.map((content: any, index: number) => (
                        <PrintContent
                            key={index}
                            content={content} />
                    ))}
                </Document>
            </PDFViewer>

        )
    );
};

Print.getLayout = (page: any) => (<BlankLayout>{page}</BlankLayout>);

export default Print;
