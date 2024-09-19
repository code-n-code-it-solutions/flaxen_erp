import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import AppLayout from '@/components/Layouts/AppLayout';
import Button from '@/components/Button';
import { ButtonType, ButtonVariant } from '@/utils/enums';

const JobDetail = () => {
    const router = useRouter();
    const { job_id } = router.query;
    const [jobData, setJobData] = useState<any>(null);

    useEffect(() => {
        // Fetch job details by job_code (replace with actual API call)
        const fetchData = async () => {
            // Simulate API data
            const data = { job_id: 'J001', title: 'Software Engineer', type: 'Full Time', nature: 'Onsite', status: 'Active', deadline: '2024-12-31', no_of_candid: 10 };
            setJobData(data);
        };

        if (job_id) {
            fetchData();
        }
    }, [job_id]); // Fixed the dependency array syntax

    if (!jobData) return <p>Loading...</p>;

    return (
        <div>
            <h1>{jobData.title}</h1>
            <p>Job Code: {jobData.job_id}</p>
            <p>Type: {jobData.type}</p>
            <p>Nature: {jobData.nature}</p>
            <p>Status: {jobData.status}</p>
            <p>Deadline: {jobData.deadline}</p>
            <p>No of Candidates: {jobData.no_of_candid}</p>
            <Button
                text="Back to Jobs"
                variant={ButtonVariant.secondary} // Added the variant prop
                onClick={() => router.push('/apps/hrm/jobs')}
            />
        </div>
    );
};

JobDetail.getLayout = (page: any) => <AppLayout>{page}</AppLayout>;
export default JobDetail;
