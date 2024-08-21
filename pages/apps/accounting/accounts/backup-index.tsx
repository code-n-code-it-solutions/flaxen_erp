import React, { useEffect, useState } from 'react';
import AppLayout from '@/components/Layouts/AppLayout';
import PageHeader from '@/components/apps/PageHeader';
import { setPageTitle } from '@/store/slices/themeConfigSlice';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '@/store';
import { setAuthToken, setContentType } from '@/configs/api.config';
import useSetActiveMenu from '@/hooks/useSetActiveMenu';
import { AppBasePath, ButtonVariant } from '@/utils/enums';
import PageWrapper from '@/components/PageWrapper';
import { getAccounts } from '@/store/slices/accountSlice';
import Tree from 'rc-tree';
import IconButton from '@/components/IconButton';
import { EyeIcon } from 'lucide-react';

const BackupIndex = () => {
    useSetActiveMenu(AppBasePath.Report_Accounts);
    const router = useRouter();

    const dispatch = useAppDispatch();
    const { token, user, loading } = useAppSelector((state) => state.user);
    const accounts = useAppSelector((state) => state.account).accounts;
    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
    const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
    const [treeData, setTreeData] = useState<any[]>([]);

    const transformDataToTreeNodes = (data: any[]) => {
        return data.map((accountType: any) => ({
            title: accountType.name,
            key: `account-type-${accountType.id}`,
            children: accountType.accounts.map((account: any) => transformAccountToTreeNode(account))
        }));
    };

    const transformAccountToTreeNode = (account: any) => {
        return {
            title: (
                <CustomTreeNode
                    id={account.id}
                    title={account.code + ' - ' + account.name}
                    debit={account.totals.debit}
                    credit={account.totals.credit}
                />
            ),
            key: `account-${account.id}`,
            children: account.children_recursive ? account.children_recursive.map((child: any) => transformAccountToTreeNode(child)) : []
        };
    };

    const CustomTreeNode = ({ id, title, debit, credit }: any) => {
        return (
            <div
                className="flex justify-between items-center space-x-5"
                onDoubleClick={() => handleNodeDoubleClick(id)}
            >
                <div className="text-md">{title}</div>
                <div className="text-md font-bold text-success">
                    {debit.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    })}
                </div>
                <div className="text-md font-bold text-success">
                    {credit.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    })}
                </div>
            </div>
        );
    };

    const onExpand = (expandedKeys: any) => {
        setExpandedKeys(expandedKeys);
    };

    const onSelect = (selectedKeys: any) => {
        setSelectedKeys(selectedKeys);
    };

    const handleNodeDoubleClick = (id: number) => {
        console.log(id);
    };

    useEffect(() => {
        setAuthToken(token);
        dispatch(setPageTitle('Accounts Report'));
        setContentType('application/json');
        dispatch(getAccounts());
    }, []);

    useEffect(() => {
        if (accounts) {
            const treeNodes = transformDataToTreeNodes(accounts);
            setTreeData(treeNodes);
            const allKeys = getAllKeys(treeNodes);
            setExpandedKeys(allKeys);
        }
    }, [accounts]);

    const getAllKeys = (nodes: any[]): string[] => {
        let keys: string[] = [];
        nodes.forEach(node => {
            keys.push(node.key);
            if (node.children && node.children.length > 0) {
                keys = keys.concat(getAllKeys(node.children));
            }
        });
        return keys;
    };

    const handleExpandAll = () => {
        const allKeys = getAllKeys(treeData);
        setExpandedKeys(allKeys);
    };

    return (
        <div className="flex flex-col gap-3">
            <PageHeader
                appBasePath={AppBasePath.Report_Accounts}
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
                    <div className="flex justify-end gap-3">
                        <span
                            className="text-primary underline cursor-pointer"
                            onClick={() => handleExpandAll()}
                        >
                            Expand All
                        </span>
                        <span
                            className="text-primary underline cursor-pointer"
                            onClick={() => setExpandedKeys([])}
                        >
                            Collapse All
                        </span>
                        <span
                            className="text-primary underline cursor-pointer"
                            onClick={() => dispatch(getAccounts())}
                        >
                            Refresh
                        </span>
                    </div>
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
export default BackupIndex;
