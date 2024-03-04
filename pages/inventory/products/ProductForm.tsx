import React, {useEffect, useState} from 'react';
import ImageUploader from "@/components/form/ImageUploader";
import {useDispatch, useSelector} from "react-redux";
import {IRootState} from "@/store";
import {getUnits} from "@/store/slices/unitSlice";
import {clearRawProductState, editRawProduct, storeRawProduct, updateRawProduct} from "@/store/slices/rawProductSlice";
import {ThunkDispatch} from "redux-thunk";
import {AnyAction} from "redux";
import {setAuthToken, setContentType} from "@/configs/api.config";
import {clearUtilState, generateCode} from "@/store/slices/utilSlice";
import {ButtonType, ButtonVariant, FORM_CODE_TYPE} from "@/utils/enums";
import {Dropdown} from "@/components/form/Dropdown";
import {Input} from "@/components/form/Input";
import Textarea from "@/components/form/Textarea";
import Button from "@/components/Button";
import {isNull} from "lodash";
import {BASE_URL} from "@/configs/server.config";
import {imagePath} from "@/utils/helper";
import {router} from "next/client";

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

    const [imagePreview, setImagePreview] = useState('');
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
        const {name, value} = e.target;
        setFormData(prevFormData => {
            // Start with the current form data.
            let updatedFormData = {...prevFormData, [name]: value};

            // Calculate the new values based on the change.
            if (name === 'opening_stock') {
                const openingStock = Number(value);
                updatedFormData.opening_stock_total_balance = openingStock * prevFormData.opening_stock_unit_balance;
            } else if (name === 'opening_stock_unit_balance') {
                const openingStockUnitBalance = Number(value);
                updatedFormData.opening_stock_total_balance = prevFormData.opening_stock * openingStockUnitBalance;
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
            dispatch(updateRawProduct({id, rawProductData: formData}));
        } else {
            dispatch(storeRawProduct(formData));
        }
    };

    const allUnitOptions = () => {
        dispatch(getUnits());
    }

    useEffect(() => {
        dispatch(getUnits());
        dispatch(clearUtilState());
        setAuthToken(token);
        setContentType('application/json');
    }, [dispatch, token]);

    useEffect(() => {
        if (!id) {
            dispatch(generateCode(FORM_CODE_TYPE.RAW_MATERIAL));
            setImagePreview(imagePath(''));
        }
        return () => {
            dispatch(clearRawProductState());
        };
    }, [id, dispatch]);

    useEffect(() => {
        if (code && isNull(id)) {
            setFormData(prev => ({...prev, item_code: code[FORM_CODE_TYPE.RAW_MATERIAL]}))
        }
    }, [code]);

    useEffect(() => {
        if (rawProductDetail) {
            setImagePreview(imagePath(rawProductDetail.thumbnail))
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
        } else {
            setImagePreview(imagePath(''))
        }
    }, [rawProductDetail]);

    useEffect(() => {
        const parentUnits = ['BAG', 'DRUM', 'GLN', 'QTY', 'NUMBER', 'BOTTLE']
        const childUnits = ['KG', 'LTR', 'GRM']
        if (units) {
            let mainUnits = units.filter((unit: any) => parentUnits.includes(unit.label))
            let subUnits = units.filter((unit: any) => childUnits.includes(unit.label))
            setUnitOptions(mainUnits);
            setSubUnitOptions(subUnits)
        }
    }, [units])

    return (
        <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="flex justify-center items-center">
                <ImageUploader image={image} setImage={setImage} existingImage={imagePreview}/>
            </div>
            <div className="flex justify-start flex-col items-start space-y-3">
                <Input
                    label='Item Code'
                    type='text'
                    name='item_code'
                    value={formData.item_code}
                    onChange={handleChange}
                    isMasked={false}
                    placeholder='Enter Item code'
                    disabled={true}
                />
                <Input
                    divClasses='w-full md:w-1/2'
                    label='Item Title'
                    type='text'
                    name='title'
                    value={formData.title}
                    onChange={handleChange}
                    isMasked={false}
                    styles={{height: 45}}
                />
            </div>
            <div className='flex justify-between items-center flex-col md:flex-row gap-3'>
                <Dropdown
                    divClasses='w-full'
                    label='Unit'
                    name='unit_id'
                    options={unitOptions}
                    value={formData.unit_id}
                    onChange={(e: any) => {
                        if (e && typeof e !== 'undefined') {
                            setFormData({
                                ...formData,
                                unit_id: e.value
                            })
                        } else {
                            setFormData({
                                ...formData,
                                unit_id: ''
                            })
                        }
                    }}
                />

                <Dropdown
                    divClasses='w-full'
                    label='Sub Unit'
                    name='sub_unit_id'
                    options={subUnitOptions}
                    value={formData.sub_unit_id}
                    onChange={(e: any) => {
                        if (e && typeof e !== 'undefined') {
                            setFormData({
                                ...formData,
                                sub_unit_id: e.value
                            })
                        } else {
                            setFormData({
                                ...formData,
                                sub_unit_id: ''
                            })
                        }
                    }}
                />
                <Input
                    divClasses='w-full'
                    label='Value per Unit (According to sub unit)'
                    type='number'
                    name='value_per_unit'
                    value={formData.value_per_unit}
                    onChange={handleChange}
                    isMasked={false}
                    placeholder='Enter weight per main unit'
                />
            </div>
            <div className='flex justify-between items-center flex-col md:flex-row gap-3'>
                <Input
                    divClasses='w-full'
                    label='Min Stock Level (Main Unit)'
                    type='number'
                    name='min_stock_level'
                    value={formData.min_stock_level}
                    onChange={handleChange}
                    isMasked={false}
                    placeholder='Set min stock level'
                />

                <Input
                    divClasses='w-full'
                    label='Opening Stock Count (Sub Unit)'
                    type='number'
                    name='opening_stock'
                    value={formData.opening_stock.toString()}
                    onChange={handleChange}
                    isMasked={false}
                    placeholder='Enter Opening Stock Count'
                />

                <div className="w-full flex justify-between items-center flex-col md:flex-row gap-3">
                    <Input
                        divClasses='w-full'
                        label='Opening Per Sub Unit Price'
                        type='number'
                        name='opening_stock_unit_balance'
                        value={formData.opening_stock_unit_balance.toString()}
                        onChange={handleChange}
                        isMasked={false}
                        placeholder='Enter Opening Stock Unit Balance'
                    />
                    <Input
                        divClasses='w-full'
                        label='Opening Stock Total Balance'
                        type='number'
                        name='opening_stock_total_balance'
                        value={formData.opening_stock_total_balance.toString()}
                        onChange={handleChange}
                        isMasked={false}
                        disabled={true}
                        placeholder='Enter Opening Stock Total Balance'
                    />

                </div>
            </div>

            <Dropdown
                divClasses='w-full'
                label='Valuation Method'
                name='valuation_method'
                options={valuationMethodOptions}
                value={formData.valuation_method}
                onChange={(e: any) => {
                    if (e && typeof e !== 'undefined') {
                        setFormData({
                            ...formData,
                            valuation_method: e.value
                        })
                    } else {
                        setFormData({
                            ...formData,
                            valuation_method: ''
                        })
                    }
                }}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Textarea
                    label='Purchase Description'
                    name='purchase_description'
                    value={formData.purchase_description}
                    onChange={handleChange}
                    isReactQuill={false}
                    rows={3}
                    placeholder='Enter description for purchase'
                />

                <Textarea
                    label='Sale Description'
                    name='sale_description'
                    value={formData.sale_description}
                    onChange={handleChange}
                    isReactQuill={false}
                    rows={3}
                    placeholder='Enter description for sales'
                />
            </div>
            <Button
                type={ButtonType.submit}
                text={loading ? 'Loading...' : id ? 'Update' : 'Create'}
                variant={ButtonVariant.primary}
                disabled={loading}
                classes='!mt-6'
            />
        </form>
    );
};

export default ProductForm;
