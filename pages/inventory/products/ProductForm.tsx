import React, {useEffect, useState} from 'react';
import ImageUploader from "@/components/ImageUploader";
import Select from "react-select";
import {useDispatch, useSelector} from "react-redux";
import {IRootState} from "@/store";
import {getUnits} from "@/store/slices/unitSlice";
import {clearRawProductState, editRawProduct, storeRawProduct} from "@/store/slices/rawProductSlice";
import {ThunkDispatch} from "redux-thunk";
import {AnyAction} from "redux";
import {setAuthToken, setContentType} from "@/configs/api.config";
import {clearUtilState, generateCode} from "@/store/slices/utilSlice";
import {FORM_CODE_TYPE} from "@/utils/enums";

interface IFormData {
    item_code: string;
    title: string;
    unit_id: string;
    sub_unit_id: string;
    purchase_description: string;
    value_per_unit: string;
    valuation_method: string;
    min_stock_level: string;
    opening_stock: number;
    opening_stock_unit_balance: number;
    opening_stock_total_balance: number;
    sale_description: string;
    image: File | null;
}

interface IFormProps {
    id?: any
}

const ProductForm = ({id}: IFormProps) => {
    const dispatch = useDispatch<ThunkDispatch<IRootState, any, AnyAction>>();
    const {units} = useSelector((state: IRootState) => state.unit);
    const {code} = useSelector((state: IRootState) => state.util);
    const {loading, rawProductDetail} = useSelector((state: IRootState) => state.rawProduct);
    const {token} = useSelector((state: IRootState) => state.user);
    const [image, setImage] = useState<File | null>(null);
    const [formData, setFormData] = useState<IFormData>({
        item_code: '',
        title: '',
        unit_id: '',
        sub_unit_id: '',
        purchase_description: '',
        value_per_unit: '',
        valuation_method: '',
        min_stock_level: '',
        opening_stock: 0,
        opening_stock_unit_balance: 0,
        opening_stock_total_balance: 0,
        sale_description: '',
        image: null,
    });

    const [unitOptions, setUnitOptions] = useState([]);
    const [subUnitOptions, setSubUnitOptions] = useState([]);
    const [valuationMethodOptions, setValuationMethodOptions] = useState([
        {value: '', label: 'Select Valuation Method'},
        {value: 'LIFO', label: 'LIFO'},
        {value: 'FIFO', label: 'FIFO'},
        {value: 'Average', label: 'Average'},
    ]);

    const [productTypeOptions, setProductTypeOptions] = useState([
        {value: '', label: 'Select Product Type'},
        {value: 'empty', label: 'Empty'},
        {value: 'material', label: 'Material'},
    ]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prevFormData => {
            // Start with the current form data.
            let updatedFormData = { ...prevFormData, [name]: value };

            // Calculate the new values based on the change.
            if (name === 'opening_stock') {
                const openingStock = parseInt(value, 10); // Ensure we're working with a number.
                updatedFormData.opening_stock_total_balance = openingStock * prevFormData.opening_stock_unit_balance;
            } else if (name === 'opening_stock_unit_balance') {
                const openingStockUnitBalance = parseFloat(value); // Ensure we're working with a number.
                updatedFormData.opening_stock_total_balance = prevFormData.opening_stock * openingStockUnitBalance;
            } else if (name === 'opening_stock_total_balance') {
                const openingStockTotalBalance = parseFloat(value); // Ensure we're working with a number.
                // Protect against division by zero for opening_stock to calculate opening_stock_unit_balance.
                updatedFormData.opening_stock_unit_balance = prevFormData.opening_stock ? openingStockTotalBalance / prevFormData.opening_stock : 0;
            }

            return updatedFormData;
        });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        formData.image = image;
        setAuthToken(token)
        setContentType('multipart/form-data')
        if (id) {
            // dispatch(updateRawProduct(id, formData));
        } else {
            dispatch(storeRawProduct(formData));
        }
    };

    const allUnitOptions = () => {
        dispatch(getUnits());
    }

    useEffect(() => {
        allUnitOptions();
        dispatch(clearRawProductState());
        dispatch(clearUtilState());
        dispatch(generateCode(FORM_CODE_TYPE.RAW_MATERIAL));
        if (id) {
            dispatch(editRawProduct(id));
        }
    }, [])

    useEffect(() => {
        if (rawProductDetail) {
            setFormData({
                ...formData,
                item_code: rawProductDetail.item_code,
                title: rawProductDetail.title,
                unit_id: rawProductDetail.unit_id,
                sub_unit_id: rawProductDetail.sub_unit_id,
                purchase_description: rawProductDetail.purchase_description,
                value_per_unit: rawProductDetail.value_per_unit,
                valuation_method: rawProductDetail.valuation_method,
                min_stock_level: rawProductDetail.min_stock_level,
                opening_stock: rawProductDetail.opening_stock,
                opening_stock_unit_balance: rawProductDetail.opening_stock_unit_balance,
                opening_stock_total_balance: rawProductDetail.opening_stock_total_balance,
                sale_description: rawProductDetail.sale_description,
            });
        }
    }, [rawProductDetail]);

    const handleProductTypeChange = (e: any) => {
        if (e.value === 'empty') {
            setFormData(prev => ({...prev, item_code: 'EM-'+code}))
        } else {
            setFormData(prev => ({...prev, item_code: 'RM-'+code}))
        }
    }

    useEffect(() => {
        const parentUnits = ['BAG', 'DRUM', 'GLN', 'QTY', 'NUMBER', 'BOTTLE']
        const childUnits = ['KG', 'LTR', 'GRM']
        if (units) {
            let mainUnits = units.filter((unit:any) => parentUnits.includes(unit.label))
            let subUnits = units.filter((unit:any) => childUnits.includes(unit.label))
            setUnitOptions(mainUnits);
            setSubUnitOptions(subUnits)
        }
    }, [units])

    return (
        <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="flex justify-center items-center">
                <ImageUploader image={image} setImage={setImage}/>
            </div>
            <div className="flex justify-start flex-col items-start space-y-3">
                <div className="flex flex-col md:flex-row justify-center items-center gap-3">
                    <div>
                        <label htmlFor="unit_id">Product Type</label>
                        <Select
                            defaultValue={productTypeOptions[0]}
                            options={productTypeOptions}
                            isSearchable={true}
                            isClearable={true}
                            placeholder={'Select Product Type'}
                            onChange={(e: any) => handleProductTypeChange(e)}
                        />
                    </div>
                    <div>
                        <label htmlFor="item_code">Item Code</label>
                        <input id="item_code" type="text" name="item_code" placeholder="Enter Item code"
                               value={formData.item_code} onChange={handleChange} disabled={true}
                               className="form-input"/>
                    </div>
                </div>
                <div className="w-full md:w-1/2">
                    <label htmlFor="title">Item Title</label>
                    <input id="title" type="text" name="title" placeholder="Enter Item TItle"
                           value={formData.title} onChange={handleChange}
                           className="form-input" style={{height: 45}}/>
                </div>
            </div>
            <div className='flex justify-between items-center flex-col md:flex-row gap-3'>
                <div className='w-full'>
                    <label htmlFor="unit_id">Unit</label>
                    <Select
                        defaultValue={unitOptions[0]}
                        options={unitOptions}
                        isSearchable={true}
                        isClearable={true}
                        placeholder={'Select Unit'}
                        onChange={(e: any) => {
                            setFormData({
                                ...formData,
                                unit_id: e ? e.value : ''
                            });
                        }}
                    />
                </div>
                <div className='w-full'>
                    <label htmlFor="sub_unit_id">Sub Unit</label>
                    <Select
                        defaultValue={subUnitOptions[0]}
                        options={subUnitOptions}
                        isSearchable={true}
                        isClearable={true}
                        placeholder={'Select Sub Unit'}
                        onChange={(e: any) => {
                            setFormData({
                                ...formData,
                                sub_unit_id: e ? e.value : ''
                            });
                        }}
                    />
                </div>

                <div className='w-full'>
                    <label htmlFor="value_per_unit">Value per Unit (According to sub unit)</label>
                    <input id="value_per_unit" type="number" name="value_per_unit"
                           placeholder="Enter weight per main unit"
                           value={formData.value_per_unit} onChange={handleChange}
                           className="form-input"/>
                </div>
            </div>
            <div className='flex justify-between items-center flex-col md:flex-row gap-3'>
                <div className='w-full'>
                    <label htmlFor="min_stock_level">Min Stock Level (Main Unit)</label>
                    <input id="min_stock_level" type="number" name="min_stock_level"
                           placeholder="Set min stock level"
                           value={formData.min_stock_level} onChange={handleChange}
                           className="form-input"/>
                </div>
                <div className='w-full'>
                    <label htmlFor="opening_stock">Opening Stock Count (Sub Unit)</label>
                    <input id="opening_stock" type="number" name="opening_stock"
                           placeholder="Enter Opening Stock Count"
                           value={formData.opening_stock} onChange={handleChange}
                           className="form-input"/>
                </div>
                <div className="w-full flex justify-between items-center flex-col md:flex-row gap-3">
                    <div className='w-full'>
                        <label htmlFor="opening_stock_balance">Opening Per Sub Unit Price</label>
                        <input id="opening_stock_unit_price" type="number" name="opening_stock_unit_price"
                               placeholder="Enter Opening Stock Unit Balance"
                               value={formData.opening_stock_unit_balance} onChange={handleChange}
                               className="form-input"/>
                    </div>
                    <div className='w-full'>
                        <label htmlFor="opening_stock_balance">Opening Stock Total Balance</label>
                        <input id="opening_stock_total_balance" type="number" name="opening_stock_total_balance"
                               placeholder="Enter Opening Stock Total Balance"
                               value={formData.opening_stock_total_balance} onChange={handleChange}
                               className="form-input"/>
                    </div>
                </div>

            </div>

            <div>
                <label htmlFor="valuation_method">Valuation Method</label>
                <Select
                    defaultValue={valuationMethodOptions[0]}
                    options={valuationMethodOptions}
                    isSearchable={true}
                    isClearable={true}
                    placeholder={'Select Valuation Method'}
                    onChange={(e) => {
                        setFormData({
                            ...formData,
                            valuation_method: e ? e.value : ''
                        });
                    }}
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                    <label htmlFor="purchase_description">Purchase Description</label>
                    <textarea
                        id="purchase_description"
                        rows={3}
                        name="purchase_description"
                        className="form-textarea"
                        onChange={handleChange}
                        placeholder="Enter description for purchase"
                        defaultValue={formData.purchase_description}
                    ></textarea>
                </div>
                <div>
                    <label htmlFor="sale_description">Sale Description</label>
                    <textarea
                        id="sale_description"
                        rows={3}
                        name="sale_description"
                        className="form-textarea"
                        onChange={handleChange}
                        placeholder="Enter descriptin for sales"
                        defaultValue={formData.sale_description}
                    ></textarea>
                </div>
            </div>

            <button type="submit" className="btn btn-primary !mt-6" disabled={loading}>
                {loading ? 'Loading...' : 'Create'}
            </button>
        </form>
    );
};

export default ProductForm;
