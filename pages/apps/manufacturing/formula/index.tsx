import React, { useEffect, useRef, useState } from 'react';
import AppLayout from '@/components/Layouts/AppLayout';
import PageHeader from '@/components/apps/PageHeader';
import { ActionList, AppBasePath } from '@/utils/enums';
import { setPageTitle } from '@/store/slices/themeConfigSlice';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '@/store';
import { setAuthToken, setContentType } from '@/configs/api.config';
import AgGridComponent from '@/components/apps/AgGridComponent';
import DisabledClickRenderer from '@/components/apps/DisabledClickRenderer';
import Swal from 'sweetalert2';
import { deleteProductAssembly, getProductAssemblies } from '@/store/slices/productAssemblySlice';
import useSetActiveMenu from '@/hooks/useSetActiveMenu';
import { AgGridReact } from 'ag-grid-react';
import { checkPermission } from '@/utils/helper';

const Index = () => {
    useSetActiveMenu(AppBasePath.Product_Assembly);
    const router = useRouter();

    const dispatch = useAppDispatch();
    const { token } = useAppSelector((state) => state.user);

    const { allProductAssemblies, loading, success } = useAppSelector((state) => state.productAssembly);
    const { permittedMenus, activeMenu } = useAppSelector((state) => state.menu);
    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const gridRef = useRef<AgGridReact<any>>(null);
    const [colDefs, setColDefs] = useState<any>([
        {
            headerName: 'Formula Code',
            headerCheckboxSelection: true,
            checkboxSelection: true,
            field: 'formula_code',
            minWidth: 150,
            cellRenderer: DisabledClickRenderer
        },
        {
            headerName: 'Name',
            field: 'formula_name',
            minWidth: 150
        },
        {
            headerName: 'Category',
            field: 'category',
            valueGetter: (row: any) => row.data?.category.name,
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
                             style={{ backgroundColor: `${row.data?.color_code.hex_code}` }}></div>
                        {row.data?.color_code.name} ({row.data?.color_code.code})
                    </div>
                );
            },
            minWidth: 150
        },
        {
            headerName: 'Quantity',
            field: 'quantity',
            valueGetter: (row: any) => {
                let total: any = row.data?.product_assembly_items.reduce((sum: number, row: any) => sum + +row.quantity, 0);
                return isNaN(total) ? 0 : total.toFixed(2);
            },
            minWidth: 150
        },
        {
            headerName: 'Cost',
            field: 'cost',
            valueGetter: (row: any) => row.data?.product_assembly_items.reduce((sum: number, row: any) => sum + parseFloat(row.total), 0).toFixed(2),
            minWidth: 150
        },
        {
            headerName: 'On Hand',
            field: 'stock_quantity',
            cellRenderer: (row: any) => {
                return (
                    <div className="flex flex-col justify-start items-start gap-2">
                        {row.data?.stock_quantity?.length > 0
                            ? row.data.stock_quantity.map((item: any, index: number) => (
                                <span key={index}>{item.product.title + ': ' + item.stock}</span>
                            ))
                            : 'No stock available'}
                    </div>
                );
            },
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
                    dispatch(deleteProductAssembly(unusedItems.map((row: any) => row.data.id)));
                    dispatch(getProductAssemblies());
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
                    dispatch(deleteProductAssembly(unusedItems.map((row: any) => row.data.id)));
                    dispatch(getProductAssemblies());
                }
            });
        }
    };

    useEffect(() => {
        dispatch(setPageTitle('Formula'));
        setAuthToken(token);
        setContentType('application/json');
        dispatch(getProductAssemblies());
    }, []);

    // useEffect(() => {
    //     console.log(selectedRows);
    // }, [selectedRows]);

    return (
        <div className="flex flex-col gap-5">
            <PageHeader
                appBasePath={AppBasePath.Product_Assembly}
                key={selectedRows.length}
                selectedRows={selectedRows.length}
                gridRef={gridRef}
                leftComponent={{
                    addButton: {
                        show: true,
                        type: 'link',
                        text: 'New',
                        link: '/apps/manufacturing/formula/create'
                    },
                    title: 'Formulas',
                    showSetting: true
                }}
                rightComponent={true}
                showSearch={true}
                buttonActions={{
                    delete: () => handleDelete(),
                    export: () => console.log('exported'),
                    print: () => router.push('/apps/manufacturing/formula/print/' + selectedRows.map(row => row.id).join('/')),
                    archive: () => console.log('archived'),
                    unarchive: () => console.log('unarchived'),
                    duplicate: () => console.log('duplicated'),
                    printLabel: () => console.log('print label')
                }}
            />
            <div>
                <AgGridComponent
                    gridRef={gridRef}
                    data={allProductAssemblies}
                    colDefs={colDefs}
                    rowSelection={'multiple'}
                    onSelectionChangedRows={(rows) => setSelectedRows(rows)}
                    rowMultiSelectWithClick={false}
                    onRowClicked={(params) => {
                        // const displayedColumns = params.api.getAllDisplayedColumns();
                        // console.log(displayedColumns, params.column, displayedColumns[0], displayedColumns[0] === params.column);
                        // return displayedColumns[0] === params.column;
                        checkPermission(permittedMenus, activeMenu.route, ActionList.VIEW_DETAIL, AppBasePath.Raw_Product) &&
                        router.push(`/apps/manufacturing/formula/view/${params.data.id}`);
                    }}
                />
            </div>
        </div>
    );
};

Index.getLayout = (page: any) => <AppLayout>{page}</AppLayout>;
export default Index;
