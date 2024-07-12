"use client";
import {useEffect, useState} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {useAppDispatch, useAppSelector} from '@/store';
import {toggleLocale, toggleTheme} from '@/store/slices/themeConfigSlice';
import {useTranslation} from 'react-i18next';
import {toggleSidebar} from '@/store/slices/themeConfigSlice';
import Dropdown from '@/components/Dropdown';
import {logoutUser} from "@/store/slices/userSlice";
import {clearMenuState, getPermittedMenu, setActiveModule, setModuleMenus} from "@/store/slices/menuSlice";
import {setAuthToken} from "@/configs/api.config";

const Header = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const {t, i18n} = useTranslation();
    const {isLoggedIn, token} = useAppSelector((state) => state.user);
    const {permittedMenus, moduleMenus, activeModule} = useAppSelector((state) => state.menu);
    const isRtl = useAppSelector((state) => state.themeConfig.rtlClass) === 'rtl';
    const themeConfig = useAppSelector((state) => state.themeConfig);
    const [flag, setFlag] = useState('');
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            profile: 'user-profile.jpeg',
            message: '<strong class="text-sm mr-1">John Doe</strong>invite you to <strong>Prototyping</strong>',
            time: '45 min ago',
        },
    ]);

    const handleLogout = () => {
        setAuthToken(token)
        dispatch(clearMenuState());
        dispatch(logoutUser());
    }

    useEffect(() => {
        setActiveMenu()
    }, [activeModule]);

    useEffect(() => {
        if (!isLoggedIn) {
            router.push('/auth/signin')
        } else {
            setAuthToken(token)
            // dispatch(getPermittedMenu());
        }
    }, [isLoggedIn, router])

    const setActiveMenu = () => {
        const selector = document.querySelector('ul.horizontal-menu a[href="' + window?.location?.pathname + '"]');
        if (selector) {
            const all: any = document.querySelectorAll('ul.horizontal-menu .nav-link.active');
            for (let i = 0; i < all.length; i++) {
                all[0]?.classList.remove('active');
            }

            let allLinks = document.querySelectorAll('ul.horizontal-menu a.active');
            for (let i = 0; i < allLinks.length; i++) {
                const element = allLinks[i];
                element?.classList.remove('active');
            }
            selector?.classList.add('active');

            const ul: any = selector.closest('ul.sub-menu');
            if (ul) {
                let ele: any = ul.closest('li.menu').querySelectorAll('.nav-link');
                if (ele) {
                    ele = ele[0];
                    setTimeout(() => {
                        ele?.classList.add('active');
                    });
                }
            }
        }
    }

    useEffect(() => {
        setActiveMenu()
    }, [router.pathname]);

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
                                className="hidden align-middle text-2xl  font-semibold  transition-all duration-300 ltr:ml-1.5 rtl:mr-1.5 dark:text-white-light md:inline">
                                FLAXEN PAINTS
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

                    <div className="hidden ltr:mr-2 rtl:ml-2 sm:block">
                        <ul className="flex items-center space-x-2 rtl:space-x-reverse dark:text-[#d0d2d6]">
                            <li>
                                <Link href="/apps/calendar"
                                      className="block rounded-full bg-white-light/40 p-2 hover:bg-white-light/90 hover:text-primary dark:bg-dark/40 dark:hover:bg-dark/60">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M2 12C2 8.22876 2 6.34315 3.17157 5.17157C4.34315 4 6.22876 4 10 4H14C17.7712 4 19.6569 4 20.8284 5.17157C22 6.34315 22 8.22876 22 12V14C22 17.7712 22 19.6569 20.8284 20.8284C19.6569 22 17.7712 22 14 22H10C6.22876 22 4.34315 22 3.17157 20.8284C2 19.6569 2 17.7712 2 14V12Z"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                        />
                                        <path opacity="0.5" d="M7 4V2.5" stroke="currentColor" strokeWidth="1.5"
                                              strokeLinecap="round"/>
                                        <path opacity="0.5" d="M17 4V2.5" stroke="currentColor" strokeWidth="1.5"
                                              strokeLinecap="round"/>
                                        <path opacity="0.5" d="M2 9H22" stroke="currentColor" strokeWidth="1.5"
                                              strokeLinecap="round"/>
                                    </svg>
                                </Link>
                            </li>
                            <li>
                                <Link href="/apps/todolist"
                                      className="block rounded-full bg-white-light/40 p-2 hover:bg-white-light/90 hover:text-primary dark:bg-dark/40 dark:hover:bg-dark/60">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                                         xmlns="http://www.w3.org/2000/svg">
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
                                </Link>
                            </li>
                            <li>
                                <Link href="/apps/chat"
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
                            </li>
                        </ul>
                    </div>
                    <div
                        className="flex items-center space-x-1.5 ltr:ml-auto rtl:mr-auto rtl:space-x-reverse dark:text-[#d0d2d6] sm:flex-1 ltr:sm:ml-0 sm:rtl:mr-0 lg:space-x-2">
                        <div className="sm:ltr:mr-auto sm:rtl:ml-auto">
                            <form
                                className={`${search && '!block'} absolute inset-x-0 top-1/2 z-10 mx-4 hidden -translate-y-1/2 sm:relative sm:top-0 sm:mx-0 sm:block sm:translate-y-0`}
                                onSubmit={() => setSearch(false)}
                            >
                                <div className="relative">
                                    <input
                                        type="text"
                                        className="peer form-input bg-gray-100 placeholder:tracking-widest ltr:pl-9 ltr:pr-9 rtl:pr-9 rtl:pl-9 sm:bg-transparent ltr:sm:pr-4 rtl:sm:pl-4"
                                        placeholder="Search..."
                                    />
                                    <button type="button"
                                            className="absolute inset-0 h-9 w-9 appearance-none peer-focus:text-primary ltr:right-auto rtl:left-auto">
                                        <svg className="mx-auto" width="16" height="16" viewBox="0 0 24 24" fill="none"
                                             xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="11.5" cy="11.5" r="9.5" stroke="currentColor" strokeWidth="1.5"
                                                    opacity="0.5"/>
                                            <path d="M18.5 18.5L22 22" stroke="currentColor" strokeWidth="1.5"
                                                  strokeLinecap="round"/>
                                        </svg>
                                    </button>
                                    <button type="button"
                                            className="absolute top-1/2 block -translate-y-1/2 hover:opacity-80 ltr:right-2 rtl:left-2 sm:hidden"
                                            onClick={() => setSearch(false)}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                                             xmlns="http://www.w3.org/2000/svg">
                                            <circle opacity="0.5" cx="12" cy="12" r="10" stroke="currentColor"
                                                    strokeWidth="1.5"/>
                                            <path d="M14.5 9.50002L9.5 14.5M9.49998 9.5L14.5 14.5" stroke="currentColor"
                                                  strokeWidth="1.5" strokeLinecap="round"/>
                                        </svg>
                                    </button>
                                </div>
                            </form>
                            <button
                                type="button"
                                onClick={() => setSearch(!search)}
                                className="search_btn rounded-full bg-white-light/40 p-2 hover:bg-white-light/90 dark:bg-dark/40 dark:hover:bg-dark/60 sm:hidden"
                            >
                                <svg className="mx-auto h-4.5 w-4.5 dark:text-[#d0d2d6]" width="20" height="20"
                                     viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="11.5" cy="11.5" r="9.5" stroke="currentColor" strokeWidth="1.5"
                                            opacity="0.5"/>
                                    <path d="M18.5 18.5L22 22" stroke="currentColor" strokeWidth="1.5"
                                          strokeLinecap="round"/>
                                </svg>
                            </button>
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
                                button={flag && <img className="h-5 w-5 rounded-full object-cover"
                                                     src={`/assets/images/flags/${flag.toUpperCase()}.svg`}
                                                     alt="flag"/>}
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

                        <div className="dropdown shrink-0">
                            <Dropdown
                                offset={[0, 8]}
                                placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                                btnClassName="relative block p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:text-primary hover:bg-white-light/90 dark:hover:bg-dark/60"
                                button={
                                    <span>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                                             xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M19.0001 9.7041V9C19.0001 5.13401 15.8661 2 12.0001 2C8.13407 2 5.00006 5.13401 5.00006 9V9.7041C5.00006 10.5491 4.74995 11.3752 4.28123 12.0783L3.13263 13.8012C2.08349 15.3749 2.88442 17.5139 4.70913 18.0116C9.48258 19.3134 14.5175 19.3134 19.291 18.0116C21.1157 17.5139 21.9166 15.3749 20.8675 13.8012L19.7189 12.0783C19.2502 11.3752 19.0001 10.5491 19.0001 9.7041Z"
                                                stroke="currentColor"
                                                strokeWidth="1.5"
                                            />
                                            <path
                                                d="M7.5 19C8.15503 20.7478 9.92246 22 12 22C14.0775 22 15.845 20.7478 16.5 19"
                                                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                            <path d="M12 6V10" stroke="currentColor" strokeWidth="1.5"
                                                  strokeLinecap="round"/>
                                        </svg>
                                        <span className="absolute top-0 flex h-3 w-3 ltr:right-0 rtl:left-0">
                                            <span
                                                className="absolute -top-[3px] inline-flex h-full w-full animate-ping rounded-full bg-success/50 opacity-75 ltr:-left-[3px] rtl:-right-[3px]"></span>
                                            <span
                                                className="relative inline-flex h-[6px] w-[6px] rounded-full bg-success"></span>
                                        </span>
                                    </span>
                                }
                            >
                                <ul className="w-[300px] divide-y !py-0 text-dark dark:divide-white/10 dark:text-white-dark sm:w-[350px]">
                                    <li onClick={(e) => e.stopPropagation()}>
                                        <div className="flex items-center justify-between px-4 py-2 font-semibold">
                                            <h4 className="text-lg">Notification</h4>
                                            {notifications.length ? <span
                                                className="badge bg-primary/80">{notifications.length} New</span> : ''}
                                        </div>
                                    </li>
                                    {notifications.length > 0 ? (
                                        <>
                                            {notifications.map((notification) => {
                                                return (
                                                    <li key={notification.id} className="dark:text-white-light/90"
                                                        onClick={(e) => e.stopPropagation()}>
                                                        <div className="group flex items-center px-4 py-2">
                                                            <div className="grid place-content-center rounded">
                                                                <div className="relative h-12 w-12">
                                                                    <img className="h-12 w-12 rounded-full object-cover"
                                                                         alt="profile"
                                                                         src={`/assets/images/${notification.profile}`}/>
                                                                    <span
                                                                        className="absolute right-[6px] bottom-0 block h-2 w-2 rounded-full bg-success"></span>
                                                                </div>
                                                            </div>
                                                            <div className="flex flex-auto ltr:pl-3 rtl:pr-3">
                                                                <div className="ltr:pr-3 rtl:pl-3">
                                                                    <h6
                                                                        dangerouslySetInnerHTML={{
                                                                            __html: notification.message,
                                                                        }}
                                                                    ></h6>
                                                                    <span
                                                                        className="block text-xs font-normal dark:text-gray-500">{notification.time}</span>
                                                                </div>
                                                                <button
                                                                    type="button"
                                                                    className="text-neutral-300 opacity-0 hover:text-danger group-hover:opacity-100 ltr:ml-auto rtl:mr-auto"
                                                                    onClick={() => removeNotification(notification.id)}
                                                                >
                                                                    <svg width="20" height="20" viewBox="0 0 24 24"
                                                                         fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                        <circle opacity="0.5" cx="12" cy="12" r="10"
                                                                                stroke="currentColor"
                                                                                strokeWidth="1.5"/>
                                                                        <path
                                                                            d="M14.5 9.50002L9.5 14.5M9.49998 9.5L14.5 14.5"
                                                                            stroke="currentColor" strokeWidth="1.5"
                                                                            strokeLinecap="round"/>
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </li>
                                                );
                                            })}
                                            <li>
                                                <div className="p-4">
                                                    <button className="btn btn-primary btn-small block w-full">Read All
                                                        Notifications
                                                    </button>
                                                </div>
                                            </li>
                                        </>
                                    ) : (
                                        <li onClick={(e) => e.stopPropagation()}>
                                            <button type="button"
                                                    className="!grid min-h-[200px] place-content-center text-lg hover:!bg-transparent">
                                                <div className="mx-auto mb-4 rounded-full ring-4 ring-primary/30">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="40"
                                                        height="40"
                                                        viewBox="0 0 24 24"
                                                        fill="#a9abb6"
                                                        stroke="#ffffff"
                                                        strokeWidth="1.5"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        className="feather feather-info rounded-full bg-primary"
                                                    >
                                                        <line x1="12" y1="16" x2="12" y2="12"></line>
                                                        <line x1="12" y1="8" x2="12.01" y2="8"></line>
                                                    </svg>
                                                </div>
                                                No data available.
                                            </button>
                                        </li>
                                    )}
                                </ul>
                            </Dropdown>
                        </div>

                        <div className="dropdown shrink-0" id="module-list">
                            <Dropdown
                                offset={[0, 8]}
                                placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                                btnClassName="block p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:text-primary hover:bg-white-light/90 dark:hover:bg-dark/60"
                                button={
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M13.5 15.5C13.5 13.6144 13.5 12.6716 14.0858 12.0858C14.6716 11.5 15.6144 11.5 17.5 11.5C19.3856 11.5 20.3284 11.5 20.9142 12.0858C21.5 12.6716 21.5 13.6144 21.5 15.5V17.5C21.5 19.3856 21.5 20.3284 20.9142 20.9142C20.3284 21.5 19.3856 21.5 17.5 21.5C15.6144 21.5 14.6716 21.5 14.0858 20.9142C13.5 20.3284 13.5 19.3856 13.5 17.5V15.5Z"
                                            stroke="currentColor" strokeWidth="1.5"/>
                                        <path
                                            d="M2 8.5C2 10.3856 2 11.3284 2.58579 11.9142C3.17157 12.5 4.11438 12.5 6 12.5C7.88562 12.5 8.82843 12.5 9.41421 11.9142C10 11.3284 10 10.3856 10 8.5V6.5C10 4.61438 10 3.67157 9.41421 3.08579C8.82843 2.5 7.88562 2.5 6 2.5C4.11438 2.5 3.17157 2.5 2.58579 3.08579C2 3.67157 2 4.61438 2 6.5V8.5Z"
                                            stroke="currentColor" strokeWidth="1.5"/>
                                        <path
                                            d="M13.5 5.5C13.5 4.56812 13.5 4.10218 13.6522 3.73463C13.8552 3.24458 14.2446 2.85523 14.7346 2.65224C15.1022 2.5 15.5681 2.5 16.5 2.5H18.5C19.4319 2.5 19.8978 2.5 20.2654 2.65224C20.7554 2.85523 21.1448 3.24458 21.3478 3.73463C21.5 4.10218 21.5 4.56812 21.5 5.5C21.5 6.43188 21.5 6.89782 21.3478 7.26537C21.1448 7.75542 20.7554 8.14477 20.2654 8.34776C19.8978 8.5 19.4319 8.5 18.5 8.5H16.5C15.5681 8.5 15.1022 8.5 14.7346 8.34776C14.2446 8.14477 13.8552 7.75542 13.6522 7.26537C13.5 6.89782 13.5 6.43188 13.5 5.5Z"
                                            stroke="currentColor" strokeWidth="1.5"/>
                                        <path
                                            d="M2 18.5C2 19.4319 2 19.8978 2.15224 20.2654C2.35523 20.7554 2.74458 21.1448 3.23463 21.3478C3.60218 21.5 4.06812 21.5 5 21.5H7C7.93188 21.5 8.39782 21.5 8.76537 21.3478C9.25542 21.1448 9.64477 20.7554 9.84776 20.2654C10 19.8978 10 19.4319 10 18.5C10 17.5681 10 17.1022 9.84776 16.7346C9.64477 16.2446 9.25542 15.8552 8.76537 15.6522C8.39782 15.5 7.93188 15.5 7 15.5H5C4.06812 15.5 3.60218 15.5 3.23463 15.6522C2.74458 15.8552 2.35523 16.2446 2.15224 16.7346C2 17.1022 2 17.5681 2 18.5Z"
                                            stroke="currentColor" strokeWidth="1.5"/>
                                    </svg>
                                }
                            >
                                <ul className="grid w-[280px] grid-cols-2 gap-2 !px-2 font-semibold text-dark dark:text-white-dark dark:text-white-light/90">
                                    {permittedMenus?.map((module: any, moduleIndex: number) => (
                                        <li key={moduleIndex}>
                                            <button
                                                type="button"
                                                className={`flex w-full hover:text-primary ${module.name === activeModule ? 'bg-primary/10 text-primary' : ''}`}
                                                onClick={() => {
                                                    dispatch(setActiveModule(module.name));
                                                    dispatch(setModuleMenus(module.menus));
                                                }}
                                            >
                                                <div dangerouslySetInnerHTML={{__html: module.icon}}></div>
                                                <span className="ltr:ml-3 rtl:mr-3">
                                                    {module.name}
                                                </span>
                                            </button>
                                        </li>
                                    ))}
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
                                    src="/assets/images/user-profile.jpeg" alt="userProfile"/>}
                            >
                                <ul className="w-[230px] !py-0 font-semibold text-dark dark:text-white-dark dark:text-white-light/90">
                                    <li>
                                        <div className="flex items-center px-4 py-4">
                                            <img className="h-10 w-10 rounded-md object-cover"
                                                 src="/assets/images/user-profile.jpeg" alt="userProfile"/>
                                            <div className="ltr:pl-4 rtl:pr-4">
                                                <h4 className="text-base">
                                                    John Doe
                                                    <span
                                                        className="rounded bg-success-light px-1 text-xs text-success ltr:ml-2 rtl:ml-2">Pro</span>
                                                </h4>
                                                <button type="button"
                                                        className="text-black/60 hover:text-primary dark:text-dark-light/60 dark:hover:text-white">
                                                    johndoe@gmail.com
                                                </button>
                                            </div>
                                        </div>
                                    </li>
                                    <li>
                                        <Link href="/users/profile" className="dark:hover:text-white">
                                            <svg className="ltr:mr-2 rtl:ml-2" width="18" height="18"
                                                 viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <circle cx="12" cy="6" r="4" stroke="currentColor" strokeWidth="1.5"/>
                                                <path
                                                    opacity="0.5"
                                                    d="M20 17.5C20 19.9853 20 22 12 22C4 22 4 19.9853 4 17.5C4 15.0147 7.58172 13 12 13C16.4183 13 20 15.0147 20 17.5Z"
                                                    stroke="currentColor"
                                                    strokeWidth="1.5"
                                                />
                                            </svg>
                                            Profile
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/apps/mailbox" className="dark:hover:text-white">
                                            <svg className="ltr:mr-2 rtl:ml-2" width="18" height="18"
                                                 viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    opacity="0.5"
                                                    d="M2 12C2 8.22876 2 6.34315 3.17157 5.17157C4.34315 4 6.22876 4 10 4H14C17.7712 4 19.6569 4 20.8284 5.17157C22 6.34315 22 8.22876 22 12C22 15.7712 22 17.6569 20.8284 18.8284C19.6569 20 17.7712 20 14 20H10C6.22876 20 4.34315 20 3.17157 18.8284C2 17.6569 2 15.7712 2 12Z"
                                                    stroke="currentColor"
                                                    strokeWidth="1.5"
                                                />
                                                <path
                                                    d="M6 8L8.1589 9.79908C9.99553 11.3296 10.9139 12.0949 12 12.0949C13.0861 12.0949 14.0045 11.3296 15.8411 9.79908L18 8"
                                                    stroke="currentColor"
                                                    strokeWidth="1.5"
                                                    strokeLinecap="round"
                                                />
                                            </svg>
                                            Inbox
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/auth/lockscreen" className="dark:hover:text-white">
                                            <svg className="ltr:mr-2 rtl:ml-2" width="18" height="18"
                                                 viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M2 16C2 13.1716 2 11.7574 2.87868 10.8787C3.75736 10 5.17157 10 8 10H16C18.8284 10 20.2426 10 21.1213 10.8787C22 11.7574 22 13.1716 22 16C22 18.8284 22 20.2426 21.1213 21.1213C20.2426 22 18.8284 22 16 22H8C5.17157 22 3.75736 22 2.87868 21.1213C2 20.2426 2 18.8284 2 16Z"
                                                    stroke="currentColor"
                                                    strokeWidth="1.5"
                                                />
                                                <path opacity="0.5"
                                                      d="M6 10V8C6 4.68629 8.68629 2 12 2C15.3137 2 18 4.68629 18 8V10"
                                                      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                                <g opacity="0.5">
                                                    <path
                                                        d="M9 16C9 16.5523 8.55228 17 8 17C7.44772 17 7 16.5523 7 16C7 15.4477 7.44772 15 8 15C8.55228 15 9 15.4477 9 16Z"
                                                        fill="currentColor"/>
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
                                        </Link>
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
                                                      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                            Sign Out
                                        </button>
                                    </li>
                                </ul>
                            </Dropdown>
                        </div>
                    </div>
                </div>

                {/* horizontal menu */}
                <ul className="horizontal-menu hidden border-t border-[#ebedf2] bg-white py-1.5 px-6 font-semibold text-black rtl:space-x-reverse dark:border-[#191e3a] dark:bg-black dark:text-white-dark lg:space-x-1.5 xl:space-x-8">
                    {moduleMenus?.map((menu: any, moduleIndex: number) => (
                            menu.children?.length > 0
                                ? <li className="menu nav-item relative" key={moduleIndex}>
                                    <button type="button" className="nav-link">
                                        <div className="flex items-center">
                                            <div dangerouslySetInnerHTML={{__html: menu.icon}}></div>
                                            <span className="px-1">{t(menu.translation_key)}</span>
                                        </div>
                                        <div className="right_arrow">
                                            <svg className="rotate-90" width="16" height="16" viewBox="0 0 24 24" fill="none"
                                                 xmlns="http://www.w3.org/2000/svg">
                                                <path d="M9 5L15 12L9 19" stroke="currentColor" strokeWidth="1.5"
                                                      strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        </div>
                                    </button>
                                    <ul className="sub-menu">

                                        {menu.children?.map((menu: any, menuIndex: number) => (
                                            menu.children?.length > 0
                                                ? (
                                                    <li className="relative" key={menuIndex}>
                                                        <button type="button">
                                                            <div className="flex items-center">
                                                                <div
                                                                    dangerouslySetInnerHTML={{__html: menu.icon}}></div>
                                                                {t(menu.translation_key)}
                                                            </div>
                                                            <div className="ltr:ml-auto rtl:mr-auto rtl:rotate-180">
                                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                                                     xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M9 5L15 12L9 19" stroke="currentColor"
                                                                          strokeWidth="1.5"
                                                                          strokeLinecap="round" strokeLinejoin="round"/>
                                                                </svg>
                                                            </div>
                                                        </button>
                                                        <ul className="absolute top-0 z-[10] hidden min-w-[180px] rounded bg-white p-0 py-2 text-dark shadow ltr:left-[95%] rtl:right-[95%] dark:bg-[#1b2e4b] dark:text-white-dark">
                                                            {menu.children.map((subMenu: any, subMenuIndex: number) => (
                                                                <li key={subMenuIndex}>
                                                                    <Link href={subMenu.route}>{t(subMenu.translation_key)}</Link>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </li>
                                                )
                                                : (
                                                    <li key={menuIndex}>
                                                        <Link href={menu.route}>
                                                            <div className="flex items-center">
                                                                <div
                                                                    dangerouslySetInnerHTML={{__html: menu.icon}}></div>
                                                                <span className="px-1">{t(menu.translation_key)}</span>
                                                            </div>
                                                        </Link>
                                                    </li>
                                                )
                                        ))}
                                    </ul>
                                </li>
                                : (
                                    <li className="menu nav-item" key={moduleIndex}>
                                        <Link href={menu.route} className="nav-link">
                                            <div className="flex items-center">
                                                <div dangerouslySetInnerHTML={{__html: menu.icon}}></div>
                                                <span className="px-1">{t(menu.translation_key)}</span>
                                            </div>
                                        </Link>
                                    </li>
                                )
                        )
                    )}
                </ul>
            </div>
        </header>
    );
};

export default Header;

