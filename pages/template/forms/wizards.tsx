import Link from 'next/link';
import { useEffect, useState } from 'react';
import CodeHighlight from '../../components/Highlight';
import { setPageTitle } from '../../store/slices/themeConfigSlice';
import { useDispatch } from 'react-redux';

const Wizards = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Wizards'));
    });
    const [codeArr, setCodeArr] = useState<string[]>([]);

    const toggleCode = (name: string) => {
        if (codeArr.includes(name)) {
            setCodeArr((value) => value.filter((d) => d !== name));
        } else {
            setCodeArr([...codeArr, name]);
        }
    };

    const [activeTab, setActiveTab] = useState<any>(1);
    const [activeTab1, setActiveTab1] = useState<any>(1);
    const [activeTab2, setActiveTab2] = useState<any>(1);
    const [activeTab3, setActiveTab3] = useState<any>(1);
    const [activeTab4, setActiveTab4] = useState<any>(1);
    const [activeTab5, setActiveTab5] = useState<any>(1);
    const [activeTab6, setActiveTab6] = useState<any>(1);

    return (
        <div>
            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li>
                    <Link href="#" className="text-primary hover:underline">
                        Forms
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>Wizards</span>
                </li>
            </ul>
            <div className="space-y-8 pt-5">
                {/*  Basic */}
                <h4 className="badge mb-0 inline-block bg-primary text-base hover:top-0">Pills</h4>
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <div className="panel">
                        <div className="mb-5 flex items-center justify-between">
                            <h5 className="text-lg font-semibold dark:text-white-light">Text Only</h5>
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
                            <div className="inline-block w-full">
                                <ul className="mb-5 grid grid-cols-3 text-center">
                                    <li>
                                        <div
                                            className={`${activeTab === 1 ? '!bg-primary text-white' : ''}
                                            block rounded-full bg-[#f3f2ee] p-2.5 dark:bg-[#1b2e4b]`}
                                            onClick={() => setActiveTab(1)}
                                        >
                                            1 Home
                                        </div>
                                    </li>

                                    <li>
                                        <div className={`${activeTab === 2 ? '!bg-primary text-white' : ''} block rounded-full bg-[#f3f2ee] p-2.5 dark:bg-[#1b2e4b]`} onClick={() => setActiveTab(2)}>
                                            2 About
                                        </div>
                                    </li>

                                    <li>
                                        <div className={`${activeTab === 3 ? '!bg-primary text-white' : ''} block rounded-full bg-[#f3f2ee] p-2.5 dark:bg-[#1b2e4b]`} onClick={() => setActiveTab(3)}>
                                            3 Success
                                        </div>
                                    </li>
                                </ul>

                                <div>
                                    <p className="mb-5">{activeTab === 1 && 'Try the keyboard navigation by clicking arrow left or right!'}</p>
                                    <p className="mb-5">{activeTab === 2 && 'The next and previous buttons help you to navigate through your content.'}</p>
                                    <p className="mb-5">{activeTab === 3 && 'Wonderful transition effects.'}</p>
                                </div>
                                <div className="flex justify-between">
                                    <button type="button" className={`btn btn-primary ${activeTab === 1 ? 'hidden' : ''}`} onClick={() => setActiveTab(activeTab === 3 ? 2 : 1)}>
                                        Back
                                    </button>
                                    <button type="button" className="btn btn-primary ltr:ml-auto rtl:mr-auto" onClick={() => setActiveTab(activeTab === 1 ? 2 : 3)}>
                                        {activeTab === 3 ? 'Finish' : 'Next'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {codeArr.includes('code1') && (
                            <CodeHighlight>
                                <pre className="language-typescript">{`import { useState } from 'react';

const [activeTab, setActiveTab] = useState<any>(1);

<div className="inline-block w-full">
    <ul className="mb-5 grid grid-cols-3 text-center">
        <li>
            <div
                className={\`\${activeTab === 1 ? '!bg-primary text-white' : ''}
                block rounded-full bg-[#f3f2ee] p-2.5 dark:bg-[#1b2e4b]\`}
                onClick={() => setActiveTab(1)}
            >
                1 Home
            </div>
        </li>

        <li>
            <div className={\`\${activeTab === 2 ? '!bg-primary text-white' : ''} block rounded-full bg-[#f3f2ee] p-2.5 dark:bg-[#1b2e4b]\`} onClick={() => setActiveTab(2)}>
                2 About
            </div>
        </li>

        <li>
            <div className={\`\${activeTab === 3 ? '!bg-primary text-white' : ''} block rounded-full bg-[#f3f2ee] p-2.5 dark:bg-[#1b2e4b]\`} onClick={() => setActiveTab(3)}>
                3 Success
            </div>
        </li>
    </ul>

    <div>
        <p className="mb-5">{activeTab === 1 && 'Try the keyboard navigation by clicking arrow left or right!'}</p>
        <p className="mb-5">{activeTab === 2 && 'The next and previous buttons help you to navigate through your content.'}</p>
        <p className="mb-5">{activeTab === 3 && 'Wonderful transition effects.'}</p>
    </div>
    <div className="flex justify-between">
        <button type="button" className={\`btn btn-primary \${activeTab === 1 ? 'hidden' : ''}\`} onClick={() => setActiveTab(activeTab === 3 ? 2 : 1)}>
            Back
        </button>
        <button type="button" className="btn btn-primary ltr:ml-auto rtl:mr-auto" onClick={() => setActiveTab(activeTab === 1 ? 2 : 3)}>
            {activeTab === 3 ? 'Finish' : 'Next'}
        </button>
    </div>
</div>`}</pre>
                            </CodeHighlight>
                        )}
                    </div>

                    {/* icon only */}
                    <div className="panel">
                        <div className="mb-5 flex items-center justify-between">
                            <h5 className="text-lg font-semibold dark:text-white-light">Icon Only</h5>
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
                            <div className="inline-block w-full">
                                <ul className="mb-5 grid grid-cols-3">
                                    <li>
                                        <div
                                            className={`${activeTab1 === 1 ? '!bg-primary text-white' : ''}
                                            flex items-center justify-center rounded-full bg-[#f3f2ee] p-2.5 dark:bg-[#1b2e4b]`}
                                            onClick={() => setActiveTab1(1)}
                                        >
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
                                                <path
                                                    opacity="0.5"
                                                    d="M2 12.2039C2 9.91549 2 8.77128 2.5192 7.82274C3.0384 6.87421 3.98695 6.28551 5.88403 5.10813L7.88403 3.86687C9.88939 2.62229 10.8921 2 12 2C13.1079 2 14.1106 2.62229 16.116 3.86687L18.116 5.10812C20.0131 6.28551 20.9616 6.87421 21.4808 7.82274C22 8.77128 22 9.91549 22 12.2039V13.725C22 17.6258 22 19.5763 20.8284 20.7881C19.6569 22 17.7712 22 14 22H10C6.22876 22 4.34315 22 3.17157 20.7881C2 19.5763 2 17.6258 2 13.725V12.2039Z"
                                                    stroke="currentColor"
                                                    strokeWidth="1.5"
                                                />
                                                <path d="M12 15L12 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                            </svg>
                                        </div>
                                    </li>
                                    <li>
                                        <div
                                            className={`${activeTab1 === 2 ? '!bg-primary text-white' : ''}
                                            flex items-center justify-center rounded-full bg-[#f3f2ee] p-2.5 dark:bg-[#1b2e4b]`}
                                            onClick={() => setActiveTab1(2)}
                                        >
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <circle cx="12" cy="6" r="4" stroke="currentColor" strokeWidth="1.5" />
                                                <ellipse opacity="0.5" cx="12" cy="17" rx="7" ry="4" stroke="currentColor" strokeWidth="1.5" />
                                            </svg>
                                        </div>
                                    </li>
                                    <li>
                                        <div
                                            className={`${activeTab1 === 3 ? '!bg-primary text-white' : ''}
                                            flex items-center justify-center rounded-full bg-[#f3f2ee] p-2.5 dark:bg-[#1b2e4b]`}
                                            onClick={() => setActiveTab1(3)}
                                        >
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M20.9751 12.1852L20.2361 12.0574L20.9751 12.1852ZM20.2696 16.265L19.5306 16.1371L20.2696 16.265ZM6.93776 20.4771L6.19055 20.5417H6.19055L6.93776 20.4771ZM6.1256 11.0844L6.87281 11.0198L6.1256 11.0844ZM13.9949 5.22142L14.7351 5.34269V5.34269L13.9949 5.22142ZM13.3323 9.26598L14.0724 9.38725V9.38725L13.3323 9.26598ZM6.69813 9.67749L6.20854 9.10933H6.20854L6.69813 9.67749ZM8.13687 8.43769L8.62646 9.00585H8.62646L8.13687 8.43769ZM10.518 4.78374L9.79207 4.59542L10.518 4.78374ZM10.9938 2.94989L11.7197 3.13821L11.7197 3.13821L10.9938 2.94989ZM12.6676 2.06435L12.4382 2.77841L12.4382 2.77841L12.6676 2.06435ZM12.8126 2.11093L13.0419 1.39687L13.0419 1.39687L12.8126 2.11093ZM9.86194 6.46262L10.5235 6.81599V6.81599L9.86194 6.46262ZM13.9047 3.24752L13.1787 3.43584V3.43584L13.9047 3.24752ZM11.6742 2.13239L11.3486 1.45675L11.3486 1.45675L11.6742 2.13239ZM20.2361 12.0574L19.5306 16.1371L21.0086 16.3928L21.7142 12.313L20.2361 12.0574ZM13.245 21.25H8.59634V22.75H13.245V21.25ZM7.68497 20.4125L6.87281 11.0198L5.37839 11.149L6.19055 20.5417L7.68497 20.4125ZM19.5306 16.1371C19.0238 19.0677 16.3813 21.25 13.245 21.25V22.75C17.0712 22.75 20.3708 20.081 21.0086 16.3928L19.5306 16.1371ZM13.2548 5.10015L12.5921 9.14472L14.0724 9.38725L14.7351 5.34269L13.2548 5.10015ZM7.18772 10.2456L8.62646 9.00585L7.64728 7.86954L6.20854 9.10933L7.18772 10.2456ZM11.244 4.97206L11.7197 3.13821L10.2678 2.76157L9.79207 4.59542L11.244 4.97206ZM12.4382 2.77841L12.5832 2.82498L13.0419 1.39687L12.897 1.3503L12.4382 2.77841ZM10.5235 6.81599C10.8354 6.23198 11.0777 5.61339 11.244 4.97206L9.79207 4.59542C9.65572 5.12107 9.45698 5.62893 9.20041 6.10924L10.5235 6.81599ZM12.5832 2.82498C12.8896 2.92342 13.1072 3.16009 13.1787 3.43584L14.6306 3.05921C14.4252 2.26719 13.819 1.64648 13.0419 1.39687L12.5832 2.82498ZM11.7197 3.13821C11.7547 3.0032 11.8522 2.87913 11.9998 2.80804L11.3486 1.45675C10.8166 1.71309 10.417 2.18627 10.2678 2.76157L11.7197 3.13821ZM11.9998 2.80804C12.1345 2.74311 12.2931 2.73181 12.4382 2.77841L12.897 1.3503C12.3872 1.18655 11.8312 1.2242 11.3486 1.45675L11.9998 2.80804ZM14.1537 10.9842H19.3348V9.4842H14.1537V10.9842ZM14.7351 5.34269C14.8596 4.58256 14.824 3.80477 14.6306 3.0592L13.1787 3.43584C13.3197 3.97923 13.3456 4.54613 13.2548 5.10016L14.7351 5.34269ZM8.59634 21.25C8.12243 21.25 7.726 20.887 7.68497 20.4125L6.19055 20.5417C6.29851 21.7902 7.34269 22.75 8.59634 22.75V21.25ZM8.62646 9.00585C9.30632 8.42 10.0391 7.72267 10.5235 6.81599L9.20041 6.10924C8.85403 6.75767 8.30249 7.30493 7.64728 7.86954L8.62646 9.00585ZM21.7142 12.313C21.9695 10.8365 20.8341 9.4842 19.3348 9.4842V10.9842C19.9014 10.9842 20.3332 11.4959 20.2361 12.0574L21.7142 12.313ZM12.5921 9.14471C12.4344 10.1076 13.1766 10.9842 14.1537 10.9842V9.4842C14.1038 9.4842 14.0639 9.43901 14.0724 9.38725L12.5921 9.14471ZM6.87281 11.0198C6.84739 10.7258 6.96474 10.4378 7.18772 10.2456L6.20854 9.10933C5.62021 9.61631 5.31148 10.3753 5.37839 11.149L6.87281 11.0198Z"
                                                    fill="currentColor"
                                                />
                                                <path
                                                    opacity="0.5"
                                                    d="M3.9716 21.4709L3.22439 21.5355L3.9716 21.4709ZM3 10.2344L3.74721 10.1698C3.71261 9.76962 3.36893 9.46776 2.96767 9.48507C2.5664 9.50239 2.25 9.83274 2.25 10.2344L3 10.2344ZM4.71881 21.4063L3.74721 10.1698L2.25279 10.299L3.22439 21.5355L4.71881 21.4063ZM3.75 21.5129V10.2344H2.25V21.5129H3.75ZM3.22439 21.5355C3.2112 21.383 3.33146 21.2502 3.48671 21.2502V22.7502C4.21268 22.7502 4.78122 22.1281 4.71881 21.4063L3.22439 21.5355ZM3.48671 21.2502C3.63292 21.2502 3.75 21.3686 3.75 21.5129H2.25C2.25 22.1954 2.80289 22.7502 3.48671 22.7502V21.2502Z"
                                                    fill="currentColor"
                                                />
                                            </svg>
                                        </div>
                                    </li>
                                </ul>
                                <div>
                                    <p className="mb-5">{activeTab1 === 1 && 'Try the keyboard navigation by clicking arrow left or right!'}</p>

                                    <p className="mb-5">{activeTab1 === 2 && 'The next and previous buttons help you to navigate through your content.'}</p>

                                    <p className="mb-5">{activeTab1 === 3 && 'Wonderful transition effects.'}</p>
                                </div>
                                <div className="flex justify-between">
                                    <button type="button" className={`btn btn-primary ${activeTab1 === 1 ? 'hidden' : ''}`} onClick={() => setActiveTab1(activeTab1 === 3 ? 2 : 1)}>
                                        Back
                                    </button>
                                    <button type="button" className="btn btn-primary ltr:ml-auto rtl:mr-auto" onClick={() => setActiveTab1(activeTab1 === 1 ? 2 : 3)}>
                                        {activeTab1 === 3 ? 'Finish' : 'Next'}
                                    </button>
                                </div>
                            </div>
                        </div>
                        {codeArr.includes('code2') && (
                            <CodeHighlight>
                                <pre className="language-typescript">{`import { useState } from 'react';

const [activeTab1, setActiveTab1] = useState<any>(1);

<div className="inline-block w-full">
    <ul className="mb-5 grid grid-cols-3">
        <li>
            <div
                className={\`\${activeTab1 === 1 ? '!bg-primary text-white' : ''}
                flex items-center justify-center rounded-full bg-[#f3f2ee] p-2.5 dark:bg-[#1b2e4b]\`}
                onClick={() => setActiveTab1(1)}
            >
                <svg>...</svg>
            </div>
        </li>
        <li>
            <div
                className={\`\${activeTab1 === 2 ? '!bg-primary text-white' : ''}
                flex items-center justify-center rounded-full bg-[#f3f2ee] p-2.5 dark:bg-[#1b2e4b]\`}
                onClick={() => setActiveTab1(2)}
            >
                <svg>...</svg>
            </div>
        </li>
        <li>
            <div
                className={\`\${activeTab1 === 3 ? '!bg-primary text-white' : ''}
                flex items-center justify-center rounded-full bg-[#f3f2ee] p-2.5 dark:bg-[#1b2e4b]\`}
                onClick={() => setActiveTab1(3)}
            >
                <svg>...</svg>
            </div>
        </li>
    </ul>
    <div>
        <p className="mb-5">{activeTab1 === 1 && 'Try the keyboard navigation by clicking arrow left or right!'}</p>

        <p className="mb-5">{activeTab1 === 2 && 'The next and previous buttons help you to navigate through your content.'}</p>

        <p className="mb-5">{activeTab1 === 3 && 'Wonderful transition effects.'}</p>
    </div>
    <div className="flex justify-between">
        <button type="button" className={\`btn btn-primary \${activeTab1 === 1 ? 'hidden' : ''}\`} onClick={() => setActiveTab1(activeTab1 === 3 ? 2 : 1)}>
            Back
        </button>
        <button type="button" className="btn btn-primary ltr:ml-auto rtl:mr-auto" onClick={() => setActiveTab1(activeTab1 === 1 ? 2 : 3)}>
            {activeTab1 === 3 ? 'Finish' : 'Next'}
        </button>
    </div>
</div>`}</pre>
                            </CodeHighlight>
                        )}
                    </div>

                    {/* Text & Icon */}
                    <div className="panel lg:col-span-2">
                        <div className="mb-5 flex items-center justify-between">
                            <h5 className="text-lg font-semibold dark:text-white-light">Text & Icon</h5>
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
                            <div className="inline-block w-full">
                                <ul className="mb-5 grid grid-cols-3">
                                    <li>
                                        <div
                                            className={`${activeTab2 === 1 ? '!bg-primary text-white ' : ''}flex items-center justify-center rounded-full bg-[#f3f2ee] p-2.5 dark:bg-[#1b2e4b] `}
                                            onClick={() => setActiveTab2(1)}
                                        >
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
                                                <path
                                                    opacity="0.5"
                                                    d="M2 12.2039C2 9.91549 2 8.77128 2.5192 7.82274C3.0384 6.87421 3.98695 6.28551 5.88403 5.10813L7.88403 3.86687C9.88939 2.62229 10.8921 2 12 2C13.1079 2 14.1106 2.62229 16.116 3.86687L18.116 5.10812C20.0131 6.28551 20.9616 6.87421 21.4808 7.82274C22 8.77128 22 9.91549 22 12.2039V13.725C22 17.6258 22 19.5763 20.8284 20.7881C19.6569 22 17.7712 22 14 22H10C6.22876 22 4.34315 22 3.17157 20.7881C2 19.5763 2 17.6258 2 13.725V12.2039Z"
                                                    stroke="currentColor"
                                                    strokeWidth="1.5"
                                                />
                                                <path d="M12 15L12 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                            </svg>
                                        </div>
                                        <span className="mt-2 block text-center">Home</span>
                                    </li>
                                    <li>
                                        <div
                                            className={`${activeTab2 === 2 ? '!bg-primary text-white ' : ''}flex items-center justify-center rounded-full bg-[#f3f2ee] p-2.5 dark:bg-[#1b2e4b] `}
                                            onClick={() => setActiveTab2(2)}
                                        >
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <circle cx="12" cy="6" r="4" stroke="currentColor" strokeWidth="1.5" />
                                                <ellipse opacity="0.5" cx="12" cy="17" rx="7" ry="4" stroke="currentColor" strokeWidth="1.5" />
                                            </svg>
                                        </div>
                                        <span className="mt-2 block text-center">About</span>
                                    </li>
                                    <li>
                                        <div
                                            className={`${activeTab2 === 3 ? '!bg-primary text-white ' : ''} flex items-center justify-center rounded-full bg-[#f3f2ee] p-2.5 dark:bg-[#1b2e4b] `}
                                            onClick={() => setActiveTab2(3)}
                                        >
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M20.9751 12.1852L20.2361 12.0574L20.9751 12.1852ZM20.2696 16.265L19.5306 16.1371L20.2696 16.265ZM6.93776 20.4771L6.19055 20.5417H6.19055L6.93776 20.4771ZM6.1256 11.0844L6.87281 11.0198L6.1256 11.0844ZM13.9949 5.22142L14.7351 5.34269V5.34269L13.9949 5.22142ZM13.3323 9.26598L14.0724 9.38725V9.38725L13.3323 9.26598ZM6.69813 9.67749L6.20854 9.10933H6.20854L6.69813 9.67749ZM8.13687 8.43769L8.62646 9.00585H8.62646L8.13687 8.43769ZM10.518 4.78374L9.79207 4.59542L10.518 4.78374ZM10.9938 2.94989L11.7197 3.13821L11.7197 3.13821L10.9938 2.94989ZM12.6676 2.06435L12.4382 2.77841L12.4382 2.77841L12.6676 2.06435ZM12.8126 2.11093L13.0419 1.39687L13.0419 1.39687L12.8126 2.11093ZM9.86194 6.46262L10.5235 6.81599V6.81599L9.86194 6.46262ZM13.9047 3.24752L13.1787 3.43584V3.43584L13.9047 3.24752ZM11.6742 2.13239L11.3486 1.45675L11.3486 1.45675L11.6742 2.13239ZM20.2361 12.0574L19.5306 16.1371L21.0086 16.3928L21.7142 12.313L20.2361 12.0574ZM13.245 21.25H8.59634V22.75H13.245V21.25ZM7.68497 20.4125L6.87281 11.0198L5.37839 11.149L6.19055 20.5417L7.68497 20.4125ZM19.5306 16.1371C19.0238 19.0677 16.3813 21.25 13.245 21.25V22.75C17.0712 22.75 20.3708 20.081 21.0086 16.3928L19.5306 16.1371ZM13.2548 5.10015L12.5921 9.14472L14.0724 9.38725L14.7351 5.34269L13.2548 5.10015ZM7.18772 10.2456L8.62646 9.00585L7.64728 7.86954L6.20854 9.10933L7.18772 10.2456ZM11.244 4.97206L11.7197 3.13821L10.2678 2.76157L9.79207 4.59542L11.244 4.97206ZM12.4382 2.77841L12.5832 2.82498L13.0419 1.39687L12.897 1.3503L12.4382 2.77841ZM10.5235 6.81599C10.8354 6.23198 11.0777 5.61339 11.244 4.97206L9.79207 4.59542C9.65572 5.12107 9.45698 5.62893 9.20041 6.10924L10.5235 6.81599ZM12.5832 2.82498C12.8896 2.92342 13.1072 3.16009 13.1787 3.43584L14.6306 3.05921C14.4252 2.26719 13.819 1.64648 13.0419 1.39687L12.5832 2.82498ZM11.7197 3.13821C11.7547 3.0032 11.8522 2.87913 11.9998 2.80804L11.3486 1.45675C10.8166 1.71309 10.417 2.18627 10.2678 2.76157L11.7197 3.13821ZM11.9998 2.80804C12.1345 2.74311 12.2931 2.73181 12.4382 2.77841L12.897 1.3503C12.3872 1.18655 11.8312 1.2242 11.3486 1.45675L11.9998 2.80804ZM14.1537 10.9842H19.3348V9.4842H14.1537V10.9842ZM14.7351 5.34269C14.8596 4.58256 14.824 3.80477 14.6306 3.0592L13.1787 3.43584C13.3197 3.97923 13.3456 4.54613 13.2548 5.10016L14.7351 5.34269ZM8.59634 21.25C8.12243 21.25 7.726 20.887 7.68497 20.4125L6.19055 20.5417C6.29851 21.7902 7.34269 22.75 8.59634 22.75V21.25ZM8.62646 9.00585C9.30632 8.42 10.0391 7.72267 10.5235 6.81599L9.20041 6.10924C8.85403 6.75767 8.30249 7.30493 7.64728 7.86954L8.62646 9.00585ZM21.7142 12.313C21.9695 10.8365 20.8341 9.4842 19.3348 9.4842V10.9842C19.9014 10.9842 20.3332 11.4959 20.2361 12.0574L21.7142 12.313ZM12.5921 9.14471C12.4344 10.1076 13.1766 10.9842 14.1537 10.9842V9.4842C14.1038 9.4842 14.0639 9.43901 14.0724 9.38725L12.5921 9.14471ZM6.87281 11.0198C6.84739 10.7258 6.96474 10.4378 7.18772 10.2456L6.20854 9.10933C5.62021 9.61631 5.31148 10.3753 5.37839 11.149L6.87281 11.0198Z"
                                                    fill="currentColor"
                                                />
                                                <path
                                                    opacity="0.5"
                                                    d="M3.9716 21.4709L3.22439 21.5355L3.9716 21.4709ZM3 10.2344L3.74721 10.1698C3.71261 9.76962 3.36893 9.46776 2.96767 9.48507C2.5664 9.50239 2.25 9.83274 2.25 10.2344L3 10.2344ZM4.71881 21.4063L3.74721 10.1698L2.25279 10.299L3.22439 21.5355L4.71881 21.4063ZM3.75 21.5129V10.2344H2.25V21.5129H3.75ZM3.22439 21.5355C3.2112 21.383 3.33146 21.2502 3.48671 21.2502V22.7502C4.21268 22.7502 4.78122 22.1281 4.71881 21.4063L3.22439 21.5355ZM3.48671 21.2502C3.63292 21.2502 3.75 21.3686 3.75 21.5129H2.25C2.25 22.1954 2.80289 22.7502 3.48671 22.7502V21.2502Z"
                                                    fill="currentColor"
                                                />
                                            </svg>
                                        </div>
                                        <span className={`mt-2 block text-center ${activeTab2 === 3 ? 'text-primary ' : ''}`}>Success</span>
                                    </li>
                                </ul>
                                <div>
                                    <p className="mb-5">{activeTab2 === 1 && ' Try the keyboard navigation by clicking arrow left or right!'}</p>

                                    <p className="mb-5">{activeTab2 === 2 && 'The next and previous buttons help you to navigate through your content.'}</p>

                                    <p className="mb-5">{activeTab2 === 3 && 'Wonderful transition effects.'}</p>
                                </div>
                                <div className="flex justify-between">
                                    <button type="button" className={`btn btn-primary ${activeTab2 === 1 ? 'hidden' : ''}`} onClick={() => setActiveTab2(activeTab2 === 3 ? 2 : 1)}>
                                        Back
                                    </button>
                                    <button type="button" className="btn btn-primary ltr:ml-auto rtl:mr-auto" onClick={() => setActiveTab2(activeTab2 === 1 ? 2 : 3)}>
                                        {activeTab2 === 3 ? 'Finish' : 'Next'}
                                    </button>
                                </div>
                            </div>
                        </div>
                        {codeArr.includes('code3') && (
                            <CodeHighlight>
                                <pre className="language-typescript">{`import { useState } from 'react';

const [activeTab2, setActiveTab2] = useState<any>(1);

<div className="inline-block w-full">
    <ul className="mb-5 grid grid-cols-3">
        <li>
            <div
                className={\`\${activeTab2 === 1 ? '!bg-primary text-white' : ''}
                flex items-center justify-center rounded-full bg-[#f3f2ee] p-2.5 dark:bg-[#1b2e4b]\`}
                onClick={() => setActiveTab2(1)}
            >
            >...</svg>
            </div>
            <span className="text-center block mt-2">Home</span>
        </li>
        <li>
            <div
                className={\`\${activeTab2 === 2 ? '!bg-primary text-white' : ''}
                flex items-center justify-center rounded-full bg-[#f3f2ee] p-2.5 dark:bg-[#1b2e4b]\`}
                onClick={() => setActiveTab2(2)}
            >
                <svg>...</svg>
            </div>
            <span className="text-center block mt-2">About</span>
        </li>
        <li>
            <div
                className={\`\${activeTab2 === 3 ? '!bg-primary text-white' : ''}
                flex items-center justify-center rounded-full bg-[#f3f2ee] p-2.5 dark:bg-[#1b2e4b]\`}
                onClick={() => setActiveTab2(3)}
            >
                <svg>...</svg>
            </div>
            <span className={\`text-center block mt-2 \${activeTab2 === 3 ? 'text-primary ' : ''}\`}>Success</span>
        </li>
    </ul>
    <div>
        <p className="mb-5">{activeTab2 === 1 && ' Try the keyboard navigation by clicking arrow left or right!'}</p>

        <p className="mb-5">{activeTab2 === 2 && 'The next and previous buttons help you to navigate through your content.'}</p>

        <p className="mb-5">{activeTab2 === 3 && 'Wonderful transition effects.'}</p>
    </div>
    <div className="flex justify-between">
        <button type="button" className={\`btn btn-primary \${activeTab2 === 1 ? 'hidden' : ''}\`} onClick={() => setActiveTab2(activeTab2 === 3 ? 2 : 1)}>
            Back
        </button>
        <button type="button" className="btn btn-primary ltr:ml-auto rtl:mr-auto" onClick={() => setActiveTab2(activeTab2 === 1 ? 2 : 3)}>
            {activeTab2 === 3 ? 'Finish' : 'Next'}
        </button>
    </div>
</div>`}</pre>
                            </CodeHighlight>
                        )}
                    </div>
                </div>

                {/* Circle */}
                <h4 className="badge mb-0 inline-block bg-primary text-base hover:top-0">Circle</h4>
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* icon only */}
                    <div className="panel">
                        <div className="mb-5 flex items-center justify-between">
                            <h5 className="text-lg font-semibold dark:text-white-light">Icon Only</h5>
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
                            <div className="inline-block w-full">
                                <div className="relative z-[1]">
                                    <div
                                        className={`${activeTab3 === 1 ? 'w-[15%]' : activeTab3 === 2 ? 'w-[48%]' : activeTab3 === 3 ? 'w-[81%]' : ''}
                                            absolute top-[30px] -z-[1] m-auto h-1 w-[15%] bg-primary transition-[width] ltr:left-0 rtl:right-0`}
                                    ></div>
                                    <ul className="mb-5 grid grid-cols-3">
                                        <li className="mx-auto">
                                            <button
                                                type="button"
                                                className={`${activeTab3 === 1 ? '!border-primary !bg-primary text-white' : ''}
                                            flex h-16 w-16 items-center justify-center rounded-full border-[3px] border-[#f3f2ee] bg-white dark:border-[#1b2e4b] dark:bg-[#253b5c]`}
                                                onClick={() => setActiveTab3(1)}
                                            >
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
                                                    <path
                                                        opacity="0.5"
                                                        d="M2 12.2039C2 9.91549 2 8.77128 2.5192 7.82274C3.0384 6.87421 3.98695 6.28551 5.88403 5.10813L7.88403 3.86687C9.88939 2.62229 10.8921 2 12 2C13.1079 2 14.1106 2.62229 16.116 3.86687L18.116 5.10812C20.0131 6.28551 20.9616 6.87421 21.4808 7.82274C22 8.77128 22 9.91549 22 12.2039V13.725C22 17.6258 22 19.5763 20.8284 20.7881C19.6569 22 17.7712 22 14 22H10C6.22876 22 4.34315 22 3.17157 20.7881C2 19.5763 2 17.6258 2 13.725V12.2039Z"
                                                        stroke="currentColor"
                                                        strokeWidth="1.5"
                                                    />
                                                    <path d="M12 15L12 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                </svg>
                                            </button>
                                        </li>
                                        <li className="mx-auto">
                                            <button
                                                type="button"
                                                className={`${activeTab3 === 2 ? '!border-primary !bg-primary text-white' : ''}
                                            flex h-16 w-16 items-center justify-center rounded-full border-[3px] border-[#f3f2ee] bg-white dark:border-[#1b2e4b] dark:bg-[#253b5c]`}
                                                onClick={() => setActiveTab3(2)}
                                            >
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <circle cx="12" cy="6" r="4" stroke="currentColor" strokeWidth="1.5" />
                                                    <ellipse opacity="0.5" cx="12" cy="17" rx="7" ry="4" stroke="currentColor" strokeWidth="1.5" />
                                                </svg>
                                            </button>
                                        </li>
                                        <li className="mx-auto">
                                            <button
                                                type="button"
                                                className={`${activeTab3 === 3 ? '!border-primary !bg-primary text-white' : ''}
                                            flex h-16 w-16 items-center justify-center rounded-full border-[3px] border-[#f3f2ee] bg-white dark:border-[#1b2e4b] dark:bg-[#253b5c]`}
                                                onClick={() => setActiveTab3(3)}
                                            >
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M20.9751 12.1852L20.2361 12.0574L20.9751 12.1852ZM20.2696 16.265L19.5306 16.1371L20.2696 16.265ZM6.93776 20.4771L6.19055 20.5417H6.19055L6.93776 20.4771ZM6.1256 11.0844L6.87281 11.0198L6.1256 11.0844ZM13.9949 5.22142L14.7351 5.34269V5.34269L13.9949 5.22142ZM13.3323 9.26598L14.0724 9.38725V9.38725L13.3323 9.26598ZM6.69813 9.67749L6.20854 9.10933H6.20854L6.69813 9.67749ZM8.13687 8.43769L8.62646 9.00585H8.62646L8.13687 8.43769ZM10.518 4.78374L9.79207 4.59542L10.518 4.78374ZM10.9938 2.94989L11.7197 3.13821L11.7197 3.13821L10.9938 2.94989ZM12.6676 2.06435L12.4382 2.77841L12.4382 2.77841L12.6676 2.06435ZM12.8126 2.11093L13.0419 1.39687L13.0419 1.39687L12.8126 2.11093ZM9.86194 6.46262L10.5235 6.81599V6.81599L9.86194 6.46262ZM13.9047 3.24752L13.1787 3.43584V3.43584L13.9047 3.24752ZM11.6742 2.13239L11.3486 1.45675L11.3486 1.45675L11.6742 2.13239ZM20.2361 12.0574L19.5306 16.1371L21.0086 16.3928L21.7142 12.313L20.2361 12.0574ZM13.245 21.25H8.59634V22.75H13.245V21.25ZM7.68497 20.4125L6.87281 11.0198L5.37839 11.149L6.19055 20.5417L7.68497 20.4125ZM19.5306 16.1371C19.0238 19.0677 16.3813 21.25 13.245 21.25V22.75C17.0712 22.75 20.3708 20.081 21.0086 16.3928L19.5306 16.1371ZM13.2548 5.10015L12.5921 9.14472L14.0724 9.38725L14.7351 5.34269L13.2548 5.10015ZM7.18772 10.2456L8.62646 9.00585L7.64728 7.86954L6.20854 9.10933L7.18772 10.2456ZM11.244 4.97206L11.7197 3.13821L10.2678 2.76157L9.79207 4.59542L11.244 4.97206ZM12.4382 2.77841L12.5832 2.82498L13.0419 1.39687L12.897 1.3503L12.4382 2.77841ZM10.5235 6.81599C10.8354 6.23198 11.0777 5.61339 11.244 4.97206L9.79207 4.59542C9.65572 5.12107 9.45698 5.62893 9.20041 6.10924L10.5235 6.81599ZM12.5832 2.82498C12.8896 2.92342 13.1072 3.16009 13.1787 3.43584L14.6306 3.05921C14.4252 2.26719 13.819 1.64648 13.0419 1.39687L12.5832 2.82498ZM11.7197 3.13821C11.7547 3.0032 11.8522 2.87913 11.9998 2.80804L11.3486 1.45675C10.8166 1.71309 10.417 2.18627 10.2678 2.76157L11.7197 3.13821ZM11.9998 2.80804C12.1345 2.74311 12.2931 2.73181 12.4382 2.77841L12.897 1.3503C12.3872 1.18655 11.8312 1.2242 11.3486 1.45675L11.9998 2.80804ZM14.1537 10.9842H19.3348V9.4842H14.1537V10.9842ZM14.7351 5.34269C14.8596 4.58256 14.824 3.80477 14.6306 3.0592L13.1787 3.43584C13.3197 3.97923 13.3456 4.54613 13.2548 5.10016L14.7351 5.34269ZM8.59634 21.25C8.12243 21.25 7.726 20.887 7.68497 20.4125L6.19055 20.5417C6.29851 21.7902 7.34269 22.75 8.59634 22.75V21.25ZM8.62646 9.00585C9.30632 8.42 10.0391 7.72267 10.5235 6.81599L9.20041 6.10924C8.85403 6.75767 8.30249 7.30493 7.64728 7.86954L8.62646 9.00585ZM21.7142 12.313C21.9695 10.8365 20.8341 9.4842 19.3348 9.4842V10.9842C19.9014 10.9842 20.3332 11.4959 20.2361 12.0574L21.7142 12.313ZM12.5921 9.14471C12.4344 10.1076 13.1766 10.9842 14.1537 10.9842V9.4842C14.1038 9.4842 14.0639 9.43901 14.0724 9.38725L12.5921 9.14471ZM6.87281 11.0198C6.84739 10.7258 6.96474 10.4378 7.18772 10.2456L6.20854 9.10933C5.62021 9.61631 5.31148 10.3753 5.37839 11.149L6.87281 11.0198Z"
                                                        fill="currentColor"
                                                    />
                                                    <path
                                                        opacity="0.5"
                                                        d="M3.9716 21.4709L3.22439 21.5355L3.9716 21.4709ZM3 10.2344L3.74721 10.1698C3.71261 9.76962 3.36893 9.46776 2.96767 9.48507C2.5664 9.50239 2.25 9.83274 2.25 10.2344L3 10.2344ZM4.71881 21.4063L3.74721 10.1698L2.25279 10.299L3.22439 21.5355L4.71881 21.4063ZM3.75 21.5129V10.2344H2.25V21.5129H3.75ZM3.22439 21.5355C3.2112 21.383 3.33146 21.2502 3.48671 21.2502V22.7502C4.21268 22.7502 4.78122 22.1281 4.71881 21.4063L3.22439 21.5355ZM3.48671 21.2502C3.63292 21.2502 3.75 21.3686 3.75 21.5129H2.25C2.25 22.1954 2.80289 22.7502 3.48671 22.7502V21.2502Z"
                                                        fill="currentColor"
                                                    />
                                                </svg>
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                                <div>
                                    <p className="mb-5">{activeTab3 === 1 && ' Try the keyboard navigation by clicking arrow left or right!'}</p>

                                    <p className="mb-5">{activeTab3 === 2 && 'The next and previous buttons help you to navigate through your content.'}</p>

                                    <p className="mb-5">{activeTab3 === 3 && 'Wonderful transition effects.'}</p>
                                </div>
                                <div className="flex justify-between">
                                    <button type="button" className={`btn btn-primary ${activeTab3 === 1 ? 'hidden' : ''}`} onClick={() => setActiveTab3(activeTab3 === 3 ? 2 : 1)}>
                                        Back
                                    </button>
                                    <button type="button" className="btn btn-primary ltr:ml-auto rtl:mr-auto" onClick={() => setActiveTab3(activeTab3 === 1 ? 2 : 3)}>
                                        {activeTab3 === 3 ? 'Finish' : 'Next'}
                                    </button>
                                </div>
                            </div>
                        </div>
                        {codeArr.includes('code4') && (
                            <CodeHighlight>
                                <pre className="language-typescript">{`import { useState } from 'react';

const [activeTab3, setActiveTab3] = useState<any>(1);

<div className="inline-block w-full">
    <div className="relative z-[1]">
        <div
            className={\`\${activeTab3 === 1 ? 'w-[15%]' : activeTab3 === 2 ? 'w-[48%]' : activeTab3 === 3 ? 'w-[81%]' : ''}
                bg-primary w-[15%] h-1 absolute ltr:left-0 rtl:right-0 top-[30px] m-auto -z-[1] transition-[width]\`}
        ></div>
        <ul className="mb-5 grid grid-cols-3">
            <li className="mx-auto">
                <button type="button"
                    className={\`\${activeTab3 === 1 ? '!border-primary !bg-primary text-white' : ''}
                bg-white dark:bg-[#253b5c] border-[3px] border-[#f3f2ee] dark:border-[#1b2e4b] flex justify-center items-center w-16 h-16 rounded-full\`}
                    onClick={() => setActiveTab3(1)}
                >
                    <svg>...</svg>
                </button>
            </li>
            <li className="mx-auto">
                <button type="button"
                    className={\`\${activeTab3 === 2 ? '!border-primary !bg-primary text-white' : ''}
                bg-white dark:bg-[#253b5c] border-[3px] border-[#f3f2ee] dark:border-[#1b2e4b] flex justify-center items-center w-16 h-16 rounded-full\`}
                    onClick={() => setActiveTab3(2)}
                >
                    <svg>...</svg>
                </button>
            </li>
            <li className="mx-auto">
                <button type="button"
                    className={\`\${activeTab3 === 3 ? '!border-primary !bg-primary text-white' : ''}
                bg-white dark:bg-[#253b5c] border-[3px] border-[#f3f2ee] dark:border-[#1b2e4b] flex justify-center items-center w-16 h-16 rounded-full\`}
                    onClick={() => setActiveTab3(3)}
                >
                    <svg>...</svg>
                </button>
            </li>
        </ul>
    </div>
    <div>
        <p className="mb-5">{activeTab3 === 1 && ' Try the keyboard navigation by clicking arrow left or right!'}</p>

        <p className="mb-5">{activeTab3 === 2 && 'The next and previous buttons help you to navigate through your content.'}</p>

        <p className="mb-5">{activeTab3 === 3 && 'Wonderful transition effects.'}</p>
    </div>
    <div className="flex justify-between">
        <button type="button" className={\`btn btn-primary \${activeTab3 === 1 ? 'hidden' : ''}\`} onClick={() => setActiveTab3(activeTab3 === 3 ? 2 : 1)}>
            Back
        </button>
        <button type="button" className="btn btn-primary ltr:ml-auto rtl:mr-auto" onClick={() => setActiveTab3(activeTab3 === 1 ? 2 : 3)}>
            {activeTab3 === 3 ? 'Finish' : 'Next'}
        </button>
    </div>
</div>`}</pre>
                            </CodeHighlight>
                        )}
                    </div>

                    {/* Text & Icon */}
                    <div className="panel">
                        <div className="mb-5 flex items-center justify-between">
                            <h5 className="text-lg font-semibold dark:text-white-light">Text & Icon</h5>
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
                            <div className="inline-block w-full">
                                <div className="relative z-[1]">
                                    <div
                                        className={`${activeTab4 === 1 ? 'w-[15%]' : activeTab4 === 2 ? 'w-[48%]' : activeTab4 === 3 ? 'w-[81%]' : ''}
                                        absolute top-[30px] -z-[1] m-auto h-1 w-[15%] bg-primary transition-[width] ltr:left-0 rtl:right-0`}
                                    ></div>
                                    <ul className="mb-5 grid grid-cols-3">
                                        <li className="mx-auto">
                                            <button
                                                type="button"
                                                className={`${activeTab4 === 1 ? '!border-primary !bg-primary text-white' : ''}
                                                flex h-16 w-16 items-center justify-center rounded-full border-[3px] border-[#f3f2ee] bg-white dark:border-[#1b2e4b] dark:bg-[#253b5c]`}
                                                onClick={() => setActiveTab4(1)}
                                            >
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
                                                    <path
                                                        opacity="0.5"
                                                        d="M2 12.2039C2 9.91549 2 8.77128 2.5192 7.82274C3.0384 6.87421 3.98695 6.28551 5.88403 5.10813L7.88403 3.86687C9.88939 2.62229 10.8921 2 12 2C13.1079 2 14.1106 2.62229 16.116 3.86687L18.116 5.10812C20.0131 6.28551 20.9616 6.87421 21.4808 7.82274C22 8.77128 22 9.91549 22 12.2039V13.725C22 17.6258 22 19.5763 20.8284 20.7881C19.6569 22 17.7712 22 14 22H10C6.22876 22 4.34315 22 3.17157 20.7881C2 19.5763 2 17.6258 2 13.725V12.2039Z"
                                                        stroke="currentColor"
                                                        strokeWidth="1.5"
                                                    />
                                                    <path d="M12 15L12 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                </svg>
                                            </button>
                                            <span className={`${activeTab4 === 1 ? 'text-primary ' : ''}text-center mt-2 block`}>Home</span>
                                        </li>
                                        <li className="mx-auto">
                                            <button
                                                type="button"
                                                className={`${activeTab4 === 2 ? '!border-primary !bg-primary text-white' : ''}
                                                flex h-16 w-16 items-center justify-center rounded-full border-[3px] border-[#f3f2ee] bg-white dark:border-[#1b2e4b] dark:bg-[#253b5c]`}
                                                onClick={() => setActiveTab4(2)}
                                            >
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <circle cx="12" cy="6" r="4" stroke="currentColor" strokeWidth="1.5" />
                                                    <ellipse opacity="0.5" cx="12" cy="17" rx="7" ry="4" stroke="currentColor" strokeWidth="1.5" />
                                                </svg>
                                            </button>
                                            <span className={`${activeTab4 === 2 ? 'text-primary ' : ''}text-center mt-2 block`}>About</span>
                                        </li>
                                        <li className="mx-auto">
                                            <button
                                                type="button"
                                                className={`${activeTab4 === 3 ? '!border-primary !bg-primary text-white' : ''}
                                                flex h-16 w-16 items-center justify-center rounded-full border-[3px] border-[#f3f2ee] bg-white dark:border-[#1b2e4b] dark:bg-[#253b5c]`}
                                                onClick={() => setActiveTab4(3)}
                                            >
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M20.9751 12.1852L20.2361 12.0574L20.9751 12.1852ZM20.2696 16.265L19.5306 16.1371L20.2696 16.265ZM6.93776 20.4771L6.19055 20.5417H6.19055L6.93776 20.4771ZM6.1256 11.0844L6.87281 11.0198L6.1256 11.0844ZM13.9949 5.22142L14.7351 5.34269V5.34269L13.9949 5.22142ZM13.3323 9.26598L14.0724 9.38725V9.38725L13.3323 9.26598ZM6.69813 9.67749L6.20854 9.10933H6.20854L6.69813 9.67749ZM8.13687 8.43769L8.62646 9.00585H8.62646L8.13687 8.43769ZM10.518 4.78374L9.79207 4.59542L10.518 4.78374ZM10.9938 2.94989L11.7197 3.13821L11.7197 3.13821L10.9938 2.94989ZM12.6676 2.06435L12.4382 2.77841L12.4382 2.77841L12.6676 2.06435ZM12.8126 2.11093L13.0419 1.39687L13.0419 1.39687L12.8126 2.11093ZM9.86194 6.46262L10.5235 6.81599V6.81599L9.86194 6.46262ZM13.9047 3.24752L13.1787 3.43584V3.43584L13.9047 3.24752ZM11.6742 2.13239L11.3486 1.45675L11.3486 1.45675L11.6742 2.13239ZM20.2361 12.0574L19.5306 16.1371L21.0086 16.3928L21.7142 12.313L20.2361 12.0574ZM13.245 21.25H8.59634V22.75H13.245V21.25ZM7.68497 20.4125L6.87281 11.0198L5.37839 11.149L6.19055 20.5417L7.68497 20.4125ZM19.5306 16.1371C19.0238 19.0677 16.3813 21.25 13.245 21.25V22.75C17.0712 22.75 20.3708 20.081 21.0086 16.3928L19.5306 16.1371ZM13.2548 5.10015L12.5921 9.14472L14.0724 9.38725L14.7351 5.34269L13.2548 5.10015ZM7.18772 10.2456L8.62646 9.00585L7.64728 7.86954L6.20854 9.10933L7.18772 10.2456ZM11.244 4.97206L11.7197 3.13821L10.2678 2.76157L9.79207 4.59542L11.244 4.97206ZM12.4382 2.77841L12.5832 2.82498L13.0419 1.39687L12.897 1.3503L12.4382 2.77841ZM10.5235 6.81599C10.8354 6.23198 11.0777 5.61339 11.244 4.97206L9.79207 4.59542C9.65572 5.12107 9.45698 5.62893 9.20041 6.10924L10.5235 6.81599ZM12.5832 2.82498C12.8896 2.92342 13.1072 3.16009 13.1787 3.43584L14.6306 3.05921C14.4252 2.26719 13.819 1.64648 13.0419 1.39687L12.5832 2.82498ZM11.7197 3.13821C11.7547 3.0032 11.8522 2.87913 11.9998 2.80804L11.3486 1.45675C10.8166 1.71309 10.417 2.18627 10.2678 2.76157L11.7197 3.13821ZM11.9998 2.80804C12.1345 2.74311 12.2931 2.73181 12.4382 2.77841L12.897 1.3503C12.3872 1.18655 11.8312 1.2242 11.3486 1.45675L11.9998 2.80804ZM14.1537 10.9842H19.3348V9.4842H14.1537V10.9842ZM14.7351 5.34269C14.8596 4.58256 14.824 3.80477 14.6306 3.0592L13.1787 3.43584C13.3197 3.97923 13.3456 4.54613 13.2548 5.10016L14.7351 5.34269ZM8.59634 21.25C8.12243 21.25 7.726 20.887 7.68497 20.4125L6.19055 20.5417C6.29851 21.7902 7.34269 22.75 8.59634 22.75V21.25ZM8.62646 9.00585C9.30632 8.42 10.0391 7.72267 10.5235 6.81599L9.20041 6.10924C8.85403 6.75767 8.30249 7.30493 7.64728 7.86954L8.62646 9.00585ZM21.7142 12.313C21.9695 10.8365 20.8341 9.4842 19.3348 9.4842V10.9842C19.9014 10.9842 20.3332 11.4959 20.2361 12.0574L21.7142 12.313ZM12.5921 9.14471C12.4344 10.1076 13.1766 10.9842 14.1537 10.9842V9.4842C14.1038 9.4842 14.0639 9.43901 14.0724 9.38725L12.5921 9.14471ZM6.87281 11.0198C6.84739 10.7258 6.96474 10.4378 7.18772 10.2456L6.20854 9.10933C5.62021 9.61631 5.31148 10.3753 5.37839 11.149L6.87281 11.0198Z"
                                                        fill="currentColor"
                                                    />
                                                    <path
                                                        opacity="0.5"
                                                        d="M3.9716 21.4709L3.22439 21.5355L3.9716 21.4709ZM3 10.2344L3.74721 10.1698C3.71261 9.76962 3.36893 9.46776 2.96767 9.48507C2.5664 9.50239 2.25 9.83274 2.25 10.2344L3 10.2344ZM4.71881 21.4063L3.74721 10.1698L2.25279 10.299L3.22439 21.5355L4.71881 21.4063ZM3.75 21.5129V10.2344H2.25V21.5129H3.75ZM3.22439 21.5355C3.2112 21.383 3.33146 21.2502 3.48671 21.2502V22.7502C4.21268 22.7502 4.78122 22.1281 4.71881 21.4063L3.22439 21.5355ZM3.48671 21.2502C3.63292 21.2502 3.75 21.3686 3.75 21.5129H2.25C2.25 22.1954 2.80289 22.7502 3.48671 22.7502V21.2502Z"
                                                        fill="currentColor"
                                                    />
                                                </svg>
                                            </button>
                                            <span className={`${activeTab4 === 3 ? 'text-primary ' : ''}text-center mt-2 block`}>Success</span>
                                        </li>
                                    </ul>
                                </div>
                                <div>
                                    <p className="mb-5">{activeTab4 === 1 && ' Try the keyboard navigation by clicking arrow left or right!'}</p>

                                    <p className="mb-5">{activeTab4 === 2 && 'The next and previous buttons help you to navigate through your content.'}</p>

                                    <p className="mb-5">{activeTab4 === 3 && 'Wonderful transition effects.'}</p>
                                </div>
                                <div className="flex justify-between">
                                    <button type="button" className={`btn btn-primary ${activeTab4 === 1 ? 'hidden' : ''}`} onClick={() => setActiveTab4(activeTab4 === 3 ? 2 : 1)}>
                                        Back
                                    </button>
                                    <button type="button" className="btn btn-primary ltr:ml-auto rtl:mr-auto" onClick={() => setActiveTab4(activeTab4 === 1 ? 2 : 3)}>
                                        {activeTab4 === 3 ? 'Finish' : 'Next'}
                                    </button>
                                </div>
                            </div>
                        </div>
                        {codeArr.includes('code5') && (
                            <CodeHighlight>
                                <pre className="language-typescript">{`import { useState } from 'react';

const [activeTab4, setActiveTab4] = useState<any>(1);

<div className="inline-block w-full">
    <div className="relative z-[1]">
        <div
            className={\`\${activeTab4 === 1 ? 'w-[15%]' : activeTab4 === 2 ? 'w-[48%]' : activeTab4 === 3 ? 'w-[81%]' : ''}
            bg-primary w-[15%] h-1 absolute ltr:left-0 rtl:right-0 top-[30px] m-auto -z-[1] transition-[width]\`}
        ></div>
        <ul className="mb-5 grid grid-cols-3">
            <li className="mx-auto">
                <button type="button"
                    className={\`\${activeTab4 === 1 ? '!border-primary !bg-primary text-white' : ''}
                    border-[3px] border-[#f3f2ee] bg-white dark:bg-[#253b5c] dark:border-[#1b2e4b] flex justify-center items-center w-16 h-16 rounded-full\`}
                    onClick={() => setActiveTab4(1)}
                >
                    <svg>...</svg>
                </button>
                <span className={\`\${activeTab4 === 1 ? 'text-primary ' : ''}text-center block mt-2\`}>Home</span>
            </li>
            <li className="mx-auto">
                <button type="button"
                    className={\`\${activeTab4 === 2 ? '!border-primary !bg-primary text-white' : ''}
                    border-[3px] border-[#f3f2ee] bg-white dark:bg-[#253b5c] dark:border-[#1b2e4b] flex justify-center items-center w-16 h-16 rounded-full\`}
                    onClick={() => setActiveTab4(2)}
                >
                    <svg>...</svg>
                </button>
                <span className={\`\${activeTab4 === 2 ? 'text-primary ' : ''}text-center block mt-2\`}>About</span>
            </li>
            <li className="mx-auto">
                <button type="button"
                    className={\`\${activeTab4 === 3 ? '!border-primary !bg-primary text-white' : ''}
                    border-[3px] border-[#f3f2ee] bg-white dark:bg-[#253b5c] dark:border-[#1b2e4b] flex justify-center items-center w-16 h-16 rounded-full\`}
                    onClick={() => setActiveTab4(3)}
                >
                    <svg>...</svg>
                </button>
                <span className={\`\${activeTab4 === 3 ? 'text-primary ' : ''}text-center block mt-2\`}>Success</span>
            </li>
        </ul>
    </div>
    <div>
        <p className="mb-5">{activeTab4 === 1 && ' Try the keyboard navigation by clicking arrow left or right!'}</p>

        <p className="mb-5">{activeTab4 === 2 && 'The next and previous buttons help you to navigate through your content.'}</p>

        <p className="mb-5">{activeTab4 === 3 && 'Wonderful transition effects.'}</p>
    </div>
    <div className="flex justify-between">
        <button type="button" className={\`btn btn-primary \${activeTab4 === 1 ? 'hidden' : ''}\`} onClick={() => setActiveTab4(activeTab4 === 3 ? 2 : 1)}>
            Back
        </button>
        <button type="button" className="btn btn-primary ltr:ml-auto rtl:mr-auto" onClick={() => setActiveTab4(activeTab4 === 1 ? 2 : 3)}>
            {activeTab4 === 3 ? 'Finish' : 'Next'}
        </button>
    </div>
</div>`}</pre>
                            </CodeHighlight>
                        )}
                    </div>
                </div>

                {/* Square */}
                <h4 className="badge mb-0 inline-block bg-primary text-base hover:top-0">Square</h4>
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* icon only */}
                    <div className="panel">
                        <div className="mb-5 flex items-center justify-between">
                            <h5 className="text-lg font-semibold dark:text-white-light">Icon Only</h5>
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
                            <div className="inline-block w-full">
                                <div className="relative z-[1]">
                                    <div
                                        className={`${activeTab5 === 1 ? 'w-[15%]' : activeTab5 === 2 ? 'w-[48%]' : activeTab5 === 3 ? 'w-[81%]' : ''}
                                        absolute top-[30px] -z-[1] m-auto h-1 w-[15%] bg-primary transition-[width] ltr:left-0 rtl:right-0`}
                                    ></div>
                                    <ul className="mb-5 grid grid-cols-3">
                                        <li className="mx-auto">
                                            <button
                                                type="button"
                                                className={`${activeTab5 === 1 ? '!border-primary !bg-primary text-white' : ''}
                                                flex h-16 w-16 items-center justify-center border-[3px] border-[#f3f2ee] bg-white dark:border-[#1b2e4b] dark:bg-[#253b5c]`}
                                                onClick={() => setActiveTab5(1)}
                                            >
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
                                                    <path
                                                        opacity="0.5"
                                                        d="M2 12.2039C2 9.91549 2 8.77128 2.5192 7.82274C3.0384 6.87421 3.98695 6.28551 5.88403 5.10813L7.88403 3.86687C9.88939 2.62229 10.8921 2 12 2C13.1079 2 14.1106 2.62229 16.116 3.86687L18.116 5.10812C20.0131 6.28551 20.9616 6.87421 21.4808 7.82274C22 8.77128 22 9.91549 22 12.2039V13.725C22 17.6258 22 19.5763 20.8284 20.7881C19.6569 22 17.7712 22 14 22H10C6.22876 22 4.34315 22 3.17157 20.7881C2 19.5763 2 17.6258 2 13.725V12.2039Z"
                                                        stroke="currentColor"
                                                        strokeWidth="1.5"
                                                    />
                                                    <path d="M12 15L12 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                </svg>
                                            </button>
                                        </li>
                                        <li className="mx-auto">
                                            <button
                                                type="button"
                                                className={`${activeTab5 === 2 ? '!border-primary !bg-primary text-white' : ''}
                                                flex h-16 w-16 items-center justify-center border-[3px] border-[#f3f2ee] bg-white dark:border-[#1b2e4b] dark:bg-[#253b5c]`}
                                                onClick={() => setActiveTab5(2)}
                                            >
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <circle cx="12" cy="6" r="4" stroke="currentColor" strokeWidth="1.5" />
                                                    <ellipse opacity="0.5" cx="12" cy="17" rx="7" ry="4" stroke="currentColor" strokeWidth="1.5" />
                                                </svg>
                                            </button>
                                        </li>
                                        <li className="mx-auto">
                                            <button
                                                type="button"
                                                className={`${activeTab5 === 3 ? '!border-primary !bg-primary text-white' : ''}
                                                flex h-16 w-16 items-center justify-center border-[3px] border-[#f3f2ee] bg-white dark:border-[#1b2e4b] dark:bg-[#253b5c]`}
                                                onClick={() => setActiveTab5(3)}
                                            >
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M20.9751 12.1852L20.2361 12.0574L20.9751 12.1852ZM20.2696 16.265L19.5306 16.1371L20.2696 16.265ZM6.93776 20.4771L6.19055 20.5417H6.19055L6.93776 20.4771ZM6.1256 11.0844L6.87281 11.0198L6.1256 11.0844ZM13.9949 5.22142L14.7351 5.34269V5.34269L13.9949 5.22142ZM13.3323 9.26598L14.0724 9.38725V9.38725L13.3323 9.26598ZM6.69813 9.67749L6.20854 9.10933H6.20854L6.69813 9.67749ZM8.13687 8.43769L8.62646 9.00585H8.62646L8.13687 8.43769ZM10.518 4.78374L9.79207 4.59542L10.518 4.78374ZM10.9938 2.94989L11.7197 3.13821L11.7197 3.13821L10.9938 2.94989ZM12.6676 2.06435L12.4382 2.77841L12.4382 2.77841L12.6676 2.06435ZM12.8126 2.11093L13.0419 1.39687L13.0419 1.39687L12.8126 2.11093ZM9.86194 6.46262L10.5235 6.81599V6.81599L9.86194 6.46262ZM13.9047 3.24752L13.1787 3.43584V3.43584L13.9047 3.24752ZM11.6742 2.13239L11.3486 1.45675L11.3486 1.45675L11.6742 2.13239ZM20.2361 12.0574L19.5306 16.1371L21.0086 16.3928L21.7142 12.313L20.2361 12.0574ZM13.245 21.25H8.59634V22.75H13.245V21.25ZM7.68497 20.4125L6.87281 11.0198L5.37839 11.149L6.19055 20.5417L7.68497 20.4125ZM19.5306 16.1371C19.0238 19.0677 16.3813 21.25 13.245 21.25V22.75C17.0712 22.75 20.3708 20.081 21.0086 16.3928L19.5306 16.1371ZM13.2548 5.10015L12.5921 9.14472L14.0724 9.38725L14.7351 5.34269L13.2548 5.10015ZM7.18772 10.2456L8.62646 9.00585L7.64728 7.86954L6.20854 9.10933L7.18772 10.2456ZM11.244 4.97206L11.7197 3.13821L10.2678 2.76157L9.79207 4.59542L11.244 4.97206ZM12.4382 2.77841L12.5832 2.82498L13.0419 1.39687L12.897 1.3503L12.4382 2.77841ZM10.5235 6.81599C10.8354 6.23198 11.0777 5.61339 11.244 4.97206L9.79207 4.59542C9.65572 5.12107 9.45698 5.62893 9.20041 6.10924L10.5235 6.81599ZM12.5832 2.82498C12.8896 2.92342 13.1072 3.16009 13.1787 3.43584L14.6306 3.05921C14.4252 2.26719 13.819 1.64648 13.0419 1.39687L12.5832 2.82498ZM11.7197 3.13821C11.7547 3.0032 11.8522 2.87913 11.9998 2.80804L11.3486 1.45675C10.8166 1.71309 10.417 2.18627 10.2678 2.76157L11.7197 3.13821ZM11.9998 2.80804C12.1345 2.74311 12.2931 2.73181 12.4382 2.77841L12.897 1.3503C12.3872 1.18655 11.8312 1.2242 11.3486 1.45675L11.9998 2.80804ZM14.1537 10.9842H19.3348V9.4842H14.1537V10.9842ZM14.7351 5.34269C14.8596 4.58256 14.824 3.80477 14.6306 3.0592L13.1787 3.43584C13.3197 3.97923 13.3456 4.54613 13.2548 5.10016L14.7351 5.34269ZM8.59634 21.25C8.12243 21.25 7.726 20.887 7.68497 20.4125L6.19055 20.5417C6.29851 21.7902 7.34269 22.75 8.59634 22.75V21.25ZM8.62646 9.00585C9.30632 8.42 10.0391 7.72267 10.5235 6.81599L9.20041 6.10924C8.85403 6.75767 8.30249 7.30493 7.64728 7.86954L8.62646 9.00585ZM21.7142 12.313C21.9695 10.8365 20.8341 9.4842 19.3348 9.4842V10.9842C19.9014 10.9842 20.3332 11.4959 20.2361 12.0574L21.7142 12.313ZM12.5921 9.14471C12.4344 10.1076 13.1766 10.9842 14.1537 10.9842V9.4842C14.1038 9.4842 14.0639 9.43901 14.0724 9.38725L12.5921 9.14471ZM6.87281 11.0198C6.84739 10.7258 6.96474 10.4378 7.18772 10.2456L6.20854 9.10933C5.62021 9.61631 5.31148 10.3753 5.37839 11.149L6.87281 11.0198Z"
                                                        fill="currentColor"
                                                    />
                                                    <path
                                                        opacity="0.5"
                                                        d="M3.9716 21.4709L3.22439 21.5355L3.9716 21.4709ZM3 10.2344L3.74721 10.1698C3.71261 9.76962 3.36893 9.46776 2.96767 9.48507C2.5664 9.50239 2.25 9.83274 2.25 10.2344L3 10.2344ZM4.71881 21.4063L3.74721 10.1698L2.25279 10.299L3.22439 21.5355L4.71881 21.4063ZM3.75 21.5129V10.2344H2.25V21.5129H3.75ZM3.22439 21.5355C3.2112 21.383 3.33146 21.2502 3.48671 21.2502V22.7502C4.21268 22.7502 4.78122 22.1281 4.71881 21.4063L3.22439 21.5355ZM3.48671 21.2502C3.63292 21.2502 3.75 21.3686 3.75 21.5129H2.25C2.25 22.1954 2.80289 22.7502 3.48671 22.7502V21.2502Z"
                                                        fill="currentColor"
                                                    />
                                                </svg>
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                                <div>
                                    <p className="mb-5">{activeTab5 === 1 && ' Try the keyboard navigation by clicking arrow left or right!'}</p>

                                    <p className="mb-5">{activeTab5 === 2 && 'The next and previous buttons help you to navigate through your content.'}</p>

                                    <p className="mb-5">{activeTab5 === 3 && 'Wonderful transition effects.'}</p>
                                </div>
                                <div className="flex justify-between">
                                    <button type="button" className={`btn btn-primary ${activeTab5 === 1 ? 'hidden' : ''}`} onClick={() => setActiveTab5(activeTab5 === 3 ? 2 : 1)}>
                                        Back
                                    </button>
                                    <button type="button" className="btn btn-primary ltr:ml-auto rtl:mr-auto" onClick={() => setActiveTab5(activeTab5 === 1 ? 2 : 3)}>
                                        {activeTab5 === 3 ? 'Finish' : 'Next'}
                                    </button>
                                </div>
                            </div>
                        </div>
                        {codeArr.includes('code6') && (
                            <CodeHighlight>
                                <pre className="language-typescript">{`import { useState } from 'react';

const [activeTab5, setActiveTab5] = useState<any>(1);

<div className="inline-block w-full">
    <div className="relative z-[1]">
        <div
            className={\`\${activeTab5 === 1 ? 'w-[15%]' : activeTab5 === 2 ? 'w-[48%]' : activeTab5 === 3 ? 'w-[81%]' : ''}
            bg-primary w-[15%] h-1 absolute ltr:left-0 rtl:right-0 top-[30px] m-auto -z-[1] transition-[width]\`}
        ></div>
        <ul className="mb-5 grid grid-cols-3">
            <li className="mx-auto">
                <button type="button"
                    className={\`\${activeTab5 === 1 ? '!border-primary !bg-primary text-white' : ''}
                    bg-white dark:bg-[#253b5c] border-[3px] border-[#f3f2ee] dark:border-[#1b2e4b] flex justify-center items-center w-16 h-16\`}
                    onClick={() => setActiveTab5(1)}
                >
                    <svg>...</svg>
                </button>
            </li>
            <li className="mx-auto">
                <button type="button"
                    className={\`\${activeTab5 === 2 ? '!border-primary !bg-primary text-white' : ''}
                    bg-white dark:bg-[#253b5c] border-[3px] border-[#f3f2ee] dark:border-[#1b2e4b] flex justify-center items-center w-16 h-16\`}
                    onClick={() => setActiveTab5(2)}
                >
                    <svg>...</svg>
                </button>
            </li>
            <li className="mx-auto">
                <button type="button"
                    className={\`\${activeTab5 === 3 ? '!border-primary !bg-primary text-white' : ''}
                    bg-white dark:bg-[#253b5c] border-[3px] border-[#f3f2ee] dark:border-[#1b2e4b] flex justify-center items-center w-16 h-16\`}
                    onClick={() => setActiveTab5(3)}
                >
                    <svg>...</svg>
                </button>
            </li>
        </ul>
    </div>
    <div>
        <p className="mb-5">{activeTab5 === 1 && ' Try the keyboard navigation by clicking arrow left or right!'}</p>

        <p className="mb-5">{activeTab5 === 2 && 'The next and previous buttons help you to navigate through your content.'}</p>

        <p className="mb-5">{activeTab5 === 3 && 'Wonderful transition effects.'}</p>
    </div>
    <div className="flex justify-between">
        <button type="button" className={\`btn btn-primary \${activeTab5 === 1 ? 'hidden' : ''}\`} onClick={() => setActiveTab5(activeTab5 === 3 ? 2 : 1)}>
            Back
        </button>
        <button type="button" className="btn btn-primary ltr:ml-auto rtl:mr-auto" onClick={() => setActiveTab5(activeTab5 === 1 ? 2 : 3)}>
            {activeTab5 === 3 ? 'Finish' : 'Next'}
        </button>
    </div>
</div>`}</pre>
                            </CodeHighlight>
                        )}
                    </div>

                    {/* Text & Icon */}
                    <div className="panel">
                        <div className="mb-5 flex items-center justify-between">
                            <h5 className="text-lg font-semibold dark:text-white-light">Text & Icon</h5>
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
                            <div className="inline-block w-full">
                                <div className="relative z-[1]">
                                    <div
                                        className={`${activeTab6 === 1 ? 'w-[15%]' : activeTab6 === 2 ? 'w-[48%]' : activeTab6 === 3 ? 'w-[81%]' : ''}
                                        absolute top-[30px] -z-[1] m-auto h-1 w-[15%] bg-primary transition-[width] ltr:left-0 rtl:right-0`}
                                    ></div>
                                    <ul className="mb-5 grid grid-cols-3">
                                        <li className="mx-auto">
                                            <button
                                                type="button"
                                                className={`${activeTab6 === 1 ? '!border-primary !bg-primary text-white' : ''}
                                                flex h-16 w-16 items-center justify-center border-[3px] border-[#f3f2ee] bg-white dark:border-[#1b2e4b] dark:bg-[#253b5c]`}
                                                onClick={() => setActiveTab6(1)}
                                            >
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
                                                    <path
                                                        opacity="0.5"
                                                        d="M2 12.2039C2 9.91549 2 8.77128 2.5192 7.82274C3.0384 6.87421 3.98695 6.28551 5.88403 5.10813L7.88403 3.86687C9.88939 2.62229 10.8921 2 12 2C13.1079 2 14.1106 2.62229 16.116 3.86687L18.116 5.10812C20.0131 6.28551 20.9616 6.87421 21.4808 7.82274C22 8.77128 22 9.91549 22 12.2039V13.725C22 17.6258 22 19.5763 20.8284 20.7881C19.6569 22 17.7712 22 14 22H10C6.22876 22 4.34315 22 3.17157 20.7881C2 19.5763 2 17.6258 2 13.725V12.2039Z"
                                                        stroke="currentColor"
                                                        strokeWidth="1.5"
                                                    />
                                                    <path d="M12 15L12 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                </svg>
                                            </button>
                                            <span className={`${activeTab6 === 1 ? 'text-primary ' : ''}text-center mt-2 block`}>Home</span>
                                        </li>
                                        <li className="mx-auto">
                                            <button
                                                type="button"
                                                className={`${activeTab6 === 2 ? '!border-primary !bg-primary text-white' : ''}
                                                flex h-16 w-16 items-center justify-center border-[3px] border-[#f3f2ee] bg-white dark:border-[#1b2e4b] dark:bg-[#253b5c]`}
                                                onClick={() => setActiveTab6(2)}
                                            >
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <circle cx="12" cy="6" r="4" stroke="currentColor" strokeWidth="1.5" />
                                                    <ellipse opacity="0.5" cx="12" cy="17" rx="7" ry="4" stroke="currentColor" strokeWidth="1.5" />
                                                </svg>
                                            </button>
                                            <span className={`${activeTab6 === 2 ? 'text-primary ' : ''}text-center mt-2 block`}>About</span>
                                        </li>
                                        <li className="mx-auto">
                                            <button
                                                type="button"
                                                className={`${activeTab6 === 3 ? '!border-primary !bg-primary text-white' : ''}
                                                flex h-16 w-16 items-center justify-center border-[3px] border-[#f3f2ee] bg-white dark:border-[#1b2e4b] dark:bg-[#253b5c]`}
                                                onClick={() => setActiveTab6(3)}
                                            >
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M20.9751 12.1852L20.2361 12.0574L20.9751 12.1852ZM20.2696 16.265L19.5306 16.1371L20.2696 16.265ZM6.93776 20.4771L6.19055 20.5417H6.19055L6.93776 20.4771ZM6.1256 11.0844L6.87281 11.0198L6.1256 11.0844ZM13.9949 5.22142L14.7351 5.34269V5.34269L13.9949 5.22142ZM13.3323 9.26598L14.0724 9.38725V9.38725L13.3323 9.26598ZM6.69813 9.67749L6.20854 9.10933H6.20854L6.69813 9.67749ZM8.13687 8.43769L8.62646 9.00585H8.62646L8.13687 8.43769ZM10.518 4.78374L9.79207 4.59542L10.518 4.78374ZM10.9938 2.94989L11.7197 3.13821L11.7197 3.13821L10.9938 2.94989ZM12.6676 2.06435L12.4382 2.77841L12.4382 2.77841L12.6676 2.06435ZM12.8126 2.11093L13.0419 1.39687L13.0419 1.39687L12.8126 2.11093ZM9.86194 6.46262L10.5235 6.81599V6.81599L9.86194 6.46262ZM13.9047 3.24752L13.1787 3.43584V3.43584L13.9047 3.24752ZM11.6742 2.13239L11.3486 1.45675L11.3486 1.45675L11.6742 2.13239ZM20.2361 12.0574L19.5306 16.1371L21.0086 16.3928L21.7142 12.313L20.2361 12.0574ZM13.245 21.25H8.59634V22.75H13.245V21.25ZM7.68497 20.4125L6.87281 11.0198L5.37839 11.149L6.19055 20.5417L7.68497 20.4125ZM19.5306 16.1371C19.0238 19.0677 16.3813 21.25 13.245 21.25V22.75C17.0712 22.75 20.3708 20.081 21.0086 16.3928L19.5306 16.1371ZM13.2548 5.10015L12.5921 9.14472L14.0724 9.38725L14.7351 5.34269L13.2548 5.10015ZM7.18772 10.2456L8.62646 9.00585L7.64728 7.86954L6.20854 9.10933L7.18772 10.2456ZM11.244 4.97206L11.7197 3.13821L10.2678 2.76157L9.79207 4.59542L11.244 4.97206ZM12.4382 2.77841L12.5832 2.82498L13.0419 1.39687L12.897 1.3503L12.4382 2.77841ZM10.5235 6.81599C10.8354 6.23198 11.0777 5.61339 11.244 4.97206L9.79207 4.59542C9.65572 5.12107 9.45698 5.62893 9.20041 6.10924L10.5235 6.81599ZM12.5832 2.82498C12.8896 2.92342 13.1072 3.16009 13.1787 3.43584L14.6306 3.05921C14.4252 2.26719 13.819 1.64648 13.0419 1.39687L12.5832 2.82498ZM11.7197 3.13821C11.7547 3.0032 11.8522 2.87913 11.9998 2.80804L11.3486 1.45675C10.8166 1.71309 10.417 2.18627 10.2678 2.76157L11.7197 3.13821ZM11.9998 2.80804C12.1345 2.74311 12.2931 2.73181 12.4382 2.77841L12.897 1.3503C12.3872 1.18655 11.8312 1.2242 11.3486 1.45675L11.9998 2.80804ZM14.1537 10.9842H19.3348V9.4842H14.1537V10.9842ZM14.7351 5.34269C14.8596 4.58256 14.824 3.80477 14.6306 3.0592L13.1787 3.43584C13.3197 3.97923 13.3456 4.54613 13.2548 5.10016L14.7351 5.34269ZM8.59634 21.25C8.12243 21.25 7.726 20.887 7.68497 20.4125L6.19055 20.5417C6.29851 21.7902 7.34269 22.75 8.59634 22.75V21.25ZM8.62646 9.00585C9.30632 8.42 10.0391 7.72267 10.5235 6.81599L9.20041 6.10924C8.85403 6.75767 8.30249 7.30493 7.64728 7.86954L8.62646 9.00585ZM21.7142 12.313C21.9695 10.8365 20.8341 9.4842 19.3348 9.4842V10.9842C19.9014 10.9842 20.3332 11.4959 20.2361 12.0574L21.7142 12.313ZM12.5921 9.14471C12.4344 10.1076 13.1766 10.9842 14.1537 10.9842V9.4842C14.1038 9.4842 14.0639 9.43901 14.0724 9.38725L12.5921 9.14471ZM6.87281 11.0198C6.84739 10.7258 6.96474 10.4378 7.18772 10.2456L6.20854 9.10933C5.62021 9.61631 5.31148 10.3753 5.37839 11.149L6.87281 11.0198Z"
                                                        fill="currentColor"
                                                    />
                                                    <path
                                                        opacity="0.5"
                                                        d="M3.9716 21.4709L3.22439 21.5355L3.9716 21.4709ZM3 10.2344L3.74721 10.1698C3.71261 9.76962 3.36893 9.46776 2.96767 9.48507C2.5664 9.50239 2.25 9.83274 2.25 10.2344L3 10.2344ZM4.71881 21.4063L3.74721 10.1698L2.25279 10.299L3.22439 21.5355L4.71881 21.4063ZM3.75 21.5129V10.2344H2.25V21.5129H3.75ZM3.22439 21.5355C3.2112 21.383 3.33146 21.2502 3.48671 21.2502V22.7502C4.21268 22.7502 4.78122 22.1281 4.71881 21.4063L3.22439 21.5355ZM3.48671 21.2502C3.63292 21.2502 3.75 21.3686 3.75 21.5129H2.25C2.25 22.1954 2.80289 22.7502 3.48671 22.7502V21.2502Z"
                                                        fill="currentColor"
                                                    />
                                                </svg>
                                            </button>
                                            <span className={`${activeTab6 === 3 ? 'text-primary ' : ''}text-center mt-2 block`}>Success</span>
                                        </li>
                                    </ul>
                                </div>
                                <div>
                                    <p className="mb-5">{activeTab6 === 1 && ' Try the keyboard navigation by clicking arrow left or right!'}</p>

                                    <p className="mb-5">{activeTab6 === 2 && 'The next and previous buttons help you to navigate through your content.'}</p>

                                    <p className="mb-5">{activeTab6 === 3 && 'Wonderful transition effects.'}</p>
                                </div>
                                <div className="flex justify-between">
                                    <button type="button" className={`btn btn-primary ${activeTab6 === 1 ? 'hidden' : ''}`} onClick={() => setActiveTab6(activeTab6 === 3 ? 2 : 1)}>
                                        Back
                                    </button>
                                    <button type="button" className="btn btn-primary ltr:ml-auto rtl:mr-auto" onClick={() => setActiveTab6(activeTab6 === 1 ? 2 : 3)}>
                                        {activeTab6 === 3 ? 'Finish' : 'Next'}
                                    </button>
                                </div>
                            </div>
                        </div>
                        {codeArr.includes('code7') && (
                            <CodeHighlight>
                                <pre className="language-typescript">{`import { useState } from 'react';

const [activeTab6, setActiveTab6] = useState<any>(1);

<div className="inline-block w-full">
    <div className="relative z-[1]">
        <div
            className={\`\${activeTab6 === 1 ? 'w-[15%]' : activeTab6 === 2 ? 'w-[48%]' : activeTab6 === 3 ? 'w-[81%]' : ''}
            bg-primary w-[15%] h-1 absolute ltr:left-0 rtl:right-0 top-[30px] m-auto -z-[1] transition-[width]\`}
        ></div>
        <ul className="mb-5 grid grid-cols-3">
            <li className="mx-auto">
                <button type="button"
                    className={\`\${activeTab6 === 1 ? '!border-primary !bg-primary text-white' : ''}
                    border-[3px] border-[#f3f2ee] bg-white dark:bg-[#253b5c] dark:border-[#1b2e4b] flex justify-center items-center w-16 h-16\`}
                    onClick={() => setActiveTab6(1)}
                >
                    <svg>...</svg>
                </button>
                <span className={\`\${activeTab6 === 1 ? 'text-primary ' : ''}text-center block mt-2\`}>Home</span>
            </li>
            <li className="mx-auto">
                <button type="button"
                    className={\`\${activeTab6 === 2 ? '!border-primary !bg-primary text-white' : ''}
                    border-[3px] border-[#f3f2ee] bg-white dark:bg-[#253b5c] dark:border-[#1b2e4b] flex justify-center items-center w-16 h-16\`}
                    onClick={() => setActiveTab6(2)}
                >
                    <svg>...</svg>
                </button>
                <span className={\`\${activeTab6 === 2 ? 'text-primary ' : ''}text-center block mt-2\`}>About</span>
            </li>
            <li className="mx-auto">
                <button type="button"
                    className={\`\${activeTab6 === 3 ? '!border-primary !bg-primary text-white' : ''}
                    border-[3px] border-[#f3f2ee] bg-white dark:bg-[#253b5c] dark:border-[#1b2e4b] flex justify-center items-center w-16 h-16\`}
                    onClick={() => setActiveTab6(3)}
                >
                    <svg>...</svg>
                </button>
                <span className={\`\${activeTab6 === 3 ? 'text-primary ' : ''}text-center block mt-2\`}>Success</span>
            </li>
        </ul>
    </div>
    <div>
        <p className="mb-5">{activeTab6 === 1 && ' Try the keyboard navigation by clicking arrow left or right!'}</p>

        <p className="mb-5">{activeTab6 === 2 && 'The next and previous buttons help you to navigate through your content.'}</p>

        <p className="mb-5">{activeTab6 === 3 && 'Wonderful transition effects.'}</p>
    </div>
    <div className="flex justify-between">
        <button type="button" className={\`btn btn-primary \${activeTab6 === 1 ? 'hidden' : ''}\`} onClick={() => setActiveTab6(activeTab6 === 3 ? 2 : 1)}>
            Back
        </button>
        <button type="button" className="btn btn-primary ltr:ml-auto rtl:mr-auto" onClick={() => setActiveTab6(activeTab6 === 1 ? 2 : 3)}>
            {activeTab6 === 3 ? 'Finish' : 'Next'}
        </button>
    </div>
</div>`}</pre>
                            </CodeHighlight>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Wizards;
