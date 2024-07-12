import React from 'react';
import { Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import Header from '@/components/Report/Header';
import Footer from '@/components/Report/Footer';

const PrintContent = ({ content }:any) => {
    return (
        <Page size="A4" style={styles.page}>
            <Header />
            <View style={styles.container}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Purchase Order</Text>
                    <Text style={styles.subtitle}>{content?.lpo_number}</Text>
                    <Text style={styles.subtitle}>{new Date(content?.created_at).toLocaleDateString() + ' ' + new Date(content?.created_at).toLocaleTimeString()}</Text>
                </View>
                <View style={styles.infoContainer}>
                    <View style={styles.infoColumn}>
                        <Text style={styles.text}>TO</Text>
                        <Text style={styles.text}>{content?.vendor?.name}</Text>
                        <Text style={styles.text}>{content?.vendor?.address} {content?.vendor?.city?.name}, {content?.vendor?.state?.name}</Text>
                        <Text style={styles.text}>{content?.vendor?.country?.name} {content?.vendor?.postal_code}</Text>
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
                <View style={styles.tableContainer}>
                    <View style={styles.tableHeader}>
                        <Text style={styles.tableHeaderCell}>#</Text>
                        <Text style={styles.tableHeaderCell}>PR</Text>
                        <Text style={styles.tableHeaderCell}>Item</Text>
                        <Text style={styles.tableHeaderCell}>Unit</Text>
                        <Text style={styles.tableHeaderCell}>Unit Price</Text>
                        <Text style={styles.tableHeaderCell}>Qty</Text>
                        <Text style={styles.tableHeaderCell}>Tax</Text>
                        <Text style={styles.tableHeaderCell}>Total</Text>
                    </View>
                    {content?.raw_materials?.map((item:any, index:number) => (
                        <View key={index} style={styles.tableRow}>
                            <Text style={styles.tableCell}>{index + 1}</Text>
                            <View style={styles.tableCell}>
                                <Text style={styles.infoText}>{item.purchase_requisition?.pr_code}</Text>
                                {/*<Text style={styles.infoText}>By: {item.purchase_requisition?.employee?.name}</Text>*/}
                            </View>
                            <Text style={styles.tableCell}>{item.raw_product?.item_code}</Text>
                            <Text style={styles.tableCell}>{item.unit?.name}</Text>
                            <Text style={styles.tableCell}>{item.unit_price.toFixed(2)}</Text>
                            <View style={styles.tableCell}>
                                <Text style={styles.infoText}>{item.processed_quantity}</Text>
                            </View>
                            {/*<View style={styles.tableCell}>*/}
                            {/*    <Text style={styles.infoText}>Requested: {item.request_quantity}</Text>*/}
                            {/*    <Text style={styles.infoText}>Processed: {item.processed_quantity}</Text>*/}
                            {/*</View>*/}
                            <View style={styles.tableCell}>
                                <Text style={styles.infoText}>Category: {item.tax_category ? item.tax_category.name : 'None'}</Text>
                                <Text style={styles.infoText}>Rate: {item.tax_rate.toFixed(2)}</Text>
                                <Text style={styles.infoText}>Amount: {item.tax_amount.toFixed(2)}</Text>
                            </View>
                            <Text style={styles.tableCell}>{((parseFloat(item.processed_quantity) * parseFloat(item.unit_price)) + parseFloat(item.tax_amount)).toFixed(2)}</Text>
                        </View>
                    ))}

                </View>
                {/*<View style={styles.termsContainer}>*/}
                {/*    <Text style={styles.infoText}>Terms and Conditions</Text>*/}
                {/*    <View style={styles.termsText} dangerouslySetInnerHTML={{ __html: content?.terms_conditions }} />*/}
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
        padding: 20,
    },
    container: {
        display: 'flex',
        flexDirection: 'column',
    },
    titleContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginVertical: 10,
    },
    title: {
        fontSize: 11,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 10,
        marginVertical: 5,
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
        width: '48%',
    },
    infoText: {
        fontWeight: 'bold',
        fontSize: 10,
    },
    text: {
        fontSize: 10,
    },
    tableContainer: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        marginTop: 20,
    },
    tableHeader: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottom: '1px solid #000',
        paddingBottom: 4,
        fontWeight: 'bold',
    },
    tableHeaderCell: {
        fontSize: 10,
        textAlign: 'left',
        padding: 2,
    },
    tableRow: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottom: '1px solid #000',
        paddingBottom: 4,
    },
    tableCell: {
        fontSize: 10,
        padding: 2,
        flexShrink: 1,
        textAlign: 'left',
    },
    termsContainer: {
        padding: 10,
        marginTop: 20,
        borderTop: '1px solid #000',
    },
    termsText: {
        fontSize: 10,
    },
});

export default PrintContent;
