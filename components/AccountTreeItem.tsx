import React from 'react';
import IconCaretDown from "@/components/Icon/IconCaretDown";
import AnimateHeight from "react-animate-height";
import IconButton from "@/components/IconButton";
import {ButtonVariant, IconType} from "@/utils/enums";

interface IProps {
    account: any;
    treeview: string[];
    setTreeview: (value: string[]) => void;
    toggleTreeview: (name: any) => void;
    level?: number;  // Add level to track depth in the tree
    setAccountModalOpen: (value: boolean) => void;
    setAccountDetail: (value: any) => void;
}

const AccountTreeItem = ({
                             account,
                             treeview,
                             setTreeview,
                             toggleTreeview,
                             level = 1,
                             setAccountModalOpen,
                             setAccountDetail
                         }: IProps) => {
    const hasChildren = level <= 1 && account.children_recursive && account.children_recursive.length > 0;

    const handleToggle = () => {
        if (hasChildren) {
            toggleTreeview(account.name);
        }
    };

    return (
        <li className="py-[5px] border-b">
            <div
                className={`flex justify-between items-center w-full cursor-pointer ${level <= 1 && account.children_recursive && account.children_recursive.length > 0 ? 'border-b' : ''}`}>
                <div className="flex items-center gap-3">
                    {hasChildren ? (
                        <button
                            type="button"
                            className={`flex items-center ${treeview.includes(account.name) ? 'active' : ''}`}
                            onClick={handleToggle}
                        >
                            <IconCaretDown
                                className={`w-5 h-5 text-primary ${treeview.includes(account.name) ? 'rotate-180' : ''}`}
                            />
                        </button>
                    ) : (
                        <span className="w-5 h-5"/>  // This is a spacer to align items without children
                    )}
                    <span className="cursor-pointer">{account.account_code + ' - ' + account.name}</span>
                </div>
                <div className="flex gap-3 items-center">
                    <span>AED {parseFloat(account.current_balance).toFixed(2)}/-</span>

                    <div className="flex gap-1 items-center">
                        {level <= 1 && (
                            <IconButton
                                icon={IconType.add}
                                color={ButtonVariant.success}
                                onClick={() => {
                                    setAccountModalOpen(true);
                                    setAccountDetail({
                                        parent_id: account.id,
                                        account_type: account.account_type
                                    });
                                }}
                            />)}
                        <IconButton
                            icon={IconType.edit}
                            color={ButtonVariant.primary}
                            onClick={() => {
                                setAccountModalOpen(true);
                                setAccountDetail(account);
                            }}
                        />
                    </div>

                </div>

            </div>
            {hasChildren && (
                <AnimateHeight duration={300} height={treeview.includes(account.name) ? 'auto' : 0}>
                    <ul className="ltr:pl-14 rtl:pr-14">
                        {level <= 1 && account.children_recursive.map((child: any, index: number) => (
                            <AccountTreeItem
                                key={index}
                                account={child}
                                treeview={treeview}
                                setTreeview={setTreeview}
                                toggleTreeview={toggleTreeview}
                                level={level + 1}
                                setAccountModalOpen={setAccountModalOpen}
                                setAccountDetail={setAccountDetail}
                            />
                        ))}
                    </ul>
                </AnimateHeight>
            )}
        </li>
    );
};

export default AccountTreeItem;
