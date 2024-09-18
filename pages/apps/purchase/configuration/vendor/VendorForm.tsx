import React, { Fragment, useEffect, useState } from 'react';
import ImageUploader from '@/components/form/ImageUploader';
import { setAuthToken, setContentType } from '@/configs/api.config';
import { useAppDispatch, useAppSelector } from '@/store';
import VendorTypeFormModal from '@/components/modals/VendorTypeFormModal';
import VendorAddressModal from '@/components/modals/VendorAddressModal';
import VendorRepresentativeModal from '@/components/modals/VendorRepresentativeModal';
import { clearLocationState, getCities, getCountries, getStates } from '@/store/slices/locationSlice';
import { getVendorTypes } from '@/store/slices/vendorTypeSlice';
import { clearVendorState, storeVendor, updateVendor } from '@/store/slices/vendorSlice';
import BankDetailModal from '@/components/modals/BankDetailModal';
import { clearUtilState, generateCode } from '@/store/slices/utilSlice';
import { ButtonSize, ButtonType, ButtonVariant, FORM_CODE_TYPE, IconType } from '@/utils/enums';
import { MaskConfig } from '@/configs/mask.config';
import { Dropdown } from '@/components/form/Dropdown';
import Button from '@/components/Button';
import { Input } from '@/components/form/Input';
import { getIcon, serverFilePath } from '@/utils/helper';
import Alert from '@/components/Alert';
import IconButton from '@/components/IconButton';
import { Tab } from '@headlessui/react';

interface IFormData {
    vendor_number: string;
    name: string;
    vendor_type_id: number;
    opening_balance: number,
    phone: string,
    email: string,
    due_in_days: number,
    postal_code: string,
    website_url: string,
    tax_reg_no: string,
    address: string,
    country_id: number,
    state_id: number,
    city_id: number,
    image: File | null;
    representatives: any[];
    addresses: any[];
    bank_accounts: any[];
    is_active: boolean;
}

interface IFormProps {
    id?: any;
}

const VendorForm = ({ id }: IFormProps) => {
    const { vendorDetail } = useAppSelector(state => state.vendor);
    const dispatch = useAppDispatch();
    const { token } = useAppSelector(state => state.user);
    const { countries, states, cities } = useAppSelector(state => state.location);
    const { allVendorTypes, vendorType } = useAppSelector(state => state.vendorType);
    const { code } = useAppSelector(state => state.util);
    const { loading, success } = useAppSelector(state => state.vendor);

    const [vendorTypeModal, setVendorTypeModal] = useState<boolean>(false);
    const [vendorRepresentativeModal, setVendorRepresentativeModal] = useState<boolean>(false);
    const [vendorAddressModal, setVendorAddressModal] = useState<boolean>(false);
    const [vendorBankModal, setVendorBankModal] = useState<boolean>(false);
    const [image, setImage] = useState<File | null>(null);
    const [vendorAddresses, setVendorAddresses] = useState<any[]>([]);
    const [vendorRepresentatives, setVendorRepresentatives] = useState<any[]>([]);
    const [vendorBankAccounts, setVendorBankAccounts] = useState<any[]>([]);

    const [formData, setFormData] = useState<IFormData>({
        vendor_number: '',
        name: '',
        vendor_type_id: 0,
        opening_balance: 0,
        phone: '+971',
        email: '',
        due_in_days: 0,
        postal_code: '',
        website_url: '',
        tax_reg_no: '',
        address: '',
        country_id: 0,
        state_id: 0,
        city_id: 0,
        image: null,
        is_active: true,
        representatives: [],
        addresses: [],
        bank_accounts: []
    });
    const [imagePreview, setImagePreview] = useState('');
    const [isFormValid, setIsFormValid] = useState<boolean>(false);
    const [validationMessage, setValidationMessage] = useState('');
    const [VAddressMessage, setVAddressMessage] = useState('');
    const [VRepresentativeMessage, setVRepresentativeMessage] = useState('');
    const [errorMessages, setErrorMessages] = useState<any>({});

    const [vendorTypeOptions, setVendorTypeOptions] = useState([]);
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
            case 'vendor_type_id':
                if (value && typeof value !== 'undefined') {
                    setFormData(prev => ({ ...prev, [name]: value.value }));
                } else {
                    setFormData(prev => ({ ...prev, [name]: 0 }));
                }
                break;
            case 'country_id':
                if (value && typeof value !== 'undefined') {
                    setFormData(prev => ({ ...prev, [name]: value.value }));
                    dispatch(getStates(parseInt(value.value)));
                } else {
                    setFormData(prev => ({ ...prev, [name]: 0, state_id: 0, city_id: 0 }));
                    setStateOptions([]);
                    setCityOptions([]);
                }
                break;
            case 'state_id':
                if (value && typeof value !== 'undefined') {
                    setFormData(prev => ({ ...prev, [name]: value.value }));
                    dispatch(getCities({ countryId: formData.country_id, stateId: parseInt(value.value) }));
                } else {
                    setFormData(prev => ({ ...prev, [name]: 0, city_id: 0 }));
                    setCityOptions([]);
                }
                break;
            case 'city_id':
                if (value && typeof value !== 'undefined') {
                    setFormData(prev => ({ ...prev, [name]: value.value }));
                } else {
                    setFormData(prev => ({ ...prev, [name]: 0 }));
                }
                break;
            default:
                setFormData(prev => ({ ...prev, [name]: value }));
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

    const handleRemoveRow = (type: string, index: number) => {
        if (type === 'address') {
            setVendorAddresses(vendorAddresses.filter((_, i) => i !== index));
        } else if (type === 'representative') {
            setVendorRepresentatives(vendorRepresentatives.filter((_, i) => i !== index));
        } else if (type === 'bank') {
            setVendorBankAccounts(vendorBankAccounts.filter((_, i) => i !== index));
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setFormData(prev => ({ ...prev, image: image }));
        setAuthToken(token);
        setContentType('multipart/form-data');

        let formFinalData = {
            ...formData,
            image: image,
            representatives: vendorRepresentatives.map((representative: any) => {
                return {
                    name: representative.name,
                    phone: representative.phone,
                    email: representative.email,
                    country_id: representative.country_id,
                    state_id: representative.state_id,
                    city_id: representative.city_id,
                    address: representative.address,
                    postal_code: representative.postal_code,
                    image: representative.image,
                    is_active: true
                };
            }),

            addresses: vendorAddresses.map((address: any) => {
                return {
                    address_type: address.address_type,
                    country_id: address.country_id,
                    state_id: address.state_id,
                    city_id: address.city_id,
                    address: address.address,
                    postal_code: address.postal_code,
                    is_active: true
                };
            }),

            bank_accounts: vendorBankAccounts.map((bankAccount: any) => {
                return {
                    bank_id: bankAccount.bank_id,
                    currency_id: bankAccount.currency_id,
                    account_name: bankAccount.account_name,
                    account_number: bankAccount.account_number,
                    iban: bankAccount.iban,
                    is_active: true
                };
            })
        };
        if (id) {
            dispatch(updateVendor({ id, vendorData: formFinalData }));
        } else {
            dispatch(storeVendor(formFinalData));
        }
    };


    useEffect(() => {
        dispatch(clearLocationState());
        dispatch(clearUtilState());
        setAuthToken(token);
        dispatch(getCountries());
        dispatch(getVendorTypes());
    }, []);

    useEffect(() => {
        if (!id) {
            dispatch(generateCode(FORM_CODE_TYPE.VENDOR));
            setImagePreview(serverFilePath(''));
        }
        return () => {
            dispatch(clearVendorState());
        };
    }, [id, dispatch]);


    useEffect(() => {
        if (code) {
            setFormData(prev => ({ ...prev, vendor_number: code[FORM_CODE_TYPE.VENDOR] }));
        }
    }, [code]);

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

    useEffect(() => {
        if (allVendorTypes) {
            setVendorTypeOptions(allVendorTypes.map((vendorType: any) => {
                return { value: vendorType.id, label: vendorType.name };
            }));
        }
    }, [allVendorTypes]);

    useEffect(() => {
        if (!vendorTypeModal) {
            dispatch(getVendorTypes());
        }
    }, [vendorTypeModal]);

    useEffect(() => {
        if (vendorDetail) {
            console.log(vendorDetail);

            setImagePreview(serverFilePath(vendorDetail.thumbnail?.path));
            setFormData({
                ...formData,
                vendor_number: vendorDetail.vendor_number,
                name: vendorDetail.name,
                vendor_type_id: vendorDetail.vendor_type_id,
                opening_balance: vendorDetail.opening_balance,
                phone: vendorDetail.phone,
                email: vendorDetail.email,
                due_in_days: vendorDetail.due_in_days,
                postal_code: vendorDetail.postal_code,
                website_url: vendorDetail.website_url,
                tax_reg_no: vendorDetail.tax_reg_no,
                address: vendorDetail.address,
                country_id: vendorDetail.country_id,
                state_id: vendorDetail.state_id,
                city_id: vendorDetail.city_id,
                image: vendorDetail.image,
                // representatives: vendorDetail.representatives,
                // addresses: vendorDetail.address,
                // bank_accounts: vendorDetail.bank_accounts,
                is_active: vendorDetail.is_active

            });

            setVendorAddresses(vendorDetail.addresses.map((address: any) => {
                return {
                    id: address.id ? address.id : 0,
                    address_type: address.address_type,
                    address_type_name: address.address_type_name,
                    country_id: address.country_id,
                    country_name: address.country_name,
                    state_id: address.state_id,
                    state_name: address.state_name,
                    city_id: address.city_id,
                    city_name: address.city_name,
                    address: address.address,
                    postal_code: address.postal_code,
                    is_active: address.is_active
                };
            }));
            setVendorRepresentatives(vendorDetail.representatives.map((representative: any) => {
                return {
                    id: representative.id ? representative.id : 0,
                    name: representative.name,
                    phone: representative.phone,
                    email: representative.email,
                    country_id: representative.country_id,
                    country_name: representative.country_name,
                    state_id: representative.state_id,
                    state_name: representative.state_name,
                    city_id: representative.city_id,
                    city_name: representative.city_name,
                    address: representative.address,
                    postal_code: representative.postal_code,
                    is_active: representative.is_active
                };
            }));

            setVendorBankAccounts(vendorDetail.bank_accounts.map((bankAccount: any) => {
                return {
                    id: bankAccount.id ? bankAccount.id : 0,
                    bank_id: bankAccount.bank_id,
                    bank_name: bankAccount.bank.name,
                    currency_id: bankAccount.currency_id,
                    currency_name: bankAccount.currency.name,
                    currency_code: bankAccount.currency.code,
                    account_name: bankAccount.account_name,
                    account_number: bankAccount.account_number,
                    iban: bankAccount.iban,
                    is_active: bankAccount.is_active
                };
            }));
        } else {
            setImagePreview(serverFilePath(''));
        }
    }, [vendorDetail]);


    return (
        <form className="space-y-5" onSubmit={handleSubmit}>
            {!isFormValid && validationMessage &&
                <Alert
                    alertType="error"
                    message={validationMessage}
                    setMessages={setValidationMessage}
                />}
            {vendorRepresentatives.length === 0 && VRepresentativeMessage &&
                <Alert
                    alertType="error"
                    message={VRepresentativeMessage}
                    setMessages={setVRepresentativeMessage}
                />}
            {vendorAddresses.length === 0 && VAddressMessage &&
                <Alert
                    alertType="error"
                    message={VAddressMessage}
                    setMessages={setVAddressMessage}
                />}

            {/*<div className="flex justify-center items-center">*/}
            {/*    <ImageUploader image={image} setImage={setImage} existingImage={imagePreview} />*/}
            {/*</div>*/}

            <div className="flex flex-col md:flex-row md:justify-between md:items-start md:gap-3">
                <div className="w-full space-y-3">
                    <div className="flex justify-center items-end gap-3 w-full">
                        <Dropdown
                            divClasses="w-full"
                            label="Vendor Type"
                            name="vendor_type_id"
                            options={vendorTypeOptions}
                            value={formData.vendor_type_id}
                            required={true}
                            errorMessage={errorMessages.vendor_type_id}
                            onChange={(e: any) => handleChange('vendor_type_id', e, true)}
                        />
                        <Button
                            type={ButtonType.button}
                            text={getIcon(IconType.add)}
                            variant={ButtonVariant.primary}
                            onClick={() => setVendorTypeModal(true)}
                        />
                    </div>

                    <Input
                        divClasses="w-full"
                        label="Vendor Number"
                        type="text"
                        name="vendor_number"
                        value={formData.vendor_number}
                        onChange={(e: any) => handleChange(e.target.name, e.target.value, e.target.required)}
                        placeholder="Enter Vendor Code"
                        isMasked={false}
                        disabled={true}
                    />

                    <Input
                        divClasses="w-full"
                        label="Vendor Name"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={(e: any) => handleChange(e.target.name, e.target.value, e.target.required)}
                        placeholder="Enter Vendor Name"
                        isMasked={false}
                        styles={{ height: 45 }}
                        required={true}
                        errorMessage={errorMessages.name}
                    />
                </div>
                <div className="w-full flex justify-end">
                    <ImageUploader image={image} setImage={setImage} existingImage={imagePreview} />
                </div>
            </div>
            <div className="flex justify-start flex-col items-start space-y-3 w-full">


                <div className="w-full">
                    <Tab.Group>
                        <Tab.List className="mt-3 flex flex-wrap border-b border-white-light dark:border-[#191e3a]">
                            <Tab as={Fragment}>
                                {({ selected }) => (
                                    <button
                                        className={`${
                                            selected ? '!border-white-light !border-b-white  text-primary !outline-none dark:!border-[#191e3a] dark:!border-b-black ' : ''
                                        } -mb-[1px] block border border-transparent p-3.5 py-2 hover:text-primary dark:hover:border-b-black`}
                                    >
                                        Basic
                                    </button>
                                )}
                            </Tab>
                            <Tab as={Fragment}>
                                {({ selected }) => (
                                    <button
                                        className={`${
                                            selected ? '!border-white-light !border-b-white  text-primary !outline-none dark:!border-[#191e3a] dark:!border-b-black ' : ''
                                        } -mb-[1px] block border border-transparent p-3.5 py-2 hover:text-primary dark:hover:border-b-black`}
                                    >
                                        Representatives
                                    </button>
                                )}
                            </Tab>
                            <Tab as={Fragment}>
                                {({ selected }) => (
                                    <button
                                        className={`${
                                            selected ? '!border-white-light !border-b-white  text-primary !outline-none dark:!border-[#191e3a] dark:!border-b-black ' : ''
                                        } -mb-[1px] block border border-transparent p-3.5 py-2 hover:text-primary dark:hover:border-b-black`}
                                    >
                                        Addresses
                                    </button>
                                )}
                            </Tab>
                            <Tab as={Fragment}>
                                {({ selected }) => (
                                    <button
                                        className={`${
                                            selected ? '!border-white-light !border-b-white  text-primary !outline-none dark:!border-[#191e3a] dark:!border-b-black ' : ''
                                        } -mb-[1px] block border border-transparent p-3.5 py-2 hover:text-primary dark:hover:border-b-black`}
                                    >
                                        Bank Accounts
                                    </button>
                                )}
                            </Tab>
                        </Tab.List>
                        <Tab.Panels className="rounded-none py-3">
                            <Tab.Panel>
                                <div className="active grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <Input
                                        divClasses="w-full"
                                        label="Opening Balance"
                                        type="number"
                                        name="opening_balance"
                                        value={formData.opening_balance.toString()}
                                        onChange={(e: any) => handleChange(e.target.name, e.target.value, e.target.required)}
                                        placeholder="Enter Opening Balance"
                                        isMasked={false}
                                        required={true}
                                        errorMessage={errorMessages.opening_balance}
                                    />

                                    <Input
                                        divClasses="w-full"
                                        label="Phone"
                                        type="text"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={(e: any) => handleChange(e.target.name, e.target.value, e.target.required)}
                                        placeholder={MaskConfig.phone.placeholder}
                                        isMasked={true}
                                        maskPattern={MaskConfig.phone.pattern}
                                        required={true}
                                        errorMessage={errorMessages.phone}
                                    />

                                    <Input
                                        divClasses="w-full"
                                        label="Email"
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={(e: any) => handleChange(e.target.name, e.target.value, e.target.required)}
                                        placeholder="Enter email address"
                                        isMasked={false}
                                        required={true}
                                        errorMessage={errorMessages.email}
                                    />
                                    <Input
                                        divClasses="w-full"
                                        label="Due In (Days)"
                                        type="text"
                                        name="due_in_days"
                                        value={formData.due_in_days.toString()}
                                        onChange={(e: any) => handleChange(e.target.name, e.target.value, e.target.required)}
                                        placeholder="Enter due in days"
                                        isMasked={false}
                                        required={true}
                                        errorMessage={errorMessages.due_in_days}
                                    />

                                    <Input
                                        divClasses="w-full"
                                        label="Website"
                                        type="text"
                                        name="website_url"
                                        value={formData.website_url}
                                        onChange={(e: any) => handleChange(e.target.name, e.target.value, e.target.required)}
                                        placeholder="Enter Vendor Website"
                                        isMasked={false}
                                        required={true}
                                        errorMessage={errorMessages.website_url}
                                    />

                                    <Input
                                        divClasses="w-full"
                                        label="Tax Reg No"
                                        type="text"
                                        name="tax_reg_no"
                                        value={formData.tax_reg_no}
                                        onChange={(e: any) => handleChange(e.target.name, e.target.value, e.target.required)}
                                        placeholder="Enter tax regiration no"
                                        isMasked={false}
                                        required={true}
                                        errorMessage={errorMessages.tax_reg_no}
                                    />
                                    <Dropdown
                                        divClasses="w-full"
                                        label="Country"
                                        name="country_id"
                                        options={countryOptions}
                                        value={formData.country_id}
                                        onChange={(e: any) => handleChange('country_id', e, false)}
                                    />

                                    <Dropdown
                                        divClasses="w-full"
                                        label="State"
                                        name="state_id"
                                        options={stateOptions}
                                        value={formData.state_id}
                                        onChange={(e: any) => handleChange('state_id', e, false)}
                                    />

                                    <Dropdown
                                        divClasses="w-full"
                                        label="City"
                                        name="city_id"
                                        options={cityOptions}
                                        value={formData.city_id}
                                        onChange={(e: any) => handleChange('city_id', e, false)}
                                    />
                                    <Input
                                        divClasses="w-full md:col-span-1"
                                        label="Postal Code"
                                        type="text"
                                        name="postal_code"
                                        value={formData.postal_code}
                                        onChange={(e: any) => handleChange(e.target.name, e.target.value, e.target.required)}
                                        placeholder="Enter postal code"
                                        isMasked={false}
                                        required={true}
                                        errorMessage={errorMessages.postal_code}
                                    />

                                    <Input
                                        divClasses="w-full md:col-span-2"
                                        label="Official Address"
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={(e: any) => handleChange(e.target.name, e.target.value, e.target.required)}
                                        placeholder="Enter address"
                                        isMasked={false}
                                        required={true}
                                        errorMessage={errorMessages.address}
                                    />
                                </div>
                            </Tab.Panel>
                            <Tab.Panel>
                                <div className="table-responsive w-full">
                                    <div
                                        className="flex justify-between items-center flex-col md:flex-row space-y-3 md:space-y-0 mb-3">
                                        <h3 className="text-lg font-semibold">Vendor Representatives</h3>
                                        <Button
                                            text="Add Representative"
                                            variant={ButtonVariant.primary}
                                            size={ButtonSize.small}
                                            onClick={() => setVendorRepresentativeModal(true)}
                                        />
                                    </div>
                                    <table>
                                        <thead>
                                        <tr>
                                            <th>Phone</th>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Country</th>
                                            <th>State</th>
                                            <th>City</th>
                                            <th>Address</th>
                                            <th>Postal Code</th>
                                            <th>Action</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {vendorRepresentatives.map((representative, index) => (
                                            <tr key={index}>
                                                <td>{representative.phone}</td>
                                                <td>{representative.name}</td>
                                                <td>{representative.email}</td>
                                                <td>{representative.country_name}</td>
                                                <td>{representative.state_name}</td>
                                                <td>{representative.city_name}</td>
                                                <td>{representative.address}</td>
                                                <td>{representative.postal_code}</td>
                                                <td>
                                                    <IconButton
                                                        icon={IconType.delete}
                                                        color={ButtonVariant.danger}
                                                        tooltip="Delete"
                                                        onClick={() => handleRemoveRow('representative', index)}
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            </Tab.Panel>
                            <Tab.Panel>
                                <div className="table-responsive w-full">
                                    <div
                                        className="flex justify-between items-center flex-col md:flex-row space-y-3 md:space-y-0 mb-3">
                                        <h3 className="text-lg font-semibold">Vendor Addresses</h3>

                                        <Button
                                            text="Add Address"
                                            variant={ButtonVariant.primary}
                                            size={ButtonSize.small}
                                            onClick={() => setVendorAddressModal(true)}
                                        />
                                    </div>
                                    <table>
                                        <thead>
                                        <tr>
                                            <th>Address Type</th>
                                            <th>Country</th>
                                            <th>State</th>
                                            <th>City</th>
                                            <th>Address</th>
                                            <th>Postal Code</th>
                                            <th>Action</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {vendorAddresses.map((address, index) => (
                                            <tr key={index}>
                                                <td>{address.address_type_name}</td>
                                                <td>{address.country_name}</td>
                                                <td>{address.state_name}</td>
                                                <td>{address.city_name}</td>
                                                <td>{address.address}</td>
                                                <td>{address.postal_code}</td>
                                                <td>
                                                    <IconButton
                                                        icon={IconType.delete}
                                                        color={ButtonVariant.danger}
                                                        tooltip="Delete"
                                                        onClick={() => handleRemoveRow('address', index)}
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            </Tab.Panel>
                            <Tab.Panel>
                                <div className="table-responsive w-full">
                                    <div
                                        className="flex justify-between items-center flex-col md:flex-row space-y-3 md:space-y-0 mb-3">
                                        <h3 className="text-lg font-semibold">Vendor Bank Accounts</h3>

                                        <Button
                                            text="Add Bank Details"
                                            variant={ButtonVariant.primary}
                                            size={ButtonSize.small}
                                            onClick={() => setVendorBankModal(true)}
                                        />
                                    </div>
                                    <table>
                                        <thead>
                                        <tr>
                                            <th>Bank</th>
                                            <th>Account No</th>
                                            <th>Account Title</th>
                                            <th>IBAN No</th>
                                            <th>Currency</th>
                                            <th>Action</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {vendorBankAccounts.map((bankAccount, index) => (
                                            <tr key={index}>
                                                <td>{bankAccount.bank_name}</td>
                                                <td>{bankAccount.account_number}</td>
                                                <td>{bankAccount.account_name}</td>
                                                <td>{bankAccount.iban}</td>
                                                <td>
                                                    {bankAccount.currency_name + ' (' + bankAccount.currency_code + ')'}
                                                </td>
                                                <td>
                                                    <IconButton
                                                        icon={IconType.delete}
                                                        color={ButtonVariant.danger}
                                                        tooltip="Delete"
                                                        onClick={() => handleRemoveRow('bank', index)}
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            </Tab.Panel>
                        </Tab.Panels>
                    </Tab.Group>
                </div>

                <div className="w-full">
                    <Button
                        type={ButtonType.submit}
                        disabled={loading}
                        text={loading ? 'Loading...' : id ? 'Update Vendor' : 'Save Vendor'}
                        variant={ButtonVariant.primary}
                    />
                </div>

                <VendorTypeFormModal
                    modalOpen={vendorTypeModal}
                    setModalOpen={setVendorTypeModal}
                />

                <VendorAddressModal
                    modalOpen={vendorAddressModal}
                    setModalOpen={setVendorAddressModal}
                    handleSubmit={(value) => {
                        setVendorAddresses([...vendorAddresses, { id: 0, ...value }]);
                        setVendorAddressModal(false);
                    }}
                />

                <VendorRepresentativeModal
                    modalOpen={vendorRepresentativeModal}
                    setModalOpen={setVendorRepresentativeModal}
                    modalFormData={{}}
                    handleSubmit={(value: any) => {
                        setVendorRepresentatives([...vendorRepresentatives, { id: 0, ...value }]);
                        setVendorRepresentativeModal(false);
                    }}
                />

                <BankDetailModal
                    title="Vendor"
                    modalOpen={vendorBankModal}
                    setModalOpen={setVendorBankModal}
                    handleSubmit={(value: any) => {
                        setVendorBankAccounts([...vendorBankAccounts, { id: 0, ...value }]);
                        setVendorBankModal(false);
                    }}
                />
            </div>
        </form>
    );
};

export default VendorForm;
