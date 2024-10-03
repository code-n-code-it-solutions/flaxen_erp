import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from "@/store";
import { useRouter } from "next/router";
import { setPageTitle } from "@/store/slices/themeConfigSlice";
import PageWrapper from "@/components/PageWrapper";
import { clearTemplateState } from "@/store/slices/templateSlice";
import { ButtonType, ButtonVariant, IconType } from "@/utils/enums";
import TemplateFormModal from '@/components/modals/TemplateFormModal'; 
import AppLayout from '@/components/Layouts/AppLayout';

const CreateTemplate = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { template, loading, success } = useAppSelector(state => state.template);
    const [modalOpen, setModalOpen] = useState<boolean>(false); // State to manage modal

    useEffect(() => {
        dispatch(setPageTitle('New Template'));
    }, [dispatch]);

    useEffect(() => {
        // If the template is successfully created, clear the state and navigate back
        if (template && success) {
            dispatch(clearTemplateState());
            router.push('/apps/hrm/configuration/template');
        }
    }, [template, success, dispatch, router]);

    const handleSubmit = (formData: any) => {
       
        console.log('Form data submitted:', formData);
    };

    return (
        <PageWrapper
            embedLoader={false}
            breadCrumbItems={[]}
            loading={loading}
            title="Create Template"
            buttons={[
                {
                    text: 'Back',
                    type: ButtonType.link,
                    variant: ButtonVariant.primary,
                    icon: IconType.back,
                    link: '' // Adjust the link as needed
                },
                {
                    text: 'Add New Template',
                    type: ButtonType.button,
                    variant: ButtonVariant.primary,
                    icon: IconType.add,
                    onClick: () => setModalOpen(true) // Open the modal when clicked
                }
            ]}
        >
            {/* Template form modal component */}
            <TemplateFormModal
                modalOpen={modalOpen} // Pass modal open state
                setModalOpen={setModalOpen} // Pass function to close modal
                handleSubmit={handleSubmit} // Pass submit handler
            />
        </PageWrapper>
    );
};

// Ensure the page uses the correct layout
CreateTemplate.getLayout = (page: any) => <AppLayout>{page}</AppLayout>;

export default CreateTemplate;
