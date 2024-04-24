import React, {useEffect, useState} from 'react';
import {Input} from "@/components/form/Input";
import {Dropdown} from "@/components/form/Dropdown";
import Button from "@/components/Button";
import {ButtonType, ButtonVariant, FORM_CODE_TYPE, IconType, RAW_PRODUCT_LIST_TYPE} from "@/utils/enums";
import {getIcon} from "@/utils/helper";
import RawProductItemListing from "@/components/listing/RawProductItemListing";
import ColorCodeFormModal from "@/components/modals/ColorCodeFormModal";
import {getColorCodes} from "@/store/slices/colorCodeSlice";
import {setAuthToken} from "@/configs/api.config";
import {
    clearProductAssemblyState,
    storeProductAssembly,
    updateProductAssembly
} from "@/store/slices/productAssemblySlice";
import {clearUtilState, generateCode} from "@/store/slices/utilSlice";
import {getProductCategory} from "@/store/slices/categorySlice";
import {useAppDispatch, useAppSelector} from "@/store";

interface IFormProps {
    id?: any;
}

const ProductAssemblyForm = ({id}: IFormProps) => {
    const dispatch = useAppDispatch()
    const {token} = useAppSelector(state => state.user);
    const {allProductCategory} = useAppSelector(state => state.productCategory);
    const {code} = useAppSelector(state => state.util);
    const {allColorCodes} = useAppSelector(state => state.colorCode);
    const {productAssemblyDetail, loading} = useAppSelector(state => state.productAssembly);

    const [formData, setFormData] = useState<any>({})
    const [colorCodeModal, setColorCodeModal] = useState(false);

    const [rawProducts, setRawProducts] = useState<any[]>([]);
    const [categoryOptions, setCategoryOptions] = useState<any>([]);
    const [colorCodeOptions, setColorCodeOptions] = useState<any>([]);
    const [isFormValid, setIsFormValid] = useState<boolean>(false);
    const [validationMessage, setValidationMessage] = useState('');
    const [errorMessages, setErrorMessages] = useState<any>({});

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (rawProducts.length === 0) {
            setValidationMessage('Raw products must have at least one item in the table');
            setIsFormValid(false)
        } else {
            setValidationMessage('');
            setIsFormValid(true)
            let finalData = {
                ...formData,
                raw_products: rawProducts.map((row: any) => {
                    return {
                        raw_product_id: row.raw_product_id,
                        unit_id: row.unit_id,
                        quantity: row.quantity,
                        unit_price: row.quantity * row.unit_price,
                        total: row.total,
                    }
                })
            };
            setAuthToken(token);
            dispatch(clearProductAssemblyState());
            if (id) {
                dispatch(updateProductAssembly({id: productAssemblyDetail.id, productAssemblyData: formData}));
            } else {
                dispatch(storeProductAssembly(finalData));
            }
        }
    };

    useEffect(() => {
        dispatch(clearUtilState());
        dispatch(getProductCategory());
        dispatch(getColorCodes());
    }, [])

    useEffect(() => {
        if (!id) {
            dispatch(generateCode(FORM_CODE_TYPE.PRODUCT_ASSEMBLY));
            setRawProducts([])
        }
        return () => {
            dispatch(clearProductAssemblyState());
        };
    }, [id, dispatch]);

    useEffect(() => {
        if (productAssemblyDetail) {
            setFormData((prev: any) => {
                return {
                    ...prev,
                    formula_name: productAssemblyDetail.formula_name,
                    formula_code: productAssemblyDetail.formula_code,
                    category_id: productAssemblyDetail.category_id,
                    color_code_id: productAssemblyDetail.color_code_id,
                    raw_products: productAssemblyDetail.product_assembly_items.map((item: any) => {
                        return {
                            raw_product_id: item.raw_product_id,
                            unit_id: item.unit_id,
                            unit_price: parseFloat(item.cost),
                            quantity: parseFloat(item.quantity),
                            description: item.description,
                            sub_total: parseFloat(item.cost) * parseFloat(item.quantity),
                        }
                    })
                }
            })

            setRawProducts(prev => (
                productAssemblyDetail.product_assembly_items.map((item: any) => {
                    return {
                        raw_product_id: item.raw_product_id,
                        unit_id: item.unit_id,
                        unit_price: parseFloat(item.cost),
                        quantity: parseFloat(item.quantity),
                        description: item.description,
                        sub_total: parseFloat(item.cost) * parseFloat(item.quantity),
                    }
                })
            ));

        }
    }, [productAssemblyDetail]);

    useEffect(() => {
        if (code) {
            setFormData({...formData, formula_code: code[FORM_CODE_TYPE.PRODUCT_ASSEMBLY]});
        }
    }, [code]);

    useEffect(() => {
        if (!colorCodeModal) {
            dispatch(getColorCodes());
        }
    }, [colorCodeModal]);

    useEffect(() => {
        if (allProductCategory) {
            let categoryOptions = allProductCategory.map((category: any) => {
                return {
                    value: category.id,
                    label: category.name,
                };
            });
            setCategoryOptions([{value: '', label: 'Select Category'}, ...categoryOptions]);
        }
    }, [allProductCategory]);

    useEffect(() => {
        if (allColorCodes) {
            let colorCodes = allColorCodes.map((code: any) => {
                const simpleLabel = `${code.name} - ${code.hex_code} (${code.code})`;

                return {
                    value: code.id,
                    label: simpleLabel,
                    colorCode: code.hex_code,
                };
            });
            setColorCodeOptions([{value: '', label: 'Select Color Code'}, ...colorCodes]);
        }
    }, [allColorCodes]);

    const customStyles = {
        option: (provided: any, state: any) => ({
            ...provided,
            backgroundColor: state.data.colorCode,
            color: 'black',
            padding: 20,
        }),
    };

    const handleChange = (name: string, value: any, required: boolean) => {
        setFormData({...formData, [name]: value})
        if (required) {
            if (!value) {
                setErrorMessages({...errorMessages, [name]: 'This field is required.'});
            } else {
                setErrorMessages({...errorMessages, [name]: ''});
            }
        }
    };

    useEffect(() => {
        const isValid = Object.values(errorMessages).some((message) => message !== '');
        setIsFormValid(!isValid);
        if (isValid) {
            setValidationMessage('Please fill all the required fields.');
        }
    }, [errorMessages]);

    return (
        <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="flex w-full flex-row items-start justify-between gap-3">
                <div className="flex justify-start flex-col items-start space-y-3 w-full">
                    <Input
                        divClasses='w-full'
                        label='Formula Name'
                        type='text'
                        name='formula_name'
                        value={formData.formula_name}
                        placeholder='Enter Formula Name'
                        onChange={(e) => handleChange(e.target.name, e.target.value, e.target.required)}
                        isMasked={false}
                        required={true}
                        errorMessage={errorMessages?.formula_name}
                    />

                    <Input
                        divClasses='w-full'
                        label='Formula Code'
                        type='text'
                        name='formula_code'
                        value={formData.formula_code}
                        placeholder='Enter Formula Code'
                        onChange={(e) => handleChange(e.target.name, e.target.value, e.target.required)}
                        isMasked={false}
                        disabled={true}
                        required={true}
                    />

                    <Dropdown
                        divClasses='w-full'
                        label='Category'
                        name='category_id'
                        value={formData.category_id}
                        options={categoryOptions}
                        onChange={(e: any) => {
                            if (e && typeof e !== 'undefined') {
                                handleChange('category_id', e.value, true)
                            } else {
                                handleChange('category_id', '', true)
                            }
                        }}
                        required={true}
                        errorMessage={errorMessages?.category_id}
                    />

                    <div className="w-full flex justify-center items-end gap-2">
                        <Dropdown
                            divClasses='w-full'
                            label='Color Code'
                            name='color_code_id'
                            value={formData.color_code_id}
                            styles={customStyles}
                            options={colorCodeOptions}
                            onChange={(e: any, required: any) => {
                                if (e && typeof e !== 'undefined') {
                                    handleChange('color_code_id', e.value, true)
                                } else {
                                    handleChange('color_code_id', '', true)
                                }
                            }}
                            required={true}
                            errorMessage={errorMessages?.color_code_id}
                        />
                        <Button
                            type={ButtonType.button}
                            text={getIcon(IconType.add)}
                            variant={ButtonVariant.primary}
                            onClick={() => setColorCodeModal(true)}
                        />
                    </div>
                </div>
                <div className="w-full border rounded p-5 hidden md:block">
                    <h5 className="text-lg font-semibold dark:text-white-light mb-3">Formula Instructions</h5>
                    <ul className="list-decimal list-inside space-y-2">
                        <li>Enter the name of the formula</li>
                        <li>Enter the code of the formula</li>
                        <li>Select the category of the formula</li>
                        <li>Select the color code of the formula</li>
                        <li>Make sure to fill out all required field</li>
                        <li>Add raw products which will be include in the formula</li>
                    </ul>
                </div>
            </div>

            <RawProductItemListing
                rawProducts={rawProducts}
                setRawProducts={setRawProducts}
                type={RAW_PRODUCT_LIST_TYPE.PRODUCT_ASSEMBLY}
            />
            {isFormValid && rawProducts.length > 0 && (
                <Button
                    classes="!mt-6"
                    type={ButtonType.submit}
                    text={loading ? 'loading...' : id ? 'Update Product Assembly' : 'Create Product Assembly'}
                    variant={ButtonVariant.primary}
                />
            )}

            <ColorCodeFormModal
                modalOpen={colorCodeModal}
                setModalOpen={setColorCodeModal}
            />
        </form>
    );
};

export default ProductAssemblyForm;
