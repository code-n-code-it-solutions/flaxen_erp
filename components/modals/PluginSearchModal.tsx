import React, { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import Modal from '@/components/Modal';
import { uniqBy } from 'lodash';
import Link from 'next/link';
import Image from 'next/image';
import { clearMenuState } from '@/store/slices/menuSlice';
import { setSelectedPlugin } from '@/store/slices/pluginSlice';
import { useRouter } from 'next/router';

interface IProps {
    modalOpen: boolean;
    setModalOpen: (value: boolean) => void;
}

const PluginSearchModal = ({ modalOpen, setModalOpen }: IProps) => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    // const {plugins} = useAppSelector(state => state.plugin);
    const { user, token } = useAppSelector(state => state.user);
    const { companyDetail } = useAppSelector(state => state.company);
    const [searchQuery, setSearchQuery] = useState('');
    const [pluginTypes, setPluginTypes] = useState<any[]>([]);
    const [branches, setBranches] = useState<any[]>([]);
    const [filteredPlugins, setFilteredPlugins] = useState<any>([]);
    const [pluginList, setPluginList] = useState<any>({});
    const searchInputRef = useRef<HTMLInputElement>(null);

    const handlePluginClick = (plugin: any) => {
        dispatch(clearMenuState());
        dispatch(setSelectedPlugin(plugin));
        setModalOpen(false);
        router.push('/apps/' + plugin.name.toLowerCase().replace(' ', '-'));
    };
    useEffect(() => {
        if (modalOpen) {
            setSearchQuery('');
            setFilteredPlugins(pluginList);
            if (searchInputRef.current) {
                searchInputRef.current.focus();
            }
        }
    }, [modalOpen]);

    useEffect(() => {
        if (companyDetail) {
            setBranches(companyDetail.branches);

            const plugins = companyDetail.branches
                .filter((branch: any) => branch.id === user?.registered_branch?.id)
                .map((branch: any) => branch.plugins)
                .flat();

            let pluginTypes = companyDetail.branches
                .map((branch: any) => branch.plugins)
                .flat()
                .map((plugin: any) => plugin.plugin.plugin_type);

            pluginTypes = uniqBy(pluginTypes, 'name');

            const groupedPlugins = pluginTypes.reduce((acc: any, pluginType: any) => {
                acc[pluginType.name] = plugins
                    .filter((plugin: any) => plugin.plugin.plugin_type_id === pluginType.id)
                    .map((plugin: any) => plugin.plugin);
                return acc;
            }, {});

            setPluginList(groupedPlugins);
            setPluginTypes(uniqBy(pluginTypes, 'name'));
        }
    }, [companyDetail]);

    useEffect(() => {
        setFilteredPlugins(pluginList);
    }, [pluginList]);

    useEffect(() => {
        if (searchQuery) {
            const filtered = Object.keys(pluginList).reduce((acc: any, key) => {
                const filteredPlugins = pluginList[key].filter((plugin: any) =>
                    plugin.name.toLowerCase().includes(searchQuery.toLowerCase())
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
                {Object.keys(filteredPlugins).length > 0 ? (
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
                                            href={'/apps/' + plugin.name.toLowerCase().replace(' ', '-')}
                                            onClick={() => handlePluginClick(plugin)}
                                        >
                                            {plugin.name}
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
