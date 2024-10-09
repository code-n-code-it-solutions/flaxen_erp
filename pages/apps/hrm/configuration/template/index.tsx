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
import { clearTemplateState, getTemplates, deleteTemplate } from '@/store/slices/templateSlice';
import { serverFilePath } from '@/utils/helper';
import Image from 'next/image';
import { AppBasePath } from '@/utils/enums';

ModuleRegistry.registerModules([ClientSideRowModelModule]);

const Index = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { token } = useAppSelector((state) => state.user);
    const { templates } = useAppSelector((state) => state.template || { templates: [] });

    const { employees, loading, success } = useAppSelector((state: IRootState) => state.employee);
    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const gridRef = useRef<AgGridReact<any>>(null);
    const [colDefs, setColDefs] = useState<any>([
        {
            headerName: 'Template Code',
            headerCheckboxSelection: true,
            checkboxSelection: true,
            field: 'template_code',
            valueGetter: (row: any) => row.data.contract?.contract_code,
            minWidth: 150,
            cellRenderer: DisabledClickRenderer
        },
       
        {
            hheaderName: 'Template',
            field: 'template.name',
            minWidth: 150,
        },
        {
            headerName: 'Contract Subject',
            field: 'contract_date',
            minWidth: 150,
        },
      
        {
            headerName: 'type',
            field: 'type.name',
            minWidth: 150,
        },
        {
            headerName: 'Visibility',
            field: 'visibility',
            minWidth: 150,
        },
        {
            headerName: 'Distription',
            field: 'description',
            minWidth: 150,
        },
        {
            headerName: 'Status',
            field: 'is_active',
            cellRenderer: (row: any) => (
                <span className={`badge bg-${row.data.is_active ? 'success' : 'danger'}`}>
                    {capitalize(row.data.is_active ? 'active' : 'inactive')}
                </span>
            ),
            minWidth: 150
        },
    ]);

    const handleDelete = () => {
        const selectedNodes: any = gridRef?.current?.api.getSelectedNodes();
        Swal.fire({
            title: 'Are you sure?',
            text: 'You won\'t be able to revert this!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel!',
            cancelButtonColor: 'red',
            confirmButtonColor: 'green'
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(deleteTemplate(selectedNodes.map((row: any) => row.id)));
                dispatch(getTemplates());
            }
        });
    };

    useEffect(() => {
        dispatch(setPageTitle(''));
        setAuthToken(token);
        setContentType('application/json');
        dispatch(clearTemplateState());
        setRowData([]);
    }, [dispatch, token]);

    useEffect(() => {
        if (templates) {
            setRowData(templates);
        } else {
            setRowData([]);
        }
    }, [templates]);

    // Navigate to the create template page
    const navigateToCreateTemplate = () => {
        router.push('/apps/hrm/configuration/template/create'); // Adjust the path as needed
    };

    return (
        <div className="flex flex-col gap-5">
            <PageHeader
                appBasePath={AppBasePath.Template}
                key={selectedRows.length}
                selectedRows={selectedRows.length}
                gridRef={gridRef}
                leftComponent={{
                    addButton: {
                        show: true,
                        type: 'link',
                        text: 'New',
                        link: '/apps/hrm/configuration/template/create'
                    },
                    title: ' General Template',
                    showSetting: true
                }}
                rightComponent={true}
                showSearch={true}
                buttonActions={{
                    delete: () => handleDelete(),
                    export: () => console.log('exported'),
                    print: () => router.push('' + selectedRows.map(row => row.id).join('/')),
                    archive: () => console.log('archived'),
                    unarchive: () => console.log('unarchived'),
                    duplicate: () => console.log('duplicated'),
                   // printLabel: () => router.push('/apps/employees/employee-list/print-label/' + selectedRows.map(row => row.id).join('/'))
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
                      //  router.push(`/apps/hrm/employees/view/${params.data.id}`);
                    }}
                />
            </div>
        </div>
    );
};

// Index.getLayout = (page: any) => <AppLayout>{page}</AppLayout>;
export default Index;
