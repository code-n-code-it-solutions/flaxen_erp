import React, {useEffect, useState} from 'react';
import Modal from "@/components/Modal";
import {Input} from '@/components/form/Input'
import Alert from "@/components/Alert";
import {Dropdown} from "@/components/form/Dropdown";
import Button from "@/components/Button";
import {ButtonType, ButtonVariant} from "@/utils/enums";
import Textarea from "@/components/form/Textarea";
import Option from "@/components/form/Option";
import {clearDesignationState, storeDesignation} from "@/store/slices/designationSlice";
import {useAppDispatch, useAppSelector} from "@/store";

interface IProps {
    modalOpen: boolean;
    setModalOpen: (value: boolean) => void;
    departments: any[];
    modalFormData?: any;
}

const DesignationFormModal = ({modalOpen, setModalOpen, modalFormData, departments}: IProps) => {
    const dispatch = useAppDispatch()
    const {designation, loading, success} = useAppSelector((state) => state.designation);
    const [formData, setFormData] = useState<any>({})
    const [errorMessages, setErrorMessages] = useState<any>({})
    const [isFormValid, setIsFormValid] = useState<boolean>(false);
    const [validationMessage, setValidationMessage] = useState("");

    useEffect(() => {
        if (modalOpen) {
            setValidationMessage("")
            setFormData({is_active: 1})
        }
    }, [modalOpen]);

    const handleChange = (name: string, value: any, required: boolean) => {
        if (name === 'department_id') {
            if (value && typeof value !== 'undefined') {
                setFormData({...formData, [name]: value.value})
            } else {
                setFormData({...formData, [name]: ''})
            }
        } else if (name === 'is_active') {
            setFormData({...formData, [name]: value ? 1 : 0})
        } else {
            setFormData({...formData, [name]: value})
        }
        if (required) {
            console.log(value)
            if (!value) {
                setErrorMessages({...errorMessages, [name]: 'This field is required.'});
            } else {
                setErrorMessages((prev: any) => {
                    delete prev[name];
                    return prev;
                })
            }
        }
    };

    const handleSubmit = () => {
        if (isFormValid) {
            dispatch(storeDesignation(formData))
        } else {
            setValidationMessage("Please fill the required field.");
        }
    }

    useEffect(() => {
        const isValid = Object.values(errorMessages).some(message => message !== '');
        setIsFormValid(!isValid);
        if (isValid) {
            setValidationMessage("Please fill the required field.");
        }
        console.log(isValid, errorMessages)
    }, [errorMessages]);

    useEffect(() => {
        if (designation && success) {
            dispatch(clearDesignationState())
            setModalOpen(false)
        }
    }, [success, designation]);

    return (
        <Modal
            show={modalOpen}
            setShow={setModalOpen}
            title='Add New Designation'
            footer={
                <div className="mt-8 flex items-center gap-3 justify-end">
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
                    {/*{isFormValid && (*/}
                    {/*    <Button*/}
                    {/*        type={ButtonType.button}*/}
                    {/*        text={modalFormData ? 'Update' : 'Add'}*/}
                    {/*        variant={ButtonVariant.primary}*/}
                    {/*        onClick={() => handleSubmit()}*/}
                    {/*    />*/}
                    {/*)}*/}
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

            <Input
                divClasses="w-full"
                label='Designation Name'
                type="text"
                name="name"
                placeholder='Enter designation name'
                value={formData.name}
                onChange={(e) => handleChange(e.target.name, e.target.value, e.target.required)}
                required={true}
                isMasked={false}
                errorMessage={errorMessages.name}
            />

            <Dropdown
                label="Department"
                name='department_id'
                options={departments}
                value={formData.department_id}
                onChange={(e) => handleChange('department_id', e, true)}
                required={true}
                errorMessage={errorMessages.department_id}
            />

            <Textarea
                label="Description"
                name="description"
                placeholder='Department description'
                value={formData.description}
                onChange={(e) => handleChange(e.target.name, e.target.value, e.target.required)}
                isReactQuill={false}
            />

            <div className="flex gap-3 items-center justify-start w-full">
                <Option
                    label="Is Final Approval"
                    type="checkbox"
                    name="is_final_approver"
                    value={formData.is_final_approver}
                    defaultChecked={false}
                    onChange={(e) => handleChange(e.target.name, e.target.checked, e.target.required)}
                />
                <Option
                    label="Is Active"
                    type="checkbox"
                    name="is_active"
                    value={formData.is_active}
                    defaultChecked={true}
                    onChange={(e) => handleChange(e.target.name, e.target.checked, e.target.required)}
                />
            </div>
        </Modal>
    );
};

export default DesignationFormModal;
