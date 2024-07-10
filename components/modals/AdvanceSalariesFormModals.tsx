import React, { useState, useEffect } from 'react';
import Modal from "@/components/Modal";
import { Dropdown } from "@/components/form/Dropdown";
import { Input } from "@/components/form/Input";

const employees = ['Employee 1', 'Employee 2', 'Employee 3']; // Replace with your actual data
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

interface IProps {
    modalOpen: boolean;
    setModalOpen: (value: boolean) => void;
    handleSubmit: (value: any) => void;
}

const AdvanceSalariesFormModals = ({ modalOpen, setModalOpen, handleSubmit }: IProps) => {
    const [formData, setFormData] = useState<any>({ number_of_salaries: 1, months: [] });
    const [selectedMonths, setSelectedMonths] = useState<string[]>([]);
    const [employee, setEmployee] = useState<string | null>(null);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        console.log('Selected Months:', selectedMonths);
    }, [selectedMonths]);

    const handleFormSubmit = () => {
        if (selectedMonths.length !== formData.number_of_salaries) {
            setError(`Please select exactly ${formData.number_of_salaries} month(s)`);
            return;
        }
        setError('');
        console.log('Form Data:', { ...formData, employee });
        handleSubmit({ ...formData, employee });
        setModalOpen(false);
    };

    const handleNumberOfSalariesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        setFormData({ ...formData, number_of_salaries: value });
        setSelectedMonths([]);
        setError('');
    };

    const handleMonthsChange = (selectedOptions: any) => {
        const value = selectedOptions ? selectedOptions.map((option: any) => option.value) : [];
        setSelectedMonths(value);
        setFormData({ ...formData, months: value });
        setError('');
    };

    useEffect(() => {
        if (modalOpen) {
            setFormData({ number_of_salaries: 1, months: [] });
            setSelectedMonths([]);
            setEmployee(null);
            setError('');
        }
    }, [modalOpen]);

    // Filter months based on number of salaries
    const filteredMonths = months.map(month => ({
        label: month,
        value: month,
        isDisabled: selectedMonths.length >= formData.number_of_salaries && !selectedMonths.includes(month)
    }));

    return (
        <Modal
            show={modalOpen}
            setShow={setModalOpen}
            title='Add Advance Salary'
            size={'lg'}
            footer={
                <div className="mt-8 flex items-center justify-end">
                    <button type="button" className="btn btn-outline-danger" onClick={() => setModalOpen(false)}>
                        Discard
                    </button>
                    <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4" onClick={handleFormSubmit}>
                        Add
                    </button>
                </div>
            }
        >
            <Dropdown
                divClasses='w-full'
                label='Employee'
                name='employee'
                options={employees.map(employee => ({ label: employee, value: employee }))}
                required={true}
                value={employee}
                onChange={(e) => setEmployee(e ? e.value : null)}
            />
            <Input
                label='Number of Salaries'
                type='number'
                name='number_of_salaries'
                value={formData.number_of_salaries}
                onChange={handleNumberOfSalariesChange}
                isMasked={false}
            />
            <Dropdown
                divClasses='w-full'
                label='Months'
                name='months'
                options={filteredMonths}
                required={true}
                value={selectedMonths.join(',')}
                onChange={handleMonthsChange}
                isMulti={true}
            />
            {error && <div className="text-red-500 mt-2">{error}</div>}
        </Modal>
    );
};

export default AdvanceSalariesFormModals;
