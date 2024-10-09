import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { useRouter } from 'next/router';
import { setPageTitle } from '@/store/slices/themeConfigSlice';
import {
    clearLabReferenceAdded,
    clearProductAssemblyState,
    deleteProductAssembly,
    showDetails,
    storeLabReference
} from '@/store/slices/productAssemblySlice';
import PageWrapper from '@/components/PageWrapper';
import { AppBasePath, ButtonSize, ButtonType, ButtonVariant, IconType, RAW_PRODUCT_LIST_TYPE } from '@/utils/enums';
import AppLayout from '@/components/Layouts/AppLayout';
import DetailPageHeader from '@/components/apps/DetailPageHeader';
import Swal from 'sweetalert2';
import useSetActiveMenu from '@/hooks/useSetActiveMenu';
import Button from '@/components/Button';
import Modal from '@/components/Modal';
import RawProductItemListing from '@/components/listing/RawProductItemListing';
import { Input } from '@/components/form/Input';

const basePath = '/apps/manufacturing/formula';

const View = () => {
    useSetActiveMenu(AppBasePath.Product_Assembly);
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { loading, productAssemblyDetail, labReferenceAdded } = useAppSelector(state => state.productAssembly);
    const [ids, setIds] = useState<string[]>([]);
    const [labReferences, setLabReferences] = useState<any[]>([]);
    const [labReferenceModal, setLabReferenceModal] = useState<boolean>(false);
    const [labReferenceData, setLabReferenceData] = useState<any[]>([]);
    const [labReference, setLabReference] = useState<any>('');

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
        dispatch(clearLabReferenceAdded())
    }, [router.query.id, dispatch]);


    useEffect(() => {
        if (productAssemblyDetail) {
            const uniqueLabReferences = Array.from(new Set(productAssemblyDetail.product_assembly_items.map((item: any) => item.lab_reference)));
            setLabReferences(uniqueLabReferences);
        }

    }, [productAssemblyDetail]);

    useEffect(() => {
        if(labReferenceAdded) {
            setLabReferenceModal(false)
            setLabReference('')
            setLabReferenceData([])
            dispatch(clearLabReferenceAdded())
        }
    }, [labReferenceAdded]);

    return (
        <div className="flex gap-3 flex-col">
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
                    <div className="">
                        <div className="flex justify-end">
                            <Button
                                type={ButtonType.button}
                                text={'Add Lab Reference'}
                                variant={ButtonVariant.primary}
                                onClick={() => {
                                    setLabReferenceModal(true);
                                    setLabReferenceData([]);
                                }}
                                size={ButtonSize.small}
                            />
                        </div>
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
                        {labReferences.length > 0
                            ? (
                                labReferences.map((labReference: any, index: any) => (
                                    <div className="table-responsive" key={index}>
                                        <h4 className="text-lg font-bold mb-1">Lab Reference: {labReference}</h4>
                                        <table key={index}>
                                            <thead>
                                            <tr>
                                                <th>Sr. No</th>
                                                <th>Product</th>
                                                <th>Unit</th>
                                                <th>Qty</th>
                                                <th>Cost</th>
                                                {/*<th>Total</th>*/}
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {productAssemblyDetail?.product_assembly_items.map((item: any, index: any) => (
                                                labReference === item.lab_reference &&
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>
                                                        <div className="flex justify-start flex-col items-start">
                                                            <span
                                                                style={{ fontSize: 8 }}>Code: {item.product?.item_code}</span>
                                                            <span>{item.product?.title}</span>
                                                            <span
                                                                style={{ fontSize: 8 }}>VM: {item.product?.valuation_method}</span>
                                                        </div>
                                                    </td>
                                                    <td>{item.unit?.name}</td>
                                                    <td>{item.quantity}</td>
                                                    <td>{item.cost}</td>
                                                    {/*<td>{(parseFloat(item.cost) * parseFloat(item.quantity)).toFixed(2)}</td>*/}
                                                </tr>
                                            ))}
                                            </tbody>
                                            <tfoot>
                                            <tr>
                                                <th colSpan={3}>Total</th>
                                                <td>
                                                    {productAssemblyDetail?.product_assembly_items.reduce((totalQuantity: number, item: any) => item.lab_reference === labReference ? totalQuantity + parseFloat(item.quantity) : totalQuantity, 0).toFixed(2)}
                                                </td>
                                                <td>
                                                    {productAssemblyDetail?.product_assembly_items.reduce((totalCost: number, item: any) => item.lab_reference === labReference ? totalCost + parseFloat(item.cost) : totalCost, 0).toFixed(2)}
                                                </td>
                                                {/*<td>*/}
                                                {/*    {productAssemblyDetail?.product_assembly_items*/}
                                                {/*        .reduce((total: number, item: any) => item.lab_reference === labReference ? total + parseFloat(item.cost) * parseFloat(item.quantity) : total, 0)*/}
                                                {/*        .toFixed(2)}*/}
                                                {/*</td>*/}
                                            </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                ))
                            ) : (
                                <div className="flex justify-center items-center">
                                <h4 className="text-lg font-bold">No lab reference found.</h4>
                                </div>
                            )}
                    </div>
                )}
            </PageWrapper>
            <Modal
                title="Add Lab Reference"
                show={labReferenceModal}
                setShow={setLabReferenceModal}
                size={'xl'}
                footer={
                    <div className="flex justify-end gap-3">
                        <Button
                            type={ButtonType.button}
                            text={'Close'}
                            variant={ButtonVariant.secondary}
                            onClick={() => {
                                setLabReferenceModal(false);
                                setLabReferenceData([]);
                            }}
                        />
                        <Button
                            type={ButtonType.button}
                            text={'Submit'}
                            variant={ButtonVariant.primary}
                            onClick={() => {
                                // console.log(labReferenceData);
                                let finalData = {
                                    product_assembly_id: productAssemblyDetail.id,
                                    raw_products: labReferenceData.map((item: any) => ({
                                        ...item,
                                        lab_reference: labReference,
                                        raw_product_id: item.raw_product_id,
                                        unit_id: item.unit_id,
                                        unit_price: parseFloat(item.unit_price),
                                        quantity: parseFloat(item.quantity),
                                        description: item.description ? item.description : '',
                                        total: parseFloat(item.cost) * parseFloat(item.quantity),
                                    }))
                                };

                                if (labReferenceData.length === 0 || !labReference) {
                                    if (labReference==='') {
                                        Swal.fire({
                                            icon: 'warning',
                                            title: 'Oops...',
                                            html: `Lab Reference is required.`,
                                            confirmButtonText: 'Okay!',
                                            confirmButtonColor: 'green'
                                        });
                                    }

                                    if (labReferenceData.length === 0) {
                                        Swal.fire({
                                            icon: 'warning',
                                            title: 'Oops...',
                                            html: `Please add some products.`,
                                            confirmButtonText: 'Okay!',
                                            confirmButtonColor: 'green'
                                        });
                                    }
                                } else {
                                    console.log(finalData);
                                    dispatch(storeLabReference(finalData));
                                }
                            }}
                        />
                    </div>
                }
            >
                <div>
                    <div className="mb-5 flex justify-start">
                        <Input
                            label="Lab Reference"
                            type="text"
                            name="lab_reference"
                            onChange={(e) => setLabReference(e.target.value)}
                            placeholder={'Enter Lab Reference'}
                            isMasked={false}
                            required={true}
                        />
                    </div>
                    <RawProductItemListing
                        rawProducts={labReferenceData}
                        setRawProducts={setLabReferenceData}
                        type={RAW_PRODUCT_LIST_TYPE.PRODUCT_ASSEMBLY}
                    />
                </div>
            </Modal>
        </div>
    );
};

// View.getLayout = (page: any) => <AppLayout>{page}</AppLayout>;
export default View;
