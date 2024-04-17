import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {setPageTitle} from '@/store/slices/themeConfigSlice';
import Breadcrumb from "@/components/Breadcrumb";
import {ThunkDispatch} from "redux-thunk";
import {AppDispatch, IRootState, useAppSelector} from "@/store";
import {AnyAction} from "redux";
import {setAuthToken, setContentType} from "@/configs/api.config";
import GenericTable from "@/components/GenericTable";
import 'tippy.js/dist/tippy.css';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import {clearReportState, getStockReport} from "@/store/slices/reportSlice";
import {RootState} from "@reduxjs/toolkit/query";

const StockReport = () => {
    const dispatch = useDispatch<AppDispatch>();
    const {token} = useAppSelector((state:IRootState) => state.user);
    const {stock, loading, success} = useSelector((state:IRootState) => state.report);
    const [rowData, setRowData] = useState([]);

    useEffect(() => {
        dispatch(setPageTitle('Stock Report'));
        setAuthToken(token)
        setContentType('application/json')
        dispatch(clearReportState())
        dispatch(getStockReport())
    }, []);

    useEffect(() => {
        if (stock) {
            setRowData(stock)
        }
    }, [stock]);

    const colName = ['id', 'product', 'main_uom', 'sub_uom', 'total_purchases', 'available_stock', 'used_stock'];
    const header = ['ID', 'Product', 'Main UOM', 'Sub UOM', 'Total Purchases', 'Available Stock', 'Used Stock'];

    return (
        <div>
            <Breadcrumb items={[
                {
                    title: 'Main Dashboard',
                    href: '/main',
                },
                {
                    title: 'Report Dashboard',
                    href: '/report',
                },
                {
                    title: 'Stock Report',
                    href: '#',
                },
            ]}/>

            <div className="pt-5">
                <div className="panel">
                    <div className="mb-5 flex items-center justify-between">
                        <h5 className="text-lg font-semibold dark:text-white-light">Stock Report</h5>
                    </div>
                    {/*<div className="flex justify-between items-center flex-col md:flex-row gap-4">*/}
                    {/*    <div className="w-full">*/}
                    {/*        <label htmlFor="from_date">From</label>*/}
                    {/*        <Flatpickr*/}
                    {/*            value={fromDate}*/}
                    {/*            placeholder={'Select Date'}*/}
                    {/*            options={{*/}
                    {/*                dateFormat: 'Y-m-d'*/}
                    {/*            }}*/}
                    {/*            className="form-input"*/}
                    {/*            onChange={(date) => setFromDate(date[0].toLocaleDateString())}*/}
                    {/*        />*/}
                    {/*    </div>*/}
                    {/*    <div className="w-full">*/}
                    {/*        <label htmlFor="to_date">To</label>*/}
                    {/*        <Flatpickr*/}
                    {/*            value={toDate}*/}
                    {/*            placeholder={'Select Date'}*/}
                    {/*            options={{*/}
                    {/*                dateFormat: 'Y-m-d'*/}
                    {/*            }}*/}
                    {/*            className="form-input"*/}
                    {/*            onChange={(date) => setToDate(date[0].toLocaleDateString())}*/}
                    {/*        />*/}
                    {/*    </div>*/}
                    {/*    <div className="w-full flex justify-end flex-col md:flex-row gap-1 mt-5">*/}
                    {/*        <button className="btn btn-primary" onClick={() => getReport()}>*/}
                    {/*            Generate Report*/}
                    {/*        </button>*/}
                    {/*        <button className="btn btn-info" onClick={() => resetForm()}>*/}
                    {/*            Clear*/}
                    {/*        </button>*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                    <GenericTable
                        colName={colName}
                        header={header}
                        rowData={rowData}
                        loading={loading}
                        exportTitle={'stock-report-' + Date.now()}
                        columns={[
                            {accessor: 'product', title: 'Product', sortable: true},
                            {accessor: 'main_uom', title: 'Main UOM', sortable: true},
                            {accessor: 'sub_uom', title: 'Sub UOM', sortable: true},
                            {accessor: 'total_purchases', title: 'Total Purchased', sortable: true},
                            {accessor: 'available_stock', title: 'Available Stock', sortable: true},
                            {accessor: 'used_stock', title: 'Used Stock', sortable: true},
                        ]}
                    />
                </div>
            </div>
        </div>
    );
};

export default StockReport;
