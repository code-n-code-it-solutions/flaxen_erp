import React from 'react';
import { Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import Header from '@/components/Report/Header';

const PrintContent = ({ content, items }: any) => {
    const totalDueAmount = content?.vendor_bill_payment_details?.reduce(
        (a: number, b: any) => a + parseFloat(b.due_amount),
        0
    );
    const totalPaidAmount = content?.vendor_bill_payment_details?.reduce(
        (a: number, b: any) => a + parseFloat(b.paid_amount),
        0
    );

    return (
        <Page size="A4" style={styles.page}>
            <Header />
            <View style={styles.container}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Vendor Payment Detail</Text>
                </View>
                <View style={styles.header}>
                    <View style={styles.column}>
                        <Text>
                            <Text style={styles.bold}>Payment Code: </Text>
                            {content?.payment_code}
                        </Text>
                        <Text>
                            <Text style={styles.bold}>Payment Reference: </Text>
                            {content?.reference_no}
                        </Text>
                        <Text>
                            <Text style={styles.bold}>Payment Date: </Text>
                            {content?.payment_date}
                        </Text>
                    </View>
                    <View style={styles.column}>
                        <Text>
                            <Text style={styles.bold}>Paying Account: </Text>
                            {content?.paying_account?.code +
                                ' - ' +
                                content?.paying_account?.name}
                        </Text>
                        <Text>
                            <Text style={styles.bold}>Payment Method: </Text>
                            {content?.payment_method?.name}
                        </Text>
                        <Text>
                            <Text style={styles.bold}>Vendor: </Text>
                            {content?.vendor?.name}
                        </Text>
                    </View>
                </View>

                {/* Item Details Table */}
                <Text style={styles.sectionTitle}>Item Details</Text>
                <View style={styles.table}>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableHeaderCell}>Bill Code</Text>
                        <Text style={styles.tableHeaderCell}>Ref #</Text>
                        <Text style={styles.tableHeaderCell}>Bill Date</Text>
                        <Text style={styles.tableHeaderCell}>Due Date/Terms</Text>
                        <Text style={styles.tableHeaderCell}>Due Amount</Text>
                        <Text style={styles.tableHeaderCell}>Paid Amount</Text>
                    </View>

                    {content?.vendor_bill_payment_details?.length > 0 ? (
                        content?.vendor_bill_payment_details?.map(
                            (item: any, index: number) => (
                                <View key={index} style={styles.tableRow}>
                                    <Text style={styles.tableCell}>{item.vendor_bill?.bill_number}</Text>
                                    <Text style={styles.tableCell}>{item.vendor_bill?.bill_reference}</Text>
                                    <Text style={styles.tableCell}>{item.vendor_bill?.bill_date}</Text>
                                    <Text style={styles.tableCell}>
                                        {item.vendor_bill?.due_date
                                            ? item.vendor_bill?.due_date
                                            : item.vendor_bill?.payment_terms + ' Days'}
                                    </Text>
                                    <Text style={styles.tableCell}>
                                        {parseFloat(item.due_amount).toLocaleString(undefined, {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        })}
                                    </Text>
                                    <Text style={styles.tableCell}>
                                        {parseFloat(item.paid_amount).toLocaleString(undefined, {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        })}
                                    </Text>
                                </View>
                            )
                        )
                    ) : (
                        <View style={styles.tableRow}>
                            <Text style={[styles.tableCell, {width: '100%'}]}>
                                No items found
                            </Text>
                        </View>
                    )}

                    {/* Total Row */}
                    <View style={styles.tableRow}>
                        <Text style={[styles.tableCell, { flex: 4, textAlign: 'center', fontWeight: 'bold' }]}>
                            Total:
                        </Text>
                        <Text style={[styles.tableCell, { fontWeight: 'bold' }]}>
                            {totalDueAmount.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            })}
                        </Text>
                        <Text style={[styles.tableCell, { fontWeight: 'bold' }]}>
                            {totalPaidAmount.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            })}
                        </Text>
                    </View>
                </View>
            </View>
        </Page>
    );
};

const styles = StyleSheet.create({
    page: {
        padding: 20,
        fontSize: 10,
    },
    container: {
        width: '100%',
        flexDirection: 'column',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
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
    column: {
        flexDirection: 'column',
        gap: 10,
    },
    bold: {
        fontWeight: 'bold',
    },
    sectionTitle: {
        marginTop: 10,
        fontSize: 12,
        fontWeight: 'bold',
    },
    table: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        borderTopWidth: 1,
        borderTopColor: '#000',
    },
    tableRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: '#000',
        paddingVertical: 5,
    },
    tableHeaderCell: {
        width: '16%',
        fontWeight: 'bold',
        textAlign: 'left',
    },
    tableCell: {
        width: '16%',
        textAlign: 'left',
    },
});

export default PrintContent;
