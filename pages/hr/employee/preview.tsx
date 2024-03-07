import React, {useState} from "react";
import Header from "@/components/Report/Header";
import Footer from "@/components/Report/Footer";
import {imagePath} from "@/utils/helper";

const Preview = ({content}: any) => {
    console.log(content)
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
                            Employee Detail
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
                                <strong>Employee Code:</strong> {content?.employee_code}
                            </span>
                            <span style={{fontSize: '12px'}}>
                                <strong>Registered At:</strong> {(new Date(content?.created_at)).toDateString()}
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
                                <strong>Name</strong>
                            </td>
                            <td
                                style={{
                                    borderWidth: '1px',
                                    borderColor: '#000',
                                    borderStyle: 'solid',
                                    padding: '5px'
                                }}
                            >
                                {content?.user?.name}
                            </td>
                            <td
                                style={{
                                    borderWidth: '1px',
                                    borderColor: '#000',
                                    borderStyle: 'solid',
                                    padding: '5px'
                                }}
                            >
                                <strong>Email</strong>
                            </td>
                            <td
                                style={{
                                    borderWidth: '1px',
                                    borderColor: '#000',
                                    borderStyle: 'solid',
                                    padding: '5px'
                                }}
                            >
                                {content?.user?.email}
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
                                <strong>Phone</strong>
                            </td>
                            <td
                                style={{
                                    borderWidth: '1px',
                                    borderColor: '#000',
                                    borderStyle: 'solid',
                                    padding: '5px'
                                }}
                            >
                                {content?.phone}
                            </td>
                            <td
                                style={{
                                    borderWidth: '1px',
                                    borderColor: '#000',
                                    borderStyle: 'solid',
                                    padding: '5px'
                                }}
                            >
                                <strong>Joining Date</strong>
                            </td>
                            <td
                                style={{
                                    borderWidth: '1px',
                                    borderColor: '#000',
                                    borderStyle: 'solid',
                                    padding: '5px'
                                }}
                            >
                                {content?.date_of_joining}
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
                                <strong>Department</strong>
                            </td>
                            <td
                                style={{
                                    borderWidth: '1px',
                                    borderColor: '#000',
                                    borderStyle: 'solid',
                                    padding: '5px'
                                }}
                            >
                                {content?.department?.name}
                            </td>
                            <td
                                style={{
                                    borderWidth: '1px',
                                    borderColor: '#000',
                                    borderStyle: 'solid',
                                    padding: '5px'
                                }}
                            >
                                <strong>Designation</strong>
                            </td>
                            <td
                                style={{
                                    borderWidth: '1px',
                                    borderColor: '#000',
                                    borderStyle: 'solid',
                                    padding: '5px'
                                }}
                            >
                                {content?.designation?.name}
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
                                <strong>Passport Number</strong>
                            </td>
                            <td
                                style={{
                                    borderWidth: '1px',
                                    borderColor: '#000',
                                    borderStyle: 'solid',
                                    padding: '5px'
                                }}
                            >
                                {content?.passport_number}
                            </td>
                            <td
                                style={{
                                    borderWidth: '1px',
                                    borderColor: '#000',
                                    borderStyle: 'solid',
                                    padding: '5px'
                                }}
                            >
                                <strong>ID Number</strong>
                            </td>
                            <td
                                style={{
                                    borderWidth: '1px',
                                    borderColor: '#000',
                                    borderStyle: 'solid',
                                    padding: '5px'
                                }}
                            >
                                {content?.id_number}
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
                                <strong>Address</strong>
                            </td>
                            <td
                                colSpan={3}
                                style={{
                                    borderWidth: '1px',
                                    borderColor: '#000',
                                    borderStyle: 'solid',
                                    padding: '5px'
                                }}
                            >
                                {content?.address + ' ' + content?.city?.name + ' ' + content?.state?.name + ', ' + content?.country?.name + ', ' + content?.postal_code}
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'start',
                            flexDirection: 'column',
                            alignItems: 'start',
                            marginTop: '20px',
                            width: '100%',
                        }}
                    >
                        <h1
                            style={{
                                fontSize: '18px',
                                fontWeight: 'bold'
                            }}>
                            Bank Details
                        </h1>
                        <table
                            style={{
                                width: '100%',
                                borderCollapse: 'collapse',
                                borderWidth: '1px',
                                borderColor: '#000',
                                borderStyle: 'solid',
                                fontSize: '12px'
                            }}
                        >
                            <thead>
                            <tr
                                style={{
                                    backgroundColor: '#f5f5f5',
                                    borderWidth: '1px',
                                    borderColor: '#000',
                                    borderStyle: 'solid'
                                }}
                            >
                                <th
                                    style={{
                                        borderWidth: '1px',
                                        borderColor: '#000',
                                        borderStyle: 'solid',
                                        padding: '5px'
                                    }}
                                >
                                    <strong>Bank Name</strong>
                                </th>
                                <th
                                    style={{
                                        borderWidth: '1px',
                                        borderColor: '#000',
                                        borderStyle: 'solid',
                                        padding: '5px'
                                    }}
                                >
                                    <strong>Account Name</strong>
                                </th>
                                <th
                                    style={{
                                        borderWidth: '1px',
                                        borderColor: '#000',
                                        borderStyle: 'solid',
                                        padding: '5px'
                                    }}
                                >
                                    <strong>Account Number</strong>
                                </th>
                                <th
                                    style={{
                                        borderWidth: '1px',
                                        borderColor: '#000',
                                        borderStyle: 'solid',
                                        padding: '5px'
                                    }}
                                >
                                    <strong>IBAN</strong>
                                </th>
                                <th
                                    style={{
                                        borderWidth: '1px',
                                        borderColor: '#000',
                                        borderStyle: 'solid',
                                        padding: '5px'
                                    }}
                                >
                                    <strong>Currency</strong>
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            {content?.bank_accounts?.length > 0
                                ? content?.bank_accounts?.map((bank: any, index: number) => (
                                    <tr
                                        key={index}
                                        style={{
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
                                            {bank.bank.name}
                                        </td>
                                        <td
                                            style={{
                                                borderWidth: '1px',
                                                borderColor: '#000',
                                                borderStyle: 'solid',
                                                padding: '5px'
                                            }}
                                        >
                                            {bank.account_name}
                                        </td>
                                        <td
                                            style={{
                                                borderWidth: '1px',
                                                borderColor: '#000',
                                                borderStyle: 'solid',
                                                padding: '5px'
                                            }}
                                        >
                                            {bank.account_number}
                                        </td>
                                        <td
                                            style={{
                                                borderWidth: '1px',
                                                borderColor: '#000',
                                                borderStyle: 'solid',
                                                padding: '5px'
                                            }}
                                        >
                                            {bank.iban}
                                        </td>
                                        <td
                                            style={{
                                                borderWidth: '1px',
                                                borderColor: '#000',
                                                borderStyle: 'solid',
                                                padding: '5px'
                                            }}
                                        >
                                            {bank.currencey?.short_name}
                                        </td>
                                    </tr>
                                ))
                                : <tr
                                    style={{
                                        borderWidth: '1px',
                                        borderColor: '#000',
                                        borderStyle: 'solid'
                                    }}
                                >
                                    <td
                                        colSpan={5}
                                        style={{
                                            borderWidth: '1px',
                                            borderColor: '#000',
                                            borderStyle: 'solid',
                                            padding: '5px'
                                        }}
                                    >
                                        No Bank Details Found
                                    </td>
                                </tr>
                            }
                            </tbody>
                        </table>
                    </div>

                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'start',
                            flexDirection: 'column',
                            alignItems: 'start',
                            marginTop: '20px',
                            width: '100%',
                        }}
                    >
                        <h1
                            style={{
                                fontSize: '18px',
                                fontWeight: 'bold'
                            }}>
                            Documents Uploaded
                        </h1>
                        <table
                            style={{
                                width: '100%',
                                borderCollapse: 'collapse',
                                borderWidth: '1px',
                                borderColor: '#000',
                                borderStyle: 'solid',
                                fontSize: '12px'
                            }}
                        >
                            <thead>
                            <tr
                                style={{
                                    backgroundColor: '#f5f5f5',
                                    borderWidth: '1px',
                                    borderColor: '#000',
                                    borderStyle: 'solid'
                                }}
                            >
                                <th
                                    style={{
                                        borderWidth: '1px',
                                        borderColor: '#000',
                                        borderStyle: 'solid',
                                        padding: '5px'
                                    }}
                                >
                                    <strong>Document Name</strong>
                                </th>
                                <th
                                    style={{
                                        borderWidth: '1px',
                                        borderColor: '#000',
                                        borderStyle: 'solid',
                                        padding: '5px'
                                    }}
                                >
                                    <strong>Description</strong>
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            {content?.documents?.length > 0
                                ? content?.documents?.map((document: any, index: number) => (
                                    <tr
                                        key={index}
                                        style={{
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
                                            {document.name}
                                        </td>
                                        <td
                                            style={{
                                                borderWidth: '1px',
                                                borderColor: '#000',
                                                borderStyle: 'solid',
                                                padding: '5px'
                                            }}
                                        >
                                            {document.description}
                                        </td>
                                    </tr>
                                ))
                                : <tr
                                    style={{
                                        borderWidth: '1px',
                                        borderColor: '#000',
                                        borderStyle: 'solid'
                                    }}
                                >
                                    <td
                                        colSpan={2}
                                        style={{
                                            borderWidth: '1px',
                                            borderColor: '#000',
                                            borderStyle: 'solid',
                                            padding: '5px'
                                        }}
                                    >
                                        No Bank Details Found
                                    </td>
                                </tr>
                            }
                            </tbody>
                        </table>
                    </div>
                </div>
                <Footer/>
            </div>
        </div>
    );
}

export default Preview;
