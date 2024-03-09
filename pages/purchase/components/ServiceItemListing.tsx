import React from 'react';

interface IServiceItem {
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

interface ServiceItemsProps {
    serviceItems: any[];
    taxCategoryOptions: any[];
    handleEditServiceItem: (args: any) => void;
    handleRemoveItem: (index: number) => void;
    handleRemoveAsset: (index: number, assetIndex:number) => void;
}

export const ServiceItemListing: React.FC<ServiceItemsProps> = ({
                                                                    serviceItems,
                                                                    taxCategoryOptions,
                                                                    handleEditServiceItem,
                                                                    handleRemoveItem,
                                                                    handleRemoveAsset
                                                                }) => {
    return (
        <table>
            <thead>
            <tr>
                <th>Assets</th>
                <th>Service Name</th>
                <th>Description</th>
                <th>PR Quantity</th>
                <th>Per Service Cost</th>
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
            {serviceItems.map((service, index) => (
                <tr key={index}>
                    <td>
                        <div className="flex flex-col gap-1">
                            {service.assets.map((asset: any, assetIndex: number) => (
                                <div key={assetIndex}
                                     className="flex justify-start items-center gap-2">
                                    <span>{asset.name}-{asset.code}</span>
                                    <button type="button"
                                            onClick={() => handleRemoveAsset(index, assetIndex)}
                                            className="btn btn-outline-danger btn-sm">
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
                            ))}
                        </div>
                    </td>
                    <td>{service.name}</td>
                    <td>{service.description}</td>
                    <td>{service.quantity}</td>
                    <td>
                        <input
                            type="number"
                            className="form-input"
                            value={service.unit_cost}
                            onChange={(e) => handleEditServiceItem({
                                index: index,
                                field: 'unit_cost',
                                value: e.target.valueAsNumber,
                            })}
                        />
                    </td>
                    <td>
                        {service.lpo_quantity}
                    </td>
                    <td>{service.total}</td>
                    <td>
                        <select
                            name="tax_category_id"
                            id="tax_category_id"
                            className="form-select"
                            value={service.tax_category_id}
                            onChange={(e) => handleEditServiceItem({
                                index: index,
                                field: 'tax_category_id',
                                value: e.target.value
                            })}
                        >
                            {taxCategoryOptions.map((taxCategory: any, index: number) => (
                                <option key={index}
                                        value={taxCategory.value}>{taxCategory.label}</option>
                            ))}
                        </select>
                    </td>
                    <td>
                        <input
                            type="number"
                            className="form-input"
                            value={service.tax_rate}
                            onChange={(e) => handleEditServiceItem({
                                index: index,
                                field: 'tax_rate',
                                value: parseFloat(e.target.value),
                            })}
                        />
                    </td>
                    <td>{service.tax_amount}</td>
                    <td>{service.row_total}</td>
                    <td>
                        <div className="flex gap-3 items-center">
                            {/*<button*/}
                            {/*    type="button"*/}
                            {/*    className="btn btn-outline-primary btn-sm"*/}
                            {/*    onClick={() => handleEditItem(index)}*/}
                            {/*>*/}
                            {/*    Edit*/}
                            {/*</button>*/}
                            <button
                                type="button"
                                onClick={() => handleRemoveItem(index)}
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
            {serviceItems.length === 0 ? (
                <tr>
                    <td colSpan={10} className="text-center">No Service Added</td>
                </tr>
            ) : (
                <tr>
                    <td colSpan={3} className="font-bold text-center">Total</td>
                    <td className="text-left font-bold">{serviceItems.reduce((acc: number, item) => acc + item.quantity, 0)}</td>
                    <td className="text-left font-bold">{serviceItems.reduce((acc: number, item) => acc + item.unit_cost, 0)}</td>
                    <td className="text-left font-bold">{serviceItems.reduce((acc: number, item) => acc + item.lpo_quantity, 0)}</td>
                    <td className="text-left font-bold">{serviceItems.reduce((acc: number, item) => acc + item.total, 0)}</td>
                    <td></td>
                    <td></td>
                    <td className="text-left font-bold">{serviceItems.reduce((acc: number, item) => acc + item.tax_amount, 0)}</td>
                    <td className="text-left font-bold">{serviceItems.reduce((acc: number, item) => acc + item.row_total, 0)}</td>
                </tr>
            )}
            </tbody>
        </table>
    );
};
