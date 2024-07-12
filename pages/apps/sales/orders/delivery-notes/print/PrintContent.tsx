import React from 'react';
import { Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import Header from '@/components/Report/Header';

const PrintContent = ({ content }: any) => {
    return (
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
                            {content?.salesman?.name}
                        </Text>
                        <Text style={styles.text}>
                            <Text style={styles.bold}>Customer: </Text>
                            {content?.customer?.name}
                        </Text>
                        <Text style={styles.text}>
                            <Text style={styles.bold}>Contact Person: </Text>
                            {content?.contact_person?.name}
                        </Text>
                    </View>
                </View>
                <Text style={styles.sectionTitle}>Item Details</Text>
                <View style={styles.table}>
                    <View style={styles.tableHeader}>
                        <Text style={[styles.tableHeaderCell, { width: '5%' }]}>#</Text>
                        <Text style={[styles.tableHeaderCell, { width: '20%' }]}>Product</Text>
                        {/*{!content?.skip_quotation &&*/}
                        {/*    <Text style={[styles.tableHeaderCell, { width: '15%' }]}>Quotation</Text>*/}
                        {/*}*/}
                        <Text style={[styles.tableHeaderCell, { width: '20%' }]}>Batch #</Text>
                        <Text style={[styles.tableHeaderCell, { width: '20%' }]}>Filling Product</Text>
                        <Text style={[styles.tableHeaderCell, { width: '20%' }]}>Delivered Quantity</Text>
                    </View>
                    {content?.delivery_note_items?.map((item: any, index: number) => (
                        <View key={index} style={styles.tableRow}>
                            <Text style={[styles.tableCell, { width: '5%' }]}>{index + 1}</Text>
                            <Text
                                style={[styles.tableCell, { width: '20%' }]}>{item.product_assembly.formula_name}</Text>
                            {/*{!content?.skip_quotation && <Text*/}
                            {/*    style={[styles.tableCell, { width: '15%' }]}>{item.quotation.quotation_code}</Text>}*/}
                            <Text style={[styles.tableCell, { width: '20%' }]}>
                                {item.batch_number}
                                {/*{item.available_quantity ? (*/}
                                {/*    <View style={{ display: 'flex', flexDirection: 'column' }}>*/}
                                {/*        <Text>{item.batch_number}</Text>*/}
                                {/*        <Text> </Text>*/}
                                {/*        <Text>{item.filling.filling_code}</Text>*/}
                                {/*    </View>*/}
                                {/*) : (*/}
                                {/*    <Text style={styles.notAvailable}>Not Available</Text>*/}
                                {/*)}*/}
                            </Text>
                            <Text style={[styles.tableCell, { width: '20%' }]}>{item.product?.title}</Text>
                            <Text style={[styles.tableCell, { width: '20%' }]}>{item.delivered_quantity}</Text>
                        </View>
                    ))}
                </View>
            </View>
            <View style={styles.footer}>
                <View style={styles.footerContainer}>
                    <Text style={styles.footerText}>
                        <Text style={styles.bold}>Created By: </Text>
                        {content?.created_by?.name}
                    </Text>
                    <Text style={styles.footerText} render={({ pageNumber, totalPages }) => (
                        `${pageNumber} / ${totalPages}`
                    )} fixed />
                    <Text style={styles.footerText}>
                        <Text style={styles.bold}>Created At: </Text>
                        {new Date(content?.created_at).toLocaleDateString() + '  ' + new Date(content?.created_at).toLocaleTimeString()}
                    </Text>
                </View>
            </View>

        </Page>
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
    },
    footer: {
        position: 'absolute',
        bottom: 15,
        left: 0,
        right: 0
    },
    footerContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10
    },
    footerText: {
        // textAlign: 'center',
        color: 'gray',
        fontSize: 8
    }
});

export default PrintContent;
