import React, { useEffect, useState } from 'react';
import AppLayout from '@/components/Layouts/AppLayout';
import PageHeader from '@/components/apps/PageHeader';
import { setPageTitle } from '@/store/slices/themeConfigSlice';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '@/store';
import { setAuthToken, setContentType } from '@/configs/api.config';
import useSetActiveMenu from '@/hooks/useSetActiveMenu';
import { AppBasePath } from '@/utils/enums';
import PageWrapper from '@/components/PageWrapper';
import { getAccounts } from '@/store/slices/accountSlice';
import Tree from 'rc-tree';

const transformDataToTreeNodes = (data: any[]) => {
    return data.map((accountType: any) => ({
        title: accountType.name,
        key: `account-type-${accountType.id}`,
        children: accountType.accounts.map((account: any) => transformAccountToTreeNode(account))
    }));
};

const transformAccountToTreeNode = (account: any) => {
    return {
        title: <CustomTreeNode title={account.code + ' - ' + account.name} total={account.total} />,
        key: `account-${account.id}`,
        children: account.children_recursive ? account.children_recursive.map((child: any) => transformAccountToTreeNode(child)) : []
    };
};

const CustomTreeNode = ({ title, total }: any) => {
    console.log('title', title);
    return (
        <div className="grid grid-cols-2 gap-5">
            <div className="text-md">{title}</div>
            <div className="text-md font-bold">Total: {total}</div>
        </div>
    );
};

const Index = () => {
    // useSetActiveMenu(AppBasePath.Report_Accounts);
    const router = useRouter();

    const dispatch = useAppDispatch();
    const { token, user, loading } = useAppSelector((state) => state.user);
    const accounts = useAppSelector((state) => state.account).accounts;
    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const [expandedKeys, setExpandedKeys] = useState([]);
    const [selectedKeys, setSelectedKeys] = useState([]);
    const [treeData, setTreeData] = useState<any[]>([]);
    const onExpand = (expandedKeys: any) => {
        setExpandedKeys(expandedKeys);
    };

    const onSelect = (selectedKeys: any) => {
        setSelectedKeys(selectedKeys);
    };

    useEffect(() => {
        dispatch(setPageTitle('Accounts Report'));
        setAuthToken(token);
        setContentType('application/json');
        dispatch(getAccounts());
    }, []);

    useEffect(() => {
        if (accounts) {
            setTreeData(transformDataToTreeNodes(accounts));
        }
    }, [accounts]);

    return (
        <div className="flex flex-col gap-5">
            <PageHeader
                appBasePath={AppBasePath.Raw_Product}
                key={selectedRows.length}
                selectedRows={selectedRows.length}
                leftComponent={{
                    addButton: {
                        show: false
                    },
                    title: 'Accounts',
                    showSetting: false
                }}
                rightComponent={true}
                showSearch={false}
                buttonActions={{
                    delete: () => console.log('deleted'),
                    export: () => console.log('exported'),
                    print: () => console.log('print'),
                    archive: () => console.log('archived'),
                    unarchive: () => console.log('unarchived'),
                    duplicate: () => console.log('duplicated'),
                    printLabel: () => console.log('printLabel')
                }}
            />
            <PageWrapper>
                <div className="w-full">
                    <Tree
                        className="my-tree w-full"
                        expandedKeys={expandedKeys}
                        selectedKeys={selectedKeys}
                        onExpand={onExpand}
                        onSelect={onSelect}
                        defaultExpandAll={true}
                        treeData={treeData}
                    />
                </div>
            </PageWrapper>
        </div>
    );
};

Index.getLayout = (page: any) => <AppLayout>{page}</AppLayout>;
export default Index;
