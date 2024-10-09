import React from 'react';
import { Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer';
import Header from '@/components/Report/Header';
import { serverFilePath } from '@/utils/helper';
import Footer from '@/components/Report/Footer';

const PrintContent = ({ content }: any) => {
    return (
        <Page size="A4" style={styles.page}>
            <Header />
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <Text style={styles.bold}>Project Name: </Text>
                    <Text style={styles.text}>{content.name}</Text>
                    <Text style={styles.bold}>Project Code: </Text>
                    <Text style={styles.text}>{content.project_code}</Text>
                </View>
                <View style={styles.tableContainer}>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCell}>Name:</Text>
                        <Text style={styles.tableCell}>{content.name}</Text>
                        <Text style={styles.tableCell}>Email:</Text>
                        <Text style={styles.tableCell}>{content.email}</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCell}>Phone:</Text>
                        <Text style={styles.tableCell}>{content.phone}</Text>
                        <Text style={styles.tableCell}>Opening Balance:</Text>
                        <Text style={styles.tableCell}>{content.opening_balance}</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCell}>Due In Days:</Text>
                        <Text style={styles.tableCell}>{content.due_in_days}</Text>
                        <Text style={styles.tableCell}>Customer Type:</Text>
                        <Text style={styles.tableCell}>{content.customer_type?.name}</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCell}>Opening Balance:</Text>
                        <Text style={styles.tableCell}>{content.opening_balance}</Text>
                        <Text style={styles.tableCell}>Credit Limit:</Text>
                        <Text style={styles.tableCell}>{content.credit_limit}</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCell}>Tax Reg #:</Text>
                        <Text style={styles.tableCell}>{content.tax_registration}</Text>
                        <Text style={styles.tableCell}>Website:</Text>
                        <Text style={styles.tableCell}>{content.website_url}</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCell}>Is Vendor Too?:</Text>
                        <Text style={styles.tableCell}>{content.is_vendor ? 'Yes' : 'No'}</Text>
                        <Text style={styles.tableCell}>Is Allow Invoice More Than Credit?:</Text>
                        <Text style={styles.tableCell}>{content.allow_invoice_more_than_credit ? 'Yes' : 'No'}</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCell}>Address:</Text>
                        <Text style={styles.tableCell}>
                            {content.address} {content.city} {content?.state}, {content.country}, {content.postal_code}
                        </Text>
                    </View>
                </View>
                <Text style={styles.sectionTitle}>Customer Contact Persons:</Text>
                <View style={styles.tableContainer}>
                    <View style={styles.tableHeader}>
                        <Text style={styles.tableHeaderCell}>Photo</Text>
                        <Text style={styles.tableHeaderCell}>Name</Text>
                        <Text style={styles.tableHeaderCell}>Phone</Text>
                        <Text style={styles.tableHeaderCell}>Email</Text>
                        <Text style={styles.tableHeaderCell}>Address</Text>
                    </View>
                    {content?.contact_persons?.length > 0 ? (
                        content?.contact_persons?.map((rep: any, index: number) => (
                            <View key={index} style={styles.tableRow}>
                                <Image style={styles.photo} src={serverFilePath(rep.thumbnail?.path)} />
                                <Text style={styles.tableCell}>{rep.name}</Text>
                                <Text style={styles.tableCell}>{rep.phone}</Text>
                                <Text style={styles.tableCell}>{rep.email}</Text>
                                <Text
                                    style={styles.tableCell}>{rep.address} {rep.city} {rep.state}, {rep.country}, {rep.postal_code}</Text>
                            </View>
                        ))
                    ) : (
                        <View style={styles.tableRow}>
                            <Text style={styles.tableCell}>No Representatives Found</Text>
                        </View>
                    )}
                </View>
                <Text style={styles.sectionTitle}>Customer Addresses:</Text>
                <View style={styles.tableContainer}>
                    <View style={styles.tableHeader}>
                        <Text style={styles.tableHeaderCell}>Address Type</Text>
                        <Text style={styles.tableHeaderCell}>Country</Text>
                        <Text style={styles.tableHeaderCell}>State</Text>
                        <Text style={styles.tableHeaderCell}>City</Text>
                        <Text style={styles.tableHeaderCell}>Address</Text>
                        <Text style={styles.tableHeaderCell}>Postal Code</Text>
                    </View>
                    {content?.addresses?.length > 0 ? (
                        content?.addresses?.map((address: any, index: number) => (
                            <View key={index} style={styles.tableRow}>
                                <Text style={styles.tableCell}>{address.address_type_name}</Text>
                                <Text style={styles.tableCell}>{address.country?.name}</Text>
                                <Text style={styles.tableCell}>{address.state?.name}</Text>
                                <Text style={styles.tableCell}>{address.city?.name}</Text>
                                <Text style={styles.tableCell}>{address.address}</Text>
                                <Text style={styles.tableCell}>{address.postal_code}</Text>
                            </View>
                        ))
                    ) : (
                        <View style={styles.tableRow}>
                            <Text style={styles.tableCell}>No Addresses Found</Text>
                        </View>
                    )}
                </View>
                <Text style={styles.sectionTitle}>Bank Details:</Text>
                <View style={styles.tableContainer}>
                    <View style={styles.tableHeader}>
                        <Text style={styles.tableHeaderCell}>Bank</Text>
                        <Text style={styles.tableHeaderCell}>Account Number</Text>
                        <Text style={styles.tableHeaderCell}>Account Title</Text>
                        <Text style={styles.tableHeaderCell}>IBAN</Text>
                        <Text style={styles.tableHeaderCell}>Currency</Text>
                    </View>
                    {content?.bank_accounts?.length > 0 ? (
                        content?.bank_accounts?.map((bank: any, index: number) => (
                            <View key={index} style={styles.tableRow}>
                                <Text style={styles.tableCell}>{bank.bank?.name}</Text>
                                <Text style={styles.tableCell}>{bank.account_number}</Text>
                                <Text style={styles.tableCell}>{bank.account_title}</Text>
                                <Text style={styles.tableCell}>{bank.iban}</Text>
                                <Text style={styles.tableCell}>{bank.currency?.code}</Text>
                            </View>
                        ))
                    ) : (
                        <View style={styles.tableRow}>
                            <Text style={styles.tableCell}>No Bank Details Found</Text>
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
        flexDirection: 'column',
        marginTop: 20
    },
    headerContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10
    },
    bold: {
        fontWeight: 'bold',
        fontSize: 10
    },
    text: {
        fontSize: 10
    },
    tableContainer: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        marginTop: 10,
        borderWidth: 1,
        borderColor: '#000'
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
        flex: 1,
        padding: 2
    },
    tableHeader: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: '#000',
        backgroundColor: '#f0f0f0',
        padding: 4,
        fontWeight: 'bold'
    },
    tableHeaderCell: {
        fontSize: 10,
        textAlign: 'left',
        flex: 1
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10
    },
    photo: {
        width: 20,
        height: 20,
        borderRadius: 20
    }
});

export default PrintContent;
