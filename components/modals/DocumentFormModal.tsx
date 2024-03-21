import React, {Fragment, useEffect, useState} from 'react';
import Modal from "@/components/Modal";
import {Input} from '@/components/form/Input'
import  Alert  from "@/components/Alert";

interface IProps {
    modalOpen: boolean;
    setModalOpen: (value: boolean) => void;
    handleSubmit: (value: any) => void;
    modalFormData?: any;
}

const DocumentFormModal = ({modalOpen, setModalOpen, handleSubmit, modalFormData}: IProps) => {
    const [document, setDocument] = useState<File | null>(null);
    const [name, setName] = useState<string>('');
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
            setDocument(null);
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
            title='Add New Document'
            footer={
                <div className="mt-8 flex items-center justify-end">
                    <button type="button" className="btn btn-outline-danger"
                            onClick={() => setModalOpen(false)}>
                        Discard
                    </button>
                    {isFormValid && <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4"
                            onClick={() => handleSubmit({
                                name,
                                document,
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
                <label htmlFor="document">Document</label>
                <input
                    id="document"
                    type="file"
                    name="document"
                    onChange={(e) => setDocument(e.target.files ? e.target.files[0] : null)}
                    className="rtl:file-ml-5 form-input p-0 file:border-0 file:bg-primary/90 file:py-2 file:px-4 file:font-semibold file:text-white file:hover:bg-primary ltr:file:mr-5"
                    required= {true}
                />
            </div>
            <div className="w-full">
                <label htmlFor="name">Name</label>
                <Input
                    label="Name"
                    type="text"
                    name="name"
                    placeholder='Enter document name'
                    value={name}
                    onChange={handleChange}
                    isMasked={false}
                    required={true}
                    errorMessage={errorMessages?.name}
                />
            </div>
            <div className="w-full">
                <label htmlFor="description">Description (Optional)</label>
                <textarea
                    name="description"
                    id="description"
                    className="form-input"
                    placeholder='Document description'
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                ></textarea>
            </div>
        </Modal>
    );
};

export default DocumentFormModal;
