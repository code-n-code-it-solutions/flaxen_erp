import React, { useEffect, useMemo, useRef, useState } from 'react';
import PageHeader from '@/components/apps/PageHeader';
import { setPageTitle } from '@/store/slices/themeConfigSlice';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '@/store';
import { setAuthToken, setContentType } from '@/configs/api.config';
import useSetActiveMenu from '@/hooks/useSetActiveMenu';
import { AppBasePath, ButtonType, ButtonVariant } from '@/utils/enums';
import PageWrapper from '@/components/PageWrapper';
import { clearAccountState, getGeneralJournal } from '@/store/slices/accountSlice';
import { AgGridReact } from 'ag-grid-react';
import Swal from 'sweetalert2';
import Button from '@/components/Button';
import { Input } from '@/components/form/Input';
import { capitalize } from 'lodash';
import AgGridComponent from '@/components/apps/AgGridComponent';
import {
    SizeColumnsToContentStrategy,
    SizeColumnsToFitGridStrategy,
    SizeColumnsToFitProvidedWidthStrategy
} from '@ag-grid-community/core';

const Index = () => {
    useSetActiveMenu(AppBasePath.General_Journal);
    const router = useRouter();
    const dispatch = useAppDispatch();
    const gridRef = useRef<AgGridReact<any>>(null);

    const { token } = useAppSelector((state) => state.user);
    const { generalJournal } = useAppSelector((state) => state.account);

    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const [formData, setFormData] = useState<any>({});
    const [reportData, setReportData] = useState<any[]>([]);

    const calculateTotals = (data: any) => {
        const totals = [];
        const groupedData = data.reduce((acc: any, row: any) => {
            acc[row.document_no] = acc[row.document_no] || [];
            acc[row.document_no].push(row);
            return acc;
        }, {});

        for (const documentNo in groupedData) {
            const group = groupedData[documentNo];
            const totalDebit = group.reduce((sum: any, row: any) => sum + row.debit, 0);
            const totalCredit = group.reduce((sum: any, row: any) => sum + row.credit, 0);

            totals.push(...group);
            totals.push({
                date: '', // Keep empty for total row
                document_no: documentNo + ' Total',
                source: '',
                narration: '',
                account_name: '',
                debit: totalDebit,
                credit: totalCredit,
                isTotal: true // Flag to indicate this is a total row
            });
        }

        return totals;
    };

    const [colDefs, setColDefs] = useState<any>([
        {
            headerName: 'Date',
            valueGetter: (params: any) => params.data?.isTotal ? '' : new Date(params.data?.created_at).toLocaleDateString(),
            // minWidth: 150,
            sortable: false,
            filter: false,
            floatingFilter: false
        },
        {
            headerName: 'Document No',
            field: 'document_no',
            // minWidth: 150,
            sortable: false,
            filter: false,
            floatingFilter: false,
            cellStyle: (params: any) => {
                if (params.data?.isTotal) {
                    return { fontWeight: 'bold' };
                }
            }
        },
        {
            headerName: 'Source',
            valueGetter: (params: any) => params.data?.isTotal ? '' : capitalize(params.data?.transaction_through.replace('_', ' ')),
            // minWidth: 150,
            sortable: false,
            filter: false,
            floatingFilter: false
        },
        {
            headerName: 'Narration',
            field: 'description',
            // minWidth: 150,
            cellStyle: { whiteSpace: 'normal', lineHeight: '1.5' },
            autoHeight: true,
            sortable: false,
            filter: false,
            floatingFilter: false
        },
        {
            headerName: 'Account Name',
            field: 'account_name',
            resizable: true,
            sortable: false,
            filter: false,
            floatingFilter: false,
            cellStyle: (params: any) => {
                if (params.data?.isTotal) {
                    return { fontWeight: 'bold' };
                }
            }
        },
        {
            headerName: 'Debit',
            field: 'debit',
            sortable: false,
            filter: false,
            floatingFilter: false,
            cellStyle: (params: any) => {
                if (params.data?.isTotal) {
                    return { fontWeight: 'bold' };
                }
            }
        },
        {
            headerName: 'Credit',
            field: 'credit',
            sortable: false,
            filter: false,
            floatingFilter: false,
            cellStyle: (params: any) => {
                if (params.data?.isTotal) {
                    return { fontWeight: 'bold' };
                }
            }
        }
    ]);

    const autoSizeStrategy = useMemo<
        | SizeColumnsToFitGridStrategy
        | SizeColumnsToFitProvidedWidthStrategy
        | SizeColumnsToContentStrategy
    >(() => {
        return {
            type: "fitCellContents",
        };
    }, []);

    const handleChange = (name: string, value: any) => {
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleGenerate = () => {
        dispatch(getGeneralJournal(formData));
    };

    const handleReset = () => {
        setFormData({});
        setReportData([]);
        gridRef?.current?.api.deselectAll();
    };

    const handleExport = () => {
        if (reportData.length > 0) {
            gridRef?.current?.api.exportDataAsCsv();
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'No data found to export or report not generated'
            });
        }
    };

    useEffect(() => {
        dispatch(setPageTitle('General Journal'));
        setAuthToken(token);
        dispatch(clearAccountState());
        handleReset();
    }, []);

    useEffect(() => {
        if (generalJournal) {
            const calculatedData = calculateTotals(generalJournal);
            setReportData(calculatedData);
        }
    }, [generalJournal]);

    return (
        <div className="flex flex-col gap-3">
            <PageHeader
                gridRef={gridRef}
                appBasePath={AppBasePath.General_Journal}
                key={selectedRows.length}
                selectedRows={selectedRows.length}
                leftComponent={{
                    addButton: {
                        show: false
                    },
                    title: 'General Journal',
                    showSetting: false
                }}
                rightComponent={true}
                showSearch={true}
                buttonActions={{
                    delete: () => console.log('deleted'),
                    export: () => handleExport(),
                    print: () => console.log('print'),
                    archive: () => console.log('archived'),
                    unarchive: () => console.log('unarchived'),
                    duplicate: () => console.log('duplicated'),
                    printLabel: () => console.log('printLabel')
                }}
            />
            <PageWrapper>
                <div className="w-full">
                    <div className="flex flex-col md:flex-row md:items-end justify-start gap-2 w-full">
                        <Input
                            divClasses="w-full"
                            label="From Date"
                            type="date"
                            name="from_date"
                            value={formData.from_date}
                            onChange={(e) => handleChange('from_date', e[0] ? e[0].toLocaleDateString() : '')}
                            placeholder="Enter Start Date"
                            isMasked={false}
                        />
                        <Input
                            divClasses="w-full"
                            label="To Date"
                            type="date"
                            name="to_date"
                            value={formData.to_date}
                            onChange={(e) => handleChange('to_date', e[0] ? e[0].toLocaleDateString() : '')}
                            placeholder="Enter To Date"
                            isMasked={false}
                        />
                        <Button
                            type={ButtonType.button}
                            text="Generate"
                            variant={ButtonVariant.primary}
                            onClick={handleGenerate}
                        />
                        <Button
                            type={ButtonType.button}
                            text="Reset"
                            variant={ButtonVariant.info}
                            onClick={handleReset}
                        />
                        <Button
                            type={ButtonType.button}
                            text="Export"
                            variant={ButtonVariant.success}
                            onClick={handleExport}
                        />
                    </div>
                </div>
            </PageWrapper>
            {reportData.length > 0 ? (
                <div>
                    <AgGridComponent
                        gridRef={gridRef}
                        data={reportData}
                        colDefs={colDefs}
                        // pinnedBottomRowData={pinnedBottomRowData}
                        autoSizeStrategy={autoSizeStrategy}
                        getRowStyle={(params:any) => {
                            if (params.data?.isTotal) {
                                return { backgroundColor: '#f2f2f2' }; // Light gray background for total rows
                            }
                            return null;
                        }}
                        onFirstDataRendered={() => {
                            if (gridRef.current) {
                                const allColumnIds = gridRef.current.api.getAllDisplayedColumns().map((column) => column.getColId());
                                gridRef.current.api.autoSizeColumns(allColumnIds);
                            }
                        }}
                    />
                </div>
            ) : (
                <div className="panel">
                    <div className="flex justify-center items-center h-32">
                        <p className="text-lg font-semibold">No data found</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Index;
