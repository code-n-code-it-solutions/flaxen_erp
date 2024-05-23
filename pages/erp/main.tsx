import React, { useEffect } from 'react';
import PageWrapper from '@/components/PageWrapper';
import Image from 'next/image';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/store';
import { setSelectedPlugin } from '@/store/slices/pluginSlice';
import { setAuthToken } from '@/configs/api.config';
import { clearMenuState, getPermittedMenu } from '@/store/slices/menuSlice';
import { useRouter } from 'next/router';

const Main = () => {
    const dispatch = useAppDispatch();
    const { selectedCompany, selectedBranch, loading } = useAppSelector(state => state.company);

    const handlePluginClick = (plugin: any) => {
        dispatch(clearMenuState());
        dispatch(setSelectedPlugin(plugin));
    };

    return (
        <PageWrapper
            breadCrumbItems={[]}
            embedLoader={false}
            loading={false}
            panel={false}
        >
            <div className="container md:p-5">
                <h1 className="text-lg font-bold text-center mb-5">
                    {selectedCompany?.name} <br />
                    {selectedBranch?.name}
                </h1>
                <div className="grid grid-cols-3 gap-4 md:grid-cols-8 justify-center items-center">
                    {selectedBranch?.plugins?.length > 0
                        ? selectedBranch?.plugins?.map((plugin: any, index: number) => {
                            console.log();
                            return (
                                <Link
                                    href={'/apps/' + plugin.plugin.name.toLowerCase().replace(' ', '-')}
                                    onClick={() => handlePluginClick(plugin)}
                                    className="md:py-4 md:px-3 cursor-pointer"
                                    key={index}>
                                    <div
                                        className="flex flex-col justify-center items-center gap-2 dark:bg-slate-700 bg-white bg-opacity-70 py-4 rounded-lg border dark:border-slate-400 shadow hover:shadow-md dark:hover:shadow-white">
                                        <div className="flex justify-center items-center p-2">
                                            <Image src="/assets/images/default.jpeg" alt="ERP" width={50} height={50} />
                                        </div>
                                        <span className="font-bold text-center">{plugin.plugin.name}</span>
                                    </div>
                                </Link>
                            );
                        }) : (
                            <div className="flex justify-center items-center p-2">
                                <span>No plugins found</span>
                            </div>
                        )}

                </div>
            </div>
        </PageWrapper>
    );
};

export default Main;
