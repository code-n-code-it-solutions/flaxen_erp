import React from 'react';
import { View, Text, Image } from '@react-pdf/renderer';

const Header = () => {
    return (
        <View>
            <View
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
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
                fixed
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    // alignItems: 'center',
                    // padding: '0 20px',
                    borderBottom: '1px solid #22AAA7',
                    // paddingTop: '10px',
                    paddingBottom: '10px',
                    // height: '110px'
                }}>
                <Image
                    src="https://flaxenpaints.com/uploads/settings/logo2.png"
                    style={{
                        width: '100px',
                        height: '60px'
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
                    <Text
                        style={{
                            fontSize: 12,
                            fontWeight: 'bold'
                        }}>
                        Flaxen Paints Industry LLC
                    </Text>
                    <Text style={{ fontWeight: 'bold', fontSize: 10 }}>info@flaxenpaints.com</Text>
                    <Text style={{ fontWeight: 'bold', fontSize: 10 }}>+971 4 333 4444</Text>
                    <Text style={{ fontWeight: 'bold', fontSize: 10 }}>P.O. Box 12345</Text>
                    <Text style={{ fontWeight: 'bold', fontSize: 10 }}>Dubai, UAE</Text>
                </View>
            </View>

        </View>
    );
};

export default Header;
