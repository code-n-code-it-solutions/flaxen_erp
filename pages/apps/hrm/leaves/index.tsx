import React, { useEffect, useRef, useState } from 'react';
import PageHeader from '@/components/apps/PageHeader';
import { setPageTitle } from '@/store/slices/themeConfigSlice';
import { AgGridReact } from 'ag-grid-react';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '@/store';
import { setAuthToken, setContentType } from '@/configs/api.config';
import AgGridComponent from '@/components/apps/AgGridComponent';

import { ActionList, AppBasePath } from '@/utils/enums';
import useSetActiveMenu from '@/hooks/useSetActiveMenu';
import { getGRN } from '@/store/slices/goodReceiveNoteSlice';
import Button from '@/components/Button';
import EmployeeLeavesModal from '@/components/modals/EmployeeLeavesModal';

const Index = () => {
    useSetActiveMenu('');
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { token } = useAppSelector((state) => state.user);
    const { customerPayments, loading } = useAppSelector((state) => state.customerPayment); // replace this after new slice 

    const { permittedMenus, activeMenu } = useAppSelector((state) => state.menu);
   // const { allGRNs, loading, success } = useAppSelector(state => state.goodReceiveNote);
    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const gridRef = useRef<AgGridReact<any>>(null);
    const [colDefs, setColDefs] = useState<any>([
        {
            headerName: 'Employee Code',
            field: 'employee_code',
            minWidth: 150
        },
        {
            headerName: 'Employee Name',
            field: 'employee_name',
            minWidth: 150
        },
        {
            headerName: 'Email',
            field: 'email',
            minWidth: 150
        },
        {
            headerName: 'Phone',
            field: 'phone',
            minWidth: 150
        },
        {
            headerName: 'Joining Date',
            field: 'joining_date',
            minWidth: 150
        },
        {
            headerName: 'Department',
            field: 'department',
            minWidth: 150
        },
        {
            headerName: 'Designation',
            field: 'designation',
            minWidth: 150
        },
        {
            headerName: 'Status',
            field: 'status',
            minWidth: 150,
            cellRenderer: (params: any) => {
                const status = params.value;
                let color = '';
                if (status === 'Pending') color = 'yellow';
                if (status === 'Accepted') color = 'green';
                if (status === 'Rejected') color = 'red';
                return `<span style="color: ${color}; font-weight: bold;">${status}</span>`;
            }
        },
        {
            headerName: 'Action',
            field: 'action',
            minWidth: 150,
          //  cellRendererFramework: (params: any) => <Button onClick={() => handleViewDetail(params.data.id)}>Detail</Button>,
        },
    ]);
    
    const handleViewDetail = (id:any) => {
        // Implement the detail view logic here
    }

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleModalClose = () => {
        setIsModalVisible(false);
    };

    useEffect(() => {
        dispatch(setPageTitle('GRNs'));
        setAuthToken(token);
        setContentType('application/json');
        dispatch(getGRN());
    }, [dispatch, token]);

    const staticData = [
        { id: 1, employee_code: 'E001', employee_name: 'John Doe', email: 'john.doe@example.com', phone: '1234567890', joining_date: '2022-01-01', department: 'HR', designation: 'Manager', status: 'Pending' },
        { id: 2, employee_code: 'E002', employee_name: 'Jane Smith', email: 'jane.smith@example.com', phone: '0987654321', joining_date: '2021-02-01', department: 'Finance', designation: 'Analyst', status: 'Accepted' },
        { id: 3, employee_code: 'E003', employee_name: 'Bob Johnson', email: 'bob.johnson@example.com', phone: '1122334455', joining_date: '2020-03-01', department: 'IT', designation: 'Developer', status: 'Rejected' },
    ];

    return (
        <div className="flex flex-col gap-5">
            <PageHeader
                appBasePath={AppBasePath.Good_Receive_Note}
                key={selectedRows.length}
                selectedRows={selectedRows.length}
                gridRef={gridRef}
                leftComponent={{
                    addButton: {
                        show: true,
                        type: 'link',
                        text: 'New',
                        onClick: showModal,
                    },
                    title: 'Employee Leaves',
                    showSetting: true
                }}
                rightComponent={true}
                showSearch={true}
                buttonActions={{
                    delete: () => console.log('deleted'),
                    export: () => console.log('exported'),
                    print: () => router.push('' + selectedRows.map(row => row.id).join('/')),
                    archive: () => console.log('archived'),
                    unarchive: () => console.log('unarchived'),
                    duplicate: () => console.log('duplicated'),
                    printLabel: () => console.log('print label')
                }}
            />
            <div>
            <AgGridComponent
                    gridRef={gridRef}
                    data={customerPayments}// replaace with original data 
                    colDefs={colDefs}
                    rowSelection={'multiple'}
                    onSelectionChangedRows={(rows) => setSelectedRows(rows)}
                    rowMultiSelectWithClick={false}
                    onRowClicked={(params) => {
                        router.push(`/apps/invoicing/customers/payments/view/${params.data.id}`);
                    }}
                />
            </div>
            <EmployeeLeavesModal
                modalOpen={isModalVisible}
                setModalOpen={handleModalClose}
                handleSubmit={(value: any) => {
                    console.log('Employe leaves :', value);
                }}
            />
        </div>
    );
}

//Index.getLayout = (page: any) => <AppLayout>{page}</AppLayout>;
export default Index;

