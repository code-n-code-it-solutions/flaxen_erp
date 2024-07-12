import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {ThunkDispatch} from "redux-thunk";
import {IRootState, useAppDispatch, useAppSelector} from "@/store";
import {AnyAction} from "redux";
import PageWrapper from "@/components/PageWrapper";
import Button from "@/components/Button";
import {ButtonSize, ButtonType, ButtonVariant, IconType} from "@/utils/enums";
import {getIcon} from "@/utils/helper";
import {setPageTitle} from "@/store/slices/themeConfigSlice";
import {capitalize} from "lodash";
import IconButton from "@/components/IconButton";
import GenericTable from "@/components/GenericTable";
import {setAuthToken} from "@/configs/api.config";
import {getDeliveryNotes} from "@/store/slices/deliveryNoteSlice";

const Index = () => {
    const dispatch = useAppDispatch();
    const {token} = useAppSelector((state) => state.user);
    const {deliveryNotes, loading} = useAppSelector((state) => state.deliveryNote);
    const [rowData, setRowData] = React.useState<any[]>([]);
    const breadcrumb = [
        {
            title: 'Home',
            href: '/main'
        },
        {
            title: 'Sale Dashboard',
            href: '/erp/sale'
        },
        {
            title: 'All Delivery Notes',
            href: '#'
        }
    ];

    useEffect(() => {
        setAuthToken(token)
        dispatch(setPageTitle('All Delivery Notes'));
        dispatch(getDeliveryNotes())
    }, []);

    useEffect(() => {
        if (deliveryNotes) {
            setRowData(deliveryNotes)
        }
    }, [deliveryNotes]);

    return (
        <PageWrapper
            embedLoader={false}
            breadCrumbItems={breadcrumb}
            title="All Delivery Notes"
            buttons={[
                {
                    text: 'Add New',
                    type: ButtonType.link,
                    variant: ButtonVariant.primary,
                    link: '/erp/sale/delivery-note/create',
                    icon: IconType.add
                }

            ]}
        >
            <GenericTable
                rowData={rowData}
                loading={loading}
                exportTitle={'all-delivery-note-' + Date.now()}
                columns={[
                    {
                        accessor: 'quotation.quotation_code',
                        title: 'Quotation #',
                        sortable: true
                    },
                    {
                        accessor: 'delivery_note_code',
                        title: 'Delivery Note #',
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
                                    link={`/erp/sale/delivery-note/print/${row.id}`}
                                    tooltip='Print'
                                />

                                <IconButton
                                    icon={IconType.view}
                                    color={ButtonVariant.success}
                                    link={`/erp/sale/delivery-note/view/${row.id}`}
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
