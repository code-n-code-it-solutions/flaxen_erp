import React, {FC} from 'react';
import Breadcrumb from "@/components/Breadcrumb";
import ContentLoader from "@/components/ContentLoader";
import PageHeader from "@/components/PageHeader";
import {ButtonType, ButtonVariant, IconType} from "@/utils/enums";

interface IProps {
    loading?: boolean;
    breadCrumbItems?: { title: string, href: string }[];
    children: React.ReactNode;
    embedLoader?: boolean;
    title?: string;
    buttons?: {
        text: string;
        icon?: IconType;
        type: ButtonType;
        variant: ButtonVariant;
        link?: string;
        onClick?: () => void;
    }[];
}

const PageWrapper: FC<IProps> = ({
                                     loading = false,
                                     breadCrumbItems = [],
                                     children,
                                     embedLoader = false,
                                     title,
                                     buttons
                                 }) => {
    return (
        <div>
            {breadCrumbItems && breadCrumbItems.length > 0 && <Breadcrumb items={breadCrumbItems}/>}
            <div className="pt-5">
                <div className="panel">
                    {embedLoader && loading
                        ? <ContentLoader/>
                        : (
                            <>
                                {title && <PageHeader title={title} buttons={buttons}/>}
                                {children}
                            </>
                        )}
                </div>
            </div>
        </div>
    );
};

export default PageWrapper;
