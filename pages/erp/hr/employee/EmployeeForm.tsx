import React, {useEffect, useState} from 'react';
import ImageUploader from "@/components/form/ImageUploader";
import {setAuthToken, setContentType} from "@/configs/api.config";
import {useAppDispatch, useAppSelector} from "@/store";
import {clearLocationState, getCities, getCountries, getStates} from "@/store/slices/locationSlice";
import {useRouter} from "next/router";
import BankDetailModal from "@/components/modals/BankDetailModal";
import {clearEmployeeState, storeEmployee, updateEmployee} from "@/store/slices/employeeSlice";
import {getDesignationByDepartmentID} from "@/store/slices/designationSlice";
import {getDepartments, storeDepartment} from "@/store/slices/departmentSlice";
import DepartmentFormModal from "@/components/modals/DepartmentFormModal";
import DesignationFormModal from "@/components/modals/DesignationFormModal";
import DocumentFormModal from "@/components/modals/DocumentFormModal";
import {clearUtilState, generateCode} from "@/store/slices/utilSlice";
import {ButtonSize, ButtonType, ButtonVariant, FORM_CODE_TYPE, IconType} from "@/utils/enums";
import {MaskConfig} from "@/configs/mask.config";
import {Input} from "@/components/form/Input";
import {Dropdown} from "@/components/form/Dropdown";
import Button from "@/components/Button";
import {getIcon, serverFilePath} from "@/utils/helper";
import FileDownloader from "@/components/FileDownloader";
import {clearRawProductState} from "@/store/slices/rawProductSlice";
import Alert from "@/components/Alert";

interface IFormProps {
    id?: any
}

const EmployeeForm = ({id}: IFormProps) => {
    const router = useRouter();
    const dispatch = useAppDispatch();

    const {token} = useAppSelector((state) => state.user);
    const {countries, states, cities} = useAppSelector((state) => state.location);
    const {designation, designations, loading: designationLoading} = useAppSelector((state) => state.designation);
    const {department, departments} = useAppSelector((state) => state.department);
    const {employeeDetail, loading, success} = useAppSelector((state) => state.employee);
    const {code} = useAppSelector((state) => state.util);

    const [bankModalOpen, setBankModalOpen] = useState<boolean>(false);
    const [image, setImage] = useState<File | null>(null);
    const [employeeBankAccounts, setEmployeeBankAccounts] = useState<any[]>([]);
    const [employeeDocuments, setEmployeeDocuments] = useState<any[]>([]);
    const [isFormValid, setIsFormValid] = useState<boolean>(false);
    const [validationMessage, setValidationMessage] = useState("");

    const [errorMessages, setErrorMessages] = useState<any>({});
    const [formData, setFormData] = useState<any>({});
    const [imagePreview, setImagePreview] = useState('');
    const [departmentModalOpen, setDepartmentModalOpen] = useState(false);
    const [documentModalOpen, setDocumentModalOpen] = useState(false);
    const [designationModalOpen, setDesignationModalOpen] = useState(false);
    const [countryOptions, setCountryOptions] = useState([]);
    const [stateOptions, setStateOptions] = useState([]);
    const [cityOptions, setCityOptions] = useState([]);
    const [departmentOptions, setDepartmentOptions] = useState<any[]>([]);
    const [designationOptions, setDesignationOptions] = useState<any[]>([]);

    const handleChange = (name: string, value: any, required: any) => {
        if (name === 'department_id' || name === 'designation_id' || name === 'country_id' || name === 'state_id' || name === 'city_id') {
            if (value && typeof value !== 'undefined') {
                setFormData((prev: any) => ({...prev, [name]: value.value}));
                if (name === 'department_id') {
                    dispatch(getDesignationByDepartmentID(parseInt(value.value)))
                }

                if (name === 'country_id') {
                    dispatch(getStates(parseInt(value.value)))
                }

                if (name === 'state_id') {
                    dispatch(getCities({countryId: formData.country_id, stateId: parseInt(value.value)}))
                }

            } else {
                setFormData((prev: any) => ({...prev, [name]: ''}));

                if (name === 'department_id') {
                    setDesignationOptions([])
                    setFormData((prev: any) => ({...prev, designation_id: ''}))
                }

                if (name === 'country_id') {
                    setFormData((prev: any) => ({...prev, state_id: ''}))
                    setFormData((prev: any) => ({...prev, city_id: ''}))
                    setStateOptions([])
                    setCityOptions([])
                }

                if (name === 'state_id') {
                    setFormData((prev: any) => ({...prev, city_id: ''}))
                    setCityOptions([])
                }
            }
        } else {
            setFormData((prev: any) => ({...prev, [name]: value}));
        }

        if (required) {
            if (!value) {
                setErrorMessages({...errorMessages, [name]: 'This field is required.'});
            } else {
                setErrorMessages((prev: any) => {
                    delete prev[name];
                    return prev;
                });
            }
        }
    };

    const handleRemove = (index: number, type: string) => {
        if (type === 'document') {
            setEmployeeDocuments(employeeDocuments.filter((_, i) => i !== index))
        } else {
            setEmployeeBankAccounts(employeeBankAccounts.filter((_, i) => i !== index))
        }
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setAuthToken(token)
        setContentType('multipart/form-data')
        let finalData = {
            ...formData,
            image: image,
            bank_accounts: employeeBankAccounts.map((bankAccount: any) => ({
                id: bankAccount.id ? bankAccount.id : 0,
                bank_id: bankAccount.bank_id,
                currency_id: bankAccount.currency_id,
                account_name: bankAccount.account_name,
                account_number: bankAccount.account_number,
                iban: bankAccount.iban,
                is_active: true
            })),
            documents: employeeDocuments.map((documentDetail: any) => ({
                id: documentDetail.id ? documentDetail.id : 0,
                document: typeof documentDetail.document === 'string' ? null : documentDetail.document,
                document_id: documentDetail.document_id,
                name: documentDetail.name,
                description: documentDetail.description,
                is_active: true
            })),
        }
        if (id) {
            // console.log(finalData)
            dispatch(updateEmployee({id, employeeData: finalData}));
        } else {
            dispatch(storeEmployee(finalData));
        }
    };

    useEffect(() => {
        if (employeeDetail) {
            setImagePreview(serverFilePath(employeeDetail.thumbnail?.path))
            dispatch(getDesignationByDepartmentID(employeeDetail.department_id))
            setEmployeeBankAccounts(employeeDetail.bank_accounts.map((account: any) => ({
                id: account.id,
                bank_id: account.bank.id,
                bank_name: account.bank.name,
                currency_id: account.currency_id,
                currency_name: account.currency.name,
                currency_code: account.currency.code,
                account_name: account.account_name,
                account_number: account.account_number,
                iban: account.iban
            })))
            setEmployeeDocuments(employeeDetail.documents.map((document: any) => ({
                id: document.id,
                document_id: document.document_id,
                document: document.document?.path,
                name: document.name,
                description: document.description
            })))

            setFormData({
                ...formData,
                employee_code: employeeDetail.employee_code,
                name: employeeDetail.user.name,
                phone: employeeDetail.phone,
                // email: employeeDetail.user.email,
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
                bank_accounts: employeeBankAccounts,
                documents: employeeDocuments,
            });

            setImagePreview(serverFilePath(employeeDetail.thumbnail?.path))
        } else {
            setImagePreview(serverFilePath(''))
        }
    }, [employeeDetail]);

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
            setImagePreview(serverFilePath(''));
        }
        return () => {
            dispatch(clearRawProductState());
        };
    }, [id, dispatch]);

    useEffect(() => {
        if (code) {
            setFormData((prev: any) => ({...prev, employee_code: code[FORM_CODE_TYPE.EMPLOYEE]}))
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
        if (departments) {
            const options = departments.map((department: any) => ({
                value: department.id,
                label: department.name
            }));
            setDepartmentOptions([{value: '', label: 'Select Department'}, ...options]);
        }
    }, [departments]);

    useEffect(() => {
        if (designations) {
            const options = designations.map((designation: any) => ({
                value: designation.id,
                label: designation.name
            }));
            setDesignationOptions([{value: '', label: 'Select Designations'}, ...options]);
        }
    }, [designations]);

    useEffect(() => {
        if (designation) {
            if (formData.department_id !== 0) {
                dispatch(getDesignationByDepartmentID(formData.department_id))
            }
        }
    }, [designation]);

    useEffect(() => {
        if (department) {
            dispatch(getDepartments())
            if (formData.department_id !== 0) {
                dispatch(getDesignationByDepartmentID(formData.department_id))
            }
        }
    }, [department]);

    useEffect(() => {
        const isValid = Object.values(errorMessages).some(message => message !== '');
        setIsFormValid(!isValid);
        if (isValid) {
            setValidationMessage("Please fill all the required fields.");
        }
    }, [errorMessages]);


    return (
        <form className="space-y-5" onSubmit={(e) => handleSubmit(e)}>
            <div className="flex justify-center items-center">
                <ImageUploader image={image} setImage={setImage} existingImage={imagePreview}/>
            </div>
            {!isFormValid && validationMessage &&
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
                    onChange={(e) => handleChange(e.target.name, e.target.value, e.target.required)}
                    isMasked={false}
                    disabled={true}
                    placeholder='Enter Employee Code'
                    required={true}
                />
                <div className="w-full md:w-1/2 flex justify-center items-end gap-3">
                    <Dropdown
                        divClasses='w-full'
                        label='Departments'
                        name='department_id'
                        options={departmentOptions}
                        value={formData.department_id}
                        onChange={(e: any, required: any) => handleChange('department_id', e, true)}
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
                        onChange={(e: any) => handleChange('designation_id', e, true)}
                        isLoading={designationLoading}
                        isDisabled={designationLoading}
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
                    onChange={(e) => handleChange(e.target.name, e.target.value, true)}
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
                        onChange={(e) => handleChange('phone', e.target.value, true)}
                        isMasked={true}
                        placeholder={MaskConfig.phone.placeholder}
                        maskPattern={MaskConfig.phone.pattern}
                        errorMessage={errorMessages.phone}
                        required={true}
                    />


                    {!router.query.id && (
                        <>
                            <Input
                                divClasses='w-full'
                                label='Email Address'
                                type='email'
                                name='email'
                                value={formData.email}
                                onChange={(e) => handleChange('email', e.target.value, true)}
                                isMasked={false}
                                placeholder='Enter email address'
                                errorMessage={errorMessages.email}
                                required={true}
                            />
                            <Input
                                divClasses='w-full'
                                label='Password'
                                type='password'
                                name='password'
                                value={formData.password}
                                onChange={(e) => handleChange('password', e.target.value, true)}
                                isMasked={false}
                                placeholder='Enter login password'
                                errorMessage={errorMessages.password}
                                required={true}
                            />
                        </>
                    )}


                </div>
                <div className="flex flex-col md:flex-row gap-3 w-full">
                    <Input
                        divClasses='w-full'
                        label='ID #'
                        type='text'
                        name='id_number'
                        value={formData.id_number}
                        onChange={(e) => handleChange('id_number', e.target.value, true)}
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
                        onChange={(e) => handleChange('passport_number', e.target.value, true)}
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
                        onChange={(date) => handleChange('date_of_joining', date[0].toLocaleDateString(), true)}
                        isMasked={false}
                        placeholder='Enter date of joining'
                        errorMessage={errorMessages.date_of_joining}
                        required={true}
                    />

                </div>

                <div className="flex flex-col md:flex-row gap-3 w-full">
                    <Dropdown
                        divClasses='w-full'
                        label='Country'
                        name='country_id'
                        options={countryOptions}
                        value={formData.country_id}
                        onChange={(e: any) => handleChange('country_id', e, false)}
                    />

                    <Dropdown
                        divClasses='w-full'
                        label='State'
                        name='state_id'
                        options={stateOptions}
                        value={formData.state_id}
                        onChange={(e: any) => handleChange('state_id', e, false)}
                    />

                    <Dropdown
                        divClasses='w-full'
                        label='City'
                        name='city_id'
                        options={cityOptions}
                        value={formData.city_id}
                        onChange={(e: any) => handleChange('city_id', e, false)}
                    />
                </div>
                <div className="flex flex-col md:flex-row gap-3 w-full">
                    <Input
                        divClasses='w-full md:w-1/3'
                        label='Postal Code'
                        type='text'
                        name='postal_code'
                        value={formData.postal_code}
                        onChange={(e) => handleChange('postal_code', e.target.value, true)}
                        isMasked={false}
                        placeholder='Enter postal code'
                    />
                    <Input
                        divClasses='w-full'
                        label='Address'
                        type='text'
                        name='address'
                        value={formData.address}
                        onChange={(e) => handleChange('address', e.target.value, e.target.required)}
                        isMasked={false}
                        placeholder='Enter street address'
                        required={true}
                        errorMessage={errorMessages.address}
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
                                    {document.document
                                        ? <span className="flex gap-2 items-center text-primary">
                                            <FileDownloader
                                                file={document.document}
                                                title={
                                                    <span className="flex justify-center items-center gap-3">
                                                        {getIcon(IconType.download)}
                                                        <span>Preview</span>
                                                    </span>
                                                }
                                                buttonVariant={ButtonVariant.primary}
                                                size={ButtonSize.small}
                                                buttonType={ButtonType.link}
                                            />
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
                                        onClick={() => handleRemove(index, 'document')}
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
                                        onClick={() => handleRemove(index, 'bank')}
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
                        text={loading ? 'Loading...' : router.query.id ? 'Update Employee' : 'Save Employee'}
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
            />
            <DesignationFormModal
                modalOpen={designationModalOpen}
                departments={departmentOptions}
                setModalOpen={setDesignationModalOpen}
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
