import React, { useEffect, useRef, useState } from 'react';
import AppLayout from '@/components/Layouts/AppLayout';
import PageHeader from '@/components/apps/PageHeader';
import { ActionList, AppBasePath } from '@/utils/enums';
import { setPageTitle } from '@/store/slices/themeConfigSlice';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '@/store';
import { setAuthToken, setContentType } from '@/configs/api.config';
import AgGridComponent from '@/components/apps/AgGridComponent';
import Swal from 'sweetalert2';
import useSetActiveMenu from '@/hooks/useSetActiveMenu';
import { AgGridReact } from 'ag-grid-react';

const Index = () => {
    useSetActiveMenu(AppBasePath.Wastage);
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { token, menus } = useAppSelector((state) => state.user);
    const { activeMenu } = useAppSelector((state) => state.menu);

    // Mock data for wastage entries
    const mockWastageData = [
        { id: 1, product: 'Product A', batchNumber: 'B123', wastageQuantity: 10, wastageCost: 50 },
        { id: 2, product: 'Product B', batchNumber: 'B456', wastageQuantity: 5, wastageCost: 25 },
        { id: 3, product: 'Product C', batchNumber: 'B789', wastageQuantity: 20, wastageCost: 100 }
    ];

    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const gridRef = useRef<AgGridReact<any>>(null);
    const [colDefs] = useState<any>([
        {
            headerName: 'Product',
            field: 'product',
            minWidth: 150,
        },
        {
            headerName: 'Batch Number',
            field: 'batchNumber',
            minWidth: 150,
        },
        {
            headerName: 'Wastage Quantity',
            field: 'wastageQuantity',
            minWidth: 150,
        },
        {
            headerName: 'Wastage Cost',
            field: 'wastageCost',
            minWidth: 150,
            valueGetter: (params: any) => `$${params.data.wastageCost.toFixed(2)}`,
        }
    ]);

    useEffect(() => {
        dispatch(setPageTitle('Wastage'));
        setAuthToken(token);
        setContentType('application/json');
        // Fetch or set your data here, e.g., dispatch(getWastageEntries());
    }, [dispatch, token]);

    const handleDelete = () => {
        const selectedNodes = gridRef.current?.api.getSelectedNodes();
        if (selectedNodes && selectedNodes.length > 0) {
            const idsToDelete = selectedNodes.map(node => node.data.id);
            Swal.fire({
                title: 'Are you sure?',
                text: 'You won\'t be able to revert this!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, delete it!',
            }).then((result) => {
                if (result.isConfirmed) {
                    // Dispatch deletion action here
                    console.log(`Deleted Wastage IDs: ${idsToDelete}`);
                    // e.g., dispatch(deleteWastage(idsToDelete));
                    gridRef.current?.api.applyTransaction({ remove: selectedNodes.map(node => node.data) });
                }
            });
        }
    };

    return (
        <div className="flex flex-col gap-5">
            <PageHeader
                appBasePath={AppBasePath.Wastage}
                key={selectedRows.length}
                selectedRows={selectedRows.length}
                gridRef={gridRef}
                leftComponent={{
                    addButton: {
                        show: false,  // Set to false or leave it empty to avoid TypeScript errors
                    },
                    title: 'Wastage Management',
                    showSetting: true,
                }}
                rightComponent={true}
                showSearch={true}
                buttonActions={{
                    delete: handleDelete,
                    export: () => console.log('exported'),
                    print: () => console.log('printed'),
                }}
            />
            <div>
                <AgGridComponent
                    gridRef={gridRef}
                    data={mockWastageData}
                    colDefs={colDefs}
                    rowSelection={'multiple'}
                    onSelectionChangedRows={(rows) => setSelectedRows(rows)}
                    rowMultiSelectWithClick={false}
                    onRowClicked={(params) => {
                        router.push(`/apps/manufacturing/wastage/view/${params.data.id}`);
                    }}
                />
            </div>
        </div>
    );
};

// Index.getLayout = (page: any) => <AppLayout>{page}</AppLayout>;
export default Index;
