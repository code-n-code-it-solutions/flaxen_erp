import React, {useState} from "react";
import Header from "@/components/Report/Header";
import Footer from "@/components/Report/Footer";
import {imagePath} from "@/utils/helper";

const Preview = ({content}: any) => {
    // console.log(content)
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
                            flexDirection: 'column',
                            alignItems: 'center',
                            marginTop: '10px',
                            marginBottom: '10px',
                        }}>
                        <h1
                            style={{
                                fontSize: '18px',
                                fontWeight: 'bold'
                            }}>
                            Product Details
                        </h1>

                    </div>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'start',
                            padding: 10
                        }}>
                        <div style={{display: 'flex', flexDirection: 'column', gap: '5px'}}>
                            <span style={{fontSize: '12px'}}>
                                <strong>Order No:</strong> {content?.item_code}
                            </span>
                            <span style={{fontSize: '12px'}}>
                                <strong>Entered At:</strong> {(new Date(content?.created_at)).toDateString()}
                            </span>
                            <span style={{fontSize: '12px'}}>
                                <strong>Printed At:</strong> {(new Date()).toDateString()}
                            </span>
                        </div>
                        <img src={imagePath(content?.thumbnail)} style={{width: 60, height: 60}} alt=""/>
                    </div>
                    <table
                        style={{
                            width: '100%',
                            marginTop: '20px',
                            borderCollapse: 'collapse',
                            borderWidth: '1px',
                            borderColor: '#000',
                            borderStyle: 'solid',
                            fontSize: '12px'
                        }}
                    >
                        <tbody>
                        <tr
                            style={{
                                backgroundColor: '#f5f5f5',
                                borderWidth: '1px',
                                borderColor: '#000',
                                borderStyle: 'solid'
                            }}
                        >
                            <td
                                style={{
                                    borderWidth: '1px',
                                    borderColor: '#000',
                                    borderStyle: 'solid',
                                    padding: '5px'
                                }}
                            >
                                <strong>Title</strong>
                            </td>
                            <td
                                style={{
                                    borderWidth: '1px',
                                    borderColor: '#000',
                                    borderStyle: 'solid',
                                    padding: '5px'
                                }}
                            >
                                {content?.title}
                            </td>
                            <td
                                style={{
                                    borderWidth: '1px',
                                    borderColor: '#000',
                                    borderStyle: 'solid',
                                    padding: '5px'
                                }}
                            >
                                <strong>Main Unit</strong>
                            </td>
                            <td
                                style={{
                                    borderWidth: '1px',
                                    borderColor: '#000',
                                    borderStyle: 'solid',
                                    padding: '5px'
                                }}
                            >
                                {content?.unit?.name}
                            </td>
                        </tr>
                        <tr
                            style={{
                                backgroundColor: '#f5f5f5',
                                borderWidth: '1px',
                                borderColor: '#000',
                                borderStyle: 'solid'
                            }}
                        >
                            <td
                                style={{
                                    borderWidth: '1px',
                                    borderColor: '#000',
                                    borderStyle: 'solid',
                                    padding: '5px'
                                }}
                            >
                                <strong>Sub Unit</strong>
                            </td>
                            <td
                                style={{
                                    borderWidth: '1px',
                                    borderColor: '#000',
                                    borderStyle: 'solid',
                                    padding: '5px'
                                }}
                            >
                                {content?.sub_unit?.name}
                            </td>
                            <td
                                style={{
                                    borderWidth: '1px',
                                    borderColor: '#000',
                                    borderStyle: 'solid',
                                    padding: '5px'
                                }}
                            >
                                <strong>Min Stock Alert</strong>
                            </td>
                            <td
                                style={{
                                    borderWidth: '1px',
                                    borderColor: '#000',
                                    borderStyle: 'solid',
                                    padding: '5px'
                                }}
                            >
                                {content?.min_stock_level + ' (' + content?.unit?.name + ')'}
                            </td>
                        </tr>
                        <tr
                            style={{
                                backgroundColor: '#f5f5f5',
                                borderWidth: '1px',
                                borderColor: '#000',
                                borderStyle: 'solid'
                            }}
                        >
                            <td
                                style={{
                                    borderWidth: '1px',
                                    borderColor: '#000',
                                    borderStyle: 'solid',
                                    padding: '5px'
                                }}
                            >
                                <strong>Opening Stock</strong>
                            </td>
                            <td
                                style={{
                                    borderWidth: '1px',
                                    borderColor: '#000',
                                    borderStyle: 'solid',
                                    padding: '5px'
                                }}
                            >
                                {content?.opening_stock + ' (' + content?.sub_unit?.name + ')'}
                            </td>
                            <td
                                style={{
                                    borderWidth: '1px',
                                    borderColor: '#000',
                                    borderStyle: 'solid',
                                    padding: '5px'
                                }}
                            >
                                <strong>Opening Stock Balance</strong>
                            </td>
                            <td
                                style={{
                                    borderWidth: '1px',
                                    borderColor: '#000',
                                    borderStyle: 'solid',
                                    padding: '5px'
                                }}
                            >
                                {content?.opening_stock_unit_balance}
                            </td>
                        </tr>
                        <tr
                            style={{
                                backgroundColor: '#f5f5f5',
                                borderWidth: '1px',
                                borderColor: '#000',
                                borderStyle: 'solid'
                            }}
                        >
                            <td
                                style={{
                                    borderWidth: '1px',
                                    borderColor: '#000',
                                    borderStyle: 'solid',
                                    padding: '5px'
                                }}
                            >
                                <strong>Opening Stock Total Balance</strong>
                            </td>
                            <td
                                style={{
                                    borderWidth: '1px',
                                    borderColor: '#000',
                                    borderStyle: 'solid',
                                    padding: '5px'
                                }}
                            >
                                {content?.opening_stock_total_balance}
                            </td>
                            <td
                                style={{
                                    borderWidth: '1px',
                                    borderColor: '#000',
                                    borderStyle: 'solid',
                                    padding: '5px'
                                }}
                            >
                                <strong>Opening Stock Balance</strong>
                            </td>
                            <td
                                style={{
                                    borderWidth: '1px',
                                    borderColor: '#000',
                                    borderStyle: 'solid',
                                    padding: '5px'
                                }}
                            >
                                {content?.opening_stock_unit_balance}
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '5px',
                            width: '100%',
                            marginTop: '20px'
                        }}
                    >
                        <div
                            style={{
                                fontSize: '12px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'start',
                                alignItems: 'start',
                                gap: '3px'
                            }}
                        >
                            <strong>Purchase Description: </strong>
                            <span>{content?.purchase_description}</span>
                        </div>
                        <div
                            style={{
                                fontSize: '12px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'start',
                                alignItems: 'start',
                                gap: '3px'
                            }}
                        >
                            <strong>Sale Description: </strong>
                            <span>{content?.sale_description}</span>
                        </div>
                    </div>
                </div>
                <Footer/>
            </div>
        </div>
    );
}

export default Preview;
