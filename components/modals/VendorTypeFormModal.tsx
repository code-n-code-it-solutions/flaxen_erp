import React, {useEffect, useState} from 'react';
import Modal from "@/components/Modal";
import {Input} from "@/components/form/Input";
import Alert from "@/components/Alert";
import Button from "@/components/Button";
import {ButtonType, ButtonVariant} from "@/utils/enums";
import {useAppDispatch, useAppSelector} from "@/store";
import {clearVendorTypeState, storeVendorType} from "@/store/slices/vendorTypeSlice";

interface IProps {
    modalOpen: boolean;
    setModalOpen: (value: boolean) => void;
    modalFormData?: any;
}

const VendorTypeFormModal = ({modalOpen, setModalOpen, modalFormData}: IProps) => {
    const dispatch = useAppDispatch()
    const {vendorType, loading, success} = useAppSelector((state) => state.vendorType);
    const [formData, setFormData] = useState<any>({});
    const [errorMessages, setErrorMessages] = useState<any>({})
    const [isFormValid, setIsFormValid] = useState<boolean>(false);
    const [validationMessage, setValidationMessage] = useState("");

    useEffect(() => {
        if (modalOpen) {
            setFormData(modalFormData);
        }
    }, [modalOpen]);

    const handleChange = (name: string, value: any, required: boolean) => {

        setFormData({...formData, [name]: value});

        if (required) {
            if (!value) {
                setErrorMessages({...errorMessages, [name]: 'This field is required.'});
            } else {
                setErrorMessages((prev: any) => {
                    delete prev[name];
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

    const handleSubmit = () => {
        if (modalFormData) {
            // dispatch(updateVendorType(formData));
        } else {
            dispatch(storeVendorType({...formData, is_active: 1}));
        }
    }

    useEffect(() => {
        if (success && vendorType) {
            setModalOpen(false);
            dispatch(clearVendorTypeState());
        }
    }, [success, vendorType]);

    useEffect(() => {
        if (modalFormData) {
            setFormData(modalFormData);
        }
    }, [modalFormData]);

    return (
        <Modal
            show={modalOpen}
            setShow={setModalOpen}
            title='Add Vendor Type'
            footer={
                <div className="mt-8 gap-3 flex items-center justify-end">
                    <Button
                        type={ButtonType.button}
                        text="Discard"
                        variant={ButtonVariant.secondary}
                        onClick={() => setModalOpen(false)}
                    />
                    <Button
                        type={ButtonType.button}
                        text={modalFormData ? 'Update' : 'Add'}
                        variant={ButtonVariant.primary}
                        onClick={() => handleSubmit()}
                    />
                </div>
            }
        >
            {!isFormValid && validationMessage &&
                <Alert
                    alertType="error"
                    message={validationMessage}
                    setMessages={setValidationMessage}
                />
            }
            <div className="w-full">
                {/* <label htmlFor="name">Vendor Type Name</label> */}
                <Input
                    label='Vendor Type Name'
                    type="text"
                    name="name"
                    placeholder='Enter vendor type name'
                    value={formData?.name}
                    onChange={(e) => handleChange(e.target.name, e.target.value, e.target.required)}
                    required={true}
                    isMasked={false}
                    errorMessage={errorMessages.name}
                />
            </div>
            <div className="w-full">
                <label htmlFor="description">Description (Optional)</label>
                <textarea
                    name="description"
                    id="description"
                    className="form-input"
                    placeholder='Vendor type description'
                    value={formData?.description}
                    onChange={(e) => handleChange(e.target.name, e.target.value, e.target.required)}
                ></textarea>
            </div>
        </Modal>
    );
};

export default VendorTypeFormModal;
