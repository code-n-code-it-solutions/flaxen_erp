import React from 'react';
import { Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import Header from '@/components/Report/Header';
import Footer from '@/components/Report/Footer';

const PrintContent = ({ content }: any) => {
    const renderItems = () => {
        if (content?.type === 'Material') {
            return content?.purchase_requisition_items?.map((item: any, index: number) => (
                <View key={index} style={styles.tableRow}>
                    <Text style={{ textAlign: 'center', ...styles.tableCell, ...styles.cellWidthSmall }}>
                        {index + 1}
                    </Text>
                    <Text style={{ textAlign: 'center', ...styles.tableCell, ...styles.cellWidth }}>
                        {item.raw_product?.item_code}
                    </Text>
                    <Text style={{ textAlign: 'center', ...styles.tableCell, ...styles.cellWidth }}>
                        {item.unit?.name}
                    </Text>
                    {/*<Text style={{ textAlign: 'center', ...styles.tableCell, ...styles.cellWidth }}>*/}
                    {/*    {parseFloat(item.unit_price).toFixed(2)}*/}
                    {/*</Text>*/}


                    <View style={{ textAlign: 'center', ...styles.tableCell, ...styles.cellWidth }}>
                        <Text>
                            {parseFloat(item.request_quantity).toFixed(2)}
                        </Text>
                    </View>
                    <View style={{ textAlign: 'center', ...styles.tableCell, ...styles.cellWidth }}>
                        <Text>
                            {parseFloat(item.processed_quantity).toFixed(2)}
                        </Text>
                    </View>
                    <View style={{ textAlign: 'center', ...styles.tableCell, ...styles.cellWidth }}>
                        <Text>
                            {parseFloat(item.remaining_quantity).toFixed(2)}
                        </Text>
                    </View>
                    <Text style={{ textAlign: 'center', ...styles.tableCell, ...styles.cellWidth }}>
                        {item.status}
                    </Text>
                </View>
            ));
        } else {
            return content?.purchase_requisition_services?.map((item: any, index: number) => (
                <View key={index} style={styles.tableRow}>
                    <Text style={{ ...styles.tableCell, ...styles.cellWidthSmall }}>{index + 1}</Text>
                    <View style={{ ...styles.tableCell, ...styles.cellWidth }}>
                        {item.asset_ids?.map((asset: any, idx: number) => (
                            <Text key={idx}>{`${asset.name} (${asset.code})`}</Text>
                        ))}
                    </View>
                    <Text style={{ ...styles.tableCell, ...styles.cellWidth }}>{item?.service_name}</Text>
                    <Text style={{ ...styles.tableCell, ...styles.cellWidth }}>{item.description}</Text>
                    <Text style={{ ...styles.tableCell, ...styles.cellWidth }}>{item.quantity}</Text>
                </View>
            ));
        }
    };

    return (
        <Page size="A4" style={styles.page}>
            <Header />
            <View style={styles.titleContainer}>
                <Text style={styles.title}>Purchase Requisition</Text>
            </View>
            <View style={styles.container}>
                <View style={styles.infoContainer}>
                    <View style={styles.infoColumn}>
                        <Text style={styles.infoText}><Text style={styles.bold}>Requisition
                            Date: </Text> {content?.requisition_date}</Text>
                        <Text style={styles.infoText}><Text style={styles.bold}>Requisition
                            Title: </Text> {content?.pr_title}</Text>
                        <Text style={styles.infoText}><Text style={styles.bold}>Requisition
                            Code: </Text> {content?.pr_code}</Text>
                        <Text style={styles.infoText}><Text
                            style={styles.bold}>Date: </Text> {new Date(content?.created_at).toDateString()}</Text>
                    </View>
                    <View style={styles.infoColumn}>
                        <Text style={styles.infoText}><Text style={styles.bold}>Requisition
                            Status: </Text> {content?.status}</Text>
                        <Text style={styles.infoText}><Text style={styles.bold}>Requested
                            By: </Text> {content?.employee?.name}</Text>
                        <Text style={styles.infoText}><Text
                            style={styles.bold}>Department: </Text> {content?.department ? content?.department?.name : 'N/A'}
                        </Text>
                        <Text style={styles.infoText}><Text
                            style={styles.bold}>Designation: </Text> {content?.designation ? content?.designation?.name : 'N/A'}
                        </Text>
                    </View>
                </View>
                <Text style={styles.sectionTitle}>Requested Items</Text>
                <View style={styles.table}>
                    <View style={styles.tableHeader}>
                        {content?.type === 'Material' ? (
                            <>
                                <Text style={{ ...styles.tableHeaderCell, ...styles.cellWidthSmall }}>#</Text>
                                <Text style={{ ...styles.tableHeaderCell, ...styles.cellWidth }}>Item</Text>
                                <Text style={{ ...styles.tableHeaderCell, ...styles.cellWidth }}>Unit</Text>
                                {/*<Text style={{ ...styles.tableHeaderCell, ...styles.cellWidth }}>Unit Price</Text>*/}
                                <Text style={{ ...styles.tableHeaderCell, ...styles.cellWidth }}>Requested</Text>
                                <Text style={{ ...styles.tableHeaderCell, ...styles.cellWidth }}>Processed</Text>
                                <Text style={{ ...styles.tableHeaderCell, ...styles.cellWidth }}>Remaining</Text>
                                <Text style={{ ...styles.tableHeaderCell, ...styles.cellWidth }}>Status</Text>
                            </>
                        ) : (
                            <>
                                <Text style={{ ...styles.tableHeaderCell, ...styles.cellWidthSmall }}>#</Text>
                                <Text style={{ ...styles.tableHeaderCell, ...styles.cellWidth }}>Assets</Text>
                                <Text style={{ ...styles.tableHeaderCell, ...styles.cellWidth }}>Service Name</Text>
                                <Text style={{ ...styles.tableHeaderCell, ...styles.cellWidth }}>Description</Text>
                                <Text style={{ ...styles.tableHeaderCell, ...styles.cellWidth }}>Quantity</Text>
                            </>
                        )}
                    </View>
                    {renderItems()}
                    {content?.type === 'Material' && (
                        <View style={styles.tableFooter}>
                            <Text style={{ ...styles.tableFooterCell, ...styles.cellWidthSmall }}></Text>
                            <Text style={{ ...styles.tableFooterCell, ...styles.cellWidth }}>Total</Text>
                            <Text style={{ ...styles.tableFooterCell, ...styles.cellWidth }}></Text>
                            <Text style={{ ...styles.tableFooterCell, ...styles.cellWidth }}>
                                {content?.purchase_requisition_items?.reduce((acc: number, item: any) => acc + parseFloat(item.request_quantity), 0).toFixed(2)}
                            </Text>
                            <Text style={{ ...styles.tableFooterCell, ...styles.cellWidth }}>
                                {content?.purchase_requisition_items?.reduce((acc: number, item: any) => acc + parseFloat(item.processed_quantity), 0).toFixed(2)}
                            </Text>
                            <Text style={{ ...styles.tableFooterCell, ...styles.cellWidth }}>
                                {content?.purchase_requisition_items?.reduce((acc: number, item: any) => acc + parseFloat(item.remaining_quantity), 0).toFixed(2)}
                            </Text>
                            <Text style={{ ...styles.tableFooterCell, ...styles.cellWidth }}></Text>
                        </View>
                    )}
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
        fontSize: 14,
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
    bold: {
        fontWeight: 'bold'
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
        fontSize: 10,
        paddingVertical: 5
    },
    tableFooter: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTop: '1px solid #000',
        paddingTop: 5
    },
    tableFooterCell: {
        fontSize: 10,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    cellWidthSmall: {
        width: '7%'
    },
    cellWidth: {
        width: '20%'
    }
});

export default PrintContent;
