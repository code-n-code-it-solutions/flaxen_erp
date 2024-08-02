import React, { useEffect, useRef, useState } from 'react';
import AppLayout from '@/components/Layouts/AppLayout';
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
import { capitalize } from 'lodash';
import Swal from 'sweetalert2';
import Button from '@/components/Button';
import AgGridComponent from '@/components/apps/AgGridComponent';
import { Input } from '@/components/form/Input';

const Index = () => {
    useSetActiveMenu(AppBasePath.General_Journal);
    const router = useRouter();
    const dispatch = useAppDispatch();

    const { token, user, loading } = useAppSelector((state) => state.user);
    const { generalJournal } = useAppSelector((state) => state.account);
    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const [formData, setFormData] = useState<any>({});
    const [reportData, setReportData] = useState<any[]>([]);
    const [pinnedBottomRowData, setPinnedBottomRowData] = useState<any[]>([]);
    const gridRef = useRef<AgGridReact<any>>(null);
    const [colDefs, setColDefs] = useState<any>([
        {
            headerName: 'Date',
            valueGetter: (row: any) => new Date(row.data.created_at).toLocaleDateString(),
            minWidth: 150,
            filter: false,
            floatingFilter: false
        },
        {
            headerName: 'Document No',
            field: 'document_no',
            minWidth: 150,
            filter: false,
            floatingFilter: false
        },
        {
            headerName: 'Source',
            field: 'source',
            minWidth: 150,
            filter: false,
            floatingFilter: false
        },
        {
            headerName: 'Narration',
            field: 'description',
            minWidth: 150,
            filter: false,
            floatingFilter: false
        },
        {
            headerName: 'Account Name',
            field: 'account_name',
            minWidth: 150,
            filter: false,
            floatingFilter: false
        },
        {
            headerName: 'Debit',
            field: 'debit',
            minWidth: 150,
            filter: false,
            floatingFilter: false,
            aggFunc: 'sum'
        },
        {
            headerName: 'Credit',
            field: 'credit',
            minWidth: 150,
            filter: false,
            floatingFilter: false,
            aggFunc: 'sum'
        },
    ]);

    const calculateTotals = () => {
        const total: any = {
            item_code: 'Total',
            title: '',
            product_type: '',
            sub_unit: '',
            valuation_method: '',
            stock: {
                opening_stock: 0,
                purchase_stock: 0,
                used_stock: 0,
                available_stock: 0
            },
            costing: {
                total_valuated_opening_stock_price: 0,
                total_valuated_selling_price: 0
            }
        };
        console.log(reportData);

        reportData.forEach((item: any) => {
            total.stock.opening_stock += item.stock.opening_stock;
            total.stock.purchase_stock += item.stock.purchase_stock;
            total.stock.sale_stock += item.stock.sale_stock;
            total.stock.available_stock += item.stock.available_stock;
            total.stock.used_stock += item.stock.used_stock;

            total.costing.opening_stock_cost += parseFloat(item.costing.opening_stock_cost);
            total.costing.total_valuated_opening_stock_price += parseFloat(item.costing.total_valuated_opening_stock_price);
            total.costing.selling_price += parseFloat(item.costing.selling_price);
            total.costing.total_valuated_selling_price += parseFloat(item.costing.total_valuated_selling_price);

            total.cost_price += item.stock.available_stock * item.costing.valuated_opening_stock_price;
            total.sale_price += item.stock.available_stock * item.costing.valuated_selling_price;
        });


        // console.log(reportData.reduce((acc:number, item:any)=>acc+item.costing.valuated_opening_stock_price, 0));
        setPinnedBottomRowData([total]);
    };


    const handleChange = (name: string, value: any, required: boolean) => {
        // console.log(name, value);
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
        if(generalJournal) {
            setReportData(generalJournal)
        }
    }, [generalJournal]);

    return (
        <div className="flex flex-col gap-5">
            <PageHeader
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
                    export: () => console.log('exported'),
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
                            onChange={(e) => handleChange('from_date', e[0] ? e[0].toLocaleDateString() : '', true)}
                            placeholder="Enter Start Date"
                            isMasked={false}
                        />
                        <Input
                            divClasses="w-full"
                            label="To Date"
                            type="date"
                            name="to_date"
                            value={formData.to_date}
                            onChange={(e) => handleChange('to_date', e[0] ? e[0].toLocaleDateString() : '', true)}
                            placeholder="Enter To Date"
                            isMasked={false}
                        />
                        <Button
                            type={ButtonType.button}
                            text="Generate"
                            variant={ButtonVariant.primary}
                            onClick={() => handleGenerate()}
                        />
                        <Button
                            type={ButtonType.button}
                            text="Reset"
                            variant={ButtonVariant.info}
                            onClick={() => handleReset()}
                        />
                        <Button
                            type={ButtonType.button}
                            text="Export"
                            variant={ButtonVariant.success}
                            onClick={() => handleExport()}
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
                        pinnedBottomRowData={pinnedBottomRowData}
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

Index.getLayout = (page: any) => <AppLayout>{page}</AppLayout>;
export default Index;
