import React, {Dispatch, FC, SetStateAction, useEffect, useState} from 'react';
import {getRawProducts} from "@/store/slices/rawProductSlice";
import {useAppDispatch, useAppSelector} from "@/store";
import {setAuthToken} from "@/configs/api.config";
import {getUnits} from "@/store/slices/unitSlice";
import {getTaxCategories} from "@/store/slices/taxCategorySlice";
import {ButtonSize, ButtonType, ButtonVariant, IconType, RAW_PRODUCT_LIST_TYPE} from "@/utils/enums";
import RawProductModal from "@/components/modals/RawProductModal";
import IconButton from "@/components/IconButton";
import GenericTable from "@/components/GenericTable";
import {getIcon} from "@/utils/helper";
import Button from "@/components/Button";
import {getAccountList} from "@/store/slices/accountSlice";
import {getPurchaseRequisitionByStatuses} from "@/store/slices/purchaseRequisitionSlice";
import Option from "@/components/form/Option";

interface IProps {
    rawProducts: any[];
    originalProducts?: any[];
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
        header: ['PR', 'Product', 'Desc', 'Unit', 'Qty', 'Unit Price', 'Sub Total', 'Tax Category', 'Tax Rate', 'Tax Amount', 'Total'],
        columns: ['purchase_requisition_id', 'raw_product_id', 'description', 'unit_id', 'quantity', 'unit_price', 'sub_total', 'tax_category_id', 'tax_rate', 'tax_amount', 'grand_total'],
        numericColumns: ['quantity', 'unit_price', 'sub_total', 'tax_rate', 'tax_amount', 'grand_total']
    },
    {
        listingFor: RAW_PRODUCT_LIST_TYPE.GOOD_RECEIVE_NOTE,
        header: ['Product', 'Unit', 'Qty', 'R. Qty', 'Unit Price', 'Sub Total', 'Tax Category', 'Tax Rate', 'Tax Amount', 'Total'],
        columns: ['raw_product_id', 'unit_id', 'quantity', 'received_quantity', 'unit_price', 'sub_total', 'tax_category_id', 'tax_rate', 'tax_amount', 'grand_total'],
        numericColumns: ['quantity', 'received_quantity', 'unit_price', 'sub_total', 'tax_rate', 'tax_amount', 'grand_total']
    },
    {
        listingFor: RAW_PRODUCT_LIST_TYPE.VENDOR_BILL,
        header: ['Product', 'Desc', 'Unit', 'Qty', 'R. Qty', 'Unit Price', 'Sub Total', 'Tax Category', 'Tax Rate', 'Tax Amount', 'Total'],
        columns: ['raw_product_id', 'description', 'unit_id', 'quantity', 'received_quantity', 'unit_price', 'sub_total', 'tax_category_id', 'tax_rate', 'tax_amount', 'grand_total'],
        numericColumns: ['quantity', 'received_quantity', 'unit_price', 'sub_total', 'tax_rate', 'tax_amount', 'grand_total']
    },
    {
        listingFor: RAW_PRODUCT_LIST_TYPE.EXPENSE,
        header: ['Account', 'Desc', 'Qty', 'Amount', 'Sub Total', 'Tax Cat', 'Tax Rate', 'Tax Amount', 'Disc Type', 'D. Rate/Amount', 'Total'],
        columns: ['account_id', 'description', 'quantity', 'amount', 'sub_total', 'tax_category_id', 'tax_rate', 'tax_amount', 'discount_type', 'discount_amount_rate', 'grand_total'],
        numericColumns: ['quantity', 'amount', 'sub_total', 'tax_amount', 'grand_total']
    }
]

const RawProductItemListing: FC<IProps> = ({
                                               rawProducts,
                                               originalProducts,
                                               setRawProducts,
                                               type
                                           }) => {
    const dispatch = useAppDispatch();
    const {token} = useAppSelector((state) => state.user);
    const {units} = useAppSelector((state) => state.unit);
    const {allRawProducts} = useAppSelector((state) => state.rawProduct);
    const {taxCategories} = useAppSelector((state) => state.taxCategory);
    const {accountList} = useAppSelector(state => state.account);
    const {purchaseRequests} = useAppSelector(state => state.purchaseRequisition);

    const [modalOpen, setModalOpen] = useState(false);
    const [productDetail, setProductDetail] = useState({});
    const [unitOptions, setUnitOptions] = useState<any>([]);
    const [productOptions, setProductOptions] = useState<any>([]);
    const [accountOptions, setAccountOptions] = useState<any>([]);
    const [taxCategoryOptions, setTaxCategoryOptions] = useState<any>([]);
    const [isAdding, setIsAdding] = useState(false);
    // console.log(rawProducts)

    const handleAdd = (value: any) => {
        setIsAdding(true);
        setRawProducts((prev) => {
            // This is your mutable current state.
            if (type === RAW_PRODUCT_LIST_TYPE.LOCAL_PURCHASE_ORDER) {
                const index = prev.findIndex(row => row.raw_product_id === value.raw_product_id && row.purchase_requisition_id === value.purchase_requisition_id);
                if (index !== -1) {
                    // Fetch the original quantity from originalProducts.
                    const originalRow = originalProducts?.find(row => row.raw_product_id === value.raw_product_id && row.purchase_requisition_id === value.purchase_requisition_id);
                    const updatedRow = {
                        ...prev[index],
                        ...value,
                        status: originalRow && originalRow.quantity > value.quantity ? 'pending' : 'completed'
                    };
                    return [
                        ...prev.slice(0, index),
                        updatedRow,
                        ...prev.slice(index + 1)
                    ];
                } else {
                    return [...prev, {...value, status: 'completed'}];  // Assuming a new addition defaults to completed
                }
            } else {
                const existingRow = prev.find(row => row.raw_product_id === value.raw_product_id);
                if (existingRow) {
                    return prev.map(row => row.raw_product_id === value.raw_product_id ? value : row);
                } else {
                    return [...prev, value];
                }
            }
        });
        setModalOpen(false);
        setIsAdding(false);
    }


    // const handleAdd = (value: any) => {
    //     setIsAdding(true);
    //     setRawProducts((prev) => {
    //         if (type === RAW_PRODUCT_LIST_TYPE.LOCAL_PURCHASE_ORDER) {
    //             const existingRow = prev.find(row => row.raw_product_id === value.raw_product_id && row.purchase_requistion_id === value.purchase_requistion_id);
    //             const originalState = originalProducts?.find(row => row.raw_product_id === value.raw_product_id && row.purchase_requistion_id === value.purchase_requistion_id);
    //             // console.log('existingRow', existingRow)
    //             // console.log('originalState', originalState)
    //             if (existingRow && originalState) {
    //                 let newValues = {}
    //                 if (originalState.quantity > value.quantity) {
    //                     newValues = {
    //                         ...value,
    //                         status: 'pending'
    //                     }
    //                 } else {
    //                     newValues = {
    //                         ...value,
    //                         status: 'completed'
    //                     }
    //                 }
    //                 return prev.map(row => row.raw_product_id === value.raw_product_id && row.purchase_requistion_id === value.purchase_requistion_id ? newValues : row);
    //             } else {
    //                 return [...prev, value];
    //             }
    //         } else {
    //             const existingRow = prev.find(row => row.raw_product_id === value.raw_product_id);
    //             if (existingRow) {
    //                 return prev.map(row => row.raw_product_id === value.raw_product_id ? value : row);
    //             } else {
    //                 return [...prev, value];
    //             }
    //         }
    //
    //     });
    //     setModalOpen(false);
    //     setIsAdding(false);
    // }

    const handleRemove = (id: number) => {
        setRawProducts(rawProducts.filter((row: any, index: number) => index !== id));
    };


    useEffect(() => {
        setAuthToken(token)
        dispatch(getPurchaseRequisitionByStatuses({type: 'Material', statuses: ['Pending', 'Partial']}))

        if (type === RAW_PRODUCT_LIST_TYPE.EXPENSE) {
            dispatch(getAccountList(0))
        } else {
            dispatch(getRawProducts([]));
            dispatch(getUnits());
        }

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

    useEffect(() => {
        if (accountList) {
            setAccountOptions([
                {value: '', label: 'Select Account'},
                ...accountList.map((account: any) => (
                    {
                        value: account.id,
                        label: account.account_code + ' - ' + account.name + ' (' + account.current_balance + '/-)',
                        current_balance: account.current_balance
                    }
                ))]
            )
        }
    }, [accountList]);

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
                        : column === 'purchase_requisition_id'
                            ? <>{purchaseRequests?.find((item: any) => item.id === row[column])?.pr_code}</>
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
                                : column === 'account_id'
                                    ? <>{accountOptions?.find((item: any) => item.value === row[column])?.label}</>
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

    // useEffect(() => {
    //     console.log('rawProducts', rawProducts)
    // }, [rawProducts]);

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
