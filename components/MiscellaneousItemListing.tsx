import React from 'react';

interface IMiscellaneousItem {
    name: string;
    description: string;
    quantity: number;
    unit_cost: number;
    total: number;
    tax_category_id: string;
    tax_rate: number;
    tax_amount: number;
    row_total: number;
}

interface MiscellaneousItemsProps {
    miscellaneousItems: any[];
    taxCategoryOptions: any[];
    handleEditMiscellaneousItem: (args: any) => void;
    handleRemoveItem: (index: number) => void;
}

export const MiscellaneousItemListing: React.FC<MiscellaneousItemsProps> = ({
                                                                          miscellaneousItems,
                                                                          taxCategoryOptions,
                                                                          handleEditMiscellaneousItem,
                                                                          handleRemoveItem,
                                                                      }) => {
    return (
        <table>
            <thead>
            <tr>
                <th>Item Name</th>
                <th>Description</th>
                <th>PR Quantity</th>
                <th>LPO Quantity</th>
                <th>Unit Cost</th>
                <th>Total</th>
                <th>Tax Category</th>
                <th>Tax Rate(%)</th>
                <th>Tax Amount</th>
                <th>Row Total</th>
                <th>Action</th>
            </tr>
            </thead>
            <tbody>
            {miscellaneousItems.map((service, index) => (
                <tr key={index}>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
            ))}
            {miscellaneousItems.length === 0 ? (
                <tr>
                    <td colSpan={10} className="text-center">No Service Added</td>
                </tr>
            ) : (
                <tr>
                    <td colSpan={3} className="font-bold text-center">Total</td>
                    <td className="text-left font-bold">{miscellaneousItems.reduce((acc: number, item) => acc + item.quantity, 0)}</td>
                    <td className="text-left font-bold">{miscellaneousItems.reduce((acc: number, item) => acc + item.unit_cost, 0)}</td>
                    <td className="text-left font-bold">{miscellaneousItems.reduce((acc: number, item) => acc + item.lpo_quantity, 0)}</td>
                    <td className="text-left font-bold">{miscellaneousItems.reduce((acc: number, item) => acc + item.total, 0)}</td>
                    <td></td>
                    <td></td>
                    <td className="text-left font-bold">{miscellaneousItems.reduce((acc: number, item) => acc + item.tax_amount, 0)}</td>
                    <td className="text-left font-bold">{miscellaneousItems.reduce((acc: number, item) => acc + item.row_total, 0)}</td>
                </tr>
            )}
            </tbody>
        </table>
    );
};
