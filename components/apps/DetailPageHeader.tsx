import React from 'react';
import { ActionList, ButtonSize, ButtonType, ButtonVariant } from '@/utils/enums';
import Button from '@/components/Button';
import { ArrowLeft, CopyIcon, Edit3Icon, FilesIcon, LucideMail, PrinterIcon, TrashIcon } from 'lucide-react';
import { useAppSelector } from '@/store';
import { checkPermission } from '@/utils/helper';
import { useRouter } from 'next/router';

interface IProps {
    appBasePath: string;
    title: string;
    middleComponent?: {
        show: boolean;
        edit?: { show: boolean, onClick?: () => void };
        print?: { show: boolean, onClick?: () => void };
        printLabel?: { show: boolean, onClick?: () => void };
        delete?: { show: boolean, onClick?: () => void };
        duplicate?: { show: boolean, onClick?: () => void };
        email?: { show: boolean, onClick?: () => void };
    };
    backButton?: {
        show: boolean;
        backLink?: string;
    };
}

const DetailPageHeader = ({ appBasePath,title, middleComponent, backButton }: IProps) => {
    const router = useRouter();
    const { permittedMenus, activeMenu } = useAppSelector(state => state.menu);
    const { user } = useAppSelector(state => state.user);

    const buttons = [
        {
            permission: ActionList.UPDATE,
            text: 'Edit',
            type: ButtonType.link,
            variant: ButtonVariant.info,
            icon: <Edit3Icon size={18} />,
            link: `${activeMenu?.route}/edit/` + router.query.id,
            show: middleComponent?.edit?.show
        },
        {
            permission: ActionList.PRINT_DETAIL,
            text: 'Print',
            type: ButtonType.button,
            variant: ButtonVariant.success,
            icon: <FilesIcon size={18} />,
            onClick: middleComponent?.print?.onClick || (() => {
            }),
            show: middleComponent?.print?.show
        },
        {
            permission: ActionList.PRINT_LABEL,
            text: 'Print Label',
            type: ButtonType.button,
            variant: ButtonVariant.success,
            icon: <PrinterIcon size={18} />,
            onClick: middleComponent?.printLabel?.onClick || (() => {
            }),
            show: middleComponent?.printLabel?.show
        },
        {
            permission: ActionList.DELETE,
            text: 'Delete',
            type: ButtonType.button,
            variant: ButtonVariant.danger,
            icon: <TrashIcon size={18} />,
            onClick: middleComponent?.delete?.onClick || (() => {
            }),
            show: middleComponent?.delete?.show
        },
        {
            permission: ActionList.COPY,
            text: 'duplicate',
            type: ButtonType.button,
            variant: ButtonVariant.danger,
            icon: <CopyIcon size={18} />,
            onClick: middleComponent?.duplicate?.onClick || (() => {
            }),
            show: middleComponent?.duplicate?.show
        },
        {
            permission: ActionList.EMAIL,
            text: 'Email it',
            type: ButtonType.button,
            variant: ButtonVariant.info,
            icon: <LucideMail size={18} />,
            onClick: middleComponent?.email?.onClick || (() => {
            }),
            show: middleComponent?.email?.show
        }
    ];

    return (
        <div>
            <div className="flex md:justify-end md:items-center" style={{ marginTop: -22 }}>
                <div className="badge bg-success text-white text-xs font-semibold px-2 py-1 rounded-full">
                    {user.registered_company ? user.registered_company.name : 'All Companies'} - {user.registered_branch ? user.registered_branch.name : 'All Branches'}
                </div>
            </div>
            <div
                className="shadow bg-white px-5 py-5 flex flex-col md:flex-row justify-between gap-3 md:items-center panel rounded">
                <div className="w-full flex flex-col md:flex-row md:justify-between md:items-center gap-1">
                    <h5 className="text-lg font-semibold dark:text-white-light">
                        {title}
                    </h5>

                    {middleComponent?.show && (
                        <div className={`flex flex-wrap md:flex-nowrap justify-end md:items-center gap-1`}>
                            {buttons.map((button, index) => (
                                button.show && checkPermission(permittedMenus, activeMenu?.route, button.permission, appBasePath) && (
                                    <Button
                                        key={index}
                                        tooltip={button.text}
                                        text={
                                            <span className="flex gap-1 justify-center items-center">
                                                {button.icon}
                                                {button.text}
                                            </span>
                                        }
                                        type={button.type}
                                        variant={button.variant}
                                        size={ButtonSize.small}
                                        link={button.link}
                                        onClick={button.onClick}
                                        classes="w-auto"
                                    />
                                )
                            ))}
                        </div>
                    )}
                </div>
                {backButton?.show && (
                    <div className="flex justify-end items-center w-full gap-1 md:mt-0 mt-3">
                        <Button
                            tooltip="Back"
                            text={
                                <span className="flex gap-1 justify-center items-center">
                                    <ArrowLeft size={18} />
                                    Back
                                </span>
                            }
                            type={ButtonType.link}
                            variant={ButtonVariant.primary}
                            size={ButtonSize.small}
                            link={backButton.backLink}
                            classes="w-full md:w-auto"
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default DetailPageHeader;
