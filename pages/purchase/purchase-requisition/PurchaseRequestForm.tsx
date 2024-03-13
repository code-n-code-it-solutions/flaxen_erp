import React, {useEffect, useState} from 'react';
import {setAuthToken, setContentType} from "@/configs/api.config";
import {useDispatch, useSelector} from "react-redux";
import {ThunkDispatch} from "redux-thunk";
import {IRootState} from "@/store";
import {AnyAction} from "redux";
import {clearPurchaseRequisitionState, storePurchaseRequest} from "@/store/slices/purchaseRequisitionSlice";
import PRRawProductModal from "@/components/specific-modal/purchase-requisition/PRRawProductModal";
import {clearUtilState, generateCode} from "@/store/slices/utilSlice";
import {ButtonType, ButtonVariant, FORM_CODE_TYPE, RAW_PRODUCT_LIST_TYPE} from "@/utils/enums";
import 'flatpickr/dist/flatpickr.css';
import PRServiceModal from "@/components/specific-modal/purchase-requisition/PRServiceModal";
import {Dropdown} from "@/components/form/Dropdown";
import {Input} from "@/components/form/Input";
import Button from "@/components/Button";
import RawProductItemListing from "@/components/RawProductItemListing";

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
    asset_names: string;
    asset_ids: string;
    quantity: number;
    description: string;
}

interface IFormProps {
    id?: any
}

const PurchaseRequestForm = ({id}: IFormProps) => {
    const dispatch = useDispatch<ThunkDispatch<IRootState, any, AnyAction>>();
    const {token, user} = useSelector((state: IRootState) => state.user);
    const {purchaseRequestDetail, loading} = useSelector((state: IRootState) => state.purchaseRequisition);
    const {code} = useSelector((state: IRootState) => state.util);

    const [rawProductModalOpen, setRawProductModalOpen] = useState<boolean>(false);
    const [serviceModalOpen, setServiceModalOpen] = useState<boolean>(false);
    const [showItemDetail, setShowItemDetail] = useState<any>({
        show: false,
        type: null
    });
    const [rawProducts, setRawProducts] = useState<IRawProduct[]>([]);
    const [serviceItems, setServiceItems] = useState<IServiceItems[]>([]);
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

    const handleChange = (name:string, value:any) => {
        setFormData(prevFormData => {
            return {...prevFormData, [name]: value};
        });
    };


    const handleAddItemRow = (value: any, type: string) => {
        if (type === 'Material') {
            setRawProducts(prev => ([...prev, value]));
            setRawProductModalOpen(false);
        } else {
            setServiceItems(prev => ([...prev, value]));
            setServiceModalOpen(false);
        }
    }

    const handleRemoveItem = (index: number, type: string) => {
        if (type === 'Material') {
            const newItems = rawProducts.filter((address, i) => i !== index);
            setRawProducts(newItems);
        } else {
            const newItems = serviceItems.filter((address, i) => i !== index);
            setServiceItems(newItems);
        }
    }

    const handleRequisitionTypeChange = (e: any) => {

        if (e && typeof e !== 'undefined') {
            setFormData(prev => ({
                ...prev,
                type: e.value
            }))
            setShowItemDetail({
                show: true,
                type: e.value
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
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setAuthToken(token)
        setContentType('multipart/form-data')
        let finalData = {
            ...formData,
            user_id: user.id,
            pr_code: code[FORM_CODE_TYPE.PURCHASE_REQUISITION],
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
                    ? serviceItems
                    : []
        }
        if (id) {
            // dispatch(updateRawProduct(id, formData));
        } else {
            // console.log(finalData)
            dispatch(storePurchaseRequest(formData));
        }
    };

    useEffect(() => {
        dispatch(clearPurchaseRequisitionState())
        setAuthToken(token)
        setContentType('application/json')
        dispatch(clearUtilState())
        setServiceModalOpen(false)
        setRawProductModalOpen(false)

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
    }, [code])

    return (
        <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="flex justify-start flex-col items-start space-y-3">
                <Dropdown
                    divClasses='w-full md:w-1/3'
                    label='Requistion Type'
                    name='type'
                    options={requisitionTypeOptions}
                    value={formData.type}
                    onChange={(e: any) => handleRequisitionTypeChange(e)}
                />
                <Input
                    divClasses='w-full md:w-1/3'
                    label='Purchase Request Code'
                    type='text'
                    name='pr_code'
                    placeholder="Enter Purchase Request Code"
                    value={formData.pr_code}
                    onChange={(e: any) => handleChange(e.target.name, e.target.value)}
                    disabled={true}
                    isMasked={false}
                />

                <Input
                    divClasses='w-full md:w-1/3'
                    label='Requisition Date'
                    type='date'
                    name='requisition_date'
                    placeholder="Select Date"
                    value={formData.pr_code}
                    onChange={(e: any) => handleChange('requisition_date', e[0].toLocaleDateString())}
                    isMasked={false}
                />

                <Dropdown
                    divClasses='w-full md:w-1/3'
                    label='Status'
                    name='status_id'
                    options={requisitionStatusOptions}
                    value={formData.type}
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

                <Input
                    divClasses='w-full md:w-1/2'
                    label='Purchase Request Name (Optional)'
                    type='text'
                    name='pr_title'
                    placeholder="Enter Purchase Request Name"
                    value={formData.pr_title}
                    onChange={(e: any) => handleChange(e.target.name, e.target.value)}
                    isMasked={false}
                    styles={{height: 45}}
                />

                <div className="table-responsive w-full">
                    {showItemDetail.show && showItemDetail.type==='Material' && (
                        <RawProductItemListing
                            rawProducts={rawProducts}
                            setRawProducts={setRawProducts}
                            type={RAW_PRODUCT_LIST_TYPE.PURCHASE_REQUISITION}
                        />
                    )}
                    {/*{showItemDetail.show && (*/}
                    {/*    <>*/}
                    {/*        <div*/}
                    {/*            className="flex justify-between items-center flex-col md:flex-row space-y-3 md:space-y-0 mb-3">*/}
                    {/*            <h3 className="text-lg font-semibold">Item Details</h3>*/}
                    {/*            <button*/}
                    {/*                type="button"*/}
                    {/*                className="btn btn-primary btn-sm"*/}
                    {/*                onClick={() => showItemDetail.type === 'Material' ? setRawProductModalOpen(true) : setServiceModalOpen(true)}*/}
                    {/*            >*/}
                    {/*                Add New Item*/}
                    {/*            </button>*/}
                    {/*        </div>*/}
                    {/*        {showItemDetail.type === 'Material'*/}
                    {/*            ? (*/}
                    {/*                <table>*/}
                    {/*                    <thead>*/}
                    {/*                    <tr>*/}
                    {/*                        <th>Raw Product</th>*/}
                    {/*                        <th>Description</th>*/}
                    {/*                        <th>Unit</th>*/}
                    {/*                        <th>Quantity</th>*/}
                    {/*                        <th>Unit Price</th>*/}
                    {/*                        <th>Total</th>*/}
                    {/*                        <th>Action</th>*/}
                    {/*                    </tr>*/}
                    {/*                    </thead>*/}
                    {/*                    <tbody>*/}
                    {/*                    {rawProducts.map((product, index) => (*/}
                    {/*                        <tr key={index}>*/}
                    {/*                            <td>{product.raw_product_title}</td>*/}
                    {/*                            <td>{product.description}</td>*/}
                    {/*                            <td>{product.unit_title}</td>*/}
                    {/*                            <td>{product.quantity}</td>*/}
                    {/*                            <td>{product.unit_price}</td>*/}
                    {/*                            <td>{product.total}</td>*/}
                    {/*                            <td>*/}
                    {/*                                <button*/}
                    {/*                                    type="button"*/}
                    {/*                                    onClick={() => handleRemoveItem(index, 'Material')}*/}
                    {/*                                    className="btn btn-outline-danger btn-sm"*/}
                    {/*                                >*/}
                    {/*                                    Delete*/}
                    {/*                                </button>*/}
                    {/*                            </td>*/}
                    {/*                        </tr>*/}
                    {/*                    ))}*/}
                    {/*                    {rawProducts.length === 0 ? (*/}
                    {/*                        <tr>*/}
                    {/*                            <td colSpan={7} className="text-center">No Data Found</td>*/}
                    {/*                        </tr>*/}
                    {/*                    ) : (*/}
                    {/*                        <tr>*/}
                    {/*                            <td colSpan={3} className="text-right font-semibold">Total</td>*/}
                    {/*                            <td>{rawProducts.reduce((acc, curr) => acc + curr.quantity, 0)}</td>*/}
                    {/*                            <td>{rawProducts.reduce((acc, curr) => acc + curr.unit_price, 0)}</td>*/}
                    {/*                            <td>{rawProducts.reduce((acc, curr) => acc + curr.total, 0)}</td>*/}
                    {/*                        </tr>*/}
                    {/*                    )}*/}
                    {/*                    </tbody>*/}
                    {/*                </table>*/}
                    {/*            )*/}
                    {/*            : (*/}
                    {/*                <table>*/}
                    {/*                    <thead>*/}
                    {/*                    <tr>*/}
                    {/*                        <th>Asset</th>*/}
                    {/*                        <th>Service</th>*/}
                    {/*                        <th>Description</th>*/}
                    {/*                        <th>Quantity</th>*/}
                    {/*                        <th>Action</th>*/}
                    {/*                    </tr>*/}
                    {/*                    </thead>*/}
                    {/*                    <tbody>*/}
                    {/*                    {serviceItems.map((service, index) => (*/}
                    {/*                        <tr key={index}>*/}
                    {/*                            <td>{service.asset_names}</td>*/}
                    {/*                            <td>{service.name}</td>*/}
                    {/*                            <td>{service.description}</td>*/}
                    {/*                            <td>{service.quantity}</td>*/}
                    {/*                            <td>*/}
                    {/*                                <button*/}
                    {/*                                    type="button"*/}
                    {/*                                    onClick={() => handleRemoveItem(index, 'Service')}*/}
                    {/*                                    className="btn btn-outline-danger btn-sm"*/}
                    {/*                                >*/}
                    {/*                                    Delete*/}
                    {/*                                </button>*/}
                    {/*                            </td>*/}
                    {/*                        </tr>*/}
                    {/*                    ))}*/}
                    {/*                    </tbody>*/}
                    {/*                </table>*/}
                    {/*            )*/}
                    {/*        }*/}
                    {/*    </>*/}
                    {/*)}*/}

                </div>

                <div className="w-full">
                    <Button
                        type={ButtonType.submit}
                        text={loading ? 'Loading...' : id ? 'Update Purchase Request' : 'Save Purchase Request'}
                        variant={ButtonVariant.primary}
                        disabled={loading}
                    />
                </div>
            </div>
            <PRRawProductModal
                modal={rawProductModalOpen}
                setModal={setRawProductModalOpen}
                handleAddRawProduct={(value: any) => handleAddItemRow(value, 'Material')}
            />
            <PRServiceModal
                modalOpen={serviceModalOpen}
                setModalOpen={setServiceModalOpen}
                handleSubmit={(val) => handleAddItemRow(val, 'Service')}
            />
        </form>
    );
};

export default PurchaseRequestForm;
