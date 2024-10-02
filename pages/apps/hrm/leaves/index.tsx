import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '@/store';
import { setPageTitle } from '@/store/slices/themeConfigSlice';
import { setAuthToken, setContentType } from '@/configs/api.config';
import AgGridComponent from '@/components/apps/AgGridComponent';
import PageHeader from '@/components/apps/PageHeader';
import { AppBasePath } from '@/utils/enums';
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';
import useSetActiveMenu from '@/hooks/useSetActiveMenu';
import { AgGridReact } from 'ag-grid-react';
import Modal from '@/components/Modal';

const Index = () => {
    useSetActiveMenu(AppBasePath.Leave_Type);
    const router = useRouter();
    const dispatch = useDispatch();
    const { token } = useSelector((state: IRootState) => state.user);

    const mockLeaveData = [
        { id: 1, leaveTypeCode: 'LT001', name: 'Annual Leave', maxLeaveCounts: 30, carryForwardLimit: 5, description: 'Leave for vacations', status: 'Active' },
        { id: 2, leaveTypeCode: 'LT002', name: 'Sick Leave', maxLeaveCounts: 15, carryForwardLimit: 2, description: 'Leave for health issues', status: 'Active' },
        { id: 3, leaveTypeCode: 'LT003', name: 'Casual Leave', maxLeaveCounts: 10, carryForwardLimit: 0, description: 'Unplanned leave', status: 'Inactive' }
    ];

    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const gridRef = useRef<AgGridReact<any>>(null);
    const [colDefs] = useState<any>([
        { headerName: 'Leave Type Code', field: 'leaveTypeCode', minWidth: 150 },
        { headerName: 'Name', field: 'name', minWidth: 150 },
        { headerName: 'Max Leave Counts', field: 'maxLeaveCounts', minWidth: 150 },
        { headerName: 'Carry Forward Limit', field: 'carryForwardLimit', minWidth: 150 },
        { headerName: 'Description', field: 'description', minWidth: 150 },
        { headerName: 'Status', field: 'status', minWidth: 150 },
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newLeaveType, setNewLeaveType] = useState({
        leaveTypeCode: '',
        name: '',
        maxLeaveCounts: 0,
        carryForwardLimit: 0,
        description: '',
        status: 'Active',
    });

    useEffect(() => {
        dispatch(setPageTitle('Leave Types'));
        setAuthToken(token);
        setContentType('application/json');
    }, [dispatch, token]);

    const handleDelete = () => {
        const selectedNodes = gridRef.current?.api.getSelectedNodes();
        if (selectedNodes && selectedNodes.length > 0) {
            const idsToDelete = selectedNodes.map(node => node.data.id);
            Swal.fire({
                title: 'Are you sure?',
                text: 'You won\'t be able to revert this!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, delete it!',
            }).then((result) => {
                if (result.isConfirmed) {
                    console.log(`Deleted Leave Type IDs: ${idsToDelete}`);
                    gridRef.current?.api.applyTransaction({ remove: selectedNodes.map(node => node.data) });
                }
            });
        }
    };

    const handleCreateNew = () => {
        setNewLeaveType({ leaveTypeCode: '', name: '', maxLeaveCounts: 0, carryForwardLimit: 0, description: '', status: 'Active' });
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    const handleModalSave = () => {
        console.log('New Leave Type:', newLeaveType);
        setIsModalOpen(false);
    };

    const handleSubmit = (value: any) => {
        console.log('New Leave Type:', value);
        setIsModalOpen(false);
    };

    return (
        <>
            <div className={`flex-col gap-5 ${isModalOpen ? 'hidden' : 'flex'}`}>
                <PageHeader
                    appBasePath={AppBasePath.Leave_Type}
                    key={selectedRows.length}
                    selectedRows={selectedRows.length}
                    gridRef={gridRef}
                    leftComponent={{
                        addButton: {
                            show: true,
                            type: 'button',
                            text: 'New',
                            onClick: handleCreateNew,
                        },
                        title: 'Leave Type Management',
                        showSetting: true
                    }}
                    rightComponent={true}
                    showSearch={true}
                    buttonActions={{
                        delete: handleDelete,
                        export: () => console.log('Exported'),
                        print: () => console.log('Printed'),
                    }}
                />
                <div>
                    <AgGridComponent
                        gridRef={gridRef}
                        data={mockLeaveData}
                        colDefs={colDefs}
                        rowSelection={'multiple'}
                        onSelectionChangedRows={(rows) => setSelectedRows(rows)}
                        rowMultiSelectWithClick={false}
                        onRowClicked={(params) => {
                            router.push(`/apps/manufacturing/leave-type/view/${params.data.id}`);
                        }}
                    />
                </div>
            </div>
            <Modal
                show={isModalOpen}
                setShow={setIsModalOpen}
                title={'Add Leave Type'}
                
                footer={
                    <div className="mt-8 flex items-center justify-end">
                        <button type="button" className="btn btn-outline-danger" onClick={() => setIsModalOpen(false)}>
                            Discard
                        </button>
                        <button
                            type="button"
                            className="btn btn-primary ltr:ml-4 rtl:mr-4"
                            onClick={() => handleSubmit(newLeaveType)}
                        >
                            Add
                        </button>
                    </div>
                }
            >
                <div className="w-full">
                    <label htmlFor="leaveTypeCode">Leave Type Code</label>
                    <input
                        type="text"
                        name="leaveTypeCode"
                        id="leaveTypeCode"
                        className="form-input"
                        placeholder="Enter leave type code"
                        value={newLeaveType.leaveTypeCode}
                        onChange={e => setNewLeaveType({ ...newLeaveType, leaveTypeCode: e.target.value })}
                    />
                </div>
                <div className="w-full">
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        className="form-input"
                        placeholder="Enter name"
                        value={newLeaveType.name}
                        onChange={e => setNewLeaveType({ ...newLeaveType, name: e.target.value })}
                    />
                </div>
                <div className="w-full">
                    <label htmlFor="maxLeaveCounts">Max Leave Counts</label>
                    <input
                        type="number"
                        name="maxLeaveCounts"
                        id="maxLeaveCounts"
                        className="form-input"
                        placeholder="Enter max leave counts"
                        value={newLeaveType.maxLeaveCounts}
                        onChange={e => setNewLeaveType({ ...newLeaveType, maxLeaveCounts: parseInt(e.target.value) })}
                    />
                </div>
                <div className="w-full">
                    <label htmlFor="carryForwardLimit">Carry Forward Limit</label>
                    <input
                        type="number"
                        name="carryForwardLimit"
                        id="carryForwardLimit"
                        className="form-input"
                        placeholder="Enter carry forward limit"
                        value={newLeaveType.carryForwardLimit}
                        onChange={e => setNewLeaveType({ ...newLeaveType, carryForwardLimit: parseInt(e.target.value) })}
                    />
                </div>
                <div className="w-full">
                    <label htmlFor="description">Description (Optional)</label>
                    <textarea
                        name="description"
                        id="description"
                        className="form-input"
                        placeholder="Enter description"
                        value={newLeaveType.description}
                        onChange={e => setNewLeaveType({ ...newLeaveType, description: e.target.value })}
                    ></textarea>
                </div>
                <div className="w-full">
                    <label htmlFor="status">Status</label>
                    <select
                        name="status"
                        id="status"
                        className="form-input"
                        value={newLeaveType.status}
                        onChange={e => setNewLeaveType({ ...newLeaveType, status: e.target.value })}
                    >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                </div>
            </Modal>
        </>
    );
};

export default Index;
