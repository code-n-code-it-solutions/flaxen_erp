import React, { useState } from 'react';
import Modal from '@/components/Modal';
import Button from '@/components/Button';
import { ButtonType, ButtonVariant } from '@/utils/enums';

interface IProps {
    modalOpen: boolean;
    setModalOpen: (value: boolean) => void;
    onCreate: (data: { name: string; type: string }) => void;
}

const SalaryComponentModal: React.FC<IProps> = ({ modalOpen, setModalOpen, onCreate }) => {
    const [name, setName] = useState('');
    const [type, setType] = useState('earning');

    const handleSubmit = () => {
        // Send the form data back to the parent component
        onCreate({ name, type });
        setModalOpen(false);
        setName('');  // Clear the input fields
        setType('earning');  // Reset the dropdown to default
    };

    return (
        <Modal show={modalOpen} setShow={setModalOpen} title="Create New Payroll Component">
            <div className="mb-4">
                <label>Name</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="form-input"
                    placeholder="Enter name"
                />
            </div>
            <div className="mb-4">
                <label>Type</label>
                <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="form-select"
                >
                    <option value="earning">Earning</option>
                    <option value="deduction">Deduction</option>  {/* Corrected value here */}
                </select>
            </div>
            <div className="mt-4 flex justify-end">
                <div className='mr-2'>
                    <Button
                        type={ButtonType.button}
                        text="Cancel"
                        variant={ButtonVariant.secondary}
                        onClick={() => setModalOpen(false)}
                    />
                </div>
                <Button
                    type={ButtonType.button}
                    text="Create"
                    variant={ButtonVariant.primary}
                    onClick={handleSubmit}
                />
            </div>
        </Modal>
    );
};

export default SalaryComponentModal;
