import React from 'react';
import { Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import Header from '@/components/Report/Header';
import Footer from '@/components/Report/Footer';

const PrintContent = ({ content }: any) => {

    const calculateTotal = (item: any) => {
        let totalCost = parseFloat(item.sale_price) * parseFloat(item.quantity);
        let taxAmount = (totalCost * parseFloat(item.tax_amount)) / 100;
        return totalCost + taxAmount;
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
                            <Text style={styles.bold}>Quotation Code: </Text>
                            {content?.quotation_code}
                        </Text>
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
                        <Text style={styles.text}>
                            <Text style={styles.bold}>TRN: </Text>
                            {content?.customer?.tax_registration}
                        </Text>
                    </View>
                    <View style={[styles.infoColumn, { borderWidth: 1, borderColor: 'black', padding: 10 }]}>
                        <Text style={styles.text}>
                            <Text style={styles.bold}>Created At: </Text>
                            {(new Date(content?.created_at)).toLocaleDateString() + '  ' + (new Date(content?.created_at)).toLocaleTimeString()}
                        </Text>
                        <Text style={styles.text}>
                            <Text style={styles.bold}>Receipt Delivery (Days): </Text>
                            {content?.receipt_delivery_due_days}
                        </Text>
                        <Text style={styles.text}>
                            <Text style={styles.bold}>Delivery: </Text>
                            {content?.delivery_due_in_days + ' - ' + content?.delivery_due_date}
                        </Text>
                        <Text style={styles.text}>
                            <Text style={styles.bold}>Quotation For: </Text>
                            {content?.quotation_for===1 ? 'Finish Goods' : 'Products'}
                        </Text>
                    </View>
                </View>
                <Text style={styles.sectionTitle}>Item Details</Text>
                <View style={styles.table}>
                    <View style={styles.tableHeader}>
                        <Text style={[styles.tableHeaderCell, { width: '5%' }]}>Sr.No</Text>
                        <Text style={[styles.tableHeaderCell, { width: '25%' }]}>Product</Text>
                        {content?.quotation_for === 1 && (
                            <>
                                <Text style={[styles.tableHeaderCell, { width: '10%' }]}>Filling</Text>
                                <Text style={[styles.tableHeaderCell, { width: '10%' }]}>Capacity</Text>
                            </>
                        )}
                        <Text style={[styles.tableHeaderCell, { width: '10%' }]}>Sale Price</Text>
                        <Text style={[styles.tableHeaderCell, { width: '10%' }]}>Qty</Text>
                        <Text style={[styles.tableHeaderCell, { width: '10%' }]}>S.Total</Text>
                        <Text style={[styles.tableHeaderCell, { width: '10%' }]}>VAT @5%</Text>
                        <Text style={[styles.tableHeaderCell, { width: '10%' }]}>Total</Text>
                    </View>
                    {content?.quotation_items.map((item: any, index: number) => (
                        <View key={index} style={styles.tableRow}>
                            <Text style={[styles.tableCell, { width: '5%' }]}>{index + 1}</Text>
                            <View
                                style={[styles.tableCell, { display: 'flex', flexDirection: 'column', width: '25%' }]}>
                                {content?.quotation_for === 1
                                    ? (
                                        <>
                                            <Text>{item.product_assembly?.formula_name + ' (' + item.product_assembly?.color_code?.code + ')'}</Text>
                                        </>
                                    ) : (
                                        <>
                                            <Text>{item.product?.title}</Text>
                                            <Text style={{ fontSize: 8 }}>{item.product?.item_code}</Text>
                                        </>
                                    )}
                            </View>
                            {content?.quotation_for === 1 && (
                                <>
                                    <Text style={[styles.tableCell, { width: '10%' }]}>{item.product?.title}</Text>
                                    <Text style={[styles.tableCell, { width: '10%' }]}>{item.capacity}</Text>
                                </>
                            )}
                            <Text style={[styles.tableCell, { width: '10%' }]}>
                                {item.sale_price.toLocaleString(undefined, {
                                    minimumFractionDigits: 4,
                                    maximumFractionDigits: 4
                                })}
                            </Text>
                            <Text style={[styles.tableCell, { width: '10%' }]}>
                                {item.quantity.toLocaleString(undefined, {
                                    minimumFractionDigits: 4,
                                    maximumFractionDigits: 4
                                })}
                            </Text>
                            <Text style={[styles.tableCell, { width: '10%' }]}>
                                {(item.quantity * item.sale_price).toLocaleString(undefined, {
                                    minimumFractionDigits: 4,
                                    maximumFractionDigits: 4
                                })}
                            </Text>
                            <Text style={[styles.tableCell, { width: '10%' }]}>
                                {item.tax_amount.toLocaleString(undefined, {
                                    minimumFractionDigits: 4,
                                    maximumFractionDigits: 4
                                })}
                            </Text>
                            <Text style={[styles.tableCell, { width: '10%' }]}>
                                {item.grand_total.toLocaleString(undefined, {
                                    minimumFractionDigits: 4,
                                    maximumFractionDigits: 4
                                })}
                            </Text>
                        </View>
                    ))}
                    <View style={styles.tableFooter}>
                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>Sub Total</Text>
                            <Text style={styles.totalValue}>
                                {content?.quotation_items
                                    ?.reduce((total: number, item: any) => total + (item.quantity * item.sale_price), 0)
                                    .toLocaleString(undefined, {
                                        minimumFractionDigits: 4,
                                        maximumFractionDigits: 4
                                    })}
                            </Text>
                        </View>
                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>VAT@5%</Text>
                            <Text style={styles.totalValue}>
                                {content?.quotation_items
                                    ?.reduce((total: number, item: any) => total + item.tax_amount, 0)
                                    .toLocaleString(undefined, {
                                        minimumFractionDigits: 4,
                                        maximumFractionDigits: 4
                                    })}
                            </Text>
                        </View>
                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>Discount Amount</Text>
                            <Text style={styles.totalValue}>
                                {content?.discount_amount
                                    ? content?.discount_amount.toLocaleString(undefined, {
                                        minimumFractionDigits: 4,
                                        maximumFractionDigits: 4
                                    })
                                    : 0}
                            </Text>
                        </View>
                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>Grand Total</Text>
                            <Text style={styles.totalValue}>
                                {content?.discount_amount
                                    ? (content?.quotation_items.reduce((total: number, item: any) => total + item.grand_total, 0) - content?.discount_amount)
                                        .toLocaleString(undefined, {
                                            minimumFractionDigits: 4,
                                            maximumFractionDigits: 4
                                        })
                                    : content?.quotation_items.reduce((total: number, item: any) => total + item.grand_total, 0)
                                        .toLocaleString(undefined, {
                                            minimumFractionDigits: 4,
                                            maximumFractionDigits: 4
                                        })}
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

export default PrintContent;
