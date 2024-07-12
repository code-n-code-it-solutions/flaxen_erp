import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '@/store';
import { setAuthToken } from '@/configs/api.config';
import PrintContent from './PrintContent';
import BlankLayout from '@/components/Layouts/BlankLayout';
import { PDFViewer, Document } from '@react-pdf/renderer';
import { clearFillingState, getFillingsForPrint } from '@/store/slices/fillingSlice';

const Print = () => {
    const dispatch = useAppDispatch();
    const { loading, fillingsForPrint: contents } = useAppSelector(state => state.filling);
    const { token } = useAppSelector((state) => state.user);
    const router = useRouter();
    const [batchCalculations, setBatchCalculations] = useState<any[]>([]);
    const [itemWiseCalculations, setItemWiseCalculations] = useState([]);

    const calculateItemWise = (fillingDetail: any) => {
        const calculations = fillingDetail.filling_calculations.map((calculation: any) => {
            const perKgCost = calculation.product_assembly.product_assembly_items.reduce((acc: number, item: any) => acc + parseFloat(item.total), 0);
            const rawProduct = calculation.product;
            const totalCost = ((parseFloat(calculation.capacity) * perKgCost) + parseFloat(rawProduct.valuated_unit_price));
            const totalSalePrice = ((parseFloat(calculation.capacity) * perKgCost) + parseFloat(rawProduct.retail_price));

            return {
                productId: rawProduct.id,
                productTitle: rawProduct.title,
                ...calculation,
                costOfGoods: totalCost,
                salePrice: totalSalePrice
            };
        });
        return calculations;
        // setItemWiseCalculations(calculations);
    };

    const calculateBatchCalculation = (fillingDetail: any) => {
        // Get the batch usage order (FIFO or LIFO)
        const batchUsageOrder = fillingDetail.batch_usage_order;

        // Sort the production fillings based on the batch usage order
        const sortedBatches = [...fillingDetail.production_fillings].sort((a: any, b: any) => {
            const dateA: any = new Date(a.production.created_at);
            const dateB: any = new Date(b.production.created_at);
            return batchUsageOrder === 'first-in-first-out' ? dateA - dateB : dateB - dateA;
        });

        let totalUsed = 0;
        const fillingQuantity = fillingDetail.filling_calculations.reduce((acc: number, item: any) => acc + parseFloat(item.filling_quantity), 0);

        const batchCalculations = sortedBatches.map((batch: any) => {
            const batchQuantity = batch.production.no_of_quantity;
            let used = 0;

            if (fillingQuantity - totalUsed > 0) {
                used = Math.min(batchQuantity, fillingQuantity - totalUsed);
                totalUsed += used;
            }

            return {
                batch_number: batch.production.batch_number,
                quantity: batchQuantity,
                used,
                remaining: batchQuantity - used,
                created_at: batch.production.created_at
            };
        });
        return batchCalculations;
        // setBatchCalculations(batchCalculations);
    };

    // useEffect(() => {
    //     if (contents) {
    //         calculateItemWise();
    //         calculateBatchCalculation();
    //     }
    // }, [contents]);

    useEffect(() => {
        setAuthToken(token);
        dispatch(clearFillingState());
        if (router.query.id) {
            dispatch(getFillingsForPrint({ ids: router.query.id, type: 'detail' }));
        }
    }, [router.query.id]);

    return (
        !loading && contents && (
            <PDFViewer
                style={{
                    width: '100%',
                    height: '100vh'
                }}
                showToolbar={true}
            >
                <Document
                    title="Report Preview"
                    author="Flaxen Paints Industry LLC"
                    subject="Report Preview"
                    keywords="pdf, flaxen, flaxen paints, report, preview, flaxen paints industry llc"
                >
                    {contents && contents.map((content: any, index: number) => (
                        <PrintContent
                            key={index}
                            content={content}
                            itemWiseCalculations={calculateItemWise(content)}
                            batchCalculations={calculateBatchCalculation(content)}
                        />
                    ))}

                </Document>
            </PDFViewer>

        )
    );
};

Print.getLayout = (page: any) => (<BlankLayout>{page}</BlankLayout>);

export default Print;
