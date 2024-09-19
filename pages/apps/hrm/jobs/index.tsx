import React, { useState, useRef, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { useRouter } from 'next/router';
import { setPageTitle } from '@/store/slices/themeConfigSlice';
import { useAppDispatch } from '@/store';
import PageHeader from '@/components/apps/PageHeader';
import AgGridComponent from '@/components/apps/AgGridComponent';
import Button from '@/components/Button';
import { ButtonType, ButtonVariant } from '@/utils/enums';
import AppLayout from '@/components/Layouts/AppLayout';

const JobsIndex = () => {
    const gridRef = useRef<AgGridReact<any>>(null);
    const dispatch = useAppDispatch();
    const router = useRouter();

    const [rowData, setRowData] = useState<any[]>([]);
    const [selectedRows, setSelectedRows] = useState<any[]>([]);

    const [colDefs] = useState([
        { headerName: 'Job Id', field: 'job_id', minWidth: 150 },
        { headerName: 'Title', field: 'title', minWidth: 150 },
        { headerName: 'Type', field: 'type', minWidth: 150 },
        { headerName: 'Nature', field: 'nature', minWidth: 150 },
        { headerName: 'Status', field: 'status', minWidth: 100 },
        { headerName: 'Deadline', field: 'deadline', minWidth: 150 },
        { headerName: 'No of Candid', field: 'no_of_candid', minWidth: 150 },
        {
            headerName: 'Actions',
            cellRenderer: (params: any) => (
                <div className="flex gap-2">
                    <Button
                        type={ButtonType.button}
                        text="View"
                        variant={ButtonVariant.secondary}
                        onClick={() => router.push(`/apps/hrm/jobs/view/${params.data.job_code}`)}
                    />
                    <Button
                        type={ButtonType.button}
                        text="Edit"
                        variant={ButtonVariant.primary}
                        onClick={() => router.push(`/apps/hrm/jobs/edit/${params.data.job_code}`)}
                    />
                </div>
            ),
            minWidth: 200
        }
        
    ]);

    useEffect(() => {
        dispatch(setPageTitle('Job List'));
        // Simulated data for now; replace with API data later
       setRowData([
    { job_id: 'J001', title: 'Software Engineer', type: 'Full Time', nature: 'Onsite', status: 'Active', deadline: '2024-12-31', no_of_candid: 10 },
    { job_id: 'J002', title: 'Project Manager', type: 'Contract', nature: 'Remote', status: 'Active', deadline: '2024-11-15', no_of_candid: 5 },
]);

    }, [dispatch]);

    const handleCreateJob = () => {
        router.push('/apps/hrm/jobs/create');
    };

    return (
        <div className="flex flex-col gap-5">
            <PageHeader
                appBasePath='/jobs'
                key={selectedRows.length}
                selectedRows={selectedRows.length}
                gridRef={gridRef}
                leftComponent={{
                    addButton: { show: false },
                    title: 'Job Listings',
                    showSetting: false
                }}
                rightComponent={true}
                showSearch={true}
            />
            <div className="panel flex flex-col md:flex-row md:justify-between md:items-center gap-3 w-full">
                <Button
                    type={ButtonType.button}
                    text={'Create Job'}
                    variant={ButtonVariant.primary}
                    onClick={handleCreateJob}
                />
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

JobsIndex.getLayout = (page: any) => <AppLayout>{page}</AppLayout>;
export default JobsIndex;
