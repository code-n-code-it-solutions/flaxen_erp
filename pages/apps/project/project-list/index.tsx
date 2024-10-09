import React, { useEffect, useRef, useState } from 'react';
import PageHeader from '@/components/apps/PageHeader';
import { setPageTitle } from '@/store/slices/themeConfigSlice';
import { AgGridReact } from 'ag-grid-react';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '@/store';
import { capitalize } from 'lodash';
import { setAuthToken, setContentType } from '@/configs/api.config';
import AgGridComponent from '@/components/apps/AgGridComponent';
import DisabledClickRenderer from '@/components/apps/DisabledClickRenderer';
import { ActionList, AppBasePath } from '@/utils/enums';
import { checkPermission } from '@/utils/helper';
import useSetActiveMenu from '@/hooks/useSetActiveMenu';
import { getProjects } from '@/store/slices/projects/projectSlice';

const Index = () => {
    useSetActiveMenu(AppBasePath.Project);
    const router = useRouter();
    const dispatch = useAppDispatch();
    const gridRef = useRef<AgGridReact<any>>(null);
    const { token, menus } = useAppSelector((state) => state.user);
    const { activeMenu } = useAppSelector((state) => state.menu);
    const { projects, loading, success } = useAppSelector((state) => state.project);
    const [selectedRows, setSelectedRows] = useState<any[]>([]);

    const [colDefs, setColDefs] = useState<any>([
        {
            headerName: 'Code',
            headerCheckboxSelection: true,
            checkboxSelection: true,
            field: 'project_code',
            minWidth: 150,
            cellRenderer: DisabledClickRenderer
        },
        {
            headerName: 'Name',
            field: 'name',
            minWidth: 150
        },
        {
            headerName: 'Client',
            field: 'client.name',
            minWidth: 150
        },
        {
            headerName: 'Project Type',
            field: 'project_type.name',
            minWidth: 150
        },
        {
            headerName: 'Start Date',
            field: 'start_date',
            minWidth: 150
        },
        {
            headerName: 'End Date',
            field: 'end_date',
            minWidth: 150
        },
        {
            headerName: 'Status',
            field: 'project_status',
            minWidth: 150
        }
    ]);

    useEffect(() => {
        dispatch(setPageTitle('Projects'));
        setAuthToken(token);
        setContentType('application/json');
        dispatch(getProjects());
    }, []);

    return (
        <div className="flex flex-col gap-3">
            <PageHeader
                appBasePath={AppBasePath.Project}
                key={selectedRows.length}
                selectedRows={selectedRows.length}
                gridRef={gridRef}
                leftComponent={{
                    addButton: {
                        show: true,
                        type: 'link',
                        text: 'New',
                        link: `${AppBasePath.Project}/create`
                    },
                    title: 'Projects',
                    showSetting: true
                }}
                rightComponent={true}
                showSearch={true}
                buttonActions={{
                    export: () => console.log('exported'),
                    print: () => router.push(AppBasePath.Project + '/print/' + selectedRows.map(row => row.id).join('/')),
                    archive: () => console.log('archived'),
                    unarchive: () => console.log('unarchived'),
                    duplicate: () => console.log('duplicated'),
                    printLabel: () => console.log('printLabel')
                }}
            />
            <div>
                <AgGridComponent
                    gridRef={gridRef}
                    data={projects}
                    colDefs={colDefs}
                    rowSelection={'multiple'}
                    onSelectionChangedRows={(rows) => setSelectedRows(rows)}
                    rowMultiSelectWithClick={false}
                    onRowClicked={(params) => {
                        checkPermission(menus.map((plugin: any) => plugin.menus).flat(), activeMenu.route, ActionList.VIEW_DETAIL, AppBasePath.Project) &&
                        router.push(`${AppBasePath.Project}/view/${params.data.id}`);
                    }}
                />
            </div>
        </div>
    );
};

// Index.getLayout = (page: any) => <AppLayout>{page}</AppLayout>;
export default Index;
