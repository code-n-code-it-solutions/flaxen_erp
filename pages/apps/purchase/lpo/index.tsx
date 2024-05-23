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
import { getPurchaseRequisitions } from '@/store/slices/purchaseRequisitionSlice';
import { getLPO } from '@/store/slices/localPurchaseOrderSlice';

ModuleRegistry.registerModules([ClientSideRowModelModule]);

const Index = () => {
    const router = useRouter();

    const dispatch = useAppDispatch();
    const { token } = useAppSelector((state) => state.user);

    const {allLPOs, loading, success} = useAppSelector(state => state.localPurchaseOrder);
    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const gridRef = useRef<AgGridReact<any>>(null);
    const [colDefs, setColDefs] = useState<any>([
        {
            headerName: 'LPO #',
            headerCheckboxSelection: true,
            checkboxSelection: true,
            field: 'lpo_number',
            minWidth: 150,
            cellRenderer: DisabledClickRenderer
        },
        {
            headerName: 'Type',
            field: 'type',
            minWidth: 150
        },
        {
            headerName: 'Vendor',
            field: 'vendor.name',
            minWidth: 150
        },
        {
            headerName: 'Vendor Rep',
            field: 'vendor_representative.name',
            minWidth: 150
        },{
            headerName: 'Due Date',
            field: 'delivery_due_date',
            minWidth: 150
        },
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
                title: 'LPOs',
                button: {
                    show: true,
                    text: 'New',
                    link: '/apps/purchase/lpo/create'
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
        dispatch(setPageTitle('LPOs'));
        setAuthToken(token);
        setContentType('application/json');
        dispatch(getLPO())
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
                    data={allLPOs}
                    colDefs={colDefs}
                    rowSelection={'multiple'}
                    onSelectionChangedRows={(rows) => setSelectedRows(rows)}
                    rowMultiSelectWithClick={false}
                    onRowClicked={(params) => {
                        // const displayedColumns = params.api.getAllDisplayedColumns();
                        // console.log(displayedColumns, params.column, displayedColumns[0], displayedColumns[0] === params.column);
                        // return displayedColumns[0] === params.column;
                        router.push(`/apps/purchase/lpo/view/${params.data.id}`);
                    }}
                />
            </div>
        </div>
    );
};

Index.getLayout = (page: any) => <AppLayout>{page}</AppLayout>;
export default Index;
