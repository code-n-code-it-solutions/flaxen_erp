import React, { useEffect, useRef, useState } from 'react';
import AppLayout from '@/components/Layouts/AppLayout';
import useSetActiveMenu from '@/hooks/useSetActiveMenu';
import { ActionList, AppBasePath, ButtonType, ButtonVariant } from '@/utils/enums';
import { useAppDispatch, useAppSelector } from '@/store';
import { setPageTitle } from '@/store/slices/themeConfigSlice';
import { setAuthToken } from '@/configs/api.config';
import { Dropdown } from '@/components/form/Dropdown';
import Button from '@/components/Button';
import { AgGridReact } from 'ag-grid-react';
import AgGridComponent from '@/components/apps/AgGridComponent';
import {
    clearReportState,
    getVendorStatementReport
} from '@/store/slices/reportSlice';
import Swal from 'sweetalert2';
import { Input } from '@/components/form/Input';
import { clearVendorState, getVendors } from '@/store/slices/vendorSlice';
import { FileSpreadsheetIcon, PrinterIcon, RefreshCwIcon } from 'lucide-react';
import { CloseIcon } from '@mantine/core';
import { calculateDateFromDays } from '@/utils/helper';
import { capitalize } from 'lodash';

const Index = () => {
    useSetActiveMenu(AppBasePath.Vendor_Report_Statement);
    const dispatch = useAppDispatch();
    // const { data, isLoading, isError } = useQuery('raw-materials', () => getRawMaterials(dispatch))
    const { user, token } = useAppSelector(state => state.user);
    const { allVendors } = useAppSelector(state => state.vendor);
    const { vendorStatement } = useAppSelector(state => state.report);
    const [formData, setFormData] = useState<any>({});
    const [vendorOptions, setVendorOptions] = useState([]);
    const [reportData, setReportData] = useState<any[]>([]);
    const [pinnedBottomRowData, setPinnedBottomRowData] = useState<any[]>([]);
    const gridRef = useRef<AgGridReact<any>>(null);
    const [colDefs, setColDefs] = useState<any>([
        {
            headerName: 'Date',
            valueGetter: (row: any) => row.data?.bill_date ?? new Date(row.data?.created_at).toLocaleDateString(),
            minWidth: 150,
            filter: false,
            floatingFilter: false
        },
        {
            headerName: 'Transaction #',
            valueGetter: (row: any) => row.data?.bill_type === 'credit' ? calculateDateFromDays(row.data?.vendor?.due_in_days, row.data?.bill_date ?? new Date(row.data?.created_at)) : row.data?.due_date,
            minWidth: 150,
            filter: false,
            floatingFilter: false
        },
        {
            headerName: 'Document #',
            valueGetter: (row: any) => row.data?.bill_type === 'credit' ? row.data?.vendor?.due_in_days : '',
            minWidth: 150,
            filter: false,
            floatingFilter: false
        },
        {
            headerName: 'Narration',
            valueGetter: (row: any) => capitalize(row.data?.bill_type),
            minWidth: 150,
            filter: false,
            floatingFilter: false
        },
        {
            headerName: 'Transaction Type',
            field: 'bill_number',
            minWidth: 150,
            filter: false,
            floatingFilter: false
        },
        {
            headerName: 'Amount',
            valueGetter: (row: any) => row.data?.vendor_payments?.reduce((acc: number, item: any) => acc + parseFloat(item.paid_amount), 0),
            minWidth: 150,
            filter: false,
            floatingFilter: false,
            aggFunc: 'sum'
        },
    ]);

    const calculateTotals = () => {
        const totals = {
            bill_number: 'Total',
            bill_reference: '',
            bill_type: '',
            bill_date: '',
            debit: 0,
            credit: 0,
            balance: 0
        };

        // console.log(totals);
        setPinnedBottomRowData([totals]);
    };

    const handleChange = (name: string, value: any, required: boolean) => {
        // console.log(name, value);
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleGenerate = () => {
        if (!formData.vendor_id) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please select a vendor'
            });
            return;
        }
        dispatch(getVendorStatementReport(formData));
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
        dispatch(setPageTitle('Vendor Account'));
        setAuthToken(token);
        dispatch(clearVendorState());
        dispatch(clearReportState());
        dispatch(getVendors());
        handleReset();
    }, []);

    useEffect(() => {
        if (allVendors) {
            setVendorOptions(allVendors.map((item: any) => ({
                value: item.id,
                label: item.name + ' (' + item.vendor_number + ')'
            })));
        }
    }, [allVendors]);

    useEffect(() => {
        if (vendorStatement) {
            setReportData(vendorStatement);
        }
    }, [vendorStatement]);

    useEffect(() => {
        if (reportData.length > 0) {
            calculateTotals();
        }
    }, [reportData]);

    useEffect(() => {
        console.log(formData);
    }, [formData]);

    return (
        <div>
            <div className="flex md:justify-end md:items-center" style={{ marginTop: -22 }}>
                <div className="badge bg-success text-white text-xs font-semibold px-2 py-1 rounded-full">
                    {user.registered_company ? user.registered_company.name : 'All Companies'} - {user.registered_branch ? user.registered_branch.name : 'All Branches'}
                </div>
            </div>
            <div className="flex flex-col gap-3">
                <div className="panel">
                    <div className="flex flex-col md:justify-between md:items-center gap-3">
                        <div className="border-b w-full">
                            <h2 className="text-lg font-semibold text-center">Vendor Statement Report</h2>
                        </div>
                        <div className="flex flex-col md:flex-row md:items-end justify-start gap-2 w-full">
                            <Dropdown
                                divClasses="w-full"
                                label="Vendor"
                                name="vendor_id"
                                value={formData.vendor_id}
                                options={vendorOptions}
                                isMulti={false}
                                onChange={(e: any) => {
                                    if (e && typeof e !== 'undefined') {
                                        // console.log(e);
                                        handleChange('vendor_id', e.value, false);
                                    } else {
                                        handleChange('vendor_id', '', false);
                                    }
                                }}
                                hint="None will consider all"
                            />
                            <Input
                                divClasses="w-full"
                                label="From Date"
                                type="date"
                                name="from_date"
                                value={formData.from_date}
                                onChange={(e) => handleChange('from_date', e[0] ? e[0].toLocaleDateString() : '', true)}
                                placeholder="Enter Filling Date"
                                isMasked={false}
                            />
                            <Input
                                divClasses="w-full"
                                label="To Date"
                                type="date"
                                name="to_date"
                                value={formData.to_date}
                                onChange={(e) => handleChange('to_date', e[0] ? e[0].toLocaleDateString() : '', true)}
                                placeholder="Enter Filling Date"
                                isMasked={false}
                            />
                            <Button
                                type={ButtonType.button}
                                text={<RefreshCwIcon size={18} />}
                                variant={ButtonVariant.primary}
                                onClick={() => handleGenerate()}
                            />
                            <Button
                                type={ButtonType.button}
                                text={<CloseIcon size={'18'} />}
                                variant={ButtonVariant.info}
                                onClick={() => handleReset()}
                            />
                            <Button
                                type={ButtonType.button}
                                text={<FileSpreadsheetIcon size={18} />}
                                variant={ButtonVariant.success}
                                onClick={() => handleExport()}
                            />
                            <Button
                                type={ButtonType.button}
                                text={<PrinterIcon size={18} />}
                                variant={ButtonVariant.secondary}
                                onClick={() => handleExport()}
                            />
                        </div>

                    </div>
                </div>
                {reportData.length > 0 ? (
                    <div className="panel">
                        <AgGridComponent
                            gridRef={gridRef}
                            data={reportData}
                            colDefs={colDefs}
                            pinnedBottomRowData={pinnedBottomRowData}
                        />
                        <div className="flex flex-col md:items-end md:justify-end mt-5 text-lg font-bold">
                            <div className="grid grid-cols-2 gap-5">
                                <div>Balance Total</div>
                                {/*<div>{reportData.reduce((acc, item)=> acc + item.}</div>*/}
                            </div>
                            <div className="grid grid-cols-2 gap-5">
                                <div>PDC Amount</div>
                                <div>170,987.92</div>
                            </div>
                            <div className="grid grid-cols-2 gap-5">
                                <div>Net Balance</div>
                                <div>170,987.92</div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="panel">
                        <div className="flex justify-center items-center h-32">
                            <p className="text-lg font-semibold">No data found</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// Index.getLayout = (page: any) => <AppLayout>{page}</AppLayout>;
export default Index;
