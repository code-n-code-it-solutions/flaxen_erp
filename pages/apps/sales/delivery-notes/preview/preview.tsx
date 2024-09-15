import React from 'react';
import { Document, Page, PDFViewer, StyleSheet, Text, View } from '@react-pdf/renderer';
import PrintContent from '@/pages/apps/sales/delivery-notes/print/PrintContent';
import Header from '@/components/Report/Header';

const Preview = ({content, items}:any) => {

    // Calculate the total delivered quantity
    const totalDeliveredQuantity = content?.delivery_note_items?.reduce(
        (total: number, item: any) => total + item.delivered_quantity,
        0
    );

    return (
        <PDFViewer
            style={{
                width: '100%',
                height: '100vh'
            }}
            showToolbar={true}
        >
            <Document
                title="Delivery Note Preview"
                author="Flaxen Paints Industry LLC"
                subject="Delivery Note Preview"
                keywords="pdf, flaxen, flaxen paints, report, preview, flaxen paints industry llc"
            >
                <Page size="A4" style={styles.page} wrap>
                    <Header />
                    <View style={styles.container}>
                        <View style={styles.titleContainer}>
                            <Text style={styles.title}>Delivery Note Details</Text>
                        </View>
                        <View style={styles.infoContainer}>
                            <View style={styles.infoColumn}>
                                <Text style={styles.text}>
                                    <Text style={styles.bold}>Delivery Note Code: </Text>
                                    {content?.delivery_note_code}
                                </Text>
                                <Text style={styles.text}>
                                    <Text style={styles.bold}>Receipt Delivery (Days): </Text>
                                    {content?.receipt_delivery_due_days}
                                </Text>
                                <Text style={styles.text}>
                                    <Text style={styles.bold}>Delivery: </Text>
                                    {content?.delivery_due_in_days + ' - ' + content?.delivery_due_date}
                                </Text>
                            </View>
                            <View style={styles.infoColumn}>
                                <Text style={styles.text}>
                                    <Text style={styles.bold}>Salesman: </Text>
                                    {content?.salesman}
                                </Text>
                                <Text style={styles.text}>
                                    <Text style={styles.bold}>Customer: </Text>
                                    {content?.customer}
                                </Text>
                                <Text style={styles.text}>
                                    <Text style={styles.bold}>Contact Person: </Text>
                                    {content?.contact_person}
                                </Text>
                            </View>
                        </View>
                        <Text style={styles.sectionTitle}>Item Details</Text>
                        <View style={styles.table}>
                            <View style={styles.tableHeader}>
                                <Text style={[styles.tableHeaderCell, { width: '5%' }]}>#</Text>
                                <Text style={[styles.tableHeaderCell, { width: '20%' }]}>Product</Text>
                                {content?.delivery_note_for === 1 && (
                                    <>
                                        <Text style={[styles.tableHeaderCell, { width: '20%' }]}>Filling Product</Text>
                                        <Text style={[styles.tableHeaderCell, { width: '20%' }]}>Capacity</Text>
                                        <Text style={[styles.tableHeaderCell, { width: '20%' }]}>Batch #</Text>

                                    </>
                                )}
                                <Text style={[styles.tableHeaderCell, { width: '20%' }]}>Delivered Quantity</Text>
                            </View>
                            {items?.map((item: any, index: number) => (
                                <View key={index} style={styles.tableRow}>
                                    <Text style={[styles.tableCell, { width: '5%' }]}>{index + 1}</Text>
                                    {content?.delivery_note_for === 1
                                        ? (
                                            <>
                                                <Text style={[styles.tableCell, { width: '20%' }]}>
                                                    {item.product_assembly.formula_name}
                                                </Text>
                                                <Text style={[styles.tableCell, { width: '20%' }]}>{item.product?.title}</Text>
                                                <Text style={[styles.tableCell, { width: '20%' }]}>{item.capacity}</Text>
                                                <Text style={[styles.tableCell, { width: '20%' }]}>{item.batch_number}</Text>
                                            </>
                                        ) : (
                                            <Text style={[styles.tableCell, { width: '20%' }]}>{item.product?.title}</Text>
                                        )}
                                    <Text style={[styles.tableCell, { width: '20%' }]}>{item.delivered_quantity}</Text>
                                </View>
                            ))}
                            {/* Total Delivered Quantity Row */}
                            <View style={styles.tableRow}>
                                <Text style={[styles.tableCell, { width: '85%', textAlign: 'center', fontWeight: 'bold' }]}>
                                    Total
                                </Text>
                                <Text style={[styles.tableCell, { width: '20%', fontWeight: 'bold' }]}>
                                    {totalDeliveredQuantity}
                                </Text>
                            </View>
                        </View>
                    </View>
                </Page>
            </Document>
        </PDFViewer>
    );
};

const styles = StyleSheet.create({
    page: {
        display: 'flex',
        flexDirection: 'column',
        padding: 20
    },
    container: {
        display: 'flex',
        flexDirection: 'column'
    },
    titleContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginVertical: 10
    },
    title: {
        fontSize: 12,
        fontWeight: 'bold'
    },
    infoContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 10
    },
    infoColumn: {
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        width: '45%'
    },
    text: {
        fontSize: 9
    },
    bold: {
        fontWeight: 'bold',
        fontSize: 9
    },
    sectionTitle: {
        fontSize: 10,
        fontWeight: 'bold',
        marginVertical: 10
    },
    table: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        borderWidth: 1,
        borderColor: '#000'
    },
    tableHeader: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: '#000',
        backgroundColor: '#f0f0f0',
        padding: 4
    },
    tableHeaderCell: {
        fontSize: 9,
        textAlign: 'left'
    },
    tableRow: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: '#000',
        padding: 4
    },
    tableCell: {
        fontSize: 9,
        textAlign: 'left'
    },
    notAvailable: {
        color: 'red'
    }
});

export default Preview;
