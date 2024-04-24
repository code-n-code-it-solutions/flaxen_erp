import {useEffect, useState} from 'react';
import {setPageTitle} from '@/store/slices/themeConfigSlice';
import {useAppDispatch, useAppSelector} from "@/store";
import {setAuthToken, setContentType} from "@/configs/api.config";
import GenericTable from "@/components/GenericTable";
import {getGRN} from "@/store/slices/goodReceiveNoteSlice";
import PageWrapper from "@/components/PageWrapper";
import IconButton from "@/components/IconButton";
import {ButtonType, ButtonVariant, IconType} from "@/utils/enums";

const Index = () => {
    const dispatch = useAppDispatch();
    const {token} = useAppSelector(state => state.user);
    const {allGRNs, loading, success} = useAppSelector(state => state.goodReceiveNote);
    const [rowData, setRowData] = useState([]);

    const breadcrumbItems = [
        {
            title: 'Main Dashboard',
            href: '/erp/main',
        },
        {
            title: 'Purchase Dashboard',
            href: '/erp/purchase',
        },
        {
            title: 'All Good Receive Notes',
            href: '#',
        },
    ];

    useEffect(() => {
        setAuthToken(token)
        setContentType('application/json')
        dispatch(getGRN())
        dispatch(setPageTitle('All Good Receive Notes'));
    }, []);

    useEffect(() => {
        if (allGRNs) {
            setRowData(allGRNs)
        }
    }, [allGRNs]);

    return (
        <PageWrapper
            breadCrumbItems={breadcrumbItems}
            loading={loading}
            embedLoader={true}
            title="All Good Receive Notes"
            buttons={[
                {
                    text: 'Create New',
                    icon: IconType.add,
                    type: ButtonType.link,
                    variant: ButtonVariant.primary,
                    link: '/erp/purchase/good-receive-note/create'
                }
            ]}
        >
            <GenericTable
                rowData={rowData}
                loading={loading}
                exportTitle={'all-lpo-' + Date.now()}
                columns={[
                    {
                        accessor: 'grn_number',
                        title: 'GRN #',
                        sortable: true
                    },
                    {
                        accessor: 'local_purchase_order.lpo_number',
                        title: 'LPO #',
                        sortable: true
                    },
                    {
                        accessor: 'local_purchase_order.purchase_requisition.pr_code',
                        title: 'Requisition Code',
                        sortable: true
                    },
                    {
                        accessor: 'local_purchase_order.internal_document_number',
                        title: 'ID #',
                        sortable: true
                    },
                    {
                        accessor: 'vendor.name',
                        title: 'Vendor',
                        render: (row: any) => (
                            <span>{row.local_purchase_order.vendor.name}</span>
                        ),
                        sortable: true
                    },
                    {
                        accessor: 'vendor_representative.name',
                        title: 'V Representative',
                        render: (row: any) => (
                            <span>{row.local_purchase_order.vendor_representative.name}</span>
                        ),
                        sortable: true
                    },
                    {
                        accessor: 'actions',
                        title: 'Actions',
                        render: (row: any) => (
                            <div className="flex items-center gap-3">
                                <IconButton
                                    icon={IconType.print}
                                    color={ButtonVariant.info}
                                    link={`/erp/purchase/good-receive-note/print/${row.id}`}
                                    tooltip='Print'
                                />

                                {/*<IconButton*/}
                                {/*    icon={IconType.edit}*/}
                                {/*    color={ButtonVariant.primary}*/}
                                {/*    link={`/purchase/good-receive-note/edit/${row.id}`}*/}
                                {/*    tooltip='Edit'*/}
                                {/*/>*/}

                                <IconButton
                                    icon={IconType.view}
                                    color={ButtonVariant.success}
                                    link={`/erp/purchase/good-receive-note/view/${row.id}`}
                                    tooltip='View'
                                />
                            </div>
                        )
                    }
                ]}
            />

        </PageWrapper>
    );
};

export default Index;
