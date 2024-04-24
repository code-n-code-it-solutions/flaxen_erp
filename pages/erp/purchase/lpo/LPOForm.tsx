"use client";
import React, {useEffect, useState} from 'react';
import {setAuthToken, setContentType} from "@/configs/api.config";
import {useDispatch, useSelector} from "react-redux";
import {ThunkDispatch} from "redux-thunk";
import {IRootState, useAppDispatch, useAppSelector} from "@/store";
import {AnyAction} from "redux";
import {
    clearPurchaseRequisitionState,
    getPurchaseRequisitionByStatuses,
} from "@/store/slices/purchaseRequisitionSlice";
import {clearVendorState, getRepresentatives, getVendors} from "@/store/slices/vendorSlice";
import {getCurrencies} from "@/store/slices/currencySlice";
import VehicleFormModal from "@/components/modals/VehicleFormModal";
import {clearVehicleState, getVehicles, storeVehicle} from "@/store/slices/vehicleSlice";
import Image from "next/image";
import {getEmployees} from "@/store/slices/employeeSlice";
import {storeLPO} from "@/store/slices/localPurchaseOrderSlice";
import {clearUtilState, generateCode} from "@/store/slices/utilSlice";
import {ButtonType, ButtonVariant, FORM_CODE_TYPE, IconType, RAW_PRODUCT_LIST_TYPE} from "@/utils/enums";
import {getTaxCategories} from "@/store/slices/taxCategorySlice";
import ServiceItemListing from "@/components/listing/ServiceItemListing";
import RawProductItemListing from "@/components/listing/RawProductItemListing";
import {Dropdown} from "@/components/form/Dropdown";
import {Input} from "@/components/form/Input";
import Button from "@/components/Button";
import {getIcon, serverFilePath} from "@/utils/helper";
import Textarea from "@/components/form/Textarea";

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
    type: string,
    terms_conditions: string;
    items: any[];
}

interface IFormProps {
    id?: any
}

const LPOForm = ({id}: IFormProps) => {
    const dispatch = useAppDispatch();
    const {token, user} = useAppSelector(state => state.user);
    const {code} = useAppSelector(state => state.util);
    const {purchaseRequests} = useAppSelector(state => state.purchaseRequisition);
    const {loading} = useAppSelector(state => state.localPurchaseOrder);
    const {allVendors, representatives} = useAppSelector(state => state.vendor);
    const {currencies} = useAppSelector(state => state.currency);
    const {vehicle, success, vehicles} = useAppSelector(state => state.vehicle);
    const {employees} = useAppSelector(state => state.employee);
    const {taxCategories} = useAppSelector(state => state.taxCategory);
    const [showVendorDetail, setShowVendorDetail] = useState<boolean>(false);
    const [vendorDetail, setVendorDetail] = useState<any>({});
    const [rawProducts, setRawProducts] = useState<any[]>([]);
    const [serviceItems, setServiceItems] = useState<any[]>([]);
    const [miscellaneousItems, setMiscellaneousItems] = useState<any[]>([]);
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
        type: '',
        terms_conditions: '',
        items: []
    });

    const [purchaseRequestOptions, setPurchaseRequestOptions] = useState<any[]>([{value: 0, label: 'Skip Requisition'}])
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
    const [showItemDetail, setShowItemDetail] = useState<any>({
        show: false,
        type: null
    });

    const [requisitionStatusOptions, setRequisitionStatusOptions] = useState<any[]>([
        {value: '', label: 'Select Status'},
        {value: 'Draft', label: 'Draft'},
        {value: 'Pending', label: 'Proceed'},
    ]);
    const [lpoTypeOptions, setLpoTypeOptions] = useState<any[]>([
        {value: '', label: 'Select Type'},
        {value: 'Material', label: 'Material'},
        {value: 'Service', label: 'Service'},
        {value: 'Miscellaneous', label: 'Miscellaneous'},
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

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setAuthToken(token)
        setContentType('multipart/form-data')
        let finalData = {
            ...formData,
            user_id: user.id,
            department_id: user.employee?.department_id,
            designation_id: user.employee?.designation_id,
            items:
                formData.type === 'Material'
                    ? rawProducts.map((product: any) => {
                        return {
                            raw_product_id: product.raw_product_id,
                            description: product.description || '',
                            unit_id: product.unit_id,
                            quantity: product.quantity,
                            unit_price: product.unit_price,
                            sub_total: product.sub_total,
                            tax_category_id: product.tax_category_id,
                            tax_rate: product.tax_rate,
                            tax_amount: product.tax_amount,
                            grand_total: product.grand_total
                        }
                    })
                    : serviceItems.map((item: any) => {
                        return {
                            asset_id: item.asset_id,
                            service_name: item.service_name,
                            description: item.description || '',
                            cost: item.cost,
                            tax_category_id: item.tax_category_id,
                            tax_rate: item.tax_rate,
                            tax_amount: item.tax_amount,
                            grand_total: item.grand_total
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
            setFormData(prev => ({
                ...prev,
                vendor_id: 0
            }))
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
            setFormData(prev => ({
                ...prev,
                vendor_representative_id: ''
            }))
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
            setFormData(prev => ({
                ...prev,
                vehicle_id: 0
            }))
        }
    }

    const handlePurchaseRequisitionChange = (e: any) => {
        if (e && typeof e !== 'undefined') {
            if (e.value === 0) {
                dispatch(generateCode(FORM_CODE_TYPE.PURCHASE_REQUISITION))
            } else {
                setFormData(prev => ({
                    ...prev,
                    purchase_requisition_id: e.value,
                    internal_document_number: e.request.pr_code
                }))
            }
            if (e.value !== 0) {
                if (e.request.items?.length > 0) {
                    if (formData.type === 'Material') {
                        setRawProducts(prevState => (
                            e.request.items.map((item: any) => ({
                                raw_product_id: item.raw_product_id,
                                quantity: parseInt(item.quantity),
                                unit_id: item.unit_id,
                                unit_price: parseFloat(item.unit_price),
                                sub_total: parseFloat(item.unit_price) * parseInt(item.quantity),
                                description: item.description || '',
                                tax_category_id: 0,
                                tax_rate: 0,
                                tax_amount: 0,
                                grand_total: item.unit_price * item.quantity
                            }))
                        ))
                    } else if (formData.type === 'Service') {
                        if (e.request.items?.length > 0) {
                            setServiceItems(prevState => (
                                e.request.items.map((item: any) => ({
                                    asset_id: item.asset_id,
                                    service_name: item.service_name,
                                    description: item.description || '',
                                    cost: isNaN(parseFloat(item.cost)) ? 0 : parseFloat(item.cost),
                                    tax_category_id: item.tax_category_id,
                                    tax_rate: isNaN(parseFloat(item.tax_rate)) ? 0 : parseFloat(item.tax_rate),
                                    tax_amount: isNaN(parseFloat(item.tax_amount)) ? 0 : parseFloat(item.tax_amount),
                                    grand_total: isNaN(parseFloat(item.grand_total)) ? 0 : parseFloat(item.grand_total)
                                }))
                            ))
                        }
                    } else {
                        setRawProducts([])
                        setServiceItems([])
                        setMiscellaneousItems([])
                    }
                } else {
                    setRawProducts([])
                    setServiceItems([])
                    setMiscellaneousItems([])
                }
            }
        } else {
            setFormData(prev => ({
                ...prev,
                purchase_requisition_id: 0
            }))
            setRawProducts([])
            setMiscellaneousItems([])
        }
    }

    const handleVehicleSubmit = (value: any) => {
        setContentType('multipart/form-data');
        setAuthToken(token)
        dispatch(storeVehicle(value));
    }

    const handleLpoTypeChange = (e: any) => {
        if (e && typeof e !== 'undefined') {
            setFormData(prev => ({
                ...prev,
                type: e.value
            }))
            if (e.value !== '') {
                setShowItemDetail({
                    show: true,
                    type: e.value
                })
                dispatch(getPurchaseRequisitionByStatuses({type: e.value, statuses: ['Pending', 'Partial']}))
            } else {
                setShowItemDetail({
                    show: false,
                    type: null
                })
                setPurchaseRequestOptions([{value: 0, label: 'Skip Requisition'}])
                dispatch(getPurchaseRequisitionByStatuses({type: e.value, statuses: ['Pending', 'Partial']}))
            }
        } else {
            setShowItemDetail({
                show: false,
                type: null
            })
            setFormData(prev => ({
                ...prev,
                type: ''
            }))
            setPurchaseRequestOptions([{value: 0, label: 'Skip Requisition'}])
        }
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
        dispatch(getEmployees())
        dispatch(clearUtilState())
        dispatch(generateCode(FORM_CODE_TYPE.LOCAL_PURCHASE_ORDER))
        dispatch(generateCode(FORM_CODE_TYPE.PURCHASE_REQUISITION))
        dispatch(getTaxCategories());
    }, [])

    useEffect(() => {
        if (code) {
            if (code[FORM_CODE_TYPE.LOCAL_PURCHASE_ORDER]) {
                setFormData(prev => ({
                    ...prev,
                    lpo_number: code[FORM_CODE_TYPE.LOCAL_PURCHASE_ORDER]
                }))
            }

            if (code[FORM_CODE_TYPE.PURCHASE_REQUISITION]) {
                setFormData(prev => ({
                    ...prev,
                    internal_document_number: code[FORM_CODE_TYPE.PURCHASE_REQUISITION]
                }))
            }
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
            setPurchaseRequestOptions([
                {value: 0, label: 'Skip Requisition'},
                ...purchaseRequests.map((request: any) => ({
                    value: request.id,
                    label: request.pr_title + ' (' + request.pr_code + ')',
                    request: request
                }))
            ])
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

    return (
        <form className="space-y-5" onSubmit={(e) => handleSubmit(e)}>
            <div className="flex justify-start flex-col items-start space-y-3">
                <Dropdown
                    divClasses='w-full md:w-1/2'
                    label='Type'
                    name='type'
                    options={lpoTypeOptions}
                    value={formData.type}
                    onChange={(e: any) => handleLpoTypeChange(e)}
                />

                <Dropdown
                    divClasses='w-full md:w-1/2'
                    label='Purchase Requisition'
                    name='purchase_requisition_id'
                    options={purchaseRequestOptions}
                    value={formData.purchase_requisition_id}
                    onChange={(e: any) => handlePurchaseRequisitionChange(e)}
                />

                <div className="border rounded p-5 w-full">
                    <h3 className="text-lg font-semibold">Basic Details</h3>
                    <hr className="my-3"/>
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-4 w-full my-5">
                        <div className="w-full space-y-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                                <Input
                                    divClasses='w-full'
                                    label='LPO Number'
                                    type='text'
                                    name='lpo_number'
                                    value={formData.lpo_number}
                                    onChange={handleChange}
                                    isMasked={false}
                                    placeholder='Enter LPO Number'
                                    disabled={true}
                                />

                                <Input
                                    divClasses={`w-full ${formData.purchase_requisition_id !== 0 ? 'hide' : ''}`}
                                    label='Internal Document Number'
                                    type='text'
                                    name='internal_document_number'
                                    value={formData.internal_document_number}
                                    onChange={handleChange}
                                    placeholder="Enter Internal Document Number"
                                    isMasked={false}
                                    disabled={true}
                                />
                            </div>
                            <Dropdown
                                divClasses='w-full'
                                label='Status'
                                name='status_id'
                                options={requisitionStatusOptions}
                                value={formData.status}
                                onChange={(e: any) => {
                                    if (e && typeof e !== 'undefined') {
                                        setFormData(prev => ({
                                            ...prev,
                                            status: e.value
                                        }))
                                    } else {
                                        setFormData(prev => ({
                                            ...prev,
                                            status: ''
                                        }))
                                    }
                                }}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                                <Input
                                    divClasses='w-full'
                                    label='Delivery Due Days'
                                    type='number'
                                    name='delivery_due_in_days'
                                    value={formData.delivery_due_in_days.toString()}
                                    onChange={handleChange}
                                    isMasked={false}
                                    placeholder="Delivery Due Days"
                                />

                                <Input
                                    divClasses='w-full'
                                    label='Delivery Due Date'
                                    type='text'
                                    name='delivery_due_date'
                                    value={formData.delivery_due_date}
                                    onChange={handleChange}
                                    isMasked={false}
                                    placeholder="Delivery Due Date"
                                    disabled={true}
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                                <Input
                                    divClasses='w-full'
                                    label='Payment Terms (Days)'
                                    type='number'
                                    name='payment_terms_in_days'
                                    value={formData.payment_terms_in_days.toString()}
                                    onChange={handleChange}
                                    isMasked={false}
                                    placeholder="Payment Terms (Days)"
                                />

                                <Dropdown
                                    divClasses='w-full'
                                    label='Currency'
                                    name='currency_id'
                                    options={currencyOptions}
                                    value={formData.currency_id}
                                    onChange={(e: any) => {
                                        if (e && typeof e !== 'undefined') {
                                            setFormData(prev => ({
                                                ...prev,
                                                currency_id: e.value
                                            }))
                                        } else {
                                            setFormData(prev => ({
                                                ...prev,
                                                currency_id: 0
                                            }))
                                        }
                                    }}
                                />

                            </div>
                        </div>
                        <div className="w-full space-y-3"
                             hidden={showItemDetail.type !== 'Material' && showItemDetail.type !== ''}>
                            <div className="w-full flex justify-between items-end gap-3">
                                <Dropdown
                                    divClasses='w-full'
                                    label='Shipped Via (Vehicle)'
                                    name='purchase_requisition_id'
                                    options={vehicleOptions}
                                    value={formData.vehicle_id}
                                    onChange={(e: any) => handleVehicleChange(e)}
                                />
                                <Button
                                    type={ButtonType.button}
                                    text={getIcon(IconType.add)}
                                    variant={ButtonVariant.primary}
                                    onClick={() => setVehicleModalOpen(true)}
                                />
                            </div>

                            <div className="w-full" hidden={!showVehicleDetail}>
                                <h4 className="font-bold text-lg">Vehicle Details</h4>
                                <div className="flex flex-col gap-3 justify-center items-center">
                                    <Image priority={true} src={serverFilePath(vehicleDetail.thumbnail)} alt="Vehicle Image"
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
                        <Button
                            type={ButtonType.link}
                            text={
                                <span className="flex items-center">
                                    {getIcon(IconType.add)}
                                    Create Vendor
                                </span>
                            }
                            variant={ButtonVariant.primary}
                            link="/admin/vendors/create"
                        />
                    </div>
                    <hr className="my-3"/>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full my-5 ">
                        <div className="w-full space-y-3">
                            <Dropdown
                                divClasses='w-full'
                                label='Vendor'
                                name='vendor_id'
                                options={vendorOptions}
                                value={formData.vendor_id}
                                onChange={(e: any) => handleVendorChange(e)}
                            />

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
                            <Dropdown
                                divClasses='w-full'
                                label='Vendor Representative'
                                name='vendor_representatative_id'
                                options={vendorRepresentativeOptions}
                                value={formData.vendor_representative_id}
                                onChange={(e: any) => handleRepresentativeChange(e)}
                            />

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
                <Textarea
                    divClasses='w-full'
                    label='Terms & Conditions'
                    name='terms_conditions'
                    value={formData.terms_conditions}
                    onChange={(e) => setFormData((prev: any) => ({...prev, terms_conditions: e}))}
                    isReactQuill={true}
                />

                {showItemDetail.show && (
                    <>
                        {showItemDetail.type === 'Material'
                            ? (
                                <RawProductItemListing
                                    rawProducts={rawProducts}
                                    type={RAW_PRODUCT_LIST_TYPE.LOCAL_PURCHASE_ORDER}
                                    setRawProducts={setRawProducts}
                                />
                            )
                            : showItemDetail.type === 'Service'
                                ? (
                                    <ServiceItemListing
                                        serviceItems={serviceItems}
                                        setServiceItems={setServiceItems}
                                        type={RAW_PRODUCT_LIST_TYPE.LOCAL_PURCHASE_ORDER}
                                    />
                                ) : <></>}
                    </>
                )}
            </div>

            <div className="w-full flex justify-center items-center flex-col md:flex-row gap-3">
                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                >
                    {loading ? 'Loading...' : 'Save LPO'}
                </button>
                <button
                    type="button"
                    onClick={() => window?.location?.reload()}
                    className="btn btn-info"
                >
                    Clear
                </button>
            </div>
            {/*</div>*/}
            <VehicleFormModal
                modalOpen={vehicleModalOpen}
                setModalOpen={setVehicleModalOpen}
                handleAddition={(value) => handleVehicleSubmit(value)}
                title={'Vehicle'}
            />

            {/*<LPOServiceModal*/}
            {/*    modalOpen={serviceModalOpen}*/}
            {/*    setModalOpen={setServiceModalOpen}*/}
            {/*    handleSubmit={(val) => handleAddItemRow(val, 'Service')}*/}
            {/*/>*/}
        </form>
    );
};

export default LPOForm;
