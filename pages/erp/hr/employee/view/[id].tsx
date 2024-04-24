import React, {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from '@/store';
import {useRouter} from 'next/router';
import {setPageTitle} from '@/store/slices/themeConfigSlice';
import {clearEmployeeState, showDetails} from '@/store/slices/employeeSlice';
import PageWrapper from '@/components/PageWrapper';
import {getIcon, serverFilePath} from '@/utils/helper';
import Image from 'next/image';
import {ButtonSize, ButtonType, ButtonVariant, IconType} from '@/utils/enums';
import FileDownloader from "@/components/FileDownloader";

const View = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const {loading, employeeDetail} = useAppSelector(state => state.employee);
    const breadCrumbItems = [
        {
            title: 'Main Dashboard',
            href: '/erp/main',
        },
        {
            title: 'HR Dashboard',
            href: '/erp/hr',
        },
        {
            title: 'All Employees',
            href: '/erp/hr/employee',
        },
        {
            title: 'Employee Details',
            href: '#',
        },
    ];

    useEffect(() => {
        dispatch(setPageTitle('Employee Details'));
        dispatch(clearEmployeeState());
        const employeeId = router.query.id;
        if (employeeId) {
            const id = Array.isArray(employeeId) ? employeeId[0] : employeeId;
            dispatch(showDetails(parseInt(id)));
        }
    }, [router.query.id, dispatch]);

    // console.log(employeeDetail)

    return (
        <PageWrapper
            loading={loading}
            breadCrumbItems={breadCrumbItems}
            embedLoader={true}
            title="Employee Details"
            buttons={[
                {
                    text: 'Edit',
                    type: ButtonType.link,
                    variant: ButtonVariant.info,
                    icon: IconType.edit,
                    link: '/erp/hr/employee/edit/' + router.query.id
                },
                {
                    text: 'Print',
                    type: ButtonType.link,
                    variant: ButtonVariant.success,
                    icon: IconType.print,
                    link: '/erp/hr/employee/print/' + router.query.id
                },
                {
                    text: 'Back',
                    type: ButtonType.link,
                    variant: ButtonVariant.primary,
                    icon: IconType.back,
                    link: '/erp/hr/employee'
                }
            ]}
        >
            {employeeDetail && (
                <div>
                    <div className="flex items-start justify-between mb-10">
                        <div className="flex flex-col gap-5">
                            <span className="flex justify-start items-center gap-2">
                                <strong>Employee Code: </strong>
                                <span>{employeeDetail.employee_code}</span>
                            </span>
                            <span className="flex justify-start items-center gap-2">
                                <strong>Registered at: </strong>
                                <span>{employeeDetail.created_at}</span>
                            </span>
                            <span className="flex justify-start items-center gap-2">
                                <strong>Print at: </strong>
                                <span>{(new Date()).toLocaleDateString()}</span>
                            </span>
                        </div>
                        <Image
                            width={24}
                            height={24}
                            priority={true}
                            src={serverFilePath(employeeDetail?.thumbnail?.path)}
                            alt="profile"
                            className="w-24 h-24"
                        />
                    </div>


                    <h3 className="mt-8 text-lg font-bold">Email Details:</h3>
                    <table>
                        <tbody>
                        <tr>
                            <td>Name</td>
                            <td>{employeeDetail?.user?.name}</td>
                            <td>Email</td>
                            <td>{employeeDetail?.user?.email}</td>
                        </tr>
                        <tr>
                            <td>Phone</td>
                            <td>{employeeDetail.phone}</td>
                            <td>Joining Date</td>
                            <td>{employeeDetail.date_of_joining}</td>
                        </tr>
                        <tr>
                            <td>Department</td>
                            <td>{employeeDetail?.department?.name}</td>
                            <td>Designation</td>
                            <td>{employeeDetail?.designation?.name}</td>
                        </tr>
                        <tr>
                            <td>Passport Number</td>
                            <td>{employeeDetail.passport_number}</td>
                            <td>Id Number</td>
                            <td>{employeeDetail.id_number}</td>
                        </tr>
                        </tbody>
                    </table>
                    <h3 className="mt-8 text-lg font-bold">Bank Details:</h3>
                    <table>
                        <thead>
                        <tr>
                            <th>Bank Name</th>
                            <th>s</th>
                            <th>Account Number</th>
                            <th>IBAN</th>
                            <th>Currency</th>
                        </tr>
                        </thead>
                        <tbody>
                        {employeeDetail?.bank_accounts?.length > 0
                            ? employeeDetail?.bank_accounts?.map((bank: any, index: number) => (
                                <tr key={index}>
                                    <td>{bank.bank.name}</td>
                                    <td>{bank.account_name}</td>
                                    <td>{bank.account_number}</td>
                                    <td>{bank.iban}</td>
                                    <td>{bank.currency?.code}</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5}>
                                        No Bank Details Found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <h3 className="mt-8 text-lg font-bold"> Document uploded:</h3>
                    <table>
                        <thead>
                        <tr>
                            <th>Document</th>
                            <th>Document Name</th>
                            <th>Description</th>
                        </tr>
                        </thead>
                        <tbody>
                        {employeeDetail?.documents?.length > 0
                            ? employeeDetail?.documents?.map((document: any, index: number) => (
                                <tr key={index}>
                                    <td>
                                        {document.document
                                            ? (<span className="flex gap-2 items-center text-primary">
                                                    <FileDownloader
                                                        file={document.document.path}
                                                        title={
                                                            <span className="flex justify-center items-center gap-3">
                                                                {getIcon(IconType.download)}
                                                                <span>Download</span>
                                                            </span>
                                                        }
                                                        buttonType={ButtonType.link}
                                                        buttonVariant={ButtonVariant.primary}
                                                        size={ButtonSize.small}
                                                    />
                                                </span>
                                            ) : <span>No Preview</span>
                                        }
                                    </td>
                                    <td>{document.name}</td>
                                    <td>{document.description}</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={2}>
                                        No Documents Found
                                    </td>
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

