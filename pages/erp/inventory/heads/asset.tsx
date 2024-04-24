import React, {useEffect, useState} from 'react';
import PageWrapper from "@/components/PageWrapper";
import {useAppDispatch, useAppSelector} from "@/store";
import GenericTable from "@/components/GenericTable";
import {serverFilePath} from "@/utils/helper";
import {ButtonType, ButtonVariant, IconType} from "@/utils/enums";
import IconButton from "@/components/IconButton";
import {setPageTitle} from "@/store/slices/themeConfigSlice";
import {storeAssets, getAssets, clearAssetState} from "@/store/slices/assetSlice";
import Image from "next/image";
import AssetFormModal from "@/components/modals/AssetFormModal";
import {setAuthToken, setContentType} from "@/configs/api.config";

const Assets = () => {
    const dispatch = useAppDispatch();
    const {token} = useAppSelector(state => state.user);
    const {assets, loading, success, asset} = useAppSelector(state => state.asset);
    const [rowData, setRowData] = useState([]);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [detail, setDetail] = useState<any>({});

    const breadCrumbItems = [
        {
            title: 'Home',
            href: '/erp/main',
        },
        {
            title: 'Inventory Dashboard',
            href: '/erp/inventory',
        },
        {
            title: 'Assets',
            href: '#',
        },
    ];

    const handleSubmit = (formData: any) => {
        setAuthToken(token)
        setContentType('multipart/form-data')
        if (Object.keys(detail).length > 0) {
            dispatch(storeAssets({data: formData, id: detail.id}))
        } else {
            dispatch(storeAssets(formData))
        }
    }

    useEffect(() => {
        setAuthToken(token)
        setContentType('application/json')
        dispatch(setPageTitle('Assets'));
        dispatch(getAssets());
        dispatch(clearAssetState())
        setModalOpen(false)
    }, []);

    useEffect(() => {
        if (assets) {
            setRowData(assets);
        } else {
            setRowData([])
        }
    }, [assets]);

    useEffect(() => {
        if (success && asset) {
            dispatch(getAssets());
            setModalOpen(false);
        }
    }, [success, asset]);

    return (
        <PageWrapper
            embedLoader={false}
            loading={false}
            breadCrumbItems={breadCrumbItems}
            title="Assets"
            buttons={[
                {
                    text: 'Add New',
                    type: ButtonType.link,
                    variant: ButtonVariant.primary,
                    icon: IconType.back,
                    onClick: () => {
                        setModalOpen(false)
                        setDetail({})
                    }
                }
            ]}
        >
            <GenericTable
                rowData={rowData}
                loading={loading}
                exportTitle={'assets' + Date.now()}
                showFooter={rowData.length > 0}
                columns={[
                    {
                        accessor: 'row.thumbnail',
                        title: 'Thumbnail',
                        render: (row: any) => (
                            <Image priority={true} src={serverFilePath(row.thumbnail)} alt={row.name}
                                   width={50} height={50} className="rounded"/>
                        ),
                        sortable: true,
                    },
                    {
                        accessor: 'name',
                        title: 'Title',
                        sortable: true,
                        footer: (
                            <div className='flex gap-2 justify-start items-center'>
                                <span>Assets:</span>
                                <span>{rowData.length}</span>
                            </div>
                        )
                    },
                    {
                        accessor: 'country.name',
                        title: 'Country',
                        sortable: true
                    },
                    {
                        accessor: 'code',
                        title: 'Code',
                        sortable: true
                    },
                    {
                        accessor: 'description',
                        title: 'Description',
                        sortable: true
                    },
                    {
                        accessor: 'is_active',
                        title: 'Status',
                        render: (row: any) => (
                            <span className={`badge bg-${row.is_active ? 'success' : 'danger'}`}>
                                {row.is_active ? 'Active' : 'Inactive'}
                            </span>
                        ),
                        sortable: true,
                        footer: (
                            <div className="flex justify-start items-center gap-3">
                                <div className='flex gap-2 justify-start items-center'>
                                    <span>Active: </span>
                                    <span>{rowData.reduce((acc: any, item: any) => item.is_active ? acc + 1 : 0, 0)}</span>
                                </div>
                                <div className='flex gap-2 justify-start items-center'>
                                    <span>Not Active: </span>
                                    <span>{rowData.reduce((acc: any, item: any) => !item.is_active ? acc + 1 : 0, 0)}</span>
                                </div>
                            </div>
                        ),
                    },
                    {
                        accessor: 'actions',
                        title: 'Actions',
                        render: (row: any) => (
                            <div className="flex items-center gap-3">
                                <IconButton
                                    icon={IconType.edit}
                                    color={ButtonVariant.primary}
                                    tooltip='Edit'
                                    onClick={() => {
                                        setDetail(row);
                                        setModalOpen(true);
                                    }}
                                />
                            </div>
                        )
                    }
                ]}
            />
            <AssetFormModal
                modalOpen={modalOpen}
                setModalOpen={setModalOpen}
                handleSubmit={(formData) => handleSubmit(formData)}
                modalFormData={detail}
            />
        </PageWrapper>
    );
};

export default Assets;
