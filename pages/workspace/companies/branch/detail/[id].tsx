import React, { Fragment, useEffect, useRef, useState } from 'react';
import WorkspaceLayout from '@/components/Layouts/WorkspaceLayout';
import { Tab } from '@headlessui/react';
import { useAppDispatch, useAppSelector } from '@/store';
import { checkPermission } from '@/utils/helper';
import { ActionList, AppBasePath } from '@/utils/enums';
import AgGridComponent from '@/components/apps/AgGridComponent';
import { AgGridReact } from 'ag-grid-react';
import { clearLoginActivityState, getLoginActivities } from '@/store/slices/loginActivitySlice';
import { setAuthToken } from '@/configs/api.config';
import axios from 'axios';

const View = () => {
    const dispatch = useAppDispatch();
    const { token } = useAppSelector(state => state.user);
    const { loginActivities } = useAppSelector(state => state.loginActivity);
    const gridRef = useRef<AgGridReact<any>>(null);
    const [loginActivityList, setLoginActivityList] = useState<any[]>([]);

    const loginActivityColDef = [
        {
            headerName: 'Employee',
            valueGetter: (row: any) => row.data.user?.name + ' (' + row.data.user?.employee?.employee_code + ')',
            minWidth: 150
        },
        // {
        //     headerName: 'Department',
        //     field: 'user.employee.department.name',
        //     minWidth: 150
        // },
        // {
        //     headerName: 'Designation',
        //     field: 'user.employee.designation.name',
        //     minWidth: 150
        // },
        {
            headerName: 'Login At',
            valueGetter: (row: any) => new Date(row.data.login_at).toLocaleDateString() + ' ' + new Date(row.data.login_at).toLocaleTimeString(),
            minWidth: 150
        },
        {
            headerName: 'Login Address',
            valueGetter: (row: any) => row.data.login.city + ', ' + row.data.login.region + ', ' + row.data.login.country,
            minWidth: 150
        },
        {
            headerName: 'Logout At',
            valueGetter: (row: any) => row.data.logout_at && new Date(row.data.login_at).toLocaleDateString() + ' ' + new Date(row.data.login_at).toLocaleTimeString(),
            minWidth: 150
        },
        {
            headerName: 'Logout Address',
            // valueGetter: async (row: any) => console.log(await getLocationFromIp(row.data.logout_ip_address)),
            field: 'logout_ip_address',
            minWidth: 150
        },
        {
            headerName: 'Status',
            cellRenderer: (params: any) => {
                return params.data.logout_at ? 'Logged Out' : 'Logged In';
            },
            minWidth: 150
        }
    ];

    const getLocationFromIp = async (ip: string) => {
        try {
            const response = await axios.get(`https://ipapi.co/${ip}/json/`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching location data:', error);
            return null;
        }
    };

    useEffect(() => {
        setAuthToken(token);
        dispatch(getLoginActivities());
    }, []);

    useEffect(() => {
        const fetchLocationData = async () => {
            // if (loginActivities) {
            //     const updatedLoginActivities = await Promise.all(
            //         loginActivities.map(async (row:any) => {
            //             const loginLocation = await getLocationFromIp(row.login_ip_address);
            //             const logoutLocation = await getLocationFromIp(row.logout_ip_address);
            //             return {
            //                 ...row,
            //                 login: {
            //                     ip: row.login_ip_address,
            //                     city: loginLocation?.city || '',
            //                     region: loginLocation?.region || '',
            //                     country: loginLocation?.country || ''
            //                 },
            //                 logout: {
            //                     ip: row.logout_ip_address,
            //                     city: logoutLocation?.city || '',
            //                     region: logoutLocation?.region || '',
            //                     country: logoutLocation?.country || ''
            //                 }
            //             };
            //         })
            //     );
            //     setLoginActivityList(updatedLoginActivities);
            // }
        };
        fetchLocationData();
    }, [loginActivities]);

    return (
        <div className="flex flex-col gap-3">
            <div className="panel">

            </div>
            <div className="panel p-0">
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
                                    Configuration
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
                            {({ selected }) => {
                                // if(selected) {
                                //     dispatch(getLoginActivities())
                                // } else {
                                //     dispatch(clearLoginActivityState())
                                // }
                                return (
                                    <button
                                        className={`${
                                            selected ? '!border-white-light !border-b-white  text-primary !outline-none dark:!border-[#191e3a] dark:!border-b-black ' : ''
                                        } -mb-[1px] block border border-transparent p-3.5 py-2 hover:text-primary dark:hover:border-b-black`}
                                    >
                                        Login Activities
                                    </button>
                                );
                            }}
                        </Tab>
                    </Tab.List>
                    <Tab.Panels className="panel rounded-none">
                        <Tab.Panel>
                            <div className="active">
                            </div>
                        </Tab.Panel>
                        <Tab.Panel>
                            <div>
                            </div>
                        </Tab.Panel>
                        <Tab.Panel>
                            <div>
                            </div>
                        </Tab.Panel>
                        <Tab.Panel>
                            <div>
                                <AgGridComponent
                                    gridRef={gridRef}
                                    data={loginActivityList}
                                    colDefs={loginActivityColDef}
                                    rowSelection={'multiple'}
                                    rowMultiSelectWithClick={false}
                                    onRowClicked={(params) => {
                                        // checkPermission(permittedMenus, activeMenu.route, ActionList.VIEW_DETAIL, AppBasePath.Local_Purchase_Order) &&
                                        // router.push(`/apps/purchase/lpo/view/${params.data.id}`);
                                    }}
                                />
                            </div>
                        </Tab.Panel>
                    </Tab.Panels>
                </Tab.Group>
            </div>
        </div>
    );
};

View.getLayout = (page: any) => <WorkspaceLayout>{page}</WorkspaceLayout>;
export default View;
