import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { useRouter } from 'next/router';
import { setAuthToken } from '@/configs/api.config';
import { clearRawProductState, getProductsForPrint } from '@/store/slices/rawProductSlice';
import { Document, PDFViewer, Page, View } from '@react-pdf/renderer';
import PrintLabelContent from '@/pages/apps/inventory/products/print-label/PrintLabelContent';
import BlankLayout from '@/components/Layouts/BlankLayout';

const Print = () => {
    const dispatch = useAppDispatch();
    const { rawProductsForPrint: contents, loading } = useAppSelector((state) => state.rawProduct);
    const { token } = useAppSelector((state) => state.user);
    const router = useRouter();

    useEffect(() => {
        setAuthToken(token);
        dispatch(clearRawProductState());
        if (router.query.id) {
            dispatch(getProductsForPrint({ ids: router.query.id, type: 'label' }));
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
                    title="Labels"
                    author="Flaxen Paints Industry LLC"
                    subject="Labels"
                    keywords="pdf, flaxen, flaxen paints, report, preview, labels, flaxen paints industry llc"
                >
                    <Page
                        size="A4"
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            padding: 20
                        }}
                    >
                        <View
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginTop: 10,
                                marginBottom: 10,
                                flexWrap: 'wrap',
                                gap: 10
                            }}
                        >
                            {contents && contents.map((content: any, index: number) => (
                                <PrintLabelContent key={index} content={content} />
                            ))}
                        </View>
                    </Page>
                </Document>
            </PDFViewer>

        )
    );
};

Print.getLayout = (page: any) => (<BlankLayout>{page}</BlankLayout>);

export default Print;
