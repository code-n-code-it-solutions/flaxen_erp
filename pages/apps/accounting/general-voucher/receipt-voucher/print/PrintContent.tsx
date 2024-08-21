import React from 'react';
import { Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import Header from '@/components/Report/Header';
import Footer from '@/components/Report/Footer';

const PrintContent = ({ content }:any) => {
    const calculateTotals = (items:any[]) => {
        let totalAmount = 0;
        let taxAmount = 0;
        let discountAmount = 0;
        let netAmount = 0;
        let grandTotal = 0;

        items.forEach((item) => {
            const itemTotal = parseFloat(item.retail_price) * parseFloat(item.returned_quantity);
            const itemTax = item.tax_amount || 0;
            const itemDiscount = item.discount_amount_rate ? parseFloat(item.discount_amount_rate) : 0;
            totalAmount += itemTotal;
            taxAmount += itemTax;
            discountAmount += itemDiscount;
        });

        netAmount = totalAmount + taxAmount;
        grandTotal = netAmount - discountAmount;

        return { totalAmount, taxAmount, discountAmount, netAmount, grandTotal };
    };

    const totals = calculateTotals(content.credit_note_items);

    return (
        <Page size="A4" style={styles.page} wrap>
            <Header />
            <View style={styles.container}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Credit Note</Text>
                </View>
                <View style={styles.infoContainer}>
                    <View style={styles.infoColumn}>
                        <Text style={styles.text}>
                            <Text style={styles.bold}>Credit Note Code: </Text>
                            {content?.credit_note_code}
                        </Text>
                        <Text style={styles.text}>
                            <Text style={styles.bold}>Credit Note Date: </Text>
                            {content?.credit_note_date}
                        </Text>
                        <Text style={styles.text}>
                            <Text style={styles.bold}>Invoice Date: </Text>
                            {content?.credit_note_date}
                        </Text>
                        <Text style={styles.text}>
                            <Text style={styles.bold}>Return Type: </Text>
                            {content?.return_type}
                        </Text>
                    </View>
                    <View style={styles.infoColumn}>
                        <Text style={styles.text}>
                            <Text style={styles.bold}>Customer: </Text>
                            {content?.customer?.name}
                        </Text>
                        <Text style={styles.text}>
                            <Text style={styles.bold}>Return By: </Text>
                            {content?.returned_by?.name}
                        </Text>
                        <Text style={styles.text}>
                            <Text style={styles.bold}>Created At: </Text>
                            {new Date(content?.created_at).toLocaleDateString()}
                        </Text>
                        <Text style={styles.text}>
                            <Text style={styles.bold}>Created By: </Text>
                            {content?.created_by?.name}
                        </Text>
                    </View>
                </View>
                <Text style={styles.description}>{content?.description}</Text>
                <Text style={styles.sectionTitle}>Item Details</Text>
                <View style={styles.table}>
                    <View style={styles.tableHeader}>
                        <Text style={[styles.tableHeaderCell, { width: '15%' }]}>Product</Text>
                        <Text style={[styles.tableHeaderCell, { width: '15%' }]}>Filling</Text>
                        <Text style={[styles.tableHeaderCell, { width: '10%' }]}>Capacity</Text>
                        <Text style={[styles.tableHeaderCell, { width: '10%' }]}>Quantity</Text>
                        <Text style={[styles.tableHeaderCell, { width: '10%' }]}>Unit Price</Text>
                        <Text style={[styles.tableHeaderCell, { width: '10%' }]}>Before Tax</Text>
                        <Text style={[styles.tableHeaderCell, { width: '10%' }]}>Tax</Text>
                        <Text style={[styles.tableHeaderCell, { width: '10%' }]}>Discount</Text>
                        <Text style={[styles.tableHeaderCell, { width: '10%' }]}>Grand Total</Text>
                    </View>
                    {content.credit_note_items.length > 0 ? (
                        content.credit_note_items.map((item:any, index:number) => (
                            <View key={index} style={styles.tableRow}>
                                <Text style={[styles.tableCell, { width: '15%' }]}>{item.product_assembly.formula_name}</Text>
                                <Text style={[styles.tableCell, { width: '15%' }]}>{item.product.title}</Text>
                                <Text style={[styles.tableCell, { width: '10%' }]}>{item.capacity}</Text>
                                <Text style={[styles.tableCell, { width: '10%' }]}>{item.returned_quantity}</Text>
                                <Text style={[styles.tableCell, { width: '10%' }]}>{parseFloat(item.retail_price).toFixed(2)}</Text>
                                <Text style={[styles.tableCell, { width: '10%' }]}>{(parseFloat(item.returned_quantity) * parseFloat(item.retail_price)).toFixed(2)}</Text>
                                <Text style={[styles.tableCell, { width: '10%' }]}>
                                    {item.tax_category ? (
                                        <>
                                            <Text>Tax: {item.tax_category.name} ({item.tax_rate}%)</Text>
                                            <Text>Amt: {item.tax_amount.toFixed(2)}</Text>
                                        </>
                                    ) : (
                                        'N/A'
                                    )}
                                </Text>
                                <Text style={[styles.tableCell, { width: '10%' }]}>
                                    {item.discount_type ? (
                                        <>
                                            <Text>Type: {item.discount_type}</Text>
                                            <Text>Rate: {item.discount_amount_rate.toFixed(2)}{item.discount_type === 'percentage' ? '%' : ''}</Text>
                                        </>
                                    ) : (
                                        'N/A'
                                    )}
                                </Text>
                                <Text style={[styles.tableCell, { width: '10%' }]}>{parseFloat(item.total_cost).toFixed(2)}</Text>
                            </View>
                        ))
                    ) : (
                        <View style={styles.tableRow}>
                            <Text style={{ textAlign: 'center', width: '100%' }}>No items found</Text>
                        </View>
                    )}
                </View>
                <View style={styles.totalContainer}>
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Total Amount:</Text>
                        <Text style={styles.totalValue}>{totals.totalAmount.toFixed(2)}</Text>
                    </View>
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Tax Amount:</Text>
                        <Text style={styles.totalValue}>{totals.taxAmount.toFixed(2)}</Text>
                    </View>
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Sub Total:</Text>
                        <Text style={styles.totalValue}>{totals.netAmount.toFixed(2)}</Text>
                    </View>
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Discount Amount:</Text>
                        <Text style={styles.totalValue}>{totals.discountAmount.toFixed(2)}</Text>
                    </View>
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Grand Total:</Text>
                        <Text style={styles.totalValue}>{totals.grandTotal.toFixed(2)}</Text>
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
    description: {
        marginVertical: 10,
        fontSize: 10
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
    totalContainer: {
        marginTop: 20,
        padding: 10,
        borderWidth: 1,
        borderColor: '#000',
        backgroundColor: '#f0f0f0'
    },
    totalRow: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 2
    },
    totalLabel: {
        fontSize: 10,
        fontWeight: 'bold'
    },
    totalValue: {
        fontSize: 10
    },
});

export default PrintContent;
