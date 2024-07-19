import React, {useEffect, useState} from 'react';
import ImageUploader from "@/components/form/ImageUploader";
import { useAppDispatch, useAppSelector } from '@/store';
import {ButtonType, ButtonVariant} from "@/utils/enums";
import Modal from "@/components/Modal";
import {clearCategoryState} from "@/store/slices/categorySlice";
import Button from "@/components/Button";
import {Dropdown} from "@/components/form/Dropdown";
import {Input} from "@/components/form/Input";
import {clearLocationState, getCountries} from "@/store/slices/locationSlice";
import Option from "@/components/form/Option";
import {serverFilePath} from "@/utils/helper";

interface IProps {
    modalOpen: boolean;
    setModalOpen: (value: boolean) => void;
    handleSubmit: (value: any) => void;
    modalFormData?: any;
}

const CategoryModal = ({modalOpen, setModalOpen, handleSubmit, modalFormData}: IProps) => {
    const dispatch = useAppDispatch();
    const [formData, setFormData] = useState<any>({})
    const [image, setImage] = useState<File | null>(null);
    const [countryOptions, setCountryOptions] = useState([]);
    const [existingImage, setExistingImage] = useState('');
    const {countries} = useAppSelector((state) => state.location);

    const handleChange = (name: string, value: any) => {
        if (name === 'country_id') {
            if (value && typeof value !== 'undefined') {
                setFormData((prev: any) => ({
                    ...prev,
                    [name]: value.value
                }))
            } else {
                setFormData((prev: any) => ({
                    ...prev,
                    [name]: ''
                }))
            }
        } else if (name === 'is_active') {
            setFormData((prev: any) => ({
                ...prev,
                [name]: value ? 1 : 0
            }))

        } else {
            setFormData((prev: any) => ({
                ...prev,
                [name]: value
            }))
        }

    }

    useEffect(() => {
        if (modalOpen) {
            setFormData({})
            setImage(null);
            dispatch(clearCategoryState());
            dispatch(clearLocationState())
            dispatch(getCountries())

            if (modalFormData) {
                console.log(modalFormData)
                setFormData(modalFormData)
                setExistingImage(serverFilePath(modalFormData.thumbnail))
            } else {
                setExistingImage('')
            }
        }
    }, [modalOpen]);

    useEffect(() => {
        if (countries) {
            setCountryOptions(countries.map((country: any) => {
                return {value: country.id, label: country.name}
            }))
        }
    }, [countries]);

    return (
        <Modal
            show={modalOpen}
            setShow={setModalOpen}
            title={Object.keys(modalFormData).length > 0 ? 'Update Category' : 'Add Category'}
            footer={
                <div className="mt-8 flex items-center justify-end">
                    <Button
                        type={ButtonType.button}
                        text='Discard'
                        variant={ButtonVariant.danger}
                        onClick={() => setModalOpen(false)}
                    />
                    <Button
                        classes='ltr:ml-4 rtl:mr-4'
                        type={ButtonType.button}
                        text={Object.keys(modalFormData).length > 0 ? 'Update' : 'Add'}
                        variant={ButtonVariant.primary}
                        onClick={() => handleSubmit({...formData, image})}
                    />
                </div>
            }
        >


            <div className="flex justify-center items-center">
                <ImageUploader
                    image={image}
                    setImage={setImage}
                    label="Asset Image (optional)"
                    existingImage={existingImage}
                />
            </div>
            <Input
                divClasses='w-full'
                label='Name'
                type='text'
                name='name'
                value={formData.name}
                onChange={(e) => handleChange(e.target.name, e.target.value)}
                isMasked={false}
            />
            <Dropdown
                divClasses='w-full'
                label='Country'
                name='country_id'
                options={countryOptions}
                value={formData.country_id}
                onChange={(e) => handleChange('country_id', e)}
            />
            <Option
                label='Is Active'
                type='checkbox'
                name='is_active'
                value={formData.is_active}
                defaultChecked={formData.is_active}
                onChange={(e) => handleChange(e.target.name, e.target.checked)}
            />
        </Modal>
    );
};

export default CategoryModal;
