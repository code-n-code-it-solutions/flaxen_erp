import React, { Fragment, useEffect, useState } from 'react';
import { setAuthToken } from '@/configs/api.config';
import { useAppDispatch, useAppSelector } from '@/store';
import { clearUtilState, generateCode } from '@/store/slices/utilSlice';
import { ButtonSize, ButtonType, ButtonVariant, FORM_CODE_TYPE } from '@/utils/enums';
import { Dropdown } from '@/components/form/Dropdown';
import Button from '@/components/Button';
import { Input } from '@/components/form/Input';
import Alert from '@/components/Alert';
import { Tab } from '@headlessui/react';
import { clearProjectState, storeProject, updateProject } from '@/store/slices/projects/projectSlice';
import Modal from '@/components/Modal';
import { getCities, getCountries, getStates } from '@/store/slices/locationSlice';
import IconPlus from '@/components/Icon/IconPlus';
import Textarea from '@/components/form/Textarea';
import { clearProjectTypeState, getProjectTypes, storeProjectType } from '@/store/slices/projects/projectTypeSlice';
import { getClients } from '@/store/slices/projects/clientSlice';
import { getConsultants } from '@/store/slices/projects/consultantSlice';
import Swal from 'sweetalert2';

interface IFormProps {
    id?: any;
}

const ProjectForm = ({ id }: IFormProps) => {
    const dispatch = useAppDispatch();
    const { token } = useAppSelector((state) => state.user);
    const { countries, states, cities } = useAppSelector((state) => state.location);
    const { code } = useAppSelector((state) => state.util);
    const { projectDetail, loading, success } = useAppSelector((state) => state.project);
    const { projectTypes, projectType, loading: projectTypeLoading } = useAppSelector((state) => state.projectType);
    const { clients } = useAppSelector((state) => state.client);

    const [projectSiteModal, setProjectSiteModal] = useState<boolean>(false);
    const [projectSites, setProjectSites] = useState<any[]>([]);
    const [projectSiteDetail, setProjectSiteDetail] = useState<any>({});

    const [projectTypeModal, setProjectTypeModal] = useState<boolean>(false);
    const [projectTypeDetails, setProjectTypeDetails] = useState<any>({});

    const [isFormValid, setIsFormValid] = useState<boolean>(false);
    const [validationMessage, setValidationMessage] = useState('');
    const [errorMessages, setErrorMessages] = useState<any>({});

    const [formData, setFormData] = useState<any>({});
    const [projectTypeOptions, setProjectTypeOptions] = useState<any[]>([]);
    const [countryOptions, setCountryOptions] = useState<any[]>([]);
    const [stateOptions, setStateOptions] = useState<any[]>([]);
    const [cityOptions, setCityOptions] = useState<any[]>([]);
    const [clientOptions, setClientOptions] = useState<any[]>([]);
    const [projectStatusOptions, setProjectStatusOptions] = useState<any[]>([
        { value: 'pending', label: 'Pending' },
        { value: 'in_progress', label: 'In Progress'},
        { value: 'completed', label: 'Completed' },
        { value: 'on_hold', label: 'On Hold' },
        { value: 'cancelled', label: 'Cancelled'}
    ]);

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

    const handleRemoveRow = (index: number) => {
        setProjectSites(projectSites.filter((item, i) => i !== index));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setAuthToken(token);
        if (id) {
            dispatch(updateProject({ id, formData }));
        } else {
            if (projectSites.length === 0) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Please add at least one site!'
                });
                return;
            }

            dispatch(storeProject({
                ...formData,
                project_sites: projectSites.map((site) => ({
                    site_name: site.site_name,
                    country_id: site.country_id,
                    state_id: site.state_id,
                    city_id: site.city_id,
                    address: site.address,
                    zip_code: site.zip_code
                }))
            }));
        }
    };

    useEffect(() => {
        setAuthToken(token);
        dispatch(clearUtilState());
        dispatch(clearProjectState());
        dispatch(getClients());
        dispatch(getConsultants());
        dispatch(getProjectTypes());
        dispatch(getCountries());
    }, []);

    useEffect(() => {
        if (!id) {
            dispatch(generateCode(FORM_CODE_TYPE.PROJECT));
        }
        return () => {
            dispatch(clearProjectState());
        };
    }, [id, dispatch]);

    useEffect(() => {
        if (code) {
            setFormData((prev: any) => ({ ...prev, project_code: code[FORM_CODE_TYPE.PROJECT] }));
        }
    }, [code]);

    useEffect(() => {
        const isValid = Object.values(errorMessages).some(message => message !== '');
        setIsFormValid(!isValid);
        if (isValid) {
            setValidationMessage('Please fill all the required fields.');
        }

    }, [errorMessages]);

    useEffect(() => {
        if (countries) {
            setCountryOptions(countries.map((country: any) => {
                return { value: country.id, label: country.name };
            }));
            setStateOptions([]);
            setCityOptions([]);
        }
    }, [countries]);

    useEffect(() => {
        if (states) {
            setStateOptions(states.map((state: any) => {
                return { value: state.id, label: state.name };
            }));
            setCityOptions([]);
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
        if (projectType) {
            setProjectTypeDetails({});
            setProjectTypeModal(false);
            dispatch(clearProjectTypeState());
            dispatch(getProjectTypes());
        }
    }, [projectType]);

    useEffect(() => {
        if (projectTypes.length > 0) {
            setProjectTypeOptions(projectTypes.map((type: any) => {
                return { value: type.id, label: type.name };
            }));
        }
    }, [projectTypes]);

    useEffect(() => {
        if (clients.length > 0) {
            setClientOptions(clients.map((type: any) => {
                return { value: type.id, label: type.name };
            }));
        }
    }, [clients]);

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
                label="Project code"
                type="text"
                name="project_code"
                value={formData.project_code}
                onChange={(e) => handleChange(e.target.name, e.target.value, e.target.required)}
                placeholder="Enter Project code"
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
                    placeholder="Enter Project Name"
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
                                        Sites
                                    </button>
                                )}
                            </Tab>
                        </Tab.List>
                        <Tab.Panels className="rounded-none px-2">
                            <Tab.Panel>
                                <div className="mt-3 active">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                        <div className="flex items-end gap-1">
                                            <Dropdown
                                                divClasses="w-full"
                                                label="Client"
                                                name="client_id"
                                                options={clientOptions}
                                                value={formData.client_id}
                                                onChange={(e: any) => {
                                                    if (e && e.value && typeof e !== 'undefined') {
                                                        handleChange('client_id', e.value, true);
                                                    } else {
                                                        handleChange('client_id', 0, true);
                                                    }
                                                }}
                                            />
                                            <Button
                                                type={ButtonType.link}
                                                text={<IconPlus />}
                                                variant={ButtonVariant.primary}
                                                link={`/apps/project/configuration/clients/create`}
                                            />
                                        </div>
                                        <div className="flex items-end gap-1">
                                            <Dropdown
                                                divClasses="w-full"
                                                label="Project Type"
                                                name="project_type_id"
                                                options={projectTypeOptions}
                                                value={formData.project_type_id}
                                                onChange={(e: any) => {
                                                    if (e && e.value && typeof e !== 'undefined') {
                                                        handleChange('project_type_id', e.value, true);
                                                    } else {
                                                        handleChange('project_type_id', 0, true);
                                                    }
                                                }}
                                            />
                                            <Button
                                                type={ButtonType.button}
                                                text={<IconPlus />}
                                                variant={ButtonVariant.primary}
                                                onClick={() => {
                                                    setProjectTypeModal(true);
                                                    setProjectTypeDetails({});
                                                }}
                                            />
                                        </div>
                                        <Input
                                            divClasses="w-full"
                                            label="Start Date"
                                            type="date"
                                            name="start_date"
                                            value={formData.start_date}
                                            onChange={(e) => handleChange('start_date', e ? e[0].toLocaleDateString() : '', true)}
                                            placeholder="Enter Start Date"
                                            isMasked={false}
                                            required={true}
                                            errorMessage={errorMessages.start_date}
                                        />
                                        <Input
                                            divClasses="w-full"
                                            label="End Date"
                                            type="date"
                                            name="end_date"
                                            value={formData.end_date}
                                            onChange={(e) => handleChange('end_date', e ? e[0].toLocaleDateString() : '', true)}
                                            placeholder="Enter End Date"
                                            isMasked={false}
                                            required={true}
                                            errorMessage={errorMessages.end_date}
                                        />
                                        <Input
                                            divClasses="w-full"
                                            label="Budget"
                                            type="number"
                                            name="budget"
                                            value={formData.budget}
                                            onChange={(e) => handleChange(e.target.name, e.target.value, e.target.required)}
                                            placeholder="Enter budget of project"
                                            isMasked={false}
                                            required={true}
                                            errorMessage={errorMessages?.budget}
                                        />
                                        <Input
                                            divClasses="w-full"
                                            label="Estimated Cost"
                                            type="number"
                                            name="estimated_cost"
                                            value={formData.estimated_cost}
                                            onChange={(e) => handleChange(e.target.name, e.target.value, e.target.required)}
                                            placeholder="Enter estimated cost of project"
                                            isMasked={false}
                                            required={true}
                                            errorMessage={errorMessages?.estimated_cost}
                                        />
                                        <Dropdown
                                            divClasses="w-full"
                                            label="Project Status"
                                            name="project_status"
                                            options={projectStatusOptions}
                                            value={formData.project_status}
                                            onChange={(e: any) => {
                                                if (e && e.value && typeof e !== 'undefined') {
                                                    handleChange('project_status', e.value, true);
                                                } else {
                                                    handleChange('project_status', 0, true);
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                            </Tab.Panel>
                            <Tab.Panel>
                                <div className="mt-3 table-responsive">
                                    <div
                                        className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-3">
                                        <h4 className="text-lg font-bold">Project Sites</h4>
                                        <Button
                                            type={ButtonType.button}
                                            text="Add New Site"
                                            variant={ButtonVariant.primary}
                                            size={ButtonSize.small}
                                            onClick={() => {
                                                setProjectSiteDetail({});
                                                setProjectSiteModal(true);
                                            }}
                                        />
                                    </div>
                                    <table>
                                        <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Site Name</th>
                                            <th>Country</th>
                                            <th>State</th>
                                            <th>City</th>
                                            <th>Address</th>
                                            <th>Zip Code</th>
                                            <th>Actions</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {projectSites.map((site, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{site.site_name}</td>
                                                <td>{site.country_name}</td>
                                                <td>{site.state_name}</td>
                                                <td>{site.city_name}</td>
                                                <td>{site.address}</td>
                                                <td>{site.zip_code}</td>
                                                <td>
                                                    <Button
                                                        type={ButtonType.button}
                                                        text="Delete"
                                                        variant={ButtonVariant.danger}
                                                        size={ButtonSize.small}
                                                        onClick={() => handleRemoveRow(index)}
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
                    {<Button type={ButtonType.submit} text={loading ? 'Loading...' : id ? 'Update' : 'Create'}
                             variant={ButtonVariant.info} disabled={loading} classes="!mt-6" />}
                </div>
            </div>

            <Modal
                title="Add Project Site"
                show={projectSiteModal}
                setShow={setProjectSiteModal}
                footer={
                    <div className="flex justify-end gap-3">
                        <Button
                            type={ButtonType.button}
                            text="Cancel"
                            variant={ButtonVariant.danger}
                            onClick={() => setProjectSiteModal(false)}
                        />
                        <Button
                            type={ButtonType.button}
                            text="Add"
                            variant={ButtonVariant.primary}
                            onClick={() => {
                                setProjectSites([...projectSites, projectSiteDetail]);
                                setProjectSiteDetail({});
                                setProjectSiteModal(false);
                            }}
                        />
                    </div>
                }
            >
                <Input
                    divClasses="w-full"
                    label="Site Name"
                    type="text"
                    name="site_name"
                    value={projectSiteDetail.name}
                    onChange={(e) => setProjectSiteDetail({ ...projectSiteDetail, site_name: e.target.value })}
                    placeholder="Enter Project Site Name"
                    isMasked={false}
                />
                <div className="flex flex-col md:flex-row gap-3 w-full">
                    <Dropdown
                        divClasses="w-full"
                        label="Country"
                        name="country_id"
                        options={countryOptions}
                        value={projectSiteDetail.country_id}
                        onChange={(e) => {
                            e && typeof e !== 'undefined' && dispatch(getStates(parseInt(e.value)));
                            setProjectSiteDetail({
                                ...projectSiteDetail,
                                country_name: e?.label,
                                country_id: e?.value
                            });
                        }}
                    />
                    <Dropdown
                        divClasses="w-full"
                        label="State"
                        name="state_id"
                        options={stateOptions}
                        value={projectSiteDetail.state_id}
                        onChange={(e) => {
                            e && typeof e !== 'undefined' && projectSiteDetail.country_id && dispatch(getCities({
                                countryId: projectSiteDetail.country_id,
                                stateId: parseInt(e.value)
                            }));
                            setProjectSiteDetail({ ...projectSiteDetail, state_name: e?.label, state_id: e?.value });
                        }}
                    />
                </div>
                <div className="flex flex-col md:flex-row gap-3 w-full">
                    <Dropdown
                        divClasses="w-full"
                        label="City"
                        name="city_id"
                        options={cityOptions}
                        value={projectSiteDetail.city_id}
                        onChange={(e) => setProjectSiteDetail({
                            ...projectSiteDetail,
                            city_name: e?.label,
                            city_id: e?.value
                        })}
                    />
                    <Input
                        divClasses="w-full"
                        label="Postal Code"
                        type="text"
                        name="zip_code"
                        placeholder="Enter postal code"
                        value={projectSiteDetail.zip_code}
                        onChange={(e) => setProjectSiteDetail({ ...projectSiteDetail, zip_code: e.target.value })}
                        errorMessage={errorMessages.zip_code}
                        required={true}
                        isMasked={false}
                    />
                </div>

                <Input
                    divClasses="w-full"
                    label="Address"
                    type="text"
                    name="address"
                    placeholder="Enter address"
                    value={projectSiteDetail.address}
                    onChange={(e) => setProjectSiteDetail({ ...projectSiteDetail, address: e.target.value })}
                    errorMessage={errorMessages.address}
                    required={true}
                    isMasked={false}
                />
            </Modal>

            <Modal
                title="Add Project Type"
                show={projectTypeModal}
                setShow={setProjectTypeModal}
                footer={
                    <div className="flex justify-end gap-3">
                        <Button
                            type={ButtonType.button}
                            text="Cancel"
                            variant={ButtonVariant.danger}
                            onClick={() => setProjectTypeModal(false)}
                        />
                        <Button
                            type={ButtonType.button}
                            text="Add"
                            variant={ButtonVariant.primary}
                            onClick={() => {
                                dispatch(storeProjectType(projectTypeDetails));
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
                    value={projectTypeDetails.name}
                    onChange={(e) => setProjectTypeDetails({ ...projectTypeDetails, name: e.target.value })}
                    isMasked={false}
                />
                <Textarea
                    label="Description"
                    name="description"
                    value={projectTypeDetails.description}
                    onChange={(e) => setProjectTypeDetails({ ...projectTypeDetails, description: e.target.value })}
                    placeholder={'Enter description'}
                    isReactQuill={false}
                />
            </Modal>
        </form>
    );
};

export default ProjectForm;
