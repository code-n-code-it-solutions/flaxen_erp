import React, {useEffect, useState} from 'react';
import {setAuthToken, setContentType} from "@/configs/api.config";
import {useDispatch, useSelector} from "react-redux";
import {ThunkDispatch} from "redux-thunk";
import {IRootState} from "@/store";
import {AnyAction} from "redux";
import Select from "react-select";
import {useRouter} from "next/router";
import {
    clearPurchaseRequisitionState,
    getRequisitionStatues,
    storePurchaseRequest
} from "@/store/slices/purchaseRequisitionSlice";
import PRRawProductModal from "@/components/PRRawProductModal";
import {clearUtilState, generateCode} from "@/store/slices/utilSlice";
import {FORM_CODE_TYPE} from "@/utils/enums";

interface IFormData {
    pr_title: string;
    pr_code: string;
    description: string;
    user_id: number;
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

interface IFormProps {
    id?: any
}

const PurchaseRequestForm = ({id}: IFormProps) => {
    const dispatch = useDispatch<ThunkDispatch<IRootState, any, AnyAction>>();
    const {token, user} = useSelector((state: IRootState) => state.user);
    const {loading} = useSelector((state: IRootState) => state.purchaseRequisition);
    const {code} = useSelector((state: IRootState) => state.util);

    const [rawProductModalOpen, setRawProductModalOpen] = useState<boolean>(false);
    const [rawProducts, setRawProducts] = useState<IRawProduct[]>([]);
    const [formData, setFormData] = useState<IFormData>({
        pr_title: '',
        pr_code: '',
        description: '',
        user_id: 0,
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const {name, value} = e.target;
        setFormData(prevFormData => {
            return {...prevFormData, [name]: value};
        });
    };

    const handleAddItemRow = (value: any) => {
        setRawProducts(prev => ([...prev, value]));
        setRawProductModalOpen(false);
    }

    const handleRemoveItem = (index: number) => {
        const newItems = rawProducts.filter((address, i) => i !== index);
        setRawProducts(newItems);
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setAuthToken(token)
        setContentType('multipart/form-data')
        setFormData(prev => ({
            ...prev,
            user_id: user.id,
            department_id: user.employee?.department_id,
            designation_id: user.employee?.designation_id,
            items: rawProducts.map((product: any) => {
                return {
                    raw_product_id: product.raw_product_id,
                    unit_id: product.unit_id,
                    quantity: product.quantity,
                    unit_price: product.unit_price,
                    total_price: product.total,
                    description: product.description
                }
            })
        }))
        if (id) {
            // dispatch(updateRawProduct(id, formData));
        } else {
            dispatch(storePurchaseRequest(formData));
        }
    };

    useEffect(() => {
        dispatch(clearPurchaseRequisitionState())
        setAuthToken(token)
        setContentType('application/json')
        dispatch(clearUtilState())
        dispatch(generateCode(FORM_CODE_TYPE.PURCHASE_REQUISITION))
    }, [])

    useEffect(() => {
        if (code) {
            setFormData(prev => ({
                ...prev,
                pr_code: code
            }))
        }
    }, [code])

    return (
        <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="flex justify-start flex-col items-start space-y-3">
                <div className="w-full md:w-1/3">
                    <label htmlFor="pr_code">Purchase Request Code</label>
                    <input id="pr_code" type="text" name="pr_code" placeholder="Enter Purchase Request Code"
                           value={formData.pr_code} onChange={handleChange} disabled={true}
                           className="form-input"/>
                </div>
                <div className="w-full md:w-1/3">
                    <label htmlFor="requisition_date">Requisition Date</label>
                    <input id="requisition_date" type="date" name="requisition_date"
                           placeholder="Enter Purchase Request Date"
                           value={formData.requisition_date} onChange={handleChange}
                           className="form-input"/>
                </div>
                <div className="w-full md:w-1/3">
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

                <div className="w-full md:w-1/2">
                    <label htmlFor="pr_title">Purchase Request Name (Optional)</label>
                    <input id="pr_title" type="text" name="pr_title" placeholder="Enter Purchase Request Name"
                           value={formData.pr_title} onChange={handleChange}
                           className="form-input" style={{height: 45}}/>
                </div>


                <div className="table-responsive w-full">
                    <div className="flex justify-between items-center flex-col md:flex-row space-y-3 md:space-y-0 mb-3">
                        <h3 className="text-lg font-semibold">Item Details</h3>
                        <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            onClick={() => setRawProductModalOpen(true)}
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
                                <td>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveItem(index)}
                                        className="btn btn-outline-danger btn-sm"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {rawProducts.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="text-center">No Data Found</td>
                            </tr>
                        ) : (
                            <tr>
                                <td colSpan={3} className="text-right font-semibold">Total</td>
                                <td>{rawProducts.reduce((acc, curr) => acc + curr.quantity, 0)}</td>
                                <td>{rawProducts.reduce((acc, curr) => acc + curr.unit_price, 0)}</td>
                                <td>{rawProducts.reduce((acc, curr) => acc + curr.total, 0)}</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>

                <div className="w-full">
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                    >
                        {loading ? 'Loading...' : 'Save Purchase Request'}
                    </button>
                </div>
            </div>
            <PRRawProductModal
                modal={rawProductModalOpen}
                setModal={setRawProductModalOpen}
                handleAddRawProduct={(value: any) => handleAddItemRow(value)}
            />
        </form>
    );
};

export default PurchaseRequestForm;
