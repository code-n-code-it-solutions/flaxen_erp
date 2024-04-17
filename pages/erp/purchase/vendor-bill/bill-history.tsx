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
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginTop: '10px',
                            marginBottom: '10px',
                        }}>
                        <h1
                            style={{
                                fontSize: '18px',
                                fontWeight: 'bold'
                            }}>
                            Payment History
                        </h1>
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                        <div style={{display: 'flex', flexDirection: 'column', gap: '5px'}}>
                            <span style={{fontSize: '12px'}}>
                                <strong>Invoice #:</strong> {content?.invoice_number}
                            </span>
                            <span style={{fontSize: '12px'}}>
                                <strong>Bill Number:</strong> {content?.bill_number}
                            </span>
                            <span style={{fontSize: '12px'}}>
                                <strong>Bill Amount:</strong> {content?.bill_amount}
                            </span>
                            <span style={{fontSize: '12px'}}>
                                <strong>Printed At:</strong> {(new Date()).toDateString()}
                            </span>
                        </div>
                        <div style={{display: 'flex', flexDirection: 'column', gap: '5px'}}>
                            <span style={{fontSize: '12px'}}>
                                <strong>Status:</strong> {capitalize(content?.status)}
                            </span>
                            <span style={{fontSize: '12px'}}>
                                <strong>Requested By:</strong> {content?.local_purchase_order?.lpo_number}
                            </span>
                            <span style={{fontSize: '12px'}}>
                                <strong>Requisition Code:</strong> {content?.good_receive_note?.grn_number}
                            </span>

                            <span style={{fontSize: '12px'}}>
                                <strong>Bill Created At:</strong>
                                {(new Date(content?.created_at)).toDateString()}
                            </span>
                        </div>
                    </div>

                    <div style={{marginTop: '20px'}}>
                        <table style={{width: '100%', borderCollapse: 'collapse'}}>
                            <thead style={{backgroundColor: '#f9fafb', borderBottom: '2px solid #e5e7eb'}}>
                            <tr>
                                <th style={customStyle}>#</th>
                                <th style={customStyle}>Payment Date</th>
                                <th style={customStyle}>Payment Method</th>
                                <th style={customStyle}>Ref #</th>
                                <th style={customStyle}>Amount</th>
                                <th style={customStyle}>Balance</th>
                            </tr>
                            </thead>
                            <tbody>
                            {displayPayments}
                            </tbody>
                        </table>
                    </div>
                </div>
                <Footer/>
            </div>
        </div>
    );
}

export default BillHistory;
