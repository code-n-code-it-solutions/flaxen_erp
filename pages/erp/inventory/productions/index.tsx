import React, {useEffect, useState} from 'react';
import {setPageTitle} from '@/store/slices/themeConfigSlice';
import {useAppDispatch, useAppSelector} from '@/store';
import {setAuthToken, setContentType} from '@/configs/api.config';
import GenericTable from '@/components/GenericTable';
import {getProductions} from '@/store/slices/productionSlice';
import IconButton from '@/components/IconButton';
import {ButtonType, ButtonVariant, IconType} from '@/utils/enums';
import {getIcon} from '@/utils/helper';
import {uniqBy} from "lodash";
import PageWrapper from "@/components/PageWrapper";

const Index = () => {
    const dispatch = useAppDispatch();
    const {token} = useAppSelector(state => state.user);
    const {allProductions, loading, success} = useAppSelector(state => state.production);
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
            title: 'All Productions',
            href: '#',
        },
    ];

    useEffect(() => {
        setAuthToken(token);
        setContentType('application/json');
        dispatch(getProductions());
        dispatch(setPageTitle('All Productions'));
    }, []);

    useEffect(() => {
        if (allProductions) {
            setRowData(allProductions);
        }
    }, [allProductions]);

    return (
        <PageWrapper
            embedLoader={true}
            breadCrumbItems={breadcrumbItems}
            loading={loading}
            title="All Productions"
            buttons={[
                {
                    text: 'Create New',
                    type: ButtonType.link,
                    variant: ButtonVariant.primary,
                    icon: IconType.add,
                    link: '/erp/inventory/productions/create'
                }
            ]}
        >
            <GenericTable
                rowData={rowData}
                loading={loading}
                exportTitle={'all-production-' + Date.now()}
                showFooter={rowData.length > 0}
                columns={[
                    {
                        accessor: 'batch_number',
                        title: 'Code',
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
                        accessor: 'no_of_quantity',
                        title: 'Quantity (KG)',
                        sortable: true,
                        footer: (
                            rowData.length > 0 &&
                            <div className='flex gap-2 justify-start items-center'>
                                <span className='h-3 w-3'>
                                    {getIcon(IconType.sum)}
                                </span>
                                <span>
                                    {rowData.reduce((acc, item: any) => acc + parseFloat(item.no_of_quantity), 0)}
                                </span>
                            </div>
                        )
                    },
                    {
                        accessor: 'product_assembly.formula_name',
                        title: 'Formula',
                        render: (row: any) =>
                            <span>{row.product_assembly.formula_name + ' (' + row.product_assembly.formula_code + ')'}</span>,
                        sortable: true,
                        footer: (
                            rowData.length > 0 &&
                            <div className='flex gap-2 justify-start items-center'>
                                <span>Formulas:</span>
                                <span>{uniqBy(rowData, (record: any) => record.product_assembly.formula_code).length}</span>
                            </div>
                        )
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
                                    <span>{rowData.reduce((acc: any, item: any) => !item.is_active ? acc + 1 : acc, 0)}</span>
                                </div>
                                <div className='flex gap-2 justify-start items-center'>
                                    <span>P: </span>
                                    <span>{rowData.reduce((acc: any, item: any) => item.is_active ? acc + 1 : acc, 0)}</span>
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
                                    link={`/erp/inventory/productions/print/${row.id}`}
                                />

                                <IconButton
                                    icon={IconType.view}
                                    color={ButtonVariant.info}
                                    tooltip="View"
                                    link={`/erp/inventory/productions/view/${row.id}`}
                                />

                                {/*<IconButton*/}
                                {/*    icon={IconType.edit}*/}
                                {/*    color={ButtonVariant.primary}*/}
                                {/*    tooltip="Edit"*/}
                                {/*    link={`/erp/inventory/productions/edit/${row.id}`}*/}
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
