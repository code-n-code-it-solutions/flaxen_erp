import React, {useEffect, useState} from 'react';
import {setPageTitle} from '@/store/slices/themeConfigSlice';
import {useAppDispatch, useAppSelector} from "@/store";
import {setAuthToken, setContentType} from "@/configs/api.config";
import GenericTable from "@/components/GenericTable";
import {getVendorBills} from "@/store/slices/vendorBillSlice";
import {capitalize, isNull} from "lodash";
import PageWrapper from "@/components/PageWrapper";
import IconButton from "@/components/IconButton";
import {ButtonType, ButtonVariant, IconType} from "@/utils/enums";

const Index = () => {
    const dispatch = useAppDispatch();
    const {token} = useAppSelector(state => state.user);
    const {vendorBills, loading, success} = useAppSelector(state => state.vendorBill);
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
            title: 'All Vendor Bills',
            href: '#',
        },
    ]

    useEffect(() => {
        setAuthToken(token)
        setContentType('application/json')
        dispatch(getVendorBills())
        dispatch(setPageTitle('All Vendor Bills'));
    }, []);

    useEffect(() => {
        if (vendorBills) {
            setRowData(vendorBills)
        }
    }, [vendorBills]);

    return (
        <PageWrapper
            embedLoader={true}
            loading={loading}
            breadCrumbItems={breadcrumbItems}
            title="All Vendor Bills"
            buttons={[
                {
                    text: 'Add New',
                    type: ButtonType.link,
                    variant: ButtonVariant.primary,
                    icon: IconType.add,
                    link: '/erp/purchase/vendor-bill/create'
                }
            ]}
        >
            <GenericTable
                rowData={rowData}
                loading={loading}
                exportTitle={'all-vendor-bills-' + Date.now()}
                columns={[
                    {accessor: 'bill_number', title: 'Bill #', sortable: true},
                    {accessor: 'purchase_requisition.pr_code', title: 'PR #', sortable: true},
                    {accessor: 'local_purchase_order.internal_document_number', title: 'ID #', sortable: true},
                    {accessor: 'local_purchase_order.lpo_number', title: 'LPO #', sortable: true},
                    {accessor: 'good_receive_note.grn_number', title: 'GRN #', sortable: true},
                    {
                        accessor: 'local_purchase_order.vendor.name',
                        title: 'Vendor',
                        render: (row: any) => (<span>{row.good_receive_note.local_purchase_order?.vendor?.name}</span>),
                        sortable: true
                    },
                    {
                        accessor: 'vendor_representative.name',
                        title: 'V Representative',
                        render: (row: any) => (
                            <span>{row.good_receive_note.local_purchase_order?.vendor_representative?.name}</span>),
                        sortable: true
                    },
                    {accessor: 'bill_amount', title: 'Bill Amount', sortable: true},
                    {
                        title: 'Status',
                        accessor: 'status',
                        sortable: true,
                        render: (row: any) => (<span
                            className={`badge ${row.status === 'pending' ? 'bg-warning' : row.status === 'partial' ? 'bg-danger' : 'bg-success'}`}>{capitalize((row.status))}</span>)
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
                                    link={`/erp/purchase/vendor-bill/print/${row.id}`}
                                />

                                {/*<IconButton*/}
                                {/*    icon={IconType.view}*/}
                                {/*    color={ButtonVariant.info}*/}
                                {/*    tooltip="View"*/}
                                {/*    link={`/erp/purchase/vendor-bill/view/${row.id}`}*/}
                                {/*/>*/}
                            </div>
                        )
                    }
                ]}
            />
        </PageWrapper>
    );
};

export default Index;
