import React, {useEffect, useState} from 'react';
import {setPageTitle} from '@/store/slices/themeConfigSlice';
import {useAppDispatch, useAppSelector} from '@/store';
import {setAuthToken, setContentType} from '@/configs/api.config';
import GenericTable from '@/components/GenericTable';
import IconButton from '@/components/IconButton';
import {ButtonType, ButtonVariant, IconType} from '@/utils/enums';
import {getIcon} from '@/utils/helper';
import PageWrapper from "@/components/PageWrapper";
import {getFillings} from "@/store/slices/fillingSlice";

const Index = () => {
    const dispatch = useAppDispatch();
    const {token} = useAppSelector(state => state.user);
    const {fillings, loading, success} = useAppSelector(state => state.filling);
    const [rowData, setRowData] = useState([]);

    const breadcrumbItems = [
        {
            title: 'Home',
            href: '/erp/main',
        },
        {
            title: 'Inventory Dashboard',
            href: '/erp/inventory',
        },
        {
            title: 'All Fillings',
            href: '#',
        },
    ];

    useEffect(() => {
        setAuthToken(token);
        setContentType('application/json');
        dispatch(getFillings());
        dispatch(setPageTitle('All Fillings'));
    }, []);

    useEffect(() => {
        if (fillings) {
            setRowData(fillings);
        }
    }, [fillings]);

    return (
        <PageWrapper
            embedLoader={true}
            breadCrumbItems={breadcrumbItems}
            loading={loading}
            title="All Fillings"
            buttons={[
                {
                    text: 'Create New',
                    type: ButtonType.link,
                    variant: ButtonVariant.primary,
                    icon: IconType.add,
                    link: '/erp/inventory/fillings/create'
                }
            ]}
        >
            <GenericTable
                rowData={rowData}
                loading={loading}
                exportTitle={'all-fillings-' + Date.now()}
                showFooter={rowData.length > 0}
                columns={[
                    {
                        accessor: 'filling_code',
                        title: 'Filling Code',
                        sortable: true,
                        footer: (
                            rowData.length > 0 &&
                            <div className='flex gap-2 justify-start items-center'>
                                <span>Fillings:</span>
                                <span>{rowData.length}</span>
                            </div>
                        )
                    },
                    {
                        accessor: 'production.batch_number',
                        title: 'Batch Number',
                        sortable: true,
                        footer: (
                            rowData.length > 0 &&
                            <div className='flex gap-2 justify-start items-center'>
                                <span>Productions:</span>
                                <span>{rowData.length}</span>
                            </div>
                        )
                    },
                    {
                        accessor: 'production.no_of_quantity',
                        title: 'Quantity (KG)',
                        sortable: true,
                        footer: (
                            rowData.length > 0 &&
                            <div className='flex gap-2 justify-start items-center'>
                                <span className='h-3 w-3'>
                                    {getIcon(IconType.sum)}
                                </span>
                                <span>
                                    {rowData.reduce((acc, item: any) => acc + parseFloat(item.production.no_of_quantity), 0)}
                                </span>
                            </div>
                        )
                    },
                    {
                        accessor: 'filling_date',
                        title: 'Filling Date',
                        sortable: true,
                    },
                    {
                        accessor: 'filling_time',
                        title: 'Filling Time',
                        sortable: true,
                    },
                    {
                        accessor: 'working_shift.name',
                        title: 'Filling Shift',
                        sortable: true,
                    },
                    {
                        accessor: 'is_active',
                        title: 'Status',
                        render: (row: any) => (
                            <span className={`badge bg-${row.is_active ? 'warning' : 'success'}`}>
                                {row.is_active ? 'Pending' : 'Completed'}
                            </span>
                        ),
                        sortable: true,
                        footer: (
                            rowData.length > 0 &&
                            <div className="flex justify-start items-center gap-3">
                                <div className='flex gap-2 justify-start items-center'>
                                    <span>C: </span>
                                    <span>{rowData.reduce((acc: any, item: any) => !item.is_active ? acc + 1 : 0, 0)}</span>
                                </div>
                                <div className='flex gap-2 justify-start items-center'>
                                    <span>P: </span>
                                    <span>{rowData.reduce((acc: any, item: any) => item.is_active ? acc + 1 : 0, 0)}</span>
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
                                    icon={IconType.print}
                                    color={ButtonVariant.secondary}
                                    tooltip="Print"
                                    link={`/erp/inventory/fillings/print/${row.id}`}
                                />

                                <IconButton
                                    icon={IconType.view}
                                    color={ButtonVariant.info}
                                    tooltip="View"
                                    link={`/erp/inventory/fillings/view/${row.id}`}
                                />

                                {/*<IconButton*/}
                                {/*    icon={IconType.edit}*/}
                                {/*    color={ButtonVariant.primary}*/}
                                {/*    tooltip="Edit"*/}
                                {/*    link={`/erp/inventory/fillings/edit/${row.id}`}*/}
                                {/*/>*/}

                            </div>
                        ),
                    },
                ]}
            />
        </PageWrapper>
    );
};

export default Index;
