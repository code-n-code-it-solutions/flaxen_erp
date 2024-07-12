import React, { useCallback, useEffect, useRef, useState } from 'react';
import AppLayout from '@/components/Layouts/AppLayout';
import PageHeader from '@/components/apps/PageHeader';
import { setPageTitle } from '@/store/slices/themeConfigSlice';
import { AgGridReact } from 'ag-grid-react';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '@/store';
import { capitalize } from 'lodash';
import { setAuthToken, setContentType } from '@/configs/api.config';
import { deleteRawProduct, getRawProducts } from '@/store/slices/rawProductSlice';
import { ModuleRegistry } from '@ag-grid-community/core';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import AgGridComponent from '@/components/apps/AgGridComponent';
import DisabledClickRenderer from '@/components/apps/DisabledClickRenderer';
import Swal from 'sweetalert2';
import { checkPermission } from '@/utils/helper';
import { ActionList, AppBasePath } from '@/utils/enums';
import useSetActiveMenu from '@/hooks/useSetActiveMenu';

ModuleRegistry.registerModules([ClientSideRowModelModule]);

const Index = () => {
    useSetActiveMenu(AppBasePath.Raw_Product);
    const router = useRouter();

    const dispatch = useAppDispatch();
    const { token } = useAppSelector((state) => state.user);

    const { allRawProducts, loading } = useAppSelector((state) => state.rawProduct);
    const { permittedMenus } = useAppSelector((state) => state.menu);
    const { activeMenu } = useAppSelector((state) => state.menu);
    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const gridRef = useRef<AgGridReact<any>>(null);
    const [colDefs, setColDefs] = useState<any>([
        {
            headerName: 'Item Code',
            headerCheckboxSelection: true,
            checkboxSelection: true,
            field: 'item_code',
            minWidth: 150,
            cellRenderer: DisabledClickRenderer
        },
        {
            headerName: 'Title',
            field: 'title',
            minWidth: 150
        },
        {
            headerName: 'product_type',
            field: 'product_type',
            valueGetter: (row: any) => (
                capitalize(row.data.product_type)
            ),
            minWidth: 150
        },
        {
            headerName: 'Unit',
            field: 'retail_price',
            valueGetter: (row: any) => (
                capitalize(row.data.sub_unit.name)
            ),
            minWidth: 150
        },
        {
            headerName: 'Valuation Method',
            field: 'valuation_method',
            minWidth: 150
        },
        {
            headerName: 'Valuation Price',
            valueGetter: (row: any) => row.data.valuated_unit_price.toFixed(2),
            minWidth: 150
        },
        {
            headerName: 'Sale Price',
            valueGetter: (row: any) => parseFloat(row.data.retail_price).toFixed(2),
            minWidth: 150
        },
        {
            headerName: 'On Hand',
            valueGetter: (row: any) => row.data.stock_quantity.toFixed(2),
            minWidth: 150
        }
    ]);

    const handleDelete = () => {
        const selectedNodes = gridRef?.current?.api.getSelectedNodes();
        let usedItems: any = selectedNodes?.filter((node: any) => node.data.used);
        let unusedItems: any = selectedNodes?.filter((row: any) => !row.data.used);
        if (usedItems.length > 0) {
            usedItems.map((item: any) => item.setSelected(false));
            Swal.fire({
                icon: 'warning',
                title: 'Oops...',
                html: `You can't delete the following items: <br/> ${usedItems.map((item: any) => item.data.item_code).join('<br/>')} <br/> Do you want to delete the rest?`,
                showCancelButton: true,
                confirmButtonText: 'Yes, delete it!',
                cancelButtonText: 'No, cancel!',
                cancelButtonColor: 'red',
                confirmButtonColor: 'green'
            }).then((result) => {
                if (result.isConfirmed) {
                    // console.log(unusedItems.map((row: any) => row.id));
                    dispatch(deleteRawProduct(unusedItems.map((row: any) => row.data.id)));
                    dispatch(getRawProducts([]));
                }
            });
        } else {
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
                    // console.log(unusedItems.map((row: any) => row.id));
                    dispatch(deleteRawProduct(unusedItems.map((row: any) => row.data.id)));
                    dispatch(getRawProducts([]));
                }
            });
        }
    };

    const handlePrint = () => {
        const ids = selectedRows.map(row => row.id).join('/');
        router.push(`/apps/inventory/products/print/${ids}`);
    };

    useEffect(() => {
        dispatch(setPageTitle('Products'));
        setAuthToken(token);
        setContentType('application/json');
        dispatch(getRawProducts([]));
    }, []);

    // useEffect(() => {
    //     console.log(selectedRows);
    // }, [selectedRows]);

    return (
        <div className="flex flex-col gap-5">
            <PageHeader
                appBasePath={AppBasePath.Raw_Product}
                key={selectedRows.length}
                selectedRows={selectedRows.length}
                gridRef={gridRef}
                leftComponent={{
                    addButton: {
                        show: true,
                        type: 'link',
                        text: 'New',
                        link: '/apps/inventory/products/create'
                    },
                    title: 'Products',
                    showSetting: true
                }}
                rightComponent={true}
                showSearch={true}
                buttonActions={{
                    delete: () => handleDelete(),
                    export: () => console.log('exported'),
                    print: () => router.push('/apps/inventory/products/print/' + selectedRows.map(row => row.id).join('/')),
                    archive: () => console.log('archived'),
                    unarchive: () => console.log('unarchived'),
                    duplicate: () => console.log('duplicated'),
                    printLabel: () => router.push('/apps/inventory/products/print-label/' + selectedRows.map(row => row.id).join('/'))
                }}
            />
            <div>
                <AgGridComponent
                    gridRef={gridRef}
                    data={allRawProducts}
                    colDefs={colDefs}
                    rowSelection={'multiple'}
                    onSelectionChangedRows={(rows) => {
                        // console.log(rows);
                        setSelectedRows(rows);
                    }}
                    rowMultiSelectWithClick={false}
                    onRowClicked={(params) => {
                        // const displayedColumns = params.api.getAllDisplayedColumns();
                        // console.log(displayedColumns, params.column, displayedColumns[0], displayedColumns[0] === params.column);
                        // return displayedColumns[0] === params.column;
                        checkPermission(permittedMenus, activeMenu.route, ActionList.VIEW_DETAIL, AppBasePath.Raw_Product) &&
                        router.push(`/apps/inventory/products/view/${params.data.id}`);
                    }}
                />
            </div>
        </div>
    );
};

Index.getLayout = (page: any) => <AppLayout>{page}</AppLayout>;
export default Index;
