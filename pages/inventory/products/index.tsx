import React, {useEffect, useState} from 'react';
import Swal from 'sweetalert2';
import {useDispatch, useSelector} from 'react-redux';
import {setPageTitle} from '@/store/slices/themeConfigSlice';
import {ThunkDispatch} from "redux-thunk";
import {IRootState} from "@/store";
import {AnyAction} from "redux";
import {clearRawProductState, deleteRawProduct, getRawProducts} from "@/store/slices/rawProductSlice";
import {setAuthToken, setContentType} from "@/configs/api.config";
import GenericTable from "@/components/GenericTable";
import Preview from "@/pages/inventory/products/preview";
import IconButton from "@/components/IconButton";
import {ButtonSize, ButtonType, ButtonVariant, IconType} from "@/utils/enums";
import PageWrapper from "@/components/PageWrapper";
import Button from "@/components/Button";
import {capitalizeFirstLetter, generatePDF, getIcon} from "@/utils/helper";

const Index = () => {
    const dispatch = useDispatch<ThunkDispatch<IRootState, any, AnyAction>>();
    const {token} = useSelector((state: IRootState) => state.user);
    const rawProducts = useSelector((state: IRootState) => state.rawProduct);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [rowData, setRowData] = useState([]);
    const [printLoading, setPrintLoading] = useState<boolean>(false)
    const breadCrumbItems = [
        {
            title: 'Home',
            href: '/main',
        },
        {
            title: 'Inventory Dashboard',
            href: '/inventory',
        },
        {
            title: 'Materials',
            href: '#',
        },
    ];
    const getRowItems = () => {
        setAuthToken(token)
        setContentType('application/json')
        dispatch(getRawProducts([]))
    }

    useEffect(() => {
        dispatch(setPageTitle('All Raw Materials'));
        dispatch(clearRawProductState());
        getRowItems();
    }, []);

    useEffect(() => {
        if (rawProducts.allRawProducts) {
            setRowData(rawProducts.allRawProducts)
        }
    }, [rawProducts.allRawProducts]);

    const colName = ['id', 'item_code', 'title', 'unit.name', 'valuation_method', 'is_active'];
    const heads = ['Id', 'Code', 'Title', 'Unit-Sub', 'In Stock', 'Opening Unit Balance-Total', 'Valuation Method', 'Status'];

    const handleDeleteRawProduct = (id: number) => {
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
                dispatch(deleteRawProduct(id));
                setDeleteLoading(true);
            }
        });
    }

    useEffect(() => {
        if (!deleteLoading) return;
        if (rawProducts.success) {
            getRowItems();
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
    }, [rawProducts.success]);

    return (
        <PageWrapper
            breadCrumbItems={breadCrumbItems}
            embedLoader={false}
        >
            <div>
                <div className="mb-5 flex items-center justify-between">
                    <h5 className="text-lg font-semibold dark:text-white-light">
                        Raw Products
                    </h5>
                    <Button
                        text={<span className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                 viewBox="0 0 24 24"
                                 className="h-5 w-5 ltr:mr-2 rtl:ml-2"
                                 fill="none">
                                <circle cx="12" cy="12" r="10" stroke="currentColor"
                                        strokeWidth="1.5"/>
                                <path d="M15 12L12 12M12 12L9 12M12 12L12 9M12 12L12 15"
                                      stroke="currentColor"
                                      strokeWidth="1.5" strokeLinecap="round"/>
                            </svg>
                            Add New
                        </span>}
                        type={ButtonType.link}
                        variant={ButtonVariant.primary}
                        link="/inventory/products/create"
                        size={ButtonSize.small}
                    />
                </div>
                <GenericTable
                    colName={colName}
                    header={heads}
                    rowData={rowData}
                    loading={rawProducts.loading}
                    exportTitle={'all-raw-materials-' + Date.now()}
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
                                <span>
                                    {
                                        row.product_type
                                            .split('-')
                                            .map(capitalizeFirstLetter)
                                            .join(' ')
                                    }
                                </span>
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
                                        <span>{rowData.reduce((acc: any, item: any) => item.valuation_method === 'Average' ? acc + 1 : 0, 0)}</span>
                                    </div>
                                    <div className='flex gap-2 justify-start items-center'>
                                        <span>LIFO: </span>
                                        <span>{rowData.reduce((acc: any, item: any) => item.valuation_method === 'LIFO' ? acc + 1 : 0, 0)}</span>
                                    </div>
                                    <div className='flex gap-2 justify-start items-center'>
                                        <span>FIFO: </span>
                                        <span>{rowData.reduce((acc: any, item: any) => item.valuation_method === 'FIFO' ? acc + 1 : 0, 0)}</span>
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
                            render: (row: any) => (
                                <div className="flex items-center gap-3">
                                    <IconButton
                                        icon={IconType.print}
                                        color={ButtonVariant.secondary}
                                        tooltip='Print'
                                        disabled={printLoading}
                                        classes={printLoading ? 'cursor-not-allowed opacity-8' : ''}
                                        onClick={() => generatePDF(<Preview content={row}/>, setPrintLoading)}
                                    />

                                    <IconButton
                                        icon={IconType.view}
                                        color={ButtonVariant.info}
                                        tooltip='View'
                                        link={`/inventory/products/view/${row.id}`}
                                    />
                                    <IconButton
                                        icon={IconType.edit}
                                        color={ButtonVariant.primary}
                                        tooltip='Edit'
                                        link={`/inventory/products/edit/${row.id}`}
                                    />
                                    {/*<IconButton*/}
                                    {/*    icon={IconType.delete}*/}
                                    {/*    color={ButtonVariant.danger}*/}
                                    {/*    tooltip='Delete'*/}
                                    {/*    onClick={() => handleDeleteRawProduct(row.id)}*/}
                                    {/*/>*/}
                                </div>
                            )
                        }
                    ]}
                />
            </div>
        </PageWrapper>
    );
};

export default Index;
