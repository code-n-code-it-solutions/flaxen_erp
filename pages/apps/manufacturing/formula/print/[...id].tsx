import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '@/store';
import { setAuthToken } from '@/configs/api.config';
import PrintContent from './PrintContent';
import BlankLayout from '@/components/Layouts/BlankLayout';
import { PDFViewer, Document } from '@react-pdf/renderer';
import { clearProductAssemblyState, getProductAssembliesForPrint } from '@/store/slices/productAssemblySlice';

const Print = () => {
    const dispatch = useAppDispatch();
    const { loading, productAssembliesForPrint:contents } = useAppSelector(state => state.productAssembly);
    const { token } = useAppSelector((state) => state.user);
    const router = useRouter();

    useEffect(() => {
        setAuthToken(token);
        dispatch(clearProductAssemblyState());
        if(router.query.id) {
            dispatch(getProductAssembliesForPrint({ ids: router.query.id, type: 'detail'}));
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
                    {contents && contents.map((content:any, index:number) => (
                        <PrintContent key={index} content={content}/>
                    ))}

                </Document>
            </PDFViewer>

        )
    );
};

Print.getLayout = (page: any) => (<BlankLayout>{page}</BlankLayout>);

export default Print;
