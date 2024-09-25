import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { useRouter } from 'next/router';
import { storeTemplate } from '@/store/slices/templateSlice'; // Adjust this import if needed
import { Input } from '@/components/form/Input';
import { Dropdown } from '@/components/form/Dropdown';
import Button from '@/components/Button';
import Alert from '@/components/Alert';

const TemplateForm = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { loading, success } = useAppSelector((state) => state.employee); // Adjust state slice as necessary
    const [isFormValid, setIsFormValid] = useState<boolean>(false);
    const [validationMessage, setValidationMessage] = useState('');
    const [errorMessages, setErrorMessages] = useState<Record<string, string>>({});
    const [formData, setFormData] = useState<any>({
        template_name: '',
        template_subject: '',
        template_type: '',
        status: '',
        visibility: '',
        description: '',
        template_body: ''
    });

    const handleChange = (name: string, value: any, required: boolean) => {
        if (required && !value) {
            setErrorMessages({ ...errorMessages, [name]: 'This field is required.' });
        } else {
            setErrorMessages((prev) => {
                delete prev[name];
                return { ...prev };
            });
        }
        setFormData({ ...formData, [name]: value });
    };

    const handleSave = () => {
        if (!isFormValid) {
            setValidationMessage('Please fill all the required fields.');
            return;
        }
        dispatch(storeTemplate(formData)); // Adjust action if necessary
    };

    useEffect(() => {
        const isValid = Object.values(errorMessages).some(message => message !== '');
        setIsFormValid(!isValid);
        if (isValid) {
            setValidationMessage('Please fill all the required fields.');
        }
    }, [errorMessages]);

    return (
        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            {!isFormValid && validationMessage &&
                <Alert
                    alertType="error"
                    message={validationMessage}
                    setMessages={setValidationMessage}
                />}
            <div className="flex justify-start flex-col items-start space-y-3">
                <Input
                    divClasses="w-full md:w-1/3"
                    label="Template Code"
                    type="text"
                    name="template_code"
                    value={formData.template_code} // Make sure this is initialized in formData
                    onChange={(e) => handleChange(e.target.name, e.target.value, true)}
                    disabled={true} // Keep this as per your requirement
                    required={true}
                />
                <Input
                    divClasses="w-full md:w-1/2"
                    label="Template Name"
                    type="text"
                    name="template_name"
                    value={formData.template_name}
                    onChange={(e) => handleChange(e.target.name, e.target.value, true)}
                    required={true}
                    errorMessage={errorMessages.template_name}
                />
                <Input
                    divClasses="w-full md:w-1/2"
                    label="Template Subject"
                    type="text"
                    name="template_subject"
                    value={formData.template_subject}
                    onChange={(e) => handleChange(e.target.name, e.target.value, true)}
                    required={true}
                    errorMessage={errorMessages.template_subject}
                />
                <Dropdown
                    divClasses="w-full md:w-1/2"
                    label="Type"
                    name="template_type"
                    options={[
                        { value: 'email', label: 'Email' },
                        { value: 'sms', label: 'SMS' },
                        { value: 'notification', label: 'Notification' },
                        { value: 'contract', label: 'Contract' },
                        { value: 'agreement', label: 'Agreement' }
                    ]}
                    value={formData.template_type}
                    onChange={(e) => handleChange('template_type', e, true)}
                    required={true}
                    errorMessage={errorMessages.template_type}
                />
                <Dropdown
                    divClasses="w-full md:w-1/2"
                    label="Status"
                    name="status"
                    options={[
                        { value: 'active', label: 'Active' },
                        { value: 'inactive', label: 'Inactive' }
                    ]}
                    value={formData.status}
                    onChange={(e) => handleChange('status', e, true)}
                    required={true}
                    errorMessage={errorMessages.status}
                />
                <Dropdown
                    divClasses="w-full md:w-1/2"
                    label="Visibility"
                    name="visibility"
                    options={[
                        { value: 'private', label: 'Private' },
                        { value: 'public', label: 'Public' }
                    ]}
                    value={formData.visibility}
                    onChange={(e) => handleChange('visibility', e, true)}
                    required={true}
                    errorMessage={errorMessages.visibility}
                />
                <Input
                    divClasses="w-full md:w-1/2"
                    label="Description"
                    type="textarea"
                    name="description"
                    value={formData.description}
                    onChange={(e) => handleChange(e.target.name, e.target.value, false)}
                    required={false}
                    errorMessage={errorMessages.description}
                />
                <Input
                    divClasses="w-full md:w-1/2"
                    label="Template Body"
                    type="textarea"
                    name="template_body"
                    value={formData.template_body}
                    onChange={(e) => handleChange(e.target.name, e.target.value, false)}
                    required={false}
                    errorMessage={errorMessages.template_body}
                />
                <Button
                    type="button"
                    text="Save"
                    variant="primary"
                    onClick={handleSave}
                />
            </div>
        </form>
    );
};

export default TemplateForm;
