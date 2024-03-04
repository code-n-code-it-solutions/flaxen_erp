import React, {useEffect, useState} from 'react';
import Link from "next/link";
import dynamic from 'next/dynamic';
import {useDispatch, useSelector} from "react-redux";
import {ThunkDispatch} from "redux-thunk";
import {IRootState} from "@/store";
import {AnyAction} from "redux";
import {useRouter} from "next/router";
import {setPageTitle} from "@/store/slices/themeConfigSlice";
import {setAuthToken} from "@/configs/api.config";
import {getProductCategory} from "@/store/slices/categorySlice";
import {clearProductAssemblyState, storeProductAssembly} from "@/store/slices/productAssemblySlice";
import {getColorCodes, storeColorCode} from "@/store/slices/colorCodeSlice";
import ColorCodeFormModal from "@/components/specific-modal/ColorCodeFormModal";
import {clearUtilState, generateCode} from "@/store/slices/utilSlice";
import {FORM_CODE_TYPE, RAW_PRODUCT_LIST_TYPE} from "@/utils/enums";
import RawProductModal from "@/components/specific-modal/raw-modal/RawProductModal";
import {Input} from "@/components/form/Input";
import {Dropdown} from "@/components/form/Dropdown";
import PageWrapper from "@/components/PageWrapper";
import {RawProductItemListing} from "@/components/RawProductItemListing";

const Select = dynamic(
    () => import('react-select'),
    {ssr: false} // This will load the component only on the client-side
);

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
    raw_product_id: number
    unit_id: number
    quantity: number
    unit_price: number
    total: number
}

const Create = () => {
    const dispatch = useDispatch<ThunkDispatch<IRootState, any, AnyAction>>();
    const router = useRouter();
    const {token} = useSelector((state: IRootState) => state.user);
    const {allProductCategory} = useSelector((state: IRootState) => state.productCategory);
    const {code} = useSelector((state: IRootState) => state.util);
    const colorCodeState = useSelector((state: IRootState) => state.colorCode);
    const {productAssembly, success} = useSelector((state: IRootState) => state.productAssembly);

    const [formulaName, setFormulaName] = useState('');
    const [formulaCode, setFormulaCode] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [colorCodeId, setColorCodeId] = useState('');
    const [colorCodeModal, setColorCodeModal] = useState(false);


    const [rawProducts, setRawProducts] = useState<ITableRow[]>([]);
    const [categoryOptions, setCategoryOptions] = useState<any>([]);
    const [colorCodeOptions, setColorCodeOptions] = useState<any>([]);

    const breadcrumbItems = [
        {
            title: 'Home',
            href: '/main',
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

        let rawProductsData: IRawProduct[] = rawProducts.map((row: any) => {
            return {
                raw_product_id: row.raw_product_id,
                unit_id: row.unit_id,
                quantity: row.quantity,
                unit_price: row.quantity * row.unit_price,
                total: row.total,
            }
        });
        const formData: IFormData = {
            formula_name: formulaName,
            formula_code: formulaCode,
            category_id: parseInt(categoryId),
            color_code_id: parseInt(colorCodeId),
            raw_products: rawProductsData,
        };
        setAuthToken(token)
        dispatch(clearProductAssemblyState());
        dispatch(storeProductAssembly(formData));
    };

    const handleColorCodeSubmit = (value: any) => {
        // setColorCodeModal(false);
        dispatch(storeColorCode(value));
    }

    useEffect(() => {
        setAuthToken(token)
        dispatch(setPageTitle('Create Product Assembly'));
        dispatch(clearUtilState());
        dispatch(getProductCategory());
        dispatch(getColorCodes());
        dispatch(generateCode(FORM_CODE_TYPE.PRODUCT_ASSEMBLY));
        // dispatch(clearRawProduct());
        // if (id) {
        //     dispatch(editRawProduct(id));
        // }
    }, []);

    useEffect(() => {
        if (code) {
            setFormulaCode(code[FORM_CODE_TYPE.PRODUCT_ASSEMBLY]);
        }
    }, [code]);

    useEffect(() => {
        if (productAssembly && success) {
            dispatch(clearProductAssemblyState());
            router.push('/inventory/product-assembly');
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
            })
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
            })
            setColorCodeOptions([{value: '', label: 'Select Color Code'}, ...colorCodes]);
        }
    }, [colorCodeState.allColorCodes]);

    const customStyles = {
        option: (provided: any, state: any) => ({
            ...provided,
            backgroundColor: state.data.colorCode,
            color: 'black', // Adjust text color here if needed
            padding: 20,
        }),
        // Add other custom styles here if needed
    };

    return (
        <PageWrapper
            embedLoader={false}
            breadCrumbItems={breadcrumbItems}
        >
            <div>
                <div className="mb-5 flex items-center justify-between">
                    <h5 className="text-lg font-semibold dark:text-white-light">Enter Details of Assembly</h5>
                    <Link href="/inventory/product-assembly"
                          className="btn btn-primary btn-sm m-1">
                        <span className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ltr:mr-2 rtl:ml-2" width="24"
                                 height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M15 5L9 12L15 19" stroke="currentColor" strokeWidth="1.5"
                                      strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Back
                        </span>
                    </Link>
                </div>
                <form className="space-y-5" onSubmit={handleSubmit}>
                    <div className="flex justify-start flex-col items-start space-y-3 w-full md:w-1/2">
                        <Input
                            divClasses='w-full'
                            label='Formula Name'
                            type='text'
                            name='formula_name'
                            value={formulaName}
                            placeholder='Enter Formula Name'
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormulaName(e.target.value)}
                            isMasked={false}
                        />
                        <Input
                            divClasses='w-full'
                            label='Formula Code'
                            type='text'
                            name='formula_code'
                            value={formulaCode}
                            placeholder='Enter Formula Code'
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormulaCode(e.target.value)}
                            isMasked={false}
                        />
                        <Dropdown
                            divClasses='w-full'
                            label='Category'
                            name='category_id'
                            value={categoryId}
                            options={categoryOptions}
                            onChange={(e: any) => setCategoryId(e && typeof e !== 'undefined' ? e.value : '')}
                        />
                        <div className="w-full flex justify-center items-end gap-2">
                            <Dropdown
                                divClasses='w-full'
                                label='Color Code'
                                name='color_code_id'
                                value={colorCodeId}
                                styles={customStyles}
                                options={colorCodeOptions}
                                onChange={(e: any) => setColorCodeId(e && typeof e !== 'undefined' ? e.value : '')}
                            />
                            <button type="button"
                                    className="btn btn-primary btn-sm flex justify-center items-center"
                                    onClick={() => setColorCodeModal(true)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                     className="h-5 w-5 ltr:mr-2 rtl:ml-2"
                                     fill="none">
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
                                    <path d="M15 12L12 12M12 12L9 12M12 12L12 9M12 12L12 15" stroke="currentColor"
                                          strokeWidth="1.5" strokeLinecap="round"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                    <RawProductItemListing
                        rawProducts={rawProducts}
                        setRawProducts={setRawProducts}
                        // handleEditProductItem={}
                        // handleRemove={}
                        type={RAW_PRODUCT_LIST_TYPE.PRODUCT_ASSEMBLY}
                    />
                    {/*<div>*/}
                    {/*    <div className="flex justify-end items-center mb-3">*/}
                    {/*        <button type="button" onClick={() => setModal(true)}*/}
                    {/*                className="btn btn-primary btn-sm">Add Row*/}
                    {/*        </button>*/}
                    {/*    </div>*/}
                    {/*    <table>*/}
                    {/*        <thead>*/}
                    {/*        <tr>*/}
                    {/*            <th>Product</th>*/}
                    {/*            <th>Unit</th>*/}
                    {/*            <th>Qty</th>*/}
                    {/*            <th>Cost</th>*/}
                    {/*            <th>Total</th>*/}
                    {/*            <th>Action</th>*/}
                    {/*        </tr>*/}
                    {/*        </thead>*/}
                    {/*        <tbody>*/}
                    {/*        {rawProducts.map((row: ITableRow) => (*/}
                    {/*            <tr key={row.id}>*/}
                    {/*                <td>{row.raw_product_title}</td>*/}
                    {/*                <td>{row.unit_title}</td>*/}
                    {/*                <td>{row.quantity}</td>*/}
                    {/*                <td>{(row.unit_price * row.quantity).toFixed(2)}</td>*/}
                    {/*                /!*<td>{row.total}</td>*!/*/}
                    {/*                <td>*/}
                    {/*                    <button onClick={() => handleRemoveRow(row.id)}*/}
                    {/*                            className="btn btn-danger btn-sm">*/}
                    {/*                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"*/}
                    {/*                             viewBox="0 0 24 24" fill="none">*/}
                    {/*                            <path d="M20.5001 6H3.5" stroke="currentColor" strokeWidth="1.5"*/}
                    {/*                                  strokeLinecap="round"/>*/}
                    {/*                            <path*/}
                    {/*                                d="M18.8332 8.5L18.3732 15.3991C18.1962 18.054 18.1077 19.3815 17.2427 20.1907C16.3777 21 15.0473 21 12.3865 21H11.6132C8.95235 21 7.62195 21 6.75694 20.1907C5.89194 19.3815 5.80344 18.054 5.62644 15.3991L5.1665 8.5"*/}
                    {/*                                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>*/}
                    {/*                            <path*/}
                    {/*                                d="M6.5 6C6.55588 6 6.58382 6 6.60915 5.99936C7.43259 5.97849 8.15902 5.45491 8.43922 4.68032C8.44784 4.65649 8.45667 4.62999 8.47434 4.57697L8.57143 4.28571C8.65431 4.03708 8.69575 3.91276 8.75071 3.8072C8.97001 3.38607 9.37574 3.09364 9.84461 3.01877C9.96213 3 10.0932 3 10.3553 3H13.6447C13.9068 3 14.0379 3 14.1554 3.01877C14.6243 3.09364 15.03 3.38607 15.2493 3.8072C15.3043 3.91276 15.3457 4.03708 15.4286 4.28571L15.5257 4.57697C15.5433 4.62992 15.5522 4.65651 15.5608 4.68032C15.841 5.45491 16.5674 5.97849 17.3909 5.99936C17.4162 6 17.4441 6 17.5 6"*/}
                    {/*                                stroke="currentColor" strokeWidth="1.5"/>*/}
                    {/*                        </svg>*/}
                    {/*                    </button>*/}
                    {/*                </td>*/}
                    {/*            </tr>*/}
                    {/*        ))}*/}

                    {/*        {rawProducts.length > 0 &&*/}
                    {/*            <tr className='bg-gray-100'>*/}
                    {/*                <td></td>*/}
                    {/*                <td>Total Quantity</td>*/}
                    {/*                <td>{totalQuantity}</td>*/}
                    {/*                <td>{totalCost}</td>*/}
                    {/*                /!*<td></td>*!/*/}
                    {/*                <td></td>*/}
                    {/*            </tr>*/}
                    {/*        }*/}
                    {/*        </tbody>*/}
                    {/*    </table>*/}
                    {/*</div>*/}

                    <button type="submit" className="btn btn-primary !mt-6">
                        Submit
                    </button>
                </form>
                {/*<RawProductModal*/}
                {/*    listFor={RAW_PRODUCT_LIST_TYPE.PRODUCT_ASSEMBLY}*/}
                {/*    modalOpen={modal}*/}
                {/*    setModalOpen={setModal}*/}
                {/*    handleSubmit={(value: any) => handleAddRow(value)}*/}
                {/*/>*/}
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
