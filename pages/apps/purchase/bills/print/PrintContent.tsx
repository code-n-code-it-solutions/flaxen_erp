import React from 'react';
import { Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import Header from '@/components/Report/Header';

// Function to calculate totals
const calculateTotals = (items: any) => {
    let totalBeforeTax = 0;
    let totalDiscount = 0;
    let totalTax = 0;
    let grandTotal = 0;

    items.forEach((item: any) => {
        const beforeTax = item.unit_price * item.received_quantity;
        const discount = item.discount_type === 'percentage'
            ? (beforeTax * (item.discount_amount_rate / 100))
            : item.discount_amount_rate;

        const subTotal = beforeTax - discount;
        const tax = subTotal * 0.05; // 5% Tax
        const total = subTotal + tax;

        totalBeforeTax += beforeTax;
        totalDiscount += discount;
        totalTax += tax;
        grandTotal += total;
    });

    const subTotal = totalBeforeTax - totalDiscount;

    return {
        totalBeforeTax: totalBeforeTax.toFixed(2),
        totalDiscount: totalDiscount.toFixed(2),
        subTotal: subTotal.toFixed(2),
        totalTax: totalTax.toFixed(2),
        grandTotal: grandTotal.toFixed(2)
    };
};

const PrintContent = ({ content, items }: any) => {
    const totals = calculateTotals(items);

    return (
        <Page size="A4" style={styles.page} wrap>
            <Header />
            <View style={styles.container}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Vendor Bill</Text>
                </View>
                <View style={styles.infoContainer}>
                    <View style={styles.infoColumn}>
                        <Text style={styles.text}>
                            <Text style={styles.bold}>Bill Code: </Text>
                            {content?.bill_number}
                        </Text>
                        <Text style={styles.text}>
                            <Text style={styles.bold}>Bill Reference: </Text>
                            {content?.bill_reference}</Text>
                        <Text style={styles.text}>
                            <Text style={styles.bold}>Bill Date: </Text>
                            {content?.bill_date}
                        </Text>
                        <Text style={styles.text}>
                            <Text style={styles.bold}>Vendor: </Text>
                            {content?.vendor?.name}
                        </Text>
                    </View>
                    <View style={styles.infoColumn}>
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
                </View>

                <Text style={styles.sectionTitle}>Item Details</Text>

                <View style={[styles.table, { marginBottom: 5 }]}>
                    <View style={styles.tableHeader}>
                        <Text style={[styles.tableHeaderCell, { width: '15%' }]}>GRN</Text>
                        <Text style={[styles.tableHeaderCell, { width: '15%' }]}>Product</Text>
                        <Text style={[styles.tableHeaderCell, { width: '10%' }]}>Quantity</Text>
                        <Text style={[styles.tableHeaderCell, { width: '10%' }]}>Unit Price</Text>
                        <Text style={[styles.tableHeaderCell, { width: '10%' }]}>Before Tax</Text>
                        <Text style={[styles.tableHeaderCell, { width: '10%' }]}>Discount</Text>
                        <Text style={[styles.tableHeaderCell, { width: '10%' }]}>Sub Total</Text>
                        <Text style={[styles.tableHeaderCell, { width: '10%' }]}>Tax @5%</Text>
                        <Text style={[styles.tableHeaderCell, { width: '10%' }]}>Grand Total</Text>
                    </View>
                    {items.map((item: any, i: number) => {
                        let grn = content?.good_receive_note_vendor_bill.find(
                            (grn: any) => grn.good_receive_note_id === item.good_receive_note_id
                        );
                        const beforeTax = (parseFloat(item.unit_price) * parseFloat(item.received_quantity)).toFixed(2);
                        const discount = item.discount_type === 'percentage'
                            ? ((parseFloat(item.unit_price) * parseFloat(item.received_quantity)) * (item.discount_amount_rate / 100)).toFixed(2)
                            : item.discount_amount_rate.toFixed(2);
                        const subTotal = (parseFloat(beforeTax) - parseFloat(discount)).toFixed(2);
                        const tax = (parseFloat(subTotal) * 0.05).toFixed(2);
                        const grandTotal = (parseFloat(subTotal) + parseFloat(tax)).toFixed(2);

                        return (
                            <View key={i} style={styles.tableRow}>
                                <Text
                                    style={[styles.tableCell, { width: '15%' }]}>{grn?.good_receive_note.grn_number}</Text>
                                <Text style={[styles.tableCell, { width: '15%' }]}>{item.raw_product?.item_code}</Text>
                                <Text style={[styles.tableCell, { width: '10%' }]}>{item.received_quantity}</Text>
                                <Text style={[styles.tableCell, { width: '10%' }]}>{item.unit_price}</Text>
                                <Text style={[styles.tableCell, { width: '10%' }]}>{beforeTax}</Text>
                                <Text style={[styles.tableCell, { width: '10%' }]}>{discount}</Text>
                                <Text style={[styles.tableCell, { width: '10%' }]}>{subTotal}</Text>
                                <Text style={[styles.tableCell, { width: '10%' }]}>{tax}</Text>
                                <Text style={[styles.tableCell, { width: '10%' }]}>{grandTotal}</Text>
                            </View>
                        );
                    })}
                </View>

                {/* Totals Section */}
                <View style={styles.tableFooterContainer}>
                    <View style={styles.tableFooter}>
                        <View style={styles.tableFooterRow}>
                            <Text style={styles.tableFooterLabel}>Total Before Tax:</Text>
                            <Text style={styles.tableFooterValue}>{totals.totalBeforeTax}</Text>
                        </View>
                        <View style={styles.tableFooterRow}>
                            <Text style={styles.tableFooterLabel}>Total Discount:</Text>
                            <Text style={styles.tableFooterValue}>{totals.totalDiscount}</Text>
                        </View>
                        <View style={styles.tableFooterRow}>
                            <Text style={styles.tableFooterLabel}>Sub Total:</Text>
                            <Text style={styles.tableFooterValue}>{totals.subTotal}</Text>
                        </View>
                        <View style={styles.tableFooterRow}>
                            <Text style={styles.tableFooterLabel}>Tax @5%:</Text>
                            <Text style={styles.tableFooterValue}>{totals.totalTax}</Text>
                        </View>
                        <View style={styles.tableFooterRow}>
                            <Text style={styles.tableFooterLabel}>Grand Total:</Text>
                            <Text style={styles.tableFooterValue}>{totals.grandTotal}</Text>
                        </View>
                    </View>
                </View>
            </View>
        </Page>
    );
};

const styles = StyleSheet.create({
    page: {
        display: 'flex',
        flexDirection: 'column',
        padding: 20,
    },
    container: {
        display: 'flex',
        flexDirection: 'column',
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
        marginVertical: 10,
    },
    infoColumn: {
        display: 'flex',
        flexDirection: 'column',
        width: '45%',
    },
    text: {
        fontSize: 9,
    },
    bold: {
        fontWeight: 'bold',
        fontSize: 9,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginVertical: 10,
    },
    table: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        borderWidth: 1,
        borderColor: '#000',
    },
    tableHeader: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: '#000',
        backgroundColor: '#f0f0f0',
        padding: 4,
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
        padding: 4,
    },
    tableCell: {
        fontSize: 9,
        textAlign: 'left',
    },
    tableFooterContainer: {
        marginTop: 10,
        fontSize: 10,
        fontWeight: 'bold',
    },
    tableFooter: {
        borderTopWidth: 1,
        borderTopColor: '#000',
        paddingTop: 5,
        paddingHorizontal: 5,
        marginTop: 5,
        display: 'flex',
        flexDirection: 'column',
        borderWidth: 1,
        borderColor: '#000',
        backgroundColor: '#f5f5f5',
        padding: 10,
    },
    tableFooterRow: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 2,
    },
    tableFooterLabel: {
        fontSize: 9,
        width: '70%',
        textAlign: 'right',
    },
    tableFooterValue: {
        fontSize: 9,
        width: '30%',
        textAlign: 'right',
    },
});

export default PrintContent;
