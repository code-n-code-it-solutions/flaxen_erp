import React, {useEffect, useState} from 'react';
import Swal from 'sweetalert2';
import {useDispatch, useSelector} from 'react-redux';
import {setPageTitle} from '@/store/slices/themeConfigSlice';
import {ThunkDispatch} from 'redux-thunk';
import {IRootState} from '@/store';
import {AnyAction} from 'redux';
import {setAuthToken, setContentType} from '@/configs/api.config';
import GenericTable from '@/components/GenericTable';
import IconButton from '@/components/IconButton';
import {ButtonSize, ButtonType, ButtonVariant, IconType} from '@/utils/enums';
import {generatePDF, getIcon} from '@/utils/helper';
import Preview from '@/pages/inventory/productions/preview';
import Button from "@/components/Button";
import PageWrapper from "@/components/PageWrapper";
import {deleteFilling, getFillings} from "@/store/slices/fillingSlice";

const Index = () => {
    const dispatch = useDispatch<ThunkDispatch<IRootState, any, AnyAction>>();
    const {token} = useSelector((state: IRootState) => state.user);
    const {fillings, loading, success} = useSelector((state: IRootState) => state.filling);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [printLoading, setPrintLoading] = useState<boolean>(false);
    const [rowData, setRowData] = useState([]);

    const breadcrumbItems = [
        {
            title: 'Home',
            href: '/main',
        },
        {
            title: 'Inventory Dashboard',
            href: '/inventory',
        },
        {
            title: 'All Fillings',
            href: '#',
        },
    ];

    const getRowItems = () => {
        setAuthToken(token);
        setContentType('application/json');
        dispatch(getFillings());
    };

    useEffect(() => {
        getRowItems();
        dispatch(setPageTitle('All Fillings'));
    }, []);

    useEffect(() => {
        if (fillings) {
            setRowData(fillings);
        }
    }, [fillings]);

    const colName = ['id', 'filling_code', 'production_code', 'no_of_quantity', 'filling_date', 'filling_time', 'filling_shift', 'is_active'];
    const header = ['Id', 'Filling Code', 'Production Code', '# of Qty (KG)', 'Filling Date', 'Filling Time', 'Filling Shift', 'Status'];

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
                dispatch(deleteFilling(id));
                setDeleteLoading(true);
            }
        });
    };

    useEffect(() => {
        if (!deleteLoading) return;
        if (success) {
            getRowItems();
            setDeleteLoading(false);
            Swal.fire({
                title: 'Deleted!',
                text: 'Your file has been deleted.',
                icon: 'success',
                customClass: 'sweet-alerts',
            });
        } else {
            Swal.fire({title: 'Failed!', text: 'Something went wrong.', icon: 'error', customClass: 'sweet-alerts'});
        }
    }, [success]);

    return (
        <PageWrapper
            embedLoader={true}
            breadCrumbItems={breadcrumbItems}
            loading={loading}
        >
            <div className="mb-5 flex items-center justify-between">
                <h5 className="text-lg font-semibold dark:text-white-light">All Fillings</h5>
                <Button
                    type={ButtonType.link}
                    text={
                        <span className="flex items-center">
                            {getIcon(IconType.add)}
                            Add New
                        </span>
                    }
                    variant={ButtonVariant.primary}
                    link="/inventory/fillings/create"
                    size={ButtonSize.small}
                />
            </div>
            <GenericTable
                colName={colName}
                header={header}
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
                                    onClick={() => generatePDF(<Preview content={row}/>, setPrintLoading)}
                                />

                                <IconButton
                                    icon={IconType.view}
                                    color={ButtonVariant.info}
                                    tooltip="View"
                                    link={`/inventory/fillings/view/${row.id}`}
                                />
                                {row.is_active ? (
                                    <IconButton
                                        icon={IconType.edit}
                                        color={ButtonVariant.primary}
                                        tooltip="Edit"
                                        link={`/inventory/fillings/edit/${row.id}`}
                                    />
                                ) : <></>}


                            </div>
                        ),
                    },
                ]}
            />
        </PageWrapper>
    );
};

export default Index;
