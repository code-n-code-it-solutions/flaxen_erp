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
import Modal from '@/components/Modal';
import {
    clearMenuActionsState,
    clearMenusState, clearPermissionState,
    clearPluginState, clearUpdatePermissionState,
    getMenuActions,
    getMenus,
    getPermissions,
    getPluginCategories,
    getPlugins,
    getRoles, updateUserPermission
} from '@/store/slices/permissionSlice';
import { FirstDataRenderedEvent, IRowNode } from '@ag-grid-community/core';

const Index = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { token, user } = useAppSelector((state) => state.user);
    const { employees } = useAppSelector((state) => state.employee);
    const {
        permissions,
        pluginCategories,
        plugins,
        menus,
        menuActions,
        roles,
        permissionUpdated,
        loading
    } = useAppSelector((state) => state.permission);

    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const [employeeId, setEmployeeId] = useState<number>(0);
    const [employeeOptions, setEmployeeOptions] = useState<any[]>([]);
    const [roleOptions, setRoleOptions] = useState<any[]>([]);
    const [pluginCategoryOptions, setPluginCategoryOptions] = useState<any[]>([]);
    const [pluginOptions, setPluginOptions] = useState<any[]>([]);
    const [menuOptions, setMenuOptions] = useState<any[]>([]);
    const [actionOptions, setActionOptions] = useState<any[]>([]);
    const [permissionTypeOptions, setPermissionTypeOptions] = useState<any[]>([
        { label: 'To Employee', value: 'employee' }
        // { label: 'To Role', value: 'role' }
    ]);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [formData, setFormData] = useState<any>({}); // for form data
    const [rowData, setRowData] = useState<any[]>([]);

    const gridRef = useRef<AgGridReact<any>>(null);

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

    const handleFormChange = (name: string, value: any, required: boolean) => {
        switch (name) {
            case 'permission_type':
                if (value && typeof value !== 'undefined') {
                    setFormData({ ...formData, permission_type: value.value });
                } else {
                    setFormData({ ...formData, permission_type: '' });
                }
                break;
            case 'plugin_category_id':
                if (value && typeof value !== 'undefined') {
                    dispatch(getPlugins({ plugin_category_id: value.value }));
                    setFormData({ ...formData, plugin_category_id: value.value });
                } else {
                    dispatch(clearPluginState());
                    setFormData({ ...formData, plugin_category_id: '' });
                }
                break;
            case 'plugin_id':
                if (value && typeof value !== 'undefined') {
                    dispatch(getMenus({ plugin_id: value.value }));
                    setFormData({ ...formData, plugin_id: value.value });
                } else {
                    dispatch(clearMenusState());
                    setFormData({ ...formData, plugin_id: '' });
                }
                break;
            case 'menu_id':
                if (value && typeof value !== 'undefined') {
                    dispatch(getMenuActions({
                        plugin_category_id: formData.plugin_category_id,
                        plugin_id: formData.plugin_id,
                        menu_id: value.value
                    }));
                    setFormData({ ...formData, menu_id: value.value });
                } else {
                    dispatch(clearMenuActionsState());
                    setFormData({ ...formData, menu_id: '' });
                }
                break;
            case 'menu_action_id':
                if (value && typeof value !== 'undefined') {
                    setFormData({ ...formData, menu_action_id: value.value });
                } else {
                    setFormData({ ...formData, menu_action_id: '' });
                }
                break;
            case 'employee_id':
                if (value && typeof value !== 'undefined') {
                    setFormData({ ...formData, employee_id: value.value });
                } else {
                    setFormData({ ...formData, employee_id: '' });
                }
                break;
            case 'role_id':
                if (value && typeof value !== 'undefined') {
                    setFormData({ ...formData, role_id: value.value });
                } else {
                    setFormData({ ...formData, role_id: '' });
                }
                break;
            default:
                setFormData({ ...formData, [name]: value });
                break;
        }
    };

    const handleEmployeeChange = (e: any) => {
        if (e && typeof e !== 'undefined') {
            setEmployeeId(e.value);
            dispatch(getPermissions({ employee_id: e.value }));
        } else {
            setRowData([]);
            setEmployeeId(0);
        }
    };

    const onFirstDataRendered = useCallback(
        (params: FirstDataRenderedEvent<any>) => {
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

    const handleUpdatePermission = () => {
        dispatch(updateUserPermission({
            employee_id: formData.employee_id,
            permissions: selectedRows
        }));
        // console.log(selectedRows);
    };

    // useEffect(() => {
    //     console.log(selectedRows);
    // }, [selectedRows]);

    useEffect(() => {
        dispatch(setPageTitle('Permission List'));
        setAuthToken(token);
        setContentType('application/json');
        dispatch(clearEmployeeState());
        dispatch(clearPermissionState());
        dispatch(getEmployees());
        setEmployeeId(0);
        setEmployeeOptions([]);
        setFormData({});
        setModalOpen(false);
        dispatch(getPluginCategories());
        dispatch(getRoles());
        dispatch(clearUpdatePermissionState());
        setRowData([]);
    }, []);

    useEffect(() => {
        if (employees) {
            setEmployeeOptions(
                employees
                    // .filter((userDetail: any) => userDetail.employee.id !== user.employee?.id)
                    .map((userDetail: any) => ({
                        value: userDetail.employee.id,
                        label: userDetail.name + ' (' + userDetail.employee.employee_code + ')'
                    }))
            );
        }
    }, [employees]);

    useEffect(() => {
        if (pluginCategories) {
            setPluginCategoryOptions(pluginCategories.map((category: any) => ({
                value: category.id,
                label: category.name
            })));
        }
    }, [pluginCategories]);

    useEffect(() => {
        if (plugins) {
            setPluginOptions(plugins.map((plugin: any) => ({
                value: plugin.id,
                label: plugin.name
            })));
        }
    }, [plugins]);

    useEffect(() => {
        if (menus) {
            setMenuOptions(menus.map((menu: any) => ({
                value: menu.id,
                label: menu.name
            })));
        }
    }, [menus]);

    useEffect(() => {
        if (menuActions) {
            setActionOptions(menuActions.map((action: any) => ({
                value: action.id,
                label: action.name
            })));
        }
    }, [menuActions]);

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
    }, [permissionUpdated]);

    return (
        <div className="flex flex-col gap-5">
            <PageHeader
                appBasePath={AppBasePath.Employee_Permission}
                key={selectedRows.length}
                selectedRows={selectedRows.length}
                gridRef={gridRef}
                leftComponent={{
                    addButton: {
                        show: false,
                        type: 'link',
                        text: 'New',
                        onClick: () => {
                            setModalOpen(true);
                            setFormData({});
                        }
                    },
                    title: 'Permissions',
                    showSetting: false
                }}
                rightComponent={true}
                showSearch={true}
                buttonActions={{
                    delete: () => console.log('deleted'),
                    export: () => console.log('exported'),
                    print: () => router.push('/apps/employees/configuration/employee/permissions/print/' + selectedRows.map(row => row.id).join('/')),
                    archive: () => console.log('archived'),
                    unarchive: () => console.log('unarchived'),
                    duplicate: () => console.log('duplicated')
                }}
            />
            <div className="panel flex flex-col md:flex-row md:justify-between md:items-center gap-3 w-full">
                <div className="flex flex-col md:flex-row md:justify-start md:items-end gap-3 w-full">
                    <Dropdown
                        label="Permission Type"
                        name="permission_type"
                        options={permissionTypeOptions}
                        value={formData.permission_type}
                        onChange={(e) => handleFormChange('permission_type', e, true)}
                        required={true}
                    />
                    {formData.permission_type === 'employee'
                        ? (
                            <Dropdown
                                label="Employee"
                                name="employee_id"
                                options={employeeOptions}
                                value={formData.employee_id}
                                onChange={(e) => handleFormChange('employee_id', e, true)}
                                required={true}
                            />
                        ) : formData.permission_type === 'role'
                            ? (
                                <Dropdown
                                    label="Roles"
                                    name="role_id"
                                    options={roleOptions}
                                    value={formData.role_id}
                                    onChange={(e) => handleFormChange('role_id', e, true)}
                                    required={true}
                                />
                            ) : <></>}
                    <Button
                        type={ButtonType.button}
                        text={loading ? 'Loading...' : 'Fetch Permissions'}
                        variant={ButtonVariant.primary}
                        onClick={() => fetchPermissions()}
                        disabled={loading}
                    />
                </div>
                <div className="flex gap-3 w-full md:justify-end">
                    <Button
                        type={ButtonType.button}
                        text={permissionUpdated ? 'Updating...' : 'Update Permission'}
                        variant={ButtonVariant.success}
                        onClick={() => handleUpdatePermission()}
                        disabled={selectedRows.length === 0 || permissionUpdated}
                    />
                    <Button
                        type={ButtonType.button}
                        text="Create New Permission"
                        variant={ButtonVariant.primary}
                        onClick={() => setModalOpen(true)}
                    />
                </div>
            </div>
            <div>
                <AgGridComponent
                    gridRef={gridRef}
                    data={rowData}
                    colDefs={colDefs}
                    rowSelection={'multiple'}
                    onSelectionChangedRows={(rows) => setSelectedRows(rows)}
                    rowMultiSelectWithClick={false}
                    onFirstDataRendered={onFirstDataRendered}
                    // onRowClicked={(params) => {
                    //     router.push(`/apps/employees/employee-list/view/${params.data.id}`);
                    // }}
                />
            </div>


            {/* New Permission Modal */}
            <Modal
                show={modalOpen}
                setShow={setModalOpen}
                title="Give Permission"
                footer={
                    <div className="flex justify-end gap-3">
                        <Button
                            type={ButtonType.button}
                            variant={ButtonVariant.primary}
                            text="Give"
                            onClick={() => {
                                console.log(formData);
                            }}
                        />
                        <Button
                            type={ButtonType.button}
                            variant={ButtonVariant.danger}
                            text="Cancel"
                            onClick={() => {
                                setModalOpen(false);
                                setFormData({});
                            }}
                        />
                    </div>
                }
            >
                <div className="flex flex-col gap-3">
                    <Dropdown
                        label="Permission Type"
                        name="permission_type"
                        options={permissionTypeOptions}
                        value={formData.permission_type}
                        onChange={(e) => handleFormChange('permission_type', e, true)}
                        required={true}
                    />
                    {formData.permission_type === 'employee'
                        ? (
                            <Dropdown
                                label="Employee"
                                name="employee_id"
                                options={employeeOptions}
                                value={formData.employee_id}
                                onChange={(e) => handleFormChange('employee_id', e, true)}
                                required={true}
                            />
                        ) : formData.permission_type === 'role'
                            ? (
                                <Dropdown
                                    label="Roles"
                                    name="role_id"
                                    options={roleOptions}
                                    value={formData.role_id}
                                    onChange={(e) => handleFormChange('role_id', e, true)}
                                    required={true}
                                />
                            ) : <></>}
                    <Dropdown
                        label="Plugin Category"
                        name="plugin_category_id"
                        options={pluginCategoryOptions}
                        value={formData.plugin_category_id}
                        onChange={(e) => handleFormChange('plugin_category_id', e, true)}
                    />
                    <Dropdown
                        label="Plugin"
                        name="plugin_id"
                        options={pluginOptions}
                        value={formData.plugin_id}
                        onChange={(e) => handleFormChange('plugin_id', e, true)}
                    />
                    <Dropdown
                        label="Menu"
                        name="menu_id"
                        options={menuOptions}
                        value={formData.menu_id}
                        onChange={(e) => handleFormChange('menu_id', e, true)}
                    />
                    <Dropdown
                        label="Available Action"
                        name="menu_action_id"
                        options={actionOptions}
                        value={formData.menu_action_id}
                        onChange={(e) => handleFormChange('menu_action_id', e, true)}
                    />
                </div>
            </Modal>
        </div>
    );
};

Index.getLayout = (page: any) => <AppLayout>{page}</AppLayout>;
export default Index;
