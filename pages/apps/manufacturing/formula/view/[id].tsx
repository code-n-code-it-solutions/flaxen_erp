import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { useRouter } from 'next/router';
import { setPageTitle } from '@/store/slices/themeConfigSlice';
import { clearProductAssemblyState, deleteProductAssembly, showDetails } from '@/store/slices/productAssemblySlice';
import PageWrapper from '@/components/PageWrapper';
import { AppBasePath, ButtonType, ButtonVariant, IconType } from '@/utils/enums';
import AppLayout from '@/components/Layouts/AppLayout';
import DetailPageHeader from '@/components/apps/DetailPageHeader';
import Swal from 'sweetalert2';
import { deleteRawProduct } from '@/store/slices/rawProductSlice';
import useSetActiveMenu from '@/hooks/useSetActiveMenu';

const basePath = '/apps/manufacturing/formula';

const View = () => {
    useSetActiveMenu(AppBasePath.Product_Assembly);
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { loading, productAssemblyDetail } = useAppSelector(state => state.productAssembly);
    const [ids, setIds] = useState<string[]>([]);

    const handleDelete = () => {
        if (productAssemblyDetail.used > 0) {
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
                    dispatch(deleteProductAssembly([productAssemblyDetail.id]));
                    router.push('/apps/manufacturing/formula');
                }
            });
        }
    };

    useEffect(() => {
        dispatch(setPageTitle('Product Formula'));
        dispatch(clearProductAssemblyState());
        const productAssemblyId = router.query.id;
        if (productAssemblyId) {
            setIds(Array.isArray(productAssemblyId) ? productAssemblyId : [productAssemblyId]);
            const id = Array.isArray(productAssemblyId) ? productAssemblyId[0] : productAssemblyId;
            dispatch(showDetails(parseInt(id)));
        }

        const route = router.route;
        console.log(route);
    }, [router.query.id, dispatch]);

    return (
        <div>
            <DetailPageHeader
                appBasePath={AppBasePath.Product_Assembly}
                title="Product Assembly Details"
                middleComponent={{
                    show: true,
                    edit: {
                        show: !productAssemblyDetail?.used,
                        onClick: () => console.log('Edited')
                    },
                    print: {
                        show: true,
                        onClick: () => router.push('/apps/manufacturing/formula/print/' + ids.join('/'))
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
                    backLink: '/apps/manufacturing/formula'
                }}
            />
            <PageWrapper
                loading={loading}
                embedLoader={true}
            >
                {productAssemblyDetail && (
                    <div className="my-5">
                        <div className="flex items-start justify-between my-5">
                            <div className="flex flex-col gap-3">
                                <span className="text-base">
                                    <strong>Formula Name: </strong> {productAssemblyDetail?.formula_name}
                                </span>
                                <span className="text-base">
                                    <strong>Formula Code: </strong> {productAssemblyDetail?.formula_code}
                                </span>
                            </div>
                            <div className="flex flex-col gap-3">
                                <span className="text-base">
                                    <strong>Color
                                        Code: </strong> {productAssemblyDetail?.color_code?.name + ' (' + productAssemblyDetail?.color_code?.hex_code + ')'}
                                </span>
                                <span className="text-base">
                                    <strong>Category: </strong> {productAssemblyDetail?.category?.name}
                                </span>
                            </div>
                        </div>
                        <h3 className="text-lg font-bold">Formula Product Details:</h3>
                        <table>
                            <thead>
                            <tr>
                                <th>Sr. No</th>
                                <th>Product</th>
                                <th>Unit</th>
                                <th>Unit Price</th>
                                <th>Qty</th>
                                <th>Total</th>
                            </tr>
                            </thead>
                            <tbody>
                            {productAssemblyDetail?.product_assembly_items.map((item: any, index: any) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <div className="flex justify-start flex-col items-start">
                                            <span style={{ fontSize: 8 }}>Code: {item.product?.item_code}</span>
                                            <span>{item.product?.title}</span>
                                            <span style={{ fontSize: 8 }}>VM: {item.product?.valuation_method}</span>
                                        </div>
                                    </td>
                                    <td>{item.unit?.name}</td>
                                    <td>{item.cost}</td>
                                    <td>{item.quantity}</td>
                                    <td>{(parseFloat(item.cost) * parseFloat(item.quantity)).toFixed(2)}</td>
                                </tr>
                            ))}
                            </tbody>
                            <tfoot>
                            <tr>
                                <th colSpan={3}>Total</th>
                                <td>
                                    {productAssemblyDetail?.product_assembly_items.reduce((totalCost: number, item: any) => totalCost + parseFloat(item.cost), 0).toFixed(2)}
                                </td>
                                <td>
                                    {productAssemblyDetail?.product_assembly_items.reduce((totalQuantity: number, item: any) => totalQuantity + parseFloat(item.quantity), 0).toFixed(2)}
                                </td>
                                <td>
                                    {productAssemblyDetail?.product_assembly_items
                                        .reduce((total: number, item: any) => total + parseFloat(item.cost) * parseFloat(item.quantity), 0)
                                        .toFixed(2)}
                                </td>
                            </tr>
                            </tfoot>
                        </table>
                    </div>
                )}
            </PageWrapper>
        </div>
    );
};

View.getLayout = (page: any) => <AppLayout>{page}</AppLayout>;
export default View;
