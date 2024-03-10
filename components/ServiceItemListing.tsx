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
import IconButton from "@/components/IconButton";
import ServiceModal from "@/components/specific-modal/ServiceModal";
import {getAssets} from "@/store/slices/assetSlice";

interface IService {
    name: string;
    assets: any;
    asset_ids: string;
    quantity: number;
    lpo_quantity: number;
    unit_cost: number;
    total: number;
    description: string;
    tax_category_name: string;
    tax_category_id: string;
    tax_rate: number;
    tax_amount: number;
    row_total: number
}

interface IProps {
    serviceItems: any[];
    setServiceItems: Dispatch<SetStateAction<any[]>>;
    type: RAW_PRODUCT_LIST_TYPE;
}

interface Totals {
    [key: string]: number;
}

const tableStructure = [
    {
        listingFor: RAW_PRODUCT_LIST_TYPE.PURCHASE_REQUISITION,
        header: ['Assets', 'Name', 'Desc', 'Quantity'],
        columns: ['assets', 'name', 'description'],
        numericColumns: ['quantity']
    },
    {
        listingFor: RAW_PRODUCT_LIST_TYPE.LOCAL_PURCHASE_ORDER,
        header: ['Assets', 'Name', 'Desc', 'PR Quantity', 'Per Service Cost', 'LPO Quantity', 'Total', 'Tax Category', 'Tax Rate(%)', 'Tax Amount', 'Row Total'],
        columns: ['assets', 'name', 'description', 'quantity', 'unit_cost', 'lpo_quantity', 'total', 'tax_category_id', 'tax_rate', 'tax_amount', 'row_total'],
        numericColumns: ['quantity', 'unit_cost', 'lpo_quantity', 'total', 'tax_rate', 'tax_amount', 'row_total']
    }
]

export const ServiceItemListing: FC<IProps> = ({
                                                   serviceItems,
                                                   setServiceItems,
                                                   type
                                               }) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [serviceItemDetail, setServiceItemDetail] = useState({});
    const dispatch = useDispatch<ThunkDispatch<IRootState, any, AnyAction>>();
    const [taxCategoryOptions, setTaxCategoryOptions] = useState<any>([]);
    const [assetOptions, setAssetOptions] = useState<any>([]);
    const {token} = useSelector((state: IRootState) => state.user);
    // const {units} = useSelector((state: IRootState) => state.unit);
    // const {allRawProducts} = useSelector((state: IRootState) => state.rawProduct);
    const {assets} = useSelector((state: IRootState) => state.asset);
    const {taxCategories} = useSelector((state: IRootState) => state.taxCategory);

    const handleAdd = (value: any) => {
        setServiceItems((prev) => {
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

    const handleRemove = (id: number) => {
        setServiceItems(serviceItems.filter((row: any, index: number) => index !== id));
    };

    const handleRemoveAsset = (index: number, assetIndex: number) => {
        const newItems = serviceItems.map((item: any, i: number) => {
            if (i === index) {
                const newAssets: any[] = item.assets.filter((asset: any, j: number) => j !== assetIndex);
                return {
                    ...item,
                    assets: newAssets,
                    asset_ids: newAssets.map((asset: any) => asset.id).join(','),
                    // quantity: newAssets.length,
                    lpo_quantity: newAssets.length,
                    total: item.unit_cost * newAssets.length,
                    tax_amount: (item.unit_cost * newAssets.length * item.tax_rate) / 100,
                    row_total: (item.unit_cost * newAssets.length) + ((item.unit_cost * newAssets.length * item.tax_rate) / 100)
                };
            }
            return item;
        });
        setServiceItems(newItems);
    }

    const calculateTotals = (rawProducts: any[], type: RAW_PRODUCT_LIST_TYPE) => {
        const tableConfig = tableStructure.find(table => table.listingFor === type);
        const totals: Totals = {};

        if (tableConfig) {
            tableConfig.numericColumns.forEach(column => {
                totals[column] = 0;
            });

            rawProducts?.forEach((product) => {
                tableConfig.numericColumns.forEach(column => {
                    const value = product[column];
                    totals[column] += value;
                });
            });
        }
        // console.log('totals', totals)
        return totals;
    };

    const columnTotals = calculateTotals(serviceItems, type);

    useEffect(() => {
        setAuthToken(token)
        // dispatch(getUnits());
        // dispatch(getRawProducts());
        dispatch(getAssets());
        dispatch(getTaxCategories());
    }, []);

    useEffect(() => {
        if (assets) {
            setAssetOptions(assets.map((asset: any) => ({
                value: asset.id,
                label: asset.name + ' (' + asset.code + ')'
            })));
        }
    }, [assets]);

    useEffect(() => {
        console.log(serviceItems)
    }, [serviceItems]);


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

    return (
        <div className="table-responsive w-full">
            <div
                className="flex justify-between items-center flex-col md:flex-row space-y-3 md:space-y-0 mb-3">
                <h3 className="text-lg font-semibold">Item Details</h3>
                <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => {
                        setServiceItemDetail({})
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
                {serviceItems?.map((service, index: number) => (
                    <tr key={index}>
                        {tableStructure.map(table => {
                            if (table.listingFor === type) {
                                return table.columns.map((column: any, index: number) => (
                                    column === 'asset_ids'
                                        ? column.split(',').map((id:number, key:number)=> (
                                            <div className="flex flex-col gap-1" key={key}>
                                                {assetOptions.map((asset: any, assetIndex: number) => (
                                                    asset.value===id &&
                                                    <div key={assetIndex}
                                                         className="flex justify-start items-center gap-2">
                                                        <span>{asset.name}-{asset.code}</span>
                                                        <IconButton
                                                            icon={IconType.delete}
                                                            color={ButtonVariant.danger}
                                                            onClick={() => handleRemoveAsset(index, assetIndex)}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        ))
                                        : <td key={index}>
                                            {typeof service[column] === 'number' ? service[column].toFixed(2) : service[column]}
                                        </td>
                                    // column === 'raw_product_id'
                                    //     ? <td key={index}>
                                    //         {productOptions.filter((item: any) => item.value === product[column])[0]?.label}
                                    //     </td>
                                    //     : column === 'unit_id'
                                    //         ? <td key={index}>
                                    //             {unitOptions.filter((item: any) => item.value === product[column])[0]?.label}
                                    //         </td>
                                    //         : column === 'tax_category_id'
                                    //             ? <td key={index}>
                                    //                 {taxCategoryOptions.filter((item: any) => item.value === product[column])[0]?.label}
                                    //             </td>
                                    //             : <td key={index}>
                                    //                 {typeof product[column] === 'number' ? product[column].toFixed(2) : product[column]}
                                    //             </td>
                                ))
                            }
                        })}
                        <td>
                            <div className="flex justify-center items-center gap-1">
                                <IconButton
                                    icon={IconType.edit}
                                    color={ButtonVariant.primary}
                                    onClick={() => {
                                        setServiceItemDetail(service)
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
                {serviceItems?.length > 0 && (
                    <tfoot>
                    <tr>
                        {tableStructure.find(table => table.listingFor === type)?.columns.map((column, index) => (
                            tableStructure.find(table => table.listingFor === type)?.numericColumns.includes(column)
                                ?
                                <td key={index}>{isNaN(columnTotals[column]) ? 0.00 : columnTotals[column].toFixed(2)}</td>
                                : <td key={index}></td>
                        ))}
                        <td></td>
                    </tr>
                    </tfoot>
                )}
            </table>
            <ServiceModal
                modalOpen={modalOpen}
                setModalOpen={setModalOpen}
                handleSubmit={(val: any) => handleAdd(val)}
                listFor={type}
                detail={serviceItemDetail}
            />
        </div>
    );
};
