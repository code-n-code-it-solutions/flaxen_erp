import React, {useEffect, useState} from 'react';
import Swal from 'sweetalert2';
import {setPageTitle} from '@/store/slices/themeConfigSlice';
import {useAppDispatch, useAppSelector} from "@/store";
import {setAuthToken, setContentType} from "@/configs/api.config";
import GenericTable from "@/components/GenericTable";
import {deleteProductAssembly, getProductAssemblies} from "@/store/slices/productAssemblySlice";
import 'tippy.js/dist/tippy.css';
import IconButton from "@/components/IconButton";
import {ButtonType, ButtonVariant, IconType} from "@/utils/enums";
import PageWrapper from "@/components/PageWrapper";
import {getIcon} from "@/utils/helper";
import {uniqBy} from "lodash";

const Index = () => {
    const dispatch = useAppDispatch();
    const {token} = useAppSelector((state) => state.user);
    const {allProductAssemblies, loading, success} = useAppSelector((state) => state.productAssembly);
    const [deleteLoading, setDeleteLoading] = useState(false);
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
            title: 'All Product Assemblies',
            href: '#',
        },
    ];

    const getRawItems = () => {
        setAuthToken(token)
        setContentType('application/json')
        dispatch(getProductAssemblies())
    }

    useEffect(() => {
        dispatch(setPageTitle('All Product Assemblies'));
        getRawItems();
    }, []);

    useEffect(() => {
        if (allProductAssemblies) {
            setRowData(allProductAssemblies)
        }
    }, [allProductAssemblies]);


    const handleDelete = (id: number) => {
        Swal.fire({
            icon: 'warning',
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            showCancelButton: true,
            confirmButtonText: 'Delete',
            padding: '2em',
            customClass: 'sweet-alerts',
        }).then((result) => {
            if (result.value) {
                dispatch(deleteProductAssembly(id));
                setDeleteLoading(true);
            }
        });
    }

    useEffect(() => {
        if (!deleteLoading) return;
        if (success) {
            getRawItems();
            setDeleteLoading(false);
            Swal.fire({
                title: 'Deleted!',
                text: 'Your file has been deleted.',
                icon: 'success',
                customClass: 'sweet-alerts'
            });
        } else {
            Swal.fire({title: 'Failed!', text: 'Something went wrong.', icon: 'error', customClass: 'sweet-alerts'});
        }
    }, [success]);

    return (
        <PageWrapper
            breadCrumbItems={breadCrumbItems}
            embedLoader={false}
            title="All Formulas"
            buttons={[
                {
                    text: 'Create New',
                    type: ButtonType.link,
                    variant: ButtonVariant.primary,
                    icon: IconType.add,
                    link: '/erp/inventory/product-assembly/create'
                }
            ]}
        >
            <GenericTable
                rowData={rowData.length > 0 ? rowData : []}
                loading={loading}
                exportTitle={'all-formula-' + Date.now()}
                showFooter={rowData.length > 0}
                columns={[
                    {
                        accessor: 'formula_code',
                        title: 'Code',
                        sortable: true,
                        footer: (
                            rowData.length > 0 &&
                            <div className='flex gap-2 justify-start items-center'>
                                <span>Formulas:</span>
                                <span>{rowData.length}</span>
                            </div>
                        )
                    },
                    {
                        accessor: 'formula_name',
                        title: 'Title',
                        sortable: true
                    },
                    {
                        accessor: 'category.name',
                        title: 'Category',
                        sortable: true,
                        footer: (
                            rowData.length > 0 &&
                            <div className='flex gap-2 justify-start items-center'>
                                <span>Categories:</span>
                                <span>{uniqBy(rowData, (record: any) => record.category.name).length}</span>
                            </div>
                        )
                    },
                    {
                        accessor: 'color_code',
                        title: 'Color',
                        render: (row: any) => (
                            <div className='flex justify-start items-center gap-2'>
                                <div className="w-6 h-6 rounded-full"
                                     style={{backgroundColor: `${row.color_code.hex_code}`}}></div>
                                {row.color_code.name} ({row.color_code.code})
                            </div>
                        ),
                        sortable: true,
                        footer: (
                            rowData.length > 0 &&
                            <div className='flex gap-2 justify-start items-center'>
                                <span>Colors:</span>
                                <span>{uniqBy(rowData, (record: any) => record.color_code.hex_code).length}</span>
                            </div>
                        )
                    },
                    {
                        accessor: 'quantity',
                        title: 'Quantity',
                        render: (row: any) => {
                            let total: any = row.product_assembly_items.reduce((sum: number, row: any) => sum + +row.quantity, 0)
                            return isNaN(total) ? 0 : total.toFixed(2);
                        },
                        sortable: true,
                        footer: (
                            rowData.length > 0 &&
                            <div className='flex gap-2 justify-start items-center'>
                                <span className='h-3 w-3'>
                                    {getIcon(IconType.sum)}
                                </span>
                                <span>
                                    {rowData.reduce((acc, item: any) => acc + item.product_assembly_items.reduce((accInner: any, itemInner: any) => accInner + parseFloat(itemInner.quantity), 0), 0).toFixed(2)}
                                </span>
                            </div>
                        )
                    },
                    {
                        accessor: 'cost',
                        title: 'Cost',
                        render: (row: any) => row.product_assembly_items.reduce((sum: number, row: any) => sum + parseFloat(row.cost), 0).toFixed(2),
                        sortable: true,
                        footer: (
                            rowData.length > 0 &&
                            <div className='flex gap-2 justify-start items-center'>
                                <span className='h-3 w-3'>
                                    {getIcon(IconType.sum)}
                                </span>
                                <span>
                                    {rowData.reduce((acc, item: any) => acc + item.product_assembly_items.reduce((accInner: any, itemInner: any) => accInner + parseFloat(itemInner.cost), 0), 0).toFixed(2)}
                                </span>
                            </div>
                        )
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
                            rowData.length > 0 &&
                            <div className="flex justify-start items-center gap-3">
                                <div className='flex gap-2 justify-start items-center'>
                                    <span>Active: </span>
                                    <span>{rowData.reduce((acc: any, item: any) => item.is_active ? acc + 1 : acc, 0)}</span>
                                </div>
                                <div className='flex gap-2 justify-start items-center'>
                                    <span>Not Active: </span>
                                    <span>{rowData.reduce((acc: any, item: any) => !item.is_active ? acc + 1 : acc, 0)}</span>
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
                                    tooltip='Print'
                                    link={`/erp/inventory/product-assembly/print/${row.id}`}
                                />

                                <IconButton
                                    icon={IconType.view}
                                    color={ButtonVariant.info}
                                    tooltip='View'
                                    link={`/erp/inventory/product-assembly/view/${row.id}`}
                                />

                                {/*<IconButton*/}
                                {/*    icon={IconType.edit}*/}
                                {/*    color={ButtonVariant.primary}*/}
                                {/*    tooltip='Edit'*/}
                                {/*    link={`/erp/inventory/product-assembly/edit/${row.id}`}*/}
                                {/*/>*/}

                                {!row.is_used && (
                                    <IconButton
                                        icon={IconType.delete}
                                        color={ButtonVariant.danger}
                                        tooltip='Delete'
                                        onClick={() => handleDelete(row.id)}
                                    />
                                )}

                            </div>
                        )
                    }
                ]}
            />

        </PageWrapper>
    );
};

export default Index;
