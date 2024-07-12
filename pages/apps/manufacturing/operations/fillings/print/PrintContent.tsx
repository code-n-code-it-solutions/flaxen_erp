import React from 'react';
import { Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import Header from '@/components/Report/Header';
import Footer from '@/components/Report/Footer';

const PrintContent = ({ content, itemWiseCalculations, batchCalculations }: any) => {
    return (
        <Page size="A4" style={styles.page}>
            <Header />
            <View
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    marginVertical: 10
                }}
            >
                <Text
                    style={{
                        fontSize: 12,
                        fontWeight: 'bold'
                    }}
                >
                    Filling Details
                </Text>
                <Text style={{ fontSize: 10, fontWeight: 'bold' }}>
                    {content?.formula_code}
                </Text>
            </View>
            <View style={styles.infoContainer}>
                <View style={styles.infoColumn}>
                    <Text style={styles.infoText}>
                        <Text style={styles.bold}>Filling Code: </Text> {content?.filling_code}
                    </Text>
                    <Text style={styles.infoText}>
                        <Text style={styles.bold}>Filling Date: </Text> {content?.filling_date}
                    </Text>
                </View>
                <View style={styles.infoColumn}>
                    <Text style={styles.infoText}>
                        <Text style={styles.bold}>Filling Time: </Text> {content?.filling_time}
                    </Text>
                    <Text style={styles.infoText}>
                        <Text style={styles.bold}>Filling Shift: </Text> {content?.filling_shift_id}
                    </Text>
                </View>
            </View>

            <Text style={styles.sectionTitle}>Cost Calculation</Text>
            <View style={styles.table}>
                <View style={styles.tableHeader}>
                    <Text style={styles.tableHeaderCell}>Filling</Text>
                    <Text style={styles.tableHeaderCell}>No of Fillings</Text>
                    <Text style={styles.tableHeaderCell}>Cost Goods</Text>
                    <Text style={styles.tableHeaderCell}>Sale Price</Text>
                    <Text style={styles.tableHeaderCell}>Total Sale Cost</Text>
                </View>
                {itemWiseCalculations.length > 0 ? (
                    itemWiseCalculations.map((item: any, index: number) => (
                        <View key={index} style={styles.tableRow}>
                            <Text style={styles.tableCell}>{item.product?.title}</Text>
                            <Text style={styles.tableCell}>{item.filling_quantity} (Kg)
                                / {item.required_quantity}</Text>
                            <Text style={styles.tableCell}>{parseFloat(item.costOfGoods).toFixed(2)}</Text>
                            <Text style={styles.tableCell}>{parseFloat(item.salePrice).toFixed(2)}</Text>
                            <Text
                                style={styles.tableCell}>{(parseFloat(item.salePrice) * parseFloat(item.required_quantity)).toFixed(2)}</Text>
                        </View>
                    ))
                ) : (
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCell}>No data found</Text>
                    </View>
                )}
            </View>

            <Text style={styles.sectionTitle}>Batch Used</Text>
            <View style={styles.table}>
                <View style={styles.tableHeader}>
                    <Text style={styles.tableHeaderCell}>Batch</Text>
                    <Text style={styles.tableHeaderCell}>Quantity</Text>
                    <Text style={styles.tableHeaderCell}>Used</Text>
                    <Text style={styles.tableHeaderCell}>Remaining</Text>
                    <Text style={styles.tableHeaderCell}>Created At</Text>
                </View>
                {batchCalculations.length > 0 ? (
                    batchCalculations.map((row: any, index: number) => (
                        <View key={index} style={styles.tableRow}>
                            <Text style={styles.tableCell}>{row.batch_number}</Text>
                            <Text style={styles.tableCell}>{row.quantity}</Text>
                            <Text style={styles.tableCell}>{row.used}</Text>
                            <Text style={styles.tableCell}>{row.remaining}</Text>
                            <Text style={styles.tableCell}>{new Date(row.created_at).toLocaleDateString()}</Text>
                        </View>
                    ))
                ) : (
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCell}>No batch selected</Text>
                    </View>
                )}
            </View>

            <Text style={styles.sectionTitle}>Fillings</Text>
            <View style={styles.table}>
                <View style={styles.tableHeader}>
                    <Text style={styles.tableHeaderCell}>Sr.No</Text>
                    <Text style={styles.tableHeaderCell}>Product Name</Text>
                    <Text style={styles.tableHeaderCell}>Unit</Text>
                    <Text style={styles.tableHeaderCell}>Unit Cost</Text>
                    <Text style={styles.tableHeaderCell}>Qty</Text>
                    <Text style={styles.tableHeaderCell}>Capacity</Text>
                    <Text style={styles.tableHeaderCell}>Required</Text>
                    <Text style={styles.tableHeaderCell}>Total Cost</Text>
                </View>
                {content?.filling_calculations.map((item: any, index: any) => (
                    <View key={index} style={styles.tableRow}>
                        <Text style={styles.tableCell}>{index + 1}</Text>
                        <Text style={styles.tableCell}>{item.product?.title}</Text>
                        <Text style={styles.tableCell}>{item.unit?.name}</Text>
                        <Text style={styles.tableCell}>{item.unit_price}</Text>
                        <Text style={styles.tableCell}>{item.filling_quantity}</Text>
                        <Text style={styles.tableCell}>{item.capacity}</Text>
                        <Text style={styles.tableCell}>{item.required_quantity.toFixed(2)}</Text>
                        <Text
                            style={styles.tableCell}>{(parseFloat(item.unit_price) * parseFloat(item.required_quantity)).toFixed(2)}</Text>
                    </View>
                ))}
                <View style={styles.tableFooter}>
                    <Text style={styles.tableFooterCell}>Total</Text>
                    <Text style={styles.tableFooterCell}></Text>
                    <Text style={styles.tableFooterCell}></Text>
                    <Text style={styles.tableFooterCell}>
                        {content?.filling_calculations?.reduce((total: number, item: any) => total + parseFloat(item.unit_price), 0).toFixed(2)}
                    </Text>
                    <Text style={styles.tableFooterCell}>
                        {content?.filling_calculations?.reduce((total: number, item: any) => total + parseFloat(item.filling_quantity), 0).toFixed(2)}
                    </Text>
                    <Text style={styles.tableFooterCell}>
                        {content?.filling_calculations?.reduce((total: number, item: any) => total + parseFloat(item.capacity), 0).toFixed(2)}
                    </Text>
                    <Text style={styles.tableFooterCell}>
                        {content?.filling_calculations?.reduce((total: number, item: any) => total + parseFloat(item.required_quantity), 0).toFixed(2)}
                    </Text>
                    <Text style={styles.tableFooterCell}>
                        {content?.filling_calculations?.reduce((total: number, item: any) => total + parseFloat(item.unit_price) * parseFloat(item.required_quantity), 0).toFixed(2)}
                    </Text>
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
    bold: {
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
        gap: 4
    },
    infoText: {
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
        marginBottom: 10
    },
    tableHeader: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottom: '1px solid #000',
        paddingBottom: 4
    },
    tableHeaderCell: {
        width: '12%',
        fontSize: 10,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    tableRow: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottom: '1px solid #000',
        paddingBottom: 4
    },
    tableCell: {
        width: '12%',
        fontSize: 10,
        textAlign: 'center',
        paddingVertical: 5
    },
    tableCellText: {
        fontSize: 8
    },
    tableFooter: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTop: '1px solid #000',
        paddingTop: 5
    },
    tableFooterCell: {
        width: '12%',
        fontSize: 10,
        fontWeight: 'bold',
        textAlign: 'center'
    },
});

export default PrintContent;
