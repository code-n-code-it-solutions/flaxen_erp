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

const Index = () => {
    const dispatch = useAppDispatch();
    const { token, user } = useAppSelector(state => state.user);
    const { permittedPlugins, loading, favouriteStatus, favouriteLoading } = useAppSelector(state => state.plugin);
    const [pluginList, setPluginList] = useState<any[]>([]);
    const [filteredPlugins, setFilteredPlugins] = useState<any[]>([]);
    const [pluginTypes, setPluginTypes] = useState<any[]>([]);
    const [filteredPluginTypes, setFilteredPluginTypes] = useState<any[]>([]);
    const [favouritePlugins, setFavouritePlugins] = useState<any[]>([]);
    const [pluginLoading, setPluginLoading] = useState<{ [key: string]: boolean }>({});
    const [searchQuery, setSearchQuery] = useState<string>('');

    // const handlePluginClick = (plugin: any) => {
    //     dispatch(clearMenuState());
    //     dispatch(setSelectedPlugin(plugin.plugin));
    // };

    const handleAddFavouritePlugin = (plugin: any) => {
        setAuthToken(token);
        setPluginLoading(prev => ({ ...prev, [plugin.plugin.id]: true }));

        const updatedPlugins = pluginList.map(p => {
            if (p.plugin.id === plugin.plugin.id) {
                return { ...p, is_favourite: !plugin.is_favourite };
            }
            return p;
        });
        setPluginList(updatedPlugins);
        setFilteredPlugins(updatedPlugins);
        dispatch(handPluginFavourite({
            user_id: user.id,
            plugin_id: plugin.plugin.id,
            type: plugin.is_favourite ? 'remove' : 'add'
        })).then(() => {
            setPluginLoading(prev => ({ ...prev, [plugin.plugin.id]: false }));
            setFavouritePlugins(updatedPlugins.filter(p => p.is_favourite));
        }).catch(() => {
            const revertedPlugins = pluginList.map(p => {
                if (p.plugin.id === plugin.plugin.id) {
                    return { ...p, is_favourite: plugin.is_favourite };
                }
                return p;
            });
            setPluginList(revertedPlugins);
            setFilteredPlugins(revertedPlugins);
            setPluginLoading(prev => ({ ...prev, [plugin.plugin.id]: false }));
            setFavouritePlugins(revertedPlugins.filter(p => p.is_favourite));
        });
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);

        const filtered = pluginList.filter(plugin =>
            plugin.plugin?.name.toLowerCase().includes(query)
        );

        const filteredTypes = pluginTypes.filter(type =>
            filtered.some(plugin => plugin.plugin.plugin_type.name === type)
        );

        setFilteredPlugins(filtered);
        setFilteredPluginTypes(filteredTypes);
    };

    useEffect(() => {
        setAuthToken(token);
        dispatch(clearPluginState());
        dispatch(getPermittedPlugins(user.id));
    }, [dispatch, token, user.id]);

    useEffect(() => {
        if (permittedPlugins) {
            const pluginListArray = Object.values(permittedPlugins).flat();
            setPluginList(pluginListArray);
            setFilteredPlugins(pluginListArray);

            const types = Object.keys(permittedPlugins);
            setPluginTypes(types);
            setFilteredPluginTypes(types);

            const favourites = pluginListArray.filter((plugin: any) => plugin.is_favourite);
            setFavouritePlugins(favourites);
        }
    }, [permittedPlugins]);

    useEffect(() => {
        if (favouriteStatus) {
            dispatch(clearFavouriteState());
        }
    }, [favouriteStatus, dispatch]);

    useEffect(() => {
        // console.log(user);
    }, [user]);

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
                        {user.registered_company?.name} <br />
                        {user.registered_branch?.name}
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
                            {filteredPluginTypes.length > 0
                                && filteredPluginTypes.map((type:any, index:number) => (
                                    <div key={index} className="mb-5">
                                        <h2 className="text-lg font-bold mb-5 border-b w-full">{type}</h2>
                                        <div
                                            className="grid grid-cols-2 gap-4 md:grid-cols-8 justify-center items-center">
                                            {filteredPlugins
                                                .filter((plugin:any) => plugin.plugin.plugin_category.name === type)
                                                .map((plugin:any, i: number) => (
                                                    <div
                                                        className="dark:bg-slate-700 bg-white bg-opacity-70 rounded-lg border dark:border-slate-400 shadow hover:shadow-md dark:hover:shadow-white"
                                                        key={i}>
                                                        <Link
                                                            href={'/apps/' + plugin?.plugin?.name.toLowerCase().replace(' ', '-')}
                                                            // onClick={() => handlePluginClick(plugin)}
                                                            className="cursor-pointer"
                                                        >
                                                            <div
                                                                className="flex flex-col justify-center items-center gap-2 mt-2 mb-3">
                                                                <div className="flex justify-center items-center p-2">
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
                                                ))}
                                        </div>
                                    </div>
                                ))}
                        </div>
                    )}
            </div>
        </PageWrapper>
    );
};

export default Index;
