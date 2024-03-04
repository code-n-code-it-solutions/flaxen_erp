import React from 'react';

const ContentLoader = () => {
    return (
        <div className="animate-pulse space-y-4">
            <div className="bg-gray-300 h-4 w-3/4 rounded"></div>
            <div className="bg-gray-300 h-4 w-1/2 rounded"></div>
            <div className="flex space-x-4">
                <div className="bg-gray-300 h-10 w-10 rounded-full"></div>
                <div className="flex-1 space-y-2 py-1">
                    <div className="h-4 bg-gray-300 rounded"></div>
                    <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                </div>
            </div>
        </div>
    );
};

export default ContentLoader;
