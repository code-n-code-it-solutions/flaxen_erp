import React, {useEffect, useState} from 'react';
import Breadcrumb from "@/components/Breadcrumb";
// import Select from 'react-select';
import Link from "next/link";
import dynamic from 'next/dynamic';
import {useDispatch, useSelector} from "react-redux";
import {ThunkDispatch} from "redux-thunk";
import {IRootState} from "@/store";
import {AnyAction} from "redux";
import {useRouter} from "next/router";
import {setPageTitle} from "@/store/slices/themeConfigSlice";
import {setAuthToken, setContentType} from "@/configs/api.config";
import {clearProductAssemblyState, getAssemblyItems, getProductAssemblies} from "@/store/slices/productAssemblySlice";
import {clearProductionState} from "@/store/slices/productionSlice";
import {getRandomInt} from "@/utils/helper";
import RawProductModal from "@/components/modals/RawProductModal";
import {RAW_PRODUCT_LIST_TYPE} from "@/utils/enums";

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
    quantity: number;
    cost: number;
    total: number;
}

interface IFormData {
    filling_name: string;
    production_code: string;
    product_assembly_id: number;
    production_items: IRawProduct[];
}

interface IRawProduct {
    raw_product_id: number
    unit_id: number
    quantity: number
    cost: number
    total: number
}

const Create = () => {
    const dispatch = useDispatch<ThunkDispatch<IRootState, any, AnyAction>>();
    const router = useRouter();
    const {token} = useSelector((state: IRootState) => state.user);
    const {allProductAssemblies, assemblyItems} = useSelector((state: IRootState) => state.productAssembly);
    const {production, success} = useSelector((state: IRootState) => state.production);

    const [productionName, setProductionName] = useState('');
    const [productionCode, setProductionCode] = useState('');
    const [productAssemblyId, setProductAssemblyId] = useState('');
    const [modal, setModal] = useState(false);
    const [modalFormData, setModalFormData] = useState<any>({});
    const [rawProducts, setRawProducts] = useState<ITableRow[]>([]);
    const [productAssemblyOptions, setProductAssemblyOptions] = useState<any>([]);

    const handleAddRow = (value:any) => {
        setRawProducts((prev) => {
            const existingRow = prev.find(row => row.id === value.id);
            if (existingRow) {
                return prev.map(row => row.id === value.id ? value : row);
            } else {
                return [...prev, value];
            }
        });
        setModalFormData({});
        setModal(false);
    };

    const handleRemoveRow = (id: number) => {
        setRawProducts(rawProducts.filter(row => row.id !== id));
    };

    const handleRowEdit = (id: number) => {
        let row = rawProducts.find(row => row.id === id);
        if (row) {
            setModalFormData(row);
            setModal(true);
        }
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        let rawProductsData: IRawProduct[] = rawProducts.map((row: any) => {
            return {
                raw_product_id: row.raw_product_id,
                unit_id: row.unit_id,
                quantity: row.quantity,
                cost: row.cost,
                total: row.total,
            }
        });
        const formData: IFormData = {
            filling_name: productionName,
            production_code: productionCode,
            product_assembly_id: parseInt(productAssemblyId),
            production_items: rawProductsData,
        };
        setAuthToken(token)
        setContentType('application/json')
        dispatch(clearProductAssemblyState());
        // dispatch(storeProduction(formData));
    };

    const handleFormulaChange = (e: any) => {
        if (e.value && typeof e === 'object') {
            setProductAssemblyId(e ? e.value : '');
            setAuthToken(token)
            dispatch(clearProductAssemblyState());
            dispatch(getAssemblyItems(e.value));
        }
    }

    useEffect(() => {
        setAuthToken(token)
        dispatch(setPageTitle('Create Productions'));
        dispatch(getProductAssemblies());
        // dispatch(clearRawProduct());
        // if (id) {
        //     dispatch(editRawProduct(id));
        // }
        setModal(false)
    }, []);

    useEffect(() => {
        if (production && success) {
            dispatch(clearProductionState());
            router.push('/inventory/fillings');
        }
    }, [production, success]);


    useEffect(() => {
        if (allProductAssemblies) {
            let formulaOptions = allProductAssemblies.map((assembly: any) => {
                return {
                    value: assembly.id,
                    label: assembly.formula_name + ' (' + assembly.formula_code + ')',
                };
            })
            setProductAssemblyOptions([{value: '', label: 'Select Production'}, ...formulaOptions]);
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
                    quantity: item.quantity,
                    cost: item.cost,
                    total: item.total,
                };
            })
            setRawProducts(rawProducts);
        }
    }, [assemblyItems]);

    return (
        <div>
            <Breadcrumb items={[
                {
                    title: 'Home',
                    href: '/main',
                },
                {
                    title: 'All Fillings',
                    href: '/inventory/fillings',
                },
                {
                    title: 'Create New',
                    href: '#',
                },
            ]}/>
            <div className="pt-5">
                <div className="panel">
                    <div className="mb-5 flex items-center justify-between">
                        <h5 className="text-lg font-semibold dark:text-white-light">Enter Details of Fillings</h5>
                        <Link href="/inventory/fillings"
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
                            <div className="w-full">
                                <label htmlFor="filling_name">Filling Name</label>
                                <input
                                    id="filling_name"
                                    type="text"
                                    name="filling_name"
                                    placeholder="Enter Filling Name"
                                    value={productionName}
                                    onChange={(e) => setProductionName(e.target.value)}
                                    className="form-input"/>
                            </div>
                            <div className="w-full">
                                <label htmlFor="filling_code">Filling Code</label>
                                <input
                                    id="filling_code"
                                    type="text"
                                    name="filling_code"
                                    placeholder="Enter Filling Code"
                                    value={productionCode}
                                    onChange={(e) => setProductionCode(e.target.value)}
                                    className="form-input"/>
                            </div>
                            <div className="w-full">
                                <label htmlFor="product_assembly_id">Productions</label>
                                <Select
                                    defaultValue={productAssemblyOptions[0]}
                                    options={productAssemblyOptions}
                                    isSearchable={true}
                                    isClearable={true}
                                    placeholder={'Select Production'}
                                    onChange={(e: any) => handleFormulaChange(e)}
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-end items-center mb-3">
                                <button type="button" onClick={() => setModal(true)}
                                        className="btn btn-primary btn-sm">Add Row
                                </button>
                            </div>
                            <table>
                                <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Unit</th>
                                    <th>Qty</th>
                                    {/*<th>Cost</th>*/}
                                    {/*<th>Total</th>*/}
                                    <th>Action</th>
                                </tr>
                                </thead>
                                <tbody>
                                {rawProducts.map((row: ITableRow) => (
                                    <tr key={row.id}>
                                        <td>{row.raw_product_title}</td>
                                        <td>{row.unit_title}</td>
                                        {/*<td>{row.quantity}</td>*/}
                                        {/*<td>{row.cost}</td>*/}
                                        <td>{row.total}</td>
                                        <td className="flex gap-2">
                                            <button onClick={() => handleRowEdit(row.id)}
                                                    className="btn btn-primary btn-sm">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                     className="h-5 w-5 ltr:mr-2 rtl:ml-2"
                                                     viewBox="0 0 24 24" fill="none">
                                                    <path
                                                        d="M8.25 15.5C8.25 15.9142 8.58579 16.25 9 16.25C9.41421 16.25 9.75 15.9142 9.75 15.5H8.25ZM11.6643 8.75249L12.1624 8.19186L12.1624 8.19186L11.6643 8.75249ZM11.25 10.425C11.25 10.8392 11.5858 11.175 12 11.175C12.4142 11.175 12.75 10.8392 12.75 10.425H11.25ZM11.7475 8.83575L12.3081 8.33756L12.3081 8.33756L11.7475 8.83575ZM6.33575 8.75249L5.83756 8.19186L5.83756 8.19186L6.33575 8.75249ZM5.25 10.425C5.25 10.8392 5.58579 11.175 6 11.175C6.41421 11.175 6.75 10.8392 6.75 10.425H5.25ZM6.25249 8.83575L5.69186 8.33756L5.69186 8.33756L6.25249 8.83575ZM7 14.75C6.58579 14.75 6.25 15.0858 6.25 15.5C6.25 15.9142 6.58579 16.25 7 16.25V14.75ZM11 16.25C11.4142 16.25 11.75 15.9142 11.75 15.5C11.75 15.0858 11.4142 14.75 11 14.75V16.25ZM7.925 9.25H9V7.75H7.925V9.25ZM9 9.25H10.075V7.75H9V9.25ZM9.75 15.5V8.5H8.25V15.5H9.75ZM10.075 9.25C10.5295 9.25 10.8007 9.25137 10.9965 9.27579C11.1739 9.29792 11.1831 9.3283 11.1661 9.31312L12.1624 8.19186C11.8612 7.92419 11.5109 7.82832 11.1822 7.78733C10.8719 7.74863 10.4905 7.75 10.075 7.75V9.25ZM12.75 10.425C12.75 10.0095 12.7514 9.62806 12.7127 9.31782C12.6717 8.98915 12.5758 8.63878 12.3081 8.33756L11.1869 9.33394C11.1717 9.31686 11.2021 9.32608 11.2242 9.50348C11.2486 9.69931 11.25 9.97047 11.25 10.425H12.75ZM11.1661 9.31312C11.1734 9.31964 11.1804 9.32659 11.1869 9.33394L12.3081 8.33756C12.2625 8.28617 12.2138 8.23752 12.1624 8.19186L11.1661 9.31312ZM7.925 7.75C7.50946 7.75 7.12806 7.74863 6.81782 7.78733C6.48914 7.82832 6.13878 7.92419 5.83756 8.19186L6.83394 9.31312C6.81686 9.3283 6.82608 9.29792 7.00348 9.27579C7.19931 9.25137 7.47047 9.25 7.925 9.25V7.75ZM6.75 10.425C6.75 9.97047 6.75137 9.69931 6.77579 9.50348C6.79792 9.32608 6.8283 9.31686 6.81312 9.33394L5.69186 8.33756C5.42419 8.63878 5.32832 8.98915 5.28733 9.31782C5.24863 9.62806 5.25 10.0095 5.25 10.425H6.75ZM5.83756 8.19186C5.78617 8.23752 5.73752 8.28617 5.69186 8.33756L6.81312 9.33394C6.81965 9.3266 6.8266 9.31965 6.83394 9.31312L5.83756 8.19186ZM7 16.25H11V14.75H7V16.25Z"
                                                        fill="currentColor"/>
                                                    <path
                                                        d="M12 4H10C6.22876 4 4.34315 4 3.17157 5.17157C2 6.34315 2 8.22876 2 12C2 15.7712 2 17.6569 3.17157 18.8284C4.34315 20 6.22876 20 10 20H12M15 4.00093C18.1143 4.01004 19.7653 4.10848 20.8284 5.17157C22 6.34315 22 8.22876 22 12C22 15.7712 22 17.6569 20.8284 18.8284C19.7653 19.8915 18.1143 19.99 15 19.9991"
                                                        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                                    <path d="M15 2V22" stroke="currentColor" strokeWidth="1.5"
                                                          strokeLinecap="round"/>
                                                </svg>
                                            </button>
                                            <button onClick={() => handleRemoveRow(row.id)}
                                                    className="btn btn-danger btn-sm">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                     viewBox="0 0 24 24" fill="none">
                                                    <path d="M20.5001 6H3.5" stroke="currentColor" strokeWidth="1.5"
                                                          strokeLinecap="round"/>
                                                    <path
                                                        d="M18.8332 8.5L18.3732 15.3991C18.1962 18.054 18.1077 19.3815 17.2427 20.1907C16.3777 21 15.0473 21 12.3865 21H11.6132C8.95235 21 7.62195 21 6.75694 20.1907C5.89194 19.3815 5.80344 18.054 5.62644 15.3991L5.1665 8.5"
                                                        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                                    <path
                                                        d="M6.5 6C6.55588 6 6.58382 6 6.60915 5.99936C7.43259 5.97849 8.15902 5.45491 8.43922 4.68032C8.44784 4.65649 8.45667 4.62999 8.47434 4.57697L8.57143 4.28571C8.65431 4.03708 8.69575 3.91276 8.75071 3.8072C8.97001 3.38607 9.37574 3.09364 9.84461 3.01877C9.96213 3 10.0932 3 10.3553 3H13.6447C13.9068 3 14.0379 3 14.1554 3.01877C14.6243 3.09364 15.03 3.38607 15.2493 3.8072C15.3043 3.91276 15.3457 4.03708 15.4286 4.28571L15.5257 4.57697C15.5433 4.62992 15.5522 4.65651 15.5608 4.68032C15.841 5.45491 16.5674 5.97849 17.3909 5.99936C17.4162 6 17.4441 6 17.5 6"
                                                        stroke="currentColor" strokeWidth="1.5"/>
                                                </svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>

                        <button type="submit" className="btn btn-primary !mt-6">
                            Submit
                        </button>
                    </form>
                    <RawProductModal
                        listFor={RAW_PRODUCT_LIST_TYPE.FILLING}
                        modalOpen={modal}
                        setModalOpen={setModal}
                        detail={modalFormData}
                        handleSubmit={(value: any) => handleAddRow(value)}
                    />
                </div>
            </div>
        </div>
    );
};

export default Create;
