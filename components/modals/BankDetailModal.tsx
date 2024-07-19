import React, {useEffect, useState} from 'react';
import {setAuthToken} from "@/configs/api.config";
import { useAppDispatch, useAppSelector } from '@/store';
import BankFormModal from "@/components/modals/BankFormModal";
import {getBanks, storeBank} from "@/store/slices/bankSlice";
import {getCurrencies} from "@/store/slices/currencySlice";
import Modal from "@/components/Modal";
import {Input} from '@/components/form/Input'
import {Dropdown} from '../form/Dropdown';
import Alert from '@/components/Alert';
import Button from "@/components/Button";
import {ButtonSize, ButtonType, ButtonVariant, IconType} from "@/utils/enums";
import {getIcon} from "@/utils/helper";

interface IProps {
    modalOpen: boolean;
    setModalOpen: (value: boolean) => void;
    handleSubmit: (value: any) => void;
    modalFormData?: any;
    title: string;
}

const BankDetailModal = ({modalOpen, setModalOpen, handleSubmit, modalFormData, title}: IProps) => {
    const dispatch = useAppDispatch();
    const {token} = useAppSelector((state) => state.user);
    const {banks, bank, success} = useAppSelector((state) => state.bank);
    const {currencies} = useAppSelector((state) => state.currency);
    const [bankFormModal, setBankFormModal] = useState<boolean>(false);
    const [errorMessages, setErrorMessages] = useState<any>({})
    const [isFormValid, setIsFormValid] = useState<boolean>(false);
    const [validationMessage, setValidationMessage] = useState("");
    const [formData, setFormData] = useState<any>({
        id: 0,
        bank_id: 0,
        bank_name: '',
        currency_id: 0,
        currency_name: '',
        currency_code: '',
        account_name: '',
        account_number: '',
        iban: '',
        is_active: true,
    });

    const [bankOptions, setBankOptions] = useState([]);
    const [currencyOptions, setCurrencyOptions] = useState([]);

    const handleBankSubmit = (value: any) => {
        let bankFormData = {
            name: value.name,
            phone: value.phone,
            email: value.email,
            country_id: value.country_id,
            state_id: value.state_id,
            city_id: value.city_id,
            postal_code: value.postal_code,
            address: value.address,
            is_active: value.is_active,
        }
        dispatch(storeBank(bankFormData));
    }

    useEffect(() => {
        if (modalOpen) {
            setFormData({
                bank_id: modalFormData?.bank_id || 0,
                bank_name: modalFormData?.bank_name || '',
                currency_id: modalFormData?.currency_id || 0,
                currency_name: modalFormData?.currency_name || '',
                currency_code: modalFormData?.currency_code || '',
                account_name: modalFormData?.account_name || '',
                account_number: modalFormData?.account_number || '',
                iban: modalFormData?.iban || '',
                swift_code: modalFormData?.swift_code || '',
                is_active: modalFormData?.is_active || true,
            })
            dispatch(getBanks());
            dispatch(getCurrencies());
        }
    }, [modalOpen]);

    useEffect(() => {
        setAuthToken(token)
    }, [])

    useEffect(() => {
        if (banks) {
            setBankOptions(banks.map((bank: any) => {
                return {value: bank.id, label: bank.name}
            }))
        }
    }, [banks]);

    useEffect(() => {
        if (currencies) {
            setCurrencyOptions(currencies.map((currency: any) => {
                return {value: currency.id, label: currency.code, name: currency.name}
            }))
        }
    }, [currencies]);

    useEffect(() => {
        if (bank && success) {
            dispatch(getBanks());
            setBankFormModal(false);
        }
    }, [bank, success]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {value, required, name} = e.target;
        const UpFormData = {
            ...formData,
            [name]: value,
        };
        setFormData(UpFormData);

        if (required) {
            if (!value) {
                setErrorMessages({...errorMessages, [name]: 'This field is required.'});
            } else {
                setErrorMessages({...errorMessages, [name]: ''});
            }
        }
    };

    useEffect(() => {
        const isValid = Object.values(errorMessages).some(message => message !== '');
        setIsFormValid(!isValid);
        if (isValid) {
            setValidationMessage("Please fill the required field.");
        }
    }, [errorMessages]);

    return (
        <Modal
            show={modalOpen}
            setShow={setModalOpen}
            title='Add Bank Detail'
            footer={
                <div className="mt-8 gap-3 flex items-center justify-end">
                    <Button
                        type={ButtonType.button}
                        text="Discard"
                        variant={ButtonVariant.secondary}
                        onClick={() => setModalOpen(false)}
                    />
                    {isFormValid && (
                        <Button
                            type={ButtonType.button}
                            text={modalFormData ? 'Update' : 'Add'}
                            variant={ButtonVariant.primary}
                            onClick={() => handleSubmit(formData)}
                        />
                    )}
                </div>
            }
        >
            {!isFormValid && validationMessage &&
                <Alert
                    alertType="error"
                    message={validationMessage}
                    setMessages={setValidationMessage}
                />}

            <div className="w-full flex justify-center items-end gap-3">
                <div className="w-full">
                    <Dropdown
                        label='Bank'
                        options={bankOptions}
                        name='currency_id'
                        value={formData.bank_id}
                        onChange={(e: any, required: any) => {
                            if (e && typeof e !== 'undefined') {
                                // const { value, label, required, name } = e;
                                setFormData((prev: any) => ({
                                    ...prev,
                                    bank_id: e.value || 0,
                                    bank_name: e.label || 0
                                }));
                                if (required) {
                                    setErrorMessages({ ...errorMessages, bank_id: '' });
                                }
                            } else {
                                setFormData((prev: any) => ({
                                    ...prev,
                                    bank_id: ''
                                }));
                                if (required) {
                                    setErrorMessages({ ...errorMessages, bank_id: 'This field is required.' });
                                }
                            }
                        }}

                        required={true}
                        errorMessage={errorMessages.bank_id}
                    />
                </div>
                <Button
                    type={ButtonType.button}
                    text={getIcon(IconType.add)}
                    variant={ButtonVariant.primary}
                    onClick={() => setBankFormModal(true)}
                    size={ButtonSize.small}
                />
            </div>

            <div className="w-full">
                <Dropdown
                    label='Currency'
                    name='currency_id'
                    value={formData.currency_id}
                    options={currencyOptions}
                    onChange={(e: any, required: any) => {
                        if (e && typeof e !== 'undefined') {
                            setFormData((prev: any) => ({
                                ...prev,
                                currency_id: e.value || 0,
                                currency_name: e.label || 0
                            }));
                            if (required) {
                                setErrorMessages({ ...errorMessages, currency_id: '' });
                            }
                        } else {
                            setFormData((prev: any) => ({
                                ...prev,
                                currency_id: ''
                            }));
                            if (required) {
                                setErrorMessages({ ...errorMessages, currency_id: 'This field is required.' });
                            }
                        }
                    }}
                    required={true}
                    errorMessage={errorMessages.currency_id}
                />

            </div>

            <div className="w-full">
                <Input
                    label='Account Title'
                    type="text"
                    name="account_name"
                    placeholder='Enter Account Title'
                    value={formData.account_name}
                    onChange={handleChange}
                    isMasked={false}
                    required={true}
                    errorMessage={errorMessages.account_name}
                />
            </div>

            <div className="w-full">
                <Input
                    label='Account No'
                    type="text"
                    name="account_number"
                    placeholder='Enter Account Number'
                    value={formData.account_number}
                    onChange={handleChange}
                    isMasked={false}
                    required={true}
                    errorMessage={errorMessages.account_number}

                />
            </div>

            <div className="w-full">
                <Input
                    label='IBAN'
                    type="text"
                    name="iban"
                    placeholder='Enter IBAN Number'
                    value={formData.iban}
                    onChange={handleChange}
                    isMasked={false}
                    required={true}
                    errorMessage={errorMessages.iban}
                />
            </div>

            <div className="w-full">
                <Input
                    label='Swift Code'
                    type="text"
                    name="swift_code"
                    placeholder='Enter Swift Code'
                    value={formData.swift_code}
                    onChange={handleChange}
                    isMasked={false}
                    required={false}
                />
            </div>

            <BankFormModal
                modalOpen={bankFormModal}
                setModalOpen={setBankFormModal}
                handleSubmit={(value: any) => handleBankSubmit(value)}
            />
        </Modal>

    );
};

export default BankDetailModal;
