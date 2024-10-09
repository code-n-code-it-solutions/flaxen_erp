import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faSignOutAlt, faInfoCircle } from '@fortawesome/free-solid-svg-icons'; // Importing info icon
import PageHeader from '@/components/apps/PageHeader';
import { AppBasePath } from '@/utils/enums';
import AgGridComponent from '@/components/apps/AgGridComponent'; 
import { useRouter } from 'next/router';

type Employee = {
    id: number;
    code: string;
    name: string;
    phone: string;
    email: string;
    status: string;
    checkIn: string | null;
    checkOut: string | null;
};

const Index = () => {
    const [employees, setEmployees] = useState<Employee[]>([
        { id: 1, code: 'E001', name: 'John Doe', phone: '123456789', email: 'john@example.com', status: 'Active', checkIn: null, checkOut: null },
        { id: 2, code: 'E002', name: 'Jane Smith', phone: '987654321', email: 'jane@example.com', status: 'Active', checkIn: null, checkOut: null },
    ]);

    const router = useRouter();

    const handleCheckIn = (employeeId: number) => {
        setEmployees(employees.map(employee =>
            employee.id === employeeId ? { ...employee, checkIn: new Date().toLocaleTimeString() } : employee
        ));
    };

    const handleCheckOut = (employeeId: number) => {
        setEmployees(employees.map(employee =>
            employee.id === employeeId ? { ...employee, checkOut: new Date().toLocaleTimeString() } : employee
        ));
    };

    const handleDetails = (employeeId: number) => {
        router.push(`/apps/hrm/attendance/view/${employeeId}`);
    };

    const colDefs = [
        { headerName: 'Code', field: 'code', width: 70 },     
        { headerName: 'Name', field: 'name', width: 120 },    
        { headerName: 'Phone', field: 'phone', width: 80 },   
        { headerName: 'Email', field: 'email', width: 130 },  
        { headerName: 'Status', field: 'status', width: 80 }, 
        {
            headerName: 'Check In',
            field: 'checkIn',
            valueGetter: (params: any) => params.data.checkIn || 'N/A',
            width: 90,                                        // Reduced width
        },
        {
            headerName: 'Check Out',
            field: 'checkOut',
            valueGetter: (params: any) => params.data.checkOut || 'N/A',
            width: 90,                                        
        },
        {
            headerName: 'Action',
            width: 180, // Adjusted width for 3 buttons
            cellRenderer: (params: any) => (
                <div className="flex items-center space-x-2">
                    <button
                        disabled={!!params.data.checkIn}
                        onClick={() => handleCheckIn(params.data.id)}
                        className={`mr-1 text-xs px-1 py-1 text-white rounded ${params.data.checkIn ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500'}`}
                    >
                        <FontAwesomeIcon icon={faCheckCircle} />
                    </button>
                    <button
                        disabled={!!params.data.checkOut}
                        onClick={() => handleCheckOut(params.data.id)}
                        className={`text-xs px-1 py-1 text-white rounded ${params.data.checkOut ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500'}`}
                    >
                        <FontAwesomeIcon icon={faSignOutAlt} />
                    </button>
                    <button
                        onClick={() => handleDetails(params.data.id)}
                        className="text-xs px-1 py-1 text-white bg-purple-500 rounded"
                    >
                        <FontAwesomeIcon icon={faInfoCircle} />
                    </button>
                </div>
            ),
        }
    ];

    return (
        <div className="flex flex-col gap-5">
            <PageHeader
                appBasePath={AppBasePath.Employee_attendance}
                leftComponent={{
                    title: 'Employee Attendance',
                    showSetting: true,
                    addButton: { show: true, type: 'button', text: 'Details' },
                }}
                rightComponent={true}
                showSearch={true}
            />

            {/* Horizontal scroll container */}
            <div >
              
                    <AgGridComponent
                        gridRef={useRef(null)}
                        data={employees}
                        colDefs={colDefs}
                       
                    />
               
            </div>
        </div>
    );
};

export default Index;
