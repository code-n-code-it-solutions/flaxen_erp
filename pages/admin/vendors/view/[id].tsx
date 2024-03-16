import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {ThunkDispatch} from 'redux-thunk';
import {IRootState} from '@/store';
import {AnyAction} from 'redux';
import {useRouter} from 'next/router';
import {setPageTitle} from '@/store/slices/themeConfigSlice';
import {clearVendorState, showDetails} from '@/store/slices/vendorSlice';
import PageWrapper from '@/components/PageWrapper';
import {generatePDF, getIcon, imagePath} from '@/utils/helper';
import Button from '@/components/Button';
import {ButtonSize, ButtonType, ButtonVariant, IconType} from '@/utils/enums';
import Preview from '@/pages/admin/vendors/preview';

const View = () => {
    const dispatch = useDispatch<ThunkDispatch<IRootState, any, AnyAction>>();
    const router = useRouter();
    const {loading, vendorDetail} = useSelector((state: IRootState) => state.vendor);
    const [printLoading, setPrintLoading] = useState<boolean>(false);
    const breadCrumbItems = [
        {
            title: 'Home',
            href: '/main',
        },
        {
            title: 'All Vendors',
            href: '/admin/vendors',
        },
        {
            title: 'Vendors Details',
            href: '#',
        },
    ];

    useEffect(() => {
        dispatch(setPageTitle('Vendors Details'));
        dispatch(clearVendorState());

        const VendorId = router.query.id;

        if (VendorId) {
            const id = Array.isArray(VendorId) ? VendorId[0] : VendorId;
            dispatch(showDetails(parseInt(id)));
        }
    }, [router.query.id, dispatch]);

    return (
        <PageWrapper loading={loading} breadCrumbItems={breadCrumbItems} embedLoader={true}>
            <div>
                <div className="mb-5 flex items-center justify-between">
                    <h5 className="text-lg font-semibold dark:text-white-light">Details of Vendors</h5>
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
                            onClick={() => generatePDF(<Preview content={vendorDetail}/>, setPrintLoading)}
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
                            link="/admin/vendors"
                            size={ButtonSize.small}
                        />
                    </div>
                </div>
                {vendorDetail && (
                    <div className="h-950 px-10">
                        <div className="flex justify-center flex-col items-center mt-10 mb-10">
                            <h1 className="text-2xl font-bold">Vendor Details</h1>
                        </div>
                        <div className="flex justify-between items-start p-10">
                            <div className="flex flex-col gap-5">
                                <span className="text-xs">
                                    <strong>Registered At:</strong> {(new Date(vendorDetail.created_at)).toDateString()}
                                </span>
                                <span className="text-xs">
                                    <strong>Printed At:</strong> {(new Date()).toDateString()}
                                </span>
                                <span className="text-xs">
                                    <strong>Vendor Number:</strong> {vendorDetail.vendor_number}
                                </span>
                                <span className="text-xs">
                                    <strong>Name:</strong> {vendorDetail.name}
                                </span>
                                <span className="text-xs">
                                    <strong>Opening Balance:</strong> {vendorDetail.opening_balance}
                                </span>
                                <span className="text-xs">
                                    <strong>Phone:</strong> {vendorDetail.phone}
                                </span>
                                <span className="text-xs">
                                    <strong>Email:</strong> {vendorDetail.email}
                                </span>
                                <span className="text-xs">
                                    <strong>Tax Reg #:</strong> {vendorDetail.tax_reg_no}
                                </span>
                                <span className="text-xs">
                                    <strong>Address:</strong> {vendorDetail.address} {vendorDetail.city} {vendorDetail?.state},{vendorDetail.country},{vendorDetail.postal_code}
                                </span>
                            </div>
                            <div>
                                <span className="text-xs absolute top-[42%] left-[34%]">
                                    <strong>Due In Days:</strong> {vendorDetail.due_in_days}
                                </span>
                            </div>
                            <div>
                                <span className="text-xs absolute top-[44%] left-[34%]">
                                    <strong>Vendor Type:</strong> {vendorDetail.vendor_type_id}
                                </span>
                            </div>
                            <div>
                                <span className="text-xs absolute top-[42%] left-[52%]">
                                    <strong>Website:</strong> {vendorDetail.website_url}
                                </span>
                            </div>
                            <img src={imagePath(vendorDetail.thumbnail)} className="w-24 h-24" alt=""/>
                        </div>
                        <div className="mt-10">
                            <h4 className="font-bold">Vendor Representatives:</h4>
                        </div>

                        <table>
                            <thead>
                            <tr>
                                <th>Photo</th>
                                <th>Name</th>
                                <th>Phone</th>
                                <th>Email</th>
                                <th>Address</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>&nbsp;</td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                            </tbody>
                        </table>
                        <div className="mt-10">
                            <h4 className="font-bold">Vendor Addresses:</h4>
                        </div>
                        <table>
                            <thead>
                            <tr>
                                <th>Address Type</th>
                                <th>Country</th>
                                <th>State</th>
                                <th>City</th>
                                <th>Address</th>
                                <th>Postal Code</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>&nbsp;</td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                            </tbody>
                        </table>
                        <div className="mt-10">
                            <h4 className="font-bold">Bank Details:</h4>
                        </div>
                        <table>
                            <thead>
                            <tr>
                                <th>Bank</th>
                                <th>Account Number</th>
                                <th>Account Title</th>
                                <th>IBAN</th>
                                <th>Currency</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>&nbsp;</td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                            </tbody>
                        </table>


                    </div>
                )}
            </div>
        </PageWrapper>
    );
};

export default View;
