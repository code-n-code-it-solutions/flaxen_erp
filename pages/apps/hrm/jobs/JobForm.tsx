import React, { useEffect, useState } from 'react';
import ImageUploader from '@/components/form/ImageUploader';
import { useAppDispatch, useAppSelector } from '@/store';
import { useRouter } from 'next/router';
import storeSlice from '@/store/slices/jobSlice';
import { Input } from '@/components/form/Input';
import { Dropdown } from '@/components/form/Dropdown';
import Button from '@/components/Button';
import Alert from '@/components/Alert';

const JobForm = ({ id }: { id?: any }) => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { employeeDetail, loading, success } = useAppSelector((state) => state.employee);
    const [image, setImage] = useState<File | null>(null);
    const [isFormValid, setIsFormValid] = useState<boolean>(false);
    const [validationMessage, setValidationMessage] = useState('');
    const [errorMessages, setErrorMessages] = useState<Record<string, string>>({});
    const [formData, setFormData] = useState<any>({});

    const handleChange = (name: string, value: any, required: boolean) => {
        if (required && !value) {
            setErrorMessages({ ...errorMessages, [name]: 'This field is required.' });
        } else {
            setErrorMessages((prev: Record<string, string>) => {
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
        dispatch(storeSlice(formData)); // Keep the same save logic for the job form.
    };

    useEffect(() => {
        const isValid = Object.values(errorMessages).every(message => message === '');
        setIsFormValid(isValid);
        if (!isValid) {
            setValidationMessage('Please fill all the required fields.');
        }
    }, [errorMessages]);

    return (
        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div className="flex justify-center items-center">
                <ImageUploader image={image} setImage={setImage} />
            </div>
            {!isFormValid && validationMessage &&
                <Alert
                    alertType="error"
                    message={validationMessage}
                    setMessages={setValidationMessage}
                />}
            <div className="flex justify-start flex-col items-start space-y-3">
                <Input
                    divClasses="w-full md:w-1/3"
                    label="Job Code"
                    type="number"
                    name="job_code"
                    value={formData.job_code}
                    onChange={(e) => handleChange(e.target.name, e.target.value, true)}
                    disabled={true}
                    required={true}
                />
                <Input
                    divClasses="w-full md:w-1/2"
                    label="Job Title"
                    type="text"
                    name="job_title"
                    value={formData.job_title}
                    onChange={(e) => handleChange(e.target.name, e.target.value, true)}
                    required={true}
                    errorMessage={errorMessages.job_title}
                />
                <Dropdown
                    divClasses="w-full md:w-1/2"
                    label="Job Type"
                    name="job_type"
                    options={[
                        { value: 'full_time', label: 'Full Time' },
                        { value: 'contract', label: 'Contract' }
                    ]}
                    value={formData.job_type}
                    onChange={(e) => handleChange('job_type', e, true)}
                    required={true}
                    errorMessage={errorMessages.job_type}
                />
                <Dropdown
                    divClasses="w-full md:w-1/2"
                    label="Job Nature"
                    name="job_nature"
                    options={[
                        { value: 'hybrid', label: 'Hybrid' },
                        { value: 'remote', label: 'Remote' },
                        { value: 'onsite', label: 'Onsite' }
                    ]}
                    value={formData.job_nature}
                    onChange={(e) => handleChange('job_nature', e, true)}
                    required={true}
                    errorMessage={errorMessages.job_nature}
                />
                <Input
                    divClasses="w-full md:w-1/2"
                    label="Job Deadline"
                    type="date"
                    name="job_deadline"
                    value={formData.job_deadline}
                    onChange={(e) => handleChange(e.target.name, e.target.value, true)}
                    required={true}
                    errorMessage={errorMessages.job_deadline}
                />
                <Dropdown
                    divClasses="w-full md:w-1/2"
                    label="Job Status"
                    name="job_status"
                    options={[
                        { value: 'draft', label: 'Draft' },
                        { value: 'publish', label: 'Publish' },
                        { value: 'closed', label: 'Closed' },
                        { value: 'postponed', label: 'Postponed' }
                    ]}
                    value={formData.job_status}
                    onChange={(e) => handleChange('job_status', e, true)}
                    required={true}
                    errorMessage={errorMessages.job_status}
                />
                <Input
                    divClasses="w-full md:w-1/2"
                    label="Job Short Description"
                    type="textarea"
                    name="job_short_description"
                    value={formData.job_short_description}
                    onChange={(e) => handleChange(e.target.name, e.target.value, true)}
                    required={true}
                    errorMessage={errorMessages.job_short_description}
                />
                <Dropdown
                    divClasses="w-full md:w-1/2"
                    label="Job Skills"
                    name="job_skills"
                    options={[
                        { value: 'php', label: 'PHP' },
                        { value: 'javascript', label: 'JavaScript' },
                        // Add other skills as needed
                    ]}
                    value={formData.job_skills}
                    onChange={(e) => handleChange('job_skills', e, true)}
                    required={true}
                    errorMessage={errorMessages.job_skills}
                />
                <Input
                    divClasses="w-full md:w-1/2"
                    label="Job Long Description"
                    type="textarea"
                    name="job_long_description"
                    value={formData.job_long_description}
                    onChange={(e) => handleChange(e.target.name, e.target.value, false)}
                    required={false}
                    errorMessage={errorMessages.job_long_description}
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

export default JobForm;
