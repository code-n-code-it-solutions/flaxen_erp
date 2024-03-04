import React, {FC, Fragment, useEffect, useState} from 'react';
import {Dialog, Transition} from "@headlessui/react";
import {setAuthToken} from "@/configs/api.config";
import {useDispatch, useSelector} from "react-redux";
import {ThunkDispatch} from "redux-thunk";
import {IRootState} from "@/store";
import {AnyAction} from "redux";
import Select from "react-select";
import {clearLocationState, getCities, getCountries, getStates} from "@/store/slices/locationSlice";
import {MaskConfig} from "@/configs/mask.config";
import MaskedInput from "react-text-mask";
import Modal from "@/components/Modal";

interface IProps {
    modalOpen: boolean;
    setModalOpen: (value: boolean) => void;
    handleSubmit: (value: any) => void;
    modalFormData?: any;
}

const VendorRepresentativeModal: FC<IProps> = ({
                                                   modalOpen,
                                                   setModalOpen,
                                                   handleSubmit,
                                                   modalFormData
                                               }) => {
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
                is_active: true,
            });
        }
    }, [modalOpen]);

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
        <Modal
            show={modalOpen}
            setShow={setModalOpen}
            title='Add Bank'
            footer={
                <div className="mt-8 flex items-center justify-end">
                    <button type="button" className="btn btn-outline-danger"
                            onClick={() => setModalOpen(false)}>
                        Discard
                    </button>
                    <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4"
                            onClick={() => setModalOpen(formData)}>
                        {modalFormData ? 'Update' : 'Add'}
                    </button>
                </div>
            }
        >
            <div className="w-full">
                <label htmlFor="name">Bank Name</label>
                <input id="name" type="text" name="name" placeholder="Enter Bank Name"
                       value={formData.name} onChange={handleChange}
                       className="form-input"/>
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
                {/*<input id="phone" type="number" name="phone"*/}
                {/*       placeholder="Enter Bank Phone number"*/}
                {/*       value={formData.phone} onChange={handleChange}*/}
                {/*       className="form-input"/>*/}
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
        </Modal>
    );
};

export default VendorRepresentativeModal;
