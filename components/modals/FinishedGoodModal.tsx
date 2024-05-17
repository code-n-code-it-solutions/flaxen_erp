import React, {useEffect, useState} from 'react';
import Button from "@/components/Button";
import {ButtonType, ButtonVariant, RAW_PRODUCT_LIST_TYPE} from "@/utils/enums";
import {Dropdown} from "@/components/form/Dropdown";
import {Input} from "@/components/form/Input";
import Modal from "@/components/Modal";
import {IRootState, useAppDispatch, useAppSelector} from "@/store";
import {uniqBy} from "lodash";
import {useSelector} from "react-redux";
import {getTaxCategories} from "@/store/slices/taxCategorySlice";
import {setAuthToken} from "@/configs/api.config";
import {clearFillingState, getFinishedGoodStock} from "@/store/slices/fillingSlice";
import {getProductAssemblies} from "@/store/slices/productAssemblySlice";

interface IProps {
    modalOpen: boolean;
    setModalOpen: (value: boolean) => void;
    handleSubmit: (value: any) => void;
    detail?: any;
}

const FinishedGoodModal = ({
                               modalOpen,
                               setModalOpen,
                               handleSubmit,
                               detail
                           }: IProps) => {
    const dispatch = useAppDispatch();
    const {finishedGoods} = useAppSelector((state) => state.filling);
    const {taxCategories} = useSelector((state: IRootState) => state.taxCategory);
    const {token} = useSelector((state: IRootState) => state.user);
    const {allProductAssemblies} = useAppSelector((state) => state.productAssembly);

    const [quotationItem, setQuotationItem] = useState<any>({})
    const [finishGoodsList, setFinishGoodsList] = useState<any[]>([])
    const [batchNumberOptions, setBatchNumberOptions] = useState<any[]>([])
    const [productAssemblyOptions, setProductAssemblyOptions] = useState<any[]>([])
    const [taxCategoryOptions, setTaxCategoryOptions] = useState<any>([]);
    const discountTypes = [
        {label: 'Percentage', value: 'percentage'},
        {label: 'Fixed', value: 'fixed'},
    ]

    const handleChange = (name: string, value: any, required: boolean) => {
        switch (name) {
            case 'batch_number':
                if (value && typeof value !== 'undefined') {
                    setQuotationItem({...quotationItem, batch_number: value.value})
                    setFinishGoodsList(finishedGoods.filter((item: any) => item.batch_number === value.value).map((item: any) => ({
                        label: item.product.title + '-' + item.product.item_code + ' (' + item.finalStock + '/' + item.capacity + ')',
                        value: item.raw_product_id,
                        batch_number: item.batch_number,
                        retail_price: item.retail_price,
                        capacity: item.capacity,
                        total_produced: item.totalProduced,
                        total_sold: item.totalSold,
                        final_stock: item.finalStock,
                    })))
                    setQuotationItem({...quotationItem, batch_number: value.value})
                } else {
                    setFinishGoodsList([])
                    setQuotationItem({...quotationItem, batch_number: ''})
                }
                break
            case 'raw_product_id':
                if (value && typeof value !== 'undefined') {
                    setQuotationItem({
                        ...quotationItem,
                        raw_product_id: value.value,
                        batch_number: value.batch_number,
                        retail_price: value.retail_price,
                        capacity: value.capacity,
                        total_produced: value.total_produced,
                        total_sold: value.total_sold,
                        final_stock: value.final_stock,
                        quantity: value.final_stock,
                        total_cost: value.retail_price * value.final_stock
                    })
                } else {
                    setQuotationItem({batch_number: quotationItem.batch_number, raw_product_id: ''})
                }
                break;
            case 'product_assembly_id':
                if (value && typeof value !== 'undefined') {
                    setQuotationItem((prev: any) => ({...prev, product_assembly_id: value.value}));
                    dispatch(clearFillingState());
                    dispatch(getFinishedGoodStock(value.value))
                } else {
                    setQuotationItem((prev: any) => ({...prev, product_assembly_id: ''}));
                }
                break
            case 'tax_category_id':
                if (value && typeof value !== 'undefined') {
                    let taxCategory = taxCategoryOptions.find((item: any) => item.value === value.value)
                    console.log(taxCategory)
                    setQuotationItem({
                        ...quotationItem,
                        tax_category_id: value.value,
                        tax_rate: taxCategory.taxCategory.rate,
                        tax_amount: (quotationItem.total_cost * taxCategory.taxCategory.rate) / 100,
                        total_cost: (quotationItem.retail_price * quotationItem.final_stock) + (((quotationItem.retail_price * quotationItem.final_stock) * taxCategory.taxCategory.rate) / 100)
                    })
                } else {
                    setQuotationItem({...quotationItem, tax_category_id: ''})
                }
                break;
            case 'quantity':
                if (value > quotationItem.final_stock) {
                    // setValidations({...validations, quantity: 'Quantity cannot be greater than available stock'})
                } else {
                    let quantity = Number(value) || 0
                    let totalCost = quantity * quotationItem.retail_price
                    setQuotationItem({
                        ...quotationItem,
                        quantity: quantity,
                        total_cost: totalCost
                    })
                }
                break
            case 'tax_rate':
                setQuotationItem({
                    ...quotationItem,
                    tax_rate: value,
                    tax_amount: (quotationItem.total_cost * value) / 100,
                    total_cost: (quotationItem.retail_price * quotationItem.final_stock) + (((quotationItem.retail_price * quotationItem.final_stock) * value) / 100) + (quotationItem.discount_amount_rate || 0)
                })
                break;
            case 'tax_amount':
                setQuotationItem({
                    ...quotationItem,
                    tax_amount: value,
                    tax_rate: (value / quotationItem.total_cost) * 100
                })
                break;
            case 'discount_type':
                if (value && typeof value !== 'undefined') {
                    setQuotationItem({...quotationItem, discount_type: value.value})
                } else {
                    setQuotationItem({...quotationItem, discount_type: ''})
                }
                break;
            case 'discount_amount_rate':
                setQuotationItem({
                    ...quotationItem,
                    discount_amount_rate: parseFloat(value),
                    total_cost: (quotationItem.retail_price * quotationItem.final_stock) - (quotationItem.discount_type === 'percentage' ? ((quotationItem.retail_price * quotationItem.final_stock) * value) / 100 : value) + quotationItem.tax_amount
                })
                break;
            default:
                setQuotationItem({...quotationItem, [name]: value})
        }
    }

    useEffect(() => {
        setAuthToken(token)
        if (modalOpen) {
            dispatch(getTaxCategories())
            setFinishGoodsList([])
            setQuotationItem({})
            dispatch(getProductAssemblies())
            dispatch(clearFillingState())
        }
    }, [modalOpen]);

    useEffect(() => {
        if (finishedGoods) {
            setBatchNumberOptions(uniqBy(finishedGoods, 'batch_number').map((item: any) => ({
                label: item.batch_number,
                value: item.batch_number
            })))
        }
    }, [finishedGoods]);

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

    useEffect(() => {
        if (allProductAssemblies) {
            setProductAssemblyOptions(allProductAssemblies.map((productAssembly: any) => (
                {
                    label: productAssembly.formula_name,
                    value: productAssembly.id,
                }
            )))
        }
    }, [allProductAssemblies]);

    return (
        <Modal
            show={modalOpen}
            setShow={setModalOpen}
            title={"Add Items"}
            footer={
                <div className="mt-8 gap-3 flex items-center justify-end">
                    <Button
                        type={ButtonType.button}
                        text="Discard"
                        variant={ButtonVariant.secondary}
                        onClick={() => {
                            setModalOpen(false)
                            setQuotationItem({})
                        }}
                    />
                    <Button
                        type={ButtonType.button}
                        text="Add Item"
                        variant={ButtonVariant.primary}
                        onClick={() => handleSubmit(quotationItem)}
                    />
                </div>
            }
        >
            <div className="mb-3 flex flex-col">
                <span><strong>Capacity: </strong>{quotationItem.capacity || 0}</span>
                <span><strong>Available Stock: </strong>{quotationItem.final_stock || 0}</span>
                <span><strong>Retail Price: </strong>{quotationItem.retail_price || 0}</span>
            </div>
            <Dropdown
                divClasses='w-full'
                label='Product Assembly'
                name='product_assembly_id'
                options={productAssemblyOptions}
                value={quotationItem.product_assembly_id}
                onChange={(e: any) => handleChange('product_assembly_id', e, true)}
                required={false}
            />
            <Dropdown
                label="Batch Number"
                name="batch_number"
                options={batchNumberOptions}
                value={quotationItem.batch_number}
                onChange={(e) => handleChange('batch_number', e, true)}
            />
            <Dropdown
                label="Finish Good"
                name="raw_product_id"
                options={finishGoodsList}
                value={quotationItem.raw_product_id}
                onChange={(e) => handleChange('raw_product_id', e, true)}
            />

            <Input
                label="Quotation Quantity"
                type="number"
                name="quantity"
                value={quotationItem.quantity}
                onChange={(e) => handleChange('quantity', parseFloat(e.target.value), true)}
                isMasked={false}
            />

            <div className="flex w-full justify-between items-center gap-3">
                <Dropdown
                    divClasses='w-full'
                    label='Tax Category'
                    name='tax_category_id'
                    options={taxCategoryOptions}
                    value={quotationItem.tax_category_id}
                    onChange={(e) => handleChange('tax_category_id', e, false)}
                    required={true}
                />
                <Input
                    divClasses='w-full'
                    label='Tax Rate'
                    type='number'
                    name='tax_rate'
                    value={quotationItem.tax_rate}
                    onChange={(e) => handleChange('tax_rate', parseFloat(e.target.value), false)}
                    isMasked={false}
                />
            </div>

            <Input
                divClasses='w-full'
                label='Tax Amount'
                type='number'
                name='tax_amount'
                value={quotationItem.tax_amount?.toFixed(2)}
                onChange={(e) => handleChange('tax_amount', parseFloat(e.target.value), false)}
                isMasked={false}
                disabled={true}
            />

            <div className="flex w-full justify-between items-center gap-3">
                <Dropdown
                    divClasses='w-full'
                    label='Discount Type'
                    name='discount_type'
                    options={discountTypes}
                    value={quotationItem.discount_type}
                    onChange={(e) => handleChange('discount_type', e, false)}
                />

                <Input
                    divClasses='w-full'
                    label='Discount Rate/Amount'
                    type='number'
                    name='discount_amount_rate'
                    value={quotationItem.discount_amount_rate?.toFixed(2)}
                    onChange={(e) => handleChange('discount_amount_rate', parseFloat(e.target.value), false)}
                    isMasked={false}
                />
            </div>

            <Input
                label="Total Cost"
                type="number"
                name="total_cost"
                value={quotationItem.total_cost}
                onChange={(e) => setQuotationItem({...quotationItem, total_cost: parseFloat(e.target.value)})}
                isMasked={false}
                disabled={true}
            />

        </Modal>
    );
};

export default FinishedGoodModal;
