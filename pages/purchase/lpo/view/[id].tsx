import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {ThunkDispatch} from 'redux-thunk';
import {IRootState} from '@/store';
import {AnyAction} from 'redux';
import {useRouter} from 'next/router';
import {setPageTitle} from '@/store/slices/themeConfigSlice';
import {clearLocalPurchaseOrderState, showDetails} from "@/store/slices/localPurchaseOrderSlice";
import PageWrapper from '@/components/PageWrapper';
import {generatePDF, getIcon, imagePath} from '@/utils/helper';
import Image from 'next/image';
import Button from '@/components/Button';
import {ButtonSize, ButtonType, ButtonVariant, IconType} from '@/utils/enums';
import Preview from '@/pages/purchase/lpo/preview';

const View = () => {
    const dispatch = useDispatch<ThunkDispatch<IRootState, any, AnyAction>>();
    const router = useRouter();
    const {loading, LPODetail} = useSelector((state: IRootState) => state.localPurchaseOrder);
    const [printLoading, setPrintLoading] = useState<boolean>(false);
    const breadCrumbItems = [
        {
            title: 'Home',
            href: '/main',
        },
        {
            title: 'All Local Purchase Order',
            href: '/purchase/lpo',
        },
        {
            title: 'Local Purchase Order Details',
            href: '#',
        },
    ];

    useEffect(() => {
        dispatch(setPageTitle('Local Purchase Order Details'));
        dispatch(clearLocalPurchaseOrderState());

        const lpoId = router.query.id;
        // console.log('LPO ID:', lpoId);

        if (lpoId) {
            // If the lpoId is an array (with catch-all routes), take the first element.
            const id = Array.isArray(lpoId) ? lpoId[0] : lpoId;
            dispatch(showDetails(parseInt(id)));
        }
    }, [router.query.id, dispatch]);

    useEffect(() => {
        if (LPODetail) {
            console.log("LPO Detail:", LPODetail);
        }
    }, [LPODetail])

    return (
        <PageWrapper loading={loading} breadCrumbItems={breadCrumbItems} embedLoader={true}>
            <div>
                <div className="mb-5 flex items-center justify-between">
                    <h5 className="text-lg font-semibold dark:text-white-light">Details of Local Purchase Order</h5>
                    <div className="flex justify-end gap-3">
                        <Button
                            text={
                                printLoading ? (
                                    'Generating...'
                                ) : (
                                    <span className="flex items-center">
                                        {getIcon(IconType.print, 0, 0, 'h-5 w-5 ltr:mr-2 rtl:ml-2')}
                                        Print
                                    </span>
                                )
                            }
                            type={ButtonType.button}
                            variant={ButtonVariant.success}
                            size={ButtonSize.small}
                            disabled={printLoading}
                            onClick={() => generatePDF(<Preview content={LPODetail}/>, setPrintLoading)}
                        />
                        <Button
                            text={
                                <span className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ltr:mr-2 rtl:ml-2"
                                         width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path d="M15 5L9 12L15 19" stroke="currentColor" strokeWidth="1.5"
                                              strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    Back
                                </span>
                            }
                            type={ButtonType.link}
                            variant={ButtonVariant.primary}
                            link="/purchase/lpo"
                            size={ButtonSize.small}
                        />
                    </div>
                </div>
                {LPODetail && (
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
                                <strong>Order No:</strong> {LPODetail?.lpo_number}
                            </span>
                            <span style={{fontSize: '12px'}}>
                                <strong>Date:</strong> {(new Date(LPODetail?.created_at)).toDateString()}
                            </span>
                        </div>
                        <div style={{display: 'flex', flexDirection: 'column', gap: '5px'}}>
                            <span style={{fontSize: '12px'}}>
                                <strong>Requisition Code:</strong> {LPODetail?.purchase_requisition?.pr_code}
                            </span>
                            <span style={{fontSize: '12px'}}>
                                <strong>Requested By:</strong> {LPODetail?.purchase_requisition?.employee?.name}
                            </span>
                            <span style={{fontSize: '12px'}}>
                                <strong>Internal Document No:</strong> {LPODetail?.internal_document_number}
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
                            <span style={{fontSize: '13px'}}><strong>{LPODetail?.vendor?.name}</strong></span>
                            <span style={{fontSize: '13px'}}>{LPODetail?.vendor?.address + ' ' + LPODetail?.vendor?.city?.name + ', ' + LPODetail?.vendor?.state?.name}</span>
                            <span style={{fontSize: '13px'}}>{LPODetail?.vendor?.country?.name + ' ' + LPODetail?.vendor?.postal_code}</span>
                            <span style={{fontSize: '13px'}}>{LPODetail?.vendor?.phone}</span>
                            <span style={{fontSize: '13px'}}><strong>Rep: </strong>{LPODetail?.vendor_representative.name}</span>
                            <span style={{fontSize: '13px'}}><strong>Rep Ph: </strong>{LPODetail?.vendor_representative.phone}</span>
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
                            <thead>
                            <tr>
                                <th>#</th>
                                <th>Item</th>
                                <th>Unit</th>
                                <th>Description</th>
                                <th>Quantity</th>
                                <th>Unit Price</th>
                                <th>Total</th>
                            </tr>
                            </thead>
                            <tbody>
                            {LPODetail?.items.map((item:any, index:number) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{item.raw_product?.name}</td>
                                    <td>{item.unit?.name}</td>
                                    <td>{item.description}</td>
                                    <td>{item.quantity}</td>
                                    <td>{item.unit_price}</td>
                                    <td>{item.total_price}</td>
                                </tr>
                            ))}
                            </tbody>
                            <tfoot style={{backgroundColor: '#f9fafb', borderTop: '2px solid #e5e7eb', marginTop: '10px'}}>
                            <tr>
                                <td colSpan={6} style={{textAlign: 'right', fontWeight: 'bold', paddingLeft: '5px', paddingRight: '5px', paddingTop: '2px', paddingBottom: '2px'}}>
                                    Total Without Tax
                                </td>
                                <td style={{textAlign: 'left', paddingLeft: '5px', paddingRight: '5px', paddingTop: '2px', paddingBottom: '2px'}}>
                                    {LPODetail?.items?.reduce((acc: number, item: any) => acc + item.total_price, 0)}
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={6} style={{textAlign: 'right', fontWeight: 'bold', paddingLeft: '5px', paddingRight: '5px', paddingTop: '2px', paddingBottom: '2px'}}>
                                    VAT
                                </td>
                                <td style={{textAlign: 'left', paddingLeft: '5px', paddingRight: '5px', paddingTop: '2px', paddingBottom: '2px'}}>
                                    {LPODetail?.items?.reduce((acc: number, item: any) => acc + item.tax_amount, 0)}
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={6} style={{textAlign: 'right', fontWeight: 'bold', paddingLeft: '5px', paddingRight: '5px', paddingTop: '2px', paddingBottom: '2px'}}>
                                    Grand Total
                                </td>
                                <td style={{textAlign: 'left', paddingLeft: '5px', paddingRight: '5px', paddingTop: '2px', paddingBottom: '2px'}}>
                                    {LPODetail?.items?.reduce((acc: number, item: any) => acc + item.grand_total, 0)}
                                </td>
                            </tr>
                            </tfoot>
                        </table>
                    </div>
                    <div style={{padding: '10px'}}>
                        <div>
                            <span style={{fontWeight: 'bold', marginTop: '20px'}}>Terms and Conditions</span>
                            <div dangerouslySetInnerHTML={{__html: LPODetail?.terms_conditions}}/>
                        </div>

                        {/* <div style={{
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
                        </div> */}
                    </div>
                    {/* <div style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        alignItems: 'flex-end',
                        marginTop: '32px'
                    }}>
                        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '32px'}}>
                            <span style={{fontWeight: 'bold'}}>Approved By</span>
                            <span>________________________</span>
                        </div>
                    </div> */}
                </div>
                )}
            </div>
        </PageWrapper>
    );
};

export default View;
