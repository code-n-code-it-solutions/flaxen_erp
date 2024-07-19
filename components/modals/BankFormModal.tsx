import React, { FC, useEffect, useState } from 'react';
import { setAuthToken } from '@/configs/api.config';
import { useAppDispatch, useAppSelector } from '@/store';
import { clearLocationState, getCities, getCountries, getStates } from '@/store/slices/locationSlice';
import { MaskConfig } from '@/configs/mask.config';
import MaskedInput from 'react-text-mask';
import Modal from '@/components/Modal';
import { Input } from '@/components/form/Input';
import { Dropdown } from '@/components/form/Dropdown';

interface IProps {
    modalOpen: boolean;
    setModalOpen: (value: boolean) => void;
    handleSubmit: (value: any) => void;
    modalFormData?: any;
}

const BankFormModal: FC<IProps> = ({
                                       modalOpen,
                                       setModalOpen,
                                       handleSubmit,
                                       modalFormData
                                   }) => {
    const dispatch = useAppDispatch();
    const { token } = useAppSelector((state) => state.user);
    const { countries, states, cities } = useAppSelector((state) => state.location);

    const [formData, setFormData] = useState<any>({
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
        is_active: true
    });
    const [isFormValid, setIsFormValid] = useState<boolean>(false);
    const [validationMessage, setValidationMessage] = useState('');
    const [countryOptions, setCountryOptions] = useState([]);
    const [stateOptions, setStateOptions] = useState([]);
    const [cityOptions, setCityOptions] = useState([]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, required } = e.target;
        setFormData((prevFormData: any) => {
            return { ...prevFormData, [name]: value };
        });

        // if (required) {
        //     if (!value) {
        //         setErrorMessages({ ...errorMessages, [name]: 'This field is required.' });
        //     } else {
        //         setErrorMessages({ ...errorMessages, [name]: '' });
        //     }
        // }
    };

    const handleCountryChange = (e: any) => {
        const { name, value, required } = e.target;
        if (e && e.value && typeof e !== 'undefined') {
            setFormData((prev: any) => ({ ...prev, country_id: e ? e.value : 0, country_name: e ? e.label : '' }));
            dispatch(getStates(parseInt(e.value)));
        }
        // if (required) {
        //     if (!value) {
        //         setErrorMessages({ ...errorMessages, [name]: 'This field is required.' });
        //     } else {
        //         setErrorMessages({ ...errorMessages, [name]: '' });
        //     }
        // }
    };

    const handleStateChange = (e: any) => {
        const { name, value, required } = e.target;
        if (e && e.value && typeof e !== 'undefined') {
            setFormData((prev: any) => ({ ...prev, state_id: e ? e.value : 0, state_name: e ? e.label : '' }));
            dispatch(getCities({ countryId: formData.country_id, stateId: parseInt(e.value) }));
        }
        // if (required) {
        //     if (!value) {
        //         setErrorMessages({ ...errorMessages, [name]: 'This field is required.' });
        //     } else {
        //         setErrorMessages({ ...errorMessages, [name]: '' });
        //     }
        // }
    };

    useEffect(() => {
        if (modalOpen) {
            setFormData({
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
            setStateOptions([]);
            setCityOptions([]);
        }
    }, [countries]);

    useEffect(() => {
        if (states) {
            setStateOptions(states.map((state: any) => {
                return { value: state.id, label: state.name };
            }));
            setCityOptions([]);
        }
    }, [states]);

    useEffect(() => {
        if (cities) {
            setCityOptions(cities.map((city: any) => {
                return { value: city.id, label: city.name };
            }));
        }
    }, [cities]);

    // useEffect(() => {
    //     const isValid = Object.values(errorMessages).some(message => message !== '');
    //     setIsFormValid(!isValid);
    //     // console.log('Error Messages:', errorMessages);
    //     // console.log('isFormValid:', !isValid);
    //     if(isValid){
    //         setValidationMessage("Please fill the required field.");
    //     }
    // }, [errorMessages]);

    return (
        <Modal
            show={modalOpen}
            setShow={setModalOpen}
            title="Add Bank"
            footer={
                <div className="mt-8 flex items-center justify-end">
                    <button type="button" className="btn btn-outline-danger"
                            onClick={() => setModalOpen(false)}>
                        Discard
                    </button>
                    <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4"
                            onClick={() => handleSubmit(formData)}>
                        {modalFormData ? 'Update' : 'Add'}
                    </button>
                </div>
            }
        >
            {/* {!isFormValid  && validationMessage &&
                                      <Alert
                                       alertType="error"
                                       message={validationMessage}
                                       setMessages={setValidationMessage}
                                       />} */}
            <div className="w-full">
                <Input
                    label="Bank Name"
                    type="text"
                    name="name"
                    placeholder="Enter Bank Name"
                    isMasked={false}
                    value={formData.name} onChange={handleChange}
                    //  required={true}
                    //  errorMessage={errorMessages.name}
                />
            </div>
            <div className="w-full">
                <label htmlFor="phone">Bank Phone (optional)</label>
                <MaskedInput
                    id="phone"
                    type="text"
                    placeholder={MaskConfig.phone.placeholder}
                    className="form-input"
                    guide={true}
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    mask={MaskConfig.phone.pattern}
                />
            </div>
            <div className="w-full">
                <label htmlFor="email">Bank Email (optional)</label>
                <input id="email" type="email" name="email"
                       placeholder="Enter bank email address"
                       value={formData.email} onChange={handleChange}
                       className="form-input" />
            </div>
            <div className="flex flex-col md:flex-row gap-3 w-full">
                <div className="w-full">
                    <Dropdown
                        divClasses="w-full"
                        label="Country"
                        name="country_id"
                        options={countryOptions}
                        value={formData.country_id}
                        onChange={(e: any) => handleCountryChange(e)}
                        // required={true}
                        // errorMessage={errorMessages.country_id}
                    />
                </div>
                <div className="w-full">
                    <Dropdown
                        divClasses="w-full"
                        label="State"
                        name="state_id"
                        options={stateOptions}
                        value={formData.state_id}
                        onChange={(e: any) => handleStateChange(e)}
                        // required={true}
                        // errorMessage={errorMessages.state_id}
                    />
                </div>

            </div>
            <div className="flex flex-col md:flex-row gap-3 w-full">
                <div className="w-full">
                    <Dropdown
                        divClasses="w-full"
                        label="City"
                        name="city_id"
                        options={stateOptions}
                        value={formData.city_id}
                        onChange={(e: any) => {
                            if (e) {
                                setFormData((prev: any) => ({
                                    ...prev,
                                    city_id: e.value,
                                    city_name: e.label
                                }));
                            } else {
                                setFormData((prev: any) => ({
                                    ...prev,
                                    city_id: 0,
                                    city_name: ''
                                }));
                            }

                            // Check for required field validation
                            // const { name, value, required } = e.target;
                            // if (required) {
                            //     if (!value) {
                            //         setErrorMessages({ ...errorMessages, [name]: 'This field is required.' });
                            //     } else {
                            //         setErrorMessages({ ...errorMessages, [name]: '' });
                            //     }
                            // }
                        }}

                        // required={true}
                        // errorMessage={errorMessages.city_id}
                    />
                </div>
                <div className="w-full">
                    <label htmlFor="postal_code">Bank Postal Code (optional)</label>
                    <input id="postal_code" type="text" name="postal_code"
                           placeholder="Enter postal code"
                           value={formData.postal_code} onChange={handleChange}
                           className="form-input" />
                </div>
            </div>

            <div className="w-full">
                <label htmlFor="address">Bank Address (optional)</label>
                <input id="address" type="text" name="address" placeholder="Enter address"
                       value={formData.address} onChange={handleChange}
                       className="form-input" />
            </div>
        </Modal>
    );
};

export default BankFormModal;
