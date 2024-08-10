import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '@/store';
import { setAuthToken } from '@/configs/api.config';
import PrintContent from './PrintContent';
import BlankLayout from '@/components/Layouts/BlankLayout';
import { PDFViewer, Document } from '@react-pdf/renderer';
import { clearSaleInvoiceState, getSaleInvoicesForPrint } from '@/store/slices/saleInvoiceSlice';

const Print = () => {
    const dispatch = useAppDispatch();
    const { saleInvoicesForPrint: contents, loading } = useAppSelector((state) => state.saleInvoice);
    const { token } = useAppSelector((state) => state.user);
    const router = useRouter();

    useEffect(() => {
        setAuthToken(token);
        dispatch(clearSaleInvoiceState());
        if (router.query.id) {
            dispatch(getSaleInvoicesForPrint({ ids: router.query.id, type: 'detail' }));
        }
    }, [router.query.id]);

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
                {contents && contents.map((content: any, index: number) => {
                    return (
                        <PrintContent
                            key={index}
                            content={content}
                            items={content.delivery_note_sale_invoices.map((item: any) => item.delivery_note).flat()}
                        />
                    );
                })}
                </Document>
            </PDFViewer>

        )
    );
};

Print.getLayout = (page: any) => (<BlankLayout>{page}</BlankLayout>);

export default Print;
