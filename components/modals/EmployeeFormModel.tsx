import React, { useEffect, useState } from 'react';
import Modal from "@/components/Modal";
import { useDispatch, useSelector } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { IRootState } from "@/store";
import { AnyAction } from "redux";
import { setAuthToken } from "@/configs/api.config";
import { getUnits } from "@/store/slices/unitSlice";
import { clearRawProductState } from "@/store/slices/rawProductSlice";
import { clearUtilState } from "@/store/slices/utilSlice";
import { DatePicker, Form, Select, message } from 'antd';
import moment from 'moment';
import { Input } from '@/components/form/Input'; // Ensure the correct path to the Input component

const { Option } = Select;

interface IProps {
    modalOpen: boolean;
    setModalOpen: (value: boolean) => void;
    handleSubmit: (value: any) => void;
}

const EmployeeFormModal = ({ modalOpen, setModalOpen, handleSubmit }: IProps) => {
    const [form] = Form.useForm();
    const [showDeadline, setShowDeadline] = useState(false);
    const dispatch = useDispatch<ThunkDispatch<IRootState, any, AnyAction>>();
    const { token } = useSelector((state: IRootState) => state.user);

    useEffect(() => {
        setAuthToken(token);
        if (modalOpen) {
            // Fetch any necessary data when modal opens
            dispatch(getUnits());
        } else {
            dispatch(clearUtilState());
            dispatch(clearRawProductState());
        }
    }, [modalOpen]);

    const handleFormSubmit = () => {
        form.validateFields()
            .then(values => {
                handleSubmit(values);
                console.log(values);
                message.success('Data added successfully');
                setModalOpen(false);
            })
            .catch(info => {
                console.log('Validate Failed:', info);
            });
    };

    const handleDeductionChange = (value: string) => {
        setShowDeadline(value === 'date');
        form.setFieldsValue({ deduction: value });
    };

    return (
        <Modal
            show={modalOpen}
            setShow={setModalOpen}
            title='Add New Loan'
            size={'lg'}
            footer={
                <div className="mt-8 flex items-center justify-end">
                    <button type="button" className="btn btn-outline-danger"
                            onClick={() => setModalOpen(false)}>
                        Discard
                    </button>
                    <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4"
                            onClick={handleFormSubmit}>
                        Add
                    </button>
                </div>
            }
        >
            <Form form={form} layout="vertical" className="dark:text-white">
                <Form.Item name="employee" label="Employee" rules={[{ required: true, message: 'Please select an employee' }]} className="dark:text-white">
                    <Select placeholder="Select an employee" className=" w-full dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white">
                        <Option value="employee1">Employee 1</Option>
                        <Option value="employee2">Employee 2</Option>
                        {/* Add other employees here */}
                    </Select>
                </Form.Item>
                <Form.Item name="loanDate" label="Loan Date" initialValue={moment()} rules={[{ required: true, message: 'Please select a loan date' }]} className="dark:text-white">
                    <DatePicker defaultValue={moment()} format="YYYY-MM-DD" className="w-full dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" />
                </Form.Item>
                <Form.Item name="loanAmount" label="Loan Amount" rules={[{ required: true, message: 'Please enter a loan amount' }]} className="dark:text-white">
                    <Input type="number" placeholder="Enter loan amount" className="dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" name={''} onChange={function (e: any): void {
                        throw new Error('Function not implemented.');
                    } } isMasked={false} />
                </Form.Item>
                <Form.Item name="deduction" label="Deduction" rules={[{ required: true, message: 'Please select a deduction method' }]} className="dark:text-white">
                    <Select placeholder="Select a deduction method" onChange={handleDeductionChange} className="dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white">
                        <Option value="salary">Deduction from salary</Option>
                        <Option value="date">Pay on date</Option>
                    </Select>
                </Form.Item>
                {showDeadline && (
                    <Form.Item  name="deadline" label="Deadline" rules={[{ required: true, message: 'Please select a deadline' }]} className="dark:text-white">
                        <DatePicker format="YYYY-MM-DD" className="w-full dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" />
                    </Form.Item>
                )}
            </Form>
        </Modal>
    );
};

export default EmployeeFormModal;
