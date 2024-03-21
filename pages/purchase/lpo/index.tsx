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
import {deleteLPO, getLPO} from "@/store/slices/localPurchaseOrderSlice";
import Preview from "@/pages/purchase/lpo/preview";
import IconButton from "@/components/IconButton";
import {ButtonType, ButtonVariant, IconType} from "@/utils/enums";
import {generatePDF, imagePath} from "@/utils/helper";
import PageWrapper from "@/components/PageWrapper";
import Button from "@/components/Button";
import {isNull} from "lodash";

const Index = () => {
    const dispatch = useDispatch<ThunkDispatch<IRootState, any, AnyAction>>();
    const {token} = useSelector((state: IRootState) => state.user);
    const {allLPOs, loading, success} = useSelector((state: IRootState) => state.localPurchaseOrder);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [printLoading, setPrintLoading] = useState<boolean>(false);
    const [rowData, setRowData] = useState([]);
    const breadCrumbItems = [
        {
            title: 'Home',
            href: '/main',
        },
        {
            title: 'Purchase Dashboard',
            href: '/purchase',
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

    const colName = ['id', 'lpo_number', 'internal_document_number', 'user_id', 'vendor_id', 'vendor_representative_id', 'vehicle_id', 'purchased_by_id', 'received_by_id', 'delivery_due_date'];
    const header = ['Id', 'LPO #', 'ID #', 'User', 'Vendor', 'Representative', 'Vehicle', 'Purchased By', 'Received By', 'Delivery Due Date'];


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
        >
            <div>
                <div className="mb-5 flex items-center justify-between">
                    <h5 className="text-lg font-semibold dark:text-white-light">All LPOs</h5>
                    <Button
                        type={ButtonType.link}
                        text={
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
                        }
                        variant={ButtonVariant.primary}
                        link={'/purchase/lpo/create'}
                    />
                </div>
                <GenericTable
                    colName={colName}
                    header={header}
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
                            accessor: 'user.name',
                            title: 'Created By',
                            sortable: true
                        },
                        {
                            accessor: 'vendor.name',
                            title: 'Vendor',
                            render: (row: any) => (
                                <div className="flex flex-col items-center gap-3">
                                    <Image src={imagePath(row.vendor?.thumbnail)} alt={row.vendor.name}
                                           width={50} height={50} className="rounded"/>
                                    <span>{row.vendor?.name}</span>
                                </div>
                            ),
                            sortable: true
                        },
                        {
                            accessor: 'vendor_representative.name',
                            title: 'V Representative',
                            render: (row: any) => (
                                <div className="flex flex-col items-center gap-3">
                                    <Image src={imagePath(row.vendor_representative?.thumbnail)}
                                           alt={row.vendor_representative.name} width={50} height={50}
                                           className="rounded"/>
                                    <span>{row.vendor_representative?.name}</span>
                                </div>
                            ),
                            sortable: true
                        },
                        {
                            accessor: 'vehicle.make',
                            title: 'Vehicle',
                            render: (row: any) => (
                                row.vehicle === null ? 'N/A' :
                                    <div className="flex flex-col items-center gap-3">
                                        <Image src={imagePath(row.vehicle?.thumbnail)} alt={row.vehicle?.make}
                                               width={50} height={50} className="rounded"/>
                                        <span>{row.vehicle?.make + '-' + row.vehicle?.model + ' (' + row.vehicle?.number_plate + ')'}</span>
                                    </div>
                            ),
                            sortable: true
                        },
                        {
                            accessor: 'delivery_due_date',
                            title: 'Due Date',
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
                                        onClick={() => generatePDF(<Preview content={row}/>, setPrintLoading)}
                                    />

                                    <IconButton
                                        icon={IconType.view}
                                        color={ButtonVariant.info}
                                        tooltip="View"
                                        link={`/purchase/lpo/view/${row.id}`}
                                    />

                                    <IconButton
                                        icon={IconType.edit}
                                        color={ButtonVariant.primary}
                                        tooltip="Edit"
                                        link={`/purchase/lpo/edit/${row.id}`}
                                    />

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
            </div>
        </PageWrapper>
    );
};

export default Index;
