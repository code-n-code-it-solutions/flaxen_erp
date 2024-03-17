"use client";
import React, { useEffect, useState } from 'react';
import { setAuthToken, setContentType } from "@/configs/api.config";
import { useDispatch, useSelector } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { IRootState } from "@/store";
import { AnyAction } from "redux";
import Select from "react-select";
import { getGRN } from "@/store/slices/goodReceiveNoteSlice";
import { clearVendorBillState, storeVendorBill } from "@/store/slices/vendorBillSlice";
import { clearUtilState, generateCode } from "@/store/slices/utilSlice";
import { ButtonSize, ButtonType, ButtonVariant } from "@/utils/enums";
import { FORM_CODE_TYPE } from "@/utils/enums";
import { Input } from '@/components/form/Input';
import { Dropdown } from '@/components/form/Dropdown';
import Button from '@/components/Button';

interface IFormData {
    purchase_requisition_id: number;
    local_purchase_order_id: number;
    good_receive_note_id: number;
    bill_number: string;
    bill_amount: number;
    paid_amount: number;
    balance: number;
    created_by: number
    updated_by: number
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

const VendorBillForm = ({ id }: IFormProps) => {
    const dispatch = useDispatch<ThunkDispatch<IRootState, any, AnyAction>>();
    const { code } = useSelector((state: IRootState) => state.util);
    const { token, user } = useSelector((state: IRootState) => state.user);
    const { loading } = useSelector((state: IRootState) => state.goodReceiveNote);
    const { allGRNs } = useSelector((state: IRootState) => state.goodReceiveNote);
    const [rawProducts, setRawProducts] = useState<IRawProduct[]>([]);
    const [formData, setFormData] = useState<IFormData>({
        purchase_requisition_id: 0,
        local_purchase_order_id: 0,
        good_receive_note_id: 0,
        bill_number: '',
        bill_amount: 0,
        paid_amount: 0,
        balance: 0,
        created_by: user.id,
        updated_by: user.id
    });

    const [GRNOptions, setGRNOptions] = useState<any[]>([])
    const [grnDetails, setGRNDetails] = useState<any>({})

    const [showDetails, setShowDetails] = useState<boolean>(false)

    const [billAmount, setBillAmount] = useState<number>(0)
    const [balanceAmount, setBalanceAmount] = useState<number>(0)
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setAuthToken(token)
        if (id) {
            // dispatch(updateRawProduct(id, formData));
        } else {
            let final = {
                ...formData,
                bill_amount: billAmount,
            }
            dispatch(storeVendorBill(final));
        }
    };

    const handlePaidAmountChange = (e: any) => {
        if (e && typeof e !== 'undefined') {
            setFormData(prev => ({
                ...prev,
                paid_amount: e.target.value,
                balance: billAmount - e.target.value
            }))
            setBalanceAmount(billAmount - parseFloat(e.target.value))
        } else {
            setFormData(prev => ({
                ...prev,
                paid_amount: 0,
                balance: billAmount
            }))
            setBalanceAmount(billAmount)
        }
    }

    const handleGRNChange = (e: any) => {
        if (e && typeof e !== 'undefined') {
            console.log(e)
            setFormData(prev => ({
                ...prev,
                good_receive_note_id: e.value,
                purchase_requisition_id: e.grn.purchase_requisition_id,
                local_purchase_order_id: e.grn.local_purchase_order_id,
            }))
            setGRNDetails(e.grn)
            setShowDetails(true)
            if (e.grn.items?.length > 0) {
                setRawProducts(prevState => (
                    e.grn.items.map((item: any) => ({
                        raw_product_id: item.raw_product_id,
                        raw_product_title: item.raw_product.title + ' (' + item.raw_product.item_code + ')',
                        quantity: parseInt(item.quantity),
                        received_quantity: parseInt(item.received_quantity),
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
                good_receive_note_id: 0,
                purchase_requisition_id: 0,
                local_purchase_order_id: 0
            }))
            setGRNDetails({})
            setRawProducts([])
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
        if (code) {
            setFormData(prev => ({
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

    useEffect(() => {
        setBillAmount(rawProducts.reduce((acc: number, item) => acc + item.row_total, 0))
    }, [rawProducts]);

    return (
        <form className="space-y-5" onSubmit={(e) => handleSubmit(e)}>
            <div className="flex justify-start flex-col items-start space-y-3">
              
                <Dropdown
                    divClasses='w-full md:w-1/2'
                    label='Good Receive Note'
                    name=''
                    options={GRNOptions}
                    value={''}
                    onChange={(e: any) => handleGRNChange(e)}
                />
               
                <Input
                    divClasses='w-full md:w-1/2'
                    label='Vendor Bill Number'
                    type='text'
                    name='bill_number'
                    value=''
                    onChange={(e: any) => setFormData(
                        prev => ({
                            ...prev,
                            bill_number: e.target.value
                        })
                    )}
                    placeholder="Vendor Bill Number"
                    isMasked={false}
                    disabled={true}
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full">
                   
                    <Input
                        divClasses='w-full '
                        label='Bill Amount'
                        type='number'
                        name='bill_amount'
                        value=''
                        onChange={(e: any) => setBillAmount(parseFloat(e.target.value))}
                        placeholder="Bill Amount"
                        isMasked={false}
                        disabled={true}
                    />

                   
                    <Input
                        divClasses='w-full '
                        label='Bill Paid Amount'
                        type='number'
                        name='paid_amount'
                        value=''
                        onChange={(e: any) => setBillAmount(parseFloat(e.target.value))}
                        placeholder="Piad Amount"
                        isMasked={false}
                        disabled={true}
                    />

                   

                    <Input
                        divClasses='w-full '
                        label='Balance Amount'
                        type='number'
                        name='balance'
                        value=''
                        onChange={(e: any) => {
                            setFormData(prev => ({
                                ...prev,
                                balance: billAmount - e.target.value
                            }))
                        }}
                        placeholder="Balance Amount"
                        isMasked={false}
                        disabled={true}
                    />

                </div>
                <div hidden={!showDetails} className="w-full space-y-3">
                    <div className="border rounded p-5 w-full">
                        <h3 className="text-lg font-semibold">Good Receive Note Details</h3>
                        <hr className="my-3" />
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full my-5">
                            <div className="w-full">
                                <strong>Requisition Number: </strong>
                                <span>{grnDetails.purchase_requisition?.pr_code}</span>
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
                                <strong>Purchase By: </strong>
                                <span>{grnDetails.local_purchase_order?.purchased_by?.name}</span>
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
                        <hr className="my-3" />
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
                                            <td>{product.received_quantity}</td>
                                            <td>{product.unit_price}</td>
                                            <td>{product.total}</td>
                                            <td>{product.tax_category_name}</td>
                                            <td>{product.tax_rate}</td>
                                            <td>{product.tax_amount}</td>
                                            <td>{product.row_total}</td>
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
                  
                    <Button
                        text={loading ? 'Loading...' : 'Save Vendor Bill'}
                        variant={ButtonVariant.primary}
                        disabled={loading}
                        size={ButtonSize.medium}
                    // onClick={() => setVendorAddressModal(true)}

                    />
                   
                    <Button
                        text='Clear'
                        variant={ButtonVariant.info}
                        size={ButtonSize.medium}
                        onClick={() => window?.location?.reload()}

                    />

                </div>
            </div>
        </form>
    );
};

export default VendorBillForm;
