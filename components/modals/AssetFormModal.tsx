import React, {Fragment, useEffect, useState} from 'react';
import {Dialog, Transition} from "@headlessui/react";
import ImageUploader from "@/components/form/ImageUploader";
import {useDispatch, useSelector} from "react-redux";
import {IRootState} from "@/store";
import {generateCode} from "@/store/slices/utilSlice";
import {FORM_CODE_TYPE} from "@/utils/enums";
import {ThunkDispatch} from "redux-thunk";
import {AnyAction} from "redux";
import {clearAssetState, getAssetStatuses} from "@/store/slices/assetSlice";
import Select from "react-select";
import Modal from "@/components/Modal";
import { log } from 'console';

interface IProps {
    modalOpen: boolean;
    setModalOpen: (value: boolean) => void;
    handleSubmit: (value: any) => void;
    modalFormData?: any;
}

const AssetFormModal = ({modalOpen, setModalOpen, handleSubmit, modalFormData}: IProps) => {
    const dispatch = useDispatch<ThunkDispatch<IRootState, any, AnyAction>>();
    const [assetCode, setAssetCode] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [status, setStatus] = useState<string>('');
    const [statusOptions, setStatusOptions] = useState<any[]>([]);
    const [selectedStatus, setSelectedStatus] = useState<any>({});
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState('')
    const {code} = useSelector((state: IRootState) => state.util);
    const {loading, statuses} = useSelector((state: IRootState) => state.asset);

    

    useEffect(() => {
        if (modalOpen) {
            console.log("hello");
            
            setName('');
            setDescription('');
            setStatus('')
            setImage(null);
            setAssetCode('')
            setSelectedStatus({})
            dispatch(clearAssetState());   
            dispatch(getAssetStatuses());
            if (Object.keys(modalFormData).length>0){
                setName(modalFormData.name);
                setDescription(modalFormData.description);
                setStatus(modalFormData.status);
                setAssetCode(modalFormData.code);
                setImagePreview(modalFormData.thumbnail)
            }else{
                dispatch(generateCode(FORM_CODE_TYPE.ASSET));
                setImagePreview(modalFormData.thumbnail)
            }
        }
    }, [modalOpen]);

    useEffect(() => {
        setAssetCode(code[FORM_CODE_TYPE.ASSET]);
    }, [code]);

    useEffect(() => {
        if (statuses) {
            setStatusOptions(statuses.map((status: any) => ({
                value: status,
                label: status.toUpperCase()
            })))
        }
    }, [statuses]);

    return (
        <Modal
            show={modalOpen}
            setShow={setModalOpen}
            title={Object.keys(modalFormData).length>0 ? 'Update Asset': 'Add Asset'}
            footer={<div className="mt-8 flex items-center justify-end">
                <button type="button" className="btn btn-outline-danger"
                        onClick={() => setModalOpen(false)}>
                    Discard
                </button>
                <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4"
                        disabled={loading}
                        onClick={() => handleSubmit({
                            code: assetCode,
                            name,
                            description,
                            image_id: image,
                            status
                        })}>
                    {Object.keys(modalFormData).length>0 ? 'Update' : 'Add'}

                </button>
            </div>}
        >


            <div className="flex justify-center items-center">
                <ImageUploader
                    image={image}
                    setImage={setImage}
                    label="Asset Image (optional)"
                    existingImage={imagePreview}
                />
            </div>
            <div className="w-full">
                <label htmlFor="status">Assets Condition</label>
                <Select
                    defaultValue={statusOptions[0]}
                    value={selectedStatus}
                    options={statusOptions}
                    isSearchable={true}
                    isClearable={true}
                    placeholder={'Select Status'}
                    onChange={(e: any) => {
                        setStatus(e && typeof e !== 'undefined' ? e.value : 0)
                        setSelectedStatus(e)
                    }}
                />
            </div>
            <div className="w-full">
                <label htmlFor="code">Asset Code</label>
                <input
                    type="text"
                    name="code"
                    id="code"
                    className="form-input"
                    placeholder='Asset Code'
                    value={assetCode}
                    disabled={true}
                    onChange={e => setAssetCode(e.target.value)}
                />
            </div>
            <div className="w-full">
                <label htmlFor="name">Asset Name</label>
                <input
                    type="text"
                    name="name"
                    id="name"
                    className="form-input"
                    placeholder='Enter asset name'
                    value={name}
                    onChange={e => setName(e.target.value)}
                />
            </div>
            <div className="w-full">
                <label htmlFor="description">Description (Optional)</label>
                <textarea
                    name="description"
                    id="description"
                    className="form-input"
                    placeholder='Asset type description'
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                ></textarea>
            </div>
        </Modal>
    );
};

export default AssetFormModal;