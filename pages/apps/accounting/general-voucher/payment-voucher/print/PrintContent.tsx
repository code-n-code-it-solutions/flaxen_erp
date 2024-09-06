import React from 'react';
import { Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import Header from '@/components/Report/Header';
import Footer from '@/components/Report/Footer';

const PrintContent = ({ content }: any) => {

    return (
        <Page size="A4" style={styles.page} wrap>
            <Header />
            <View style={styles.container}>
                {/* General Payment Voucher Details */}
                {content && (
                    <View>
                        <View style={styles.flexRow}>
                            {/* Left Column */}
                            <View style={styles.infoColumn}>
                                <Text style={styles.text}>
                                    <Text style={styles.bold}>GPV Code: </Text>
                                    {content?.payment_voucher_code}
                                </Text>
                                <Text style={styles.text}>
                                    <Text style={styles.bold}>GPV Date: </Text>
                                    {content?.payment_date}
                                </Text>
                                <Text style={styles.text}>
                                    <Text style={styles.bold}>Reference #: </Text>
                                    {content?.reference_no}
                                </Text>
                                <Text style={styles.text}>
                                    <Text style={styles.bold}>Paying Account: </Text>
                                    {content?.paying_account?.code + ' - ' + content?.paying_account?.name}
                                </Text>
                                <Text style={styles.text}>
                                    <Text style={styles.bold}>Payment Method: </Text>
                                    {content?.payment_method?.name}
                                </Text>

                                {/* Payment Sub-method */}
                                {content.payment_method?.name === 'Bank' && content.payment_sub_method && (
                                    <>
                                        <Text style={styles.text}>
                                            <Text style={styles.bold}>Payment Sub Method: </Text>
                                            {content.payment_sub_method}
                                        </Text>
                                        {content.payment_sub_method === 'credit-card' ||
                                        content.payment_sub_method === 'online-transfer' ? (
                                            <Text style={styles.text}>
                                                <Text style={styles.bold}>Transaction Number: </Text>
                                                {content.transaction_number}
                                            </Text>
                                        ) : content.payment_sub_method === 'cheque' && (
                                            <Text style={styles.text}>
                                                <Text style={styles.bold}>Payment Sub Method: </Text>
                                                {content.payment_sub_method}
                                            </Text>
                                        )}
                                    </>
                                )}
                            </View>

                            {/* Right Column */}
                            <View style={styles.infoColumn}>
                                <Text style={styles.text}>
                                    <Text style={styles.bold}>Payment To: </Text>
                                    {content?.subject_category}
                                </Text>
                                <Text style={styles.text}>
                                    <Text style={styles.bold}>Paid To: </Text>
                                    {content?.subject?.name}
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

                        {/* Narration */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Narration:</Text>
                            <Text style={styles.text}>{content?.description}</Text>
                        </View>

                        {/* Cheque Details */}
                        {content.payment_method?.name === 'Bank' && content.payment_sub_method === 'cheque' && (
                            <>
                                <Text style={styles.sectionTitle}>Cheque Details</Text>
                                <View style={styles.table}>
                                    <View style={styles.tableHeader}>
                                        <Text style={[styles.tableHeaderCell, { width: '20%' }]}>Bank</Text>
                                        <Text style={[styles.tableHeaderCell, { width: '20%' }]}>Name on Cheque</Text>
                                        <Text style={[styles.tableHeaderCell, { width: '20%' }]}>Cheque Number</Text>
                                        <Text style={[styles.tableHeaderCell, { width: '20%' }]}>Cheque Date</Text>
                                        <Text style={[styles.tableHeaderCell, { width: '20%' }]}>Cheque Amount</Text>
                                        <Text style={[styles.tableHeaderCell, { width: '10%' }]}>Is PDC</Text>
                                    </View>
                                    {content.cheques.length > 0 ? (
                                        content.cheques.map((cheque: any, index: number) => (
                                            <View key={index} style={styles.tableRow}>
                                                <Text style={[styles.tableCell, { width: '20%' }]}>{cheque.bank?.name}</Text>
                                                <Text style={[styles.tableCell, { width: '20%' }]}>{cheque.cheque_name}</Text>
                                                <Text style={[styles.tableCell, { width: '20%' }]}>{cheque.cheque_number}</Text>
                                                <Text style={[styles.tableCell, { width: '20%' }]}>{cheque.cheque_date}</Text>
                                                <Text style={[styles.tableCell, { width: '20%' }]}>{cheque.cheque_amount}</Text>
                                                <Text style={[styles.tableCell, { width: '10%' }]}>{cheque.is_pdc ? 'Yes' : 'No'}</Text>
                                            </View>
                                        ))
                                    ) : (
                                        <View style={styles.tableRow}>
                                            <Text style={styles.textCenter}>No cheque found</Text>
                                        </View>
                                    )}
                                </View>
                            </>
                        )}

                        {/* Item Details */}
                        <View>
                            <Text style={styles.sectionTitle}>Item Details</Text>
                            <View style={styles.table}>
                                {/* Table Header */}
                                <View style={styles.tableHeader}>
                                    <Text style={styles.tableHeaderCell}>Expense Account</Text>
                                    <Text style={styles.tableHeaderCell}>Payment For</Text>
                                    <Text style={styles.tableHeaderCell}>Quantity</Text>
                                    <Text style={styles.tableHeaderCell}>Unit Cost</Text>
                                    <Text style={styles.tableHeaderCell}>Before Tax</Text>
                                    <Text style={styles.tableHeaderCell}>Discount</Text>
                                    <Text style={styles.tableHeaderCell}>Sub Total</Text>
                                    <Text style={styles.tableHeaderCell}>Tax@5%</Text>
                                    <Text style={styles.tableHeaderCell}>Grand Total</Text>
                                </View>

                                {/* Table Body */}
                                {content.payment_items.length > 0 ? (
                                    content.payment_items.map((item: any, index: number) => (
                                        <View key={index} style={styles.tableRow}>
                                            <Text style={styles.tableCell}>
                                                {item.expanse_account?.code + ' - ' + item.expanse_account?.name}
                                            </Text>
                                            <Text style={styles.tableCell}>{item.payment_for}</Text>
                                            <Text style={styles.tableCell}>{item.quantity}</Text>
                                            <Text style={styles.tableCell}>{item.amount.toFixed(2)}</Text>
                                            <Text style={styles.tableCell}>
                                                {(item.quantity * item.amount).toFixed(2)}
                                            </Text>
                                            <Text style={styles.tableCell}>
                                                {item.discount ? item.discount.toFixed(2) : 'N/A'}
                                            </Text>
                                            <Text style={styles.tableCell}>
                                                {((item.quantity * item.amount) - item.discount).toFixed(2)}
                                            </Text>
                                            <Text style={styles.tableCell}>
                                                {item.has_tax ? item.tax_amount.toFixed(2) : 'N/A'}
                                            </Text>
                                            <Text style={styles.tableCell}>
                                                {item.grand_total.toFixed(2)}
                                            </Text>
                                        </View>
                                    ))
                                ) : (
                                    <View style={styles.tableRow}>
                                        <Text style={styles.textCenter}>No items found</Text>
                                    </View>
                                )}

                                {/* Table Footer (Totals) */}
                                <View style={styles.tableFooter}>
                                    <Text style={styles.tableCell}></Text>
                                    <Text style={styles.tableCell}></Text>
                                    <Text style={styles.tableCell}>
                                        {content.payment_items.reduce((acc: number, item: any) => acc + item.quantity, 0).toFixed(2)}
                                    </Text>
                                    <Text style={styles.tableCell}></Text>
                                    <Text style={styles.tableCell}>
                                        {content.payment_items.reduce((acc: number, item: any) => acc + (item.quantity * item.amount), 0).toFixed(2)}
                                    </Text>
                                    <Text style={styles.tableCell}>
                                        {content.payment_items.reduce((acc: number, item: any) => acc + item.discount, 0).toFixed(2)}
                                    </Text>
                                    <Text style={styles.tableCell}>
                                        {content.payment_items.reduce((acc: number, item: any) => acc + ((item.quantity * item.amount) - item.discount), 0).toFixed(2)}
                                    </Text>
                                    <Text style={styles.tableCell}></Text>
                                    <Text style={styles.tableCell}>
                                        {content.payment_items.reduce((acc: number, item: any) => acc + item.grand_total, 0).toFixed(2)}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                )}
            </View>
            <Footer content={content} />
        </Page>
    );
};

// Styles
const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        padding: 20
    },
    container: {
        flexDirection: 'column',
        marginTop: 20
    },
    flexRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 10
    },
    infoColumn: {
        flexDirection: 'column',
        width: '45%'
    },
    section: {
        marginTop: 15
    },
    sectionTitle: {
        fontWeight: 'bold',
        marginBottom: 5
    },
    text: {
        fontSize: 10
    },
    bold: {
        fontWeight: 'bold'
    },
    table: {
        borderWidth: 1,
        borderColor: '#000',
        marginTop: 10
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#f0f0f0',
        padding: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#000'
    },
    tableHeaderCell: {
        width: '11%',
        fontSize: 9,
        fontWeight: 'bold',
        textAlign: 'left'
    },
    tableRow: {
        flexDirection: 'row',
        padding: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#000'
    },
    tableCell: {
        width: '11%',
        fontSize: 9,
        textAlign: 'left'
    },
    tableFooter: {
        flexDirection: 'row',
        padding: 5
    },
    textCenter: {
        textAlign: 'center',
        width: '100%'
    }
});

export default PrintContent;
