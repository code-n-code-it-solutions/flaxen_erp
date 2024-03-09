import React, {Fragment, useEffect, useState} from 'react';
import Modal from "@/components/Modal";

interface IProps {
    modalOpen: boolean;
    setModalOpen: (value: boolean) => void;
    handleSubmit: (value: any) => void;
    modalFormData?: any;
}

const DocumentFormModal = ({modalOpen, setModalOpen, handleSubmit, modalFormData}: IProps) => {
    const [document, setDocument] = useState<File | null>(null);
    const [name, setName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [isActive, setIsActive] = useState<boolean>(true);

    useEffect(() => {
        if (modalOpen) {
            setName('');
            setDocument(null);
            setDescription('');
            setIsActive(true)
        }
    }, [modalOpen]);

    return (
        <Modal
            show={modalOpen}
            setShow={setModalOpen}
            title='Add New Document'
            footer={
                <div className="mt-8 flex items-center justify-end">
                    <button type="button" className="btn btn-outline-danger"
                            onClick={() => setModalOpen(false)}>
                        Discard
                    </button>
                    <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4"
                            onClick={() => handleSubmit({
                                name,
                                document,
                                description,
                                isActive
                            })}>
                        {modalFormData ? 'Update' : 'Add'}
                    </button>
                </div>
            }
        >
            <div className="w-full">
                <label htmlFor="document">Document</label>
                <input
                    id="document"
                    type="file"
                    name="document"
                    onChange={(e) => setDocument(e.target.files ? e.target.files[0] : null)}
                    className="rtl:file-ml-5 form-input p-0 file:border-0 file:bg-primary/90 file:py-2 file:px-4 file:font-semibold file:text-white file:hover:bg-primary ltr:file:mr-5"
                    required
                />
            </div>
            <div className="w-full">
                <label htmlFor="name">Name</label>
                <input
                    type="text"
                    name="name"
                    id="name"
                    className="form-input"
                    placeholder='Enter document name'
                    value={name}
                    onChange={e => setName(e.target.value)}
                />
            </div>
            <div className="w-full">
                <label htmlFor="description">Description (Optional)</label>
                <textarea
                    name="description"
                    id="description"
                    className="form-input"
                    placeholder='Document description'
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                ></textarea>
            </div>
        </Modal>
    );
};

export default DocumentFormModal;
