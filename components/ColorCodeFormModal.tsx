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
    colorCodeModal: boolean;
    setColorCodeModal: (value: boolean) => void;
    handleAddNewCode: (value: any) => void;
    modalFormData?: any;
}

const ColorCodeFormModal = ({colorCodeModal, setColorCodeModal, handleAddNewCode, modalFormData}: IProps) => {
    const [image, setImage] = useState<File | null>(null);
    const [code, setCode] = useState<any>('');
    const [hexCode, setHexCode] = useState<any>('');
    const [name, setName] = useState<any>(0);


    useEffect(() => {
        if (colorCodeModal) {
            setCode('');
            setHexCode('');
            setName('')
            setImage(null);
        }
    }, [colorCodeModal]);

    return (
        <Transition appear show={colorCodeModal} as={Fragment}>
            <Dialog as="div" open={colorCodeModal} onClose={() => setColorCodeModal(false)}>
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
                                    <div className="text-lg font-bold">{modalFormData ? 'Edit' : 'Add'} Color Code</div>
                                    <button type="button" className="text-white-dark hover:text-dark"
                                            onClick={() => setColorCodeModal(false)}>
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
                                    <div className="flex justify-center items-center">
                                        <ImageUploader image={image} setImage={setImage}/>
                                    </div>


                                    <div className="w-full">
                                        <label htmlFor="code">Code</label>
                                        <input
                                            type="text"
                                            name="code"
                                            className="form-input"
                                            placeholder='e.g. FSG-001'
                                            value={code}
                                            onChange={e => setCode(e.target.value)}
                                        />
                                    </div>
                                    <div className="w-full">
                                        <label htmlFor="name">Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            className="form-input"
                                            placeholder='e.g. Red'
                                            value={name}
                                            onChange={e => setName(e.target.value)}
                                        />
                                    </div>
                                    <div className="w-full flex justify-center items-end">
                                        <div className="w-full">
                                            <label htmlFor="hex_code">Hex Code (Optional)</label>
                                            <input
                                                type="text"
                                                name="hex_code"
                                                className="form-input"
                                                placeholder='e.g. #FF0000'
                                                value={hexCode}
                                                onChange={e => setHexCode(e.target.value)}
                                            />
                                        </div>
                                        <span className={`p-5 rounded shadow border`} style={{backgroundColor: `${hexCode}`}}></span>
                                    </div>
                                    <div className="mt-8 flex items-center justify-end">
                                        <button type="button" className="btn btn-outline-danger"
                                                onClick={() => setColorCodeModal(false)}>
                                            Discard
                                        </button>
                                        <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4"
                                                onClick={() => handleAddNewCode({
                                                    image: image,
                                                    code: code,
                                                    name: name,
                                                    hex_code: hexCode,
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

export default ColorCodeFormModal;
