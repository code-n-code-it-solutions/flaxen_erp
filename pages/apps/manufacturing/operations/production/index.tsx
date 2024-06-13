import React, { useEffect, useRef, useState } from 'react';
import AppLayout from '@/components/Layouts/AppLayout';
import PageHeader from '@/components/apps/PageHeader';
import { ActionList, AppBasePath } from '@/utils/enums';
import { setPageTitle } from '@/store/slices/themeConfigSlice';
import { AgGridReact } from 'ag-grid-react';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '@/store';
import { setAuthToken, setContentType } from '@/configs/api.config';
import { ModuleRegistry } from '@ag-grid-community/core';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import AgGridComponent from '@/components/apps/AgGridComponent';
import DisabledClickRenderer from '@/components/apps/DisabledClickRenderer';
import { getProductions } from '@/store/slices/productionSlice';
import { checkPermission } from '@/utils/helper';
import useSetActiveMenu from '@/hooks/useSetActiveMenu';

ModuleRegistry.registerModules([ClientSideRowModelModule]);

const Index = () => {
    useSetActiveMenu(AppBasePath.Production);
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { token } = useAppSelector((state) => state.user);
    const { allProductions, loading, success } = useAppSelector(state => state.production);
    const { permittedMenus, activeMenu } = useAppSelector((state) => state.menu);
    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const gridRef = useRef<AgGridReact<any>>(null);
    const [colDefs, setColDefs] = useState<any>([
        {
            headerName: 'Batch Number',
            headerCheckboxSelection: true,
            checkboxSelection: true,
            field: 'batch_number',
            minWidth: 150,
            cellRenderer: DisabledClickRenderer
        },
        {
            headerName: 'Category',
            field: 'category',
            valueGetter: (row: any) => row.data.product_assembly.category.name,
            minWidth: 150
        },
        {
            headerName: 'Formula',
            field: 'formula_name',
            valueGetter: (row: any) => row.data.product_assembly.formula_name + ' (' + row.data.product_assembly.formula_code + ')',
            minWidth: 150
        },
        {
            headerName: 'Color Code',
            field: 'color_code',
            cellRenderer: (row: any) => {
                // console.log(row.data);
                return (
                    <div className="flex justify-start items-center gap-2">
                        <div className="w-6 h-6 rounded-full"
                             style={{ backgroundColor: `${row.data.product_assembly.color_code.hex_code}` }}></div>
                        {row.data.product_assembly.color_code.name} ({row.data.product_assembly.color_code.code})
                    </div>
                );
            },
            minWidth: 150
        },
        {
            headerName: 'Quantity (KG)',
            field: 'no_of_quantity',
            minWidth: 150
        }
    ]);


    useEffect(() => {
        dispatch(setPageTitle('Production'));
        setAuthToken(token);
        setContentType('application/json');
        dispatch(getProductions());
    }, []);

    // useEffect(() => {
    //     console.log(selectedRows);
    // }, [selectedRows]);

    return (
        <div className="flex flex-col gap-5">
            <PageHeader
                appBasePath={AppBasePath.Production}
                key={selectedRows.length}
                selectedRows={selectedRows.length}
                gridRef={gridRef}
                leftComponent={{
                    addButton: {
                        show: true,
                        type: 'link',
                        text: 'New',
                        link: '/apps/manufacturing/operations/production/create'
                    },
                    title: 'Productions',
                    showSetting: true
                }}
                rightComponent={true}
                showSearch={true}
                buttonActions={{
                    delete: () => console.log('deleted'),
                    export: () => console.log('exported'),
                    print: () => router.push('/apps/manufacturing/operations/production/print/' + selectedRows.map(row => row.id).join('/')),
                    archive: () => console.log('archived'),
                    unarchive: () => console.log('unarchived'),
                    duplicate: () => console.log('duplicated'),
                    printLabel: () => console.log('print label')
                }}
            />
            <div>
                <AgGridComponent
                    gridRef={gridRef}
                    data={allProductions}
                    colDefs={colDefs}
                    rowSelection={'multiple'}
                    onSelectionChangedRows={(rows) => setSelectedRows(rows)}
                    rowMultiSelectWithClick={false}
                    onRowClicked={(params) => {
                        // const displayedColumns = params.api.getAllDisplayedColumns();
                        // console.log(displayedColumns, params.column, displayedColumns[0], displayedColumns[0] === params.column);
                        // return displayedColumns[0] === params.column;
                        checkPermission(permittedMenus, activeMenu.route, ActionList.VIEW_DETAIL, AppBasePath.Production) &&
                        router.push(`/apps/manufacturing/operations/production/view/${params.data.id}`);
                    }}
                />
            </div>
        </div>
    );
};

Index.getLayout = (page: any) => <AppLayout>{page}</AppLayout>;
export default Index;
