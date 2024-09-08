import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '@/store';
import { setAuthToken } from '@/configs/api.config';
import PrintContent from './PrintContent';
import BlankLayout from '@/components/Layouts/BlankLayout';
import { PDFViewer, Document } from '@react-pdf/renderer';
import { clearVendorBillListState, getVendorBillForPrint } from '@/store/slices/vendorBillSlice';

const Print = () => {
    const dispatch = useAppDispatch();
    const { vendorBillsForPrint: contents, loading } = useAppSelector((state) => state.vendorBill);
    const { token } = useAppSelector((state) => state.user);
    const router = useRouter();

    useEffect(() => {
        setAuthToken(token);
        dispatch(clearVendorBillListState());
        if (router.query.id) {
            dispatch(getVendorBillForPrint({ ids: router.query.id, type: 'detail' }));
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
                    title="Vendor Bill Preview"
                    author="Flaxen Paints Industry LLC"
                    subject="Report Preview"
                    keywords="pdf, flaxen, flaxen paints, report, preview, flaxen paints industry llc"
                >
                {contents && contents.map((content: any, index: number) => {
                    return (
                        <PrintContent
                            key={index}
                            content={content}
                            items={content.good_receive_note_vendor_bill?.map((item: any) => item.good_receive_note.raw_products).flat()}
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
