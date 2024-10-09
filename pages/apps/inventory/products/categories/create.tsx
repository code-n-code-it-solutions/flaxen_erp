import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from "@/store";
import { useRouter } from "next/router";
import { setPageTitle } from "@/store/slices/themeConfigSlice";
import CategoryModal from "@/components/modals/CategoryModal"; // Ensure path is correct
import { clearRawProductState } from "@/store/slices/rawProductSlice";
import PageWrapper from "@/components/PageWrapper";
import { ButtonType, ButtonVariant, IconType } from "@/utils/enums";
import AppLayout from '@/components/Layouts/AppLayout';
import { storeProductCategory } from '@/store/slices/categorySlice'; // Ensure correct thunk import

const Create = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { productCategory } = useAppSelector(state => state.productCategory);

    const [modalOpen, setModalOpen] = useState(false); // State for modal open
    const [formData, setFormData] = useState({}); // State for form data

    useEffect(() => {
        dispatch(setPageTitle('New'));
    }, [dispatch]);

    useEffect(() => {
        if (productCategory) {
            dispatch(clearRawProductState());
            router.push('/apps/inventory/configur/products/categories');
        }
    }, [productCategory, dispatch, router]);

    const handleSubmit = (data: any) => {
        dispatch(storeProductCategory(data));
    };

    return (
        <PageWrapper
            embedLoader={false}
            breadCrumbItems={[]}
            title="Create Raw Material"
            buttons={[
                {
                    text: 'Back',
                    type: ButtonType.link,
                    variant: ButtonVariant.primary,
                    icon: IconType.back,
                    link: '/erp/inventory/products/categories'
                }
            ]}
        >
            <CategoryModal
                modalOpen={modalOpen}
                setModalOpen={setModalOpen}
                handleSubmit={handleSubmit}
                modalFormData={formData}
            />
        </PageWrapper>
    );
};

Create.getLayout = (page: any) => <AppLayout>{page}</AppLayout>;
export default Create;
