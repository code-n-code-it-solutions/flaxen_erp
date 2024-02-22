import React, {useEffect, useState} from 'react';
import {setAuthToken, setContentType} from "@/configs/api.config";
import {useDispatch, useSelector} from "react-redux";
import {ThunkDispatch} from "redux-thunk";
import {IRootState} from "@/store";
import {AnyAction} from "redux";
import Select from "react-select";
import 'react-quill/dist/quill.snow.css';
import dynamic from 'next/dynamic';

const ReactQuill = dynamic(import('react-quill'), {ssr: false});
import {
    clearPurchaseRequisitionState, getPurchaseRequisitionByStatuses,
    storePurchaseRequest
} from "@/store/slices/purchaseRequisitionSlice";
import PRRawProductModal from "@/components/PRRawProductModal";
import {clearVendorState, getRepresentatives, getVendors} from "@/store/slices/vendorSlice";
import Link from "next/link";
import {getCurrencies} from "@/store/slices/currencySlice";
import VehicleFormModal from "@/components/VehicleFormModal";
import {clearVehicleState, getVehicles, storeVehicle} from "@/store/slices/vehicleSlice";
import LPORawProductModal from "@/components/LPORawProductModal";
import Image from "next/image";
import {BASE_URL} from "@/configs/server.config";
import {getEmployees} from "@/store/slices/employeeSlice";
import {storeLPO} from "@/store/slices/localPurchaseOrderSlice";
import {clearUtilState, generateCode} from "@/store/slices/utilSlice";
import {FORM_CODE_TYPE} from "@/utils/enums";

interface IFormData {
    purchase_requisition_id: number;
    lpo_number: string;
    vendor_id: number;
    description: string;
    user_id: number;
    department_id: number | null;
    designation_id: number | null;
    internal_document_number: string;
    vendor_representative_id: string;
    vehicle_id: number;
    purchased_by_id: number;
    received_by_id: number;
    delivery_due_in_days: number;
    delivery_due_date: string;
    term_and_conditions: string;
    payment_terms_in_days: number;
    currency_id: number;
    status: string,
    terms_conditions: string;
    items: any[];
}

interface IRawProduct {
    type: string | 'add';
    id: number;
    raw_product_id: number;
    raw_product_title: string;
    quantity: number;
    unit_id: number;
    unit_title: string;
    unit_price: number;
    total: number;
    tax_category_name: string;
    tax_category_id: string;
    tax_rate: number;
    tax_amount: number;
    row_total: number
    description: string;
}

interface IFormProps {
    id?: any
}

const LPOForm = ({id}: IFormProps) => {
    const dispatch = useDispatch<ThunkDispatch<IRootState, any, AnyAction>>();
    const {token, user} = useSelector((state: IRootState) => state.user);
    const {code} = useSelector((state: IRootState) => state.util);
    const {purchaseRequests} = useSelector((state: IRootState) => state.purchaseRequisition);
    const {loading} = useSelector((state: IRootState) => state.localPurchaseOrder);
    const {allVendors, representatives} = useSelector((state: IRootState) => state.vendor);
    const {currencies} = useSelector((state: IRootState) => state.currency);
    const {vehicle, success, vehicles} = useSelector((state: IRootState) => state.vehicle);
    const {employees} = useSelector((state: IRootState) => state.employee);
    const [showVendorDetail, setShowVendorDetail] = useState<boolean>(false);
    const [vendorDetail, setVendorDetail] = useState<any>({});
    const [rawProductModalOpen, setRawProductModalOpen] = useState<boolean>(false);
    const [rawProducts, setRawProducts] = useState<IRawProduct[]>([]);
    const [formData, setFormData] = useState<IFormData>({
        purchase_requisition_id: 0,
        lpo_number: '',
        vendor_id: 0,
        description: '',
        user_id: user.id,
        department_id: user.employee?.department_id,
        designation_id: user.employee?.designation_id,
        internal_document_number: '',
        vendor_representative_id: '',
        vehicle_id: 0,
        purchased_by_id: 0,
        received_by_id: 0,
        delivery_due_in_days: 0,
        delivery_due_date: '',
        term_and_conditions: '',
        payment_terms_in_days: 0,
        currency_id: 0,
        status: '',
        terms_conditions: '',
        items: []
    });

    const [purchaseRequestOptions, setPurchaseRequestOptions] = useState<any[]>([])
    const [vendorOptions, setVendorOptions] = useState<any[]>([])
    const [currencyOptions, setCurrencyOptions] = useState<any[]>([])
    const [vendorRepresentativeOptions, setVendorRepresentativeOptions] = useState<any[]>([])
    const [vehicleOptions, setVehicleOptions] = useState<any[]>([])
    const [receivedByEmployeeOptions, setReceivedByEmployeeOptions] = useState<any[]>([])
    const [purchasedByEmployeeOptions, setPurchasedByEmployeeOptions] = useState<any[]>([])
    const [vehicleModalOpen, setVehicleModalOpen] = useState<boolean>(false)

    const [representativeDetail, setRepresentativeDetail] = useState<any>({})
    const [showRepresentativeDetail, setShowRepresentativeDetail] = useState<boolean>(false)

    const [vehicleDetail, setVehicleDetail] = useState<any>({})
    const [showVehicleDetail, setShowVehicleDetail] = useState<boolean>(false)

    const [itemDetail, setItemDetail] = useState<any>({})
    const [requisitionStatusOptions, setRequisitionStatusOptions] = useState<any[]>([
        {value: '', label: 'Select Status'},
        {value: 'Draft', label: 'Draft'},
        {value: 'Pending', label: 'Proceed'},
    ]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const {name, value} = e.target;
        setFormData(prevFormData => {
            return {...prevFormData, [name]: value};
        });

        if (name === 'delivery_due_in_days') {
            if (value === '') {
                setFormData(prevFormData => {
                    return {...prevFormData, delivery_due_date: ''};
                });
                return;
            } else {
                const date = new Date();
                date.setDate(date.getDate() + parseInt(value));
                setFormData(prevFormData => {
                    return {...prevFormData, delivery_due_date: date.toDateString()};
                });
            }
        }
    };

    const handleAddItemRow = (value: any) => {
        setRawProducts((prev) => {
            let maxId = 0;
            prev.forEach(item => {
                if (item.id > maxId) {
                    maxId = item.id;
                }
            });
            // if (value.type === 'add') {
            //     const newValue = {...value, id: maxId + 1};
            //     return [...prev, newValue];
            // } else {
            const existingRow = prev.find(row => row.raw_product_title === value.raw_product_title);
            if (existingRow) {
                console.log('existing row', existingRow)
                return prev.map(row => row.raw_product_title === value.raw_product_title ? value : row);
            } else {
                const newValue = {...value, id: maxId + 1};
                console.log('new row', newValue)
                return [...prev, newValue];
            }
            // }
        });
        setItemDetail({});
        setRawProductModalOpen(false);
    }
    const handleEditItem = (index: number) => {
        const item = rawProducts.filter((address, i) => i === index);
        if (item.length > 0) {
            setItemDetail(item[0]);
            setRawProductModalOpen(true)
        } else {
            setRawProductModalOpen(false)
            setItemDetail({})
        }
    }

    const handleRemoveItem = (index: number) => {
        const newItems = rawProducts.filter((address, i) => i !== index);
        setRawProducts(newItems);
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setAuthToken(token)
        setContentType('multipart/form-data')
        let finalData = {
            ...formData,
            user_id: user.id,
            department_id: user.employee?.department_id,
            designation_id: user.employee?.designation_id,
            items: rawProducts.map((product: any) => {
                return {
                    raw_product_id: product.raw_product_id,
                    quantity: product.quantity,
                    unit_id: product.unit_id,
                    unit_price: product.unit_price,
                    total: product.total,
                    description: product.description || '',
                    tax_category_id: product.tax_category_id,
                    tax_rate: product.tax_rate,
                    tax_amount: product.tax_amount,
                    row_total: product.row_total
                }
            })
        }
        if (id) {
            // dispatch(updateRawProduct(id, formData));
        } else {
            dispatch(storeLPO(finalData));
        }
    };

    const handleVendorChange = (e: any) => {
        if (e && typeof e !== 'undefined') {
            setFormData(prev => ({
                ...prev,
                vendor_id: e.value
            }))
            setShowVendorDetail(true)
            setVendorDetail(e.vendor)
            dispatch(getRepresentatives(e.value))
            console.log(e.vendor)
        } else {
            setShowVendorDetail(false)
            setVendorDetail({})
        }

    }

    const handleRepresentativeChange = (e: any) => {
        if (e && typeof e !== 'undefined') {
            setFormData(prev => ({
                ...prev,
                vendor_representative_id: e.value
            }))

            setRepresentativeDetail(e.representative)
            setShowRepresentativeDetail(true)
            console.log(e.vendor)
        } else {
            setRepresentativeDetail({})
            setShowRepresentativeDetail(false)
            dispatch(clearVendorState())
        }
    }

    const handleVehicleChange = (e: any) => {
        if (e && typeof e !== 'undefined') {
            setFormData(prev => ({
                ...prev,
                vehicle_id: e.value
            }))
            setVehicleDetail(e.vehicle)
            setShowVehicleDetail(true)
        } else {
            setVehicleDetail({})
            setShowVehicleDetail(false)
        }
    }

    const handlePurchaseRequisitionChange = (e: any) => {
        if (e && typeof e !== 'undefined') {
            setFormData(prev => ({
                ...prev,
                purchase_requisition_id: e.value
            }))

            if (e.request.purchase_requisition_items?.length > 0) {
                console.log(e.request.purchase_requisition_items)
                setRawProducts(prevState => (
                    e.request.purchase_requisition_items.map((item: any) => ({
                        raw_product_id: item.raw_product_id,
                        raw_product_title: item.raw_product.title + ' (' + item.raw_product.item_code + ')',
                        quantity: parseInt(item.quantity),
                        unit_id: item.unit_id,
                        unit_title: item.unit.short_name,
                        unit_price: parseFloat(item.unit_price),
                        total: parseFloat(item.unit_price) * parseInt(item.quantity),
                        description: item.description || '',
                        tax_category_name: '',
                        tax_category_id: 0,
                        tax_rate: 0,
                        tax_amount: 0,
                        row_total: item.unit_price * item.quantity
                    }))
                ))
            }
        } else {
            setFormData(prev => ({
                ...prev,
                purchase_requisition_id: 0
            }))
            setRawProducts([])
        }
    }

    const handleVehicleSubmit = (value: any) => {
        setContentType('multipart/form-data');
        setAuthToken(token)
        dispatch(storeVehicle(value));
    }

    useEffect(() => {
        dispatch(clearPurchaseRequisitionState())
        setAuthToken(token)
        setContentType('application/json')
        dispatch(clearVendorState())
        dispatch(getVendors())
        dispatch(getCurrencies())
        dispatch(clearVehicleState())
        dispatch(getVehicles())
        dispatch(getPurchaseRequisitionByStatuses({statuses: ['Pending']}))
        dispatch(getEmployees())
        dispatch(clearUtilState())
        dispatch(generateCode(FORM_CODE_TYPE.LOCAL_PURCHASE_ORDER))
    }, [])

    useEffect(() => {
        if (code) {
            setFormData(prev => ({
                ...prev,
                lpo_number: code
            }))
        }
    }, [code])

    useEffect(() => {
        if (allVendors) {
            setVendorOptions(allVendors.map((vendor: any) => ({
                value: vendor.id,
                label: vendor.name,
                vendor: vendor
            })))
        }
    }, [allVendors])

    useEffect(() => {
        if (purchaseRequests) {
            setPurchaseRequestOptions(purchaseRequests.map((request: any) => ({
                value: request.id,
                label: request.pr_title + ' (' + request.pr_code + ')',
                request: request
            })))
        }
    }, [purchaseRequests])

    useEffect(() => {
        if (representatives) {
            setVendorRepresentativeOptions(representatives.map((representative: any) => ({
                value: representative.id,
                label: representative.name,
                representative: representative
            })))
        }
    }, [representatives])

    useEffect(() => {
        if (currencies) {
            setCurrencyOptions(currencies.map((currency: any) => ({
                value: currency.id,
                label: currency.code,
                currency: currency
            })))
        }
    }, [currencies])

    useEffect(() => {
        if (vehicle) {
            dispatch(getVehicles())
            setVehicleModalOpen(false)
            dispatch(clearVehicleState())
        }
    }, [vehicle]);

    useEffect(() => {
        if (vehicles) {
            setVehicleOptions(vehicles.map((vehicle: any) => ({
                value: vehicle.id,
                label: vehicle.make + '-' + vehicle.model + ' (' + vehicle.number_plate + ')',
                vehicle: vehicle
            })))
        }
    }, [vehicles])

    useEffect(() => {
        if (employees) {
            setReceivedByEmployeeOptions(employees.map((employee: any) => ({
                value: employee.user.id,
                label: employee.user.name + ' (' + employee.employee_code + ')',
                employee: employee
            })))

            setPurchasedByEmployeeOptions(employees.map((employee: any) => ({
                value: employee.user.id,
                label: employee.user.name + ' (' + employee.employee_code + ')',
                employee: employee
            })))

            console.log(receivedByEmployeeOptions, purchasedByEmployeeOptions)
        }
    }, [employees]);

    useEffect(() => {
        if (!rawProductModalOpen) {
            setItemDetail({})
        }
    }, [rawProductModalOpen]);

    return (
        <form className="space-y-5" onSubmit={(e) => handleSubmit(e)}>
            <div className="flex justify-start flex-col items-start space-y-3">
                <div className="w-full md:w-1/2">
                    <label htmlFor="purchase_requisition_id">Purchase Requisition</label>
                    <Select
                        defaultValue={purchaseRequestOptions[0]}
                        options={purchaseRequestOptions}
                        isSearchable={true}
                        isClearable={true}
                        placeholder={'Select Request'}
                        onChange={(e: any) => handlePurchaseRequisitionChange(e)}
                    />
                </div>
                <div className="border rounded p-5 w-full">
                    <h3 className="text-lg font-semibold">Basic Details</h3>
                    <hr className="my-3"/>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full my-5">
                        <div className="w-full space-y-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                                <div className="w-full">
                                    <label htmlFor="lpo_number">LPO Number</label>
                                    <input id="lpo_number" type="text" name="lpo_number" placeholder="Enter LPO number"
                                           value={formData.lpo_number} onChange={handleChange} disabled={true}
                                           className="form-input"/>
                                </div>
                                <div className="w-full">
                                    <label htmlFor="internal_document_number">Internal Document Number</label>
                                    <input id="internal_document_number" type="text" name="internal_document_number"
                                           placeholder="Enter Internal Document Number"
                                           value={formData.internal_document_number} onChange={handleChange}
                                           className="form-input"/>
                                </div>
                            </div>
                            <div className="w-full">
                                <label htmlFor="status_id">Status</label>
                                <Select
                                    defaultValue={requisitionStatusOptions[0]}
                                    options={requisitionStatusOptions}
                                    isSearchable={true}
                                    isClearable={true}
                                    placeholder={'Select Status'}
                                    onChange={(e: any) => setFormData(prev => ({
                                        ...prev,
                                        status: e && typeof e !== 'undefined' ? e.value : ''
                                    }))}
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                                <div className="w-full">
                                    <label htmlFor="received_by_id">Received By</label>
                                    <Select
                                        defaultValue={receivedByEmployeeOptions[0]}
                                        options={receivedByEmployeeOptions}
                                        isSearchable={true}
                                        isClearable={true}
                                        placeholder={'Select Employee'}
                                        onChange={(e: any) => setFormData(prev => ({
                                            ...prev,
                                            received_by_id: e && typeof e !== 'undefined' ? e.value : 0
                                        }))}
                                    />
                                </div>
                                <div className="w-full">
                                    <label htmlFor="purchased_by_id">Purchased By</label>
                                    <Select
                                        defaultValue={purchasedByEmployeeOptions[0]}
                                        options={purchasedByEmployeeOptions}
                                        isSearchable={true}
                                        isClearable={true}
                                        placeholder={'Select Employee'}
                                        onChange={(e: any) => setFormData(prev => ({
                                            ...prev,
                                            purchased_by_id: e && typeof e !== 'undefined' ? e.value : 0
                                        }))}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                                <div className="w-full">
                                    <label htmlFor="delivery_due_in_days">Delivery Due Days</label>
                                    <input id="delivery_due_in_days" type="text" name="delivery_due_in_days"
                                           placeholder="Delivery Due Days"
                                           value={formData.delivery_due_in_days} onChange={handleChange}
                                           className="form-input"/>
                                </div>
                                <div className="w-full">
                                    <label htmlFor="delivery_due_date">Delivery Due Date</label>
                                    <input id="delivery_due_date" type="text" name="delivery_due_date"
                                           placeholder="Delivery Due Date"
                                           disabled={true}
                                           value={formData.delivery_due_date} onChange={handleChange}
                                           className="form-input"/>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                                <div className="w-full">
                                    <label htmlFor="payment_terms_in_days">Payment Terms (Days)</label>
                                    <input id="payment_terms_in_days" type="text" name="payment_terms_in_days"
                                           placeholder="Payment Terms (Days)"
                                           value={formData.payment_terms_in_days} onChange={handleChange}
                                           className="form-input"/>
                                </div>
                                <div className="w-full">
                                    <label htmlFor="currency_id">Currency</label>
                                    <Select
                                        defaultValue={currencyOptions[0]}
                                        options={currencyOptions}
                                        isSearchable={true}
                                        isClearable={true}
                                        placeholder={'Select Currency'}
                                        onChange={(e: any) => setFormData(prev => ({
                                            ...prev,
                                            currency_id: e && typeof e !== 'undefined' ? e.value : 0
                                        }))}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="w-full space-y-3">
                            <div className="w-full flex justify-between items-end gap-3">
                                <div className="w-full">
                                    <label htmlFor="vehicle_id">Shipped Via (Vehicle)</label>
                                    <Select
                                        defaultValue={vehicleOptions[0]}
                                        options={vehicleOptions}
                                        isSearchable={true}
                                        isClearable={true}
                                        placeholder={'Select Vehicle'}
                                        onChange={(e: any) => handleVehicleChange(e)}
                                    />
                                </div>
                                <button className="btn btn-primary btn-sm flex justify-center items-center"
                                        onClick={() => setVehicleModalOpen(true)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                         className="h-5 w-5 ltr:mr-2 rtl:ml-2"
                                         fill="none">
                                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
                                        <path d="M15 12L12 12M12 12L9 12M12 12L12 9M12 12L12 15" stroke="currentColor"
                                              strokeWidth="1.5" strokeLinecap="round"/>
                                    </svg>
                                </button>
                            </div>

                            <div className="w-full" hidden={!showVehicleDetail}>
                                <h4 className="font-bold text-lg">Vehicle Details</h4>
                                <div className="flex flex-col gap-3 justify-center items-center">
                                    <Image src={BASE_URL + '/' + vehicleDetail.thumbnail?.path} alt="Vehicle Image"
                                           height={100} width={100}/>
                                    <table>
                                        <thead>
                                        <tr>
                                            <th>Number Plate</th>
                                            <th>Make</th>
                                            <th>Modal</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        <tr>
                                            <td>{vehicleDetail.number_plate}</td>
                                            <td>{vehicleDetail.make}</td>
                                            <td>{vehicleDetail.model}</td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>

                            </div>
                            <div hidden={showVehicleDetail}>
                                No Vehicle Selected
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border rounded p-5 w-full">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <h3 className="text-lg font-semibold">Vendor Details</h3>
                        <Link href="/admin/vendors/create"
                              className="btn btn-primary btn-sm m-1">
                            <span className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                     className="h-5 w-5 ltr:mr-2 rtl:ml-2"
                                     fill="none">
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
                                    <path d="M15 12L12 12M12 12L9 12M12 12L12 9M12 12L12 15" stroke="currentColor"
                                          strokeWidth="1.5" strokeLinecap="round"/>
                                </svg>
                                Create Vendor
                            </span>
                        </Link>
                    </div>
                    <hr className="my-3"/>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full my-5 ">
                        <div className="w-full space-y-3">
                            <div className="w-full">
                                <label htmlFor="vendor_id">Vendor</label>
                                <Select
                                    defaultValue={vendorOptions[0]}
                                    options={vendorOptions}
                                    isSearchable={true}
                                    isClearable={true}
                                    placeholder={'Select Vendor'}
                                    onChange={(e: any) => handleVendorChange(e)}
                                />
                            </div>
                            <div className="w-full" hidden={!showVendorDetail}>
                                <h4 className="font-bold text-lg">Vendor Details</h4>
                                <table>
                                    <thead>
                                    <tr>
                                        <th>Vendor Number</th>
                                        <th>Vendor Name</th>
                                        <th>Billed From</th>
                                        <th>Shift From</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                        <td>{vendorDetail.vendor_number}</td>
                                        <td>{vendorDetail.name}</td>
                                        <td>
                                            {vendorDetail.addresses?.map((address: any, index: number) => {
                                                if (address.type === 'billing') {
                                                    return address.address + ', ' + address.city?.name + ', ' + address.state?.name + ', ' + address.country?.name
                                                }
                                            })}
                                        </td>
                                        <td>
                                            {vendorDetail.addresses?.map((address: any, index: number) => {
                                                if (address.type === 'shifting') {
                                                    return address.address + ', ' + address.city?.name + ', ' + address.state?.name + ', ' + address.country?.name
                                                }
                                            })}
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="w-full space-y-3">
                            <div className="w-full">
                                <label htmlFor="vendor_representatative_id">Vendor Representative</label>
                                <Select
                                    defaultValue={vendorRepresentativeOptions[0]}
                                    options={vendorRepresentativeOptions}
                                    isSearchable={true}
                                    isClearable={true}
                                    placeholder={'Select Representative'}
                                    onChange={(e: any) => handleRepresentativeChange(e)}
                                />
                            </div>
                            <div className="w-full" hidden={!showRepresentativeDetail}>
                                <h4 className="font-bold text-lg">Representative Details</h4>
                                <table>
                                    <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Phone</th>
                                        <th>Email</th>
                                        <th>Address</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                        <td>{representativeDetail.name}</td>
                                        <td>{representativeDetail.phone}</td>
                                        <td>{representativeDetail.email}</td>
                                        <td>
                                            {representativeDetail.address + ', ' + representativeDetail.city?.name + ', ' + representativeDetail.state?.name + ', ' + representativeDetail.country?.name}
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-full">
                    <h4 className="font-bold text-lg">Terms & Conditions</h4>
                    <ReactQuill
                        theme="snow"
                        value={formData.terms_conditions}
                        onChange={(e) => setFormData((prev: any) => ({...prev, terms_conditions: e}))}
                    />
                </div>

                <div className="table-responsive w-full">
                    <div className="flex justify-between items-center flex-col md:flex-row space-y-3 md:space-y-0 mb-3">
                        <h3 className="text-lg font-semibold">Item Details</h3>
                        <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            onClick={() => {
                                setItemDetail({})
                                setRawProductModalOpen(true)
                            }}
                        >
                            Add New Item
                        </button>
                    </div>
                    <table>
                        <thead>
                        <tr>
                            <th>Raw Product</th>
                            <th>Description</th>
                            <th>Unit</th>
                            <th>Quantity</th>
                            <th>Unit Price</th>
                            <th>Total</th>
                            <th>Tax Category</th>
                            <th>Tax Rate(%)</th>
                            <th>Tax Amount</th>
                            <th>Row Total</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {rawProducts.map((product, index) => (
                            <tr key={index}>
                                <td>{product.raw_product_title}</td>
                                <td>{product.description}</td>
                                <td>{product.unit_title}</td>
                                <td>{product.quantity}</td>
                                <td>{product.unit_price}</td>
                                <td>{product.total}</td>
                                <td>{product.tax_category_name}</td>
                                <td>{product.tax_rate}</td>
                                <td>{product.tax_amount}</td>
                                <td>{product.row_total}</td>
                                <td>
                                    <div className="flex gap-3 items-center">
                                        <button
                                            type="button"
                                            className="btn btn-outline-primary btn-sm"
                                            onClick={() => handleEditItem(index)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveItem(index)}
                                            className="btn btn-outline-danger btn-sm"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {rawProducts.length === 0 ? (
                            <tr>
                                <td colSpan={11} className="text-center">No Item Added</td>
                            </tr>
                        ) : (
                            <tr>
                                <td colSpan={3} className="font-bold text-center">Total</td>
                                <td className="text-left font-bold">{rawProducts.reduce((acc:number, item) => acc + item.quantity, 0)}</td>
                                <td className="text-left font-bold">{rawProducts.reduce((acc:number, item) => acc + item.unit_price, 0)}</td>
                                <td className="text-left font-bold">{rawProducts.reduce((acc:number, item) => acc + item.total, 0)}</td>
                                <td></td>
                                <td></td>
                                <td className="text-left font-bold">{rawProducts.reduce((acc:number, item) => acc + item.tax_amount, 0)}</td>
                                <td className="text-left font-bold">{rawProducts.reduce((acc:number, item) => acc + item.row_total, 0)}</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>

                <div className="w-full flex justify-center items-center flex-col md:flex-row gap-3">
                    {/*<button*/}
                    {/*    type="button"*/}
                    {/*    className="btn btn-success"*/}
                    {/*    onClick={() => window.print()}*/}
                    {/*>*/}
                    {/*    Preview*/}
                    {/*</button>*/}
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                    >
                        {loading ? 'Loading...' : 'Save LPO'}
                    </button>
                    <button
                        type="button"
                        onClick={() => window.location.reload()}
                        className="btn btn-info"
                    >
                        Clear
                    </button>
                    {/*<button*/}
                    {/*    type="button"*/}
                    {/*    className="btn btn-warning"*/}
                    {/*>*/}
                    {/*    Print*/}
                    {/*</button>*/}
                </div>
            </div>
            <VehicleFormModal
                modalOpen={vehicleModalOpen}
                setModalOpen={setVehicleModalOpen}
                handleAddition={(value) => handleVehicleSubmit(value)}
                title={'Vehicle'}
            />
            <LPORawProductModal
                modal={rawProductModalOpen}
                setModal={setRawProductModalOpen}
                modalFormData={itemDetail}
                handleAddRawProduct={(value: any) => handleAddItemRow(value)}
            />
        </form>
    );
};

export default LPOForm;
