import React, {useEffect, useState} from 'react';
import Swal from 'sweetalert2';
import {useDispatch, useSelector} from 'react-redux';
import {setPageTitle} from '@/store/slices/themeConfigSlice';
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import {ThunkDispatch} from "redux-thunk";
import {IRootState} from "@/store";
import {AnyAction} from "redux";
import {setAuthToken, setContentType} from "@/configs/api.config";
import GenericTable from "@/components/GenericTable";
import Image from "next/image";
import {BASE_URL} from "@/configs/server.config";
import ReactDOMServer from 'react-dom/server';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import Preview from "@/pages/purchase/good-receive-note/preview";
import {deleteVendorBill, getVendorBills} from "@/store/slices/vendorBillSlice";
import Select from "react-select";
import {getRepresentatives, getVendors} from "@/store/slices/vendorSlice";
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import {clearReportState, getVendorReport} from "@/store/slices/reportSlice";

const VendorReport = () => {
    const dispatch = useDispatch<ThunkDispatch<IRootState, any, AnyAction>>();
    const {token} = useSelector((state: IRootState) => state.user);
    const {vendor, loading, success} = useSelector((state: IRootState) => state.report);
    const [loadingReport, setLoadingReport] = useState(false);
    const [vendorId, setVendorID] = useState('all');
    const [vendorRepresentativeId, setVendorRepresentativeID] = useState('all');
    const [fromDate, setFromDate] = useState<string>('');
    const [toDate, setToDate] = useState<string>('');
    const [showReport, setShowReport] = useState(false);
    const [vendorOptions, setVendorOptions] = useState<any[]>([])
    const [vendorRepresentativeOptions, setVendorRepresentativeOptions] = useState<any[]>([])
    const {allVendors, representatives} = useSelector((state: IRootState) => state.vendor);

    useEffect(() => {
        dispatch(setPageTitle('Vendor Report'));
    });
    const [rowData, setRowData] = useState([]);

    const getReport = () => {
        setAuthToken(token)
        setContentType('application/json')
        setShowReport(true)
        console.log(vendorId, vendorRepresentativeId, fromDate, toDate)
        dispatch(getVendorReport({
            vendor_id: vendorId,
            vendor_representative_id: vendorRepresentativeId,
            from_date: fromDate,
            to_date: toDate
        }))
    }

    const resetForm = () => {
        setVendorID('all')
        setVendorRepresentativeID('all')
        setFromDate('')
        setToDate('')
        setShowReport(false)
        dispatch(getVendors())
        setVendorRepresentativeOptions([{value: 'all', label: 'All'}])
        dispatch(clearReportState())
    }

    const handleVendorChange = (e: any) => {
        if (e && typeof e !== 'undefined') {
            setVendorID(e.value)
            setVendorRepresentativeOptions([{value: 'all', label: 'All'}])
            dispatch(getRepresentatives(e.value))
        } else {
            setVendorRepresentativeOptions([{value: 'all', label: 'All'}])
        }
    }

    useEffect(() => {
        dispatch(getVendors())
        setShowReport(false)
        dispatch(clearReportState())
    }, []);

    useEffect(() => {
        if (vendor) {
            setRowData(vendor)
        }
    }, [vendor]);

    useEffect(() => {
        if (allVendors) {
            setVendorOptions([
                {
                    value: 'all',
                    label: 'All'
                },
                ...allVendors.map((vendor: any) => ({
                    value: vendor.id,
                    label: vendor.name,
                    vendor: vendor
                }))
            ])
        }
    }, [allVendors])

    useEffect(() => {
        if (representatives) {
            setVendorRepresentativeOptions([
                {
                    value: 'all',
                    label: 'All'
                },
                ...representatives.map((representative: any) => ({
                    value: representative.id,
                    label: representative.name,
                    representative: representative
                }))
            ])
        }
    }, [representatives])

    const colName = ['id', 'good_receive_note.local_purchase_order.vendor.name', 'good_receive_note.local_purchase_order.vendor.phone', 'good_receive_note.local_purchase_order.vendor.email', 'bill_number', 'bill_amount', 'paid_amount', 'balance'];
    const header = ['ID', 'Vendor', 'Phone', 'Email', 'Bill Number', 'Bill Amount', 'Paid Amount', 'Balance'];

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
                    title: 'Vendor Report',
                    href: '#',
                },
            ]}/>

            <div className="pt-5">
                <div className="panel">
                    <div className="mb-5 flex items-center justify-between">
                        <h5 className="text-lg font-semibold dark:text-white-light">Vendor Report</h5>
                    </div>
                    <div className="flex justify-between items-center flex-col md:flex-row gap-4">
                        <div className="w-full">
                            <label htmlFor="vendor_id">Vendors</label>
                            <Select
                                defaultValue={vendorOptions[0]}
                                options={vendorOptions}
                                isSearchable={true}
                                isClearable={true}
                                placeholder={'Select Vendor'}
                                onChange={(e: any) => handleVendorChange(e)}
                            />
                        </div>
                        <div className="w-full">
                            <label htmlFor="vendor_representatative_id">Vendor Representative</label>
                            <Select
                                defaultValue={vendorRepresentativeOptions[0]}
                                options={vendorRepresentativeOptions}
                                isSearchable={true}
                                isClearable={true}
                                placeholder={'Select Representative'}
                                onChange={(e: any) => setVendorRepresentativeID(e.value)}
                            />
                        </div>
                        <div className="w-full">
                            <label htmlFor="from_date">From</label>
                            <Flatpickr
                                value={fromDate}
                                placeholder={'Select Date'}
                                options={{
                                    dateFormat: 'Y-m-d'
                                }}
                                className="form-input"
                                onChange={(date) => setFromDate(date[0].toLocaleDateString())}
                            />
                        </div>
                        <div className="w-full">
                            <label htmlFor="to_date">To</label>
                            <Flatpickr
                                value={toDate}
                                placeholder={'Select Date'}
                                options={{
                                    dateFormat: 'Y-m-d'
                                }}
                                className="form-input"
                                onChange={(date) => setToDate(date[0].toLocaleDateString())}
                            />
                        </div>
                        <div className="w-full flex justify-end flex-col md:flex-row gap-1 mt-5">
                            <button className="btn btn-primary" onClick={() => getReport()}>
                                Generate Report
                            </button>
                            <button className="btn btn-info" onClick={() => resetForm()}>
                                Clear
                            </button>
                        </div>
                    </div>
                    <div className="my-5" hidden={!showReport}>
                        <GenericTable
                            colName={colName}
                            header={header}
                            rowData={rowData}
                            loading={loading}
                            exportTitle={'vendor-report-' + Date.now()}
                            columns={[
                                {accessor: 'good_receive_note.local_purchase_order.vendor.name', title: 'Vendor', sortable: true},
                                {accessor: 'good_receive_note.local_purchase_order.vendor.phone', title: 'Phone', sortable: true},
                                {accessor: 'good_receive_note.local_purchase_order.vendor.email', title: 'Email', sortable: true},
                                {accessor: 'bill_number', title: 'Bill Number', sortable: true},
                                {accessor: 'bill_amount', title: 'Bill Amount', sortable: true},
                                {accessor: 'paid_amount', title: 'Paid Amount', sortable: true},
                                {accessor: 'balance', title: 'Balance', sortable: true},
                            ]}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VendorReport;
