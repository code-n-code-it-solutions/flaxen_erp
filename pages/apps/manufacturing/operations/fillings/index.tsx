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
import { getProductions } from '@/store/slices/productionSlice';
import { getFillings } from '@/store/slices/fillingSlice';

ModuleRegistry.registerModules([ClientSideRowModelModule]);

const Index = () => {
    const router = useRouter();

    const dispatch = useAppDispatch();
    const { token } = useAppSelector((state) => state.user);

    const { fillings, loading, success } = useAppSelector(state => state.filling);
    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const gridRef = useRef<AgGridReact<any>>(null);
    const [colDefs, setColDefs] = useState<any>([
        {
            headerName: 'Filling Code',
            headerCheckboxSelection: true,
            checkboxSelection: true,
            field: 'filling_code',
            minWidth: 150,
            cellRenderer: DisabledClickRenderer
        },
        {
            headerName: 'Batch Number',
            field: 'production.batch_number',
            minWidth: 150
        },
        {
            headerName: 'Category',
            field: 'product_assembly.category.name',
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
                console.log(row.data);
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
            field: 'production.no_of_quantity',
            minWidth: 150
        },
        {
            headerName: 'Date',
            field: 'filling_date',
            valueGetter: (row: any) => new Date(row.data.filling_date).toLocaleDateString() + ' ' + new Date(row.data.filling_date).toLocaleTimeString(),
            minWidth: 150
        },
        {
            headerName: 'Shift',
            field: 'working_shift.name',
            minWidth: 150
        }
    ]);

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
                title: 'Fillings',
                button: {
                    show: true,
                    text: 'New',
                    link: '/apps/manufacturing/operations/fillings/create'
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
                    }
                ]}
            />;
        }
        // console.log(props);
        return props;
    };

    useEffect(() => {
        dispatch(setPageTitle('Fillings'));
        setAuthToken(token);
        setContentType('application/json');
        dispatch(getFillings());
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
                    data={fillings}
                    colDefs={colDefs}
                    rowSelection={'multiple'}
                    onSelectionChangedRows={(rows) => setSelectedRows(rows)}
                    rowMultiSelectWithClick={false}
                    onRowClicked={(params) => {
                        // const displayedColumns = params.api.getAllDisplayedColumns();
                        // console.log(displayedColumns, params.column, displayedColumns[0], displayedColumns[0] === params.column);
                        // return displayedColumns[0] === params.column;
                        router.push(`/apps/manufacturing/operations/fillings/view/${params.data.id}`);
                    }}
                />
            </div>
        </div>
    );
};

Index.getLayout = (page: any) => <AppLayout>{page}</AppLayout>;
export default Index;
