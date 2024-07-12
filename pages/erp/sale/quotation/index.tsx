import React, {useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from "@/store";
import PageWrapper from "@/components/PageWrapper";
import {ButtonType, ButtonVariant, IconType} from "@/utils/enums";
import {setPageTitle} from "@/store/slices/themeConfigSlice";
import {setAuthToken} from "@/configs/api.config";
import {getQuotations} from "@/store/slices/quotationSlice";
import IconButton from "@/components/IconButton";
import GenericTable from "@/components/GenericTable";
import {capitalize} from "lodash";

const Index = () => {
    const dispatch = useAppDispatch();
    const {token} = useAppSelector(state => state.user);
    const {quotations, loading} = useAppSelector(state => state.quotation);
    const [rowData, setRowData] = useState<any[]>([])
    const breadcrumb = [
        {
            title: 'Home',
            href: '/erp/main'
        },
        {
            title: 'Sale Dashboard',
            href: '/erp/sale'
        },
        {
            title: 'All Quotations',
            href: '#'
        }
    ];

    useEffect(() => {
        setAuthToken(token)
        dispatch(setPageTitle('All Quotations'));
        dispatch(getQuotations())
    }, []);

    useEffect(() => {
        if (quotations) {
            setRowData(quotations)
        }
    }, [quotations]);

    return (
        <PageWrapper
            embedLoader={false}
            breadCrumbItems={breadcrumb}
            title="All Quotations"
            buttons={[
                {
                    text: 'Create New',
                    icon: IconType.add,
                    type: ButtonType.link,
                    variant: ButtonVariant.primary,
                    link: '/erp/sale/quotation/create'
                }
            ]}
        >
            <GenericTable
                rowData={rowData}
                loading={loading}
                exportTitle={'all-quotations-' + Date.now()}
                columns={[
                    {
                        accessor: 'quotation_code',
                        title: 'Quotation #',
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
                        accessor: 'salesman.name',
                        title: 'Salesman',
                        sortable: true
                    },
                    {
                        accessor: 'customer.name',
                        title: 'Customer',
                        sortable: true
                    },
                    {
                        accessor: 'contact_person.name',
                        title: 'Contact Person',
                        sortable: true
                    },
                    {
                        accessor: 'delivery_due_date',
                        title: 'Delivery Date',
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
                                    link={`/erp/sale/quotation/print/${row.id}`}
                                    tooltip='Print'
                                />

                                <IconButton
                                    icon={IconType.view}
                                    color={ButtonVariant.success}
                                    link={`/erp/sale/quotation/view/${row.id}`}
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
