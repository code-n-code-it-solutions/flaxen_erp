import React from 'react';
import { Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import Header from '@/components/Report/Header';
import Footer from '@/components/Report/Footer';

const PrintContent = ({ content }: any) => {
    return (
        <Page size="A4" style={styles.page}>
            <Header />
            <View style={styles.container}>
                <Text style={styles.title}>Good Receive Note Details</Text>
                <View style={styles.infoContainer}>
                    <View style={styles.infoColumn}>
                        <Text style={styles.text}>
                            <Text style={styles.bold}>GRN No: </Text>
                            {content?.grn_number}
                        </Text>
                    </View>
                    <View style={styles.infoColumn}>
                        <Text style={styles.text}>
                            <Text style={styles.bold}>Created Date: </Text>
                            {new Date(content?.created_at).toDateString()}
                        </Text>
                    </View>
                </View>
                <View style={styles.addressContainer}>
                    <View style={styles.addressColumn}>
                        <Text style={styles.bold}>TO</Text>
                        <Text style={styles.bold}>
                            {content?.vendor?.name}
                        </Text>
                        <Text style={styles.text}>
                            {content?.vendor?.address} {content?.vendor?.city?.name},
                            {content?.vendor?.state?.name}
                        </Text>
                        <Text style={styles.text}>
                            {content?.vendor?.country?.name} {content?.vendor?.postal_code}
                        </Text>
                        <Text style={styles.text}>
                            {content?.vendor?.phone}
                        </Text>
                    </View>
                    <View style={styles.addressColumn}>
                        <Text style={styles.bold}>Address Correspondence To</Text>
                        <Text style={styles.text}>Flaxen Paints Industry LLC</Text>
                        <Text style={styles.text}>Plot # 593 Industrial Area</Text>
                        <Text style={styles.text}>Umm Al Thuoob Umm Al Quwain, UAE</Text>
                        <Text style={styles.bold}>Name: Anwar Ali</Text>
                        <Text style={styles.bold}>Email: info@flaxenpaints.com</Text>
                        <Text style={styles.bold}>Phone: +971544765504</Text>
                    </View>
                </View>
                <View style={styles.tableContainer}>
                    <View style={styles.tableHeader}>
                        <Text style={[styles.tableHeaderCell, styles.col1]}>#</Text>
                        <Text style={[styles.tableHeaderCell, styles.col2]}>PR</Text>
                        <Text style={[styles.tableHeaderCell, styles.col3]}>LPO</Text>
                        <Text style={[styles.tableHeaderCell, styles.col4]}>Item</Text>
                        <Text style={[styles.tableHeaderCell, styles.col5]}>Unit</Text>
                        <Text style={[styles.tableHeaderCell, styles.col6]}>Req. Qty</Text>
                        <Text style={[styles.tableHeaderCell, styles.col7]}>Rec. Qty</Text>
                    </View>
                    {content?.raw_products?.map((item: any, index: number) => (
                        <View key={index} style={styles.tableRow}>
                            <Text style={[styles.tableCell, styles.col1]}>{index + 1}</Text>
                            <Text style={[styles.tableCell, styles.col2]}>{item.purchase_requisition?.pr_code}</Text>
                            <Text style={[styles.tableCell, styles.col3]}>{item.local_purchase_order?.lpo_number}</Text>
                            <Text style={[styles.tableCell, styles.col4]}>{item.raw_product?.item_code}</Text>
                            <Text style={[styles.tableCell, styles.col5]}>{item.unit?.name}</Text>
                            <Text style={[styles.tableCell, styles.col6]}>{item.quantity}</Text>
                            <Text style={[styles.tableCell, styles.col7]}>{item.received_quantity}</Text>
                        </View>
                    ))}

                    {/* Total Section */}
                    <View style={styles.tableFooter}>
                        <Text style={[styles.tableFooterCell, styles.col1]}>Total</Text>
                        <Text style={[styles.tableFooterCell, styles.col2]}></Text>
                        <Text style={[styles.tableFooterCell, styles.col3]}></Text>
                        <Text style={[styles.tableFooterCell, styles.col4]}></Text>
                        <Text style={[styles.tableFooterCell, styles.col5]}></Text>
                        <Text style={[styles.tableFooterCell, styles.col6]}>
                            {content?.raw_products?.reduce((acc:number, item:any) => acc + item.quantity, 0).toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            })}
                        </Text>
                        <Text style={[styles.tableFooterCell, styles.col7]}>
                            {content?.raw_products?.reduce((acc:number, item:any) => acc + item.received_quantity, 0).toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            })}
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
    title: {
        fontSize: 12,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10
    },
    infoContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10
    },
    infoColumn: {
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        width: '45%'
    },
    text: {
        fontSize: 10
    },
    bold: {
        fontWeight: 'bold',
        fontSize: 10
    },
    addressContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20
    },
    addressColumn: {
        display: 'flex',
        flexDirection: 'column',
        width: '45%'
    },
    tableContainer: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        marginTop: 20,
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
        fontSize: 10,
        textAlign: 'left',
        padding: 2
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
        fontSize: 10,
        textAlign: 'left',
        padding: 2
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
        fontSize: 10,
        fontWeight: 'bold',
        padding: 2
    },
    // Column widths
    col1: { flex: 0.5 },
    col2: { flex: 1.5 },
    col3: { flex: 1.5 },
    col4: { flex: 2 },
    col5: { flex: 1 },
    col6: { flex: 1 },
    col7: { flex: 1 }
});

export default PrintContent;
