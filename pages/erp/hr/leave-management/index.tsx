import React, {useEffect, useState} from 'react';
import Swal from 'sweetalert2';
import {useDispatch, useSelector} from 'react-redux';
import {setPageTitle} from '@/store/slices/themeConfigSlice';
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import {ThunkDispatch} from "redux-thunk";
import {IRootState} from "@/store";
import {AnyAction} from "redux";
import {setAuthToken, setContentType} from "@/configs/api.config";
import GenericTable from "@/components/GenericTable";
import Image from "next/image";
import {BASE_URL} from "@/configs/server.config";
import {clearLeaveState,  getLeave} from "@/store/slices/leaveSlice";
import LeaveFormModal from "@/components/modals/LeaveFormModal";
import IconButton from "@/components/IconButton";
import {ButtonVariant, IconType} from "@/utils/enums";
import {generatePDF} from "@/utils/helper";
import Preview from "@/pages/erp/hr/employee/preview";

const Index = () => {
    const dispatch = useDispatch<ThunkDispatch<IRootState, any, AnyAction>>();
    const {token} = useSelector((state: IRootState) => state.user);
    const {employees, loading, success} = useSelector((state: IRootState) => state.employee);
    const [deleteLoading, setDeleteLoading] = useState(false);

    useEffect(() => {
        dispatch(setPageTitle('All Employees'));
    });
    const [rowData, setRowData] = useState([]);
    const [printLoading, setPrintLoading] = useState(false)

    const getRawItems = () => {
        setAuthToken(token)
        setContentType('application/json')
        dispatch(getLeave())
    }

    useEffect(() => {
        getRawItems();
        dispatch(clearLeaveState());
    }, []);

 

    const colName = ['id', 'leave_code', 'user.name', 'leave_from', 'leave_to', 'is_active'];
    const header = ['Id', 'Leave code', 'Name', 'leave from', 'leave to', 'Status'];


   
       

    useEffect(() => {
        if(!deleteLoading) return;
        if (success) {
            getRawItems();
            setDeleteLoading(false);
            Swal.fire({ title: 'Deleted!', text: 'Your file has been deleted.', icon: 'success', customClass: 'sweet-alerts' });
        } else {
            Swal.fire({ title: 'Failed!', text: 'Something went wrong.', icon: 'error', customClass: 'sweet-alerts' });
        }
    }, [success]);

    return (
        <div>
            <Breadcrumb items={[
                {
                    title: 'Main Dashboard',
                    href: '/main',
                },
                {
                    title: 'HR Dashboard',
                    href: '/hr',
                },
                {
                    title: 'All Leave',
                    href: '#',
                },
            ]}/>

            <div className="pt-5">
                <div className="panel">
                    <div className="mb-5 flex items-center justify-between">
                        <h5 className="text-lg font-semibold dark:text-white-light">All Employees Leave</h5>
                        <Link href="components/modals/leaveFormModal"
                              className="btn btn-primary btn-sm m-1">
                            <span className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                     className="h-5 w-5 ltr:mr-2 rtl:ml-2"
                                     fill="none">
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
                                    <path d="M15 12L12 12M12 12L9 12M12 12L12 9M12 12L12 15" stroke="currentColor"
                                          strokeWidth="1.5" strokeLinecap="round"/>
                                </svg>
                                Add New
                            </span>
                        </Link>
                    </div>
                    <GenericTable
                        colName={colName}
                        header={header}
                        rowData={rowData}
                        loading={loading}
                        exportTitle={'all-employees-' + Date.now()}
                        columns={[
                           
                            {accessor: 'leave_code', title: 'Leave Code', sortable: true},
                            {accessor: 'user.name', title: 'name', sortable: true},
                            {accessor: 'leave.date', title: 'leave_from', sortable: true},
                            {accessor: 'leave.date', title: 'leave_to', sortable: true},
                            {accessor: 'reason', title: 'reason', sortable: true},
                            {accessor: 'leave.type', title: 'leave_type', sortable: true},
                            {accessor: 'leave.Status', title: 'leave_Status', sortable: true},
                            
                            
                            {
                                accessor: 'actions',
                                title: 'Actions',
                                render: (row: any) => (
                                    <div className="flex items-center gap-3">
                                        <IconButton
                                            icon={IconType.print}
                                            color={ButtonVariant.secondary}
                                            tooltip='Print'
                                            onClick={() => generatePDF(<Preview content={row} />, setPrintLoading)}
                                        />

                                        <IconButton
                                            icon={IconType.view}
                                            color={ButtonVariant.info}
                                            tooltip='View'
                                            link={`/hr/leave-management/view/${row.id}`}
                                        />

                                        <IconButton
                                            icon={IconType.edit}
                                            color={ButtonVariant.primary}
                                            tooltip='Edit'
                                            link={`/hr/leave-management/edit/${row.id}`}
                                        />

                                        <IconButton
                                            icon={IconType.delete}
                                            color={ButtonVariant.danger}
                                            tooltip='Delete'
                                            
                                        />
                                    </div>
                                )
                            }
                        ]}
                    />
                </div>
            </div>

        </div>
    );
};

export default Index;
