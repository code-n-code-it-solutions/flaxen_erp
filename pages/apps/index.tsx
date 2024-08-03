import React from 'react';
import PageWrapper from '@/components/PageWrapper';
import { useAppDispatch, useAppSelector } from '@/store';

const Index = () => {
    const dispatch = useAppDispatch();
    const { user } = useAppSelector(state => state.user);

    return (
        <PageWrapper
            breadCrumbItems={[]}
            embedLoader={false}
            loading={false}
            panel={false}
        >
            <div className="flex flex-col justify-center items-center h-full">
                <h1 className="text-2xl font-bold">{user?.registered_company?.name}</h1>
                <h1 className="text-lg font-bold">{user?.registered_branch?.name}</h1>
            </div>
        </PageWrapper>
    );
};

export default Index;
