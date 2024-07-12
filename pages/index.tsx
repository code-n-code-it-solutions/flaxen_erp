import React from 'react';
import WebsiteLayout from '@/components/Layouts/WebsiteLayout';
import Button from '@/components/Button';
import { ButtonSize, ButtonType, ButtonVariant } from '@/utils/enums';

const Index = () => {
    return (
        <div className="flex justify-center items-center h-screen">
            <Button
                type={ButtonType.link}
                text="Go Workspace"
                link={'/auth/signin'}
                variant={ButtonVariant.primary}
                size={ButtonSize.large}
            />
        </div>
    );
};

Index.getLayout = (page: any) => {
    return <WebsiteLayout>{page}</WebsiteLayout>;
};
export default Index;
