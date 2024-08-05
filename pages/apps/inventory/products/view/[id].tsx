import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { useRouter } from 'next/router';
import { setPageTitle } from '@/store/slices/themeConfigSlice';
import { clearRawProductState, deleteRawProduct, showDetails } from '@/store/slices/rawProductSlice';
import PageWrapper from '@/components/PageWrapper';
import { serverFilePath } from '@/utils/helper';
import Image from 'next/image';
import DetailPageHeader from '@/components/apps/DetailPageHeader';
import Swal from 'sweetalert2';
import { AppBasePath } from '@/utils/enums';
import useSetActiveMenu from '@/hooks/useSetActiveMenu';

const View = () => {
    useSetActiveMenu(AppBasePath.Raw_Product);
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { loading, rawProductDetail } = useAppSelector((state) => state.rawProduct);
    const [ids, setIds] = useState<string[]>([]);

    const handleDelete = () => {
        if (rawProductDetail.used > 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Oops...',
                html: `You can't delete used item.`,
                confirmButtonText: 'Okay!',
                confirmButtonColor: 'green'
            });
        } else {
            Swal.fire({
                title: 'Are you sure?',
                text: 'You won\'t be able to revert this!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, delete it!',
                cancelButtonText: 'No, cancel!',
                cancelButtonColor: 'red',
                confirmButtonColor: 'green'
            }).then((result) => {
                if (result.isConfirmed) {
                    dispatch(deleteRawProduct([rawProductDetail.id]));
                    router.push('/apps/inventory/products');
                }
            });
        }
    };

    useEffect(() => {
        dispatch(setPageTitle('Details Raw Material'));
        dispatch(clearRawProductState());
        const productId = router.query.id;
        if (productId) {
            setIds(Array.isArray(productId) ? productId : [productId]);
            const id = Array.isArray(productId) ? productId[0] : productId;
            dispatch(showDetails(parseInt(id)));
        }

    }, [router.query.id, dispatch]);

    return (
        <div>
            <DetailPageHeader
                appBasePath={AppBasePath.Raw_Product}
                title="Product Details"
                middleComponent={{
                    show: true,
                    edit: {
                        show: !rawProductDetail?.used,
                        onClick: () => console.log('Edited')
                    },
                    print: {
                        show: true,
                        onClick: () => router.push('/apps/inventory/products/print/' + ids.join('/'))
                    },
                    printLabel: {
                        show: true,
                        onClick: () => router.push('/apps/inventory/products/print-label/' + ids.join('/'))
                    },
                    delete: {
                        show: true,
                        onClick: () => handleDelete()
                    },
                    duplicate: {
                        show: true,
                        onClick: () => console.log('duplicate')
                    },
                    email: {
                        show: true,
                        onClick: () => console.log('email')
                    }
                }}
                backButton={{
                    show: true,
                    backLink: '/apps/inventory/products'
                }}
            />
            <PageWrapper
                embedLoader={true}
                loading={loading}
            >
                {rawProductDetail && (
                    <div className="flex w-full flex-col justify-center items-center">
                        <div className="w-full flex flex-col justify-center items-center gap-3">
                            <Image priority={true} width={24} height={24}
                                   src={serverFilePath(rawProductDetail?.thumbnail?.path)}
                                   alt="product image"
                                   className="w-24 h-24 object-cover" />
                            <div className="flex flex-col md:flex-row justify-start items-center gap-3">
                                <strong>Company: </strong>
                                <span>{rawProductDetail.company_detail?.name}</span>
                            </div>
                            <div className="flex flex-col md:flex-row justify-start items-center gap-3">
                                <strong>Branch: </strong>
                                <span>{rawProductDetail.branch_detail ? rawProductDetail.branch_detail.name : 'All Branches'}</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full mt-3">

                            <div className="flex md:justify-start md:items-center gap-3">
                                <strong>Product Category: </strong>
                                <span>{rawProductDetail.raw_product_category?.name + ' (' + rawProductDetail.raw_product_category?.code + ')'}</span>
                            </div>
                            <div className="flex md:justify-start md:items-center gap-3">
                                <strong>Item Code: </strong>
                                <span>{rawProductDetail.item_code}</span>
                            </div>
                            <div className="flex md:justify-start md:items-center gap-3">
                                <strong>Title: </strong>
                                <span>{rawProductDetail.title}</span>
                            </div>
                            <div className="flex md:justify-start md:items-center gap-3">
                                <strong>Valuation Method: </strong>
                                <span>{rawProductDetail.valuation_method}</span>
                            </div>
                            <div className="flex md:justify-start md:items-center gap-3">
                                <strong>Valuated Price: </strong>
                                <span>{rawProductDetail.valuated_unit_price}</span>
                            </div>
                            <div className="flex md:justify-start md:items-center gap-3">
                                <strong>Main Unit: </strong>
                                <span>{rawProductDetail.unit?.name}</span>
                            </div>
                            <div className="flex md:justify-start md:items-center gap-3">
                                <strong>Sub Unit: </strong>
                                <span>{rawProductDetail.sub_unit?.name}</span>
                            </div>
                            <div className="flex md:justify-start md:items-center gap-3">
                                <strong>Min Stock Alert: </strong>
                                <span>{rawProductDetail.min_stock_level + ' (' + rawProductDetail.unit?.name + ')'}</span>
                            </div>
                            <div className="flex md:justify-start md:items-center gap-3">
                                <strong>Opening Stock: </strong>
                                <span>{rawProductDetail.opening_stock + ' (' + rawProductDetail.sub_unit?.name + ')'}</span>
                            </div>
                            <div className="flex md:justify-start md:items-center gap-3">
                                <strong>Opening Stock Balance: </strong>
                                <span>{rawProductDetail.opening_stock_unit_balance}</span>
                            </div>
                            <div className="flex md:justify-start md:items-center gap-3">
                                <strong>Opening Stock Total Balance: </strong>
                                <span>{rawProductDetail.opening_stock_total_balance}</span>
                            </div>
                            <div className="flex md:justify-start md:items-center gap-3">
                                <strong>Retail Price: </strong>
                                <span>{rawProductDetail.retail_price}</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full my-5">
                            <div className="flex flex-col justify-start items-start gap-3">
                                <strong>Purchase Description: </strong>
                                <span>{rawProductDetail.purchase_description}</span>
                            </div>
                            <div className="flex flex-col justify-start items-start gap-3">
                                <strong>Sale Description: </strong>
                                <span>{rawProductDetail.sale_description}</span>
                            </div>
                        </div>
                    </div>
                )}
            </PageWrapper>
        </div>
    );
};

// View.getLayout = (page: any) => <AppLayout>{page}</AppLayout>;
export default View;
