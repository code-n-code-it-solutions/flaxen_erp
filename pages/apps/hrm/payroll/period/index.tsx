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
    useSetActiveMenu(AppBasePath.Payroll_Period);
    const router = useRouter();
    const dispatch = useDispatch();
    const { token } = useSelector((state: IRootState) => state.user);

    const mockPayrollData = [
        { id: 1, payrollPeriodCode: 'P123', name: 'Payroll A', startDate: '2023-01-01', endDate: '2023-01-15' },
        { id: 2, payrollPeriodCode: 'P456', name: 'Payroll B', startDate: '2023-02-01', endDate: '2023-02-15' },
        { id: 3, payrollPeriodCode: 'P789', name: 'Payroll C', startDate: '2023-03-01', endDate: '2023-03-15' }
    ];

    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const gridRef = useRef<AgGridReact<any>>(null);
    const [colDefs] = useState<any>([
        { headerName: 'Payroll Period Code', field: 'payrollPeriodCode', minWidth: 150 },
        { headerName: 'Name', field: 'name', minWidth: 150 },
        { headerName: 'Start Date', field: 'startDate', minWidth: 150 },
        { headerName: 'End Date', field: 'endDate', minWidth: 150 }
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newPayrollPeriod, setNewPayrollPeriod] = useState({
        payrollPeriodCode: '',
        name: '',
        startDate: '',
        endDate: '',
    });

    useEffect(() => {
        dispatch(setPageTitle('Payroll Periods'));
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
                    console.log(`Deleted Payroll Period IDs: ${idsToDelete}`);
                    gridRef.current?.api.applyTransaction({ remove: selectedNodes.map(node => node.data) });
                }
            });
        }
    };
        
    const handleCreateNew = () => {
        setNewPayrollPeriod({ payrollPeriodCode: '', name: '', startDate: '', endDate: '' });
        setIsModalOpen(true);
    };

    const handleSubmit = (value: any) => {
        console.log('New Payroll Period:', value);
        setIsModalOpen(false);
    };

    return (
        <>
            <div className={`flex-col gap-5 ${isModalOpen ? 'hidden' : 'flex'}`}>
                <PageHeader
                    appBasePath={AppBasePath.Payroll_Period}
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
                        title: 'Payroll Period Management',
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
                        data={mockPayrollData}
                        colDefs={colDefs}
                        rowSelection={'multiple'}
                        onSelectionChangedRows={(rows) => setSelectedRows(rows)}
                        rowMultiSelectWithClick={false}
                        onRowClicked={(params) => {
                            router.push(`/apps/manufacturing/payroll-period/view/${params.data.id}`);
                        }}
                    />
                </div>
            </div>
            
            <Modal
                show={isModalOpen}
                setShow={setIsModalOpen}
                title={'Add Payroll Period'}
                className="smaller-modal transparent-modal"
                footer={
                    <div className="mt-8 flex items-center justify-end">
                        <button type="button" className="btn btn-outline-danger" onClick={() => setIsModalOpen(false)}>
                            Discard
                        </button>
                        <button
                            type="button"
                            className="btn btn-primary ltr:ml-4 rtl:mr-4"
                            onClick={() => handleSubmit(newPayrollPeriod)}
                        >
                            Add
                        </button>
                    </div>
                }
            >
                <div className="w-full">
                    <label htmlFor="payrollPeriodCode">Payroll Period Code</label>
                    <input
                        type="text"
                        name="payrollPeriodCode"
                        id="payrollPeriodCode"
                        className="form-input"
                        placeholder="Enter payroll period code"
                        value={newPayrollPeriod.payrollPeriodCode}
                        onChange={e => setNewPayrollPeriod({ ...newPayrollPeriod, payrollPeriodCode: e.target.value })}
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
                        value={newPayrollPeriod.name}
                        onChange={e => setNewPayrollPeriod({ ...newPayrollPeriod, name: e.target.value })}
                    />
                </div>
                <div className="w-full">
                    <label htmlFor="startDate">Start Date</label>
                    <input
                        type="date"
                        name="startDate"
                        id="startDate"
                        className="form-input"
                        value={newPayrollPeriod.startDate}
                        onChange={e => setNewPayrollPeriod({ ...newPayrollPeriod, startDate: e.target.value })}
                    />
                </div>
                <div className="w-full">
                    <label htmlFor="endDate">End Date</label>
                    <input
                        type="date"
                        name="endDate"
                        id="endDate"
                        className="form-input"
                        value={newPayrollPeriod.endDate}
                        onChange={e => setNewPayrollPeriod({ ...newPayrollPeriod, endDate: e.target.value })}
                    />
                </div>
            </Modal>
        </>
    );
};

export default Index;
