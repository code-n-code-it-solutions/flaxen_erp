import Dropdown from '@/components/Dropdown';
import { useDispatch, useSelector } from 'react-redux';
import { ReactSortable } from 'react-sortablejs';
import { IRootState } from '@/store';
import { useState, Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Swal from 'sweetalert2';
import { setPageTitle } from '@/store/slices/themeConfigSlice';

const Scrumboard = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Scrumboard'));
    });
    const [projectList, setProjectList] = useState<any>([
        {
            id: 1,
            title: 'In Progress',
            tasks: [
                {
                    projectId: 1,
                    id: 1,
                    title: 'Creating a new Portfolio on Dribble',
                    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
                    image: true,
                    date: ' 08 Aug, 2020',
                    tags: ['designing'],
                },
                {
                    projectId: 1,
                    id: 2,
                    title: 'Singapore Team Meet',
                    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
                    date: ' 09 Aug, 2020',
                    tags: ['meeting'],
                },
            ],
        },
        {
            id: 2,
            title: 'Pending',
            tasks: [
                {
                    projectId: 2,
                    id: 3,
                    title: 'Plan a trip to another country',
                    description: '',
                    date: ' 10 Sep, 2020',
                },
            ],
        },
        {
            id: 3,
            title: 'Complete',
            tasks: [
                {
                    projectId: 3,
                    id: 4,
                    title: 'Dinner with Kelly Young',
                    description: '',
                    date: ' 08 Aug, 2020',
                },
                {
                    projectId: 3,
                    id: 5,
                    title: 'Launch New SEO Wordpress Theme ',
                    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                    date: ' 09 Aug, 2020',
                },
            ],
        },
        {
            id: 4,
            title: 'Working',
            tasks: [],
        },
    ]);
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;
    const changeValue = (e: any) => {
        const { value, id } = e.target;
        setParams({ ...params, [id]: value });
    };
    const [params, setParams] = useState<any>({
        id: null,
        title: '',
    });
    const [paramsTask, setParamsTask] = useState<any>({
        projectId: null,
        id: null,
        title: '',
        description: '',
        tags: '',
        date: '',
    });

    const [selectedTask, setSelectedTask] = useState<any>(null);
    const [isAddProjectModal, setIsAddProjectModal] = useState(false);
    const [isAddTaskModal, setIsAddTaskModal] = useState(false);
    const [isDeleteModal, setIsDeleteModal] = useState(false);

    const addEditProject = (project: any = null) => {
        setTimeout(() => {
            setParams({
                id: null,
                title: '',
            });
            if (project) {
                let projectData = JSON.parse(JSON.stringify(project));
                setParams(projectData);
            }
            setIsAddProjectModal(true);
        });
    };

    const showMessage = (msg = '', type = 'success') => {
        const toast: any = Swal.mixin({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 3000,
            customClass: { container: 'toast' },
        });
        toast.fire({
            icon: type,
            title: msg,
            padding: '10px 20px',
        });
    };

    const saveProject = () => {
        if (!params.title) {
            showMessage('Title is required.', 'error');
            return false;
        }

        if (params.id) {
            //update project
            const project = projectList.find((d: any) => d.id === params.id);
            project.title = params.title;
        } else {
            //add project
            const lastId = projectList.reduce((max: number, obj: any) => (obj.id > max ? obj.id : max), projectList[0].id) || 0;

            const project = {
                id: lastId + 1,
                title: params.title,
                tasks: [],
            };
            projectList.push(project);
        }

        showMessage('Project has been saved successfully.');
        setIsAddProjectModal(false);
    };

    const deleteProject = (project: any) => {
        setProjectList(projectList.filter((d: any) => d.id !== project.id));
        showMessage('Project has been deleted successfully.');
    };

    const clearProjects = (project: any) => {
        setParamsTask((project.tasks = []));
    };

    const addTaskData = (e: any) => {
        const { value, id } = e.target;
        setParamsTask({ ...paramsTask, [id]: value });
    };

    const addEditTask = (projectId: any, task: any = null) => {
        setParamsTask({
            projectId: projectId,
            id: null,
            title: '',
            description: '',
            tags: '',
            date: '',
        });
        if (task) {
            let data = JSON.parse(JSON.stringify(task));
            data.projectId = projectId;
            data.tags = data.tags ? data.tags.toString() : '';
            setParamsTask(data);
        }
        setIsAddTaskModal(true);
    };

    const saveTask = () => {
        if (!paramsTask.title) {
            showMessage('Title is required.', 'error');
            return false;
        }
        const project: any = projectList.find((d: any) => d.id === paramsTask.projectId);
        if (paramsTask.id) {
            //update task
            const task = project.tasks.find((d: any) => d.id === paramsTask.id);
            task.title = paramsTask.title;
            task.description = paramsTask.description;
            task.tags = paramsTask.tags?.length > 0 ? paramsTask.tags.split(',') : [];
        } else {
            //add task
            let maxId = 0;
            maxId = project.tasks?.length ? project.tasks.reduce((max: number, obj: any) => (obj.id > max ? obj.id : max), project.tasks[0].id) : 0;

            const today = new Date();
            const dd = String(today.getDate()).padStart(2, '0');
            const mm = String(today.getMonth()); //January is 0!
            const yyyy = today.getFullYear();
            const monthNames: any = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const task = {
                projectId: paramsTask.projectId,
                id: maxId + 1,
                title: paramsTask.title,
                description: paramsTask.description,
                date: dd + ' ' + monthNames[mm] + ', ' + yyyy,
                tags: paramsTask.tags?.length > 0 ? paramsTask.tags.split(',') : [],
            };
            setParamsTask(project.tasks.push(task));
        }

        showMessage('Task has been saved successfully.');
        setIsAddTaskModal(false);
    };

    const deleteConfirmModal = (projectId: any, task: any = null) => {
        setSelectedTask(task);
        setTimeout(() => {
            setIsDeleteModal(true);
        }, 10);
    };
    const deleteTask = () => {
        let project = projectList.find((d: any) => d.id === selectedTask.projectId);
        project.tasks = project.tasks.filter((d: any) => d.id !== selectedTask.id);
        showMessage('Task has been deleted successfully.');
        setIsDeleteModal(false);
    };

    return (
        <div>
            <div>
                <button
                    type="button"
                    className="btn btn-primary flex"
                    onClick={() => {
                        addEditProject();
                    }}
                >
                    <svg className="w-5 h-5 ltr:mr-3 rtl:ml-3" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    Add Project
                </button>
            </div>
            {/* project list  */}
            <div className="relative pt-5">
                <div className="perfect-scrollbar h-full -mx-2">
                    <div className="overflow-x-auto flex items-start flex-nowrap gap-5 pb-2 px-2">
                        {projectList.map((project: any) => {
                            return (
                                <div key={project.id} className="panel w-80 flex-none" data-group={project.id}>
                                    <div className="flex justify-between mb-5">
                                        <h4 className="text-base font-semibold">{project.title}</h4>

                                        <div className="flex items-center">
                                            <button onClick={() => addEditTask(project.id)} type="button" className="hover:text-primary ltr:mr-2 rtl:ml-2">
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
                                                    <circle opacity="0.5" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                                                    <path d="M15 12L12 12M12 12L9 12M12 12L12 9M12 12L12 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                </svg>
                                            </button>
                                            <div className="dropdown">
                                                <Dropdown
                                                    offset={[0, 5]}
                                                    placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                                                    button={
                                                        <svg
                                                            className="w-5 h-5 text-black/70 dark:text-white/70 hover:!text-primary"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <circle cx="5" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                                                            <circle opacity="0.5" cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                                                            <circle cx="19" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                                                        </svg>
                                                    }
                                                >
                                                    <ul>
                                                        <li>
                                                            <button type="button" onClick={() => addEditProject(project)}>
                                                                Edit
                                                            </button>
                                                        </li>
                                                        <li>
                                                            <button type="button" onClick={() => deleteProject(project)}>
                                                                Delete
                                                            </button>
                                                        </li>
                                                        <li>
                                                            <button type="button" onClick={() => clearProjects(project)}>
                                                                Clear All
                                                            </button>
                                                        </li>
                                                    </ul>
                                                </Dropdown>
                                            </div>
                                        </div>
                                    </div>
                                    <ReactSortable
                                        list={project.tasks}
                                        setList={(newState, sortable) => {
                                            if (sortable) {
                                                const groupId: any = sortable.el.closest('[data-group]')?.getAttribute('data-group') || 0;
                                                const newList = projectList.map((task: any) => {
                                                    if (parseInt(task.id) === parseInt(groupId)) {
                                                        task.tasks = newState;
                                                    }

                                                    return task;
                                                });
                                                setProjectList(newList);
                                            }
                                        }}
                                        animation={200}
                                        group={{ name: 'shared', pull: true, put: true }}
                                        ghostClass="sortable-ghost"
                                        dragClass="sortable-drag"
                                        className="connect-sorting-content min-h-[150px]"
                                    >
                                        {project.tasks.map((task: any) => {
                                            return (
                                                <div className="sortable-list " key={project.id + '' + task.id}>
                                                    <div className="shadow bg-[#f4f4f4] dark:bg-white-dark/20 p-3 pb-5 rounded-md mb-5 space-y-3 cursor-move">
                                                        {task.image ? <img src="/assets/images/carousel1.jpeg" alt="images" className="h-32 w-full object-cover rounded-md" /> : ''}
                                                        <div className="text-base font-medium">{task.title}</div>
                                                        <p className="break-all">{task.description}</p>
                                                        <div className="flex gap-2 items-center flex-wrap">
                                                            {task.tags?.length ? (
                                                                task.tags.map((tag: any, i: any) => {
                                                                    return (
                                                                        <div key={i} className="btn px-2 py-1 flex btn-outline-primary">
                                                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                <path
                                                                                    d="M4.72848 16.1369C3.18295 14.5914 2.41018 13.8186 2.12264 12.816C1.83509 11.8134 2.08083 10.7485 2.57231 8.61875L2.85574 7.39057C3.26922 5.59881 3.47597 4.70292 4.08944 4.08944C4.70292 3.47597 5.59881 3.26922 7.39057 2.85574L8.61875 2.57231C10.7485 2.08083 11.8134 1.83509 12.816 2.12264C13.8186 2.41018 14.5914 3.18295 16.1369 4.72848L17.9665 6.55812C20.6555 9.24711 22 10.5916 22 12.2623C22 13.933 20.6555 15.2775 17.9665 17.9665C15.2775 20.6555 13.933 22 12.2623 22C10.5916 22 9.24711 20.6555 6.55812 17.9665L4.72848 16.1369Z"
                                                                                    stroke="currentColor"
                                                                                    strokeWidth="1.5"
                                                                                />
                                                                                <circle
                                                                                    opacity="0.5"
                                                                                    cx="8.60699"
                                                                                    cy="8.87891"
                                                                                    r="2"
                                                                                    transform="rotate(-45 8.60699 8.87891)"
                                                                                    stroke="currentColor"
                                                                                    strokeWidth="1.5"
                                                                                />
                                                                                <path opacity="0.5" d="M11.5417 18.5L18.5208 11.5208" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                                            </svg>
                                                                            <span className="ltr:ml-2 rtl:mr-2">{tag}</span>
                                                                        </div>
                                                                    );
                                                                })
                                                            ) : (
                                                                <div className="btn px-2 py-1 flex text-white-dark dark:border-white-dark/50 shadow-none">
                                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                        <path
                                                                            d="M4.72848 16.1369C3.18295 14.5914 2.41018 13.8186 2.12264 12.816C1.83509 11.8134 2.08083 10.7485 2.57231 8.61875L2.85574 7.39057C3.26922 5.59881 3.47597 4.70292 4.08944 4.08944C4.70292 3.47597 5.59881 3.26922 7.39057 2.85574L8.61875 2.57231C10.7485 2.08083 11.8134 1.83509 12.816 2.12264C13.8186 2.41018 14.5914 3.18295 16.1369 4.72848L17.9665 6.55812C20.6555 9.24711 22 10.5916 22 12.2623C22 13.933 20.6555 15.2775 17.9665 17.9665C15.2775 20.6555 13.933 22 12.2623 22C10.5916 22 9.24711 20.6555 6.55812 17.9665L4.72848 16.1369Z"
                                                                            stroke="currentColor"
                                                                            strokeWidth="1.5"
                                                                        />
                                                                        <circle
                                                                            opacity="0.5"
                                                                            cx="8.60699"
                                                                            cy="8.87891"
                                                                            r="2"
                                                                            transform="rotate(-45 8.60699 8.87891)"
                                                                            stroke="currentColor"
                                                                            strokeWidth="1.5"
                                                                        />
                                                                        <path opacity="0.5" d="M11.5417 18.5L18.5208 11.5208" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                                    </svg>
                                                                    <span className="ltr:ml-2 rtl:mr-2">No Tags</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center justify-between">
                                                            <div className="font-medium flex items-center hover:text-primary">
                                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 ltr:mr-3 rtl:ml-3">
                                                                    <path
                                                                        d="M2 12C2 8.22876 2 6.34315 3.17157 5.17157C4.34315 4 6.22876 4 10 4H14C17.7712 4 19.6569 4 20.8284 5.17157C22 6.34315 22 8.22876 22 12V14C22 17.7712 22 19.6569 20.8284 20.8284C19.6569 22 17.7712 22 14 22H10C6.22876 22 4.34315 22 3.17157 20.8284C2 19.6569 2 17.7712 2 14V12Z"
                                                                        stroke="currentColor"
                                                                        strokeWidth="1.5"
                                                                    />
                                                                    <path opacity="0.5" d="M7 4V2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                                    <path opacity="0.5" d="M17 4V2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                                    <path opacity="0.5" d="M2 9H22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                                </svg>
                                                                <span>{task.date}</span>
                                                            </div>
                                                            <div className="flex items-center">
                                                                <button onClick={() => addEditTask(project.id, task)} type="button" className="hover:text-info">
                                                                    <svg
                                                                        width="24"
                                                                        height="24"
                                                                        viewBox="0 0 24 24"
                                                                        fill="none"
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        className="w-5 h-5 ltr:mr-3 rtl:ml-3"
                                                                    >
                                                                        <path
                                                                            opacity="0.5"
                                                                            d="M22 10.5V12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2H13.5"
                                                                            stroke="currentColor"
                                                                            strokeWidth="1.5"
                                                                            strokeLinecap="round"
                                                                        />
                                                                        <path
                                                                            d="M17.3009 2.80624L16.652 3.45506L10.6872 9.41993C10.2832 9.82394 10.0812 10.0259 9.90743 10.2487C9.70249 10.5114 9.52679 10.7957 9.38344 11.0965C9.26191 11.3515 9.17157 11.6225 8.99089 12.1646L8.41242 13.9L8.03811 15.0229C7.9492 15.2897 8.01862 15.5837 8.21744 15.7826C8.41626 15.9814 8.71035 16.0508 8.97709 15.9619L10.1 15.5876L11.8354 15.0091C12.3775 14.8284 12.6485 14.7381 12.9035 14.6166C13.2043 14.4732 13.4886 14.2975 13.7513 14.0926C13.9741 13.9188 14.1761 13.7168 14.5801 13.3128L20.5449 7.34795L21.1938 6.69914C22.2687 5.62415 22.2687 3.88124 21.1938 2.80624C20.1188 1.73125 18.3759 1.73125 17.3009 2.80624Z"
                                                                            stroke="currentColor"
                                                                            strokeWidth="1.5"
                                                                        />
                                                                        <path
                                                                            opacity="0.5"
                                                                            d="M16.6522 3.45508C16.6522 3.45508 16.7333 4.83381 17.9499 6.05034C19.1664 7.26687 20.5451 7.34797 20.5451 7.34797M10.1002 15.5876L8.4126 13.9"
                                                                            stroke="currentColor"
                                                                            strokeWidth="1.5"
                                                                        />
                                                                    </svg>
                                                                </button>
                                                                <button onClick={() => deleteConfirmModal(project.id, task)} type="button" className="hover:text-danger">
                                                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
                                                                        <path
                                                                            opacity="0.5"
                                                                            d="M9.17065 4C9.58249 2.83481 10.6937 2 11.9999 2C13.3062 2 14.4174 2.83481 14.8292 4"
                                                                            stroke="currentColor"
                                                                            strokeWidth="1.5"
                                                                            strokeLinecap="round"
                                                                        ></path>
                                                                        <path d="M20.5001 6H3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                                                                        <path
                                                                            d="M18.8334 8.5L18.3735 15.3991C18.1965 18.054 18.108 19.3815 17.243 20.1907C16.378 21 15.0476 21 12.3868 21H11.6134C8.9526 21 7.6222 21 6.75719 20.1907C5.89218 19.3815 5.80368 18.054 5.62669 15.3991L5.16675 8.5"
                                                                            stroke="currentColor"
                                                                            strokeWidth="1.5"
                                                                            strokeLinecap="round"
                                                                        ></path>
                                                                        <path opacity="0.5" d="M9.5 11L10 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                                                                        <path opacity="0.5" d="M14.5 11L14 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </ReactSortable>
                                    <div className="pt-3">
                                        <button type="button" className="btn btn-primary mx-auto" onClick={() => addEditTask(project.id)}>
                                            <svg
                                                className="w-5 h-5"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth="1.5"
                                                fill="none"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                                <line x1="5" y1="12" x2="19" y2="12"></line>
                                            </svg>
                                            Add Task
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            {/* add project modal */}
            <Transition appear show={isAddProjectModal} as={Fragment}>
                <Dialog as="div" open={isAddProjectModal} onClose={() => setIsAddProjectModal(false)} className="relative z-50">
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0 bg-[black]/60" />
                    </Transition.Child>
                    <div className="fixed inset-0 bg-[black]/60 z-[999] px-4 overflow-y-auto">
                        <div className="flex items-center justify-center min-h-screen">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-lg text-black dark:text-white-dark">
                                    <button
                                        type="button"
                                        onClick={() => setIsAddProjectModal(false)}
                                        className="absolute top-4 ltr:right-4 rtl:left-4 text-gray-400 hover:text-gray-800 dark:hover:text-gray-600 outline-none"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="20"
                                            height="20"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <line x1="18" y1="6" x2="6" y2="18"></line>
                                            <line x1="6" y1="6" x2="18" y2="18"></line>
                                        </svg>
                                    </button>
                                    <div className="text-lg font-medium bg-[#fbfbfb] dark:bg-[#121c2c] ltr:pl-5 rtl:pr-5 py-3 ltr:pr-[50px] rtl:pl-[50px]">
                                        {params.id ? 'Id Project' : 'Add Project'}
                                    </div>
                                    <div className="p-5">
                                        <form onSubmit={saveProject}>
                                            <div className="grid gap-5">
                                                <div>
                                                    <label htmlFor="title">Name</label>
                                                    <input id="title" value={params.title} onChange={changeValue} type="text" className="form-input mt-1" placeholder="Enter Name" />
                                                </div>
                                            </div>

                                            <div className="flex justify-end items-center mt-8">
                                                <button type="button" className="btn btn-outline-danger" onClick={() => setIsAddProjectModal(false)}>
                                                    Cancel
                                                </button>
                                                <button type="submit" className="btn btn-primary ltr:ml-4 rtl:mr-4">
                                                    {params.id ? 'Update' : 'Add'}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
            {/* add task modal */}
            <Transition appear show={isAddTaskModal} as={Fragment}>
                <Dialog as="div" open={isAddTaskModal} onClose={() => setIsAddTaskModal(false)} className="relative z-50">
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0 bg-[black]/60" />
                    </Transition.Child>
                    <div className="fixed inset-0 z-[999] overflow-y-auto">
                        <div className="flex items-center justify-center min-h-screen px-4">
                            <Dialog.Panel className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-lg text-black dark:text-white-dark">
                                <button onClick={() => setIsAddTaskModal(false)} type="button" className="absolute top-4 ltr:right-4 rtl:left-4 text-white-dark hover:text-dark">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <line x1="18" y1="6" x2="6" y2="18"></line>
                                        <line x1="6" y1="6" x2="18" y2="18"></line>
                                    </svg>
                                </button>
                                <div className="text-lg font-medium bg-[#fbfbfb] dark:bg-[#121c2c] ltr:pl-5 rtl:pr-5 py-3 ltr:pr-[50px] rtl:pl-[50px]">{paramsTask.id ? 'Id Task' : 'Add Task'}</div>
                                <div className="p-5">
                                    <form onSubmit={saveTask}>
                                        <div className="grid gap-5">
                                            <div>
                                                <label htmlFor="taskTitle">Name</label>
                                                <input id="title" value={paramsTask.title} onChange={addTaskData} type="text" className="form-input" placeholder="Enter Name" />
                                            </div>
                                            <div>
                                                <label htmlFor="taskTag">Tag</label>
                                                <input id="tags" value={paramsTask.tags} onChange={addTaskData} type="text" className="form-input" placeholder="Enter Tag" />
                                            </div>
                                            <div>
                                                <label htmlFor="taskdesc">Description</label>
                                                <textarea
                                                    id="description"
                                                    value={paramsTask.description}
                                                    onChange={addTaskData}
                                                    className="form-textarea min-h-[130px]"
                                                    placeholder="Enter Description"
                                                ></textarea>
                                            </div>
                                        </div>
                                        <div className="flex justify-end items-center mt-8">
                                            <button onClick={() => setIsAddTaskModal(false)} type="button" className="btn btn-outline-danger">
                                                Cancel
                                            </button>
                                            <button type="submit" className="btn btn-primary ltr:ml-4 rtl:mr-4">
                                                {paramsTask.id ? 'Update' : 'Add'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </Dialog.Panel>
                        </div>
                    </div>
                </Dialog>
            </Transition>
            {/* delete task modal */}
            <Transition appear show={isDeleteModal} as={Fragment}>
                <Dialog as="div" open={isDeleteModal} onClose={() => setIsDeleteModal(false)} className="relative z-50">
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0 bg-[black]/60" />
                    </Transition.Child>
                    <div className="fixed inset-0 z-[999] overflow-y-auto">
                        <div className="flex items-center justify-center min-h-screen px-4 ">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="panel border-0 p-0 rounded-lg overflow-hidden md:w-full max-w-lg w-[90%] my-8">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsDeleteModal(false);
                                        }}
                                        className="absolute top-4 ltr:right-4 rtl:left-4 text-white-dark"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <line x1="18" y1="6" x2="6" y2="18"></line>
                                            <line x1="6" y1="6" x2="18" y2="18"></line>
                                        </svg>
                                    </button>
                                    <div className="text-lg font-medium bg-[#fbfbfb] dark:bg-[#121c2c] ltr:pl-5 rtl:pr-5 py-3 ltr:pr-[50px] rtl:pl-[50px]">Delete Task</div>
                                    <div className="p-5 text-center">
                                        <div className="text-white bg-danger ring-4 ring-danger/30 p-4 rounded-full w-fit mx-auto">
                                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    opacity="0.5"
                                                    d="M9.17065 4C9.58249 2.83481 10.6937 2 11.9999 2C13.3062 2 14.4174 2.83481 14.8292 4"
                                                    stroke="currentColor"
                                                    strokeWidth="1.5"
                                                    strokeLinecap="round"
                                                />
                                                <path d="M20.5001 6H3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                <path
                                                    d="M18.8334 8.5L18.3735 15.3991C18.1965 18.054 18.108 19.3815 17.243 20.1907C16.378 21 15.0476 21 12.3868 21H11.6134C8.9526 21 7.6222 21 6.75719 20.1907C5.89218 19.3815 5.80368 18.054 5.62669 15.3991L5.16675 8.5"
                                                    stroke="currentColor"
                                                    strokeWidth="1.5"
                                                    strokeLinecap="round"
                                                />
                                                <path opacity="0.5" d="M9.5 11L10 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                <path opacity="0.5" d="M14.5 11L14 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                            </svg>
                                        </div>
                                        <div className="text-base sm:w-3/4 mx-auto mt-5">Are you sure you want to delete Task?</div>

                                        <div className="flex justify-center items-center mt-8">
                                            <button
                                                onClick={() => {
                                                    setIsDeleteModal(false);
                                                }}
                                                type="button"
                                                className="btn btn-outline-danger"
                                            >
                                                Cancel
                                            </button>
                                            <button onClick={deleteTask} type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4">
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
};
export default Scrumboard;
