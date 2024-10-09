import React, { Fragment, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Tab } from '@headlessui/react';
import { useAppDispatch, useAppSelector } from '@/store';
import { showDetails } from '@/store/slices/jobSlice';
import PageWrapper from '@/components/PageWrapper';
import DetailPageHeader from '@/components/apps/DetailPageHeader';
import Button from '@/components/Button';
import Modal from '@/components/Modal';
import { Input } from '@/components/form/Input';
import { Dropdown } from '@/components/form/Dropdown';

const AppBasePath = {
    Job: '/apps/hrm/jobs',
};

const ViewJobDetails = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { jobDetail, loading } = useAppSelector((state) => state.jobs); // Ensure jobs exists in your state
    const [isModalOpen, setModalOpen] = useState(false);
    const [status, setStatus] = useState<string>('');

    const [candidates, setCandidates] = useState<{ id: number; name: string; phone: string; email: string; education: string; experience: string; status: string; }[]>([
        { id: 1, name: 'John Doe', phone: '123456789', email: 'john@example.com', education: 'BSc', experience: '2 years', status: 'Pending' },
        { id: 2, name: 'Jane Smith', phone: '987654321', email: 'jane@example.com', education: 'MSc', experience: '5 years', status: 'Shortlisted' },
    ]);

    useEffect(() => {
        const jobId = Array.isArray(router.query.id) ? router.query.id[0] : router.query.id; // Ensure jobId is a string
        if (jobId) {
            dispatch(showDetails(jobId)); // Fetch job details by ID
        }
    }, [router.query.id, dispatch]);

    const openModal = (candidateStatus: string) => {
        setStatus(candidateStatus);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setStatus('');
    };

    return (
        <div className="flex flex-col gap-3">
            <DetailPageHeader
                appBasePath={AppBasePath.Job}
                title="Job Details"
                middleComponent={{ show: false }}
                backButton={{ show: true, backLink: '/apps/hrm/jobs' }}
            />
            <PageWrapper loading={loading}>
                {jobDetail && (
                    <>
                        {/* Basic Job Info */}
                        <div className="mb-5 flex items-center justify-between">
                            <div>
                                <h2>{jobDetail.title}</h2>
                                <p>Job Code: {jobDetail.jobCode}</p>
                            </div>
                        </div>

                        {/* Tabs */}
                        <Tab.Group>
                            <Tab.List className="flex border-b">
                                <Tab as={Fragment}>
                                    {({ selected }) => (
                                        <button className={`p-3 ${selected ? 'border-b-2 border-primary text-primary' : ''}`}>
                                            Basic Details
                                        </button>
                                    )}
                                </Tab>
                                <Tab as={Fragment}>
                                    {({ selected }) => (
                                        <button className={`p-3 ${selected ? 'border-b-2 border-primary text-primary' : ''}`}>
                                            Candidates
                                        </button>
                                    )}
                                </Tab>
                            </Tab.List>

                            <Tab.Panels>
                                
                                <Tab.Panel>
                                    <div className="mt-5">
                                        <p>
                                            <strong>Job Title:</strong> {jobDetail.title}
                                        </p>
                                        <p>
                                            <strong>Job Code:</strong> {jobDetail.jobCode}
                                        </p>
                                        <p>
                                            <strong>Description:</strong> {jobDetail.description}
                                        </p>
                                    </div>
                                </Tab.Panel>

                                <Tab.Panel>
                                    <div className="mt-5">
                                        <table className="min-w-full text-left">
                                            <thead>
                                                <tr>
                                                    <th>Sr.No</th>
                                                    <th>Name</th>
                                                    <th>Phone</th>
                                                    <th>Email</th>
                                                    <th>Latest Education</th>
                                                    <th>Latest Experience</th>
                                                    <th>Status</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {candidates.map((candidate, index) => (
                                                    <tr key={candidate.id}>
                                                        <td>{index + 1}</td>
                                                        <td>{candidate.name}</td>
                                                        <td>{candidate.phone}</td>
                                                        <td>{candidate.email}</td>
                                                        <td>{candidate.education}</td>
                                                        <td>{candidate.experience}</td>
                                                        <td>{candidate.status}</td>
                                                        <td>
                                                            <Button onClick={() => openModal(candidate.status)}>Change Status</Button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </Tab.Panel>
                            </Tab.Panels>
                        </Tab.Group>

                        {/* Modal for changing candidate status */}
                        <Modal isOpen={isModalOpen} onClose={closeModal} title="Change Candidate Status">
                            <Dropdown
                                label="Status"
                                name="candidateStatus"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                options={[
                                    { label: 'Pending', value: 'Pending' },
                                    { label: 'Shortlisted', value: 'Shortlisted' },
                                    { label: 'Interview', value: 'Interview' },
                                    { label: 'In Review', value: 'In Review' },
                                    { label: 'Selected', value: 'Selected' },
                                    { label: 'Rejected', value: 'Rejected' },
                                ]}
                            />

                            {status === 'Interview' && (
                                <>
                                    <Input type="date" label="Interview Date" name="interviewDate" onChange={() => {}} />
                                    <Input type="time" label="Interview Time" name="interviewTime" onChange={() => {}} />
                                </>
                            )}

                            <div className="flex justify-end">
                                <Button onClick={closeModal}>Close</Button>
                                <Button onClick={closeModal} variant="primary">
                                    Save
                                </Button>
                            </div>
                        </Modal>
                    </>
                )}
            </PageWrapper>
        </div>
    );
};

export default ViewJobDetails;
