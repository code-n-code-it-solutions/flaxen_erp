import { Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import Footer from '@/components/Report/Footer';
import React from 'react';
import Header from '@/components/Report/Header';

const PrintContent = ({ content }: any) => {
    return (
        <Page size="A5" orientation="landscape" style={styles.page}>
            <View
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center'
                    // padding: '0 20px',
                    // marginTop: '5px'
                }}>
                <Text
                    style={{
                        fontSize: 8,
                        color: '#22AAA7'
                    }}
                >
                    <Text style={{ fontWeight: 'bold' }}>Printed At: </Text>
                    {(new Date()).toLocaleDateString() + ' ' + (new Date()).toLocaleTimeString()}
                </Text>
            </View>
            <View
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottomWidth: 1,
                    marginBottom: 5
                }}
            >
                <Image
                    src="https://flaxenpaints.com/uploads/settings/logo2.png"
                    style={{
                        width: '60px',
                        height: '30px'
                    }}
                />
                <View
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'flex-end',
                        flexDirection: 'column',
                        color: '#22AAA7'
                    }}
                >
                    <Text style={{ fontWeight: 'bold', fontSize: 8 }}>Plot # 593 Industrial Area, Umm Al Thuoob Umm Al
                        Quwain, UAE</Text>
                    <Text style={{ fontWeight: 'bold', fontSize: 8 }}>+971 6 766 9442 - info@flaxenpaints.com</Text>
                </View>
            </View>
            {/*<Header /> */}
            <Text style={styles.header}>CUSTOMER RECEIPT</Text>

            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <View>
                    <View style={styles.row}>
                        <Text style={styles.normalText}>Received From: {content.receivedFrom}</Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.label}>Address</Text>
                    </View>
                </View>
                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10 }}>
                        <Text style={styles.normalText}>Voucher No.:</Text>
                        <Text style={styles.normalText}>Date:</Text>
                    </View>
                    <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 10 }}>
                        <Text style={styles.normalText}>{content.voucherNo}</Text>
                        <View style={{ borderWidth: 1, paddingHorizontal: 30, paddingVertical: 5 }}>
                            <Text style={styles.normalText}>{new Date(content.date).toLocaleDateString()}</Text>
                        </View>

                    </View>
                </View>
            </View>

            <View style={styles.amountSection}>
                <Text style={styles.normalText}>THE SUM OF</Text>
                <View style={styles.amountBox}>
                    <Text style={styles.amountText}>{content.amountInWords} ONLY</Text>
                </View>
                <Text style={styles.normalText}>{content.netTotal}</Text>
            </View>

            <View style={styles.row}>
                <View>
                    <Text style={styles.normalText}>Payment Method: {content.paymentMethod}</Text>
                    {content.paymentMethod === 'Bank' && (
                        <View style={{
                            display: 'flex',
                            flexDirection: 'row',
                            gap: 15,
                            // flexWrap: 'wrap',
                            justifyContent: 'space-between',
                            width: '100%'
                        }}>
                            <Text style={styles.normalText}>Transfer Type: {content.bankOption}</Text>
                            <Text style={styles.normalText}>Bank: {content.bank}</Text>
                            <Text style={styles.normalText}>Transfer From: {content.transferFrom}</Text>
                        </View>
                    )}
                </View>
                <Text style={styles.normalText}>Ref/Ch No.: {content.refNo}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.label}>RECEIVED AGAINST</Text>
            </View>

            <View style={styles.table}>
                <View style={styles.tableRow}>
                    <Text style={styles.tableColHeader}>Date</Text>
                    <Text style={styles.tableColHeader}>Invoice No.</Text>
                    <Text style={styles.tableColHeader}>Invoice Amount</Text>
                    <Text style={styles.tableColHeader}>Outstanding</Text>
                    <Text style={styles.tableColHeader}>Paid</Text>
                    <Text style={styles.tableColHeader}>Balance</Text>
                </View>
                {content.items.map((item: any, index: number) => (
                    <View style={styles.tableRow} key={index}>
                        <Text style={styles.tableCol}>{item.date}</Text>
                        <Text style={styles.tableCol}>{item.invoiceNo}</Text>
                        <Text style={styles.tableCol}>{item.invoiceAmount}</Text>
                        <Text style={styles.tableCol}>{item.outstanding}</Text>
                        <Text style={styles.tableCol}>{item.paid}</Text>
                        <Text style={styles.tableCol}>{item.balance}</Text>
                    </View>
                ))}
            </View>

            <View style={[styles.section, styles.totalSection]}>
                <View style={styles.totalColumn}>
                    <Text style={styles.normalText}>Total:</Text>
                    <Text style={styles.normalText}>Discount and Others:</Text>
                    <Text style={styles.normalText}>Net Total:</Text>
                </View>
                <View style={styles.totalColumn}>
                    <Text style={styles.normalText}>{content.total}</Text>
                    <Text style={styles.normalText}>{content.discount}</Text>
                    <Text style={styles.normalText}>{content.netTotal}</Text>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.label}>Narration:</Text>
            </View>

            <View style={[styles.row, { borderBottomWidth: 1 }]}>
                <Text style={styles.normalText}>Received By: {content.receivedBy}</Text>
                <Text style={styles.normalText}>Prepared By: {content.preparedBy}</Text>
                <Text style={styles.normalText}>Checked By</Text>
                <Text style={styles.normalText}>Approved By</Text>
            </View>

            {/*<Text style={styles.footer}>Thank you for your business!</Text>*/}
            <Footer content={content} />
        </Page>
    );
};

export default PrintContent;

const styles = StyleSheet.create({
    page: {
        padding: 15,
        fontSize: 10,
        fontFamily: 'Helvetica'
    },
    header: {
        fontSize: 12,
        textAlign: 'center',
        marginBottom: 10
    },
    section: {
        marginBottom: 10
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5
    },
    label: {
        fontWeight: 'bold',
        fontSize: 10
    },
    normalText: {
        fontSize: 10
    },
    amountSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        marginTop: 10
    },
    amountBox: {
        borderBottom: 1,
        borderStyle: 'solid',
        borderColor: '#000',
        flexGrow: 1,
        marginHorizontal: 5,
        paddingBottom: 3
    },
    amountText: {
        fontSize: 10
    },
    table: {
        display: 'flex',
        width: '100%',
        marginBottom: 5,
        borderStyle: 'solid',
        borderBottomWidth: 1,
        borderTopWidth: 1,
        borderColor: '#000'
    },
    tableRow: {
        flexDirection: 'row'
    },
    tableColHeader: {
        width: '16.66%',
        borderBottom: 1,
        // borderRight: 1,
        borderColor: '#000',
        borderStyle: 'solid',
        textAlign: 'center',
        padding: 5,
        fontWeight: 'bold'
    },
    tableCol: {
        width: '16.66%',
        // borderBottom: 1,
        // borderRight: 1,
        borderColor: '#000',
        borderStyle: 'solid',
        textAlign: 'center',
        padding: 5
    },
    footer: {
        marginTop: 30,
        fontSize: 8,
        textAlign: 'center',
        borderTopWidth: 1,
        borderTopColor: '#000',
        borderTopStyle: 'solid',
        paddingTop: 5
    },
    totalSection: {
        flexDirection: 'row',
        justifyContent: 'flex-end'
        // marginTop: 10,
    },
    totalColumn: {
        flexDirection: 'column',
        alignItems: 'flex-end',
        marginRight: 10
    }
});
