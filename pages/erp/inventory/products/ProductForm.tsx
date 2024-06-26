import React, {useEffect, useState} from 'react';
import ImageUploader from "@/components/form/ImageUploader";
import {useAppDispatch, useAppSelector} from "@/store";
import {getUnits} from "@/store/slices/unitSlice";
import {clearRawProductState, storeRawProduct, updateRawProduct} from "@/store/slices/rawProductSlice";
import {setAuthToken, setContentType} from "@/configs/api.config";
import {clearUtilState, generateCode} from "@/store/slices/utilSlice";
import {ButtonType, ButtonVariant, FORM_CODE_TYPE} from "@/utils/enums";
import {Dropdown} from "@/components/form/Dropdown";
import {Input} from "@/components/form/Input";
import Textarea from "@/components/form/Textarea";
import Button from "@/components/Button";
import {serverFilePath} from "@/utils/helper";
import Alert from "@/components/Alert";

interface IFormData {
    item_code: string;
    product_type: string;
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
    id?: any;
}

const ProductForm = ({id}: IFormProps) => {
    const dispatch = useAppDispatch();
    const {units} = useAppSelector(state => state.unit);
    const {code} = useAppSelector(state => state.util);
    const {loading, rawProductDetail} = useAppSelector((state) => state.rawProduct);
    const {token} = useAppSelector(state => state.user);
    const [image, setImage] = useState<File | null>(null);
    const [isFormValid, setIsFormValid] = useState<boolean>(false)
    const [errorMessages, setErrorMessages] = useState<any>({})
    const [validationMessage, setValidationMessage] = useState<any>('')
    const [formData, setFormData] = useState<IFormData>({
        item_code: '',
        product_type: '',
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
        {value: 'raw-material', label: 'Raw Material'},
        {value: 'filling-material', label: 'Filling Material'},
        {value: 'packing-material', label: 'Packing Material'},
    ]);

    const handleChange = (name: string, value: any, required: boolean) => {

        if (required) {
            if (!value || value == '0') {
                setErrorMessages({...errorMessages, [name]: "This is required"})
                return
            } else {
                setErrorMessages((prev: any) => {
                    delete prev[name];
                    return prev;
                });
            }
        }

        switch (name) {
            case 'product_type':
            case 'unit_id':
            case 'valuation_method':
            case 'sub_unit_id':
                if (value && typeof value !== 'undefined') {
                    setFormData((prevFormData) => ({...prevFormData, [name]: value.value}));
                } else {
                    setFormData((prevFormData) => ({...prevFormData, [name]: ''}));
                }
                break;
            case 'opening_stock':
                const openingStock = Number(value);
                setFormData((prevFormData) => ({
                    ...prevFormData,
                    opening_stock: openingStock,
                    opening_stock_total_balance: openingStock * (prevFormData.opening_stock_unit_balance ?? 0)
                }));
                break
            case 'opening_stock_unit_balance':
                const openingStockUnitBalance = Number(value);
                setFormData((prevFormData) => ({
                    ...prevFormData,
                    opening_stock_unit_balance: openingStockUnitBalance,
                    opening_stock_total_balance: (prevFormData.opening_stock ?? 0) * openingStockUnitBalance
                }));
                break
            default:
                setFormData((prevFormData) => ({...prevFormData, [name]: value}));
                break
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        formData.image = image;

        setAuthToken(token);
        setContentType('multipart/form-data');
        if (id) {
            dispatch(updateRawProduct({id, rawProductData: formData}));
        } else {
            dispatch(storeRawProduct(formData));
        }
        setValidationMessage('')
    };

    useEffect(() => {
        dispatch(getUnits());
        dispatch(clearUtilState());
        setAuthToken(token);
        setContentType('application/json');
    }, [dispatch, token]);

    useEffect(() => {
        if (!id) {
            dispatch(generateCode(FORM_CODE_TYPE.RAW_MATERIAL));
            setImagePreview(serverFilePath(''));
        }
        return () => {
            dispatch(clearRawProductState());
        };
    }, [id, dispatch]);

    useEffect(() => {
        setValidationMessage('')
    }, []);

    useEffect(() => {
        if (code) {
            setFormData((prev) => ({...prev, item_code: code[FORM_CODE_TYPE.RAW_MATERIAL]}));
        }
    }, [code]);

    useEffect(() => {
        if (rawProductDetail) {
            setImagePreview(serverFilePath(rawProductDetail.thumbnail?.path));
            setFormData({
                ...formData,
                product_type: rawProductDetail.product_type,
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
            setImagePreview(serverFilePath(''));
        }
    }, [rawProductDetail]);

    useEffect(() => {
        const parentUnits = ['BAG', 'DRUM', 'GLN', 'BOTTLE', 'QTR']
        const childUnits = ['KG', 'LTR', 'GRM', 'QTY']
        if (units) {
            let mainUnits = units.filter((unit: any) => parentUnits.includes(unit.label));
            let subUnits = units.filter((unit: any) => childUnits.includes(unit.label));
            setUnitOptions(mainUnits);
            setSubUnitOptions(subUnits);
        }
    }, [units]);

    useEffect(() => {
        const isValid = Object.values(errorMessages).some(message => message !== '');
        setIsFormValid(!isValid);
        if (isValid) {
            setValidationMessage("Please fill all the required fields.");
        }
    }, [errorMessages]);

    return (
        <form className="space-y-5" onSubmit={handleSubmit}>
            {!isFormValid && validationMessage &&
                <Alert
                    alertType="error"
                    message={validationMessage}
                    setMessages={setValidationMessage}
                />
            }

            <div className="flex items-center justify-center">
                <ImageUploader image={image} setImage={setImage} existingImage={imagePreview}/>
            </div>
            <div className="flex flex-col items-start justify-start space-y-3">
                <Input
                    label="Item Code"
                    type="text"
                    name="item_code"
                    value={formData.item_code}
                    onChange={(e) => handleChange(e.target.name, e.target.value, e.target.required)}
                    isMasked={false}
                    placeholder="Enter Item code"
                    disabled={true}
                    required={false}
                />

                <Input
                    divClasses="w-full md:w-1/2"
                    label="Item Title"
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={(e) => handleChange(e.target.name, e.target.value, e.target.required)}
                    isMasked={false}
                    styles={{height: 45}}
                    required={true}
                    errorMessage={errorMessages.title}
                />
            </div>

            <div className="w-full flex justify-between items-center flex-col md:flex-row gap-3">
                <Dropdown
                    divClasses='w-full'
                    label='Product Type'
                    name='product_type'
                    options={productTypeOptions}
                    value={formData.product_type}
                    onChange={(e) => handleChange('product_type', e, true)}
                    required={true}
                    errorMessage={errorMessages?.product_type}
                />
                <Dropdown
                    divClasses='w-full'
                    label='Valuation Method'
                    name='valuation_method'
                    options={valuationMethodOptions}
                    value={formData.valuation_method}
                    onChange={(e) => handleChange('valuation_method', e, true)}
                    required={true}
                    errorMessage={errorMessages?.valuation_method}
                />
            </div>

            <div className='flex justify-between items-center flex-col md:flex-row gap-3'>
                <Dropdown
                    divClasses="w-full"
                    label="Unit"
                    name="unit_id"
                    options={unitOptions}
                    value={formData.unit_id}
                    onChange={(e) => handleChange('unit_id', e, true)}
                    required={true}
                    errorMessage={errorMessages?.unit_id}
                />

                <Dropdown
                    divClasses="w-full"
                    label="Sub Unit"
                    name="sub_unit_id"
                    options={subUnitOptions}
                    value={formData.sub_unit_id}
                    onChange={(e) => handleChange('sub_unit_id', e, true)}
                    required={true}
                    errorMessage={errorMessages?.sub_unit_id}
                />
                <Input
                    divClasses="w-full"
                    label="Value per Unit (According to sub unit)"
                    type="number"
                    name="value_per_unit"
                    value={formData.value_per_unit}
                    onChange={(e) => handleChange(e.target.name, e.target.value, e.target.required)}
                    isMasked={false}
                    placeholder="Enter weight per main unit"
                    required={true}
                    errorMessage={errorMessages?.value_per_unit}
                />
            </div>
            <div className="flex flex-col items-center justify-between gap-3 md:flex-row">
                <Input
                    divClasses="w-full"
                    label="Min Stock Level (Main Unit)"
                    type="number"
                    name="min_stock_level"
                    value={formData.min_stock_level}
                    onChange={(e) => handleChange(e.target.name, e.target.value, e.target.required)}
                    isMasked={false}
                    placeholder="Set min stock level"
                    required={true}
                    errorMessage={errorMessages?.min_stock_level}
                />

                <Input
                    divClasses="w-full"
                    label="Opening Stock Count (Sub Unit)"
                    type="number"
                    name="opening_stock"
                    value={formData.opening_stock.toString()}
                    onChange={(e) => handleChange(e.target.name, e.target.value, e.target.required)}
                    isMasked={false}
                    placeholder="Enter Opening Stock Count"
                    required={true}
                    errorMessage={errorMessages?.opening_stock}
                />

                <div className="flex w-full flex-col items-center justify-between gap-3 md:flex-row">
                    <Input
                        divClasses="w-full"
                        label="Opening Per Sub Unit Price"
                        type="number"
                        name="opening_stock_unit_balance"
                        value={formData.opening_stock_unit_balance.toString()}
                        onChange={(e) => handleChange(e.target.name, e.target.value, e.target.required)}
                        isMasked={false}
                        placeholder="Enter Opening Stock Unit Balance"
                        required={true}
                        errorMessage={errorMessages?.opening_stock_unit_balance}
                    />
                    <Input
                        divClasses="w-full"
                        label="Opening Stock Total Balance"
                        type="number"
                        name="opening_stock_total_balance"
                        value={formData.opening_stock_total_balance.toString()}
                        onChange={(e) => handleChange(e.target.name, e.target.value, e.target.required)}
                        isMasked={false}
                        disabled={true}
                        placeholder="Enter Opening Stock Total Balance"
                        required={true}
                        // errorMessage={errorMessages?.opening_stock_total_balance}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                <Textarea
                    label="Purchase Description"
                    name="purchase_description"
                    value={formData.purchase_description}
                    onChange={(e) => handleChange(e.target.name, e.target.value, e.target.required)}
                    isReactQuill={false}
                    rows={3}
                    placeholder='Enter description for purchase'
                    required={true}
                    errorMessage={errorMessages?.purchase_description}
                />

                <Textarea
                    label="Sale Description"
                    name="sale_description"
                    value={formData.sale_description}
                    onChange={(e) => handleChange(e.target.name, e.target.value, e.target.required)}
                    isReactQuill={false}
                    rows={3}
                    placeholder='Enter description for sales'
                    required={true}
                    errorMessage={errorMessages?.sale_description}
                />
            </div>
            {isFormValid && (
                <Button
                    type={ButtonType.submit}
                    text={loading ? 'Loading...' : id ? 'Update' : 'Create'}
                    variant={ButtonVariant.info}
                    disabled={loading}
                    classes="!mt-6"/>
            )}
        </form>
    );
};

export default ProductForm;
