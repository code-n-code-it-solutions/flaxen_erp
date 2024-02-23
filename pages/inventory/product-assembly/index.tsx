import {useEffect, useState} from 'react';
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
import {router} from "next/client";
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

const Index = () => {
    const dispatch = useDispatch<ThunkDispatch<IRootState, any, AnyAction>>();
    const {token} = useSelector((state: IRootState) => state.user);
    const {allProductAssemblies, loading, success} = useSelector((state: IRootState) => state.productAssembly);
    const [deleteLoading, setDeleteLoading] = useState(false);

    useEffect(() => {
        dispatch(setPageTitle('All Product Assemblies'));
    });
    const [rowData, setRowData] = useState([]);

    const getRawItems = () => {
        setAuthToken(token)
        setContentType('application/json')
        dispatch(getProductAssemblies())
    }

    useEffect(() => {
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

    const handleItemShowModal = (row: any) => {
        console.log(row);
        // router.push(`/inventory/product-assembly/view/${row.id}`);
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

        <div>
            <Breadcrumb items={[
                {
                    title: 'Home',
                    href: '/main',
                },
                {
                    title: 'All Product Assemblies',
                    href: '#',
                },
            ]}/>
            <div className="pt-5">
                <div className="panel">
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
                                        <div className='text-success cursor-pointer' onClick={()=>handleItemShowModal(row)}>
                                            <svg width="24" height="24"
                                                 className="h-5 w-5 ltr:mr-2 rtl:ml-2"
                                                 viewBox="0 0 24 24" fill="none"
                                                 xmlns="http://www.w3.org/2000/svg">
                                                <path fillRule="evenodd" clipRule="evenodd"
                                                      d="M4.97475 2.25H19.0253C19.4697 2.24999 19.8408 2.24999 20.1454 2.27077C20.4625 2.29241 20.762 2.33905 21.0524 2.45933C21.7262 2.73844 22.2616 3.27379 22.5407 3.94762C22.661 4.23801 22.7076 4.53754 22.7292 4.85464C22.75 5.15925 22.75 5.53028 22.75 5.97474V6.02526C22.75 6.46972 22.75 6.84075 22.7292 7.14537C22.7076 7.46247 22.661 7.76199 22.5407 8.05238C22.3908 8.41428 22.1669 8.73624 21.8875 9C22.1669 9.26377 22.3908 9.58572 22.5407 9.94762C22.661 10.238 22.7076 10.5375 22.7292 10.8546C22.75 11.1592 22.75 11.5303 22.75 11.9747V12.0253C22.75 12.4697 22.75 12.8408 22.7292 13.1454C22.7076 13.4625 22.661 13.762 22.5407 14.0524C22.3908 14.4143 22.1669 14.7362 21.8875 15C22.1669 15.2638 22.3908 15.5857 22.5407 15.9476C22.661 16.238 22.7076 16.5375 22.7292 16.8546C22.75 17.1592 22.75 17.5303 22.75 17.9747V18.0253C22.75 18.4697 22.75 18.8408 22.7292 19.1454C22.7076 19.4625 22.661 19.762 22.5407 20.0524C22.2616 20.7262 21.7262 21.2616 21.0524 21.5407C20.762 21.661 20.4625 21.7076 20.1454 21.7292C19.8408 21.75 19.4697 21.75 19.0253 21.75H4.97474C4.53028 21.75 4.15925 21.75 3.85464 21.7292C3.53754 21.7076 3.23801 21.661 2.94762 21.5407C2.27379 21.2616 1.73844 20.7262 1.45933 20.0524C1.33905 19.762 1.29241 19.4625 1.27077 19.1454C1.24999 18.8408 1.24999 18.4697 1.25 18.0253V17.9748C1.24999 17.5303 1.24999 17.1592 1.27077 16.8546C1.29241 16.5375 1.33905 16.238 1.45933 15.9476C1.60924 15.5857 1.83305 15.2638 2.11254 15C1.83305 14.7362 1.60924 14.4143 1.45933 14.0524C1.33905 13.762 1.29241 13.4625 1.27077 13.1454C1.24999 12.8408 1.24999 12.4697 1.25 12.0253V11.9748C1.24999 11.5303 1.24999 11.1592 1.27077 10.8546C1.29241 10.5375 1.33905 10.238 1.45933 9.94762C1.60924 9.58572 1.83305 9.26377 2.11254 9C1.83305 8.73623 1.60924 8.41428 1.45933 8.05238C1.33905 7.76199 1.29241 7.46247 1.27077 7.14537C1.24999 6.84075 1.24999 6.46971 1.25 6.02525V5.97475C1.24999 5.53029 1.24999 5.15925 1.27077 4.85464C1.29241 4.53754 1.33905 4.23801 1.45933 3.94762C1.73844 3.27379 2.27379 2.73844 2.94762 2.45933C3.23801 2.33905 3.53754 2.29241 3.85464 2.27077C4.15925 2.24999 4.53029 2.24999 4.97475 2.25ZM5 8.25C4.5238 8.25 4.20421 8.24959 3.95674 8.23271C3.71602 8.21629 3.5988 8.18681 3.52165 8.15485C3.21536 8.02798 2.97202 7.78464 2.84515 7.47835C2.81319 7.4012 2.78372 7.28399 2.76729 7.04326C2.75041 6.79579 2.75 6.4762 2.75 6C2.75 5.5238 2.75041 5.20421 2.76729 4.95674C2.78372 4.71602 2.81319 4.5988 2.84515 4.52165C2.97202 4.21536 3.21536 3.97202 3.52165 3.84515C3.5988 3.81319 3.71602 3.78372 3.95674 3.76729C4.20421 3.75041 4.5238 3.75 5 3.75H19C19.4762 3.75 19.7958 3.75041 20.0433 3.76729C20.284 3.78372 20.4012 3.81319 20.4784 3.84515C20.7846 3.97202 21.028 4.21536 21.1549 4.52165C21.1868 4.5988 21.2163 4.71602 21.2327 4.95674C21.2496 5.20421 21.25 5.5238 21.25 6C21.25 6.4762 21.2496 6.79579 21.2327 7.04326C21.2163 7.28399 21.1868 7.4012 21.1549 7.47835C21.028 7.78464 20.7846 8.02798 20.4784 8.15485C20.4012 8.18681 20.284 8.21629 20.0433 8.23271C19.7958 8.24959 19.4762 8.25 19 8.25H5ZM5 9.75C4.5238 9.75 4.20421 9.75041 3.95674 9.76729C3.71602 9.78372 3.5988 9.81319 3.52165 9.84515C3.21536 9.97202 2.97202 10.2154 2.84515 10.5216C2.81319 10.5988 2.78372 10.716 2.76729 10.9567C2.75041 11.2042 2.75 11.5238 2.75 12C2.75 12.4762 2.75041 12.7958 2.76729 13.0433C2.78372 13.284 2.81319 13.4012 2.84515 13.4784C2.97202 13.7846 3.21536 14.028 3.52165 14.1549C3.5988 14.1868 3.71602 14.2163 3.95674 14.2327C4.20421 14.2496 4.5238 14.25 5 14.25H19C19.4762 14.25 19.7958 14.2496 20.0433 14.2327C20.284 14.2163 20.4012 14.1868 20.4784 14.1549C20.7846 14.028 21.028 13.7846 21.1549 13.4784C21.1868 13.4012 21.2163 13.284 21.2327 13.0433C21.2496 12.7958 21.25 12.4762 21.25 12C21.25 11.5238 21.2496 11.2042 21.2327 10.9567C21.2163 10.716 21.1868 10.5988 21.1549 10.5216C21.028 10.2154 20.7846 9.97202 20.4784 9.84515C20.4012 9.81319 20.284 9.78372 20.0433 9.76729C19.7958 9.75041 19.4762 9.75 19 9.75H5ZM5 15.75C4.5238 15.75 4.20421 15.7504 3.95674 15.7673C3.71602 15.7837 3.5988 15.8132 3.52165 15.8452C3.21536 15.972 2.97202 16.2154 2.84515 16.5216C2.81319 16.5988 2.78372 16.716 2.76729 16.9567C2.75041 17.2042 2.75 17.5238 2.75 18C2.75 18.4762 2.75041 18.7958 2.76729 19.0433C2.78372 19.284 2.81319 19.4012 2.84515 19.4784C2.97202 19.7846 3.21536 20.028 3.52165 20.1549C3.5988 20.1868 3.71602 20.2163 3.95674 20.2327C4.20421 20.2496 4.5238 20.25 5 20.25H19C19.4762 20.25 19.7958 20.2496 20.0433 20.2327C20.284 20.2163 20.4012 20.1868 20.4784 20.1549C20.7846 20.028 21.028 19.7846 21.1549 19.4784C21.1868 19.4012 21.2163 19.284 21.2327 19.0433C21.2496 18.7958 21.25 18.4762 21.25 18C21.25 17.5238 21.2496 17.2042 21.2327 16.9567C21.2163 16.716 21.1868 16.5988 21.1549 16.5216C21.028 16.2154 20.7846 15.972 20.4784 15.8452C20.4012 15.8132 20.284 15.7837 20.0433 15.7673C19.7958 15.7504 19.4762 15.75 19 15.75H5Z"
                                                      fill="#1C274C"/>
                                                <path
                                                    d="M6 12C6 12.5523 5.55229 13 5 13C4.44772 13 4 12.5523 4 12C4 11.4477 4.44772 11 5 11C5.55229 11 6 11.4477 6 12Z"
                                                    fill="#1C274C"/>
                                                <path
                                                    d="M6 6C6 6.55229 5.55229 7 5 7C4.44772 7 4 6.55229 4 6C4 5.44772 4.44772 5 5 5C5.55229 5 6 5.44772 6 6Z"
                                                    fill="#1C274C"/>
                                                <path
                                                    d="M6 18C6 18.5523 5.55229 19 5 19C4.44772 19 4 18.5523 4 18C4 17.4477 4.44772 17 5 17C5.55229 17 6 17.4477 6 18Z"
                                                    fill="#1C274C"/>
                                            </svg>
                                        </div>
                                        <span className='text-info cursor-pointer'>
                                            <svg width="24" height="24"
                                                 className="h-5 w-5 ltr:mr-2 rtl:ml-2"
                                                 viewBox="0 0 24 24" fill="none"
                                                 xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M6 17.9827C4.44655 17.9359 3.51998 17.7626 2.87868 17.1213C2 16.2426 2 14.8284 2 12C2 9.17157 2 7.75736 2.87868 6.87868C3.75736 6 5.17157 6 8 6H16C18.8284 6 20.2426 6 21.1213 6.87868C22 7.75736 22 9.17157 22 12C22 14.8284 22 16.2426 21.1213 17.1213C20.48 17.7626 19.5535 17.9359 18 17.9827"
                                                    stroke="currentColor" strokeWidth="1.5"/>
                                                <path d="M9 10H6" stroke="currentColor" strokeWidth="1.5"
                                                      strokeLinecap="round"/>
                                                <path d="M19 14L5 14" stroke="currentColor" strokeWidth="1.5"
                                                      strokeLinecap="round"/>
                                                <path
                                                    d="M17.1213 2.87868L16.591 3.40901V3.40901L17.1213 2.87868ZM6.87868 2.87868L7.40901 3.40901V3.40901L6.87868 2.87868ZM6.87868 21.1213L7.40901 20.591H7.40901L6.87868 21.1213ZM18.75 14C18.75 13.5858 18.4142 13.25 18 13.25C17.5858 13.25 17.25 13.5858 17.25 14H18.75ZM6.75 14C6.75 13.5858 6.41421 13.25 6 13.25C5.58579 13.25 5.25 13.5858 5.25 14H6.75ZM17.25 16C17.25 17.4354 17.2484 18.4365 17.1469 19.1919C17.0482 19.9257 16.8678 20.3142 16.591 20.591L17.6517 21.6517C18.2536 21.0497 18.5125 20.2919 18.6335 19.3918C18.7516 18.5132 18.75 17.393 18.75 16H17.25ZM12 22.75C13.393 22.75 14.5132 22.7516 15.3918 22.6335C16.2919 22.5125 17.0497 22.2536 17.6517 21.6517L16.591 20.591C16.3142 20.8678 15.9257 21.0482 15.1919 21.1469C14.4365 21.2484 13.4354 21.25 12 21.25V22.75ZM12 2.75C13.4354 2.75 14.4365 2.75159 15.1919 2.85315C15.9257 2.9518 16.3142 3.13225 16.591 3.40901L17.6517 2.34835C17.0497 1.74643 16.2919 1.48754 15.3918 1.36652C14.5132 1.24841 13.393 1.25 12 1.25V2.75ZM12 1.25C10.607 1.25 9.48678 1.24841 8.60825 1.36652C7.70814 1.48754 6.95027 1.74643 6.34835 2.34835L7.40901 3.40901C7.68577 3.13225 8.07434 2.9518 8.80812 2.85315C9.56347 2.75159 10.5646 2.75 12 2.75V1.25ZM5.25 16C5.25 17.393 5.24841 18.5132 5.36652 19.3918C5.48754 20.2919 5.74643 21.0497 6.34835 21.6517L7.40901 20.591C7.13225 20.3142 6.9518 19.9257 6.85315 19.1919C6.75159 18.4365 6.75 17.4354 6.75 16H5.25ZM12 21.25C10.5646 21.25 9.56347 21.2484 8.80812 21.1469C8.07435 21.0482 7.68577 20.8678 7.40901 20.591L6.34835 21.6517C6.95027 22.2536 7.70814 22.5125 8.60825 22.6335C9.48678 22.7516 10.607 22.75 12 22.75V21.25ZM18.7323 5.97741C18.6859 4.43521 18.5237 3.22037 17.6517 2.34835L16.591 3.40901C17.0016 3.8196 17.1859 4.4579 17.233 6.02259L18.7323 5.97741ZM6.76698 6.02259C6.81413 4.4579 6.99842 3.8196 7.40901 3.40901L6.34835 2.34835C5.47633 3.22037 5.31413 4.43521 5.26766 5.97741L6.76698 6.02259ZM18.75 16V14H17.25V16H18.75ZM6.75 16V14H5.25V16H6.75Z"
                                                    fill="currentColor"/>
                                                <circle cx="17" cy="10" r="1" fill="currentColor"/>
                                                <path d="M15 16.5H9" stroke="currentColor" strokeWidth="1.5"
                                                      strokeLinecap="round"/>
                                                <path d="M13 19H9" stroke="currentColor" strokeWidth="1.5"
                                                      strokeLinecap="round"/>
                                            </svg>
                                        </span>
                                        <Tippy content='Edit'>
                                            <Link href={`/inventory/product-assembly/edit/${row.id}`}>
                                                <span className="text-primary">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         className="h-5 w-5 ltr:mr-2 rtl:ml-2"
                                                         viewBox="0 0 24 24" fill="none">
                                                        <path
                                                            d="M8.25 15.5C8.25 15.9142 8.58579 16.25 9 16.25C9.41421 16.25 9.75 15.9142 9.75 15.5H8.25ZM11.6643 8.75249L12.1624 8.19186L12.1624 8.19186L11.6643 8.75249ZM11.25 10.425C11.25 10.8392 11.5858 11.175 12 11.175C12.4142 11.175 12.75 10.8392 12.75 10.425H11.25ZM11.7475 8.83575L12.3081 8.33756L12.3081 8.33756L11.7475 8.83575ZM6.33575 8.75249L5.83756 8.19186L5.83756 8.19186L6.33575 8.75249ZM5.25 10.425C5.25 10.8392 5.58579 11.175 6 11.175C6.41421 11.175 6.75 10.8392 6.75 10.425H5.25ZM6.25249 8.83575L5.69186 8.33756L5.69186 8.33756L6.25249 8.83575ZM7 14.75C6.58579 14.75 6.25 15.0858 6.25 15.5C6.25 15.9142 6.58579 16.25 7 16.25V14.75ZM11 16.25C11.4142 16.25 11.75 15.9142 11.75 15.5C11.75 15.0858 11.4142 14.75 11 14.75V16.25ZM7.925 9.25H9V7.75H7.925V9.25ZM9 9.25H10.075V7.75H9V9.25ZM9.75 15.5V8.5H8.25V15.5H9.75ZM10.075 9.25C10.5295 9.25 10.8007 9.25137 10.9965 9.27579C11.1739 9.29792 11.1831 9.3283 11.1661 9.31312L12.1624 8.19186C11.8612 7.92419 11.5109 7.82832 11.1822 7.78733C10.8719 7.74863 10.4905 7.75 10.075 7.75V9.25ZM12.75 10.425C12.75 10.0095 12.7514 9.62806 12.7127 9.31782C12.6717 8.98915 12.5758 8.63878 12.3081 8.33756L11.1869 9.33394C11.1717 9.31686 11.2021 9.32608 11.2242 9.50348C11.2486 9.69931 11.25 9.97047 11.25 10.425H12.75ZM11.1661 9.31312C11.1734 9.31964 11.1804 9.32659 11.1869 9.33394L12.3081 8.33756C12.2625 8.28617 12.2138 8.23752 12.1624 8.19186L11.1661 9.31312ZM7.925 7.75C7.50946 7.75 7.12806 7.74863 6.81782 7.78733C6.48914 7.82832 6.13878 7.92419 5.83756 8.19186L6.83394 9.31312C6.81686 9.3283 6.82608 9.29792 7.00348 9.27579C7.19931 9.25137 7.47047 9.25 7.925 9.25V7.75ZM6.75 10.425C6.75 9.97047 6.75137 9.69931 6.77579 9.50348C6.79792 9.32608 6.8283 9.31686 6.81312 9.33394L5.69186 8.33756C5.42419 8.63878 5.32832 8.98915 5.28733 9.31782C5.24863 9.62806 5.25 10.0095 5.25 10.425H6.75ZM5.83756 8.19186C5.78617 8.23752 5.73752 8.28617 5.69186 8.33756L6.81312 9.33394C6.81965 9.3266 6.8266 9.31965 6.83394 9.31312L5.83756 8.19186ZM7 16.25H11V14.75H7V16.25Z"
                                                            fill="currentColor"/>
                                                        <path
                                                            d="M12 4H10C6.22876 4 4.34315 4 3.17157 5.17157C2 6.34315 2 8.22876 2 12C2 15.7712 2 17.6569 3.17157 18.8284C4.34315 20 6.22876 20 10 20H12M15 4.00093C18.1143 4.01004 19.7653 4.10848 20.8284 5.17157C22 6.34315 22 8.22876 22 12C22 15.7712 22 17.6569 20.8284 18.8284C19.7653 19.8915 18.1143 19.99 15 19.9991"
                                                            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                                        <path d="M15 2V22" stroke="currentColor" strokeWidth="1.5"
                                                              strokeLinecap="round"/>
                                                    </svg>
                                                </span>
                                            </Link>
                                        </Tippy>
                                        <Tippy content='Delete'>
                                            <span className="text-danger cursor-pointer"
                                                  onClick={() => handleDelete(row.id)}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                     className="h-5 w-5 ltr:mr-2 rtl:ml-2"
                                                     viewBox="0 0 24 24" fill="none">
                                                    <path
                                                        d="M9.1709 4C9.58273 2.83481 10.694 2 12.0002 2C13.3064 2 14.4177 2.83481 14.8295 4"
                                                        stroke="currentColor"
                                                        strokeWidth="1.5" strokeLinecap="round"/>
                                                    <path d="M20.5001 6H3.5" stroke="currentColor" strokeWidth="1.5"
                                                          strokeLinecap="round"/>
                                                    <path
                                                        d="M18.8332 8.5L18.3732 15.3991C18.1962 18.054 18.1077 19.3815 17.2427 20.1907C16.3777 21 15.0473 21 12.3865 21H11.6132C8.95235 21 7.62195 21 6.75694 20.1907C5.89194 19.3815 5.80344 18.054 5.62644 15.3991L5.1665 8.5"
                                                        stroke="currentColor" strokeWidth="1.5"
                                                        strokeLinecap="round"/>
                                                    <path d="M9.5 11L10 16" stroke="currentColor" strokeWidth="1.5"
                                                          strokeLinecap="round"/>
                                                    <path d="M14.5 11L14 16" stroke="currentColor" strokeWidth="1.5"
                                                          strokeLinecap="round"/>
                                                </svg>
                                            </span>
                                        </Tippy>
                                    </div>
                                )
                            }
                        ]}
                    />
                </div>
            </div>

        </div>
    );
};

export default Index;
