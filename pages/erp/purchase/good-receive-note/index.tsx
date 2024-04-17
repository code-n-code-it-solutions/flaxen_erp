import {useEffect, useState} from 'react';
import Swal from 'sweetalert2';
import {useDispatch, useSelector} from 'react-redux';
import {setPageTitle} from '@/store/slices/themeConfigSlice';
import Link from "next/link";
import {ThunkDispatch} from "redux-thunk";
import {IRootState} from "@/store";
import {AnyAction} from "redux";
import {setAuthToken, setContentType} from "@/configs/api.config";
import GenericTable from "@/components/GenericTable";
import Image from "next/image";
import {BASE_URL} from "@/configs/server.config";
import ReactDOMServer from 'react-dom/server';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import Preview from "@/pages/erp/purchase/good-receive-note/preview";
import {deleteGRN, getGRN} from "@/store/slices/goodReceiveNoteSlice";
import PageWrapper from "@/components/PageWrapper";
import IconButton from "@/components/IconButton";
import {ButtonVariant, IconType} from "@/utils/enums";
import {imagePath} from "@/utils/helper";

const Index = () => {
    const dispatch = useDispatch<ThunkDispatch<IRootState, any, AnyAction>>();
    const {token} = useSelector((state: IRootState) => state.user);
    const {allGRNs, loading, success} = useSelector((state: IRootState) => state.goodReceiveNote);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const [rowData, setRowData] = useState([]);

    const breadcrumbItems = [
        {
            title: 'Main Dashboard',
            href: '/main',
        },
        {
            title: 'Purchase Dashboard',
            href: '/purchase',
        },
        {
            title: 'All Good Receive Notes',
            href: '#',
        },
    ];

    const getRawItems = () => {
        setAuthToken(token)
        setContentType('application/json')
        dispatch(getGRN())
    }

    useEffect(() => {
        getRawItems();
        dispatch(setPageTitle('All Good Receive Notes'));
    }, []);

    useEffect(() => {
        if (allGRNs) {
            setRowData(allGRNs)
        }
    }, [allGRNs]);

    const colName = ['id', 'grn_number', 'lpo_number', 'internal_document_number', 'user_id', 'vendor_id', 'vendor_representative_id', 'vehicle_id', 'purchased_by_id', 'received_by_id'];
    const header = ['Id', 'GRN #', 'LPO #', 'ID #', 'User', 'Vendor', 'Representative', 'Vehicle', 'Purchased By', 'Received By'];


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
                dispatch(deleteGRN(id));
                setDeleteLoading(true);
            }
        });
    }

    const handleGeneratePDF = async (grn: any) => {
        const pdfContent = ReactDOMServer.renderToStaticMarkup(<Preview content={grn}/>);
        const res = await fetch(
            '/api/generate-pdf',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'html/text',
                },
                body: pdfContent
            });
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const link: any = document.createElement('a');
        link.href = url;
        link.setAttribute('target', '_blank');
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
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
            breadCrumbItems={breadcrumbItems}
            loading={loading}
            embedLoader={true}
        >
            <div className="mb-5 flex items-center justify-between">
                <h5 className="text-lg font-semibold dark:text-white-light">All Good Receive Notes</h5>
                <Link href="/purchase/good-receive-note/create"
                      className="btn btn-primary btn-sm m-1">
                    <span className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                             className="h-5 w-5 ltr:mr-2 rtl:ml-2"
                             fill="none">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
                            <path d="M15 12L12 12M12 12L9 12M12 12L12 9M12 12L12 15" stroke="currentColor"
                                  strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                        Add New
                    </span>
                </Link>
            </div>
            {/*const colName = ['id', 'lpo_number', 'internal_document_number', 'user_id', 'vendor_id', 'vendor_representative_id', 'vehicle_id', 'purchased_by_id', 'received_by_id', 'delivery_due_date'];*/}
            <GenericTable
                colName={colName}
                header={header}
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
                        accessor: 'purchase_requisition.pr_code',
                        title: 'Requisition Code',
                        sortable: true
                    },
                    {
                        accessor: 'local_purchase_order.internal_document_number',
                        title: 'ID #',
                        sortable: true
                    },
                    {
                        accessor: 'user.name',
                        title: 'Created By',
                        sortable: true
                    },
                    {
                        accessor: 'vendor.name',
                        title: 'Vendor',
                        render: (row: any) => (
                            <div className="flex flex-col items-center gap-3">
                                <Image src={imagePath(row.local_purchase_order.vendor.thumbnail)}
                                       alt={row.local_purchase_order.vendor.name}
                                       width={50} height={50} className="rounded"/>
                                <span>{row.local_purchase_order.vendor.name}</span>
                            </div>
                        ),
                        sortable: true
                    },
                    {
                        accessor: 'vendor_representative.name',
                        title: 'V Representative',
                        render: (row: any) => (
                            <div className="flex flex-col items-center gap-3">
                                <Image
                                    src={imagePath(row.local_purchase_order.vendor_representative.thumbnail)}
                                    alt={row.local_purchase_order.vendor_representative.name} width={50} height={50}
                                    className="rounded"/>
                                <span>{row.local_purchase_order.vendor_representative.name}</span>
                            </div>
                        ),
                        sortable: true
                    },
                    {
                        accessor: 'vehicle.make',
                        title: 'Vehicle',
                        render: (row: any) => (
                            <div className="flex flex-col items-center gap-3">
                                <Image src={imagePath(row.local_purchase_order.vehicle.thumbnail)}
                                       alt={row.local_purchase_order.vehicle.make}
                                       width={50} height={50} className="rounded"/>
                                <span>{row.local_purchase_order.vehicle.make + '-' + row.local_purchase_order.vehicle.model + ' (' + row.local_purchase_order.vehicle.number_plate + ')'}</span>
                            </div>
                        ),
                        sortable: true
                    },
                    {
                        accessor: 'local_purchase_order.purchased_by.name',
                        title: 'Purchased By',
                        sortable: true
                    },
                    {
                        accessor: 'received_by.name',
                        title: 'Received By',
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
                                    onClick={() => handleGeneratePDF(row)}
                                    tooltip='Print'
                                />

                                <IconButton
                                    icon={IconType.edit}
                                    color={ButtonVariant.primary}
                                    link={`/purchase/good-receive-note/edit/${row.id}`}
                                    tooltip='Edit'
                                />

                                <IconButton
                                    icon={IconType.view}
                                    color={ButtonVariant.success}
                                    link={`/purchase/good-receive-note/view/${row.id}`}
                                    tooltip='View'
                                />

                                <IconButton
                                    icon={IconType.delete}
                                    color={ButtonVariant.danger}
                                    onClick={() => handleDelete(row.id)}
                                    tooltip='Delete'
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
