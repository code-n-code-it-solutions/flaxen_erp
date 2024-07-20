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
import DisabledClickRenderer from '@/components/apps/DisabledClickRenderer';
import { capitalize } from 'lodash';
import AgGridComponent from '@/components/apps/AgGridComponent';
import { checkPermission } from '@/utils/helper';
import { clearRawProductState, getRawProducts } from '@/store/slices/rawProductSlice';
import { clearReportState, getRawProductReport } from '@/store/slices/reportSlice';
import Swal from 'sweetalert2';

const Index = () => {
    useSetActiveMenu(AppBasePath.Raw_Material_Stock);
    const dispatch = useAppDispatch();
    // const { data, isLoading, isError } = useQuery('raw-materials', () => getRawMaterials(dispatch))
    const { user, token } = useAppSelector(state => state.user);
    const { allRawProducts } = useAppSelector(state => state.rawProduct);
    const { rawProductStock } = useAppSelector(state => state.report);
    const [formData, setFormData] = useState<any>({});
    const [rawProductOptions, setRawProductOptions] = useState<any[]>([]);
    const [valuationMethodOptions, setValuationMethodOptions] = useState([
        { value: 'LIFO', label: 'LIFO' },
        { value: 'FIFO', label: 'FIFO' },
        { value: 'Average', label: 'Average' }
    ]);

    const [productTypeOptions, setProductTypeOptions] = useState([
        { value: 'raw-material', label: 'Raw Material' },
        { value: 'filling-material', label: 'Filling Material' },
        { value: 'packing-material', label: 'Packing Material' }
    ]);

    const [reportData, setReportData] = useState<any[]>([]);
    const [pinnedBottomRowData, setPinnedBottomRowData] = useState<any[]>([]);
    const gridRef = useRef<AgGridReact<any>>(null);
    const [colDefs, setColDefs] = useState<any>([
        {
            headerName: 'Item Code',
            field: 'item_code',
            minWidth: 150,
            filter: false,
            floatingFilter: false
        },
        {
            headerName: 'Title',
            field: 'title',
            minWidth: 150,
            filter: false,
            floatingFilter: false
        },
        {
            headerName: 'Product Type',
            field: 'product_type',
            cellRenderer: (row: any) => {
                // console.log(row.data);
                return (
                    capitalize(row.data.product_type)
                );
            },
            minWidth: 150,
            filter: false,
            floatingFilter: false
        },
        {
            headerName: 'Unit',
            field: 'sub_unit',
            minWidth: 150,
            filter: false,
            floatingFilter: false
        },
        {
            headerName: 'Valuation Method',
            field: 'valuation_method',
            minWidth: 150,
            filter: false,
            floatingFilter: false
        },
        {
            headerName: 'Opening Stock',
            field: 'stock.opening_stock',
            minWidth: 150,
            filter: false,
            floatingFilter: false,
            aggFunc: 'sum'
        },
        {
            headerName: 'Purchased Stock',
            field: 'stock.purchase_stock',
            minWidth: 150,
            filter: false,
            floatingFilter: false,
            aggFunc: 'sum'
        },
        {
            headerName: 'Used Stock',
            field: 'stock.used_stock',
            minWidth: 150,
            filter: false,
            floatingFilter: false,
            aggFunc: 'sum'
        },
        {
            headerName: 'On Hand',
            // field: 'stock.available_stock',
            valueGetter: (row: any) => (parseFloat(row.data.stock.available_stock) + parseFloat(row.data.stock.purchase_stock)).toFixed(2),
            minWidth: 150,
            filter: false,
            floatingFilter: false,
            aggFunc: 'sum'
        },
        {
            headerName: 'Cost Price',
            minWidth: 150,
            valueGetter: (row: any) => row.data.costing.total_valuated_opening_stock_price.toFixed(2),
            // valueGetter: (row: any) => ((row.data.stock.available_stock+row.data.stock.purchase_stock) * row.data.costing.valuated_opening_stock_price).toFixed(2),
            filter: false,
            floatingFilter: false,
            aggFunc: 'sum'
        },
        {
            headerName: 'Sale Price',
            minWidth: 150,
            // valueGetter: (row: any) => (row.data.costing.valuated_selling_price * (row.data.stock.available_stock+row.data.stock.purchase_stock)).toFixed(2),
            valueGetter: (row: any) => row.data.costing.total_valuated_selling_price.toFixed(2),
            filter: false,
            floatingFilter: false,
            aggFunc: 'sum'
        }
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
        dispatch(getRawProductReport(formData));
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
        dispatch(setPageTitle('Raw Materials Stock'));
        setAuthToken(token);
        dispatch(clearRawProductState());
        dispatch(clearReportState());
        dispatch(getRawProducts([]));
        handleReset();
    }, []);

    useEffect(() => {
        if (allRawProducts) {
            setRawProductOptions(allRawProducts.map((item: any) => ({
                value: item.id,
                label: item.title + ' (' + item.item_code + ')'
            })));
        }
    }, [allRawProducts]);

    useEffect(() => {
        if (rawProductStock) {
            setReportData(rawProductStock);
        }
    }, [rawProductStock]);

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
                            <h2 className="text-lg font-semibold text-center">Raw Materials Stock</h2>
                        </div>
                        <div className="flex flex-col md:flex-row md:items-end justify-start gap-2 w-full">
                            <Dropdown
                                divClasses="w-full"
                                label="Product Type"
                                name="product_type"
                                value={formData.product_type}
                                options={productTypeOptions}
                                isMulti={false}
                                onChange={(e: any) => {
                                    if (e && typeof e !== 'undefined') {
                                        console.log(e);
                                        handleChange('product_type', e.value, false);
                                    } else {
                                        handleChange('product_type', '', false);
                                    }
                                }}
                                hint="None will consider all"
                            />
                            <Dropdown
                                divClasses="w-full"
                                label="Valuations"
                                name="valuation_method"
                                value={formData.valuation_method}
                                options={valuationMethodOptions}
                                isMulti={false}
                                onChange={(e: any) => {
                                    if (e && typeof e !== 'undefined') {
                                        handleChange('valuation_method', e.value, false);
                                    } else {
                                        handleChange('valuation_method', '', false);
                                    }
                                }}
                                hint="None will consider all"
                            />
                            <Dropdown
                                divClasses="w-full"
                                label="Materials"
                                name="raw_product_id"
                                value={formData.raw_product_id}
                                options={rawProductOptions}
                                isMulti={false}
                                onChange={(e: any) => {
                                    if (e && typeof e !== 'undefined') {
                                        handleChange('raw_product_id', e.value, false);
                                    } else {
                                        handleChange('raw_product_id', '', false);
                                    }
                                }}
                                hint="None will consider all"
                            />
                            <Dropdown
                                divClasses="w-full"
                                label="Stock Options"
                                name="stock_option"
                                value={formData.stock_option}
                                options={[
                                    { label: 'In Stock', value: 'in_stock' },
                                    { label: 'Out of Stock', value: 'out_of_stock' }
                                ]}
                                isMulti={false}
                                onChange={(e: any) => {
                                    if (e && typeof e !== 'undefined') {
                                        handleChange('stock_option', e.value, false);
                                    } else {
                                        handleChange('stock_option', '', false);
                                    }
                                }}
                                hint="None will consider all"
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
                </div>
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
        </div>
    );
};

Index.getLayout = (page: any) => <AppLayout>{page}</AppLayout>;
export default Index;
