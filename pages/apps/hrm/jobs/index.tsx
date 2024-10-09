import React, { useState, useRef, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { useRouter } from 'next/router';
import { setPageTitle } from '@/store/slices/themeConfigSlice';
import { useAppDispatch, useAppSelector } from '@/store';
import PageHeader from '@/components/apps/PageHeader';
import AgGridComponent from '@/components/apps/AgGridComponent';
import Button from '@/components/Button';
import { ButtonType, ButtonVariant } from '@/utils/enums';
import Swal from 'sweetalert2';
import AppLayout from '@/components/Layouts/AppLayout';

const JobsIndex = () => {
    const gridRef = useRef<AgGridReact<any>>(null);
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { token } = useAppSelector((state) => state.user);

    const [rowData, setRowData] = useState<any[]>([]);
    const [selectedRows, setSelectedRows] = useState<any[]>([]);

    const [colDefs] = useState([
        { headerName: 'Job Id', field: 'job_id', minWidth: 150, checkboxSelection: true },
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
                        onClick={() => router.push(`/apps/hrm/jobs/view/${params.data.job_id}`)}
                    />
                    <Button
                        type={ButtonType.button}
                        text="Edit"
                        variant={ButtonVariant.primary}
                        onClick={() => router.push(`/apps/hrm/jobs/edit/${params.data.job_id}`)}
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

    const handleDeleteJobs = () => {
        const selectedNodes: any = gridRef?.current?.api.getSelectedNodes();
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
                // Handle deletion logic here
                console.log('Deleted job ids:', selectedNodes.map((row: any) => row.data.job_id));
                // Refresh job data here after deletion
            }
        });
    };

    return (
        <div className="flex flex-col gap-5">
            <PageHeader
                appBasePath='/jobs'
                key={selectedRows.length}
                selectedRows={selectedRows.length}
                gridRef={gridRef}
                leftComponent={{
                    addButton: {
                        show: true,
                        type: 'link',
                        text: 'Create Job',
                        link: '/apps/hrm/jobs/create'
                    },
                    title: 'Job Listings',
                    showSetting: true
                }}
                rightComponent={true}
                showSearch={true}
                buttonActions={{
                    delete: () => handleDeleteJobs(),
                    export: () => console.log('exported'),
                    archive: () => console.log('archived'),
                }}
            />
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
