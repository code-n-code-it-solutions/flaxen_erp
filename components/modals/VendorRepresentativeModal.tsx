import React, {Fragment, useEffect, useState} from 'react';
import {Dialog, Transition} from "@headlessui/react";
import {setAuthToken} from "@/configs/api.config";
import {useDispatch, useSelector} from "react-redux";
import {ThunkDispatch} from "redux-thunk";
import {IRootState} from "@/store";
import {AnyAction} from "redux";
import Select from "react-select";
import ImageUploader from "@/components/form/ImageUploader";
import {clearLocationState, getCities, getCountries, getStates} from "@/store/slices/locationSlice";
import {MaskConfig} from "@/configs/mask.config";
import MaskedInput from "react-text-mask";
import { Input } from "@/components/form/Input";
import {Dropdown} from "@/components/form/Dropdown";
import Alert from '@/components/Alert';

interface IProps {
    vendorRepresentativeModal: boolean;
    setVendorRepresentativeModal: (value: boolean) => void;
    handleAddRepresentative: (value: any) => void;
    modalFormData?: any;
}

const VendorRepresentativeModal = ({
                                       vendorRepresentativeModal,
                                       setVendorRepresentativeModal,
                                       handleAddRepresentative,
                                       modalFormData
                                   }: IProps) => {
    const dispatch = useDispatch<ThunkDispatch<IRootState, any, AnyAction>>();
    const {token} = useSelector((state: IRootState) => state.user);
    const {countries, states, cities} = useSelector((state: IRootState) => state.location);

    const [image, setImage] = useState<File | null>(null);
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

    const [errorMessages, setErrorMessages] = useState({
        // vendor_number: 'This field is required',
        name: 'This field is required',
        // vendor_type_id: 'This field is required',
        // opening_balance: 'This field is required',
        // phone: 'This field is required',
        email: 'This field is required',
        // due_in_days: 'This field is required',
        // website_url: 'This field is required',
        // tax_reg_no: 'This field is required',
        // country_id: 'This field is required',
        // state_id: 'This field is required',
        // city_id: 'This field is required',
        postal_code: 'This field is required',
        address: 'This field is required',
    });
    const [isFormValid, setIsFormValid] = useState<boolean>(false);
    const [validationMessage, setValidationMessage] = useState("");

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
        console.log('Required',required);
    };

    

    const handleCountryChange = (e: any) => {
        // const { name, value,required } = e.target;
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


    useEffect(() => {
        if (vendorRepresentativeModal) {
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
            setImage(null);
        }
    }, [vendorRepresentativeModal]);

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
        console.log('Error Messages:', errorMessages);
        console.log('isFormValid:', !isValid);
        if (isValid) {
            setValidationMessage('Please fill all the required fields.');
        }
    }, [errorMessages]);

    return (
        <Transition appear show={vendorRepresentativeModal} as={Fragment}>
            <Dialog as="div" open={vendorRepresentativeModal} onClose={() => setVendorRepresentativeModal(false)}>
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
                                    <div className="text-lg font-bold">{modalFormData ? 'Edit' : 'Add'} Representative</div>
                                    <button type="button" className="text-white-dark hover:text-dark"
                                            onClick={() => setVendorRepresentativeModal(false)}>
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
                                    {!isFormValid && validationMessage && 
                                    <Alert 
                                      alertType="error" 
                                      message={validationMessage} 
                                      setMessages={setValidationMessage} 
                                    />}
                                    <div className="w-full">
                                        {/* <label htmlFor="name">Vendor Name</label> */}
                                        <Input 
                                        label='Vendor Name'
                                        type="text" 
                                        name="name" 
                                        placeholder="Enter Vendor Name"
                                        value={formData.name} 
                                        onChange={handleChange}
                                        isMasked={false}
                                        errorMessage={errorMessages.name}
                                        required={true}
                                    />
                                    </div>
                                    <div className="w-full">
                                        <label htmlFor="phone">Phone</label>
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
                                            // errorMessage={errorMessages.phone}
                                            // required={true}
                                        />
                                        {/*<input id="phone" type="number" name="phone" placeholder="Enter Phone number"*/}
                                        {/*       value={formData.phone} onChange={handleChange}*/}
                                        {/*       className="form-input"/>*/}
                                    </div>
                                    <div className="w-full">
                                        {/* <label htmlFor="email">Email</label> */}
                                        <Input 
                                        label='Email'
                                        type="email" 
                                        name="email" 
                                        placeholder="Enter email address"
                                        value={formData.email} 
                                        onChange={handleChange}
                                        errorMessage={errorMessages.email}
                                        required={true}
                                        isMasked={false}
                                        />
                                    </div>
                                    <div className="flex flex-col md:flex-row gap-3 w-full">
                                        {/* <div className="w-full"> */}
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
                                        {/* </div> */}
                                        {/* <div className="w-full"> */}
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
                                        {/* </div> */}
                                    </div>
                                    <div className="flex flex-col md:flex-row gap-3 w-full">
                                        {/* <div className="w-full"> */}
                                            {/* <label htmlFor="city_id">City</label> */}
                                            <Dropdown
                                            divClasses='w-full'
                                            label='City'
                                            name='city_id'
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
                                        {/* </div> */}
                                        <div className="w-full">
                                            {/* <label htmlFor="postal_code">Postal Code</label> */}
                                            <Input 
                                            label="Postal Code" 
                                            type="text" 
                                            name="postal_code"
                                            placeholder="Enter postal code"
                                            value={formData.postal_code} onChange={handleChange}
                                            errorMessage={errorMessages.postal_code}
                                            required={true}
                                            isMasked={false}
                                            />
                                        </div>
                                    </div>

                                    <div className="w-full">
                                        {/* <label htmlFor="address">Official Address</label> */}
                                        <Input 
                                        label="Official Address" 
                                        type="text" 
                                        name="address" 
                                        placeholder="Enter address"
                                        value={formData.address} 
                                        onChange={handleChange}
                                        errorMessage={errorMessages.address}
                                        required={true}
                                        isMasked={false}
                                            />
                                    </div>
                                    <div className="mt-8 flex items-center justify-end">
                                        <button type="button" className="btn btn-outline-danger"
                                                onClick={() => setVendorRepresentativeModal(false)}>
                                            Discard
                                        </button>
                                        {isFormValid && (
                                        <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4"
                                                  onClick={() => handleAddRepresentative({...formData, image})}>
                                              {modalFormData ? 'Update' : 'Add'}
                                       </button>
                                      )}
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
        ;
};

export default VendorRepresentativeModal;
