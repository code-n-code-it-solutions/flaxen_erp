import React, {useEffect, useState} from 'react';
import {setAuthToken} from "@/configs/api.config";
import {useAppDispatch, useAppSelector} from "@/store";
import ImageUploader from "@/components/form/ImageUploader";
import {clearLocationState, getCities, getCountries, getStates} from "@/store/slices/locationSlice";
import {MaskConfig} from "@/configs/mask.config";
import {Input} from "@/components/form/Input";
import {Dropdown} from "@/components/form/Dropdown";
import Alert from '@/components/Alert';
import Modal from "@/components/Modal";
import Button from "@/components/Button";
import {ButtonType, ButtonVariant} from "@/utils/enums";

interface IProps {
    modalOpen: boolean;
    setModalOpen: (value: boolean) => void;
    handleSubmit: (value: any) => void;
    modalFormData?: any;
}

const VendorRepresentativeModal = ({
                                       modalOpen,
                                       setModalOpen,
                                       handleSubmit,
                                       modalFormData
                                   }: IProps) => {
    const dispatch = useAppDispatch();
    const {token} = useAppSelector((state) => state.user);
    const {countries, states, cities} = useAppSelector((state) => state.location);

    const [formData, setFormData] = useState<any>({
        name: '',
        phone: '+971',
        email: '',
        country_id: 0,
        country_name: '',
        state_id: 0,
        state_name: '',
        city_id: 0,
        city_name: '',
        postal_code: '',
        address: '',
        is_active: true,
        image: null,
    });
    const [countryOptions, setCountryOptions] = useState([]);
    const [stateOptions, setStateOptions] = useState([]);
    const [cityOptions, setCityOptions] = useState([]);

    const [errorMessages, setErrorMessages] = useState<any>({});
    const [isFormValid, setIsFormValid] = useState<boolean>(false);
    const [validationMessage, setValidationMessage] = useState("");

    const handleChange = (name: string, value: any, required: boolean) => {
        if (required) {
            if (!value) {
                setErrorMessages({...errorMessages, [name]: 'This field is required.'});
            } else {
                setErrorMessages((prev: any) => {
                    delete prev[name];
                    return prev
                });
            }
        }

        switch (name) {
            case 'country_id':
                if (value && typeof value !== 'undefined') {
                    dispatch(getStates(parseInt(value.value)));
                    setFormData((prev: any) => ({...prev, country_id: value.value, country_name: value.label}));
                } else {
                    setFormData((prev: any) => ({...prev, country_id: 0, country_name: ''}));
                    setStateOptions([])
                    setCityOptions([])
                }
                break;
            case 'state_id':
                if (value && typeof value !== 'undefined') {
                    setFormData((prev: any) => ({...prev, state_id: value.value, state_name: value.label}));
                    dispatch(getCities({countryId: formData.country_id, stateId: parseInt(value.value)}));
                } else {
                    setFormData((prev: any) => ({...prev, state_id: 0, state_name: ''}));
                    setCityOptions([])
                }
                break;
            case 'city_id':
                if (value && typeof value !== 'undefined') {
                    setFormData((prev: any) => ({...prev, city_id: value.value, city_name: value.label}));
                } else {
                    setFormData((prev: any) => ({...prev, city_id: 0, city_name: ''}));
                }
                break;
            case 'phone':
                if (value.length < 4) {
                    value = '+971';
                }
                setFormData((prev: any) => ({...prev, [name]: value}));
                break;
            default:
                setFormData((prev: any) => ({...prev, [name]: value}));
                break;
        }
    };


    useEffect(() => {
        if (modalOpen) {
            setFormData({
                name: '',
                phone: '',
                email: '',
                country_id: 0,
                country_name: '',
                state_id: 0,
                state_name: '',
                city_id: 0,
                city_name: '',
                postal_code: '',
                address: '',
                is_active: true,
                image: null,
            });

            dispatch(clearLocationState())
            setAuthToken(token)
            dispatch(getCountries())
        }
    }, [modalOpen]);

    useEffect(() => {
        if (countries) {
            setCountryOptions(countries.map((country: any) => {
                return {value: country.id, label: country.name}
            }))
            setStateOptions([])
            setCityOptions([])
        }
    }, [countries]);

    useEffect(() => {
        if (states) {
            setStateOptions(states.map((state: any) => {
                return {value: state.id, label: state.name}
            }))
            setCityOptions([])
        }
    }, [states]);

    useEffect(() => {
        if (cities) {
            setCityOptions(cities.map((city: any) => {
                return {value: city.id, label: city.name}
            }))
        }
    }, [cities]);

    useEffect(() => {
        const isValid = Object.values(errorMessages).some((message) => message !== '');
        setIsFormValid(!isValid);
        if (isValid) {
            setValidationMessage('Please fill all the required fields.');
        }
    }, [errorMessages]);

    return (
        <Modal
            show={modalOpen}
            setShow={setModalOpen}
            title={`${modalFormData ? 'Update' : 'Add'} Vendor Representative`}
            footer={

                <div className="mt-8 gap-3 flex items-center justify-end">
                    <Button
                        type={ButtonType.button}
                        text="Discard"
                        variant={ButtonVariant.secondary}
                        onClick={() => setModalOpen(false)}
                    />

                    {/*{isFormValid && (*/}
                        <Button
                            type={ButtonType.button}
                            text={modalFormData ? 'Update' : 'Add'}
                            variant={ButtonVariant.primary}
                            onClick={() => handleSubmit(formData)}
                        />
                    {/*)}*/}
                </div>
            }
        >
            <div className="flex justify-center items-center">
                <ImageUploader image={formData.image} setImage={(e) => handleChange('image', e, false)}/>
            </div>
            {!isFormValid && validationMessage &&
                <Alert
                    alertType="error"
                    message={validationMessage}
                    setMessages={setValidationMessage}
                />}
            <Input
                divClasses="w-full"
                label='Representative Name'
                type="text"
                name="name"
                placeholder="Enter Representative Name"
                value={formData.name}
                onChange={(e) => handleChange(e.target.name, e.target.value, e.target.required)}
                isMasked={false}
                errorMessage={errorMessages.name}
                required={true}
            />
            <Input
                divClasses="w-full"
                label='Phone'
                type="text"
                name="phone"
                placeholder={MaskConfig.phone.placeholder}
                value={formData.phone}
                onChange={(e) => handleChange(e.target.name, e.target.value, e.target.required)}
                isMasked={true}
                maskPattern={MaskConfig.phone.pattern}
            />
            <Input
                divClasses="w-full"
                label='Email'
                type="email"
                name="email"
                placeholder="Enter email address"
                value={formData.email}
                onChange={(e) => handleChange(e.target.name, e.target.value, e.target.required)}
                errorMessage={errorMessages.email}
                required={true}
                isMasked={false}
            />
            <div className="flex flex-col md:flex-row gap-3 w-full">
                <Dropdown
                    divClasses='w-full'
                    label='Country'
                    name='country_id'
                    options={countryOptions}
                    value={formData.country_id}
                    onChange={(e) => handleChange('country_id', e, false)}
                />
                <Dropdown
                    divClasses='w-full'
                    label='State'
                    name='state_id'
                    options={stateOptions}
                    value={formData.state_id}
                    onChange={(e) => handleChange('state_id', e, false)}
                />
            </div>
            <div className="flex flex-col md:flex-row gap-3 w-full">
                <Dropdown
                    divClasses='w-full'
                    label='City'
                    name='city_id'
                    options={cityOptions}
                    value={formData.city_id}
                    onChange={(e) => handleChange('city_id', e, false)}
                />
                <Input
                    divClasses="w-full"
                    label="Postal Code"
                    type="text"
                    name="postal_code"
                    placeholder="Enter postal code"
                    value={formData.postal_code}
                    onChange={(e) => handleChange(e.target.name, e.target.value, e.target.required)}
                    errorMessage={errorMessages.postal_code}
                    required={true}
                    isMasked={false}
                />
            </div>

            <Input
                divClasses="w-full"
                label="Official Address"
                type="text"
                name="address"
                placeholder="Enter address"
                value={formData.address}
                onChange={(e) => handleChange(e.target.name, e.target.value, e.target.required)}
                errorMessage={errorMessages.address}
                required={true}
                isMasked={false}
            />
        </Modal>
    );
};

export default VendorRepresentativeModal;
