import { Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer';
import Header from '@/components/Report/Header';
// import Image from 'next/image';
import { serverFilePath } from '@/utils/helper';
import React from 'react';

const PrintContent = ({ content }: { content: any }) => {
    return (
        <Page
            size="A4"
            style={{
                display: 'flex',
                flexDirection: 'column',
                padding: 20
            }}
        >
            <Header />
            <View>
                {/*<View*/}
                {/*    style={{*/}
                {/*        display: 'flex',*/}
                {/*        flexDirection: 'column',*/}
                {/*        alignItems: 'center',*/}
                {/*        marginTop: 10,*/}
                {/*        marginBottom: 10*/}
                {/*    }}*/}
                {/*>*/}
                {/*    */}
                {/*</View>*/}
                <View
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginTop: 10,
                        marginBottom: 10
                    }}
                >
                    <View
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            gap: 5
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 16,
                                fontWeight: 'extrabold',
                                marginLeft: '30%',
                                marginVertical: '13px',
                                textDecoration: 'underline'
                            }}
                        >
                            PAYSLIP FOR THE MONTH OF FEB 2024
                        </Text>
                        <Text
                            style={{
                                fontWeight: 'extrabold',
                                width: '100%',
                                fontSize: 13,
                                marginLeft: '91%',
                                marginTop: 5
                            }}
                        >
                            PAYSLIP #49029
                        </Text>
                        <Text
                            style={{
                                fontSize: 9.5,
                                fontWeight: 'extrabold',
                                marginBottom: 5,
                                marginLeft: '91%',
                                width: '100%'
                            }}
                        >
                            Salary Month: July,2024
                        </Text>
                        <Text
                            style={{
                                fontSize: 10,
                                fontWeight: 'bold',
                            }}
                        >
                            Flaxen Paints
                        </Text>
                        <Text
                            style={{
                                fontSize: 10,
                                fontWeight: 'bold',
                                marginBottom: 8
                            }}
                        >
                            United Arab Emirates
                        </Text>
                        <Text
                            style={{
                                fontSize: 11,
                                fontWeight: 'ultrabold',
                                marginBottom: 2
                            }}
                        >
                            Jhon Doe
                        </Text>
                        <Text
                            style={{
                                fontSize: 10,
                                fontWeight: 'ultrabold',
                            }}
                        >
                            Web Designer
                        </Text>
                        <Text
                            style={{
                                fontSize: 10,
                                fontWeight: 'bold',
                            }}
                        >
                            Employee Code:
                        </Text>
                        <Text
                            style={{
                                fontSize: 10,
                                fontWeight: 'bold',
                                marginBottom: 8
                            }}
                        >
                            Joining Date:
                        </Text>
                    </View>
                </View>

                <View style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'flex-start'
                }}>
                    <View
                        style={{
                            marginBottom: 15,
                            width: '43%',
                            marginRight: '20px'
                        }}
                    >
                        <Text style={{ fontWeight: 'bold', fontSize: 15, marginBottom: 10 }}>Earnings:</Text>

                        <View style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'flex-start',
                            justifyContent: 'space-between',
                            marginVertical: '7px'

                        }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 10 }}>Basic Salary</Text>
                            <Text style={{ fontSize: 10 }}>$500</Text>
                        </View>
                        <View style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'flex-start',
                            justifyContent: 'space-between',
                            marginVertical: '7px'

                        }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 10 }}>House Rent Allowance (H.R.A.)</Text>
                            <Text style={{ fontSize: 10 }}>$500</Text>
                        </View>
                        <View style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'flex-start',
                            justifyContent: 'space-between',
                            marginVertical: '7px'

                        }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 10 }}>Conveyance</Text>
                            <Text style={{ fontSize: 10 }}>$500</Text>
                        </View>
                        <View style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'flex-start',
                            justifyContent: 'space-between',
                            marginVertical: '7px'

                        }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 10 }}>Other Allowance</Text>
                            <Text style={{ fontSize: 10 }}>$500</Text>
                        </View>
                        <View style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'flex-start',
                            justifyContent: 'space-between',
                            marginVertical: '7px'

                        }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 10 }}>Total Earnings</Text>
                            <Text style={{ fontSize: 10 }}>$500</Text>
                        </View>
                    </View>
                    <View
                        style={{
                            marginBottom: 15,
                            width: '43%',
                            marginLeft: '20px'
                        }}
                    >
                        <Text style={{ fontWeight: 'bold', fontSize: 15, marginBottom: 10 }}>Deductions:</Text>

                        <View style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'flex-start',
                            justifyContent: 'space-between',
                            marginVertical: '7px'

                        }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 10 }}>Tax Deducted at Source (T.D.S)</Text>
                            <Text style={{ fontSize: 10 }}>$500</Text>
                        </View>
                        <View style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'flex-start',
                            justifyContent: 'space-between',
                            marginVertical: '7px'

                        }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 10 }}>Provident Fund</Text>
                            <Text style={{ fontSize: 10 }}>$500</Text>
                        </View>
                        <View style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'flex-start',
                            justifyContent: 'space-between',
                            marginVertical: '7px'

                        }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 10 }}>ESI</Text>
                            <Text style={{ fontSize: 10 }}>$500</Text>
                        </View>
                        <View style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'flex-start',
                            justifyContent: 'space-between',
                            marginVertical: '7px'

                        }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 10 }}>Loan</Text>
                            <Text style={{ fontSize: 10 }}>$500</Text>
                        </View>
                        <View style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'flex-start',
                            justifyContent: 'space-between',
                            marginVertical: '7px'

                        }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 10 }}>Total Deduction</Text>
                            <Text style={{ fontSize: 10 }}>$500</Text>
                        </View>
                    </View>
                </View>
                <View>
                    <Text style={{ fontWeight: 'ultrabold', fontSize: 11 }}>
                        Net Salary: $500 (Five hundred only.)
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

export default PrintContent;

const styles = StyleSheet.create({
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
})
