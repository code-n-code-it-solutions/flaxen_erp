import React, {Fragment, useEffect, useState} from 'react';
import {Dialog, Transition} from "@headlessui/react";
import ImageUploader from "@/components/form/ImageUploader";
import Modal from "@/components/Modal";

interface IProps {
    modalOpen: boolean;
    setModalOpen: (value: boolean) => void;
    handleSubmit: (value: any) => void;
    modalFormData?: any;
}

const ColorCodeFormModal = ({modalOpen, setModalOpen, handleSubmit, modalFormData}: IProps) => {
    const [image, setImage] = useState<File | null>(null);
    const [code, setCode] = useState<any>('');
    const [hexCode, setHexCode] = useState<any>('');
    const [name, setName] = useState<any>(0);


    useEffect(() => {
        if (modalOpen) {
            setCode('');
            setHexCode('');
            setName('')
            setImage(null);
        }
    }, [modalOpen]);

    return (
        <Modal
            show={modalOpen}
            setShow={setModalOpen}
            title='Add New Color Code'
            footer={
                <div className="mt-8 flex items-center justify-end">
                    <button type="button" className="btn btn-outline-danger"
                            onClick={() => setModalOpen(false)}>
                        Discard
                    </button>
                    <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4"
                            onClick={() => handleSubmit({
                                image: image,
                                code: code,
                                name: name,
                                hex_code: hexCode,
                            })}>
                        {modalFormData ? 'Update' : 'Add'}
                    </button>
                </div>
            }
        >
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
        </Modal>
    );
};

export default ColorCodeFormModal;
