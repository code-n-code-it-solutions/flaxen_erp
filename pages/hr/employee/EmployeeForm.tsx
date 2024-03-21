import React, {useEffect, useState} from 'react';
import ImageUploader from "@/components/form/ImageUploader";
import {setAuthToken, setContentType} from "@/configs/api.config";
import {useDispatch, useSelector} from "react-redux";
import {ThunkDispatch} from "redux-thunk";
import {IRootState} from "@/store";
import {AnyAction} from "redux";
import {clearLocationState, getCities, getCountries, getStates} from "@/store/slices/locationSlice";
import {useRouter} from "next/router";
import BankDetailModal from "@/components/modals/BankDetailModal";
import {clearEmployeeState, storeEmployee} from "@/store/slices/employeeSlice";
import {clearDesignationState, getDesignationByDepartmentID, storeDesignation} from "@/store/slices/designationSlice";
import {clearDepartmentState, getDepartments, storeDepartment} from "@/store/slices/departmentSlice";
import DepartmentFormModal from "@/components/modals/DepartmentFormModal";
import DesignationFormModal from "@/components/modals/DesignationFormModal";
import DocumentFormModal from "@/components/modals/DocumentFormModal";
import {clearUtilState, generateCode} from "@/store/slices/utilSlice";
import {ButtonSize, ButtonType, ButtonVariant, FORM_CODE_TYPE, IconType} from "@/utils/enums";
import {MaskConfig} from "@/configs/mask.config";
import {Input} from "@/components/form/Input";
import {Dropdown} from "@/components/form/Dropdown";
import Button from "@/components/Button";
import {createBlobUrl, getIcon, imagePath} from "@/utils/helper";
import FileDownloader from "@/components/FileDownloader";
import {clearRawProductState} from "@/store/slices/rawProductSlice";
import  Alert  from "@/components/Alert";

interface IFormData {
    employee_code: string;
    name: string;
    phone: string,
    email: string,
    password: string,
    postal_code: string,
    address: string,
    date_of_joining: string,
    passport_number: string,
    id_number: string,
    department_id: number,
    designation_id: number,
    country_id: number,
    state_id: number,
    city_id: number,
    image: File | null;
    bank_accounts: any[];
    documents: any[];
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

interface IDocuments {
    document: File | null;
    name: string;
    description: string;
}

interface IFormProps {
    id?: any
}

const EmployeeForm = ({id}: IFormProps) => {
    const router = useRouter();
    const dispatch = useDispatch<ThunkDispatch<IRootState, any, AnyAction>>();
    const {token} = useSelector((state: IRootState) => state.user);
    const {countries, states, cities} = useSelector((state: IRootState) => state.location);
    const designation = useSelector((state: IRootState) => state.designation);
    const department = useSelector((state: IRootState) => state.department);
    const employee = useSelector((state: IRootState) => state.employee);
    const {code} = useSelector((state: IRootState) => state.util);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [bankModalOpen, setBankModalOpen] = useState<boolean>(false);
    const [image, setImage] = useState<File | null>(null);
    const [employeeBankAccounts, setEmployeeBankAccounts] = useState<IBankAccount[]>([]);
    const [employeeDocuments, setEmployeeDocuments] = useState<IDocuments[]>([]);
    const [isFormValid, setIsFormValid] = useState<boolean>(false);
    const [validationMessage, setValidationMessage] = useState("");
    // const [VAddressMessage, setVAddressMessage] = useState('');
    // const [VRepresentativeMessage, setVRepresentativeMessage] = useState('');

    const [errorMessages, setErrorMessages] = useState({
        department_id: 'This field is required',
        designation_id: 'This field is required',
        name: 'This field is required',
        password: 'This field is required',
        phone: 'This field is required',
        email: 'This field is required',
        id_number: 'This field is required',
        passport_number: 'This field is required',
    });

    const [formData, setFormData] = useState<IFormData>({
        employee_code: '',
        name: '',
        phone: '+971',
        email: '',
        password: '',
        postal_code: '',
        address: '',
        date_of_joining: '',
        passport_number: '',
        id_number: '',
        department_id: 0,
        designation_id: 0,
        country_id: 0,
        state_id: 0,
        city_id: 0,
        image: null,
        bank_accounts: [],
        documents: [],
        is_active: true
    });
    const [imagePreview, setImagePreview] = useState('');
    const [departmentModalOpen, setDepartmentModalOpen] = useState(false);
    const [documentModalOpen, setDocumentModalOpen] = useState(false);
    const [designationModalOpen, setDesignationModalOpen] = useState(false);
    const [countryOptions, setCountryOptions] = useState([]);
    const [stateOptions, setStateOptions] = useState([]);
    const [cityOptions, setCityOptions] = useState([]);
    const [departmentOptions, setDepartmentOptions] = useState<any[]>([]);
    const [designationOptions, setDesignationOptions] = useState<any[]>([]);

    const handleChange = (name: string, value: any,required:any) => {
        // const {required} = e.target;
        setFormData(prevFormData => {
            return {...prevFormData, [name]: value};
        });
        if (required) {
            if (!value) {
                setErrorMessages({ ...errorMessages, [name]: 'This field is required.' });
            } else {
                setErrorMessages({ ...errorMessages, [name]: '' });
            }
        }
        if (name === 'phone') {
            if (value === '(+971) __-__-____') {
                setErrorMessages({ ...errorMessages, [name]: 'This field is required.' });
            }
        }
    };

    const handleDepartmentChange = (e: any,required:any) => {
        // const [name,value,required] = e.target;
        if (e && e.value && typeof e !== 'undefined') {
            setFormData(prev => ({...prev, department_id: e.value}))
            dispatch(getDesignationByDepartmentID(parseInt(e.value)))
            if (required) {
                setErrorMessages({ ...errorMessages, department_id: '' });
            }
        } else {
            setDesignationOptions([])
            setFormData(prev => ({...prev, department_id: 0}))
            setFormData(prev => ({...prev, designation_id: 0}))
            if (required) {
                setErrorMessages({ ...errorMessages, department_id: 'This field is required.' });
            }
        }
    }

    const handleCountryChange = (e: any) => {
        if (e && e.value && typeof e !== 'undefined') {
            setFormData(prev => ({...prev, country_id: e.value}))
            dispatch(getStates(parseInt(e.value)))
        } else {
            setFormData(prev => ({...prev, country_id: 0}))
            setFormData(prev => ({...prev, state_id: 0}))
            setStateOptions([])
            setCityOptions([])
        }
    }

    const handleStateChange = (e: any) => {
        if (e && e.value && typeof e !== 'undefined') {
            setFormData(prev => ({...prev, state_id: e.value}))
            dispatch(getCities({countryId: formData.country_id, stateId: parseInt(e.value)}))
        } else {
            setFormData(prev => ({...prev, state_id: 0}))
            setFormData(prev => ({...prev, city_id: 0}))
            setCityOptions([])
        }
    }

    const handleRemoveBank = (index: number) => {
        const newEmployeeBankAccounts = employeeBankAccounts.filter((address, i) => i !== index);
        setEmployeeBankAccounts(newEmployeeBankAccounts);
    }

    const handleRemoveDocument = (index: number) => {
        const newEmployeeDocuments: any = employeeDocuments.filter((address, i) => i !== index);
        setEmployeeDocuments(newEmployeeDocuments);
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setAuthToken(token)
        setContentType('multipart/form-data')
        setFormData(prev => ({
            ...prev,
            image: image,
            bank_accounts: employeeBankAccounts.map((bankAccount: any) => {
                return {
                    bank_id: bankAccount.bank_id,
                    currency_id: bankAccount.currency_id,
                    account_name: bankAccount.account_name,
                    account_number: bankAccount.account_number,
                    iban: bankAccount.iban,
                    is_active: true
                }
            }),
            documents: employeeDocuments
        }))
        if (id) {
            // dispatch(updateRawProduct(id, formData));
        } else {
            dispatch(storeEmployee(formData));
        }
    };

    useEffect(() => {
        if (employee.employeeDetail) {
            const employeeDetail = employee.employeeDetail;
            console.log(employeeDetail)
            setImagePreview(imagePath(employeeDetail.thumbnail))
            setFormData({
                ...formData,
                employee_code: employeeDetail.employee_code,
                name: employeeDetail.user.name,
                phone: employeeDetail.phone,
                email: employeeDetail.user.email,
                postal_code: employeeDetail.postal_code,
                address: employeeDetail.address,
                date_of_joining: employeeDetail.date_of_joining,
                passport_number: employeeDetail.passport_number,
                id_number: employeeDetail.id_number,
                department_id: employeeDetail.department_id,
                designation_id: employeeDetail.designation_id,
                country_id: employeeDetail.country_id,
                state_id: employeeDetail.state_id,
                city_id: employeeDetail.city_id,
                bank_accounts: employeeDetail.bank_accounts,
                documents: employeeDetail.documents,
            });
            setEmployeeBankAccounts(employeeDetail.bank_accounts)
            setEmployeeDocuments(employeeDetail.documents)
        } else {
            setImagePreview(imagePath(''))
        }
    }, [employee.employeeDetail]);

    useEffect(() => {
        dispatch(clearLocationState())
        dispatch(clearEmployeeState())
        dispatch(clearUtilState())
        setAuthToken(token)
        dispatch(getCountries())
        dispatch(getDepartments())
        setContentType('application/json');
    }, [dispatch, token]);

    useEffect(() => {
        if (!id) {
            dispatch(generateCode(FORM_CODE_TYPE.EMPLOYEE))
            setImagePreview(imagePath(''));
        }
        return () => {
            dispatch(clearRawProductState());
        };
    }, [id, dispatch]);

    useEffect(() => {
        if (code) {
            setFormData(prev => ({...prev, employee_code: code[FORM_CODE_TYPE.EMPLOYEE]}))
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
        if (designation.designations) {
            const options = designation.designations.map((designation: any) => ({
                value: designation.id,
                label: designation.name
            }));
            setDesignationOptions(options);
            // setDesignationModalOpen(false)
        }
    }, [designation.designations]);

    useEffect(() => {
        if (designation.designation) {
            setDesignationModalOpen(false)
            if (formData.department_id !== 0) {
                dispatch(getDesignationByDepartmentID(formData.department_id))
            }
            dispatch(clearDesignationState())
        }
    }, [designation.designation]);

    useEffect(() => {
        if (department.departments) {
            const options = department.departments.map((department: any) => ({
                value: department.id,
                label: department.name
            }));
            setDepartmentOptions([{value: '', label: 'Select Department'}, ...options]);
        }
    }, [department.departments]);

    useEffect(() => {
        if (department.department) {
            setDepartmentModalOpen(false)
            dispatch(getDepartments())
            if (formData.department_id !== 0) {
                dispatch(getDesignationByDepartmentID(formData.department_id))
            }
            dispatch(clearDepartmentState())
        }
    }, [department.department]);

    useEffect(() => {
        const isValid = Object.values(errorMessages).some(message => message !== '');
        setIsFormValid(!isValid);
        console.log('Error Messages:', errorMessages);
        console.log('isFormValid:', !isValid);
        if(isValid){
            setValidationMessage("Please fill all the required fields.");
        }
        // if (vendorRepresentatives.length === 0) {
        //     setVRepresentativeMessage('Vendor must have atleast one representative added.')
        // } else {
        //     setVRepresentativeMessage('');
        // }
        // if (vendorAddresses.length === 0) {
        //     setVAddressMessage('Vendor must have atleast one Address added.')
        // } else {
        //     setVAddressMessage('');
        // }

    }, [errorMessages]);




    return (
        <form className="space-y-5"  onSubmit={(e) => handleSubmit(e)}>
            <div className="flex justify-center items-center">
                <ImageUploader image={image} setImage={setImage} existingImage={imagePreview}/>
            </div>
            {!isFormValid  && validationMessage &&
               <Alert
               alertType="error"
               message={validationMessage}
               setMessages={setValidationMessage}
           />}
            <div className="flex justify-start flex-col items-start space-y-3">
                <Input
                    divClasses='w-full md:w-1/3'
                    label='Employee Code'
                    type='text'
                    name='employee_code'
                    value={formData.employee_code}
                    onChange={(e) => handleChange(e.target.name, e.target.value,e.target.required)}
                    isMasked={false}
                    disabled={true}
                    placeholder='Enter Employee Code'
                    required= {true}
                />
                <div className="w-full md:w-1/2 flex justify-center items-end gap-3">
                    <Dropdown
                        divClasses='w-full'
                        label='Departments'
                        name='deparment_id'
                        options={departmentOptions}
                        value={formData.department_id}
                        onChange={(e: any,required:any) => handleDepartmentChange(e,required)}
                        required={true}
                        errorMessage={errorMessages.department_id}
                    />
                    <Button
                        text={getIcon(IconType.add)}
                        variant={ButtonVariant.primary}
                        onClick={() => setDepartmentModalOpen(true)}
                        type={ButtonType.button}
                        size={ButtonSize.small}
                    />
                </div>
                <div className="w-full md:w-1/2 flex justify-center items-end gap-3">
                    <Dropdown
                        divClasses='w-full'
                        label='Designations'
                        name='designation_id'
                        options={designationOptions}
                        value={formData.designation_id}
                        onChange={(e: any,required:any) => {
                            if (e && typeof e !== 'undefined') {
                                setFormData(prev => ({
                                    ...prev,
                                    designation_id: e.value
                                }))
                                if (required) {
                                    setErrorMessages({ ...errorMessages, designation_id: '' });
                                }
                            } else {
                                setFormData(prev => ({
                                    ...prev,
                                    designation_id: 0
                                }))
                                if (required) {
                                    setErrorMessages({ ...errorMessages, designation_id: 'This field is required.' });
                                }
                            }
                        }}
                        required={true}
                        errorMessage={errorMessages.designation_id}
                    />
                    <Button
                        text={getIcon(IconType.add)}
                        variant={ButtonVariant.primary}
                        onClick={() => setDesignationModalOpen(true)}
                        type={ButtonType.button}
                        size={ButtonSize.small}
                    />
                </div>
                <Input
                    divClasses='w-full md:w-1/2'
                    label='Employee Name'
                    type='text'
                    name='name'
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value,true)}
                    isMasked={false}
                    styles={{height: 45}}
                    placeholder='Enter Employee Name'
                    required={true}
                    errorMessage={errorMessages.name}
                />
                <div className="flex flex-col md:flex-row gap-3 w-full">
                    <Input
                        divClasses='w-full'
                        label='Phone'
                        type='text'
                        name='phone'
                        value={formData.phone}
                        onChange={(e) => handleChange('phone', e.target.value,true)}
                        isMasked={true}
                        placeholder={MaskConfig.phone.placeholder}
                        maskPattern={MaskConfig.phone.pattern}
                        errorMessage={errorMessages.phone}
                        required={true}
                    />

                    <Input
                        divClasses='w-full'
                        label='Email Address'
                        type='email'
                        name='email'
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value,true)}
                        isMasked={false}
                        placeholder='Enter email address'
                        errorMessage={errorMessages.email}
                        required={true}
                    />
                    {!router.query.id && (
                        <Input
                            divClasses='w-full'
                            label='Password'
                            type='password'
                            name='password'
                            value={formData.password}
                            onChange={(e) => handleChange('password', e.target.value,true)}
                            isMasked={false}
                            placeholder='Enter login password'
                            errorMessage={errorMessages.password}
                            required={true}
                        />
                    )}


                </div>
                <div className="flex flex-col md:flex-row gap-3 w-full">
                    <Input
                        divClasses='w-full'
                        label='ID #'
                        type='text'
                        name='id_number'
                        value={formData.id_number}
                        onChange={(e) => handleChange('id_number', e.target.value,true)}
                        isMasked={true}
                        placeholder={MaskConfig.identityNumber.placeholder}
                        maskPattern={MaskConfig.identityNumber.pattern}
                        errorMessage={errorMessages.id_number}
                        required={true}
                    />

                    <Input
                        divClasses='w-full'
                        label='Passport #'
                        type='text'
                        name='passport_number'
                        value={formData.passport_number}
                        onChange={(e) => handleChange('passport_number', e.target.value,true)}
                        isMasked={false}
                        placeholder='Enter passport number'
                        errorMessage={errorMessages.passport_number}
                        required={true}
                    />
                    <Input
                        divClasses='w-full'
                        label='Date of Joining'
                        type='date'
                        name='date_of_joining'
                        value={formData.date_of_joining}
                        onChange={(date) => handleChange('date_of_joining', date.target.value, true)}
                        isMasked={false}
                        placeholder='Enter date of joining'
                        // errorMessage={errorMessages.date_of_joining}
                        // required={true}
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
                        options={cityOptions}
                        value={formData.city_id}
                        onChange={(e: any) => {
                            if (e && typeof e !== 'undefined') {
                                handleChange('city_id', e.value,true)
                            } else {
                                setFormData(prev => ({
                                    ...prev,
                                    city_id: 0
                                }))
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
                        onChange={(e) => handleChange('postal_code', e.target.value,true)}
                        isMasked={false}
                        placeholder='Enter postal code'
                        // errorMessage={errorMessages.postal_code}
                        // required={true}
                    />
                    <Input
                        divClasses='w-full'
                        label='Address'
                        type='text'
                        name='address'
                        value={formData.address}
                        onChange={(e) => handleChange('address', e.target.value,true)}
                        isMasked={false}
                        placeholder='Enter street address'
                        // errorMessage={errorMessages.address}
                        // required={true}
                    />
                </div>

                <div className="table-responsive w-full">
                    <div className="flex justify-between items-center flex-col md:flex-row space-y-3 md:space-y-0 mb-3">
                        <h3 className="text-lg font-semibold">Employee Documents</h3>
                        <Button
                            type={ButtonType.button}
                            variant={ButtonVariant.primary}
                            size={ButtonSize.small}
                            text='Add Document'
                            onClick={() => setDocumentModalOpen(true)}
                        />
                    </div>
                    <table>
                        <thead>
                        <tr>
                            <th>Document</th>
                            <th>Document Name</th>
                            <th>Description</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {employeeDocuments.map((document, index) => (
                            <tr key={index}>
                                <td>
                                    {document.document && createBlobUrl(document.document)
                                        ? <span className="flex gap-2 items-center text-primary">
                                            <FileDownloader
                                                file={document.document}
                                                title='Preview'
                                                buttonVariant={ButtonVariant.primary}
                                                size={ButtonSize.small}
                                                buttonType={ButtonType.icon}
                                            />
                                            <span>Download</span>
                                        </span>
                                        : <span>No Preview</span>
                                    }
                                </td>
                                <td>{document.name}</td>
                                <td>{document.description}</td>
                                {/*<td>{document.is_active ? 'Active' : 'Inactive'}</td>*/}
                                <td>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveDocument(index)}
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
                        <h3 className="text-lg font-semibold">Employee Bank Accounts</h3>
                        <Button
                            type={ButtonType.button}
                            variant={ButtonVariant.primary}
                            size={ButtonSize.small}
                            text='Add Bank Detail'
                            onClick={() => setBankModalOpen(true)}
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
                        {employeeBankAccounts.map((bankAccount, index) => (
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
                    {isFormValid && <Button
                        text={employee.loading ? 'Loading...' : router.query.id ? 'Update Employee' : 'Save Employee'}
                        variant={ButtonVariant.primary}
                        type={ButtonType.submit}
                    />}
                </div>
            </div>
            <DocumentFormModal
                modalOpen={documentModalOpen}
                setModalOpen={setDocumentModalOpen}
                handleSubmit={(value: any) => {
                    setEmployeeDocuments([...employeeDocuments, value])
                    setDocumentModalOpen(false)
                }}
            />
            <DepartmentFormModal
                modalOpen={departmentModalOpen}
                departments={departmentOptions}
                setModalOpen={setDepartmentModalOpen}
                handleAddition={(value: any) => {
                    dispatch(storeDepartment({
                        name: value.name,
                        parent_id: value.parentId,
                        description: value.description,
                        is_active: true
                    }))
                }}
            />
            <DesignationFormModal
                modalOpen={designationModalOpen}
                departments={departmentOptions}
                setModalOpen={setDesignationModalOpen}
                handleSubmit={(value: any) => {
                    dispatch(storeDesignation({
                        name: value.name,
                        department_id: value.departmentId,
                        description: value.description,
                        is_active: true
                    }))
                }}
            />

            <BankDetailModal
                title='Employee'
                modalOpen={bankModalOpen}
                setModalOpen={setBankModalOpen}
                handleSubmit={(value: any) => {
                    setEmployeeBankAccounts([...employeeBankAccounts, value])
                    setBankModalOpen(false)
                }}
            />
        </form>
    );
};

export default EmployeeForm;
