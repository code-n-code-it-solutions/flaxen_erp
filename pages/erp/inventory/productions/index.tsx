import React, {useEffect, useState} from 'react';
import Swal from 'sweetalert2';
import {useDispatch, useSelector} from 'react-redux';
import {setPageTitle} from '@/store/slices/themeConfigSlice';
import {ThunkDispatch} from 'redux-thunk';
import {IRootState} from '@/store';
import {AnyAction} from 'redux';
import {setAuthToken, setContentType} from '@/configs/api.config';
import GenericTable from '@/components/GenericTable';
import 'tippy.js/dist/tippy.css';
import {deleteProduction, getProductions} from '@/store/slices/productionSlice';
import IconButton from '@/components/IconButton';
import {ButtonSize, ButtonType, ButtonVariant, IconType} from '@/utils/enums';
import {generatePDF, getIcon} from '@/utils/helper';
import Preview from '@/pages/erp/inventory/productions/preview';
import {uniqBy} from "lodash";
import Button from "@/components/Button";
import PageWrapper from "@/components/PageWrapper";

const Index = () => {
    const dispatch = useDispatch<ThunkDispatch<IRootState, any, AnyAction>>();
    const {token} = useSelector((state: IRootState) => state.user);
    const {allProductions, loading, success} = useSelector((state: IRootState) => state.production);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [printLoading, setPrintLoading] = useState<boolean>(false);
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

    const getRawItems = () => {
        setAuthToken(token);
        setContentType('application/json');
        dispatch(getProductions());
    };

    useEffect(() => {
        getRawItems();
        dispatch(setPageTitle('All Productions'));
    }, []);

    useEffect(() => {
        if (allProductions) {
            setRowData(allProductions);
        }
    }, [allProductions]);

    const colName = ['id', 'production_code', 'production_name', 'product_assembly', 'is_active'];
    const header = ['Id', 'Production Code', 'Production Name', 'Product Assembly', 'Status'];

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
                dispatch(deleteProduction(id));
                setDeleteLoading(true);
            }
        });
    };

    useEffect(() => {
        if (!deleteLoading) return;
        if (success) {
            getRawItems();
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
                <h5 className="text-lg font-semibold dark:text-white-light">All Productions</h5>
                <Button
                    type={ButtonType.link}
                    text={
                        <span className="flex items-center">
                            {getIcon(IconType.add)}
                            Add New
                        </span>
                    }
                    variant={ButtonVariant.primary}
                    link="/erp/inventory/productions/create"
                    size={ButtonSize.small}
                />
            </div>
            <GenericTable
                colName={colName}
                header={header}
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
                                    onClick={() => generatePDF(<Preview content={row}/>, setPrintLoading)}
                                />

                                <IconButton
                                    icon={IconType.view}
                                    color={ButtonVariant.info}
                                    tooltip="View"
                                    link={`/erp/inventory/productions/view/${row.id}`}
                                />


                                {row.is_active ? (
                                    <>
                                        <IconButton
                                            icon={IconType.edit}
                                            color={ButtonVariant.primary}
                                            tooltip="Edit"
                                            link={`/erp/inventory/productions/edit/${row.id}`}
                                        />
                                        <IconButton
                                            icon={IconType.delete}
                                            color={ButtonVariant.danger}
                                            tooltip="Delete"
                                            onClick={() => handleDelete(row.id)}
                                        />
                                    </>
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
