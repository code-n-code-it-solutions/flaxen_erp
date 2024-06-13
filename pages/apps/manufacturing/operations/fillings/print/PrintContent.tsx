import React from 'react';
import { Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import Header from '@/components/Report/Header';

const PrintContent = ({ content }: any) => {
    const renderFillingCalculations = () => {
        if (content?.filling_calculations.length > 0) {
            return content?.filling_calculations.map((item: any, index: number) => {
                const totalMaterialCost = content?.filling_items.reduce((acc: number, fillingItem: any) =>
                    acc + ((parseFloat(fillingItem.unit_cost) * parseFloat(fillingItem.quantity) * parseFloat(content?.production?.no_of_quantity)) / parseFloat(fillingItem.quantity)), 0
                );
                const perFillingCost = (totalMaterialCost / content?.production.no_of_quantity * item.capacity) + item.unit_price;
                const totalFillingCost = perFillingCost * item.required_quantity;

                return (
                    <View key={index} style={styles.tableRow}>
                        <Text style={styles.tableCell}>{item.product?.item_code}</Text>
                        <Text
                            style={styles.tableCell}>{`${item.filling_quantity} (Kg) / ${item.required_quantity}`}</Text>
                        <Text style={styles.tableCell}>{perFillingCost.toFixed(2)}</Text>
                        <Text style={styles.tableCell}>{totalFillingCost.toFixed(2)}</Text>
                    </View>
                );
            });
        } else {
            return (
                <View style={styles.tableRow}>
                    <Text style={styles.tableCell}>
                        No data found
                    </Text>
                </View>
            );
        }
    };

    return (
        <Page size="A4" style={styles.page}>
            <Header />
            <View style={styles.titleContainer}>
                <Text style={styles.title}>Filling Details</Text>
                <Text style={styles.subtitle}>
                    {content?.production?.batch_number}
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
                    <Text style={styles.infoText}>
                        <Text style={styles.bold}>Filling Time: </Text> {content?.filling_time}
                    </Text>
                </View>
                <View style={styles.infoColumn}>
                    <Text style={styles.infoText}>
                        <Text style={styles.bold}>Filling Shift: </Text> {content?.working_shift?.name}
                    </Text>
                    <Text style={styles.infoText}>
                        <Text style={styles.bold}>No of Quantity (KG): </Text> {content?.production.no_of_quantity}
                    </Text>
                    <Text style={styles.infoText}>
                        <Text style={styles.bold}>Created
                            At: </Text> {new Date(content?.created_at).toLocaleDateString() + ' ' + new Date(content?.created_at).toLocaleTimeString()}
                    </Text>
                </View>
            </View>
            <Text style={styles.sectionTitle}>Final Calculation</Text>
            <View style={styles.table}>
                <View style={styles.tableHeader}>
                    <Text style={styles.tableHeaderCell}>Filling</Text>
                    <Text style={styles.tableHeaderCell}>No of Fillings</Text>
                    <Text style={styles.tableHeaderCell}>Per Filling Cost</Text>
                    <Text style={styles.tableHeaderCell}>Total Cost</Text>
                </View>
                {renderFillingCalculations()}
            </View>
            <Text style={styles.sectionTitle}>Filling Calculation</Text>
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
                {content?.filling_calculations.map((item: any, index: number) => (
                    <View key={index} style={styles.tableRow}>
                        <Text style={styles.tableCell}>{index + 1}</Text>
                        <Text style={styles.tableCell}>{item.product?.item_code}</Text>
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
                    <Text style={styles.tableFooterCell}></Text>
                    <Text style={styles.tableFooterCell}>Total</Text>
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
            <View style={styles.footer}>
                <View style={styles.footerContainer}>
                    <Text style={styles.footerText}>
                        <Text>Created By: </Text>
                        {content?.created_by?.name}
                    </Text>
                    <Text style={styles.footerText} render={({ pageNumber, totalPages }) => (
                        `${pageNumber} / ${totalPages}`
                    )} fixed />
                    <Text style={styles.footerText}>
                        <Text>Created At: </Text>
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
    titleContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginVertical: 10
    },
    title: {
        fontSize: 14,
        fontWeight: 'bold'
    },
    subtitle: {
        fontSize: 10,
        marginVertical: 5
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
        width: '100%'
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
        fontWeight: 'bold'
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
        paddingVertical: 5,
        textAlign: 'center'
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
