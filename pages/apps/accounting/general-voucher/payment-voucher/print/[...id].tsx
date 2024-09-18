import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '@/store';
import { setAuthToken } from '@/configs/api.config';
import PrintContent from './PrintContent';
import BlankLayout from '@/components/Layouts/BlankLayout';
import { PDFViewer, Document } from '@react-pdf/renderer';
import {
    clearGeneralPaymentVoucherState,
    getGeneralPaymentVoucherForPrint
} from '@/store/slices/generalPaymentVoucherSlice';

const Print = () => {
    const dispatch = useAppDispatch();
    const { generalPaymentVouchersForPrint: contents, loading } = useAppSelector((state) => state.generalPaymentVoucher);
    const { token } = useAppSelector((state) => state.user);
    const router = useRouter();

    useEffect(() => {
        setAuthToken(token);
        dispatch(clearGeneralPaymentVoucherState());
        if (router.query.id) {
            dispatch(getGeneralPaymentVoucherForPrint({ ids: router.query.id, type: 'detail' }));
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
                    title="General Payment Voucher"
                    author="Flaxen Paints Industry LLC"
                    subject="Report Preview"
                    keywords="pdf, flaxen, flaxen paints, report, preview, flaxen paints industry llc"
                >
                    {contents && contents.map((content: any, index: number) => {
                        return (
                            <PrintContent
                                key={index}
                                content={content}
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
