import React, { useState } from 'react';
import Header from '@/components/Report/Header';
import Footer from '@/components/Report/Footer';
import { imagePath } from '@/utils/helper';

const Preview = ({ content }: any) => {
    console.log(content)
    const myStyle = {
        backgroundColor: '#f5f5f5',
        borderWidth: '1px',
        borderColor: '#000',
        borderStyle: 'solid',
        padding: '5px',
    };
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
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
                <Header />
                <div style={{ height: '950px', paddingInline: '10px' }}>
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
                                fontSize: '26px',
                                fontWeight: 'bold',
                            }}
                        >
                            Fillings
                        </h1>
                        <span style={{ fontSize: '14px', marginTop:'3px' , marginBottom:'10px'}}>
                            <strong>Batch Number: </strong> {content?.production?.batch_number}
                        </span>
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'start',
                            padding: 10,
                        }}
                    >
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <span style={{ fontSize: '15px', marginBottom: '15px' }}>
                                <strong>Name: </strong> {content?.created_by?.name}
                            </span>
                        <span style={{ fontSize: '15px', marginBottom: '15px' }}>
                                <strong>Email: </strong> {content?.created_by?.email}
                            </span>
                        <span style={{ fontSize: '15px', marginBottom: '15px' }}>
                                <strong>No Of Quantity (KG): </strong> {content?.production?.no_of_quantity}
                            </span>
                        <span style={{ fontSize: '15px', marginBottom: '15px' }}>
                                <strong>Working Shift: </strong> {content?.working_shift?.name}
                            </span>
                            <span style={{ fontSize: '15px', marginBottom: '15px' }}>
                                <strong>Printed At: </strong> {new Date().toDateString()}
                            </span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <span style={{ fontSize: '15px', marginBottom: '15px' }}>
                                <strong>Filling Date: </strong> {content?.filling_date}
                            </span>
                            <span style={{ fontSize: '15px', marginBottom: '15px' }}>
                                <strong>Filling Time: </strong> {content?.filling_time}
                            </span>
                            <span style={{ fontSize: '15px', marginBottom: '15px' }}>
                                <strong>Filling Code: </strong> {content?.filling_code}
                            </span>
                            <span style={{ fontSize: '15px', marginBottom: '15px' }}>
                                <strong>Working Time: </strong> {content?.working_shift?.start_time + '-' +  content?.working_shift?.end_time}
                            </span>
                            <span style={{ fontSize: '15px', marginBottom: '15px' }}>
                                <strong>Created At: </strong> {new Date(content?.created_at).toDateString()}
                            </span>
                        </div>
                    </div>
                    <h3 className="mb-4 text-sm font-semibold">Filling -(0 KG)</h3>
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
                                
                                <th style={myStyle}>Product Name</th>
                                <th style={myStyle}>Unit</th>
                                <th style={myStyle}>Unit Cost</th>
                                <th style={myStyle}>Qty</th>
                                <th style={myStyle}>Capacity</th>
                                <th style={myStyle}>Filling (KG)</th>
                                <th style={myStyle}>Required</th>
                                <th style={myStyle}>Total Cost</th>
                            </tr>
                        </thead>
                        <tbody>
                            {content?.filling_calculations.map((item: any, index: any) => (
                                <tr key={index}>
                                    <td style={{ ...myStyle, textAlign: 'center' }}>{}</td>
                                    <td style={{ ...myStyle, textAlign: 'center' }}>{}</td>
                                    <td style={{ ...myStyle, textAlign: 'center' }}>{item.unit_price}</td>
                                    <td style={{ ...myStyle, textAlign: 'center' }}>{item.quantity}</td>
                                    <td style={{ ...myStyle, textAlign: 'center' }}>{item.capacity}</td>
                                    <td style={{ ...myStyle, textAlign: 'center' }}>{item.filling_quantity}</td>
                                    <td style={{ ...myStyle, textAlign: 'center' }}>{item.required_quantity}</td>
                                    <td style={{ ...myStyle, textAlign: 'center' }}>{(parseFloat(item.unit_price) * parseFloat(item.quantity) * parseFloat(item.required_quantity)).toFixed(2)}</td>
                                </tr>
                            ))}
                            <tr>
                                <th style={{textAlign: 'center'}}>Total</th>
                                <td></td>
                                <th style={{ ...myStyle, textAlign: 'center' }}>
                                    {content?.filling_calculations.reduce((totalUnitCost: number, item: any) => totalUnitCost + parseFloat(item.unit_price), 0)}
                                </th>
                                <th style={{ ...myStyle, textAlign: 'center' }}>
                                    {content?.filling_calculations.reduce((totalQuantity: number, item: any) => totalQuantity + parseFloat(item.quantity), 0)}
                                </th>
                                <th style={{ ...myStyle, textAlign: 'center' }}>
                                    {content?.filling_calculations.reduce((totalCapacity: number, item: any) => totalCapacity + parseFloat(item.capacity), 0)}
                                </th>
                                <th style={{ ...myStyle, textAlign: 'center' }}>
                                    {content?.filling_calculations.reduce((totalFillingQuantity: number, item: any) => totalFillingQuantity + parseFloat(item.filling_quantity), 0)}
                                </th>
                                <th style={{ ...myStyle, textAlign: 'center' }}>
                                    {content?.filling_calculations.reduce((totalReqQuantity: number, item: any) => totalReqQuantity + parseFloat(item.required_quantity), 0)}
                                </th>
                                <th style={{ ...myStyle, textAlign: 'center' }}>
                                    {content?.filling_calculations
                                        .reduce((total: number, item: any) => total + parseFloat(item.unit_price) * parseFloat(item.quantity) * parseFloat(item.required_quantity), 0)
                                        .toFixed(2)}
                                </th>
                            </tr>
                        </tbody>
                    </table>
                    {/* <h3 className="mb-4 text-sm font-semibold">Fillings Calculations:</h3>
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
                                <th style={myStyle}>Available Qty</th>
                                <th style={myStyle}>Req Qty</th>
                                <th style={myStyle}>Total Cost</th>
                            </tr>
                        </thead>
                        <tbody>
                            {content?.filling_calculations.map((item: any, index: any) => (
                                <tr key={index}>
                                    <td style={{ ...myStyle, textAlign: 'center' }}>{index + 1}</td>
                                    <td style={{ ...myStyle, textAlign: 'center' }}>
                                    {item.raw_product_id}
                                    </td>
                                    <td style={{ ...myStyle, textAlign: 'center' }}>
                                    {item.unit_id}
                                    </td>
                                    <td style={{ ...myStyle, textAlign: 'center' }}>{item.unit_price}</td>
                                    <td style={{ ...myStyle, textAlign: 'center' }}>{item.quantity}</td>
                                    <td style={{ ...myStyle, textAlign: 'center' }}>{item.filling_quantity}</td>
                                    <td style={{ ...myStyle, textAlign: 'center' }}>{item.required_quantity}</td>
                                    <td style={{ ...myStyle, textAlign: 'center' }}>{(parseFloat(item.unit_cost) * parseFloat(item.quantity) * parseFloat(item.required_quantity)).toFixed(2)}</td>
                                </tr>
                            ))}
                            <tr>
                                <td></td>
                                <th>Total</th>
                                <td></td>
                                <th style={{ ...myStyle, textAlign: 'center' }}>
                                    {content?.filling_calculations.reduce((totalUnitCost: number, item: any) => totalUnitCost + parseFloat(item.unit_cost), 0)}
                                </th>
                                <th style={{ ...myStyle, textAlign: 'center' }}>
                                    {content?.filling_calculations.reduce((totalQuantity: number, item: any) => totalQuantity + parseFloat(item.quantity), 0)}
                                </th>
                                <th style={{ ...myStyle, textAlign: 'center' }}>
                                    {content?.filling_calculations.reduce((totalAvaQuantity: number, item: any) => totalAvaQuantity + parseFloat(item.available_quantity), 0)}
                                </th>
                                <th style={{ ...myStyle, textAlign: 'center' }}>
                                    {content?.filling_calculations.reduce((totalReqQuantity: number, item: any) => totalReqQuantity + parseFloat(item.required_quantity), 0)}
                                </th>
                                <th style={{ ...myStyle, textAlign: 'center' }}>
                                    {content?.filling_calculations
                                        .reduce((total: number, item: any) => total + parseFloat(item.unit_cost) * parseFloat(item.quantity) * parseFloat(item.required_quantity), 0)
                                        .toFixed(2)}
                                </th>
                            </tr>
                        </tbody>
                    </table> */}
                </div>
                <Footer />
            </div>
        </div>
    );
};

export default Preview;
