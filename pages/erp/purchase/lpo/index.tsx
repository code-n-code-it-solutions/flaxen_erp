import {useEffect, useState} from 'react';
import Swal from 'sweetalert2';
import {setPageTitle} from '@/store/slices/themeConfigSlice';
import {useAppDispatch, useAppSelector} from "@/store";
import {setAuthToken, setContentType} from "@/configs/api.config";
import GenericTable from "@/components/GenericTable";
import {deleteLPO, getLPO} from "@/store/slices/localPurchaseOrderSlice";
import IconButton from "@/components/IconButton";
import {ButtonType, ButtonVariant, IconType} from "@/utils/enums";
import PageWrapper from "@/components/PageWrapper";
import {capitalize, isNull} from "lodash";

const Index = () => {
    const dispatch = useAppDispatch();
    const {token} = useAppSelector(state => state.user);
    const {allLPOs, loading, success} = useAppSelector(state => state.localPurchaseOrder);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [rowData, setRowData] = useState([]);
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
            title: 'All LPO',
            href: '#',
        },
    ];

    useEffect(() => {
        dispatch(setPageTitle('All LPOs'));
        setAuthToken(token)
        setContentType('application/json')
        dispatch(getLPO())
    }, []);

    useEffect(() => {
        if (allLPOs) {
            setRowData(allLPOs)
        }
    }, [allLPOs]);

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
                dispatch(deleteLPO(id));
                setDeleteLoading(true);
            }
        });
    }

    useEffect(() => {
        if (!deleteLoading) return;
        if (success) {
            dispatch(getLPO())
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
            title={'All LPOs'}
            buttons={[
                {
                    text: 'Add New',
                    type: ButtonType.link,
                    variant: ButtonVariant.primary,
                    icon: IconType.add,
                    link: '/erp/purchase/lpo/create'
                }
            ]}
        >
            <GenericTable
                rowData={rowData}
                loading={loading}
                exportTitle={'all-lpo-' + Date.now()}
                columns={[
                    {
                        accessor: 'lpo_number',
                        title: 'LPO #',
                        sortable: true
                    },
                    {
                        accessor: 'purchase_requisition.pr_code',
                        title: 'Requisition Code',
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
                        accessor: 'type',
                        title: 'Type',
                        sortable: true
                    },
                    {
                        accessor: 'internal_document_number',
                        title: 'ID #',
                        sortable: true
                    },
                    {
                        accessor: 'vendor.name',
                        title: 'Vendor',
                        render: (row: any) => (
                            <span>{row.vendor?.name}</span>
                        ),
                        sortable: true
                    },
                    {
                        accessor: 'vendor_representative.name',
                        title: 'V Representative',
                        render: (row: any) => (
                            <span>{row.vendor_representative?.name}</span>
                        ),
                        sortable: true
                    },

                    {
                        accessor: 'delivery_due_date',
                        title: 'Due Date',
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
                                    link={`/erp/purchase/lpo/print/${row.id}`}
                                />

                                <IconButton
                                    icon={IconType.view}
                                    color={ButtonVariant.info}
                                    tooltip="View"
                                    link={`/erp/purchase/lpo/view/${row.id}`}
                                />

                                {/*<IconButton*/}
                                {/*    icon={IconType.edit}*/}
                                {/*    color={ButtonVariant.primary}*/}
                                {/*    tooltip="Edit"*/}
                                {/*    link={`/purchase/lpo/edit/${row.id}`}*/}
                                {/*/>*/}

                                {isNull(row.good_receive_note) &&
                                    <IconButton
                                        icon={IconType.delete}
                                        color={ButtonVariant.danger}
                                        tooltip="Delete"
                                        onClick={() => handleDelete(row.id)}
                                    />
                                }

                            </div>
                        )
                    }
                ]}
            />
        </PageWrapper>
    );
};

export default Index;
