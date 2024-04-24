import React, {useEffect, useState} from 'react';
import Modal from "@/components/Modal";
import {Input} from '@/components/form/Input'
import Button from "@/components/Button";
import {ButtonType, ButtonVariant} from "@/utils/enums";
import Textarea from "@/components/form/Textarea";

interface IProps {
    modalOpen: boolean;
    setModalOpen: (value: boolean) => void;
    handleSubmit: (value: any) => void;
    modalFormData?: any;
}

const DocumentFormModal = ({modalOpen, setModalOpen, handleSubmit, modalFormData}: IProps) => {
    const [formData, setFormData] = useState<any>({})
    const [errorMessages, setErrorMessages] = useState<any>({})
    const [isFormValid, setIsFormValid] = useState<boolean>(false);
    const [validationMessage, setValidationMessage] = useState("");
    const [formKey, setFormKey] = useState(Date.now());

    useEffect(() => {
        if (modalOpen) {
            setFormData({document_id: 0})
            setFormKey(Date.now());
        }
    }, [modalOpen]);

    const handleChange = (name: string, value: any, required: boolean) => {
        setFormData((prev: any) => ({...prev, [name]: value}))
        if (required) {
            if (!value) {
                setErrorMessages({...errorMessages, [name]: 'This field is required.'});
            } else {
                setErrorMessages((prev: any) => {
                    delete errorMessages[name]
                    return prev;
                });
            }
        }
    };

    useEffect(() => {
        const isValid = Object.values(errorMessages).some(message => message !== '');
        setIsFormValid(!isValid);
        if (isValid) {
            setValidationMessage("Please fill the required field.");
        }
    }, [errorMessages]);

    return (
        <Modal
            show={modalOpen}
            setShow={setModalOpen}
            title='Add New Document'
            footer={
                <div className="mt-8 gap-3 flex items-center justify-end">
                    <Button
                        type={ButtonType.button}
                        text="Discard"
                        variant={ButtonVariant.secondary}
                        onClick={() => setModalOpen(false)}
                    />

                    {isFormValid && (
                        <Button
                            type={ButtonType.button}
                            text={modalFormData ? 'Update' : 'Add'}
                            variant={ButtonVariant.primary}
                            onClick={() => handleSubmit(formData)}
                        />
                    )}
                </div>
            }
        >
            {/*{!isFormValid && validationMessage &&*/}
            {/*    <Alert*/}
            {/*        alertType="error"*/}
            {/*        message={validationMessage}*/}
            {/*        setMessages={setValidationMessage}*/}
            {/*    />*/}
            {/*}*/}
            <Input
                divClasses={"w-full"}
                className="rtl:file-ml-5 form-input p-0 file:border-0 file:bg-primary/90 file:py-2 file:px-4 file:font-semibold file:text-white file:hover:bg-primary ltr:file:mr-5"
                label="Document"
                type="file"
                name="document"
                placeholder='Select Dcouments'
                onChange={(e) => handleChange(e.target.name, e.target.files ? e.target.files[0] : null, e.target.required)}
                isMasked={false}
                required={true}
                errorMessage={errorMessages?.name}
            />

            <Input
                divClasses="w-full"
                label="Name"
                type="text"
                name="name"
                placeholder='Enter document name'
                value={formData.name}
                onChange={(e) => handleChange(e.target.name, e.target.value, e.target.required)}
                isMasked={false}
                required={true}
                errorMessage={errorMessages?.name}
            />

            <Textarea
                divClasses="w-full"
                label="Description (Optional)"
                name="description"
                placeholder='Document description'
                value={formData.description}
                onChange={(e) => handleChange(e.target.name, e.target.value, e.target.required)}
                isReactQuill={false}
            />
        </Modal>
    );
};

export default DocumentFormModal;
