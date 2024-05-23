import React from 'react';
import Dropdown from '@/components/Dropdown';
import { CogIcon, DownloadCloud, UploadCloud } from 'lucide-react';
import Link from 'next/link';

interface IProps {
    dropdownItems?: { content: React.ReactNode, onClick: () => void }[];
    dropdownButton?: {
        text?: string;
        icon?: React.ReactNode;
        variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'info' | 'light' | 'dark' | 'link' | 'white' | 'black' | 'transparent' | 'primary-outline' | 'secondary-outline' | 'danger-outline' | 'success-outline' | 'warning-outline' | 'info-outline' | 'light-outline' | 'dark-outline' | 'link-outline' | 'white-outline' | 'black-outline' | 'transparent-outline' | 'primary-sm' | 'secondary-sm' | 'danger-sm' | 'success-sm' | 'warning-sm' | 'info-sm' | 'light-sm' | 'dark-sm' | 'link-sm' | 'white-sm' | 'black-sm' | 'transparent-sm' | 'primary-outline-sm' | 'secondary-outline-sm' | 'danger-outline-sm' | 'success-outline-sm' | 'warning-outline-sm' | 'info-outline-sm' | 'light-outline-sm' | 'dark-outline-sm' | 'link-outline-sm' | 'white-outline-sm' | 'black-outline-sm' | 'transparent-outline-sm' | 'primary-lg' | 'secondary-lg' | 'danger-lg' | 'success-lg' | 'warning-lg' | 'info-lg' | 'light-lg' | 'dark-lg' | 'link-lg' | 'white-lg' | 'black-lg' | 'transparent-lg' | 'primary-outline-lg' | 'secondary-outline-lg' | 'danger-outline-lg' | 'success-outline-lg' | 'warning-outline-lg' | 'info-outline-lg' | 'light-outline-lg' | 'dark-outline-lg' | 'link-outline-lg' | 'white-outline-lg' | 'black-outline-lg' | 'transparent-outline-lg' | 'primary-md' | 'secondary-md' | 'danger-md' | 'success-md' | 'warning-md' | 'info-md' | 'light-md' | 'dark-md' | 'link-md' | 'white-md' | 'black-md' | 'transparent-md' | 'primary-outline-md' | 'secondary-outline-md' | 'danger-outline-md' | 'success-outline-md' | 'warning-outline-md' | 'info-outline-md' | 'light-outline-md' | 'dark-outline-md' | 'link-outline-md' | 'white-outline-md' | 'black-outline-md' | 'transparent-outline-md'
    };
    otherButtons?: React.ReactNode[];
}

const OnRowSelectDropdown = ({ dropdownItems, dropdownButton, otherButtons }: IProps) => {
    return (
        <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-center justify-end">
            {otherButtons?.map((button, index) => (
                <div key={index}>
                    {button}
                </div>
            ))}
            {dropdownItems && dropdownItems?.length > 0 && (
                <div className="dropdown flex shrink-0">
                    <Dropdown
                        offset={[0, 8]}
                        placement={`bottom-end`}
                        btnClassName="relative group block"
                        button={(
                            <button
                                className={`btn btn-${dropdownButton?.variant || 'primary'} btn-sm flex items-center justify-center gap-2`}>
                                {dropdownButton?.icon}
                                <span>{dropdownButton?.text}</span>
                            </button>
                        )}>
                        <ul className="w-[230px] border !py-0 font-semibold text-dark dark:text-white-dark dark:text-white-light/90">
                            {dropdownItems?.map((item: any, index: number) => (
                                <li key={index}>
                                    <a href="#" onClick={item.onClick}>
                                        {item.content}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </Dropdown>
                </div>
            )}
        </div>
    );
};

export default OnRowSelectDropdown;
