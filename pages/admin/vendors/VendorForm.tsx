import React, { useEffect, useState } from 'react';
import ImageUploader from "@/components/form/ImageUploader";
import { setAuthToken, setContentType } from "@/configs/api.config";
import { useDispatch, useSelector } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { IRootState } from "@/store";
import { AnyAction } from "redux";
import VendorTypeFormModal from "@/components/specific-modal/VendorTypeFormModal";
import VendorAddressModal from "@/components/specific-modal/VendorAddressModal";
import VendorRepresentativeModal from "@/components/specific-modal/VendorRepresentativeModal";
import { clearLocationState, getCities, getCountries, getStates } from "@/store/slices/locationSlice";
import { getVendorTypes, storeVendorType } from "@/store/slices/vendorTypeSlice";
import { clearVendorState, storeVendor, editVendor, updateVendor } from "@/store/slices/vendorSlice";
import { useRouter } from "next/router";
import BankDetailModal from "@/components/specific-modal/BankDetailModal";
import { clearUtilState, generateCode } from "@/store/slices/utilSlice";
import { ButtonSize, ButtonType, ButtonVariant, FORM_CODE_TYPE } from "@/utils/enums";
import { MaskConfig } from "@/configs/mask.config";
import { Dropdown } from "@/components/form/Dropdown";
import Button from "@/components/Button";
import { Input } from "@/components/form/Input";
import { getUnits } from '@/store/slices/unitSlice';
import { imagePath } from "@/utils/helper";
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

const VendorForm = ({ id }: IFormProps) => {
    const router = useRouter();
    const { vendorDetail } = useSelector((state: IRootState) => state.vendor);
    const dispatch = useDispatch<ThunkDispatch<IRootState, any, AnyAction>>();
    const { token } = useSelector((state: IRootState) => state.user);
    const { countries, states, cities } = useSelector((state: IRootState) => state.location);
    const { allVendorTypes, vendorType } = useSelector((state: IRootState) => state.vendorType);
    const { code } = useSelector((state: IRootState) => state.util);
    const { allVendors, vendor, loading, success } = useSelector((state: IRootState) => state.vendor);

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


    const [vendorTypeOptions, setVendorTypeOptions] = useState([]);
    const [countryOptions, setCountryOptions] = useState([]);
    const [stateOptions, setStateOptions] = useState([]);
    const [cityOptions, setCityOptions] = useState([]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prevFormData => {
            return { ...prevFormData, [name]: value };
        });
    };

    const handleCountryChange = (e: any) => {
        if (e && e.value && typeof e !== 'undefined') {
            setFormData(prev => ({ ...prev, country_id: e ? e.value : 0 }))
            dispatch(getStates(parseInt(e.value)))
        } else {
            setFormData(prev => ({ ...prev, country_id: 0 }))
            setStateOptions([])
            setCityOptions([])
        }
    }

    const handleStateChange = (e: any) => {
        if (e && e.value && typeof e !== 'undefined') {
            setFormData(prev => ({ ...prev, state_id: e ? e.value : 0 }))
            dispatch(getCities({ countryId: formData.country_id, stateId: parseInt(e.value) }))
        } else {
            setFormData(prev => ({ ...prev, state_id: 0 }))
            setCityOptions([])
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
        setFormData(prev => ({ ...prev, image: image }))
        setAuthToken(token)
        setContentType('multipart/form-data')

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
            dispatch(updateVendor({ id, vendorData: formFinalData }));
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
    }, [])

    useEffect(() => {
        if (!id) {
            dispatch(generateCode(FORM_CODE_TYPE.VENDOR))
            setImagePreview(imagePath(''));
        }
        return () => {
            dispatch(clearVendorState());
        };
    }, [id, dispatch]);


    useEffect(() => {
        if (code) {
            setFormData(prev => ({ ...prev, vendor_number: code[FORM_CODE_TYPE.VENDOR] }))
        }
    }, [code]);

    useEffect(() => {
        if (countries) {
            setCountryOptions(countries.map((country: any) => {
                return { value: country.id, label: country.name }
            }))
        }
    }, [countries]);

    useEffect(() => {
        if (states) {
            setStateOptions(states.map((state: any) => {
                return { value: state.id, label: state.name }
            }))
        }
    }, [states]);

    useEffect(() => {
        if (cities) {
            setCityOptions(cities.map((city: any) => {
                return { value: city.id, label: city.name }
            }))
        }
    }, [cities]);

    useEffect(() => {
        if (allVendorTypes) {
            setVendorTypeOptions(allVendorTypes.map((vendorType: any) => {
                return { value: vendorType.id, label: vendorType.name }
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
    }, [vendor, success]);

    useEffect(() => {
        if (!id) {
            dispatch(generateCode(FORM_CODE_TYPE.RAW_MATERIAL));
            setImagePreview(imagePath(''));
        }
        return () => {
            dispatch(clearVendorState());
        };
    }, [id, dispatch]);

    useEffect(() => {
        if (code) {
            setFormData(prev => ({ ...prev, item_code: code[FORM_CODE_TYPE.RAW_MATERIAL] }))
        }
    }, [code]);

    useEffect(() => {
        if (vendorDetail) {
            console.log(vendorDetail);

            setImagePreview(imagePath(vendorDetail.thumbnail))
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
                address: vendorDetail.adress,
                country_id: vendorDetail.country_id,
                state_id: vendorDetail.state_id,
                city_id: vendorDetail.city_id,
                image: vendorDetail.image,
                representatives: vendorDetail.representatives,
                addresses: vendorDetail.address,
                bank_accounts: vendorDetail.bank_accounts,
                is_active: vendorDetail.is_active,

            });
        } else {
            setImagePreview(imagePath(''))
        }
    }, [vendorDetail]);


    return (
        <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="flex justify-center items-center">
                <ImageUploader image={image} setImage={setImage} existingImage={imagePreview} />
            </div>
            <div className="flex justify-start flex-col items-start space-y-3">
                <div className='flex justify-center items-end gap-2 w-full md:w-1/3'>
                    <Dropdown
                        divClasses='w-full'
                        label='Vendor Type'
                        name='vendor_type_id'
                        options={vendorTypeOptions}
                        value={formData.vendor_type_id}
                        onChange={(e: any) => {
                            if (e && e.value && typeof e !== 'undefined') {
                                setFormData(prev => ({ ...prev, vendor_type_id: e.value }))
                            } else {
                                setFormData(prev => ({ ...prev, vendor_type_id: 0 }))
                            }
                        }}
                    />
                    <Button
                        type={ButtonType.button}
                        text={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                            className="h-5 w-5 ltr:mr-2 rtl:ml-2"
                            fill="none">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                            <path d="M15 12L12 12M12 12L9 12M12 12L12 9M12 12L12 15" stroke="currentColor"
                                strokeWidth="1.5" strokeLinecap="round" />
                        </svg>}
                        variant={ButtonVariant.primary}
                        onClick={() => setVendorTypeModal(true)}
                    />
                </div>

                <Input
                    divClasses='w-full md:w-1/3'
                    label='Vendor Number'
                    type='text'
                    name='vendor_number'
                    value={formData.vendor_number}
                    onChange={handleChange}
                    placeholder="Enter Vendor Code"
                    isMasked={false}
                    disabled={true}
                />

                <Input
                    divClasses='w-full md:w-1/2'
                    label='Vendor Name'
                    type='text'
                    name='name'
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter Vendor Name"
                    isMasked={false}
                    styles={{ height: 45 }}
                />

                <div className="flex flex-col md:flex-row gap-3 w-full">
                    <Input
                        divClasses='w-full'
                        label='Opening Balance'
                        type='number'
                        name='opening_balance'
                        value={formData.opening_balance.toString()}
                        onChange={handleChange}
                        placeholder="Enter Opening Balance"
                        isMasked={false}
                    />

                    <Input
                        divClasses='w-full'
                        label='Phone'
                        type='text'
                        name='phone'
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder={MaskConfig.phone.placeholder}
                        isMasked={true}
                        maskPattern={MaskConfig.phone.pattern}
                    />

                    <Input
                        divClasses='w-full'
                        label='Email'
                        type='email'
                        name='email'
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter email address"
                        isMasked={false}
                    />

                </div>
                <div className="flex flex-col md:flex-row gap-3 w-full">
                    <Input
                        divClasses='w-full'
                        label='Due In (Days)'
                        type='text'
                        name='due_in_days'
                        value={formData.due_in_days.toString()}
                        onChange={handleChange}
                        placeholder="Enter due in days"
                        isMasked={false}
                    />

                    <Input
                        divClasses='w-full'
                        label='Website'
                        type='text'
                        name='website_url'
                        value={formData.website_url}
                        onChange={handleChange}
                        placeholder="Enter Vendor Website"
                        isMasked={false}
                    />

                    <Input
                        divClasses='w-full'
                        label='Tax Reg No'
                        type='text'
                        name='tax_reg_no'
                        value={formData.tax_reg_no}
                        onChange={handleChange}
                        placeholder="Enter tax regiration no"
                        isMasked={false}
                    />

                </div>

                <div className="flex flex-col md:flex-row gap-3 w-full">
                    <Dropdown
                        divClasses='w-full'
                        label='Country'
                        name='country_id'
                        options={countryOptions}
                        value={formData.country_id}
                        onChange={(e: any) => handleCountryChange(e)}
                    />

                    <Dropdown
                        divClasses='w-full'
                        label='State'
                        name='state_id'
                        options={stateOptions}
                        value={formData.state_id}
                        onChange={(e: any) => handleStateChange(e)}
                    />

                    <Dropdown
                        divClasses='w-full'
                        label='City'
                        name='city_id'
                        options={stateOptions}
                        value={formData.city_id}
                        onChange={(e: any) => {
                            if (e && e.value && typeof e !== 'undefined') {
                                setFormData(prev => ({ ...prev, city_id: e.value }))
                            } else {
                                setFormData(prev => ({ ...prev, city_id: 0 }))
                            }
                        }}
                    />
                </div>
                <div className="flex flex-col md:flex-row gap-3 w-full">
                    <Input
                        divClasses='w-full md:w-1/3'
                        label='Postal Code'
                        type='text'
                        name='postal_code'
                        value={formData.postal_code}
                        onChange={handleChange}
                        placeholder="Enter postal code"
                        isMasked={false}
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
                    />

                </div>

                <div className="table-responsive w-full">
                    <div className="flex justify-between items-center flex-col md:flex-row space-y-3 md:space-y-0 mb-3">
                        <h3 className="text-lg font-semibold">Vendor Representatives</h3>
                        <Button
                            text='Add Representative'
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

                        <Button
                            text='Add Address'
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

                        <Button
                            text='Add Bank Details'
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
                        {loading ? 'Loading...' : id ? 'Update Vendor' : 'Save Vendor'}
                    </button>
                </div>
            </div>
            <VendorTypeFormModal
                modalOpen={vendorTypeModal}
                setModalOpen={setVendorTypeModal}
                handleSubmit={(value: any) => handleVendorSubmit(value)}
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
                handleSubmit={(value: any) => {
                    setVendorBankAccounts([...vendorBankAccounts, value])
                    setVendorBankModal(false)
                }}
            />
        </form>
    );
};

export default VendorForm;
