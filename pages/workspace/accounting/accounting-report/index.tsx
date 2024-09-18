import React, { useEffect, useState } from 'react';
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
import WorkspaceLayout from '@/components/Layouts/WorkspaceLayout';

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
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { token, user, loading } = useAppSelector((state) => state.user);
    const accounts = useAppSelector((state) => state.account).accounts;
    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
    const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
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
        <PageWrapper>
            <div className="w-full">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 border-b pb-3 mb-5">
                    <h3 className="text-lg">Head Office Accounting</h3>
                    <div className="flex flex-col md:flex-row md:justify-center md:items-center gap-3">
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
    );
};

Index.getLayout = (page: any) => <WorkspaceLayout>{page}</WorkspaceLayout>;
export default Index;
