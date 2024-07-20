import { Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import React from 'react';
import Header from '@/components/Report/Header';
import Footer from '@/components/Report/Footer';

const PrintContent = ({ content }: any) => {
    const labReferences = Array.from(new Set(content?.product_assembly_items?.map((item: any) => item.lab_reference)));

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
            <View
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    marginVertical: 10
                }}
            >
                <Text
                    style={{
                        fontSize: 12,
                        fontWeight: 'bold'
                    }}
                >
                    Product Formula
                </Text>
                <Text style={{ fontSize: 10, fontWeight: 'bold' }}>
                    {content?.formula_code}
                </Text>
            </View>
            <View
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginVertical: 10
                }}
            >
                <View
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 8
                    }}
                >
                    <Text style={{ fontSize: 10, fontWeight: 'bold' }}>
                        Formula Name: {content?.formula_name}
                    </Text>
                </View>
                <View
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 8
                    }}
                >
                    <Text style={{ fontSize: 10, fontWeight: 'bold' }}>
                        Color Code: {content?.color_code?.name} ({content?.color_code?.hex_code})
                    </Text>
                    <Text style={{ fontSize: 10, fontWeight: 'bold' }}>
                        Category: {content?.category?.name}
                    </Text>
                </View>
            </View>
            {labReferences && labReferences.length > 0 && (
                labReferences.map((labReference: any, index: number) => (
                    <View key={index}>
                        <Text style={{ fontSize: 10, fontWeight: 'bold', marginBottom: 10 }}>
                            Lab Reference: {labReference}
                        </Text>
                        <View>
                            <View
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    borderBottom: '1px solid #000',
                                    paddingBottom: 4
                                }}
                            >
                                <Text style={{ width: '10%', fontSize: 10, fontWeight: 'bold' }}>Sr. No</Text>
                                <Text style={{ width: '25%', fontSize: 10, fontWeight: 'bold' }}>Product</Text>
                                <Text style={{ width: '15%', fontSize: 10, fontWeight: 'bold' }}>Unit</Text>
                                <Text style={{ width: '15%', fontSize: 10, fontWeight: 'bold' }}>Quantity</Text>
                                <Text style={{ width: '15%', fontSize: 10, fontWeight: 'bold' }}>Cost</Text>
                            </View>
                            {content?.product_assembly_items?.map((item: any, itemIndex: number) => (
                                item.lab_reference === labReference &&
                                <View
                                    key={itemIndex}
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        borderBottom: itemIndex === content.product_assembly_items.length - 1 ? 'none' : '1px solid #000',
                                        paddingVertical: 4
                                    }}
                                >
                                    <Text style={{ width: '10%', fontSize: 10 }}>{itemIndex + 1}</Text>
                                    <Text style={{ width: '25%', fontSize: 10 }}>{item.product?.item_code}</Text>
                                    <Text style={{ width: '15%', fontSize: 10 }}>{item.unit?.name}</Text>
                                    <Text style={{ width: '15%', fontSize: 10 }}>{item.quantity}</Text>
                                    <Text style={{ width: '15%', fontSize: 10 }}>{item.cost}</Text>
                                </View>
                            ))}
                        </View>
                        <View
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                borderTop: '1px solid #000',
                                paddingTop: 5,
                                marginTop: 8
                            }}
                        >
                            <Text style={{ width: '10%', fontSize: 10, fontWeight: 'bold' }}></Text>
                            <Text style={{ width: '25%', fontSize: 10, fontWeight: 'bold' }}></Text>
                            <Text style={{ width: '15%', fontSize: 10, fontWeight: 'bold' }}>Total</Text>
                            <Text style={{ width: '15%', fontSize: 10 }}>
                                {content?.product_assembly_items?.reduce((total: number, item: any) => item.lab_reference === labReference ? total + parseFloat(item.quantity) : total, 0).toFixed(5)}
                            </Text>
                            <Text style={{ width: '15%', fontSize: 10 }}>
                                {content?.product_assembly_items?.reduce((total: number, item: any) => item.lab_reference === labReference ? total + parseFloat(item.cost) : total, 0).toFixed(5)}
                            </Text>
                        </View>
                    </View>
                ))
            )}
            <Footer content={content} />
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
        color: 'gray',
        fontSize: 8
    }
});
