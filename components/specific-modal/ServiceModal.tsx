import React, {Fragment, useEffect, useState} from 'react';
import {Dialog, Transition} from "@headlessui/react";
import ImageUploader from "@/components/form/ImageUploader";
import {useDispatch, useSelector} from "react-redux";
import {IRootState} from "@/store";
import {clearUtilState, generateCode} from "@/store/slices/utilSlice";
import {FORM_CODE_TYPE} from "@/utils/enums";
import {ThunkDispatch} from "redux-thunk";
import {AnyAction} from "redux";
import Select from "react-select";
import {getAssets, storeAssets} from "@/store/slices/assetSlice";
import AssetFormModal from "@/components/specific-modal/AssetFormModal";
import Modal from "@/components/Modal";

interface IProps {
    modalOpen: boolean;
    setModalOpen: (value: boolean) => void;
    handleSubmit: (value: any) => void;
    modalFormData?: any;
}

const ServiceModal = ({modalOpen, setModalOpen, handleSubmit, modalFormData}: IProps) => {
    const dispatch = useDispatch<ThunkDispatch<IRootState, any, AnyAction>>();
    const [serviceCode, setServiceCode] = useState<string>('');
    const [assetId, setAssetId] = useState<number>(0);
    const [name, setName] = useState<string>('');
    const [estimatedCost, setEstimatedCost] = useState<number>(0);
    const [description, setDescription] = useState<string>('');
    const [assetOptions, setAssetOptions] = useState<any[]>([]);
    const [assetModalOpen, setAssetModalOpen] = useState<boolean>(false);
    const {code} = useSelector((state: IRootState) => state.util);
    const {assets, asset, loading, success} = useSelector((state: IRootState) => state.asset);

    const handleAssetSubmit = (val: any) => {
        dispatch(storeAssets(val));

    }
    useEffect(() => {
        if (modalOpen) {
            setName('');
            setDescription('');
            setEstimatedCost(0)
            setAssetId(0)
            setAssetModalOpen(false)
            dispatch(generateCode(FORM_CODE_TYPE.SERVICE));
            dispatch(getAssets());
        }
    }, [modalOpen]);

    useEffect(() => {
        setServiceCode(code[FORM_CODE_TYPE?.SERVICE]);
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
                        onClick={() => handleSubmit({
                            service_code: serviceCode,
                            name,
                            description,
                            estimated_cost: estimatedCost,
                            asset_id: assetId
                        })}
                    >
                        {modalFormData ? 'Update' : 'Add'}
                    </button>
                </div>
            }
        >
            <div className="w-full flex justify-between items-end">
                <div className="w-full">
                    <label htmlFor="asset_id">Assets</label>
                    <Select
                        defaultValue={assetOptions[0]}
                        options={assetOptions}
                        isSearchable={true}
                        isClearable={true}
                        placeholder={'Select Asset'}
                        onChange={(e: any) => setAssetId(e && typeof e !== 'undefined' ? e.value : 0)}
                    />
                </div>
                <button className="btn btn-primary btn-sm flex justify-center items-center"
                        onClick={() => setAssetModalOpen(true)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                         viewBox="0 0 24 24"
                         className="h-5 w-5 ltr:mr-2 rtl:ml-2"
                         fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
                        <path d="M15 12L12 12M12 12L9 12M12 12L12 9M12 12L12 15"
                              stroke="currentColor"
                              strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                </button>
            </div>
            <div className="w-full">
                <label htmlFor="service_code">Service Code</label>
                <input
                    type="text"
                    name="service_code"
                    id="service_code"
                    className="form-input"
                    placeholder='Service Code'
                    value={serviceCode}
                    disabled={true}
                    onChange={e => setServiceCode(e.target.value)}
                />
            </div>
            <div className="w-full">
                <label htmlFor="name">Service Name</label>
                <input
                    type="text"
                    name="name"
                    id="name"
                    className="form-input"
                    placeholder='Enter service name'
                    value={name}
                    onChange={e => setName(e.target.value)}
                />
            </div>
            <div className="w-full">
                <label htmlFor="estimated_cost">Estimated Cost</label>
                <input
                    type="number"
                    name="estimated_cost"
                    id="estimated_cost"
                    className="form-input"
                    placeholder='Estimated Cost'
                    value={estimatedCost}
                    onChange={e => setEstimatedCost(e.target.valueAsNumber)}
                />
            </div>
            <div className="w-full">
                <label htmlFor="description">Description (Optional)</label>
                <textarea
                    name="description"
                    id="description"
                    className="form-input"
                    placeholder='Service description'
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                ></textarea>
            </div>
            <AssetFormModal
                modalOpen={assetModalOpen}
                setModalOpen={setAssetModalOpen}
                handleSubmit={(val) => handleAssetSubmit(val)}
            />
        </Modal>
    );
};

export default ServiceModal;
