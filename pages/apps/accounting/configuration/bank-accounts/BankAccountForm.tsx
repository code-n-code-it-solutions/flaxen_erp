import React, { Fragment, useEffect, useState } from 'react';
import { Input } from '@/components/form/Input';
import { useAppDispatch, useAppSelector } from '@/store';
import { setAuthToken, setContentType } from '@/configs/api.config';
import { Dropdown } from '@/components/form/Dropdown';
import Button from '@/components/Button';
import { ButtonSize, ButtonType, ButtonVariant, IconType } from '@/utils/enums';
import { clearBankState, getBanks, storeBank } from '@/store/slices/bankSlice';
import Swal from 'sweetalert2';
import { getCurrencies } from '@/store/slices/currencySlice';
import { getIcon } from '@/utils/helper';
import BankFormModal from '@/components/modals/BankFormModal';
import { storeBankAccount } from '@/store/slices/bankAccountSlice';

const BankAccountForm = () => {
    const dispatch = useAppDispatch();
    const { token } = useAppSelector((state) => state.user);
    const { loading } = useAppSelector((state) => state.bankAccount);
    const { currencies } = useAppSelector((state) => state.currency);
    const { banks, bank, success } = useAppSelector((state) => state.bank);

    const [formData, setFormData] = useState<any>({});
    const [errors, setErrors] = useState<any>({});
    const [bankFormModal, setBankFormModal] = useState<boolean>(false);
    const [bankOptions, setBankOptions] = useState<any[]>([]);
    const [currencyOptions, setCurrencyOptions] = useState<any[]>([]);

    const handleChange = (name: string, value: any, required: boolean) => {
        if (required && value === '') {
            setErrors({ ...errors, [name]: 'This field is required' });
        } else {
            setErrors((err: any) => {
                delete err[name];
                return err;
            });
        }
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();
        setAuthToken(token);

        dispatch(storeBankAccount({
            ...formData,
            account_of: 3
        }));
    };

    useEffect(() => {
        setAuthToken(token);
        setContentType('application/json');
        dispatch(clearBankState());
        dispatch(getCurrencies());
        dispatch(getBanks());
    }, [dispatch, token]);

    useEffect(() => {
        if (bank && success) {
            dispatch(getBanks());
            setBankFormModal(false);
        }
    }, [bank, success]);

    useEffect(() => {
        if (banks) {
            setBankOptions(banks.map((bank: any) => ({
                value: bank.id,
                label: bank.name
            })));
        }
    }, [banks]);

    useEffect(() => {
        if (currencies) {
            setCurrencyOptions(currencies.map((currency: any) => {
                return { value: currency.id, label: currency.code, name: currency.name };
            }));
        }
    }, [currencies]);

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
            is_active: value.is_active
        };
        dispatch(storeBank(bankFormData));
    };

    return (
        <form onSubmit={(e) => handleSubmit(e)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 my-3">

                <div className={`flex ${errors.bank_id ? 'items-center' : 'items-end'} gap-1`}>
                    <Dropdown
                        divClasses="w-full"
                        label="Bank"
                        name="bank_id"
                        options={bankOptions}
                        value={formData.bank_id}
                        onChange={(e) => handleChange('bank_id', e?.value || '', true)}
                        errorMessage={errors.bank_id}
                    />
                    <Button
                        type={ButtonType.button}
                        text={getIcon(IconType.add)}
                        variant={ButtonVariant.primary}
                        onClick={() => setBankFormModal(true)}
                    />
                </div>

                <Dropdown
                    divClasses="w-full"
                    label="Currency"
                    name="currency_id"
                    options={currencyOptions}
                    value={formData.currency_id}
                    onChange={(e) => handleChange('currency_id', e?.value || '', true)}
                    errorMessage={errors.currency_id}
                />

                <Input
                    divClasses="w-full"
                    label="Bank Account Name"
                    type="text"
                    name="account_name"
                    value={formData.account_name}
                    onChange={(e) => handleChange(e.target.name, e.target.value, e.target.required)}
                    isMasked={false}
                    required={true}
                    errorMessage={errors.account_name}
                />
                <Input
                    divClasses="w-full"
                    label="Bank Account Number"
                    type="text"
                    name="account_number"
                    value={formData.account_number}
                    onChange={(e) => handleChange(e.target.name, e.target.value, e.target.required)}
                    isMasked={false}
                    required={true}
                    errorMessage={errors.account_number}
                />
                <Input
                    divClasses="w-full"
                    label="IBAN"
                    type="text"
                    name="iban"
                    value={formData.iban}
                    onChange={(e) => handleChange(e.target.name, e.target.value, e.target.required)}
                    isMasked={false}
                    required={true}
                    errorMessage={errors.iban}
                />
                <Input
                    divClasses="w-full"
                    label="Swift Code"
                    type="text"
                    name="swift_code"
                    value={formData.swift_code}
                    onChange={(e) => handleChange(e.target.name, e.target.value, e.target.required)}
                    isMasked={false}
                    required={true}
                    errorMessage={errors.swift_code}
                />

            </div>

            <div className="flex justify-center items-center mt-5">
                <Button
                    type={ButtonType.submit}
                    text={loading ? 'Loading...' : 'Save'}
                    disabled={loading}
                    variant={ButtonVariant.primary}
                />
            </div>

            <BankFormModal
                modalOpen={bankFormModal}
                setModalOpen={setBankFormModal}
                handleSubmit={(value: any) => handleBankSubmit(value)}
            />
        </form>
    );
};

export default BankAccountForm;
