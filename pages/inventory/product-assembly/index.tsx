import React, {useEffect, useState} from 'react';
import Swal from 'sweetalert2';
import {useDispatch, useSelector} from 'react-redux';
import {setPageTitle} from '@/store/slices/themeConfigSlice';
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import {ThunkDispatch} from "redux-thunk";
import {IRootState} from "@/store";
import {AnyAction} from "redux";
import {setAuthToken, setContentType} from "@/configs/api.config";
import GenericTable from "@/components/GenericTable";
import {deleteProductAssembly, getProductAssemblies} from "@/store/slices/productAssemblySlice";
import 'tippy.js/dist/tippy.css';
import IconButton from "@/components/IconButton";
import {ButtonVariant, IconType} from "@/utils/enums";
import PageWrapper from "@/components/PageWrapper";
import {generatePDF} from "@/utils/helper";
import Preview from "@/pages/inventory/product-assembly/preview";

const Index = () => {
    const dispatch = useDispatch<ThunkDispatch<IRootState, any, AnyAction>>();
    const {token} = useSelector((state: IRootState) => state.user);
    const {allProductAssemblies, loading, success} = useSelector((state: IRootState) => state.productAssembly);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [rowData, setRowData] = useState([]);
    const [printLoading, setPrintLoading] = useState<boolean>(false)
    const breadCrumbItems = [
        {
            title: 'Home',
            href: '/main',
        },
        {
            title: 'All Product Assemblies',
            href: '#',
        },
    ];

    const getRawItems = () => {
        setAuthToken(token)
        setContentType('application/json')
        dispatch(getProductAssemblies())
    }

    useEffect(() => {
        dispatch(setPageTitle('All Product Assemblies'));
        getRawItems();
    }, []);

    useEffect(() => {
        if (allProductAssemblies) {
            setRowData(allProductAssemblies)
        }
    }, [allProductAssemblies]);

    const colName = ['id', 'formula_code', 'formula_name', 'product_category', 'is_active'];
    const header = ['Id', 'Formula Code', 'Formula Name', 'Product Category', 'Items', 'Status'];


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
                dispatch(deleteProductAssembly(id));
                setDeleteLoading(true);
            }
        });
    }

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
            breadCrumbItems={breadCrumbItems}
            embedLoader={false}
        >
            <div className="mb-5 flex items-center justify-between">
                <h5 className="text-lg font-semibold dark:text-white-light">All Formula</h5>
                <Link href="/inventory/product-assembly/create"
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
            <GenericTable
                colName={colName}
                header={header}
                rowData={rowData}
                loading={loading}
                exportTitle={'all-formula-' + Date.now()}
                columns={[
                    {accessor: 'formula_code', title: 'Code', sortable: true},
                    {accessor: 'formula_name', title: 'Title', sortable: true},
                    {accessor: 'category.name', title: 'Category', sortable: true},
                    {
                        accessor: 'color_code',
                        title: 'Color',
                        render: (row: any) => (
                            <div className='flex justify-start items-center gap-2'>
                                <div className="w-6 h-6 rounded-full"
                                     style={{backgroundColor: `${row.color_code.hex_code}`}}></div>
                                {row.color_code.name} ({row.color_code.code})
                            </div>
                        ),
                        sortable: true
                    },
                    {
                        accessor: 'quantity',
                        title: 'Quantity',
                        render: (row: any) => {
                            let total: any = row.product_assembly_items.reduce((sum: number, row: any) => sum + +row.quantity, 0)
                            return isNaN(total) ? 0 : total.toFixed(2);
                        },
                        sortable: true
                    },
                    {
                        accessor: 'quantity',
                        title: 'Cost',
                        render: (row: any) => {
                            let total: any = row.product_assembly_items.reduce((sum: number, row: any) => sum + +row.cost, 0)
                            return isNaN(total) ? 0 : total.toFixed(2);
                        },
                        sortable: true
                    },
                    {
                        accessor: 'is_active',
                        title: 'Status',
                        render: (row: any) => (
                            <span className={`badge bg-${row.is_active ? 'success' : 'danger'}`}>
                                {row.is_active ? 'Active' : 'Inactive'}
                            </span>
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
                                    color={ButtonVariant.secondary}
                                    tooltip='Print'
                                    onClick={() => generatePDF(<Preview content={row}/>, setPrintLoading)
                                    }
                                />

                                <IconButton
                                    icon={IconType.view}
                                    color={ButtonVariant.info}
                                    tooltip='View'
                                    link={`/inventory/product-assembly/view/${row.id}`}
                                />

                                <IconButton
                                    icon={IconType.edit}
                                    color={ButtonVariant.primary}
                                    tooltip='Edit'
                                    link={`/inventory/products/edit/${row.id}`}
                                />

                                <IconButton
                                    icon={IconType.delete}
                                    color={ButtonVariant.danger}
                                    tooltip='Delete'
                                    onClick={() => handleDelete(row.id)}
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
