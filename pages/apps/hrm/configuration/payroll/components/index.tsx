import React, { useEffect, useRef, useState } from 'react';
import PageHeader from '@/components/apps/PageHeader';
import AgGridComponent from '@/components/apps/AgGridComponent';
import SalaryComponentModal from '@/components/modals/SalaryComponentModal';
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { AppDispatch, useAppSelector } from '@/store';
import { clearPayrollComponentState, getPayrollComponents, storePayrollComponent } from '@/store/slices/payrollComponentsSlice';

const SalaryComponents = () => {
    const router = useRouter();
    const gridRef = useRef<any>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const dispatch: AppDispatch = useDispatch();

    // Correctly accessing the components from payrollComponents slice
    const { components } = useAppSelector((state) => state.payrollComponent);

    const colDefs = [
        { headerName: 'Name', field: 'name' },
        { headerName: 'Type', field: 'type' },
        {
            headerName: 'Actions',
            cellRenderer: (params: any) => (
                <div className="flex gap-2">
                    <button className="btn btn-primary" onClick={() => router.push(`/apps/hrm/payroll/edit/${params.data.id}`)}>
                        Edit
                    </button>
                    <button className="btn btn-danger" onClick={() => handleDelete(params.data.id)}>
                        Delete
                    </button>
                </div>
            ),
        },
    ];

    // Fetch salary components when the component mounts
    useEffect(() => {
        dispatch(getPayrollComponents());
        return () => {
            dispatch(clearPayrollComponentState()); // Clear Redux state on unmount
        };
    }, [dispatch]);

    // Handle the deletion of a salary component
    const handleDelete = (id: string) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'This action cannot be undone!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel!',
            cancelButtonColor: 'red',
            confirmButtonColor: 'green',
        }).then(async (result) => {
            if (result.isConfirmed) {
                // Action to delete the component
                Swal.fire('Deleted!', 'Salary component has been deleted.', 'success');
            }
        });
    };

    // Handle the creation of a new salary component
    const handleCreateComponent = (newComponent: any) => {
        dispatch(storePayrollComponent(newComponent))
            .then(() => {
                dispatch(getPayrollComponents()); // Refetch components after creation
            })
            .catch((error) => {
                console.error('Failed to create new component:', error);
            });
        setModalOpen(false);
    };

    const AppBasePath = {
        payroll: '/apps/hrm/configuration/payroll/components',
    };

    return (
        <div className="flex flex-col gap-5">
            <PageHeader
                appBasePath={AppBasePath.payroll}
                key={selectedRows.length}
                selectedRows={selectedRows.length}
                gridRef={gridRef}
                leftComponent={{
                    addButton: {
                        show: true,
                        type: 'button',
                        text: 'New',
                        onClick: () => setModalOpen(true), // Open modal on click
                    },
                    title: 'Payroll Components',
                }}
                rightComponent={true}
                showSearch={true}
            />

            <div>
                <AgGridComponent
                    gridRef={gridRef}
                    data={components} // Using components from the payrollComponents slice
                    colDefs={colDefs}
                    rowSelection="multiple"
                    onSelectionChangedRows={(rows) => setSelectedRows(rows)}
                    rowMultiSelectWithClick={false}
                    onRowClicked={(params) => router.push(`/apps/hrm/payroll/view/${params.data.id}`)}
                />
            </div>

            {modalOpen && (
                <SalaryComponentModal
                    modalOpen={modalOpen}
                    setModalOpen={setModalOpen}
                    onCreate={handleCreateComponent} // Pass the create handler to the modal
                />
            )}
        </div>
    );
};

export default SalaryComponents;
