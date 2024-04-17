import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { IRootState } from '@/store';
import { AnyAction } from 'redux';
import { useRouter } from 'next/router';
import { setPageTitle } from '@/store/slices/themeConfigSlice';
import { clearEmployeeState, showDetails } from '@/store/slices/employeeSlice';
import PageWrapper from '@/components/PageWrapper';
import { generatePDF, getIcon, imagePath } from '@/utils/helper';
import Image from 'next/image';

import image_path from '@C:\Users\User\Documents\flaxen_erp\public\assets\images\default.png'
import Button from '@/components/Button';
import { ButtonSize, ButtonType, ButtonVariant, IconType } from '@/utils/enums';
import Preview from '@/pages/erp/inventory/product-assembly/preview';

const View = () => {
    const dispatch = useDispatch<ThunkDispatch<IRootState, any, AnyAction>>();
    const router = useRouter();
    const { loading, employeeDetail } = useSelector((state: IRootState) => state.employee);
    console.log(employeeDetail);

    const [printLoading, setPrintLoading] = useState<boolean>(false);
    const breadCrumbItems = [
        {
            title: 'Main Dashboard',
            href: '/main',
        },
        {
            title: 'HR Dashboard',
            href: '/hr',
        },
        {
            title: 'Employee Details',
            href: '#',
        },
    ];

    useEffect(() => {
        dispatch(setPageTitle('Employee Details'));
        dispatch(clearEmployeeState());

        const productAssemblyId = router.query.id;
        const employeeId = router.query.id;
        // console.log('Product Assembly ID:', productAssemblyId);

        if (employeeId) {
            // If the productId is an array (with catch-all routes), take the first element.
            const id = Array.isArray(employeeId) ? employeeId[0] : employeeId;
            dispatch(showDetails(parseInt(id)));
        }
    }, [router.query.id, dispatch]);

    return (
        <PageWrapper loading={loading} breadCrumbItems={breadCrumbItems} embedLoader={true}>
            <div>
                <div className="mb-5 flex items-center justify-between">
                    <h5 className="text-lg font-semibold dark:text-white-light">Details of Employee</h5>
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
                            onClick={() => generatePDF(<Preview content={employeeDetail} />, setPrintLoading)}
                        />
                        <Button
                            text={
                                <span className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ltr:mr-2 rtl:ml-2" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path d="M15 5L9 12L15 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    Back
                                </span>
                            }
                            type={ButtonType.link}
                            variant={ButtonVariant.primary}
                            link="/hr/employee"
                            size={ButtonSize.small}
                        />
                    </div>
                </div>

                {employeeDetail && (
                <div className="h-950 px-10">


                    <hr></hr>
                    <div className="mt-10 mb-5 flex flex-col items-center justify-center">

                        <h1 className="font-bold text-2xl">Employee Details</h1>
                    </div>

                    <div className="flex items-start justify-between p-10 mb-10">
                        <div className="flex flex-col gap-5">
                            <span className="mb-15 text-base">
                                <strong>Employee Code: </strong>
                                <span>{employeeDetail.employee_code}sds</span>
                            </span>
                            <span className="text-base mb-15">
                                <strong>Registered at: </strong>
                                <span>{employeeDetail.created_at}</span>
                            </span>
                            <span className="text-base mb-15">
                                <strong>Print at: </strong>
                                <span>{(new Date()).toLocaleDateString()}</span>
                            </span>
                        </div>
                        <div className="flex flex-col gap-5">
                            <span className="text-base mb-15">

                            <Image width={24} height={24} src={imagePath(employeeDetail?.thumbnail)}
                                    alt="product image"
                                    className="w-24 h-24 object-cover"/>

                            </span>
                        </div>
                    </div>


                    <h3 className="mb-8 text-xl font-bold">Formula Product Details:</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>{employeeDetail?.user?.name}</th>
                                <th>Email</th>
                                <th>{employeeDetail?.user?.email}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Phone</td>
                                <td>{employeeDetail.phone}</td>
                                <td>Joining Date</td>
                                <td>{employeeDetail.date_of_joining}</td>
                            </tr>
                            <tr>
                                <td>Department </td>
                                <td>{employeeDetail?.department?.name}</td>
                                <td>Designation</td>
                                <td>{employeeDetail?.designation?.name}</td>
                            </tr>
                            <tr>
                                <td>Passport Number</td>
                                <td>{employeeDetail.passport_number}</td>
                                <td>Id Number </td>
                                <td>{employeeDetail.id_number}</td>
                            </tr>


                        </tbody>
                    </table>
                    <h3 className="mb-8 text-xl font-bold">Bank Details:</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Bank Name </th>
                                <th>s</th>
                                <th>Account Number</th>
                                <th>IBAN</th>
                                <th>Currency</th></tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{}</td>
                                <td>{}</td>
                                <td>{}</td>
                                <td>{}</td>
                            </tr>
                        </tbody>
                    </table>
                    <h3 className="mb-8 text-xl font-bold"> Document uploded:</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Document Name  </th>
                                <th>Description </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{}</td>
                                <td>{}</td>

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

