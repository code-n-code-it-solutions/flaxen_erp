import { ButtonType, IconType } from '@/utils/enums';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { Slice, SliceCaseReducers } from '@reduxjs/toolkit';
import { findActiveMenu } from '@/utils/buttonUtils';

export const getRandomInt = (min: number, max: number) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const serverFilePath = (path: any) => {
    if (path) {
        return process.env.NEXT_PUBLIC_API_BASE_UR + '/' + path;
    }
    return '/assets/images/default.jpeg';
};

export const createBlobUrl = (file: File) => {
    if (file) return URL.createObjectURL(file);
    return null;
};

export const getIcon = (icon: IconType, width?: number, height?: number, classes?: string) => {
    switch (icon) {
        case IconType.print:
            return <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M6 17.9827C4.44655 17.9359 3.51998 17.7626 2.87868 17.1213C2 16.2426 2 14.8284 2 12C2 9.17157 2 7.75736 2.87868 6.87868C3.75736 6 5.17157 6 8 6H16C18.8284 6 20.2426 6 21.1213 6.87868C22 7.75736 22 9.17157 22 12C22 14.8284 22 16.2426 21.1213 17.1213C20.48 17.7626 19.5535 17.9359 18 17.9827"
                    stroke="currentColor"
                    strokeWidth="1.5"
                />
                <path opacity="0.5" d="M9 10H6" stroke="currentColor" strokeWidth="1.5"
                      strokeLinecap="round" />
                <path d="M19 14L5 14" stroke="currentColor" strokeWidth="1.5"
                      strokeLinecap="round" />
                <path
                    d="M18 14V16C18 18.8284 18 20.2426 17.1213 21.1213C16.2426 22 14.8284 22 12 22C9.17157 22 7.75736 22 6.87868 21.1213C6 20.2426 6 18.8284 6 16V14"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                />
                <path
                    opacity="0.5"
                    d="M17.9827 6C17.9359 4.44655 17.7626 3.51998 17.1213 2.87868C16.2427 2 14.8284 2 12 2C9.17158 2 7.75737 2 6.87869 2.87868C6.23739 3.51998 6.06414 4.44655 6.01733 6"
                    stroke="currentColor"
                    strokeWidth="1.5"
                />
                <circle opacity="0.5" cx="17" cy="10" r="1" fill="currentColor" />
                <path opacity="0.5" d="M15 16.5H9" stroke="currentColor" strokeWidth="1.5"
                      strokeLinecap="round" />
                <path opacity="0.5" d="M13 19H9" stroke="currentColor" strokeWidth="1.5"
                      strokeLinecap="round" />
            </svg>;
        case IconType.view:
            return <span className="text-primary">
                <svg width="24" height="24" viewBox="0 0 24 24"
                     fill="none"
                    // className="h-5 w-5 ltr:mr-2 rtl:ml-2"
                     xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M3.27489 15.2957C2.42496 14.1915 2 13.6394 2 12C2 10.3606 2.42496 9.80853 3.27489 8.70433C4.97196 6.49956 7.81811 4 12 4C16.1819 4 19.028 6.49956 20.7251 8.70433C21.575 9.80853 22 10.3606 22 12C22 13.6394 21.575 14.1915 20.7251 15.2957C19.028 17.5004 16.1819 20 12 20C7.81811 20 4.97196 17.5004 3.27489 15.2957Z"
                        stroke="currentColor" strokeWidth="1.5" />
                    <path
                        d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z"
                        stroke="currentColor" strokeWidth="1.5" />
                </svg>
            </span>;
        case IconType.edit:
            return <svg xmlns="http://www.w3.org/2000/svg"
                        width="24" height="24"
                // className="h-5 w-5 ltr:mr-2 rtl:ml-2"
                        viewBox="0 0 24 24" fill="none">
                <path
                    d="M8.25 15.5C8.25 15.9142 8.58579 16.25 9 16.25C9.41421 16.25 9.75 15.9142 9.75 15.5H8.25ZM11.6643 8.75249L12.1624 8.19186L12.1624 8.19186L11.6643 8.75249ZM11.25 10.425C11.25 10.8392 11.5858 11.175 12 11.175C12.4142 11.175 12.75 10.8392 12.75 10.425H11.25ZM11.7475 8.83575L12.3081 8.33756L12.3081 8.33756L11.7475 8.83575ZM6.33575 8.75249L5.83756 8.19186L5.83756 8.19186L6.33575 8.75249ZM5.25 10.425C5.25 10.8392 5.58579 11.175 6 11.175C6.41421 11.175 6.75 10.8392 6.75 10.425H5.25ZM6.25249 8.83575L5.69186 8.33756L5.69186 8.33756L6.25249 8.83575ZM7 14.75C6.58579 14.75 6.25 15.0858 6.25 15.5C6.25 15.9142 6.58579 16.25 7 16.25V14.75ZM11 16.25C11.4142 16.25 11.75 15.9142 11.75 15.5C11.75 15.0858 11.4142 14.75 11 14.75V16.25ZM7.925 9.25H9V7.75H7.925V9.25ZM9 9.25H10.075V7.75H9V9.25ZM9.75 15.5V8.5H8.25V15.5H9.75ZM10.075 9.25C10.5295 9.25 10.8007 9.25137 10.9965 9.27579C11.1739 9.29792 11.1831 9.3283 11.1661 9.31312L12.1624 8.19186C11.8612 7.92419 11.5109 7.82832 11.1822 7.78733C10.8719 7.74863 10.4905 7.75 10.075 7.75V9.25ZM12.75 10.425C12.75 10.0095 12.7514 9.62806 12.7127 9.31782C12.6717 8.98915 12.5758 8.63878 12.3081 8.33756L11.1869 9.33394C11.1717 9.31686 11.2021 9.32608 11.2242 9.50348C11.2486 9.69931 11.25 9.97047 11.25 10.425H12.75ZM11.1661 9.31312C11.1734 9.31964 11.1804 9.32659 11.1869 9.33394L12.3081 8.33756C12.2625 8.28617 12.2138 8.23752 12.1624 8.19186L11.1661 9.31312ZM7.925 7.75C7.50946 7.75 7.12806 7.74863 6.81782 7.78733C6.48914 7.82832 6.13878 7.92419 5.83756 8.19186L6.83394 9.31312C6.81686 9.3283 6.82608 9.29792 7.00348 9.27579C7.19931 9.25137 7.47047 9.25 7.925 9.25V7.75ZM6.75 10.425C6.75 9.97047 6.75137 9.69931 6.77579 9.50348C6.79792 9.32608 6.8283 9.31686 6.81312 9.33394L5.69186 8.33756C5.42419 8.63878 5.32832 8.98915 5.28733 9.31782C5.24863 9.62806 5.25 10.0095 5.25 10.425H6.75ZM5.83756 8.19186C5.78617 8.23752 5.73752 8.28617 5.69186 8.33756L6.81312 9.33394C6.81965 9.3266 6.8266 9.31965 6.83394 9.31312L5.83756 8.19186ZM7 16.25H11V14.75H7V16.25Z"
                    fill="currentColor" />
                <path
                    d="M12 4H10C6.22876 4 4.34315 4 3.17157 5.17157C2 6.34315 2 8.22876 2 12C2 15.7712 2 17.6569 3.17157 18.8284C4.34315 20 6.22876 20 10 20H12M15 4.00093C18.1143 4.01004 19.7653 4.10848 20.8284 5.17157C22 6.34315 22 8.22876 22 12C22 15.7712 22 17.6569 20.8284 18.8284C19.7653 19.8915 18.1143 19.99 15 19.9991"
                    stroke="currentColor" strokeWidth="1.5"
                    strokeLinecap="round" />
                <path d="M15 2V22" stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round" />
            </svg>;
        case IconType.delete:
            return <svg xmlns="http://www.w3.org/2000/svg" width="24"
                        height="24"
                // className="h-5 w-5 ltr:mr-2 rtl:ml-2"
                        viewBox="0 0 24 24" fill="none">
                <path
                    d="M9.1709 4C9.58273 2.83481 10.694 2 12.0002 2C13.3064 2 14.4177 2.83481 14.8295 4"
                    stroke="currentColor"
                    strokeWidth="1.5" strokeLinecap="round" />
                <path d="M20.5001 6H3.5" stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round" />
                <path
                    d="M18.8332 8.5L18.3732 15.3991C18.1962 18.054 18.1077 19.3815 17.2427 20.1907C16.3777 21 15.0473 21 12.3865 21H11.6132C8.95235 21 7.62195 21 6.75694 20.1907C5.89194 19.3815 5.80344 18.054 5.62644 15.3991L5.1665 8.5"
                    stroke="currentColor" strokeWidth="1.5"
                    strokeLinecap="round" />
                <path d="M9.5 11L10 16" stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round" />
                <path d="M14.5 11L14 16" stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round" />
            </svg>;
        case IconType.add:
            return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                        className="h-5 w-5 ltr:mr-2 rtl:ml-2"
                        fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                <path d="M15 12L12 12M12 12L9 12M12 12L12 9M12 12L12 15" stroke="currentColor"
                      strokeWidth="1.5" strokeLinecap="round" />
            </svg>;
        case IconType.download:
            return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M3 15C3 17.8284 3 19.2426 3.87868 20.1213C4.75736 21 6.17157 21 9 21H15C17.8284 21 19.2426 21 20.1213 20.1213C21 19.2426 21 17.8284 21 15"
                    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 3V16M12 16L16 11.625M12 16L8 11.625" stroke="currentColor" strokeWidth="1.5"
                      strokeLinecap="round" strokeLinejoin="round" />
            </svg>;
        case IconType.upload:
            return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M3 15C3 17.8284 3 19.2426 3.87868 20.1213C4.75736 21 6.17157 21 9 21H15C17.8284 21 19.2426 21 20.1213 20.1213C21 19.2426 21 17.8284 21 15"
                    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 16V3M12 3L16 7.375M12 3L8 7.375" stroke="currentColor" strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round" />
            </svg>;
        case IconType.cancel:
            return <svg
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
            </svg>;
        case IconType.sum:
            return <svg xmlns="http://www.w3.org/2000/svg" version="1.1"
                        id="Layer_1" x="0px" y="0px" viewBox="0 0 116.32 122.88">
                <g>
                    <path
                        stroke="currentColor"
                        d="M102.67,23.25v-9.59H24.32l42.55,42.77c2.65,2.67,2.64,6.98-0.03,9.63l-43.5,43.17h79.32V99.9h13.65v16.15 c0,3.77-3.06,6.83-6.83,6.83H6.81v-0.02c-1.75,0-3.5-0.67-4.83-2.01c-2.65-2.67-2.64-6.98,0.03-9.63L52.42,61.2L3.47,11.99 C2.02,10.74,1.1,8.89,1.1,6.83C1.1,3.06,4.16,0,7.93,0H109.5c3.77,0,6.83,3.06,6.83,6.83v16.42H102.67L102.67,23.25z" />
                </g>
            </svg>;
        case IconType.back:
            return <svg xmlns="http://www.w3.org/2000/svg"
                // className="h-5 w-5 ltr:mr-2 rtl:ml-2"
                        width="24"
                        height="24" viewBox="0 0 24 24" fill="none">
                <path d="M15 5L9 12L15 19" stroke="currentColor" strokeWidth="1.5"
                      strokeLinecap="round" strokeLinejoin="round" />
            </svg>;
        case IconType.simpleFile:
            return <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                // className="h-5 w-5 ltr:mr-2 rtl:ml-2"
            >
                <path
                    d="M15.3929 4.05365L14.8912 4.61112L15.3929 4.05365ZM19.3517 7.61654L18.85 8.17402L19.3517 7.61654ZM21.654 10.1541L20.9689 10.4592V10.4592L21.654 10.1541ZM3.17157 20.8284L3.7019 20.2981H3.7019L3.17157 20.8284ZM20.8284 20.8284L20.2981 20.2981L20.2981 20.2981L20.8284 20.8284ZM14 21.25H10V22.75H14V21.25ZM2.75 14V10H1.25V14H2.75ZM21.25 13.5629V14H22.75V13.5629H21.25ZM14.8912 4.61112L18.85 8.17402L19.8534 7.05907L15.8947 3.49618L14.8912 4.61112ZM22.75 13.5629C22.75 11.8745 22.7651 10.8055 22.3391 9.84897L20.9689 10.4592C21.2349 11.0565 21.25 11.742 21.25 13.5629H22.75ZM18.85 8.17402C20.2034 9.3921 20.7029 9.86199 20.9689 10.4592L22.3391 9.84897C21.9131 8.89241 21.1084 8.18853 19.8534 7.05907L18.85 8.17402ZM10.0298 2.75C11.6116 2.75 12.2085 2.76158 12.7405 2.96573L13.2779 1.5653C12.4261 1.23842 11.498 1.25 10.0298 1.25V2.75ZM15.8947 3.49618C14.8087 2.51878 14.1297 1.89214 13.2779 1.5653L12.7405 2.96573C13.2727 3.16993 13.7215 3.55836 14.8912 4.61112L15.8947 3.49618ZM10 21.25C8.09318 21.25 6.73851 21.2484 5.71085 21.1102C4.70476 20.975 4.12511 20.7213 3.7019 20.2981L2.64124 21.3588C3.38961 22.1071 4.33855 22.4392 5.51098 22.5969C6.66182 22.7516 8.13558 22.75 10 22.75V21.25ZM1.25 14C1.25 15.8644 1.24841 17.3382 1.40313 18.489C1.56076 19.6614 1.89288 20.6104 2.64124 21.3588L3.7019 20.2981C3.27869 19.8749 3.02502 19.2952 2.88976 18.2892C2.75159 17.2615 2.75 15.9068 2.75 14H1.25ZM14 22.75C15.8644 22.75 17.3382 22.7516 18.489 22.5969C19.6614 22.4392 20.6104 22.1071 21.3588 21.3588L20.2981 20.2981C19.8749 20.7213 19.2952 20.975 18.2892 21.1102C17.2615 21.2484 15.9068 21.25 14 21.25V22.75ZM21.25 14C21.25 15.9068 21.2484 17.2615 21.1102 18.2892C20.975 19.2952 20.7213 19.8749 20.2981 20.2981L21.3588 21.3588C22.1071 20.6104 22.4392 19.6614 22.5969 18.489C22.7516 17.3382 22.75 15.8644 22.75 14H21.25ZM2.75 10C2.75 8.09318 2.75159 6.73851 2.88976 5.71085C3.02502 4.70476 3.27869 4.12511 3.7019 3.7019L2.64124 2.64124C1.89288 3.38961 1.56076 4.33855 1.40313 5.51098C1.24841 6.66182 1.25 8.13558 1.25 10H2.75ZM10.0298 1.25C8.15538 1.25 6.67442 1.24842 5.51887 1.40307C4.34232 1.56054 3.39019 1.8923 2.64124 2.64124L3.7019 3.7019C4.12453 3.27928 4.70596 3.02525 5.71785 2.88982C6.75075 2.75158 8.11311 2.75 10.0298 2.75V1.25Z"
                    fill="currentColor"
                />
                <path opacity="0.5"
                      d="M13 2.5V5C13 7.35702 13 8.53553 13.7322 9.26777C14.4645 10 15.643 10 18 10H22"
                      stroke="currentColor" strokeWidth="1.5" />
            </svg>;
        case IconType.fileWithData:
            return <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                // className="h-5 w-5 ltr:mr-2 rtl:ml-2"
            >
                <path
                    d="M15.3929 4.05365L14.8912 4.61112L15.3929 4.05365ZM19.3517 7.61654L18.85 8.17402L19.3517 7.61654ZM21.654 10.1541L20.9689 10.4592V10.4592L21.654 10.1541ZM3.17157 20.8284L3.7019 20.2981H3.7019L3.17157 20.8284ZM20.8284 20.8284L20.2981 20.2981L20.2981 20.2981L20.8284 20.8284ZM14 21.25H10V22.75H14V21.25ZM2.75 14V10H1.25V14H2.75ZM21.25 13.5629V14H22.75V13.5629H21.25ZM14.8912 4.61112L18.85 8.17402L19.8534 7.05907L15.8947 3.49618L14.8912 4.61112ZM22.75 13.5629C22.75 11.8745 22.7651 10.8055 22.3391 9.84897L20.9689 10.4592C21.2349 11.0565 21.25 11.742 21.25 13.5629H22.75ZM18.85 8.17402C20.2034 9.3921 20.7029 9.86199 20.9689 10.4592L22.3391 9.84897C21.9131 8.89241 21.1084 8.18853 19.8534 7.05907L18.85 8.17402ZM10.0298 2.75C11.6116 2.75 12.2085 2.76158 12.7405 2.96573L13.2779 1.5653C12.4261 1.23842 11.498 1.25 10.0298 1.25V2.75ZM15.8947 3.49618C14.8087 2.51878 14.1297 1.89214 13.2779 1.5653L12.7405 2.96573C13.2727 3.16993 13.7215 3.55836 14.8912 4.61112L15.8947 3.49618ZM10 21.25C8.09318 21.25 6.73851 21.2484 5.71085 21.1102C4.70476 20.975 4.12511 20.7213 3.7019 20.2981L2.64124 21.3588C3.38961 22.1071 4.33855 22.4392 5.51098 22.5969C6.66182 22.7516 8.13558 22.75 10 22.75V21.25ZM1.25 14C1.25 15.8644 1.24841 17.3382 1.40313 18.489C1.56076 19.6614 1.89288 20.6104 2.64124 21.3588L3.7019 20.2981C3.27869 19.8749 3.02502 19.2952 2.88976 18.2892C2.75159 17.2615 2.75 15.9068 2.75 14H1.25ZM14 22.75C15.8644 22.75 17.3382 22.7516 18.489 22.5969C19.6614 22.4392 20.6104 22.1071 21.3588 21.3588L20.2981 20.2981C19.8749 20.7213 19.2952 20.975 18.2892 21.1102C17.2615 21.2484 15.9068 21.25 14 21.25V22.75ZM21.25 14C21.25 15.9068 21.2484 17.2615 21.1102 18.2892C20.975 19.2952 20.7213 19.8749 20.2981 20.2981L21.3588 21.3588C22.1071 20.6104 22.4392 19.6614 22.5969 18.489C22.7516 17.3382 22.75 15.8644 22.75 14H21.25ZM2.75 10C2.75 8.09318 2.75159 6.73851 2.88976 5.71085C3.02502 4.70476 3.27869 4.12511 3.7019 3.7019L2.64124 2.64124C1.89288 3.38961 1.56076 4.33855 1.40313 5.51098C1.24841 6.66182 1.25 8.13558 1.25 10H2.75ZM10.0298 1.25C8.15538 1.25 6.67442 1.24842 5.51887 1.40307C4.34232 1.56054 3.39019 1.8923 2.64124 2.64124L3.7019 3.7019C4.12453 3.27928 4.70596 3.02525 5.71785 2.88982C6.75075 2.75158 8.11311 2.75 10.0298 2.75V1.25Z"
                    fill="currentColor"
                />
                <path opacity="0.5" d="M6 14.5H14" stroke="currentColor" strokeWidth="1.5"
                      strokeLinecap="round" />
                <path opacity="0.5" d="M6 18H11.5" stroke="currentColor" strokeWidth="1.5"
                      strokeLinecap="round" />
                <path opacity="0.5"
                      d="M13 2.5V5C13 7.35702 13 8.53553 13.7322 9.26777C14.4645 10 15.643 10 18 10H22"
                      stroke="currentColor" strokeWidth="1.5" />
            </svg>;
        case IconType.fileWithCode:
            return <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                // className="h-5 w-5 ltr:mr-2 rtl:ml-2"
            >
                <path
                    d="M15.3929 4.05365L14.8912 4.61112L15.3929 4.05365ZM19.3517 7.61654L18.85 8.17402L19.3517 7.61654ZM21.654 10.1541L20.9689 10.4592V10.4592L21.654 10.1541ZM3.17157 20.8284L3.7019 20.2981H3.7019L3.17157 20.8284ZM20.8284 20.8284L20.2981 20.2981L20.2981 20.2981L20.8284 20.8284ZM14 21.25H10V22.75H14V21.25ZM2.75 14V10H1.25V14H2.75ZM21.25 13.5629V14H22.75V13.5629H21.25ZM14.8912 4.61112L18.85 8.17402L19.8534 7.05907L15.8947 3.49618L14.8912 4.61112ZM22.75 13.5629C22.75 11.8745 22.7651 10.8055 22.3391 9.84897L20.9689 10.4592C21.2349 11.0565 21.25 11.742 21.25 13.5629H22.75ZM18.85 8.17402C20.2034 9.3921 20.7029 9.86199 20.9689 10.4592L22.3391 9.84897C21.9131 8.89241 21.1084 8.18853 19.8534 7.05907L18.85 8.17402ZM10.0298 2.75C11.6116 2.75 12.2085 2.76158 12.7405 2.96573L13.2779 1.5653C12.4261 1.23842 11.498 1.25 10.0298 1.25V2.75ZM15.8947 3.49618C14.8087 2.51878 14.1297 1.89214 13.2779 1.5653L12.7405 2.96573C13.2727 3.16993 13.7215 3.55836 14.8912 4.61112L15.8947 3.49618ZM10 21.25C8.09318 21.25 6.73851 21.2484 5.71085 21.1102C4.70476 20.975 4.12511 20.7213 3.7019 20.2981L2.64124 21.3588C3.38961 22.1071 4.33855 22.4392 5.51098 22.5969C6.66182 22.7516 8.13558 22.75 10 22.75V21.25ZM1.25 14C1.25 15.8644 1.24841 17.3382 1.40313 18.489C1.56076 19.6614 1.89288 20.6104 2.64124 21.3588L3.7019 20.2981C3.27869 19.8749 3.02502 19.2952 2.88976 18.2892C2.75159 17.2615 2.75 15.9068 2.75 14H1.25ZM14 22.75C15.8644 22.75 17.3382 22.7516 18.489 22.5969C19.6614 22.4392 20.6104 22.1071 21.3588 21.3588L20.2981 20.2981C19.8749 20.7213 19.2952 20.975 18.2892 21.1102C17.2615 21.2484 15.9068 21.25 14 21.25V22.75ZM21.25 14C21.25 15.9068 21.2484 17.2615 21.1102 18.2892C20.975 19.2952 20.7213 19.8749 20.2981 20.2981L21.3588 21.3588C22.1071 20.6104 22.4392 19.6614 22.5969 18.489C22.7516 17.3382 22.75 15.8644 22.75 14H21.25ZM2.75 10C2.75 8.09318 2.75159 6.73851 2.88976 5.71085C3.02502 4.70476 3.27869 4.12511 3.7019 3.7019L2.64124 2.64124C1.89288 3.38961 1.56076 4.33855 1.40313 5.51098C1.24841 6.66182 1.25 8.13558 1.25 10H2.75ZM10.0298 1.25C8.15538 1.25 6.67442 1.24842 5.51887 1.40307C4.34232 1.56054 3.39019 1.8923 2.64124 2.64124L3.7019 3.7019C4.12453 3.27928 4.70596 3.02525 5.71785 2.88982C6.75075 2.75158 8.11311 2.75 10.0298 2.75V1.25Z"
                    fill="currentColor"
                />
                <path opacity="0.5"
                      d="M13 2.5V5C13 7.35702 13 8.53553 13.7322 9.26777C14.4645 10 15.643 10 18 10H22"
                      stroke="currentColor" strokeWidth="1.5" />
                <path opacity="0.5" d="M7 14L6 15L7 16M11.5 16L12.5 17L11.5 18M10 14L8.5 18"
                      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                      strokeLinejoin="round" />
            </svg>;
        default:
            return <></>;
    }
};

export const generatePDF = async (PreviewComponent: JSX.Element) => {
    const pdfContent = ReactDOMServer.renderToStaticMarkup(PreviewComponent);

    try {
        const res = await fetch('/api/generate-pdf', {
            method: 'POST',
            headers: {
                'Content-Type': 'html/text'
            },
            body: pdfContent
        });

        if (!res.ok) {
            throw new Error(`Error: ${res.status}`);
        }

        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('target', '_blank');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

    } catch (error) {
        console.error('Error generating PDF:', error);
    }
};


export const transformButtonType = (type: ButtonType): 'button' | 'submit' | 'reset' | undefined => {
    switch (type) {
        case ButtonType.button:
        case ButtonType.submit:
        case ButtonType.reset:
            return type;
        case ButtonType.link:
        case ButtonType.icon:
        default:
            return 'button'; // Or choose a sensible default like "button" if appropriate
    }
};

export const toSentenceCase = (str: string) => {
    if (str && str.length > 0) {
        return str[0].toUpperCase() + str.substring(1).toLowerCase();
    } else {
        return '';
    }
};


export const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

export const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-AE', {
        style: 'currency',
        currency: 'AED'
    });
};


export function configureSlice<State, CaseReducers extends SliceCaseReducers<State>>(
    slice: Slice<State, CaseReducers, string>,
    persist: boolean
) {
    return {
        reducer: slice.reducer,
        actions: slice.actions, // if you want to export the actions too
        persist
    };
}

export const formatData = (date: any, format: string = 'mm/dd/yyyy', timezone = 'UTC') => {
    const d = new Date(date);
    const dtf = new Intl.DateTimeFormat('en', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        timeZone: timezone
    });
    const [{ value: mo }, , { value: da }, , { value: ye }] = dtf.formatToParts(d);

    switch (format) {
        case 'mm/dd/yyyy':
            return `${mo}/${da}/${ye}`;
        case 'dd/mm/yyyy':
            return `${da}/${mo}/${ye}`;
        case 'yyyy-mm-dd':
            return `${ye}-${mo}-${da}`;
        default:
            return `${mo}/${da}/${ye}`;
    }
};

export const formatTime = (date: any, format: string = 'hh:mm:ss', timezone = 'UTC') => {
    const d = new Date(date);
    const dtf = new Intl.DateTimeFormat('en', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: timezone
    });
    const [{ value: hr }, , { value: min }, , { value: sec }] = dtf.formatToParts(d);

    switch (format) {
        case 'hh:mm:ss':
            return `${hr}:${min}:${sec}`;
        case 'hh:mm':
            return `${hr}:${min}`;
        default:
            return `${hr}:${min}:${sec}`;
    }
};

export const truncatePathname = (pathname: string, basePath: string) => {
    const index = pathname?.indexOf(basePath);
    if (index !== -1) {
        return pathname?.substring(0, index + basePath.length);
    }
    return pathname;
};

export const checkPermission = (menus: any[], pathname: string, permission: string, basePath: string) => {
    const truncatedPath = truncatePathname(pathname, basePath);
    const activeMenu = findActiveMenu(menus, truncatedPath);
    if (activeMenu && Array.isArray(activeMenu.actions)) {
        return activeMenu.actions?.find((action: any) => action.name === permission);
    }
    return null;
};


export function calculateDateFromDays(days: number, date?: any) {
    const resultDate = date && typeof date !== 'undefined' ? new Date(date) : new Date();
    resultDate.setDate(resultDate.getDate() + days ? days : 0);
    return resultDate ? resultDate.toISOString().split('T')[0] : new Date(); // Returns date in YYYY-MM-DD format
}

export const transformAccountsToSelectOptions = (accounts: any) => {
    // console.log(accounts);
    return accounts?.map((account: any) => {
        const transformed: any = {
            label: account.code + ' - ' + account.name,
            value: account.id,
            accounts
        };
        if (account.accounts || account.children_recursive) {
            transformed.options = transformAccountsToSelectOptions(account.accounts ?? account.children_recursive);
        }
        return transformed;
    });
};

export const isValidIPAddress = (ip: string) => {
    const ipPattern = /^(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}$/;
    return ip === '*' || ipPattern.test(ip);
};
