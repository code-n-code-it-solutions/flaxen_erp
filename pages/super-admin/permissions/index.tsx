import React, { useCallback, useEffect, useRef, useState } from 'react';
import AppLayout from '@/components/Layouts/AppLayout';
import { AgGridReact } from 'ag-grid-react';
import { setPageTitle } from '@/store/slices/themeConfigSlice';
import { setAuthToken, setContentType } from '@/configs/api.config';
import { clearEmployeeState, getEmployees } from '@/store/slices/employeeSlice';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '@/store';
import PageHeader from '@/components/apps/PageHeader';
import AgGridComponent from '@/components/apps/AgGridComponent';
import { Dropdown } from '@/components/form/Dropdown';
import Button from '@/components/Button';
import { AppBasePath, ButtonType, ButtonVariant } from '@/utils/enums';
import {
    clearPermissionState,
    clearUpdatePermissionState,
    getPermissions,
    getRoles,
    updateUserPermission
} from '@/store/slices/permissionSlice';
import { FirstDataRenderedEvent, IRowNode } from '@ag-grid-community/core';

const Index = () => {
    const gridRef = useRef<AgGridReact<any>>(null);
    const dispatch = useAppDispatch();
    const { token, user } = useAppSelector((state) => state.user);
    const { employees } = useAppSelector((state) => state.employee);
    const { permissions, roles, permissionUpdated, loading } = useAppSelector((state) => state.permission);

    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const [companyOptions, setCompanyOptions] = useState<any[]>([
        { label: 'All', value: 'all' }
    ]);
    const [branchOptions, setBranchOptions] = useState<any[]>([
        { label: 'All', value: 'all' }
    ]);
    const [roleOptions, setRoleOptions] = useState<any[]>([
        { label: 'All', value: 'all' }
    ]);
    const [employeeOptions, setEmployeeOptions] = useState<any[]>([
        { label: 'All', value: 'all' }
    ]);
    const [formData, setFormData] = useState<any>({});
    const [rowData, setRowData] = useState<any[]>([]);
    const [colDefs, setColDefs] = useState<any>([
        {
            headerName: 'Plugin Category',
            field: 'plugin_category',
            minWidth: 150
        },
        {
            headerName: 'Plugin',
            field: 'plugin',
            minWidth: 150
        },
        {
            headerName: 'Menu',
            field: 'menu',
            minWidth: 150
        },
        {
            headerName: 'Action',
            field: 'action',
            minWidth: 150
        },
        {
            headerName: 'Allow',
            headerCheckboxSelection: true,
            checkboxSelection: true,
            filter: false,
            sortable: false,
            minWidth: 150
        }
    ]);

    const [updateLoading, setUpdateLoading] = useState(false);

    const handleFormChange = (name: string, value: any, required: boolean) => {
        switch (name) {
            case 'permission_type':
                setFormData({ ...formData, permission_type: value ? value.value : '' });
                break;
            case 'employee_id':
                setFormData({ ...formData, employee_id: value ? value.value : '' });
                break;
            case 'role_id':
                setFormData({ ...formData, role_id: value ? value.value : '' });
                break;
            default:
                setFormData({ ...formData, [name]: value });
                break;
        }
    };

    const onFirstDataRendered = useCallback((params: FirstDataRenderedEvent<any>) => {
        const nodesToSelect: IRowNode[] = [];
        params.api.forEachNode((node: IRowNode) => {
            if (node.data && node.data.has_permission) {
                nodesToSelect.push(node);
            }
        });
        params.api.setNodesSelected({ nodes: nodesToSelect, newValue: true });
    }, []);

    const fetchPermissions = () => {
        dispatch(clearPermissionState());
        setRowData([]);
        dispatch(getPermissions(formData));
    };

    const handleUpdatePermission = async () => {
        setUpdateLoading(true);
        await dispatch(updateUserPermission({
            employee_id: formData.employee_id,
            permissions: selectedRows
        }));
        setUpdateLoading(false);
    };

    useEffect(() => {
        dispatch(setPageTitle('Permission List'));
        setAuthToken(token);
        setContentType('application/json');
        dispatch(clearEmployeeState());
        dispatch(clearPermissionState());
        // dispatch(getEmployees());
        setEmployeeOptions([]);
        setFormData({});
        // dispatch(getRoles());
        dispatch(clearUpdatePermissionState());
        setRowData([]);
    }, [dispatch, token]);

    useEffect(() => {
        if (employees) {
            // setEmployeeOptions(
            //     employees.map((userDetail: any) => ({
            //         value: userDetail.employee.id,
            //         label: `${userDetail.name} (${userDetail.employee?.employee_code})`
            //     })).filter((userDetail: any) => userDetail.value !== user?.employee?.id)
            // );
        }
    }, [employees]);

    useEffect(() => {
        if (roles) {
            setRoleOptions(roles
                .filter((role: any) => role.name !== 'Admin' && role.name !== 'Super Admin')
                .map((role: any) => ({
                    value: role.id,
                    label: role.name
                })));
        }
    }, [roles]);

    useEffect(() => {
        if (permissions) {
            setRowData(permissions);
        } else {
            setRowData([]);
        }
    }, [permissions]);

    useEffect(() => {
        if (permissionUpdated) {
            fetchPermissions();
            dispatch(clearUpdatePermissionState());
        }
    }, [permissionUpdated, dispatch]);

    return (
        <div className="flex flex-col gap-5">
            <div className="panel flex flex-col md:flex-row md:justify-between md:items-center items-end gap-3 w-full">
                <div className="flex flex-col md:flex-row md:justify-start md:items-end gap-3 w-full">
                    <Dropdown
                        label="Company"
                        name="company_id"
                        options={companyOptions}
                        value={formData.company_id}
                        onChange={(e) => handleFormChange('company_id', e, true)}
                        required={true}
                    />
                    <Dropdown
                        label="Branch"
                        name="branch_id"
                        options={branchOptions}
                        value={formData.branch_id}
                        onChange={(e) => handleFormChange('branch_id', e, true)}
                        required={true}
                    />
                    <Dropdown
                        label="Roles"
                        name="role_id"
                        options={roleOptions}
                        value={formData.role_id}
                        onChange={(e) => handleFormChange('role_id', e, true)}
                        required={true}
                    />
                    <Dropdown
                        label="Employee"
                        name="employee_id"
                        options={employeeOptions}
                        value={formData.employee_id}
                        onChange={(e) => handleFormChange('employee_id', e, true)}
                        required={true}
                    />
                    <Button
                        type={ButtonType.button}
                        text={loading ? 'Loading...' : 'Fetch Permissions'}
                        variant={ButtonVariant.primary}
                        onClick={fetchPermissions}
                        disabled={loading}
                    />
                </div>
                <div className="flex gap-3 md:justify-end items-center">
                    <Button
                        classes="w-full"
                        type={ButtonType.button}
                        text={updateLoading ? 'Updating...' : 'Update Permission'}
                        variant={ButtonVariant.success}
                        onClick={handleUpdatePermission}
                        disabled={selectedRows.length === 0 || updateLoading}
                    />
                </div>
            </div>
            <div>
                <AgGridComponent
                    gridRef={gridRef}
                    data={rowData}
                    colDefs={colDefs}
                    rowSelection="multiple"
                    onSelectionChangedRows={(rows) => setSelectedRows(rows)}
                    rowMultiSelectWithClick={false}
                    onFirstDataRendered={onFirstDataRendered}
                />
            </div>
        </div>
    );
};

Index.getLayout = (page: any) => <AppLayout>{page}</AppLayout>;
export default Index;
