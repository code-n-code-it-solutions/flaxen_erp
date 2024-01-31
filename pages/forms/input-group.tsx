import Link from 'next/link';
import { useEffect, useState } from 'react';
import CodeHighlight from '../../components/Highlight';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../store';
import Dropdown from '../../components/Dropdown';
import { setPageTitle } from '../../store/slices/themeConfigSlice';

const InputGroup = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Input Group'));
    });
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;
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
                    <span>Input Group</span>
                </li>
            </ul>

            <div className="space-y-4 pt-5">
                {/*  Basic  */}
                <div className="grid grid-cols-1 gap-4 xl:grid-cols-2" id="basic">
                    {/* default */}
                    <div className="panel lg:row-span-2">
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
                            <form>
                                <div className="mb-5">
                                    <div className="flex">
                                        <div className="flex items-center justify-center border border-white-light bg-[#eee] px-3 font-semibold ltr:rounded-l-md ltr:border-r-0 rtl:rounded-r-md rtl:border-l-0 dark:border-[#17263c] dark:bg-[#1b2e4b]">
                                            @
                                        </div>
                                        <input type="text" placeholder="Username" className="form-input ltr:rounded-l-none rtl:rounded-r-none" />
                                    </div>
                                </div>
                                <div className="mb-5">
                                    <div className="flex">
                                        <input type="text" placeholder="Recipient's username" className="form-input ltr:rounded-r-none rtl:rounded-l-none" />
                                        <div className="flex items-center justify-center border border-white-light bg-[#eee] px-3 font-semibold ltr:rounded-r-md ltr:border-l-0 rtl:rounded-l-md rtl:border-r-0 dark:border-[#17263c] dark:bg-[#1b2e4b]">
                                            @example.com
                                        </div>
                                    </div>
                                </div>
                                <div className="mb-5">
                                    <label htmlFor="url">Your vanity URL</label>
                                    <div className="flex">
                                        <div className="flex items-center justify-center border border-white-light bg-[#eee] px-3 font-semibold ltr:rounded-l-md ltr:border-r-0 rtl:rounded-r-md rtl:border-l-0 dark:border-[#17263c] dark:bg-[#1b2e4b]">
                                            https://
                                        </div>
                                        <input id="url" type="text" placeholder="example.com/users/" className="form-input ltr:rounded-l-none rtl:rounded-r-none" />
                                    </div>
                                </div>
                                <div className="mb-5">
                                    <div className="flex">
                                        <div className="flex items-center justify-center border border-white-light bg-[#eee] px-3 font-semibold ltr:rounded-l-md ltr:border-r-0 rtl:rounded-r-md rtl:border-l-0 dark:border-[#17263c] dark:bg-[#1b2e4b]">
                                            $
                                        </div>
                                        <input type="text" placeholder="" className="form-input rounded-none" />
                                        <div className="flex items-center justify-center border border-white-light bg-[#eee] px-3 font-semibold ltr:rounded-r-md ltr:border-l-0 rtl:rounded-l-md rtl:border-r-0 dark:border-[#17263c] dark:bg-[#1b2e4b]">
                                            .00
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex">
                                        <div className="flex items-center justify-center whitespace-nowrap border border-white-light bg-[#eee] px-3 font-semibold ltr:rounded-l-md ltr:border-r-0 rtl:rounded-r-md rtl:border-l-0 dark:border-[#17263c] dark:bg-[#1b2e4b]">
                                            With textarea
                                        </div>
                                        <textarea rows={4} className="form-textarea ltr:rounded-l-none rtl:rounded-r-none"></textarea>
                                    </div>
                                </div>
                            </form>
                        </div>
                        {codeArr.includes('code1') && (
                            <CodeHighlight>
                                <pre className="language-xml">{`<form>
    <div className="mb-5">
        <div className="flex">
            <div className="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
                @
            </div>
            <input type="text" placeholder="Username" className="form-input ltr:rounded-l-none rtl:rounded-r-none" />
        </div>
    </div>
    <div className="mb-5">
        <div className="flex">
            <input type="text" placeholder="Recipient's username" className="form-input ltr:rounded-r-none rtl:rounded-l-none" />
            <div className="bg-[#eee] flex justify-center items-center ltr:rounded-r-md rtl:rounded-l-md px-3 font-semibold border ltr:border-l-0 rtl:border-r-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
                @example.com
            </div>
        </div>
    </div>
    <div className="mb-5">
        <label htmlFor="url">Your vanity URL</label>
        <div className="flex">
            <div className="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
                https://
            </div>
            <input id="url" type="text" placeholder="example.com/users/" className="form-input ltr:rounded-l-none rtl:rounded-r-none" />
        </div>
    </div>
    <div className="mb-5">
        <div className="flex">
            <div className="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
                $
            </div>
            <input type="text" placeholder="" className="form-input rounded-none" />
            <div className="bg-[#eee] flex justify-center items-center ltr:rounded-r-md rtl:rounded-l-md px-3 font-semibold border ltr:border-l-0 rtl:border-r-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
                .00
            </div>
        </div>
    </div>
    <div>
        <div className="flex">
            <div className="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b] whitespace-nowrap">
                With textarea
            </div>
            <textarea rows={4} className="form-textarea ltr:rounded-l-none rtl:rounded-r-none"></textarea>
        </div>
    </div>
</form>`}</pre>
                            </CodeHighlight>
                        )}
                    </div>

                    {/* simple icon */}
                    <div className="panel">
                        <div className="mb-5 flex items-center justify-between">
                            <h5 className="text-lg font-semibold dark:text-white-light">Simple Icon</h5>
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
                            <div className="mb-5">
                                <label htmlFor="iconLeft">Left</label>
                                <div className="flex">
                                    <div className="flex items-center justify-center border border-white-light bg-[#eee] px-3 font-semibold ltr:rounded-l-md ltr:border-r-0 rtl:rounded-r-md rtl:border-l-0 dark:border-[#17263c] dark:bg-[#1b2e4b]">
                                        <svg className="text-white-dark" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M19.0001 9.7041V9C19.0001 5.13401 15.8661 2 12.0001 2C8.13407 2 5.00006 5.13401 5.00006 9V9.7041C5.00006 10.5491 4.74995 11.3752 4.28123 12.0783L3.13263 13.8012C2.08349 15.3749 2.88442 17.5139 4.70913 18.0116C9.48258 19.3134 14.5175 19.3134 19.291 18.0116C21.1157 17.5139 21.9166 15.3749 20.8675 13.8012L19.7189 12.0783C19.2502 11.3752 19.0001 10.5491 19.0001 9.7041Z"
                                                stroke="currentColor"
                                                strokeWidth="1.5"
                                            />
                                            <path
                                                opacity="0.5"
                                                d="M7.5 19C8.15503 20.7478 9.92246 22 12 22C14.0775 22 15.845 20.7478 16.5 19"
                                                stroke="currentColor"
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                            />
                                        </svg>
                                    </div>
                                    <input id="iconLeft" type="text" placeholder="Notification" className="form-input ltr:rounded-l-none rtl:rounded-r-none" />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="iconRight">Right</label>
                                <div className="flex">
                                    <input id="iconRight" type="text" placeholder="Notification" className="form-input ltr:rounded-r-none rtl:rounded-l-none" />
                                    <div className="flex items-center justify-center border border-white-light bg-[#eee] px-3 font-semibold ltr:rounded-r-md ltr:border-l-0 rtl:rounded-l-md rtl:border-r-0 dark:border-[#17263c] dark:bg-[#1b2e4b]">
                                        <svg className="text-white-dark" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M19.0001 9.7041V9C19.0001 5.13401 15.8661 2 12.0001 2C8.13407 2 5.00006 5.13401 5.00006 9V9.7041C5.00006 10.5491 4.74995 11.3752 4.28123 12.0783L3.13263 13.8012C2.08349 15.3749 2.88442 17.5139 4.70913 18.0116C9.48258 19.3134 14.5175 19.3134 19.291 18.0116C21.1157 17.5139 21.9166 15.3749 20.8675 13.8012L19.7189 12.0783C19.2502 11.3752 19.0001 10.5491 19.0001 9.7041Z"
                                                stroke="currentColor"
                                                strokeWidth="1.5"
                                            />
                                            <path
                                                opacity="0.5"
                                                d="M7.5 19C8.15503 20.7478 9.92246 22 12 22C14.0775 22 15.845 20.7478 16.5 19"
                                                stroke="currentColor"
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {codeArr.includes('code2') && (
                            <CodeHighlight>
                                <pre className="language-xml">{`{/*left*/}
<div className="flex">
    <div className="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
        <svg> ... </svg>
    </div>
    <input id="iconLeft" type="text" placeholder="Notification" className="form-input ltr:rounded-l-none rtl:rounded-r-none" />
</div>

{/*right*/}
<div className="flex">
    <input id="iconRight" type="text" placeholder="Notification" className="form-input ltr:rounded-r-none rtl:rounded-l-none" />
    <div className="bg-[#eee] flex justify-center items-center ltr:rounded-r-md rtl:rounded-l-md px-3 font-semibold border ltr:border-l-0 rtl:border-r-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
        <svg> ... </svg>
    </div>
</div>`}</pre>
                            </CodeHighlight>
                        )}
                    </div>

                    {/*  spinning Icon  */}
                    <div className="panel">
                        <div className="mb-5 flex items-center justify-between">
                            <h5 className="text-lg font-semibold dark:text-white-light">Spinning Icon</h5>
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
                            <div className="mb-5">
                                <label htmlFor="spiLeft">Left</label>
                                <div className="flex">
                                    <div className="flex items-center justify-center border border-white-light bg-[#eee] px-3 font-semibold ltr:rounded-l-md ltr:border-r-0 rtl:rounded-r-md rtl:border-l-0 dark:border-[#17263c] dark:bg-[#1b2e4b]">
                                        <svg
                                            viewBox="0 0 24 24"
                                            width="24"
                                            height="24"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            fill="none"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="h-5 w-5 animate-spin text-white-dark"
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
                                    </div>
                                    <input id="spiLeft" type="text" placeholder="Spinners" className="form-input ltr:rounded-l-none rtl:rounded-r-none" />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="spiRight">Right</label>
                                <div className="flex">
                                    <input id="spiRight" type="text" placeholder="Spinners" className="form-input ltr:rounded-r-none rtl:rounded-l-none" />
                                    <div className="flex items-center justify-center border border-white-light bg-[#eee] px-3 font-semibold ltr:rounded-r-md ltr:border-l-0 rtl:rounded-l-md rtl:border-r-0 dark:border-[#17263c] dark:bg-[#1b2e4b]">
                                        <svg
                                            viewBox="0 0 24 24"
                                            width="24"
                                            height="24"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            fill="none"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="h-5 w-5 animate-spin text-white-dark"
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
                                    </div>
                                </div>
                            </div>
                        </div>
                        {codeArr.includes('code3') && (
                            <CodeHighlight>
                                <pre className="language-xml">{`{/*left*/}
<div className="flex">
    <div className="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
        <svg> ... </svg>
    </div>
    <input id="spiLeft" type="text" placeholder="Spinners" className="form-input ltr:rounded-l-none rtl:rounded-r-none" />
</div>

{/*right*/}
<div className="flex">
    <input id="spiRight" type="text" placeholder="Spinners" className="form-input ltr:rounded-r-none rtl:rounded-l-none" />
    <div className="bg-[#eee] flex justify-center items-center ltr:rounded-r-md rtl:rounded-l-md px-3 font-semibold border ltr:border-l-0 rtl:border-r-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
        <svg> ... </svg>
    </div>
</div>`}</pre>
                            </CodeHighlight>
                        )}
                    </div>

                    {/*  dropdown icon */}
                    <div className="panel">
                        <div className="mb-5 flex items-center justify-between">
                            <h5 className="text-lg font-semibold dark:text-white-light">Dropdown Icon</h5>
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
                            <div>
                                <label htmlFor="dropdownLeft">Left</label>
                                <div className="flex">
                                    <div className="dropdown">
                                        <Dropdown
                                            offset={[0, 5]}
                                            placement={`${isRtl ? 'bottom-end' : 'bottom-start'}`}
                                            btnClassName="bg-primary flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-white-light dark:border-[#17263c] cursor-pointer pt-2 pb-2"
                                            button={
                                                <svg className="text-white" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"></circle>
                                                    <path
                                                        opacity="0.5"
                                                        d="M13.7654 2.15224C13.3978 2 12.9319 2 12 2C11.0681 2 10.6022 2 10.2346 2.15224C9.74457 2.35523 9.35522 2.74458 9.15223 3.23463C9.05957 3.45834 9.0233 3.7185 9.00911 4.09799C8.98826 4.65568 8.70226 5.17189 8.21894 5.45093C7.73564 5.72996 7.14559 5.71954 6.65219 5.45876C6.31645 5.2813 6.07301 5.18262 5.83294 5.15102C5.30704 5.08178 4.77518 5.22429 4.35436 5.5472C4.03874 5.78938 3.80577 6.1929 3.33983 6.99993C2.87389 7.80697 2.64092 8.21048 2.58899 8.60491C2.51976 9.1308 2.66227 9.66266 2.98518 10.0835C3.13256 10.2756 3.3397 10.437 3.66119 10.639C4.1338 10.936 4.43789 11.4419 4.43786 12C4.43783 12.5581 4.13375 13.0639 3.66118 13.3608C3.33965 13.5629 3.13248 13.7244 2.98508 13.9165C2.66217 14.3373 2.51966 14.8691 2.5889 15.395C2.64082 15.7894 2.87379 16.193 3.33973 17C3.80568 17.807 4.03865 18.2106 4.35426 18.4527C4.77508 18.7756 5.30694 18.9181 5.83284 18.8489C6.07289 18.8173 6.31632 18.7186 6.65204 18.5412C7.14547 18.2804 7.73556 18.27 8.2189 18.549C8.70224 18.8281 8.98826 19.3443 9.00911 19.9021C9.02331 20.2815 9.05957 20.5417 9.15223 20.7654C9.35522 21.2554 9.74457 21.6448 10.2346 21.8478C10.6022 22 11.0681 22 12 22C12.9319 22 13.3978 22 13.7654 21.8478C14.2554 21.6448 14.6448 21.2554 14.8477 20.7654C14.9404 20.5417 14.9767 20.2815 14.9909 19.902C15.0117 19.3443 15.2977 18.8281 15.781 18.549C16.2643 18.2699 16.8544 18.2804 17.3479 18.5412C17.6836 18.7186 17.927 18.8172 18.167 18.8488C18.6929 18.9181 19.2248 18.7756 19.6456 18.4527C19.9612 18.2105 20.1942 17.807 20.6601 16.9999C21.1261 16.1929 21.3591 15.7894 21.411 15.395C21.4802 14.8691 21.3377 14.3372 21.0148 13.9164C20.8674 13.7243 20.6602 13.5628 20.3387 13.3608C19.8662 13.0639 19.5621 12.558 19.5621 11.9999C19.5621 11.4418 19.8662 10.9361 20.3387 10.6392C20.6603 10.4371 20.8675 10.2757 21.0149 10.0835C21.3378 9.66273 21.4803 9.13087 21.4111 8.60497C21.3592 8.21055 21.1262 7.80703 20.6602 7C20.1943 6.19297 19.9613 5.78945 19.6457 5.54727C19.2249 5.22436 18.693 5.08185 18.1671 5.15109C17.9271 5.18269 17.6837 5.28136 17.3479 5.4588C16.8545 5.71959 16.2644 5.73002 15.7811 5.45096C15.2977 5.17191 15.0117 4.65566 14.9909 4.09794C14.9767 3.71848 14.9404 3.45833 14.8477 3.23463C14.6448 2.74458 14.2554 2.35523 13.7654 2.15224Z"
                                                        stroke="currentColor"
                                                        strokeWidth="1.5"
                                                    ></path>
                                                </svg>
                                            }
                                        >
                                            <ul className="!min-w-[170px]">
                                                <li>
                                                    <button type="button">Action</button>
                                                </li>
                                                <li>
                                                    <button type="button">Another action</button>
                                                </li>
                                                <li>
                                                    <button type="button">Something else here</button>
                                                </li>
                                                <li>
                                                    <button type="button">Separated link</button>
                                                </li>
                                            </ul>
                                        </Dropdown>
                                    </div>
                                    <input id="dropdownLeft" type="text" placeholder="Dropdown" className="form-input ltr:rounded-l-none rtl:rounded-r-none" />
                                </div>
                            </div>
                            <div className="mt-5">
                                <label htmlFor="dropdownRight">Right</label>
                                <div className="flex">
                                    <input id="dropdownLeft" type="text" placeholder="Dropdown" className="form-input ltr:rounded-r-none rtl:rounded-l-none" />
                                    <div className="dropdown">
                                        <Dropdown
                                            offset={[0, 5]}
                                            placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                                            btnClassName="bg-success flex justify-center items-center ltr:rounded-r-md rtl:rounded-l-md px-3 font-semibold border ltr:border-l-0 rtl:border-r-0 border-white-light dark:border-[#17263c] cursor-pointer pt-2 pb-2"
                                            button={
                                                <svg className="text-white" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"></circle>
                                                    <path
                                                        opacity="0.5"
                                                        d="M13.7654 2.15224C13.3978 2 12.9319 2 12 2C11.0681 2 10.6022 2 10.2346 2.15224C9.74457 2.35523 9.35522 2.74458 9.15223 3.23463C9.05957 3.45834 9.0233 3.7185 9.00911 4.09799C8.98826 4.65568 8.70226 5.17189 8.21894 5.45093C7.73564 5.72996 7.14559 5.71954 6.65219 5.45876C6.31645 5.2813 6.07301 5.18262 5.83294 5.15102C5.30704 5.08178 4.77518 5.22429 4.35436 5.5472C4.03874 5.78938 3.80577 6.1929 3.33983 6.99993C2.87389 7.80697 2.64092 8.21048 2.58899 8.60491C2.51976 9.1308 2.66227 9.66266 2.98518 10.0835C3.13256 10.2756 3.3397 10.437 3.66119 10.639C4.1338 10.936 4.43789 11.4419 4.43786 12C4.43783 12.5581 4.13375 13.0639 3.66118 13.3608C3.33965 13.5629 3.13248 13.7244 2.98508 13.9165C2.66217 14.3373 2.51966 14.8691 2.5889 15.395C2.64082 15.7894 2.87379 16.193 3.33973 17C3.80568 17.807 4.03865 18.2106 4.35426 18.4527C4.77508 18.7756 5.30694 18.9181 5.83284 18.8489C6.07289 18.8173 6.31632 18.7186 6.65204 18.5412C7.14547 18.2804 7.73556 18.27 8.2189 18.549C8.70224 18.8281 8.98826 19.3443 9.00911 19.9021C9.02331 20.2815 9.05957 20.5417 9.15223 20.7654C9.35522 21.2554 9.74457 21.6448 10.2346 21.8478C10.6022 22 11.0681 22 12 22C12.9319 22 13.3978 22 13.7654 21.8478C14.2554 21.6448 14.6448 21.2554 14.8477 20.7654C14.9404 20.5417 14.9767 20.2815 14.9909 19.902C15.0117 19.3443 15.2977 18.8281 15.781 18.549C16.2643 18.2699 16.8544 18.2804 17.3479 18.5412C17.6836 18.7186 17.927 18.8172 18.167 18.8488C18.6929 18.9181 19.2248 18.7756 19.6456 18.4527C19.9612 18.2105 20.1942 17.807 20.6601 16.9999C21.1261 16.1929 21.3591 15.7894 21.411 15.395C21.4802 14.8691 21.3377 14.3372 21.0148 13.9164C20.8674 13.7243 20.6602 13.5628 20.3387 13.3608C19.8662 13.0639 19.5621 12.558 19.5621 11.9999C19.5621 11.4418 19.8662 10.9361 20.3387 10.6392C20.6603 10.4371 20.8675 10.2757 21.0149 10.0835C21.3378 9.66273 21.4803 9.13087 21.4111 8.60497C21.3592 8.21055 21.1262 7.80703 20.6602 7C20.1943 6.19297 19.9613 5.78945 19.6457 5.54727C19.2249 5.22436 18.693 5.08185 18.1671 5.15109C17.9271 5.18269 17.6837 5.28136 17.3479 5.4588C16.8545 5.71959 16.2644 5.73002 15.7811 5.45096C15.2977 5.17191 15.0117 4.65566 14.9909 4.09794C14.9767 3.71848 14.9404 3.45833 14.8477 3.23463C14.6448 2.74458 14.2554 2.35523 13.7654 2.15224Z"
                                                        stroke="currentColor"
                                                        strokeWidth="1.5"
                                                    ></path>
                                                </svg>
                                            }
                                        >
                                            <ul className="!min-w-[170px]">
                                                <li>
                                                    <button type="button">Action</button>
                                                </li>
                                                <li>
                                                    <button type="button">Another action</button>
                                                </li>
                                                <li>
                                                    <button type="button">Something else here</button>
                                                </li>
                                                <li>
                                                    <button type="button">Separated link</button>
                                                </li>
                                            </ul>
                                        </Dropdown>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {codeArr.includes('code4') && (
                            <CodeHighlight>
                                <pre className="language-typescript">{`import Dropdown from '../../components/Dropdown';
<div className="flex">
    <div className="dropdown">
        <Dropdown
            offset={[0, 5]}
            placement={\`\${isRtl ? 'bottom-end' : 'bottom-start'}\`}
            btnClassName="bg-primary flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-white-light dark:border-[#17263c] cursor-pointer pt-2 pb-2"
            button={
                <svg> ... </svg>
            }
        >
            <ul className="!min-w-[170px]">
                <li>
                    <button type="button">Action</button>
                </li>
                <li>
                    <button type="button">Another action</button>
                </li>
                <li>
                    <button type="button">Something else here</button>
                </li>
                <li>
                    <button type="button">Separated link</button>
                </li>
            </ul>
        </Dropdown>
    </div>
    <input id="dropdownLeft" type="text" placeholder="Dropdown" className="form-input ltr:rounded-l-none rtl:rounded-r-none" />
</div>

<div className="flex">
    <input id="dropdownLeft" type="text" placeholder="Dropdown" className="form-input ltr:rounded-r-none rtl:rounded-l-none" />
    <div className="dropdown">
        <Dropdown
            offset={[0, 5]}
            placement={\`\${isRtl ? 'bottom-start' : 'bottom-end'}\`}
            btnClassName="bg-success flex justify-center items-center ltr:rounded-r-md rtl:rounded-l-md px-3 font-semibold border ltr:border-l-0 rtl:border-r-0 border-white-light dark:border-[#17263c] cursor-pointer pt-2 pb-2"
            button={
                <svg> ... </svg>
            }
        >
            <ul className="!min-w-[170px]">
                <li>
                    <button type="button">Action</button>
                </li>
                <li>
                    <button type="button">Another action</button>
                </li>
                <li>
                    <button type="button">Something else here</button>
                </li>
                <li>
                    <button type="button">Separated link</button>
                </li>
            </ul>
        </Dropdown>
    </div>
</div>`}</pre>
                            </CodeHighlight>
                        )}
                    </div>

                    {/* checkboxes */}
                    <div className="panel">
                        <div className="mb-5 flex items-center justify-between">
                            <h5 className="text-lg font-semibold dark:text-white-light">Checkboxes</h5>
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
                                <label htmlFor="checkLeft">Left</label>
                                <div className="flex">
                                    <div className="flex items-center justify-center border border-white-light bg-[#f1f2f3] px-3 font-semibold ltr:rounded-l-md ltr:border-r-0 rtl:rounded-r-md rtl:border-l-0 dark:border-[#17263c] dark:bg-[#1b2e4b]">
                                        <input type="checkbox" className="form-checkbox border-white-light ltr:mr-0 rtl:ml-0 dark:border-white-dark" defaultChecked />
                                    </div>
                                    <input id="checkLeft" type="text" placeholder="Checkbox" className="form-input ltr:rounded-l-none rtl:rounded-r-none" />
                                </div>
                            </div>
                            <label htmlFor="checkRight">Right</label>
                            <div className="flex">
                                <input id="checkRight" type="text" placeholder="Checkbox" className="form-input ltr:rounded-r-none rtl:rounded-l-none" />
                                <div className="flex items-center justify-center border border-white-light bg-[#f1f2f3] px-3 font-semibold ltr:rounded-r-md ltr:border-l-0 rtl:rounded-l-md rtl:border-r-0 dark:border-[#17263c] dark:bg-[#1b2e4b]">
                                    <input type="checkbox" className="form-checkbox border-white-light text-warning ltr:mr-0 rtl:ml-0 dark:border-white-dark" defaultChecked />
                                </div>
                            </div>
                        </div>
                        {codeArr.includes('code5') && (
                            <CodeHighlight>
                                <pre className="language-xml">{`{/*left*/}
<div className="flex">
    <div className="bg-[#f1f2f3] dark:bg-[#1b2e4b] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-white-light dark:border-[#17263c]">
        <input type="checkbox" className="form-checkbox border-white-light dark:border-white-dark ltr:mr-0 rtl:ml-0" defaultChecked />
    </div>
    <input id="checkLeft" type="text" placeholder="Checkbox" className="form-input ltr:rounded-l-none rtl:rounded-r-none" />
</div>

{/*right*/}
<div className="flex">
    <input id="checkRight" type="text" placeholder="Checkbox" className="form-input ltr:rounded-r-none rtl:rounded-l-none" />
    <div className="bg-[#f1f2f3] dark:bg-[#1b2e4b] flex justify-center items-center ltr:rounded-r-md rtl:rounded-l-md px-3 font-semibold border ltr:border-l-0 rtl:border-r-0 border-white-light dark:border-[#17263c]">
        <input type="checkbox" className="form-checkbox text-warning border-white-light dark:border-white-dark ltr:mr-0 rtl:ml-0" defaultChecked />
    </div>
</div>`}</pre>
                            </CodeHighlight>
                        )}
                    </div>

                    {/* Radio */}
                    <div className="panel">
                        <div className="mb-5 flex items-center justify-between">
                            <h5 className="text-lg font-semibold dark:text-white-light">Radios</h5>
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
                                <label htmlFor="radioLeft">Left</label>
                                <div className="flex">
                                    <div className="flex items-center justify-center border border-white-light bg-[#f1f2f3] px-3 font-semibold ltr:rounded-l-md ltr:border-r-0 rtl:rounded-r-md rtl:border-l-0 dark:border-[#17263c] dark:bg-[#1b2e4b]">
                                        <input type="radio" className="form-radio border-white-light text-info ltr:mr-0 rtl:ml-0 dark:border-white-dark" defaultChecked />
                                    </div>
                                    <input id="radioLeft" type="text" placeholder="Radio" className="form-input ltr:rounded-l-none rtl:rounded-r-none" />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="radioRight">Right</label>
                                <div className="flex">
                                    <input id="radioRight" type="text" placeholder="Radio" className="form-input ltr:rounded-r-none rtl:rounded-l-none" />
                                    <div className="flex items-center justify-center border border-white-light bg-[#f1f2f3] px-3 font-semibold ltr:rounded-r-md ltr:border-l-0 rtl:rounded-l-md rtl:border-r-0 dark:border-[#17263c] dark:bg-[#1b2e4b]">
                                        <input type="radio" className="form-radio border-white-light text-danger ltr:mr-0 rtl:ml-0 dark:border-white-dark" defaultChecked />
                                    </div>
                                </div>
                            </div>
                        </div>
                        {codeArr.includes('code6') && (
                            <CodeHighlight>
                                <pre className="language-xml">{`{/*left*/}
<div className="flex">
    <div className="bg-[#f1f2f3] dark:bg-[#1b2e4b] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-white-light dark:border-[#17263c]">
        <input type="radio" className="form-radio text-info border-white-light dark:border-white-dark ltr:mr-0 rtl:ml-0" defaultChecked />
    </div>
    <input id="radioLeft" type="text" placeholder="Radio" className="form-input ltr:rounded-l-none rtl:rounded-r-none" />
</div>

{/*right*/}
<div className="flex">
    <input id="radioRight" type="text" placeholder="Radio" className="form-input ltr:rounded-r-none rtl:rounded-l-none" />
    <div className="bg-[#f1f2f3] dark:bg-[#1b2e4b] flex justify-center items-center ltr:rounded-r-md rtl:rounded-l-md px-3 font-semibold border ltr:border-l-0 rtl:border-r-0 border-white-light dark:border-[#17263c]">
        <input type="radio" className="form-radio text-danger border-white-light dark:border-white-dark ltr:mr-0 rtl:ml-0" defaultChecked />
    </div>
</div>`}</pre>
                            </CodeHighlight>
                        )}
                    </div>
                    {/* switch */}
                    <div className="panel">
                        <div className="mb-5 flex items-center justify-between">
                            <h5 className="text-lg font-semibold dark:text-white-light">Switch</h5>
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
                            <div className="mb-5">
                                <label htmlFor="switchLeft">Left</label>
                                <div className="flex">
                                    <div className="flex items-center justify-center border border-white-light bg-[#eee] px-3 font-semibold ltr:rounded-l-md ltr:border-r-0 rtl:rounded-r-md rtl:border-l-0 dark:border-[#17263c] dark:bg-[#1b2e4b]">
                                        <label className="relative mb-0 h-4 w-7 cursor-pointer">
                                            <input type="checkbox" className="peer absolute z-10 h-full w-full cursor-pointer opacity-0 focus:outline-none focus:ring-0" id="custom_switch_checkbox1" />
                                            <span className="block h-full rounded-full border border-[#adb5bd] bg-white before:absolute before:bottom-[2px] before:h-3 before:w-3 before:rounded-full before:bg-[#adb5bd] before:transition-all before:duration-300 peer-checked:border-primary peer-checked:bg-primary peer-checked:before:bg-white ltr:before:left-0.5 ltr:peer-checked:before:left-3.5 rtl:before:right-0.5 rtl:peer-checked:before:right-3.5 dark:bg-dark dark:before:bg-white-dark"></span>
                                        </label>
                                    </div>
                                    <input id="switchLeft" type="text" placeholder="Switch" className="form-input ltr:rounded-l-none rtl:rounded-r-none" />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="switchRight">Right</label>
                                <div className="flex">
                                    <input id="switchRight" type="text" placeholder="Switch" className="form-input ltr:rounded-r-none rtl:rounded-l-none" />
                                    <div className="flex items-center justify-center border border-white-light bg-[#eee] px-3 font-semibold ltr:rounded-r-md ltr:border-l-0 rtl:rounded-l-md rtl:border-r-0 dark:border-[#17263c] dark:bg-[#1b2e4b]">
                                        <label className="relative mb-0 h-4 w-7 cursor-pointer">
                                            <input type="checkbox" className="peer absolute z-10 h-full w-full cursor-pointer opacity-0 focus:outline-none focus:ring-0" id="custom_switch_checkbox2" />
                                            <span className="block h-full rounded-full border border-[#adb5bd] bg-white before:absolute before:bottom-[2px] before:h-3 before:w-3 before:rounded-full before:bg-[#adb5bd] before:transition-all before:duration-300 peer-checked:border-primary peer-checked:bg-primary peer-checked:before:bg-white ltr:before:left-0.5 ltr:peer-checked:before:left-3.5 rtl:before:right-0.5 rtl:peer-checked:before:right-3.5 dark:bg-dark dark:before:bg-white-dark"></span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {codeArr.includes('code7') && (
                            <CodeHighlight>
                                <pre className="language-xml">{`{/*left*/}
<div className="flex">
    <div className="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
        <label className="w-7 h-4 relative cursor-pointer mb-0">
            <input type="checkbox" className="peer absolute w-full h-full opacity-0 z-10 focus:ring-0 focus:outline-none cursor-pointer" id="custom_switch_checkbox1" />
            <span className="rounded-full border border-[#adb5bd] bg-white peer-checked:bg-primary peer-checked:border-primary dark:bg-dark block h-full before:absolute ltr:before:left-0.5 rtl:before:right-0.5 ltr:peer-checked:before:left-3.5 rtl:peer-checked:before:right-3.5 peer-checked:before:bg-white before:bg-[#adb5bd] dark:before:bg-white-dark before:bottom-[2px] before:w-3 before:h-3 before:rounded-full before:transition-all before:duration-300"></span>
        </label>
    </div>
    <input id="switchLeft" type="text" placeholder="Switch" className="form-input ltr:rounded-l-none rtl:rounded-r-none" />
</div>

{/*right*/}
<div className="flex">
    <input id="switchRight" type="text" placeholder="Switch" className="form-input ltr:rounded-r-none rtl:rounded-l-none" />
    <div className="bg-[#eee] flex justify-center items-center ltr:rounded-r-md rtl:rounded-l-md px-3 font-semibold border ltr:border-l-0 rtl:border-r-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
        <label className="w-7 h-4 relative cursor-pointer mb-0">
            <input type="checkbox" className="peer absolute w-full h-full opacity-0 z-10 focus:ring-0 focus:outline-none cursor-pointer" id="custom_switch_checkbox2" />
            <span className="rounded-full border border-[#adb5bd] bg-white peer-checked:bg-primary peer-checked:border-primary dark:bg-dark block h-full before:absolute ltr:before:left-0.5 rtl:before:right-0.5 ltr:peer-checked:before:left-3.5 rtl:peer-checked:before:right-3.5 peer-checked:before:bg-white before:bg-[#adb5bd] dark:before:bg-white-dark before:bottom-[2px] before:w-3 before:h-3 before:rounded-full before:transition-all before:duration-300"></span>
        </label>
    </div>
</div>`}</pre>
                            </CodeHighlight>
                        )}
                    </div>
                </div>
                {/* Sizes */}
                <div className="panel" id="sizes">
                    <div className="mb-5 flex items-center justify-between">
                        <h5 className="text-lg font-semibold dark:text-white-light">Sizes</h5>
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
                        <form>
                            <div className="mb-5">
                                <div className="flex">
                                    <div className="flex items-center justify-center border border-white-light bg-[#eee] px-3 font-semibold ltr:rounded-l-md ltr:border-r-0 rtl:rounded-r-md rtl:border-l-0 dark:border-[#17263c] dark:bg-[#1b2e4b]">
                                        Large
                                    </div>
                                    <input type="text" placeholder="Username" className="form-input py-2.5 text-base ltr:rounded-l-none rtl:rounded-r-none" />
                                </div>
                            </div>
                            <div className="mb-5">
                                <div className="flex">
                                    <div className="flex items-center justify-center border border-white-light bg-[#eee] px-3 font-semibold ltr:rounded-l-md ltr:border-r-0 rtl:rounded-r-md rtl:border-l-0 dark:border-[#17263c] dark:bg-[#1b2e4b]">
                                        Default
                                    </div>
                                    <input type="text" placeholder="Username" className="form-input ltr:rounded-l-none rtl:rounded-r-none" />
                                </div>
                            </div>
                            <div>
                                <div className="flex">
                                    <div className="flex items-center justify-center border border-white-light bg-[#eee] px-3 font-semibold ltr:rounded-l-md ltr:border-r-0 rtl:rounded-r-md rtl:border-l-0 dark:border-[#17263c] dark:bg-[#1b2e4b]">
                                        Small
                                    </div>
                                    <input type="text" placeholder="Username" className="form-input py-1.5 text-xs ltr:rounded-l-none rtl:rounded-r-none" />
                                </div>
                            </div>
                        </form>
                    </div>
                    {codeArr.includes('code8') && (
                        <CodeHighlight>
                            <pre className="language-xml">{`<form>
    <div className="mb-5">
        <div className="flex">
            <div className="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
                Small
            </div>
            <input type="text" placeholder="Username" className="form-input ltr:rounded-l-none rtl:rounded-r-none py-2.5 text-base" />
        </div>
    </div>
    <div className="mb-5">
        <div className="flex">
            <div className="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
                Small
            </div>
            <input type="text" placeholder="Username" className="form-input ltr:rounded-l-none rtl:rounded-r-none" />
        </div>
    </div>
    <div>
        <div className="flex">
            <div className="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
                Small
            </div>
            <input type="text" placeholder="Username" className="form-input ltr:rounded-l-none rtl:rounded-r-none py-1.5 text-xs" />
        </div>
    </div>
</form>`}</pre>
                        </CodeHighlight>
                    )}
                </div>

                {/* <!-- Multiple --> */}
                <div className="grid grid-cols-1 gap-4 xl:grid-cols-2" id="multiple">
                    <div className="panel">
                        <div className="mb-5 flex items-center justify-between">
                            <h5 className="text-lg font-semibold dark:text-white-light">Multiple inputs</h5>
                            <button type="button" className="font-semibold hover:text-gray-400 dark:text-gray-400 dark:hover:text-gray-600" onClick={() => toggleCode('code9')}>
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
                            <form>
                                <div className="flex">
                                    <div className="flex items-center justify-center border border-white-light bg-[#eee] px-3 font-semibold ltr:rounded-l-md ltr:border-r-0 rtl:rounded-r-md rtl:border-l-0 dark:border-[#17263c] dark:bg-[#1b2e4b]">
                                        First and last name
                                    </div>
                                    <input type="text" placeholder="First Name" className="form-input flex-1 rounded-none focus:!border-r ltr:border-r-0 rtl:border-l-0" />
                                    <input type="text" placeholder="Last Name" className="form-input flex-1 ltr:rounded-l-none rtl:rounded-r-none" />
                                </div>
                            </form>
                        </div>
                        {codeArr.includes('code9') && (
                            <CodeHighlight>
                                <pre className="language-xml">{`<form>
    <div className="flex">
        <div className="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
            First and last name
        </div>
        <input type="text" placeholder="First Name" className="form-input ltr:border-r-0 rtl:border-l-0 focus:!border-r rounded-none flex-1" />
        <input type="text" placeholder="Last Name" className="form-input ltr:rounded-l-none rtl:rounded-r-none flex-1" />
    </div>
</form>`}</pre>
                            </CodeHighlight>
                        )}
                    </div>
                    <div className="panel">
                        <div className="mb-5 flex items-center justify-between">
                            <h5 className="text-lg font-semibold dark:text-white-light">Multiple addons</h5>
                            <button type="button" className="font-semibold hover:text-gray-400 dark:text-gray-400 dark:hover:text-gray-600" onClick={() => toggleCode('code10')}>
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
                            <form>
                                <div className="mb-5">
                                    <div className="flex">
                                        <div className="flex items-center justify-center border border-white-light bg-[#eee] px-3 font-semibold ltr:rounded-l-md ltr:border-r-0 rtl:rounded-r-md rtl:border-l-0 dark:border-[#17263c] dark:bg-[#1b2e4b]">
                                            $
                                        </div>
                                        <div className="flex items-center justify-center rounded-none border border-white-light bg-[#eee] px-3 font-semibold ltr:border-r-0 rtl:border-l-0 dark:border-[#17263c] dark:bg-[#1b2e4b]">
                                            0.00
                                        </div>
                                        <input type="text" placeholder="" className="form-input flex-1 ltr:rounded-l-none rtl:rounded-r-none" />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex">
                                        <input type="text" placeholder="" className="form-input flex-1 ltr:rounded-r-none ltr:rounded-l-md rtl:rounded-l-none rtl:rounded-r-md" />
                                        <div className="flex items-center justify-center rounded-none border border-white-light bg-[#eee] px-3 font-semibold dark:border-[#17263c] dark:bg-[#1b2e4b]">
                                            0.00
                                        </div>
                                        <div className="flex items-center justify-center border border-white-light bg-[#eee] px-3 font-semibold ltr:rounded-r-md ltr:border-l-0 rtl:rounded-l-md rtl:border-r-0 dark:border-[#17263c] dark:bg-[#1b2e4b]">
                                            $
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                        {codeArr.includes('code10') && (
                            <CodeHighlight>
                                <pre className="language-xml">{`<form>
    <div className="mb-5">
        <div className="flex">
            <div className="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
                $
            </div>
            <div className="bg-[#eee] flex justify-center items-center rounded-none px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
                0.00
            </div>
            <input type="text" placeholder="" className="form-input ltr:rounded-l-none rtl:rounded-r-none flex-1" />
        </div>
    </div>
    <div>
        <div className="flex">
            <input type="text" placeholder="" className="form-input ltr:rounded-r-none rtl:rounded-l-none flex-1 ltr:rounded-l-md rtl:rounded-r-md" />
            <div className="bg-[#eee] flex justify-center items-center rounded-none px-3 font-semibold border border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
                0.00
            </div>
            <div className="bg-[#eee] flex justify-center items-center ltr:rounded-r-md rtl:rounded-l-md px-3 font-semibold border ltr:border-l-0 rtl:border-r-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
                $
            </div>
        </div>
    </div>
</form>`}</pre>
                            </CodeHighlight>
                        )}
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-4 xl:grid-cols-2" id="with_action">
                    <div className="panel">
                        <div className="mb-5 flex items-center justify-between">
                            <h5 className="text-lg font-semibold dark:text-white-light">Buttons with dropdowns</h5>
                            <button type="button" className="font-semibold hover:text-gray-400 dark:text-gray-400 dark:hover:text-gray-600" onClick={() => toggleCode('code11')}>
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
                            <form>
                                <div className="dropdown mb-5">
                                    <label htmlFor="dropdownLeftButton">Left</label>
                                    <div className="flex">
                                        <div className="dropdown">
                                            <Dropdown
                                                offset={[0, 5]}
                                                placement={`${isRtl ? 'bottom-end' : 'bottom-start'}`}
                                                btnClassName="bg-primary text-white flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-white-light dark:border-[#17263c] cursor-pointer pt-2 pb-2"
                                                button={<span>Dropdown</span>}
                                            >
                                                <ul className="!min-w-[170px]">
                                                    <li>
                                                        <button type="button">Action</button>
                                                    </li>
                                                    <li>
                                                        <button type="button">Another action</button>
                                                    </li>
                                                    <li>
                                                        <button type="button">Something else here</button>
                                                    </li>
                                                    <li>
                                                        <button type="button">Separated link</button>
                                                    </li>
                                                </ul>
                                            </Dropdown>
                                        </div>
                                        <input id="dropdownLeftButton" type="text" placeholder="" className="form-input ltr:rounded-l-none rtl:rounded-r-none" />
                                    </div>
                                </div>

                                <div className="dropdown">
                                    <label htmlFor="dropdownRightButton">Right</label>
                                    <div className="flex">
                                        <input id="dropdownRightButton" type="text" placeholder="" className="form-input ltr:rounded-r-none rtl:rounded-l-none" />
                                        <div className="dropdown">
                                            <Dropdown
                                                offset={[0, 5]}
                                                placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                                                btnClassName="bg-danger text-white flex justify-center items-center ltr:rounded-r-md rtl:rounded-l-md px-3 font-semibold border ltr:border-l-0 rtl:border-r-0 border-white-light dark:border-[#17263c] cursor-pointer pt-2 pb-2"
                                                button={<span>Dropdown</span>}
                                            >
                                                <ul className="!min-w-[170px]">
                                                    <li>
                                                        <button type="button">Action</button>
                                                    </li>
                                                    <li>
                                                        <button type="button">Another action</button>
                                                    </li>
                                                    <li>
                                                        <button type="button">Something else here</button>
                                                    </li>
                                                    <li>
                                                        <button type="button">Separated link</button>
                                                    </li>
                                                </ul>
                                            </Dropdown>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                        {codeArr.includes('code11') && (
                            <CodeHighlight>
                                <pre className="language-typescript">{`import Dropdown from '../../components/Dropdown';
<form>
    <div className="mb-5 dropdown">
        <label htmlFor="dropdownLeftButton">Left</label>
        <div className="flex">
            <div className="dropdown">
                <Dropdown
                    offset={[0, 5]}
                    placement={\`\${isRtl ? 'bottom-end' : 'bottom-start'}\`}
                    btnClassName="bg-primary text-white flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-white-light dark:border-[#17263c] cursor-pointer pt-2 pb-2"
                    button={<span>Dropdown</span>}
                >
                    <ul className="!min-w-[170px]">
                        <li>
                            <button type="button">Action</button>
                        </li>
                        <li>
                            <button type="button">Another action</button>
                        </li>
                        <li>
                            <button type="button">Something else here</button>
                        </li>
                        <li>
                            <button type="button">Separated link</button>
                        </li>
                    </ul>
                </Dropdown>
            </div>
            <input id="dropdownLeftButton" type="text" placeholder="" className="form-input ltr:rounded-l-none rtl:rounded-r-none" />
        </div>
    </div>

    <div className="dropdown">
        <label htmlFor="dropdownRightButton">Right</label>
        <div className="flex">
            <input id="dropdownRightButton" type="text" placeholder="" className="form-input ltr:rounded-r-none rtl:rounded-l-none" />
            <div className="dropdown">
                <Dropdown
                    offset={[0, 5]}
                    placement={\`\${isRtl ? 'bottom-start' : 'bottom-end'}\`}
                    btnClassName="bg-danger text-white flex justify-center items-center ltr:rounded-r-md rtl:rounded-l-md px-3 font-semibold border ltr:border-l-0 rtl:border-r-0 border-white-light dark:border-[#17263c] cursor-pointer pt-2 pb-2"
                    button={<span>Dropdown</span>}
                >
                    <ul className="!min-w-[170px]">
                        <li>
                            <button type="button">Action</button>
                        </li>
                        <li>
                            <button type="button">Another action</button>
                        </li>
                        <li>
                            <button type="button">Something else here</button>
                        </li>
                        <li>
                            <button type="button">Separated link</button>
                        </li>
                    </ul>
                </Dropdown>
            </div>
        </div>
    </div>
</form>`}</pre>
                            </CodeHighlight>
                        )}
                    </div>
                    <div className="panel">
                        <div className="mb-5 flex items-center justify-between">
                            <h5 className="text-lg font-semibold dark:text-white-light">Segmented buttons</h5>
                            <button type="button" className="font-semibold hover:text-gray-400 dark:text-gray-400 dark:hover:text-gray-600" onClick={() => toggleCode('code12')}>
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
                            <form>
                                <div className="dropdown mb-5">
                                    <label htmlFor="btnLeft">Left</label>
                                    <div className="flex">
                                        <button
                                            type="button"
                                            className="flex items-center justify-center border border-info bg-info px-3 font-semibold text-white ltr:rounded-l-md ltr:border-r-0 rtl:rounded-r-md rtl:border-l-0"
                                        >
                                            Action
                                        </button>
                                        <div className="dropdown">
                                            <Dropdown
                                                offset={[0, 5]}
                                                placement={`${isRtl ? 'bottom-end' : 'bottom-start'}`}
                                                btnClassName="bg-white dark:bg-[#1b2e4b] text-info flex justify-center items-center rounded-none px-3 font-semibold border border-info cursor-pointer pt-2 pb-2"
                                                button={
                                                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M19 9L12 15L5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                }
                                            >
                                                <ul className="!min-w-[170px]">
                                                    <li>
                                                        <button type="button">Action</button>
                                                    </li>
                                                    <li>
                                                        <button type="button">Another action</button>
                                                    </li>
                                                    <li>
                                                        <button type="button">Something else here</button>
                                                    </li>
                                                    <li>
                                                        <button type="button">Separated link</button>
                                                    </li>
                                                </ul>
                                            </Dropdown>
                                        </div>

                                        <input id="btnLeft" type="text" placeholder="" className="form-input ltr:rounded-l-none ltr:border-l-0 rtl:rounded-r-none rtl:border-r-0" />
                                    </div>
                                </div>
                                <div className="dropdown">
                                    <label htmlFor="btnLeft">Right</label>
                                    <div className="flex">
                                        <input id="btnRight" type="text" placeholder="" className="form-input ltr:rounded-r-none ltr:border-r-0 rtl:rounded-l-none rtl:border-l-0" />
                                        <div className="dropdown">
                                            <Dropdown
                                                offset={[0, 5]}
                                                placement={`${isRtl ? 'bottom-end' : 'bottom-start'}`}
                                                btnClassName="bg-white dark:bg-[#1b2e4b] text-secondary flex justify-center items-center rounded-none px-3 font-semibold border border-secondary pt-2 pb-2"
                                                button={
                                                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M19 9L12 15L5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                }
                                            >
                                                <ul className="!min-w-[170px]">
                                                    <li>
                                                        <button type="button">Action</button>
                                                    </li>
                                                    <li>
                                                        <button type="button">Another action</button>
                                                    </li>
                                                    <li>
                                                        <button type="button">Something else here</button>
                                                    </li>
                                                    <li>
                                                        <button type="button">Separated link</button>
                                                    </li>
                                                </ul>
                                            </Dropdown>
                                        </div>
                                        <button
                                            type="button"
                                            className="flex cursor-pointer items-center justify-center border border-secondary bg-secondary px-3 font-semibold text-white ltr:rounded-r-md ltr:border-l-0 rtl:rounded-l-md rtl:border-r-0"
                                        >
                                            Action
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                        {codeArr.includes('code12') && (
                            <CodeHighlight>
                                <pre className="language-typescript">{`import Dropdown from '../../components/Dropdown';
<form>
    <div className="mb-5 dropdown">
        <label htmlFor="btnLeft">Left</label>
        <div className="flex">
            <button
                type="button"
                className="bg-info text-white flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-info"
            >
                Action
            </button>
            <div className="dropdown">
                <Dropdown
                    offset={[0, 5]}
                    placement={\`\${isRtl ? 'bottom-end' : 'bottom-start'}\`}
                    btnClassName="bg-white dark:bg-[#1b2e4b] text-info flex justify-center items-center rounded-none px-3 font-semibold border border-info cursor-pointer pt-2 pb-2"
                    button={
                        <svg> ... </svg>
                    }
                >
                    <ul className="!min-w-[170px]">
                        <li>
                            <button type="button">Action</button>
                        </li>
                        <li>
                            <button type="button">Another action</button>
                        </li>
                        <li>
                            <button type="button">Something else here</button>
                        </li>
                        <li>
                            <button type="button">Separated link</button>
                        </li>
                    </ul>
                </Dropdown>
            </div>

            <input id="btnLeft" type="text" placeholder="" className="form-input ltr:rounded-l-none rtl:rounded-r-none ltr:border-l-0 rtl:border-r-0" />
        </div>
    </div>
    <div className="dropdown">
        <label htmlFor="btnLeft">Right</label>
        <div className="flex">
            <input id="btnRight" type="text" placeholder="" className="form-input ltr:rounded-r-none rtl:rounded-l-none ltr:border-r-0 rtl:border-l-0" />
            <div className="dropdown">
                <Dropdown
                    offset={[0, 5]}
                    placement={\`\${isRtl ? 'bottom-end' : 'bottom-start'}\`}
                    btnClassName="bg-white dark:bg-[#1b2e4b] text-secondary flex justify-center items-center rounded-none px-3 font-semibold border border-secondary pt-2 pb-2"
                    button={
                        <svg> ... </svg>
                    }
                >
                    <ul className="!min-w-[170px]">
                        <li>
                            <button type="button">Action</button>
                        </li>
                        <li>
                            <button type="button">Another action</button>
                        </li>
                        <li>
                            <button type="button">Something else here</button>
                        </li>
                        <li>
                            <button type="button">Separated link</button>
                        </li>
                    </ul>
                </Dropdown>
            </div>
            <button
                type="button"
                className="bg-secondary text-white flex justify-center items-center ltr:rounded-r-md rtl:rounded-l-md px-3 font-semibold border ltr:border-l-0 rtl:border-r-0 border-secondary cursor-pointer"
            >
                Action
            </button>
        </div>
    </div>
</form>`}</pre>
                            </CodeHighlight>
                        )}
                    </div>
                    <div className="panel lg:col-span-2">
                        <div className="mb-5 flex items-center justify-between">
                            <h5 className="text-lg font-semibold dark:text-white-light">Button addons</h5>
                            <button type="button" className="font-semibold hover:text-gray-400 dark:text-gray-400 dark:hover:text-gray-600" onClick={() => toggleCode('code13')}>
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
                            <form>
                                <div className="mb-5">
                                    <label htmlFor="addonsLeft">Left</label>
                                    <div className="flex">
                                        <button type="button" className="btn btn-info ltr:rounded-r-none rtl:rounded-l-none">
                                            Button
                                        </button>
                                        <input id="addonsLeft" type="text" placeholder="" className="form-input ltr:rounded-l-none rtl:rounded-r-none" />
                                    </div>
                                </div>
                                <div className="mb-5">
                                    <label htmlFor="addonsRight">Right</label>
                                    <div className="flex">
                                        <input id="addonsRight" type="text" placeholder="" className="form-input ltr:rounded-r-none rtl:rounded-l-none" />
                                        <button type="button" className="btn btn-secondary ltr:rounded-l-none rtl:rounded-r-none">
                                            Button
                                        </button>
                                    </div>
                                </div>
                                <div className="mb-5">
                                    <label htmlFor="addonsLeftoutline">Left</label>
                                    <div className="flex">
                                        <button type="button" className="btn btn-outline-info ltr:rounded-r-none rtl:rounded-l-none">
                                            Button
                                        </button>
                                        <button type="button" className="btn btn-outline-info rounded-none ltr:border-l-0 rtl:border-r-0">
                                            Button
                                        </button>
                                        <input id="addonsLeftoutline" type="text" placeholder="" className="form-input ltr:rounded-l-none rtl:rounded-r-none" />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="addonsRightoutline">Right</label>
                                    <div className="flex">
                                        <input id="addonsRightoutline" type="text" placeholder="" className="form-input ltr:rounded-r-none rtl:rounded-l-none" />
                                        <button type="button" className="btn btn-outline-secondary rounded-none ltr:border-r-0 rtl:border-l-0">
                                            Button
                                        </button>
                                        <button type="button" className="btn btn-outline-secondary ltr:rounded-l-none rtl:rounded-r-none">
                                            Button
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                        {codeArr.includes('code13') && (
                            <CodeHighlight>
                                <pre className="language-xml">{`<form>
    <div className="mb-5">
        <label htmlFor="addonsLeft">Left</label>
        <div className="flex">
            <button type="button" className="btn btn-info ltr:rounded-r-none rtl:rounded-l-none">
                Button
            </button>
            <input id="addonsLeft" type="text" placeholder="" className="form-input ltr:rounded-l-none rtl:rounded-r-none" />
        </div>
    </div>
    <div className="mb-5">
        <label htmlFor="addonsRight">Right</label>
        <div className="flex">
            <input id="addonsRight" type="text" placeholder="" className="form-input ltr:rounded-r-none rtl:rounded-l-none" />
            <button type="button" className="btn btn-secondary ltr:rounded-l-none rtl:rounded-r-none">
                Button
            </button>
        </div>
    </div>
    <div className="mb-5">
        <label htmlFor="addonsLeftoutline">Left</label>
        <div className="flex">
            <button type="button" className="btn btn-outline-info ltr:rounded-r-none rtl:rounded-l-none">
                Button
            </button>
            <button type="button" className="btn btn-outline-info rounded-none ltr:border-l-0 rtl:border-r-0">
                Button
            </button>
            <input id="addonsLeftoutline" type="text" placeholder="" className="form-input ltr:rounded-l-none rtl:rounded-r-none" />
        </div>
    </div>
    <div>
        <label htmlFor="addonsRightoutline">Right</label>
        <div className="flex">
            <input id="addonsRightoutline" type="text" placeholder="" className="form-input ltr:rounded-r-none rtl:rounded-l-none" />
            <button type="button" className="btn btn-outline-secondary rounded-none ltr:border-r-0 rtl:border-l-0">
                Button
            </button>
            <button type="button" className="btn btn-outline-secondary ltr:rounded-l-none rtl:rounded-r-none">
                Button
            </button>
        </div>
    </div>
</form>`}</pre>
                            </CodeHighlight>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InputGroup;
