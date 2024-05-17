import React, {useEffect, useState} from 'react';
import AnimateHeight from 'react-animate-height';
import PageWrapper from "@/components/PageWrapper";
import IconCaretDown from '@/components/Icon/IconCaretDown';
import {setPageTitle} from "@/store/slices/themeConfigSlice";
import {useAppDispatch, useAppSelector} from "@/store";
import {ButtonType, ButtonVariant, IconType} from "@/utils/enums";
import {setAuthToken} from "@/configs/api.config";
import {getAccounts} from "@/store/slices/accountSlice";
import AccountFormModel from "@/components/modals/AccountFormModel";
import AccountTreeItem from "@/components/AccountTreeItem";
import IconButton from "@/components/IconButton";

const Index = () => {
    const dispatch = useAppDispatch();
    const {token} = useAppSelector(state => state.user);
    const {accounts, loading} = useAppSelector(state => state.account);
    const [treeview, setTreeview] = useState<any[]>([]);
    const [accountModalOpen, setAccountModalOpen] = useState<boolean>(false);
    const [accountDetail, setAccountDetail] = useState<any>({});
    const [accountsList, setAccountsList] = useState<any[]>([]);

    useEffect(() => {
        dispatch(setPageTitle('All Accounts'));
        setAuthToken(token);
        dispatch(getAccounts());
    }, [dispatch, token]);

    useEffect(() => {
        if (accounts) {
            setAccountsList(accounts);
            setTreeview(accounts.map((account: any) => account.name));
        }
    }, [accounts]);

    function twoLevelAccounts(accounts: any) {
        return accounts.map((account: any) => ({
            ...account,
            children: account.children_recursive ? account.children_recursive.map((child: any) => ({
                ...child,
                children_recursive: [] // Remove deeper levels
            })) : []
        }));
    }

    const toggleTreeview = (name: any) => {
        setTreeview((prev: any) => prev.includes(name) ? prev.filter((item: any) => item !== name) : [...prev, name]);
    };

    const breadcrumbItems = [
        {
            title: 'Main Dashboard',
            href: '/erp/main',
        },
        {
            title: 'Finance Dashboard',
            href: '/erp/finance',
        },
        {
            title: 'All Accounts',
            href: '#',
        },
    ]

    const accountTypes = [
        {label: '100 - Asset', value: 1},
        {label: '200 - Liability', value: 2},
        {label: '300 - Equity', value: 3},
        {label: '400 - Revenue', value: 4},
        {label: '500 - Expense', value: 5},
        {label: '600 - Owner', value: 6},
    ]

    const calculateTotalBalance = (accounts: any[], accountType: number) => {
        let total = 0;

        const addBalances = (account: any) => {
            if (account.account_type === accountType) {
                total += account.current_balance || 0;
                if (account.children_recursive && account.children_recursive.length > 0) {
                    account.children_recursive.forEach((child: any) => addBalances(child));
                }
            }
        };

        accounts.forEach(account => addBalances(account));

        return total.toFixed(2);
    };

    useEffect(() => {
        dispatch(setPageTitle('All Accounts'));
        setAuthToken(token)
        dispatch(getAccounts())
        setAccountDetail({})
    }, [])

    useEffect(() => {
        if (accounts) {
            setAccountsList(accounts)
            setTreeview(accounts.map((account: any) => account.name))
        }
    }, [accounts]);


    return (
        <PageWrapper
            embedLoader={true}
            loading={loading}
            breadCrumbItems={breadcrumbItems}
            title="Accounts"
        >
            <div className="mb-5 md:px-24">
                <ul className="font-semibold">
                    {accountTypes.map((type, index) => (
                        <li key={index} className="py-[5px] border-b">
                            <button
                                type="button"
                                className={`${treeview.includes(type.label) ? 'active' : ''} w-full`}
                                onClick={() => toggleTreeview(type.label)}
                            >
                                <div className="flex justify-between w-full items-center gap-3">
                                    <div className="flex gap-3">
                                        <IconCaretDown
                                            className={`w-5 h-5 text-primary inline ${treeview.includes(type.label) ? 'rotate-180' : ''}`}/>
                                        <span>{type.label}</span>
                                    </div>
                                    <div className="flex gap-3 items-center">
                                        <span>AED {calculateTotalBalance(accountsList, type.value)}/-</span>
                                        <div className="flex gap-1 items-center">
                                            <IconButton
                                                icon={IconType.add}
                                                color={ButtonVariant.success}
                                                onClick={() => {
                                                    setAccountModalOpen(true)
                                                    setAccountDetail({
                                                        account_type: type.value
                                                    })
                                                }}
                                            />
                                        </div>
                                    </div>

                                </div>
                            </button>
                            <AnimateHeight duration={300} height={treeview.includes(type.label) ? 'auto' : 0}>
                                <ul className="ltr:pl-14 rtl:pr-14">
                                    {accountsList.filter(account => account.account_type === type.value).map((account, idx) => (
                                        <AccountTreeItem
                                            key={idx}
                                            account={account}
                                            treeview={treeview}
                                            setTreeview={setTreeview}
                                            toggleTreeview={toggleTreeview}
                                            setAccountModalOpen={setAccountModalOpen}
                                            setAccountDetail={setAccountDetail}
                                        />
                                    ))}
                                </ul>
                            </AnimateHeight>
                        </li>
                    ))}
                </ul>
            </div>

            <AccountFormModel
                modalOpen={accountModalOpen}
                setModalOpen={setAccountModalOpen}
                modalFormData={accountDetail}
                accounts={twoLevelAccounts(accountsList)}
                setModalFormData={setAccountDetail}
            />
        </PageWrapper>
    )
};

export default Index;
