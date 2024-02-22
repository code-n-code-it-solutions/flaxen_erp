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
import {getLPOByStatuses, storeLPO} from "@/store/slices/localPurchaseOrderSlice";
import {clearGoodReceiveNoteState, storeGRN} from "@/store/slices/goodReceiveNoteSlice";
import lpo from "@/pages/purchase/lpo";
import {clearUtilState, generateCode} from "@/store/slices/utilSlice";
import {FORM_CODE_TYPE} from "@/utils/enums";

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

interface IRawProduct {
    type: string | 'add';
    id: number;
    raw_product_id: number;
    raw_product_title: string;
    quantity: number;
    received_quantity: number;
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

const GoodReceiveNoteForm = ({id}: IFormProps) => {
    const dispatch = useDispatch<ThunkDispatch<IRootState, any, AnyAction>>();
    const {token, user} = useSelector((state: IRootState) => state.user);
    const {success, loading} = useSelector((state: IRootState) => state.goodReceiveNote);
    const {allLPOs} = useSelector((state: IRootState) => state.localPurchaseOrder);
    const {code} = useSelector((state: IRootState) => state.util);
    const [rawProductModalOpen, setRawProductModalOpen] = useState<boolean>(false);
    const [rawProducts, setRawProducts] = useState<IRawProduct[]>([]);
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
        console.log(user)
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
            console.log(e)
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
                setRawProducts(prevState => (
                    e.lpo.items.map((item: any) => ({
                        raw_product_id: item.raw_product_id,
                        raw_product_title: item.raw_product.title + ' (' + item.raw_product.item_code + ')',
                        quantity: parseInt(item.quantity),
                        received_quantity: 0,
                        unit_id: item.unit_id,
                        unit_title: item.unit.short_name,
                        unit_price: parseFloat(item.unit_price),
                        total: parseFloat(item.unit_price) * parseInt(item.quantity),
                        description: item.description || '',
                        tax_category_name: item.tax_category?.name,
                        tax_category_id: item.tax_category_id,
                        tax_rate: item.tax_rate,
                        tax_amount: item.tax_amount,
                        row_total: item.unit_price * item.quantity
                    }))
                ))
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
        }
    }

    useEffect(() => {
        dispatch(clearGoodReceiveNoteState())
        setAuthToken(token)
        setContentType('application/json')
        dispatch(getLPOByStatuses({statuses: ['Pending']}))
        dispatch(clearUtilState())
        dispatch(generateCode(FORM_CODE_TYPE.GOOD_RECEIVE_NOTE))
    }, [])

    useEffect(() => {
        if (code) {
            setFormData(prev => ({
                ...prev,
                grn_number: code
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
    }, [allLPOs])

    return (
        <form className="space-y-5" onSubmit={(e) => handleSubmit(e)}>
            <div className="flex justify-start flex-col items-start space-y-3">
                <div className="w-full md:w-1/2">
                    <label htmlFor="purchase_requisition_id">LPO</label>
                    <Select
                        defaultValue={localPurchaseOrderOptions[0]}
                        options={localPurchaseOrderOptions}
                        isSearchable={true}
                        isClearable={true}
                        placeholder={'Select LPO'}
                        onChange={(e: any) => handleLPOChange(e)}
                    />
                </div>
                <div className="w-full md:w-1/2">
                    <label htmlFor="status">Status</label>
                    <Select
                        defaultValue={statusOptions[0]}
                        options={statusOptions}
                        isSearchable={true}
                        isClearable={true}
                        placeholder={'Select Status'}
                        onChange={(e: any) => setFormData(prev => ({
                            ...prev,
                            status: e && typeof e !== 'undefined' ? e.value : ''
                        }))}
                    />
                </div>
                <div className="w-full md:w-1/2">
                    <label htmlFor="grn_number">Good Receive Note Number</label>
                    <input
                        type="text"
                        className="form-input"
                        placeholder="Good Receive Note Number"
                        disabled={true}
                        value={formData.grn_number}
                        onChange={(e: any) =>
                            setFormData(prev => ({
                                ...prev,
                                grn_number: e.target.value
                            }))
                        }
                    />
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
                                <strong>Purchase By: </strong>
                                <span>{lpoDetails.purchased_by?.name}</span>
                            </div>
                            <div className="w-full">
                                <strong>Received By: </strong>
                                <span>{lpoDetails.received_by?.name}</span>
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

                    <div className="border rounded p-5 w-full">
                        <div className="table-responsive w-full">
                            <div
                                className="flex justify-between items-center flex-col md:flex-row space-y-3 md:space-y-0 mb-3">
                                <h3 className="text-lg font-semibold">Item Details</h3>
                            </div>
                            <table>
                                <thead>
                                <tr>
                                    <th>Raw Product</th>
                                    <th>Description</th>
                                    <th>Unit</th>
                                    <th>Quantity</th>
                                    <th>Received Quantity</th>
                                    <th>Unit Price</th>
                                    <th>Total</th>
                                    <th>Tax Category</th>
                                    <th>Tax Rate(%)</th>
                                    <th>Tax Amount</th>
                                    <th>Row Total</th>
                                    {/*<th>Action</th>*/}
                                </tr>
                                </thead>
                                <tbody>
                                {rawProducts.map((product, index) => (
                                    <tr key={index}>
                                        <td>{product.raw_product_title}</td>
                                        <td>{product.description}</td>
                                        <td>{product.unit_title}</td>
                                        <td>{product.quantity}</td>
                                        <td>
                                            <input
                                                type="number"
                                                className="form-input"
                                                name="received_quantity"
                                                value={product.received_quantity}
                                                onChange={(e) => {
                                                    const {value} = e.target;
                                                    setRawProducts((prev: any) => {
                                                        return prev.map((item: any, i: number) => {
                                                            if (i === index) {
                                                                return {...item, received_quantity: parseInt(value)};
                                                            }
                                                            return item;
                                                        });
                                                    });
                                                }}
                                            />
                                        </td>
                                        <td>{product.unit_price}</td>
                                        <td>{product.total}</td>
                                        <td>{product.tax_category_name}</td>
                                        <td>{product.tax_rate}</td>
                                        <td>{product.tax_amount}</td>
                                        <td>{product.row_total}</td>
                                        {/*<td>*/}
                                        {/*    <div className="flex gap-3 items-center">*/}
                                        {/*        <button*/}
                                        {/*            type="button"*/}
                                        {/*            className="btn btn-outline-primary btn-sm"*/}
                                        {/*            onClick={() => handleEditItem(index)}*/}
                                        {/*        >*/}
                                        {/*            Edit*/}
                                        {/*        </button>*/}
                                        {/*        <button*/}
                                        {/*            type="button"*/}
                                        {/*            onClick={() => handleRemoveItem(index)}*/}
                                        {/*            className="btn btn-outline-danger btn-sm"*/}
                                        {/*        >*/}
                                        {/*            Delete*/}
                                        {/*        </button>*/}
                                        {/*    </div>*/}
                                        {/*</td>*/}
                                    </tr>
                                ))}
                                {rawProducts.length === 0 ? (
                                    <tr>
                                        <td colSpan={11} className="text-center">No Item Added</td>
                                    </tr>
                                ) : (
                                    <tr>
                                        <td colSpan={3} className="font-bold text-center">Total</td>
                                        <td className="text-left font-bold">{rawProducts.reduce((acc: number, item) => acc + item.quantity, 0)}</td>
                                        <td className="text-left font-bold">{rawProducts.reduce((acc: number, item) => acc + item.received_quantity, 0)}</td>
                                        <td className="text-left font-bold">{rawProducts.reduce((acc: number, item) => acc + item.unit_price, 0)}</td>
                                        <td className="text-left font-bold">{rawProducts.reduce((acc: number, item) => acc + item.total, 0)}</td>
                                        <td></td>
                                        <td></td>
                                        <td className="text-left font-bold">{rawProducts.reduce((acc: number, item) => acc + item.tax_amount, 0)}</td>
                                        <td className="text-left font-bold">{rawProducts.reduce((acc: number, item) => acc + item.row_total, 0)}</td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="w-full flex justify-center items-center flex-col md:flex-row gap-3">
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                    >
                        {loading ? 'Loading...' : 'Save Good Receive Note'}
                    </button>
                    <button
                        type="button"
                        onClick={() => window.location.reload()}
                        className="btn btn-info"
                    >
                        Clear
                    </button>
                </div>
            </div>
        </form>
    );
};

export default GoodReceiveNoteForm;
