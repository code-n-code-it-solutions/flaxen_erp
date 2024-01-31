import React, {useEffect, useState} from 'react';
import Breadcrumb from "@/components/Breadcrumb";
import ImageUploader from "@/components/ImageUploader";
import Select from 'react-select';
import Link from "next/link";
import {useDispatch, useSelector} from "react-redux";
import {ThunkDispatch} from "redux-thunk";
import {IRootState} from "@/store";
import {AnyAction} from "redux";
import {getUnits} from "@/store/slices/unitSlice";
import {setAuthToken, setContentType} from "@/configs/api.config";
import {storeRawProduct} from "@/store/slices/rawProductSlice";

interface IFormData {
    item_code: string;
    title: string;
    unit_id: string;
    sub_unit_id: string;
    purchase_description: string;
    value_per_unit: string;
    valuation_method: string;
    min_stock_level: string;
    opening_stock: string;
    opening_stock_balance: string;
    sale_description: string;
    image: File | null;
}

const Create = () => {
    const dispatch = useDispatch<ThunkDispatch<IRootState, any, AnyAction>>();
    const {units} = useSelector((state: IRootState) => state.unit);
    const {token} = useSelector((state: IRootState) => state.user);
    const [image, setImage] = useState<File | null>(null);
    const [formData, setFormData] = useState<IFormData>({
        item_code: '',
        title: '',
        unit_id: '',
        sub_unit_id: '',
        purchase_description: '',
        value_per_unit: '',
        valuation_method: '',
        min_stock_level: '',
        opening_stock: '',
        opening_stock_balance: '',
        sale_description: '',
        image: null,
    });

    // const [categoryOptions, setCategoryOptions] = useState([
    //     {value: '1', label: 'Category 1'},
    //     {value: '2', label: 'Category 2'},
    //     {value: '3', label: 'Category 3'},
    // ]);

    const [unitOptions, setUnitOptions] = useState([]);
    const [subUnitOptions, setSubUnitOptions] = useState([]);
    const [valuationMethodOptions, setValuationMethodOptions] = useState([
        {value: 'LIFO', label: 'LIFO'},
        {value: 'FIFO', label: 'FIFO'},
        {value: 'Average', label: 'Average'},
    ]);

    const allUnitOptions = () => {
        dispatch(getUnits());
    }

    useEffect(() => {
        allUnitOptions();
    }, [])

    useEffect(() => {
        if (units) {
            setUnitOptions(units);
            setSubUnitOptions(units)
        }
    }, [units])


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        formData.image = image;
        setAuthToken(token)
        setContentType('multipart/form-data')
        dispatch(storeRawProduct(formData));
    };

    return (
        <div>
            <Breadcrumb items={[
                {
                    title: 'Home',
                    href: '/main',
                },
                {
                    title: 'All Raw Materials',
                    href: '/inventory/products',
                },
                {
                    title: 'Create New',
                    href: '#',
                },
            ]}/>
            <div className="pt-5">
                <div className="panel">
                    <div className="mb-5 flex items-center justify-between">
                        <h5 className="text-lg font-semibold dark:text-white-light">Enter Details of Raw Materials</h5>
                        <Link href="/inventory/products"
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
                        <div className="flex justify-center items-center">
                            <ImageUploader image={image} setImage={setImage} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label htmlFor="item_code">Item Code</label>
                                <input id="item_code" type="text" name="item_code" placeholder="Enter Item code"
                                       value={formData.item_code} onChange={handleChange}
                                       className="form-input"/>
                            </div>
                            <div>
                                <label htmlFor="title">Item Title</label>
                                <input id="title" type="text" name="title" placeholder="Enter Item TItle"
                                       value={formData.title} onChange={handleChange}
                                       className="form-input"/>
                            </div>
                            {/*<div>*/}
                            {/*    <label htmlFor="category_id">Category</label>*/}
                            {/*    <Select*/}
                            {/*        defaultValue={categoryOptions[0]}*/}
                            {/*        options={categoryOptions}*/}
                            {/*        isSearchable={true}*/}
                            {/*        isClearable={true}*/}
                            {/*        placeholder={'Select Category'}*/}
                            {/*        onChange={(e) => {*/}
                            {/*            setFormData({*/}
                            {/*                ...formData,*/}
                            {/*                category_id: e ? e.value : ''*/}
                            {/*            });*/}
                            {/*        }}*/}
                            {/*    />*/}
                            {/*</div>*/}
                            <div>
                                <label htmlFor="unit_id">Unit</label>
                                <Select
                                    defaultValue={unitOptions[0]}
                                    options={unitOptions}
                                    isSearchable={true}
                                    isClearable={true}
                                    placeholder={'Select Unit'}
                                    onChange={(e) => {
                                        setFormData({
                                            ...formData,
                                            unit_id: e ? e.value : ''
                                        });
                                    }}
                                />
                            </div>
                            <div>
                                <label htmlFor="sub_unit_id">Sub Unit</label>
                                <Select
                                    defaultValue={subUnitOptions[0]}
                                    options={subUnitOptions}
                                    isSearchable={true}
                                    isClearable={true}
                                    placeholder={'Select Sub Unit'}
                                    onChange={(e) => {
                                        setFormData({
                                            ...formData,
                                            sub_unit_id: e ? e.value : ''
                                        });
                                    }}
                                />
                            </div>

                            <div>
                                <label htmlFor="value_per_unit">Value per Unit (According to sub unit)</label>
                                <input id="value_per_unit" type="text" name="value_per_unit"
                                       placeholder="Enter weight per main unit"
                                       value={formData.value_per_unit} onChange={handleChange}
                                       className="form-input"/>
                            </div>
                            <div>
                                <label htmlFor="valuation_method">Valuation Method</label>
                                <Select
                                    defaultValue={valuationMethodOptions[0]}
                                    options={valuationMethodOptions}
                                    isSearchable={true}
                                    isClearable={true}
                                    placeholder={'Select Valuation Method'}
                                    onChange={(e) => {
                                        setFormData({
                                            ...formData,
                                            valuation_method: e ? e.value : ''
                                        });
                                    }}
                                />
                            </div>
                            <div>
                                <label htmlFor="min_stock_level">Min Stock Level</label>
                                <input id="min_stock_level" type="text" name="min_stock_level"
                                       placeholder="Set min stock level"
                                       value={formData.min_stock_level} onChange={handleChange}
                                       className="form-input"/>
                            </div>
                            <div>
                                <label htmlFor="opening_stock">Opening Stock Count</label>
                                <input id="opening_stock" type="text" name="opening_stock"
                                       placeholder="Enter Opening Stock Count"
                                       value={formData.opening_stock} onChange={handleChange}
                                       className="form-input"/>
                            </div>
                            <div>
                                <label htmlFor="opening_stock_balance">Opening Stock Balance</label>
                                <input id="opening_stock_balance" type="text" name="opening_stock_balance"
                                       placeholder="Enter Opening Stock Balance"
                                       value={formData.opening_stock_balance} onChange={handleChange}
                                       className="form-input"/>
                            </div>
                            <div>
                                <label htmlFor="purchase_description">Purchase Description</label>
                                <textarea
                                    id="purchase_description"
                                    rows={3}
                                    name="purchase_description"
                                    className="form-textarea"
                                    onChange={handleChange}
                                    placeholder="Enter description for purchase"
                                    defaultValue={formData.purchase_description}
                                ></textarea>
                            </div>
                            <div>
                                <label htmlFor="sale_description">Sale Description</label>
                                <textarea
                                    id="sale_description"
                                    rows={3}
                                    name="sale_description"
                                    className="form-textarea"
                                    onChange={handleChange}
                                    placeholder="Enter descriptin for sales"
                                    defaultValue={formData.sale_description}
                                ></textarea>
                            </div>
                            {/*<div className="space-y-5">*/}
                            {/*    */}

                            {/*</div>*/}
                            {/*<div className="space-y-5">*/}
                            {/*    */}
                            {/*</div>*/}
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
