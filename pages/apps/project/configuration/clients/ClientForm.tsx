import React, { Fragment, useEffect, useState } from 'react';
import { setAuthToken, setContentType } from '@/configs/api.config';
import { useAppDispatch, useAppSelector } from '@/store';
import VendorAddressModal from '@/components/modals/VendorAddressModal';
import VendorRepresentativeModal from '@/components/modals/VendorRepresentativeModal';
import BankDetailModal from '@/components/modals/BankDetailModal';
import { clearUtilState, generateCode } from '@/store/slices/utilSlice';
import { ButtonSize, ButtonType, ButtonVariant, FORM_CODE_TYPE } from '@/utils/enums';
import { MaskConfig } from '@/configs/mask.config';
import { Dropdown } from '@/components/form/Dropdown';
import Button from '@/components/Button';
import { Input } from '@/components/form/Input';
import Alert from '@/components/Alert';
import { Tab } from '@headlessui/react';
import Swal from 'sweetalert2';
import { clearClientState, storeClient, updateClient } from '@/store/slices/projects/clientSlice';
import Textarea from '@/components/form/Textarea';
import Modal from '@/components/Modal';
import { clearClientTypeState, getClientTypes, storeClientType } from '@/store/slices/projects/clientTypeSlice';
import IconPlus from '@/components/Icon/IconPlus';

interface IFormProps {
    id?: any;
}

const ClientForm = ({ id }: IFormProps) => {
    const dispatch = useAppDispatch();
    const { token } = useAppSelector((state) => state.user);
    const { clientTypes, clientType, loading:clientTypeLoading } = useAppSelector((state) => state.clientType);
    const { countries, states, cities } = useAppSelector((state) => state.location);
    const { code } = useAppSelector((state) => state.util);
    const { clientDetail, loading, success } = useAppSelector((state) => state.client);

    const [contactPersonModal, setContactPersonModal] = useState<boolean>(false);
    const [addressModal, setAddressModal] = useState<boolean>(false);
    const [bankAccountModal, setBankAccountModal] = useState<boolean>(false);
    const [addresses, setAddresses] = useState<any[]>([]);
    const [contactPersons, setContactPersons] = useState<any[]>([]);
    const [bankAccounts, setBankAccounts] = useState<any[]>([]);

    const [clientTypeModal, setClientTypeModal] = useState<boolean>(false);
    const [clientTypeDetails, setClientTypeDetails] = useState<any>({});

    const [isFormValid, setIsFormValid] = useState<boolean>(false);
    const [validationMessage, setValidationMessage] = useState('');
    const [errorMessages, setErrorMessages] = useState<any>({});

    const [formData, setFormData] = useState<any>({});
    const [clientTypeOptions, setClientTypeOptions] = useState<any[]>([]);

    const handleChange = (name: string, value: any, required: boolean) => {
        setFormData((prev: any) => ({ ...prev, [name]: value }));
        if (required) {
            if (!value) {
                setErrorMessages({ ...errorMessages, [name]: 'This field is required.' });
            } else {
                setErrorMessages({ ...errorMessages, [name]: '' });
            }
        }
    };

    const handleRemoveRow = (index: number, type: string) => {
        if (type === 'contact_persons') {
            setContactPersons(contactPersons.filter((item, i) => i !== index));
        } else if (type === 'addresses') {
            setAddresses(addresses.filter((item, i) => i !== index));
        } else if (type === 'bank_accounts') {
            setBankAccounts(bankAccounts.filter((item, i) => i !== index));
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFormData((prev: any) => ({ ...prev }));
        setAuthToken(token);
        setContentType('multipart/form-data');

        let formFinalData = {
            ...formData,
            contact_persons: contactPersons.map((item: any) => ({
                id: item.id,
                name: item.name,
                phone: item.phone,
                email: item.email,
                country_id: item.country_id,
                state_id: item.state_id,
                city_id: item.city_id,
                address: item.address,
                postal_code: item.postal_code,
                image: item.image,
                is_active: 1
            })),

            addresses: addresses.map((address: any) => ({
                id: address.id,
                address_type: address.address_type,
                country_id: address.country_id,
                state_id: address.state_id,
                city_id: address.city_id,
                address: address.address,
                postal_code: address.postal_code,
                is_active: 1
            })),

            bank_accounts: bankAccounts.map((bankAccount: any) => ({
                id: bankAccount.id,
                bank_id: bankAccount.bank_id,
                currency_id: bankAccount.currency_id,
                account_name: bankAccount.account_name,
                account_number: bankAccount.account_number,
                iban: bankAccount.iban,
                is_active: 1
            }))
        };

        if (contactPersons.length === 0) {
            Swal.fire({
                title: 'Error!',
                text: 'Please add at least one contact person.',
                icon: 'error',
                confirmButtonText: 'Ok'
            });
            return;
        }

        if (addresses.length === 0) {
            Swal.fire({
                title: 'Error!',
                text: 'Please add at least one address.',
                icon: 'error',
                confirmButtonText: 'Ok'
            });
            return;
        }

        if (id) {
            // console.log(formFinalData)
            dispatch(updateClient({ id, formData: formFinalData }));
        } else {
            dispatch(storeClient(formFinalData));
        }
    };

    useEffect(() => {
        setAuthToken(token);
        dispatch(clearUtilState());
        dispatch(clearClientState());
        dispatch(getClientTypes());
    }, []);

    useEffect(() => {
        if (!id) {
            dispatch(generateCode(FORM_CODE_TYPE.CLIENT));
        }
        return () => {
            dispatch(clearClientState());
        };
    }, [id, dispatch]);

    useEffect(() => {
        if (code) {
            setFormData((prev: any) => ({ ...prev, client_code: code[FORM_CODE_TYPE.CLIENT] }));
        }
    }, [code]);


    useEffect(() => {
        if (clientTypes) {
            setClientTypeOptions(clientTypes.map((item: any) => {
                return { value: item.id, label: item.name };
            }));
        }
    }, [clientTypes]);

    useEffect(() => {
        if(clientType) {
            setClientTypeDetails({});
            setClientTypeModal(false);
            dispatch(clearClientTypeState());
            dispatch(getClientTypes());
        }
    }, [clientType]);

    useEffect(() => {
        const isValid = Object.values(errorMessages).some(message => message !== '');
        setIsFormValid(!isValid);
        if (isValid) {
            setValidationMessage('Please fill all the required fields.');
        }

    }, [errorMessages]);

    return (

        <form className="space-y-5" onSubmit={handleSubmit}>
            {!isFormValid && validationMessage &&
                <Alert
                    alertType="error"
                    message={validationMessage}
                    setMessages={setValidationMessage}
                />
            }

            <Input
                divClasses="w-full md:w-1/4"
                label="Client code"
                type="text"
                name="client_code"
                value={formData.client_code}
                onChange={(e) => handleChange(e.target.name, e.target.value, e.target.required)}
                placeholder="Enter Client code"
                isMasked={false}
                disabled={true}
                required={true}
                errorMessage={errorMessages?.customer_code}

            />
            <div className="flex justify-start flex-col items-start space-y-3">
                <Input
                    divClasses="w-full md:w-1/2"
                    label="Name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={(e) => handleChange(e.target.name, e.target.value, e.target.required)}
                    placeholder="Enter Client Name"
                    isMasked={false}
                    styles={{ height: 45 }}
                    required={true}
                    errorMessage={errorMessages?.name}
                />

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
                                        Basic Details
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
                            <Tab as={Fragment}>
                                {({ selected }) => (
                                    <button
                                        className={`${
                                            selected ? '!border-white-light !border-b-white  text-primary !outline-none dark:!border-[#191e3a] dark:!border-b-black ' : ''
                                        } -mb-[1px] block border border-transparent p-3.5 py-2 hover:text-primary dark:hover:border-b-black`}
                                    >
                                        Contact Persons
                                    </button>
                                )}
                            </Tab>
                        </Tab.List>
                        <Tab.Panels className="rounded-none px-2">
                            <Tab.Panel>
                                <div className="mt-3 active">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                        <div className="flex gap-1 items-end">
                                            <Dropdown
                                                divClasses="w-full"
                                                label="Client Type"
                                                name="client_type_id"
                                                options={clientTypeOptions}
                                                value={formData.client_type_id}
                                                onChange={(e: any) => {
                                                    if (e && e.value && typeof e !== 'undefined') {
                                                        handleChange('client_type_id', e.value, true);
                                                    } else {
                                                        handleChange('client_type_id', 0, true);
                                                    }
                                                }}
                                            />
                                            <Button
                                                type={ButtonType.button}
                                                text={<IconPlus />}
                                                variant={ButtonVariant.primary}
                                                onClick={() => {
                                                    setClientTypeModal(true);
                                                    setClientTypeDetails({});
                                                }}
                                            />
                                        </div>
                                        <Input
                                            divClasses="w-full"
                                            label="Email"
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={(e) => handleChange(e.target.name, e.target.value, e.target.required)}
                                            placeholder="Enter email address"
                                            isMasked={false}
                                            required={true}
                                            errorMessage={errorMessages?.email}
                                        />

                                        <Input
                                            divClasses="w-full"
                                            label="Phone"
                                            type="text"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={(e) => handleChange(e.target.name, e.target.value, e.target.required)}
                                            placeholder={MaskConfig.phone.placeholder}
                                            isMasked={true}
                                            maskPattern={MaskConfig.phone.pattern}
                                            required={true}
                                            errorMessage={errorMessages?.phone}
                                        />

                                        <Input
                                            divClasses="w-full"
                                            label="Website"
                                            type="text"
                                            name="website"
                                            value={formData.website}
                                            onChange={(e) => handleChange(e.target.name, e.target.value, e.target.required)}
                                            placeholder="Enter Client Website"
                                            isMasked={false}
                                        />
                                        <Input
                                            divClasses="w-full"
                                            label="Tax Reg No"
                                            type="text"
                                            name="tax_registration"
                                            value={formData.tax_registration}
                                            onChange={(e) => handleChange(e.target.name, e.target.value, e.target.required)}
                                            placeholder="Enter tax regiration no"
                                            isMasked={false}
                                        />

                                        <Input
                                            divClasses="w-full"
                                            label="Opening Balance"
                                            type="number"
                                            name="opening_balance"
                                            value={formData.opening_balance?.toString()}
                                            onChange={(e) => handleChange(e.target.name, e.target.value, e.target.required)}
                                            placeholder="Enter Opening Balance"
                                            isMasked={false}
                                            required={true}
                                            errorMessage={errorMessages?.opening_balance}
                                        />
                                    </div>
                                </div>
                            </Tab.Panel>
                            <Tab.Panel>
                                <div className="table-responsive mt-3 w-full">
                                    <div
                                        className="flex justify-between items-center flex-col md:flex-row space-y-3 md:space-y-0 mb-3">
                                        <h3 className="text-md font-semibold">Client Addresses</h3>

                                        <Button
                                            text="Add Address"
                                            variant={ButtonVariant.primary}
                                            size={ButtonSize.small}
                                            onClick={() => setAddressModal(true)}
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
                                        {addresses.length > 0
                                            ? addresses.map((address, index) => (
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
                                                            onClick={() => handleRemoveRow(index, 'addresses')}
                                                            className="btn btn-outline-danger btn-sm"
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            )) : (
                                                <tr>
                                                    <td colSpan={7} className="text-center">No data found</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </Tab.Panel>
                            <Tab.Panel>
                                <div className="table-responsive mt-3 w-full">
                                    <div
                                        className="flex justify-between items-center flex-col md:flex-row space-y-3 md:space-y-0 mb-3">
                                        <h3 className="text-md font-semibold">Client Bank Accounts</h3>

                                        <Button
                                            text="Add Bank Details"
                                            variant={ButtonVariant.primary}
                                            size={ButtonSize.small}
                                            onClick={() => setBankAccountModal(true)}
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
                                        {bankAccounts.length > 0
                                            ? bankAccounts.map((bankAccount, index) => (
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
                                                            onClick={() => handleRemoveRow(index, 'bank_accounts')}
                                                            className="btn btn-outline-danger btn-sm"
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            )) : (
                                                <tr>
                                                    <td colSpan={6} className="text-center">No data found</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </Tab.Panel>
                            <Tab.Panel>
                                <div className="table-responsive mt-3 w-full">
                                    <div
                                        className="flex justify-between items-center flex-col md:flex-row space-y-3 md:space-y-0 mb-3">
                                        <h3 className="text-md font-semibold">Contact person</h3>
                                        <Button
                                            text="Add Contact"
                                            variant={ButtonVariant.primary}
                                            size={ButtonSize.small}
                                            onClick={() => setContactPersonModal(true)}
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
                                        {contactPersons.length > 0
                                            ? contactPersons.map((representative, index) => (
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
                                                            onClick={() => handleRemoveRow(index, 'contact_persons')}
                                                            className="btn btn-outline-danger btn-sm"
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            )) : (
                                                <tr>
                                                    <td colSpan={9} className="text-center">No data found</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </Tab.Panel>
                        </Tab.Panels>
                    </Tab.Group>
                </div>

                <div className="w-full">
                    {<Button type={ButtonType.submit} text={loading ? 'Loading...' : id ? 'Update' : 'Create'}
                             variant={ButtonVariant.info} disabled={loading} classes="!mt-6" />}
                </div>
            </div>

            <VendorAddressModal
                modalOpen={addressModal}
                setModalOpen={setAddressModal}
                handleSubmit={(value) => {
                    setAddresses([...addresses, { id: 0, ...value }]);
                    setAddressModal(false);
                }}
            />
            <VendorRepresentativeModal
                modalOpen={contactPersonModal}
                setModalOpen={setContactPersonModal}
                handleSubmit={(value) => {
                    setContactPersons([...contactPersons, { id: 0, ...value }]);
                    setContactPersonModal(false);
                }}
            />
            <BankDetailModal
                title="Client"
                modalOpen={bankAccountModal}
                setModalOpen={setBankAccountModal}
                handleSubmit={(value: any) => {
                    setBankAccounts([...bankAccounts, { id: 0, ...value }]);
                    setBankAccountModal(false);
                }}
            />

            <Modal
                title="Add Client Type"
                show={clientTypeModal}
                setShow={setClientTypeModal}
                footer={
                    <div className="flex justify-end gap-3">
                        <Button
                            type={ButtonType.button}
                            text="Cancel"
                            variant={ButtonVariant.danger}
                            onClick={() => setClientTypeModal(false)}
                        />
                        <Button
                            type={ButtonType.button}
                            text="Add"
                            variant={ButtonVariant.primary}
                            onClick={() => {
                                dispatch(storeClientType(clientTypeDetails));
                            }}
                        />
                    </div>
                }
            >
                <Input
                    divClasses="w-full"
                    label="Name"
                    type="text"
                    name="name"
                    placeholder="Enter name"
                    value={clientTypeDetails.name}
                    onChange={(e) => setClientTypeDetails({ ...clientTypeDetails, name: e.target.value })}
                    isMasked={false}
                />
                <Textarea
                    label="Description"
                    name="description"
                    value={clientTypeDetails.description}
                    onChange={(e) => setClientTypeDetails({ ...clientTypeDetails, description: e.target.value })}
                    placeholder={'Enter description'}
                    isReactQuill={false}
                />
            </Modal>
        </form>
    );
};

export default ClientForm;