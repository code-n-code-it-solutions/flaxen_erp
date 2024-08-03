import React, { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { setPageTitle } from '@/store/slices/themeConfigSlice';
import PageWrapper from '@/components/PageWrapper';
import WorkspaceLayout from '@/components/Layouts/WorkspaceLayout';
import { Tab } from '@headlessui/react';
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry } from '@ag-grid-community/core';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { useRouter } from 'next/router';
import { setSelectedBranch, setSelectedCompany, showDetail } from '@/store/slices/companySlice';
import Modal from '@/components/Modal';
import Image from 'next/image';
import { serverFilePath } from '@/utils/helper';
import Button from '@/components/Button';
import { ButtonSize, ButtonType, ButtonVariant } from '@/utils/enums';
import { Input } from '@/components/form/Input';
import Link from 'next/link';
import { uniqBy } from 'lodash';
import { EyeIcon } from 'lucide-react';
import { setAuthToken } from '@/configs/api.config';
import ContentLoader from '@/components/ContentLoader';

ModuleRegistry.registerModules([ClientSideRowModelModule]);

const Detail = () => {
    const router = useRouter();
    const gridRef = useRef<AgGridReact<any>>(null);
    const dispatch = useAppDispatch();
    const { token } = useAppSelector(state => state.user);
    const { companyDetail, loading } = useAppSelector(state => state.company);
    const themeConfig = useAppSelector((state) => state.themeConfig);

    const breadcrumbItems = [
        {
            title: 'Dashboard',
            href: '/workspace'
        },
        {
            title: 'Companies',
            href: '/workspace/companies'
        },
        {
            title: 'Company Details',
            href: '#'
        }
    ];
    const [branchFormData, setBranchFormData] = useState<any>({});

    const gridStyle = useMemo(() => ({ height: 400, width: '100%' }), []);
    const defaultColDef = useMemo<any>(() => {
        return {
            initialWidth: 100,
            suppressSizeToFit: true,
            flex: 1,
            resizable: false
        };
    }, []);
    const [pluginTypes, setPluginTypes] = useState<any[]>([]);
    const [plugins, setPlugins] = useState<any[]>([]);
    const [branches, setBranches] = useState<any[]>([]);
    const [branchDetailModal, setBranchDetailModal] = useState<boolean>(false);
    const [branchEdit, setBranchEdit] = useState<boolean>(false);
    const [selectedBranchDetail, setSelectedBranchDetail] = useState<any>({});

    // Column Definitions: Defines the columns to be displayed.
    const [colDefs, setColDefs] = useState<any>([
        {
            headerName: 'Name',
            field: 'name',
            valueGetter: (row: any) => (
                row.data.name
            )
        },
        {
            headerName: 'Branch Type',
            field: 'branchType',
            valueGetter: (row: any) => (
                row.data.branch_type?.name
            )
        },
        {
            headerName: 'Email',
            field: 'email'
        },
        {
            headerName: 'Phone',
            field: 'phone'
        },
        {
            headerName: 'Actions',
            field: 'actions',
            cellRenderer: (param: any) => {
                return (
                    <div className="flex gap-1">
                        <Button
                            tooltip="ERP"
                            type={ButtonType.button}
                            text="Go ERP"
                            variant={ButtonVariant.primary}
                            size={ButtonSize.small}
                            onClick={() => {
                                dispatch(setSelectedCompany({
                                    id: companyDetail?.id,
                                    name: companyDetail?.name
                                }));
                                dispatch(setSelectedBranch(param.data));
                                router.push('/apps');
                            }}
                        />
                        <Button
                            tooltip="Details"
                            type={ButtonType.link}
                            text={<EyeIcon size={18} />}
                            variant={ButtonVariant.info}
                            size={ButtonSize.small}
                            link={'/workspace/companies/branch/detail/' + param.data.id}
                        />
                    </div>
                );
            }
        }
    ]);

    const onGridReady = useCallback((params: any) => {
        setBranches(companyDetail?.branches || []);
    }, [companyDetail]);

    const handleBranchEdit = (name: string, value: any, required: boolean) => {
        setBranchFormData({
            ...branchFormData,
            [name]: value
        });
    };

    useEffect(() => {
        setAuthToken(token);
        dispatch(setPageTitle('Company Details'));
        const { id } = router.query;
        if (typeof id === 'string' && id) {
            dispatch(showDetail(parseInt(id)));
        }
    }, [router.query]);

    useEffect(() => {
        if (companyDetail) {
            setBranches(companyDetail.branches);
            setPlugins(companyDetail.branches.map((branch: any) => branch.plugins).flat());
            const pluginTypes = companyDetail.branches.map((branch: any) => branch.plugins).flat().map((plugin: any) => plugin.plugin.plugin_type);
            setPluginTypes(uniqBy(pluginTypes, 'name'));
        }

    }, [companyDetail]);

    return (
        <PageWrapper
            title="Company Details"
            breadCrumbItems={breadcrumbItems}
            embedLoader={false}
            panel={false}
        >
            {loading
                ? <ContentLoader />
                : (
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
                                        Branches
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
                                        Plugins
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
                                        Subscription
                                    </button>
                                )}
                            </Tab>
                        </Tab.List>
                        <Tab.Panels className="panel rounded-none">
                            <Tab.Panel>
                                <div className="active pt-5">
                                    <div className="flex flex-col justify-center items-center gap-5">
                                        <img
                                            src={serverFilePath(companyDetail?.branches[0]?.logo)}
                                            alt="img"
                                            className="h-20 w-20 rounded-full object-cover ring-2 ring-[#ebedf2] dark:ring-white-dark"
                                        />
                                        <div className="flex flex-col justify-center items-center gap-3">
                                            <h1 className="text-lg font-bold">{companyDetail?.name}</h1>
                                            <p className="text-centder">{companyDetail?.company_type?.name + ' (' + companyDetail?.company_sub_type?.name + ')'}</p>
                                            <p className="text-centder">{companyDetail?.description}</p>
                                        </div>
                                    </div>
                                </div>
                            </Tab.Panel>
                            <Tab.Panel>
                                <div>
                                    <div
                                        style={gridStyle}
                                        className={
                                            themeConfig.isDarkMode ? 'ag-theme-quartz-dark' : 'ag-theme-quartz'
                                        }
                                    >
                                        <AgGridReact
                                            rowData={branches}
                                            columnDefs={colDefs}
                                            defaultColDef={defaultColDef}
                                            onGridReady={onGridReady}
                                            onRowDoubleClicked={(params) => {
                                                setSelectedBranchDetail({});
                                                setBranchDetailModal(true);
                                                setSelectedBranchDetail(params.data);
                                            }}
                                        />
                                    </div>
                                </div>
                            </Tab.Panel>
                            <Tab.Panel>
                                <div className="pt-5">
                                    {branches.length > 0
                                        ? branches.map((branch, index) => (
                                            <div className="flex flex-col justify-start" key={index}>
                                                <h1 className="font-bold text-xl border-b">{branch.name}</h1>

                                                {(pluginTypes.length > 0 && plugins.filter((plugin: any) => plugin.branch_id === branch.id).length > 0
                                                    ? pluginTypes.map((pluginType, index) => (
                                                        <div key={index} className="container mt-4 mb-2">
                                                            <h1 className="font-bold text-lg underline">{pluginType?.name}</h1>
                                                            <div
                                                                className="grid grid-cols-3 gap-4 md:grid-cols-6 justify-center items-stretch">

                                                                {plugins.length > 0 ? plugins.map((plugin, index) => (
                                                                    pluginType?.id === plugin.plugin.plugin_type_id && plugin.branch_id === branch.id && (
                                                                        <Link href={''} key={index}>
                                                                            <div
                                                                                className="flex flex-col justify-between gap-2 dark:bg-slate-700 bg-white bg-opacity-70 pt-4 rounded-lg border dark:border-slate-400 shadow hover:shadow-md dark:hover:shadow-white h-full min-h-full">
                                                                                <div className="flex flex-col gap-3">
                                                                                    <div
                                                                                        className="flex justify-center items-center p-2">
                                                                                        <Image
                                                                                            src="/assets/images/default.jpeg"
                                                                                            alt="ERP"
                                                                                            width={70}
                                                                                            height={70} />
                                                                                    </div>
                                                                                    <div
                                                                                        className="text-center flex flex-col">
                                                                                        <span
                                                                                            className="font-bold text-center">
                                                                                            {plugin.plugin.name}
                                                                                        </span>
                                                                                        <span
                                                                                            className="text-center text-[12px] px-3">
                                                                                            {plugin.plugin.description}
                                                                                        </span>
                                                                                    </div>
                                                                                </div>
                                                                                <div
                                                                                    className="w-full py-2 border rounded-bl rounded-br text-center shadow bg-green-400">
                                                                                    <span
                                                                                        className="font-bold">Installed</span>
                                                                                </div>
                                                                            </div>
                                                                        </Link>
                                                                    )
                                                                )) : (
                                                                    <h1 className="text-center font-lg font-bold">
                                                                        No Plugin registered yet
                                                                    </h1>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )) : (
                                                        <h1 className="my-5 font-lg font-bold">
                                                            No Plugin registered yet
                                                        </h1>
                                                    ))}
                                            </div>
                                        )) : (
                                            <h1 className="my-5 font-lg font-bold">No Branch registered yet</h1>
                                        )}
                                </div>

                            </Tab.Panel>
                            <Tab.Panel>
                                <div className="pt-5 table-responsiveness">
                                    <table>
                                        <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Subscription</th>
                                            <th>Interval</th>
                                            <th>Start Date</th>
                                            <th>End Date</th>
                                            <th>Status</th>
                                            <th>Is Trial</th>
                                            <th>Subscription At</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {companyDetail?.subscriptions.length > 0
                                            ? (
                                                companyDetail?.subscriptions.map((subscription: any, index: number) => (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>{subscription.subscription_plan?.name}</td>
                                                        <td>{subscription.interval}</td>
                                                        <td>{subscription.start_date}</td>
                                                        <td>{subscription.end_date}</td>
                                                        <td>
                                                            {subscription.is_active
                                                                ? (
                                                                    <span
                                                                        className="badge bg-success text-white">Active</span>
                                                                ) : (
                                                                    <span
                                                                        className="badge bg-danger text-white">Inactive</span>
                                                                )}
                                                        </td>
                                                        <td>{subscription.is_trial ? 'Yes' : 'No'}</td>
                                                        <td>{new Date(subscription.created_at).toLocaleDateString() + ' ' + new Date(subscription.created_at).toLocaleTimeString()}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={8} className="text-center">No Subscription registered
                                                        yet
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </Tab.Panel>
                        </Tab.Panels>
                    </Tab.Group>
                )}

            <Modal
                show={branchDetailModal}
                setShow={setBranchDetailModal}
                title="Branch Detail"
            >

                <table>
                    <thead>
                    <tr>
                        <th>Params</th>
                        <th>Values</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>Logo</td>
                        <td>
                            <Image
                                src={serverFilePath(selectedBranchDetail.logo)}
                                height={50}
                                width={50}
                                className="rounded-lg"
                                alt={selectedBranchDetail.name}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>Name</td>
                        <td>
                            {branchEdit
                                ? (
                                    <Input
                                        divClasses={'w-full'}
                                        type="text"
                                        name="name"
                                        value={branchFormData.name}
                                        onChange={(e) => handleBranchEdit(e.target.name, e.target.value, e.target.required)}
                                        isMasked={false}
                                    />
                                ) : selectedBranchDetail.name
                            }
                        </td>
                    </tr>
                    <tr>
                        <td>Branch Type</td>
                        <td>
                            {
                                // branchEdit
                                // ? (
                                //     <Input
                                //         divClasses={'w-full'}
                                //         type="text"
                                //         name="name"
                                //         value={branchFormData.branch_type_id}
                                //         onChange={(e) => handleBranchEdit(e.target.name, e.target.value, e.target.required)}
                                //         isMasked={false}
                                //     />
                                // ) :
                                selectedBranchDetail.branch_type?.name
                            }
                        </td>
                    </tr>
                    <tr>
                        <td>Email</td>
                        <td>{selectedBranchDetail.email}</td>
                    </tr>
                    <tr>
                        <td>Phone</td>
                        <td>{selectedBranchDetail.phone}</td>
                    </tr>
                    <tr>
                        <td>Website</td>
                        <td>{selectedBranchDetail.website}</td>
                    </tr>
                    <tr>
                        <td>Currency</td>
                        <td>{selectedBranchDetail.currency}</td>
                    </tr>
                    <tr>
                        <td>Timezone</td>
                        <td>{selectedBranchDetail.timezone}</td>
                    </tr>
                    <tr>
                        <td>Date Format</td>
                        <td>{selectedBranchDetail.date_format}</td>
                    </tr>
                    <tr>
                        <td>Time Format</td>
                        <td>{selectedBranchDetail.time_format}</td>
                    </tr>
                    <tr>
                        <td>Week Start</td>
                        <td>{selectedBranchDetail.week_start}</td>
                    </tr>
                    <tr>
                        <td>Language</td>
                        <td>{selectedBranchDetail.language}</td>
                    </tr>
                    <tr>
                        <td>Invoice Prefix</td>
                        <td>{selectedBranchDetail.invoice_prefix}</td>
                    </tr>
                    <tr>
                        <td>
                            <Button
                                type={ButtonType.button}
                                text={branchEdit ? 'Save' : 'Edit'}
                                variant={ButtonVariant.primary}
                                size={ButtonSize.small}
                                onClick={() => {
                                    setBranchEdit(true);
                                    setBranchFormData(selectedBranchDetail);
                                }}
                            />
                        </td>

                        <td>
                            {branchEdit && (
                                <Button
                                    type={ButtonType.button}
                                    text="Discard"
                                    variant={ButtonVariant.info}
                                    size={ButtonSize.small}
                                    onClick={() => setBranchEdit(false)}
                                />
                            )}

                        </td>
                    </tr>
                    </tbody>
                </table>
            </Modal>
        </PageWrapper>
    );
};

Detail.getLayout = (page: any) => {
    return <WorkspaceLayout>{page}</WorkspaceLayout>;
};
export default Detail;
