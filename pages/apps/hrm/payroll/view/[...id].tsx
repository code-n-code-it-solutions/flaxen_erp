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
        dispatch(setPageTitle('Payroll Details'));
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
                title="Payroll Details"
                middleComponent={{
                    show: false,
                }}
                backButton={{
                    show: true,
                    backLink: '/apps/hrm/payroll',
                }}
            />

            <PageWrapper loading={loading} embedLoader={true}>
            {employeeDetail && (
                <div>
                    <div className="item-center mb-5 flex justify-center">
                        <h1 className="text-2xl font-semibold underline">PAYSLIP OF THE MONTH OF JULY 2024</h1>
                    </div>
                    <div className="flex justify-end">
                        <div className="my-8 flex-row gap-2">
                            <h1 className="text-xl font-semibold">PAYSLIP #49029</h1>
                            <p>Salary Month: July, 2024</p>
                        </div>
                    </div>
                    <div className="mb-5 w-40">
                        Flaxen paints <br /> United Arab Emirates
                    </div>
                    <div className="mb-10 flex items-start">
                        <div>
                            <span className="flex items-center justify-start">
                                <strong>Jhon Doe</strong>
                            </span>
                            <span className="flex items-center justify-start gap-2">
                                <span>Web Designer</span>
                            </span>
                            <span className="flex items-center justify-start gap-2">
                                <span>Employee Code: </span>
                                <span>{employeeDetail.employee?.employee_code}</span>
                            </span>
                            <span className="flex items-center justify-start gap-2">
                                <span>Joining Date: </span>
                                <span>{employeeDetail.employee?.date_of_joining}</span>
                            </span>
                        </div>
                    </div>
                    <div className="flex">
                        <h3 className="mb-4 mt-8 text-lg font-bold">Earnings:</h3>
                        <h3 className="ml-[43%] mt-8 text-lg font-bold">Deduction:</h3>
                    </div>
                    <div className="flex">
                        <table className="w-[50%]">
                            <tbody>
                                <tr>
                                    <td>Basic Salary</td>
                                    <td>$500</td>
                                </tr>
                                <tr>
                                    <td>House Rent Allowance (H.R.A.)</td>
                                    <td>$500</td>
                                </tr>
                                <tr>
                                    <td>Conveyance</td>
                                    <td>$500</td>
                                </tr>
                                <tr>
                                    <td>Other Allowance</td>
                                    <td>$500</td>
                                </tr>
                                <tr>
                                    <td>Total Earnings</td>
                                    <td>$500</td>
                                </tr>
                            </tbody>
                        </table>
                        <table className="w-[50%]">
                            <tbody>
                                <tr>
                                    <td>Tax Deducted at Source (T.D.S.)</td>
                                    <td>$500</td>
                                </tr>
                                <tr>
                                    <td>Provident Fund</td>
                                    <td>$500</td>
                                </tr>
                                <tr>
                                    <td>ESI</td>
                                    <td>$500</td>
                                </tr>
                                <tr>
                                    <td>Loan</td>
                                    <td>$500</td>
                                </tr>
                                <tr>
                                    <td>Total Deduction</td>
                                    <td>$500</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="my-8 flex gap-2">
                        <strong>Net Salary: $500</strong>
                        <p>(Five hundred only.)</p>
                    </div>
                </div>
            )}
            </PageWrapper>
        </div>
    );
};

// View.getLayout = (page: any) => <AppLayout>{page}</AppLayout>;
export default View;
