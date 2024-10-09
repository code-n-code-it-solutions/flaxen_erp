import { Page, Text, View, Image } from '@react-pdf/renderer';
import Header from '@/components/Report/Header';
// import Image from 'next/image';
import { serverFilePath } from '@/utils/helper';
import React from 'react';

const PrintLabelContent = ({ content }: { content: any }) => {
    return (
        <View
            style={{
                display: 'flex',
                flexDirection: 'column',
                paddingTop: 10,
                paddingBottom: 10,
                paddingLeft: 10,
                paddingRight: 10,
                borderStyle: 'solid',
                borderWidth: 1,
                borderColor: 'black',
                borderRadius: 10,
                width: '40%'
            }}
        >
            <View
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                }}
            >
                <Text
                    style={{
                        fontWeight: 'thin',
                        textAlign: 'left'
                    }}
                >
                    AED {parseFloat(content.retail_price).toFixed(2)}
                </Text>
                <Text
                    style={{
                        fontSize: 12,
                        textAlign: 'right'
                    }}
                >
                    {content.item_code}
                </Text>
            </View>
        </View>
    );
};

export default PrintLabelContent;
