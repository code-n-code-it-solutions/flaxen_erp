import React, {useState} from 'react';
import Breadcrumb from "@/components/Breadcrumb";
import ImageUploader from "@/components/ImageUploader";
// import Select from 'react-select';
import Link from "next/link";
import {getRandomInt} from "@/pages/helper";
import dynamic from 'next/dynamic';

const Select = dynamic(
    () => import('react-select'),
    {ssr: false} // This will load the component only on the client-side
);

interface TableRow {
    id: number;
    product_id: string;
    unit_id: string;
    quantity: number;
    cost: number;
    total: number;
}

const Create = () => {
    const [formulaName, setFormulaName] = useState('');
    const [formulaCode, setFormulaCode] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [itemObject, setItemObject] = useState({
        product_id: '',
        unit_id: '',
        quantity: '',
        unit_cost: '',
        total_cost: ''
    });

    const [categoryOptions, setCategoryOptions] = useState([
        {value: '1', label: 'Category 1'},
        {value: '2', label: 'Category 2'},
        {value: '3', label: 'Category 3'},
    ]);

    const [unitOptions, setUnitOptions] = useState([
        {value: '1', label: 'Unit 1'},
        {value: '2', label: 'Unit 2'},
        {value: '3', label: 'Unit 3'},
    ]);

    const [productOptions, setProductOptions] = useState([
        {value: '1', label: 'Product 1'},
        {value: '2', label: 'Product 2'},
        {value: '3', label: 'Product 3'},
    ]);

    const [rows, setRows] = useState<TableRow[]>([]);

    const handleAddRow = () => {
        const newRow: TableRow = {
            id: Date.now() + getRandomInt(1, 100),
            product_id: '',
            unit_id: '',
            quantity: 0,
            cost: 0,
            total: 0
        };
        setRows([...rows, newRow]);
    };

    const handleRemoveRow = (id: number) => {
        setRows(rows.filter(row => row.id !== id));
    };

    const handleChange = (id: number, event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const updatedRows = rows.map(row => {
            if (row.id === id) {
                return {...row, [event.target.name]: event.target.value};
            }
            return row;
        });
        setRows(updatedRows);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(rows)
        // console.log('Form Data:', formData);
        // Here you can also send the data to a server or API
    };

    const valueInput = (id: number) => {
        return rows.map(row => {
            if (row.id === id) {
                return row
            }
        })
    }

    return (
        <div>
            <Breadcrumb items={[
                {
                    title: 'Home',
                    href: '/main',
                },
                {
                    title: 'All Product Assemblies',
                    href: '/inventory/product-assembly',
                },
                {
                    title: 'Create New',
                    href: '#',
                },
            ]}/>
            <div className="pt-5">
                <div className="panel">
                    <div className="mb-5 flex items-center justify-between">
                        <h5 className="text-lg font-semibold dark:text-white-light">Enter Details of Assembly</h5>
                        <Link href="/inventory/product-assembly"
                              className="btn btn-primary btn-sm m-1">
                            <span className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ltr:mr-2 rtl:ml-2" width="24"
                                     height="24" viewBox="0 0 24 24" fill="none">
                                  <path d="M15 5L9 12L15 19" stroke="currentColor" strokeWidth="1.5"
                                        strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                Back
                            </span>
                        </Link>
                    </div>
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div className="flex justify-start flex-col items-start space-y-3 w-full md:w-1/2">
                            <div className="w-full">
                                <label htmlFor="formula_name">Formula Name</label>
                                <input id="formula_name" type="text" name="formula_name"
                                       placeholder="Enter Formula Name"
                                       value={formulaName} onChange={(e) => setFormulaName(e.target.value)}
                                       className="form-input"/>
                            </div>
                            <div className="w-full">
                                <label htmlFor="formula_code">Formula Code</label>
                                <input id="formula_code" type="text" name="formula_code"
                                       placeholder="Enter Formula Code"
                                       value={formulaCode} onChange={(e) => setFormulaCode(e.target.value)}
                                       className="form-input"/>
                            </div>
                            <div className="w-full">
                                <label htmlFor="category_id">Category</label>
                                <Select
                                    defaultValue={categoryOptions[0]}
                                    options={categoryOptions}
                                    isSearchable={true}
                                    isClearable={true}
                                    placeholder={'Select Category'}
                                    onChange={(e) => {
                                        setCategoryId(e ? e.value : '');
                                    }}
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-end items-center mb-3">
                                <button onClick={handleAddRow} className="btn btn-primary btn-sm">Add Row</button>
                            </div>
                            <table>
                                <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Unit</th>
                                    <th>Qty</th>
                                    <th>Cost</th>
                                    <th>Total</th>
                                    <th></th>
                                </tr>
                                </thead>
                                <tbody>
                                {rows.map(row => (
                                    <tr key={row.id}>
                                        <td>
                                            <Select
                                                defaultValue={productOptions[0]}
                                                options={productOptions}
                                                isSearchable={true}
                                                isClearable={true}
                                                placeholder={'Select Product'}
                                                onChange={(e) => {
                                                    const updatedRows = rows.map(row2 => {
                                                        if (row2.id === row.id) {
                                                            return {...row2, product_id: e ? e.value : ''};
                                                        }
                                                        return row;
                                                    });
                                                    setRows(updatedRows);
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <Select
                                                defaultValue={unitOptions[0]}
                                                options={unitOptions}
                                                isSearchable={true}
                                                isClearable={true}
                                                placeholder={'Select Unit'}
                                                onChange={(e) => {
                                                    const updatedRows = rows.map(row2 => {
                                                        if (row2.id === row.id) {
                                                            return {...row2, unit_id: e ? e.value : ''};
                                                        }
                                                        return row;
                                                    });
                                                    setRows(updatedRows);
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                name="quantity"
                                                className="form-input"
                                                value={valueInput(row.id).quantity}
                                                onChange={e => handleChange(row.id, e)}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                name="cost"
                                                className="form-input"
                                                value={valueInput(row.id).cost}
                                                onChange={e => handleChange(row.id, e)}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                name="total"
                                                className="form-input"
                                                value={valueInput(row.id).total}
                                                onChange={e => handleChange(row.id, e)}
                                            />
                                        </td>
                                        <td>
                                            <button onClick={() => handleRemoveRow(row.id)}
                                                    className="btn btn-danger btn-sm">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                     viewBox="0 0 24 24" fill="none">
                                                    <path d="M20.5001 6H3.5" stroke="currentColor" strokeWidth="1.5"
                                                          strokeLinecap="round"/>
                                                    <path
                                                        d="M18.8332 8.5L18.3732 15.3991C18.1962 18.054 18.1077 19.3815 17.2427 20.1907C16.3777 21 15.0473 21 12.3865 21H11.6132C8.95235 21 7.62195 21 6.75694 20.1907C5.89194 19.3815 5.80344 18.054 5.62644 15.3991L5.1665 8.5"
                                                        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                                    <path
                                                        d="M6.5 6C6.55588 6 6.58382 6 6.60915 5.99936C7.43259 5.97849 8.15902 5.45491 8.43922 4.68032C8.44784 4.65649 8.45667 4.62999 8.47434 4.57697L8.57143 4.28571C8.65431 4.03708 8.69575 3.91276 8.75071 3.8072C8.97001 3.38607 9.37574 3.09364 9.84461 3.01877C9.96213 3 10.0932 3 10.3553 3H13.6447C13.9068 3 14.0379 3 14.1554 3.01877C14.6243 3.09364 15.03 3.38607 15.2493 3.8072C15.3043 3.91276 15.3457 4.03708 15.4286 4.28571L15.5257 4.57697C15.5433 4.62992 15.5522 4.65651 15.5608 4.68032C15.841 5.45491 16.5674 5.97849 17.3909 5.99936C17.4162 6 17.4441 6 17.5 6"
                                                        stroke="currentColor" strokeWidth="1.5"/>
                                                </svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>

                        <button type="submit" className="btn btn-primary !mt-6">
                            Submit
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Create;
