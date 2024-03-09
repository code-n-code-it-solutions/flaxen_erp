import React, {Dispatch, FC, SetStateAction, useEffect, useState} from 'react';
import {getRawProducts} from "@/store/slices/rawProductSlice";
import {useDispatch, useSelector} from "react-redux";
import {ThunkDispatch} from "redux-thunk";
import {IRootState} from "@/store";
import {AnyAction} from "redux";
import {setAuthToken} from "@/configs/api.config";
import {getUnits} from "@/store/slices/unitSlice";
import {getTaxCategories} from "@/store/slices/taxCategorySlice";
import {ButtonVariant, IconType, RAW_PRODUCT_LIST_TYPE} from "@/utils/enums";
import RawProductModal from "@/components/specific-modal/raw-modal/RawProductModal";
import IconButton from "@/components/IconButton";

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
    rawProducts: any[];
    setRawProducts: Dispatch<SetStateAction<any[]>>;
    type: RAW_PRODUCT_LIST_TYPE;
}

interface Totals {
    [key: string]: number;
}

const tableStructure = [
    {
        listingFor: RAW_PRODUCT_LIST_TYPE.PRODUCT_ASSEMBLY,
        header: ['Product', 'Desc', 'Unit', 'Qty (KG)', 'Unit Price (KG)', 'Total'],
        columns: ['raw_product_id', 'description', 'unit_id', 'quantity', 'unit_price', 'total'],
        numericColumns: ['quantity', 'unit_price', 'total']
    },
    {
        listingFor: RAW_PRODUCT_LIST_TYPE.PRODUCTION,
        header: ['Product', 'Desc', 'Unit', 'Unit Price (KG)', 'Qty (KG)', 'Available Qty (KG)', 'Required Qty (KG)', 'Total'],
        columns: ['raw_product_id', 'description', 'unit_id', 'unit_price', 'quantity', 'availableQuantity', 'requiredQuantity', 'total'],
        numericColumns: ['quantity', 'unit_price', 'availableQuantity', 'requiredQuantity', 'total']
    },
    // {
    //     listingFor: RAW_PRODUCT_LIST_TYPE.FILLING,
    //     header: ['Product', 'Desc', 'Unit', 'Unit Price (KG)', 'Qty (KG)', 'Available Qty (KG)', 'Required Qty (KG)', 'Total'],
    //     columns: ['raw_product_id', 'description', 'unit_id', 'unit_price', 'quantity', 'availableQuantity', 'requiredQuantity', 'total']
    // },
]

export const RawProductItemListing: FC<RawProductItemsProps> = ({
                                                                    rawProducts,
                                                                    setRawProducts,
                                                                    // handleEditProductItem,
                                                                    // handleRemove,
                                                                    type
                                                                }) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [productDetail, setProductDetail] = useState({});
    const dispatch = useDispatch<ThunkDispatch<IRootState, any, AnyAction>>();
    const [unitOptions, setUnitOptions] = useState<any>([]);
    const [productOptions, setProductOptions] = useState<any>([]);
    const [taxCategoryOptions, setTaxCategoryOptions] = useState<any>([]);
    const {token} = useSelector((state: IRootState) => state.user);
    const {units} = useSelector((state: IRootState) => state.unit);
    const {allRawProducts} = useSelector((state: IRootState) => state.rawProduct);
    const {taxCategories} = useSelector((state: IRootState) => state.taxCategory);
    // console.log(rawProducts)
    const handleAddRow = () => {
        setRawProducts((prev: any) => {
            let maxId = 0;
            prev.forEach((item: any) => {
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
    const handleAdd = (value: any) => {
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

    function handleEditProductItem<T extends IRawProduct, K extends keyof T>(
        {index, field, value, maxQuantity}: {
            index: number,
            field: K,
            value: T[K],
            maxQuantity?: number,
        }
    ): void {
        const updatedProducts: T[] = [...rawProducts] as T[];
        // if (field === 'lpo_quantity') {
        //     const numericValue = Number(value);
        //     const clampedValue = numericValue || 0;
        //     updatedProducts[index][field] = (maxQuantity !== undefined && clampedValue > maxQuantity)
        //         ? maxQuantity as T[K]
        //         : clampedValue as T[K];
        // } else {
        updatedProducts[index][field] = value;
        // }
        setRawProducts(updatedProducts);
    }

    const handleRemove = (id: number) => {
        setRawProducts(rawProducts.filter((row:any, index:number) => index !== id));
    };

    const calculateTotals = (rawProducts: any[], type: RAW_PRODUCT_LIST_TYPE) => {
        const tableConfig = tableStructure.find(table => table.listingFor === type);
        const numericColumns = tableConfig ? new Set(tableConfig.numericColumns) : new Set();
        const totals: Totals = {};

        if (tableConfig) {
            tableConfig.numericColumns.forEach(column => {
                totals[column] = 0;
            });

            rawProducts.forEach((product) => {
                tableConfig.numericColumns.forEach(column => {
                    const value = product[column];
                    totals[column] += value;
                });
            });
        }

        return totals;
    };

    const columnTotals = calculateTotals(rawProducts, type);

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
                    label: rawProduct.title + ' (' + rawProduct.item_code + ')',
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
                <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => {
                        setProductDetail({})
                        setModalOpen(true)
                    }}
                >
                    Add New Item
                </button>
            </div>
            <table>
                <thead>
                <tr>
                    {tableStructure.map(table => {
                        if (table.listingFor === type) {
                            return table.header.map((head: string, index: number) => (
                                <th key={index}>{head}</th>
                            ))
                        }
                    })}
                    <th>Action</th>
                </tr>
                </thead>
                <tbody>
                {rawProducts.map((product, index: number) => (
                    <tr key={index}>
                        {tableStructure.map(table => {
                            if (table.listingFor === type) {
                                return table.columns.map((column: string, index: number) => (
                                    column === 'raw_product_id'
                                        ? <td key={index}>
                                            {productOptions.filter((item: any) => item.value === product[column])[0]?.label}
                                        </td>
                                        : column === 'unit_id'
                                            ? <td key={index}>
                                                {unitOptions.filter((item: any) => item.value === product[column])[0]?.label}
                                            </td>
                                            : column === 'tax_category_id'
                                                ? <td key={index}>
                                                    {taxCategoryOptions.filter((item: any) => item.value === product[column])[0]?.label}
                                                </td>
                                                : <td key={index}>
                                                    {typeof product[column] === 'number' ? product[column].toFixed(2) : product[column]}
                                                </td>
                                ))
                            }
                        })}
                        <td>
                            <div className="flex justify-center items-center gap-1">
                                <IconButton
                                    icon={IconType.edit}
                                    color={ButtonVariant.primary}
                                    onClick={() => {
                                        setProductDetail(product)
                                        setModalOpen(true)
                                    }}
                                    tooltip="Edit"
                                />
                                <IconButton
                                    icon={IconType.delete}
                                    color={ButtonVariant.danger}
                                    onClick={() => handleRemove(index)}
                                    tooltip="Remove"
                                />
                            </div>


                        </td>
                    </tr>
                ))}
                </tbody>
                {rawProducts.length > 0 && (
                    <tfoot>
                    <tr>
                        {tableStructure.find(table => table.listingFor === type)?.columns.map((column, index) => (
                            tableStructure.find(table => table.listingFor === type)?.numericColumns.includes(column)
                                ? <td key={index}>{columnTotals[column]?.toFixed(2)}</td>
                                : <td key={index}></td>
                        ))}
                        <td></td>
                    </tr>
                    </tfoot>
                )}
            </table>
            <RawProductModal
                modalOpen={modalOpen}
                setModalOpen={setModalOpen}
                handleSubmit={(val: any) => handleAdd(val)}
                listFor={type}
                detail={productDetail}
            />
        </div>
    );
};
