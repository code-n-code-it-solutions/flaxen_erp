import React from 'react';
import { Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import Header from '@/components/Report/Header';
import { fontSize } from 'html2canvas/dist/types/css/property-descriptors/font-size';

const PrintContent = ({ content }:any) => {
    return (
        <Page size="A4" style={styles.page}>
            <Header />
            <View style={styles.titleContainer}>
                <Text style={styles.title}>Production</Text>
                <Text style={styles.subtitle}>
                    {content?.batch_number}
                </Text>
            </View>
            <View style={styles.infoContainer}>
                <View style={styles.infoColumn}>
                    <Text style={styles.infoText}>
                        <Text style={styles.bold}>No of Quantity (KG): </Text> {content?.no_of_quantity}
                    </Text>
                    <Text style={styles.infoText}>
                        <Text style={styles.bold}>Formula: </Text> {content?.product_assembly?.formula_name + ' - ' + content?.product_assembly?.formula_code}
                    </Text>
                    <Text style={styles.infoText}>
                        <Text style={styles.bold}>Lab Reference: </Text> {content?.lab_reference}
                    </Text>
                </View>
                <View style={styles.infoColumn}>
                    <Text style={styles.infoText}>
                        <Text style={styles.bold}>Color Code: </Text> {content?.product_assembly?.color_code?.code} ({content?.product_assembly?.color_code?.hex_code})
                    </Text>
                    <Text style={styles.infoText}>
                        <Text style={styles.bold}>Category: </Text> {content?.product_assembly?.category?.name}
                    </Text>
                </View>
            </View>
            <Text style={styles.sectionTitle}>Product Details:</Text>
            <View style={styles.table}>
                <View style={styles.tableHeader}>
                    <Text style={styles.tableHeaderCell}>Sr. No</Text>
                    <Text style={styles.tableHeaderCell}>Product</Text>
                    <Text style={styles.tableHeaderCell}>Unit</Text>
                    <Text style={styles.tableHeaderCell}>Unit Price</Text>
                    <Text style={styles.tableHeaderCell}>Qty</Text>
                    <Text style={styles.tableHeaderCell}>Available Qty</Text>
                    <Text style={styles.tableHeaderCell}>Req Qty</Text>
                    <Text style={styles.tableHeaderCell}>Total Cost</Text>
                </View>
                {content?.production_items?.map((item:any, index:number) => (
                    <View key={index} style={styles.tableRow}>
                        <Text style={styles.tableCell}>{index + 1}</Text>
                        <Text style={styles.tableCell}>{item.product?.item_code}</Text>
                        <Text style={styles.tableCell}>{item.unit?.name}</Text>
                        <Text style={styles.tableCell}>{item.unit_cost}</Text>
                        <Text style={styles.tableCell}>{item.quantity}</Text>
                        <Text style={styles.tableCell}>{item.available_quantity}</Text>
                        <Text style={styles.tableCell}>{item.required_quantity}</Text>
                        <Text style={styles.tableCell}>{((parseFloat(item.unit_cost) * parseFloat(item.quantity) * parseFloat(content.no_of_quantity)) / parseFloat(item.quantity)).toFixed(2)}</Text>
                    </View>
                ))}
                <View style={styles.tableFooter}>
                    <Text style={styles.tableFooterCell}>Total</Text>
                    <Text style={styles.tableFooterCell}>{content?.production_items?.reduce((total:number, item:any) => total + parseFloat(item.unit_cost), 0).toFixed(2)}</Text>
                    <Text style={styles.tableFooterCell}>{content?.production_items?.reduce((total:number, item:any) => total + parseFloat(item.quantity), 0).toFixed(2)}</Text>
                    <Text style={styles.tableFooterCell}>{content?.production_items?.reduce((total:number, item:any) => total + parseFloat(item.available_quantity), 0).toFixed(2)}</Text>
                    <Text style={styles.tableFooterCell}>{content?.production_items?.reduce((total:number, item:any) => total + parseFloat(item.required_quantity), 0).toFixed(2)}</Text>
                    <Text style={styles.tableFooterCell}>{content?.production_items?.reduce((total:number, item:any) => total + ((parseFloat(item.unit_cost) * parseFloat(item.quantity) * parseFloat(content.no_of_quantity)) / parseFloat(item.quantity)), 0).toFixed(2)}</Text>
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
        padding: 20,
    },
    titleContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginVertical: 10,
    },
    title: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 10,
        marginVertical: 5,
    },
    bold: {
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
        gap: 3,
    },
    infoText: {
        fontSize: 10,
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
    },
    tableHeader: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottom: '1px solid #000',
        paddingBottom: 4,
    },
    tableHeaderCell: {
        width: '12%',
        fontSize: 10,
        fontWeight: 'bold',
    },
    tableRow: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottom: '1px solid #000',
        paddingBottom: 4,
    },
    tableCell: {
        width: '12%',
        fontSize: 10,
        paddingVertical: 5,
    },
    tableFooter: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTop: '1px solid #000',
        paddingTop: 5,
    },
    tableFooterCell: {
        width: '12%',
        fontSize: 10,
        fontWeight: 'bold',
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
