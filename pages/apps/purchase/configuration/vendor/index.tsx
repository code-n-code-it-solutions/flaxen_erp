import React, { useEffect, useRef, useState } from 'react';
import AppLayout from '@/components/Layouts/AppLayout';
import PageHeader from '@/components/apps/PageHeader';
import { setPageTitle } from '@/store/slices/themeConfigSlice';
import { AgGridReact } from 'ag-grid-react';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '@/store';
import { setAuthToken, setContentType } from '@/configs/api.config';
import { deleteRawProduct, getRawProducts } from '@/store/slices/rawProductSlice';
import AgGridComponent from '@/components/apps/AgGridComponent';
import DisabledClickRenderer from '@/components/apps/DisabledClickRenderer';
import Swal from 'sweetalert2';
import { getVendors } from '@/store/slices/vendorSlice';
import { checkPermission, serverFilePath } from '@/utils/helper';
import Image from 'next/image';
import { ActionList, AppBasePath } from '@/utils/enums';
import useSetActiveMenu from '@/hooks/useSetActiveMenu';

const Index = () => {
    const router = useRouter();
    useSetActiveMenu(AppBasePath.Vendor);
    const dispatch = useAppDispatch();
    const { token } = useAppSelector((state) => state.user);
    const { permittedMenus, activeMenu } = useAppSelector((state) => state.menu);
    const { allVendors, loading, success } = useAppSelector(state => state.vendor);
    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const gridRef = useRef<AgGridReact<any>>(null);
    const [colDefs, setColDefs] = useState<any>([
        {
            headerName: 'Code',
            headerCheckboxSelection: true,
            checkboxSelection: true,
            field: 'vendor_number',
            minWidth: 150,
            cellRenderer: DisabledClickRenderer
        },
        {
            headerName: 'Name',
            field: 'name',
            cellRenderer: (params: any) => (
                <div className="flex gap-1 items-center">
                    <Image
                        priority={true}
                        src={serverFilePath(params.data.thumbnail?.path)}
                        alt={params.data.name}
                        width={40}
                        height={40}
                        className="h-10 w-10 rounded-md p-1"
                    />
                    <span>{params.data.name}</span>
                </div>
            ),
            minWidth: 150
        },
        {
            headerName: 'Phone',
            field: 'phone',
            minWidth: 150
        },
        {
            headerName: 'Due in Days',
            field: 'due_in_days',
            minWidth: 150
        },
        {
            headerName: 'Address',
            field: 'address',
            cellRenderer: (params: any) => (
                <span>
                    {params.data.address} {params.data.city?.name} {params.data.state?.name}, <br />
                    {params.data.country?.name}, {params.data.postal_code}
                </span>
            ),
            minWidth: 150
        }
    ]);

    const handleDelete = () => {
        const selectedNodes = gridRef?.current?.api.getSelectedNodes();
        let usedItems: any = selectedNodes?.filter((node: any) => node.data.used);
        let unusedItems: any = selectedRows?.filter((row: any) => row.used === 0);
        if (usedItems.length > 0) {
            usedItems.map((item: any) => item.setSelected(false));
            Swal.fire({
                icon: 'warning',
                title: 'Oops...',
                html: `You can't delete the following items: <br/> ${usedItems.map((item: any) => item.item_code).join('<br/>')} <br/> Do you want to delete the rest?`,
                showCancelButton: true,
                confirmButtonText: 'Yes, delete it!',
                cancelButtonText: 'No, cancel!',
                cancelButtonColor: 'red',
                confirmButtonColor: 'green'
            }).then((result) => {
                if (result.isConfirmed) {
                    // console.log(unusedItems.map((row: any) => row.id));
                    dispatch(deleteRawProduct(unusedItems.map((row: any) => row.id)));
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
                    dispatch(deleteRawProduct(unusedItems.map((row: any) => row.id)));
                    dispatch(getRawProducts([]));
                }
            });
        }
    };

    useEffect(() => {
        dispatch(setPageTitle('Vendors'));
        setAuthToken(token);
        setContentType('application/json');
        dispatch(getVendors());
    }, []);

    // useEffect(() => {
    //     console.log(selectedRows);
    // }, [selectedRows]);

    return (
        <div className="flex flex-col gap-5">
            <PageHeader
                appBasePath={AppBasePath.Vendor}
                key={selectedRows.length}
                selectedRows={selectedRows.length}
                gridRef={gridRef}
                leftComponent={{
                    addButton: {
                        show: true,
                        type: 'link',
                        text: 'New',
                        link: '/apps/purchase/configuration/vendor/create'
                    },
                    title: 'Vendors',
                    showSetting: true
                }}
                rightComponent={true}
                showSearch={true}
                buttonActions={{
                    delete: () => console.log('deleted'),
                    export: () => console.log('exported'),
                    print: () => router.push('/apps/purchase/configuration/vendor/print/' + selectedRows.map(row => row.id).join('/')),
                    archive: () => console.log('archived'),
                    unarchive: () => console.log('unarchived'),
                    duplicate: () => console.log('duplicated'),
                    printLabel: () => console.log('print label')
                }}
            />
            <div>
                <AgGridComponent
                    gridRef={gridRef}
                    data={allVendors}
                    colDefs={colDefs}
                    rowSelection={'multiple'}
                    onSelectionChangedRows={(rows) => setSelectedRows(rows)}
                    rowMultiSelectWithClick={false}
                    onRowClicked={(params) => {
                        // const displayedColumns = params.api.getAllDisplayedColumns();
                        // console.log(displayedColumns, params.column, displayedColumns[0], displayedColumns[0] === params.column);
                        // return displayedColumns[0] === params.column;
                        checkPermission(permittedMenus, activeMenu.route, ActionList.VIEW_DETAIL, AppBasePath.Vendor) &&
                        router.push(`/apps/purchase/configuration/vendor/view/${params.data.id}`);
                    }}
                />
            </div>
        </div>
    );
};

Index.getLayout = (page: any) => <AppLayout>{page}</AppLayout>;
export default Index;
