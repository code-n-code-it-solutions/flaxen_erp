import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import AppLayout from '@/components/Layouts/AppLayout';
import PageHeader from '@/components/apps/PageHeader';
import Button from '@/components/Button';
import { ButtonSize, ButtonType, ButtonVariant } from '@/utils/enums';
import { setPageTitle } from '@/store/slices/themeConfigSlice';
import { AgGridReact, CustomLoadingCellRendererProps } from 'ag-grid-react';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '@/store';
import { capitalize } from 'lodash';
import { setAuthToken, setContentType } from '@/configs/api.config';
import { deleteRawProduct, getRawProducts } from '@/store/slices/rawProductSlice';
import { ModuleRegistry } from '@ag-grid-community/core';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import GridLoader from '@/components/apps/GridLoader';
import AgGridComponent from '@/components/apps/AgGridComponent';
import Dropdown from '@/components/Dropdown';
import {
    ArchiveIcon,
    CogIcon,
    CopyIcon,
    DownloadCloud,
    KanbanIcon,
    ListIcon, PrinterIcon,
    TrashIcon,
    UploadCloud
} from 'lucide-react';
import Link from 'next/link';
import CustomButton from '@/components/apps/CustomButton';
import OnRowSelectDropdown from '@/components/apps/OnRowSelectDropdown';
import DisabledClickRenderer from '@/components/apps/DisabledClickRenderer';
import Swal from 'sweetalert2';
import { deleteProductAssembly, getProductAssemblies } from '@/store/slices/productAssemblySlice';

ModuleRegistry.registerModules([ClientSideRowModelModule]);

const Index = () => {
    const router = useRouter();

    const dispatch = useAppDispatch();
    const { token } = useAppSelector((state) => state.user);

    const { allProductAssemblies, loading, success } = useAppSelector((state) => state.productAssembly);
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
            valueGetter: (row: any) => row.data.category.name,
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
                             style={{ backgroundColor: `${row.data.color_code.hex_code}` }}></div>
                        {row.data.color_code.name} ({row.data.color_code.code})
                    </div>
                );
            },
            minWidth: 150
        },
        {
            headerName: 'Quantity',
            field: 'quantity',
            valueGetter: (row: any) => {
                let total: any = row.data.product_assembly_items.reduce((sum: number, row: any) => sum + +row.quantity, 0);
                return isNaN(total) ? 0 : total.toFixed(2);
            },
            minWidth: 150
        },
        {
            headerName: 'Cost',
            field: 'cost',
            valueGetter: (row: any) => row.data.product_assembly_items.reduce((sum: number, row: any) => sum + parseFloat(row.cost), 0).toFixed(2),
            minWidth: 150
        },
        {
            headerName: 'On Hand',
            field: 'stock_quantity',
            cellRenderer: (row: any) => {
                return (
                    <div className="flex flex-col justify-start items-start gap-2">
                        {row.data.stock_quantity.length > 0
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
                    dispatch(deleteProductAssembly(unusedItems.map((row: any) => row.id)));
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
                    dispatch(deleteProductAssembly(unusedItems.map((row: any) => row.id)));
                    dispatch(getProductAssemblies());
                }
            });
        }
    };

    const onQuickFilterChanged = useCallback(() => {
        gridRef.current!.api.setGridOption(
            'quickFilterText',
            (document.getElementById('quickFilter') as HTMLInputElement).value
        );
    }, []);

    const exportAsCSV = useCallback(() => {
        gridRef.current!.api.exportDataAsCsv();
    }, []);

    const headerComponentProps = () => {
        let props: any = {
            leftComponent: {
                title: 'Formulas',
                button: {
                    show: true,
                    text: 'New',
                    link: '/apps/manufacturing/formula/create'
                },
                cogIcon: (
                    <div className="dropdown flex shrink-0">
                        <Dropdown
                            // offset={[8, 0]}
                            placement={`bottom-end`}
                            btnClassName="relative group block"
                            button={<CogIcon size={18} />}>
                            <ul className="w-[230px] border !py-0 font-semibold text-dark dark:text-white-dark dark:text-white-light/90">
                                <li>
                                    <Link href="/workspace/user"
                                          className="flex gap-2 items-center dark:hover:text-white">
                                        <UploadCloud />
                                        Import records
                                    </Link>
                                </li>
                                <li>
                                    <span onClick={() => exportAsCSV()}
                                          className="flex gap-2 items-center dark:hover:text-white">
                                        <DownloadCloud />
                                        Export All
                                    </span>
                                </li>
                            </ul>
                        </Dropdown>
                    </div>
                )
            },
            search: {
                onQuickFilterChanged: onQuickFilterChanged
            },
            rightComponent: [
                {
                    show: true,
                    icon: <KanbanIcon size={18} />,
                    onClick: () => console.log('Upload')
                },
                {
                    show: true,
                    icon: <ListIcon size={18} />,
                    onClick: () => console.log('Download')
                }
            ]
        };
        // console.log(selectedRows);
        if (selectedRows.length > 0) {
            props.middleComponent = <OnRowSelectDropdown
                dropdownButton={{
                    text: 'Actions',
                    icon: <CogIcon size={18} />,
                    variant: 'primary'
                }}
                otherButtons={[
                    <CustomButton
                        key={0}
                        isDisabled={true}
                        isListButton={false}
                        text={`Selected ${selectedRows.length}`}
                        // icon={<PrinterIcon size={18} />}
                        // onClick={() => console.log('Print labels')}
                    />,
                    <CustomButton
                        key={1}
                        isListButton={false}
                        text="Print Labels"
                        icon={<PrinterIcon size={18} />}
                        onClick={() => console.log('Print labels')}
                    />
                ]}
                dropdownItems={[
                    {
                        onClick: () => console.log('Export'),
                        content: (
                            <CustomButton
                                key={0}
                                isListButton
                                text="Export"
                                icon={<DownloadCloud size={18} />}
                                onClick={() => console.log('Export')}
                            />
                        )
                    },
                    {
                        onClick: () => console.log('Archived'),
                        content: (
                            <CustomButton
                                key={0}
                                isListButton
                                text="Archive"
                                icon={<ArchiveIcon size={18} />}
                                onClick={() => console.log('Archived')}
                            />
                        )
                    },
                    {
                        onClick: () => console.log('Unarchived'),
                        content: (
                            <CustomButton
                                key={0}
                                isListButton
                                text="Un Archive"
                                icon={<UploadCloud size={18} />}
                                onClick={() => console.log('Unarchived')}
                            />
                        )
                    },
                    {
                        onClick: () => console.log('Duplicate'),
                        content: (
                            <CustomButton
                                key={0}
                                isListButton
                                text="Duplicate"
                                icon={<CopyIcon size={18} />}
                                onClick={() => console.log('Duplicate')}
                            />
                        )
                    },
                    {
                        onClick: () => handleDelete(),
                        content: (
                            <CustomButton
                                key={0}
                                isListButton
                                text="Delete"
                                icon={<TrashIcon size={18} />}
                                onClick={() => handleDelete()}
                            />
                        )
                    }
                ]}
            />;
        }
        // console.log(props);
        return props;
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
                key={selectedRows.length}
                {...headerComponentProps()}
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
                        router.push(`/apps/manufacturing/formula/view/${params.data.id}`);
                    }}
                />
            </div>
        </div>
    );
};

Index.getLayout = (page: any) => <AppLayout>{page}</AppLayout>;
export default Index;
