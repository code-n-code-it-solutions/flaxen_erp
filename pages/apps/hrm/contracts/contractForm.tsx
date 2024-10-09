import React, { useEffect, useState } from 'react';
import ImageUploader from '@/components/form/ImageUploader';
import { useAppDispatch, useAppSelector } from '@/store';
import { useRouter } from 'next/router';
import { storeContract } from '@/store/slices/contractSlice';
import { Input } from '@/components/form/Input';
import { Dropdown } from '@/components/form/Dropdown';
import Button from '@/components/Button';
import Alert from '@/components/Alert';

const ContractEmployeeForm = ({ id }: { id?: any }) => {
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
        dispatch(storeContract(formData));
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
                    label="Contract Code"
                    type="number"
                    name="contract_code"
                    value={formData.contract_code}
                    onChange={(e) => handleChange(e.target.name, e.target.value, true)}
                    disabled={true}
                    required={true}
                />
                <Dropdown
                    divClasses="w-full md:w-1/2"
                    label="Template"
                    name="template"
                    options={[]} // Add your options here
                    value={formData.template}
                    onChange={(e) => handleChange('template', e, true)}
                    required={true}
                    errorMessage={errorMessages.template}
                />
                <Input
                    divClasses="w-full md:w-1/2"
                    label="Contract Date"
                    type="date"
                    name="contract_date"
                    value={formData.contract_date}
                    onChange={(e) => handleChange(e.target.name, e.target.value, true)}
                    required={true}
                    errorMessage={errorMessages.contract_date}
                />
                <Input
                    divClasses="w-full md:w-1/2"
                    label="Start Date"
                    type="date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={(e) => handleChange(e.target.name, e.target.value, true)}
                    required={true}
                    errorMessage={errorMessages.start_date}
                />
                <Input
                    divClasses="w-full md:w-1/2"
                    label="End Date"
                    type="date"
                    name="end_date"
                    value={formData.end_date}
                    onChange={(e) => handleChange(e.target.name, e.target.value, true)}
                    required={true}
                    errorMessage={errorMessages.end_date}
                />
                <Dropdown
                    divClasses="w-full md:w-1/2"
                    label="Contract Type"
                    name="contract_type"
                    options={[
                        { value: 'permanent', label: 'Permanent' },
                        { value: 'temporary', label: 'Temporary' },
                        { value: 'contractual', label: 'Contractual' },
                        { value: 'internship', label: 'Internship' }
                    ]}
                    value={formData.contract_type}
                    onChange={(e) => handleChange('contract_type', e, true)}
                    required={true}
                    errorMessage={errorMessages.contract_type}
                />
                <Dropdown
                    divClasses="w-full md:w-1/2"
                    label="Status"
                    name="status"
                    options={[
                        { value: 'pending', label: 'Pending' },
                        { value: 'approved', label: 'Approved' },
                        { value: 'rejected', label: 'Rejected' }
                    ]}
                    value={formData.status}
                    onChange={(e) => handleChange('status', e, true)}
                    required={true}
                    errorMessage={errorMessages.status}
                />
                <Input
                    divClasses="w-full md:w-1/2"
                    label="Remarks"
                    type="textarea"
                    name="remarks"
                    value={formData.remarks}
                    onChange={(e) => handleChange(e.target.name, e.target.value, false)}
                    required={false}
                    errorMessage={errorMessages.remarks}
                />
                <Button
                    type="button"  // Correct usage
                    text="Save"
                    variant="primary"  // Correct usage
                    onClick={handleSave}
                />
            </div>
        </form>
    );
};

export default ContractEmployeeForm;
