import React from 'react';
import {RAW_PRODUCT_LIST_TYPE} from "@/utils/enums";

interface IProps {
    tableStructure: any[];
    type: RAW_PRODUCT_LIST_TYPE
}

const ListingHeader = ({tableStructure, type}: IProps) => {
    return (
        <thead>
        <tr>
            {tableStructure.map(table => {
                if (table.listingFor === type) {
                    return table.header.map((head: string, index: number) => (
                        <th key={index}>{head}</th>
                    ))
                }
            })}
            <th className="text-center" style={{textAlign: 'center'}}>Action</th>
        </tr>
        </thead>
    );
};

export default ListingHeader;
