'use client';
import React, { useEffect, useState } from 'react';
import { setAuthToken, setContentType } from '@/configs/api.config';
import { useAppDispatch, useAppSelector } from '@/store';
import {
    clearPurchaseRequisitionState,
    getPurchaseRequisitionByStatuses
} from '@/store/slices/purchaseRequisitionSlice';
import { clearVendorState, getRepresentatives, getVendors } from '@/store/slices/vendorSlice';
import { getCurrencies } from '@/store/slices/currencySlice';
import VehicleFormModal from '@/components/modals/VehicleFormModal';
import { clearVehicleState, getVehicles, storeVehicle } from '@/store/slices/vehicleSlice';
import Image from 'next/image';
import { getEmployees } from '@/store/slices/employeeSlice';
import { storeLPO } from '@/store/slices/localPurchaseOrderSlice';
import { clearUtilState, generateCode } from '@/store/slices/utilSlice';
import { ButtonSize, ButtonType, ButtonVariant, FORM_CODE_TYPE, IconType, RAW_PRODUCT_LIST_TYPE } from '@/utils/enums';
import { getTaxCategories } from '@/store/slices/taxCategorySlice';
import ServiceItemListing from '@/components/listing/ServiceItemListing';
import RawProductItemListing from '@/components/listing/RawProductItemListing';
import { Dropdown } from '@/components/form/Dropdown';
import { Input } from '@/components/form/Input';
import Button from '@/components/Button';
import { getIcon, serverFilePath } from '@/utils/helper';
import Textarea from '@/components/form/Textarea';
import Modal from '@/components/Modal';

interface IFormData {
    purchase_requisition_ids: string;
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
    id?: any;
}

const LPOForm = ({ id }: IFormProps) => {
    const dispatch = useAppDispatch();
    const { token, user } = useAppSelector(state => state.user);
    const { code } = useAppSelector(state => state.util);
    const { purchaseRequests } = useAppSelector(state => state.purchaseRequisition);
    const { loading } = useAppSelector(state => state.localPurchaseOrder);
    const { allVendors, representatives } = useAppSelector(state => state.vendor);
    const { currencies } = useAppSelector(state => state.currency);
    const { vehicle, success, vehicles } = useAppSelector(state => state.vehicle);
    const { employees } = useAppSelector(state => state.employee);
    const { taxCategories } = useAppSelector(state => state.taxCategory);

    const [itemModalOpen, setItemModalOpen] = useState<boolean>(false);
    const [showVendorDetail, setShowVendorDetail] = useState<boolean>(false);
    const [vendorDetail, setVendorDetail] = useState<any>({});
    const [rawProducts, setRawProducts] = useState<any[]>([]);
    const [rawProductForSelect, setRawProductForSelect] = useState<any[]>([]);
    const [originalProductState, setOriginalProductState] = useState<any[]>([]);
    const [serviceItems, setServiceItems] = useState<any[]>([]);
    const [miscellaneousItems, setMiscellaneousItems] = useState<any[]>([]);
    const [formData, setFormData] = useState<IFormData>({
        purchase_requisition_ids: '',
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

    const [purchaseRequestOptions, setPurchaseRequestOptions] = useState<any[]>([{
        value: 0,
        label: 'Skip Requisition'
    }]);
    const [selectedPR, setSelectedPR] = useState<any[]>([]);
    const [vendorOptions, setVendorOptions] = useState<any[]>([]);
    const [currencyOptions, setCurrencyOptions] = useState<any[]>([]);
    const [vendorRepresentativeOptions, setVendorRepresentativeOptions] = useState<any[]>([]);
    const [vehicleOptions, setVehicleOptions] = useState<any[]>([]);
    const [receivedByEmployeeOptions, setReceivedByEmployeeOptions] = useState<any[]>([]);
    const [purchasedByEmployeeOptions, setPurchasedByEmployeeOptions] = useState<any[]>([]);
    const [vehicleModalOpen, setVehicleModalOpen] = useState<boolean>(false);

    const [representativeDetail, setRepresentativeDetail] = useState<any>({});
    const [showRepresentativeDetail, setShowRepresentativeDetail] = useState<boolean>(false);

    const [vehicleDetail, setVehicleDetail] = useState<any>({});
    const [showVehicleDetail, setShowVehicleDetail] = useState<boolean>(false);
    const [showItemDetail, setShowItemDetail] = useState<any>({
        show: false,
        type: null
    });

    const [requisitionStatusOptions, setRequisitionStatusOptions] = useState<any[]>([
        { value: '', label: 'Select Status' },
        { value: 'Draft', label: 'Draft' },
        { value: 'Pending', label: 'Proceed' }
    ]);
    const [lpoTypeOptions, setLpoTypeOptions] = useState<any[]>([
        { value: '', label: 'Select Type' },
        { value: 'Material', label: 'Material' },
        { value: 'Service', label: 'Service' },
        { value: 'Miscellaneous', label: 'Miscellaneous' }
    ]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prevFormData => {
            return { ...prevFormData, [name]: value };
        });

        if (name === 'delivery_due_in_days') {
            if (value === '') {
                setFormData(prevFormData => {
                    return { ...prevFormData, delivery_due_date: '' };
                });
                return;
            } else {
                const date = new Date();
                date.setDate(date.getDate() + parseInt(value));
                setFormData(prevFormData => {
                    return { ...prevFormData, delivery_due_date: date.toDateString() };
                });
            }
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setAuthToken(token);
        setContentType('multipart/form-data');
        let finalData = {
            ...formData,
            user_id: user.id,
            department_id: user.employee?.department_id,
            designation_id: user.employee?.designation_id,
            items:
                formData.type === 'Material'
                    ? rawProducts.map((product: any) => {
                        return {
                            status: product.status,
                            purchase_requisition_item_id: product.id,
                            purchase_requisition_id: product.purchase_requisition_id,
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
                        };
                    })
                    : serviceItems.map((item: any) => {
                        return {
                            status: item.status,
                            purchase_requisition_id: item.purchase_requisition_id,
                            asset_id: item.asset_id,
                            service_name: item.service_name,
                            description: item.description || '',
                            cost: item.cost,
                            tax_category_id: item.tax_category_id,
                            tax_rate: item.tax_rate,
                            tax_amount: item.tax_amount,
                            grand_total: item.grand_total
                        };
                    })
        };
        if (id) {
            // dispatch(updateRawProduct(id, formData));
        } else {
            dispatch(storeLPO(finalData));
            // console.log(finalData)
        }
    };

    const handleVendorChange = (e: any) => {
        if (e && typeof e !== 'undefined') {
            setFormData(prev => ({
                ...prev,
                vendor_id: e.value
            }));
            setShowVendorDetail(true);
            setVendorDetail(e.vendor);
            dispatch(getRepresentatives(e.value));
            console.log(e.vendor);
        } else {
            setShowVendorDetail(false);
            setVendorDetail({});
            setFormData(prev => ({
                ...prev,
                vendor_id: 0
            }));
        }

    };

    const handleRepresentativeChange = (e: any) => {
        if (e && typeof e !== 'undefined') {
            setFormData(prev => ({
                ...prev,
                vendor_representative_id: e.value
            }));

            setRepresentativeDetail(e.representative);
            setShowRepresentativeDetail(true);
            console.log(e.vendor);
        } else {
            setRepresentativeDetail({});
            setShowRepresentativeDetail(false);
            dispatch(clearVendorState());
            setFormData(prev => ({
                ...prev,
                vendor_representative_id: ''
            }));
        }
    };

    const handleVehicleChange = (e: any) => {
        if (e && typeof e !== 'undefined') {
            setFormData(prev => ({
                ...prev,
                vehicle_id: e.value
            }));
            setVehicleDetail(e.vehicle);
            setShowVehicleDetail(true);
        } else {
            setVehicleDetail({});
            setShowVehicleDetail(false);
            setFormData(prev => ({
                ...prev,
                vehicle_id: 0
            }));
        }
    };

    const handlePurchaseRequisitionChange = (selections: any) => {
        if (selections && typeof selections !== 'undefined') {
            setSelectedPR(selections);
            console.log(selections);
            const nonZeroSelections = selections.filter((item: any) => item.value !== 0);
            if (nonZeroSelections.length > 0) {
                // Join values for non-zero selections
                const selectedValues = nonZeroSelections.map((item: any) => item.value).join(',');
                const selectedPRCodes = nonZeroSelections.map((item: any) => item.request.pr_code).join(', ');

                setFormData(prev => ({
                    ...prev,
                    purchase_requisition_ids: selectedValues,
                    internal_document_number: selectedPRCodes
                }));

                // Merge all items from all non-zero selections
                const allItems = nonZeroSelections.flatMap((item: any) => item.request.purchase_requisition_items.map((i: any) => ({
                    ...i,
                    quantity: i.remaining_quantity
                })));

                // Based on the form's type, set the appropriate items
                if (formData.type === 'Material') {
                    // setRawProducts(allItems);
                    // setOriginalProductState(allItems);
                    setRawProductForSelect(allItems);
                } else if (formData.type === 'Service') {
                    setServiceItems(allItems); // Assuming a similar structure for services
                }
            } else {
                // Handle the case where all selections are zero or empty
                setFormData(prev => ({
                    ...prev,
                    purchase_requisition_ids: '0',
                    internal_document_number: ''
                }));
                setRawProducts([]);
                setServiceItems([]);
                setOriginalProductState([]);
                setRawProductForSelect([]);
            }
        } else {
            setFormData(prev => ({
                ...prev,
                purchase_requisition_ids: '0',
                internal_document_number: ''
            }));
            setRawProducts([]);
            setServiceItems([]);
            setSelectedPR([]);
            setOriginalProductState([]);
            setRawProductForSelect([]);
        }
    };

    const handleVehicleSubmit = (value: any) => {
        setContentType('multipart/form-data');
        setAuthToken(token);
        dispatch(storeVehicle(value));
    };

    const handleLpoTypeChange = (e: any) => {
        if (e && typeof e !== 'undefined') {
            setFormData(prev => ({
                ...prev,
                type: e.value
            }));
            if (e.value !== '') {
                setShowItemDetail({
                    show: true,
                    type: e.value
                });
                dispatch(getPurchaseRequisitionByStatuses({ type: e.value, statuses: ['Pending', 'Partial'] }));
            } else {
                setShowItemDetail({
                    show: false,
                    type: null
                });
                setPurchaseRequestOptions([{ value: 0, label: 'Skip Requisition' }]);
                dispatch(getPurchaseRequisitionByStatuses({ type: e.value, statuses: ['Pending', 'Partial'] }));
            }
        } else {
            setShowItemDetail({
                show: false,
                type: null
            });
            setFormData(prev => ({
                ...prev,
                type: ''
            }));
            setPurchaseRequestOptions([{ value: 0, label: 'Skip Requisition' }]);
        }
    };

    useEffect(() => {
        dispatch(clearPurchaseRequisitionState());
        setAuthToken(token);
        setContentType('application/json');
        dispatch(clearVendorState());
        dispatch(getVendors());
        dispatch(getCurrencies());
        dispatch(clearVehicleState());
        dispatch(getVehicles());
        dispatch(getEmployees());
        dispatch(clearUtilState());
        dispatch(generateCode(FORM_CODE_TYPE.LOCAL_PURCHASE_ORDER));
        dispatch(generateCode(FORM_CODE_TYPE.PURCHASE_REQUISITION));
        dispatch(getTaxCategories());
    }, []);

    useEffect(() => {
        if (code) {
            if (code[FORM_CODE_TYPE.LOCAL_PURCHASE_ORDER]) {
                setFormData(prev => ({
                    ...prev,
                    lpo_number: code[FORM_CODE_TYPE.LOCAL_PURCHASE_ORDER]
                }));
            }

            if (code[FORM_CODE_TYPE.PURCHASE_REQUISITION]) {
                setFormData(prev => ({
                    ...prev,
                    internal_document_number: code[FORM_CODE_TYPE.PURCHASE_REQUISITION]
                }));
            }
        }

    }, [code]);

    useEffect(() => {
        if (allVendors) {
            setVendorOptions(allVendors.map((vendor: any) => ({
                value: vendor.id,
                label: vendor.name,
                vendor: vendor
            })));
        }
    }, [allVendors]);

    useEffect(() => {
        if (purchaseRequests) {
            setPurchaseRequestOptions([
                { value: 0, label: 'Skip Requisition', request: {} },
                ...purchaseRequests.map((request: any) => ({
                    value: request.id,
                    label: `${request.pr_title} (${request.pr_code})`,
                    request: request
                }))
            ]);
        }
    }, [purchaseRequests]);

    useEffect(() => {
        if (representatives) {
            setVendorRepresentativeOptions(representatives.map((representative: any) => ({
                value: representative.id,
                label: representative.name,
                representative: representative
            })));
        }
    }, [representatives]);

    useEffect(() => {
        if (currencies) {
            setCurrencyOptions(currencies.map((currency: any) => ({
                value: currency.id,
                label: currency.code,
                currency: currency
            })));
        }
    }, [currencies]);

    useEffect(() => {
        if (vehicle) {
            dispatch(getVehicles());
            setVehicleModalOpen(false);
            dispatch(clearVehicleState());
        }
    }, [vehicle]);

    useEffect(() => {
        if (vehicles) {
            setVehicleOptions(vehicles.map((vehicle: any) => ({
                value: vehicle.id,
                label: vehicle.make + '-' + vehicle.model + ' (' + vehicle.number_plate + ')',
                vehicle: vehicle
            })));
        }
    }, [vehicles]);

    useEffect(() => {
        const newRawProductForSelect = originalProductState.filter(op =>
            !rawProducts.some(rp => rp.raw_product_id === op.raw_product_id && rp.purchase_requisition_id === op.purchase_requisition_id)
        );

        if (newRawProductForSelect.length > 0) {
            setRawProductForSelect((prev: any) => [...prev, ...newRawProductForSelect]);
        }
    }, [rawProducts, originalProductState]);

    return (
        <form className="space-y-5" onSubmit={(e) => handleSubmit(e)}>
            <div className="flex justify-start flex-col items-start space-y-3">
                <div className="flex flex-col md:flex-row gap-3 items-center w-full">
                    <Dropdown
                        divClasses="w-full"
                        label="Type"
                        name="type"
                        options={lpoTypeOptions}
                        value={formData.type}
                        onChange={(e: any) => handleLpoTypeChange(e)}
                    />

                    <div className="flex justify-between items-end w-full gap-3">
                        <Dropdown
                            divClasses="w-full"
                            label="Purchase Requisition"
                            name="purchase_requisition_id"
                            options={purchaseRequestOptions}
                            formatOptionLabel={({ value, label, request }: any) => {
                                if (value === 0) {
                                    return label;
                                }
                                return (
                                    <div className="flex flex-col justify-start">
                                        <span style={{ fontSize: 10 }}>{request.type}</span>
                                        <span>{label}</span>
                                    </div>
                                );
                            }}
                            value={formData.purchase_requisition_ids}
                            onChange={(e: any) => handlePurchaseRequisitionChange(e)}
                            isMulti={true}
                        />
                        <Button
                            type={ButtonType.button}
                            text="Select Items"
                            variant={ButtonVariant.primary}
                            size={ButtonSize.small}
                            onClick={() => setItemModalOpen(true)}
                            disabled={rawProductForSelect.length === 0}
                        />
                    </div>
                </div>

                <div className="border rounded p-5 w-full">
                    <h3 className="text-lg font-semibold">Basic Details</h3>
                    <hr className="my-3" />
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-4 w-full my-5">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                            <Input
                                divClasses="w-full"
                                label="LPO Number"
                                type="text"
                                name="lpo_number"
                                value={formData.lpo_number}
                                onChange={handleChange}
                                isMasked={false}
                                placeholder="Enter LPO Number"
                                disabled={true}
                            />

                            <Input
                                divClasses={`w-full ${formData.purchase_requisition_ids !== '0' ? 'hide' : ''}`}
                                label="Internal Document Number"
                                type="text"
                                name="internal_document_number"
                                value={formData.internal_document_number}
                                onChange={handleChange}
                                placeholder="Enter Internal Document Number"
                                isMasked={false}
                                disabled={true}
                            />
                            <Dropdown
                                divClasses="w-full"
                                label="Status"
                                name="status_id"
                                options={requisitionStatusOptions}
                                value={formData.status}
                                onChange={(e: any) => {
                                    if (e && typeof e !== 'undefined') {
                                        setFormData(prev => ({
                                            ...prev,
                                            status: e.value
                                        }));
                                    } else {
                                        setFormData(prev => ({
                                            ...prev,
                                            status: ''
                                        }));
                                    }
                                }}
                            />


                            <Input
                                divClasses="w-full"
                                label="Delivery Due Days"
                                type="number"
                                step="any"
                                name="delivery_due_in_days"
                                value={formData.delivery_due_in_days.toString()}
                                onChange={handleChange}
                                isMasked={false}
                                placeholder="Delivery Due Days"
                            />

                            <Input
                                divClasses="w-full"
                                label="Delivery Due Date"
                                type="text"
                                name="delivery_due_date"
                                value={formData.delivery_due_date}
                                onChange={handleChange}
                                isMasked={false}
                                placeholder="Delivery Due Date"
                                disabled={true}
                            />

                            <Input
                                divClasses="w-full"
                                label="Payment Terms (Days)"
                                type="number"
                                step="any"
                                name="payment_terms_in_days"
                                value={formData.payment_terms_in_days.toString()}
                                onChange={handleChange}
                                isMasked={false}
                                placeholder="Payment Terms (Days)"
                            />

                            <Dropdown
                                divClasses="w-full"
                                label="Currency"
                                name="currency_id"
                                options={currencyOptions}
                                value={formData.currency_id}
                                onChange={(e: any) => {
                                    if (e && typeof e !== 'undefined') {
                                        setFormData(prev => ({
                                            ...prev,
                                            currency_id: e.value
                                        }));
                                    } else {
                                        setFormData(prev => ({
                                            ...prev,
                                            currency_id: 0
                                        }));
                                    }
                                }}
                            />

                            <Dropdown
                                divClasses="w-full"
                                label="Vendor"
                                name="vendor_id"
                                options={vendorOptions}
                                value={formData.vendor_id}
                                onChange={(e: any) => handleVendorChange(e)}
                            />
                            <Dropdown
                                divClasses="w-full"
                                label="Vendor Representative"
                                name="vendor_representatative_id"
                                options={vendorRepresentativeOptions}
                                value={formData.vendor_representative_id}
                                onChange={(e: any) => handleRepresentativeChange(e)}
                            />
                        </div>
                        <div className="w-full space-y-3"
                             hidden={showItemDetail.type !== 'Material' && showItemDetail.type !== ''}>
                            <div className="w-full flex justify-between items-end gap-3">
                                <Dropdown
                                    divClasses="w-full"
                                    label="Shipped Via (Vehicle)"
                                    name="purchase_requisition_id"
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
                                    <Image priority={true} src={serverFilePath(vehicleDetail.thumbnail)}
                                           alt="Vehicle Image"
                                           height={100} width={100} />
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

                <Textarea
                    divClasses="w-full"
                    label="Terms & Conditions"
                    name="terms_conditions"
                    value={formData.terms_conditions}
                    onChange={(e) => setFormData((prev: any) => ({ ...prev, terms_conditions: e }))}
                    isReactQuill={true}
                />

                {showItemDetail.show && (
                    <>
                        {showItemDetail.type === 'Material'
                            ? (
                                <RawProductItemListing
                                    rawProducts={rawProducts}
                                    originalProducts={originalProductState}
                                    type={RAW_PRODUCT_LIST_TYPE.LOCAL_PURCHASE_ORDER}
                                    setRawProducts={setRawProducts}
                                />
                            ) : showItemDetail.type === 'Service'
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

            <Modal
                // key={rawProductForSelect.length}
                show={itemModalOpen}
                setShow={setItemModalOpen}
                title="Select Items"
                size={'5xl'}
            >
                <table>
                    <thead>
                    <tr>
                        <th>PR</th>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Unit Price</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {rawProductForSelect.map((product: any, index: number) => (
                        <tr key={index}>
                            <td>{product.purchase_requisition?.pr_code}</td>
                            <td>{product.raw_product?.item_code}</td>
                            <td>{product.quantity}</td>
                            <td>{product.unit_price}</td>
                            <td>
                                <Button
                                    type={ButtonType.button}
                                    text="Add"
                                    variant={ButtonVariant.primary}
                                    onClick={() => {
                                        setRawProducts([
                                            ...rawProducts,
                                            {
                                                status: 'Completed',
                                                purchase_requisition_item_id: product.purchase_requisition_item_id, // set the parent purchase requisition id
                                                purchase_requisition_id: product.purchase_requisition_id, // set the parent purchase requisition id
                                                raw_product_id: product.raw_product_id,
                                                quantity: parseInt(product.quantity),
                                                unit_id: product.unit_id,
                                                unit_price: parseFloat(product.unit_price),
                                                sub_total: parseFloat(product.unit_price) * parseInt(product.quantity),
                                                description: product.description || '',
                                                tax_category_id: taxCategories?.find((tc: any) => tc.name==='VAT')?.id || 0,
                                                tax_rate: taxCategories?.find((tc: any) => tc.name==='VAT')?.rate || 0,
                                                tax_amount: parseFloat(product.unit_price) * parseInt(product.quantity) * (taxCategories?.find((tc: any) => tc.name==='VAT')?.rate || 0) / 100,
                                                grand_total: parseFloat(product.unit_price) * parseInt(product.quantity) + parseFloat(product.unit_price) * parseInt(product.quantity) * (taxCategories?.find((tc: any) => tc.name==='VAT')?.rate || 0) / 100
                                            }
                                        ]);
                                        setOriginalProductState([
                                            ...originalProductState,
                                            product
                                        ]);
                                        setRawProductForSelect(rawProductForSelect.filter((item: any) => item.id !== product.id));
                                        // setItemModalOpen(false)
                                    }}
                                />
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </Modal>

            {/*<LPOServiceModal*/}
            {/*    modalOpen={serviceModalOpen}*/}
            {/*    setModalOpen={setServiceModalOpen}*/}
            {/*    handleSubmit={(val) => handleAddItemRow(val, 'Service')}*/}
            {/*/>*/}
        </form>
    );
};

export default LPOForm;
