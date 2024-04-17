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
                            alignItems: 'center',
                            marginTop: '10px',
                            marginBottom: '10px',
                        }}>
                        <h1
                            style={{
                                fontSize: '18px',
                                fontWeight: 'bold'
                            }}>
                            Purchase Order
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
                                <strong>Order No:</strong> {content?.lpo_number}
                            </span>
                            <span style={{fontSize: '12px'}}>
                                <strong>Date:</strong> {(new Date(content?.created_at)).toDateString()}
                            </span>
                        </div>
                        <div style={{display: 'flex', flexDirection: 'column', gap: '5px'}}>
                            <span style={{fontSize: '12px'}}>
                                <strong>Requisition Code:</strong> {content?.purchase_requisition?.pr_code}
                            </span>
                            <span style={{fontSize: '12px'}}>
                                <strong>Requested By:</strong> {content?.purchase_requisition?.employee?.name}
                            </span>
                            <span style={{fontSize: '12px'}}>
                                <strong>Internal Document No:</strong> {content?.internal_document_number}
                            </span>
                        </div>
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginTop: '10px',
                            marginBottom: '10px'
                        }}>
                        <div style={{display: 'flex', flexDirection: 'column'}}>
                            <span style={{marginBottom: '5px'}}><strong>TO</strong></span>
                            <span style={{fontSize: '13px'}}><strong>{content?.vendor?.name}</strong></span>
                            <span style={{fontSize: '13px'}}>{content?.vendor?.address + ' ' + content?.vendor?.city?.name + ', ' + content?.vendor?.state?.name}</span>
                            <span style={{fontSize: '13px'}}>{content?.vendor?.country?.name + ' ' + content?.vendor?.postal_code}</span>
                            <span style={{fontSize: '13px'}}>{content?.vendor?.phone}</span>
                            <span style={{fontSize: '13px'}}><strong>Rep: </strong>{content?.vendor_representative.name}</span>
                            <span style={{fontSize: '13px'}}><strong>Rep Ph: </strong>{content?.vendor_representative.phone}</span>
                        </div>
                        <div style={{display: 'flex', flexDirection: 'column'}}>
                            <span style={{textTransform: 'uppercase', marginBottom: '5px'}}><strong>Address
                                Correspondence To</strong></span>
                            <span style={{fontSize: '13px'}}>Flaxen Paints Industry LLC</span>
                            <span style={{fontSize: '13px'}}>
                                Plot # 593 Industrial Area <br/>
                                Umm Al Thuoob Umm Al Quwain, UAE
                            </span>
                            <span style={{fontSize: '13px'}}><strong>Name: </strong>Anwar Ali</span>
                            <span style={{fontSize: '13px'}}><strong>Email: </strong>info@flaxenpaints.com</span>
                            <span style={{fontSize: '13px'}}><strong>Phone: </strong>+971544765504</span>
                        </div>
                    </div>
                    <div style={{marginTop: '20px'}}>
                        <table style={{
                            width: '100%',
                            borderCollapse: 'collapse',
                        }}>
                            <thead style={{backgroundColor: '#f9fafb', borderBottom: '2px solid #e5e7eb'}}>
                            <tr>
                                <th style={{textAlign: 'left', paddingLeft: '5px', paddingRight: '5px', paddingTop: '2px', paddingBottom: '2px'}}>#</th>
                                <th style={{textAlign: 'left', paddingLeft: '5px', paddingRight: '5px', paddingTop: '2px', paddingBottom: '2px'}}>Item</th>
                                <th style={{textAlign: 'left', paddingLeft: '5px', paddingRight: '5px', paddingTop: '2px', paddingBottom: '2px'}}>Unit</th>
                                <th style={{textAlign: 'left', paddingLeft: '5px', paddingRight: '5px', paddingTop: '2px', paddingBottom: '2px'}}>Description</th>
                                <th style={{textAlign: 'left', paddingLeft: '5px', paddingRight: '5px', paddingTop: '2px', paddingBottom: '2px'}}>Quantity</th>
                                <th style={{textAlign: 'left', paddingLeft: '5px', paddingRight: '5px', paddingTop: '2px', paddingBottom: '2px'}}>Unit Price</th>
                                <th style={{textAlign: 'left', paddingLeft: '5px', paddingRight: '5px', paddingTop: '2px', paddingBottom: '2px'}}>Total</th>
                            </tr>
                            </thead>
                            <tbody>
                            {content?.items?.map((item:any, index:number) => (
                                <tr key={index}>
                                    <td style={{textAlign: 'left', paddingLeft: '5px', paddingRight: '5px', paddingTop: '2px', paddingBottom: '2px'}}>{index + 1}</td>
                                    <td style={{textAlign: 'left', paddingLeft: '5px', paddingRight: '5px', paddingTop: '2px', paddingBottom: '2px'}}>{item.raw_product?.name}</td>
                                    <td style={{textAlign: 'left', paddingLeft: '5px', paddingRight: '5px', paddingTop: '2px', paddingBottom: '2px'}}>{item.unit?.name}</td>
                                    <td style={{textAlign: 'left', paddingLeft: '5px', paddingRight: '5px', paddingTop: '2px', paddingBottom: '2px'}}>{item.description}</td>
                                    <td style={{textAlign: 'left', paddingLeft: '5px', paddingRight: '5px', paddingTop: '2px', paddingBottom: '2px'}}>{item.quantity}</td>
                                    <td style={{textAlign: 'left', paddingLeft: '5px', paddingRight: '5px', paddingTop: '2px', paddingBottom: '2px'}}>{item.unit_price}</td>
                                    <td style={{textAlign: 'left', paddingLeft: '5px', paddingRight: '5px', paddingTop: '2px', paddingBottom: '2px'}}>{item.total_price}</td>
                                </tr>
                            ))}
                            </tbody>
                            <tfoot style={{backgroundColor: '#f9fafb', borderTop: '2px solid #e5e7eb', marginTop: '10px'}}>
                            <tr>
                                <td colSpan={6} style={{textAlign: 'right', fontWeight: 'bold', paddingLeft: '5px', paddingRight: '5px', paddingTop: '2px', paddingBottom: '2px'}}>
                                    Total Without Tax
                                </td>
                                <td style={{textAlign: 'left', paddingLeft: '5px', paddingRight: '5px', paddingTop: '2px', paddingBottom: '2px'}}>
                                    {content?.items?.reduce((acc: number, item: any) => acc + item.total_price, 0)}
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={6} style={{textAlign: 'right', fontWeight: 'bold', paddingLeft: '5px', paddingRight: '5px', paddingTop: '2px', paddingBottom: '2px'}}>
                                    VAT
                                </td>
                                <td style={{textAlign: 'left', paddingLeft: '5px', paddingRight: '5px', paddingTop: '2px', paddingBottom: '2px'}}>
                                    {content?.items?.reduce((acc: number, item: any) => acc + item.tax_amount, 0)}
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={6} style={{textAlign: 'right', fontWeight: 'bold', paddingLeft: '5px', paddingRight: '5px', paddingTop: '2px', paddingBottom: '2px'}}>
                                    Grand Total
                                </td>
                                <td style={{textAlign: 'left', paddingLeft: '5px', paddingRight: '5px', paddingTop: '2px', paddingBottom: '2px'}}>
                                    {content?.items?.reduce((acc: number, item: any) => acc + item.grand_total, 0)}
                                </td>
                            </tr>
                            </tfoot>
                        </table>
                    </div>
                    <div style={{padding: '10px'}}>
                        <div>
                            <span style={{fontWeight: 'bold', marginTop: '20px'}}>Terms and Conditions</span>
                            <div dangerouslySetInnerHTML={{__html: content?.terms_conditions}}/>
                        </div>

                        <div style={{
                            marginTop: '20px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <div style={{display: 'flex', flexDirection: 'column'}}>
                                <span style={{fontWeight: 'bold', marginBottom: '5px'}}>Purchased By</span>
                                <span>{content?.purchased_by?.name}</span>
                                <span>{content?.purchased_by?.email}</span>
                                <span>{content?.purchased_by?.employee?.phone}</span>
                            </div>
                            <div style={{display: 'flex', flexDirection: 'column'}}>
                                <span style={{fontWeight: 'bold', marginBottom: '5px'}}>Received By</span>
                                <span>{content?.received_by?.name}</span>
                                <span>{content?.received_by?.email}</span>
                                <span>{content?.received_by?.employee?.phone}</span>
                            </div>
                        </div>
                    </div>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        alignItems: 'flex-end',
                        marginTop: '32px'
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
