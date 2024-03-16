import React, { useEffect, useState } from 'react';
import Breadcrumb from '@/components/Breadcrumb';
// import Select from 'react-select';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import {useDispatch, useSelector} from "react-redux";
import {ThunkDispatch} from "redux-thunk";
import {IRootState} from "@/store";
import {AnyAction} from "redux";
import {useRouter} from "next/router";
import {setPageTitle} from "@/store/slices/themeConfigSlice";
import {setAuthToken, setContentType} from "@/configs/api.config";
import {clearProductAssemblyState, getAssemblyItems, getProductAssemblies} from "@/store/slices/productAssemblySlice";
import {clearProductionState, storeProduction} from "@/store/slices/productionSlice";
import {getRandomInt} from "@/utils/helper";
import {clearUtilState, generateCode} from "@/store/slices/utilSlice";
import {FORM_CODE_TYPE, RAW_PRODUCT_LIST_TYPE} from "@/utils/enums";
import RawProductModal from "@/components/modals/RawProductModal";

const Select = dynamic(
    () => import('react-select'),
    { ssr: false } // This will load the component only on the client-side
);

interface ITableRow {
    id: number;
    raw_product_id: string;
    raw_product_title: string;
    unit_id: string;
    unit_title: string;
    unit_cost: number;
    quantity: number;
    availableQuantity: number;
    requiredQuantity: number;
    totalCost: number;
}

interface IFormData {
    batch_number: string;
    no_of_quantity: number;
    product_assembly_id: number;
    production_items: IRawProduct[];
}

interface IRawProduct {
    raw_product_id: number;
    unit_id: number;
    quantity: number;
    cost: number;
    total: number;
}

const Create = () => {
    const dispatch = useDispatch<ThunkDispatch<IRootState, any, AnyAction>>();
    const router = useRouter();
    const { token } = useSelector((state: IRootState) => state.user);
    const { code } = useSelector((state: IRootState) => state.util);
    const { allProductAssemblies, assemblyItems } = useSelector((state: IRootState) => state.productAssembly);
    const { production, success } = useSelector((state: IRootState) => state.production);

    const [batchNumber, setBatchNumber] = useState('');
    const [noOfQuantity, setNoOfQuantity] = useState(0);
    const [productAssemblyId, setProductAssemblyId] = useState('');
    const [modal, setModal] = useState(false);
    const [modalFormData, setModalFormData] = useState<any>({});
    const [rawProducts, setRawProducts] = useState<ITableRow[]>([]);
    const [productAssemblyOptions, setProductAssemblyOptions] = useState<any>([]);
    const [totalQuantity, setTotalQuantity] = useState(0);
    const [totalRequiredQuantity, setRequiredQuantity] = useState(0);
    const [messages, setMessages] = useState("Production can't be proceeding. Please purchase the In-stock quantities.");

    const hasInsufficientQuantity = () => {
        return rawProducts.some((row) => row.availableQuantity < row.requiredQuantity);
    };

    const handleAddRow = (value: any) => {
        setRawProducts((prev) => {
            const existingRow = prev.find((row) => row.id === value.id);
            if (existingRow) {
                return prev.map((row) => (row.id === value.id ? value : row));
            } else {
                return [...prev, value];
            }
        });
        setModalFormData({});
        setModal(false);
    };

    const handleRemoveRow = (id: number) => {
        setRawProducts(rawProducts.filter((row) => row.id !== id));
    };

    const handleRowEdit = (id: number) => {
        let row = rawProducts.find((row) => row.id === id);
        if (row) {
            setModalFormData(row);
            setModal(true);
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        let rawProductsData: any = rawProducts.map((row: any) => {
            return {
                raw_product_id: row.raw_product_id,
                unit_id: row.unit_id,
                quantity: row.quantity,
                unit_cost: row.unit_cost,
                available_quantity: row.availableQuantity,
                required_quantity: row.requiredQuantity,
                total_cost: row.totalCost,
            };
        });

        const formData: IFormData = {
            batch_number: batchNumber,
            no_of_quantity: noOfQuantity,
            product_assembly_id: parseInt(productAssemblyId),
            production_items: rawProductsData,
        };
        setAuthToken(token);
        setContentType('application/json');
        dispatch(clearProductAssemblyState());
        dispatch(storeProduction(formData));
    };

    const handleFormulaChange = (e: any) => {
        if (noOfQuantity > 0) {
            if (e && typeof e !== 'undefined') {
                setProductAssemblyId(e ? e.value : '');
                setAuthToken(token);
                dispatch(clearProductAssemblyState());
                dispatch(getAssemblyItems(e.value));
            } else {
                setProductAssemblyId('');
                setRawProducts([]);
            }
        } else {
            alert('No of Quantity is required');
        }
        
        if (hasInsufficientQuantity()) {
            setMessages("Production can't be proceeding. Please purchase the In-stock quantities.");
        }
    };

    useEffect(() => {
        setAuthToken(token);
        dispatch(setPageTitle('Create Productions'));
        dispatch(getProductAssemblies());
        // dispatch(clearRawProduct());
        // if (id) {
        //     dispatch(editRawProduct(id));
        // }
        setModal(false);
    }, []);

    useEffect(() => {
        if (production && success) {
            dispatch(clearProductionState());
            router.push('/inventory/productions');
        }
    }, [production, success]);

    useEffect(() => {
        if (allProductAssemblies) {
            let formulaOptions = allProductAssemblies.map((assembly: any) => {
                return {
                    value: assembly.id,
                    label: assembly.formula_name + ' (' + assembly.formula_code + ')',
                };
            });
            setProductAssemblyOptions([{ value: '', label: 'Select Formula' }, ...formulaOptions]);
        }
    }, [allProductAssemblies]);

    useEffect(() => {
        if (assemblyItems) {
            let rawProducts = assemblyItems.map((item: any) => {
                return {
                    id: performance.now() + getRandomInt(1000, 9999),
                    raw_product_id: item.raw_product_id,
                    raw_product_title: item.product.title,
                    unit_id: item.unit_id,
                    unit_title: item.unit.name,
                    unit_cost: parseFloat(item.cost),
                    quantity: parseFloat(item.quantity),
                    availableQuantity: parseFloat(item.available_stock),
                    requiredQuantity: item.quantity * noOfQuantity,
                    totalCost: item.product.opening_stock_unit_balance * item.quantity * noOfQuantity,
                };
            });
            setRawProducts(rawProducts);
        }
    }, [assemblyItems]);

    useEffect(() => {
        dispatch(clearUtilState());
        dispatch(generateCode(FORM_CODE_TYPE.PRODUCTION));
    }, []);

    useEffect(() => {
        if (code) {
            setBatchNumber(code[FORM_CODE_TYPE.PRODUCTION]);
        }
    }, [code]);

    return (
        <div>
            <Breadcrumb
                items={[
                    {
                        title: 'Home',
                        href: '/main',
                    },
                    {
                        title: 'All Productions',
                        href: '/inventory/productions',
                    },
                    {
                        title: 'Create New',
                        href: '#',
                    },
                ]}
            />
            <div className='mt-5'>
                {hasInsufficientQuantity() && 
                <Alert 
                alertType="error" 
                message={messages} 
                setMessages={setMessages} 
                />}
            </div>

            <div className="pt-5">
                <div className="panel">
                    <div className="mb-5 flex items-center justify-between">
                        <h5 className="text-lg font-semibold dark:text-white-light">Enter Details of Productions</h5>
                        <Link href="/inventory/productions" className="btn btn-primary btn-sm m-1">
                            <span className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ltr:mr-2 rtl:ml-2" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M15 5L9 12L15 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Back
                            </span>
                        </Link>
                    </div>
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div className="flex w-full flex-col items-start justify-start space-y-3 md:w-1/2">
                            <div className="w-full">
                                <label htmlFor="production_name">Batch Number</label>
                                <input
                                    id="batch_number"
                                    type="text"
                                    name="batch_number"
                                    placeholder="Enter Batch Number"
                                    value={batchNumber}
                                    disabled={true}
                                    onChange={(e) => setBatchNumber(e.target.value)}
                                    className="form-input"
                                />
                            </div>
                            <div className="w-full">
                                <label htmlFor="no_of_quantity">No of Quantity (KG)</label>
                                <input
                                    id="no_of_quantity"
                                    type="number"
                                    name="no_of_quantity"
                                    placeholder="Enter No of Quantity"
                                    value={noOfQuantity}
                                    onChange={(e) => setNoOfQuantity(parseInt(e.target.value) || 0)}
                                    className="form-input"
                                />
                            </div>
                            <div className="w-full">
                                <label htmlFor="product_assembly_id">Formulas</label>
                                <Select
                                    defaultValue={productAssemblyOptions[0]}
                                    options={productAssemblyOptions}
                                    isSearchable={true}
                                    isClearable={true}
                                    placeholder={'Select Formula'}
                                    onChange={(e: any) => handleFormulaChange(e)}
                                />
                            </div>
                        </div>

                        <div className="table-responsive">
                            {/*<div className="flex justify-end items-center mb-3">*/}
                            {/*    <button type="button" onClick={() => setModal(true)}*/}
                            {/*            className="btn btn-primary btn-sm">Add Row*/}
                            {/*    </button>*/}
                            {/*</div>*/}
                            <table>
                                <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th>Unit</th>
                                        <th>Unit Price (KG)</th>
                                        <th>Qty</th>
                                        <th>Available QTY (KG)</th>
                                        <th>Required QTY (KG)</th>
                                        <th>Cost</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rawProducts.map((row: ITableRow) => (
                                        <tr key={row.id}>
                                            <td>{row.raw_product_title}</td>
                                            <td>{row.unit_title}</td>
                                            <td>{row.unit_cost.toFixed(2)}</td>
                                            <td>{row.quantity}</td>
                                            <td>{row.availableQuantity.toFixed(2)}</td>
                                            <td>{row.requiredQuantity.toFixed(5)}</td>
                                            <td>{row.totalCost.toFixed(2)}</td>
                                        </tr>
                                    ))}
                                    {rawProducts.length === 0 ? (
                                        <tr>
                                            <td colSpan={8} className="text-center">
                                                No Item Added
                                            </td>
                                        </tr>
                                    ) : (
                                        <tr>
                                            <td colSpan={2} className="text-center font-bold">
                                                Total
                                            </td>
                                            <td className="text-left font-bold">{rawProducts.reduce((acc: number, item) => acc + item.unit_cost, 0)}</td>
                                            <td className="text-left font-bold">{rawProducts.reduce((acc: number, item) => acc + item.quantity, 0).toFixed(2)}</td>
                                            <td className="text-left font-bold">{rawProducts.reduce((acc: number, item) => acc + item.availableQuantity, 0)}</td>
                                            <td className="text-left font-bold">{rawProducts.reduce((acc: number, item) => acc + item.requiredQuantity, 0)}</td>
                                            <td className="text-left font-bold">{rawProducts.reduce((acc: number, item) => acc + item.totalCost, 0).toFixed(2)}</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {!hasInsufficientQuantity() && (
                            <button type="submit" className="btn btn-primary !mt-6">
                                Submit
                            </button>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Create;
