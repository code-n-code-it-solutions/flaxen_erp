import React, {useEffect, useState} from 'react';
import Modal from "@/components/Modal";
import {RAW_PRODUCT_LIST_TYPE} from "@/utils/enums";
import {useDispatch, useSelector} from "react-redux";
import {ThunkDispatch} from "redux-thunk";
import {IRootState} from "@/store";
import {AnyAction} from "redux";
import {setAuthToken} from "@/configs/api.config";
import {getUnits} from "@/store/slices/unitSlice";
import {clearRawProductState, getFillingProducts, getRawProducts} from "@/store/slices/rawProductSlice";
import {clearUtilState} from "@/store/slices/utilSlice";
import {Dropdown} from "@/components/form/Dropdown";
import {Input} from "@/components/form/Input";
import Textarea from "@/components/form/Textarea";


interface IProps {
    modalOpen: boolean;
    setModalOpen: (value: boolean) => void;
    handleSubmit: (value: any) => void;
    listFor: RAW_PRODUCT_LIST_TYPE;
    detail?: any;
    fillingRemaining?: number;
    // title: string;
    // footer: React.ReactNode;
}

const RawProductModal = ({modalOpen, setModalOpen, handleSubmit, listFor, detail, fillingRemaining}: IProps) => {
    const [formData, setFormData] = useState<any>({})
    const dispatch = useDispatch<ThunkDispatch<IRootState, any, AnyAction>>();
    const [unitOptions, setUnitOptions] = useState<any>([]);
    const [productOptions, setProductOptions] = useState<any>([]);
    const [valuationMethod, setValuationMethod] = useState('')
    const [taxCategoryOptions, setTaxCategoryOptions] = useState<any>([]);

    const {token} = useSelector((state: IRootState) => state.user);
    const {units} = useSelector((state: IRootState) => state.unit);
    const {allRawProducts, fillingProducts} = useSelector((state: IRootState) => state.rawProduct);
    const {taxCategories} = useSelector((state: IRootState) => state.taxCategory);

    const handleChange = (name: string, value: any) => {
        if (name === 'raw_product_id') {
            let selectedProduct = allRawProducts.find((product: any) => product.id === value);
            setValuationMethod(selectedProduct.valuation_method)
            // console.log(selectedProduct)
            if (selectedProduct) {
                if (listFor === RAW_PRODUCT_LIST_TYPE.FILLING) {
                    setFormData({
                        ...formData,
                        [name]: value,
                        unit_id: selectedProduct.sub_unit_id,
                        unit_price: selectedProduct.valuated_unit_price,
                        quantity: 1,
                        capacity: 0,
                        filling_quantity: 0,
                        required_quantity: 0,
                        total_cost: 0
                    });
                } else {
                    setFormData({
                        ...formData,
                        [name]: value,
                        unit_id: selectedProduct.sub_unit_id,
                        quantity: 1,
                        unit_price: selectedProduct.valuated_unit_price,
                        sub_total: isNaN(formData.quantity) ? 0 : parseFloat(selectedProduct.valuated_unit_price) * formData.quantity
                    });
                }
            }
        } else if (name === 'quantity') {
            // if (isNaN(value)) {
            //     value = 0;
            // }

            setFormData({
                ...formData,
                [name]: value,
                sub_total: isNaN(formData.unit_price) ? 0 : formData.unit_price * value
            });
        } else if (name === 'unit_price') {
            if (isNaN(value)) {
                value = 0;
            }
            console.log(formData, value, formData.quantity)
            setFormData({
                ...formData,
                [name]: value,
                sub_total: isNaN(formData.quantity) ? 0 : formData.quantity * value
            });
        } else if (name === 'tax_category_id') {
            if (isNaN(value)) {
                value = 0;
            }
            let selectedTaxCategory = taxCategories.find((taxCategory: any) => taxCategory.id === value);
            if (selectedTaxCategory) {
                setFormData({
                    ...formData,
                    [name]: value,
                    tax_rate: parseFloat(selectedTaxCategory.rate),
                    tax_amount: (parseFloat(selectedTaxCategory.rate) * formData.sub_total) / 100,
                    grand_total: formData.sub_total + ((parseFloat(selectedTaxCategory.rate) * formData.sub_total) / 100)
                });
            }
        } else if (name === 'tax_rate') {
            if (isNaN(value)) {
                value = 0;
            }
            setFormData({
                ...formData,
                [name]: value,
                tax_amount: (formData.sub_total * value) / 100,
                grand_total: formData.sub_total + ((formData.sub_total * value) / 100)
            });
        } else if (name === 'capacity') {
            if (isNaN(value)) {
                value = 0;
            }
            setFormData({
                ...formData,
                [name]: value,
                filling_quantity: formData.filling_quantity > 0 ? formData.filling_quantity : 0,
                required_quantity: formData.filling_quantity / value,
                total_cost: formData.unit_price * formData.filling_quantity
            });
        } else if (name === 'filling_quantity') {
            if (value > Number(fillingRemaining)) {
                value = Number(fillingRemaining);
            } else if (value < 0 || isNaN(value)) {
                value = 0;
            }
            setFormData({
                ...formData,
                [name]: value,
                required_quantity: value / formData.capacity,
                total_cost: formData.unit_price * value
            });
        } else {
            setFormData({...formData, [name]: value});
        }
    }

    useEffect(() => {
        setAuthToken(token)
        if (modalOpen) {
            dispatch(getUnits());
            if (listFor === RAW_PRODUCT_LIST_TYPE.FILLING) {
                dispatch(getFillingProducts(['filling-material', 'packing-material']));
            } else {
                dispatch(getRawProducts([]));
            }
            setFormData({})
            if (detail) {
                setFormData(detail)
            }
        } else {
            dispatch(clearUtilState());
            dispatch(clearRawProductState());
        }

    }, [modalOpen]);

    useEffect(() => {
        if (units) {
            setUnitOptions([{value: '', label: 'Select Unit'}, ...units]);
        }
    }, [units]);

    useEffect(() => {
        if (allRawProducts && listFor !== RAW_PRODUCT_LIST_TYPE.FILLING) {
            let rawProductOptions = allRawProducts.map((rawProduct: any) => {
                return {
                    value: rawProduct.id,
                    label: rawProduct.title + ' (' + rawProduct.item_code + ') - ' + rawProduct.valuation_method,
                    unit_price: rawProduct.opening_stock_unit_balance
                };
            })
            setProductOptions([{value: '', label: 'Select Raw Product'}, ...rawProductOptions]);
        }
    }, [allRawProducts]);

    useEffect(() => {
        if (fillingProducts && listFor === RAW_PRODUCT_LIST_TYPE.FILLING) {
            let rawProductOptions = fillingProducts.map((rawProduct: any) => {
                return {
                    value: rawProduct.id,
                    label: rawProduct.title,
                    unit_price: rawProduct.opening_stock_unit_balance
                };
            })
            setProductOptions([{value: '', label: 'Select Raw Product'}, ...rawProductOptions]);
        }
    }, [fillingProducts]);

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
    }, [taxCategories]);

    return (
        <Modal
            show={modalOpen}
            setShow={setModalOpen}
            title='Add Raw Product To List'
            footer={
                <div className="mt-8 flex items-center justify-end">
                    <button type="button" className="btn btn-outline-danger"
                            onClick={() => setModalOpen(false)}>
                        Discard
                    </button>
                    <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4"
                            onClick={() => handleSubmit(formData)}>
                        {Object.keys(detail).length > 0 ? 'Update' : 'Add'}
                    </button>
                </div>
            }
        >
            <Dropdown
                divClasses='w-full'
                label='Raw Product'
                name='raw_product_id'
                options={productOptions}
                required={true}
                value={formData.raw_product_id}
                isDisabled={listFor === RAW_PRODUCT_LIST_TYPE.GOOD_RECEIVE_NOTE}
                onChange={(e) => handleChange('raw_product_id', e && typeof e !== 'undefined' ? e.value : 0)}
            />

            <Dropdown
                divClasses='w-full'
                label='Unit'
                name='unit_id'
                options={unitOptions}
                required={true}
                value={formData.unit_id}
                isDisabled={true}
                onChange={(e) => handleChange('unit_id', e && typeof e !== 'undefined' ? e.value : 0)}
            />

            <Input
                label='Quantity'
                type='number'
                name='quantity'
                value={formData.quantity}
                onChange={(e) => handleChange('quantity', parseFloat(e.target.value))}
                isMasked={false}
                disabled={listFor === RAW_PRODUCT_LIST_TYPE.GOOD_RECEIVE_NOTE || listFor === RAW_PRODUCT_LIST_TYPE.FILLING}
            />

            {listFor === RAW_PRODUCT_LIST_TYPE.FILLING && (
                <>
                    <Input
                        label='Capacity (KG)'
                        type='number'
                        name='capacity'
                        value={formData.capacity}
                        onChange={(e) => handleChange('capacity', parseFloat(e.target.value))}
                        isMasked={false}
                    />

                    <div className="flex justify-start items-start gap-1 flex-col w-full">
                        <Input
                            divClasses='w-full'
                            label='Filling (KG)'
                            type='number'
                            name='filling_quantity'
                            value={formData.filling_quantity}
                            onChange={(e) => handleChange('filling_quantity', parseFloat(e.target.value))}
                            isMasked={false}
                        />
                        <small>Remaining: {Number(fillingRemaining) - formData.filling_quantity}</small>
                    </div>

                    <Input
                        label='Required Qty'
                        type='number'
                        name='required_quantity'
                        value={formData.required_quantity}
                        onChange={(e) => handleChange('required_quantity', parseFloat(e.target.value))}
                        isMasked={false}
                        disabled={true}
                    />
                </>
            )}
            {listFor === RAW_PRODUCT_LIST_TYPE.GOOD_RECEIVE_NOTE && (
                <Input
                    label='Received Quantity'
                    type='number'
                    name='received_quantity'
                    value={formData.received_quantity}
                    onChange={(e) => handleChange('received_quantity', parseFloat(e.target.value))}
                    isMasked={false}
                />
            )}
            {(listFor === RAW_PRODUCT_LIST_TYPE.PRODUCT_ASSEMBLY || listFor === RAW_PRODUCT_LIST_TYPE.PRODUCTION || listFor === RAW_PRODUCT_LIST_TYPE.PURCHASE_REQUISITION || listFor === RAW_PRODUCT_LIST_TYPE.GOOD_RECEIVE_NOTE) && (
                <>
                    <Input
                        label={'Unit Cost (' + valuationMethod + ')'}
                        type='number'
                        name='unit_price'
                        value={formData.unit_price}
                        onChange={(e) => handleChange('unit_price', parseFloat(e.target.value))}
                        isMasked={false}
                        disabled={true}
                    />

                    <Input
                        label='Sub Total'
                        type='number'
                        name='sub_total'
                        value={formData.sub_total?.toFixed(2)}
                        onChange={(e) => handleChange('sub_total', parseFloat(e.target.value))}
                        isMasked={false}
                        disabled={true}
                    />
                </>
            )}
            {(listFor === RAW_PRODUCT_LIST_TYPE.LOCAL_PURCHASE_ORDER || listFor === RAW_PRODUCT_LIST_TYPE.GOOD_RECEIVE_NOTE) && (
                <>
                    <Dropdown
                        divClasses='w-full'
                        label='Tax Category'
                        name='tax_category_id'
                        options={taxCategoryOptions}
                        value={formData.tax_category_id}
                        isDisabled={listFor === RAW_PRODUCT_LIST_TYPE.GOOD_RECEIVE_NOTE}
                        onChange={(e) => handleChange('tax_category_id', e && typeof e !== 'undefined' ? e.value : 0)}
                        required={true}
                    />
                    <Input
                        label='Tax Rate'
                        type='number'
                        name='tax_rate'
                        value={formData.tax_rate}
                        onChange={(e) => handleChange('tax_rate', parseFloat(e.target.value))}
                        isMasked={false}
                        disabled={listFor === RAW_PRODUCT_LIST_TYPE.GOOD_RECEIVE_NOTE}
                    />
                    <Input
                        label='Tax Amount'
                        type='number'
                        name='tax_amount'
                        value={formData.tax_amount?.toFixed(2)}
                        onChange={(e) => handleChange('tax_amount', parseFloat(e.target.value))}
                        isMasked={false}
                        disabled={true}
                    />

                    <Input
                        label='Grand Total'
                        type='number'
                        name='grand_total'
                        value={formData.grand_total?.toFixed(2)}
                        onChange={(e) => handleChange('grand_total', parseFloat(e.target.value))}
                        isMasked={false}
                        disabled={true}
                    />
                </>

            )}
            <Textarea
                label='Description'
                name='description'
                value={formData.description}
                isReactQuill={false}
                onChange={(e) => handleChange('description', e.target.value)}
            />

        </Modal>
    );
};

export default RawProductModal;
