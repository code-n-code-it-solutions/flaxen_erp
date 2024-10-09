import React, { useState } from 'react';
import SalaryComponentModal from '@/components/modals/SalaryComponentModal'; // Ensure this path is correct
import Button from "@/components/Button";
import AgGridComponent from '@/components/apps/AgGridComponent';
import { ButtonType, ButtonVariant } from '@/utils/enums';

const PayrollIndex = () => {
    const [modalOpen, setModalOpen] = useState(false); // State for modal visibility
    const [rowData, setRowData] = useState<any[]>([]); // Assume this will be populated with your data

    // Define the handler to create the component
    const handleCreateComponent = (data: { componentCode: string; name: string; type: string }) => {
        console.log('Component Created:', data);
        // Add the new component to the row data
        setRowData((prev) => [...prev, { ...data }]);
        setModalOpen(false); // Close the modal after creation
    };

    const colDefs = [
        { headerName: 'Component Code', field: 'componentCode' },
        { headerName: 'Name', field: 'name' },
        { headerName: 'Type', field: 'type' },
        {
            headerName: 'Actions',
            cellRenderer: (params: any) => (
                <Button
                    type={ButtonType.button}
                    text="Edit"
                    variant={ButtonVariant.primary}
                    // Add your edit functionality here
                />
            ),
        },
    ];

    return (
        <div className="flex flex-col gap-5">
            <div className="flex justify-between">
                <h1 className="text-xl">Payroll Components</h1>
                {/* Button to trigger modal */}
                <Button
                    type={ButtonType.button}
                    text="Create New Component"
                    variant={ButtonVariant.primary}
                    onClick={() => setModalOpen(true)} // Open modal on click
                />
            </div>

            {/* Grid/Table to display components */}
            <AgGridComponent data={rowData} colDefs={colDefs} rowSelection="multiple" />

            {/* Modal for creating new component */}
            {modalOpen && (
                <SalaryComponentModal
                    modalOpen={modalOpen}
                    setModalOpen={setModalOpen}
                    onCreate={handleCreateComponent}
                />
            )}
        </div>
    );
};

export default PayrollIndex;
