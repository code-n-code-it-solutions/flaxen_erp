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
                                fontSize: '20px',
                                fontWeight: 'bold'
                            }}>
                            Vendor Detail
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
                                <strong>Registered At:</strong> {(new Date(content?.created_at)).toDateString()}
                            </span>
                            <span style={{fontSize: '12px'}}>
                                <strong>Printed At:</strong> {(new Date()).toDateString()}
                            </span>
                            <span style={{fontSize: '12px'}}>
                                <strong>Vendor Number:</strong> {content?.vendor_number}
                            </span>
                            <span style={{fontSize: '12px'}}>
                                <strong>Name:</strong> {content?.name}
                            </span>
                            <span style={{fontSize: '12px'}}>
                                <strong>Opening Balance:</strong> {content?.opening_balance}
                            </span>
                            <span style={{fontSize: '12px'}}>
                                <strong>Phone:</strong> {content?.phone}
                            </span>
                            <span style={{fontSize: '12px'}}>
                                <strong>Email:</strong> {content?.email}
                            </span>
                            <span style={{fontSize: '12px'}}>
                                <strong>Tax Reg #:</strong> {content?.tax_reg_no}
                            </span>
                            <span style={{fontSize: '12px'}}>
                                <strong>Address:</strong> {content?.address} {content?.city} {content?.state},{content?.country},{content?.postal_code}
                            </span>
                        </div>
                        <div>
                            <span style={{fontSize: '12px', position:'absolute',top:'28%',left:'34%'}}>
                                <strong>Due In Days:</strong> {content?.due_in_days}
                            </span>
                        </div>
                        <div>
                            <span style={{fontSize: '12px', position:'absolute',top:'29.7%',left:'34%'}}>
                                <strong>Vendor Type:</strong> {content?.vendor_type_id}
                            </span>
                        </div>
                            <div>
                            <span style={{fontSize: '12px' , position:'absolute',top:'28%',left:'52%'}}>
                                <strong>Website:</strong> {content?.website_url}
                            </span>
                            </div>
                        <img src={imagePath(content?.thumbnail)} style={{width: 100, height: 100}} alt=""/>
                    </div>
                    <div className="mt-10">
                        <h4 className="font-bold">Vendor Representatives:</h4>
                    </div>
                    <table
                        style={{
                            width: '100%',
                            marginTop: '10px',
                            borderCollapse: 'collapse',
                            borderWidth: '1px',
                            borderColor: '#000',
                            borderStyle: 'solid',
                            fontSize: '12px'
                        }}
                    >
                    <thead>
                        <tr>
                            <th style={{
                                    borderWidth: '1px',
                                    borderColor: '#000',
                                    borderStyle: 'solid',
                                    padding: '5px'
                                }}>
                                    Photo
                            </th>
                            <th style={{
                                    borderWidth: '1px',
                                    borderColor: '#000',
                                    borderStyle: 'solid',
                                    padding: '5px'
                                }}>
                                    Name
                            </th>
                            <th style={{
                                    borderWidth: '1px',
                                    borderColor: '#000',
                                    borderStyle: 'solid',
                                    padding: '5px'
                                }}>
                                    Phone
                            </th>
                            <th style={{
                                    borderWidth: '1px',
                                    borderColor: '#000',
                                    borderStyle: 'solid',
                                    padding: '5px'
                                }}>
                                    Email
                            </th>
                            <th style={{
                                    borderWidth: '1px',
                                    borderColor: '#000',
                                    borderStyle: 'solid',
                                    padding: '5px'
                                }}>
                                    Address
                            </th>
                        </tr>
                    </thead>
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
                            >  &nbsp;
                            </td>
                            <td
                                style={{
                                    borderWidth: '1px',
                                    borderColor: '#000',
                                    borderStyle: 'solid',
                                    padding: '5px'
                                }}
                            >
                            </td>
                            <td
                                style={{
                                    borderWidth: '1px',
                                    borderColor: '#000',
                                    borderStyle: 'solid',
                                    padding: '5px'
                                }}
                            >
                            </td>
                            <td
                                style={{
                                    borderWidth: '1px',
                                    borderColor: '#000',
                                    borderStyle: 'solid',
                                    padding: '5px'
                                }}
                            >
                            </td>
                            <td
                                style={{
                                    borderWidth: '1px',
                                    borderColor: '#000',
                                    borderStyle: 'solid',
                                    padding: '5px'
                                }}
                            >
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    <div className="mt-10">
                        <h4 className="font-bold">Vendor Addresses:</h4>
                    </div>
                    <table
                        style={{
                            width: '100%',
                            marginTop: '10px',
                            borderCollapse: 'collapse',
                            borderWidth: '1px',
                            borderColor: '#000',
                            borderStyle: 'solid',
                            fontSize: '12px'
                        }}
                    >
                    <thead>
                        <tr>
                            <th style={{
                                    borderWidth: '1px',
                                    borderColor: '#000',
                                    borderStyle: 'solid',
                                    padding: '5px'
                                }}>
                                    Address Type
                            </th>
                            <th style={{
                                    borderWidth: '1px',
                                    borderColor: '#000',
                                    borderStyle: 'solid',
                                    padding: '5px'
                                }}>
                                    Country
                            </th>
                            <th style={{
                                    borderWidth: '1px',
                                    borderColor: '#000',
                                    borderStyle: 'solid',
                                    padding: '5px'
                                }}>
                                    State
                            </th>
                            <th style={{
                                    borderWidth: '1px',
                                    borderColor: '#000',
                                    borderStyle: 'solid',
                                    padding: '5px'
                                }}>
                                    City
                            </th>
                            <th style={{
                                    borderWidth: '1px',
                                    borderColor: '#000',
                                    borderStyle: 'solid',
                                    padding: '5px'
                                }}>
                                    Address
                            </th>
                            <th style={{
                                    borderWidth: '1px',
                                    borderColor: '#000',
                                    borderStyle: 'solid',
                                    padding: '5px'
                                }}>
                                    Postal Code
                            </th>

                        </tr>
                    </thead>
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
                            >   &nbsp;
                            </td>
                            <td
                                style={{
                                    borderWidth: '1px',
                                    borderColor: '#000',
                                    borderStyle: 'solid',
                                    padding: '5px'
                                }}
                            >
                            </td>
                            <td
                                style={{
                                    borderWidth: '1px',
                                    borderColor: '#000',
                                    borderStyle: 'solid',
                                    padding: '5px'
                                }}
                            >
                            </td>
                            <td
                                style={{
                                    borderWidth: '1px',
                                    borderColor: '#000',
                                    borderStyle: 'solid',
                                    padding: '5px'
                                }}
                            >
                            </td>
                            <td
                                style={{
                                    borderWidth: '1px',
                                    borderColor: '#000',
                                    borderStyle: 'solid',
                                    padding: '5px'
                                }}
                            >
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    <div className="mt-10">
                        <h4 className="font-bold">Bank Details:</h4>
                    </div>
                    <table
                        style={{
                            width: '100%',
                            marginTop: '10px',
                            borderCollapse: 'collapse',
                            borderWidth: '1px',
                            borderColor: '#000',
                            borderStyle: 'solid',
                            fontSize: '12px'
                        }}
                    >
                    <thead>
                        <tr>
                            <th style={{
                                    borderWidth: '1px',
                                    borderColor: '#000',
                                    borderStyle: 'solid',
                                    padding: '5px'
                                }}>
                                    Bank
                            </th>
                            <th style={{
                                    borderWidth: '1px',
                                    borderColor: '#000',
                                    borderStyle: 'solid',
                                    padding: '5px'
                                }}>
                                    Account Number
                            </th>
                            <th style={{
                                    borderWidth: '1px',
                                    borderColor: '#000',
                                    borderStyle: 'solid',
                                    padding: '5px'
                                }}>
                                    Account Title
                            </th>
                            <th style={{
                                    borderWidth: '1px',
                                    borderColor: '#000',
                                    borderStyle: 'solid',
                                    padding: '5px'
                                }}>
                                    IBAN
                            </th>
                            <th style={{
                                    borderWidth: '1px',
                                    borderColor: '#000',
                                    borderStyle: 'solid',
                                    padding: '5px'
                                }}>
                                    Currency
                            </th>
                        </tr>
                    </thead>
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
                            >  &nbsp;
                            </td>
                            <td
                                style={{
                                    borderWidth: '1px',
                                    borderColor: '#000',
                                    borderStyle: 'solid',
                                    padding: '5px'
                                }}
                            >
                            </td>
                            <td
                                style={{
                                    borderWidth: '1px',
                                    borderColor: '#000',
                                    borderStyle: 'solid',
                                    padding: '5px'
                                }}
                            >
                            </td>
                            <td
                                style={{
                                    borderWidth: '1px',
                                    borderColor: '#000',
                                    borderStyle: 'solid',
                                    padding: '5px'
                                }}
                            >
                            </td>
                            <td
                                style={{
                                    borderWidth: '1px',
                                    borderColor: '#000',
                                    borderStyle: 'solid',
                                    padding: '5px'
                                }}
                            >
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    

                </div>
                <Footer/>
            </div>
            </div>
    );
}

export default Preview;
