import React from 'react';
import { Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import Header from '@/components/Report/Header';
import Footer from '@/components/Report/Footer';

const QuotationDetails = ({ content }: any) => {

    const calculateTotal = (item: any) => {
        let totalCost = parseFloat(item.retail_price) * parseFloat(item.quantity);
        let taxAmount = (totalCost * parseFloat(item.tax_rate)) / 100;
        let discountAmount = item.discount_type === 'percentage' ? (totalCost * Number(item.discount_amount_rate)) / 100 : Number(item.discount_amount_rate);
        return totalCost + taxAmount - discountAmount;
    };

    return (
        <Page size="A4" style={styles.page}>
            <Header />
            <View style={styles.container}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Quotation Details</Text>
                </View>
                <View style={styles.infoContainer}>
                    <View style={styles.infoColumn}>
                        <Text style={styles.text}><Text style={styles.bold}>Quotation Code: </Text>{content?.quotation_code}</Text>
                        <Text style={styles.text}><Text style={styles.bold}>Receipt Delivery (Days): </Text>{content?.receipt_delivery_due_days}</Text>
                        <Text style={styles.text}><Text style={styles.bold}>Delivery: </Text>{content?.delivery_due_in_days + ' - ' + content?.delivery_due_date}</Text>
                    </View>
                    <View style={styles.infoColumn}>
                        <Text style={styles.text}><Text style={styles.bold}>Salesman: </Text>{content?.salesman?.name}</Text>
                        <Text style={styles.text}><Text style={styles.bold}>Customer: </Text>{content?.customer?.name}</Text>
                        <Text style={styles.text}><Text style={styles.bold}>Contact Person: </Text>{content?.contact_person?.name}</Text>
                    </View>
                </View>
                <Text style={styles.sectionTitle}>Item Details</Text>
                <View style={styles.table}>
                    <View style={styles.tableHeader}>
                        <Text style={[styles.tableHeaderCell, { width: '5%' }]}>#</Text>
                        <Text style={[styles.tableHeaderCell, { width: '15%' }]}>Product</Text>
                        <Text style={[styles.tableHeaderCell, { width: '20%' }]}>Batch #</Text>
                        {/*<Text style={[styles.tableHeaderCell, { width: '10%' }]}>Filling</Text>*/}
                        {/*<Text style={[styles.tableHeaderCell, { width: '7%' }]}>Available</Text>*/}
                        <Text style={[styles.tableHeaderCell, { width: '10%' }]}>Price</Text>
                        <Text style={[styles.tableHeaderCell, { width: '7%' }]}>Qty</Text>
                        <Text style={[styles.tableHeaderCell, { width: '10%' }]}>Tax</Text>
                        <Text style={[styles.tableHeaderCell, { width: '10%' }]}>Discount</Text>
                        <Text style={[styles.tableHeaderCell, { width: '10%' }]}>Total Cost</Text>
                    </View>
                    {content?.quotation_items.map((item:any, index:number) => (
                        <View key={index} style={styles.tableRow}>
                            <Text style={[styles.tableCell, { width: '5%' }]}>{index + 1}</Text>
                            <Text style={[styles.tableCell, { width: '15%' }]}>{item.product_assembly.formula_name}</Text>
                            <View style={[styles.tableCell, { width: '20%', display: 'flex', flexDirection: 'column' }]}>
                                <Text>Batch: {item.batch_number}</Text>
                                <Text>Filling: {item.filling.filling_code}</Text>
                            </View>
                            {/*<Text style={[styles.tableCell, { width: '10%' }]}>{item.product?.item_code}</Text>*/}
                            {/*<Text style={[styles.tableCell, { width: '7%' }]}>{item.available_quantity}</Text>*/}
                            <Text style={[styles.tableCell, { width: '10%' }]}>{item.retail_price.toFixed(2)}</Text>
                            <Text style={[styles.tableCell, { width: '7%' }]}>{item.quantity.toFixed(2)}</Text>
                            <Text style={[styles.tableCell, { width: '10%' }]}>{item.tax_amount.toFixed(2)} ({item.tax_rate}%)</Text>
                            <Text style={[styles.tableCell, { width: '10%' }]}>{Number(item.discount_amount_rate).toFixed(2)}{item.discount_type === 'percentage' ? '%' : '/-'}</Text>
                            <Text style={[styles.tableCell, { width: '10%' }]}>{calculateTotal(item).toFixed(2)}</Text>
                        </View>
                    ))}
                    <View style={styles.tableFooter}>
                        <Text style={[styles.tableFooterCell, { width: '82%' }]}>Total</Text>
                        <Text style={[styles.tableFooterCell, { width: '18%' }]}>
                            {content?.quotation_items
                                ?.reduce((total:number, item:any) => total + calculateTotal(item), 0)
                                .toFixed(2)}
                        </Text>
                    </View>
                </View>
            </View>
            <Footer content={content} />
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
        marginVertical: 10,
    },
    title: {
        fontSize: 12,
        fontWeight: 'bold',
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
        textAlign: 'left',
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
        textAlign: 'left',
    },
    tableFooter: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderTopColor: '#000',
        padding: 4
    },
    tableFooterCell: {
        fontSize: 9,
        fontWeight: 'bold',
    }
});

export default QuotationDetails;
