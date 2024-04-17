import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {ThunkDispatch} from 'redux-thunk';
import {IRootState} from '@/store';
import {AnyAction} from 'redux';
import {useRouter} from 'next/router';
import {setPageTitle} from '@/store/slices/themeConfigSlice';
import {setAuthToken} from '@/configs/api.config';
import {getProductCategory} from '@/store/slices/categorySlice';
import {clearProductAssemblyState, storeProductAssembly} from '@/store/slices/productAssemblySlice';
import {getColorCodes, storeColorCode} from '@/store/slices/colorCodeSlice';
import ColorCodeFormModal from '@/components/modals/ColorCodeFormModal';
import {clearUtilState, generateCode} from '@/store/slices/utilSlice';
import {ButtonType, ButtonVariant, FORM_CODE_TYPE, IconType, RAW_PRODUCT_LIST_TYPE} from '@/utils/enums';
import {Input} from '@/components/form/Input';
import {Dropdown} from '@/components/form/Dropdown';
import PageWrapper from '@/components/PageWrapper';
import RawProductItemListing from '@/components/listing/RawProductItemListing';
import Button from "@/components/Button";
import {getIcon} from "@/utils/helper";


interface ITableRow {
    id: number;
    raw_product_id: string;
    raw_product_title: string;
    unit_id: string;
    unit_title: string;
    unit_price: number;
    quantity: number;
    cost: number;
    total: number;
}

interface IFormData {
    formula_name: string;
    formula_code: string;
    category_id: number;
    color_code_id: number;
    raw_products: IRawProduct[];
}

interface IRawProduct {
    raw_product_id: number;
    unit_id: number;
    quantity: number;
    unit_price: number;
    total: number;
}

const Create = () => {
    const dispatch = useDispatch<ThunkDispatch<IRootState, any, AnyAction>>();
    const router = useRouter();
    const {token} = useSelector((state: IRootState) => state.user);
    const {allProductCategory} = useSelector((state: IRootState) => state.productCategory);
    const {code} = useSelector((state: IRootState) => state.util);
    const colorCodeState = useSelector((state: IRootState) => state.colorCode);
    const {productAssembly, success} = useSelector((state: IRootState) => state.productAssembly);

    const [formData, setFormData] = useState<any>({})
    const [colorCodeModal, setColorCodeModal] = useState(false);

    const [rawProducts, setRawProducts] = useState<ITableRow[]>([]);
    const [categoryOptions, setCategoryOptions] = useState<any>([]);
    const [colorCodeOptions, setColorCodeOptions] = useState<any>([]);
    const [isFormValid, setIsFormValid] = useState<boolean>(false);
    const [validationMessage, setValidationMessage] = useState('');
    const [Message, setMessage] = useState('');
    const [errorMessages, setErrorMessages] = useState<any>({});

    const breadcrumbItems = [
        {
            title: 'Home',
            href: '/main',
        },
        {
            title: 'Inventory Dashboard',
            href: '/inventory',
        },
        {
            title: 'All Product Assemblies',
            href: '/inventory/product-assembly',
        },
        {
            title: 'Create New',
            href: '#',
        },
    ];

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
            dispatch(storeProductAssembly(finalData));
        }
    };

    const handleColorCodeSubmit = (value: any) => {
        // setColorCodeModal(false);
        dispatch(storeColorCode(value));
    };

    useEffect(() => {
        setAuthToken(token);
        dispatch(setPageTitle('Create Product Assembly'));
        dispatch(clearUtilState());
        dispatch(getProductCategory());
        dispatch(getColorCodes());
        dispatch(generateCode(FORM_CODE_TYPE.PRODUCT_ASSEMBLY));
        console.log(validationMessage, errorMessages)
    }, []);

    useEffect(() => {
        if (code) {
            setFormData({...formData, formula_code: code[FORM_CODE_TYPE.PRODUCT_ASSEMBLY]});
        }
    }, [code]);

    useEffect(() => {
        if (productAssembly && success) {
            dispatch(clearProductAssemblyState());
            router.push('/erp/inventory/product-assembly');
        }
    }, [productAssembly, success]);

    useEffect(() => {
        if (colorCodeState.colorCode && colorCodeState.success) {
            setColorCodeModal(false);
            dispatch(getColorCodes());
        }
    }, [colorCodeState.colorCode, success]);

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
        if (colorCodeState.allColorCodes) {
            let colorCodes = colorCodeState.allColorCodes.map((code: any) => {
                const simpleLabel = `${code.name} - ${code.hex_code} (${code.code})`;

                return {
                    value: code.id,
                    label: simpleLabel, // Use the simple label for searching
                    colorCode: code.hex_code, // Additional data for custom rendering
                };
            });
            setColorCodeOptions([{value: '', label: 'Select Color Code'}, ...colorCodes]);
        }
    }, [colorCodeState.allColorCodes]);

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
        <PageWrapper embedLoader={false} breadCrumbItems={breadcrumbItems}>
            <div>
                <div className="mb-5 flex items-center justify-between">
                    <h5 className="text-lg font-semibold dark:text-white-light">Enter Details of Assembly</h5>
                    <Button
                        type={ButtonType.link}
                        text={
                            <span className="flex items-center">
                                {getIcon(IconType.back)}
                                Back
                            </span>
                        }
                        variant={ButtonVariant.primary}
                        link="/inventory/product-assembly"
                    />
                </div>
                <form className="space-y-5" onSubmit={handleSubmit}>
                    {/*{!isFormValid && validationMessage && <Alert alertType="error" message={validationMessage} setMessages={setValidationMessage} />}*/}
                    {/*{rawProducts.length === 0 && Message && <Alert alertType="error" message={Message} setMessages={setMessage} />}*/}
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
                        // key={rawProducts.length}
                        rawProducts={rawProducts}
                        setRawProducts={setRawProducts}
                        type={RAW_PRODUCT_LIST_TYPE.PRODUCT_ASSEMBLY}
                    />
                    {isFormValid && rawProducts.length > 0 && (
                        <Button
                            classes="!mt-6"
                            type={ButtonType.submit}
                            text="Submit"
                            variant={ButtonVariant.primary}
                        />
                    )}
                </form>
                <ColorCodeFormModal
                    modalOpen={colorCodeModal}
                    setModalOpen={setColorCodeModal}
                    handleSubmit={(value: any) => handleColorCodeSubmit(value)}
                />
            </div>
        </PageWrapper>
    );
};

export default Create;
