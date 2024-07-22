import React from 'react';
import { Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import Header from '@/components/Report/Header';
import Footer from '@/components/Report/Footer';

const QuotationDetails = ({ content }: any) => {

    const calculateTotal = (item: any) => {
        let totalCost = parseFloat(item.retail_price) * parseFloat(item.quantity);
        let taxAmount = (totalCost * parseFloat(item.tax_rate)) / 100;
        let discountAmount = item.discount_type ? item.discount_type === 'percentage' ? (totalCost * Number(item.discount_amount_rate)) / 100 : Number(item.discount_amount_rate) : 0;
        return totalCost + taxAmount - discountAmount;
    };

    return (
        <Page size="A4" style={styles.page}>
            <Header />
            <View style={styles.container}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Quotation</Text>
                </View>
                <View style={styles.infoContainer}>
                    <View style={[styles.infoColumn, { borderWidth: 1, borderColor: 'black', padding: 10 }]}>
                        <Text style={styles.text}>
                            <Text style={styles.bold}>Customer Code: </Text>
                            {content?.customer?.customer_code}
                        </Text>
                        <Text style={[styles.text, { fontSize: 11 }]}>
                            {content?.customer?.name}
                        </Text>
                        <Text style={styles.text}>
                            <Text style={styles.bold}>Phone: </Text>
                            {content?.customer?.phone}
                        </Text>
                        <Text style={styles.text}>
                            <Text style={styles.bold}>Email: </Text>
                            {content?.customer?.email}
                        </Text>
                        <Text style={styles.text}>
                            <Text style={styles.bold}>Contact Person: </Text>
                            {content?.contact_person?.name}
                        </Text>
                        <Text style={styles.text}>
                            {
                                content?.customer?.addresses[0]?.address + ' '
                                + content?.customer?.addresses[0]?.city?.name + ', '
                                + content?.customer?.addresses[0]?.state?.name + ' '
                                + content?.customer?.addresses[0]?.country?.name + ' '
                                + content?.customer?.addresses[0]?.postal_code
                            }
                        </Text>
                        <Text style={styles.text}>
                            <Text style={styles.bold}>TRN: </Text>
                            {content?.customer?.tax_registration}
                        </Text>
                    </View>
                    <View style={[styles.infoColumn, { borderWidth: 1, borderColor: 'black', padding: 10 }]}>
                        <Text style={styles.text}>
                            <Text style={styles.bold}>Quotation #: </Text>
                            {content?.quotation_code}
                        </Text>
                        <Text style={styles.text}>
                            <Text style={styles.bold}>Sales Person: </Text>
                            {content?.salesman?.name}
                        </Text>
                        {/*<Text style={styles.text}>*/}
                        {/*    <Text style={styles.bold}>Receipt Delivery (Days): </Text>*/}
                        {/*    {content?.receipt_delivery_due_days}*/}
                        {/*</Text>*/}
                        <Text style={styles.text}>
                            <Text style={styles.bold}>Terms of Delivery: </Text>
                            {content?.delivery_due_in_days + '(Days) - ' + content?.delivery_due_date}
                        </Text>
                        <Text style={styles.text}>
                            <Text style={styles.bold}>Terms of Payments: </Text>
                            {content?.customer?.payment_terms + ' (Days)'}
                        </Text>
                    </View>
                </View>
                <Text style={styles.sectionTitle}>Item Details</Text>
                <View style={styles.table}>
                    <View style={styles.tableHeader}>
                        <Text style={[styles.tableHeaderCell, { width: '5%' }]}>Sr.No</Text>
                        <Text style={[styles.tableHeaderCell, { width: '25%' }]}>Product</Text>
                        <Text style={[styles.tableHeaderCell, { width: '10%' }]}>Rate</Text>
                        <Text style={[styles.tableHeaderCell, { width: '10%' }]}>Qty</Text>
                        <Text style={[styles.tableHeaderCell, { width: '10%' }]}>Total</Text>
                        <Text style={[styles.tableHeaderCell, { width: '10%' }]}>Discount</Text>
                        <Text style={[styles.tableHeaderCell, { width: '10%' }]}>Sub Total</Text>
                        <Text style={[styles.tableHeaderCell, { width: '10%' }]}>VAT @5%</Text>
                        <Text style={[styles.tableHeaderCell, { width: '10%' }]}>Total Cost</Text>
                    </View>
                    {content?.quotation_items.map((item: any, index: number) => (
                        <View key={index} style={styles.tableRow}>
                            <Text style={[styles.tableCell, { width: '5%' }]}>{index + 1}</Text>
                            <View style={[styles.tableCell, { display: 'flex', flexDirection: 'column', width: '25%' }]}>
                                <Text>
                                    {item.product_assembly.formula_name}
                                </Text>
                                <Text>
                                    (Color: {item.product_assembly.color_code?.code})
                                </Text>
                            </View>
                            <Text style={[styles.tableCell, { width: '10%' }]}>
                                {item.retail_price.toFixed(2)}
                            </Text>
                            <Text style={[styles.tableCell, { width: '10%' }]}>
                                {item.quantity.toFixed(2)}
                            </Text>
                            <Text style={[styles.tableCell, { width: '10%' }]}>
                                {(parseFloat(item.retail_price) * parseFloat(item.quantity)).toFixed(2)}
                            </Text>
                            <Text style={[styles.tableCell, { width: '10%' }]}>
                                {Number(item.discount_amount_rate).toFixed(2)}{item.discount_type === 'percentage' ? '%' : '/-'}
                            </Text>
                            <Text style={[styles.tableCell, { width: '10%' }]}>
                                {((parseFloat(item.retail_price) * parseFloat(item.quantity)) - Number(item.discount_amount_rate)).toFixed(2)}
                            </Text>
                            <Text style={[styles.tableCell, { width: '10%' }]}>
                                {item.tax_amount.toFixed(2)}
                            </Text>
                            <Text style={[styles.tableCell, { width: '10%' }]}>
                                {calculateTotal(item).toFixed(2)}
                            </Text>
                        </View>
                    ))}
                    <View style={styles.tableFooter}>
                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>Sub Total</Text>
                            <Text style={styles.totalValue}>
                                {content?.quotation_items
                                    .reduce((total: number, item: any) => total + (parseFloat(item.quantity) * parseFloat(item.retail_price)), 0)
                                    .toFixed(2)}
                            </Text>
                        </View>
                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>Discount</Text>
                            <Text style={styles.totalValue}>
                                {content?.quotation_items
                                    .reduce((total: number, item: any) => total + Number(item.discount_amount_rate), 0)
                                    .toFixed(2)}
                            </Text>
                        </View>
                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>Net Total</Text>
                            <Text style={styles.totalValue}>
                                {content?.quotation_items
                                    .reduce((total: number, item: any) => total + (parseFloat(item.quantity) * parseFloat(item.retail_price)) - Number(item.discount_amount_rate), 0)
                                    .toFixed(2)}
                            </Text>
                        </View>
                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>VAT (5%)</Text>
                            <Text style={styles.totalValue}>
                                {content?.quotation_items
                                    .reduce((total: number, item: any) => total + Number(item.tax_amount), 0)
                                    .toFixed(2)}
                            </Text>
                        </View>
                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>Grand Total</Text>
                            <Text style={styles.totalValue}>
                                {content?.quotation_items
                                    .reduce((total: number, item: any) => total + calculateTotal(item), 0)
                                    .toFixed(2)}
                            </Text>
                        </View>
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
        marginVertical: 5
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
    tableFooter: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 5,
        borderTopWidth: 1,
        borderTopColor: '#000',
        padding: 4
    },
    totalRow: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%'
    },
    totalLabel: {
        fontSize: 9,
        fontWeight: 'bold',
        width: '82%'
    },
    totalValue: {
        fontSize: 9,
        width: '18%',
        textAlign: 'right'
    }
});

export default QuotationDetails;
