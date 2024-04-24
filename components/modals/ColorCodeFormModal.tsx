import React, {Fragment, useEffect, useState} from 'react';
import {Dialog, Transition} from "@headlessui/react";
import ImageUploader from "@/components/form/ImageUploader";
import Modal from "@/components/Modal";
import { Input } from '../form/Input';
import Alert from '@/components/Alert'
import {clearColorCodeState, storeColorCode} from "@/store/slices/colorCodeSlice";
import {useAppDispatch, useAppSelector} from "@/store";

interface IProps {
    modalOpen: boolean;
    setModalOpen: (value: boolean) => void;
    modalFormData?: any;
}

const ColorCodeFormModal = ({modalOpen, setModalOpen, modalFormData}: IProps) => {
    const dispatch = useAppDispatch();
    const {colorCode, success} = useAppSelector(state => state.colorCode)
    const [image, setImage] = useState<File | null>(null);
    const [code, setCode] = useState<any>('');
    const [hexCode, setHexCode] = useState<any>('');
    const [name, setName] = useState<any>(0);
    const [errorMessages, setErrorMessages] = useState({
        code: "This field is required",
        name: "This field is required",
    })
    const [isFormValid, setIsFormValid] = useState<boolean>(false);
    const [validationMessage, setValidationMessage] = useState("");

    const handleSubmit = (value: any) => {
        dispatch(storeColorCode(value));
    };

    useEffect(() => {
        if (modalOpen) {
            setCode('');
            setHexCode('');
            setName('')
            setImage(null);
            dispatch(clearColorCodeState());
        }
    }, [modalOpen]);

    useEffect(() => {
        if(colorCode && success) {
            setModalOpen(false);
            dispatch(clearColorCodeState());
        }
    }, [colorCode, success]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value,required,name } = e.target;
        if(name === 'name'){
            setName(value);
        }
        else {
            setCode(value);
        }

        if (required) {
            if (!value) {
                setErrorMessages({ ...errorMessages, [name]: 'This field is required.' });
            } else {
                setErrorMessages({ ...errorMessages, [name]: '' });
            }
        }
    };

    useEffect(() => {
        const isValid = Object.values(errorMessages).some(message => message !== '');
        setIsFormValid(!isValid);
        // console.log('Error Messages:', errorMessages);
        // console.log('isFormValid:', !isValid);
        if(isValid){
            setValidationMessage("Please fill all the required fields.");
        }
    }, [errorMessages]);

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
                    {isFormValid && <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4"
                            onClick={() => handleSubmit({
                                image: image,
                                code: code,
                                name: name,
                                hex_code: hexCode,
                            })}>
                        {modalFormData ? 'Update' : 'Add'}
                    </button>}
                </div>
            }
        >
            <div className="flex justify-center items-center">
                <ImageUploader image={image} setImage={setImage}/>
            </div>
            <div>
            {!isFormValid  && validationMessage &&
               <Alert
               alertType="error"
               message={validationMessage}
               setMessages={setValidationMessage}
           />
            }
            </div>

            <div className="w-full">
                {/* <label htmlFor="code">Code</label> */}
                <Input
                    label='Code'
                    type="text"
                    name="code"
                    placeholder='e.g. FSG-001'
                    value={code}
                    isMasked={false}
                    onChange={handleChange}
                    required= {true}
                    errorMessage={errorMessages.code}
                />
            </div>
            <div className="w-full">
                {/* <label htmlFor="name">Name</label> */}
                <Input
                    label="Name"
                    type="text"
                    name="name"
                    placeholder='e.g. Red'
                    value={name}
                    isMasked={false}
                    onChange={handleChange}
                    required= {true}
                    errorMessage={errorMessages.name}
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
