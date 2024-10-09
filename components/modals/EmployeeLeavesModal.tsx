import React, { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { IRootState } from '@/store';
import { AnyAction } from 'redux';
import Modal from '@/components/Modal';
import Textarea from '../form/Textarea';
import { Dropdown } from '@/components/form/Dropdown';

interface IProps {
    modalOpen: boolean;
    setModalOpen: (value: boolean) => void;
    handleSubmit: (value: any) => void;
    modalFormData?: any;
}

const EmployeeLeavesModal: FC<IProps> = ({ modalOpen, setModalOpen, handleSubmit, modalFormData }) => {
    const dispatch = useDispatch<ThunkDispatch<IRootState, any, AnyAction>>();
    const { token } = useSelector((state: IRootState) => state.user);
    const { countries, states, cities } = useSelector((state: IRootState) => state.location);

    const [formData, setFormData] = useState<any>({
        status: '',
        description: '',
        is_active: true,
    });

    const statusOptions = [
        { value: 'pending', label: 'Pending' },
        { value: 'accepted', label: 'Accepted' },
        { value: 'rejected', label: 'Rejected' },
    ];

    const handleInputChange = (name: string) => (value: any) => {
        setFormData((prevFormData: any) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleDropdownChange = (selectedOption: any) => {
        console.log('Dropdown Change:', selectedOption);
        setFormData((prevFormData: any) => ({
            ...prevFormData,
            status: selectedOption ? selectedOption.value : '',
        }));
    };

    useEffect(() => {
        if (modalOpen) {
            setFormData({
                status: '',
                description: '',
                is_active: true,
            });
        }
    }, [modalOpen]);

    useEffect(() => {
        if (modalFormData) {
            setFormData(modalFormData);
        }
    }, [modalFormData]);

    return (
        <Modal
            show={modalOpen}
            setShow={setModalOpen}
            title="Add Leave Status"
            footer={
                <div className="mt-8 flex items-center justify-end">
                    <button type="button" className="btn btn-outline-danger" onClick={() => setModalOpen(false)}>
                        Discard
                    </button>
                    <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4" onClick={() => handleSubmit(formData)}>
                        {modalFormData ? 'Update' : 'Add'}
                    </button>
                </div>
            }
        >
            <div className="w-full">
                <Dropdown
                    label="Status"
                    name="status"
                    value={formData.status}
                    options={statusOptions}
                    onChange={(selectedOption: any) => handleDropdownChange(selectedOption)}
                />
            </div>
            <div className="w-full">
                <Textarea
                    name="description"
                    label="Description"
                    value={formData.description}
                    onChange={(e: any) => handleInputChange('description')(e.target.value)}
                    placeholder="Add reason for the relevant status"
                    isReactQuill={false} // Set to true if you want to use ReactQuill editor
                    errorMessage="" // Pass error message if any
                />
            </div>
        </Modal>
    );
};

export default EmployeeLeavesModal;
