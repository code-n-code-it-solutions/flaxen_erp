import React, {Dispatch, FC, SetStateAction, useEffect, useState} from 'react';
import LPORawProductModal from "@/components/specific-modal/local-purchase-order/LPORawProductModal";
import {string} from "yup";
import PRRawProductModal from "@/components/specific-modal/purchase-requisition/PRRawProductModal";
import {getRawProducts} from "@/store/slices/rawProductSlice";
import {useDispatch, useSelector} from "react-redux";
import {ThunkDispatch} from "redux-thunk";
import {IRootState} from "@/store";
import {AnyAction} from "redux";
import {setAuthToken} from "@/configs/api.config";
import {getUnits} from "@/store/slices/unitSlice";
import {getTaxCategories} from "@/store/slices/taxCategorySlice";
import Select from "react-select";
import {RAW_PRODUCT_LIST_TYPE} from "@/utils/enums";

interface IRawProduct {
    type: string | 'add';
    id: number;
    raw_product_id: number;
    lpo_quantity: number;
    quantity: number;
    unit_id: number;
    unit_price: number;
    total: number;
    tax_category_id: string;
    tax_rate: number;
    tax_amount: number;
    row_total: number
    description: string;
}

interface RawProductItemsProps {
    rawProducts: IRawProduct[];
    setRawProducts: Dispatch<SetStateAction<IRawProduct[]>>;
    handleEditProductItem: (args: any) => void;
    handleRemove: (index: number) => void;
    type: RAW_PRODUCT_LIST_TYPE;
}

const RawProductItemListing: FC<RawProductItemsProps> = ({
                                                                    rawProducts,
                                                                    setRawProducts,
                                                                    handleEditProductItem,
                                                                    handleRemove,
                                                                    type
                                                                }) => {
    const [modalOpen, setModalOpen] = useState(false);
    const dispatch = useDispatch<ThunkDispatch<IRootState, any, AnyAction>>();
    const [unitOptions, setUnitOptions] = useState<any>([]);
    const [productOptions, setProductOptions] = useState<any>([]);
    const [taxCategoryOptions, setTaxCategoryOptions] = useState<any>([]);
    const {token} = useSelector((state: IRootState) => state.user);
    const {units} = useSelector((state: IRootState) => state.unit);
    const {allRawProducts} = useSelector((state: IRootState) => state.rawProduct);
    const {taxCategories} = useSelector((state: IRootState) => state.taxCategory);

    const handleAddRow = () => {
        setRawProducts((prev: any) => {
            let maxId = 0;
            prev.forEach((item:any) => {
                if (item.id > maxId) {
                    maxId = item.id;
                }
            });
            return [...prev, {
                id: maxId + 1,
                raw_product_id: 0,
                lpo_quantity: 0,
                quantity: 0,
                unit_id: 2,
                unit_price: 0,
                total: 0,
                tax_category_id: '',
                tax_rate: 0,
                tax_amount: 0,
                row_total: 0,
                description: ''
            }];
        });
    }
    const handleAdd = (value: IRawProduct) => {
        setRawProducts((prev) => {
            let maxId = 0;
            prev.forEach(item => {
                if (item.id > maxId) {
                    maxId = item.id;
                }
            });
            const existingRow = prev.find(row => row.raw_product_id === value.raw_product_id);
            if (existingRow) {
                return prev.map(row => row.raw_product_id === value.raw_product_id ? value : row);
            } else {
                return [...prev, {...value, id: maxId + 1}];
            }
        });
        setModalOpen(false);
    }

    useEffect(() => {
        setAuthToken(token)
        dispatch(getUnits());
        dispatch(getRawProducts());
        dispatch(getTaxCategories());
    }, []);

    useEffect(() => {
        if (units) {
            setUnitOptions([{value: '', label: 'Select Unit'}, ...units]);
        }
    }, [units]);

    useEffect(() => {
        if (taxCategories) {
            let taxCategoryOptions = taxCategories.map((taxCategory: any) => {
                return {
                    value: taxCategory.id,
                    label: taxCategory.name,
                    taxCategory
                };
            })
            setTaxCategoryOptions([{value: '', label: 'Select Tax Category'}, ...taxCategoryOptions]);
        }
    }, [taxCategories])

    useEffect(() => {
        if (allRawProducts) {
            let rawProductOptions = allRawProducts.map((rawProduct: any) => {
                return {
                    value: rawProduct.id,
                    label: rawProduct.title+' ('+rawProduct.item_code+')',
                    unit_price: rawProduct.opening_stock_unit_balance
                };
            })
            console.log('rawProductOptions', rawProductOptions)
            setProductOptions([{value: '', label: 'Select Raw Product'}, ...rawProductOptions]);
        }
    }, [allRawProducts]);

    return (
        <div className="table-responsive w-full">
            <div
                className="flex justify-between items-center flex-col md:flex-row space-y-3 md:space-y-0 mb-3">
                <h3 className="text-lg font-semibold">Item Details</h3>
                {/*<button*/}
                {/*    type="button"*/}
                {/*    className="btn btn-primary btn-sm"*/}
                {/*    onClick={() => handleAdd()}*/}
                {/*>*/}
                {/*    Add New Item*/}
                {/*</button>*/}
            </div>
            <table>
                <thead>
                <tr>
                    <th>Raw Product</th>
                    <th>Description</th>
                    <th>Unit</th>
                    <th>PR Quantity</th>
                    <th>Unit Price</th>
                    <th>LPO Quantity</th>
                    <th>Total</th>
                    <th>Tax Category</th>
                    <th>Tax Rate(%)</th>
                    <th>Tax Amount</th>
                    <th>Row Total</th>
                    <th>Action</th>
                </tr>
                </thead>
                <tbody>
                {rawProducts.map((product, index) => (
                    <tr key={index}>
                        <td>
                            <Select
                                defaultValue={productOptions[0]}
                                value={productOptions.map((option: any) => {
                                    return option.value === product.raw_product_id ? option : null
                                })}
                                menuPortalTarget={document.body}
                                options={productOptions}
                                isSearchable={true}
                                isClearable={true}
                                placeholder={'Select Product'}
                                onChange={(e: any) => handleEditProductItem({
                                    index: index,
                                    field: 'raw_product_id',
                                    value: e.value,
                                    maxQuantity: 0,
                                })}
                            />
                        </td>
                        {/*<td>*/}
                        {/*    <input*/}
                        {/*        type="text"*/}
                        {/*        className="form-input"*/}
                        {/*        value={product.description}*/}
                        {/*        onChange={(e) => handleEditProductItem({*/}
                        {/*            index: index,*/}
                        {/*            field: 'description',*/}
                        {/*            value: e.target.value,*/}
                        {/*            maxQuantity: 0,*/}
                        {/*        })}*/}
                        {/*    />*/}
                        {/*</td>*/}
                        <td>
                            KG
                            {/*<Select*/}
                            {/*    defaultValue={unitOptions[0]}*/}
                            {/*    value={unitOptions.map((option: any) => {*/}
                            {/*        return option.value === product.unit_id ? option : null*/}
                            {/*    })}*/}
                            {/*    menuPortalTarget={document.body}*/}
                            {/*    options={unitOptions}*/}
                            {/*    isSearchable={true}*/}
                            {/*    isClearable={true}*/}
                            {/*    placeholder={'Select Product'}*/}
                            {/*    onChange={(e: any) => handleEditProductItem({*/}
                            {/*        index: index,*/}
                            {/*        field: 'unit_id',*/}
                            {/*        value: e.value,*/}
                            {/*        maxQuantity: 0,*/}
                            {/*    })}*/}
                            {/*/>*/}
                        </td>
                        <td>
                            <input
                                type="number"
                                className="form-input"
                                disabled={true}
                                value={product.quantity}
                                onChange={(e) => handleEditProductItem({
                                    index: index,
                                    field: 'quantity',
                                    value: e.target.valueAsNumber,
                                    maxQuantity: 0,
                                })}
                            />
                        </td>
                        <td>{product.unit_price}</td>
                        <td>
                            <input
                                type="number"
                                className="form-input"
                                value={product.lpo_quantity}
                                onChange={(e) => handleEditProductItem({
                                    index: index,
                                    field: 'lpo_quantity',
                                    value: e.target.valueAsNumber,
                                    maxQuantity: product.quantity,
                                })}
                            />
                        </td>

                        <td>{product.lpo_quantity * product.unit_price}</td>
                        <td>
                            <select
                                name="tax_category_id"
                                id="tax_category_id"
                                className="form-select"
                                value={product.tax_category_id}
                                onChange={(e) => handleEditProductItem({
                                    index: index,
                                    field: 'tax_category_id',
                                    value: e.target.value,
                                    maxQuantity: 0,
                                })}
                            >
                                {taxCategoryOptions.map((taxCategory: any, index: number) => (
                                    <option key={index}
                                            value={taxCategory.value}>{taxCategory.label}</option>
                                ))}
                            </select>
                            {/*{product.tax_category_name}*/}
                        </td>
                        <td>
                            <input
                                type="number"
                                className="form-input"
                                value={product.tax_rate}
                                onChange={(e) => handleEditProductItem({
                                    index: index,
                                    field: 'tax_rate',
                                    value: parseFloat(e.target.value),
                                    maxQuantity: 0,
                                })}
                            />
                            {/*{product.tax_rate}*/}
                        </td>
                        <td>{((product.lpo_quantity * product.unit_price) * (product.tax_rate / 100)).toFixed(2)}</td>
                        <td>{((product.lpo_quantity * product.unit_price) + (product.lpo_quantity * product.unit_price) * (product.tax_rate / 100)).toFixed(2)}</td>
                        <td>
                            <div className="flex gap-3 items-center">
                                <button
                                    type="button"
                                    onClick={() => handleRemove(index)}
                                    className="btn btn-outline-danger btn-sm"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24"
                                         height="24"
                                         className="h-5 w-5"
                                         viewBox="0 0 24 24" fill="none">
                                        <path
                                            d="M9.1709 4C9.58273 2.83481 10.694 2 12.0002 2C13.3064 2 14.4177 2.83481 14.8295 4"
                                            stroke="currentColor"
                                            strokeWidth="1.5" strokeLinecap="round"/>
                                        <path d="M20.5001 6H3.5" stroke="currentColor"
                                              strokeWidth="1.5"
                                              strokeLinecap="round"/>
                                        <path
                                            d="M18.8332 8.5L18.3732 15.3991C18.1962 18.054 18.1077 19.3815 17.2427 20.1907C16.3777 21 15.0473 21 12.3865 21H11.6132C8.95235 21 7.62195 21 6.75694 20.1907C5.89194 19.3815 5.80344 18.054 5.62644 15.3991L5.1665 8.5"
                                            stroke="currentColor" strokeWidth="1.5"
                                            strokeLinecap="round"/>
                                        <path d="M9.5 11L10 16" stroke="currentColor"
                                              strokeWidth="1.5"
                                              strokeLinecap="round"/>
                                        <path d="M14.5 11L14 16" stroke="currentColor"
                                              strokeWidth="1.5"
                                              strokeLinecap="round"/>
                                    </svg>
                                </button>
                            </div>
                        </td>
                    </tr>
                ))}
                {rawProducts.length === 0 ? (
                    <tr>
                        <td colSpan={11} className="text-center">No Item Added</td>
                    </tr>
                ) : (
                    <tr>
                        <td colSpan={3} className="font-bold text-center">Total</td>
                        <td className="text-left font-bold">{rawProducts.reduce((acc: number, item) => acc + item.quantity, 0).toFixed(2)}</td>
                        <td className="text-left font-bold">{rawProducts.reduce((acc: number, item) => acc + item.unit_price, 0).toFixed(2)}</td>
                        <td className="text-left font-bold">{rawProducts.reduce((acc: number, item) => acc + item.lpo_quantity, 0).toFixed(2)}</td>
                        <td className="text-left font-bold">{rawProducts.reduce((acc: number, item) => acc + item.unit_price * item.lpo_quantity, 0).toFixed(2)}</td>
                        <td></td>
                        <td></td>
                        <td className="text-left font-bold">{rawProducts.reduce((acc: number, item) => acc + item.tax_amount, 0).toFixed(2)}</td>
                        <td className="text-left font-bold">{rawProducts.reduce((acc: number, item) => acc + ((item.lpo_quantity * item.unit_price) + (item.lpo_quantity * item.unit_price) * (item.tax_rate / 100)), 0).toFixed(2)}</td>
                    </tr>
                )}
                </tbody>
            </table>
            {/*{type === 'pr'*/}
            {/*    ? <PRRawProductModal*/}
            {/*        modal={modalOpen}*/}
            {/*        setModal={setModalOpen}*/}
            {/*        handleAddRawProduct={(value: any) => handleAdd(value)}/>*/}
            {/*    : <LPORawProductModal*/}
            {/*        modal={modalOpen}*/}
            {/*        setModal={setModalOpen}*/}
            {/*        handleAddRawProduct={(value: any) => handleAddItemRow(value)}*/}
            {/*    />*/}
            {/*}*/}

        </div>
    );
};

export default RawProductItemListing;
