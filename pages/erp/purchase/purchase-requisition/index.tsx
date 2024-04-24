import {useEffect, useState} from 'react';
import Swal from 'sweetalert2';
import {setPageTitle} from '@/store/slices/themeConfigSlice';
import {useAppDispatch, useAppSelector} from "@/store";
import {setAuthToken, setContentType} from "@/configs/api.config";
import GenericTable from "@/components/GenericTable";
import {
    clearPurchaseRequisitionState,
    deletePurchaseRequisition,
    getPurchaseRequisitions
} from "@/store/slices/purchaseRequisitionSlice";
import 'tippy.js/dist/tippy.css';
import IconButton from "@/components/IconButton";
import {ButtonType, ButtonVariant, IconType} from "@/utils/enums";
import PageWrapper from "@/components/PageWrapper";
import {capitalize, isNull} from "lodash";

const Index = () => {
    const dispatch = useAppDispatch();
    const {token} = useAppSelector(state => state.user);
    const {purchaseRequests, loading, success} = useAppSelector(state => state.purchaseRequisition);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const breadCrumbItems = [
        {
            title: 'Home',
            href: '/erp/main',
        },
        {
            title: 'Purchase Dashboard',
            href: '/erp/purchase',
        },
        {
            title: 'All Purchase Requisition',
            href: '#',
        },
    ];

    const [rowData, setRowData] = useState([]);

    const getRequisitions = () => {
        setAuthToken(token)
        setContentType('application/json')
        dispatch(getPurchaseRequisitions())
    }

    useEffect(() => {
        getRequisitions();
        dispatch(setPageTitle('All Purchase Requisition'));
        dispatch(clearPurchaseRequisitionState());
    }, []);

    useEffect(() => {
        if (purchaseRequests) {
            setRowData(purchaseRequests)
        }
    }, [purchaseRequests]);

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
                dispatch(deletePurchaseRequisition(id));
                setDeleteLoading(true);
            }
        });
    }

    useEffect(() => {
        if (!deleteLoading) return;
        if (success) {
            getRequisitions();
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
            embedLoader={true}
            loading={loading}
            breadCrumbItems={breadCrumbItems}
            title={'All Purchase Requisition'}
            buttons={[
                {
                    text: 'Add New',
                    type: ButtonType.link,
                    variant: ButtonVariant.primary,
                    icon: IconType.add,
                    link: '/erp/purchase/purchase-requisition/create'
                }
            ]}
        >
            <GenericTable
                rowData={rowData}
                loading={loading}
                exportTitle={'all-purchase-request-' + Date.now()}
                columns={[
                    {
                        accessor: 'pr_title',
                        title: 'Title',
                        sortable: true
                    },
                    {
                        accessor: 'pr_code',
                        title: 'Code',
                        sortable: true
                    },
                    {
                        accessor: 'generation_type',
                        title: 'Generation Type',
                        render: (row: any) => (
                            <span>{capitalize(row.generation_type)}</span>
                        ),
                        sortable: true
                    },
                    {
                        accessor: 'description',
                        title: 'Description',
                        sortable: true
                    },
                    {
                        accessor: 'employee.name',
                        title: 'Employee',
                        sortable: true
                    },
                    {
                        accessor: 'department?.name',
                        title: 'Department',
                        sortable: true
                    },
                    {
                        accessor: 'designation?.name',
                        title: 'Designation',
                        sortable: true
                    },
                    {
                        accessor: 'type',
                        title: 'Type',
                        sortable: true
                    },
                    {
                        accessor: 'requisition_date',
                        title: 'Required Date',
                        sortable: true
                    },
                    {
                        accessor: 'lpo',
                        title: 'LPO Code',
                        render: (row: any) => (
                            <span>{row.lpo ? row.lpo.lpo_number : 'N/A'}</span>
                        ),
                        sortable: true
                    },
                    {
                        accessor: 'lpo.goods_received_note.code',
                        title: 'Goods Received Note',
                        render: (row: any) => (
                            <span>
                                {row.lpo?.goods_received_note ? row.lpo.goods_received_note?.code : 'N/A'}
                            </span>
                        ),
                        sortable: true
                    },
                    {
                        accessor: 'status',
                        title: 'Status',
                        sortable: true
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
                                    link={`/erp/purchase/purchase-requisition/print/${row.id}`}
                                />

                                <IconButton
                                    icon={IconType.view}
                                    color={ButtonVariant.info}
                                    tooltip="View"
                                    link={`/erp/purchase/purchase-requisition/view/${row.id}`}
                                />

                                {isNull(row.lpo) && (
                                    <>
                                        {/*<IconButton*/}
                                        {/*    icon={IconType.edit}*/}
                                        {/*    color={ButtonVariant.primary}*/}
                                        {/*    tooltip="Edit"*/}
                                        {/*    link={`/erp/purchase/purchase-requisition/edit/${row.id}`}*/}
                                        {/*/>*/}
                                        <IconButton
                                            icon={IconType.delete}
                                            color={ButtonVariant.danger}
                                            tooltip="Delete"
                                            onClick={() => handleDelete(row.id)}
                                        />
                                    </>
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
