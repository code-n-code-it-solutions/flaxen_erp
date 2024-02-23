import Link from 'next/link';
import { useEffect, useState } from 'react';
import CodeHighlight from '@/components/Highlight';
import { setPageTitle } from '@/store/slices/themeConfigSlice';
import { useDispatch } from 'react-redux';
const Loader = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Loader'));
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
                    <span>Loader</span>
                </li>
            </ul>
            <div className="grid grid-cols-1 gap-6 pt-5 lg:grid-cols-2">
                {/* Loaders with Buttons */}
                <div className="panel" id="with_buttons">
                    <div className="mb-5 flex items-center justify-between">
                        <h5 className="text-lg font-semibold dark:text-white-light">Loaders with Buttons</h5>
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
                        <div className="flex w-full flex-wrap items-center justify-center gap-4">
                            <button type="button" className="btn btn-info btn-lg">
                                <svg
                                    viewBox="0 0 24 24"
                                    width="24"
                                    height="24"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    fill="none"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="inline-block h-5 w-5 animate-[spin_2s_linear_infinite] align-middle ltr:mr-2 rtl:ml-2"
                                >
                                    <line x1="12" y1="2" x2="12" y2="6"></line>
                                    <line x1="12" y1="18" x2="12" y2="22"></line>
                                    <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
                                    <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
                                    <line x1="2" y1="12" x2="6" y2="12"></line>
                                    <line x1="18" y1="12" x2="22" y2="12"></line>
                                    <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
                                    <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
                                </svg>
                                Loading
                            </button>

                            <button type="button" className="btn btn-danger btn-lg">
                                <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white border-l-transparent align-middle ltr:mr-4 rtl:ml-4"></span>
                                Loading
                            </button>

                            <button type="button" className="btn btn-secondary btn-lg">
                                <span className="inline-block h-3 w-3 animate-ping rounded-full bg-white ltr:mr-4 rtl:ml-4"></span>
                                Loading
                            </button>
                        </div>
                    </div>
                    {codeArr.includes('code1') && (
                        <CodeHighlight>
                            <pre className="language-xml">
                                {`<button type="button" className="btn btn-info btn-lg">
    <svg>...</svg>
    Loading
</button>

<button type="button" className="btn btn-danger btn-lg">
    <span className="animate-spin border-2 border-white border-l-transparent rounded-full w-5 h-5 ltr:mr-4 rtl:ml-4 inline-block align-middle"></span>
    Loading
</button>

<button type="button" className="btn btn-secondary btn-lg">
    <span className="animate-ping w-3 h-3 ltr:mr-4 rtl:ml-4 inline-block rounded-full bg-white"></span>
    Loading
</button>`}
                            </pre>
                        </CodeHighlight>
                    )}
                </div>
                {/* Position */}
                <div className="panel" id="positions">
                    <div className="mb-5 flex items-center justify-between">
                        <h5 className="text-lg font-semibold dark:text-white-light">Position</h5>
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
                        <div className="flex w-full flex-wrap">
                            <div className="mb-3 flex w-full flex-wrap items-center justify-center text-center sm:mb-0 sm:w-1/2">
                                <p className="mb-2 w-full">Default Button</p>
                                <button type="button" className="btn btn-primary btn-lg">
                                    <svg
                                        viewBox="0 0 24 24"
                                        width="24"
                                        height="24"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        fill="none"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="inline-block h-5 w-5 animate-[spin_2s_linear_infinite] align-middle ltr:mr-2 rtl:ml-2"
                                    >
                                        <line x1="12" y1="2" x2="12" y2="6"></line>
                                        <line x1="12" y1="18" x2="12" y2="22"></line>
                                        <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
                                        <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
                                        <line x1="2" y1="12" x2="6" y2="12"></line>
                                        <line x1="18" y1="12" x2="22" y2="12"></line>
                                        <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
                                        <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
                                    </svg>
                                    Loading
                                </button>
                            </div>
                            <div className="flex w-full flex-wrap items-center justify-center text-center sm:w-1/2">
                                <p className="mb-2 w-full">Outline Button</p>
                                <button type="button" className="btn btn-outline-primary btn-lg">
                                    Loading
                                    <svg
                                        viewBox="0 0 24 24"
                                        width="24"
                                        height="24"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        fill="none"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="inline-block h-5 w-5 animate-[spin_2s_linear_infinite] align-middle ltr:ml-2 rtl:mr-2"
                                    >
                                        <line x1="12" y1="2" x2="12" y2="6"></line>
                                        <line x1="12" y1="18" x2="12" y2="22"></line>
                                        <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
                                        <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
                                        <line x1="2" y1="12" x2="6" y2="12"></line>
                                        <line x1="18" y1="12" x2="22" y2="12"></line>
                                        <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
                                        <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                    {codeArr.includes('code2') && (
                        <CodeHighlight>
                            <pre className="language-xml">
                                {`<div className="flex flex-wrap items-center justify-center w-full sm:w-1/2 text-center mb-3 sm:mb-0">
    <p className="w-full mb-2">Default Button</p>
    <button type="button" className="btn btn-primary btn-lg">
        <svg>...</svg>
        Loading
    </button>
</div>
<div className="flex flex-wrap items-center justify-center w-full sm:w-1/2 text-center">
    <p className="w-full mb-2">Outline Button</p>
    <button type="button" className="btn btn-outline-primary btn-lg">
        Loading
        <svg>...</svg>
    </button>
</div>`}
                            </pre>
                        </CodeHighlight>
                    )}
                </div>
                {/* Sizes */}
                <div className="panel" id="sizes">
                    <div className="mb-10 flex items-center justify-between">
                        <h5 className="text-lg font-semibold dark:text-white-light">Sizes</h5>
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
                        <div className="grid w-full grid-cols-3 gap-4">
                            <span className="m-auto mb-10 inline-block h-12 w-12 animate-spin rounded-full border-4 border-success border-l-transparent align-middle"></span>
                            <span className="m-auto mb-10 inline-block h-10 w-10 animate-spin rounded-full border-4 border-success border-l-transparent align-middle"></span>
                            <span className="m-auto mb-10 inline-block h-6 w-6 animate-spin rounded-full border-[3px] border-success border-l-transparent align-middle"></span>
                            <span className="m-auto mb-10 inline-block h-12 w-12 animate-spin rounded-full border-4 border-transparent border-l-primary align-middle"></span>
                            <span className="m-auto mb-10 inline-block h-10 w-10 animate-spin rounded-full border-4 border-transparent border-l-primary align-middle"></span>
                            <span className="m-auto mb-10 inline-block h-6 w-6 animate-spin rounded-full border-[3px] border-transparent border-l-primary align-middle"></span>
                            <span className="m-auto mb-10 h-5 w-5">
                                <span className="inline-flex h-full w-full animate-ping rounded-full bg-info"></span>
                            </span>
                            <span className="m-auto mb-10 h-4 w-4">
                                <span className="inline-flex h-full w-full animate-ping rounded-full bg-info"></span>
                            </span>
                            <span className="m-auto mb-10 h-3 w-3">
                                <span className="inline-flex h-full w-full animate-ping rounded-full bg-info"></span>
                            </span>
                        </div>
                    </div>
                    {codeArr.includes('code3') && (
                        <CodeHighlight>
                            <pre className="language-xml">
                                {`<span className="animate-spin border-4 border-success border-l-transparent rounded-full w-12 h-12 inline-block align-middle m-auto mb-10"></span>

<span className="animate-spin border-4 border-success border-l-transparent rounded-full w-10 h-10 inline-block align-middle m-auto mb-10"></span>

<span className="animate-spin border-[3px] border-success border-l-transparent rounded-full w-6 h-6 inline-block align-middle m-auto mb-10"></span>

<span className="animate-spin border-4 border-transparent border-l-primary rounded-full w-12 h-12 inline-block align-middle m-auto mb-10"></span>

<span className="animate-spin border-4 border-transparent border-l-primary rounded-full w-10 h-10 inline-block align-middle m-auto mb-10"></span>

<span className="animate-spin border-[3px] border-transparent border-l-primary rounded-full w-6 h-6 inline-block align-middle m-auto mb-10"></span>

<span className="w-5 h-5 m-auto mb-10">
    <span className="animate-ping inline-flex h-full w-full rounded-full bg-info"></span>
</span>

<span className="w-4 h-4 m-auto mb-10">
    <span className="animate-ping inline-flex h-full w-full rounded-full bg-info"></span>
</span>

<span className="w-3 h-3 m-auto mb-10">
    <span className="animate-ping inline-flex h-full w-full rounded-full bg-info"></span>
</span>`}
                            </pre>
                        </CodeHighlight>
                    )}
                </div>
                {/* Colors */}
                <div className="panel" id="colors">
                    <div className="mb-10 flex items-center justify-between">
                        <h5 className="text-lg font-semibold dark:text-white-light">Colors</h5>
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
                        <div className="grid w-full grid-cols-4 gap-4">
                            <span className="m-auto mb-10 inline-block h-10 w-10 animate-spin rounded-full border-4 border-success border-l-transparent align-middle"></span>
                            <span className="m-auto mb-10 inline-block h-10 w-10 animate-spin rounded-full border-4 border-danger border-l-transparent align-middle"></span>
                            <span className="m-auto mb-10 inline-block h-10 w-10 animate-spin rounded-full border-4 border-warning border-l-transparent align-middle"></span>
                            <span className="m-auto mb-10 inline-block h-10 w-10 animate-spin rounded-full border-4 border-primary border-l-transparent align-middle"></span>
                            <span className="m-auto mb-10 inline-block h-10 w-10 animate-spin rounded-full border-4 border-transparent border-l-black align-middle dark:border-l-dark"></span>
                            <span className="m-auto mb-10 inline-block h-10 w-10 animate-spin rounded-full border-4 border-transparent border-l-danger align-middle"></span>
                            <span className="m-auto mb-10 inline-block h-10 w-10 animate-spin rounded-full border-4 border-transparent border-l-warning align-middle"></span>
                            <span className="m-auto mb-10 inline-block h-10 w-10 animate-spin rounded-full border-4 border-transparent border-l-primary align-middle"></span>
                            <span className="m-auto mb-10 h-4 w-4">
                                <span className="inline-flex h-full w-full animate-ping rounded-full bg-info"></span>
                            </span>
                            <span className="m-auto mb-10 h-4 w-4">
                                <span className="inline-flex h-full w-full animate-ping rounded-full bg-danger"></span>
                            </span>
                            <span className="m-auto mb-10 h-4 w-4">
                                <span className="inline-flex h-full w-full animate-ping rounded-full bg-warning"></span>
                            </span>
                            <span className="m-auto mb-10 h-4 w-4">
                                <span className="inline-flex h-full w-full animate-ping rounded-full bg-primary"></span>
                            </span>
                        </div>
                    </div>
                    {codeArr.includes('code4') && (
                        <CodeHighlight>
                            <pre className="language-xml">
                                {`<span className="animate-spin border-4 border-success border-l-transparent rounded-full w-10 h-10 inline-block align-middle m-auto mb-10"></span>

<span className="animate-spin border-4 border-danger border-l-transparent rounded-full w-10 h-10 inline-block align-middle m-auto mb-10"></span>

<span className="animate-spin border-4 border-warning border-l-transparent rounded-full w-10 h-10 inline-block align-middle m-auto mb-10"></span>

<span className="animate-spin border-4 border-primary border-l-transparent rounded-full w-10 h-10 inline-block align-middle m-auto mb-10"></span>

<span className="animate-spin border-4 border-transparent border-l-black rounded-full w-10 h-10 inline-block align-middle m-auto mb-10 dark:border-l-dark"></span>

<span className="animate-spin border-4 border-transparent border-l-danger rounded-full w-10 h-10 inline-block align-middle m-auto mb-10"></span>

<span className="animate-spin border-4 border-transparent border-l-warning rounded-full w-10 h-10 inline-block align-middle m-auto mb-10"></span>

<span className="animate-spin border-4 border-transparent border-l-primary rounded-full w-10 h-10 inline-block align-middle m-auto mb-10"></span>

<span className="w-4 h-4 m-auto mb-10">
    <span className="animate-ping inline-flex h-full w-full rounded-full bg-info"></span>
</span>

<span className="w-4 h-4 m-auto mb-10">
    <span className="animate-ping inline-flex h-full w-full rounded-full bg-danger"></span>
</span>

<span className="w-4 h-4 m-auto mb-10">
    <span className="animate-ping inline-flex h-full w-full rounded-full bg-warning"></span>
</span>

<span className="w-4 h-4 m-auto mb-10">
    <span className="animate-ping inline-flex h-full w-full rounded-full bg-primary"></span>
</span>`}
                            </pre>
                        </CodeHighlight>
                    )}
                </div>
                {/* Custom */}
                <div className="panel" id="custom">
                    <div className="mb-10 flex items-center justify-between">
                        <h5 className="text-lg font-semibold dark:text-white-light">Custom</h5>
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
                    <div className="mb-5">
                        <div className="grid w-full grid-cols-3 gap-4">
                            <span className="m-auto mb-10 inline-block h-14 w-14 animate-spin rounded-full border-8 border-[#f1f2f3] border-l-primary align-middle"></span>
                            <span className="m-auto mb-10 inline-block h-14 w-14 animate-[spin_2s_linear_infinite] rounded-full border-8 border-[#f1f2f3] border-l-primary border-r-primary align-middle"></span>
                            <span className="m-auto mb-10 inline-block h-14 w-14 animate-[spin_3s_linear_infinite] rounded-full border-8 border-r-warning border-l-primary border-t-danger border-b-success align-middle"></span>
                        </div>
                    </div>
                    {codeArr.includes('code5') && (
                        <CodeHighlight>
                            <pre className="language-xml">
                                {`

<span className="animate-spin border-8 border-[#f1f2f3] border-l-primary rounded-full w-14 h-14 inline-block align-middle m-auto mb-10"></span>

<span className="animate-[spin_2s_linear_infinite] border-8 border-[#f1f2f3] border-l-primary border-r-primary rounded-full w-14 h-14 inline-block align-middle m-auto mb-10"></span>

<span className="animate-[spin_3s_linear_infinite] border-8 border-r-warning border-l-primary border-t-danger border-b-success rounded-full w-14 h-14 inline-block align-middle m-auto mb-10"></span>`}
                            </pre>
                        </CodeHighlight>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Loader;
