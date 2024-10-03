import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import PageHeader from '@/components/apps/PageHeader';
import { AppBasePath } from '@/utils/enums';
import AgGridComponent from '@/components/apps/AgGridComponent'; 

type Employee = {
    id: number;
    code: string;
    name: string;
    phone: string;
    email: string;
    status: string;
    checkIn: string | null;
    checkOut: string | null;
    attendance: {
        date: string;
        checkIn: string;
        checkOut: string;
        workingHours: string;
        overtime: string;
    }[];
};

const DetailPage = () => {
    const router = useRouter();
    const { id } = router.query;

    const [employee, setEmployee] = useState<Employee | null>(null);
    const [selectedMonth, setSelectedMonth] = useState<string>(new Date().toISOString().slice(0, 7)); // Default to current month

    useEffect(() => {
        // Fetch employee data based on id
        const fetchEmployee = async (id: string | string[] | undefined) => {
            if (id) {
                const empData: Employee = {
                    id: 1,
                    code: 'E001',
                    name: 'John Doe',
                    phone: '123456789',
                    email: 'john@example.com',
                    status: 'Active',
                    checkIn: '09:00 AM',
                    checkOut: '06:00 PM',
                    attendance: [
                        { date: '2024-10-01', checkIn: '09:00 AM', checkOut: '06:00 PM', workingHours: '8', overtime: '1' },
                        { date: '2024-10-02', checkIn: '09:00 AM', checkOut: '05:30 PM', workingHours: '7.5', overtime: '0.5' },
                    ],
                };
                setEmployee(empData); // Simulate API fetch
            }
        };

        fetchEmployee(id);
    }, [id]);

    const colDefs = [
        { headerName: 'Date', field: 'date', width: 100 },
        { headerName: 'Check In', field: 'checkIn', width: 120 },
        { headerName: 'Check Out', field: 'checkOut', width: 120 },
        { headerName: 'Working Hours', field: 'workingHours', width: 130 },
        { headerName: 'Overtime', field: 'overtime', width: 100 },
    ];

    const totalWorkedDays = employee?.attendance.length || 0;

    const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedMonth(event.target.value);
        // Filter data based on the selected month
    };

    return (
        <div className="flex flex-col gap-5">
            <PageHeader
                appBasePath={AppBasePath.Employee_attendance}
                leftComponent={{
                    title: `Employee Details: ${employee?.name || ''}`,
                    showSetting: true,
                    addButton: { show: false },
                }}
                rightComponent={true}
            />
            
            {employee && (
                <div className="flex flex-col gap-5">
                    {/* Basic employee details */}
                    <div className="bg-white p-4 rounded-md shadow-md">
                        <h2 className="text-lg font-bold">Employee Information</h2>
                        <p><strong>Code:</strong> {employee.code}</p>
                        <p><strong>Name:</strong> {employee.name}</p>
                        <p><strong>Phone:</strong> {employee.phone}</p>
                        <p><strong>Email:</strong> {employee.email}</p>
                        <p><strong>Status:</strong> {employee.status}</p>
                        <p><strong>Todays Check In:</strong> {employee.checkIn || 'N/A'}</p>
                        <p><strong>Todays Check Out:</strong> {employee.checkOut || 'N/A'}</p>
                    </div>

                    {/* Attendance table */}
                    <div className="bg-white p-4 rounded-md shadow-md">
                        <div className="flex justify-between items-center mb-4">
                            <select
                                value={selectedMonth}
                                onChange={handleMonthChange}
                                className="p-2 border border-gray-300 rounded"
                            >
                                <option value="2024-10">October 2024</option>
                                <option value="2024-09">September 2024</option>
                                {/* Add more months as needed */}
                            </select>
                            <div className="font-bold text-lg">
                                Total Worked Days: {totalWorkedDays}
                            </div>
                        </div>

                        <AgGridComponent
                            data={employee.attendance}
                            colDefs={colDefs}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default DetailPage;
