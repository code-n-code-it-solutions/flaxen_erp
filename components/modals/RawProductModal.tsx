import React, { useEffect, useState } from 'react';
import Modal from "@/components/Modal";
import { Dropdown } from "@/components/form/Dropdown";
import { Input } from "@/components/form/Input";
import Textarea from "@/components/form/Textarea";

interface IProps {
    modalOpen: boolean;
    setModalOpen: (value: boolean) => void;
    handleSubmit: (value: any) => void;
    listFor: any; // Replace with actual type if available
    detail?: any;
    fillingRemaining?: number;
}

const CommissionsFormModal = ({ modalOpen, setModalOpen, handleSubmit, listFor, detail, fillingRemaining }: IProps) => {
    const [formData, setFormData] = useState<any>({});
    const [unitOptions, setUnitOptions] = useState<any>([]);
    const [productOptions, setProductOptions] = useState<any>([]);
    const [taxCategoryOptions, setTaxCategoryOptions] = useState<any>([]);
    const [accounts, setAccounts] = useState<any>([]);

    return (
        <Modal
            show={modalOpen}
            setShow={setModalOpen}
            title='Add Item List'
            size={'lg'}
            footer={
                <div className="mt-8 flex items-center justify-end">
                    <button type="button" className="btn btn-outline-danger" onClick={() => setModalOpen(false)}>
                        Discard
                    </button>
                    <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4" onClick={() => handleSubmit(formData)}>
                        {Object.keys(detail).length > 0 ? 'Update' : 'Add'}
                    </button>
                </div>
            }
        >
            {listFor !== 'EXPENSE' ? (
                <>
                    <Dropdown
                        divClasses='w-full'
                        label='Raw Product'
                        name='raw_product_id'
                        options={productOptions}
                        required={true}
                        value={formData.raw_product_id}
                        isDisabled={listFor === 'GOOD_RECEIVE_NOTE'}
                        onChange={(e) => setFormData({ ...formData, raw_product_id: e.value })}
                    />
                    <Dropdown
                        divClasses='w-full'
                        label='Unit'
                        name='unit_id'
                        options={unitOptions}
                        required={true}
                        value={formData.unit_id}
                        isDisabled={true}
                        onChange={(e) => setFormData({ ...formData, unit_id: e.value })}
                    />
                    <Input
                        label='Quantity'
                        type='number'
                        name='quantity'
                        value={formData.quantity}
                        onChange={(e) => setFormData({ ...formData, quantity: parseFloat(e.target.value) })}
                        isMasked={false}
                        disabled={listFor === 'GOOD_RECEIVE_NOTE' || listFor === 'FILLING'}
                    />
                </>
            ) : (
                <>
                    <Input
                        label='Item Name'
                        type='text'
                        name='item_name'
                        value={formData.item_name}
                        onChange={(e) => setFormData({ ...formData, item_name: e.target.value })}
                        isMasked={false}
                    />
                    <Dropdown
                        divClasses='w-full'
                        label='Account Type'
                        name='account_type'
                        options={accounts}
                        required={true}
                        value={formData.account_type}
                        onChange={(e) => setFormData({ ...formData, account_type: e.value })}
                    />
                    <Dropdown
                        divClasses='w-full'
                        label='Account'
                        name='account_id'
                        options={accounts}
                        required={true}
                        value={formData.account_id}
                        onChange={(e) => setFormData({ ...formData, account_id: e.value })}
                    />
                    <Input
                        label='Quantity'
                        type='number'
                        name='quantity'
                        value={formData.quantity}
                        onChange={(e) => setFormData({ ...formData, quantity: parseFloat(e.target.value) })}
                        isMasked={false}
                    />
                    <Input
                        label='Amount'
                        type='number'
                        name='amount'
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                        isMasked={false}
                    />
                    <Input
                        label='Sub Total'
                        type='number'
                        name='sub_total'
                        value={formData.sub_total?.toFixed(2)}
                        onChange={(e) => setFormData({ ...formData, sub_total: parseFloat(e.target.value) })}
                        isMasked={false}
                        disabled={true}
                    />
                </>
            )}

            {listFor === 'FILLING' && (
                <>
                    <Input
                        label='Capacity (KG)'
                        type='number'
                        name='capacity'
                        value={formData.capacity}
                        onChange={(e) => setFormData({ ...formData, capacity: parseFloat(e.target.value) })}
                        isMasked={false}
                    />
                    <Input
                        divClasses="w-full"
                        label='Required Qty'
                        type='number'
                        name='required_quantity'
                        value={formData.required_quantity}
                        onChange={(e) => setFormData({ ...formData, required_quantity: parseFloat(e.target.value) })}
                        isMasked={false}
                    />
                    <div className="flex justify-start items-start gap-1 flex-col w-full">
                        <Input
                            divClasses='w-full'
                            label='Filling (KG)'
                            type='number'
                            name='filling_quantity'
                            value={formData.filling_quantity}
                            onChange={(e) => setFormData({ ...formData, filling_quantity: parseFloat(e.target.value) })}
                            isMasked={false}
                            disabled={true}
                        />
                        <small>Remaining: {Number(fillingRemaining) - formData.filling_quantity}</small>
                    </div>
                </>
            )}
            {listFor === 'GOOD_RECEIVE_NOTE' && (
                <Input
                    label='Received Quantity'
                    type='number'
                    name='received_quantity'
                    value={formData.received_quantity}
                    onChange={(e) => setFormData({ ...formData, received_quantity: parseFloat(e.target.value) })}
                    isMasked={false}
                />
            )}
            {(listFor === 'PRODUCT_ASSEMBLY' || listFor === 'PRODUCTION' || listFor === 'PURCHASE_REQUISITION' || listFor === 'GOOD_RECEIVE_NOTE') && (
                <>
                    <Input
                        label={'Unit Cost'}
                        type='number'
                        name='unit_price'
                        value={formData.unit_price}
                        onChange={(e) => setFormData({ ...formData, unit_price: parseFloat(e.target.value) })}
                        isMasked={false}
                        disabled={false}
                    />
                    <Input
                        label='Sub Total'
                        type='number'
                        name='sub_total'
                        value={formData.sub_total?.toFixed(2)}
                        onChange={(e) => setFormData({ ...formData, sub_total: parseFloat(e.target.value) })}
                        isMasked={false}
                        disabled={true}
                    />
                </>
            )}
            {(listFor === 'LOCAL_PURCHASE_ORDER' || listFor === 'GOOD_RECEIVE_NOTE' || listFor === 'EXPENSE') && (
                <>
                    <Dropdown
                        divClasses='w-full'
                        label='Tax Category'
                        name='tax_category_id'
                        options={taxCategoryOptions}
                        value={formData.tax_category_id}
                        isDisabled={listFor === 'GOOD_RECEIVE_NOTE'}
                        onChange={(e) => setFormData({ ...formData, tax_category_id: e.value })}
                        required={true}
                    />
                    <Input
                        label='Tax Rate'
                        type='number'
                        name='tax_rate'
                        value={formData.tax_rate}
                        onChange={(e) => setFormData({ ...formData, tax_rate: parseFloat(e.target.value) })}
                        isMasked={false}
                        disabled={listFor === 'GOOD_RECEIVE_NOTE'}
                    />
                    <Input
                        label='Tax Amount'
                        type='number'
                        name='tax_amount'
                        value={formData.tax_amount?.toFixed(2)}
                        onChange={(e) => setFormData({ ...formData, tax_amount: parseFloat(e.target.value) })}
                        isMasked={false}
                    />
                    <Dropdown
                        divClasses='w-full'
                        label='Discount Type'
                        name='discount_type'
                        options={[{ label: 'Percentage', value: 'percentage' }, { label: 'Fixed', value: 'fixed' }]}
                        value={formData.discount_type}
                        onChange={(e) => setFormData({ ...formData, discount_type: e.value })}
                    />
                    <Input
                        label='Discount Rate/Amount'
                        type='number'
                        name='discount_amount_rate'
                        value={formData.discount_amount_rate?.toFixed(2)}
                        onChange={(e) => setFormData({ ...formData, discount_amount_rate: parseFloat(e.target.value) })}
                        isMasked={false}
                    />
                    <Input
                        label='Grand Total'
                        type='number'
                        name='grand_total'
                        value={formData.grand_total?.toFixed(2)}
                        onChange={(e) => setFormData({ ...formData, grand_total: parseFloat(e.target.value) })}
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
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
        </Modal>
    );
};

export default CommissionsFormModal;
