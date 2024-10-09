import React, { useEffect } from 'react';
import PageWrapper from '@/components/PageWrapper';
import { serverFilePath } from '@/utils/helper';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '@/store';
import { setAuthToken } from '@/configs/api.config';
import { setPageTitle } from '@/store/slices/themeConfigSlice';
import { AppBasePath } from '@/utils/enums';
import useSetActiveMenu from '@/hooks/useSetActiveMenu';
import DetailPageHeader from '@/components/apps/DetailPageHeader';
import { clearProjectState, showProjectDetails } from '@/store/slices/projects/projectSlice';

const View = () => {
    useSetActiveMenu(AppBasePath.Client);
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { projectDetail, loading } = useAppSelector((state) => state.project);
    const { token } = useAppSelector((state) => state.user);
    const [ids, setIds] = React.useState<string[]>([]);

    useEffect(() => {
        dispatch(setPageTitle('View Project'));
        dispatch(clearProjectState());
        setAuthToken(token);
        const query = router.query.id;
        if (query) {
            setIds(Array.isArray(query) ? query : [query]);
            const id = Array.isArray(query) ? query[0] : query;
            dispatch(showProjectDetails(parseInt(id)));
        }
    }, [router.query, dispatch]);

    return (
        <div className="flex flex-col gap-3">
            <DetailPageHeader
                appBasePath={AppBasePath.Project}
                title="Project Details"
                middleComponent={{
                    show: true,
                    edit: {
                        show: true
                    },
                    print: {
                        show: true,
                        onClick: () => router.push(AppBasePath.Project + '/print/' + ids.join('/'))
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
                    backLink: AppBasePath.Project
                }}
            />
            <PageWrapper
                loading={loading}
                breadCrumbItems={[]}
                embedLoader={true}
            >
                {projectDetail && (
                    <div>
                        <div className="flex justify-between items-start">
                            <span>
                                <strong>
                                    Created At:
                                </strong> {(new Date(projectDetail.created_at)).toDateString()}
                            </span>
                            <span>
                                <strong>Project Name:</strong> {projectDetail.customer_code}
                            </span>
                        </div>
                        <table className="my-3">
                            <tbody>
                            <tr>
                                <td>Start Date:</td>
                                <td>{projectDetail.start_date}</td>
                                <td>End Date:</td>
                                <td>{projectDetail.end_date}</td>
                            </tr>
                            <tr>
                                <td>Project Type:</td>
                                <td>{projectDetail.project_type.name}</td>
                                <td>Estimated Cost:</td>
                                <td>{projectDetail.estimated_cost}</td>
                            </tr>
                            <tr>
                                <td>Project Status:</td>
                                <td>{projectDetail.project_status}</td>
                                <td>Project Budget:</td>
                                <td>{projectDetail.budget}</td>
                            </tr>
                            </tbody>
                        </table>
                        <h4 className="font-bold mt-5">Project Sites:</h4>
                        <table>
                            <thead>
                            <tr>
                                <th>Site Name</th>
                                <th>Country</th>
                                <th>State</th>
                                <th>City</th>
                                <th>Address</th>
                                <th>Postal Code</th>
                                <th>Status</th>
                            </tr>
                            </thead>
                            <tbody>
                            {projectDetail?.sites?.length > 0
                                ? projectDetail?.sites?.map((rep: any, index: number) => (
                                    <tr key={index}>
                                        <td>{rep.site_name}</td>
                                        <td>{rep.country?.name}</td>
                                        <td>{rep.state?.name}</td>
                                        <td>{rep.city?.name}</td>
                                        <td>{rep.address}</td>
                                        <td>{rep.zip_code}</td>
                                        <td>{rep.status}</td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={7}>No Representatives Found</td>
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

export default View;
