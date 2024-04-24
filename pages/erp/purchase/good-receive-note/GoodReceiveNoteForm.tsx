"use client";
import React, {useEffect, useState} from 'react';
import {setAuthToken, setContentType} from "@/configs/api.config";
import {useDispatch, useSelector} from "react-redux";
import {ThunkDispatch} from "redux-thunk";
import {IRootState, useAppDispatch, useAppSelector} from "@/store";
import {AnyAction} from "redux";
import {getLPOByStatuses} from "@/store/slices/localPurchaseOrderSlice";
import {clearGoodReceiveNoteState, storeGRN} from "@/store/slices/goodReceiveNoteSlice";
import {clearUtilState, generateCode} from "@/store/slices/utilSlice";
import {ButtonSize, ButtonType, ButtonVariant, FORM_CODE_TYPE, RAW_PRODUCT_LIST_TYPE} from "@/utils/enums";
import {Dropdown} from "@/components/form/Dropdown";
import {Input} from "@/components/form/Input";
import RawProductItemListing from "@/components/listing/RawProductItemListing";
import ServiceItemListing from "@/components/listing/ServiceItemListing";
import Button from '@/components/Button';

interface IFormData {
    purchase_requisition_id: number;
    local_purchase_order_id: number;
    grn_number: string;
    received_by_id: number;
    verified_by_id: number;
    status: string;
    description: string;
    items: any[];
}

interface IFormProps {
    id?: any
}

const GoodReceiveNoteForm = ({id}: IFormProps) => {
    const dispatch = useAppDispatch();
    const {token, user} = useAppSelector(state => state.user);
    const {success, loading} = useAppSelector(state => state.goodReceiveNote);
    const {allLPOs} = useAppSelector(state => state.localPurchaseOrder);
    const {code} = useAppSelector(state => state.util);
    const [rawProductModalOpen, setRawProductModalOpen] = useState<boolean>(false);
    const [rawProducts, setRawProducts] = useState<any[]>([]);
    const [serviceItems, setServiceItems] = useState<any[]>([]);
    const [formData, setFormData] = useState<IFormData>({
        purchase_requisition_id: 0,
        local_purchase_order_id: 0,
        grn_number: '',
        received_by_id: 0,
        verified_by_id: 0,
        status: '',
        description: '',
        items: []
    });
    const [showItemDetail, setShowItemDetail] = useState<any>({
        show: false,
        type: null
    });
    const [localPurchaseOrderOptions, setLocalPurchaseOrderOptions] = useState<any[]>([])
    const [lpoDetails, setLPODetails] = useState<any>({})

    const [showDetails, setShowDetails] = useState<boolean>(true)

    const [itemDetail, setItemDetail] = useState<any>({})
    const [statusOptions, setStatusOptions] = useState<any[]>([
        {value: '', label: 'Select Status'},
        {value: 'Draft', label: 'Draft'},
        {value: 'Pending', label: 'Proceed'},
    ]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setAuthToken(token)
        // console.log(user)
        let finalData = {
            ...formData,
            user_id: user.id,
            items: rawProducts.map((product: any) => {
                return {
                    raw_product_id: product.raw_product_id,
                    quantity: product.quantity,
                    received_quantity: product.received_quantity,
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
            dispatch(storeGRN(finalData));
        }
    };

    const handleLPOChange = (e: any) => {
        if (e && typeof e !== 'undefined') {
            // console.log(e)
            setFormData(prev => ({
                ...prev,
                local_purchase_order_id: e.value,
                purchase_requisition_id: e.lpo.purchase_requisition_id,
                received_by_id: e.lpo.received_by_id,
                verified_by_id: e.lpo.received_by_id
            }))
            setLPODetails(e.lpo)
            setShowDetails(false)
            if (e.lpo.items?.length > 0) {
                setShowItemDetail({
                    show: true,
                    type: e.lpo.type
                })
                // console.log(e.lpo)
                if (e.lpo.type === 'Material') {
                    setRawProducts(prevState => (
                        e.lpo.processedRawMaterials.map((item: any) => ({
                            raw_product_id: item.raw_product_id,
                            quantity: parseInt(item.quantity),
                            received_quantity: parseInt(item.quantity),
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
                } else if (e.lpo.type === 'Service') {
                    setServiceItems(prevState => (
                        e.lpo.items.map((item: any) => ({
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
                } else {
                    setRawProducts([])
                    setServiceItems([])
                    // setMiscellaneousItems([])
                }

            } else {
                setShowItemDetail({
                    show: false,
                    type: null
                })
            }
        } else {
            setFormData(prev => ({
                ...prev,
                local_purchase_order_id: 0,
                purchase_requisition_id: 0
            }))
            setLPODetails({})
            setRawProducts([])
            setShowDetails(true)
            setShowItemDetail({
                show: false,
                type: null
            })
        }
    }

    useEffect(() => {
        dispatch(clearGoodReceiveNoteState())
        setAuthToken(token)
        setContentType('application/json')
        dispatch(getLPOByStatuses({statuses: ['Pending', 'Partial']}))
        dispatch(clearUtilState())
        dispatch(generateCode(FORM_CODE_TYPE.GOOD_RECEIVE_NOTE))
    }, [])

    useEffect(() => {
        if (code) {
            setFormData(prev => ({
                ...prev,
                grn_number: code[FORM_CODE_TYPE.GOOD_RECEIVE_NOTE]
            }))
        }
    }, [code])

    useEffect(() => {
        if (!rawProductModalOpen) {
            setItemDetail({})
        }
    }, [rawProductModalOpen]);

    useEffect(() => {
        if (allLPOs) {
            setLocalPurchaseOrderOptions(allLPOs.map((lpo: any) => ({
                value: lpo.id,
                label: lpo.lpo_number,
                lpo: lpo
            })))
        }
        // console.log(allLPOs)
    }, [allLPOs])

    return (
        <form className="space-y-5" onSubmit={(e) => handleSubmit(e)}>
            <div className="flex flex-col md:flex-row gap-3 justify-between items-start">
                <div className="flex justify-start flex-col items-start space-y-3 w-full">
                    <div className="w-full flex flex-col md:flex-row gap-3 justify-between items-start">
                        <Dropdown
                            divClasses='w-full'
                            label='LPO'
                            name='local_purchase_order_id'
                            options={localPurchaseOrderOptions}
                            value={formData.local_purchase_order_id}
                            onChange={(e: any) => handleLPOChange(e)}
                        />

                        <Dropdown
                            divClasses='w-full'
                            label='Status'
                            name='status'
                            options={statusOptions}
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
                    </div>

                    <Input
                        divClasses="w-full"
                        label='Good Receive Note Number'
                        type='text'
                        name='grn_number'
                        value={formData.grn_number}
                        onChange={(e: any) =>
                            setFormData(prev => ({
                                ...prev,
                                grn_number: e.target.value
                            }))}
                        placeholder="Good Receive Note Number"
                        isMasked={false}
                        disabled={true}
                    />
                </div>
                <div className="w-full p-5 border rounded hidden md:block">
                    <h1 className="font-bold text-lg mb-3">Instructions</h1>
                    <ul className="list-inside list-decimal space-y-2">
                        <li>Make sure to select the LPO first</li>
                        <li>Then select the status</li>
                        <li>Then you can check the items</li>
                    </ul>
                </div>
            </div>

            <div hidden={showDetails} className="w-full space-y-3">
                <div className="border rounded p-5 w-full">
                    <h3 className="text-lg font-semibold">LPO Details</h3>
                    <hr className="my-3"/>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full my-5">
                        <div className="w-full">
                            <strong>Requisition Number: </strong>
                            <span>{lpoDetails.purchase_requisition?.pr_code}</span>
                        </div>

                        <div className="w-full">
                            <strong>LPO Number: </strong>
                            <span>{lpoDetails.lpo_number}</span>
                        </div>

                        <div className="w-full">
                            <strong>Internal Document Number: </strong>
                            <span>{lpoDetails.internal_document_number}</span>
                        </div>

                        <div className="w-full">
                            <strong>Shipped Via: </strong>
                            <span>
                                {lpoDetails.vehicle?.name + '-' + lpoDetails.vehicle?.make + ' (' + lpoDetails.vehicle?.number_plate + ')'}
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
                                    <td>{lpoDetails.vendor?.vendor_number}</td>
                                    <td>{lpoDetails.vendor?.name}</td>
                                    <td>
                                        {lpoDetails.vendor?.addresses?.map((address: any, index: number) => {
                                            if (address.type === 'billing') {
                                                return address.address + ', ' + address.city?.name + ', ' + address.state?.name + ', ' + address.country?.name
                                            }
                                        })}
                                    </td>
                                    <td>
                                        {lpoDetails.vendor?.addresses?.map((address: any, index: number) => {
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
                                    <td>{lpoDetails.vendor_representative?.name}</td>
                                    <td>{lpoDetails.vendor_representative?.phone}</td>
                                    <td>{lpoDetails.vendor_representative?.email}</td>
                                    <td>
                                        {lpoDetails.vendor_representative?.address + ', ' + lpoDetails.vendor_representative?.city?.name + ', ' + lpoDetails.vendor_representative?.state?.name + ', ' + lpoDetails.vendor_representative?.country?.name}
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                {showItemDetail.show && (
                    <div className="border rounded p-5 w-full">
                        <>
                            {showItemDetail.type === 'Material'
                                ? (
                                    <RawProductItemListing
                                        rawProducts={rawProducts}
                                        setRawProducts={setRawProducts}
                                        type={RAW_PRODUCT_LIST_TYPE.GOOD_RECEIVE_NOTE}
                                    />
                                )
                                : showItemDetail.type === 'Service'
                                    ? (
                                        <ServiceItemListing
                                            serviceItems={serviceItems}
                                            setServiceItems={setServiceItems}
                                            type={RAW_PRODUCT_LIST_TYPE.GOOD_RECEIVE_NOTE}
                                        />
                                    ) : <></>}
                        </>
                    </div>
                )}
            </div>

            <div className="w-full flex justify-center items-center flex-col md:flex-row gap-3">
                <Button
                    type={ButtonType.submit}
                    text={loading ? 'Loading...' : 'Save Good Receive Note'}
                    variant={ButtonVariant.primary}
                    disabled={loading && (!formData.local_purchase_order_id || formData.local_purchase_order_id===0) && !formData.status}
                    size={ButtonSize.medium}
                />

                <Button
                    text='Clear'
                    variant={ButtonVariant.info}
                    size={ButtonSize.medium}
                    onClick={() => window?.location?.reload()}

                />

            </div>
        </form>
    );
};

export default GoodReceiveNoteForm;
