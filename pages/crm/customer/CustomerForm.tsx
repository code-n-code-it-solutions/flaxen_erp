import React, { useEffect, useState } from 'react';
import ImageUploader from "@/components/form/ImageUploader";
import { setAuthToken, setContentType } from "@/configs/api.config";
import { useDispatch, useSelector } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { IRootState } from "@/store";
import { AnyAction } from "redux";
import VendorTypeFormModal from "@/components/modals/VendorTypeFormModal";
import VendorAddressModal from "@/components/modals/VendorAddressModal";
import VendorRepresentativeModal from "@/components/modals/VendorRepresentativeModal";
import { clearLocationState, getCities, getCountries, getStates } from "@/store/slices/locationSlice";
import { getVendorTypes, storeVendorType } from "@/store/slices/vendorTypeSlice";
import { clearVendorState, storeVendor, updateVendor } from "@/store/slices/vendorSlice";
import { useRouter } from "next/router";
import BankDetailModal from "@/components/modals/BankDetailModal";
import { clearUtilState, generateCode } from "@/store/slices/utilSlice";
import { ButtonSize, ButtonType, ButtonVariant, FORM_CODE_TYPE } from "@/utils/enums";
import { MaskConfig } from "@/configs/mask.config";
import { Dropdown } from "@/components/form/Dropdown";
import Button from "@/components/Button";
import { Input } from "@/components/form/Input";
import { getUnits } from '@/store/slices/unitSlice';
import { imagePath } from "@/utils/helper";
import Option from '@/components/form/Option';
import Alert from '@/components/Alert';
import { clearCustomerState, getCustomerTypes, storeCustomer } from '@/store/slices/customerSlice';
import { truncateSync } from 'fs';
import { preventDefault } from '@fullcalendar/core/internal';
import { findLastIndex } from 'lodash';
interface IFormData {
  customer_code: string;
  name: string;
  customer_type_id: number;
  opening_balance: number,
  credit_limit: number,
  phone: string,
  email: string,
  due_in_days: number,
  postal_code: string,
  website: string,
  tax_registration: string,
  address: string,

  contact_persons: any[];
  addresses: any[];
  bank_accounts: any[];
  is_active: boolean;
  allow_invoice_more_than_credit: boolean;
  is_vendor: boolean;
  status: boolean;

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

const CustomerForm = ({ id }: IFormProps) => {

  const router = useRouter();
  const dispatch = useDispatch<ThunkDispatch<IRootState, any, AnyAction>>();
  const { token } = useSelector((state: IRootState) => state.user);
  const { countries, states, cities } = useSelector((state: IRootState) => state.location);
  const { code } = useSelector((state: IRootState) => state.util);
  const { customerTypes, loading, success } = useSelector((state: IRootState) => state.customer);


  const [customerTYpeModal, setCustomerTYpeModal] = useState<boolean>(false);
  const [contactPersonModal, setContactPersonModal] = useState<boolean>(false);
  const [addressModal, setAddressModal] = useState<boolean>(false);
  const [bankAcountModal, setBankAccountModal] = useState<boolean>(false);
  const [image, setImage] = useState<File | null>(null);
  const [addresses, setAddresses] = useState<IAddress[]>([]);
  const [contactPersons, setContactPersons] = useState<IRepresentative[]>([]);
  const [bankAccounts, setBankAccounts] = useState<IBankAccount[]>([]);

  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [validationMessage, setValidationMessage] = useState("");
  const [errorMessages, setErrorMessages] = useState({
    phone: '',
    name: '',
    email: '',
    credit_limit: '',
    opening_balance: '',
    customer_code: '',

  });


  const [formData, setFormData] = useState<IFormData>({
    customer_code: '',
    name: '',
    customer_type_id: 0,
    opening_balance: 0,
    credit_limit: 0,
    phone: '+971',
    email: '',
    due_in_days: 1,
    postal_code: '',
    website: '',
    tax_registration: '',
    address: '',
    is_active: true,
    contact_persons: [],
    addresses: [],
    bank_accounts: [],
    allow_invoice_more_than_credit: false,
    is_vendor: false,
    status: false,
  });
  const [imagePreview, setImagePreview] = useState('');


  const [customerTypeOptions, setCustomerTypeOptions] = useState([]);
  const [countryOptions, setCountryOptions] = useState([]);
  const [stateOptions, setStateOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);

  const handleChange = (name: string, value: any, required: boolean) => {

    setFormData(prevFormData => {
      return { ...prevFormData, [name]: value };
    });

    if (required) {
      if (!value) {
        setErrorMessages({ ...errorMessages, [name]: 'This field is required.' });
      } else {
        setErrorMessages({ ...errorMessages, [name]: '' });
      }
    }
  };

  const handleCustomerTypeSubmit = (value: any) => {

  }

  const handleRemoveRow = (index: number, type: string) => {
    if (type === 'contact_persons') {
      setContactPersons(contactPersons.filter((item, i) => i !== index))
    } else if (type === 'addresses') {
      setAddresses(addresses.filter((item, i) => i !== index))
    } else if (type === 'bank_accounts') {
      setBankAccounts(bankAccounts.filter((item, i) => i !== index))
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormData(prev => ({ ...prev }))
    setAuthToken(token)
    setContentType('multipart/form-data')
    

    let formFinalData = {
      ...formData,
      cotact_persons: contactPersons.map((item: any) => {
        return {
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
        }
      }),

      
      addresses: addresses.map((address: any) => {
        return {
          address_type: address.address_type,
          country_id: address.country_id,
          state_id: address.state_id,
          city_id: address.city_id,
          address: address.address,
          postal_code: address.postal_code,
          is_active: 1
        }
      }),

      bank_accounts: bankAccounts.map((bankAccount: any) => {
        return {
          bank_id: bankAccount.bank_id,
          currency_id: bankAccount.currency_id,
          account_name: bankAccount.account_name,
          account_number: bankAccount.account_number,
          iban: bankAccount.iban,
          is_active: 1
        }
      })
    }
    
    if (id) {
      //dispatch(updateVendor({ id, vendorData: formFinalData }));
    } else {
      dispatch(storeCustomer(formFinalData));
    }
  };

  useEffect(() => {
    dispatch(clearUtilState())
    setAuthToken(token)
    dispatch(clearCustomerState())
    dispatch(getCustomerTypes())
  }, [])

  useEffect(() => {
    if (!id) {
      dispatch(generateCode(FORM_CODE_TYPE.CUSTOMER))
      setImagePreview(imagePath(''));
    }
    return () => {
      dispatch(clearCustomerState());
    };
  }, [id, dispatch]);

  useEffect(() => {
    if (code) {
      setFormData(prev => ({ ...prev, customer_code: code[FORM_CODE_TYPE.CUSTOMER] }))
    }
  }, [code]);


  useEffect(() => {
    if (customerTypes) {
      setCustomerTypeOptions(customerTypes.map((item: any) => {
        return { value: item.id, label: item.name }
      }))
    }
  }, [customerTypes]);

  useEffect(() => {
    const isValid = Object.values(errorMessages).some(message => message !== '');
    setIsFormValid(!isValid);
    // console.log('Error Messages:', errorMessages);
    // console.log('isFormValid:', !isValid);
    if (isValid) {
      setValidationMessage("Please fill all the required fields.");
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
        divClasses='w-full md:w-1/4'
        label='Customer code'
        type='text'
        name='customer_code'
        value={formData.customer_code}
        onChange={(e) => handleChange(e.target.name, e.target.value, e.target.required)}
        placeholder="Enter Customer code"
        isMasked={false}
        disabled={true}
        required={true}
        errorMessage={errorMessages?.customer_code}

      />
      <div className="flex justify-start flex-col items-start space-y-3">
        <div className='flex justify-center items-end gap-2 w-full md:w-1/3'>
          <Dropdown
            divClasses='w-full'
            label='Customer Type'
            name='customer_type_id'
            options={customerTypeOptions}
            value={formData.customer_type_id}
            onChange={(e: any) => {
              if (e && e.value && typeof e !== 'undefined') {
                handleChange('customer_type_id', e.value, true)
              } else {
                handleChange('customer_type_id', 0, true)
              }
            }}
          />


        </div>

        <Input
          divClasses='w-full md:w-1/2'
          label='Name'
          type='text'
          name='name'
          value={formData.name}
          onChange={(e) => handleChange(e.target.name, e.target.value, e.target.required)}
          placeholder="Enter Customer Name"
          isMasked={false}
          styles={{ height: 45 }}
          required={true}
          errorMessage={errorMessages?.name}
        />

        <div className="flex flex-col md:flex-row gap-3 w-full">
          <Input
            divClasses='w-full'
            label='Email'
            type='email'
            name='email'
            value={formData.email}
            onChange={(e) => handleChange(e.target.name, e.target.value, e.target.required)}
            placeholder="Enter email address"
            isMasked={false}
            required={true}
            errorMessage={errorMessages?.email}
          />

          <Input
            divClasses='w-full'
            label='Phone'
            type='text'
            name='phone'
            value={formData.phone}
            onChange={(e) => handleChange(e.target.name, e.target.value, e.target.required)}
            placeholder={MaskConfig.phone.placeholder}
            isMasked={true}
            maskPattern={MaskConfig.phone.pattern}
            required={true}
            errorMessage={errorMessages?.phone}
          />
        </div>


        <div className="flex flex-col md:flex-row gap-3 w-full">
          <Input
            divClasses='w-full'
            label='Due In (Days)'
            type='text'
            name='due_in_days'
            value={formData.due_in_days.toString()}
            onChange={(e) => handleChange(e.target.name, e.target.value, e.target.required)}
            placeholder="Enter due in days"
            isMasked={false}
          />

          <Input
            divClasses='w-full'
            label='Website'
            type='text'
            name='website'
            value={formData.website}
            onChange={(e) => handleChange(e.target.name, e.target.value, e.target.required)}
            placeholder="Enter Customer Website"
            isMasked={false}
          />
          <Input
            divClasses='w-full'
            label='Tax Reg No'
            type='text'
            name='tax_registration'
            value={formData.tax_registration}
            onChange={(e) => handleChange(e.target.name, e.target.value, e.target.required)}
            placeholder="Enter tax regiration no"
            isMasked={false}
          />

        </div>

        <div className="flex flex-col md:flex-row gap-3 w-full">
          <Input
            divClasses='w-full'
            label='Opening Balance'
            type='number'
            name='opening_balance'
            value={formData.opening_balance.toString()}
            onChange={(e) => handleChange(e.target.name, e.target.value, e.target.required)}
            placeholder="Enter Opening Balance"
            isMasked={false}
            required={true}
            errorMessage={errorMessages?.opening_balance}
          />

          <Input
            divClasses='w-full'
            label='Credit limit'
            type='number'
            name='credit_limit'
            value={formData.credit_limit.toString()}
            onChange={(e) => handleChange(e.target.name, e.target.value, e.target.required)}
            placeholder="Enter Credit limit"
            isMasked={false}
            required={true}
            errorMessage={errorMessages?.credit_limit}
          />

        </div>

        <div className="flex flex-col md:flex-row gap-20 w-full">
          <Option
            type="checkbox"
            label='allow invoices more than credit limit'
            value={'1'}
            defaultChecked={formData.allow_invoice_more_than_credit}
            name='allow_invoice_more_than_credit'
            onChange={(e) => handleChange(e.target.name, e.target.value, e.target.required)}
          />
          <Option
            type="checkbox"
            label='Is Vendor'
            value={'1'}
            name='is_vendor'
            defaultChecked={formData.is_vendor}
            onChange={(e) => handleChange(e.target.name, e.target.value, e.target.required)}
          />
          <Option
            type="checkbox"
            label='Status'
            value={'1'}
            name='status'
            defaultChecked={formData.status}
            onChange={(e) => handleChange(e.target.name, e.target.value, e.target.required)}
          />
        </div>


        <div className="table-responsive w-full">
          <div className="flex justify-between items-center flex-col md:flex-row space-y-3 md:space-y-0 mb-3">
            <h3 className="text-lg font-semibold">Customer Addresses</h3>

            <Button
              text='Add Address'
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
              {addresses.map((address, index) => (
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
              ))}
            </tbody>
          </table>
        </div>
        <div className="table-responsive w-full">
          <div className="flex justify-between items-center flex-col md:flex-row space-y-3 md:space-y-0 mb-3">
            <h3 className="text-lg font-semibold">Customer Bank Accounts</h3>

            <Button
              text='Add Bank Details'
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
              {bankAccounts.map((bankAccount, index) => (
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
              ))}
            </tbody>
          </table>
        </div>

        <div className="table-responsive w-full">
          <div className="flex justify-between items-center flex-col md:flex-row space-y-3 md:space-y-0 mb-3">
            <h3 className="text-lg font-semibold">Contact person</h3>
            <Button
              text='Add Contact'
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
              {contactPersons.map((representative, index) => (
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
              ))}
            </tbody>
          </table>
        </div>
        <div className="w-full" >
          {<Button type={ButtonType.submit} text={loading ? 'Loading...' : id ? 'Update' : 'Create'} variant={ButtonVariant.info} disabled={loading} classes="!mt-6" />}
        </div>
      </div>

      <VendorAddressModal
        vendorAddressModal={addressModal}
        setVendorAddressModal={setAddressModal}
        handleAddAddress={(value) => {
          setAddresses([...addresses, value])
          setAddressModal(false)
        }}
      />
      <VendorRepresentativeModal
        vendorRepresentativeModal={contactPersonModal}
        setVendorRepresentativeModal={setContactPersonModal}
        handleAddRepresentative={(value) => {
          setContactPersons([...contactPersons, value])
          setContactPersonModal(false)
        }}
      />
      <BankDetailModal
        title='Vendor'
        modalOpen={bankAcountModal}
        setModalOpen={setBankAccountModal}
        handleSubmit={(value: any) => {
          setBankAccounts([...bankAccounts, value])
          setBankAccountModal(false)
        }}
      />
    </form>
  );
};

export default CustomerForm;
