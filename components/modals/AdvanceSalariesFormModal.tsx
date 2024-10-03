import React, { useState, useEffect } from 'react';
import { Modal, Form, Select } from 'antd';
import { useSelector } from 'react-redux';
import { IRootState } from '@/store'; // Adjust the import based on your store structure
import { Input } from '@/components/form/Input'; // Adjust the import based on your component structure
import { Dropdown } from '../form/Dropdown';

const { Option } = Select;

const employees = ['Employee 1', 'Employee 2', 'Employee 3']; // Replace with your actual data
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const AdvanceSalariesFormModal = ({ modalOpen, setModalOpen, handleSubmit }: any) => {
    const [form] = Form.useForm();
    const [selectedMonths, setSelectedMonths] = useState<string[]>([]);
    const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
    const { theme } = useSelector((state: IRootState) => state.themeConfig); // Assuming you have a themeConfig slice

    const onFinish = (values: any) => {
        console.log('Form Data:', values); // Log form data to console
        handleSubmit(values);
        form.resetFields();
        setModalOpen(false);
    };

    const handleNumberOfSalariesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        form.setFieldsValue({ number_of_salaries: value, months: [] });
        setSelectedMonths([]);
        form.validateFields(['months']);
    };

    const handleMonthsChange = (value: string[]) => {
        setSelectedMonths(value);
        form.setFieldsValue({ months: value });
        form.validateFields(['months']);
    };

    useEffect(() => {
        if (modalOpen) {
            form.resetFields();
            setSelectedMonths([]);
            setSelectedEmployee(null);
        }
    }, [modalOpen]);

    return (
        <Modal
            title="Add Advance Salary"
            open={modalOpen}
            onCancel={() => setModalOpen(false)}
            footer={
                <div className="mt-8 flex items-center justify-end">
                    <button type="button" className="btn btn-outline-danger" onClick={() => setModalOpen(false)}>
                        Discard
                    </button>
                    <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4" onClick={() => form.submit()}>
                        Add
                    </button>
                </div>
            }
        >
            <Form form={form} layout="vertical" onFinish={onFinish} className="space-y-4" initialValues={{ number_of_salaries: 1 }}>
                <Form.Item name="employee"  rules={[{ required: true, message: 'Please select an employee' }]}>
                    <Dropdown
                        divClasses="w-full"
                        label="Select an employee"
                        name="employee"
                        options={employees.map((employee, index) => ({ label: employee, value: employee }))}
                        required={true}
                        value={selectedEmployee}
                        onChange={(e) => setSelectedEmployee(e ? e.value : null)}
                    />
                </Form.Item>
                <Form.Item
                    name="number_of_salaries"
                   // label="Number of Salaries"
                    rules={[
                        { required: true, message: 'Please enter the number of salaries' },
                        { type: 'number', min: 1, message: 'Must be at least 1' },
                    ]}
                >
                    <Input
                        label="Number of Salaries"
                        required={true}
                        type="number"
                        name="number_of_salaries"
                        onChange={handleNumberOfSalariesChange}
                        //errorMessage={form.getFieldError('number_of_salaries')}
                        isMasked={false}
                    />
                </Form.Item>
                <Form.Item
                   // className="form-label"
                    name="months"
                    label="Months"
                    rules={[
                        {
                            required: true,
                            message: 'Please select the months',
                        },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                const number_of_salaries = getFieldValue('number_of_salaries');
                                if (value && value.length === number_of_salaries) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error(`Please select exactly ${number_of_salaries} month(s)`));
                            },
                        }),
                    ]}
                    validateTrigger={['onChange', 'onBlur']}
                >
                    <Select mode="multiple" placeholder="Select months" value={selectedMonths} onChange={handleMonthsChange} className="w-full">
                        {months.map((month, index) => (
                            <Option key={index} value={month} disabled={selectedMonths.length >= form.getFieldValue('number_of_salaries') && !selectedMonths.includes(month)}>
                                {month}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AdvanceSalariesFormModal;
 