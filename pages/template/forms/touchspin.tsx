import Link from 'next/link';
import { useEffect, useState } from 'react';
import CodeHighlight from '../../components/Highlight';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/slices/themeConfigSlice';

const TouchSpin = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('TouchSpin'));
    });
    const [codeArr, setCodeArr] = useState<string[]>([]);

    const toggleCode = (name: string) => {
        if (codeArr.includes(name)) {
            setCodeArr((value) => value.filter((d) => d !== name));
        } else {
            setCodeArr([...codeArr, name]);
        }
    };

    const [value1, setValue1] = useState<any>(0);
    const [value2, setValue2] = useState<any>(0);
    const [value3, setValue3] = useState<any>(0);
    const [value4, setValue4] = useState<any>(0);
    const [value5, setValue5] = useState<any>(0);
    const [value6, setValue6] = useState<any>(0);
    const [value7, setValue7] = useState<any>(0);
    const [value8, setValue8] = useState<any>(0);
    const [value9, setValue9] = useState<any>(0);
    const [value10, setValue10] = useState<any>(0);
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const [day, setDay] = useState('');

    const dayFormatter = (day: number) => {
        setValue9(day);
        return setDay(days[day]);
    };

    return (
        <div>
            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li>
                    <Link href="#" className="text-primary hover:underline">
                        Forms
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>TouchSpin</span>
                </li>
            </ul>
            <div className="grid grid-cols-1 gap-6 pt-5 lg:grid-cols-2">
                {/* Basic */}
                <div className="panel">
                    <div className="mb-5 flex items-center justify-between">
                        <h5 className="text-lg font-semibold dark:text-white-light">Button Spin</h5>
                        <button type="button" className="font-semibold hover:text-gray-400 dark:text-gray-400 dark:hover:text-gray-600" onClick={() => toggleCode('code1')}>
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
                                </svg>{' '}
                                Code
                            </span>
                        </button>
                    </div>
                    <div className="mb-5">
                        <div className="relative">
                            <div className="flex">
                                <button
                                    type="button"
                                    className="flex items-center justify-center border border-r-0 border-primary bg-primary px-3 font-semibold text-white ltr:rounded-l-md rtl:rounded-r-md"
                                    onClick={() => setValue1(value1 > 0 ? value1 - 1 : 0)}
                                >
                                    <svg className="h-5 w-5" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                    </svg>
                                </button>
                                <input
                                    type="number"
                                    placeholder="55"
                                    className="form-input rounded-none text-center"
                                    min={0}
                                    max={100}
                                    readOnly
                                    value={value1}
                                    onWheel={() => setValue1(value1 > 0 ? value1 - 1 : 0)}
                                />
                                <button
                                    type="button"
                                    className="flex items-center justify-center border border-l-0 border-primary bg-primary px-3 font-semibold text-white ltr:rounded-r-md rtl:rounded-l-md"
                                    onClick={() => setValue1(value1 < 100 ? value1 + 1 : 100)}
                                >
                                    <svg className="h-5 w-5" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="12" y1="5" x2="12" y2="19"></line>
                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                    {codeArr.includes('code1') && (
                        <CodeHighlight>
                            <pre className="language-typescript">{`import { useState } from 'react';

const [value1, setValue1] = useState<any>(0);

<div className="flex">
    <button
        type="button"
        className="bg-primary text-white flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border border-r-0 border-primary"
        onClick={() => setValue1(value1 > 0 ? value1 - 1 : 0)}
    >
        <svg> ... </svg>
    </button>
    <input
        type="number"
        placeholder="55"
        className="form-input rounded-none text-center"
        min={0}
        max={100}
        readOnly
        value={value1}
        onWheel={() => setValue1(value1 > 0 ? value1 - 1 : 0)}
    />
    <button
        type="button"
        className="bg-primary text-white flex justify-center items-center ltr:rounded-r-md rtl:rounded-l-md px-3 font-semibold border border-l-0 border-primary"
        onClick={() => setValue1(value1 < 100 ? value1 + 1 : 100)}
    >
        <svg> ... </svg>
    </button>
</div>`}</pre>
                        </CodeHighlight>
                    )}
                </div>

                {/* step of 5 */}
                <div className="panel">
                    <div className="mb-5 flex items-center justify-between">
                        <h5 className="text-lg font-semibold dark:text-white-light">Spin button with step of 5</h5>
                        <button type="button" className="font-semibold hover:text-gray-400 dark:text-gray-400 dark:hover:text-gray-600" onClick={() => toggleCode('code2')}>
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
                                </svg>{' '}
                                Code
                            </span>
                        </button>
                    </div>
                    <div className="mb-5">
                        <div className="relative">
                            <div className="flex">
                                <button
                                    type="button"
                                    className="flex items-center justify-center border border-r-0 border-primary bg-primary px-3 font-semibold text-white ltr:rounded-l-md rtl:rounded-r-md"
                                    onClick={() => setValue2(value2 > 0 ? value2 - 5 : 0)}
                                >
                                    <svg className="h-5 w-5" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                    </svg>
                                </button>
                                <input type="number" placeholder="5" step="5" min="0" max="50" readOnly className="form-input rounded-none text-center" value={value2} />
                                <button
                                    type="button"
                                    className="flex items-center justify-center border border-l-0 border-primary bg-primary px-3 font-semibold text-white ltr:rounded-r-md rtl:rounded-l-md"
                                    onClick={() => setValue2(value2 < 100 ? value2 + 5 : 100)}
                                >
                                    <svg className="h-5 w-5" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="12" y1="5" x2="12" y2="19"></line>
                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                    {codeArr.includes('code2') && (
                        <CodeHighlight>
                            <pre className="language-typescript">{`import { useState } from 'react';

const [value2, setValue2] = useState<any>(0);

<div className="flex">
    <button
        type="button"
        className="bg-primary text-white flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border border-r-0 border-primary"
        onClick={() => setValue2(value2 > 0 ? value2 - 5 : 0)}
    >
        <svg> ... </svg>
    </button>
    <input type="number" placeholder="5" step="5" min="0" max="50" readOnly className="form-input rounded-none text-center" value={value2} />
    <button
        type="button"
        className="bg-primary text-white flex justify-center items-center ltr:rounded-r-md rtl:rounded-l-md px-3 font-semibold border border-l-0 border-primary"
        onClick={() => setValue2(value2 < 100 ? value2 + 5 : 100)}
    >
        <svg> ... </svg>
    </button>
</div>`}</pre>
                        </CodeHighlight>
                    )}
                </div>

                {/* Wrapping value */}
                <div className="panel">
                    <div className="mb-5 flex items-center justify-between">
                        <h5 className="text-lg font-semibold dark:text-white-light">Wrapping value spin button</h5>
                        <button type="button" className="font-semibold hover:text-gray-400 dark:text-gray-400 dark:hover:text-gray-600" onClick={() => toggleCode('code3')}>
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
                                </svg>{' '}
                                Code
                            </span>
                        </button>
                    </div>
                    <div className="mb-5">
                        <div className="relative">
                            <div className="flex">
                                <button
                                    type="button"
                                    className="flex items-center justify-center border border-r-0 border-primary bg-primary px-3 font-semibold text-white ltr:rounded-l-md rtl:rounded-r-md"
                                    onClick={() => setValue3(value3 > 0 ? value3 - 1 : 0)}
                                >
                                    <svg className="h-5 w-5" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                    </svg>
                                </button>
                                <input type="number" placeholder="_ _" className="form-input rounded-none text-center" min="0" max="20" readOnly value={value3} />
                                <button
                                    type="button"
                                    className="flex items-center justify-center border border-l-0 border-primary bg-primary px-3 font-semibold text-white ltr:rounded-r-md rtl:rounded-l-md"
                                    onClick={() => setValue3(value3 < 100 ? value3 + 1 : 100)}
                                >
                                    <svg className="h-5 w-5" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="12" y1="5" x2="12" y2="19"></line>
                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                    {codeArr.includes('code3') && (
                        <CodeHighlight>
                            <pre className="language-typescript">{`import { useState } from 'react';

const [value3, setValue3] = useState<any>(0);

<div className="flex">
    <button
        type="button"
        className="bg-primary text-white flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border border-r-0 border-primary"
        onClick={() => setValue3(value3 > 0 ? value3 - 1 : 0)}
    >
        <svg> ... </svg>
    </button>
    <input type="number" placeholder="_ _" className="form-input rounded-none text-center" min="0" max="20" readOnly value={value3} />
    <button
        type="button"
        className="bg-primary text-white flex justify-center items-center ltr:rounded-r-md rtl:rounded-l-md px-3 font-semibold border border-l-0 border-primary"
        onClick={() => setValue3(value3 < 100 ? value3 + 1 : 100)}
    >
        <svg> ... </svg>
    </button>
</div>`}</pre>
                        </CodeHighlight>
                    )}
                </div>

                {/* Size  */}
                <div className="panel lg:row-span-2" id="size">
                    <div className="mb-5 flex items-center justify-between">
                        <h5 className="text-lg font-semibold dark:text-white-light">Size</h5>
                        <button type="button" className="font-semibold hover:text-gray-400 dark:text-gray-400 dark:hover:text-gray-600" onClick={() => toggleCode('code4')}>
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
                                </svg>{' '}
                                Code
                            </span>
                        </button>
                    </div>
                    {/*  large */}
                    <div className="mb-5">
                        <div className="mb-5">
                            <label htmlFor="sizeLarge">Large size</label>
                            <div className="flex">
                                <button
                                    type="button"
                                    className="flex items-center justify-center border border-r-0 border-primary bg-primary px-3 font-semibold text-white ltr:rounded-l-md rtl:rounded-r-md"
                                    onClick={() => setValue4(value4 > 0 ? value4 - 1 : 0)}
                                >
                                    <svg className="h-5 w-5" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                    </svg>
                                </button>
                                <input id="sizeLarge" type="number" placeholder="55" className="form-input-lg form-input rounded-none text-center" min="0" max="25" readOnly value={value4} />
                                <button
                                    type="button"
                                    className="flex items-center justify-center border border-l-0 border-primary bg-primary px-3 font-semibold text-white ltr:rounded-r-md rtl:rounded-l-md"
                                    onClick={() => setValue4(value4 < 100 ? value4 + 1 : 100)}
                                >
                                    <svg className="h-5 w-5" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="12" y1="5" x2="12" y2="19"></line>
                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* default */}
                        <div className="mb-5">
                            <label htmlFor="sizeDefault">Default size</label>
                            <div className="flex">
                                <button
                                    type="button"
                                    className="flex items-center justify-center border border-r-0 border-primary bg-primary px-3 font-semibold text-white ltr:rounded-l-md rtl:rounded-r-md"
                                    onClick={() => setValue5(value5 > 0 ? value5 - 1 : 0)}
                                >
                                    <svg className="h-5 w-5" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                    </svg>
                                </button>
                                <input type="number" placeholder="55" className="form-input rounded-none text-center" min="0" max="25" readOnly value={value5} />
                                <button
                                    type="button"
                                    className="flex items-center justify-center border border-l-0 border-primary bg-primary px-3 font-semibold text-white ltr:rounded-r-md rtl:rounded-l-md"
                                    onClick={() => setValue5(value5 < 100 ? value5 + 1 : 100)}
                                >
                                    <svg className="h-5 w-5" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="12" y1="5" x2="12" y2="19"></line>
                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* small */}
                        <div>
                            <label htmlFor="sizeSmall">Small size</label>
                            <div className="flex">
                                <button
                                    type="button"
                                    className="flex items-center justify-center border border-r-0 border-primary bg-primary px-3 font-semibold text-white ltr:rounded-l-md rtl:rounded-r-md"
                                    onClick={() => setValue6(value6 > 0 ? value6 - 1 : 0)}
                                >
                                    <svg className="h-5 w-5" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                    </svg>
                                </button>
                                <input id="sizeSmall" type="number" placeholder="55" className="form-input-sm form-input rounded-none text-center" min="0" max="25" readOnly value={value6} />
                                <button
                                    type="button"
                                    className="flex items-center justify-center border border-l-0 border-primary bg-primary px-3 font-semibold text-white ltr:rounded-r-md rtl:rounded-l-md"
                                    onClick={() => setValue6(value6 < 100 ? value6 + 1 : 100)}
                                >
                                    <svg className="h-5 w-5" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="12" y1="5" x2="12" y2="19"></line>
                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                    {codeArr.includes('code4') && (
                        <CodeHighlight>
                            <pre className="language-typescript">{`import { useState } from 'react';

const [value4, setValue4] = useState<any>(0);
const [value5, setValue5] = useState<any>(0);
const [value6, setValue6] = useState<any>(0);

{/*large*/}
<div className="flex">
    <button
        type="button"
        className="bg-primary text-white flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border border-r-0 border-primary"
        onClick={() => setValue4(value4 > 0 ? value4 - 1 : 0)}
    >
        <svg> ... </svg>
    </button>
    <input id="sizeLarge" type="number" placeholder="55" className="form-input form-input-lg rounded-none text-center" min="0" max="25" readOnly value={value4} />
    <button
        type="button"
        className="bg-primary text-white flex justify-center items-center ltr:rounded-r-md rtl:rounded-l-md px-3 font-semibold border border-l-0 border-primary"
        onClick={() => setValue4(value4 < 100 ? value4 + 1 : 100)}
    >
        <svg> ... </svg>
    </button>
</div>

{/*default*/}
<div className="flex">
    <button
        type="button"
        className="bg-primary text-white flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border border-r-0 border-primary"
        onClick={() => setValue5(value5 > 0 ? value5 - 1 : 0)}
    >
        <svg> ... </svg>
    </button>
    <input type="number" placeholder="55" className="form-input rounded-none text-center" min="0" max="25" readOnly value={value5} />
    <button
        type="button"
        className="bg-primary text-white flex justify-center items-center ltr:rounded-r-md rtl:rounded-l-md px-3 font-semibold border border-l-0 border-primary"
        onClick={() => setValue5(value5 < 100 ? value5 + 1 : 100)}
    >
        <svg> ... </svg>
    </button>
</div>

{/*small*/}
<div className="flex">
    <button
        type="button"
        className="bg-primary text-white flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border border-r-0 border-primary"
        onClick={() => setValue6(value6 > 0 ? value6 - 1 : 0)}
    >
        <svg> ... </svg>
    </button>
    <input id="sizeSmall" type="number" placeholder="55" className="form-input form-input-sm rounded-none text-center" min="0" max="25" readOnly value={value6} />
    <button
        type="button"
        className="bg-primary text-white flex justify-center items-center ltr:rounded-r-md rtl:rounded-l-md px-3 font-semibold border border-l-0 border-primary"
        onClick={() => setValue6(value6 < 100 ? value6 + 1 : 100)}
    >
        <svg> ... </svg>
    </button>
</div>`}</pre>
                        </CodeHighlight>
                    )}
                </div>

                {/* Inline Buttons */}
                <div className="panel" id="inline_buttons">
                    <div className="mb-5 flex items-center justify-between">
                        <h5 className="text-lg font-semibold dark:text-white-light">Inline spin button</h5>
                        <button type="button" className="font-semibold hover:text-gray-400 dark:text-gray-400 dark:hover:text-gray-600" onClick={() => toggleCode('code5')}>
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
                                </svg>{' '}
                                Code
                            </span>
                        </button>
                    </div>
                    <div className="mb-5">
                        <div className="mb-5">
                            <div className="inline-flex">
                                <button
                                    type="button"
                                    className="flex items-center justify-center border border-r-0 border-primary bg-primary px-3 font-semibold text-white ltr:rounded-l-md rtl:rounded-r-md"
                                    onClick={() => setValue7(value7 > 0 ? value7 - 1 : 0)}
                                >
                                    <svg className="h-5 w-5" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                    </svg>
                                </button>
                                <input type="number" placeholder="55" className="form-input rounded-none text-center" min="0" max="25" readOnly value={value7} />
                                <button
                                    type="button"
                                    className="flex items-center justify-center border border-l-0 border-primary bg-primary px-3 font-semibold text-white ltr:rounded-r-md rtl:rounded-l-md"
                                    onClick={() => setValue7(value7 < 100 ? value7 + 1 : 100)}
                                >
                                    <svg className="h-5 w-5" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="12" y1="5" x2="12" y2="19"></line>
                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                    {codeArr.includes('code5') && (
                        <CodeHighlight>
                            <pre className="language-typescript">{`import { useState } from 'react';

const [value7, setValue7] = useState<any>(0);

<div className="inline-flex">
    <button
        type="button"
        className="bg-primary text-white flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border border-r-0 border-primary"
        onClick={() => setValue7(value7 > 0 ? value7 - 1 : 0)}
    >
        <svg> ... </svg>
    </button>
    <input type="number" placeholder="55" className="form-input rounded-none text-center" min="0" max="25" readOnly value={value7} />
    <button
        type="button"
        className="bg-primary text-white flex justify-center items-center ltr:rounded-r-md rtl:rounded-l-md px-3 font-semibold border border-l-0 border-primary"
        onClick={() => setValue7(value7 < 100 ? value7 + 1 : 100)}
    >
        <svg> ... </svg>
    </button>
</div>`}</pre>
                        </CodeHighlight>
                    )}
                </div>

                {/* Vertical Buttons */}
                <div className="panel" id="vertical_buttons">
                    <div className="mb-5 flex items-center justify-between">
                        <h5 className="text-lg font-semibold dark:text-white-light">Vertical spin button</h5>
                        <button type="button" className="font-semibold hover:text-gray-400 dark:text-gray-400 dark:hover:text-gray-600" onClick={() => toggleCode('code6')}>
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
                                </svg>{' '}
                                Code
                            </span>
                        </button>
                    </div>
                    <div className="mb-5">
                        <div className="mb-5">
                            <div className="inline-flex w-[50px] flex-col">
                                <button
                                    type="button"
                                    className="flex items-center justify-center rounded-t-md border border-b-0 border-primary bg-primary p-3 font-semibold text-white"
                                    onClick={() => setValue8(value8 > 0 ? value8 - 1 : 0)}
                                >
                                    <svg className="h-5 w-5" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                    </svg>
                                </button>
                                <input type="text" placeholder="55" className="form-input rounded-none px-2 text-center" min="0" max="25" readOnly value={value8} />
                                <button
                                    type="button"
                                    className="flex items-center justify-center rounded-b-md border border-t-0 border-primary bg-primary p-3 font-semibold text-white"
                                    onClick={() => setValue8(value8 < 100 ? value8 + 1 : 100)}
                                >
                                    <svg className="h-5 w-5" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="12" y1="5" x2="12" y2="19"></line>
                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                    {codeArr.includes('code6') && (
                        <CodeHighlight>
                            <pre className="language-typescript">{`import { useState } from 'react';

const [value8, setValue8] = useState<any>(0);

<div className="inline-flex flex-col w-[50px]">
    <button
        type="button"
        className="bg-primary text-white flex justify-center items-center rounded-t-md p-3 font-semibold border border-b-0 border-primary"
        onClick={() => setValue8(value8 > 0 ? value8 - 1 : 0)}
    >
        <svg> ... </svg>
    </button>
    <input type="text" placeholder="55" className="form-input rounded-none text-center px-2" min="0" max="25" readOnly value={value8} />
    <button
        type="button"
        className="bg-primary text-white flex justify-center items-center rounded-b-md p-3 font-semibold border border-t-0 border-primary"
        onClick={() => setValue8(value8 < 100 ? value8 + 1 : 100)}
    >
        <svg> ... </svg>
    </button>
</div>`}</pre>
                        </CodeHighlight>
                    )}
                </div>

                <div className="space-y-8" id="change_button_color">
                    {/* text with spin */}
                    <div className="panel">
                        <div className="mb-5 flex items-center justify-between">
                            <h5 className="text-lg font-semibold dark:text-white-light">Text with spin button</h5>
                            <button type="button" className="font-semibold hover:text-gray-400 dark:text-gray-400 dark:hover:text-gray-600" onClick={() => toggleCode('code7')}>
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
                                    </svg>{' '}
                                    Code
                                </span>
                            </button>
                        </div>
                        <div className="mb-5">
                            <div className="relative">
                                <div className="flex">
                                    <button
                                        type="button"
                                        className="flex items-center justify-center border border-r-0 border-primary bg-primary px-3 font-semibold text-white ltr:rounded-l-md rtl:rounded-r-md"
                                        onClick={() => dayFormatter(value9 > 0 ? value9 - 1 : 6)}
                                    >
                                        <svg className="h-5 w-5" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="5" y1="12" x2="19" y2="12"></line>
                                        </svg>
                                    </button>
                                    <input type="text" placeholder="Sunday" className="form-input rounded-none text-center" min="0" max="6" readOnly value={day} />
                                    <button
                                        type="button"
                                        className="flex items-center justify-center border border-l-0 border-primary bg-primary px-3 font-semibold text-white ltr:rounded-r-md rtl:rounded-l-md"
                                        onClick={() => dayFormatter(value9 < 6 ? value9 + 1 : 0)}
                                    >
                                        <svg className="h-5 w-5" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="12" y1="5" x2="12" y2="19"></line>
                                            <line x1="5" y1="12" x2="19" y2="12"></line>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                        {codeArr.includes('code7') && (
                            <CodeHighlight>
                                <pre className="language-typescript">{`import { useState } from 'react';
const [value9, setValue9] = useState<any>(0);
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const [day, setDay] = useState('');

const dayFormatter = (day: number) => {
    setValue9(day);
    return setDay(days[day]);
};

<div className="flex">
    <button
        type="button"
        className="bg-primary text-white flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border border-r-0 border-primary"
        onClick={() => dayFormatter(value9 > 0 ? value9 - 1 : 6)}
    >
        <svg> ... </svg>
    </button>
    <input type="text" placeholder="Sunday" className="form-input rounded-none text-center" min="0" max="6" readOnly value={day} />
    <button
        type="button"
        className="bg-primary text-white flex justify-center items-center ltr:rounded-r-md rtl:rounded-l-md px-3 font-semibold border border-l-0 border-primary"
        onClick={() => dayFormatter(value9 < 6 ? value9 + 1 : 0)}
    >
        <svg> ... </svg>
    </button>
</div>`}</pre>
                            </CodeHighlight>
                        )}
                    </div>

                    {/* Change Button Class */}
                    <div className="panel">
                        <div className="mb-5 flex items-center justify-between">
                            <h5 className="text-lg font-semibold dark:text-white-light">Change button class</h5>
                            <button type="button" className="font-semibold hover:text-gray-400 dark:text-gray-400 dark:hover:text-gray-600" onClick={() => toggleCode('code8')}>
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
                                    </svg>{' '}
                                    Code
                                </span>
                            </button>
                        </div>
                        <div className="mb-5">
                            <div className="relative">
                                <div className="flex">
                                    <button
                                        type="button"
                                        className="flex items-center justify-center border border-r-0 border-danger bg-danger px-3 font-semibold text-white ltr:rounded-l-md rtl:rounded-r-md"
                                        onClick={() => setValue10(value10 > 0 ? value10 - 1 : 0)}
                                    >
                                        <svg className="h-5 w-5" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="5" y1="12" x2="19" y2="12"></line>
                                        </svg>
                                    </button>
                                    <input type="number" placeholder="55" className="form-input rounded-none text-center" min="0" max="25" readOnly value={value10} />
                                    <button
                                        type="button"
                                        className="flex items-center justify-center border border-l-0 border-warning bg-warning px-3 font-semibold text-white ltr:rounded-r-md rtl:rounded-l-md"
                                        onClick={() => setValue10(value10 < 100 ? value10 + 1 : 100)}
                                    >
                                        <svg className="h-5 w-5" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="12" y1="5" x2="12" y2="19"></line>
                                            <line x1="5" y1="12" x2="19" y2="12"></line>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                        {codeArr.includes('code8') && (
                            <CodeHighlight>
                                <pre className="language-typescript">{`import { useState } from 'react';
const [value10, setValue10] = useState<any>(0);

<div className="flex">
    <button
        type="button"
        className="bg-danger text-white flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border border-r-0 border-danger"
        onClick={() => setValue10(value10 > 0 ? value10 - 1 : 0)}
    >
        <svg> ... </svg>
    </button>
    <input type="number" placeholder="55" className="form-input rounded-none text-center" min="0" max="25" readOnly value={value10} />
    <button
        type="button"
        className="bg-warning text-white flex justify-center items-center ltr:rounded-r-md rtl:rounded-l-md px-3 font-semibold border border-l-0 border-warning"
        onClick={() => setValue10(value10 < 100 ? value10 + 1 : 100)}
    >
        <svg> ... </svg>
    </button>
</div>`}</pre>
                            </CodeHighlight>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TouchSpin;
