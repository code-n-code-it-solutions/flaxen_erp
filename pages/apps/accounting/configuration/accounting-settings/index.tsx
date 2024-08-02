import React, { Fragment, useEffect, useState } from 'react';
import AppLayout from '@/components/Layouts/AppLayout';
import PageWrapper from '@/components/PageWrapper';
import { useAppDispatch, useAppSelector } from '@/store';
import useTransformToSelectOptions from '@/hooks/useTransformToSelectOptions';
import {
    clearAccountingConfigurations,
    getAccountConfigurations,
    getAccountsTypes,
    storeAccountConfigurations
} from '@/store/slices/accountSlice';
import { setAuthToken } from '@/configs/api.config';
import Button from '@/components/Button';
import { ButtonSize, ButtonType, ButtonVariant } from '@/utils/enums';
import { Tab } from '@headlessui/react';
import SaleAccounting from '@/pages/apps/accounting/configuration/accounting-settings/SaleAccounting';
import { setPageTitle } from '@/store/slices/themeConfigSlice';
import PurchaseAccounting from '@/pages/apps/accounting/configuration/accounting-settings/PurchaseAccounting';
import InventoryAccounting from '@/pages/apps/accounting/configuration/accounting-settings/InventoryAccounting';
import ManufacturingAccounting from '@/pages/apps/accounting/configuration/accounting-settings/ManufacturingAccounting';
import Swal from 'sweetalert2';

const Index = () => {
    const dispatch = useAppDispatch();
    const {
        accountTypes,
        loading,
        configurationUpdated,
        accountingConfigurations
    } = useAppSelector(state => state.account);
    const accountOptions = useTransformToSelectOptions(accountTypes);
    const { token, user } = useAppSelector(state => state.user);
    const [formData, setFormData] = useState<any[]>([]);
    const [existingConfiguration, setExistingConfiguration] = useState<any[]>([]);

    const updateAccountingConfiguration = () => {
        let allFieldSelect = true;

        if (formData.length > 0) {
            allFieldSelect = !formData.some((data) => {
                return Object.keys(data).length !== 5;
            });
        }

        if (allFieldSelect) {
            dispatch(storeAccountConfigurations(formData));
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please select all fields'
            });
        }
    };

    useEffect(() => {
        setAuthToken(token);
        dispatch(setPageTitle('Accounting Settings'));
        dispatch(getAccountsTypes({}));
        dispatch(clearAccountingConfigurations());
        dispatch(getAccountConfigurations());
    }, []);

    useEffect(() => {
        if (accountingConfigurations.length > 0) {
            setFormData(accountingConfigurations.map((data) => {
                return {
                    name: data.name,
                    accounting_category: data.accounting_category,
                    increase: data.increase,
                    decrease: data.decrease,
                    account_id: data.account?.code
                };
            }));
        }
    }, [accountingConfigurations]);

    useEffect(() => {
        if (configurationUpdated) {
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Accounting configuration updated successfully'
            }).then(() => {
                dispatch(clearAccountingConfigurations());
                dispatch(getAccountConfigurations());
            });
        }
    }, [configurationUpdated]);

    // useEffect(() => {
    //     console.log(formData);
    // }, [formData]);

    return (
        <PageWrapper>
            <div className="flex flex-col md:flex-row md:justify-between md:items-center border-b mb-5 pb-3">
                <h1 className="text-lg">Accounting Settings</h1>
                <Button
                    type={ButtonType.button}
                    text="Update Configuration"
                    variant={ButtonVariant.primary}
                    size={ButtonSize.small}
                    onClick={() => updateAccountingConfiguration()}
                />
            </div>

            <Tab.Group>
                <Tab.List className="mt-3 flex flex-wrap border-b border-white-light dark:border-[#191e3a]">
                    <Tab as={Fragment}>
                        {({ selected }) => (
                            <button
                                className={`${
                                    selected ? '!border-white-light !border-b-white  text-primary !outline-none dark:!border-[#191e3a] dark:!border-b-black ' : ''
                                } -mb-[1px] block border border-transparent p-3.5 py-2 hover:text-primary dark:hover:border-b-black`}
                            >
                                Sales
                            </button>
                        )}
                    </Tab>
                    <Tab as={Fragment}>
                        {({ selected }) => (
                            <button
                                className={`${
                                    selected ? '!border-white-light !border-b-white  text-primary !outline-none dark:!border-[#191e3a] dark:!border-b-black ' : ''
                                } -mb-[1px] block border border-transparent p-3.5 py-2 hover:text-primary dark:hover:border-b-black`}
                            >
                                Purchases
                            </button>
                        )}
                    </Tab>
                    <Tab as={Fragment}>
                        {({ selected }) => (
                            <button
                                className={`${
                                    selected ? '!border-white-light !border-b-white  text-primary !outline-none dark:!border-[#191e3a] dark:!border-b-black ' : ''
                                } -mb-[1px] block border border-transparent p-3.5 py-2 hover:text-primary dark:hover:border-b-black`}
                            >
                                Inventory
                            </button>
                        )}
                    </Tab>
                    <Tab as={Fragment}>
                        {({ selected }) => (
                            <button
                                className={`${
                                    selected ? '!border-white-light !border-b-white  text-primary !outline-none dark:!border-[#191e3a] dark:!border-b-black ' : ''
                                } -mb-[1px] block border border-transparent p-3.5 py-2 hover:text-primary dark:hover:border-b-black`}
                            >
                                Manufacturing
                            </button>
                        )}
                    </Tab>
                    <Tab as={Fragment}>
                        {({ selected }) => (
                            <button
                                className={`${
                                    selected ? '!border-white-light !border-b-white  text-primary !outline-none dark:!border-[#191e3a] dark:!border-b-black ' : ''
                                } -mb-[1px] block border border-transparent p-3.5 py-2 hover:text-primary dark:hover:border-b-black`}
                            >
                                Assets
                            </button>
                        )}
                    </Tab>
                    <Tab as={Fragment}>
                        {({ selected }) => (
                            <button
                                className={`${
                                    selected ? '!border-white-light !border-b-white  text-primary !outline-none dark:!border-[#191e3a] dark:!border-b-black ' : ''
                                } -mb-[1px] block border border-transparent p-3.5 py-2 hover:text-primary dark:hover:border-b-black`}
                            >
                                Expenses
                            </button>
                        )}
                    </Tab>
                    <Tab as={Fragment}>
                        {({ selected }) => (
                            <button
                                className={`${
                                    selected ? '!border-white-light !border-b-white  text-primary !outline-none dark:!border-[#191e3a] dark:!border-b-black ' : ''
                                } -mb-[1px] block border border-transparent p-3.5 py-2 hover:text-primary dark:hover:border-b-black`}
                            >
                                Employees
                            </button>
                        )}
                    </Tab>
                </Tab.List>
                <Tab.Panels className="panel rounded-none shadow-none">
                    <Tab.Panel>
                        <div className="active">
                            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-3">
                                <p>Manage your sales accounting settings</p>
                            </div>
                            <SaleAccounting
                                formData={formData}
                                setFormData={setFormData}
                                accountOptions={accountOptions}
                            />
                        </div>
                    </Tab.Panel>
                    <Tab.Panel>
                        <div>
                            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-3">
                                <p>Manage your purchases accounting settings</p>
                            </div>
                            <PurchaseAccounting
                                formData={formData}
                                setFormData={setFormData}
                                accountOptions={accountOptions}
                            />
                        </div>
                    </Tab.Panel>
                    <Tab.Panel>
                        <div>
                            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-3">
                                <p>Manage your inventory accounting settings</p>
                            </div>
                            <InventoryAccounting
                                formData={formData}
                                setFormData={setFormData}
                                accountOptions={accountOptions}
                            />
                        </div>
                    </Tab.Panel>
                    <Tab.Panel>
                        <div>
                            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-3">
                                <p>Manage your manufacturing accounting settings</p>
                            </div>
                            <ManufacturingAccounting
                                accountOptions={accountOptions}
                                formData={formData}
                                setFormData={setFormData}
                            />
                        </div>
                    </Tab.Panel>
                </Tab.Panels>
            </Tab.Group>
        </PageWrapper>
    );
};

Index.getLayout = (page: any) => <AppLayout>{page}</AppLayout>;
export default Index;
