import React, {FC} from 'react';
import Breadcrumb from "@/components/Breadcrumb";
import ContentLoader from "@/components/ContentLoader";

interface IProps {
    loading?: boolean;
    breadCrumbItems?: { title: string, href: string }[];
    children: React.ReactNode;
    embedLoader?: boolean;
}

const PageWrapper: FC<IProps> = ({
                                     loading = false,
                                     breadCrumbItems = [],
                                     children,
                                     embedLoader = false
                                 }) => {
    return (
        <div>
            {breadCrumbItems && breadCrumbItems.length > 0 && <Breadcrumb items={breadCrumbItems}/>}
            <div className="pt-5">
                <div className="panel">
                    {embedLoader && loading
                        ? <ContentLoader/>
                    : children}
                </div>
            </div>
        </div>
    );
};

export default PageWrapper;
