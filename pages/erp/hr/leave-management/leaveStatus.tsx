import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useDispatch, useSelector } from 'react-redux';
import { setPageTitle } from '@/store/slices/themeConfigSlice';
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import { ThunkDispatch } from "redux-thunk";
import { IRootState } from "@/store";
import { AnyAction } from "redux";
import { setAuthToken, setContentType } from "@/configs/api.config";
import GenericTable from "@/components/GenericTable";
import IconButton from "@/components/IconButton";
import { ButtonVariant, IconType } from "@/utils/enums";
import { generatePDF } from "@/utils/helper";
import Preview from "@/pages/erp/hr/employee/preview";
import LeaveFormModal from "@/components/modals/LeaveFormModal";

const Index = () => {
    const dispatch = useDispatch<ThunkDispatch<IRootState, any, AnyAction>>();
    const { token } = useSelector((state: IRootState) => state.user);
    const { employees, loading, success } = useSelector((state: IRootState) => state.employee);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [selectedRowData, setSelectedRowData] = useState<any>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [leaveStatus, setLeaveStatus] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        dispatch(setPageTitle('All Employees'));
    }, []);

    const handleStatusClick = (rowData: any) => {
        setSelectedRowData(rowData);
        setModalOpen(true);
    }

    const handleUpdateStatus = () => {
        // Add your logic here to update the status
        console.log("Updating status for row:", selectedRowData);
        // Close the modal
        setModalOpen(false);
        // Reset form inputs
        setLeaveStatus('');
        setDescription('');
    }

    const colName = ['id', 'leave_code', 'user.name', 'leave_from', 'leave_to', 'is_active'];
    const header = ['Id', 'Leave code', 'Name', 'leave from', 'leave to', 'Status'];

    useEffect(() => {
        if (!deleteLoading) return;
        if (success) {
          
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
                    </div>
                    <GenericTable
                        colName={colName}
                        header={header}
                        rowData={employees}
                        loading={loading}
                        exportTitle={'all-employees-' + Date.now()}
                        columns={[
                            // Your existing columns
                            {
                                accessor: 'leave.Status',
                                title: 'leave_Status',
                                sortable: true,
                                render: (row: any) => (
                                    <div className="cursor-pointer" onClick={() => handleStatusClick(row)}>
                                        {row['leave.Status']}
                                    </div>
                                )
                            }
                        ]}
                    />
                </div>
            </div>

            {/* Modal for updating leave status */}
            <LeaveFormModal
                modalOpen={modalOpen}
                setModalOpen={setModalOpen}
                handleSubmit={handleUpdateStatus}
                modalFormData={selectedRowData}
            />
        </div>
    );
};

export default Index;
