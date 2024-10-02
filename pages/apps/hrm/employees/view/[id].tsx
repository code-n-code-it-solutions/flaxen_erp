import React, { Fragment, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { useRouter } from 'next/router';
import { setPageTitle } from '@/store/slices/themeConfigSlice';
import { clearEmployeeState, showDetails } from '@/store/slices/employeeSlice';
import PageWrapper from '@/components/PageWrapper';
import { getIcon, isValidIPAddress, serverFilePath } from '@/utils/helper';
import Image from 'next/image';
import { AppBasePath, ButtonSize, ButtonType, ButtonVariant, IconType } from '@/utils/enums';
import FileDownloader from '@/components/FileDownloader';
import DetailPageHeader from '@/components/apps/DetailPageHeader';
import { Tab } from '@headlessui/react';
import Button from '@/components/Button';
import Modal from '@/components/Modal';
import { Input } from '@/components/form/Input';
import Select, { MultiValue } from 'react-select';
import Option from '@/components/form/Option';
import Swal from 'sweetalert2';
import {
    clearUserLoginRuleState,
    deleteUserLoginRule,
    getUserLoginRules,
    storeUserLoginRule
} from '@/store/slices/userLoginRuleSlice';
import DocumentFormModal from '@/components/modals/DocumentFormModal';
import BankDetailModal from '@/components/modals/BankDetailModal';

const View = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { user } = useAppSelector(state => state.user);
    const { loading, employeeDetail } = useAppSelector(state => state.employee);
    const { userLoginRules, userLoginRule, loading: ruleLoading } = useAppSelector(state => state.userRuleLogin);

    const [newRuleModal, setNewRuleModal] = useState<boolean>(false);
    const [newBankAccountModel, setNewBankAccountModel] = useState<boolean>(false);
    const [newDocumentModal, setNewDocumentModal] = useState<boolean>(false);
    const [employeeLoginRules, setEmployeeLoginRules] = useState<any[]>([]);
    const [ruleData, setRuleData] = useState<any>({});
    const [weekdays, setWeekdays] = useState<any[]>([
        { label: 'Monday', value: 'Monday' },
        { label: 'Tuesday', value: 'Tuesday' },
        { label: 'Wednesday', value: 'Wednesday' },
        { label: 'Thursday', value: 'Thursday' },
        { label: 'Friday', value: 'Friday' },
        { label: 'Saturday', value: 'Saturday' },
        { label: 'Sunday', value: 'Sunday' }
    ]);
    const [selectedWeekdays, setSelectedWeekdays] = useState<MultiValue<any>>([]);

    const bankColDefs = [
        {
            headerName: 'Bank Name',
            field: 'vendor.name',
            minWidth: 150
        }
    ];

    useEffect(() => {
        dispatch(setPageTitle('Employee Details'));
        dispatch(clearEmployeeState());
        const employeeId = router.query.id;
        if (employeeId) {
            const id = Array.isArray(employeeId) ? employeeId[0] : employeeId;
            dispatch(showDetails(parseInt(id)));
        }
    }, [router.query.id, dispatch]);

    useEffect(() => {
        if (userLoginRule) {
            dispatch(clearUserLoginRuleState());
            setNewRuleModal(false);
            setRuleData({});
        }
    }, [userLoginRule]);

    useEffect(() => {
        if (employeeDetail) {
            dispatch(getUserLoginRules(employeeDetail.id));
        }
    }, [employeeDetail]);

    useEffect(() => {
        if (userLoginRules) {
            setEmployeeLoginRules(userLoginRules);
        }
    }, [userLoginRules]);

    return (
        <div className="flex flex-col gap-3">
            <DetailPageHeader
                appBasePath={AppBasePath.Employee}
                title="Employee Details"
                middleComponent={{
                    show: false
                }}
                backButton={{
                    show: true,
                    backLink: '/apps/employees/employee-list'
                }}
            />

            <PageWrapper
                loading={loading}
                embedLoader={true}
            >
                {employeeDetail && (
                    <div>
                        <div className="flex items-start flex-col-reverse gap-3 md:flex-row justify-between mb-5">
                            <div className="flex flex-col gap-5">
                                <span className="flex justify-start items-center gap-2">
                                    <strong>Employee Code: </strong>
                                    <span>{employeeDetail.employee?.employee_code}</span>
                                </span>
                                <span className="flex justify-start items-center gap-2">
                                    <strong>Registered at: </strong>
                                    <span>{new Date(employeeDetail.created_at).toLocaleDateString()}</span>
                                </span>
                                <span className="flex justify-start items-center gap-2">
                                    <strong>Print at: </strong>
                                    <span>{(new Date()).toLocaleDateString()}</span>
                                </span>
                            </div>
                            <Image
                                width={24}
                                height={24}
                                priority={true}
                                src={serverFilePath(employeeDetail?.employee?.thumbnail?.path)}
                                alt="profile"
                                className="w-24 h-24"
                            />
                        </div>

                        <Tab.Group>
                            <Tab.List className="flex flex-wrap border-b border-white-light dark:border-[#191e3a]">
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
                                            Bank Details
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
                                            Documents
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
                                            Leaves
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
                                            Payrolls
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
                                            Attendance
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
                                            Login Rules
                                        </button>
                                    )}
                                </Tab>
                            </Tab.List>
                            <Tab.Panels className="rounded-none">
                                <Tab.Panel>
                                    <div className="active table-responsive">
                                        <table>
                                            <tbody>
                                            <tr>
                                                <td>Name</td>
                                                <td>{employeeDetail?.name}</td>
                                                <td>Email</td>
                                                <td>{employeeDetail?.email}</td>
                                            </tr>
                                            <tr>
                                                <td>Phone</td>
                                                <td>{employeeDetail.employee?.phone}</td>
                                                <td>Joining Date</td>
                                                <td>{employeeDetail.employee?.date_of_joining}</td>
                                            </tr>
                                            <tr>
                                                <td>Department</td>
                                                <td>{employeeDetail?.employee?.department?.name}</td>
                                                <td>Designation</td>
                                                <td>{employeeDetail?.employee?.designation?.name}</td>
                                            </tr>
                                            <tr>
                                                <td>Passport Number</td>
                                                <td>{employeeDetail.employee?.passport_number}</td>
                                                <td>Id Number</td>
                                                <td>{employeeDetail.employee?.id_number}</td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </Tab.Panel>
                                <Tab.Panel>
                                    <div>
                                        <div className="flex md:justify-between md:items-center mb-3">
                                            <h3 className="text-lg font-bold">Bank Account Details</h3>
                                            <Button
                                                type={ButtonType.button}
                                                text="Add Bank Account"
                                                variant={ButtonVariant.primary}
                                                size={ButtonSize.small}
                                                onClick={() => {
                                                    setNewBankAccountModel(true);
                                                }}
                                            />
                                        </div>
                                        <div className="table-responsive">
                                            <table>
                                                <thead>
                                                <tr>
                                                    <th>Bank Name</th>
                                                    <th>s</th>
                                                    <th>Account Number</th>
                                                    <th>IBAN</th>
                                                    <th>Currency</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {employeeDetail?.employee?.bank_accounts?.length > 0
                                                    ? employeeDetail?.employee?.bank_accounts?.map((bank: any, index: number) => (
                                                        <tr key={index}>
                                                            <td>{bank.bank.name}</td>
                                                            <td>{bank.account_name}</td>
                                                            <td>{bank.account_number}</td>
                                                            <td>{bank.iban}</td>
                                                            <td>{bank.currency?.code}</td>
                                                        </tr>
                                                    )) : (
                                                        <tr>
                                                            <td colSpan={5}>
                                                                No Bank Details Found
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </Tab.Panel>
                                <Tab.Panel>
                                    <div>
                                        <div className="flex md:justify-between md:items-center mb-3">
                                            <h3 className="text-lg font-bold">Uploaded Documents</h3>
                                            <Button
                                                type={ButtonType.button}
                                                text="Add New Document"
                                                variant={ButtonVariant.primary}
                                                size={ButtonSize.small}
                                                onClick={() => {
                                                    setNewDocumentModal(true);
                                                }}
                                            />
                                        </div>
                                        <div className="table-responsive">
                                            <table>
                                                <thead>
                                                <tr>
                                                    <th>Document</th>
                                                    <th>Document Name</th>
                                                    <th>Description</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {employeeDetail?.employee?.documents?.length > 0
                                                    ? employeeDetail?.employee?.documents?.map((document: any, index: number) => (
                                                        <tr key={index}>
                                                            <td>
                                                                {document.document
                                                                    ? (<span
                                                                            className="flex gap-2 items-center text-primary">
                                                                            <FileDownloader
                                                                                file={document.document.path}
                                                                                title={
                                                                                    <span
                                                                                        className="flex justify-center items-center gap-3">
                                                                                        {getIcon(IconType.download)}
                                                                                        <span>Download</span>
                                                                                    </span>
                                                                                }
                                                                                buttonType={ButtonType.link}
                                                                                buttonVariant={ButtonVariant.primary}
                                                                                size={ButtonSize.small}
                                                                            />
                                                                        </span>
                                                                    ) : <span>No Preview</span>
                                                                }
                                                            </td>
                                                            <td>{document.name}</td>
                                                            <td>{document.description}</td>
                                                        </tr>
                                                    )) : (
                                                        <tr>
                                                            <td colSpan={2}>
                                                                No Documents Found
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </Tab.Panel>
                                <Tab.Panel>
                                    <div></div>
                                </Tab.Panel>
                                <Tab.Panel>
                                    <div></div>
                                </Tab.Panel>
                                <Tab.Panel>
                                    <div></div>
                                </Tab.Panel>
                                <Tab.Panel>
                                    <div>
                                        <div className="flex md:justify-between md:items-center mb-3">
                                            <h3 className="text-lg font-bold">Login Rules</h3>
                                            <Button
                                                type={ButtonType.button}
                                                text="Add Rule"
                                                variant={ButtonVariant.primary}
                                                size={ButtonSize.small}
                                                onClick={() => {
                                                    setNewRuleModal(true);
                                                    setRuleData({ ip_address: '*' });
                                                    setSelectedWeekdays([]);
                                                }}
                                            />
                                        </div>
                                        <div className="table-responsive">
                                            <table>
                                                <thead>
                                                <tr>
                                                    <th>Rule Name</th>
                                                    <th>IP Address</th>
                                                    <th>Weekdays</th>
                                                    <th>Start Time</th>
                                                    <th>End Time</th>
                                                    <th>Status</th>
                                                    <th>Action</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {employeeLoginRules.length > 0
                                                    ? (
                                                        employeeLoginRules.map((rule: any, index: number) => (
                                                            <tr key={index}>
                                                                <td>{rule.rule_name}</td>
                                                                <td>{rule.ip_address === '*' ? rule.ip_address + ' Everywhere' : rule.ip_address}</td>
                                                                <td>{rule.week_days ?? 'All Days'}</td>
                                                                <td>{rule.start_time ?? 'All Times'}</td>
                                                                <td>{rule.end_time ?? 'All Times'}</td>
                                                                <td>{rule.is_active === 1 ? 'Active' : 'No Active'}</td>
                                                                <td>
                                                                    <div className="flex gap-2">
                                                                        <button
                                                                            className="btn btn-primary btn-xs"
                                                                            onClick={() => {
                                                                                setNewRuleModal(true);
                                                                                setRuleData(rule);
                                                                                setSelectedWeekdays(rule.week_days ? rule.week_days.split(',').map((day: any) => {
                                                                                    return { label: day, value: day };
                                                                                }) : []);
                                                                            }}
                                                                        >
                                                                            Edit
                                                                        </button>
                                                                        <button
                                                                            className="btn btn-danger btn-xs"
                                                                            onClick={() => {
                                                                                Swal.fire({
                                                                                    title: 'Are you sure?',
                                                                                    text: 'You won\'t be able to revert this!',
                                                                                    icon: 'warning',
                                                                                    showCancelButton: true,
                                                                                    confirmButtonText: 'Yes, delete it!',
                                                                                    cancelButtonText: 'No, cancel!',
                                                                                    cancelButtonColor: 'red',
                                                                                    confirmButtonColor: 'green'
                                                                                }).then((result) => {
                                                                                    if (result.isConfirmed) {
                                                                                        // console.log(unusedItems.map((row: any) => row.id));
                                                                                        dispatch(deleteUserLoginRule(rule.id));
                                                                                        setNewRuleModal(false);
                                                                                        setRuleData({});
                                                                                        dispatch(getUserLoginRules(employeeDetail.id));
                                                                                    }
                                                                                });
                                                                            }}
                                                                        >
                                                                            Delete
                                                                        </button>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))) : (
                                                        <tr>
                                                            <td colSpan={7}>
                                                                No Login Rules Found
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </Tab.Panel>
                            </Tab.Panels>
                        </Tab.Group>
                    </div>
                )}
            </PageWrapper>

            <BankDetailModal
                title={'Bank Account Details'}
                modalOpen={newBankAccountModel}
                setModalOpen={setNewBankAccountModel}
                handleSubmit={(value) => {

                }}
            />

            <DocumentFormModal
                modalOpen={newDocumentModal}
                setModalOpen={setNewDocumentModal}
                handleSubmit={(value) => {

                }}
            />

            <Modal
                title={ruleData.id ? 'Edit Rule' : 'Add Rule'}
                show={newRuleModal}
                setShow={setNewRuleModal}
                footer={
                    <div className="flex justify-end gap-3">
                        <Button
                            type={ButtonType.button}
                            text="Cancel"
                            onClick={() => {
                                setNewRuleModal(false);
                                setRuleData({});
                                setSelectedWeekdays([]);
                            }}
                            variant={ButtonVariant.secondary}
                        />
                        <Button
                            type={ButtonType.button}
                            text={ruleData.id ? 'Update Rule' : 'Save Rule'}
                            variant={ButtonVariant.primary}
                            onClick={() => {
                                const ruleForSubmit = {
                                    ...ruleData,
                                    user_id: employeeDetail.id
                                };
                                if (ruleForSubmit.rule_name && ruleForSubmit.ip_address) {
                                    if (isValidIPAddress(ruleForSubmit.ip_address)) {
                                        dispatch(storeUserLoginRule(ruleForSubmit));
                                        dispatch(getUserLoginRules(employeeDetail.id));
                                    } else {
                                        Swal.fire({
                                            icon: 'error',
                                            title: 'Invalid IP Address',
                                            text: 'Please enter a valid IP address or an asterisk (*)'
                                        });
                                    }
                                } else {
                                    Swal.fire({
                                        icon: 'error',
                                        title: 'Oops...',
                                        text: 'Rule Name and IP Address are required fields'
                                    });
                                }
                            }}
                        />
                    </div>
                }
            >
                <Input
                    type="text"
                    name="rule_name"
                    value={ruleData.rule_name}
                    onChange={(e) => setRuleData({ ...ruleData, rule_name: e.target.value })}
                    placeholder={'Rule Name'}
                    label={'Rule Name'}
                    isMasked={false}
                />

                <Input
                    type="text"
                    name="ip_address"
                    value={ruleData.ip_address}
                    onChange={(e) => setRuleData({ ...ruleData, ip_address: e.target.value })}
                    placeholder={'IP Address (* means everywhere)'}
                    label={'IP Address'}
                    isMasked={false}
                />

                <div>
                    <label>Weekdays</label>
                    <Select
                        value={selectedWeekdays}
                        options={weekdays}
                        isSearchable={true}
                        isClearable={true}
                        placeholder={'Select ' + 'Weekdays'}
                        onChange={(e) => {
                            if (e && typeof e !== 'undefined' && e.length > 0) {
                                setSelectedWeekdays(e);
                                setRuleData({ ...ruleData, week_days: e.map((day: any) => day.value).join(',') });
                            } else {
                                setSelectedWeekdays([]);
                                setRuleData({ ...ruleData, week_days: '' });
                            }
                        }}
                        isMulti={true}
                    />
                    <span className="text-sm text-info mt-1">Leave it blank means everyday</span>
                </div>
                <Input
                    type="time"
                    name="start_time"
                    value={ruleData.start_time}
                    onChange={(e) => setRuleData({ ...ruleData, start_time: e[0] ? e[0].toLocaleTimeString() : '' })}
                    placeholder={'Start time for the selected days'}
                    label={'Start Time'}
                    isMasked={false}
                    helperText={'Start Time. Leave it blank means all day'}
                />
                <Input
                    type="time"
                    name="end_time"
                    value={ruleData.end_time}
                    onChange={(e) => setRuleData({ ...ruleData, end_time: e[0] ? e[0].toLocaleTimeString() : '' })}
                    placeholder={'End time for the selected days'}
                    label={'End Time'}
                    isMasked={false}
                    helperText={'End Time. Leave it blank means all day'}
                />
                <Option
                    label="Is Active"
                    type="checkbox"
                    name="is_active"
                    value="1"
                    defaultChecked={ruleData.is_active === 1}
                    onChange={(e) => setRuleData({ ...ruleData, is_active: e.target.checked ? 1 : 0 })}
                />
            </Modal>
        </div>
    );
};

// View.getLayout = (page: any) => <AppLayout>{page}</AppLayout>;
export default View;

