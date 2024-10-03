// File: /components/modals/EmployeeAttendanceModal.tsx

import React, { useEffect, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';

interface EmployeeAttendanceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    actionType: 'Check In' | 'Check Out';
    employeeName: string;
}

const EmployeeAttendanceModal: React.FC<EmployeeAttendanceModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    actionType,
    employeeName,
}) => {
    const nodeRef = useRef(null);

    // Close modal on ESC key press
    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => {
            window.removeEventListener('keydown', handleEsc);
        };
    }, [onClose]);

    return (
        <CSSTransition
            in={isOpen}
            timeout={300}
            classNames="modal"
            unmountOnExit
            nodeRef={nodeRef}
        >
            <div
                ref={nodeRef}
                className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
            >
                <div className="bg-white rounded-lg shadow-lg w-80 p-6 transform transition-all duration-300">
                    <h2 id="modal-title" className="text-xl font-semibold mb-4">
                        {actionType} Confirmation
                    </h2>
                    <p className="mb-6">
                        Are you sure you want to <strong>{actionType.toLowerCase()}</strong> for{' '}
                        <strong>{employeeName}</strong>?
                    </p>
                    <div className="flex justify-end gap-4">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 focus:outline-none"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            className={`px-4 py-2 rounded ${
                                actionType === 'Check In'
                                    ? 'bg-green-500 text-white hover:bg-green-600'
                                    : 'bg-blue-500 text-white hover:bg-blue-600'
                            } focus:outline-none`}
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            </div>
        </CSSTransition>
    );
};

export default EmployeeAttendanceModal;
