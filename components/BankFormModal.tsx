import React, {Fragment, useEffect, useState} from 'react';
import {Dialog, Transition} from "@headlessui/react";
import {setAuthToken} from "@/configs/api.config";
import {useDispatch, useSelector} from "react-redux";
import {ThunkDispatch} from "redux-thunk";
import {IRootState} from "@/store";
import {AnyAction} from "redux";
import Select from "react-select";
import {clearLocationState, getCities, getCountries, getStates} from "@/store/slices/locationSlice";

interface IProps {
    bankFormModal: boolean;
    setBankFormModal: (value: boolean) => void;
    handleBankFormSubmit: (value: any) => void;
    modalFormData?: any;
}

const VendorRepresentativeModal = ({
                                       bankFormModal,
                                       setBankFormModal,
                                       handleBankFormSubmit,
                                       modalFormData
                                   }: IProps) => {
    const dispatch = useDispatch<ThunkDispatch<IRootState, any, AnyAction>>();
    const {token} = useSelector((state: IRootState) => state.user);
    const {countries, states, cities} = useSelector((state: IRootState) => state.location);

    const [image, setImage] = useState<File | null>(null);
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
        is_active: true,
    });
    const [countryOptions, setCountryOptions] = useState([]);
    const [stateOptions, setStateOptions] = useState([]);
    const [cityOptions, setCityOptions] = useState([]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const {name, value} = e.target;
        setFormData((prevFormData: any) => {
            return {...prevFormData, [name]: value};
        });
    };

    const handleCountryChange = (e: any) => {
        if (e && e.value && typeof e !== 'undefined') {
            setFormData((prev: any) => ({...prev, country_id: e ? e.value : 0, country_name: e ? e.label : ''}))
            dispatch(getStates(parseInt(e.value)))
        }
    }

    const handleStateChange = (e: any) => {
        if (e && e.value && typeof e !== 'undefined') {
            setFormData((prev: any) => ({...prev, state_id: e ? e.value : 0, state_name: e ? e.label : ''}))
            dispatch(getCities({countryId: formData.country_id, stateId: parseInt(e.value)}))
        }
    }


    useEffect(() => {
        if (bankFormModal) {
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
            });
        }
    }, [bankFormModal]);

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

    return (
        <Transition appear show={bankFormModal} as={Fragment}>
            <Dialog as="div" open={bankFormModal} onClose={() => setBankFormModal(false)}>
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
                                    <div className="text-lg font-bold">{modalFormData ? 'Edit' : 'Add'} Bank</div>
                                    <button type="button" className="text-white-dark hover:text-dark"
                                            onClick={() => setBankFormModal(false)}>
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
                                        <label htmlFor="name">Bank Name</label>
                                        <input id="name" type="text" name="name" placeholder="Enter Bank Name"
                                               value={formData.name} onChange={handleChange}
                                               className="form-input"/>
                                    </div>
                                    <div className="w-full">
                                        <label htmlFor="phone">Bank Phone (optional)</label>
                                        <input id="phone" type="number" name="phone"
                                               placeholder="Enter Bank Phone number"
                                               value={formData.phone} onChange={handleChange}
                                               className="form-input"/>
                                    </div>
                                    <div className="w-full">
                                        <label htmlFor="email">Bank Email (optional)</label>
                                        <input id="email" type="email" name="email"
                                               placeholder="Enter bank email address"
                                               value={formData.email} onChange={handleChange}
                                               className="form-input"/>
                                    </div>
                                    <div className="flex flex-col md:flex-row gap-3 w-full">
                                        <div className="w-full">
                                            <label htmlFor="country_id">Country</label>
                                            <Select
                                                defaultValue={countryOptions[0]}
                                                options={countryOptions}
                                                isSearchable={true}
                                                isClearable={true}
                                                placeholder={'Select Country'}
                                                onChange={(e: any) => handleCountryChange(e)}
                                            />
                                        </div>
                                        <div className="w-full">
                                            <label htmlFor="state_id">State</label>
                                            <Select
                                                defaultValue={stateOptions[0]}
                                                options={stateOptions}
                                                isSearchable={true}
                                                isClearable={true}
                                                placeholder={'Select State'}
                                                onChange={(e: any) => handleStateChange(e)}
                                            />
                                        </div>

                                    </div>
                                    <div className="flex flex-col md:flex-row gap-3 w-full">
                                        <div className="w-full">
                                            <label htmlFor="city_id">City</label>
                                            <Select
                                                defaultValue={cityOptions[0]}
                                                options={cityOptions}
                                                isSearchable={true}
                                                isClearable={true}
                                                placeholder={'Select City'}
                                                onChange={(e: any) => setFormData((prev: any) => ({
                                                    ...prev,
                                                    city_id: e ? e.value : 0,
                                                    city_name: e ? e.label : ''
                                                }))}
                                            />
                                        </div>
                                        <div className="w-full">
                                            <label htmlFor="postal_code">Bank Postal Code (optional)</label>
                                            <input id="postal_code" type="text" name="postal_code"
                                                   placeholder="Enter postal code"
                                                   value={formData.postal_code} onChange={handleChange}
                                                   className="form-input"/>
                                        </div>
                                    </div>

                                    <div className="w-full">
                                        <label htmlFor="address">Bank Address (optional)</label>
                                        <input id="address" type="text" name="address" placeholder="Enter address"
                                               value={formData.address} onChange={handleChange}
                                               className="form-input"/>
                                    </div>
                                    <div className="mt-8 flex items-center justify-end">
                                        <button type="button" className="btn btn-outline-danger"
                                                onClick={() => setBankFormModal(false)}>
                                            Discard
                                        </button>
                                        <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4"
                                                onClick={() => handleBankFormSubmit(formData)}>
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
    )
        ;
};

export default VendorRepresentativeModal;
