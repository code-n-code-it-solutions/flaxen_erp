import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { IRootState } from "@/store";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import { clearLeaveState, getLeaveStatuses } from "@/store/slices/leaveSlice";
import Option from "@/components/form/Option";
import { Dropdown } from "@/components/form/Dropdown";
import Modal from "@/components/Modal";

interface IProps {
    modalOpen: boolean;
    setModalOpen: (value: boolean) => void;
    handleSubmit: (value: any) => void;
    modalFormData?: any;
}

const LeaveFormModal = ({ modalOpen, setModalOpen, handleSubmit, modalFormData }: IProps) => {
    const dispatch = useDispatch<ThunkDispatch<IRootState, any, AnyAction>>();
    const [dateFrom, setDateFrom] = useState<string>('');
    const [dateTo, setDateTo] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const { loading, statuses } = useSelector((state: IRootState) => state.unit);

    useEffect(() => {
        if (modalOpen) {
            setDateFrom('');
            setDateTo('');
            setDescription('');
            dispatch(clearLeaveState());
            if (Object.keys(modalFormData).length > 0) {
                setDateFrom(modalFormData.dateFrom);
                setDateTo(modalFormData.dateTo);
                setDescription(modalFormData.description);
            }
        }
    }, [modalOpen]);

    return (
        <Modal
            show={modalOpen}
            setShow={setModalOpen}
            title={Object.keys(modalFormData).length > 0 ? 'Update Leave' : 'Add Leave'}
            footer={<div className="mt-8 flex items-center justify-end">
                <button type="button" className="btn btn-outline-danger" onClick={() => setModalOpen(false)}>
                    Discard
                </button>
                <button
                    type="button"
                    className="btn btn-primary ltr:ml-4 rtl:mr-4"
                    disabled={!dateFrom || !dateTo || !description} // Disable button if any required field is empty
                    onClick={() => handleSubmit({
                        dateFrom,
                        dateTo,
                        description,
                    })}
                >
                    {Object.keys(modalFormData).length > 0 ? 'Update' : 'Add'}
                </button>
            </div>}
        >
            <div className="w-full">
                <label htmlFor="dateFrom">Date From</label>
                <input
                    type="date"
                    name="dateFrom"
                    id="dateFrom"
                    className="form-input"
                    value={dateFrom}
                    onChange={e => setDateFrom(e.target.value)}
                />
            </div>
            <div className="w-full">
                <label htmlFor="dateTo">Date To</label>
                <input
                    type="date"
                    name="dateTo"
                    id="dateTo"
                    className="form-input"
                    value={dateTo}
                    onChange={e => setDateTo(e.target.value)}
                />
            </div>
            <div className="w-full">
                <label htmlFor="description">Description (Optional)</label>
                <textarea
                    name="description"
                    id="description"
                    className="form-input"
                    placeholder="Enter leave description"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                ></textarea>
            </div>
            <Dropdown
                divClasses='w-full'
                label='Leave'
                name='leave_code'
                // Provide options and onChange function as required props
                options={[]} // Placeholder, replace with actual options
                onChange={(value: any) => {}} // Placeholder, implement onChange function
                value={''} // Placeholder, replace with selected value
            />
           
        </Modal>
    );
};

export default LeaveFormModal;
