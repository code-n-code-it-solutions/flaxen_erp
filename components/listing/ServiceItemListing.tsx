import React, {Dispatch, FC, SetStateAction, useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {ThunkDispatch} from "redux-thunk";
import {IRootState} from "@/store";
import {AnyAction} from "redux";
import {setAuthToken} from "@/configs/api.config";
import {getTaxCategories} from "@/store/slices/taxCategorySlice";
import {ButtonSize, ButtonType, ButtonVariant, IconType, RAW_PRODUCT_LIST_TYPE} from "@/utils/enums";
import IconButton from "@/components/IconButton";
import ServiceModal from "@/components/modals/ServiceModal";
import {getAssets} from "@/store/slices/assetSlice";
import {getIcon} from "@/utils/helper";
import GenericTable from "@/components/GenericTable";
import Button from "@/components/Button";

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
        header: ['Assets', 'Name', 'Desc'],
        columns: ['asset_id', 'service_name', 'description'],
        numericColumns: []
    },
    {
        listingFor: RAW_PRODUCT_LIST_TYPE.LOCAL_PURCHASE_ORDER,
        header: ['Assets', 'Name', 'Desc', 'Cost', 'Tax Category', 'Tax Rate (%)', 'Tax Amount', 'Row Total'],
        columns: ['asset_id', 'service_name', 'description', 'cost', 'tax_category_id', 'tax_rate', 'tax_amount', 'grand_total'],
        numericColumns: ['cost', 'tax_rate', 'tax_amount', 'grand_total']
    },
    {
        listingFor: RAW_PRODUCT_LIST_TYPE.GOOD_RECEIVE_NOTE,
        header: ['Assets', 'Name', 'Desc', 'Cost', 'Tax Category', 'Tax Rate (%)', 'Tax Amount', 'Row Total'],
        columns: ['asset_id', 'service_name', 'description', 'cost', 'tax_category_id', 'tax_rate', 'tax_amount', 'grand_total'],
        numericColumns: ['cost', 'tax_rate', 'tax_amount', 'grand_total']
    },
    {
        listingFor: RAW_PRODUCT_LIST_TYPE.VENDOR_BILL,
        header: ['Assets', 'Name', 'Desc', 'Cost', 'Tax Category', 'Tax Rate (%)', 'Tax Amount', 'Row Total'],
        columns: ['asset_id', 'service_name', 'description', 'cost', 'tax_category_id', 'tax_rate', 'tax_amount', 'grand_total'],
        numericColumns: ['cost', 'tax_rate', 'tax_amount', 'grand_total']
    }
]

const ServiceItemListing: FC<IProps> = ({
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
            const existingRow = prev.find(row => row.asset_id === value.asset_id);
            if (existingRow) {
                return prev.map(row => row.asset_id === value.asset_id ? value : row);
            } else {
                return [...prev, {...value, id: maxId + 1}];
            }
        });
        setModalOpen(false);
    }

    const handleRemove = (id: number) => {
        setServiceItems(serviceItems.filter((row: any, index: number) => index !== id));
    };

    useEffect(() => {
        setAuthToken(token)
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

    const calculateTotals = (type: RAW_PRODUCT_LIST_TYPE) => {
        const tableConfig = tableStructure.find(table => table.listingFor === type);
        const totals: Totals = {};

        if (tableConfig) {
            tableConfig.numericColumns.forEach((column: string) => {
                totals[column] = 0;
            });

            serviceItems?.forEach((item) => {
                tableConfig.numericColumns.forEach((column: string) => {
                    const value = item[column];
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
                render: (row: any) => (
                    table.numericColumns.includes(column)
                        ? <>{row[column].toFixed(2)}</>
                        : column === 'asset_id'
                            ? <>{assetOptions.filter((item: any) => item.value === row[column])[0]?.label}</>
                            : column === 'tax_category_id'
                                ? <>{taxCategoryOptions.filter((item: any) => item.value === row[column])[0]?.label}</>
                                : <>{row[column]}</>
                ),
            })));
        if (serviceItems.length > 0) {
            columns.flatMap((column: any) => {
                if (tableStructure.find(table => table.listingFor === type)?.numericColumns.includes(column.accessor)) {
                    column.footer = (
                        <div className="flex gap-2 items-center">
                            <span className="h-3 w-3">{getIcon(IconType.sum)}</span>
                            <span>{isNaN(columnTotals[column.accessor]) ? 0 : columnTotals[column.accessor].toFixed(2)}</span>
                        </div>
                    )
                }
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
                            setServiceItemDetail({})
                            setModalOpen(true)
                        }}
                    />
                }
            </div>
            <GenericTable
                isAdvanced={false}
                rowData={serviceItems}
                columns={[
                    ...tableColumns(),
                    {
                        accessor: 'action',
                        title: 'Actions',
                        sortable: false,
                        render: (row: any, index: number) => (
                            type !== RAW_PRODUCT_LIST_TYPE.PRODUCTION && type !== RAW_PRODUCT_LIST_TYPE.FILLING && type !== RAW_PRODUCT_LIST_TYPE.VENDOR_BILL &&
                            <div className="flex justify-center items-center gap-1">
                                <IconButton
                                    icon={IconType.edit}
                                    color={ButtonVariant.primary}
                                    onClick={() => {
                                        setServiceItemDetail(row)
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
                        )
                    }
                ]}
                loading={false}
                exportTitle={'Service Item List'}
            />
            {/*<table>*/}
            {/*    <ListingHeader*/}
            {/*        tableStructure={tableStructure}*/}
            {/*        type={type}*/}
            {/*    />*/}
            {/*    <tbody>*/}
            {/*    {serviceItems?.map((service, index: number) => (*/}
            {/*        <tr key={index}>*/}
            {/*            {tableStructure.map(table => {*/}
            {/*                if (table.listingFor === type) {*/}
            {/*                    return table.columns.map((column: any, index: number) => (*/}
            {/*                        column === 'asset_id'*/}
            {/*                            ? <td key={index}>*/}
            {/*                                {assetOptions.filter((item: any) => item.value === service[column])[0]?.label}*/}
            {/*                            </td>*/}
            {/*                            : column === 'tax_category_id'*/}
            {/*                                ? <td key={index}>*/}
            {/*                                    {taxCategoryOptions.filter((item: any) => item.value === service[column])[0]?.label}*/}
            {/*                                </td>*/}
            {/*                                : <td key={index}>*/}
            {/*                                    {typeof service[column] === 'number' ? service[column].toFixed(2) : service[column]}*/}
            {/*                                </td>*/}
            {/*                    ))*/}
            {/*                }*/}
            {/*            })}*/}
            {/*            <td>*/}
            {/*                <div className="flex justify-center items-center gap-1">*/}
            {/*                    <IconButton*/}
            {/*                        icon={IconType.edit}*/}
            {/*                        color={ButtonVariant.primary}*/}
            {/*                        onClick={() => {*/}
            {/*                            setServiceItemDetail(service)*/}
            {/*                            setModalOpen(true)*/}
            {/*                        }}*/}
            {/*                        tooltip="Edit"*/}
            {/*                    />*/}
            {/*                    <IconButton*/}
            {/*                        icon={IconType.delete}*/}
            {/*                        color={ButtonVariant.danger}*/}
            {/*                        onClick={() => handleRemove(index)}*/}
            {/*                        tooltip="Remove"*/}
            {/*                    />*/}
            {/*                </div>*/}
            {/*            </td>*/}
            {/*        </tr>*/}
            {/*    ))}*/}
            {/*    </tbody>*/}
            {/*    <ListingFooter*/}
            {/*        data={serviceItems}*/}
            {/*        tableStructure={tableStructure}*/}
            {/*        type={type}*/}
            {/*    />*/}
            {/*</table>*/}
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

export default ServiceItemListing;
