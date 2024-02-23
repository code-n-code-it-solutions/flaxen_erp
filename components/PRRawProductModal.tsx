import React, {Fragment, useEffect, useState} from 'react';
import {Dialog, Transition} from "@headlessui/react";
import {setAuthToken} from "@/configs/api.config";
import {getUnits} from "@/store/slices/unitSlice";
import {getRawProducts} from "@/store/slices/rawProductSlice";
import {useDispatch, useSelector} from "react-redux";
import {ThunkDispatch} from "redux-thunk";
import {IRootState} from "@/store";
import {AnyAction} from "redux";
import Select from "react-select";
import {getRandomInt} from "@/utils/helper";

interface IProps {
    modal: boolean;
    setModal: (value: boolean) => void;
    handleAddRawProduct: (value: any) => void;
    modalFormData?: any;
}

const PRRawProductModal = ({modal, setModal, handleAddRawProduct, modalFormData}: IProps) => {
    const [id, setId] = useState<any>(0);
    const [rawProductId, setRawProductId] = useState<number>(0);
    const [rawProductTitle, setRawProductTitle] = useState<any>('');
    const [rawProductUnitPrice, setRawProductUnitPrice] = useState<number>(0);
    const [quantity, setQuantity] = useState<number>(0);
    const [unitId, setUnitId] = useState<number>(0);
    const [unitTitle, setUnitTitle] = useState<any>('');
    const [total, setTotal] = useState<number>(0);
    const [description, setDescription] = useState<any>('');

    const dispatch = useDispatch<ThunkDispatch<IRootState, any, AnyAction>>();
    const [unitOptions, setUnitOptions] = useState<any>([]);
    const [productOptions, setProductOptions] = useState<any>([]);
    const {token} = useSelector((state: IRootState) => state.user);
    const {units} = useSelector((state: IRootState) => state.unit);
    const {allRawProducts} = useSelector((state: IRootState) => state.rawProduct);

    const handleChangeProduct = (e: any) => {
        if (e && typeof e!=='undefined' && e.value) {
            setRawProductId(e.value)
            setRawProductTitle(e.label)
            setRawProductUnitPrice(e.unit_price)
        }
    }

    useEffect(() => {
        setAuthToken(token)
        dispatch(getUnits());
        dispatch(getRawProducts());
        if (modal) {
            setId(modalFormData ? modalFormData.id : performance.now() + getRandomInt(1000, 9999));
            setRawProductId(modalFormData ? modalFormData.raw_product_id : 0);
            setRawProductTitle(modalFormData ? modalFormData.raw_product_title : '');
            setQuantity(modalFormData ? modalFormData.quantity : 0);
            setUnitId(modalFormData ? modalFormData.unit_id : 0);
            setUnitTitle(modalFormData ? modalFormData.unit_title : '');
            setRawProductUnitPrice(modalFormData ? modalFormData.unit_price : 0);
            setTotal(modalFormData ? modalFormData.total : 0);
            setDescription(modalFormData ? modalFormData.description : '');
        }
    }, [modal]);

    useEffect(() => {
        if (units) {
            setUnitOptions([{value: '', label: 'Select Unit'}, ...units]);
        }
    }, [units]);

    useEffect(() => {
        if (allRawProducts) {
            let rawProductOptions = allRawProducts.map((rawProduct: any) => {
                return {
                    value: rawProduct.id,
                    label: rawProduct.title,
                    unit_price: rawProduct.opening_stock_unit_balance
                };
            })
            setProductOptions([{value: '', label: 'Select Raw Product'}, ...rawProductOptions]);
        }
    }, [allRawProducts]);

    useEffect(() => {
        setTotal(quantity * rawProductUnitPrice);
    }, [quantity, rawProductUnitPrice]);

    return (
        <Transition appear show={modal} as={Fragment}>
            <Dialog as="div" open={modal} onClose={() => setModal(false)}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0"/>
                </Transition.Child>
                <div className="fixed inset-0 z-[999] overflow-y-auto bg-[black]/60">
                    <div className="flex min-h-screen items-start justify-center px-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel as="div"
                                          className="panel my-8 w-full max-w-lg overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">
                                <div
                                    className="flex items-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]">
                                    <div className="text-lg font-bold">{modalFormData ? 'Edit' : 'Add'} Raw Product</div>
                                    <button type="button" className="text-white-dark hover:text-dark"
                                            onClick={() => setModal(false)}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="20"
                                            height="20"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <line x1="18" y1="6" x2="6" y2="18"></line>
                                            <line x1="6" y1="6" x2="18" y2="18"></line>
                                        </svg>
                                    </button>
                                </div>
                                <div className="p-5 space-y-5">
                                    <div className="w-full">
                                        <label htmlFor="raw_product_id">Raw Product</label>
                                        <Select
                                            defaultValue={productOptions[0]}
                                            value={productOptions.map((option: any) => {
                                                return option.value === rawProductId ? option : null
                                            })}
                                            options={productOptions}
                                            isSearchable={true}
                                            isClearable={true}
                                            placeholder={'Select Product'}
                                            onChange={(e: any) => {
                                                if (e && typeof e !== 'undefined') {
                                                    setRawProductId(e ? parseInt(e.value) : 0)
                                                    setRawProductTitle(e ? e.label : '')
                                                    setRawProductUnitPrice(e ? parseFloat(e.unit_price) : 0)
                                                    setTotal(e ? parseFloat(e.unit_price) * quantity : 0)
                                                }
                                            }}
                                        />
                                    </div>
                                    <div className="w-full">
                                        <label htmlFor="raw_product_id">Select Unit</label>
                                        <Select
                                            defaultValue={unitOptions[0]}
                                            value={unitOptions.map((option: any) => {
                                                return option.value === unitId ? option : null
                                            })}
                                            options={unitOptions}
                                            isSearchable={true}
                                            isClearable={true}
                                            placeholder={'Select Unit'}
                                            onChange={(e: any) => {
                                                setUnitId(e ? parseInt(e.value) : 0)
                                                setUnitTitle(e ? e.label : '')
                                            }}
                                        />
                                    </div>
                                    <div className="w-full">
                                        <label htmlFor="raw_product_id">Quantity</label>
                                        <input
                                            type="number"
                                            name="quantity"
                                            className="form-input"
                                            value={quantity}
                                            onChange={e => setQuantity(parseInt(e.target.value))}
                                        />
                                    </div>
                                    <div className="w-full">
                                        <label htmlFor="unit_price">Unit Cost</label>
                                        <input
                                            type="number"
                                            name="unit_price"
                                            className="form-input"
                                            value={rawProductUnitPrice}
                                            onChange={e => setRawProductUnitPrice(parseFloat(e.target.value))}
                                        />
                                    </div>
                                    <div className="w-full">
                                        <label htmlFor="total">Total</label>
                                        <input
                                            type="number"
                                            name="total"
                                            className="form-input"
                                            value={total}
                                            onChange={e => setTotal(parseFloat(e.target.value))}
                                        />
                                    </div>
                                    <div className="w-full">
                                        <label htmlFor="description">Description</label>
                                        <textarea
                                            name="description"
                                            className="form-input"
                                            value={description}
                                            onChange={e => setDescription(e.target.value)}
                                        ></textarea>
                                    </div>
                                    <div className="mt-8 flex items-center justify-end">
                                        <button type="button" className="btn btn-outline-danger"
                                                onClick={() => setModal(false)}>
                                            Discard
                                        </button>
                                        <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4"
                                                onClick={() => handleAddRawProduct({
                                                    id: id,
                                                    raw_product_id: rawProductId,
                                                    raw_product_title: rawProductTitle,
                                                    unit_id: unitId,
                                                    unit_title: unitTitle,
                                                    unit_price: rawProductUnitPrice,
                                                    quantity,
                                                    total,
                                                    description
                                                })}>
                                            {modalFormData ? 'Update' : 'Add'}
                                        </button>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default PRRawProductModal;
