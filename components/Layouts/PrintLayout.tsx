import React, { useEffect, useState } from 'react';
import BlankLayout from '@/components/Layouts/BlankLayout';
import Footer from '@/components/Report/Footer';
import { useRouter } from 'next/router';
import Header from '@/components/Report/Header';
import { Document, Page, PDFViewer, Text } from '@react-pdf/renderer';
import AppLayout from '@/components/Layouts/AppLayout';

const PrintLayout = ({ children }: { children: React.ReactNode }) => {
    const [isMounted, setIsMounted] = useState<boolean>(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    return (
        isMounted ? (
            <div>{children}</div>
            // <PDFViewer
            //     style={{
            //         width: '100%',
            //         height: '100vh'
            //     }}
            //     showToolbar={true}
            // >
            //     <Document
            //         title="Report Preview"
            //         author="Flaxen Paints Industry LLC"
            //         subject="Report Preview"
            //         keywords="pdf, flaxen, flaxen paints, report, preview, flaxen paints industry llc"
            //     >
            //         {children}
            //     </Document>
            // </PDFViewer>
        ) : null
    );
};

PrintLayout.getLayout = (page: any) => <BlankLayout>{page}</BlankLayout>;
export default PrintLayout;
