import React from 'react';
import Modal from 'react-modal';

interface ModelFormProps {
    isOpen: boolean;
    onRequestClose: () => void;
    onSave: (newPayrollPeriod: { payrollPeriodCode: string, name: string, startDate: string, endDate: string }) => void;
    payrollPeriod: { payrollPeriodCode: string, name: string, startDate: string, endDate: string };
    setPayrollPeriod: React.Dispatch<React.SetStateAction<{ payrollPeriodCode: string, name: string, startDate: string, endDate: string }>>;
}

const ModelForm: React.FC<ModelFormProps> = ({ isOpen, onRequestClose, onSave, payrollPeriod, setPayrollPeriod }) => {
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPayrollPeriod({ ...payrollPeriod, [name]: value });
    };

    const handleSubmit = () => {
        onSave(payrollPeriod);
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Create New Payroll Period"
            className="custom-modal"
            overlayClassName="custom-modal-overlay"
        >
            <h2>Create New Payroll Period</h2>
            <form>
                <div>
                    <label>Payroll Period Code</label>
                    <input
                        type="text"
                        name="payrollPeriodCode"
                        value={payrollPeriod.payrollPeriodCode}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label>Name</label>
                    <input
                        type="text"
                        name="name"
                        value={payrollPeriod.name}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label>Start Date</label>
                    <input
                        type="date"
                        name="startDate"
                        value={payrollPeriod.startDate}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label>End Date</label>
                    <input
                        type="date"
                        name="endDate"
                        value={payrollPeriod.endDate}
                        onChange={handleInputChange}
                    />
                </div>
                <button type="button" onClick={handleSubmit}>Save</button>
                <button type="button" onClick={onRequestClose}>Cancel</button>
            </form>
        </Modal>
    );
};

export default ModelForm;
