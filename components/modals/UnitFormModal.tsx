import React, {Fragment, useEffect, useState} from 'react';
import {Dialog, Transition} from "@headlessui/react";
import ImageUploader from "@/components/form/ImageUploader";
import {useDispatch, useSelector} from "react-redux";
import {IRootState} from "@/store";
import {generateCode} from "@/store/slices/utilSlice";
import {FORM_CODE_TYPE} from "@/utils/enums";
import {ThunkDispatch} from "redux-thunk";
import {AnyAction} from "redux";
import {clearUnitState, getUnitStatuses} from "@/store/slices/unitSlice";
import Select from "react-select";
import Modal from "@/components/Modal";
import { log } from 'console';

interface IProps {
    modalOpen: boolean;
    setModalOpen: (value: boolean) => void;
    handleSubmit: (value: any) => void;
    modalFormData?: any;
}

const UnitFormModal = ({modalOpen, setModalOpen, handleSubmit, modalFormData}: IProps) => {
    const dispatch = useDispatch<ThunkDispatch<IRootState, any, AnyAction>>();
    const [unitCode, setUnitCode] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [shortName, setShortName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [status, setStatus] = useState<string>('');
    const [statusOptions, setStatusOptions] = useState<any[]>([]);
    const [selectedStatus, setSelectedStatus] = useState<any>({});
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState('')
    const {code} = useSelector((state: IRootState) => state.util);
    const {loading, statuses} = useSelector((state: IRootState) => state.unit);


    useEffect(() => {
        if (modalOpen) {
            console.log("hello");
            
            setName('');
            setShortName('');
            setDescription('');
            setStatus('')          
            setSelectedStatus({})
            dispatch(clearUnitState());   
            dispatch(getUnitStatuses());
            if (Object.keys(modalFormData).length>0){
                setName(modalFormData.name);
                setShortName(modalFormData.shortname)
                setDescription(modalFormData.description);
                setStatus(modalFormData.status);
            }else{
                dispatch(generateCode(FORM_CODE_TYPE.UNIT));
                
            }
        }
    }, [modalOpen]);

    const FORM_CODE_TYPE = {
        UNIT: 'UNIT',
        // Other properties...
    };
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
            title={Object.keys(modalFormData).length>0 ? 'Update Unit': 'Add Unit'}
            footer={<div className="mt-8 flex items-center justify-end">
                <button type="button" className="btn btn-outline-danger"
                        onClick={() => setModalOpen(false)}>
                    Discard
                </button>
                <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4"
                        disabled={loading}
                        onClick={() => handleSubmit({
                            code: unitCode,
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
                    label="Unit Image (optional)"
                    existingImage={imagePreview}
                />
            </div>
            <div className="w-full">
                <label htmlFor="status">Unit Condition</label>
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
                <label htmlFor="name">Unit Name</label>
                <input
                    type="text"
                    name="name"
                    id="name"
                    className="form-input"
                    placeholder='Enter unit name'
                    value={name}
                    onChange={e => setName(e.target.value)}
                />
            </div>

            <div className="w-full">
                <label htmlFor="short_name">Unit Short Name</label> {/* Changed 'name' to 'short_name' */}
                <input
                    type="text"
                    name="short_name"
                    id="short_name"
                    className="form-input"
                    placeholder='Enter unit short name'
                    value={shortName}
                    onChange={e => setShortName(e.target.value)}
                />
            </div>
            <div className="w-full">
                <label htmlFor="description">Description (Optional)</label>
                <textarea
                    name="description"
                    id="description"
                    className="form-input"
                    placeholder='unit type description'
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                ></textarea>
            </div>
        </Modal>
    );
};

export default UnitFormModal;