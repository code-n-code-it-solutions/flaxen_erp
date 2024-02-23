import React, {Fragment, useEffect, useState} from 'react';
import {Dialog, Transition} from "@headlessui/react";
import {setAuthToken} from "@/configs/api.config";
import {useDispatch, useSelector} from "react-redux";
import {ThunkDispatch} from "redux-thunk";
import {IRootState} from "@/store";
import {AnyAction} from "redux";
import Select from "react-select";
import BankFormModal from "@/components/BankFormModal";
import {getBanks, storeBank} from "@/store/slices/bankSlice";
import {getCurrencies} from "@/store/slices/currencySlice";

interface IProps {
    modalOpen: boolean;
    setModalOpen: (value: boolean) => void;
    handleAddition: (value: any) => void;
    modalFormData?: any;
    title: string;
}

const BankDetailModal = ({modalOpen, setModalOpen, handleAddition, modalFormData, title}: IProps) => {
    const dispatch = useDispatch<ThunkDispatch<IRootState, any, AnyAction>>();
    const {token} = useSelector((state: IRootState) => state.user);
    const {banks, bank, success} = useSelector((state: IRootState) => state.bank);
    const {currencies} = useSelector((state: IRootState) => state.currency);

    const [bankFormModal, setBankFormModal] = useState<boolean>(false);
    const [formData, setFormData] = useState<any>({
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

    return (
        <Transition appear show={modalOpen} as={Fragment}>
            <Dialog as="div" open={modalOpen} onClose={() => setModalOpen(false)}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0"/>
                </Transition.Child>
                <div className="fixed inset-0 z-[999] overflow-y-auto bg-[black]/60">
                    <div className="flex min-h-screen items-start justify-center px-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel as="div"
                                          className="panel my-8 w-full max-w-lg overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">
                                <div
                                    className="flex items-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]">
                                    <div className="text-lg font-bold">{modalFormData ? 'Edit' : 'Add'} {title} Bank Detail</div>
                                    <button type="button" className="text-white-dark hover:text-dark"
                                            onClick={() => setModalOpen(false)}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="20"
                                            height="20"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <line x1="18" y1="6" x2="6" y2="18"></line>
                                            <line x1="6" y1="6" x2="18" y2="18"></line>
                                        </svg>
                                    </button>
                                </div>
                                <div className="p-5 space-y-5">
                                    <div className="w-full flex justify-center items-center gap-3">
                                        <div className="w-full">
                                            <label htmlFor="bank_id">Bank</label>
                                            <Select
                                                defaultValue={bankOptions[0]}
                                                options={bankOptions}
                                                isSearchable={true}
                                                isClearable={true}
                                                placeholder={'Select Bank'}
                                                onChange={(e: any) => setFormData((prev: any) => ({
                                                    ...prev,
                                                    bank_id: e && typeof e!=='undefined' ? e.value : 0,
                                                    bank_name: e && typeof e!=='undefined' ? e.label: ''
                                                }))}
                                            />
                                        </div>

                                        <button className="btn btn-primary btn-sm flex justify-center items-center"
                                                onClick={() => setBankFormModal(true)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                 viewBox="0 0 24 24"
                                                 className="h-5 w-5 ltr:mr-2 rtl:ml-2"
                                                 fill="none">
                                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
                                                <path d="M15 12L12 12M12 12L9 12M12 12L12 9M12 12L12 15"
                                                      stroke="currentColor"
                                                      strokeWidth="1.5" strokeLinecap="round"/>
                                            </svg>
                                        </button>
                                    </div>

                                    <div className="w-full">
                                        <label htmlFor="currency_id">Currency</label>
                                        <Select
                                            defaultValue={currencyOptions[0]}
                                            options={currencyOptions}
                                            isSearchable={true}
                                            isClearable={true}
                                            placeholder={'Select Currency'}
                                            onChange={(e: any) => setFormData((prev: any) => ({
                                                ...prev,
                                                currency_id: e && typeof e!=='undefined' ? e.value : 0,
                                                currency_name: e && typeof e!=='undefined' ? e.name : '',
                                                currency_code: e && typeof e!=='undefined' ? e.label : ''
                                            }))}
                                        />
                                    </div>

                                    <div className="w-full">
                                        <label htmlFor="account_name">Account Title</label>
                                        <input
                                            type="text"
                                            name="account_name"
                                            id="account_name"
                                            className="form-input"
                                            placeholder='Enter Account Title'
                                            value={formData.account_name}
                                            onChange={e => setFormData((prev: any) => ({
                                                ...prev,
                                                account_name: e.target.value
                                            }))}
                                        />
                                    </div>

                                    <div className="w-full">
                                        <label htmlFor="account_number">Account No</label>
                                        <input
                                            type="text"
                                            name="account_number"
                                            id="account_number"
                                            className="form-input"
                                            placeholder='Enter Account Number'
                                            value={formData.account_number}
                                            onChange={e => setFormData((prev: any) => ({
                                                ...prev,
                                                account_number: e.target.value
                                            }))}
                                        />
                                    </div>

                                    <div className="w-full">
                                        <label htmlFor="iban">IBAN</label>
                                        <input
                                            type="text"
                                            name="iban"
                                            id="iban"
                                            className="form-input"
                                            placeholder='Enter IBAN Number'
                                            value={formData.iban}
                                            onChange={e => setFormData((prev: any) => ({
                                                ...prev,
                                                iban: e.target.value
                                            }))}
                                        />
                                    </div>

                                    <div className="mt-8 flex items-center justify-end">
                                        <button type="button" className="btn btn-outline-danger"
                                                onClick={() => setModalOpen(false)}>
                                            Discard
                                        </button>
                                        <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4"
                                                onClick={() => handleAddition(formData)}>
                                            {modalFormData ? 'Update' : 'Add'}
                                        </button>
                                    </div>
                                </div>
                                <BankFormModal
                                    bankFormModal={bankFormModal}
                                    setBankFormModal={setBankFormModal}
                                    handleBankFormSubmit={(value:any) => handleBankSubmit(value)}
                                />
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default BankDetailModal;
