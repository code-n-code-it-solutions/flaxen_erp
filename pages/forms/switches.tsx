import Link from 'next/link';
import { useEffect, useState } from 'react';
import CodeHighlight from '../../components/Highlight';
import { setPageTitle } from '../../store/slices/themeConfigSlice';
import { useDispatch } from 'react-redux';

const Switches = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Switches'));
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
                        Forms
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>Switches</span>
                </li>
            </ul>
            <div className="space-y-8 pt-5">
                <div className="space-y-8" id="icons">
                    <h4 className="badge inline-block bg-primary text-base hover:top-0">Icon</h4>
                    {/* Icons */}
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        <div className="panel">
                            <div className="mb-5 flex items-center justify-between">
                                <h5 className="text-lg font-semibold dark:text-white-light">Default</h5>
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
                                <label className="relative h-6 w-12">
                                    <input type="checkbox" className="custom_switch peer absolute z-10 h-full w-full cursor-pointer opacity-0" id="custom_switch_checkbox1" />

                                    <span
                                        className={`outline_checkbox bg-icon block h-full border-2 border-[#ebedf2] before:absolute before:left-1 before:bottom-1 before:h-4 before:w-4 before:bg-[#ebedf2] before:bg-[url(/assets/images/close.svg)] before:bg-center before:bg-no-repeat before:transition-all before:duration-300 peer-checked:border-primary peer-checked:before:left-7 peer-checked:before:bg-primary peer-checked:before:bg-[url(/assets/images/checked.svg)] dark:border-white-dark dark:before:bg-white-dark`}
                                    ></span>
                                </label>
                            </div>
                            {codeArr.includes('code1') && (
                                <CodeHighlight>
                                    <pre className="language-xml">{`<label className="w-12 h-6 relative">
        <input type="checkbox" className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer" id="custom_switch_checkbox1" />

    <span
        className={\`outline_checkbox bg-icon border-2 border-[#ebedf2] dark:border-white-dark block h-full before:absolute before:left-1 before:bg-[#ebedf2] dark:before:bg-white-dark before:bottom-1 before:w-4 before:h-4
    before:bg-[url(/assets/images/close.svg)] before:bg-no-repeat before:bg-center peer-checked:before:left-7 peer-checked:before:bg-[url(/assets/images/checked.svg)] peer-checked:border-primary peer-checked:before:bg-primary before:transition-all before:duration-300\`}
    ></span>
</label>`}</pre>
                                </CodeHighlight>
                            )}
                        </div>
                        <div className="panel">
                            <div className="mb-5 flex items-center justify-between">
                                <h5 className="text-lg font-semibold dark:text-white-light">Rounded</h5>
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
                                <label className="relative h-6 w-12">
                                    <input type="checkbox" className="custom_switch peer absolute z-10 h-full w-full cursor-pointer opacity-0" id="custom_switch_checkbox1" />
                                    <span className="outline_checkbox bg-icon block h-full rounded-full border-2 border-[#ebedf2] before:absolute before:left-1 before:bottom-1 before:h-4 before:w-4 before:rounded-full before:bg-[#ebedf2] before:bg-[url(/assets/images/close.svg)] before:bg-center before:bg-no-repeat before:transition-all before:duration-300 peer-checked:border-primary peer-checked:before:left-7 peer-checked:before:bg-primary peer-checked:before:bg-[url(/assets/images/checked.svg)] dark:border-white-dark dark:before:bg-white-dark"></span>
                                </label>
                            </div>
                            {codeArr.includes('code2') && (
                                <CodeHighlight>
                                    <pre className="language-xml">{`<label className="w-12 h-6 relative">
    <input type="checkbox" className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer" id="custom_switch_checkbox1" />
    <span className="outline_checkbox bg-icon border-2 border-[#ebedf2] dark:border-white-dark block h-full rounded-full before:absolute before:left-1 before:bg-[#ebedf2] dark:before:bg-white-dark before:bottom-1 before:w-4 before:h-4 before:rounded-full before:bg-[url(/assets/images/close.svg)] before:bg-no-repeat before:bg-center peer-checked:before:left-7 peer-checked:before:bg-[url(/assets/images/checked.svg)] peer-checked:border-primary peer-checked:before:bg-primary before:transition-all before:duration-300"></span>
</label>`}</pre>
                                </CodeHighlight>
                            )}
                        </div>
                    </div>
                </div>
                <div className="space-y-8" id="solid">
                    <h4 className="badge inline-block bg-primary text-base hover:top-0">Solid</h4>
                    {/* Solid */}
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        <div className="panel">
                            <div className="mb-5 flex items-center justify-between">
                                <h5 className="text-lg font-semibold dark:text-white-light">Default</h5>
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
                                <label className="relative h-6 w-12">
                                    <input type="checkbox" className="custom_switch peer absolute z-10 h-full w-full cursor-pointer opacity-0" id="custom_switch_checkbox1" />
                                    <span className="block h-full bg-[#ebedf2] before:absolute before:left-1 before:bottom-1 before:h-4 before:w-4 before:bg-white before:transition-all before:duration-300 peer-checked:bg-primary peer-checked:before:left-7 dark:bg-dark dark:before:bg-white-dark dark:peer-checked:before:bg-white "></span>
                                </label>
                            </div>
                            {codeArr.includes('code3') && (
                                <CodeHighlight>
                                    <pre className="language-xml">{`<label className="w-12 h-6 relative">
    <input type="checkbox" className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer" id="custom_switch_checkbox1" />
    <span className="bg-[#ebedf2] dark:bg-dark block h-full before:absolute before:left-1 before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 before:w-4 before:h-4 peer-checked:before:left-7 peer-checked:bg-primary before:transition-all before:duration-300 "></span>
</label>`}</pre>
                                </CodeHighlight>
                            )}
                        </div>
                        <div className="panel">
                            <div className="mb-5 flex items-center justify-between">
                                <h5 className="text-lg font-semibold dark:text-white-light">Rounded</h5>
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
                            <div className="mb-5">
                                <label className="relative h-6 w-12">
                                    <input type="checkbox" className="custom_switch peer absolute z-10 h-full w-full cursor-pointer opacity-0" id="custom_switch_checkbox1" />
                                    <span className="block h-full rounded-full bg-[#ebedf2] before:absolute before:left-1 before:bottom-1 before:h-4 before:w-4 before:rounded-full before:bg-white before:transition-all before:duration-300 peer-checked:bg-primary peer-checked:before:left-7 dark:bg-dark dark:before:bg-white-dark dark:peer-checked:before:bg-white"></span>
                                </label>
                            </div>
                            {codeArr.includes('code4') && (
                                <CodeHighlight>
                                    <pre className="language-xml">{`<label className="w-12 h-6 relative">
    <input type="checkbox" className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer" id="custom_switch_checkbox1" />
    <span className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary before:transition-all before:duration-300"></span>
</label>`}</pre>
                                </CodeHighlight>
                            )}
                        </div>
                    </div>
                </div>
                <div className="space-y-8" id="outline">
                    <h4 className="badge inline-block bg-primary text-base hover:top-0">Outline</h4>
                    {/* Outline */}
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        <div className="panel">
                            <div className="mb-5 flex items-center justify-between">
                                <h5 className="text-lg font-semibold dark:text-white-light">Default</h5>
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
                                <label className="relative h-6 w-12">
                                    <input type="checkbox" className="custom_switch peer absolute z-10 h-full w-full cursor-pointer opacity-0" id="custom_switch_checkbox1" />
                                    <span className="outline_checkbox block h-full border-2 border-[#ebedf2] before:absolute before:left-1 before:bottom-1 before:h-4 before:w-4 before:bg-[#ebedf2] before:transition-all before:duration-300 peer-checked:border-primary peer-checked:before:left-7 peer-checked:before:bg-primary dark:border-white-dark dark:before:bg-white-dark"></span>
                                </label>
                            </div>
                            {codeArr.includes('code5') && (
                                <CodeHighlight>
                                    <pre className="language-xml">{`<label className="w-12 h-6 relative">
    <input type="checkbox" className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer" id="custom_switch_checkbox1" />
    <span className="outline_checkbox border-2 border-[#ebedf2] dark:border-white-dark block h-full before:absolute before:left-1 before:bg-[#ebedf2] dark:before:bg-white-dark before:bottom-1 before:w-4 before:h-4 peer-checked:before:left-7 peer-checked:border-primary peer-checked:before:bg-primary before:transition-all before:duration-300"></span>
</label>`}</pre>
                                </CodeHighlight>
                            )}
                        </div>
                        <div className="panel">
                            <div className="mb-5 flex items-center justify-between">
                                <h5 className="text-lg font-semibold dark:text-white-light">Rounded</h5>
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
                                <label className="relative h-6 w-12">
                                    <input type="checkbox" className="custom_switch peer absolute z-10 h-full w-full cursor-pointer opacity-0" id="custom_switch_checkbox1" />
                                    <span className="outline_checkbox block h-full rounded-full border-2 border-[#ebedf2] before:absolute before:left-1 before:bottom-1 before:h-4 before:w-4 before:rounded-full before:bg-[#ebedf2] before:transition-all before:duration-300 peer-checked:border-primary peer-checked:before:left-7 peer-checked:before:bg-primary dark:border-white-dark dark:before:bg-white-dark"></span>
                                </label>
                            </div>
                            {codeArr.includes('code6') && (
                                <CodeHighlight>
                                    <pre className="language-xml">{`<label className="w-12 h-6 relative">
    <input type="checkbox" className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer" id="custom_switch_checkbox1" />
    <span className="outline_checkbox border-2 border-[#ebedf2] dark:border-white-dark block h-full rounded-full before:absolute before:left-1 before:bg-[#ebedf2] dark:before:bg-white-dark before:bottom-1 before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:border-primary peer-checked:before:bg-primary before:transition-all before:duration-300"></span>
</label>`}</pre>
                                </CodeHighlight>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Switches;
