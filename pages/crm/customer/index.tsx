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
import Preview from "@/pages/inventory/productions/preview";
import IconButton from "@/components/IconButton";
import {ButtonSize, ButtonType, ButtonVariant, IconType} from "@/utils/enums";
import PageWrapper from "@/components/PageWrapper";
import Button from "@/components/Button";
import {generatePDF, getIcon} from "@/utils/helper";

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
            title: 'Customer Dashboard',
            href: '/Customer',
        },
        {
            title: 'Customer',
            href: '#',
        },
    ];
    const getRowItems = () => {
        setAuthToken(token)
        setContentType('application/json')
        dispatch(getRawProducts())
    }

    useEffect(() => {
        dispatch(setPageTitle('Customer Details'));
        dispatch(clearRawProductState());
        getRowItems();
    }, []);

    useEffect(() => {
        if (rawProducts.allRawProducts) {
            setRowData(rawProducts.allRawProducts)
        }
    }, [rawProducts.allRawProducts]);

    const colName = ['id', 'code', 'Name', 'phone', 'email', 'address','City State','country','postal code','is_active'];
    const heads = ['Id', 'Code', 'Name', 'Phone', 'Email', 'Adress','address','City State','country','postal code', 'Valuation Method', 'Status'];

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
                        Customer Details
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
                        link="/customer/create"
                        size={ButtonSize.small}
                    />
                </div>
                <GenericTable
                    colName={colName}
                    header={heads}
                    rowData={[]}
                    loading={rawProducts.loading}
                    exportTitle={'all-raw-materials-' + Date.now()}
                    showFooter={false}
                    columns={[
                        {
                            accessor: 'Code',
                            title: 'Code',
                            sortable: true,
                            footer: (
                                rowData.length > 0 &&
                                <div className='flex gap-2 justify-start items-center'>
                                    <span>Items:</span>
                                    <span>{}</span>
                                </div>
                            )
                        },
                        {
                            accessor: 'name',
                            title: 'Name',
                            sortable: true
                        },
                        {
                            accessor: 'phone',
                            title: 'Phone',
                            render: (row: any) => (
                                <span>{}</span>
                            ),
                            sortable: true
                        },
                        {
                            accessor: 'emial',
                            title: 'Email',
                            sortable: true,
                            footer: (
                                rowData.length > 0 &&
                                <div className='flex gap-2 justify-start items-center'>
                                    <span className='h-3 w-3'>
                                        {getIcon(IconType.sum)}
                                    </span>
                                    <span>{}</span>
                                </div>
                            )
                        },
                        {
                            accessor: 'address',
                            title: 'Address',
                            render: (row: any) => (
                                <span>
                                    {}
                                </span>
                            ),
                            footer: (
                                rowData.length > 0 &&
                                <div className="flex justify-start items-center gap-3">
                                    <div className='flex gap-2 justify-start items-center'>
                                        <span className='h-3 w-3'>
                                            {getIcon(IconType.sum)}
                                        </span>
                                        <span>{}</span>
                                    </div>
                                    <span> - </span>
                                    <div className='flex gap-2 justify-start items-center'>
                                        <span className='h-3 w-3'>
                                            {getIcon(IconType.sum)}
                                        </span>
                                        <span>{}</span>
                                    </div>
                                </div>
                            ),
                            sortable: true
                        },
                        {
                            accessor: 'city State',
                            title: 'City State',
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
                            accessor: 'country ',
                            title: 'Country',
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
                            accessor: 'Postal Code',
                            title: 'Postal Code',
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
