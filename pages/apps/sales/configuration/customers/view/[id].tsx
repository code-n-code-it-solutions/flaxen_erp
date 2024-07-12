import React, { useEffect } from 'react';
import PageWrapper from '@/components/PageWrapper';
import { serverFilePath } from '@/utils/helper';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '@/store';
import { clearCustomerState, showDetails } from '@/store/slices/customerSlice';
import { setAuthToken } from '@/configs/api.config';
import { setPageTitle } from '@/store/slices/themeConfigSlice';
import { AppBasePath, ButtonType, ButtonVariant, IconType } from '@/utils/enums';
import AppLayout from '@/components/Layouts/AppLayout';
import useSetActiveMenu from '@/hooks/useSetActiveMenu';
import DetailPageHeader from '@/components/apps/DetailPageHeader';

const View = () => {
    useSetActiveMenu(AppBasePath.Customer);
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { customerDetail, loading } = useAppSelector((state) => state.customer);
    const { token } = useAppSelector((state) => state.user);
    const [ids, setIds] = React.useState<string[]>([]);

    useEffect(() => {
        dispatch(setPageTitle('View Customer'));
        dispatch(clearCustomerState());
        setAuthToken(token);
        const query = router.query.id;
        if (query) {
            setIds(Array.isArray(query) ? query : [query]);
            const id = Array.isArray(query) ? query[0] : query;
            dispatch(showDetails(parseInt(id)));
        }
    }, [router.query, dispatch]);

    return (
        <div>
            <DetailPageHeader
                appBasePath={AppBasePath.Customer}
                title="Customer Details"
                middleComponent={{
                    show: true,
                    edit: {
                        show: true
                    },
                    print: {
                        show: true,
                        onClick: () => router.push('/apps/sales/configuration/customers/print/' + ids.join('/'))
                    },
                    delete: {
                        show: false
                    },
                    duplicate: {
                        show: true,
                        onClick: () => console.log('duplicate')
                    },
                    email: {
                        show: true,
                        onClick: () => console.log('email')
                    }
                }}
                backButton={{
                    show: true,
                    backLink: '/apps/sales/configuration/customers'
                }}
            />
            <PageWrapper
                loading={loading}
                breadCrumbItems={[]}
                embedLoader={true}
            >
                {customerDetail && (
                    <div>
                        <div className="flex justify-between items-start">
                            <span>
                                <strong>
                                    Registered At:
                                </strong> {(new Date(customerDetail.created_at)).toDateString()}
                            </span>
                            <span>
                                <strong>Customer Number:</strong> {customerDetail.customer_code}
                            </span>
                        </div>
                        <table className="my-3">
                            <tbody>
                            <tr>
                                <td>Name:</td>
                                <td>{customerDetail.name}</td>
                                <td>Email:</td>
                                <td>{customerDetail.email}</td>
                            </tr>
                            <tr>
                                <td>Phone:</td>
                                <td>{customerDetail.phone}</td>
                                <td>Opening Balance:</td>
                                <td>{customerDetail.opening_balance}</td>
                            </tr>
                            <tr>
                                <td>Due In Days:</td>
                                <td>{customerDetail.due_in_days}</td>
                                <td>Customer Type:</td>
                                <td>{customerDetail.customer_type?.name}</td>
                            </tr>
                            <tr>
                                <td>Opening Balance:</td>
                                <td>{customerDetail.opening_balance}</td>
                                <td>Credit Limit:</td>
                                <td>{customerDetail.credit_limit}</td>
                            </tr>
                            <tr>
                                <td>Tax Reg #:</td>
                                <td>{customerDetail.tax_registration}</td>
                                <td>Website:</td>
                                <td>{customerDetail.website_url}</td>
                            </tr>
                            <tr>
                                <td>Is Vendor Too?:</td>
                                <td>{customerDetail.is_vendor ? 'Yes' : 'No'}</td>
                                <td>Is Allow Invoice More Than Credit?:</td>
                                <td>{customerDetail.allow_invoice_more_than_credit ? 'Yes' : 'No'}</td>
                            </tr>
                            <tr>
                                <td>Address:</td>
                                <td colSpan={3}>
                                    {customerDetail.address} {customerDetail.city} {customerDetail?.state},{customerDetail.country},{customerDetail.postal_code}
                                </td>
                            </tr>
                            </tbody>
                        </table>
                        <h4 className="font-bold mt-5">Customer Contact Persons:</h4>
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
                            {customerDetail?.contact_persons?.length > 0
                                ? customerDetail?.contact_persons?.map((rep: any, index: number) => (
                                    <tr key={index}>
                                        <td>
                                            <img src={serverFilePath(rep.thumbnail?.path)} alt={rep.name} width={40}
                                                 height={40}
                                                 className="h-10 w-10 rounded-full" />
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
                        <h4 className="font-bold mt-5">Customer Addresses:</h4>
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
                            {customerDetail?.addresses?.length > 0
                                ? customerDetail?.addresses?.map((address: any, index: number) => (
                                    <tr key={index}>
                                        <td>{address.address_type_name}</td>
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
                        <h4 className="font-bold mt-5">Bank Details:</h4>
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
                            {customerDetail?.bank_accounts?.length > 0
                                ? customerDetail?.bank_accounts?.map((bank: any, index: number) => (
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
        </div>
    );
};

View.getLayout = (page: any) => <AppLayout>{page}</AppLayout>;
export default View;
