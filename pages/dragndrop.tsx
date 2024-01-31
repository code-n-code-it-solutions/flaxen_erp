import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ReactSortable } from 'react-sortablejs';
import { setPageTitle } from '../store/slices/themeConfigSlice';
import { useDispatch } from 'react-redux';
// import { MultiDrag } from 'sortablejs';
// import Sortable from 'sortablejs';

const items1 = [
    {
        id: 1,
        text: 'Need to be approved',
        name: 'Kelly Young',
    },
    {
        id: 2,
        text: 'Meeting with client',
        name: 'Andy King',
    },
    {
        id: 3,
        text: 'Project Detail',
        name: 'Judy Holmes',
    },
    {
        id: 4,
        text: 'Edited Post Apporval',
        name: 'Vincent Carpenter',
    },
    {
        id: 5,
        text: 'Project Lead Pickup',
        name: 'Mary McDonald',
    },
];
const items2 = [
    {
        id: 6,
        text: 'Need to be approved',
        name: 'Kelly Young',
    },
    {
        id: 7,
        text: 'Meeting with client',
        name: 'Andy King',
    },
    {
        id: 8,
        text: 'Project Detail',
        name: 'Judy Holmes',
    },
    {
        id: 9,
        text: 'Edited Post Apporval',
        name: 'Vincent Carpenter',
    },
    {
        id: 10,
        text: 'Project Lead Pickup',
        name: 'Mary McDonald',
    },
];
const items3 = [
    {
        id: 2,
        text: 'Meeting with client',
        name: 'Andy King',
    },
    {
        id: 1,
        text: 'Need to be approved',
        name: 'Kelly Young',
    },
    {
        id: 3,
        text: 'Project Detail',
        name: 'Judy Holmes',
    },
    {
        id: 4,
        text: 'Edited Post Apporval',
        name: 'Vincent Carpenter',
    },
];
const items4 = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
    { id: 3, name: 'Item 3' },
    { id: 4, name: 'Item 4' },
    { id: 5, name: 'Item 5' },
    { id: 6, name: 'Item 6' },
    { id: 7, name: 'Item 7' },
    { id: 8, name: 'Item 8' },
    { id: 9, name: 'Item 9' },
    { id: 10, name: 'Item 10' },
    { id: 11, name: 'Item 11' },
    { id: 12, name: 'Item 12' },
];

const DragAndDrop = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Drag & Drop'));
    });
    // ReactSortable.mount(new MultiDrag());

    const [sortable1, setSortable1] = useState(items1);
    const [sortable2, setSortable2] = useState(items2);
    const [iconChange1, setIconChange1] = useState(items1);
    const [iconChange2, setIconChange2] = useState(items2);
    const [handler1, setHandler1] = useState(items1);
    const [handler2, setHandler2] = useState(items2);
    // const [multipleDrag1, setMultipleDrag1] = useState(items1);
    // const [multipleDrag2, setMultipleDrag2] = useState(items2);
    const [newsFeed, setNewsFeed] = useState(items3);
    const [delete1, setDelete1] = useState(items1);
    const [delete2, setDelete2] = useState(items2);
    const [gridDrag, setGridDrag] = useState(items4);
    const [swap, setSwap] = useState([...items1, ...items2]);

    return (
        <div>
            <ul className="mb-6 flex space-x-2 rtl:space-x-reverse">
                <li>
                    <Link href="#" className="text-primary hover:underline">
                        Dashboard
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>Drag & Drop</span>
                </li>
            </ul>

            <div className="dragndrop space-y-8">
                <div className="panel flex items-center overflow-x-auto whitespace-nowrap p-3 text-primary">
                    <div className="rounded-full bg-primary p-1.5 text-white ring-2 ring-primary/30 ltr:mr-3 rtl:ml-3">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M19.0001 9.7041V9C19.0001 5.13401 15.8661 2 12.0001 2C8.13407 2 5.00006 5.13401 5.00006 9V9.7041C5.00006 10.5491 4.74995 11.3752 4.28123 12.0783L3.13263 13.8012C2.08349 15.3749 2.88442 17.5139 4.70913 18.0116C9.48258 19.3134 14.5175 19.3134 19.291 18.0116C21.1157 17.5139 21.9166 15.3749 20.8675 13.8012L19.7189 12.0783C19.2502 11.3752 19.0001 10.5491 19.0001 9.7041Z"
                                stroke="currentColor"
                                strokeWidth="1.5"
                            />
                            <path opacity="0.5" d="M7.5 19C8.15503 20.7478 9.92246 22 12 22C14.0775 22 15.845 20.7478 16.5 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                    </div>
                    <span className="ltr:mr-3 rtl:ml-3">Documentation: </span>
                    <a href="https://www.npmjs.com/package/react-sortablejs" target="_blank" className="block hover:underline" rel="noreferrer">
                        https://www.npmjs.com/package/react-sortablejs
                    </a>
                </div>
                {/* Sortable */}
                <div className="panel">
                    <div className="mb-5 text-lg font-semibold">Sortable</div>
                    <div className="grid grid-cols-1 gap-x-12 sm:grid-cols-2">
                        <div>
                            <ul id="example1">
                                <ReactSortable list={sortable1} setList={setSortable1} animation={200} delay={2} ghostClass="gu-transit" group="shared">
                                    {sortable1.map((item) => {
                                        return (
                                            <li key={item.id} className="mb-2.5 cursor-grab">
                                                <div className="items-md-center flex flex-col rounded-md border border-white-light bg-white px-6 py-3.5 text-center dark:border-dark dark:bg-[#1b2e4b] md:flex-row ltr:md:text-left rtl:md:text-right">
                                                    <div className="ltr:sm:mr-4 rtl:sm:ml-4">
                                                        <img alt="avatar" src={`/assets/images/profile-${item.id}.jpeg`} className="mx-auto h-11 w-11 rounded-full" />
                                                    </div>
                                                    <div className="flex flex-1 flex-col items-center justify-between md:flex-row">
                                                        <div className="my-3 font-semibold md:my-0">
                                                            <div className="text-base text-dark dark:text-[#bfc9d4]">{item.text}</div>
                                                            <div className="text-xs text-white-dark">{item.name}</div>
                                                        </div>
                                                        <div>
                                                            <button type="button" className="btn btn-secondary btn-sm px-5 py-2">
                                                                View
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ReactSortable>
                            </ul>
                        </div>
                        <div>
                            <ul id="example2">
                                <ReactSortable list={sortable2} setList={setSortable2} animation={200} delay={2} ghostClass="gu-transit" group="shared">
                                    {sortable2.map((item) => {
                                        return (
                                            <li key={item.id} className="mb-2.5 cursor-grab">
                                                <div className="items-md-center flex flex-col rounded-md border border-white-light bg-white px-6 py-3.5 text-center dark:border-dark dark:bg-[#1b2e4b] md:flex-row ltr:md:text-left rtl:md:text-right">
                                                    <div className="ltr:sm:mr-4 rtl:sm:ml-4">
                                                        <img alt="avatar" src={`/assets/images/profile-${item.id}.jpeg`} className="mx-auto h-11 w-11 rounded-full" />
                                                    </div>
                                                    <div className="flex flex-1 flex-col items-center justify-between md:flex-row">
                                                        <div className="my-3 font-semibold md:my-0">
                                                            <div className="text-base text-dark dark:text-[#bfc9d4]">{item.text}</div>
                                                            <div className="text-xs text-white-dark">{item.name}</div>
                                                        </div>
                                                        <div>
                                                            <button type="button" className="btn btn-secondary btn-sm px-5 py-2">
                                                                View
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ReactSortable>
                            </ul>
                        </div>
                    </div>
                </div>
                {/* Icon change */}
                <div className="panel">
                    <div className="mb-5 text-lg font-semibold dark:text-white">Icon Change</div>
                    <div className="icon-change grid grid-cols-1 gap-x-12 sm:grid-cols-2">
                        <div>
                            <ul id="example3" className="left">
                                <ReactSortable list={iconChange1} setList={setIconChange1} animation={200} ghostClass="gu-transit" group="icon">
                                    {iconChange1.map((item) => {
                                        return (
                                            <li key={item.id} className="mb-2.5 cursor-grab">
                                                <div className="items-md-center flex flex-col rounded-md border border-white-light bg-white px-6 py-3.5 ltr:text-left rtl:text-right dark:border-dark dark:bg-[#1b2e4b] md:flex-row">
                                                    <div className="ltr:sm:mr-4 rtl:sm:ml-4">
                                                        <img alt="avatar" src={`/assets/images/profile-${item.id}.jpeg`} className="h-11 w-11 rounded-full" />
                                                    </div>
                                                    <div className="flex flex-1 items-center justify-between">
                                                        <div className="my-3 font-semibold md:my-0">
                                                            <div className="text-base text-dark dark:text-[#bfc9d4]">{item.text}</div>
                                                            <div className="text-xs text-white-dark">{item.name}</div>
                                                        </div>
                                                        <div className="text-white-dark">
                                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path
                                                                    d="M9.15316 5.40838C10.4198 3.13613 11.0531 2 12 2C12.9469 2 13.5802 3.13612 14.8468 5.40837L15.1745 5.99623C15.5345 6.64193 15.7144 6.96479 15.9951 7.17781C16.2757 7.39083 16.6251 7.4699 17.3241 7.62805L17.9605 7.77203C20.4201 8.32856 21.65 8.60682 21.9426 9.54773C22.2352 10.4886 21.3968 11.4691 19.7199 13.4299L19.2861 13.9372C18.8096 14.4944 18.5713 14.773 18.4641 15.1177C18.357 15.4624 18.393 15.8341 18.465 16.5776L18.5306 17.2544C18.7841 19.8706 18.9109 21.1787 18.1449 21.7602C17.3788 22.3417 16.2273 21.8115 13.9243 20.7512L13.3285 20.4768C12.6741 20.1755 12.3469 20.0248 12 20.0248C11.6531 20.0248 11.3259 20.1755 10.6715 20.4768L10.0757 20.7512C7.77268 21.8115 6.62118 22.3417 5.85515 21.7602C5.08912 21.1787 5.21588 19.8706 5.4694 17.2544L5.53498 16.5776C5.60703 15.8341 5.64305 15.4624 5.53586 15.1177C5.42868 14.773 5.19043 14.4944 4.71392 13.9372L4.2801 13.4299C2.60325 11.4691 1.76482 10.4886 2.05742 9.54773C2.35002 8.60682 3.57986 8.32856 6.03954 7.77203L6.67589 7.62805C7.37485 7.4699 7.72433 7.39083 8.00494 7.17781C8.28555 6.96479 8.46553 6.64194 8.82547 5.99623L9.15316 5.40838Z"
                                                                    stroke="currentColor"
                                                                    strokeWidth="1.5"
                                                                />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ReactSortable>
                            </ul>
                        </div>

                        <div>
                            <ul id="example4" className="right">
                                <ReactSortable list={iconChange2} setList={setIconChange2} animation={200} ghostClass="gu-transit" group="icon">
                                    {iconChange2.map((item) => {
                                        return (
                                            <li key={item.id} className="mb-2.5 cursor-grab">
                                                <div className="items-md-center flex flex-col rounded-md border border-white-light bg-white px-6 py-3.5 ltr:text-left rtl:text-right dark:border-dark dark:bg-[#1b2e4b] md:flex-row">
                                                    <div className="ltr:sm:mr-4 rtl:sm:ml-4">
                                                        <img alt="avatar" src={`/assets/images/profile-${item.id}.jpeg`} className="h-11 w-11 rounded-full" />
                                                    </div>
                                                    <div className="flex flex-1 items-center justify-between">
                                                        <div className="my-3 font-semibold md:my-0">
                                                            <div className="text-base text-dark dark:text-[#bfc9d4]">{item.text}</div>
                                                            <div className="text-xs text-white-dark">{item.name}</div>
                                                        </div>
                                                        <div className="text-white-dark">
                                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6">
                                                                <path
                                                                    d="M12 5.50063C7.50016 0.825464 2 4.27416 2 9.1371C2 14 6.01943 16.5914 8.96173 18.9109C10 19.7294 11 20.5 12 20.5"
                                                                    stroke="currentColor"
                                                                    strokeWidth="1.5"
                                                                    strokeLinecap="round"
                                                                />
                                                                <path
                                                                    opacity="0.5"
                                                                    d="M12 5.50063C16.4998 0.825464 22 4.27416 22 9.1371C22 14 17.9806 16.5914 15.0383 18.9109C14 19.7294 13 20.5 12 20.5"
                                                                    stroke="currentColor"
                                                                    strokeWidth="1.5"
                                                                    strokeLinecap="round"
                                                                />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ReactSortable>
                            </ul>
                        </div>
                    </div>
                </div>
                {/* Handler */}
                <div className="panel">
                    <div className="mb-5 text-lg font-semibold dark:text-white">Handler</div>
                    <div className="grid grid-cols-1 gap-x-12 sm:grid-cols-2">
                        <div>
                            <ul id="example5">
                                <ReactSortable list={handler1} setList={setHandler1} animation={200} handle=".handle" group="handler" ghostClass="gu-transit">
                                    {handler1.map((item) => {
                                        return (
                                            <li key={item.id} className="mb-2.5 cursor-grab">
                                                <div className="items-md-center flex flex-col rounded-md border border-white-light bg-white px-6 py-3.5 ltr:text-left rtl:text-right dark:border-dark dark:bg-[#1b2e4b] md:flex-row">
                                                    <div className="ltr:sm:mr-4 rtl:sm:ml-4">
                                                        <img alt="avatar" src={`/assets/images/profile-${item.id}.jpeg`} className="mx-auto h-11 w-11 rounded-full" />
                                                    </div>
                                                    <div className="flex flex-1 flex-col items-center justify-between text-center md:flex-row md:text-left">
                                                        <div className="my-3 font-semibold md:my-0">
                                                            <div className="text-base text-dark dark:text-[#bfc9d4]">{item.text}</div>
                                                            <div className="text-xs text-white-dark">{item.name}</div>
                                                        </div>
                                                        <div className="text-white-dark">
                                                            <span className="handle cursor-move rounded bg-[#ebedf2] px-2 ltr:mr-1 rtl:ml-1 dark:bg-black">+</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ReactSortable>
                            </ul>
                        </div>

                        <div>
                            <ul id="example6">
                                <ReactSortable list={handler2} setList={setHandler2} animation={200} handle=".handle" group="handler" ghostClass="gu-transit">
                                    {handler2.map((item) => {
                                        return (
                                            <li key={item.id} className="mb-2.5 cursor-grab">
                                                <div className="items-md-center flex flex-col rounded-md border border-white-light bg-white px-6 py-3.5 ltr:text-left rtl:text-right dark:border-dark dark:bg-[#1b2e4b] md:flex-row">
                                                    <div className="ltr:sm:mr-4 rtl:sm:ml-4">
                                                        <img alt="avatar" src={`/assets/images/profile-${item.id}.jpeg`} className="mx-auto h-11 w-11 rounded-full" />
                                                    </div>
                                                    <div className="block flex-1 items-center justify-between text-center sm:flex md:text-left">
                                                        <div className="my-3 font-semibold md:my-0">
                                                            <div className="text-base text-dark dark:text-[#bfc9d4]">{item.text}</div>
                                                            <div className="text-xs text-white-dark">{item.name}</div>
                                                        </div>
                                                        <div className="text-white-dark">
                                                            <span className="handle cursor-move rounded bg-[#ebedf2] px-2 ltr:mr-1 rtl:ml-1 dark:bg-black">+</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ReactSortable>
                            </ul>
                        </div>
                    </div>
                </div>
                {/* Multiple drag */}
                {/* <div className="panel">
                <div className="font-semibold text-lg dark:text-white mb-5">Multiple Drag</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12">
                    <div>
                        <ul id="example7">
                            <ReactSortable
                                list={multipleDrag1}
                                setList={setMultipleDrag1}
                                animation={200}
                                group="multiple"
                                multiDrag={true}
                                selectedClass="selected"
                                fallbackTolerance={3}
                                ghostClass="gu-transit"

                            >
                                {multipleDrag1.map((item) => {
                                    return (
                                        <div key={item.id}>
                                            <li className="mb-2.5 cursor-grab">
                                                <div className="bg-white dark:bg-[#1b2e4b] rounded-md border border-white-light dark:border-dark px-6 py-3.5 flex md:flex-row flex-col ltr:text-left rtl:text-right items-md-center">
                                                    <div className="ltr:sm:mr-4 rtl:sm:ml-4">
                                                        <img
                                                            alt="avatar"
                                                            src={`/assets/images/profile-${item.id}.jpeg`}
                                                            className="w-11 h-11 rounded-full mx-auto"
                                                        />
                                                    </div>
                                                    <div className="flex justify-between items-center flex-1">
                                                        <div className="font-semibold md:my-0 my-3">
                                                            <div className="text-dark dark:text-[#bfc9d4] text-base">
                                                                {item.text}
                                                            </div>
                                                            <div className="text-white-dark text-xs">{item.name}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        </div>
                                    );
                                })}
                            </ReactSortable>
                        </ul>
                    </div>

                    <div>
                        <ul id="example8">
                            <ReactSortable
                                list={multipleDrag2}
                                setList={setMultipleDrag2}
                                animation={200}
                                group="multiple"
                                multiDrag={true}
                                selectedClass="selected"
                                fallbackTolerance={3}
                                ghostClass="gu-transit"

                            >
                                {multipleDrag2.map((item) => {
                                    return (
                                        <div key={item.id}>
                                            <li className="mb-2.5 cursor-grab">
                                                <div className="bg-white dark:bg-[#1b2e4b] rounded-md border border-white-light dark:border-dark px-6 py-3.5 flex md:flex-row flex-col ltr:text-left rtl:text-right items-md-center">
                                                    <div className="ltr:sm:mr-4 rtl:sm:ml-4">
                                                        <img
                                                            alt="avatar"
                                                            src={`/assets/images/profile-${item.id}.jpeg`}
                                                            className="w-11 h-11 rounded-full mx-auto"
                                                        />
                                                    </div>
                                                    <div className="flex justify-between items-center flex-1">
                                                        <div className="font-semibold md:my-0 my-3">
                                                            <div className="text-dark dark:text-[#bfc9d4] text-base">
                                                                {item.text}
                                                            </div>
                                                            <div className="text-white-dark text-xs">{item.name}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        </div>
                                    );
                                })}
                            </ReactSortable>
                        </ul>
                    </div>
                </div>
            </div>  */}

                {/* News Feed */}
                <div className="panel">
                    <div className="mb-5 text-lg font-semibold dark:text-white">News Feed</div>
                    <div>
                        <div id="example12">
                            <ReactSortable list={newsFeed} setList={setNewsFeed} animation={200} className="grid grid-cols-1 gap-x-12 sm:grid-cols-2">
                                {newsFeed.map((item) => {
                                    return (
                                        <div className="mb-2.5" key={item.id}>
                                            <div className="rounded-md border border-white-light bg-white px-6 py-3.5 dark:border-dark dark:bg-[#1b2e4b]">
                                                <div className="py-sm-2.5 items-md-center block text-center sm:flex ltr:md:text-left rtl:md:text-right">
                                                    <div className="ltr:sm:mr-4 rtl:sm:ml-4">
                                                        <img alt="avatar" src={`/assets/images/profile-${item.id + 1}.jpeg`} className="mx-auto h-11 w-11 rounded-lg" />
                                                    </div>
                                                    <div className="flex flex-1 flex-col items-center justify-between md:flex-row">
                                                        <div className="my-3 font-semibold md:my-0">
                                                            <div className="text-base text-dark dark:text-[#bfc9d4]">{item.name}</div>
                                                            <div className="text-xs text-white-dark">11 hours ago</div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mb-4 border-b border-b-[#f1f2f3] py-5 dark:border-b-dark">
                                                    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                                                    veniam, quis nostrud exercitation.
                                                </div>
                                                <div className="flex-wrap items-center md:flex">
                                                    <div className="text-center ltr:md:text-left rtl:md:text-right xl:flex-1">
                                                        <div className="flex justify-center -space-x-2 text-white rtl:space-x-reverse md:justify-start">
                                                            <img
                                                                className="h-10 w-10 rounded-full object-cover ring-2 ring-white dark:ring-white-dark"
                                                                src="/assets/images/profile-6.jpeg"
                                                                alt="avatar"
                                                            />
                                                            <img
                                                                className="h-10 w-10 rounded-full object-cover ring-2 ring-white dark:ring-white-dark"
                                                                src="/assets/images/profile-7.jpeg"
                                                                alt="avatar"
                                                            />
                                                            <img
                                                                className="h-10 w-10 rounded-full object-cover ring-2 ring-white dark:ring-white-dark"
                                                                src="/assets/images/profile-8.jpeg"
                                                                alt="avatar"
                                                            />
                                                            <img
                                                                className="h-10 w-10 rounded-full object-cover ring-2 ring-white dark:ring-white-dark"
                                                                src="/assets/images/profile-10.jpeg"
                                                                alt="avatar"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="text-center ltr:md:text-right rtl:md:text-left">
                                                        <span className="block pt-2 text-xs text-white-dark lg:pt-0">
                                                            <button className="mr-1 text-sm font-semibold text-danger dark:text-primary">Vincent, Mary</button>
                                                            and 19 other like this
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </ReactSortable>
                        </div>
                    </div>
                </div>
                {/* Delete */}
                <div className="panel">
                    <div className="mb-5 text-lg font-semibold dark:text-white">Delete User</div>
                    <div className="grid grid-cols-1 gap-x-12 sm:grid-cols-2">
                        <div>
                            <ul id="example7">
                                <ReactSortable
                                    list={delete1}
                                    setList={setDelete1}
                                    animation={200}
                                    group="delete"
                                    removeOnSpill={true}
                                    //
                                    className="min-h-[200px]"
                                >
                                    {delete1.map((item) => {
                                        return (
                                            <li key={item.id} className="mb-2.5 cursor-grab">
                                                <div className="items-md-center flex flex-col rounded-md border border-white-light bg-white px-6 py-3.5 ltr:text-left rtl:text-right dark:border-dark dark:bg-[#1b2e4b] md:flex-row">
                                                    <div className="ltr:sm:mr-4 rtl:sm:ml-4">
                                                        <img alt="avatar" src={`/assets/images/profile-${item.id}.jpeg`} className="mx-auto h-11 w-11 rounded-full" />
                                                    </div>
                                                    <div className="flex flex-1 flex-col items-center justify-between text-center md:flex-row md:text-left">
                                                        <div className="my-3 font-semibold md:my-0">
                                                            <div className="text-base text-dark dark:text-[#bfc9d4]">{item.text}</div>
                                                            <div className="text-xs text-white-dark">{item.name}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ReactSortable>
                            </ul>
                        </div>

                        <div>
                            <ul id="example8">
                                <ReactSortable
                                    list={delete2}
                                    setList={setDelete2}
                                    animation={200}
                                    group="delete"
                                    removeOnSpill={true}
                                    //
                                    className="min-h-[200px]"
                                >
                                    {delete2.map((item) => {
                                        return (
                                            <li key={item.id} className="mb-2.5 cursor-grab">
                                                <div className="items-md-center flex flex-col rounded-md border border-white-light bg-white px-6 py-3.5 ltr:text-left rtl:text-right dark:border-dark dark:bg-[#1b2e4b] md:flex-row">
                                                    <div className="ltr:sm:mr-4 rtl:sm:ml-4">
                                                        <img alt="avatar" src={`/assets/images/profile-${item.id}.jpeg`} className="mx-auto h-11 w-11 rounded-full" />
                                                    </div>
                                                    <div className="flex flex-1 flex-col items-center justify-between text-center md:flex-row md:text-left">
                                                        <div className="my-3 font-semibold md:my-0">
                                                            <div className="text-base text-dark dark:text-[#bfc9d4]">{item.text}</div>
                                                            <div className="text-xs text-white-dark">{item.name}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ReactSortable>
                            </ul>
                        </div>
                    </div>
                </div>
                {/* Grid drag */}
                <div className="dragndrop space-y-8">
                    <div className="panel">
                        <div className="mb-5 text-lg font-semibold dark:text-white">Grid drag</div>
                        <div id="example11">
                            <ReactSortable list={gridDrag} setList={setGridDrag} animation={200} className="xs grid grid-cols-2 place-items-center gap-8 sm:grid-cols-4 md:grid-cols-8">
                                {gridDrag.map((item) => {
                                    return (
                                        <div
                                            key={item.id}
                                            className="flex h-24 w-24 cursor-grab items-center justify-center rounded-md border border-white-light font-semibold shadow dark:border-dark"
                                        >
                                            {item.name}
                                        </div>
                                    );
                                })}
                            </ReactSortable>
                        </div>
                    </div>
                </div>
                {/* Swap */}
                <div className="panel">
                    <div className="mb-5 text-lg font-semibold dark:text-white">Swap</div>
                    <div>
                        <div>
                            <ul id="example7">
                                <ReactSortable list={swap} setList={setSwap} animation={200} swap={true} swapThreshold={1} className="grid grid-cols-1 gap-x-12 gap-y-2.5 sm:grid-cols-2">
                                    {swap.map((item) => {
                                        return (
                                            <li key={item.id} className=" cursor-grab">
                                                <div className="items-md-center flex flex-col rounded-md border border-white-light bg-white px-6 py-3.5 ltr:text-left rtl:text-right dark:border-dark dark:bg-[#1b2e4b] md:flex-row">
                                                    <div className="ltr:sm:mr-4 rtl:sm:ml-4">
                                                        <img alt="avatar" src={`/assets/images/profile-${item.id}.jpeg`} className="mx-auto h-11 w-11 rounded-full" />
                                                    </div>
                                                    <div className="flex flex-1 flex-col items-center justify-between text-center md:flex-row md:text-left">
                                                        <div className="my-3 font-semibold md:my-0">
                                                            <div className="text-base text-dark dark:text-[#bfc9d4]">{item.text}</div>
                                                            <div className="text-xs text-white-dark">{item.name}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ReactSortable>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DragAndDrop;
