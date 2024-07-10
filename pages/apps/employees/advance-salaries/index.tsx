import React, { useEffect, useRef, useState } from 'react';
import AppLayout from '@/components/Layouts/AppLayout';
import PageHeader from '@/components/apps/PageHeader';
import { setPageTitle } from '@/store/slices/themeConfigSlice';
import { AgGridReact } from 'ag-grid-react';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '@/store';
import { setAuthToken, setContentType } from '@/configs/api.config';
import AgGridComponent from '@/components/apps/AgGridComponent';
import { Button } from 'antd';
import { AppBasePath } from '@/utils/enums';
import useSetActiveMenu from '@/hooks/useSetActiveMenu';
import AdvanceSalariesFormModal from '@/components/modals/AdvanceSalariesFormModal ';


const Index = () => {
    useSetActiveMenu(AppBasePath.Invoice_Payment);
    const router = useRouter();

    const dispatch = useAppDispatch();
    const { token } = useAppSelector((state) => state.user);

    const { customerPayments, loading } = useAppSelector((state) => state.customerPayment);
    const { permittedMenus } = useAppSelector((state) => state.menu);
    const { activeMenu } = useAppSelector((state) => state.menu);
    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const gridRef = useRef<AgGridReact<any>>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    
    const [colDefs, setColDefs] = useState<any>([
        { headerName: 'Employee Code', field: 'employee_code', minWidth: 150 },
        { headerName: 'Employee Name', field: 'employee_name', minWidth: 150 },
        { headerName: 'Email', field: 'email', minWidth: 150 },
        { headerName: 'Phone', field: 'phone', minWidth: 150 },
        { headerName: 'Joining Date', field: 'joining_date', minWidth: 150 },
        { headerName: 'Department', field: 'department', minWidth: 150 },
        { headerName: 'Designation', field: 'designation', minWidth: 150 },
        { headerName: 'Number of Advance salaries', field: 'number_of_advance_salaries', minWidth: 150 },
        { headerName: 'Total Amount', field: 'total_amount', minWidth: 150 },
        {
            headerName: 'Action',
            field: 'action',
            minWidth: 150,
            cellRendererFramework: (params: any) => (
                <Button onClick={() => handleViewDetail(params.data.id)}>Detail</Button>
            ),
        },
    ]);

    useEffect(() => {
        dispatch(setPageTitle('Employee Advances'));
        setAuthToken(token);
        setContentType('application/json');
       // dispatch(getCustomerPayments());
    }, []);

    const handleViewDetail = (id: any) => {
        router.push(`/apps/advance-salaries/view/${id}`);
    };

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleModalClose = () => {
        setIsModalVisible(false);
    };

    return (
        <div className="flex flex-col gap-5">
            <PageHeader
                appBasePath={AppBasePath.Invoice_Payment}
                key={selectedRows.length}
                selectedRows={selectedRows.length}
                gridRef={gridRef}
                leftComponent={{
                    addButton: {
                        show: true,
                        type: 'button',
                        text: 'New',
                        onClick: showModal,
                    },
                    title: 'Advance Salary ',
                    showSetting: true,
                }}
                rightComponent={true}
                showSearch={true}
                buttonActions={{
                    export: () => console.log('exported'),
                    print: () => router.push('/apps//' + selectedRows.map(row => row.id).join('/')),
                    archive: () => console.log('archived'),
                    unarchive: () => console.log('unarchived'),
                    duplicate: () => console.log('duplicated'),
                    printLabel: () => router.push('/apps//' + selectedRows.map(row => row.id).join('/')),
                }}
            />
            <div>
                <AgGridComponent
                    gridRef={gridRef}
                    data={customerPayments}
                    colDefs={colDefs}
                    rowSelection={'multiple'}
                    onSelectionChangedRows={(rows) => setSelectedRows(rows)}
                    rowMultiSelectWithClick={false}
                    onRowClicked={(params) => {
                        router.push(`/apps//view/${params.data.id}`);
                    }}
                />
            </div>

            <AdvanceSalariesFormModal 
                modalOpen={isModalVisible}
                setModalOpen={handleModalClose}
                handleSubmit={(value: any) => {
                    console.log('New Advance Salary Entry:', value);
                } }
                //  listFor={""}       
                      />
            
        </div>
    );
};

Index.getLayout = (page: any) => <AppLayout>{page}</AppLayout>;
export default Index;
