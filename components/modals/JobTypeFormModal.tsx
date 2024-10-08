import React, { useEffect, useState } from 'react';
import Modal from '@/components/Modal';
import { Input } from '@/components/form/Input';
import Alert from '@/components/Alert';
import { useAppDispatch, useAppSelector } from '@/store';
import Button from '@/components/Button';
import { ButtonType, ButtonVariant } from '@/utils/enums';
import { Dropdown } from '@/components/form/Dropdown';
import Textarea from '@/components/form/Textarea';
import { clearDepartmentState, storeDepartment } from '@/store/slices/departmentSlice';
import Option from '@/components/form/Option';
import Swal from 'sweetalert2';

interface IProps {
    modalOpen: boolean;
    setModalOpen: (value: boolean) => void;
    modalFormData?: any;
    // jobtypes: any[];
}

const JobTypeFormModal = ({ modalOpen, setModalOpen, modalFormData }: IProps) => {
    const dispatch = useAppDispatch();
    const { user, token } = useAppSelector(state => state.user);
    const { department, success, loading } = useAppSelector(state => state.department);

    const [formData, setFormData] = useState<any>({});
    const [errorMessages, setErrorMessages] = useState<any>({});
    const [isFormValid, setIsFormValid] = useState<boolean>(false);
    const [validationMessage, setValidationMessage] = useState('');

    useEffect(() => {
        if (modalOpen) {
            setFormData({ is_active: 1 });
        }
    }, [modalOpen]);

    const handleChange = (name: string, value: any, required: boolean) => {
        if (name === 'parent_id') {
            if (value && typeof value !== 'undefined') {
                setFormData({ ...formData, [name]: value.value });
            } else {
                setFormData({ ...formData, [name]: '' });
            }
        } else if (name === 'is_active') {
            setFormData({ ...formData, [name]: value ? 1 : 0 });
        } else {
            setFormData({ ...formData, [name]: value });
        }
        if (required) {
            if (!value) {
                setErrorMessages({ ...errorMessages, [name]: 'This field is required.' });
            } else {
                setErrorMessages((prev: any) => {
                    delete prev[name];
                    return prev;
                });
            }
        }
    };

    const handleSubmit = () => {
        if (!formData.name) {
            Swal.fire('Error', 'Department name is required.', 'error');
        } else {
            dispatch(storeDepartment({
                ...formData,
                company_id: user.company_id,
                branch_id: user.branch_id
            }));
        }
    };

    useEffect(() => {
        const isValid = Object.values(errorMessages).some(message => message !== '');
        setIsFormValid(!isValid);
        if (isValid) {
            setValidationMessage('Please fill the required field.');
        }
    }, [errorMessages]);

    useEffect(() => {
        if (success && department) {
            dispatch(clearDepartmentState());
            setModalOpen(false);
        }
    }, [success, department]);

    return (
        <Modal
            show={modalOpen}
            setShow={setModalOpen}
            title="Add New Job Type"
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
                label="Job Type Code"
                type="text"
                name="code"
                value={formData.code}
                onChange={(e) => handleChange(e.target.name, e.target.value, e.target.required)}
                disabled={true}
                required={true}
                isMasked={false}
                errorMessage={errorMessages.code}
            />

            <Input
                divClasses="w-full"
                label="Job Type Name"
                type="text"
                name="name"
                value={formData.name}
                onChange={(e) => handleChange(e.target.name, e.target.value, e.target.required)}
                required={true}
                isMasked={false}
                errorMessage={errorMessages.name}
            />

            <Textarea
                divClasses="w-full"
                label="Description (Optional)"
                name="description"
                value={formData.description}
                onChange={(e) => handleChange(e.target.name, e.target.value, e.target.required)}
                isReactQuill={false}
            />

            {/* <Option
                label="Is Active"
                type="checkbox"
                name="is_active"
                value="1"
                defaultChecked={formData.is_active === 1}
                onChange={(e) => handleChange(e.target.name, e.target.checked, e.target.required)}
            /> */}
        </Modal>
    );
};

export default JobTypeFormModal;
