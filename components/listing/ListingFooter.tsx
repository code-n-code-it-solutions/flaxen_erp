import React from 'react';
import {RAW_PRODUCT_LIST_TYPE} from "@/utils/enums";

interface IProps {
    data: any[];
    tableStructure: any[];
    type: RAW_PRODUCT_LIST_TYPE;
}

interface Totals {
    [key: string]: number;
}

const ListingFooter = ({data, tableStructure, type}: IProps) => {

    const calculateTotals = (type: RAW_PRODUCT_LIST_TYPE) => {
        const tableConfig = tableStructure.find(table => table.listingFor === type);
        const totals: Totals = {};

        if (tableConfig) {
            tableConfig.numericColumns.forEach((column:string) => {
                totals[column] = 0;
            });

            data?.forEach((item) => {
                tableConfig.numericColumns.forEach((column:string) => {
                    const value = item[column];
                    totals[column] += value;
                });
            });
        }
        // console.log('totals', totals)
        return totals;
    };

    const columnTotals = calculateTotals(type);

    return (
        data?.length > 0 ? (
            <tfoot>
            <tr>
                {tableStructure.find(table => table.listingFor === type)?.columns.map((column:any, index:number) => (
                    tableStructure.find(table => table.listingFor === type)?.numericColumns.includes(column)
                        ?
                        <td key={index}>{isNaN(columnTotals[column]) ? 0.00 : columnTotals[column].toFixed(2)}</td>
                        : <td key={index}></td>
                ))}
                <td></td>
            </tr>
            </tfoot>
        ) : <></>
    );
};

export default ListingFooter;
