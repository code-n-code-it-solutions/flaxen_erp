import React, {Fragment, useEffect, useState} from 'react';
import {Dialog, Transition} from "@headlessui/react";
import Select from "react-select";
import Modal from "@/components/Modal";

interface IProps {
    modalOpen: boolean;
    setModalOpen: (value: boolean) => void;
    handleAddition: (value: any) => void;
    departments: any[];
    modalFormData?: any;
}

const DepartmentFormModal = ({modalOpen, setModalOpen, handleAddition, modalFormData, departments}: IProps) => {
    const [name, setName] = useState<string>('');
    const [parentId, setParentId] = useState<number>(0);
    const [description, setDescription] = useState<string>('');
    const [isActive, setIsActive] = useState<boolean>(true);

    useEffect(() => {
        if (modalOpen) {
            setName('');
            setParentId(0);
            setDescription('');
            setIsActive(true)
        }
    }, [modalOpen]);

    return (
        <Modal
            show={modalOpen}
            setShow={setModalOpen}
            title='Add New Department'
            footer={
                <div className="mt-8 flex items-center justify-end">
                    <button type="button" className="btn btn-outline-danger"
                            onClick={() => setModalOpen(false)}>
                        Discard
                    </button>
                    <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4"
                            onClick={() => handleAddition({
                                name,
                                parentId,
                                description,
                                isActive
                            })}>
                        {modalFormData ? 'Update' : 'Add'}
                    </button>
                </div>
            }
        >
            <div className="w-full">
                <label htmlFor="name">Department Name</label>
                <input
                    type="text"
                    name="name"
                    id="name"
                    className="form-input"
                    placeholder='Enter department name'
                    value={name}
                    onChange={e => setName(e.target.value)}
                />
            </div>
            <div className="w-full">
                <label htmlFor="parent_id">Parent Department (Optional)</label>
                <Select
                    defaultValue={departments[0]}
                    options={departments}
                    isSearchable={true}
                    isClearable={true}
                    placeholder={'Select Parent Department'}
                    onChange={(e: any) => setParentId(e && typeof e !== 'undefined' ? e.value : 0)}
                />
            </div>
            <div className="w-full">
                <label htmlFor="description">Description (Optional)</label>
                <textarea
                    name="description"
                    id="description"
                    className="form-input"
                    placeholder='Department description'
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                ></textarea>
            </div>
        </Modal>
    );
};

export default DepartmentFormModal;
