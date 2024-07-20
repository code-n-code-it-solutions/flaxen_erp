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
                                fontSize: 13,
                                fontWeight: 'bold'
                            }}
                        >
                            Product Details
                        </Text>
                        <Text
                            style={{
                                fontSize: 10,
                                fontWeight: 'bold',
                                marginBottom: 5
                            }}
                        >
                            Product Category: {content?.raw_product_category?.name + ' (' + content?.raw_product_category?.code + ')'}
                        </Text>
                        <Text
                            style={{
                                fontSize: 10,
                                fontWeight: 'bold',
                                marginBottom: 5
                            }}
                        >
                            Product Code: {content?.item_code}
                        </Text>
                    </View>
                    <Image
                        src={serverFilePath(content?.thumbnail)}
                        style={{
                            width: 50,
                            height: 50
                        }}
                    />
                </View>
                <View
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: 10
                    }}
                >
                    <Text style={{ fontWeight: 'bold', width: '100%', fontSize: 10 }}>Title: </Text>
                    <Text style={{ width: '100%', fontSize: 10 }}>{content?.title}</Text>
                    <Text style={{ fontWeight: 'bold', width: '100%', fontSize: 10 }}>Main Unit: </Text>
                    <Text style={{ width: '100%', fontSize: 10 }}>{content?.unit?.name}</Text>
                </View>

                <View
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: 10
                    }}
                >
                    <Text style={{ fontWeight: 'bold', width: '100%', fontSize: 10 }}>Sub Unit: </Text>
                    <Text style={{ width: '100%', fontSize: 10 }}>{content?.sub_unit?.name}</Text>
                    <Text style={{ fontWeight: 'bold', width: '100%', fontSize: 10 }}>Min Stock Alert: </Text>
                    <Text style={{
                        width: '100%',
                        fontSize: 10
                    }}>{content?.min_stock_level + ' (' + content?.unit?.name + ')'}</Text>
                </View>

                <View
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: 10
                    }}
                >
                    <Text style={{ fontWeight: 'bold', width: '100%', fontSize: 10 }}>Opening Stock: </Text>
                    <Text style={{
                        width: '100%',
                        fontSize: 10
                    }}>{content?.opening_stock + ' (' + content?.sub_unit?.name + ')'}</Text>
                    <Text style={{ fontWeight: 'bold', width: '100%', fontSize: 10 }}>Opening Stock Balance: </Text>
                    <Text style={{ width: '100%', fontSize: 10 }}>{content?.opening_stock_unit_balance}</Text>
                </View>

                <View
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: 10
                    }}
                >
                    <Text style={{ fontWeight: 'bold', width: '100%', fontSize: 10 }}>
                        Opening Stock T.Balance:
                    </Text>
                    <Text style={{ width: '100%', fontSize: 10 }}>{content?.opening_stock_total_balance}</Text>
                    <Text style={{ fontWeight: 'bold', width: '100%', fontSize: 10 }}>Retail Price: </Text>
                    <Text style={{ width: '100%', fontSize: 10 }}>{content?.retail_price}</Text>
                </View>

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
                            justifyContent: 'flex-start',
                            alignItems: 'flex-start',
                            marginTop: 20
                        }}
                    >
                        <Text style={{ fontSize: 10, fontWeight: 'bold', marginBottom: 15 }}>
                            Purchase Description:
                        </Text>
                        <Text style={{ fontSize: 10 }}>{content?.purchase_description}</Text>
                    </View>
                    <View
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'flex-start',
                            alignItems: 'flex-start'
                        }}
                    >
                        <Text style={{ fontSize: 10, fontWeight: 'bold', marginBottom: 15 }}>
                            Sale Description:
                        </Text>
                        <Text style={{ fontSize: 10 }}>{content?.sale_description}</Text>
                    </View>
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
