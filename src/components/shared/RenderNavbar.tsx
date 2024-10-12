'use client'

import React from 'react';
import Navbar from './Navbar';
import { usePathname } from 'next/navigation';

const RenderNavbar = () => {
    const pathname = usePathname();

    const isDashboard = pathname.startsWith("/dashboard") || pathname.startsWith("/auth");

    return !isDashboard && <Navbar />;
};

export default RenderNavbar;