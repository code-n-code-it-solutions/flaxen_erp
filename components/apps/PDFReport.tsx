import React from 'react';
import { Document, Page, PDFViewer, Text, View } from '@react-pdf/renderer';

const PdfReport = () => {
    return (
        <PDFViewer style={{ width: '100%', height: '100vh' }}>
            <Document
                title="Sample PDF"
                author="John Doe"
                subject="Sample PDF"
                keywords="pdf"
            >
                <Page
                    size="A4"
                    style={{
                        flexDirection: 'row',
                        backgroundColor: '#E4E4E4',
                    }}
                >
                    <View>
                        <Text>Hello</Text>
                    </View>
                </Page>
            </Document>
        </PDFViewer>
    );
};

export default PdfReport;
