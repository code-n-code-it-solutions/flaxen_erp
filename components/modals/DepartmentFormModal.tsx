import React, {Fragment, useEffect, useState} from 'react';
import {Dialog, Transition} from "@headlessui/react";
import Select from "react-select";
import Modal from "@/components/Modal";
import {Input} from '@/components/form/Input'
import  Alert  from "@/components/Alert";

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
    const [errorMessages, setErrorMessages] = useState({
        name: "This field is required",
    })
    const [isFormValid, setIsFormValid] = useState<boolean>(false);
    const [validationMessage, setValidationMessage] = useState("");

    useEffect(() => {
        if (modalOpen) {
            setName('');
            setParentId(0);
            setDescription('');
            setIsActive(true)
        }
    }, [modalOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value,required,name } = e.target;
        if(name === 'name'){
            setName(value);
        }
        if (required) {
            if (!value) {
                setErrorMessages({ ...errorMessages, [name]: 'This field is required.' });
            } else {
                setErrorMessages({ ...errorMessages, [name]: '' });
            }
        }
    };

    useEffect(() => {
        const isValid = Object.values(errorMessages).some(message => message !== '');
        setIsFormValid(!isValid);
        // console.log('Error Messages:', errorMessages);
        // console.log('isFormValid:', !isValid);
        if(isValid){
            setValidationMessage("Please fill the required field.");
        }
    }, [errorMessages]);

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
                    {isFormValid && <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4"
                            onClick={() => handleAddition({
                                name,
                                parentId,
                                description,
                                isActive
                            })}>
                        {modalFormData ? 'Update' : 'Add'}
                    </button>}
                </div>
            }
        >
            {!isFormValid  && validationMessage &&
               <Alert 
               alertType="error" 
               message={validationMessage} 
               setMessages={setValidationMessage} 
           />}
            <div className="w-full">
                {/* <label htmlFor="name">Department Name</label> */}
                <Input
                    label='Department Name'
                    type="text"
                    name="name"
                    placeholder='Enter department name'
                    value={name}
                    onChange={handleChange}
                    required={true}
                    isMasked={false}
                    errorMessage={errorMessages.name}
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
