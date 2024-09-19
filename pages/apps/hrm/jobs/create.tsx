import React, { useState } from 'react';
import { useRouter } from 'next/router';
import PageWrapper from '@/components/PageWrapper';
import Button from '@/components/Button';
import { ButtonType, ButtonVariant } from '@/utils/enums';
import { Dropdown } from '@/components/form/Dropdown';
import { Input } from '@/components/form/Input';
import Textarea from '@/components/form/Textarea';

const jobTypes = [
    { label: 'Full Time', value: 'full_time' },
    { label: 'Contract', value: 'contract' },
];

const jobNatures = [
    { label: 'Hybrid', value: 'hybrid' },
    { label: 'Remote', value: 'remote' },
    { label: 'Onsite', value: 'onsite' },
];

const jobStatuses = [
    { label: 'Draft', value: 'draft' },
    { label: 'Publish', value: 'publish' },
    { label: 'Closed', value: 'closed' },
    { label: 'Postponed', value: 'postponed' },
];

const jobSkills = [
    { label: 'PHP', value: 'php' },
    { label: 'JavaScript', value: 'javascript' },
    { label: 'Python', value: 'python' },
    { label: 'Java', value: 'java' },
];

const CreateJob = () => {
    const router = useRouter();

    const [formData, setFormData] = useState({
        job_code: '', // Automatically generated, so this will be disabled in the form
        job_title: '',
        job_type: '',
        job_nature: '',
        job_deadline: '',
        job_status: '',
        job_short_description: '',
        job_skills: [],
        job_long_description: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSelectChange = (name: string, option: { label: string; value: string }) => {
        setFormData({ ...formData, [name]: option.value });
    };

    const handleSubmit = () => {
        // Implement form submission logic here
        // Example: dispatch(createJob(formData));
        router.push('/apps/hrm/jobs');
    };

    return (
        <PageWrapper
            title="Create Job"
            buttons={[
                {
                    text: 'Back to Jobs',
                    type: ButtonType.link,
                    variant: ButtonVariant.secondary,
                    link: '/apps/hrm/jobs',
                },
            ]}
        >
            <div className="max-w-3xl mx-auto">
                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    <Input
                        label="Job Code"
                        name="job_code"
                        value={formData.job_code}
                        onChange={handleChange}
                        type="text"
                        isMasked={false}
                        disabled
                    />
                    <Input
                        label="Job Title"
                        name="job_title"
                        value={formData.job_title}
                        onChange={handleChange}
                        type="text"
                        isMasked={false}
                    />
                    <Dropdown
                        label="Job Type"
                        name="job_type"
                        options={jobTypes}
                        value={formData.job_type}
                        onChange={(option) => handleSelectChange('job_type', option)}
                    />
                    <Dropdown
                        label="Job Nature"
                        name="job_nature"
                        options={jobNatures}
                        value={formData.job_nature}
                        onChange={(option) => handleSelectChange('job_nature', option)}
                    />
                    <Input
                        label="Job Deadline"
                        name="job_deadline"
                        type="date"
                        value={formData.job_deadline}
                        onChange={handleChange}
                        isMasked={false}
                    />
                    <Dropdown
                        label="Job Status"
                        name="job_status"
                        options={jobStatuses}
                        value={formData.job_status}
                        onChange={(option) => handleSelectChange('job_status', option)}
                    />
                    <Textarea
                        label="Job Short Description"
                        name="job_short_description"
                        value={formData.job_short_description}
                        onChange={handleChange}
                        isReactQuill={false}
                    />
                    <Dropdown
                        label="Job Skills"
                        name="job_skills"
                        options={jobSkills}
                        value={formData.job_skills}
                        onChange={(option) => handleSelectChange('job_skills', option)}
                    />
                    <Textarea
                        label="Job Long Description"
                        name="job_long_description"
                        value={formData.job_long_description}
                        onChange={handleChange}
                        isReactQuill={true}
                    />
                    <Button
                        text="Submit"
                        type={ButtonType.submit}
                        variant={ButtonVariant.primary}
                    />
                </form>
            </div>
        </PageWrapper>
    );
};

export default CreateJob;
