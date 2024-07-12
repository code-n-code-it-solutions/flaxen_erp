import React from 'react';
import IconCaretDown from "@/components/Icon/IconCaretDown";
import AnimateHeight from "react-animate-height";
import IconButton from "@/components/IconButton";
import {ButtonVariant, IconType} from "@/utils/enums";

interface IProps {
    account: any;
    treeview: string[];
    setTreeview: (value: string[]) => void;
    toggleDoubleClick: (account: any) => void;
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
                             toggleDoubleClick,
                             level = 1,
                             setAccountModalOpen,
                             setAccountDetail
                         }: IProps) => {
    const hasChildren = account.children_recursive && account.children_recursive.length > 0;

    const handleToggle = () => {
        if (hasChildren) {
            toggleTreeview(account.name);
        }
    };

    return (
        hasChildren
            ? (
                <li className="py-[5px]">
                    <button
                        type="button"
                        className={`${treeview.includes(account.name) ? 'active' : ''}`}
                        onClick={handleToggle}
                        onDoubleClick={() => toggleDoubleClick(account)}
                    >
                        <div className="flex gap-3">
                            <IconCaretDown
                                className={`w-5 h-5 text-primary inline ${treeview.includes(account.name) ? 'rotate-180' : ''}`}
                            />
                            {account.account_code + '-' + account.name}
                        </div>
                    </button>
                    <AnimateHeight duration={300} height={treeview.includes(account.name) ? 'auto' : 0}>
                        {hasChildren && (
                            <ul className="ltr:pl-14 rtl:pr-14">
                                {account.children_recursive.map((child: any, index: number) => (
                                    <AccountTreeItem
                                        key={index}
                                        account={child}
                                        treeview={treeview}
                                        setTreeview={setTreeview}
                                        toggleDoubleClick={toggleDoubleClick}
                                        toggleTreeview={toggleTreeview}
                                        level={level + 1}
                                        setAccountModalOpen={setAccountModalOpen}
                                        setAccountDetail={setAccountDetail}
                                    />
                                ))}
                            </ul>
                        )}
                    </AnimateHeight>
                </li>
            ) : (
                <li
                    className="py-[5px] cursor-pointer"
                    // onDoubleClick={() => toggleDoubleClick(account)}
                >
                    <div className="md:w-1/2 w-full flex justify-between items-center">
                        <div className="flex gap-5 justify-start items-center">
                            <span>{account.account_code + ' - ' + account.name}</span>
                            {level <= 2 && (
                                <div className="flex gap-1 items-center">
                                    <IconButton
                                        icon={IconType.add}
                                        color={ButtonVariant.success}
                                        onClick={() => {
                                            setAccountModalOpen(true)
                                            setAccountDetail({
                                                parent_id: account.id,
                                                account_type: account.account_type
                                            })
                                        }}
                                    />
                                    <IconButton
                                        icon={IconType.edit}
                                        color={ButtonVariant.primary}
                                        onClick={() => {
                                            setAccountModalOpen(true)
                                            setAccountDetail(account)
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                        <span>AED 334,343/-</span>
                    </div>
                </li>
            )
    );
};

export default AccountTreeItem;
