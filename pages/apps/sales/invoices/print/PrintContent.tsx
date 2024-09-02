import React from 'react';
import { Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import Header from '@/components/Report/Header';
import Footer from '@/components/Report/Footer';

const PrintContent = ({ content, items }: any) => {
    console.log(content, items);

    const calculateTotals = (items: any) => {
        let totalAmount = 0;
        let taxAmount = 0;
        let discountAmount = 0;
        let netAmount = 0;
        let grandTotal = 0;

        items.forEach((deliveryNoteItem: any) => {
            deliveryNoteItem.delivery_note_items.forEach((item: any) => {
                const itemTotal = parseFloat(item.sale_price) * parseFloat(item.delivered_quantity);
                const itemTax = item.tax_amount;
                const itemDiscount = item.discount_amount_rate ? parseFloat(item.discount_amount_rate) : 0;
                totalAmount += itemTotal;
                taxAmount += itemTax;
                discountAmount += itemDiscount;
            });
        });

        netAmount = totalAmount + taxAmount;
        grandTotal = netAmount - discountAmount;

        return { totalAmount, taxAmount, discountAmount, netAmount, grandTotal };
    };

    const totals = calculateTotals(items);

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
                            {content?.po_number}
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
                    <View style={[styles.table, { marginBottom: 5 }]} key={index}>
                        <Text style={{ textAlign: 'center', fontSize: 10, paddingVertical: 5 }}>
                            {deliveryNoteItem.delivery_note_code}
                        </Text>
                        {content.sale_invoice_for === 1
                            ? (
                                <View style={styles.tableHeader}>
                                    <Text style={[styles.tableHeaderCell, { width: '5%' }]}>#</Text>
                                    <Text style={[styles.tableHeaderCell, { width: '15%' }]}>Product</Text>
                                    <Text style={[styles.tableHeaderCell, { width: '10%' }]}>Batch</Text>
                                    <Text style={[styles.tableHeaderCell, { width: '10%' }]}>Cost</Text>
                                    <Text style={[styles.tableHeaderCell, { width: '10%' }]}>Quantity</Text>
                                    <Text style={[styles.tableHeaderCell, { width: '10%' }]}>Before Tax</Text>
                                    <Text style={[styles.tableHeaderCell, { width: '15%' }]}>Tax</Text>
                                    <Text style={[styles.tableHeaderCell, { width: '10%' }]}>Discount</Text>
                                    <Text style={[styles.tableHeaderCell, { width: '10%' }]}>Total Cost</Text>
                                </View>
                            ) : (
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
                            )}

                        {deliveryNoteItem.delivery_note_items.map((item: any, itemIndex: number) => (
                            content.sale_invoice_for === 1
                                ? (
                                    <View key={itemIndex} style={styles.tableRow}>
                                        <Text style={[styles.tableCell, { width: '5%' }]}>
                                            {itemIndex + 1}
                                        </Text>
                                        <View style={[styles.tableCell, { width: '15%' }]}>
                                            <Text>{item.product_assembly.formula_name}</Text>
                                            <Text>{item.product.title + ` - ${item.capacity}KG`}</Text>
                                        </View>
                                        <Text style={[styles.tableCell, { width: '10%' }]}>
                                            {item.batch_number}
                                        </Text>
                                        <Text style={[styles.tableCell, { width: '10%' }]}>
                                            {parseFloat(item.sale_price).toFixed(2)}
                                        </Text>
                                        <Text style={[styles.tableCell, { width: '10%' }]}>
                                            {item.delivered_quantity}
                                        </Text>
                                        <Text style={[styles.tableCell, { width: '10%' }]}>
                                            {(parseFloat(item.sale_price) * parseFloat(item.delivered_quantity)).toFixed(2)}
                                        </Text>
                                        <View style={[styles.tableCell, { width: '15%' }]}>
                                            <Text>Tax: {item.tax_category.name + ' (' + item.tax_rate + '%)'}</Text>
                                            <Text>Amt: {item.tax_amount.toFixed(2)}</Text>
                                        </View>
                                        <Text style={[styles.tableCell, { width: '10%' }]}>
                                            {item.discount_amount_rate ? item.discount_amount_rate.toFixed(2) : 'NA'}
                                            {item.discount_type && item.discount_type === 'percentage' ? '%' : '/-'}
                                        </Text>
                                        <Text style={[styles.tableCell, { width: '10%' }]}>
                                            {parseFloat(item.grand_total).toFixed(2)}
                                        </Text>
                                    </View>
                                ) : (
                                    <View key={itemIndex} style={styles.tableRow}>
                                        <Text style={[styles.tableCell, { width: '5%' }]}>
                                            {itemIndex + 1}
                                        </Text>
                                        <View style={[styles.tableCell, { width: '15%' }]}>
                                            <Text>{item.product_assembly.formula_name}</Text>
                                            <Text>{item.product.title + ` - ${item.capacity}KG`}</Text>
                                        </View>
                                        <Text style={[styles.tableCell, { width: '10%' }]}>
                                            {parseFloat(item.sale_price).toFixed(2)}
                                        </Text>
                                        <Text style={[styles.tableCell, { width: '10%' }]}>
                                            {item.delivered_quantity}
                                        </Text>
                                        <Text style={[styles.tableCell, { width: '10%' }]}>
                                            {(parseFloat(item.sale_price) * parseFloat(item.delivered_quantity)).toFixed(2)}
                                        </Text>
                                        <View style={[styles.tableCell, { width: '15%' }]}>
                                            <Text>Tax: {item.tax_category.name + ' (' + item.tax_rate + '%)'}</Text>
                                            <Text>Amt: {item.tax_amount.toFixed(2)}</Text>
                                        </View>
                                        <Text style={[styles.tableCell, { width: '10%' }]}>
                                            {item.discount_amount_rate ? item.discount_amount_rate.toFixed(2) : 'NA'}
                                            {item.discount_type && item.discount_type === 'percentage' ? '%' : '/-'}
                                        </Text>
                                        <Text style={[styles.tableCell, { width: '10%' }]}>
                                            {parseFloat(item.grand_total).toFixed(2)}
                                        </Text>
                                    </View>
                                )
                        ))}
                    </View>
                ))}
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
        color: 'gray',
        fontSize: 8
    }
});

export default PrintContent;
