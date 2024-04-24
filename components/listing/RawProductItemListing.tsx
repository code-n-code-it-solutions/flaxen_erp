import React, {Dispatch, FC, SetStateAction, useEffect, useState} from 'react';
import {getRawProducts} from "@/store/slices/rawProductSlice";
import {useDispatch, useSelector} from "react-redux";
import {ThunkDispatch} from "redux-thunk";
import {IRootState} from "@/store";
import {AnyAction} from "redux";
import {setAuthToken} from "@/configs/api.config";
import {getUnits} from "@/store/slices/unitSlice";
import {getTaxCategories} from "@/store/slices/taxCategorySlice";
import {ButtonSize, ButtonType, ButtonVariant, IconType, RAW_PRODUCT_LIST_TYPE} from "@/utils/enums";
import RawProductModal from "@/components/modals/RawProductModal";
import IconButton from "@/components/IconButton";
import GenericTable from "@/components/GenericTable";
import {getIcon} from "@/utils/helper";
import Button from "@/components/Button";

interface IProps {
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
        header: ['Product', 'Desc', 'Unit', 'Qty', 'Unit Price', 'Total'],
        columns: ['raw_product_id', 'description', 'unit_id', 'quantity', 'unit_price', 'sub_total'],
        numericColumns: ['quantity', 'unit_price', 'sub_total']
    },
    {
        listingFor: RAW_PRODUCT_LIST_TYPE.PRODUCTION,
        header: ['Product', 'Desc', 'Unit', 'Unit Price', 'Qty', 'Available Qty', 'Required Qty', 'Total'],
        columns: ['raw_product_id', 'description', 'unit_id', 'unit_price', 'quantity', 'available_quantity', 'required_quantity', 'sub_total'],
        numericColumns: ['quantity', 'unit_price', 'available_quantity', 'required_quantity', 'sub_total']
    },
    {
        listingFor: RAW_PRODUCT_LIST_TYPE.FILLING,
        header: ['Product', 'Desc', 'Unit', 'Unit Price', 'Qty', 'Available Qty', 'Required Qty', 'Total'],
        columns: ['raw_product_id', 'description', 'unit_id', 'unit_price', 'quantity', 'available_quantity', 'required_quantity', 'sub_total'],
        numericColumns: ['quantity', 'unit_price', 'available_quantity', 'required_quantity', 'sub_total']
    },
    {
        listingFor: RAW_PRODUCT_LIST_TYPE.PURCHASE_REQUISITION,
        header: ['Product', 'Desc', 'Unit', 'Qty', 'Unit Price', 'Total'],
        columns: ['raw_product_id', 'description', 'unit_id', 'quantity', 'unit_price', 'sub_total'],
        numericColumns: ['quantity', 'unit_price', 'sub_total']
    },
    {
        listingFor: RAW_PRODUCT_LIST_TYPE.LOCAL_PURCHASE_ORDER,
        header: ['Product', 'Desc', 'Unit', 'Qty', 'Unit Price', 'Sub Total', 'Tax Category', 'Tax Rate', 'Tax Amount', 'Total'],
        columns: ['raw_product_id', 'description', 'unit_id', 'quantity', 'unit_price', 'sub_total', 'tax_category_id', 'tax_rate', 'tax_amount', 'grand_total'],
        numericColumns: ['quantity', 'unit_price', 'sub_total', 'tax_rate', 'tax_amount', 'grand_total']
    },
    {
        listingFor: RAW_PRODUCT_LIST_TYPE.GOOD_RECEIVE_NOTE,
        header: ['Product', 'Desc', 'Unit', 'Qty', 'R. Qty', 'Unit Price', 'Sub Total', 'Tax Category', 'Tax Rate', 'Tax Amount', 'Total'],
        columns: ['raw_product_id', 'description', 'unit_id', 'quantity', 'received_quantity', 'unit_price', 'sub_total', 'tax_category_id', 'tax_rate', 'tax_amount', 'grand_total'],
        numericColumns: ['quantity', 'received_quantity', 'unit_price', 'sub_total', 'tax_rate', 'tax_amount', 'grand_total']
    },
    {
        listingFor: RAW_PRODUCT_LIST_TYPE.VENDOR_BILL,
        header: ['Product', 'Desc', 'Unit', 'Qty', 'R. Qty', 'Unit Price', 'Sub Total', 'Tax Category', 'Tax Rate', 'Tax Amount', 'Total'],
        columns: ['raw_product_id', 'description', 'unit_id', 'quantity', 'received_quantity', 'unit_price', 'sub_total', 'tax_category_id', 'tax_rate', 'tax_amount', 'grand_total'],
        numericColumns: ['quantity', 'received_quantity', 'unit_price', 'sub_total', 'tax_rate', 'tax_amount', 'grand_total']
    }
]

const RawProductItemListing: FC<IProps> = ({
                                               rawProducts,
                                               setRawProducts,
                                               type
                                           }) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [productDetail, setProductDetail] = useState({});
    const dispatch = useDispatch<ThunkDispatch<IRootState, any, AnyAction>>();
    const [unitOptions, setUnitOptions] = useState<any>([]);
    const [productOptions, setProductOptions] = useState<any>([]);
    const [taxCategoryOptions, setTaxCategoryOptions] = useState<any>([]);
    const [isAdding, setIsAdding] = useState(false);
    const {token} = useSelector((state: IRootState) => state.user);
    const {units} = useSelector((state: IRootState) => state.unit);
    const {allRawProducts} = useSelector((state: IRootState) => state.rawProduct);
    const {taxCategories} = useSelector((state: IRootState) => state.taxCategory);
    // console.log(rawProducts)
    const handleAdd = (value: any) => {
        setIsAdding(true);
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
        setIsAdding(false);
    }

    const handleRemove = (id: number) => {
        setRawProducts(rawProducts.filter((row: any, index: number) => index !== id));
    };


    useEffect(() => {
        setAuthToken(token)
        dispatch(getUnits());
        dispatch(getRawProducts([]));
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
                    label: rawProduct.title,
                    unit_price: rawProduct.opening_stock_unit_balance,
                    product: rawProducts
                };
            })
            // console.log('rawProductOptions', rawProductOptions)
            setProductOptions([{value: '', label: 'Select Raw Product'}, ...rawProductOptions]);
        }
    }, [allRawProducts]);

    const calculateTotals = (type: RAW_PRODUCT_LIST_TYPE) => {
        const tableConfig = tableStructure.find(table => table.listingFor === type);
        const totals: Totals = {};

        if (tableConfig) {
            tableConfig.numericColumns.forEach((column: string) => {
                totals[column] = 0;
            });

            rawProducts?.forEach((item) => {
                tableConfig.numericColumns.forEach((column: string) => {
                    const value = parseFloat(item[column]);
                    totals[column] += value;
                });
            });
        }
        // console.log('totals', totals)
        return totals;
    };

    const columnTotals = calculateTotals(type);

    const tableColumns = () => {
        let columns = tableStructure
            .filter(table => table.listingFor === type) // Step 1: Filter
            .flatMap(table => table.columns.map((column, index) => ({ // Step 2: Map and flatten
                accessor: column,
                title: table.header[index],
                sortable: true,
                render: (row: any, index: number) => (
                    table.numericColumns.includes(column)
                        ? <>{parseFloat(row[column]).toFixed(2)}</>
                        : column === 'raw_product_id'
                            ? (
                                <span className="flex flex-col items-start justify-center gap-1">
                                    <span
                                        style={{fontSize: 8}}>Code: {allRawProducts?.find((item: any) => item.id === row[column])?.item_code}</span>
                                    <span>{productOptions.find((item: any) => item.value === row[column])?.label}</span>
                                    <span
                                        style={{fontSize: 8}}>VM: {allRawProducts?.find((item: any) => item.id === row[column])?.valuation_method}</span>
                                </span>
                            )
                            : column === 'unit_id'
                                ? <>{unitOptions.find((item: any) => item.value === row[column])?.label}</>
                                : column === 'tax_category_id'
                                    ? <>{taxCategoryOptions.find((item: any) => item.value === row[column])?.label}</>
                                    : <>{row[column]}</>
                ),
            })));
        if (rawProducts.length > 0) {
            columns.flatMap((column: any) => {
                if (tableStructure.find(table => table.listingFor === type)?.numericColumns.includes(column.accessor)) {
                    column.footer = (
                        <div className="flex gap-2 items-center">
                            <span className="h-3 w-3">{getIcon(IconType.sum)}</span>
                            <span>{typeof columnTotals[column.accessor] === 'number' ? columnTotals[column.accessor].toFixed(2) : columnTotals[column.accessor]}</span>
                        </div>
                    )
                }

            })
        }
        // console.log(columns)
        if (type !== RAW_PRODUCT_LIST_TYPE.PRODUCTION && type !== RAW_PRODUCT_LIST_TYPE.FILLING && type !== RAW_PRODUCT_LIST_TYPE.VENDOR_BILL && type !== RAW_PRODUCT_LIST_TYPE.QUOTATION) {
            columns.push({
                accessor: 'action',
                title: 'Actions',
                sortable: false,
                render: (row: any, index: number) => (
                    <div className="flex justify-center items-center gap-1">
                        <IconButton
                            icon={IconType.edit}
                            color={ButtonVariant.primary}
                            onClick={() => {
                                setProductDetail(row)
                                setModalOpen(true)
                            }}
                            tooltip="Edit"
                        />
                        {type !== RAW_PRODUCT_LIST_TYPE.GOOD_RECEIVE_NOTE && (
                            <IconButton
                                icon={IconType.delete}
                                color={ButtonVariant.danger}
                                onClick={() => handleRemove(index)}
                                tooltip="Remove"
                            />
                        )}
                    </div>
                )
            })
        }

        return columns
    };

    return (
        <div className="table-responsive w-full">
            <div
                className="flex justify-between items-center flex-col md:flex-row space-y-3 md:space-y-0 mb-3">
                <h3 className="text-lg font-semibold">Item Details</h3>
                {type !== RAW_PRODUCT_LIST_TYPE.GOOD_RECEIVE_NOTE && type !== RAW_PRODUCT_LIST_TYPE.PRODUCTION && type !== RAW_PRODUCT_LIST_TYPE.FILLING && type !== RAW_PRODUCT_LIST_TYPE.VENDOR_BILL &&
                    <Button
                        type={ButtonType.button}
                        text='Add New Item'
                        variant={ButtonVariant.primary}
                        size={ButtonSize.small}
                        onClick={() => {
                            setProductDetail({})
                            setModalOpen(true)
                        }}
                    />
                }
            </div>
            <GenericTable
                isAdvanced={false}
                rowData={rawProducts.length > 0 ? rawProducts : []}
                loading={isAdding}
                rowStyle={(row: any) => (theme: any) => ({backgroundColor: row.required_quantity && row.required_quantity > row.available_quantity ? theme.colors.red[4] : 'auto'})}
                columns={tableColumns()}
                exportTitle={'Raw Product List'}
            />
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

export default RawProductItemListing;
