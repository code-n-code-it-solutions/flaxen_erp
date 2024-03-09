import {useEffect, useState} from 'react';
import Swal from 'sweetalert2';
import {useDispatch, useSelector} from 'react-redux';
import {setPageTitle} from '@/store/slices/themeConfigSlice';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import {ThunkDispatch} from 'redux-thunk';
import {IRootState} from '@/store';
import {AnyAction} from 'redux';
import {setAuthToken, setContentType} from '@/configs/api.config';
import GenericTable from '@/components/GenericTable';
import {deleteVendor, getVendors} from '@/store/slices/vendorSlice';
import Image from 'next/image';
import {BASE_URL} from '@/configs/server.config';
import IconButton from '@/components/IconButton';
import {ButtonVariant, IconType} from '@/utils/enums';
import Preview from "@/pages/admin/vendors/preview";
import {generatePDF, imagePath} from "@/utils/helper";
import PageWrapper from "@/components/PageWrapper";

const Index = () => {
    const dispatch = useDispatch<ThunkDispatch<IRootState, any, AnyAction>>();
    const {token} = useSelector((state: IRootState) => state.user);
    const {allVendors, loading, success} = useSelector((state: IRootState) => state.vendor);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [printLoading, setPrintLoading] = useState(false);
    const breadcrumb = [
        {
            title: 'Main Dashboard',
            href: '/main',
        },
        {
            title: 'Admin Dashboard',
            href: '/admin',
        },
        {
            title: 'All Vendors',
            href: '#',
        },
    ];

    const [rowData, setRowData] = useState([]);

    const getRawItems = () => {
        setAuthToken(token);
        setContentType('application/json');
        dispatch(getVendors());
    };

    useEffect(() => {
        getRawItems();
        dispatch(setPageTitle('All Vendors'));
    }, []);

    useEffect(() => {
        if (allVendors) {
            setRowData(allVendors);
        }
    }, [allVendors]);

    const colName = ['id', 'vendor_no', 'name', 'contact', 'due_in_days', 'address', 'is_customer', 'is_active'];
    const header = ['Id', 'Vendor No', 'Name', 'Contact', 'Due In (days)', 'Address', 'Is Customer', 'Status'];

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
                dispatch(deleteVendor(id));
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
                customClass: 'sweet-alerts'
            });
        } else {
            Swal.fire({title: 'Failed!', text: 'Something went wrong.', icon: 'error', customClass: 'sweet-alerts'});
        }
    }, [success]);

    return (
        <PageWrapper
            loading={loading}
            embedLoader={true}
            breadCrumbItems={breadcrumb}
        >
            <div>
                <div className="mb-5 flex items-center justify-between">
                    <h5 className="text-lg font-semibold dark:text-white-light">All Vendors</h5>
                    <Link href="/admin/vendors/create" className="btn btn-primary btn-sm m-1">
                        <span className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                 className="h-5 w-5 ltr:mr-2 rtl:ml-2" fill="none">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
                                <path d="M15 12L12 12M12 12L9 12M12 12L12 9M12 12L12 15" stroke="currentColor"
                                      strokeWidth="1.5" strokeLinecap="round"/>
                            </svg>
                            Add New
                        </span>
                    </Link>
                </div>
                <GenericTable
                    colName={colName}
                    header={header}
                    rowData={rowData}
                    loading={loading}
                    exportTitle={'all-vendors-' + Date.now()}
                    columns={[
                        {
                            accessor: 'image_id',
                            title: 'Photo',
                            render: (row: any) => <Image src={imagePath(row.thumbnail)} alt={row.name} width={40}
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
                                        onClick={() => generatePDF(<Preview content={row}/>, setPrintLoading)}
                                    />

                                    <IconButton
                                        icon={IconType.view}
                                        color={ButtonVariant.info}
                                        tooltip="View"
                                        link={`/admin/vendors/view/${row.id}`}
                                    />

                                    <IconButton
                                        icon={IconType.edit}
                                        color={ButtonVariant.primary}
                                        tooltip="Edit"
                                        link={`/admin/vendors/edit/${row.id}`}
                                    />

                                    <IconButton
                                        icon={IconType.delete}
                                        color={ButtonVariant.danger}
                                        tooltip="Delete"
                                        onClick={() => handleDelete(row.id)}
                                    />
                                </div>
                            ),
                        },
                    ]}
                />
            </div>
        </PageWrapper>
    );
};

export default Index;
