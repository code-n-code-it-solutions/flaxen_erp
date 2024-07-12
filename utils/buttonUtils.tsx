// utils/buttonUtils.ts
import React from 'react';
import CustomButton from '@/components/apps/CustomButton';
import { ActionList } from '@/utils/enums';
import { DownloadCloud, ArchiveIcon, UploadCloud, CopyIcon, TrashIcon, PrinterIcon, LucidePrinter } from 'lucide-react';
import { checkPermission } from '@/utils/helper';

const buttonConfig = [
    {
        key: 'print',
        permission: ActionList.PRINT,
        text: 'Print',
        icon: <PrinterIcon size={18} />
    },
    {
        key: 'printLabel',
        permission: ActionList.PRINT_LABEL,
        text: 'Print Labels',
        icon: <LucidePrinter size={18} />
    },
    {
        key: 'export',
        permission: ActionList.PRINT,
        text: 'Export',
        icon: <DownloadCloud size={18} />
    },
    {
        key: 'archive',
        permission: ActionList.ARCHIVE,
        text: 'Archive',
        icon: <ArchiveIcon size={18} />
    },
    {
        key: 'unarchive',
        permission: ActionList.UNARCHIVE,
        text: 'Un Archive',
        icon: <UploadCloud size={18} />
    },
    {
        key: 'duplicate',
        permission: ActionList.DUPLICATE,
        text: 'Duplicate',
        icon: <CopyIcon size={18} />
    },
    {
        key: 'delete',
        permission: ActionList.DELETE,
        text: 'Delete',
        icon: <TrashIcon size={18} />
    }
];

export const findActiveMenu = (menus: any[], pathname: string): any => {
    if (menus && menus.length > 0) {
        for (const menu of menus) {
            if (menu.route === pathname) {
                return menu;
            }
            if (menu.children) {
                const found = findActiveMenu(menu.children, pathname);
                if (found) {
                    return found;
                }
            }
        }
    }
    return null;
};

export const generateActionButtons = (pathname: string, menus: any[], actions: any, appBasePath:string) => {
    const activeMenu = findActiveMenu(menus, pathname);

    // Ensure buttonConfig and checkPermission are defined and available in the scope
    if (!activeMenu || !buttonConfig || !checkPermission) {
        return [];
    }

    return buttonConfig
        .filter(button => checkPermission(menus, pathname, button.permission, appBasePath))
        .map((button, index) => ({
            permission: button.permission,
            onClick: actions ? actions[button.key] : () => {
            },
            content: (
                <CustomButton
                    key={index}
                    isListButton
                    text={button.text}
                    icon={button.icon}
                    // onClick={button.onClick === handleDelete ? () => handleDelete() : button.onClick}
                    onClick={() => actions ? actions[button.key] : {}}
                />
            )
        }));
};

export const generateOtherButtons = (pathname: string, menus: any[], selectedRowsLength: number = 0, appBasePath:string) => {
    const activeMenu = findActiveMenu(menus, pathname);

    if (!activeMenu || !checkPermission) {
        return [
            <CustomButton
                key={0}
                isDisabled={true}
                isListButton={false}
                text={`Selected ${selectedRowsLength}`}
            />
        ];
    }

    return [
        {
            permission: '',
            content: (
                <CustomButton
                    key={0}
                    isDisabled={true}
                    isListButton={false}
                    text={`Selected ${selectedRowsLength}`}
                />
            )
        },
        checkPermission(menus, pathname, ActionList.PRINT_LABEL, appBasePath) && ({
            permission: ActionList.PRINT_LABEL,
            content: (
                <CustomButton
                    key={1}
                    isListButton={false}
                    text="Print Labels"
                    icon={<PrinterIcon size={18} />}
                    onClick={() => console.log('Print labels')}
                />
            )
        })
    ].filter(Boolean);
};
