import React, {Fragment, useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {IRootState} from "@/store";
import {generateCode} from "@/store/slices/utilSlice";
import {ThunkDispatch} from "redux-thunk";
import {AnyAction} from "redux";
import {clearUnitState, getUnitStatuses} from "@/store/slices/unitSlice";
import Modal from "@/components/Modal";
interface IProps {
    modalOpen: boolean;
    setModalOpen: (value: boolean) => void;
    handleSubmit: (value: any) => void;
    modalFormData?: any;
}

const UnitFormModal = ({modalOpen, setModalOpen, handleSubmit, modalFormData}: IProps) => {
    const dispatch = useDispatch<ThunkDispatch<IRootState, any, AnyAction>>();
    const [name, setName] = useState<string>('');
    const [shortName, setShortName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const {loading, statuses} = useSelector((state: IRootState) => state.unit);


    useEffect(() => {
        if (modalOpen) {
            console.log("hello");
            
            setName('');
            setShortName('');
            setDescription('');        
            dispatch(clearUnitState());  
            if (Object.keys(modalFormData).length>0){
                setName(modalFormData.name);
                setShortName(modalFormData.shortname)
                setDescription(modalFormData.description);
            }
        }
    }, [modalOpen]);
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
                            name,
                            description,
                            short_name: shortName,
                        })}>
                    {Object.keys(modalFormData).length>0 ? 'Update' : 'Add'}

                </button>
            </div>}
        >            
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