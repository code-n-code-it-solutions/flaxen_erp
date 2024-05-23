import React from 'react';
import Dropdown from '@/components/Dropdown';
import { CogIcon, DownloadCloud, KanbanIcon, MoreHorizontalIcon, SearchIcon, UploadCloud } from 'lucide-react';
import Link from 'next/link';

interface IProps {
    leftComponent?: {
        button: {
            show: boolean;
            text: any;
            link?: string;
            onClick?: () => void;
        };
        title: string;
        cogIcon?: React.ReactNode;
    };
    middleComponent?: React.ReactNode;
    rightComponent?: {
        show: boolean;
        icon: React.ReactNode;
        link?: string;
        onClick?: () => void;
    }[];
    search?: {
        gridRef?: any;
        onQuickFilterChanged: (e: any) => void;
    };
}

const PageHeader = ({ leftComponent, middleComponent, rightComponent, search }: IProps) => {
    return (
        <div
            className="shadow bg-white px-5 py-5 flex flex-col md:flex-row justify-between gap-3 md:items-center panel rounded">
            {leftComponent && (
                <div className="flex items-center justify-start gap-2">
                    {leftComponent.button.link ? (
                        <Link href={leftComponent.button.link} className="btn btn-primary btn-sm">
                            {leftComponent.button.text}
                        </Link>
                    ) : (
                        <button onClick={leftComponent.button.onClick}
                                className="btn btn-primary btn-sm">{leftComponent.button.text}</button>
                    )}
                    <h2 className="text-lg font-semibold">{leftComponent.title}</h2>
                    {leftComponent.cogIcon}

                </div>
            )}


            <div className="flex items-center justify-center gap-2 w-full md:px-48">
                {middleComponent
                    ? middleComponent : (
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
                                onInput={search?.onQuickFilterChanged}
                                className="flex-1 form-input ltr:rounded-l-none rtl:rounded-r-none"
                            />
                        </div>
                    )}
            </div>
            {rightComponent && (

                <div className="flex items-center md:justify-end gap-2">
                    <div className="relative inline-flex align-middle">
                        {rightComponent.map((item, index) => (
                            item.show && (
                                <button type="button" key={index} className={
                                    `btn btn-primary
                                    ${index == 0 && index < rightComponent.length - 1
                                        ? 'ltr:rounded-r-none rtl:rounded-l-none'
                                        : index === rightComponent.length - 1
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
    );
};

export default PageHeader;
