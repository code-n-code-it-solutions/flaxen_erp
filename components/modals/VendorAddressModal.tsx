import React, { useEffect, useState } from 'react';
import { setAuthToken } from '@/configs/api.config';
import { useAppDispatch, useAppSelector } from '@/store';
import { clearLocationState, getCities, getCountries, getStates } from '@/store/slices/locationSlice';
import { Dropdown } from '@/components/form/Dropdown';
import { Input } from '@/components/form/Input';
import Alert from '@/components/Alert';
import Modal from '@/components/Modal';
import Button from '@/components/Button';
import { ButtonType, ButtonVariant } from '@/utils/enums';

interface IProps {
    modalOpen: boolean;
    setModalOpen: (value: boolean) => void;
    handleSubmit: (value: any) => void;
    modalFormData?: any;
}

const VendorAddressModal = ({ modalOpen, setModalOpen, handleSubmit, modalFormData }: IProps) => {
    const dispatch = useAppDispatch();
    const { token } = useAppSelector((state) => state.user);
    const { countries, states, cities } = useAppSelector((state) => state.location);
    const [formData, setFormData] = useState<any>({
        address_type: 0,
        address_type_name: '',
        country_id: 0,
        country_name: '',
        state_id: 0,
        state_name: '',
        city_id: 0,
        city_name: '',
        postal_code: '',
        address: '',
        is_active: true
    });
    const [errorMessages, setErrorMessages] = useState<any>({});
    const [isFormValid, setIsFormValid] = useState<boolean>(false);
    const [validationMessage, setValidationMessage] = useState('');
    const [addressTypeOptions] = useState([
        { value: '', label: 'Select Address Type' },
        { value: 1, label: 'Billing' },
        { value: 2, label: 'Shipping' },
        { value: 3, label: 'Both' },
        { value: 4, label: 'Other' }
    ]);
    const [countryOptions, setCountryOptions] = useState([]);
    const [stateOptions, setStateOptions] = useState([]);
    const [cityOptions, setCityOptions] = useState([]);

    const handleChange = (name: string, value: any, required: boolean) => {
        if (required) {
            if (!value) {
                setErrorMessages({ ...errorMessages, [name]: 'This field is required.' });
            } else {
                setErrorMessages((prev: any) => {
                    delete prev[name];
                    return prev;
                });
            }
        }
        switch (name) {
            case 'address_type_id':
                if (value && typeof value !== 'undefined') {
                    setFormData((prev: any) => ({ ...prev, address_type: value.value, address_type_name: value.label }));
                } else {
                    setFormData((prev: any) => ({ ...prev, address_type: 0, address_type_name: '' }));
                }
                break;
            case 'country_id':
                if (value && typeof value !== 'undefined') {
                    setFormData((prev: any) => ({ ...prev, country_id: value.value, country_name: value.label }));
                    dispatch(getStates(value.value));
                } else {
                    setFormData((prev: any) => ({ ...prev, country_id: 0, country_name: '' }));
                    setStateOptions([]);
                    setCityOptions([]);
                }
                break;
            case 'state_id':
                if (value && typeof value !== 'undefined') {
                    setFormData((prev: any) => ({ ...prev, state_id: value.value, state_name: value.label }));
                    dispatch(getCities(value.value));
                } else {
                    setFormData((prev: any) => ({ ...prev, state_id: 0, state_name: '' }));
                    setCityOptions([]);
                }
                break;
            case 'city_id':
                if (value && typeof value !== 'undefined') {
                    setFormData((prev: any) => ({ ...prev, city_id: value.value, city_name: value.label }));
                } else {
                    setFormData((prev: any) => ({ ...prev, city_id: 0 }));
                }
                break;
            default:
                setFormData((prev: any) => ({ ...prev, [name]: value }));
                break;
        }
    };

    useEffect(() => {
        const isValid = Object.values(errorMessages).some(message => message !== '');
        setIsFormValid(!isValid);
        if (isValid) {
            setValidationMessage('Please fill all the required fields.');
        }
    }, [errorMessages]);

    useEffect(() => {
        if (modalOpen) {
            setFormData({
                address_type: 0,
                address_type_name: '',
                country_id: 0,
                country_name: '',
                state_id: 0,
                state_name: '',
                city_id: 0,
                city_name: '',
                postal_code: '',
                address: '',
                is_active: true
            });
        }
    }, [modalOpen]);

    useEffect(() => {
        dispatch(clearLocationState());
        setAuthToken(token);
        dispatch(getCountries());
    }, []);

    useEffect(() => {
        if (countries) {
            setCountryOptions(countries.map((country: any) => {
                return { value: country.id, label: country.name };
            }));
        }
    }, [countries]);

    useEffect(() => {
        if (states) {
            setStateOptions(states.map((state: any) => {
                return { value: state.id, label: state.name };
            }));
        }
    }, [states]);

    useEffect(() => {
        if (cities) {
            setCityOptions(cities.map((city: any) => {
                return { value: city.id, label: city.name };
            }));
        }
    }, [cities]);

    return (
        <Modal
            show={modalOpen}
            setShow={setModalOpen}
            title="Add Vendor Address"
            footer={
                <div className="mt-8 gap-3 flex items-center justify-end">
                    <Button
                        type={ButtonType.button}
                        text="Discard"
                        variant={ButtonVariant.secondary}
                        onClick={() => setModalOpen(false)}
                    />

                    {isFormValid && (
                        <Button
                            type={ButtonType.button}
                            text={modalFormData ? 'Update' : 'Add'}
                            variant={ButtonVariant.primary}
                            onClick={() => handleSubmit(formData)}
                        />
                    )}
                </div>
            }
        >
            <div className="flex flex-col gap-3 w-full">
                <Dropdown
                    divClasses="w-full"
                    name="address_type_id"
                    label="Address Type"
                    options={addressTypeOptions}
                    value={formData.address_type}
                    required={true}
                    onChange={(e) => handleChange('address_type_id', e, true)}
                    errorMessage={errorMessages.address_type}
                />

                <Dropdown
                    divClasses="w-full"
                    label="Country"
                    name="country_id"
                    options={countryOptions}
                    value={formData.country_id}
                    onChange={(e) => handleChange('country_id', e, false)}
                />

                <Dropdown
                    divClasses="w-full"
                    label="State"
                    name="state_id"
                    options={stateOptions}
                    value={formData.state_id}
                    onChange={(e) => handleChange('state_id', e, false)}
                />

                <Dropdown
                    divClasses="w-full"
                    label="City"
                    name="city_id"
                    options={cityOptions}
                    value={formData.city_id}
                    onChange={(e) => handleChange('city_id', e, false)}
                />

                <Input
                    divClasses="w-full"
                    label="Postal Code"
                    type="text"
                    name="postal_code"
                    value={formData.postal_code}
                    onChange={(e) => handleChange(e.target.name, e.target.value, e.target.required)}
                    placeholder="Enter postal code"
                    isMasked={false}
                    required={true}
                    errorMessage={errorMessages.postal_code}
                />

                <Input
                    divClasses="w-full"
                    label="Official Address"
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={(e) => handleChange(e.target.name, e.target.value, e.target.required)}
                    placeholder="Enter address"
                    isMasked={false}
                    required={true}
                    errorMessage={errorMessages.address}
                />
            </div>
        </Modal>
    );
};

export default VendorAddressModal;
