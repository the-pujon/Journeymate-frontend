'use client'

import React,{ useState } from 'react';
import { Sidebar } from '@/components/shared/Sidebar';
import { DashboardNav } from '@/components/shared/DashboardNav';
import { motion,AnimatePresence } from 'framer-motion';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [isSidebarOpen,setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div className="flex h-screen ">
            <div className=' bg-secondary/30'><Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} /></div>
            <div className="flex-1 flex flex-col overflow-hidden">
                <DashboardNav onMenuClick={toggleSidebar} />
                <AnimatePresence mode="wait">
                    <motion.main
                        key={children?.toString()}
                        initial={{ opacity: 0,y: 20 }}
                        animate={{ opacity: 1,y: 0 }}
                        exit={{ opacity: 0,y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="flex-1 overflow-x-hidden overflow-y-auto "
                    >
                        <div className="container mx-auto px-6 py-8">
                            {children}
                        </div>
                    </motion.main>
                </AnimatePresence>
            </div>
        </div>
    );
}