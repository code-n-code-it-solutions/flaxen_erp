import React, { useCallback } from 'react';
import Dropdown from '@/components/Dropdown';
import {
    CogIcon,
    DownloadCloud,
    KanbanIcon,
    ListIcon,
    MoreHorizontalIcon,
    SearchIcon,
    UploadCloud
} from 'lucide-react';
import Link from 'next/link';
import OnRowSelectDropdown from '@/components/apps/OnRowSelectDropdown';
import { generateActionButtons, generateOtherButtons } from '@/utils/buttonUtils';
import { useRouter } from 'next/router';
import { useAppSelector } from '@/store';

interface IProps {
    appBasePath: string;
    selectedRows?: number;
    gridRef?: any;
    showSearch?: boolean;
    leftComponent?: {
        addButton: {
            show?: boolean;
            type?: string;
            onClick?: () => void;
            link?: string;
            text?: string;
        }
        title: string;
        showSetting?: boolean;
    };
    rightComponent?: boolean;
    buttonActions?: {
        export?: () => void;
        delete?: () => void;
        archive?: () => void;
        unarchive?: () => void;
        duplicate?: () => void;
        print?: () => void;
        printLabel?: () => void;
    };
}

const SettingComponent = ({
                              importRecord,
                              exportAsCSV
                          }: {
    importRecord?: () => void,
    exportAsCSV: () => void
}) => (
    <div className="dropdown flex shrink-0">
        <Dropdown
            placement={`bottom-end`}
            btnClassName="relative group block"
            button={<CogIcon size={18} />}
        >
            <ul className="w-[230px] border !py-0 font-semibold text-dark dark:text-white-dark dark:text-white-light/90">
                <li>
                    <Link href="#" className="flex gap-2 items-center dark:hover:text-white">
                        <UploadCloud />
                        Import records
                    </Link>
                </li>
                <li>
                    <span onClick={() => exportAsCSV()} className="flex gap-2 items-center dark:hover:text-white">
                        <DownloadCloud />
                        Export All
                    </span>
                </li>
            </ul>
        </Dropdown>
    </div>
);

const PageHeader = ({ appBasePath, selectedRows, gridRef, leftComponent, rightComponent, showSearch, buttonActions }: IProps) => {
    // console.log(selectedRows);
    const router = useRouter();
    const { permittedMenus } = useAppSelector((state) => state.menu);
    const { user } = useAppSelector((state) => state.user);
    const rightButtons = [
        {
            show: true,
            icon: <KanbanIcon size={18} />,
            onClick: () => console.log('Upload')
        },
        {
            show: true,
            icon: <ListIcon size={18} />,
            onClick: () => console.log('Download')
        }
    ];

    const onQuickFilterChanged = useCallback(() => {
        gridRef.current!.api.setGridOption(
            'quickFilterText',
            (document.getElementById('quickFilter') as HTMLInputElement).value
        );
    }, []);

    const exportAsCSV = useCallback(() => {
        gridRef.current!.api.exportDataAsCsv();
    }, []);

    const actionButtons: any = generateActionButtons(router.pathname, permittedMenus, buttonActions, appBasePath);
    const otherButtons = generateOtherButtons(router.pathname, permittedMenus, selectedRows, appBasePath);

    // console.log(otherButtons);
    return (
        <div>
            {/*<div className="flex md:justify-end md:items-center" style={{ marginTop: -22 }}>*/}
            {/*    <div className="badge bg-success text-white text-xs font-semibold px-2 py-1 rounded-full">*/}
            {/*        {user.registered_company ? user.registered_company.name : 'All Companies'} - {user.registered_branch ? user.registered_branch.name : 'All Branches'}*/}
            {/*    </div>*/}
            {/*</div>*/}
            <div
                className="shadow bg-white px-5 py-5 flex flex-col md:flex-row justify-between gap-3 md:items-center panel rounded">
                {leftComponent && (
                    <div className="flex items-center justify-start gap-2 w-full">
                        {leftComponent.addButton?.show && (
                            leftComponent.addButton?.link ? (
                                <Link href={leftComponent.addButton?.link} className="btn btn-primary btn-sm">
                                    {leftComponent.addButton?.text}
                                </Link>
                            ) : (
                                <button onClick={leftComponent.addButton?.onClick}
                                        className="btn btn-primary btn-sm">{leftComponent.addButton?.text}</button>
                            )
                        )}
                        <h2 className="text-lg font-semibold">{leftComponent.title}</h2>
                        {leftComponent.showSetting && (<SettingComponent exportAsCSV={exportAsCSV} />)}

                    </div>
                )}


                <div className="flex items-center md:justify-center gap-2 w-full">
                    {selectedRows && selectedRows > 0
                        ? <OnRowSelectDropdown
                            dropdownButton={{
                                text: 'Actions',
                                icon: <CogIcon size={18} />,
                                variant: 'primary'
                            }}
                            otherButtons={otherButtons}
                            dropdownItems={actionButtons}
                        /> : (
                            showSearch && (
                                <div className="flex relative items-stretch flex-wrap w-full">
                                    <div className="ltr:-mr-px rtl:-ml-px flex">
                                        <span
                                            className="border-s border-b border-t dark:border-dark ltr:rounded-l rtl:rounded-r flex items-center justify-center text-black px-4 py-1.5 dark:text-white-dark">
                                            <SearchIcon size={18} color="gray" />
                                        </span>
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Search"
                                        id="quickFilter"
                                        onInput={onQuickFilterChanged}
                                        className="flex-1 form-input ltr:rounded-l-none rtl:rounded-r-none w-full"
                                    />
                                </div>
                            )
                        )}
                </div>
                {rightComponent && (

                    <div className="flex items-center md:justify-end gap-2 w-full">
                        <div className="relative inline-flex align-middle">
                            {rightButtons.map((item, index) => (
                                item.show && (
                                    <button type="button" key={index} className={
                                        `btn btn-primary btn-sm
                                    ${index == 0 && index < rightButtons.length - 1
                                            ? 'ltr:rounded-r-none rtl:rounded-l-none'
                                            : index === rightButtons.length - 1
                                                ? 'ltr:rounded-l-none rtl:rounded-r-none'
                                                : 'rounded-none'
                                        } `
                                    }>
                                        {item.icon}
                                    </button>
                                )))}
                        </div>
                    </div>)
                }

            </div>
        </div>
    );
};

export default PageHeader;
