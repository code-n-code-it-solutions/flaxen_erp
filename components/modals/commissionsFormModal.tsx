import React, { useEffect, useState } from 'react';
import Modal from "@/components/Modal";
import { Dropdown } from "@/components/form/Dropdown";
import { Input } from "@/components/form/Input";
import Textarea from "@/components/form/Textarea";

interface IProps {
    modalOpen: boolean;
    setModalOpen: (value: boolean) => void;
    handleSubmit: (value: any) => void;
    listFor: any; // Replace with actual type if available
    detail?: any;
    fillingRemaining?: number;
}

const CommissionsFormModal = ({ modalOpen, setModalOpen, handleSubmit, listFor, detail, fillingRemaining }: IProps) => {
    const [formData, setFormData] = useState<any>({});
    const [unitOptions, setUnitOptions] = useState<any>([]);
    const [productOptions, setProductOptions] = useState<any>([]);
    const [taxCategoryOptions, setTaxCategoryOptions] = useState<any>([]);
    const [accounts, setAccounts] = useState<any>([]);

    return (
        <Modal
            show={modalOpen}
            setShow={setModalOpen}
            title='Add Item List'
            size={'lg'}
            footer={
                <div className="mt-8 flex items-center justify-end">
                    <button type="button" className="btn btn-outline-danger" onClick={() => setModalOpen(false)}>
                        Discard
                    </button>
                    <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4" onClick={() => handleSubmit(formData)}>
                        {/* {Object.keys(detail).length > 0 ? 'Update' : 'Add'} */} Add
                    </button>
                </div>
            }
        >

            <Textarea
                label='Description'
                name='description'
                placeholder='not yet design'
                value={formData.description}
                isReactQuill={false}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
        </Modal>
    );
};

export default CommissionsFormModal;
