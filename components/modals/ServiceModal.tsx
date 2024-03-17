import React, {Fragment, useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {IRootState} from "@/store";
import {clearUtilState, generateCode} from "@/store/slices/utilSlice";
import {ButtonType, ButtonVariant, FORM_CODE_TYPE, IconType, RAW_PRODUCT_LIST_TYPE} from "@/utils/enums";
import {ThunkDispatch} from "redux-thunk";
import {AnyAction} from "redux";
import {getAssets, storeAssets} from "@/store/slices/assetSlice";
import AssetFormModal from "@/components/modals/AssetFormModal";
import Modal from "@/components/Modal";
import {getTaxCategories} from "@/store/slices/taxCategorySlice";
import {Input} from "@/components/form/Input";
import Textarea from "@/components/form/Textarea";
import {Dropdown} from "@/components/form/Dropdown";
import Button from "@/components/Button";
import {getIcon} from "@/utils/helper";

interface IProps {
    modalOpen: boolean;
    setModalOpen: (value: boolean) => void;
    handleSubmit: (value: any) => void;
    listFor: RAW_PRODUCT_LIST_TYPE;
    detail?: any;
}

const ServiceModal = ({modalOpen, setModalOpen, handleSubmit, detail, listFor}: IProps) => {
    const dispatch = useDispatch<ThunkDispatch<IRootState, any, AnyAction>>();
    const [formData, setFormData] = useState<any>({})
    const [assetOptions, setAssetOptions] = useState<any[]>([]);
    const [assetModalOpen, setAssetModalOpen] = useState<boolean>(false);
    const [taxCategoryOptions, setTaxCategoryOptions] = useState<any>([]);

    const {code} = useSelector((state: IRootState) => state.util);
    const {assets, asset, loading, success} = useSelector((state: IRootState) => state.asset);
    const {taxCategories} = useSelector((state: IRootState) => state.taxCategory);

    const handleAssetSubmit = (val: any) => {
        dispatch(storeAssets(val));
    }

    const handleChange = (name: string, value: any) => {
        setFormData((prev: any) => ({...prev, [name]: value}));
        if (name == 'asset_id') {
            setFormData((prev: any) => ({
                ...prev,
                cost: 0,
                tax_category_id: 0,
                tax_rate: 0,
                tax_amount: 0,
                grand_total: 0
            }));
        } else if (name === 'cost') {
            setFormData((prev: any) => ({
                ...prev,
                tax_rate: 0,
                tax_amount: 0,
                grand_total: value
            }));
        } else if (name == 'tax_rate') {
            setFormData((prev: any) => ({
                ...prev,
                tax_amount: (formData.cost * value) / 100,
                grand_total: formData.cost + ((formData.cost * value) / 100)
            }));
        }
    }

    useEffect(() => {
        if (modalOpen) {
            setFormData(detail ? detail : {});
            setAssetModalOpen(false)
            // dispatch(generateCode(FORM_CODE_TYPE.SERVICE));
            dispatch(getAssets());
            if (RAW_PRODUCT_LIST_TYPE.LOCAL_PURCHASE_ORDER) {
                dispatch(getTaxCategories())
            }
        }
    }, [modalOpen]);

    useEffect(() => {
        if (assets) {
            setAssetOptions(assets.map((asset: any) => ({
                value: asset.id,
                label: asset.name + ' (' + asset.code + ')'
            })));
        }
    }, [assets]);

    useEffect(() => {
        if (asset && success) {
            setAssetModalOpen(false)
            dispatch(getAssets());
            dispatch(clearUtilState());
            dispatch(generateCode(FORM_CODE_TYPE.SERVICE));

        }
    }, [asset, success]);

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
            title='Add Service'
            footer={
                <div className="mt-8 flex items-center justify-end">
                    <button
                        type="button"
                        className="btn btn-outline-danger"
                        onClick={() => setModalOpen(false)}
                    >
                        Discard
                    </button>
                    <button
                        type="button"
                        className="btn btn-primary ltr:ml-4 rtl:mr-4"
                        onClick={() => handleSubmit(formData)}
                    >
                        {detail ? 'Update' : 'Add'}
                    </button>
                </div>
            }
        >
            <div className="w-full flex justify-between items-end">
                <Dropdown
                    divClasses='w-full'
                    label='Assets'
                    name='asset_id'
                    options={assetOptions}
                    value={formData.asset_id}
                    onChange={(e) => {
                        if (e && typeof e !== 'undefined') {
                            handleChange('asset_id', e.value)
                        } else {
                            handleChange('asset_id', '')
                        }
                    }}
                />
                <Button
                    type={ButtonType.button}
                    text={getIcon(IconType.add)}
                    variant={ButtonVariant.primary}
                    onClick={() => setAssetModalOpen(true)}
                />
            </div>

            <Input
                divClasses='w-full'
                label='Service Name'
                type='text'
                name='service_name'
                value={formData.service_name}
                onChange={(e) => handleChange(e.target.name, e.target.value)}
                isMasked={false}
                placeholder='Enter service name'
            />

            {listFor === RAW_PRODUCT_LIST_TYPE.LOCAL_PURCHASE_ORDER && (
                <>
                    <Input
                        label='Cost'
                        type='number'
                        name='cost'
                        value={formData.unit_price}
                        onChange={(e) => handleChange('cost', parseFloat(e.target.value))}
                        isMasked={false}
                    />
                    <Dropdown
                        divClasses='w-full'
                        label='Tax Category'
                        name='tax_category_id'
                        options={taxCategoryOptions}
                        value={formData.tax_category_id}
                        onChange={(e) => {
                            if (e && typeof e !== 'undefined') {
                                handleChange('tax_category_id', e.value)
                            } else {
                                handleChange('tax_category_id', '')
                            }
                        }}
                    />
                    <Input
                        label='Tax Rate (%)'
                        type='number'
                        name='tax_rate'
                        value={formData.tax_rate}
                        onChange={(e) => handleChange('tax_rate', parseFloat(e.target.value))}
                        isMasked={false}
                    />
                    <Input
                        label='Tax Amount'
                        type='number'
                        name='tax_amount'
                        value={formData.tax_amount}
                        onChange={(e) => handleChange('tax_amount', parseFloat(e.target.value))}
                        isMasked={false}
                        disabled={true}
                    />
                    <Input
                        label='Total'
                        type='number'
                        name='grand_total'
                        value={formData.grand_total}
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
            <AssetFormModal
                modalOpen={assetModalOpen}
                setModalOpen={setAssetModalOpen}
                handleSubmit={(val) => handleAssetSubmit(val)}
            />
        </Modal>
    );
};

export default ServiceModal;
