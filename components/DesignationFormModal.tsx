import React, {Fragment, useEffect, useState} from 'react';
import {Dialog, Transition} from "@headlessui/react";
import Select from "react-select";

interface IProps {
    modalOpen: boolean;
    setModalOpen: (value: boolean) => void;
    handleAddition: (value: any) => void;
    departments: any[];
    modalFormData?: any;
}

const DesignationFormModal = ({modalOpen, setModalOpen, handleAddition, modalFormData, departments}: IProps) => {
    const [name, setName] = useState<string>('');
    const [departmentId, setDepartmentId] = useState<number>(0);
    const [description, setDescription] = useState<string>('');
    const [isActive, setIsActive] = useState<boolean>(true);

    useEffect(() => {
        if (modalOpen) {
            setName('');
            setDepartmentId(0);
            setDescription('');
            setIsActive(true)
        }
    }, [modalOpen]);

    return (
        <Transition appear show={modalOpen} as={Fragment}>
            <Dialog as="div" open={modalOpen} onClose={() => setModalOpen(false)}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0"/>
                </Transition.Child>
                <div className="fixed inset-0 z-[999] overflow-y-auto bg-[black]/60">
                    <div className="flex min-h-screen items-start justify-center px-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel as="div"
                                          className="panel my-8 w-full max-w-lg overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">
                                <div
                                    className="flex items-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]">
                                    <div className="text-lg font-bold">{modalFormData ? 'Edit' : 'Add'} Designation</div>
                                    <button type="button" className="text-white-dark hover:text-dark"
                                            onClick={() => setModalOpen(false)}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="20"
                                            height="20"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <line x1="18" y1="6" x2="6" y2="18"></line>
                                            <line x1="6" y1="6" x2="18" y2="18"></line>
                                        </svg>
                                    </button>
                                </div>
                                <div className="p-5 space-y-5">
                                    <div className="w-full">
                                        <label htmlFor="name">Designation Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            id="name"
                                            className="form-input"
                                            placeholder='Enter designation name'
                                            value={name}
                                            onChange={e => setName(e.target.value)}
                                        />
                                    </div>
                                    <div className="w-full">
                                        <label htmlFor="parent_id">Department</label>
                                        <Select
                                            defaultValue={departments[0]}
                                            options={departments}
                                            isSearchable={true}
                                            isClearable={true}
                                            placeholder={'Select Parent Department'}
                                            onChange={(e: any) => setDepartmentId(e && typeof e !== 'undefined' ? e.value : 0)}
                                        />
                                    </div>
                                    <div className="w-full">
                                        <label htmlFor="description">Description (Optional)</label>
                                        <textarea
                                            name="description"
                                            id="description"
                                            className="form-input"
                                            placeholder='Department description'
                                            value={description}
                                            onChange={e => setDescription(e.target.value)}
                                        ></textarea>
                                    </div>
                                    <div className="mt-8 flex items-center justify-end">
                                        <button type="button" className="btn btn-outline-danger"
                                                onClick={() => setModalOpen(false)}>
                                            Discard
                                        </button>
                                        <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4"
                                                onClick={() => handleAddition({
                                                    name,
                                                    departmentId,
                                                    description,
                                                    isActive
                                                })}>
                                            {modalFormData ? 'Update' : 'Add'}
                                        </button>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default DesignationFormModal;
