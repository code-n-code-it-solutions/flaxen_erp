import React, {useEffect, useState} from 'react';
import {setAuthToken, setContentType} from "@/configs/api.config";
import {useAppDispatch, useAppSelector} from "@/store";
import {
    clearPurchaseRequisitionState,
    storePurchaseRequest,
    updatePurchaseRequisition
} from "@/store/slices/purchaseRequisitionSlice";
import {clearUtilState, generateCode} from "@/store/slices/utilSlice";
import {ButtonType, ButtonVariant, FORM_CODE_TYPE, RAW_PRODUCT_LIST_TYPE} from "@/utils/enums";
import 'flatpickr/dist/flatpickr.css';
import {Dropdown} from "@/components/form/Dropdown";
import {Input} from "@/components/form/Input";
import Button from "@/components/Button";
import RawProductItemListing from "@/components/listing/RawProductItemListing";
import ServiceItemListing from "@/components/listing/ServiceItemListing";
import Swal from 'sweetalert2';

interface IFormData {
    pr_title: string;
    pr_code: string;
    description: string;
    user_id: number;
    type: string,
    department_id: number | null;
    designation_id: number | null;
    requisition_date: string;
    status: string,
    items: any[];
}

interface IRawProduct {
    raw_product_id: number;
    raw_product_title: string;
    quantity: number;
    unit_id: number;
    unit_title: string;
    unit_price: number;
    total: number;
    description: string;
}

interface IServiceItems {
    name: string;
    asset_id: string;
    description: string;
}

interface IFormProps {
    id?: any
}

const PurchaseRequestForm = ({id}: IFormProps) => {
    const dispatch = useAppDispatch();
    const {token, user} = useAppSelector(state => state.user);
    const {purchaseRequestDetail, loading} = useAppSelector(state => state.purchaseRequisition);
    const {code} = useAppSelector(state => state.util);

    const [showItemDetail, setShowItemDetail] = useState<any>({
        show: false,
        type: null
    });
    const [rawProducts, setRawProducts] = useState<IRawProduct[]>([]);
    const [serviceItems, setServiceItems] = useState<IServiceItems[]>([]);
    const [errorMessages, setErrorMessages] = useState<any>({})
    const [formError, setFormError] = useState<string>('')
    const [isFormValid, setIsFormValid] = useState<boolean>(false)

    const [formData, setFormData] = useState<IFormData>({
        pr_title: '',
        pr_code: '',
        description: '',
        user_id: 0,
        type: '',
        department_id: 0,
        designation_id: 0,
        requisition_date: '',
        status: '',
        items: []
    });

    const [requisitionStatusOptions, setRequisitionStatusOptions] = useState<any[]>([
        {value: '', label: 'Select Status'},
        {value: 'Draft', label: 'Draft'},
        {value: 'Pending', label: 'Proceed'},
    ]);
    const [requisitionTypeOptions, setRequisitionTypeOptions] = useState<any[]>([
        {value: '', label: 'Select Type'},
        {value: 'Material', label: 'Material'},
        {value: 'Service', label: 'Service'},
    ]);

    const handleChange = (name: string, value: any, required: boolean) => {

        if (required) {
            if (!value) {
                setErrorMessages((prev: any) => ({...prev, [name]: 'This field is required'}))
            } else {
                setErrorMessages((prev: any) => {
                    delete prev[name]
                    return prev
                })
            }
        }

        switch (name) {
                case 'type':
                    if (value && typeof value !== 'undefined') {
                        setFormData(prev => ({
                            ...prev,
                        type: value.value
                    }))
                    setShowItemDetail({
                        show: true,
                        type: value.value
                    })
                } else {
                    setShowItemDetail({
                        show: false,
                        type: null
                    })
                    setFormData(prev => ({
                        ...prev,
                        type: ''
                    }))
                }
                break;
            case 'status':
                if (value && typeof value !== 'undefined') {
                    setFormData(prev => ({
                        ...prev,
                        status: value.value
                    }))
                } else {
                    setFormData(prev => ({
                        ...prev,
                        status: ''
                    }))
                }
                break
            default:
                setFormData(prevFormData => ({...prevFormData, [name]: value}));
                break;
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setAuthToken(token)
        dispatch(generateCode(FORM_CODE_TYPE.PURCHASE_REQUISITION))
        let finalData = {
            ...formData,
            user_id: user.id,
            pr_code: formData.pr_code, // Assuming pr_code is a string
            department_id: user.employee?.department_id,
            designation_id: user.employee?.designation_id,
            items: formData.type === 'Material'
                ? rawProducts.map((product: any) => {
                    return {
                        raw_product_id: product.raw_product_id,
                        unit_id: product.unit_id,
                        quantity: product.quantity,
                        unit_price: product.unit_price,
                        total_price: product.total,
                        description: product.description ? product.description : ''
                    }
                })
                : formData.type === 'Service'
                    ? serviceItems.map((service: any) => {
                        return {
                            name: service.name,
                            asset_id: service.asset_id,
                            description: service.description ? service.description : ''
                        }
                    })
                    : []
        }
        if (id) {
            dispatch(updatePurchaseRequisition({id, purchaseRequestData: finalData}));
        } else {
            if(rawProducts.length>0) {
                dispatch(storePurchaseRequest(finalData));
            } else {
                Swal.fire('Error', 'Please select at least one product', 'error')
            }
        }
    };

    useEffect(() => {
        dispatch(clearPurchaseRequisitionState())
        setAuthToken(token)
        setContentType('application/json')
        dispatch(clearUtilState())

        if (id) {
            // dispatch(editPurchaseRequisition(id))
        } else {
            dispatch(generateCode(FORM_CODE_TYPE.PURCHASE_REQUISITION))
        }
    }, [])

    useEffect(() => {
        if (code) {
            setFormData(prev => ({
                ...prev,
                pr_code: code[FORM_CODE_TYPE.PURCHASE_REQUISITION]
            }))
        }
    }, [code]);

    return (
        <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="flex justify-between items-start gap-5">
                <div className="flex justify-start flex-col items-start space-y-3 w-full">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-3 w-full">
                        <Dropdown
                            divClasses='w-full'
                            label='Requistion Type'
                            name='type'
                            options={requisitionTypeOptions}
                            value={formData.type}
                            onChange={(e: any) => handleChange('type', e, true)}
                            required={true}
                            errorMessage={errorMessages.type}
                        />
                        <Dropdown
                            divClasses='w-full'
                            label='Status'
                            name='status'
                            options={requisitionStatusOptions}
                            value={formData.status}
                            onChange={(e: any) => handleChange('status', e, true)}
                            required={true}
                            errorMessage={errorMessages.status}
                        />
                    </div>
                    <div className="flex flex-col md:flex-row justify-between items-center gap-3 w-full">
                        <Input
                            divClasses='w-full'
                            label='Purchase Request Code'
                            type='text'
                            name='pr_code'
                            placeholder="Enter Purchase Request Code"
                            value={formData.pr_code}
                            onChange={(e: any) => handleChange(e.target.name, e.target.value, e.target.required)}
                            disabled={true}
                            isMasked={false}
                        />

                        <Input
                            divClasses='w-full'
                            label='Requisition Date'
                            type='date'
                            name='requisition_date'
                            placeholder="Select Date"
                            value={formData.requisition_date}
                            onChange={(e: any) => handleChange('requisition_date', e[0].toLocaleDateString(), true)}
                            isMasked={false}
                            required={true}
                            errorMessage={errorMessages.requisition_date}
                        />
                    </div>

                    <Input
                        divClasses='w-full'
                        label='Purchase Request Name (Optional)'
                        type='text'
                        name='pr_title'
                        placeholder="Enter Purchase Request Name"
                        value={formData.pr_title}
                        onChange={(e: any) => handleChange(e.target.name, e.target.value, e.target.required)}
                        isMasked={false}
                        styles={{height: 45}}
                        required={true}
                        errorMessage={errorMessages.pr_title}
                    />
                </div>
                <div className="w-full p-5 border rounded hidden md:block">
                    <h1 className="font-bold text-lg mb-3">Instructions</h1>
                    <ul className="list-inside list-decimal space-y-2">
                        <li>Choose the type of requisition you want to create</li>
                        <li>Fill in the required fields</li>
                        <li>Click on the 'Add Item' button to add items to the requisition</li>
                        <li>Click on the 'Save Purchase Request' button to save the requisition</li>
                    </ul>
                </div>
            </div>

            {showItemDetail.show && showItemDetail.type === 'Material' && (
                <RawProductItemListing
                    rawProducts={rawProducts}
                    setRawProducts={setRawProducts}
                    type={RAW_PRODUCT_LIST_TYPE.PURCHASE_REQUISITION}
                />
            )}

            {showItemDetail.show && showItemDetail.type === 'Service' && (
                <ServiceItemListing
                    serviceItems={serviceItems}
                    setServiceItems={setServiceItems}
                    type={RAW_PRODUCT_LIST_TYPE.PURCHASE_REQUISITION}
                />
            )}

            <div className="w-full">
                <Button
                    type={ButtonType.submit}
                    text={loading ? 'Loading...' : id ? 'Update Purchase Request' : 'Save Purchase Request'}
                    variant={ButtonVariant.primary}
                    disabled={loading}
                />
            </div>
        </form>
    );
};

export default PurchaseRequestForm;
