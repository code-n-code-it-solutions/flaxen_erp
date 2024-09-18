"use client";
import {useEffect, useState} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {useAppDispatch, useAppSelector} from '@/store';
import {toggleLocale, toggleTheme} from '@/store/slices/themeConfigSlice';
import {useTranslation} from 'react-i18next';
import {toggleSidebar} from '@/store/slices/themeConfigSlice';
import Dropdown from '@/components/Dropdown';
import { logoutUser, setIsLocked } from '@/store/slices/userSlice';
import {clearMenuState, getPermittedMenu, setActiveModule, setModuleMenus} from "@/store/slices/menuSlice";
import {setAuthToken} from "@/configs/api.config";

const Header = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const {t, i18n} = useTranslation();
    const {isLoggedIn, token, user} = useAppSelector((state) => state.user);
    const isRtl = useAppSelector((state) => state.themeConfig.rtlClass) === 'rtl';
    const themeConfig = useAppSelector((state) => state.themeConfig);
    const [flag, setFlag] = useState('');
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            profile: 'default.jpeg',
            message: '<strong class="text-sm mr-1">John Doe</strong>invite you to <strong>Prototyping</strong>',
            time: '45 min ago',
        },
    ]);

    const handleLogout = () => {
        setAuthToken(token)
        dispatch(clearMenuState());
        dispatch(logoutUser());
    }

    const handleLockScreen = () => {
        dispatch(setIsLocked({ lockStatus: true, beforeLockUrl: router.pathname }));
    };

    useEffect(() => {
        if (!isLoggedIn) {
            router.push('/auth/signin')
        } else {
            setAuthToken(token)
            // dispatch(getPermittedMenu());
        }
    }, [isLoggedIn, router])

    useEffect(() => {
        setFlag(localStorage.getItem('i18nextLng') || themeConfig.locale);
    }, [themeConfig.locale]);

    const removeNotification = (value: number) => {
        setNotifications(notifications.filter((user) => user.id !== value));
    };

    const [search, setSearch] = useState(false);
    return (
        <header className={themeConfig.semidark && themeConfig.menu === 'horizontal' ? 'dark' : ''}>
            <div className="shadow-sm">
                <div className="relative flex w-full items-center bg-white px-5 py-2.5 dark:bg-black">
                    <div className="horizontal-logo flex items-center justify-between ltr:mr-2 rtl:ml-2 lg:hidden">
                        <Link href="/" className="main-logo flex shrink-0 items-center">
                            {/*<img className="inline w-8 ltr:-ml-1 rtl:-mr-1" src="/assets/images/logo.svg" alt="logo"/>*/}
                            <span
                                className="hidden align-middle text-2xl font-semibold transition-all duration-300 ltr:ml-1.5 rtl:mr-1.5 dark:text-white-light md:inline">
                                Administration
                            </span>
                        </Link>
                        <button
                            type="button"
                            className="collapse-icon flex flex-none rounded-full bg-white-light/40 p-2 hover:bg-white-light/90 hover:text-primary ltr:ml-2 rtl:mr-2 dark:bg-dark/40 dark:text-[#d0d2d6] dark:hover:bg-dark/60 dark:hover:text-primary lg:hidden"
                            onClick={() => dispatch(toggleSidebar())}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path d="M20 7L4 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                <path opacity="0.5" d="M20 12L4 12" stroke="currentColor" strokeWidth="1.5"
                                      strokeLinecap="round"/>
                                <path d="M20 17L4 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                            </svg>
                        </button>
                    </div>

                    <div
                        className="flex items-center space-x-1.5 ltr:ml-auto rtl:mr-auto rtl:space-x-reverse dark:text-[#d0d2d6] sm:flex-1 ltr:sm:ml-0 sm:rtl:mr-0 lg:space-x-2">
                        <div className="sm:ltr:mr-auto sm:rtl:ml-auto">
                            {/* horizontal menu */}
                            <ul className="top-nav lg:flex hidden py-1.5 px-6 dark:text-white-light font-semibold text-black rtl:space-x-reverse lg:space-x-1.5 xl:space-x-8">
                                <li className="menu nav-item">
                                    <Link href='/super-admin' className="nav-link">
                                        <span className="px-1">{t('dashboard')}</span>
                                    </Link>
                                </li>
                                <li className="menu nav-item">
                                    <Link href='/super-admin/permissions' className="nav-link">
                                        <span className="px-1">{t('permissions')}</span>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <Link href="/super-admin/chat"
                                  className="block rounded-full bg-white-light/40 p-2 hover:bg-white-light/90 hover:text-primary dark:bg-dark/40 dark:hover:bg-dark/60">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <circle r="3" transform="matrix(-1 0 0 1 19 5)" stroke="currentColor"
                                            strokeWidth="1.5"/>
                                    <path
                                        opacity="0.5"
                                        d="M14 2.20004C13.3538 2.06886 12.6849 2 12 2C6.47715 2 2 6.47715 2 12C2 13.5997 2.37562 15.1116 3.04346 16.4525C3.22094 16.8088 3.28001 17.2161 3.17712 17.6006L2.58151 19.8267C2.32295 20.793 3.20701 21.677 4.17335 21.4185L6.39939 20.8229C6.78393 20.72 7.19121 20.7791 7.54753 20.9565C8.88837 21.6244 10.4003 22 12 22C17.5228 22 22 17.5228 22 12C22 11.3151 21.9311 10.6462 21.8 10"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                    />
                                </svg>
                            </Link>
                        </div>
                        <div>
                            {themeConfig.theme === 'light' ? (
                                <button
                                    className={`${
                                        themeConfig.theme === 'light' &&
                                        'flex items-center rounded-full bg-white-light/40 p-2 hover:bg-white-light/90 hover:text-primary dark:bg-dark/40 dark:hover:bg-dark/60'
                                    }`}
                                    onClick={() => dispatch(toggleTheme('dark'))}
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.5"/>
                                        <path d="M12 2V4" stroke="currentColor" strokeWidth="1.5"
                                              strokeLinecap="round"/>
                                        <path d="M12 20V22" stroke="currentColor" strokeWidth="1.5"
                                              strokeLinecap="round"/>
                                        <path d="M4 12L2 12" stroke="currentColor" strokeWidth="1.5"
                                              strokeLinecap="round"/>
                                        <path d="M22 12L20 12" stroke="currentColor" strokeWidth="1.5"
                                              strokeLinecap="round"/>
                                        <path opacity="0.5" d="M19.7778 4.22266L17.5558 6.25424" stroke="currentColor"
                                              strokeWidth="1.5" strokeLinecap="round"/>
                                        <path opacity="0.5" d="M4.22217 4.22266L6.44418 6.25424" stroke="currentColor"
                                              strokeWidth="1.5" strokeLinecap="round"/>
                                        <path opacity="0.5" d="M6.44434 17.5557L4.22211 19.7779" stroke="currentColor"
                                              strokeWidth="1.5" strokeLinecap="round"/>
                                        <path opacity="0.5" d="M19.7778 19.7773L17.5558 17.5551" stroke="currentColor"
                                              strokeWidth="1.5" strokeLinecap="round"/>
                                    </svg>
                                </button>
                            ) : (
                                ''
                            )}
                            {themeConfig.theme === 'dark' && (
                                <button
                                    className={`${
                                        themeConfig.theme === 'dark' &&
                                        'flex items-center rounded-full bg-white-light/40 p-2 hover:bg-white-light/90 hover:text-primary dark:bg-dark/40 dark:hover:bg-dark/60'
                                    }`}
                                    onClick={() => dispatch(toggleTheme('system'))}
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M21.0672 11.8568L20.4253 11.469L21.0672 11.8568ZM12.1432 2.93276L11.7553 2.29085V2.29085L12.1432 2.93276ZM21.25 12C21.25 17.1086 17.1086 21.25 12 21.25V22.75C17.9371 22.75 22.75 17.9371 22.75 12H21.25ZM12 21.25C6.89137 21.25 2.75 17.1086 2.75 12H1.25C1.25 17.9371 6.06294 22.75 12 22.75V21.25ZM2.75 12C2.75 6.89137 6.89137 2.75 12 2.75V1.25C6.06294 1.25 1.25 6.06294 1.25 12H2.75ZM15.5 14.25C12.3244 14.25 9.75 11.6756 9.75 8.5H8.25C8.25 12.5041 11.4959 15.75 15.5 15.75V14.25ZM20.4253 11.469C19.4172 13.1373 17.5882 14.25 15.5 14.25V15.75C18.1349 15.75 20.4407 14.3439 21.7092 12.2447L20.4253 11.469ZM9.75 8.5C9.75 6.41182 10.8627 4.5828 12.531 3.57467L11.7553 2.29085C9.65609 3.5593 8.25 5.86509 8.25 8.5H9.75ZM12 2.75C11.9115 2.75 11.8077 2.71008 11.7324 2.63168C11.6686 2.56527 11.6538 2.50244 11.6503 2.47703C11.6461 2.44587 11.6482 2.35557 11.7553 2.29085L12.531 3.57467C13.0342 3.27065 13.196 2.71398 13.1368 2.27627C13.0754 1.82126 12.7166 1.25 12 1.25V2.75ZM21.7092 12.2447C21.6444 12.3518 21.5541 12.3539 21.523 12.3497C21.4976 12.3462 21.4347 12.3314 21.3683 12.2676C21.2899 12.1923 21.25 12.0885 21.25 12H22.75C22.75 11.2834 22.1787 10.9246 21.7237 10.8632C21.286 10.804 20.7293 10.9658 20.4253 11.469L21.7092 12.2447Z"
                                            fill="currentColor"
                                        />
                                    </svg>
                                </button>
                            )}
                            {themeConfig.theme === 'system' && (
                                <button
                                    className={`${
                                        themeConfig.theme === 'system' &&
                                        'flex items-center rounded-full bg-white-light/40 p-2 hover:bg-white-light/90 hover:text-primary dark:bg-dark/40 dark:hover:bg-dark/60'
                                    }`}
                                    onClick={() => dispatch(toggleTheme('light'))}
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M3 9C3 6.17157 3 4.75736 3.87868 3.87868C4.75736 3 6.17157 3 9 3H15C17.8284 3 19.2426 3 20.1213 3.87868C21 4.75736 21 6.17157 21 9V14C21 15.8856 21 16.8284 20.4142 17.4142C19.8284 18 18.8856 18 17 18H7C5.11438 18 4.17157 18 3.58579 17.4142C3 16.8284 3 15.8856 3 14V9Z"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                        />
                                        <path opacity="0.5" d="M22 21H2" stroke="currentColor" strokeWidth="1.5"
                                              strokeLinecap="round"/>
                                        <path opacity="0.5" d="M15 15H9" stroke="currentColor" strokeWidth="1.5"
                                              strokeLinecap="round"/>
                                    </svg>
                                </button>
                            )}
                        </div>
                        <div className="dropdown shrink-0">
                            <Dropdown
                                offset={[0, 8]}
                                placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                                btnClassName="block p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:text-primary hover:bg-white-light/90 dark:hover:bg-dark/60"
                                button={flag && (
                                    <img
                                        className="h-5 w-5 rounded-full object-cover"
                                        src={`/assets/images/flags/${flag.toUpperCase()}.svg`}
                                        alt="flag"
                                    />
                                )}
                            >
                                <ul className="grid w-[280px] grid-cols-2 gap-2 !px-2 font-semibold text-dark dark:text-white-dark dark:text-white-light/90">
                                    {themeConfig.languageList.map((item: any) => {
                                        return (
                                            <li key={item.code}>
                                                <button
                                                    type="button"
                                                    className={`flex w-full hover:text-primary ${i18n.language === item.code ? 'bg-primary/10 text-primary' : ''}`}
                                                    onClick={() => {
                                                        dispatch(toggleLocale(item.code));
                                                        i18n.changeLanguage(item.code);
                                                        setFlag(item.code);
                                                    }}
                                                >
                                                    <img src={`/assets/images/flags/${item.code.toUpperCase()}.svg`}
                                                         alt="flag" className="h-5 w-5 rounded-full object-cover"/>
                                                    <span className="ltr:ml-3 rtl:mr-3">{t(item.translation_key)}</span>
                                                </button>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </Dropdown>
                        </div>

                        <div className="dropdown flex shrink-0">
                            <Dropdown
                                offset={[0, 8]}
                                placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                                btnClassName="relative group block"
                                button={<img
                                    className="h-9 w-9 rounded-full object-cover saturate-50 group-hover:saturate-100"
                                    src="/assets/images/default.jpeg" alt="userProfile"/>}
                            >
                                <ul className="w-[230px] !py-0 font-semibold text-dark dark:text-white-dark dark:text-white-light/90">
                                    <li>
                                        <div className="flex items-center px-4 py-4">
                                            <img className="h-10 w-10 rounded-md object-cover"
                                                 src="/assets/images/default.jpeg" alt="userProfile" />
                                            <div className="ltr:pl-4 rtl:pr-4">
                                                <h4 className="text-base">
                                                    {user?.name || 'User'}
                                                    {/*<span*/}
                                                    {/*    className="rounded bg-success-light px-1 text-xs text-success ltr:ml-2 rtl:ml-2">*/}
                                                    {/*    Pro*/}
                                                    {/*</span>*/}
                                                </h4>
                                                <button type="button"
                                                        className="text-[10px] text-black/60 hover:text-primary dark:text-dark-light/60 dark:hover:text-white">
                                                    {user?.email || 'abc@xyz.com'}
                                                </button>
                                            </div>
                                        </div>
                                    </li>
                                    {/*<li>*/}
                                    {/*    <Link href="/workspace/user" className="dark:hover:text-white">*/}
                                    {/*        <svg className="ltr:mr-2 rtl:ml-2" width="18" height="18"*/}
                                    {/*             viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">*/}
                                    {/*            <circle cx="12" cy="6" r="4" stroke="currentColor" strokeWidth="1.5" />*/}
                                    {/*            <path*/}
                                    {/*                opacity="0.5"*/}
                                    {/*                d="M20 17.5C20 19.9853 20 22 12 22C4 22 4 19.9853 4 17.5C4 15.0147 7.58172 13 12 13C16.4183 13 20 15.0147 20 17.5Z"*/}
                                    {/*                stroke="currentColor"*/}
                                    {/*                strokeWidth="1.5"*/}
                                    {/*            />*/}
                                    {/*        </svg>*/}
                                    {/*        Profile*/}
                                    {/*    </Link>*/}
                                    {/*</li>*/}
                                    <li>
                                        <button className="dark:hover:text-white" onClick={() => handleLockScreen()}>
                                            <svg className="ltr:mr-2 rtl:ml-2" width="18" height="18"
                                                 viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M2 16C2 13.1716 2 11.7574 2.87868 10.8787C3.75736 10 5.17157 10 8 10H16C18.8284 10 20.2426 10 21.1213 10.8787C22 11.7574 22 13.1716 22 16C22 18.8284 22 20.2426 21.1213 21.1213C20.2426 22 18.8284 22 16 22H8C5.17157 22 3.75736 22 2.87868 21.1213C2 20.2426 2 18.8284 2 16Z"
                                                    stroke="currentColor"
                                                    strokeWidth="1.5"
                                                />
                                                <path opacity="0.5"
                                                      d="M6 10V8C6 4.68629 8.68629 2 12 2C15.3137 2 18 4.68629 18 8V10"
                                                      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                <g opacity="0.5">
                                                    <path
                                                        d="M9 16C9 16.5523 8.55228 17 8 17C7.44772 17 7 16.5523 7 16C7 15.4477 7.44772 15 8 15C8.55228 15 9 15.4477 9 16Z"
                                                        fill="currentColor" />
                                                    <path
                                                        d="M13 16C13 16.5523 12.5523 17 12 17C11.4477 17 11 16.5523 11 16C11 15.4477 11.4477 15 12 15C12.5523 15 13 15.4477 13 16Z"
                                                        fill="currentColor"
                                                    />
                                                    <path
                                                        d="M17 16C17 16.5523 16.5523 17 16 17C15.4477 17 15 16.5523 15 16C15 15.4477 15.4477 15 16 15C16.5523 15 17 15.4477 17 16Z"
                                                        fill="currentColor"
                                                    />
                                                </g>
                                            </svg>
                                            Lock Screen
                                        </button>
                                    </li>
                                    <li className="border-t border-white-light dark:border-white-light/10">
                                        <button onClick={handleLogout} className="!py-3 text-danger">
                                            <svg className="rotate-90 ltr:mr-2 rtl:ml-2" width="18" height="18"
                                                 viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    opacity="0.5"
                                                    d="M17 9.00195C19.175 9.01406 20.3529 9.11051 21.1213 9.8789C22 10.7576 22 12.1718 22 15.0002V16.0002C22 18.8286 22 20.2429 21.1213 21.1215C20.2426 22.0002 18.8284 22.0002 16 22.0002H8C5.17157 22.0002 3.75736 22.0002 2.87868 21.1215C2 20.2429 2 18.8286 2 16.0002L2 15.0002C2 12.1718 2 10.7576 2.87868 9.87889C3.64706 9.11051 4.82497 9.01406 7 9.00195"
                                                    stroke="currentColor"
                                                    strokeWidth="1.5"
                                                    strokeLinecap="round"
                                                />
                                                <path d="M12 15L12 2M12 2L15 5.5M12 2L9 5.5" stroke="currentColor"
                                                      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            Sign Out
                                        </button>
                                    </li>
                                </ul>
                            </Dropdown>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;

