import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '@/store';
import Button from '@/components/Button';
import { Input } from '@/components/form/Input';
import AppLayout from '@/components/Layouts/AppLayout';
import { ButtonType, ButtonVariant } from '@/utils/enums';
import { getJobDetails, updateJob, clearJobState } from '@/store/slices/jobSlice'; // Adjust path as necessary

const JobEdit = () => {
    const router = useRouter();
    const { job_code } = router.query;
    const dispatch = useAppDispatch();
    const { jobDetails, loading, error } = useAppSelector((state) => state.job);

    const [title, setTitle] = useState('');
    const [type, setType] = useState('');
    const [nature, setNature] = useState('');
    const [status, setStatus] = useState('');
    const [deadline, setDeadline] = useState('');
    const [no_of_candid, setNo_of_candid] = useState<number>(0);

    useEffect(() => {
        if (job_code) {
            dispatch(getJobDetails(job_code as string)); // Fetch job details
        }
        return () => {
            dispatch(clearJobState()); // Clear state on unmount
        };
    }, [job_code, dispatch]);

    useEffect(() => {
        if (jobDetails) {
            setTitle(jobDetails.title || '');
            setType(jobDetails.type || '');
            setNature(jobDetails.nature || '');
            setStatus(jobDetails.status || '');
            setDeadline(jobDetails.deadline || '');
            setNo_of_candid(jobDetails.no_of_candid || 0);
        }
    }, [jobDetails]);

    const handleSave = () => {
        if (!title || !type || !nature || !status || !deadline || no_of_candid <= 0) {
            // Handle validation errors
            alert('Please fill out all fields correctly.');
            return;
        }
        dispatch(updateJob({
            job_code: job_code as string,
            title,
            type,
            nature,
            status,
            deadline,
            no_of_candid
        }));
        router.push('/apps/hrm/jobs'); // Redirect after save
    };

    return (
        <div className="flex flex-col gap-5 p-5">
            <h1 className="text-xl font-semibold">Edit Job</h1>
            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">Error: {error}</p>}
            <div className="flex flex-col gap-4">
                <Input
                    label="Title"
                    type="text"
                    name="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <Input
                    label="Type"
                    type="text"
                    name="type"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                />
                <Input
                    label="Nature"
                    type="text"
                    name="nature"
                    value={nature}
                    onChange={(e) => setNature(e.target.value)}
                />
                <Input
                    label="Status"
                    type="text"
                    name="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                />
                <Input
                    label="Deadline"
                    type="date"
                    name="deadline"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                />
                <Input
                    label="Number of Candidates"
                    type="number"
                    name="no_of_candid"
                    value={no_of_candid.toString()}
                    onChange={(e) => setNo_of_candid(parseInt(e.target.value, 10))}
                />
                <div className="flex gap-4 mt-4">
                    <Button
                        type={ButtonType.button}
                        text="Save"
                        variant={ButtonVariant.primary}
                        onClick={handleSave}
                    />
                    <Button
                        type={ButtonType.button}
                        text="Cancel"
                        variant={ButtonVariant.secondary}
                        onClick={() => router.push('/apps/hrm/jobs')}
                    />
                </div>
            </div>
        </div>
    );
};

JobEdit.getLayout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;
export default JobEdit;
