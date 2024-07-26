"use client";
import React, {useEffect, useState} from 'react';
import {setAuthToken, setContentType} from "@/configs/api.config";
import {useAppDispatch, useAppSelector} from "@/store";
import {getGRN} from "@/store/slices/goodReceiveNoteSlice";
import {clearVendorBillState, storeVendorBill} from "@/store/slices/vendorBillSlice";
import {clearUtilState, generateCode} from "@/store/slices/utilSlice";
import {ButtonSize, ButtonType, ButtonVariant, RAW_PRODUCT_LIST_TYPE} from "@/utils/enums";
import {FORM_CODE_TYPE} from "@/utils/enums";
import {Input} from '@/components/form/Input';
import {Dropdown} from '@/components/form/Dropdown';
import Button from '@/components/Button';
import RawProductItemListing from "@/components/listing/RawProductItemListing";
import ServiceItemListing from "@/components/listing/ServiceItemListing";

interface IFormProps {
    id?: any
}

const VendorBillForm = ({id}: IFormProps) => {
    const dispatch = useAppDispatch();
    const {code} = useAppSelector(state => state.util);
    const {token, user} = useAppSelector(state => state.user);
    const {loading} = useAppSelector(state => state.vendorBill);
    const {allGRNs} = useAppSelector(state => state.goodReceiveNote);
    const [rawProducts, setRawProducts] = useState<any[]>([]);
    const [serviceItems, setServiceItems] = useState<any[]>([]);
    const [formData, setFormData] = useState<any>({});

    const [GRNOptions, setGRNOptions] = useState<any[]>([])
    const [grnDetails, setGRNDetails] = useState<any>({})
    const [showDetails, setShowDetails] = useState<boolean>(false)

    const handleChange = (name: string, value: any, required: boolean) => {
        if (required && !value) {
            return;
        }
        setFormData((prev: any) => ({
            ...prev,
            [name]: value
        }))
    }
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setAuthToken(token)
        if (id) {
            // dispatch(updateRawProduct(id, formData));
        } else {
            dispatch(storeVendorBill(formData));
        }
    };

    const handleGRNChange = (e: any) => {
        if (e && typeof e !== 'undefined') {
            // console.log(e)
            setFormData((prev: any) => ({
                ...prev,
                good_receive_note_id: e.value,
                purchase_requisition_id: e.grn.purchase_requisition_id,
                local_purchase_order_id: e.grn.local_purchase_order_id,
            }))
            setGRNDetails(e.grn)
            setShowDetails(true)

            // 'asset_id', 'service_name', 'description', 'cost', 'tax_category_id', 'tax_rate', 'tax_amount', 'grand_total'
            if (e.grn.type === 'Material') {
                if (e.grn.raw_products?.length > 0) {
                    setRawProducts(prevState => (
                        e.grn.raw_products.map((item: any) => ({
                            raw_product_id: item.raw_product_id,
                            description: item.description || '',
                            unit_id: item.unit_id,
                            quantity: parseInt(item.quantity),
                            received_quantity: parseInt(item.received_quantity),
                            unit_price: parseFloat(item.unit_price),
                            sub_total: parseFloat(item.unit_price) * parseInt(item.quantity),
                            tax_category_id: item.tax_category_id,
                            tax_rate: item.tax_rate,
                            tax_amount: item.tax_amount,
                            grand_total: parseFloat(item.unit_price) * parseInt(item.quantity) + item.tax_amount
                        }))
                    ))
                }

            } else {
                if (e.grn.service_items?.length > 0) {
                    setServiceItems(prevState => (
                        e.grn.service_items.map((item: any) => ({
                            service_name: item.service_name,
                            description: item.description || '',
                            cost: parseFloat(item.cost),
                            tax_category_id: item.tax_category_id,
                            tax_rate: item.tax_rate,
                            tax_amount: item.tax_amount,
                            grand_total: parseFloat(item.cost) + item.tax_amount
                        }))
                    ))
                }
            }
        } else {
            setFormData((prev: any) => ({
                ...prev,
                good_receive_note_id: 0,
                purchase_requisition_id: 0,
                local_purchase_order_id: 0,
                bill_amount: 0
            }))
            setGRNDetails({})
            setRawProducts([])
            setServiceItems([])
            setShowDetails(false)
        }
    }

    useEffect(() => {
        dispatch(clearVendorBillState())
        setAuthToken(token)
        setContentType('application/json')
        dispatch(getGRN())
        setShowDetails(false)
        dispatch(clearUtilState())
        dispatch(generateCode(FORM_CODE_TYPE.VENDOR_BILL))
    }, [])

    useEffect(() => {
        if (rawProducts.length > 0) {
            setFormData((prev: any) => ({
                ...prev,
                bill_amount: rawProducts.reduce((acc: number, item) => acc + parseFloat(item.grand_total), 0)
            }))
        }
        if (serviceItems.length > 0) {
            setFormData((prev: any) => ({
                ...prev,
                bill_amount: serviceItems.reduce((acc: number, item) => acc + parseFloat(item.grand_total), 0)
            }))
        }
    }, [rawProducts, serviceItems])

    useEffect(() => {
        if (code) {
            setFormData((prev: any) => ({
                ...prev,
                bill_number: code[FORM_CODE_TYPE.VENDOR_BILL]
            }))
        }
    }, [code])

    useEffect(() => {
        if (allGRNs) {
            setGRNOptions(allGRNs.map((grn: any) => ({
                value: grn.id,
                label: grn.grn_number,
                grn: grn
            })))
        }
    }, [allGRNs])

    return (
        <form className="space-y-5" onSubmit={(e) => handleSubmit(e)}>
            <div className="flex w-full flex-row items-start justify-between gap-3">
                <div className="flex justify-start flex-col items-start space-y-3 w-full">

                    <Dropdown
                        divClasses='w-full'
                        label='Good Receive Note'
                        name=''
                        options={GRNOptions}
                        value={formData.good_receive_note_id}
                        onChange={(e: any) => handleGRNChange(e)}
                    />

                    <Input
                        divClasses='w-full'
                        label='Vendor Bill Number'
                        type='text'
                        name='bill_number'
                        value={formData.bill_number}
                        onChange={(e: any) => handleChange(e.target.name, e.target.value, e.target.required)}
                        placeholder="Vendor Bill Number"
                        isMasked={false}
                        disabled={true}
                    />
                    <Input
                        divClasses='w-full'
                        label='Bill Amount'
                        type='number'
                        name='bill_amount'
                        value={formData.bill_amount}
                        onChange={(e: any) => handleChange(e.target.name, e.target.value, e.target.required)}
                        placeholder="Bill Amount"
                        isMasked={false}
                        disabled={true}
                    />
                    <Input
                        divClasses='w-full'
                        label='Invoice Number (Ref#)'
                        type='text'
                        name='invoice_number'
                        value={formData.invoice_number}
                        onChange={(e: any) => handleChange(e.target.name, e.target.value, e.target.required)}
                        placeholder="Invoice number from vendor invoice"
                        isMasked={false}
                    />

                </div>
                <div className="w-full border rounded p-5 hidden md:block">
                    <h5 className="text-lg font-semibold dark:text-white-light mb-3">Vendor Bill Instructions</h5>
                    <ul className="list-decimal list-inside space-y-2">
                        <li>Choose the Good Receive Note from the dropdown</li>
                        <li>Fill in the Invoice Number (Ref#) from the vendor invoice</li>
                        <li>Review the details of the Good Receive Note</li>
                        <li>Review the details of the Vendor</li>
                        <li>Review the details of the Vendor Representative</li>
                        <li>Review the details of the Vehicle</li>
                        <li>Review the details of the Items in it</li>
                    </ul>
                </div>
            </div>
            {/*</div>*/}
            <div hidden={!showDetails} className="w-full space-y-3">
                <div className="border rounded p-5 w-full">
                    <h3 className="text-lg font-semibold">Good Receive Note Details</h3>
                    <hr className="my-3"/>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full my-5">
                        <div className="w-full">
                            <strong>Requisition Number: </strong>
                            <span>{grnDetails?.local_purchase_order?.purchase_requisition?.pr_code}</span>
                        </div>

                        <div className="w-full">
                            <strong>LPO Number: </strong>
                            <span>{grnDetails.local_purchase_order?.lpo_number}</span>
                        </div>

                        <div className="w-full">
                            <strong>Internal Document Number: </strong>
                            <span>{grnDetails.local_purchase_order?.internal_document_number}</span>
                        </div>

                        <div className="w-full">
                            <strong>GRN #: </strong>
                            <span>{grnDetails.grn_number}</span>
                        </div>

                        <div className="w-full">
                            <strong>Received By: </strong>
                            <span>{grnDetails.received_by?.name}</span>
                        </div>

                        <div className="w-full">
                            <strong>Shipped Via: </strong>
                            <span>
                                {grnDetails.local_purchase_order?.vehicle?.name + '-' + grnDetails.local_purchase_order?.vehicle?.make + ' (' + grnDetails.local_purchase_order?.vehicle?.number_plate + ')'}
                            </span>
                        </div>
                    </div>
                    <hr className="my-3"/>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="table-responsive">
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
                                    <td>{grnDetails.local_purchase_order?.vendor?.vendor_number}</td>
                                    <td>{grnDetails.local_purchase_order?.vendor?.name}</td>
                                    <td>
                                        {grnDetails.local_purchase_order?.vendor?.addresses?.map((address: any, index: number) => {
                                            if (address.type === 'billing') {
                                                return address.address + ', ' + address.city?.name + ', ' + address.state?.name + ', ' + address.country?.name
                                            }
                                        })}
                                    </td>
                                    <td>
                                        {grnDetails.local_purchase_order?.vendor?.addresses?.map((address: any, index: number) => {
                                            if (address.type === 'shifting') {
                                                return address.address + ', ' + address.city?.name + ', ' + address.state?.name + ', ' + address.country?.name
                                            }
                                        })}
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="table-responsive">
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
                                    <td>{grnDetails.local_purchase_order?.vendor_representative?.name}</td>
                                    <td>{grnDetails.local_purchase_order?.vendor_representative?.phone}</td>
                                    <td>{grnDetails.local_purchase_order?.vendor_representative?.email}</td>
                                    <td>
                                        {grnDetails.local_purchase_order?.vendor_representative?.address + ', ' + grnDetails.local_purchase_order?.vendor_representative?.city?.name + ', ' + grnDetails.local_purchase_order?.vendor_representative?.state?.name + ', ' + grnDetails.local_purchase_order?.vendor_representative?.country?.name}
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                {grnDetails.type === 'Material'
                    ? rawProducts.length > 0 &&
                    <RawProductItemListing
                        // key={rawProducts.length}
                        rawProducts={rawProducts}
                        setRawProducts={setRawProducts}
                        type={RAW_PRODUCT_LIST_TYPE.VENDOR_BILL}
                    />
                    : serviceItems.length > 0 &&
                    <ServiceItemListing
                        // key={serviceItems.length}
                        serviceItems={serviceItems}
                        setServiceItems={setServiceItems}
                        type={RAW_PRODUCT_LIST_TYPE.VENDOR_BILL}
                    />
                }
            </div>

            <div className="w-full flex justify-center items-center flex-col md:flex-row gap-3">

                <Button
                    type={ButtonType.submit}
                    text={loading ? 'Loading...' : id ? 'Update Vendor Bill' : 'Save Vendor Bill'}
                    variant={ButtonVariant.primary}
                    disabled={loading}
                    size={ButtonSize.medium}
                />

                <Button
                    type={ButtonType.button}
                    text='Clear'
                    variant={ButtonVariant.info}
                    size={ButtonSize.medium}
                    onClick={() => window?.location?.reload()}
                />

            </div>
        </form>
    );
};

export default VendorBillForm;
