import Link from 'next/link';
import { useEffect, useState } from 'react';
import CodeHighlight from '@/components/Highlight';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { setPageTitle } from '@/store/slices/themeConfigSlice';
import { useDispatch } from 'react-redux';
const Avatar = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Avatar'));
    });
    const [codeArr, setCodeArr] = useState<string[]>([]);

    const toggleCode = (name: string) => {
        if (codeArr.includes(name)) {
            setCodeArr((value) => value.filter((d) => d !== name));
        } else {
            setCodeArr([...codeArr, name]);
        }
    };
    return (
        <div>
            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li>
                    <Link href="#" className="text-primary hover:underline">
                        Elements
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>Avatar</span>
                </li>
            </ul>
            <div className="grid grid-cols-1 gap-6 pt-5 lg:grid-cols-2">
                {/* Basic */}
                <div className="panel" id="basic">
                    <div className="mb-5 flex items-center justify-between">
                        <h5 className="text-lg font-semibold dark:text-white-light">Basic</h5>
                        <button
                            onClick={() => {
                                toggleCode('code1');
                            }}
                            className="font-semibold hover:text-gray-400 dark:text-gray-400 dark:hover:text-gray-600"
                        >
                            <span className="flex items-center">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ltr:mr-2 rtl:ml-2">
                                    <path
                                        d="M17 7.82959L18.6965 9.35641C20.239 10.7447 21.0103 11.4389 21.0103 12.3296C21.0103 13.2203 20.239 13.9145 18.6965 15.3028L17 16.8296"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                    />
                                    <path opacity="0.5" d="M13.9868 5L10.0132 19.8297" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    <path
                                        d="M7.00005 7.82959L5.30358 9.35641C3.76102 10.7447 2.98975 11.4389 2.98975 12.3296C2.98975 13.2203 3.76102 13.9145 5.30358 15.3028L7.00005 16.8296"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                    />
                                </svg>
                                Code
                            </span>
                        </button>
                    </div>
                    <div className="mb-5">
                        <div className="flex flex-wrap items-center justify-center gap-2">
                            <img className="h-20 w-20 overflow-hidden rounded-full object-cover" src="/assets/images/profile-12.jpeg" alt="img" />
                            <img className="h-16 w-16 overflow-hidden rounded-full object-cover" src="/assets/images/profile-12.jpeg" alt="img" />
                            <img className="h-14 w-14 overflow-hidden rounded-full object-cover" src="/assets/images/profile-12.jpeg" alt="img" />
                            <img className="h-12 w-12 overflow-hidden rounded-full object-cover" src="/assets/images/profile-12.jpeg" alt="img" />
                        </div>
                    </div>
                    {codeArr.includes('code1') && (
                        <CodeHighlight>
                            <pre className="language-xml">
                                {`<img className="w-20 h-20 rounded-full overflow-hidden object-cover" src="/assets/images/profile-12.jpeg" alt="img" />

<img className="w-16 h-16 rounded-full overflow-hidden object-cover" src="/assets/images/profile-12.jpeg" alt="img" />

<img className="w-14 h-14 rounded-full overflow-hidden object-cover" src="/assets/images/profile-12.jpeg" alt="img" />

<img className="w-12 h-12 rounded-full overflow-hidden object-cover" src="/assets/images/profile-12.jpeg" alt="img" />
                                    `}
                            </pre>
                        </CodeHighlight>
                    )}
                </div>
                {/* Indicators */}
                <div className="panel" id="indicators">
                    <div className="mb-5 flex items-center justify-between">
                        <h5 className="text-lg font-semibold dark:text-white-light">Indicators</h5>
                        <button
                            onClick={() => {
                                toggleCode('code2');
                            }}
                            className="font-semibold hover:text-gray-400 dark:text-gray-400 dark:hover:text-gray-600"
                        >
                            <span className="flex items-center">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ltr:mr-2 rtl:ml-2">
                                    <path
                                        d="M17 7.82959L18.6965 9.35641C20.239 10.7447 21.0103 11.4389 21.0103 12.3296C21.0103 13.2203 20.239 13.9145 18.6965 15.3028L17 16.8296"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                    />
                                    <path opacity="0.5" d="M13.9868 5L10.0132 19.8297" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    <path
                                        d="M7.00005 7.82959L5.30358 9.35641C3.76102 10.7447 2.98975 11.4389 2.98975 12.3296C2.98975 13.2203 3.76102 13.9145 5.30358 15.3028L7.00005 16.8296"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                    />
                                </svg>
                                Code
                            </span>
                        </button>
                    </div>
                    <div className="mb-5">
                        <div className="flex flex-wrap items-center justify-center gap-2">
                            <span className="relative h-20 w-20">
                                <img className="h-20 w-20 overflow-hidden rounded-full object-cover" src="/assets/images/profile-12.jpeg" alt="img" />
                                <span className="absolute bottom-0 h-7 w-7 rounded-full bg-danger ring-2 ring-white ltr:right-0 rtl:left-0 dark:ring-white-dark"></span>
                            </span>
                            <span className="relative h-16 w-16">
                                <img className="h-16 w-16 overflow-hidden rounded-full object-cover" src="/assets/images/profile-12.jpeg" alt="img" />
                                <span className="absolute bottom-0 h-6 w-6 rounded-full bg-success ring-2 ring-white ltr:right-0 rtl:left-0 dark:ring-white-dark"></span>
                            </span>
                            <span className="relative h-14 w-14">
                                <img className="h-14 w-14 overflow-hidden rounded-full object-cover" src="/assets/images/profile-12.jpeg" alt="img" />
                                <span className="absolute bottom-0 h-5 w-5 rounded-full bg-secondary ring-2 ring-white ltr:right-0 rtl:left-0 dark:ring-white-dark"></span>
                            </span>
                            <span className="relative h-12 w-12">
                                <img className="h-12 w-12 overflow-hidden rounded-full object-cover" src="/assets/images/profile-12.jpeg" alt="img" />
                                <span className="absolute bottom-0 h-4 w-4 rounded-full bg-info ring-2 ring-white ltr:right-0 rtl:left-0 dark:ring-white-dark"></span>
                            </span>
                        </div>
                    </div>
                    {codeArr.includes('code2') && (
                        <CodeHighlight>
                            <pre className='language-xml'>
{`<span className="w-20 h-20 relative">
    <img className="w-20 h-20 rounded-full overflow-hidden object-cover" src="/assets/images/profile-12.jpeg" alt="img" />
    <span className="absolute ltr:right-0 rtl:left-0 bottom-0 w-7 h-7 rounded-full ring-2 ring-white dark:ring-white-dark bg-danger"></span>
</span>
<span className="w-16 h-16 relative">
    <img className="w-16 h-16 rounded-full overflow-hidden object-cover" src="/assets/images/profile-12.jpeg" alt="img" />
    <span className="absolute ltr:right-0 rtl:left-0 bottom-0 w-6 h-6 rounded-full ring-2 ring-white dark:ring-white-dark bg-success"></span>
</span>
<span className="w-14 h-14 relative">
    <img className="w-14 h-14 rounded-full overflow-hidden object-cover" src="/assets/images/profile-12.jpeg" alt="img" />
    <span className="absolute ltr:right-0 rtl:left-0 bottom-0 w-5 h-5 rounded-full ring-2 ring-white dark:ring-white-dark bg-secondary"></span>
</span>
<span className="w-12 h-12 relative">
    <img className="w-12 h-12 rounded-full overflow-hidden object-cover" src="/assets/images/profile-12.jpeg" alt="img" />
    <span className="absolute ltr:right-0 rtl:left-0 bottom-0 w-4 h-4 rounded-full ring-2 ring-white dark:ring-white-dark bg-info"></span>
</span>
                                    `}</pre>
                        </CodeHighlight>
                    )}
                </div>
                {/* Shapes */}
                <div className="panel" id="shapes">
                    <div className="mb-5 flex items-center justify-between">
                        <h5 className="text-lg font-semibold dark:text-white-light">Shapes</h5>
                        <button
                            onClick={() => {
                                toggleCode('code3');
                            }}
                            className="font-semibold hover:text-gray-400 dark:text-gray-400 dark:hover:text-gray-600"
                        >
                            <span className="flex items-center">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ltr:mr-2 rtl:ml-2">
                                    <path
                                        d="M17 7.82959L18.6965 9.35641C20.239 10.7447 21.0103 11.4389 21.0103 12.3296C21.0103 13.2203 20.239 13.9145 18.6965 15.3028L17 16.8296"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                    />
                                    <path opacity="0.5" d="M13.9868 5L10.0132 19.8297" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    <path
                                        d="M7.00005 7.82959L5.30358 9.35641C3.76102 10.7447 2.98975 11.4389 2.98975 12.3296C2.98975 13.2203 3.76102 13.9145 5.30358 15.3028L7.00005 16.8296"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                    />
                                </svg>
                                Code
                            </span>
                        </button>
                    </div>
                    <div className="mb-5">
                        <div className="flex flex-wrap items-center justify-center gap-2">
                            <img className="h-20 w-20 overflow-hidden rounded-md object-cover" src="/assets/images/profile-12.jpeg" alt="img" />
                            <img className="h-16 w-16 overflow-hidden rounded-full object-cover" src="/assets/images/profile-12.jpeg" alt="img" />
                            <img className="h-14 w-14 overflow-hidden rounded-md object-cover" src="/assets/images/profile-12.jpeg" alt="img" />
                            <img className="h-10 w-10 overflow-hidden object-cover" src="/assets/images/profile-12.jpeg" alt="img" />
                        </div>
                    </div>
                    {codeArr.includes('code3') && (
                        <CodeHighlight>
                            <pre className="language-xml">
                                {`<img className="w-20 h-20 rounded-md overflow-hidden object-cover" src="/assets/images/profile-12.jpeg" alt="img" />

<img className="w-16 h-16 rounded-full overflow-hidden object-cover" src="/assets/images/profile-12.jpeg" alt="img" />

<img className="w-14 h-14 rounded-md overflow-hidden object-cover" src="/assets/images/profile-12.jpeg" alt="img" />

<img className="w-10 h-10 overflow-hidden object-cover" src="/assets/images/profile-12.jpeg" alt="img" />
                                   `}
                            </pre>
                        </CodeHighlight>
                    )}
                </div>
                {/* Initials */}
                <div className="panel" id="initials">
                    <div className="mb-5 flex items-center justify-between">
                        <h5 className="text-lg font-semibold dark:text-white-light">Initials</h5>
                        <button
                            onClick={() => {
                                toggleCode('code4');
                            }}
                            className="font-semibold hover:text-gray-400 dark:text-gray-400 dark:hover:text-gray-600"
                        >
                            <span className="flex items-center">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ltr:mr-2 rtl:ml-2">
                                    <path
                                        d="M17 7.82959L18.6965 9.35641C20.239 10.7447 21.0103 11.4389 21.0103 12.3296C21.0103 13.2203 20.239 13.9145 18.6965 15.3028L17 16.8296"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                    />
                                    <path opacity="0.5" d="M13.9868 5L10.0132 19.8297" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    <path
                                        d="M7.00005 7.82959L5.30358 9.35641C3.76102 10.7447 2.98975 11.4389 2.98975 12.3296C2.98975 13.2203 3.76102 13.9145 5.30358 15.3028L7.00005 16.8296"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                    />
                                </svg>
                                Code
                            </span>
                        </button>
                    </div>
                    <div className="mb-5">
                        <div className="flex flex-wrap items-center justify-center gap-2 text-white">
                            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-success object-cover text-center text-2xl">AG</span>
                            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary object-cover text-center text-xl">AG</span>
                            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-info object-cover text-center text-lg">AG</span>
                            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-danger object-cover text-center text-base">AG</span>
                        </div>
                    </div>
                    {codeArr.includes('code4') && (
                        <CodeHighlight>
                            <pre className="language-xml">
                                {`<span className="flex justify-center items-center w-20 h-20 text-center rounded-full object-cover bg-success text-2xl">AG</span>

<span className="flex justify-center items-center w-16 h-16 text-center rounded-full object-cover bg-primary text-xl">AG</span>

<span className="flex justify-center items-center w-14 h-14 text-center rounded-full object-cover bg-info text-lg">AG</span>

<span className="flex justify-center items-center w-10 h-10 text-center rounded-full object-cover bg-danger text-base">AG</span>
                                   `}
                            </pre>
                        </CodeHighlight>
                    )}
                </div>
                {/* Group */}
                <div className="panel" id="group">
                    <div className="mb-5 flex items-center justify-between">
                        <h5 className="text-lg font-semibold dark:text-white-light">Group</h5>
                        <button
                            onClick={() => {
                                toggleCode('code5');
                            }}
                            className="font-semibold hover:text-gray-400 dark:text-gray-400 dark:hover:text-gray-600"
                        >
                            <span className="flex items-center">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ltr:mr-2 rtl:ml-2">
                                    <path
                                        d="M17 7.82959L18.6965 9.35641C20.239 10.7447 21.0103 11.4389 21.0103 12.3296C21.0103 13.2203 20.239 13.9145 18.6965 15.3028L17 16.8296"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                    />
                                    <path opacity="0.5" d="M13.9868 5L10.0132 19.8297" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    <path
                                        d="M7.00005 7.82959L5.30358 9.35641C3.76102 10.7447 2.98975 11.4389 2.98975 12.3296C2.98975 13.2203 3.76102 13.9145 5.30358 15.3028L7.00005 16.8296"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                    />
                                </svg>
                                Code
                            </span>
                        </button>
                    </div>
                    <div className="mb-5 flex flex-wrap items-center justify-around gap-10">
                        <div className="flex items-center justify-center -space-x-4 text-white rtl:space-x-reverse">
                            <img className="h-16 w-16 overflow-hidden rounded-full object-cover ring-2 ring-white dark:ring-white-dark" src="/assets/images/profile-12.jpeg" alt="img" />
                            <img className="h-16 w-16 overflow-hidden rounded-full object-cover ring-2 ring-white dark:ring-white-dark" src="/assets/images/profile-12.jpeg" alt="img" />
                            <img className="h-16 w-16 overflow-hidden rounded-full object-cover ring-2 ring-white dark:ring-white-dark" src="/assets/images/profile-12.jpeg" alt="img" />
                            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-info object-cover text-center text-xl ring-2 ring-white dark:ring-white-dark">AG</span>
                        </div>
                        <div className="flex items-center justify-center -space-x-4 text-white rtl:space-x-reverse">
                            <img className="h-12 w-12 overflow-hidden rounded-full object-cover ring-2 ring-white dark:ring-white-dark" src="/assets/images/profile-12.jpeg" alt="img" />
                            <img className="h-12 w-12 overflow-hidden rounded-full object-cover ring-2 ring-white dark:ring-white-dark" src="/assets/images/profile-12.jpeg" alt="img" />
                            <img className="h-12 w-12 overflow-hidden rounded-full object-cover ring-2 ring-white dark:ring-white-dark" src="/assets/images/profile-12.jpeg" alt="img" />
                            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-info object-cover text-center text-base ring-2 ring-white dark:ring-white-dark">AG</span>
                        </div>
                    </div>
                    {codeArr.includes('code5') && (
                        <CodeHighlight>
                            <pre className="language-xml">
                                {`<div className="flex items-center justify-center -space-x-4 rtl:space-x-reverse text-white">
  <img className="w-16 h-16 rounded-full overflow-hidden object-cover ring-2 ring-white dark:ring-white-dark" src="/assets/images/profile-12.jpeg" alt="img" />
  <img className="w-16 h-16 rounded-full overflow-hidden object-cover ring-2 ring-white dark:ring-white-dark" src="/assets/images/profile-12.jpeg" alt="img" />
  <img className="w-16 h-16 rounded-full overflow-hidden object-cover ring-2 ring-white dark:ring-white-dark" src="/assets/images/profile-12.jpeg" alt="img" />
  <span className="flex justify-center items-center w-16 h-16 text-center rounded-full object-cover bg-info text-xl ring-2 ring-white dark:ring-white-dark">AG</span>
</div>
<div className="flex items-center justify-center -space-x-4 rtl:space-x-reverse text-white">
  <img className="w-12 h-12 rounded-full overflow-hidden object-cover ring-2 ring-white dark:ring-white-dark" src="/assets/images/profile-12.jpeg" alt="img" />
  <img className="w-12 h-12 rounded-full overflow-hidden object-cover ring-2 ring-white dark:ring-white-dark" src="/assets/images/profile-12.jpeg" alt="img" />
  <img className="w-12 h-12 rounded-full overflow-hidden object-cover ring-2 ring-white dark:ring-white-dark" src="/assets/images/profile-12.jpeg" alt="img" />
  <span className="flex justify-center items-center w-12 h-12 text-center rounded-full object-cover bg-info text-base ring-2 ring-white dark:ring-white-dark">AG</span>
</div>
                                    `}
                            </pre>
                        </CodeHighlight>
                    )}
                </div>
                {/* Animate Y-axis */}
                <div className="panel" id="animate">
                    <div className="mb-5 flex items-center justify-between">
                        <h5 className="text-lg font-semibold dark:text-white-light">Animate Y-axis</h5>
                        <button
                            onClick={() => {
                                toggleCode('code6');
                            }}
                            className="font-semibold hover:text-gray-400 dark:text-gray-400 dark:hover:text-gray-600"
                        >
                            <span className="flex items-center">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ltr:mr-2 rtl:ml-2">
                                    <path
                                        d="M17 7.82959L18.6965 9.35641C20.239 10.7447 21.0103 11.4389 21.0103 12.3296C21.0103 13.2203 20.239 13.9145 18.6965 15.3028L17 16.8296"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                    />
                                    <path opacity="0.5" d="M13.9868 5L10.0132 19.8297" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    <path
                                        d="M7.00005 7.82959L5.30358 9.35641C3.76102 10.7447 2.98975 11.4389 2.98975 12.3296C2.98975 13.2203 3.76102 13.9145 5.30358 15.3028L7.00005 16.8296"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                    />
                                </svg>
                                Code
                            </span>
                        </button>
                    </div>
                    <div className="mb-5">
                        <div className="flex items-center justify-center -space-x-4 text-white rtl:space-x-reverse">
                            <img
                                className="relative h-12 w-12 rounded-full object-cover ring-2 ring-white transition-all duration-300 hover:hover:translate-y-2 dark:ring-white-dark"
                                src="/assets/images/profile-12.jpeg"
                                alt="img"
                            />
                            <img
                                className="relative h-12 w-12 rounded-full object-cover ring-2 ring-white transition-all duration-300 hover:hover:translate-y-2 dark:ring-white-dark"
                                src="/assets/images/profile-12.jpeg"
                                alt="img"
                            />
                            <img
                                className="relative h-12 w-12 rounded-full object-cover ring-2 ring-white transition-all duration-300 hover:hover:translate-y-2 dark:ring-white-dark"
                                src="/assets/images/profile-12.jpeg"
                                alt="img"
                            />
                            <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-info object-cover text-center text-base ring-2 ring-white transition-all duration-300 hover:hover:translate-y-2 dark:ring-white-dark">
                                AG
                            </span>
                        </div>
                    </div>
                    {codeArr.includes('code6') && (
                        <CodeHighlight>
                            <pre className="language-xml">
                                {`<div className="flex items-center justify-center -space-x-4 rtl:space-x-reverse text-white">
    <img
        className="w-12 h-12 rounded-full object-cover ring-2 ring-white dark:ring-white-dark relative transition-all duration-300 hover:hover:translate-y-2"
        src="/assets/images/profile-12.jpeg"
        alt="img"
    />
    <img
        className="w-12 h-12 rounded-full object-cover ring-2 ring-white dark:ring-white-dark relative transition-all duration-300 hover:hover:translate-y-2"
        src="/assets/images/profile-12.jpeg"
        alt="img"
    />
    <img
        className="w-12 h-12 rounded-full object-cover ring-2 ring-white dark:ring-white-dark relative transition-all duration-300 hover:hover:translate-y-2"
        src="/assets/images/profile-12.jpeg"
        alt="img"
    />
    <span className="flex justify-center items-center w-12 h-12 text-center rounded-full object-cover bg-info text-base ring-2 ring-white dark:ring-white-dark relative transition-all duration-300 hover:hover:translate-y-2">
        AG
    </span>
</div>`}
                            </pre>
                        </CodeHighlight>
                    )}
                </div>
                {/* Animate X-axis */}
                <div className="panel">
                    <div className="mb-5 flex items-center justify-between">
                        <h5 className="text-lg font-semibold dark:text-white-light">Animate X-axis</h5>
                        <button
                            onClick={() => {
                                toggleCode('code7');
                            }}
                            className="font-semibold hover:text-gray-400 dark:text-gray-400 dark:hover:text-gray-600"
                        >
                            <span className="flex items-center">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ltr:mr-2 rtl:ml-2">
                                    <path
                                        d="M17 7.82959L18.6965 9.35641C20.239 10.7447 21.0103 11.4389 21.0103 12.3296C21.0103 13.2203 20.239 13.9145 18.6965 15.3028L17 16.8296"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                    />
                                    <path opacity="0.5" d="M13.9868 5L10.0132 19.8297" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    <path
                                        d="M7.00005 7.82959L5.30358 9.35641C3.76102 10.7447 2.98975 11.4389 2.98975 12.3296C2.98975 13.2203 3.76102 13.9145 5.30358 15.3028L7.00005 16.8296"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                    />
                                </svg>
                                Code
                            </span>
                        </button>
                    </div>
                    <div className="mb-5">
                        <div className="flex items-center justify-center -space-x-4 text-white rtl:space-x-reverse">
                            <img
                                className="relative h-12 w-12 rounded-full object-cover ring-2 ring-white transition-all duration-300 hover:translate-x-2 dark:ring-white-dark"
                                src="/assets/images/profile-12.jpeg"
                                alt="img"
                            />
                            <img
                                className="relative h-12 w-12 rounded-full object-cover ring-2 ring-white transition-all duration-300 hover:translate-x-2 dark:ring-white-dark"
                                src="/assets/images/profile-12.jpeg"
                                alt="img"
                            />
                            <img
                                className="relative h-12 w-12 rounded-full object-cover ring-2 ring-white transition-all duration-300 hover:translate-x-2 dark:ring-white-dark"
                                src="/assets/images/profile-12.jpeg"
                                alt="img"
                            />
                            <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-info object-cover text-center text-base ring-2 ring-white transition-all duration-300 hover:translate-x-2 dark:ring-white-dark">
                                AG
                            </span>
                        </div>
                    </div>
                    {codeArr.includes('code7') && (
                        <CodeHighlight>
                            <pre className="language-xml">
                                {`
<div className="flex items-center justify-center -space-x-4 rtl:space-x-reverse text-white">
    <img
        className="w-12 h-12 rounded-full object-cover ring-2 ring-white dark:ring-white-dark relative transition-all duration-300 hover:translate-x-2"
        src="/assets/images/profile-12.jpeg"
        alt="img"
    />
    <img
        className="w-12 h-12 rounded-full object-cover ring-2 ring-white dark:ring-white-dark relative transition-all duration-300 hover:translate-x-2"
        src="/assets/images/profile-12.jpeg"
        alt="img"
    />
    <img
        className="w-12 h-12 rounded-full object-cover ring-2 ring-white dark:ring-white-dark relative transition-all duration-300 hover:translate-x-2"
        src="/assets/images/profile-12.jpeg"
        alt="img"
    />
    <span className="flex justify-center items-center w-12 h-12 text-center rounded-full object-cover bg-info text-base ring-2 ring-white dark:ring-white-dark relative transition-all duration-300 hover:translate-x-2">
        AG
    </span>
</div>`}
                            </pre>
                        </CodeHighlight>
                    )}
                </div>
                {/* Tooltip */}
                <div className="panel" id="tooltip">
                    <div className="mb-5 flex items-center justify-between">
                        <h5 className="text-lg font-semibold dark:text-white-light">Tooltip</h5>
                        <button
                            onClick={() => {
                                toggleCode('code8');
                            }}
                            className="font-semibold hover:text-gray-400 dark:text-gray-400 dark:hover:text-gray-600"
                        >
                            <span className="flex items-center">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ltr:mr-2 rtl:ml-2">
                                    <path
                                        d="M17 7.82959L18.6965 9.35641C20.239 10.7447 21.0103 11.4389 21.0103 12.3296C21.0103 13.2203 20.239 13.9145 18.6965 15.3028L17 16.8296"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                    />
                                    <path opacity="0.5" d="M13.9868 5L10.0132 19.8297" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    <path
                                        d="M7.00005 7.82959L5.30358 9.35641C3.76102 10.7447 2.98975 11.4389 2.98975 12.3296C2.98975 13.2203 3.76102 13.9145 5.30358 15.3028L7.00005 16.8296"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                    />
                                </svg>
                                Code
                            </span>
                        </button>
                    </div>
                    <div className="mb-5">
                        <div className="flex items-center justify-center -space-x-4 text-white rtl:space-x-reverse">
                            <Tippy content="Judy Holmes">
                                <img className="h-12 w-12 rounded-full object-cover ring-2 ring-white dark:ring-white-dark" src="/assets/images/profile-12.jpeg" alt="img" />
                            </Tippy>
                            <Tippy content="Judy Holmes">
                                <img className="h-12 w-12 rounded-full object-cover ring-2 ring-white dark:ring-white-dark" src="/assets/images/profile-12.jpeg" alt="img" />
                            </Tippy>
                            <Tippy content="Judy Holmes">
                                <img className="h-12 w-12 rounded-full object-cover ring-2 ring-white dark:ring-white-dark" src="/assets/images/profile-12.jpeg" alt="img" />
                            </Tippy>
                            <Tippy content="Alan Green">
                                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-info object-cover text-center text-base ring-2 ring-white dark:ring-white-dark">AG</span>
                            </Tippy>
                        </div>
                    </div>
                    {codeArr.includes('code8') && (
                        <CodeHighlight>
                            <pre className="language-typescript">
                                {`import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

<div className="flex items-center justify-center -space-x-4 rtl:space-x-reverse text-white">
    <Tippy content="Judy Holmes">
        <img className="w-12 h-12 rounded-full object-cover ring-2 ring-white dark:ring-white-dark" src="/assets/images/profile-12.jpeg" alt="img" />
    </Tippy>
    <Tippy content="Judy Holmes">
        <img className="w-12 h-12 rounded-full object-cover ring-2 ring-white dark:ring-white-dark" src="/assets/images/profile-12.jpeg" alt="img" />
    </Tippy>
    <Tippy content="Judy Holmes">
        <img className="w-12 h-12 rounded-full object-cover ring-2 ring-white dark:ring-white-dark" src="/assets/images/profile-12.jpeg" alt="img" />
    </Tippy>
    <Tippy content="Alan Green">
        <span className="flex justify-center items-center w-12 h-12 text-center rounded-full object-cover bg-info text-base ring-2 ring-white dark:ring-white-dark">AG</span>
    </Tippy>
</div>
`}
                            </pre>
                        </CodeHighlight>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Avatar;
