import React, {useEffect, useState} from "react";
import Header from "@/components/Report/Header";
import Footer from "@/components/Report/Footer";
import {capitalize} from "lodash";
import {formatCurrency} from "@/utils/helper";

const BillHistory = ({content}: any) => {
    const [paidAmount, setPaidAmount] = useState<number>(0);
    const customStyle: any = {
        textAlign: 'left',
        paddingLeft: '5px',
        paddingRight: '5px',
        paddingTop: '2px',
        paddingBottom: '2px'
    }
    let remainingBalance = parseFloat(content?.bill_amount.replace(/,/g, ''));
    const reversedPayments = [...content.vendor_bill_payments].reverse();

    const paymentRows = reversedPayments.map((item, index) => {
        remainingBalance -= parseFloat(item.payment_amount.replace(/,/g, ''));
        const row = {
            ...item,
            remainingBalance: remainingBalance.toFixed(2)
        };
        const originalIndex = content.vendor_bill_payments.length - index;
        return (
            <tr key={originalIndex}>
                <td style={customStyle}>{originalIndex}</td>
                <td style={customStyle}>{item.payment_date}</td>
                <td style={customStyle}>{capitalize(item.payment_method)}</td>
                <td style={customStyle}>{item.payment_reference}</td>
                <td style={customStyle}>{item.payment_amount}</td>
                <td style={customStyle}>{row.remainingBalance}</td>
            </tr>
        );
    });

    const displayPayments = paymentRows.reverse();

    return (
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <div
                style={{
                    backgroundColor: '#fff',
                    borderRadius: '5px',
                    borderWidth: '1px',
                    borderColor: '#000',
                    width: '794px',
                    height: '1123px',
                    pageBreakAfter: 'always',
                    pageBreakInside: 'avoid'
                }}>
                <Header/>
                <div style={{height: '950px', paddingInline: '10px'}}>

                </div>
                <Footer/>
            </div>
        </div>
    );
}

export default BillHistory;
