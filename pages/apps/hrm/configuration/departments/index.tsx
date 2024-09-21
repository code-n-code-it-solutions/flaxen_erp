import React, { useEffect, useRef, useState } from 'react';
import AppLayout from '@/components/Layouts/AppLayout';
import PageHeader from '@/components/apps/PageHeader';
import { setPageTitle } from '@/store/slices/themeConfigSlice';
import { AgGridReact, CustomLoadingCellRendererProps } from 'ag-grid-react';
import { useRouter } from 'next/router';
import { IRootState, useAppDispatch, useAppSelector } from '@/store';
import { capitalize } from 'lodash';
import { setAuthToken, setContentType } from '@/configs/api.config';
import { ModuleRegistry } from '@ag-grid-community/core';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import AgGridComponent from '@/components/apps/AgGridComponent';
import DisabledClickRenderer from '@/components/apps/DisabledClickRenderer';
import Swal from 'sweetalert2';
import { clearEmployeeState, getEmployees, deleteEmployee } from '@/store/slices/employeeSlice';
import { serverFilePath } from '@/utils/helper';
import Image from 'next/image';
import { AppBasePath } from '@/utils/enums';
import Button from '@/components/Button';
import { ButtonType, ButtonVariant, ButtonSize } from '@/utils/enums';
import DepartmentFormModal from '@/components/modals/DepartmentFormModal';
import DesignationFormModal from '@/components/modals/DesignationFormModal';

ModuleRegistry.registerModules([ClientSideRowModelModule]);

const Index = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { token } = useAppSelector((state) => state.user);
    const [departmentModalOpen, setDepartmentModalOpen] = useState(false);
    const [departmentOptions, setDepartmentOptions] = useState<any[]>([]);
    const [designationModalOpen, setDesignationModalOpen] = useState(false);

    const { employees, loading, success } = useAppSelector((state: IRootState) => state.employee);
    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const gridRef = useRef<AgGridReact<any>>(null);
    const [colDefs, setColDefs] = useState<any>([
        {
            headerName: 'Department Name',
            field: 'employee.department.name',
            headerCheckboxSelection: true,
            checkboxSelection: true,
            // valueGetter: (row: any) => row.data.employee?.employee_code,
            minWidth: 150,
            // cellRenderer: DisabledClickRenderer,
        },
        // {
        //     // headerName: 'Department Name',
        //     // field: 'employee.department.name',
        //     // headerCheckboxSelection: true,
        //     // checkboxSelection: true,
        //     // // cellRenderer: (params: any) => (
        //     // //     <div className="flex items-center gap-1">
        //     // //         <Image src={serverFilePath(params.data.employee?.thumbnail?.path)} alt={params.data.name} priority={true} width={40} height={40} className="h-10 w-10 rounded-md p-1" />
        //     // //         <span>{params.data.name}</span>
        //     // //     </div>
        //     // // ),
        //     // minWidth: 150,
        // },
        {
            headerName: 'Parent Department (Optional)',
            field: '',
            minWidth: 150,
        },
        {
            headerName: 'Description',
            field: '',
            minWidth: 150,
        },
        // {
        //     headerName: 'Designation',
        //     field: 'employee.designation.name',
        //     minWidth: 150,
        // },
        {
            headerName: 'Status',
            field: 'is_active',
            cellRenderer: (row: any) => <span className={`badge bg-${row.data.is_active ? 'success' : 'danger'}`}>{capitalize(row.data.is_active ? 'active' : 'inactive')}</span>,
            minWidth: 150,
        },
        {
            headerName: 'Actions',
            field: 'actions',
            minWidth: 150,
            cellRenderer: () => (
                <div className="click mt-1">
                    <Button text="Add Designation" variant={ButtonVariant.primary} onClick={() => setDesignationModalOpen(true)} type={ButtonType.button} size={ButtonSize.small} />
                </div>
            ),
        },
    ]);

    const handleDelete = () => {
        const selectedNodes: any = gridRef?.current?.api.getSelectedNodes();
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel!',
            cancelButtonColor: 'red',
            confirmButtonColor: 'green',
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(deleteEmployee(selectedNodes.map((row: any) => row.id)));
                dispatch(getEmployees());
            }
        });
    };

    useEffect(() => {
        dispatch(setPageTitle('Departments'));
        setAuthToken(token);
        setContentType('application/json');
        dispatch(clearEmployeeState());
        dispatch(getEmployees());
    }, []);

    return (
        <div className="flex flex-col gap-5">
            <PageHeader
                appBasePath={AppBasePath.Employee}
                key={selectedRows.length}
                selectedRows={selectedRows.length}
                gridRef={gridRef}
                leftComponent={{
                    addButton: {
                        show: true,
                        type: 'button',
                        text: 'New',
                        onClick: () => setDepartmentModalOpen(true),
                    },
                    title: 'Departments',
                    showSetting: true,
                }}
                rightComponent={true}
                showSearch={true}
                buttonActions={{
                    delete: () => handleDelete(),
                    export: () => console.log('exported'),
                    print: () => router.push('/apps/hrm/configuration/departments/print/' + selectedRows.map((row) => row.id).join('/')),
                    archive: () => console.log('archived'),
                    unarchive: () => console.log('unarchived'),
                    duplicate: () => console.log('duplicated'),
                    printLabel: () => router.push('/apps/employees/employee-list/print-label/' + selectedRows.map((row) => row.id).join('/')),
                }}
            />
            <div>
                <AgGridComponent
                    gridRef={gridRef}
                    data={employees}
                    colDefs={colDefs}
                    rowSelection={'multiple'}
                    onSelectionChangedRows={(rows) => setSelectedRows(rows)}
                    rowMultiSelectWithClick={false}
                    onRowClicked={(params) => {
                        // const displayedColumns = params.api.getAllDisplayedColumns();
                        // console.log(displayedColumns, params.column, displayedColumns[0], displayedColumns[0] === params.column);
                        // return displayedColumns[0] === params.column;
                        const isActionButton = params.event.target.closest('.click') !== null;
                        if (!isActionButton) {
                            router.push(`/apps/hrm/configuration/departments/view/${params.data.id}`);
                        }
                    }}
                />
            </div>
            <DepartmentFormModal modalOpen={departmentModalOpen} departments={departmentOptions} setModalOpen={setDepartmentModalOpen} />
            <DesignationFormModal modalOpen={designationModalOpen} departments={departmentOptions} setModalOpen={setDesignationModalOpen} />
        </div>
    );
};

// Index.getLayout = (page: any) => <AppLayout>{page}</AppLayout>;
export default Index;
