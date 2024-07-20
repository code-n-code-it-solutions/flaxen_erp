import React, { Fragment, useCallback, useEffect, useState } from 'react';
import ImageUploader from '@/components/form/ImageUploader';
import { useAppDispatch, useAppSelector } from '@/store';
import { getUnits } from '@/store/slices/unitSlice';
import { clearRawProductState, storeRawProduct, updateRawProduct } from '@/store/slices/rawProductSlice';
import { setAuthToken, setContentType } from '@/configs/api.config';
import {
    clearLatestRecord,
    clearUtilState,
    generateCode,
    generateRawProductCode,
    getLatestRecord
} from '@/store/slices/utilSlice';
import { ButtonType, ButtonVariant, FORM_CODE_TYPE } from '@/utils/enums';
import { Dropdown } from '@/components/form/Dropdown';
import { Input } from '@/components/form/Input';
import Textarea from '@/components/form/Textarea';
import Button from '@/components/Button';
import { serverFilePath } from '@/utils/helper';
import Alert from '@/components/Alert';
import { Tab } from '@headlessui/react';
import Option from '@/components/form/Option';
import dynamic from 'next/dynamic';
import useTransformToSelectOptions from '@/hooks/useTransformToSelectOptions';
import { getAccounts, getAccountsTypes } from '@/store/slices/accountSlice';
import Swal from 'sweetalert2';
import { PlusCircleIcon } from 'lucide-react';
import Modal from '@/components/Modal';
import {
    clearRawProductCategoryState,
    getRawProductCategories,
    storeRawProductCategory
} from '@/store/slices/rawProductCategorySlice';

const TreeSelect = dynamic(() => import('antd/es/tree-select'), { ssr: false });


interface IFormProps {
    id?: any;
}

const ProductForm = ({ id }: IFormProps) => {
    const dispatch = useAppDispatch();
    const accountOptions = useTransformToSelectOptions(useAppSelector(state => state.account).accountTypes);
    // console.log(accountOptions);
    const { units } = useAppSelector(state => state.unit);
    const { rawProductCode, latestRecord } = useAppSelector(state => state.util);
    const { loading, rawProductDetail } = useAppSelector((state) => state.rawProduct);
    const { rawProductCategories, rawProductCategory } = useAppSelector((state) => state.rawProductCategory);
    const { branchList } = useAppSelector((state) => state.company);
    // const { accounts } = useAppSelector((state) => state.account);
    const { token, user } = useAppSelector(state => state.user);
    const [rawProductCategoryModal, setRawProductCategoryModal] = useState<boolean>(false);
    const [rawProductCatData, setRawProductCatData] = useState<any>({});

    const [image, setImage] = useState<File | null>(null);
    const [isFormValid, setIsFormValid] = useState<boolean>(false);
    const [errorMessages, setErrorMessages] = useState<any>({});
    const [validationMessage, setValidationMessage] = useState<any>('');
    const [formData, setFormData] = useState<any>({});

    // const [selectedBranches, setSelectedBranches] = useState<any[]>([]);
    const [imagePreview, setImagePreview] = useState('');
    const [rawProductCategoryOptions, setRawProductCategoryOptions] = useState([]);
    const [unitOptions, setUnitOptions] = useState([]);
    const [subUnitOptions, setSubUnitOptions] = useState([]);
    // const [accountsList, setAccountsList] = useState([]);
    // const [accountOptions, setAccountOptions] = useState([]);
    const [valuationMethodOptions, setValuationMethodOptions] = useState([
        { value: '', label: 'Select Valuation Method' },
        { value: 'LIFO', label: 'LIFO' },
        { value: 'FIFO', label: 'FIFO' },
        { value: 'Average', label: 'Average' }
    ]);

    const [productTypeOptions, setProductTypeOptions] = useState([
        { value: '', label: 'Select Product Type' },
        { value: 'raw-material', label: 'Raw Material' },
        { value: 'filling-material', label: 'Filling Material' },
        { value: 'packing-material', label: 'Packing Material' }
    ]);

    const handleChange = (name: string, value: any, required: boolean) => {

        if (required) {
            if (!value || value == '0') {
                setErrorMessages({ ...errorMessages, [name]: 'This is required' });
                // return;
            } else {
                setErrorMessages((prev: any) => {
                    delete prev[name];
                    return prev;
                });
            }
        }

        switch (name) {
            case 'raw_product_category_id':
            case 'branch_id':
            case 'product_type':
            case 'unit_id':
            case 'valuation_method':
            case 'sub_unit_id':
                if (value && typeof value !== 'undefined') {
                    setFormData((prevFormData: any) => ({ ...prevFormData, [name]: value.value }));
                } else {
                    setFormData((prevFormData: any) => ({ ...prevFormData, [name]: '' }));
                }
                break;
            case 'opening_stock':
                const openingStock = Number(value);
                setFormData((prevFormData: any) => ({
                    ...prevFormData,
                    opening_stock: openingStock,
                    opening_stock_total_balance: openingStock * (prevFormData.opening_stock_unit_balance ?? 0)
                }));
                break;
            case 'opening_stock_unit_balance':
                const openingStockUnitBalance = Number(value);
                setFormData((prevFormData: any) => ({
                    ...prevFormData,
                    opening_stock_unit_balance: openingStockUnitBalance,
                    opening_stock_total_balance: (prevFormData.opening_stock ?? 0) * openingStockUnitBalance
                }));
                break;
            default:
                setFormData((prevFormData: any) => ({ ...prevFormData, [name]: value }));
                break;
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        formData.image = image;

        setAuthToken(token);
        setContentType('multipart/form-data');
        if (!formData.stock_account_id && !id) {
            Swal.fire('Error', 'Please select accounting for stock', 'error');
        } else {
            if (id) {
                dispatch(updateRawProduct({ id, rawProductData: formData }));
            } else {
                dispatch(storeRawProduct(formData));
            }
            setValidationMessage('');
        }
    };

    const customStyles = {
        option: (provided: any, state: any) => ({
            ...provided,
            paddingLeft: `${state.data.depth * 10}px`
        }),
        group: (provided: any) => ({
            ...provided,
            paddingLeft: '10px'
        })
    };

    useEffect(() => {
        dispatch(getUnits());
        dispatch(clearUtilState());
        setAuthToken(token);
        setContentType('application/json');

    }, [dispatch, token]);

    useEffect(() => {
        if (!id) {
            // dispatch(generateCode(FORM_CODE_TYPE.RAW_MATERIAL));
            setImagePreview(serverFilePath(''));
        }
        return () => {
            dispatch(clearRawProductState());
            dispatch(clearRawProductCategoryState());
        };
    }, [id, dispatch]);

    useEffect(() => {
        setValidationMessage('');
        dispatch(getAccountsTypes({}));
        setFormData({});
        dispatch(clearLatestRecord());
        dispatch(getRawProductCategories());
    }, []);

    useEffect(() => {
        if (rawProductCode) {
            setFormData((prev: any) => ({ ...prev, item_code: rawProductCode }));
        }
    }, [rawProductCode]);

    useEffect(() => {
        if (rawProductDetail) {
            setImagePreview(serverFilePath(rawProductDetail.thumbnail?.path));
            setFormData({
                ...formData,
                raw_product_category_id: rawProductDetail.raw_product_category_id,
                retail_price: rawProductDetail.retail_price,
                branch_id: rawProductDetail.branch_id,
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
                stock_account_id: rawProductDetail.stock_account_id
            });
        } else {
            setImagePreview(serverFilePath(''));
        }
    }, [rawProductDetail]);

    useEffect(() => {
        const parentUnits = ['BAG', 'DRUM', 'GLN', 'BOTTLE', 'QTR'];
        const childUnits = ['KG', 'LTR', 'GRM', 'QTY'];
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
            setValidationMessage('Please fill all the required fields.');
        }
    }, [errorMessages]);

    useEffect(() => {
        if (latestRecord) {
            setFormData((prevFormData: any) => ({
                ...prevFormData,
                stock_account_id: latestRecord.stock_account?.code,
                vat_receivable_id: latestRecord.vat_receivable?.code,
                account_payable_id: latestRecord.account_payable?.code,
                vat_payable_id: latestRecord.vat_payable?.code
            }));
        }
    }, [latestRecord]);

    useEffect(() => {
        if (rawProductCategory) {
            setRawProductCatData({});
            setRawProductCategoryModal(false);
            dispatch(clearRawProductCategoryState());
            dispatch(getRawProductCategories());
        }
    }, [rawProductCategory]);

    useEffect(() => {
        if (rawProductCategories) {
            setRawProductCategoryOptions(rawProductCategories.map((category: any) => ({
                value: category.id,
                label: category.name + ' (' + category.code + ')'
            })));
        }
    }, [rawProductCategories]);

    return (
        <form className="space-y-5" onSubmit={handleSubmit}>
            {!isFormValid && validationMessage &&
                <Alert
                    alertType="error"
                    message={validationMessage}
                    setMessages={setValidationMessage}
                />
            }
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
                <div className="flex flex-col items-start justify-start space-y-3">
                    <div className="flex items-end gap-1">
                        <Dropdown
                            // divClasses="w-full"
                            label="Product Category"
                            name="raw_product_category_id"
                            options={rawProductCategoryOptions}
                            value={formData.raw_product_category_id}
                            onChange={(e) => {
                                handleChange('raw_product_category_id', e, true);
                                if (e && typeof e !== 'undefined') {
                                    dispatch(generateRawProductCode(e.value));
                                } else {
                                    dispatch(clearUtilState());
                                    setFormData((prevFormData: any) => ({
                                        ...prevFormData,
                                        item_code: ''
                                    }));
                                }
                            }}
                            required={true}
                        />
                        <Button
                            type={ButtonType.button}
                            text={<PlusCircleIcon size={18} />}
                            variant={ButtonVariant.primary}
                            onClick={() => {
                                setRawProductCategoryModal(true);
                                setRawProductCatData({});
                            }}
                        />
                    </div>
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
                    {user && user.roles.find((role: any) => role.name === 'Allow Company Wise Entry') && (
                        <Dropdown
                            // divClasses="w-full"
                            label="Company Branch"
                            name="branch_id"
                            options={branchList && branchList.map((branch: any) => ({
                                value: branch.id,
                                label: branch.name
                            })) || []}
                            value={formData.branch_id}
                            onChange={(e) => handleChange('branch_id', e, true)}
                            required={true}
                            errorMessage={'If non select it will store as logged in employee registered branch'}
                        />
                    )}

                    <Input
                        divClasses="w-full"
                        label="Item Title"
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={(e) => handleChange(e.target.name, e.target.value, e.target.required)}
                        isMasked={false}
                        styles={{ height: 45 }}
                        required={true}
                        errorMessage={errorMessages.title}
                    />
                </div>
                <div className="flex md:justify-end md:items-start">
                    <ImageUploader image={image} setImage={setImage} existingImage={imagePreview} />
                </div>
            </div>

            <Tab.Group>
                <Tab.List className="mt-3 flex flex-wrap border-b border-white-light dark:border-[#191e3a]">
                    <Tab as={Fragment}>
                        {({ selected }) => (
                            <button
                                className={`${
                                    selected ? '!border-white-light !border-b-white  text-primary !outline-none dark:!border-[#191e3a] dark:!border-b-black ' : ''
                                } -mb-[1px] block border border-transparent p-3.5 py-2 hover:text-primary dark:hover:border-b-black`}
                            >
                                Basic Details
                            </button>
                        )}
                    </Tab>
                    {!id && (
                        <Tab as={Fragment}>
                            {({ selected }) => (
                                <button
                                    className={`${
                                        selected ? '!border-white-light !border-b-white  text-primary !outline-none dark:!border-[#191e3a] dark:!border-b-black ' : ''
                                    } -mb-[1px] block border border-transparent p-3.5 py-2 hover:text-primary dark:hover:border-b-black`}
                                >
                                    Accounting
                                </button>
                            )}
                        </Tab>
                    )}
                </Tab.List>
                <Tab.Panels className="panel rounded-none">
                    <Tab.Panel>
                        <div className="active">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <Dropdown
                                    divClasses="w-full"
                                    label="Product Type"
                                    name="product_type"
                                    options={productTypeOptions}
                                    value={formData.product_type}
                                    onChange={(e) => handleChange('product_type', e, true)}
                                    required={true}
                                    errorMessage={errorMessages?.product_type}
                                />
                                <Dropdown
                                    divClasses="w-full"
                                    label="Valuation Method"
                                    name="valuation_method"
                                    options={valuationMethodOptions}
                                    value={formData.valuation_method}
                                    onChange={(e) => handleChange('valuation_method', e, true)}
                                    required={true}
                                    errorMessage={errorMessages?.valuation_method}
                                />
                                <Input
                                    divClasses="w-full"
                                    label="Retail Price"
                                    type="number"
                                    name="retail_price"
                                    value={formData.retail_price?.toString()}
                                    onChange={(e) => handleChange(e.target.name, e.target.value, e.target.required)}
                                    isMasked={false}
                                    placeholder="Enter retail price for it"
                                    required={true}
                                    errorMessage={errorMessages?.retail_price}
                                />

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
                                    value={formData.opening_stock?.toString()}
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
                                        value={formData.opening_stock_unit_balance?.toString()}
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
                                        value={formData.opening_stock_total_balance?.toString()}
                                        onChange={(e) => handleChange(e.target.name, e.target.value, e.target.required)}
                                        isMasked={false}
                                        disabled={true}
                                        placeholder="Enter Opening Stock Total Balance"
                                        required={true}
                                        // errorMessage={errorMessages?.opening_stock_total_balance}
                                    />
                                </div>
                            </div>
                        </div>
                    </Tab.Panel>
                    <Tab.Panel>
                        <div>
                            <Option
                                divClasses="mb-5"
                                label="Use Previous Item Accounting"
                                type="checkbox"
                                name="use_previous_accounting"
                                value="1"
                                defaultChecked={formData.use_previous_accounting}
                                onChange={(e) => {
                                    setFormData((prevFormData: any) => ({
                                        ...prevFormData,
                                        use_previous_accounting: e.target.checked ? 1 : 0
                                    }));
                                    dispatch(clearLatestRecord());
                                    if (e.target.checked) {
                                        dispatch(getLatestRecord('raw-product'));
                                    } else {
                                        dispatch(clearLatestRecord());
                                    }
                                }}
                            />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                    <h3 className="font-bold text-lg mb-5 border-b">Accounts</h3>
                                    <div className="space-y-3">
                                        <div>
                                            <label>Stock Accounting</label>
                                            <TreeSelect
                                                showSearch
                                                style={{ width: '100%' }}
                                                value={latestRecord ? latestRecord.stock_account?.code : formData.stock_account_id}
                                                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                                placeholder="Please select stock account"
                                                allowClear
                                                treeDefaultExpandAll
                                                onChange={(e) => handleChange('stock_account_id', e, true)}
                                                treeData={accountOptions}
                                                // onPopupScroll={onPopupScroll}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Tab.Panel>

                </Tab.Panels>
            </Tab.Group>


            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                <Textarea
                    label="Purchase Description"
                    name="purchase_description"
                    value={formData.purchase_description}
                    onChange={(e) => handleChange(e.target.name, e.target.value, e.target.required)}
                    isReactQuill={false}
                    rows={3}
                    placeholder="Enter description for purchase"
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
                    placeholder="Enter description for sales"
                    required={true}
                    errorMessage={errorMessages?.sale_description}
                />
            </div>
            {/*{isFormValid && (*/}
            <Button
                type={ButtonType.submit}
                text={loading ? 'Loading...' : id ? 'Update' : 'Create'}
                variant={ButtonVariant.info}
                disabled={loading}
                classes="!mt-6" />
            {/*)}*/}

            <Modal
                title="New Raw Product Category"
                show={rawProductCategoryModal}
                setShow={setRawProductCategoryModal}
                footer={
                    <div className="flex items-center justify-end gap-3">
                        <Button
                            type={ButtonType.button}
                            text="Cancel"
                            variant={ButtonVariant.danger}
                            onClick={() => {
                                setRawProductCategoryModal(false);
                                setRawProductCatData({});
                            }}
                        />
                        <Button
                            type={ButtonType.button}
                            text="Save"
                            variant={ButtonVariant.info}
                            onClick={() => {
                                dispatch(storeRawProductCategory(rawProductCatData));
                            }}
                        />
                    </div>
                }
            >
                <div className="grid grid-cols-1 gap-5">
                    <Input
                        label="Category Name"
                        type="text"
                        name="name"
                        value={rawProductCatData.name}
                        onChange={(e) => setRawProductCatData({ ...rawProductCatData, name: e.target.value })}
                        isMasked={false}
                        placeholder="Enter category name"
                        required={true}
                    />
                    <Input
                        label="Category Code (Short Form)"
                        type="text"
                        name="code"
                        value={rawProductCatData.code}
                        onChange={(e) => setRawProductCatData({ ...rawProductCatData, code: e.target.value })}
                        isMasked={false}
                        placeholder="Enter category code"
                        required={true}
                    />
                </div>
            </Modal>
        </form>
    );
};

export default ProductForm;
