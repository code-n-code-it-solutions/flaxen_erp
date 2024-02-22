import React, {useEffect, useState} from 'react';
import ImageUploader from "@/components/ImageUploader";
import {setAuthToken, setContentType} from "@/configs/api.config";
import {useDispatch, useSelector} from "react-redux";
import {ThunkDispatch} from "redux-thunk";
import {IRootState} from "@/store";
import {AnyAction} from "redux";
import Select from "react-select";
import VendorTypeFormModal from "@/components/VendorTypeFormModal";
import VendorAddressModal from "@/components/VendorAddressModal";
import VendorRepresentativeModal from "@/components/VendorRepresentativeModal";
import {clearLocationState, getCities, getCountries, getStates} from "@/store/slices/locationSlice";
import {getVendorTypes, storeVendorType} from "@/store/slices/vendorTypeSlice";
import {clearVendorState, storeVendor} from "@/store/slices/vendorSlice";
import {useRouter} from "next/router";
import BankDetailModal from "@/components/BankDetailModal";
import {clearUtilState, generateCode} from "@/store/slices/utilSlice";
import {FORM_CODE_TYPE} from "@/utils/enums";

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

interface IRepresentative {
    name: string;
    phone: string;
    email: string;
    country_id: number;
    country_name: string;
    state_id: number;
    state_name: string;
    city_id: number;
    city_name: string;
    address: string;
    postal_code: string;
    is_active: boolean;
}

interface IAddress {
    address_type: number;
    address_type_name: string;
    country_id: number;
    country_name: string;
    state_id: number;
    state_name: string;
    city_id: number;
    city_name: string;
    address: string;
    postal_code: string;
    is_active: boolean;
}

interface IBankAccount {
    bank_id: number;
    bank_name: string;
    currency_id: number;
    currency_name: string;
    currency_code: string;
    account_name: string;
    account_number: string;
    iban: string;
}

interface IFormProps {
    id?: any
}

const VendorForm = ({id}: IFormProps) => {
    const router = useRouter();
    const dispatch = useDispatch<ThunkDispatch<IRootState, any, AnyAction>>();
    const {token} = useSelector((state: IRootState) => state.user);
    const {countries, states, cities} = useSelector((state: IRootState) => state.location);
    const {allVendorTypes, vendorType} = useSelector((state: IRootState) => state.vendorType);
    const {code} = useSelector((state: IRootState) => state.util);
    const {allVendors, vendor, loading, success} = useSelector((state: IRootState) => state.vendor);

    const [vendorTypeModal, setVendorTypeModal] = useState<boolean>(false);
    const [vendorRepresentativeModal, setVendorRepresentativeModal] = useState<boolean>(false);
    const [vendorAddressModal, setVendorAddressModal] = useState<boolean>(false);
    const [vendorBankModal, setVendorBankModal] = useState<boolean>(false);
    const [image, setImage] = useState<File | null>(null);
    const [vendorTypeId, setVendorTypeId] = useState<any>(null);
    const [vendorAddresses, setVendorAddresses] = useState<IAddress[]>([]);
    const [vendorRepresentatives, setVendorRepresentatives] = useState<IRepresentative[]>([]);
    const [vendorBankAccounts, setVendorBankAccounts] = useState<IBankAccount[]>([]);

    const [formData, setFormData] = useState<IFormData>({
        vendor_number: '',
        name: '',
        vendor_type_id: 0,
        opening_balance: 0,
        phone: '',
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

    const [vendorTypeOptions, setVendorTypeOptions] = useState([]);
    const [countryOptions, setCountryOptions] = useState([]);
    const [stateOptions, setStateOptions] = useState([]);
    const [cityOptions, setCityOptions] = useState([]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const {name, value} = e.target;
        setFormData(prevFormData => {
            return {...prevFormData, [name]: value};
        });
    };

    const handleCountryChange = (e: any) => {
        if (e && e.value && typeof e !== 'undefined') {
            setFormData(prev => ({...prev, country_id: e ? e.value : 0}))
            dispatch(getStates(parseInt(e.value)))
        }
    }

    const handleStateChange = (e: any) => {
        if (e && e.value && typeof e !== 'undefined') {
            setFormData(prev => ({...prev, state_id: e ? e.value : 0}))
            dispatch(getCities({countryId: formData.country_id, stateId: parseInt(e.value)}))
        }
    }

    const handleVendorSubmit = (value: any) => {
        dispatch(storeVendorType({
            name: value.name,
            description: value.description,
            is_active: value.is_active
        }))
    }

    const handleAddressRowDelete = (index: number) => {
        const newAddresses = vendorAddresses.filter((address, i) => i !== index);
        setVendorAddresses(newAddresses);
    }

    const handleRepresentativeRowDelete = (index: number) => {
        const newVendorRepresentatives = vendorRepresentatives.filter((address, i) => i !== index);
        setVendorRepresentatives(newVendorRepresentatives);
    }

    const handleRemoveBank = (index: number) => {
        const newVendorBankAccounts = vendorBankAccounts.filter((address, i) => i !== index);
        setVendorBankAccounts(newVendorBankAccounts);
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFormData(prev => ({...prev, image: image}))
        setAuthToken(token)
        setContentType('multipart/form-data')
        let formFinalData = {
            ...formData,
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
                }
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
                }
            }),
            bank_accounts: vendorBankAccounts.map((bankAccount: any) => {
                return {
                    bank_id: bankAccount.bank_id,
                    currency_id: bankAccount.currency_id,
                    account_name: bankAccount.account_name,
                    account_number: bankAccount.account_number,
                    iban: bankAccount.iban,
                    is_active: true
                }
            })
        }
        if (id) {
            // dispatch(updateRawProduct(id, formData));
        } else {
            dispatch(storeVendor(formFinalData));
        }
    };

    useEffect(() => {
        dispatch(clearLocationState())
        dispatch(clearUtilState())
        setAuthToken(token)
        dispatch(getCountries())
        dispatch(getVendorTypes())
        dispatch(generateCode(FORM_CODE_TYPE.VENDOR))
    }, [])

    useEffect(() => {
        if (code) {
            setFormData(prev => ({...prev, vendor_number: code}))
        }
    }, [code])

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

    useEffect(() => {
        if (allVendorTypes) {
            setVendorTypeOptions(allVendorTypes.map((vendorType: any) => {
                return {value: vendorType.id, label: vendorType.name}
            }))
        }
    }, [allVendorTypes]);

    useEffect(() => {
        if (vendorType) {
            setVendorTypeModal(false)
            dispatch(getVendorTypes())
        }
    }, [vendorType]);

    useEffect(() => {
        if (vendor && success) {
            router.push('/admin/vendors')
            dispatch(clearVendorState())
        }
    }, [vendor, success])

    return (
        <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="flex justify-center items-center">
                <ImageUploader image={image} setImage={setImage}/>
            </div>
            <div className="flex justify-start flex-col items-start space-y-3">
                <div className='flex justify-center items-end gap-2 w-full md:w-1/3'>
                    <div className='w-full'>
                        <label htmlFor="vendor_type_id">Vendor Type</label>
                        <Select
                            defaultValue={vendorTypeOptions[0]}
                            options={vendorTypeOptions}
                            isSearchable={true}
                            isClearable={true}
                            placeholder={'Select Vendor Type'}
                            onChange={(e: any) => setFormData(prev => ({...prev, vendor_type_id: e ? e.value : 0}))}
                        />
                    </div>
                    <button type="button" className="btn btn-primary btn-sm flex justify-center items-center"
                            onClick={() => setVendorTypeModal(true)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                             className="h-5 w-5 ltr:mr-2 rtl:ml-2"
                             fill="none">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
                            <path d="M15 12L12 12M12 12L9 12M12 12L12 9M12 12L12 15" stroke="currentColor"
                                  strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                    </button>
                </div>
                <div className="w-full md:w-1/3">
                    <label htmlFor="vendor_number">Vendor Number</label>
                    <input id="vendor_number" type="text" name="vendor_number" placeholder="Enter Vendor Code"
                           value={formData.vendor_number} onChange={handleChange} disabled={true}
                           className="form-input"/>
                </div>
                <div className="w-full md:w-1/2">
                    <label htmlFor="name">Vendor Name</label>
                    <input id="name" type="text" name="name" placeholder="Enter Vendor Name"
                           value={formData.name} onChange={handleChange}
                           className="form-input" style={{height: 45}}/>
                </div>
                <div className="flex flex-col md:flex-row gap-3 w-full">
                    <div className="w-full">
                        <label htmlFor="opening_balance">Opening Balance</label>
                        <input id="opening_balance" type="number" name="opening_balance"
                               placeholder="Enter Opening Balance"
                               value={formData.opening_balance} onChange={handleChange}
                               className="form-input"/>
                    </div>
                    <div className="w-full">
                        <label htmlFor="phone">Phone</label>
                        <input id="phone" type="number" name="phone" placeholder="Enter Phone number"
                               value={formData.phone} onChange={handleChange}
                               className="form-input"/>
                    </div>
                    <div className="w-full">
                        <label htmlFor="email">Email</label>
                        <input id="email" type="email" name="email" placeholder="Enter email address"
                               value={formData.email} onChange={handleChange}
                               className="form-input"/>
                    </div>

                </div>
                <div className="flex flex-col md:flex-row gap-3 w-full">
                    <div className="w-full">
                        <label htmlFor="due_in_days">Due In (Days)</label>
                        <input id="due_in_days" type="number" name="due_in_days" placeholder="Enter due in days"
                               value={formData.due_in_days} onChange={handleChange}
                               className="form-input"/>
                    </div>

                    <div className="w-full">
                        <label htmlFor="website_url">Website</label>
                        <input id="website_url" type="text" name="website_url" placeholder="Enter Vendor Website"
                               value={formData.website_url} onChange={handleChange}
                               className="form-input"/>
                    </div>
                    <div className="w-full">
                        <label htmlFor="tax_reg_no">Tax Reg No</label>
                        <input id="tax_reg_no" type="text" name="tax_reg_no" placeholder="Enter tax regiration no"
                               value={formData.tax_reg_no} onChange={handleChange}
                               className="form-input"/>
                    </div>

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
                    <div className="w-full">
                        <label htmlFor="city_id">City</label>
                        <Select
                            defaultValue={cityOptions[0]}
                            options={cityOptions}
                            isSearchable={true}
                            isClearable={true}
                            placeholder={'Select City'}
                            onChange={(e: any) => setFormData(prev => ({...prev, city_id: e ? e.value : 0}))}
                        />
                    </div>
                </div>
                <div className="flex flex-col md:flex-row gap-3 w-full">
                    <div className="w-full md:w-1/3">
                        <label htmlFor="postal_code">Postal Code</label>
                        <input id="postal_code" type="text" name="postal_code" placeholder="Enter postal code"
                               value={formData.postal_code} onChange={handleChange}
                               className="form-input"/>
                    </div>
                    <div className="w-full">
                        <label htmlFor="address">Official Address</label>
                        <input id="address" type="text" name="address" placeholder="Enter address"
                               value={formData.address} onChange={handleChange}
                               className="form-input"/>
                    </div>
                </div>

                <div className="table-responsive w-full">
                    <div className="flex justify-between items-center flex-col md:flex-row space-y-3 md:space-y-0 mb-3">
                        <h3 className="text-lg font-semibold">Vendor Representatives</h3>
                        <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            onClick={() => setVendorRepresentativeModal(true)}
                        >
                            Add Representative
                        </button>
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
                                    <button
                                        type="button"
                                        onClick={() => handleRepresentativeRowDelete(index)}
                                        className="btn btn-outline-danger btn-sm"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                <div className="table-responsive w-full">
                    <div className="flex justify-between items-center flex-col md:flex-row space-y-3 md:space-y-0 mb-3">
                        <h3 className="text-lg font-semibold">Vendor Addresses</h3>
                        <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            onClick={() => setVendorAddressModal(true)}
                        >
                            Add Address
                        </button>
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
                                    <button
                                        type="button"
                                        onClick={() => handleAddressRowDelete(index)}
                                        className="btn btn-outline-danger btn-sm"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                <div className="table-responsive w-full">
                    <div className="flex justify-between items-center flex-col md:flex-row space-y-3 md:space-y-0 mb-3">
                        <h3 className="text-lg font-semibold">Vendor Bank Accounts</h3>
                        <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            onClick={() => setVendorBankModal(true)}
                        >
                            Add Bank Details
                        </button>
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
                                    {
                                        bankAccount.currency_name + ' (' + bankAccount.currency_code + ')'
                                    }
                                </td>
                                <td>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveBank(index)}
                                        className="btn btn-outline-danger btn-sm"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                <div className="w-full">
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                    >
                        {loading ? 'Loading...' : 'Save Vendor'}
                    </button>
                </div>
            </div>
            <VendorTypeFormModal
                vendorTypeFormModal={vendorTypeModal}
                setVendorTypeFormModal={setVendorTypeModal}
                handleSubmitVendorType={(value: any) => handleVendorSubmit(value)}
            />
            <VendorAddressModal
                vendorAddressModal={vendorAddressModal}
                setVendorAddressModal={setVendorAddressModal}
                handleAddAddress={(value) => {
                    setVendorAddresses([...vendorAddresses, value])
                    setVendorAddressModal(false)
                }}
            />
            <VendorRepresentativeModal
                vendorRepresentativeModal={vendorRepresentativeModal}
                setVendorRepresentativeModal={setVendorRepresentativeModal}
                handleAddRepresentative={(value) => {
                    setVendorRepresentatives([...vendorRepresentatives, value])
                    setVendorRepresentativeModal(false)
                }}
            />
            <BankDetailModal
                title='Vendor'
                modalOpen={vendorBankModal}
                setModalOpen={setVendorBankModal}
                handleAddition={(value:any) => {
                    setVendorBankAccounts([...vendorBankAccounts, value])
                    setVendorBankModal(false)
                }}
            />
        </form>
    );
};

export default VendorForm;
