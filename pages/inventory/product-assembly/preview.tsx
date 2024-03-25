import React, {useState} from 'react';
import Header from '@/components/Report/Header';
import Footer from '@/components/Report/Footer';
import {imagePath} from '@/utils/helper';

const Preview = ({content}: any) => {
    // console.log(content)
    const myStyle = {
        backgroundColor: '#f5f5f5',
        borderWidth: '1px',
        borderColor: '#000',
        borderStyle: 'solid',
        padding: '5px',
    };
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
                    pageBreakInside: 'avoid',
                }}
            >
                <Header/>
                <div style={{height: '950px', paddingInline: '10px'}}>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            flexDirection: 'column',
                            alignItems: 'center',
                            marginTop: '10px',
                            marginBottom: '10px',
                        }}
                    >
                        <h1
                            style={{
                                fontSize: '18px',
                                fontWeight: 'bold',
                            }}
                        >
                            Product Formula
                        </h1>
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'start',
                            padding: 10,
                        }}
                    >
                        <div style={{display: 'flex', flexDirection: 'column', gap: '5px'}}>
                            <span style={{fontSize: '15px', marginBottom: '15px'}}>
                                <strong>Formula Name: </strong> {content?.formula_name}
                            </span>
                            <span style={{fontSize: '15px', marginBottom: '15px'}}>
                                <strong>Formula Code: </strong> {content?.formula_code}
                            </span>
                            <span style={{fontSize: '15px', marginBottom: '15px'}}>
                                <strong>Printed At: </strong> {new Date().toDateString()}
                            </span>
                        </div>
                        <div style={{display: 'flex', flexDirection: 'column', gap: '5px'}}>
                            <span style={{fontSize: '15px', marginBottom: '15px'}}>
                                <strong>Color Code: </strong>
                                {content?.color_code?.name + ' (' + content?.color_code?.hex_code + ')'}
                            </span>
                            <span style={{fontSize: '15px', marginBottom: '15px'}}>
                                <strong>Catagery: </strong> {content?.category?.name}
                            </span>
                            <span style={{fontSize: '15px', marginBottom: '15px'}}>
                                <strong>Created At: </strong> {new Date(content?.created_at).toDateString()}
                            </span>
                        </div>
                    </div>
                    <h3 className="mb-4 text-sm font-semibold">Formula Product Details:</h3>
                    <table
                        style={{
                            width: '100%',
                            marginTop: '20px',
                            borderCollapse: 'collapse',
                            borderWidth: '1px',
                            borderColor: '#000',
                            borderStyle: 'solid',
                            fontSize: '14px',
                        }}
                    >
                        <thead>
                        <tr>
                            <th style={myStyle}>Sr. No</th>
                            <th style={myStyle}>Product</th>
                            <th style={myStyle}>Unit</th>
                            <th style={myStyle}>Unit Price</th>
                            <th style={myStyle}>Qty</th>
                            <th style={myStyle}>Total</th>
                        </tr>
                        </thead>
                        <tbody>
                        {content?.product_assembly_items.map((item: any, index: any) => (
                            <tr key={index}>
                                <td style={{...myStyle, textAlign: 'center'}}>{index + 1}</td>
                                <td style={{...myStyle, textAlign: 'center'}}>{item.product?.title}</td>
                                <td style={{...myStyle, textAlign: 'center'}}>{item.unit?.name}</td>
                                <td style={{...myStyle, textAlign: 'center'}}>{item.cost}</td>
                                <td style={{...myStyle, textAlign: 'center'}}>{item.quantity}</td>
                                <td style={{
                                    ...myStyle,
                                    textAlign: 'center'
                                }}>{(parseFloat(item.cost) * parseFloat(item.quantity)).toFixed(2)}</td>
                            </tr>
                        ))}
                        <tr>
                            <td></td>
                            <th>Total</th>
                            <td></td>
                            <td style={{
                                ...myStyle,
                                textAlign: 'center'
                            }}>{content?.product_assembly_items.reduce((totalCost: number, item: any) => totalCost + parseFloat(item.cost), 0)}</td>
                            <td style={{...myStyle, textAlign: 'center'}}>
                                {content?.product_assembly_items.reduce((totalQuantity: number, item: any) => totalQuantity + parseFloat(item.quantity), 0)}
                            </td>
                            <td style={{...myStyle, textAlign: 'center'}}>
                                {content?.product_assembly_items.reduce((total: number, item: any) => total + parseFloat(item.cost) * parseFloat(item.quantity), 0).toFixed(2)}
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <Footer/>
            </div>
        </div>
    );
};

export default Preview;
