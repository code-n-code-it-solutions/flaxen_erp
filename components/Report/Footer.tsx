import React from 'react';
import {View, Text, StyleSheet} from '@react-pdf/renderer';

const Footer = ({content}:any) => {
    return (
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
    );
};

export default Footer;

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
