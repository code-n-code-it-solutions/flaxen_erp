import React, {useEffect, useState} from 'react';
import {setPageTitle} from '@/store/slices/themeConfigSlice';
import {useAppDispatch, useAppSelector} from '@/store';
import {setAuthToken, setContentType} from '@/configs/api.config';
import GenericTable from '@/components/GenericTable';
import {getVendors} from '@/store/slices/vendorSlice';
import Image from 'next/image';
import IconButton from '@/components/IconButton';
import {ButtonType, ButtonVariant, IconType} from '@/utils/enums';
import {serverFilePath} from "@/utils/helper";
import PageWrapper from "@/components/PageWrapper";

const Index = () => {
    const dispatch = useAppDispatch();
    const {token} = useAppSelector(state => state.user);
    const {allVendors, loading, success} = useAppSelector(state => state.vendor);
    const breadcrumb = [
        {
            title: 'Main Dashboard',
            href: '/erp/main',
        },
        {
            title: 'Admin Dashboard',
            href: '/erp/admin',
        },
        {
            title: 'All Vendors',
            href: '#',
        },
    ];

    const [rowData, setRowData] = useState([]);

    useEffect(() => {
        setAuthToken(token);
        setContentType('application/json');
        dispatch(getVendors());
        dispatch(setPageTitle('All Vendors'));
    }, []);

    useEffect(() => {
        if (allVendors) {
            setRowData(allVendors);
        }
    }, [allVendors]);

    return (
        <PageWrapper
            loading={loading}
            embedLoader={true}
            breadCrumbItems={breadcrumb}
            title="All Vendors"
            buttons={[
                {
                    text: 'Add New',
                    type: ButtonType.link,
                    variant: ButtonVariant.primary,
                    icon: IconType.add,
                    link: '/erp/admin/vendors/create'
                }
            ]}
        >
            <GenericTable
                rowData={rowData}
                loading={loading}
                exportTitle={'all-vendors-' + Date.now()}
                columns={[
                    {
                        accessor: 'image_id',
                        title: 'Photo',
                        render: (row: any) => <Image priority={true} src={serverFilePath(row.thumbnail?.path)} alt={row.name} width={40}
                                                     height={40} className="h-10 w-10 rounded-full"/>,
                        sortable: true,
                    },
                    {accessor: 'vendor_number', title: 'V.No', sortable: true},
                    {accessor: 'name', title: 'Name', sortable: true},
                    {accessor: 'phone', title: 'Phone', sortable: true},
                    {accessor: 'due_in_days', title: 'Due in Days', sortable: true},
                    {
                        accessor: 'address',
                        title: 'Address',
                        render: (row: any) => (
                            <span>
                                {row.address} {row.city?.name} {row.state?.name}, <br/>
                                {row.country?.name}, {row.postal_code}
                            </span>
                        ),
                        sortable: true,
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
                                    // onClick={() => generatePDF(<Preview content={row}/>)}
                                    link={`/erp/admin/vendors/print/${row.id}`}
                                />

                                <IconButton
                                    icon={IconType.view}
                                    color={ButtonVariant.info}
                                    tooltip="View"
                                    link={`/erp/admin/vendors/view/${row.id}`}
                                />

                                <IconButton
                                    icon={IconType.edit}
                                    color={ButtonVariant.primary}
                                    tooltip="Edit"
                                    link={`/erp/admin/vendors/edit/${row.id}`}
                                />

                                {/*<IconButton*/}
                                {/*    icon={IconType.delete}*/}
                                {/*    color={ButtonVariant.danger}*/}
                                {/*    tooltip="Delete"*/}
                                {/*    onClick={() => handleDelete(row.id)}*/}
                                {/*/>*/}
                            </div>
                        ),
                    },
                ]}
            />
        </PageWrapper>
    );
};

export default Index;
