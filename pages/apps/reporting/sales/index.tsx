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
import Swal from 'sweetalert2';
import { Input } from '@/components/form/Input';
import { getCustomers } from '@/store/slices/customerSlice';
import { getEmployees } from '@/store/slices/employeeSlice';
import { getSaleInvoicesByCustomer } from '@/store/slices/saleInvoiceSlice';
import { getSalesReport } from '@/store/slices/reportSlice';
import DisabledClickRenderer from '@/components/apps/DisabledClickRenderer';

const Index = () => {
    useSetActiveMenu(AppBasePath.Sales_Reporting);
    const dispatch = useAppDispatch();
    // const { data, isLoading, isError } = useQuery('raw-materials', () => getRawMaterials(dispatch))
    const { user, token } = useAppSelector(state => state.user);
    const { saleInvoices } = useAppSelector(state => state.saleInvoice);
    const { salesReportData } = useAppSelector(state => state.report);
    const { employees } = useAppSelector(state => state.employee);
    const { customers } = useAppSelector(state => state.customer);
    const [formData, setFormData] = useState<any>({});
    const [saleInvoiceOptions, setSaleInvoiceOptions] = useState<any[]>([]);
    const [customerOptions, setCustomerOptions] = useState<any[]>([]);
    const [salesmanOptions, setSalesmanOptions] = useState<any[]>([]);
    const [reportTypeOptions, setReportTypeOptions] = useState([
        { value: 'sales', label: 'Sales' },
        { value: 'ledger', label: 'Ledger' }
    ]);
    const [reportData, setReportData] = useState<any[]>([]);
    const [pinnedBottomRowData, setPinnedBottomRowData] = useState<any[]>([]);
    const gridRef = useRef<AgGridReact<any>>(null);
    const [colDefs, setColDefs] = useState<any>();

    const calculateTotals = () => {
        const totals = {
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
                valuated_opening_stock_price: 0,
                valuated_selling_price: 0
            }
        };

        reportData.forEach(item => {
            totals.stock.opening_stock += item.stock.opening_stock;
            totals.stock.purchase_stock += item.stock.purchase_stock;
            totals.stock.used_stock += item.stock.used_stock;
            totals.stock.available_stock += item.stock.available_stock;
            totals.costing.valuated_opening_stock_price += item.costing.valuated_opening_stock_price;
            totals.costing.valuated_selling_price += item.costing.valuated_selling_price;
        });

        setPinnedBottomRowData([totals]);
    };

    const getColDef = () => {
        if (formData.report_type === 'ledger') {
            return [
                {
                    headerName: 'Payment Code',
                    field: 'payment_code',
                    minWidth: 150,
                    filter: false,
                    floatingFilter: false
                },
                {
                    headerName: 'Ref #',
                    field: 'reference_no',
                    minWidth: 150,
                    filter: false,
                    floatingFilter: false
                },
                {
                    headerName: 'Payment Method',
                    field: 'payment_method.name',
                    minWidth: 150,
                    filter: false,
                    floatingFilter: false
                },
                {
                    headerName: 'Date',
                    field: 'payment_date',
                    minWidth: 150,
                    filter: false,
                    floatingFilter: false
                },
                {
                    headerName: 'Payment Type',
                    field: 'payment_type',
                    minWidth: 150,
                    filter: false,
                    floatingFilter: false
                },
                {
                    headerName: 'Customer',
                    valueGetter: (params: any) => params.data.customer.name + ' (' + params.data.customer.customer_code + ')',
                    minWidth: 150,
                    filter: false,
                    floatingFilter: false
                },
                {
                    headerName: 'Discount',
                    valueGetter: (params: any) => params.data.discount_amount.toFixed(2),
                    minWidth: 150,
                    filter: false,
                    floatingFilter: false
                },
                {
                    headerName: 'Due',
                    valueGetter: (params: any) => {
                        const dueAmount = params.data.customer_payment_details
                            .flatMap((invoice: any) => invoice.due_amount)
                            .reduce((a: number, b: any) => a + parseFloat(b), 0);
                        return dueAmount.toFixed(2);
                    },
                    minWidth: 150,
                    filter: false,
                    floatingFilter: false
                },
                {
                    headerName: 'Received',
                    valueFormatter: (params: any) => {
                        const receivedAmount = params.data.customer_payment_details
                            .flatMap((invoice: any) => invoice.received_amount)
                            .reduce((a: number, b: any) => a + parseFloat(b), 0);
                        return receivedAmount.toFixed(2);
                    },
                    minWidth: 150,
                    filter: false,
                    floatingFilter: false
                }
            ];
        } else if (formData.report_type === 'sales') {
            return [];
        }
    };

    const handleChange = (name: string, value: any, required: boolean) => {
        // console.log(name, value);
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleGenerate = () => {
        dispatch(getSalesReport(formData));
        console.log(formData);
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
        dispatch(setPageTitle('Sales Reporting'));
        setAuthToken(token);
    }, []);

    useEffect(() => {
        if (customers) {
            setCustomerOptions(customers.map((customer: any) => ({
                value: customer.id,
                label: customer.name + ' (' + customer.customer_code + ')'
            })));
        }
    }, [customers]);

    useEffect(() => {
        if (employees) {
            setSalesmanOptions(employees.map((employee: any) => ({
                value: employee.id,
                label: employee.name + ' (' + employee.employee?.employee_code + ')'
            })));
        }
    }, [employees]);

    useEffect(() => {
        if (saleInvoices) {
            setSaleInvoiceOptions(saleInvoices.map((invoice: any) => ({
                value: invoice.id,
                label: invoice.sale_invoice_code
            })));
        }
    }, [saleInvoices]);

    useEffect(() => {
        if (salesReportData) {
            setReportData(salesReportData);
        }
    }, [salesReportData]);

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
                            <h2 className="text-lg font-semibold text-center">Sales Report</h2>
                        </div>
                        <div className="flex flex-col md:flex-row md:items-end  gap-2 w-full">
                            <Dropdown
                                divClasses="w-full"
                                label="Report For"
                                name="report_for"
                                value={formData.report_for}
                                options={[
                                    { value: 'customer', label: 'Customer' },
                                    { value: 'salesman', label: 'Salesman' }
                                ]}
                                isMulti={false}
                                onChange={(e: any) => {
                                    if (e && typeof e !== 'undefined') {
                                        if (e.value === 'customer') {
                                            dispatch(getCustomers());
                                        } else if (e.value === 'salesman') {
                                            dispatch(getEmployees());
                                        }
                                        handleChange('report_for', e.value, false);
                                    } else {
                                        handleChange('report_for', '', false);
                                    }
                                }}
                                hint="By default it will consider customer"
                            />

                            <Dropdown
                                divClasses="w-full"
                                label={formData.report_for === 'salesman' ? 'Salesman' : 'Customer'}
                                name={formData.report_for === 'salesman' ? 'salesman_id' : 'customer_id'}
                                value={formData.report_for === 'salesman' ? formData.salesman_id : formData.customer_id}
                                options={formData.report_for === 'salesman' ? salesmanOptions : customerOptions}
                                isMulti={false}
                                onChange={(e: any) => {
                                    if (e && typeof e !== 'undefined') {
                                        handleChange(formData.report_for === 'salesman' ? 'salesman_id' : 'customer_id', e.value, false);
                                    } else {
                                        handleChange(formData.report_for === 'salesman' ? 'salesman_id' : 'customer_id', '', false);
                                    }
                                }}
                                hint="Select either one, empty will be consider as customer"
                            />

                            <Dropdown
                                divClasses="w-full"
                                label="Report Type"
                                name="report_type"
                                value={formData.report_type}
                                options={reportTypeOptions}
                                isMulti={false}
                                onChange={(e: any) => {
                                    if (e && typeof e !== 'undefined') {
                                        if (e.value === 'ledger' && formData.report_for === 'customer') {
                                            dispatch(getSaleInvoicesByCustomer(formData.customer_id));
                                        }
                                        handleChange('report_type', e.value, false);
                                    } else {
                                        handleChange('report_type', '', false);
                                    }
                                }}
                            />

                            {formData.report_type === 'ledger' && formData.report_for === 'customer' ? (
                                <>
                                    <Dropdown
                                        divClasses="w-full"
                                        label="Invoice"
                                        name="sale_invoice_id"
                                        value={formData.sale_invoice_id}
                                        options={saleInvoiceOptions}
                                        isMulti={false}
                                        onChange={(e: any) => {
                                            if (e && typeof e !== 'undefined') {
                                                handleChange('sale_invoice_id', e.value, false);
                                            } else {
                                                handleChange('sale_invoice_id', '', false);
                                            }
                                        }}
                                    />
                                </>
                            ) : formData.report_type === 'sales' && (formData.report_for === 'customer' || formData.report_for === 'salesman')
                                ? (
                                    <>
                                        <Input
                                            divClasses="w-full"
                                            label="Sales From"
                                            type="date"
                                            name="from_date"
                                            value={formData.from_date}
                                            onChange={(e) => handleChange('from_date', e[0] ? e[0].toLocaleDateString() : '', true)}
                                            placeholder="Enter Sales From Date"
                                            isMasked={false}
                                        />
                                        <Input
                                            divClasses="w-full"
                                            label="Sales To"
                                            type="date"
                                            name="to_date"
                                            value={formData.to_date}
                                            onChange={(e) => handleChange('to_date', e[0] ? e[0].toLocaleDateString() : '', true)}
                                            placeholder="Enter Sales To Date"
                                            isMasked={false}
                                        />
                                    </>
                                ) : (<></>)}
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
                </div>
                {reportData.length > 0 ? (
                    <div>
                        <AgGridComponent
                            gridRef={gridRef}
                            data={reportData}
                            colDefs={getColDef() ?? []}
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
        </div>
    );
};

Index.getLayout = (page: any) => <AppLayout>{page}</AppLayout>;
export default Index;
