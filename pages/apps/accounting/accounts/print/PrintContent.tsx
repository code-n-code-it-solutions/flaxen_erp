import React from 'react';
import { Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import Header from '@/components/Report/Header';
import Footer from '@/components/Report/Footer';

const PrintContent = ({ accounts, totals }: any) => {
    // console.log(totals);

    const renderRows = (account: any, level = 0) => {

        return (
            <View key={account.id}>
                <View style={[styles.tableRow, { paddingLeft: level * 10 }]}>
                    <Text style={[styles.tableCell, styles.cellWidthSmall]}>
                        {account.code}
                    </Text>
                    <Text style={[styles.tableCell, styles.cellWidthLarge]}>
                        {account.name}
                    </Text>
                    <Text style={[styles.tableCell, styles.textRight]}>
                        {account.totals.debit?.toFixed(2) || '0.00'}
                    </Text>
                    <Text style={[styles.tableCell, styles.textRight]}>
                        {account.totals.credit?.toFixed(2) || '0.00'}
                    </Text>
                    <Text style={[styles.tableCell, styles.textRight]}>
                        {account.totals.balance?.toFixed(2) || '0.00'}
                    </Text>
                </View>
                {account.accounts && account.accounts.map((child: any) => renderRows(child, level + 1))}
            </View>
        );
    };

    return (
        <Page size="A4" style={styles.page}>
            <Header />
            <View style={styles.titleContainer}>
                <Text style={styles.title}>Accounts Report</Text>
            </View>
            <View style={styles.table}>
                <View style={styles.tableHeader}>
                    <Text style={[styles.tableHeaderCell, styles.cellWidthSmall]}>Code</Text>
                    <Text style={[styles.tableHeaderCell, styles.cellWidthLarge]}>Name</Text>
                    <Text style={[styles.tableHeaderCell, styles.textRight]}>Debit</Text>
                    <Text style={[styles.tableHeaderCell, styles.textRight]}>Credit</Text>
                    <Text style={[styles.tableHeaderCell, styles.textRight]}>Balance</Text>
                </View>
                {accounts && accounts.map((accountType: any) => renderRows(accountType))}
                <View style={styles.tableFooter}>
                    <Text style={[styles.tableFooterCell, styles.cellWidthSmall]}></Text>
                    <Text style={[styles.tableFooterCell, styles.cellWidthLarge]}>Total</Text>
                    <Text style={[styles.tableFooterCell, styles.textRight]}>{totals?.totalDebit.toFixed(2)}</Text>
                    <Text style={[styles.tableFooterCell, styles.textRight]}>{totals?.totalCredit.toFixed(2)}</Text>
                    <Text style={[styles.tableFooterCell, styles.textRight]}>{totals?.totalBalance.toFixed(2)}</Text>
                </View>
            </View>
            {/*<Footer />*/}
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
    table: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        marginVertical: 10
    },
    tableHeader: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottom: '1px solid #000',
        paddingBottom: 4,
        marginBottom: 8
    },
    tableHeaderCell: {
        fontSize: 10,
        fontWeight: 'bold',
        textAlign: 'left'
    },
    tableRow: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottom: '1px solid #000',
        paddingBottom: 4,
        marginBottom: 4
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
        textAlign: 'right'
    },
    cellWidthSmall: {
        width: '10%'
    },
    cellWidthLarge: {
        width: '30%'
    },
    textRight: {
        textAlign: 'right',
        width: '20%'
    }
});

export default PrintContent;
