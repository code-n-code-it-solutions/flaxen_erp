import React, { useCallback, useEffect, useRef, useState } from 'react';
import AppLayout from '@/components/Layouts/AppLayout';
import { AgGridReact } from 'ag-grid-react';
import { setPageTitle } from '@/store/slices/themeConfigSlice';
import { setAuthToken, setContentType } from '@/configs/api.config';
import { clearTemplateState, getTemplates } from '@/store/slices/templateSlice';
import { useAppDispatch, useAppSelector } from '@/store';
import PageHeader from '@/components/apps/PageHeader';
import AgGridComponent from '@/components/apps/AgGridComponent';
import { Dropdown } from '@/components/form/Dropdown';
import Button from '@/components/Button';
import { AppBasePath, ButtonType, ButtonVariant } from '@/utils/enums';
import { useRouter } from 'next/router'; // Import useRouter hook
import { FirstDataRenderedEvent, IRowNode } from '@ag-grid-community/core';
import { combineReducers } from 'redux';

const Index = () => {
    const gridRef = useRef<AgGridReact<any>>(null);
    const dispatch = useAppDispatch();
    const router = useRouter(); // Initialize the router

    const { token } = useAppSelector((state) => state.user);
    // const { templates } = useAppSelector((state) => state.template || { templates: [] });

    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const [templateTypeOptions, setTemplateTypeOptions] = useState<any[]>([
        { label: 'Email', value: 'email' },
        { label: 'SMS', value: 'sms' },
        { label: 'Notification', value: 'notification' },
        { label: 'Contract', value: 'contract' },
        { label: 'Agreement', value: 'agreement' }
    ]);

    const [statusOptions] = useState<any[]>([
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' }
    ]);

    const [visibilityOptions] = useState<any[]>([
        { label: 'Private', value: 'private' },
        { label: 'Public', value: 'public' }
    ]);

    const [formData, setFormData] = useState<any>({});
    const [rowData, setRowData] = useState<any[]>([]);
    const [colDefs, setColDefs] = useState<any>([
        {
            headerName: 'Template Code',
            field: 'template_code',
            minWidth: 150
        },
        {
            headerName: 'Name',
            field: 'name',
            minWidth: 150
        },
        {
            headerName: 'Description',
            field: 'description',
            minWidth: 200
        },
        {
            headerName: 'Contract Type',
            field: 'contract_type',
            minWidth: 200
        },
        {
            headerName: 'Subject',
            field: 'subject',
            minWidth: 150
        },
        {
            headerName: 'Status',
            field: 'status',
            minWidth: 100
        },
        {
            headerName: 'Visibility',
            field: 'visibility',
            minWidth: 150
        }
    ]);

    const fetchTemplates = () => {
        dispatch(clearTemplateState());
        setRowData([]);
        dispatch(getTemplates());
    };

    useEffect(() => {
        dispatch(setPageTitle('Template List'));
        setAuthToken(token);
        setContentType('application/json');
        dispatch(clearTemplateState());
        setRowData([]);
    }, [dispatch, token]);

    // useEffect(() => {
    //     if (templates) {
    //         setRowData(templates);
    //     } else {
    //         setRowData([]);
    //     }
    // }, [templates]);

    // Navigate to the create template page
    const navigateToCreateTemplate = () => {
        router.push('/apps/hrm/configuration/template/create'); // Adjust the path as needed
    };

    return (
        <div className="flex flex-col gap-5">
            <PageHeader
                appBasePath='/template' // Temporarily use a string for the path
                key={selectedRows.length}
                selectedRows={selectedRows.length}
                gridRef={gridRef}
                leftComponent={{
                    addButton: { show: false },
                    title: 'Templates',
                    showSetting: false
                }}
                rightComponent={true}
                showSearch={true}
            />
            <div className="panel flex flex-col md:flex-row md:justify-between md:items-center gap-3 w-full">
                <div className="flex flex-col md:flex-row md:justify-start md:items-end gap-3 w-full">
                    <Dropdown
                        label="Contract Type"
                        name="contract_type"
                        options={templateTypeOptions}
                        value={formData.contract_type}
                        onChange={(e) => setFormData({ ...formData, contract_type: e.value })}
                        required={true}
                    />
                    <Dropdown
                        label="Status"
                        name="status"
                        options={statusOptions}
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.value })}
                        required={true}
                    />
                    <Dropdown
                        label="Visibility"
                        name="visibility"
                        options={visibilityOptions}
                        value={formData.visibility}
                        onChange={(e) => setFormData({ ...formData, visibility: e.value })}
                        required={true}
                    />
                    <Button
                        type={ButtonType.button}
                        text={'Create Templates'}
                        variant={ButtonVariant.primary}
                        onClick={navigateToCreateTemplate} // Navigate to the create page
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
                />
            </div>
        </div>
    );
};

Index.getLayout = (page: any) => <AppLayout>{page}</AppLayout>;
export default Index;
