import React, { useState } from 'react';
import Modal from '@/components/Modal';
import Button from '@/components/Button';
import { ButtonType, ButtonVariant } from '@/utils/enums';

interface IProps {
    modalOpen: boolean;
    setModalOpen: (value: boolean) => void;
    onCreate: (data: { componentCode: string; name: string; type: string }) => void;
}

const SalaryComponentModal: React.FC<IProps> = ({ modalOpen, setModalOpen, onCreate }) => {
    const [componentCode, setComponentCode] = useState('');
    const [name, setName] = useState('');
    const [type, setType] = useState('Earning');

    const handleSubmit = () => {
        onCreate({ componentCode, name, type });
        setModalOpen(false);
        setComponentCode(''); // Reset form
        setName('');
        setType('Earning');
    };

    return (
        <Modal show={modalOpen} setShow={setModalOpen} title="Create New Payroll Component">
            <div className="mb-4">
                <label>Component Code</label>
                <input
                    type="text"
                    value={componentCode}
                    onChange={(e) => setComponentCode(e.target.value)}
                    className="form-input"
                />
            </div>
            <div className="mb-4">
                <label>Name</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="form-input"
                />
            </div>
            <div className="mb-4">
                <label>Type</label>
                <select value={type} onChange={(e) => setType(e.target.value)} className="form-select">
                    <option value="Earning">Earning</option>
                    <option value="Deductions">Deductions</option>
                </select>
            </div>
            <div className="mt-4 flex justify-end">
                <Button
                    type={ButtonType.button}
                    text="Cancel"
                    variant={ButtonVariant.secondary}
                    onClick={() => setModalOpen(false)}
                />
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
