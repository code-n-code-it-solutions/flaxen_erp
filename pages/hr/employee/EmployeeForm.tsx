import React, {useEffect, useState} from 'react';
import ImageUploader from "@/components/form/ImageUploader";
import {setAuthToken, setContentType} from "@/configs/api.config";
import {useDispatch, useSelector} from "react-redux";
import {ThunkDispatch} from "redux-thunk";
import {IRootState} from "@/store";
import {AnyAction} from "redux";
import Select from "react-select";
import {clearLocationState, getCities, getCountries, getStates} from "@/store/slices/locationSlice";
import {useRouter} from "next/router";
import BankDetailModal from "@/components/specific-modal/BankDetailModal";
import {clearEmployeeState, storeEmployee} from "@/store/slices/employeeSlice";
import {clearDesignationState, getDesignationByDepartmentID, storeDesignation} from "@/store/slices/designationSlice";
import {clearDepartmentState, getDepartments, storeDepartment} from "@/store/slices/departmentSlice";
import DepartmentFormModal from "@/components/specific-modal/DepartmentFormModal";
import DesignationFormModal from "@/components/specific-modal/DesignationFormModal";
import DocumentFormModal from "@/components/specific-modal/DocumentFormModal";
import {clearUtilState, generateCode} from "@/store/slices/utilSlice";
import {FORM_CODE_TYPE} from "@/utils/enums";
import {MaskConfig} from "@/configs/mask.config";
import MaskedInput from "react-text-mask";

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
    is_active: boolean;
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

    const [bankModalOpen, setBankModalOpen] = useState<boolean>(false);
    const [image, setImage] = useState<File | null>(null);
    const [employeeBankAccounts, setEmployeeBankAccounts] = useState<IBankAccount[]>([]);
    const [employeeDocuments, setEmployeeDocuments] = useState<IDocuments[]>([]);
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

    const [departmentModalOpen, setDepartmentModalOpen] = useState(false);
    const [documentModalOpen, setDocumentModalOpen] = useState(false);
    const [designationModalOpen, setDesignationModalOpen] = useState(false);
    const [countryOptions, setCountryOptions] = useState([]);
    const [stateOptions, setStateOptions] = useState([]);
    const [cityOptions, setCityOptions] = useState([]);
    const [departmentOptions, setDepartmentOptions] = useState<any[]>([]);
    const [designationOptions, setDesignationOptions] = useState<any[]>([]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const {name, value} = e.target;
        setFormData(prevFormData => {
            return {...prevFormData, [name]: value};
        });
    };

    const handleDepartmentChange = (e: any) => {
        if (e && e.value && typeof e !== 'undefined') {
            setFormData(prev => ({...prev, department_id: e.value}))
            dispatch(getDesignationByDepartmentID(parseInt(e.value)))
        }
    }

    const handleCountryChange = (e: any) => {
        if (e && e.value && typeof e !== 'undefined') {
            setFormData(prev => ({...prev, country_id: e.value}))
            dispatch(getStates(parseInt(e.value)))
        }
    }

    const handleStateChange = (e: any) => {
        if (e && e.value && typeof e !== 'undefined') {
            setFormData(prev => ({...prev, state_id: e.value}))
            dispatch(getCities({countryId: formData.country_id, stateId: parseInt(e.value)}))
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
        dispatch(clearLocationState())
        dispatch(clearEmployeeState())
        dispatch(clearUtilState())
        setAuthToken(token)
        dispatch(getCountries())
        dispatch(getDepartments())
        dispatch(generateCode(FORM_CODE_TYPE.EMPLOYEE))
    }, [])

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
        if (employee.employee && employee.success) {
            router.push('/hr/employee')
            dispatch(clearEmployeeState())
        }
    }, [employee.employee, employee.success])

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

    return (
        <form className="space-y-5" onSubmit={(e) => handleSubmit(e)}>
            <div className="flex justify-center items-center">
                <ImageUploader image={image} setImage={setImage}/>
            </div>
            <div className="flex justify-start flex-col items-start space-y-3">
                <div className="w-full md:w-1/3">
                    <label htmlFor="employee_code">Employee Code</label>
                    <input id="employee_code" type="text" name="employee_code" placeholder="Enter Employee Code"
                           value={formData.employee_code} onChange={handleChange} disabled={true}
                           className="form-input"/>
                </div>
                <div className="w-full md:w-1/2 flex justify-center items-end gap-3">
                    <div className="w-full">
                        <label htmlFor="deparment_id">Departments</label>
                        <Select
                            defaultValue={departmentOptions[0]}
                            options={departmentOptions}
                            isSearchable={true}
                            isClearable={true}
                            placeholder={'Select Department'}
                            onChange={(e: any) => handleDepartmentChange(e)}
                        />
                    </div>
                    <button className="btn btn-primary btn-sm flex justify-center items-center"
                            onClick={() => setDepartmentModalOpen(true)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                             className="h-5 w-5 ltr:mr-2 rtl:ml-2"
                             fill="none">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
                            <path d="M15 12L12 12M12 12L9 12M12 12L12 9M12 12L12 15" stroke="currentColor"
                                  strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                    </button>
                </div>
                <div className="w-full md:w-1/2 flex justify-center items-end gap-3">
                    <div className='w-full'>
                        <label htmlFor="designation_id">Designations</label>
                        <Select
                            defaultValue={designationOptions[0]}
                            options={designationOptions}
                            isSearchable={true}
                            isClearable={true}
                            placeholder={'Select Designation'}
                            onChange={(e: any) => setFormData(prev => ({
                                ...prev,
                                designation_id: e && typeof e !== 'undefined' ? e.value : 0
                            }))}
                        />
                    </div>
                    <button className="btn btn-primary btn-sm flex justify-center items-center"
                            onClick={() => setDesignationModalOpen(true)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                             className="h-5 w-5 ltr:mr-2 rtl:ml-2"
                             fill="none">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
                            <path d="M15 12L12 12M12 12L9 12M12 12L12 9M12 12L12 15" stroke="currentColor"
                                  strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                    </button>
                </div>
                <div className="w-full md:w-1/2">
                    <label htmlFor="name">Employee Name</label>
                    <input id="name" type="text" name="name" placeholder="Enter Employee Name"
                           value={formData.name} onChange={handleChange}
                           className="form-input" style={{height: 45}}/>
                </div>
                <div className="flex flex-col md:flex-row gap-3 w-full">
                    <div className="w-full">
                        <label htmlFor="phone">Phone</label>
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
                        {/*<input id="phone" type="number" name="phone" placeholder="Enter Phone number"*/}
                        {/*       value={formData.phone} onChange={handleChange}*/}
                        {/*       className="form-input"/>*/}
                    </div>

                    <div className="w-full">
                        <label htmlFor="email">Email</label>
                        <input id="email" type="email" name="email" placeholder="Enter email address"
                               value={formData.email} onChange={handleChange}
                               className="form-input"/>
                    </div>

                    <div className="w-full">
                        <label htmlFor="password">Password</label>
                        <input id="password" type="password" name="password" placeholder="Enter password"
                               value={formData.password} onChange={handleChange}
                               className="form-input"/>
                    </div>

                </div>
                <div className="flex flex-col md:flex-row gap-3 w-full">
                    <div className="w-full">
                        <label htmlFor="id_number">ID #</label>
                        <MaskedInput
                            id="id_number"
                            type="text"
                            placeholder={MaskConfig.identityNumber.placeholder}
                            className="form-input"
                            guide={true}
                            name="id_number"
                            value={formData.id_number}
                            onChange={handleChange}
                            mask={MaskConfig.identityNumber.pattern}
                        />
                        {/*<input id="id_number" type="text" name="id_number" placeholder="Enter national identity number"*/}
                        {/*       value={formData.id_number} onChange={handleChange}*/}
                        {/*       className="form-input"/>*/}
                    </div>

                    <div className="w-full">
                        <label htmlFor="passport_number">Passport #</label>
                        <input id="passport_number" type="text" name="passport_number"
                               placeholder="Enter passport number"
                               value={formData.passport_number} onChange={handleChange}
                               className="form-input"/>
                    </div>
                    <div className="w-full">
                        <label htmlFor="date_of_joining">Date of Joining</label>
                        <input id="date_of_joining" type="date" name="date_of_joining"
                               placeholder="Enter date of joining"
                               value={formData.date_of_joining} onChange={handleChange}
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
                        <label htmlFor="address">Address</label>
                        <input id="address" type="text" name="address" placeholder="Enter address"
                               value={formData.address} onChange={handleChange}
                               className="form-input"/>
                    </div>
                </div>

                <div className="table-responsive w-full">
                    <div className="flex justify-between items-center flex-col md:flex-row space-y-3 md:space-y-0 mb-3">
                        <h3 className="text-lg font-semibold">Employee Documents</h3>
                        <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            onClick={() => setDocumentModalOpen(true)}
                        >
                            Add Document
                        </button>
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
                                <td></td>
                                <td>{document.name}</td>
                                <td>{document.description}</td>
                                <td>{document.is_active ? 'Active' : 'Inactive'}</td>
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
                        <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            onClick={() => setBankModalOpen(true)}
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
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={employee.loading}
                    >
                        {employee.loading ? 'Loading...' : 'Save Employee'}
                    </button>
                </div>
            </div>
            <DocumentFormModal
                modalOpen={documentModalOpen}
                setModalOpen={setDocumentModalOpen}
                handleAddition={(value: any) => {
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
                handleAddition={(value: any) => {
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
                handleAddition={(value: any) => {
                    setEmployeeBankAccounts([...employeeBankAccounts, value])
                    setBankModalOpen(false)
                }}
            />
        </form>
    );
};

export default EmployeeForm;
