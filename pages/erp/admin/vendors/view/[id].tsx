import React, {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from '@/store';
import {useRouter} from 'next/router';
import {setPageTitle} from '@/store/slices/themeConfigSlice';
import {clearVendorState, showDetails} from '@/store/slices/vendorSlice';
import PageWrapper from '@/components/PageWrapper';
import {serverFilePath} from '@/utils/helper';
import {ButtonType, ButtonVariant, IconType} from '@/utils/enums';

const View = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const {loading, vendorDetail} = useAppSelector((state) => state.vendor);
    const breadCrumbItems = [
        {
            title: 'Home',
            href: '/erp/main',
        },
        {
            title: 'Admin Dashboard',
            href: '/erp/admin',
        },
        {
            title: 'All Vendors',
            href: '/erp/admin/vendors',
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
        <PageWrapper
            loading={loading}
            breadCrumbItems={breadCrumbItems}
            embedLoader={true}
            title="Vendor Details"
            buttons={[
                {
                    text: 'Edit',
                    type: ButtonType.link,
                    variant: ButtonVariant.info,
                    icon: IconType.edit,
                    link: '/erp/admin/vendors/edit/' + router.query.id
                },
                {
                    text: 'Print',
                    type: ButtonType.link,
                    variant: ButtonVariant.success,
                    icon: IconType.print,
                    link: '/erp/admin/vendors/print/' + router.query.id
                },
                {
                    text: 'Back',
                    type: ButtonType.link,
                    variant: ButtonVariant.primary,
                    icon: IconType.back,
                    link: '/erp/admin/vendors'
                }
            ]}
        >
            {vendorDetail && (
                <div>
                    <div className="flex justify-between items-start">
                        <div className="flex flex-col gap-3">
                            <span>
                                <strong>Registered At:</strong> {(new Date(vendorDetail.created_at)).toDateString()}
                            </span>
                            <span>
                                <strong>Vendor Number:</strong> {vendorDetail.vendor_number}
                            </span>
                        </div>
                        <img src={serverFilePath(vendorDetail?.thumbnail?.path)} className="w-24 h-24" alt=""/>
                    </div>
                    <table className="my-3">
                        <tbody>
                        <tr>
                            <td>Name:</td>
                            <td>{vendorDetail.name}</td>
                            <td>Email:</td>
                            <td>{vendorDetail.email}</td>
                        </tr>
                        <tr>
                            <td>Phone:</td>
                            <td>{vendorDetail.phone}</td>
                            <td>Opening Balance:</td>
                            <td>{vendorDetail.opening_balance}</td>
                        </tr>
                        <tr>
                            <td>Due In Days:</td>
                            <td>{vendorDetail.due_in_days}</td>
                            <td>Vendor Type:</td>
                            <td>{vendorDetail.vendor_type.name}</td>
                        </tr>
                        <tr>
                            <td>Tax Reg #:</td>
                            <td>{vendorDetail.tax_reg_no}</td>
                            <td>Website:</td>
                            <td>{vendorDetail.website_url}</td>
                        </tr>
                        <tr>
                            <td>Address:</td>
                            <td colSpan={3}>
                                {vendorDetail.address} {vendorDetail.city} {vendorDetail?.state},{vendorDetail.country},{vendorDetail.postal_code}
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    <h4 className="font-bold mt-5">Vendor Representatives:</h4>

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
                        {vendorDetail?.representatives?.length > 0
                            ? vendorDetail?.representatives?.map((rep: any, index: number) => (
                                <tr key={index}>
                                    <td>
                                        <img src={serverFilePath(rep.thumbnail?.path)} alt={rep.name} width={40}
                                             height={40}
                                             className="h-10 w-10 rounded-full"/>
                                    </td>
                                    <td>{rep.name}</td>
                                    <td>{rep.phone}</td>
                                    <td>{rep.email}</td>
                                    <td>{rep.address} {rep.city} {rep.state},{rep.country},{rep.postal_code}</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5}>No Representatives Found</td>
                                </tr>
                            )}
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
                        {vendorDetail?.addresses?.length > 0
                            ? vendorDetail?.addresses?.map((address: any, index: number) => (
                                <tr key={index}>
                                    <td>{address.address_type}</td>
                                    <td>{address.country?.name}</td>
                                    <td>{address.state?.name}</td>
                                    <td>{address.city?.name}</td>
                                    <td>{address.address}</td>
                                    <td>{address.postal_code}</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={6}>No Addresses Found</td>
                                </tr>
                            )}
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
                        {vendorDetail?.bank_accounts?.length > 0
                            ? vendorDetail?.bank_accounts?.map((bank: any, index: number) => (
                                <tr key={index}>
                                    <td>{bank.bank?.name}</td>
                                    <td>{bank.account_number}</td>
                                    <td>{bank.account_title}</td>
                                    <td>{bank.iban}</td>
                                    <td>{bank.currency?.code}</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5}>No Bank Details Found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </PageWrapper>
    );
};

export default View;
