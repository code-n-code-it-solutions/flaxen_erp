import React, { useEffect, useState } from 'react';
import PageWrapper from '@/components/PageWrapper';
import Image from 'next/image';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/store';
import {
    clearFavouriteState,
    clearPluginState,
    getPermittedPlugins,
    handPluginFavourite,
    setSelectedPlugin
} from '@/store/slices/pluginSlice';
import { setAuthToken } from '@/configs/api.config';
import { clearMenuState } from '@/store/slices/menuSlice';
import { uniqBy } from 'lodash';

const Main = () => {
    const dispatch = useAppDispatch();
    const { token, user } = useAppSelector(state => state.user);
    const { permittedPlugins, loading, favouriteStatus, favouriteLoading } = useAppSelector(state => state.plugin);
    const { selectedCompany, selectedBranch } = useAppSelector(state => state.company);
    const [pluginList, setPluginList] = useState<any[]>([]);
    const [filteredPlugins, setFilteredPlugins] = useState<any[]>([]);
    const [pluginTypes, setPluginTypes] = useState<any[]>([]);
    const [filteredPluginTypes, setFilteredPluginTypes] = useState<any[]>([]);
    const [favouritePlugins, setFavouritePlugins] = useState<any[]>([]);
    const [pluginLoading, setPluginLoading] = useState<{ [key: string]: boolean }>({});
    const [searchQuery, setSearchQuery] = useState<string>('');

    const handlePluginClick = (plugin: any) => {
        dispatch(clearMenuState());
        dispatch(setSelectedPlugin(plugin.plugin));
    };

    const handleAddFavouritePlugin = (plugin: any) => {
        setAuthToken(token);
        // Set loading state for the plugin
        setPluginLoading(prev => ({ ...prev, [plugin.plugin.id]: true }));

        // Optimistically update the is_favourite status on the client side
        const updatedPlugins = pluginList.map(p => {
            if (p.plugin.id === plugin.plugin.id) {
                return { ...p, is_favourite: !plugin.is_favourite };
            }
            return p;
        });
        setPluginList(updatedPlugins);

        dispatch(handPluginFavourite({
            user_id: user.id,
            plugin_id: plugin.plugin.id,
            type: plugin.is_favourite ? 'remove' : 'add'
        })).then(() => {
            // Clear loading state for the plugin
            setPluginLoading(prev => ({ ...prev, [plugin.plugin.id]: false }));
            setFavouritePlugins(updatedPlugins.filter(p => p.is_favourite));
        }).catch(() => {
            // Revert the optimistic update if the request fails
            const revertedPlugins = pluginList.map(p => {
                if (p.plugin.id === plugin.plugin.id) {
                    return { ...p, is_favourite: plugin.is_favourite };
                }
                return p;
            });
            setPluginList(revertedPlugins);
            setPluginLoading(prev => ({ ...prev, [plugin.plugin.id]: false }));
            setFavouritePlugins(revertedPlugins.filter(p => p.is_favourite));
        });
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);

        const filtered = pluginList.filter(plugin =>
            plugin.plugin.name.toLowerCase().includes(query)
        );

        const filteredTypes = pluginTypes.filter(type =>
            filtered.some(plugin => plugin.plugin.plugin_type.id === type.id)
        );

        setFilteredPlugins(filtered);
        setFilteredPluginTypes(filteredTypes);
    };

    useEffect(() => {
        setAuthToken(token);
        dispatch(clearPluginState());
        dispatch(getPermittedPlugins(user.id));
    }, []);

    useEffect(() => {
        if (permittedPlugins) {
            setPluginList(permittedPlugins);
            setFilteredPlugins(permittedPlugins); // Initialize filteredPlugins with all plugins
            const favouritePlugins: any[] = permittedPlugins.filter((plugin: any) => plugin.is_favourite);
            const types: any[] = permittedPlugins.map((plugin: any) => plugin.plugin.plugin_type);
            setPluginTypes(uniqBy(types, 'id'));
            setFilteredPluginTypes(uniqBy(types, 'id')); // Initialize filteredPluginTypes with all plugin types
            setFavouritePlugins(favouritePlugins);
        }
    }, [permittedPlugins]);

    useEffect(() => {
        if (favouriteStatus) {
            dispatch(clearFavouriteState());
            // dispatch(getPermittedPlugins(user.id));
        }
    }, [favouriteStatus]);

    return (
        <PageWrapper
            breadCrumbItems={[]}
            embedLoader={false}
            loading={false}
            panel={false}
        >
            <div className="container md:p-5">
                <div className="text-center mb-8 font-bold">
                    <h1 className="text-lg font-bold">
                        {selectedCompany?.name} <br />
                        {selectedBranch?.name}
                    </h1>
                    <span>(Plugin List)</span>
                </div>
                <div className="mb-8">
                    <input
                        type="text"
                        placeholder="Search plugins..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="w-full p-2 border rounded"
                    />
                </div>
                {loading
                    ? (
                        <div className="flex justify-center items-center p-2">
                            <span>Loading...</span>
                        </div>
                    ) : (
                        <div className="">
                            <div className="mb-5">
                                <h2 className="text-lg font-bold mb-5 border-b w-full">Favourite Plugins</h2>
                                <div
                                    className="grid grid-cols-3 gap-4 md:grid-cols-8 justify-center items-center">
                                    {favouritePlugins?.length > 0
                                        ? favouritePlugins?.map((plugin: any, index: number) => {
                                            return (
                                                <div
                                                    className="dark:bg-slate-700 bg-white bg-opacity-70 rounded-lg border dark:border-slate-400 shadow hover:shadow-md dark:hover:shadow-white"
                                                    key={index}>
                                                    <Link
                                                        href={'/apps/' + plugin.plugin.name.toLowerCase().replace(' ', '-')}
                                                        onClick={() => handlePluginClick(plugin)}
                                                        className="cursor-pointer"
                                                    >
                                                        <div
                                                            className="flex flex-col justify-center items-center gap-2 mt-2 mb-3">
                                                            <div
                                                                className="flex justify-center items-center p-2">
                                                                <Image src="/assets/images/default.jpeg"
                                                                       alt="ERP"
                                                                       width={50} height={50} />
                                                            </div>
                                                            <span
                                                                className="font-bold text-center">{plugin.plugin.name}</span>
                                                        </div>
                                                    </Link>
                                                    <button
                                                        onClick={() => handleAddFavouritePlugin(plugin)}
                                                        className={`btn ${plugin.is_favourite ? 'btn-success' : 'btn-primary'} btn-sm w-full rounded-tl-none rounded-tr-none`}
                                                        disabled={pluginLoading[plugin.plugin.id]}
                                                    >
                                                        {pluginLoading[plugin.plugin.id]
                                                            ? 'Loading...'
                                                            : plugin.is_favourite ? 'Remove from Favourite' : 'Add to Favourite'
                                                        }
                                                    </button>
                                                </div>
                                            );
                                        }) : (
                                            <div className="flex justify-center items-center p-2 col-span-8">
                                                <span>
                                                    No favourite plugins found. Please add some plugins to favourite
                                                </span>
                                            </div>
                                        )}
                                </div>
                            </div>
                            {filteredPluginTypes.length > 0
                                && filteredPluginTypes.map((type: any, index: number) => (
                                    <div key={index} className="mb-5">
                                        <h2 className="text-lg font-bold mb-5 border-b w-full">{type.name}</h2>
                                        <div
                                            className="grid grid-cols-3 gap-4 md:grid-cols-8 justify-center items-center">
                                            {filteredPlugins?.length > 0
                                                ? filteredPlugins?.map((plugin: any, index: number) => {
                                                    if (plugin.plugin.plugin_type.id === type.id) {
                                                        return (
                                                            <div
                                                                className="dark:bg-slate-700 bg-white bg-opacity-70 rounded-lg border dark:border-slate-400 shadow hover:shadow-md dark:hover:shadow-white"
                                                                key={index}>
                                                                <Link
                                                                    href={'/apps/' + plugin.plugin.name.toLowerCase().replace(' ', '-')}
                                                                    onClick={() => handlePluginClick(plugin)}
                                                                    className="cursor-pointer"
                                                                >
                                                                    <div
                                                                        className="flex flex-col justify-center items-center gap-2 mt-2 mb-3">
                                                                        <div
                                                                            className="flex justify-center items-center p-2">
                                                                            <Image src="/assets/images/default.jpeg"
                                                                                   alt="ERP"
                                                                                   width={50} height={50} />
                                                                        </div>
                                                                        <span
                                                                            className="font-bold text-center">{plugin.plugin.name}</span>
                                                                    </div>
                                                                </Link>
                                                                <button
                                                                    onClick={() => handleAddFavouritePlugin(plugin)}
                                                                    className={`btn ${plugin.is_favourite ? 'btn-success' : 'btn-primary'} btn-sm w-full rounded-tl-none rounded-tr-none`}
                                                                    disabled={pluginLoading[plugin.plugin.id]}
                                                                >
                                                                    {pluginLoading[plugin.plugin.id]
                                                                        ? 'Loading...'
                                                                        : plugin.is_favourite ? 'Remove from Favourite' : 'Add to Favourite'
                                                                    }
                                                                </button>
                                                            </div>
                                                        );
                                                    }
                                                }) : (
                                                    <div className="flex justify-center items-center p-2 col-span-8">
                                                        <span>
                                                            No plugins found or have no permission to any plugin. Please
                                                            do consult with administrator
                                                        </span>
                                                    </div>
                                                )}
                                        </div>
                                    </div>
                                ))}
                        </div>
                    )}
            </div>
        </PageWrapper>
    );
};

export default Main;
