import React from 'react';
import { Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import Header from '@/components/Report/Header';

const PrintContent = ({ content, items }: any) => {
    return (
        <Page size="A4" style={styles.page} wrap>
            <Header />
            <View style={styles.container}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Tax Invoice</Text>
                </View>
                <View style={styles.infoContainer}>
                    <View style={styles.infoColumn}>
                        <Text style={styles.text}>
                            <Text style={styles.bold}>Sale Invoice Code: </Text>
                            {content?.sale_invoice_code}
                        </Text>
                        <Text style={styles.text}>
                            <Text style={styles.bold}>Invoice Reference: </Text>
                            {content?.invoice_reference}
                        </Text>
                        <Text style={styles.text}>
                            <Text style={styles.bold}>Invoice Date: </Text>
                            {content?.invoice_date}
                        </Text>
                        {content?.payment_terms && (
                            <Text style={styles.text}>
                                <Text style={styles.bold}>Payment Terms: </Text>
                                {content?.payment_terms} Days
                            </Text>
                        )}
                        {content?.due_date && (
                            <Text style={styles.text}>
                                <Text style={styles.bold}>Due Date: </Text>
                                {content?.due_date}
                            </Text>
                        )}
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
                {items.map((deliveryNoteItem: any, index: number) => (
                    <View style={[styles.table, {marginBottom: 5}]} key={index}>
                        <Text style={{textAlign: 'center', fontSize: 10, paddingVertical: 5}}>{deliveryNoteItem.delivery_note_code}</Text>
                        <View style={styles.tableHeader}>
                            <Text style={[styles.tableHeaderCell, { width: '5%' }]}>#</Text>
                            <Text style={[styles.tableHeaderCell, { width: '15%' }]}>Product</Text>
                            <Text style={[styles.tableHeaderCell, { width: '10%' }]}>Cost</Text>
                            <Text style={[styles.tableHeaderCell, { width: '10%' }]}>Quantity</Text>
                            <Text style={[styles.tableHeaderCell, { width: '10%' }]}>Before Tax</Text>
                            <Text style={[styles.tableHeaderCell, { width: '15%' }]}>Tax</Text>
                            <Text style={[styles.tableHeaderCell, { width: '10%' }]}>Discount</Text>
                            <Text style={[styles.tableHeaderCell, { width: '10%' }]}>Total Cost</Text>
                        </View>
                        {deliveryNoteItem.delivery_note_items.map((deliveryNoteItem: any, index: number) => (
                            <View key={index} style={styles.tableRow}>
                                <Text style={[styles.tableCell, { width: '5%' }]}>
                                    {index + 1}
                                </Text>
                                <View style={[styles.tableCell, { display: 'flex', flexDirection: 'column', width: '15%' }]}>
                                    <Text>{deliveryNoteItem.product_assembly.formula_name}</Text>
                                    <Text>{deliveryNoteItem.product.title + ` - ${deliveryNoteItem.capacity}KG`}</Text>
                                </View>
                                <Text style={[styles.tableCell, { width: '10%' }]}>
                                    {parseFloat(deliveryNoteItem.retail_price).toFixed(2)}
                                </Text>
                                <Text style={[styles.tableCell, { width: '10%' }]}>
                                    {deliveryNoteItem.delivered_quantity}
                                </Text>
                                <Text style={[styles.tableCell, { width: '10%' }]}>
                                    {(parseFloat(deliveryNoteItem.retail_price) * parseFloat(deliveryNoteItem.delivered_quantity)).toFixed(2)}
                                </Text>
                                <View style={[styles.tableCell, { display: 'flex', flexDirection: 'column', width: '15%' }]}>
                                    <Text>Tax: {deliveryNoteItem.tax_category.name+' ('+deliveryNoteItem.tax_rate+'%)'}</Text>
                                    <Text>Amt: {deliveryNoteItem.tax_amount.toFixed(2)}</Text>
                                </View>
                                <Text style={[styles.tableCell, { width: '10%' }]}>
                                    {deliveryNoteItem.discount_amount_rate.toFixed(2)}{deliveryNoteItem.discount_type === 'percentage' ? '%' : '/-'}
                                </Text>
                                <Text style={[styles.tableCell, { width: '10%' }]}>
                                    {parseFloat(deliveryNoteItem.total_cost).toFixed(2)}
                                </Text>
                            </View>
                        ))}
                    </View>
                ))}
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
        fontSize: 14,
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
