import React, {Fragment, useEffect, useState} from 'react';
import {Dialog, Transition} from "@headlessui/react";
import {setAuthToken} from "@/configs/api.config";
import {getUnits} from "@/store/slices/unitSlice";
import {getProductCategory} from "@/store/slices/categorySlice";
import {getRawProducts} from "@/store/slices/rawProductSlice";
import {useDispatch, useSelector} from "react-redux";
import {ThunkDispatch} from "redux-thunk";
import {IRootState} from "@/store";
import {AnyAction} from "redux";
import Select from "react-select";
import {getRandomInt} from "@/pages/helper";
import ImageUploader from "@/components/ImageUploader";

interface IProps {
    vendorTypeFormModal: boolean;
    setVendorTypeFormModal: (value: boolean) => void;
    handleSubmitVendorType: (value: any) => void;
    modalFormData?: any;
}

const VendorTypeFormModal = ({vendorTypeFormModal, setVendorTypeFormModal, handleSubmitVendorType, modalFormData}: IProps) => {
    const [name, setName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [isActive, setIsActive] = useState<boolean>(true);


    useEffect(() => {
        if (vendorTypeFormModal) {
            setName('');
            setDescription('');
            setIsActive(true)
        }
    }, [vendorTypeFormModal]);

    return (
        <Transition appear show={vendorTypeFormModal} as={Fragment}>
            <Dialog as="div" open={vendorTypeFormModal} onClose={() => setVendorTypeFormModal(false)}>
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
                                    <div className="text-lg font-bold">{modalFormData ? 'Edit' : 'Add'} Vendor Type</div>
                                    <button type="button" className="text-white-dark hover:text-dark"
                                            onClick={() => setVendorTypeFormModal(false)}>
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
                                        <label htmlFor="name">Vendor Type Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            id="name"
                                            className="form-input"
                                            placeholder='Enter vendor type name'
                                            value={name}
                                            onChange={e => setName(e.target.value)}
                                        />
                                    </div>
                                    <div className="w-full">
                                        <label htmlFor="description">Description (Optional)</label>
                                        <textarea
                                            name="description"
                                            id="description"
                                            className="form-input"
                                            placeholder='Vendor type description'
                                            value={description}
                                            onChange={e => setDescription(e.target.value)}
                                        ></textarea>
                                    </div>
                                    <div className="mt-8 flex items-center justify-end">
                                        <button type="button" className="btn btn-outline-danger"
                                                onClick={() => setVendorTypeFormModal(false)}>
                                            Discard
                                        </button>
                                        <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4"
                                                onClick={() => handleSubmitVendorType({
                                                    name,
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

export default VendorTypeFormModal;
