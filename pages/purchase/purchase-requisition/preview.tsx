import React, {useState} from "react";
import Header from "@/components/Report/Header";
import Footer from "@/components/Report/Footer";

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
                            gap: '10px',
                            marginBottom: '10px',
                        }}>
                        <h1
                            style={{
                                fontSize: '18px',
                                fontWeight: 'bold'
                            }}>
                            Purchase Requisition
                        </h1>
                        <span>{content?.requisition_date}</span>
                        <span>{content?.status}</span>
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                        <div style={{display: 'flex', flexDirection: 'column', gap: '5px'}}>
                            <span style={{fontSize: '12px'}}>
                                <strong>Requisition Title:</strong> {content?.pr_title}
                            </span>
                            <span style={{fontSize: '12px'}}>
                                <strong>Requisition Code:</strong> {content?.pr_code}
                            </span>
                            <span style={{fontSize: '12px'}}>
                                <strong>Date:</strong> {(new Date(content?.created_at)).toDateString()}
                            </span>
                        </div>
                        <div style={{display: 'flex', flexDirection: 'column', gap: '5px'}}>
                            <span style={{fontSize: '12px'}}>
                                <strong>Requested By:</strong> {content?.employee?.name}
                            </span>
                            <span style={{fontSize: '12px'}}>
                                <strong>Department:</strong> {content?.department?.name}
                            </span>
                            <span style={{fontSize: '12px'}}>
                                <strong>Designation:</strong> {content?.designation?.name}
                            </span>
                        </div>
                    </div>

                    <div style={{marginTop: '20px'}}>
                        <table style={{
                            width: '100%',
                            borderCollapse: 'collapse',
                        }}>
                            {content?.type === 'Material'
                                ? (
                                    <>
                                        <thead style={{backgroundColor: '#f9fafb', borderBottom: '2px solid #e5e7eb'}}>

                                        <tr>
                                            <th style={{
                                                textAlign: 'left',
                                                paddingLeft: '5px',
                                                paddingRight: '5px',
                                                paddingTop: '2px',
                                                paddingBottom: '2px'
                                            }}>
                                                #
                                            </th>
                                            <th style={{
                                                textAlign: 'left',
                                                paddingLeft: '5px',
                                                paddingRight: '5px',
                                                paddingTop: '2px',
                                                paddingBottom: '2px'
                                            }}>
                                                Item
                                            </th>
                                            <th style={{
                                                textAlign: 'left',
                                                paddingLeft: '5px',
                                                paddingRight: '5px',
                                                paddingTop: '2px',
                                                paddingBottom: '2px'
                                            }}>
                                                Description
                                            </th>
                                            <th style={{
                                                textAlign: 'left',
                                                paddingLeft: '5px',
                                                paddingRight: '5px',
                                                paddingTop: '2px',
                                                paddingBottom: '2px'
                                            }}>
                                                Unit
                                            </th>
                                            <th style={{
                                                textAlign: 'left',
                                                paddingLeft: '5px',
                                                paddingRight: '5px',
                                                paddingTop: '2px',
                                                paddingBottom: '2px'
                                            }}>
                                                Unit Price
                                            </th>
                                            <th style={{
                                                textAlign: 'left',
                                                paddingLeft: '5px',
                                                paddingRight: '5px',
                                                paddingTop: '2px',
                                                paddingBottom: '2px'
                                            }}>
                                                Quantity
                                            </th>
                                            <th style={{
                                                textAlign: 'left',
                                                paddingLeft: '5px',
                                                paddingRight: '5px',
                                                paddingTop: '2px',
                                                paddingBottom: '2px'
                                            }}>
                                                Total
                                            </th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {content?.purchase_requisition_items?.map((item: any, index: number) => (
                                            <tr key={index}>
                                                <td style={{
                                                    textAlign: 'left',
                                                    paddingLeft: '5px',
                                                    paddingRight: '5px',
                                                    paddingTop: '2px',
                                                    paddingBottom: '2px'
                                                }}>{index + 1}</td>
                                                <td style={{
                                                    textAlign: 'left',
                                                    paddingLeft: '5px',
                                                    paddingRight: '5px',
                                                    paddingTop: '2px',
                                                    paddingBottom: '2px'
                                                }}>{item.raw_product?.title + ' (' + item.raw_product?.item_code + ')'}</td>
                                                <td style={{
                                                    textAlign: 'left',
                                                    paddingLeft: '5px',
                                                    paddingRight: '5px',
                                                    paddingTop: '2px',
                                                    paddingBottom: '2px'
                                                }}>{item.unit?.name}</td>
                                                <td style={{
                                                    textAlign: 'left',
                                                    paddingLeft: '5px',
                                                    paddingRight: '5px',
                                                    paddingTop: '2px',
                                                    paddingBottom: '2px'
                                                }}>{item.description}</td>
                                                <td style={{
                                                    textAlign: 'left',
                                                    paddingLeft: '5px',
                                                    paddingRight: '5px',
                                                    paddingTop: '2px',
                                                    paddingBottom: '2px'
                                                }}>{item.unit_price}</td>
                                                <td style={{
                                                    textAlign: 'left',
                                                    paddingLeft: '5px',
                                                    paddingRight: '5px',
                                                    paddingTop: '2px',
                                                    paddingBottom: '2px'
                                                }}>{item.quantity}</td>
                                                <td style={{
                                                    textAlign: 'left',
                                                    paddingLeft: '5px',
                                                    paddingRight: '5px',
                                                    paddingTop: '2px',
                                                    paddingBottom: '2px'
                                                }}>{item.total_price}</td>
                                            </tr>
                                        ))}
                                        </tbody>
                                        <tfoot style={{
                                            backgroundColor: '#f9fafb',
                                            borderTop: '2px solid #e5e7eb',
                                            marginTop: '10px'
                                        }}>
                                        <tr>
                                            <td colSpan={4} style={{
                                                textAlign: 'right',
                                                paddingRight: '5px',
                                                paddingTop: '2px',
                                                paddingBottom: '2px'
                                            }}>
                                                <strong>Total</strong>
                                            </td>
                                            <td style={{
                                                textAlign: 'left',
                                                paddingLeft: '5px',
                                                paddingRight: '5px',
                                                paddingTop: '2px',
                                                paddingBottom: '2px'
                                            }}>
                                                {content?.purchase_requisition_items?.reduce((acc: any, item: any) => acc + parseFloat(item.unit_price), 0)}
                                            </td>
                                            <td style={{
                                                textAlign: 'left',
                                                paddingLeft: '5px',
                                                paddingRight: '5px',
                                                paddingTop: '2px',
                                                paddingBottom: '2px'
                                            }}>
                                                {content?.purchase_requisition_items?.reduce((acc: any, item: any) => acc + parseInt(item.quantity), 0)}
                                            </td>
                                            <td style={{
                                                textAlign: 'left',
                                                paddingLeft: '5px',
                                                paddingRight: '5px',
                                                paddingTop: '2px',
                                                paddingBottom: '2px'
                                            }}>
                                                {content?.purchase_requisition_items?.reduce((acc: any, item: any) => acc + parseFloat(item.total_price), 0)}
                                            </td>
                                        </tr>
                                        </tfoot>
                                    </>
                                )
                                : (
                                    <>
                                        <thead style={{backgroundColor: '#f9fafb', borderBottom: '2px solid #e5e7eb'}}>

                                        <tr>
                                            <th style={{
                                                textAlign: 'left',
                                                paddingLeft: '5px',
                                                paddingRight: '5px',
                                                paddingTop: '2px',
                                                paddingBottom: '2px'
                                            }}>
                                                #
                                            </th>
                                            <th style={{
                                                textAlign: 'left',
                                                paddingLeft: '5px',
                                                paddingRight: '5px',
                                                paddingTop: '2px',
                                                paddingBottom: '2px'
                                            }}>
                                                Assets
                                            </th>
                                            <th style={{
                                                textAlign: 'left',
                                                paddingLeft: '5px',
                                                paddingRight: '5px',
                                                paddingTop: '2px',
                                                paddingBottom: '2px'
                                            }}>
                                                Service Name
                                            </th>
                                            <th style={{
                                                textAlign: 'left',
                                                paddingLeft: '5px',
                                                paddingRight: '5px',
                                                paddingTop: '2px',
                                                paddingBottom: '2px'
                                            }}>
                                                Description
                                            </th>
                                            <th style={{
                                                textAlign: 'left',
                                                paddingLeft: '5px',
                                                paddingRight: '5px',
                                                paddingTop: '2px',
                                                paddingBottom: '2px'
                                            }}>
                                                Quantity
                                            </th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {content?.purchase_requisition_services?.map((item: any, index: number) => (
                                            <tr key={index}>
                                                <td style={{
                                                    textAlign: 'left',
                                                    paddingLeft: '5px',
                                                    paddingRight: '5px',
                                                    paddingTop: '2px',
                                                    paddingBottom: '2px'
                                                }}>{index + 1}</td>
                                                <td style={{
                                                    textAlign: 'left',
                                                    paddingLeft: '5px',
                                                    paddingRight: '5px',
                                                    paddingTop: '2px',
                                                    paddingBottom: '2px'
                                                }}>
                                                    <div style={{display: 'flex', flexDirection: 'column', gap: '5px'}}>
                                                        {item.asset_ids?.map((asset: any, index: number) => (
                                                            <span
                                                                key={index}>{asset.name + ' (' + asset.code + ')'}</span>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td style={{
                                                    textAlign: 'left',
                                                    paddingLeft: '5px',
                                                    paddingRight: '5px',
                                                    paddingTop: '2px',
                                                    paddingBottom: '2px'
                                                }}>{item?.service_name}</td>
                                                <td style={{
                                                    textAlign: 'left',
                                                    paddingLeft: '5px',
                                                    paddingRight: '5px',
                                                    paddingTop: '2px',
                                                    paddingBottom: '2px'
                                                }}>{item.description}</td>
                                                <td style={{
                                                    textAlign: 'left',
                                                    paddingLeft: '5px',
                                                    paddingRight: '5px',
                                                    paddingTop: '2px',
                                                    paddingBottom: '2px'
                                                }}>{item.quantity}</td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </>
                                )}
                        </table>
                    </div>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        alignItems: 'flex-end',
                        marginTop: '50px'
                    }}>
                        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '32px'}}>
                            <span style={{fontWeight: 'bold'}}>Approved By</span>
                            <span>________________________</span>
                        </div>
                    </div>
                </div>
                <Footer/>
            </div>
        </div>
    )
        ;
}

export default Preview;
