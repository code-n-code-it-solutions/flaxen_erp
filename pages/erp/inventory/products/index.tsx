import React, {useEffect, useState} from 'react';
import {setPageTitle} from '@/store/slices/themeConfigSlice';
import {useAppDispatch, useAppSelector} from "@/store";
import {getRawProducts} from "@/store/slices/rawProductSlice";
import {setAuthToken, setContentType} from "@/configs/api.config";
import {ButtonType, ButtonVariant, IconType} from "@/utils/enums";
import PageWrapper from "@/components/PageWrapper";
import {getIcon} from "@/utils/helper";
import GenericTable from "@/components/GenericTable";
import IconButton from "@/components/IconButton";
import {capitalize} from "lodash";

const Index = () => {
    const dispatch = useAppDispatch();
    const {token} = useAppSelector((state) => state.user);
    const {allRawProducts, loading} = useAppSelector((state) => state.rawProduct);
    const [rowData, setRowData] = useState([]);
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
            title: 'Materials',
            href: '#',
        },
    ];

    useEffect(() => {
        dispatch(setPageTitle('All Raw Materials'));
        setAuthToken(token)
        setContentType('application/json')
        dispatch(getRawProducts([]))
    }, []);

    useEffect(() => {
        if (allRawProducts) {
            setRowData(allRawProducts)
        }
    }, [allRawProducts]);

    return (
        <PageWrapper
            breadCrumbItems={breadCrumbItems}
            embedLoader={false}
            title='All Raw Materials'
            buttons={[
                {
                    text: 'Add New',
                    type: ButtonType.link,
                    variant: ButtonVariant.primary,
                    icon: IconType.add,
                    link: '/erp/inventory/products/create'
                }
            ]}
        >
            <GenericTable
                rowData={rowData}
                loading={false}
                exportTitle={'all-raw-materials' + Date.now()}
                showFooter={rowData.length > 0}
                columns={[
                    {
                        accessor: 'item_code',
                        title: 'Code',
                        sortable: true,
                        footer: (
                            rowData.length > 0 &&
                            <div className='flex gap-2 justify-start items-center'>
                                <span>Items:</span>
                                <span>{rowData.length}</span>
                            </div>
                        )
                    },
                    {
                        accessor: 'title',
                        title: 'Title',
                        sortable: true
                    },
                    {
                        accessor: 'product_type',
                        title: 'Product Type',
                        render: (row: any) => (
                            <span>{capitalize(row.product_type)}</span>
                        ),
                        sortable: true
                    },
                    {
                        accessor: 'unit.name',
                        title: 'Unit-Sub Unit',
                        render: (row: any) => (
                            <span>{row.unit.name}-{row.sub_unit.name}</span>
                        ),
                        sortable: true
                    },
                    {
                        accessor: 'opening_stock',
                        title: 'In Stock (Sub Unit)',
                        sortable: true,
                        footer: (
                            rowData.length > 0 &&
                            <div className='flex gap-2 justify-start items-center'>
                                <span className='h-3 w-3'>
                                    {getIcon(IconType.sum)}
                                </span>
                                <span>{rowData.reduce((acc: any, item: any) => acc + parseFloat(item.opening_stock), 0)}</span>
                            </div>
                        )
                    },
                    {
                        accessor: 'opening_stock_unit_balance',
                        title: 'Stock Unit-Total Balance',
                        render: (row: any) => (
                            <span>
                                {Number(row.opening_stock_unit_balance).toLocaleString()} - {Number(row.opening_stock_total_balance).toLocaleString()}
                            </span>
                        ),
                        footer: (
                            rowData.length > 0 &&
                            <div className="flex justify-start items-center gap-3">
                                <div className='flex gap-2 justify-start items-center'>
                                    <span className='h-3 w-3'>
                                        {getIcon(IconType.sum)}
                                    </span>
                                    <span>{rowData.reduce((acc: any, item: any) => acc + parseFloat(item.opening_stock_unit_balance), 0)}</span>
                                </div>
                                <span> - </span>
                                <div className='flex gap-2 justify-start items-center'>
                                    <span className='h-3 w-3'>
                                        {getIcon(IconType.sum)}
                                    </span>
                                    <span>{rowData.reduce((acc: any, item: any) => acc + parseFloat(item.opening_stock_total_balance), 0)}</span>
                                </div>
                            </div>
                        ),
                        sortable: true
                    },
                    {
                        accessor: 'valuation_method',
                        title: 'Valuation Method',
                        sortable: true,
                        footer: (
                            rowData.length > 0 &&
                            <div className="flex justify-start items-center gap-3">
                                <div className='flex gap-2 justify-start items-center'>
                                    <span>Average: </span>
                                    <span>{rowData.reduce((acc: number, item: any) => item.valuation_method === 'Average' ? acc + 1 : acc, 0)}</span>
                                </div>
                                <div className='flex gap-2 justify-start items-center'>
                                    <span>LIFO: </span>
                                    <span>{rowData.reduce((acc: number, item: any) => item.valuation_method === 'LIFO' ? acc + 1 : acc, 0)}</span>
                                </div>
                                <div className='flex gap-2 justify-start items-center'>
                                    <span>FIFO: </span>
                                    <span>{rowData.reduce((acc: number, item: any) => item.valuation_method === 'FIFO' ? acc + 1 : acc, 0)}</span>
                                </div>
                            </div>
                        ),
                    },
                    {
                        accessor: 'valuated_unit_price',
                        title: 'Valuated Unit Price',
                        sortable: true,
                        footer: (
                            rowData.length > 0 &&
                            <div className='flex gap-2 justify-start items-center'>
                                <span className='h-3 w-3'>
                                    {getIcon(IconType.sum)}
                                </span>
                                <span>{rowData.reduce((acc: any, item: any) => acc + parseFloat(item.valuated_unit_price), 0)}</span>
                            </div>
                        ),
                    },
                    {
                        accessor: 'is_active',
                        title: 'Status',
                        render: (row: any) => (
                            <span
                                className={`badge bg-${row.is_active ? 'success' : 'danger'}`}>
                                {row.is_active ? 'Active' : 'Inactive'}
                            </span>
                        ),
                        sortable: true,
                        footer: (
                            rowData.length > 0 &&
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
                        render: (row: any) => {
                            return (
                                <div className="flex items-center gap-3">

                                    <IconButton
                                        icon={IconType.print}
                                        color={ButtonVariant.secondary}
                                        tooltip='Print'
                                        link={`/erp/inventory/products/print/${row.id}`}
                                    />

                                    <IconButton
                                        icon={IconType.view}
                                        color={ButtonVariant.info}
                                        tooltip='View'
                                        link={`/erp/inventory/products/view/${row.id}`}
                                    />
                                    <IconButton
                                        icon={IconType.edit}
                                        color={ButtonVariant.primary}
                                        tooltip='Edit'
                                        link={`/erp/inventory/products/edit/${row.id}`}
                                    />
                                </div>
                            )
                        }
                    }
                ]}
            />
        </PageWrapper>
    );
};

export default Index;
