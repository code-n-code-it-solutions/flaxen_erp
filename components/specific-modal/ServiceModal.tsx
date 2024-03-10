import React, {Fragment, useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {IRootState} from "@/store";
import {clearUtilState, generateCode} from "@/store/slices/utilSlice";
import {ButtonType, ButtonVariant, FORM_CODE_TYPE, IconType, RAW_PRODUCT_LIST_TYPE} from "@/utils/enums";
import {ThunkDispatch} from "redux-thunk";
import {AnyAction} from "redux";
import {getAssets, storeAssets} from "@/store/slices/assetSlice";
import AssetFormModal from "@/components/specific-modal/AssetFormModal";
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
    }

    useEffect(() => {
        if (modalOpen) {
            setFormData(detail ? detail : {});
            setAssetModalOpen(false)
            dispatch(generateCode(FORM_CODE_TYPE.SERVICE));
            dispatch(getAssets());
            if (RAW_PRODUCT_LIST_TYPE.LOCAL_PURCHASE_ORDER) {
                dispatch(getTaxCategories())
            }
        }
    }, [modalOpen]);

    useEffect(() => {
        setFormData((prev: any) => ({
            ...prev,
            service_code: code[FORM_CODE_TYPE?.SERVICE]
        }));
    }, [code]);

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
                label='Service Code'
                type='text'
                name='service_code'
                value={formData.service_code}
                onChange={(e) => handleChange(e.target.name, e.target.value)}
                isMasked={false}
                disabled={true}
                placeholder='Service Code'
            />

            <Input
                divClasses='w-full'
                label='Service Name'
                type='text'
                name='name'
                value={formData.service_code}
                onChange={(e) => handleChange(e.target.name, e.target.value)}
                isMasked={false}
                placeholder='Enter service name'
            />

            <Input
                divClasses='w-full'
                label='Estimated Cost'
                type='text'
                name='estimated_cost'
                value={formData.estimated_cost}
                onChange={(e) => handleChange(e.target.name, e.target.value)}
                isMasked={false}
                placeholder='Estimated Cost'
            />

            {(listFor === RAW_PRODUCT_LIST_TYPE.PRODUCT_ASSEMBLY || listFor === RAW_PRODUCT_LIST_TYPE.PRODUCTION || listFor === RAW_PRODUCT_LIST_TYPE.PURCHASE_REQUISITION) && (
                <>
                    <Input
                        label='Unit Cost'
                        type='number'
                        name='unit_price'
                        value={formData.unit_price}
                        onChange={(e) => handleChange('unit_price', parseFloat(e.target.value))}
                        isMasked={false}
                    />

                    <Input
                        label='Total'
                        type='number'
                        name='total'
                        value={formData.total?.toFixed(2)}
                        disabled={true}
                        onChange={(e) => handleChange('total', parseFloat(e.target.value))}
                        isMasked={false}
                    />

                    <Textarea
                        label='Description'
                        name='description'
                        value={formData.description}
                        isReactQuill={false}
                        onChange={(e) => handleChange('description', e.target.value)}
                    />
                </>
            )}
            <AssetFormModal
                modalOpen={assetModalOpen}
                setModalOpen={setAssetModalOpen}
                handleSubmit={(val) => handleAssetSubmit(val)}
            />
        </Modal>
    );
};

export default ServiceModal;
