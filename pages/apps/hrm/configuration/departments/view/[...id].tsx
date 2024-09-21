import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { useRouter } from 'next/router';
import { setPageTitle } from '@/store/slices/themeConfigSlice';
import { clearEmployeeState, showDetails } from '@/store/slices/employeeSlice';
import PageWrapper from '@/components/PageWrapper';
import { AppBasePath } from '@/utils/enums';
import DetailPageHeader from '@/components/apps/DetailPageHeader';

const View = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { loading, employeeDetail } = useAppSelector((state) => state.employee);

    useEffect(() => {
        dispatch(setPageTitle('Departments Details'));
        dispatch(clearEmployeeState());
        const employeeId = router.query.id;
        if (employeeId) {
            const id = Array.isArray(employeeId) ? employeeId[0] : employeeId;
            dispatch(showDetails(parseInt(id)));
        }
    }, [router.query.id, dispatch]);

    return (
        <div className="flex flex-col gap-3">
            <DetailPageHeader
                appBasePath={AppBasePath.Employee}
                title="Departments Details"
                middleComponent={{
                    show: false,
                }}
                backButton={{
                    show: true,
                    backLink: '/apps/hrm/configuration/departments',
                }}
            />

            <PageWrapper loading={loading} embedLoader={true}>
                <div>
                    <div className="mb-10 flex items-start justify-between">
                        <div className="flex flex-col gap-5">
                            <span className="flex items-center justify-start gap-2">
                                <strong>Department Name: </strong>
                                <span>asjasjkk</span>
                            </span>
                            <span className="flex items-center justify-start gap-2">
                                <strong>Department Description: </strong>
                                <span>asdjsdkjhk</span>
                            </span>
                            <span className="flex items-center justify-start gap-2">
                                <strong>Created at: </strong>
                                {/* <span>{new Date(departmentDetail.created_at).toLocaleDateString()}</span> */}
                                <span>7/16/2024</span>
                            </span>
                        </div>
                        {/* <Image width={24} height={24} priority={true} src={serverFilePath(departmentDetail?.department?.thumbnail?.path)} alt="profile" className="h-24 w-24" /> */}
                    </div>
                    <h3 className="mb-4 mt-8 text-lg font-bold">Designation Details:</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Created at</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* {departmentDetail?.map((designation: any, index: number) => ( */}
                            <tr>
                                <td>1</td>
                                <td>Manager</td>
                                <td>shkhak</td>
                                <td>7/16/2024</td>
                            </tr>
                            {/* ))} */}
                        </tbody>
                    </table>
                </div>
            </PageWrapper>
        </div>
    );
};

// View.getLayout = (page: any) => <AppLayout>{page}</AppLayout>;
export default View;
