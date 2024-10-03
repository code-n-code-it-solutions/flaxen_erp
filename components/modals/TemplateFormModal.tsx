import React, { useEffect, useState } from 'react';
import Modal from '@/components/Modal';
import { Dropdown } from '@/components/form/Dropdown'; 
import Textarea from '@/components/form/Textarea'; 
import { IRootState, useAppDispatch, useAppSelector } from '@/store';
import { generateCode } from '@/store/slices/utilSlice';
import { FORM_CODE_TYPE } from '@/utils/enums'; // Ensure TEMPLATE is correctly defined in enums

interface IProps {
    modalOpen: boolean;
    setModalOpen: (value: boolean) => void;
    handleSubmit: (value: any) => void;
    modalFormData?: any;
}

const TemplateFormModal = ({ modalOpen, setModalOpen, handleSubmit, modalFormData }: IProps) => {
    const dispatch = useAppDispatch();
    const [templateCode, setTemplateCode] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [subject, setSubject] = useState<string>('');
    const [type, setType] = useState<string>('');
    const [status, setStatus] = useState<string>('');
    const [visibility, setVisibility] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [templateBody, setTemplateBody] = useState<string>('');

    const typeOptions = [
        { label: 'Email', value: 'email' },
        { label: 'SMS', value: 'sms' },
        { label: 'Notification', value: 'notification' },
        { label: 'Contract', value: 'contract' },
        { label: 'Agreement', value: 'agreement' }
    ];

    const statusOptions = [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' }
    ];

    const visibilityOptions = [
        { label: 'Private', value: 'private' },
        { label: 'Public', value: 'public' }
    ];

    useEffect(() => {
        if (modalOpen) {
            if (modalFormData && Object.keys(modalFormData).length > 0) {
                setName(modalFormData.name);
                setSubject(modalFormData.subject);
                setType(modalFormData.type);
                setStatus(modalFormData.status);
                setVisibility(modalFormData.visibility);
                setDescription(modalFormData.description);
                setTemplateBody(modalFormData.template_body);
                setTemplateCode(modalFormData.template_code);
            } else {
                dispatch(generateCode(FORM_CODE_TYPE.TEMPLATE)); // Make sure TEMPLATE is defined
            }
        }
    }, [modalOpen, modalFormData]);

    return (
        <Modal
            show={modalOpen}
            setShow={setModalOpen}
            title={modalFormData && Object.keys(modalFormData).length > 0 ? 'Update Template' : 'Add Template'}
            footer={
                <div className="mt-8 flex items-center justify-end">
                    <button
                        type="button"
                        className="btn btn-outline-danger"
                        onClick={() => setModalOpen(false)}
                    >
                        Discard
                    </button>
                    <button
                        type="button"
                        className="btn btn-primary ltr:ml-4 rtl:mr-4"
                        onClick={() => handleSubmit({
                            template_code: templateCode,
                            name,
                            subject,
                            type,
                            status,
                            visibility,
                            description,
                            template_body: templateBody
                        })}
                    >
                        {modalFormData && Object.keys(modalFormData).length > 0 ? 'Update' : 'Add'}
                    </button>
                </div>
            }
        >
            <div className="w-full">
                <label htmlFor="template_code">Template Code</label>
                <input
                    type="text"
                    name="template_code"
                    id="template_code"
                    className="form-input"
                    value={templateCode}
                    disabled
                />
            </div>
            <div className="w-full">
                <label htmlFor="name">Template Name</label>
                <input
                    type="text"
                    name="name"
                    id="name"
                    className="form-input"
                    placeholder="Enter template name"
                    value={name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                />
            </div>
            <div className="w-full">
                <label htmlFor="subject">Template Subject</label>
                <input
                    type="text"
                    name="subject"
                    id="subject"
                    className="form-input"
                    placeholder="Enter template subject"
                    value={subject}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSubject(e.target.value)}
                />
            </div>
            <div className="w-full">
                <label htmlFor="type">Type</label>
                <Dropdown
                    name="type"
                    options={typeOptions}
                    value={typeOptions.find(option => option.value === type)}
                    onChange={(e: { value: string }) => setType(e?.value || '')}
                />
            </div>
            <div className="w-full">
                <label htmlFor="status">Status</label>
                <Dropdown
                    name="status"
                    options={statusOptions}
                    value={statusOptions.find(option => option.value === status)}
                    onChange={(e: { value: string }) => setStatus(e?.value || '')}
                />
            </div>
            <div className="w-full">
                <label htmlFor="visibility">Visibility</label>
                <Dropdown
                    name="visibility"
                    options={visibilityOptions}
                    value={visibilityOptions.find(option => option.value === visibility)}
                    onChange={(e: { value: string }) => setVisibility(e?.value || '')}
                />
            </div>
            <div className="w-full">
                <label htmlFor="description">Description</label>
                <div className="form-input-wrapper"> {/* Wrap Textarea in div */}
                    <Textarea
                        name="description"
                        placeholder="Enter template description"
                        value={description}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                    />
                </div>
            </div>
            <div className="w-full">
                <label htmlFor="template_body">Template Body</label>
                <div className="form-input-wrapper"> 
                    <Textarea
                        name="template_body"
                        placeholder="Enter template body with placeholders like [name], [email], [joining_date], etc."
                        value={templateBody}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setTemplateBody(e.target.value)}
                    />
                </div>
            </div>
        </Modal>
    );
};

export default TemplateFormModal;
