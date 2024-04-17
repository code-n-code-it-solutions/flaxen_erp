import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {setPageTitle} from '@/store/slices/themeConfigSlice';
import Breadcrumb from "@/components/Breadcrumb";
import {ThunkDispatch} from "redux-thunk";
import {IRootState} from "@/store";
import {AnyAction} from "redux";
import {getEmployees} from "@/store/slices/employeeSlice";
import Select from "react-select";
import {clearPermissionState, getPermissions} from "@/store/slices/permissionSlice";

const Index = () => {
    const dispatch = useDispatch<ThunkDispatch<IRootState, any, AnyAction>>();
    const {token} = useSelector((state: IRootState) => state.user);
    const {employees} = useSelector((state: IRootState) => state.employee);
    const permission = useSelector((state: IRootState) => state.permission);
    const [employeeOptions, setEmployeeOptions] = useState<any[]>([])
    const [selectedEmployee, setSelectedEmployee] = useState<any | null>(null);
    const [userId, setUserId] = useState<number>(0)
    const [showPermissionList, setShowPermissionList] = useState<boolean>(false)
    const [formData, setFormData] = useState({})

    useEffect(() => {
        dispatch(setPageTitle('All Permissions'));
        dispatch(getEmployees());
        setShowPermissionList(false)
        dispatch(clearPermissionState())
    }, []);

    useEffect(() => {
        if (employees) {
            const options = employees.map((employee: any) => ({
                value: employee.user.id,
                label: employee.user.name + ' - ' + employee.employee_code,
            }));
            setEmployeeOptions(options);
        }
    }, [employees]);

    const getUserPermissions = () => {
        dispatch(getPermissions(userId));
    }

    const clearForm = () => {
        setUserId(0)
        dispatch(clearPermissionState())
        setShowPermissionList(false)
        setSelectedEmployee(null);
    }

    useEffect(() => {
        if (permission.permissions) {
            setShowPermissionList(true)
        }
    }, [permission.permissions]);

    return (
        <div>
            <Breadcrumb items={[
                {
                    title: 'Main Dashboard',
                    href: '/main',
                },
                {
                    title: 'HR Dashboard',
                    href: '/hr',
                },
                {
                    title: 'Permissions',
                    href: '#',
                },
            ]}/>

            <div className="pt-5">
                <div className="panel">
                    <div className="mb-5 flex items-center justify-between">
                        <h5 className="text-lg font-semibold dark:text-white-light">Permission Allocations</h5>
                    </div>
                    <div className="flex flex-col md:flex-row justify-center items-center gap-5">
                        <div className="w-full md:w-1/3">
                            <label>Select Employee</label>
                            <Select
                                value={selectedEmployee}
                                defaultValue={employeeOptions[0]}
                                options={employeeOptions}
                                isSearchable={true}
                                isClearable={true}
                                placeholder={'Select Employee'}
                                onChange={(e: any) => {
                                    setUserId(prev => (e && typeof e !== 'undefined' ? e.value : 0))
                                    setSelectedEmployee(e)
                                }}
                            />
                        </div>
                        <div className="flex gap-3 justify-between items-center">
                            <button
                                type="button"
                                className="btn btn-primary mt-5"
                                onClick={() => getUserPermissions()}
                                disabled={permission.loading}
                            >
                                {permission.loading ? 'Loading...' : 'Get Permissions'}
                            </button>
                            <button
                                type="button"
                                className="btn btn-secondary mt-5"
                                onClick={() => clearForm()}
                            >
                                Clear
                            </button>
                        </div>
                    </div>
                    <div hidden={!showPermissionList}>

                    </div>
                </div>
            </div>

        </div>
    );
};

export default Index;
