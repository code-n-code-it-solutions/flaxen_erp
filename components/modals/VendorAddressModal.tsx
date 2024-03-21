import React, {Fragment, useEffect, useState} from 'react';
import {Dialog, Transition} from "@headlessui/react";
import {setAuthToken} from "@/configs/api.config";
import {useDispatch, useSelector} from "react-redux";
import {ThunkDispatch} from "redux-thunk";
import {IRootState} from "@/store";
import {AnyAction} from "redux";
import Select from "react-select";
import {clearLocationState, getCities, getCountries, getStates} from "@/store/slices/locationSlice";
import {Dropdown} from '@/components/form/Dropdown';
import { Input } from "@/components/form/Input";
import  Alert  from "@/components/Alert";

interface IProps {
    vendorAddressModal: boolean;
    setVendorAddressModal: (value: boolean) => void;
    handleAddAddress: (value: any) => void;
    modalFormData?: any;
}

const VendorAddressModal = ({vendorAddressModal, setVendorAddressModal, handleAddAddress, modalFormData}: IProps) => {
    const dispatch = useDispatch<ThunkDispatch<IRootState, any, AnyAction>>();
    const {token} = useSelector((state: IRootState) => state.user);
    const {countries, states, cities} = useSelector((state: IRootState) => state.location);
    const [isActive, setIsActive] = useState<boolean>(true);
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
        is_active: true,
    });
    const [errorMessages, setErrorMessages] = useState({
        // country_id: "This field is required",
        // state_id: "This field is required",
        // city_id: "This field is required",
        postal_code: "This field is required",
        address: "This field is required",
        address_type: "This field is required"
    })
    const [isFormValid, setIsFormValid] = useState<boolean>(false);
    const [validationMessage, setValidationMessage] = useState("");
    const [addressTypeOptions] = useState([
        {value: '', label: 'Select Address Type'},
        {value: 1, label: 'Billing'},
        {value: 2, label: 'Shipping'},
        {value: 3, label: 'Both'},
        {value: 4, label: 'Other'},
    ]);
    const [countryOptions, setCountryOptions] = useState([]);
    const [stateOptions, setStateOptions] = useState([]);
    const [cityOptions, setCityOptions] = useState([]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const {name, value,required} = e.target;
        setFormData((prevFormData: any) => {
            return {...prevFormData, [name]: value};
        });
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

    const handleCountryChange = (e: any) => {
        const { name, value,required } = e.target;
        if (e && e.value && typeof e !== 'undefined') {
            setFormData((prev:any) => ({...prev, country_id: e ? e.value : 0, country_name: e ? e.label : ''}))
            dispatch(getStates(parseInt(e.value)))
        }
        // if (required) {
        //     if (!value) {
        //         setErrorMessages({ ...errorMessages, [name]: 'This field is required.' });
        //     } else {
        //         setErrorMessages({ ...errorMessages, [name]: '' });
        //     }
        // }
    }

    const handleStateChange = (e: any) => {
        const { name, value,required } = e.target;
        if (e && e.value && typeof e !== 'undefined') {
            setFormData((prev:any) => ({...prev, state_id: e ? e.value : 0, state_name: e ? e.label : ''}))
            dispatch(getCities({countryId: formData.country_id, stateId: parseInt(e.value)}))
        }
        // if (required) {
        //     if (!value) {
        //         setErrorMessages({ ...errorMessages, [name]: 'This field is required.' });
        //     } else {
        //         setErrorMessages({ ...errorMessages, [name]: '' });
        //     }
        // }
    }
    // const handleAddressTypeChange = (e: any) => {
    //     const { name, value,required } = e.target;
    //     if (required) {
    //         if (!value) {
    //             setErrorMessages({ ...errorMessages, [name]: 'This field is required.' });
    //         } else {
    //             setErrorMessages({ ...errorMessages, [name]: '' });
    //         }
    //     }
    // }

    useEffect(() => {
        if (vendorAddressModal) {
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
                is_active: true,
            });
        }
    }, [vendorAddressModal]);

    useEffect(() => {
        dispatch(clearLocationState())
        setAuthToken(token)
        dispatch(getCountries())
    }, [])

    useEffect(() => {
        if (countries) {
            setCountryOptions(countries.map((country: any) => {
                return {value: country.id, label: country.name}
            }))
        }
    }, [countries]);

    useEffect(() => {
        if (states) {
            setStateOptions(states.map((state: any) => {
                return {value: state.id, label: state.name}
            }))
        }
    }, [states]);

    useEffect(() => {
        if (cities) {
            setCityOptions(cities.map((city: any) => {
                return {value: city.id, label: city.name}
            }))
        }
    }, [cities]);

    return (
        <Transition appear show={vendorAddressModal} as={Fragment}>
            <Dialog as="div" open={vendorAddressModal} onClose={() => setVendorAddressModal(false)}>
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
                                    <div className="text-lg font-bold">{modalFormData ? 'Edit' : 'Add'} Vendor Address
                                    </div>
                                    <button type="button" className="text-white-dark hover:text-dark"
                                            onClick={() => setVendorAddressModal(false)}>
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
                            <div className='mt-7'>
                                {!isFormValid  && validationMessage &&
                                <Alert 
                                alertType="error" 
                                message={validationMessage} 
                                setMessages={setValidationMessage} 
                            />}
                            </div>
                                
                        
                                
                                <div className="p-5 space-y-5">
                                    <div className="flex flex-col gap-3 w-full">
                                        {/* <div className="w-full"> */}
                                            {/* <label htmlFor="address_type">Address Type</label> */}
                                            <Dropdown
                                                divClasses='w-full'
                                                name='address_type_id'
                                                label='Address Type'
                                                options={addressTypeOptions}
                                                value={formData.address_type}
                                                required={true}
                                                onChange={(e: any, required: any) => {
                                                    if (e) {
                                                        setFormData((prev: any) => ({
                                                            ...prev,
                                                            address_type: e.value,
                                                            address_type_name: e.label
                                                        }));
                                                    } else {
                                                        setFormData((prev: any) => ({
                                                            ...prev,
                                                            address_type: 0,
                                                            address_type_name: ''
                                                        }));
                                                    }
                                                    if (required) {
                                                        setErrorMessages((prev: any) => ({
                                                            ...prev,
                                                            address_type: e ? '' : 'This field is required.'
                                                        }));
                                                    }
                                                }}
                                                
                                                
                                                errorMessage={errorMessages.address_type}
                                            />
                                        {/* </div> */}
                                            {/* <label htmlFor="country_id">Country</label> */}
                                            <Dropdown
                                            divClasses='w-full'
                                            label='Country'
                                            name='country_id'
                                            options={countryOptions}
                                            value={formData.country_id}
                                            onChange={(e: any) => handleCountryChange(e)}
                                            // required={true}
                                            // errorMessage={errorMessages.country_id}
                                        />
                                            {/* <label htmlFor="state_id">State</label> */}
                                            <Dropdown
                                            divClasses='w-full'
                                            label='State'
                                            name='state_id'
                                            options={stateOptions}
                                            value={formData.state_id}
                                            onChange={(e: any) => handleStateChange(e)}
                                            // required={true}
                                            // errorMessage={errorMessages.state_id}
                                        />
                                            {/* <label htmlFor="city_id">City</label> */}
                                            <Dropdown
                                            divClasses='w-full'
                                            label='City'
                                            name='city_id'
                                            options={stateOptions}
                                            value={formData.city_id}
                                            onChange={(e: any,required:any) => {
                                                if (e && e.value && typeof e !== 'undefined') {
                                                    setFormData((prev:any) => ({ ...prev, city_id: e.value }))
                                                    // if (required) {
                                                    //     setErrorMessages({ ...errorMessages, city_id: '' });
                                                    // }
                                                } else {
                                                    setFormData((prev:any) => ({ ...prev, city_id: 0 }))
                                                //     if (required) {
                                                //         setErrorMessages({ ...errorMessages, city_id: 'This field is required.'});
                                                //    }
                                                }
                                            }}
                                            // required={true}
                                            // errorMessage={errorMessages.city_id}
                                            />
                                        
                                            {/* <label htmlFor="postal_code">Postal Code</label> */}
                                            <Input
                                            divClasses='w-full'
                                            label='Postal Code'
                                            type='text'
                                            name='postal_code'
                                            value={formData.postal_code}
                                            onChange={handleChange}
                                            placeholder="Enter postal code"
                                            isMasked={false}
                                            required={true}
                                            errorMessage={errorMessages.postal_code}
                                        />
                                        <Input
                                        divClasses='w-full'
                                        label='Official Address'
                                        type='text'
                                        name='address'
                                        value={formData.address}
                                        onChange={handleChange}
                                        placeholder="Enter address"
                                        isMasked={false}
                                        required={true}
                                        errorMessage={errorMessages.address}
                                    />
                                    </div>
                                    <div className="mt-8 flex items-center justify-end">
                                        <button type="button" className="btn btn-outline-danger"
                                                onClick={() => setVendorAddressModal(false)}>
                                            Discard
                                        </button>
                                        {isFormValid && <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4"
                                                onClick={() => handleAddAddress(formData)}>
                                            {modalFormData ? 'Update' : 'Add'}
                                        </button>}
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

export default VendorAddressModal;
