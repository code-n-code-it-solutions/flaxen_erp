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
                                fontWeight: 'bold',
                                marginBottom: '10px'
                            }}
                        >
                            Department Details
                        </Text>
                        <Text
                            style={{
                                fontSize: 10,
                                fontWeight: 'bold',
                                marginBottom: 5
                            }}
                        >
                            Department Name: {content?.raw_product_category?.name + ' (' + content?.raw_product_category?.code + ')'}
                        </Text>
                        <Text
                            style={{
                                fontSize: 10,
                                fontWeight: 'bold',
                                marginBottom: 5
                            }}
                        >
                            Department Description: {content?.item_code}
                        </Text>
                        <Text
                            style={{
                                fontSize: 10,
                                fontWeight: 'bold',
                                marginBottom: 5
                            }}
                        >
                            Created At: {new Date(content?.created_at).toLocaleDateString()}
                        </Text>
                    </View>
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
                    <Text style={{ fontWeight: 'bold', width: '100%', fontSize: 10 }}>#</Text>
                    <Text style={{ width: '100%', fontSize: 10 }}>Name</Text>
                    <Text style={{ fontWeight: 'bold', width: '100%', fontSize: 10 }}>Description </Text>
                    <Text style={{ width: '100%', fontSize: 10 }}>Created At</Text>
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
                    <Text style={{ fontWeight: 'bold', width: '100%', fontSize: 10 }}>1</Text>
                    <Text style={{ width: '100%', fontSize: 10 }}>Officer</Text>
                    <Text style={{ width: '100%', fontSize: 10 }}>Something written here</Text>

                    <Text style={{ fontWeight: 'bold', width: '100%', fontSize: 10 }}>9/15/2024</Text>
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
