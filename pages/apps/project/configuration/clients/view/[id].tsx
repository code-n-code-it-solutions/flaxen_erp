import React, { useEffect } from 'react';
import PageWrapper from '@/components/PageWrapper';
import { serverFilePath } from '@/utils/helper';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '@/store';
import { setAuthToken } from '@/configs/api.config';
import { setPageTitle } from '@/store/slices/themeConfigSlice';
import { AppBasePath, ButtonType, ButtonVariant, IconType } from '@/utils/enums';
import useSetActiveMenu from '@/hooks/useSetActiveMenu';
import DetailPageHeader from '@/components/apps/DetailPageHeader';
import { clearClientState, showDetails } from '@/store/slices/projects/clientSlice';

const View = () => {
    useSetActiveMenu(AppBasePath.Client);
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { clientDetail, loading } = useAppSelector((state) => state.client);
    const { token } = useAppSelector((state) => state.user);
    const [ids, setIds] = React.useState<string[]>([]);

    useEffect(() => {
        dispatch(setPageTitle('View Client'));
        dispatch(clearClientState());
        setAuthToken(token);
        const query = router.query.id;
        if (query) {
            setIds(Array.isArray(query) ? query : [query]);
            const id = Array.isArray(query) ? query[0] : query;
            dispatch(showDetails(parseInt(id)));
        }
    }, [router.query, dispatch]);

    return (
        <div className="flex flex-col gap-3">
            <DetailPageHeader
                appBasePath={AppBasePath.Client}
                title="Client Details"
                middleComponent={{
                    show: true,
                    edit: {
                        show: true
                    },
                    print: {
                        show: true,
                        onClick: () => router.push(AppBasePath.Client + '/print/' + ids.join('/'))
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
                    backLink: AppBasePath.Client
                }}
            />
            <PageWrapper
                loading={loading}
                breadCrumbItems={[]}
                embedLoader={true}
            >
                {clientDetail && (
                    <div>
                        <div className="flex justify-between items-start">
                            <span>
                                <strong>
                                    Registered At:
                                </strong> {(new Date(clientDetail.created_at)).toDateString()}
                            </span>
                            <span>
                                <strong>Client Number:</strong> {clientDetail.customer_code}
                            </span>
                        </div>
                        <table className="my-3">
                            <tbody>
                            <tr>
                                <td>Name:</td>
                                <td>{clientDetail.name}</td>
                                <td>Email:</td>
                                <td>{clientDetail.email}</td>
                            </tr>
                            <tr>
                                <td>Phone:</td>
                                <td>{clientDetail.phone}</td>
                                <td>Opening Balance:</td>
                                <td>{clientDetail.opening_balance}</td>
                            </tr>
                            <tr>
                                <td>Due In Days:</td>
                                <td>{clientDetail.due_in_days}</td>
                                <td>Client Type:</td>
                                <td>{clientDetail.customer_type?.name}</td>
                            </tr>
                            <tr>
                                <td>Opening Balance:</td>
                                <td>{clientDetail.opening_balance}</td>
                                <td>Credit Limit:</td>
                                <td>{clientDetail.credit_limit}</td>
                            </tr>
                            <tr>
                                <td>Tax Reg #:</td>
                                <td>{clientDetail.tax_registration}</td>
                                <td>Website:</td>
                                <td>{clientDetail.website_url}</td>
                            </tr>
                            <tr>
                                <td>Is Vendor Too?:</td>
                                <td>{clientDetail.is_vendor ? 'Yes' : 'No'}</td>
                                <td>Is Allow Invoice More Than Credit?:</td>
                                <td>{clientDetail.allow_invoice_more_than_credit ? 'Yes' : 'No'}</td>
                            </tr>
                            <tr>
                                <td>Address:</td>
                                <td colSpan={3}>
                                    {clientDetail.address} {clientDetail.city} {clientDetail?.state},{clientDetail.country},{clientDetail.postal_code}
                                </td>
                            </tr>
                            </tbody>
                        </table>
                        <h4 className="font-bold mt-5">Client Contact Persons:</h4>
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
                            {clientDetail?.contact_persons?.length > 0
                                ? clientDetail?.contact_persons?.map((rep: any, index: number) => (
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
                        <h4 className="font-bold mt-5">Client Addresses:</h4>
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
                            {clientDetail?.addresses?.length > 0
                                ? clientDetail?.addresses?.map((address: any, index: number) => (
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
                            {clientDetail?.bank_accounts?.length > 0
                                ? clientDetail?.bank_accounts?.map((bank: any, index: number) => (
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

// View.getLayout = (page: any) => <AppLayout>{page}</AppLayout>;
export default View;
