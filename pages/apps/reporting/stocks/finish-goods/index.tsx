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
import { getProductAssemblies } from '@/store/slices/productAssemblySlice';
import { getProductionByProductionAssembly, getProductions } from '@/store/slices/productionSlice';
import Swal from 'sweetalert2';
import { Input } from '@/components/form/Input';
import { getFinishGoodsReport } from '@/store/slices/reportSlice';

const Index = () => {
    useSetActiveMenu(AppBasePath.Finish_Good_Stock);
    const dispatch = useAppDispatch();
    // const { data, isLoading, isError } = useQuery('raw-materials', () => getRawMaterials(dispatch))
    const { user, token } = useAppSelector(state => state.user);
    const { finishGoodStock } = useAppSelector(state => state.report);
    const { allRawProducts } = useAppSelector(state => state.rawProduct);
    const { allProductAssemblies } = useAppSelector(state => state.productAssembly);
    const { allProductions } = useAppSelector(state => state.production);
    const { fillings } = useAppSelector(state => state.filling);
    const [formData, setFormData] = useState<any>({});
    const [showDates, setShowDates] = useState<boolean>(false);
    const [rawProductOptions, setRawProductOptions] = useState<any[]>([]);
    const [productionOptions, setProductionOptions] = useState<any[]>([]);
    const [productAssemblyOptions, setProductAssemblyOptions] = useState<any[]>([]);
    const [reportTypeOptions, setReportTypeOptions] = useState([
        { value: 'production', label: 'Production' },
        { value: 'filling', label: 'Fillings' }
    ]);

    const [productTypeOptions, setProductTypeOptions] = useState([
        { value: 'raw-material', label: 'Raw Material' },
        { value: 'filling-material', label: 'Filling Material' },
        { value: 'packing-material', label: 'Packing Material' }
    ]);

    const [reportData, setReportData] = useState<any[]>([]);
    const [pinnedBottomRowData, setPinnedBottomRowData] = useState<any[]>([]);
    const gridRef = useRef<AgGridReact<any>>(null);
    // const [colDefs, setColDefs] = useState<any>([
    //     {
    //         headerName: 'Product Code',
    //         field: 'filling_code',
    //         minWidth: 150,
    //         filter: false,
    //         floatingFilter: false
    //     },
    //     {
    //         headerName: 'Product',
    //         field: 'product_assembly',
    //         minWidth: 150,
    //         filter: false,
    //         floatingFilter: false
    //     },
    //     {
    //         headerName: 'Manufactured Quantity',
    //         field: 'manufactured_quantity',
    //         minWidth: 150,
    //         filter: false,
    //         floatingFilter: false
    //     },
    //     {
    //         headerName: 'Sold Quantity',
    //         field: 'sold_quantity',
    //         minWidth: 150,
    //         filter: false,
    //         floatingFilter: false
    //     },
    //     {
    //         headerName: 'Remaining Quantity',
    //         field: 'remaining_quantity',
    //         minWidth: 150,
    //         filter: false,
    //         floatingFilter: false
    //     },
    //     {
    //         headerName: 'Cost of Finished Goods',
    //         field: 'cost_of_finish_goods',
    //         minWidth: 150,
    //         filter: false,
    //         floatingFilter: false
    //     },
    //     {
    //         headerName: 'Sale Price',
    //         field: 'sale_price',
    //         minWidth: 150,
    //         filter: false,
    //         floatingFilter: false
    //     },
    //     {
    //         headerName: 'Profit',
    //         field: 'profit',
    //         minWidth: 150,
    //         filter: false,
    //         floatingFilter: false
    //     }
    // ]);

    const getColDefs = () => {
        let cols: any[] = [];

        if(formData.report_type === 'production') {
            cols = [
                {
                    headerName: 'Product',
                    field: 'product_assembly',
                    minWidth: 150,
                    filter: false,
                    floatingFilter: false
                },
            ];
        } else if(formData.report_type === 'filling') {
            cols = [
                {
                    headerName: 'Product',
                    field: 'product_assembly',
                    minWidth: 150,
                    filter: false,
                    floatingFilter: false
                },
                {
                    headerName: 'Filling Product',
                    valueGetter: (params: any) => params.data.product_title + ' (' + params.data.product_code + ')',
                    minWidth: 150,
                    filter: false,
                    floatingFilter: false
                },

            ];
        }
        cols = [
            ...cols,
            {
                headerName: formData.report_type === 'production' ? 'Produced' : 'Filled',
                field: 'totalProduced',
                minWidth: 150,
                filter: false,
                floatingFilter: false
            },
            {
                headerName: formData.report_type === 'production' ? 'Produced' : 'Sold',
                field: 'totalSold',
                minWidth: 150,
                filter: false,
                floatingFilter: false
            },
            {
                headerName: formData.report_type === 'production' ? 'Remaining' : 'In Hand',
                field: 'finalStock',
                minWidth: 150,
                filter: false,
                floatingFilter: false
            }
        ]

        return cols;
    }

    const calculateTotals = () => {
        const totals = {
            product_assembly_id: '',
            product_assembly: 'Total',
            product_title: '',
            product_code: '',
            batch_numbers: [],
            totalProduced: 0,
            totalSold: 0,
            finalStock: 0
        };

        reportData.forEach(item => {
            totals.totalProduced += item.totalProduced;
            totals.totalSold += item.totalSold;
            totals.finalStock += item.finalStock;
        });

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
        if (!formData.report_type) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Select report type first'
            });
        } else {
            dispatch(getFinishGoodsReport(formData))
            console.log(formData);
        }

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
        dispatch(setPageTitle('Finish Goods Stock'));
        setAuthToken(token);
        dispatch(clearRawProductState());
        dispatch(getRawProducts(['filling-material']));
        dispatch(getProductAssemblies());
        setShowDates(false);
        // dispatch(getProductions());
    }, []);

    useEffect(() => {
        if (allProductAssemblies) {
            setProductAssemblyOptions(allProductAssemblies.map((assembly: any) => ({
                value: assembly.id,
                label: assembly.formula_name + ' (' + assembly.color_code.name + ')'
            })));
        }
    }, [allProductAssemblies]);

    useEffect(() => {
        if (allProductions) {
            setProductionOptions(allProductions.map((production: any) => ({
                value: production.id,
                label: production.batch_number
            })));
        }
    }, [allProductions]);

    useEffect(() => {
        if (allRawProducts) {
            setRawProductOptions(allRawProducts.map((rawProduct: any) => ({
                value: rawProduct.id,
                label: rawProduct.item_code + ' - ' + rawProduct.title
            })));
        }
    }, [allRawProducts]);

    useEffect(() => {
        if (finishGoodStock) {
            setReportData(finishGoodStock);
        }
    }, [finishGoodStock]);

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
                            <h2 className="text-lg font-semibold text-center">Finish Goods Stock</h2>
                        </div>
                        <div className="flex flex-col md:flex-row md:items-end justify-start gap-2 w-full">
                            <Dropdown
                                divClasses="w-full"
                                label="Product"
                                name="product_assembly_id"
                                value={formData.product_assembly_id}
                                options={productAssemblyOptions}
                                isMulti={false}
                                onChange={(e: any) => {
                                    if (e && typeof e !== 'undefined') {
                                        // console.log(e);
                                        if (formData.report_type && formData.report_type === 'production') {
                                            dispatch(getProductionByProductionAssembly(e.value));
                                        }
                                        handleChange('product_assembly_id', e.value, false);
                                    } else {
                                        dispatch(getProductions());
                                        handleChange('product_assembly_id', '', false);
                                    }
                                }}
                                hint="None will consider all"
                            />

                            <Dropdown
                                divClasses="w-full"
                                label="Report Type"
                                name="report_type"
                                value={formData.report_type}
                                options={reportTypeOptions}
                                isMulti={false}
                                onChange={(e: any) => {
                                    handleReset()
                                    if (e && typeof e !== 'undefined') {
                                        if (e.value === 'production') {
                                            if (formData.product_assembly_id) {
                                                dispatch(getProductionByProductionAssembly(formData.product_assembly_id));
                                            } else {
                                                dispatch(getProductions());
                                            }
                                        }
                                        handleChange('report_type', e.value, false);
                                    } else {
                                        handleChange('report_type', '', false);
                                    }
                                }}
                                hint="This is required"
                            />

                            {formData.report_type === 'production'
                                ? (
                                    <>
                                        <Dropdown
                                            divClasses="w-full"
                                            label="Batch"
                                            name="production_id"
                                            value={formData.production_id}
                                            options={productionOptions}
                                            isMulti={false}
                                            onChange={(e: any) => {
                                                if (e && typeof e !== 'undefined') {
                                                    handleChange('production_id', e.value, false);
                                                } else {
                                                    handleChange('production_id', '', false);
                                                }
                                            }}
                                        />
                                    </>
                                ) : formData.report_type === 'filling'
                                    ? (
                                        <>
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
                                            />
                                        </>
                                    ) : (<></>)}

                            <Dropdown
                                divClasses="w-full"
                                label="Date Range"
                                name="date_range_in"
                                value={formData.date_range_in}
                                options={[
                                    { label: 'Manufacturing', value: 'manufacturing' },
                                    { label: 'Selling', value: 'selling' }
                                ]}
                                isMulti={false}
                                onChange={(e: any) => {
                                    if (e && typeof e !== 'undefined') {
                                        setShowDates(true);
                                        handleChange('date_range_in', e.value, false);
                                    } else {
                                        setShowDates(false);
                                        handleChange('date_range_in', '', false);
                                    }
                                }}
                            />
                            {showDates && (
                                <>
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
                                </>
                            )}
                            <Dropdown
                                divClasses="w-full"
                                label="Stock Option"
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
                            colDefs={getColDefs()}
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

// Index.getLayout = (page: any) => <AppLayout>{page}</AppLayout>;
export default Index;
