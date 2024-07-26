import React from 'react';
import AppLayout from '@/components/Layouts/AppLayout';
import { useAppSelector } from '@/store';

const Index = () => {
    const { permittedMenus } = useAppSelector((state) => state.menu);
    return (
        // permittedMenus && permittedMenus.find((menu: any) => menu.name === 'Overview') ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            <div className="panel">
                <div className="panel-body">
                    <h1>Hello</h1>
                </div>
            </div>
            <div className="panel">
                <div className="panel-body">
                    <h1>Hello</h1>
                </div>
            </div>
            <div className="panel">
                <div className="panel-body">
                    <h1>Hello</h1>
                </div>
            </div>
            <div className="panel">
                <div className="panel-body">
                    <h1>Hello</h1>
                </div>
            </div>
        </div>
        // ) : (
        //     <div>
        //         You are not permitted to access review page of this plugin.
        //     </div>
        // )
    );
};

Index.getLayout = (page: any) => {
    return <AppLayout>{page}</AppLayout>;
};
export default Index;
