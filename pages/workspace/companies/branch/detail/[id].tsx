import React from 'react';
import WorkspaceLayout from '@/components/Layouts/WorkspaceLayout';

const View = () => {
    return (
        <div className="flex flex-col gap-3">
            <div className="panel">

            </div>
            <div className="panel">

            </div>
        </div>
    );
};

View.getLayout = (page: any) => <WorkspaceLayout>{page}</WorkspaceLayout>;
export default View;
