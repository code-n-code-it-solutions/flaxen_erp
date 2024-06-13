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
                            {content?.local_purchase_orders[0]?.vendor?.name}
                        </Text>
                        <Text style={styles.text}>
                            {content?.local_purchase_orders[0]?.vendor?.address} {content?.local_purchase_orders[0]?.vendor?.city?.name},
                            {content?.local_purchase_orders[0]?.vendor?.state?.name}
                        </Text>
                        <Text style={styles.text}>
                            {content?.local_purchase_orders[0]?.vendor?.country?.name} {content?.local_purchase_orders[0]?.vendor?.postal_code}
                        </Text>
                        <Text style={styles.text}>
                            {content?.local_purchase_orders[0]?.vendor?.phone}
                        </Text>
                        <Text style={styles.bold}>
                            Rep: {content?.local_purchase_orders[0]?.vendor_representative.name}
                        </Text>
                        <Text style={styles.bold}>
                            Rep Ph: {content?.local_purchase_orders[0]?.vendor_representative.phone}
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
                        <Text style={styles.tableHeaderCell}>#</Text>
                        <Text style={styles.tableHeaderCell}>PR</Text>
                        <Text style={styles.tableHeaderCell}>LPO</Text>
                        <Text style={styles.tableHeaderCell}>Item</Text>
                        <Text style={styles.tableHeaderCell}>Unit</Text>
                        <Text style={styles.tableHeaderCell}>Qty</Text>
                        <Text style={styles.tableHeaderCell}>R. Qty</Text>
                        {/*<Text style={styles.tableHeaderCell}>Unit Price</Text>*/}
                        {/*<Text style={styles.tableHeaderCell}>Tax Category</Text>*/}
                        {/*<Text style={styles.tableHeaderCell}>Tax Rate</Text>*/}
                        {/*<Text style={styles.tableHeaderCell}>Tax Amount</Text>*/}
                        {/*<Text style={styles.tableHeaderCell}>Total</Text>*/}
                    </View>
                    {content?.raw_products?.map((item: any, index: number) => (
                        <View key={index} style={styles.tableRow}>
                            <Text style={styles.tableCell}>{index + 1}</Text>
                            <Text style={styles.tableCell}>{item.purchase_requisition?.pr_code}</Text>
                            <Text style={styles.tableCell}>{item.local_purchase_order?.lpo_number}</Text>
                            <Text style={styles.tableCell}>{item.raw_product?.item_code}</Text>
                            <Text style={styles.tableCell}>{item.unit?.name}</Text>
                            <Text style={styles.tableCell}>{item.quantity}</Text>
                            <Text style={styles.tableCell}>{item.received_quantity}</Text>
                            {/*<Text style={styles.tableCell}>{item.unit_price.toFixed(2)}</Text>*/}
                            {/*<Text style={styles.tableCell}>{item.tax_category ? item.tax_category.name : 'None'}</Text>*/}
                            {/*<Text style={styles.tableCell}>{item.tax_rate.toFixed(2)}</Text>*/}
                            {/*<Text style={styles.tableCell}>{item.tax_amount.toFixed(2)}</Text>*/}
                            {/*<Text style={styles.tableCell}>{item.grand_total.toFixed(2)}</Text>*/}
                        </View>
                    ))}
                </View>
                {/*<View style={styles.tableFooter}>*/}
                {/*    <Text style={styles.tableFooterCell}>Total Without Tax</Text>*/}
                {/*    <Text style={styles.tableFooterCell}>*/}
                {/*        {content?.raw_products?.reduce((acc:number, item:any) => acc + item.sub_total, 0).toFixed(2)}*/}
                {/*    </Text>*/}
                {/*</View>*/}
                {/*<View style={styles.tableFooter}>*/}
                {/*    <Text style={styles.tableFooterCell}>VAT</Text>*/}
                {/*    <Text style={styles.tableFooterCell}>*/}
                {/*        {content?.raw_products?.reduce((acc:number, item:any) => acc + item.tax_amount, 0).toFixed(2)}*/}
                {/*    </Text>*/}
                {/*</View>*/}
                {/*<View style={styles.tableFooter}>*/}
                {/*    <Text style={styles.tableFooterCell}>Grand Total</Text>*/}
                {/*    <Text style={styles.tableFooterCell}>*/}
                {/*        {content?.raw_products?.reduce((acc:number, item:any) => acc + item.grand_total, 0).toFixed(2)}*/}
                {/*    </Text>*/}
                {/*</View>*/}
                {/*<View style={styles.termsContainer}>*/}
                {/*    <Text style={styles.bold}>Terms and Conditions</Text>*/}
                {/*    <View style={styles.termsText}*/}
                {/*          dangerouslySetInnerHTML={{ __html: content?.local_purchase_order?.terms_conditions }} />*/}
                {/*</View>*/}
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
        flex: 1
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
        flex: 1
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
        flex: 1,
        textAlign: 'left'
    },
    termsContainer: {
        padding: 10,
        marginTop: 20,
        borderTopWidth: 1,
        borderTopColor: '#000'
    },
    termsText: {
        fontSize: 10
    }
});

export default PrintContent;
