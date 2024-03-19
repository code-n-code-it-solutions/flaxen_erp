import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {ThunkDispatch} from "redux-thunk";
import {IRootState} from "@/store";
import {AnyAction} from "redux";
import {useRouter} from "next/router";
import {setPageTitle} from "@/store/slices/themeConfigSlice";
import {
    clearProductAssemblyState,
    editProductAssembly,
    storeProductAssembly, updateProductAssembly
} from "@/store/slices/productAssemblySlice";
import PageWrapper from "@/components/PageWrapper";
import Link from "next/link";
import {Input} from "@/components/form/Input";
import {Dropdown} from "@/components/form/Dropdown";
import RawProductItemListing from "@/components/listing/RawProductItemListing";
import {RAW_PRODUCT_LIST_TYPE} from "@/utils/enums";
import ColorCodeFormModal from "@/components/modals/ColorCodeFormModal";
import {setAuthToken} from "@/configs/api.config";
import {getColorCodes, storeColorCode} from "@/store/slices/colorCodeSlice";
import {getProductCategory} from "@/store/slices/categorySlice";

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

const Edit = () => {
    const dispatch = useDispatch<ThunkDispatch<IRootState, any, AnyAction>>();
    const router = useRouter();
    const {productAssembly, loading,productAssemblyDetail} = useSelector((state: IRootState) => state.productAssembly);

    const [formulaName, setFormulaName] = useState<string>('');
    const [formulaCode, setFormulaCode] = useState<string>('');
    const [categoryId, setCategoryId] = useState<number>(0);
    const [colorCodeId, setColorCodeId] = useState<number>(0);
    const [colorCodeModal, setColorCodeModal] = useState(false);


    const [rawProducts, setRawProducts] = useState<ITableRow[]>([]);
    const [categoryOptions, setCategoryOptions] = useState<any>([]);
    const [colorCodeOptions, setColorCodeOptions] = useState<any>([]);

    const {token} = useSelector((state: IRootState) => state.user);
    const {allProductCategory} = useSelector((state: IRootState) => state.productCategory);
    const colorCodeState = useSelector((state: IRootState) => state.colorCode);

    const breadCrumbItems = [
        {
            title: 'Home',
            href: '/main',
        },
        {
            title: 'Inventory Dashboard',
            href: '/inventory',
        },
        {
            title: 'All Product Assembly',
            href: '/inventory/product-assembly',
        },
        {
            title: 'Create New',
            href: '#',
        },
    ];

    useEffect(() => {
        if (productAssemblyDetail) {
            console.log(productAssemblyDetail)
            setFormulaName(productAssemblyDetail.formula_name);
            setFormulaCode(productAssemblyDetail.formula_code);
            setCategoryId(productAssemblyDetail.category_id);
            setColorCodeId(productAssemblyDetail.color_code_id);
            setRawProducts(productAssemblyDetail.product_assembly_items.map((item: any) => {
                return {
                    id: item.id,
                    raw_product_id: item.raw_product_id,
                    raw_product_title: item.product.title,
                    unit_id: item.unit_id,
                    unit_title: item.unit.name,
                    unit_price: parseFloat(item.product.opening_stock_unit_balance),
                    quantity: parseFloat(item.quantity),
                    cost: parseFloat(item.cost),
                    total: parseFloat(item.total),
                }
            }));
            dispatch(getProductCategory());
            dispatch(getColorCodes());
        }
    }, [productAssemblyDetail]);

    useEffect(() => {
        if (productAssembly) {
            dispatch(clearProductAssemblyState());
            router.push('/inventory/product-assembly');
        }
    }, [productAssembly]);

    useEffect(() => {
        const {id} = router.query;
        if (typeof id === 'string' && id) {
            dispatch(editProductAssembly(parseInt(id)))
        }

        dispatch(setPageTitle('Edit Product Assembly'));
    }, [router.query]);

    useEffect(() => {
        if (colorCodeState.colorCode && colorCodeState.success) {
            setColorCodeModal(false);
            dispatch(getColorCodes());
        }
    }, [colorCodeState.colorCode, colorCodeState.success]);


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
            category_id: categoryId,
            color_code_id: colorCodeId,
            raw_products: rawProductsData,
        };
        setAuthToken(token)
        dispatch(clearProductAssemblyState());
        dispatch(updateProductAssembly({id: productAssemblyDetail.id, productAssemblyData: formData}));
    };
    const handleColorCodeSubmit = (value: any) => {
        // setColorCodeModal(false);
        dispatch(storeColorCode(value));
    };

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
            embedLoader={true}
            breadCrumbItems={breadCrumbItems}
            loading={loading}
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
                {productAssemblyDetail && (
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
                                disabled={true}
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
                            type={RAW_PRODUCT_LIST_TYPE.PRODUCT_ASSEMBLY}
                        />


                        <button type="submit" className="btn btn-primary !mt-6">
                            Update Product Assembly
                        </button>
                    </form>
                )}


                <ColorCodeFormModal
                    modalOpen={colorCodeModal}
                    setModalOpen={setColorCodeModal}
                    handleSubmit={(value: any) => handleColorCodeSubmit(value)}
                />
            </div>
        </PageWrapper>
    );
};

export default Edit;
