import React, { useEffect, useState } from 'react';
import Button from '@/components/Button';
import { ButtonType, ButtonVariant } from '@/utils/enums';
import { Dropdown } from '@/components/form/Dropdown';
import { Input } from '@/components/form/Input';
import Modal from '@/components/Modal';
import { IRootState, useAppDispatch, useAppSelector } from '@/store';
import { useSelector } from 'react-redux';
import { getTaxCategories } from '@/store/slices/taxCategorySlice';
import { setAuthToken } from '@/configs/api.config';
import { clearFillingState, getFinishedGoodStock } from '@/store/slices/fillingSlice';
import { getProductAssemblies } from '@/store/slices/productAssemblySlice';

interface IProps {
    modalFor: 'quotation' | 'delivery_note';
    considerOutOfStock?: boolean;
    skip?: boolean;
    modalOpen: boolean;
    setModalOpen: (value: boolean) => void;
    handleSubmit: (value: any) => void;
    detail?: any;
}

const FinishedGoodModal = ({
                               modalFor,
                               skip = false,
                               considerOutOfStock = false,
                               modalOpen,
                               setModalOpen,
                               handleSubmit,
                               detail
                           }: IProps) => {
    const dispatch = useAppDispatch();
    const { finishedGoods } = useAppSelector((state) => state.filling);
    const { taxCategories } = useSelector((state: IRootState) => state.taxCategory);
    const { token } = useSelector((state: IRootState) => state.user);
    const { allProductAssemblies } = useAppSelector((state) => state.productAssembly);

    const [quotationItem, setQuotationItem] = useState<any>({});
    const [finishGoodsList, setFinishGoodsList] = useState<any[]>([]);
    const [batchNumberOptions, setBatchNumberOptions] = useState<any[]>([]);
    const [productAssemblyOptions, setProductAssemblyOptions] = useState<any[]>([]);
    const [taxCategoryOptions, setTaxCategoryOptions] = useState<any>([]);
    const discountTypes = [
        { label: 'Percentage', value: 'percentage' },
        { label: 'Fixed', value: 'fixed' }
    ];

    const handleChange = (name: string, value: any, required: boolean) => {
        switch (name) {
            case 'batch_number':
                if (value && typeof value !== 'undefined') {
                    setQuotationItem({ ...quotationItem, batch_number: value.value });

                    if (finishedGoods) {
                        let stock = finishedGoods[value.value];
                        if (stock) {
                            console.log(stock);
                            setFinishGoodsList(stock.items.map((stock: any) => ({
                                label: stock.product.title + '-' + stock.product.item_code + ' (' + stock.final_stock + ')',
                                value: stock.raw_product_id,
                                item: stock
                            })));
                        }
                    }

                    // setQuotationItem({
                    //     ...quotationItem,
                    //     batch_number: value.value,
                    //     filling_id: value.filling_id,
                    //     production_id: value.production_id
                    // });
                } else {
                    setFinishGoodsList([]);
                    setQuotationItem({ ...quotationItem, batch_number: '' });
                }
                break;
            case 'raw_product_id':
                if (value && typeof value !== 'undefined') {
                    setQuotationItem({
                        ...quotationItem,
                        raw_product_id: value.value,
                        batch_number: value.item.batch_number,
                        retail_price: value.item.retail_price,
                        capacity: value.item.capacity,
                        product_assembly_id: value.item.product_assembly_id,
                        filling_id: value.item.filling_id,
                        production_id: value.item.production_id,
                        final_stock: value.item.final_stock,
                        quantity: value.item.final_stock,
                        total_cost: value.item.retail_price * value.item.final_stock
                    });
                } else {
                    setQuotationItem({ batch_number: quotationItem.batch_number, raw_product_id: '' });
                }
                break;
            case 'product_assembly_id':
                if (value && typeof value !== 'undefined') {
                    setQuotationItem((prev: any) => ({ ...prev, product_assembly_id: value.value }));
                    dispatch(clearFillingState());
                    dispatch(getFinishedGoodStock(value.value));
                } else {
                    setQuotationItem((prev: any) => ({ ...prev, product_assembly_id: '' }));
                }
                break;
            case 'tax_category_id':
                if (value && typeof value !== 'undefined') {
                    let taxCategory = taxCategoryOptions.find((item: any) => item.value === value.value);
                    const effectiveQuantity = quotationItem.quantity || quotationItem.final_stock;
                    const baseCost = quotationItem.retail_price * effectiveQuantity;
                    const taxAmount = (baseCost * taxCategory.taxCategory.rate) / 100;
                    setQuotationItem({
                        ...quotationItem,
                        tax_category_id: value.value,
                        tax_rate: taxCategory.taxCategory.rate,
                        tax_amount: taxAmount,
                        total_cost: baseCost + taxAmount
                    });
                } else {
                    setQuotationItem({ ...quotationItem, tax_category_id: '' });
                }
                break;
            case 'quantity':
                let quantity = Number(value) || 0;

                if (!considerOutOfStock) {
                    if (quantity > quotationItem.final_stock) {
                        quantity = quotationItem.final_stock;
                    } else {
                        alert('Quantity should be less than or equal to available stock.');
                    }
                }

                let totalCost = quantity * quotationItem.retail_price;
                setQuotationItem({
                    ...quotationItem,
                    quantity: quantity,
                    delivered_quantity: quantity,
                    available_quantity: quotationItem.final_stock,
                    total_cost: totalCost
                });
                break;
            case 'tax_rate':
                const effectiveQuantityForTax = quotationItem.quantity || quotationItem.final_stock;
                const baseCostForTax = quotationItem.retail_price * effectiveQuantityForTax;
                const taxAmount = (baseCostForTax * value) / 100;
                setQuotationItem({
                    ...quotationItem,
                    tax_rate: value,
                    tax_amount: taxAmount,
                    total_cost: baseCostForTax + taxAmount + (quotationItem.discount_amount_rate || 0)
                });
                break;
            case 'tax_amount':
                setQuotationItem({
                    ...quotationItem,
                    tax_amount: value,
                    tax_rate: (value / quotationItem.total_cost) * 100
                });
                break;
            case 'discount_type':
                if (value && typeof value !== 'undefined') {
                    setQuotationItem({ ...quotationItem, discount_type: value.value });
                } else {
                    setQuotationItem({ ...quotationItem, discount_type: '' });
                }
                break;
            case 'discount_amount_rate':
                const effectiveQuantityForDiscount = quotationItem.quantity || quotationItem.final_stock;
                const baseCostForDiscount = quotationItem.retail_price * effectiveQuantityForDiscount;
                let discountAmount = value;

                if (quotationItem.discount_type === 'percentage') {
                    discountAmount = (baseCostForDiscount * value) / 100;
                }

                setQuotationItem({
                    ...quotationItem,
                    discount_amount_rate: parseFloat(value),
                    total_cost: baseCostForDiscount - discountAmount + quotationItem.tax_amount
                });
                break;

            default:
                setQuotationItem({ ...quotationItem, [name]: value });
        }
    };

    useEffect(() => {
        setAuthToken(token);
        if (modalOpen) {
            dispatch(getTaxCategories());
            setFinishGoodsList([]);
            setQuotationItem({});
            dispatch(getProductAssemblies());
            // dispatch(clearFillingState());
        }
    }, [modalOpen]);

    useEffect(() => {
        if (finishedGoods) {
            // console.log(finishedGoods);
            setBatchNumberOptions(Object.keys(finishedGoods).map((item: any) => ({
                label: item,
                value: item,
                items: finishedGoods[item]
            })));
            // setBatchNumberOptions(uniqBy(finishedGoods, 'batch_number').map((item: any) => ({
            //     label: item.batch_number,
            //     value: item.batch_number,
            //     filling_id: item.filling_id,
            //     production_id: item.production_id
            // })));
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
            });
            setTaxCategoryOptions([{ value: '', label: 'Select Tax Category' }, ...taxCategoryOptions]);
        }
    }, [taxCategories]);

    useEffect(() => {
        if (allProductAssemblies) {
            setProductAssemblyOptions(allProductAssemblies.map((productAssembly: any) => (
                {
                    label: productAssembly.formula_name,
                    value: productAssembly.id
                }
            )));
        }
    }, [allProductAssemblies]);

    useEffect(() => {
        console.log(quotationItem);
    }, [quotationItem]);

    return (
        <Modal
            show={modalOpen}
            setShow={setModalOpen}
            title={'Add Items'}
            footer={
                <div className="mt-8 gap-3 flex items-center justify-end">
                    <Button
                        type={ButtonType.button}
                        text="Discard"
                        variant={ButtonVariant.secondary}
                        onClick={() => {
                            setModalOpen(false);
                            setQuotationItem({});
                        }}
                    />
                    {(quotationItem.final_stock > 0 || considerOutOfStock) && (
                        <Button
                            type={ButtonType.button}
                            text="Add Item"
                            variant={ButtonVariant.primary}
                            onClick={() => handleSubmit(quotationItem)}
                        />
                    )}

                </div>
            }
        >
            <div className="mb-3 flex flex-col">
                <span><strong>Capacity: </strong>{quotationItem.capacity || 0}</span>
                <span><strong>Available Stock: </strong>{quotationItem.final_stock || 0}</span>
                <span><strong>Retail Price: </strong>{quotationItem.retail_price || 0}</span>
            </div>


            <Dropdown
                divClasses="w-full"
                label="Product Assembly"
                name="product_assembly_id"
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
                label="Quantity"
                type="number"
                name="quantity"
                value={quotationItem.quantity}
                onChange={(e) => handleChange('quantity', parseFloat(e.target.value), true)}
                isMasked={false}
            />

            <div className="flex w-full justify-between items-center gap-3">
                <Dropdown
                    divClasses="w-full"
                    label="Tax Category"
                    name="tax_category_id"
                    options={taxCategoryOptions}
                    value={quotationItem.tax_category_id}
                    onChange={(e) => handleChange('tax_category_id', e, false)}
                    required={true}
                />
                <Input
                    divClasses="w-full"
                    label="Tax Rate"
                    type="number"
                    name="tax_rate"
                    value={quotationItem.tax_rate}
                    onChange={(e) => handleChange('tax_rate', parseFloat(e.target.value), false)}
                    isMasked={false}
                />
            </div>

            <Input
                divClasses="w-full"
                label="Tax Amount"
                type="number"
                name="tax_amount"
                value={quotationItem.tax_amount?.toFixed(2)}
                onChange={(e) => handleChange('tax_amount', parseFloat(e.target.value), false)}
                isMasked={false}
                disabled={true}
            />

            <div className="flex w-full justify-between items-center gap-3">
                <Dropdown
                    divClasses="w-full"
                    label="Discount Type"
                    name="discount_type"
                    options={discountTypes}
                    value={quotationItem.discount_type}
                    onChange={(e) => handleChange('discount_type', e, false)}
                />

                <Input
                    divClasses="w-full"
                    label="Discount Rate/Amount"
                    type="number"
                    name="discount_amount_rate"
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
                onChange={(e) => setQuotationItem({ ...quotationItem, total_cost: parseFloat(e.target.value) })}
                isMasked={false}
                disabled={true}
            />

        </Modal>
    );
};

export default FinishedGoodModal;
