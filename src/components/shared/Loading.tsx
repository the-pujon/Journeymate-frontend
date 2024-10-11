import React from 'react';

const Loading = () => {
    return (
        <div className="flex justify-center items-center h-[85vh]">
            <div className="animate-spin rounded-full h-24 w-24 border-t-2 border-b-2 border-primary border-gray-900"></div>
        </div>
    );
};

export default Loading;