import React, { useEffect, useState } from 'react';
import { Input } from '@/components/form/Input';
import { IRootState, useAppDispatch, useAppSelector } from '@/store';
import Textarea from '@/components/form/Textarea';
import Modal from '@/components/Modal';
import ImageUploader from '@/components/form/ImageUploader';
import { Dropdown } from '@/components/form/Dropdown';
import { useSelector } from 'react-redux';
import { getCurrencies } from '@/store/slices/currencySlice';
import moment from 'moment-timezone';
import Button from '@/components/Button';
import { ButtonSize, ButtonType, ButtonVariant } from '@/utils/enums';
import { Edit3Icon, Trash2Icon } from 'lucide-react';
import { getBranchTypes } from '@/store/slices/companySlice';

const CompanyForm = () => {
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state) => state.user);
    const { currencies } = useSelector((state: IRootState) => state.currency);
    const { branchTypes } = useSelector((state: IRootState) => state.company);

    const [formData, setFormData] = useState<any>({});
    const [errorMessages, setErrorMessages] = useState<any>({});
    const [branches, setBranches] = useState<any[]>([]);
    const [showBranchModal, setShowBranchModal] = useState<boolean>(false);
    const [branchData, setBranchData] = useState<any>({});
    const [branchFormData, setBranchFormData] = useState<any>({});
    const [branchErrorMessages, setBranchErrorMessages] = useState<any>({});
    const [branchTypeOptions, setBranchTypeOptions] = useState<any[]>([]);
    const [currencyOptions, setCurrencyOptions] = useState<any[]>([]);
    const [timezoneOptions, setTimezoneOptions] = useState<any[]>([]);
    const [dateformatOptions, setDateformatOptions] = useState<any[]>([
        { value: 'd-m-Y', label: 'd-m-Y' },
        { value: 'm-d-Y', label: 'm-d-Y' },
        { value: 'Y-m-d', label: 'Y-m-d' }
    ]);
    const [timeFormatOptions, setTimeFormatOptions] = useState<any[]>([
        { value: '12', label: '12 Hours' },
        { value: '24', label: '24 Hours' }
    ]);
    const [weekStartOptions, setWeekStartOptions] = useState<any[]>([
        { value: '0', label: 'Sunday' },
        { value: '1', label: 'Monday' },
        { value: '2', label: 'Tuesday' },
        { value: '3', label: 'Wednesday' },
        { value: '4', label: 'Thursday' },
        { value: '5', label: 'Friday' },
        { value: '6', label: 'Saturday' }
    ]);
    const [countryOptions, setCountryOptions] = useState<any[]>([]);
    const [stateOptions, setStateOptions] = useState<any[]>([]);
    const [cityOptions, setCityOptions] = useState<any[]>([]);

    const handleChange = (name: string, value: any, required: boolean) => {
        setFormData({ ...formData, [name]: value });
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
    };

    const handleBranchChange = (name: string, value: any, required: boolean) => {
        setBranchFormData({ ...branchFormData, [name]: value });
        if (required) {
            if (!value) {
                setBranchErrorMessages({ ...branchErrorMessages, [name]: 'This field is required.' });
            } else {
                setBranchErrorMessages((prev: any) => {
                    delete prev[name];
                    return prev;
                });
            }
        }
    };

    const handleBranchSubmit = () => {
        setBranches((prev) => {
            const existingRow = prev.find(row => row.name === branchFormData.name && row.branch_type_id === branchFormData.branch_type_id);
            if (existingRow) {
                return prev.map(row => row.name === branchFormData.name && row.branch_type_id === branchFormData.branch_type_id ? branchFormData : row);
            } else {
                return [...prev, branchFormData];
            }
        });
        setShowBranchModal(false);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        let finalData = {
            ...formData,
            branches
        };
        // console.log(finalData);
    };

    const getTimezones = () => {
        const timezones = moment.tz.names();
        const timezoneOptions = timezones.map((timezone: any) => {
            return { value: timezone, label: timezone };
        });
        setTimezoneOptions(timezoneOptions);
    };

    useEffect(() => {
        getTimezones();
        dispatch(getCurrencies());
        dispatch(getBranchTypes());
    }, []);

    useEffect(() => {
        if (currencies) {
            setCurrencyOptions(currencies.map((currency: any) => {
                return { value: currency.id, label: currency.code, name: currency.name };
            }));
        }
    }, [currencies]);

    useEffect(() => {
        if (branchTypes) {
            setBranchTypeOptions(branchTypes.map((branchType: any) => {
                return { value: branchType.id, label: branchType.name };
            }));
        }
    }, [branchTypes]);

    return (
        <form onSubmit={(e) => handleSubmit(e)}>
            <Input
                divClasses="md:w-1/2"
                label="Company Name"
                type="text"
                name="name"
                onChange={(e) => handleChange(e.target.name, e.target.value, e.target.required)}
                isMasked={false}
                value={formData.name}
                required={true}
                errorMessage={errorMessages.name}
            />
            <Textarea
                divClasses={'md:w-1/2'}
                label="Description"
                name="description"
                value={formData.description}
                onChange={(e) => handleChange(e.target.name, e.target.value, e.target.required)}
                isReactQuill={false}
            />

            <div className="table-responsive mt-3">
                <div className="flex md:flex-row flex-col md:justify-between md:items-center mb-3">
                    <h2 className="text-lg font-semibold">Branches</h2>
                    <button
                        className="btn btn-primary btn-sm"
                        onClick={() => {
                            setShowBranchModal(true);
                            setBranchFormData({});
                        }}
                    >
                        Add Branch
                    </button>
                </div>
                <table>
                    <thead>
                    <tr>
                        <th>Type</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Website</th>
                        <th>Configuration</th>
                        <th>Address</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {branches.map((branch, index) => (
                        <tr key={index}>
                            <td>{branchTypeOptions.find((branchType: any) => branchType.value === branch.branch_type_id)?.label}</td>
                            <td>{branch.name}</td>
                            <td>{branch.email}</td>
                            <td>{branch.phone}</td>
                            <td>{branch.website}</td>
                            <td>
                                <div className="flex gap-2">
                                    <strong>Currency: </strong>
                                    <span>{branch.currency}</span>
                                </div>
                                <div className="flex gap-2">
                                    <strong>Timezone: </strong>
                                    <span>{branch.timezone}</span>
                                </div>
                                <div className="flex gap-2">
                                    <strong>Date Format: </strong>
                                    <span>{branch.date_format}</span>
                                </div>
                                <div className="flex gap-2">
                                    <strong>Time Format: </strong>
                                    <span>{branch.time_format}</span>
                                </div>
                                <div className="flex gap-2">
                                    <strong>Week Start: </strong>
                                    <span>{branch.week_start}</span>
                                </div>
                            </td>
                            <td>
                                {branch.country_id && countryOptions.find((country: any) => country.value === branch.country_id)?.label},
                                {branch.state_id && stateOptions.find((state: any) => state.value === branch.state_id)?.label},
                                {branch.city_id && cityOptions.find((city: any) => city.value === branch.city_id)?.label},
                                {branch.postal_code}, {branch.addressz}
                            </td>
                            <td>
                                <div className="flex gap-1">
                                    <Button
                                        type={ButtonType.button}
                                        tooltip="Edit"
                                        text={<Edit3Icon size={15} />}
                                        variant={ButtonVariant.primary}
                                        size={ButtonSize.small}
                                        onClick={() => {
                                            setShowBranchModal(true);
                                            setBranchData(branch);
                                        }}
                                    />
                                    <Button
                                        type={ButtonType.button}
                                        tooltip="Remove"
                                        text={<Trash2Icon size={15} />}
                                        variant={ButtonVariant.danger}
                                        size={ButtonSize.small}
                                        onClick={() => {
                                            setBranches((prev) => prev.filter((row) => row.name !== branch.name && row.branch_type_id !== branch.branch_type_id));
                                        }}
                                    />
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-center items-center gap-3 mt-3">
                <Button
                    type={ButtonType.submit}
                    text="Register"
                    variant={ButtonVariant.primary}
                />
            </div>
            <Modal
                show={showBranchModal}
                setShow={setShowBranchModal}
                title={Object.keys(branchData).length>0 ? 'Edit Branch' : 'Add Branch'}
                size={'xl'}
                footer={
                    <div className="mt-8 flex items-center gap-3 justify-end">
                        <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => setShowBranchModal(false)}
                        >
                            Discard
                        </button>
                        <button
                            className="btn btn-primary btn-sm"
                            onClick={() => handleBranchSubmit()}
                        >
                            {Object.keys(branchData).length>0 ? 'Update' : 'Add'}
                        </button>
                    </div>
                }
            >
                <div className="flex gap-2 items-center justify-center">
                    <div className="flex gap-2">
                        <ImageUploader
                            label={'Logo (Optional)'}
                            image={branchFormData?.logo}
                            setImage={(file) => handleBranchChange('logo', file, false)}
                            existingImage={''}
                        />
                        <ImageUploader
                            label={'Favicon (Optional)'}
                            image={branchFormData?.favicon}
                            setImage={(file) => handleBranchChange('favicon', file, false)}
                            existingImage={''}
                        />
                    </div>
                </div>
                <div className="flex md:justify-between md:items-center flex-col md:flex-row gap-3 mt-3">
                    <Dropdown
                        divClasses="w-full"
                        label="Branch Type"
                        name="branch_type_id"
                        value={branchFormData.branch_type_id}
                        options={branchTypeOptions}
                        onChange={(e) => {
                            if (e && typeof e !== 'undefined') {
                                handleBranchChange('branch_type_id', e.value, true);
                            } else {
                                handleBranchChange('branch_type_id', '', true);
                            }
                        }}
                    />

                    <Input
                        divClasses="w-full"
                        label="Name"
                        type="text"
                        name="name"
                        placeholder={'Enter branch name'}
                        onChange={(e) => handleBranchChange(e.target.name, e.target.value, e.target.required)}
                        isMasked={false}
                        value={branchFormData.name}
                        required={true}
                        errorMessage={branchErrorMessages.name}
                    />
                    <Input
                        divClasses="w-full"
                        label="Email"
                        type="email"
                        name="email"
                        placeholder={'Enter branch email'}
                        onChange={(e) => handleBranchChange(e.target.name, e.target.value, e.target.required)}
                        isMasked={false}
                        value={branchFormData.email}
                        required={true}
                        errorMessage={branchErrorMessages.email}
                    />
                    <Input
                        divClasses="w-full"
                        label="Phone"
                        type="text"
                        name="phone"
                        placeholder={'Enter branch phone number'}
                        onChange={(e) => handleBranchChange(e.target.name, e.target.value, e.target.required)}
                        isMasked={false}
                        value={branchFormData.phone}
                        required={true}
                        errorMessage={branchErrorMessages.phone}
                    />
                </div>
                <div className="flex md:justify-between md:items-center flex-col md:flex-row gap-3 mt-3">
                    <Input
                        divClasses="w-full"
                        label="Website"
                        type="text"
                        name="website"
                        placeholder={'Enter branch website link'}
                        onChange={(e) => handleBranchChange(e.target.name, e.target.value, e.target.required)}
                        isMasked={false}
                        value={branchFormData.website}
                        required={true}
                        errorMessage={branchErrorMessages.website}
                    />
                    <Dropdown
                        divClasses="w-full"
                        label="Country"
                        name="country_id"
                        value={branchFormData.country_id}
                        options={countryOptions}
                        onChange={(e) => {
                            if (e && typeof e !== 'undefined') {
                                handleBranchChange('country_id', e.value, true);
                            } else {
                                handleBranchChange('country_id', '', true);
                            }
                        }}
                    />
                    <Dropdown
                        divClasses="w-full"
                        label="State"
                        name="state_id"
                        value={branchFormData.state_id}
                        options={stateOptions}
                        onChange={(e) => {
                            if (e && typeof e !== 'undefined') {
                                handleBranchChange('state_id', e.value, true);
                            } else {
                                handleBranchChange('state_id', '', true);
                            }
                        }}
                    />

                    <Dropdown
                        divClasses="w-full"
                        label="City"
                        name="city_id"
                        value={branchFormData.city_id}
                        options={cityOptions}
                        onChange={(e) => {
                            if (e && typeof e !== 'undefined') {
                                handleBranchChange('city_id', e.value, true);
                            } else {
                                handleBranchChange('city_id', '', true);
                            }
                        }}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 w-full mt-3">

                    <Input
                        label="Postal Code"
                        type="text"
                        name="postal_code"
                        placeholder={'Enter branch postal_code'}
                        onChange={(e) => handleBranchChange(e.target.name, e.target.value, e.target.required)}
                        isMasked={false}
                        value={branchFormData.postal_code}
                    />
                    <Input
                        divClasses="col-span-3"
                        label="Address"
                        type="text"
                        name="address"
                        placeholder={'Enter branch address'}
                        onChange={(e) => handleBranchChange(e.target.name, e.target.value, e.target.required)}
                        isMasked={false}
                        value={branchFormData.address}
                    />
                </div>
                <div className="border rounded p-3">
                    <h2 className="text-lg font-semibold">Configurations</h2>
                    <div className="flex md:justify-between md:items-center flex-col md:flex-row gap-3 mt-3">
                        <Dropdown
                            divClasses="w-full"
                            label="Branch Currency"
                            name="currency"
                            value={branchFormData.currency}
                            options={currencyOptions}
                            onChange={(e) => {
                                if (e && typeof e !== 'undefined') {
                                    handleBranchChange('currency', e.value, true);
                                } else {
                                    handleBranchChange('currency', '', true);
                                }
                            }}
                        />

                        <Dropdown
                            divClasses="w-full"
                            label="Branch Timezone"
                            name="timezone"
                            value={branchFormData.timezone}
                            options={timezoneOptions}
                            onChange={(e) => {
                                if (e && typeof e !== 'undefined') {
                                    handleBranchChange('timezone', e.value, true);
                                } else {
                                    handleBranchChange('timezone', '', true);
                                }
                            }}
                        />
                        <Dropdown
                            divClasses="w-full"
                            label="Branch Dateformat"
                            name="date_format"
                            value={branchFormData.date_format}
                            options={dateformatOptions}
                            onChange={(e) => {
                                if (e && typeof e !== 'undefined') {
                                    handleBranchChange('date_format', e.value, true);
                                } else {
                                    handleBranchChange('date_format', '', true);
                                }
                            }}
                        />

                        <Dropdown
                            divClasses="w-full"
                            label="Branch Time Format"
                            name="time_format"
                            value={branchFormData.time_format}
                            options={timeFormatOptions}
                            onChange={(e) => {
                                if (e && typeof e !== 'undefined') {
                                    handleBranchChange('time_format', e.value, true);
                                } else {
                                    handleBranchChange('time_format', '', true);
                                }
                            }}
                        />

                        <Dropdown
                            divClasses="w-full"
                            label="Week Start from"
                            name="week_start"
                            value={branchFormData.week_start}
                            options={weekStartOptions}
                            onChange={(e) => {
                                if (e && typeof e !== 'undefined') {
                                    handleBranchChange('week_start', e.value, true);
                                } else {
                                    handleBranchChange('week_start', '', true);
                                }
                            }}
                        />
                    </div>
                </div>
            </Modal>
        </form>
    );
};

export default CompanyForm;
