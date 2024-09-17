import React from 'react';
import { Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import Header from '@/components/Report/Header';
import Footer from '@/components/Report/Footer';

const PrintContent = ({ content }: any) => {
    console.log(content);
    // Calculating totals
    const subTotal = content?.raw_materials.reduce(
        (acc: any, item: any) => acc + parseFloat(item.quantity) * parseFloat(item.unit_price), 0
    ).toFixed(2);

    const totalTax = content?.raw_materials.reduce(
        (acc: any, item: any) => acc + parseFloat(item.tax_amount), 0
    ).toFixed(2);

    const grandTotal = (parseFloat(subTotal) + parseFloat(totalTax)).toFixed(2);

    return (
        <Page size="A4" style={styles.page}>
            <Header />
            <View style={styles.container}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Purchase Order</Text>
                    <Text style={styles.subtitle}>{content?.lpo_number}</Text>
                    <Text style={styles.subtitle}>
                        {new Date(content?.created_at).toLocaleDateString() + ' ' + new Date(content?.created_at).toLocaleTimeString()}
                    </Text>
                </View>
                <View style={styles.infoContainer}>
                    <View style={styles.infoColumn}>
                        <Text style={styles.text}>TO</Text>
                        <Text style={styles.text}>{content?.vendor?.name}</Text>
                        <Text style={styles.text}>
                            {content?.vendor?.address} {content?.vendor?.city?.name}, {content?.vendor?.state?.name}
                        </Text>
                        <Text style={styles.text}>
                            {content?.vendor?.country?.name} {content?.vendor?.postal_code}
                        </Text>
                        <Text style={styles.text}>{content?.vendor?.phone}</Text>
                        <Text style={styles.text}>Rep: {content?.vendor_representative.name}</Text>
                        <Text style={styles.text}>Rep Ph: {content?.vendor_representative.phone}</Text>
                    </View>
                    <View style={styles.infoColumn}>
                        <Text style={styles.text}>Address Correspondence To</Text>
                        <Text style={styles.text}>Flaxen Paints Industry LLC</Text>
                        <Text style={styles.text}>Plot # 593 Industrial Area</Text>
                        <Text style={styles.text}>Umm Al Thuoob Umm Al Quwain, UAE</Text>
                        <Text style={styles.text}>Name: Anwar Ali</Text>
                        <Text style={styles.text}>Email: info@flaxenpaints.com</Text>
                        <Text style={styles.text}>Phone: +971544765504</Text>
                    </View>
                </View>

                {/* Table */}
                <View style={styles.tableContainer}>
                    <View style={styles.tableHeader}>
                        <Text style={[styles.tableHeaderCell, styles.col1]}>#</Text>
                        <Text style={[styles.tableHeaderCell, styles.col2]}>PR</Text>
                        <Text style={[styles.tableHeaderCell, styles.col3]}>Item</Text>
                        <Text style={[styles.tableHeaderCell, styles.col4]}>Unit</Text>
                        <Text style={[styles.tableHeaderCell, styles.col5]}>Unit Price</Text>
                        <Text style={[styles.tableHeaderCell, styles.col6]}>Qty</Text>
                        <Text style={[styles.tableHeaderCell, styles.col7]}>Tax@5%</Text>
                        <Text style={[styles.tableHeaderCell, styles.col8]}>Total</Text>
                    </View>

                    {content?.raw_materials?.map((item: any, index: number) => (
                        <View key={index} style={styles.tableRow}>
                            <Text style={[styles.tableCell, styles.col1]}>{index + 1}</Text>
                            <Text style={[styles.tableCell, styles.col2]}>{item.purchase_requisition?.pr_code}</Text>
                            <Text style={[styles.tableCell, styles.col3]}>{item.raw_product?.item_code}</Text>
                            <Text style={[styles.tableCell, styles.col4]}>{item.unit?.name}</Text>
                            <Text style={[styles.tableCell, styles.col5]}>
                                {item.unit_price.toLocaleString(undefined, {
                                    minimumFractionDigits: 4,
                                    maximumFractionDigits: 4
                                })}
                            </Text>
                            <Text style={[styles.tableCell, styles.col6]}>{item.quantity}</Text>
                            <Text style={[styles.tableCell, styles.col7]}>
                                {item.tax_amount.toLocaleString(undefined, {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                })}
                            </Text>
                            <Text style={[styles.tableCell, styles.col8]}>
                                {((parseFloat(item.quantity) * parseFloat(item.unit_price)) +
                                    parseFloat(item.tax_amount)
                                ).toLocaleString(undefined, {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                })}
                            </Text>
                        </View>
                    ))}

                    {/* Total Section */}
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Total Without Tax:</Text>
                        <Text style={styles.totalValue}>{subTotal}</Text>
                    </View>
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>VAT:</Text>
                        <Text style={styles.totalValue}>{totalTax}</Text>
                    </View>
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Grand Total:</Text>
                        <Text style={styles.totalValue}>{grandTotal}</Text>
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
        fontSize: 11,
        fontWeight: 'bold'
    },
    subtitle: {
        fontSize: 10,
        marginVertical: 5
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
        width: '48%'
    },
    text: {
        fontSize: 10
    },
    tableContainer: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        marginTop: 20
    },
    tableHeader: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottom: '1px solid #000',
        paddingBottom: 4,
        fontWeight: 'bold'
    },
    tableHeaderCell: {
        fontSize: 10,
        textAlign: 'left',
        padding: 2
    },
    tableRow: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottom: '1px solid #000',
        paddingBottom: 4
    },
    tableCell: {
        fontSize: 10,
        padding: 2,
        flexShrink: 1,
        textAlign: 'left'
    },
    totalRow: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingTop: 5
    },
    totalLabel: {
        fontSize: 10,
        fontWeight: 'bold',
        paddingRight: 10
    },
    totalValue: {
        fontSize: 10,
        fontWeight: 'bold'
    },
    // Column widths
    col1: { flex: 0.5 },
    col2: { flex: 1.5 },
    col3: { flex: 2 },
    col4: { flex: 1 },
    col5: { flex: 1 },
    col6: { flex: 0.7 },
    col7: { flex: 1 },
    col8: { flex: 1.2 },
});

export default PrintContent;
