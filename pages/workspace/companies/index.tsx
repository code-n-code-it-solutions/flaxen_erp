import React, { useEffect, useState } from 'react';
import WorkspaceLayout from '@/components/Layouts/WorkspaceLayout';
import { useAppDispatch, useAppSelector } from '@/store';
import { setPageTitle } from '@/store/slices/themeConfigSlice';
import PageWrapper from '@/components/PageWrapper';
import Image from 'next/image';
import Link from 'next/link';
import { ButtonType, ButtonVariant, IconType } from '@/utils/enums';
import { setAuthToken } from '@/configs/api.config';
import { getCompanyListByUser } from '@/store/slices/companySlice';
import { serverFilePath } from '@/utils/helper';

const Index = () => {
    const dispatch = useAppDispatch();
    const { user, token } = useAppSelector(state => state.user);
    const { companies, loading } = useAppSelector(state => state.company);
    const [companyList, setCompanyList] = useState<any[]>([]);
    const breadcrumbItems = [
        {
            title: 'Dashboard',
            href: '/workspace'
        },
        {
            title: 'Companies',
            href: '#'
        }
    ];

    useEffect(() => {
        dispatch(setPageTitle('Companies'));
        setAuthToken(token);
        dispatch(getCompanyListByUser(user?.id));
    }, []);

    useEffect(() => {
        if (companies) {
            setCompanyList(companies);
        }
    }, [companies]);

    return (
        <PageWrapper
            title="Companies"
            breadCrumbItems={breadcrumbItems}
            embedLoader={true}
            loading={loading}
            buttons={[
                {
                    text: 'Register Company',
                    type: ButtonType.link,
                    variant: ButtonVariant.primary,
                    icon: IconType.add,
                    link: '/workspace/companies/create'
                }
            ]}
        >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4 justify-center items-center">
                {companyList.length > 0
                    ? (companyList.map((company, index) => (
                        <div className="relative" key={index}>
                            <div
                                className={`badge ${company.is_active ? 'bg-success' : 'bg-danger'} text-white absolute shadow top-1 end-1`}>
                                {company.is_active ? 'Active' : 'Inactive'}
                            </div>
                            <div
                                className="flex flex-col flex-1 justify-start gap-5 items-center py-5 border rounded shadow">
                                <Image src={serverFilePath(company.branches[0]?.logo)}
                                       height={200}
                                       width={200} alt={company.name} />
                                <div className="text-center mt-5">
                                    <h1 className="text-lg font-bold mb-1">{company.name}</h1>
                                    {/*<p className="text-sm">Paints and Coatings</p>*/}
                                    <p className="text-[12px]">{(new Date(company.created_at)).toLocaleDateString() + ' ' + (new Date(company.created_at)).toLocaleTimeString()}</p>
                                </div>
                                <table className="border">
                                    <tbody>
                                    <tr>
                                        <td className="border">{company.subscription?.subscription_plan?.name}</td>
                                        <td className="border">{company.subscription?.end_date + ' (' + company.subscription?.interval + ')'}</td>
                                    </tr>
                                    </tbody>
                                </table>
                                <div className="flex justify-center items-center gap-2">
                                    <Link
                                        href={`/workspace/companies/detail/${company.id}`}
                                        className="btn btn-primary btn-sm"
                                    >
                                        View Details
                                    </Link>
                                    {/*<Link*/}
                                    {/*    href={`/erp/main`}*/}
                                    {/*    className="btn btn-info btn-sm"*/}
                                    {/*>*/}
                                    {/*    Go ERP*/}
                                    {/*</Link>*/}
                                </div>
                            </div>
                        </div>
                    ))) : (
                        <h1 className="text-center font-lg font-bold">No Company registered yet</h1>
                    )}
            </div>

        </PageWrapper>
    );
};

Index.getLayout = (page: any) => {
    return <WorkspaceLayout>{page}</WorkspaceLayout>;
};
export default Index;
