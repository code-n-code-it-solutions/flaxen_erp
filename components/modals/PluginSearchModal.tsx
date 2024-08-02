import React, { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import Modal from '@/components/Modal';
import { uniqBy } from 'lodash';
import Link from 'next/link';
import Image from 'next/image';
import { clearMenuState } from '@/store/slices/menuSlice';
import { clearPluginState, getPermittedPlugins, setSelectedPlugin } from '@/store/slices/pluginSlice';
import { useRouter } from 'next/router';

interface IProps {
    modalOpen: boolean;
    setModalOpen: (value: boolean) => void;
}

const PluginSearchModal = ({ modalOpen, setModalOpen }: IProps) => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { user, token } = useAppSelector(state => state.user);
    const { permittedPlugins, loading, favouriteStatus, favouriteLoading } = useAppSelector(state => state.plugin);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredPlugins, setFilteredPlugins] = useState<any>([]);
    const [pluginList, setPluginList] = useState<any>({});
    const searchInputRef = useRef<HTMLInputElement>(null);

    const handlePluginClick = (plugin: any) => {
        dispatch(clearMenuState());
        dispatch(setSelectedPlugin(plugin));
        setModalOpen(false);
        router.push('/apps/' + plugin?.name.toLowerCase().replace(' ', '-'));
    };
    useEffect(() => {
        if (modalOpen) {
            setSearchQuery('');
            dispatch(clearPluginState());
            dispatch(getPermittedPlugins(user.id));
            if (searchInputRef.current) {
                searchInputRef.current.focus();
            }
        }
    }, [modalOpen]);

    useEffect(() => {
        if (permittedPlugins) {
            setPluginList(permittedPlugins);
            setFilteredPlugins(permittedPlugins);
        }
    }, [permittedPlugins]);

    useEffect(() => {
        setFilteredPlugins(pluginList);
    }, [pluginList]);

    useEffect(() => {
        if (searchQuery) {
            const filtered = Object.keys(pluginList).reduce((acc: any, key) => {
                const filteredPlugins = pluginList[key].filter((plugin: any) =>
                    plugin.plugin.name.toLowerCase().includes(searchQuery.toLowerCase())
                );
                if (filteredPlugins.length > 0) {
                    acc[key] = filteredPlugins;
                }
                return acc;
            }, {});
            setFilteredPlugins(filtered);
        } else {
            setFilteredPlugins(pluginList);
        }
    }, [searchQuery, pluginList]);

    useEffect(() => {
        // console.log(filteredPlugins);
    }, [filteredPlugins]);

    return (
        <Modal
            show={modalOpen}
            setShow={setModalOpen}
            // title="Search Plugin"
            size={'xl'}
        >

            <input
                type="text"
                className="form-input w-full"
                placeholder="Search plugins..."
                ref={searchInputRef}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="px-4">
                {loading
                    ? (<p>Loading...</p>)
                    : Object.keys(filteredPlugins).length > 0 ? (
                        Object.keys(filteredPlugins).map((type, index) => (
                            <div key={index} className="mb-4">
                                <h3 className="font-semibold">{type}</h3>
                                <ul className="px-5">
                                    {filteredPlugins[type].map((plugin: any, index: number) => (
                                        <li
                                            key={index}
                                            className="py-2 border-b"
                                            onClick={() => handlePluginClick(plugin)}
                                        >
                                            <Link
                                                className="w-full"
                                                href={'/apps/' + plugin?.plugin?.name.toLowerCase().replace(' ', '-')}
                                                onClick={() => handlePluginClick(plugin)}
                                            >
                                                {plugin.plugin.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))
                    ) : (
                        <p>No plugins found.</p>
                    )}
            </div>
        </Modal>
    );
};

export default PluginSearchModal;
