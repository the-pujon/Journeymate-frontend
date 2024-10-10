'use client'

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home,User,Settings,HelpCircle,LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

const navItems = [
    { href: '/dashboard',label: 'Dashboard',icon: Home },
    { href: '/dashboard/user/my-profile',label: 'My Profile',icon: User },
    { href: '/dashboard/settings',label: 'Settings',icon: Settings },
    { href: '/dashboard/help',label: 'Help',icon: HelpCircle },
];


const SidebarContent = ({ onClose }: { onClose?: () => void }) => {
    const pathname = usePathname();

    return (
        <div className="h-full flex flex-col justify-between min-h-[95vh]">
            <div>
                <div className="flex items-center justify-center mb-8">
                    <h1 className="text-2xl font-bold text-primary mt-5 sm:mt-0 ">JourneyMate</h1>
                </div>
                <nav className="flex-1">
                    {navItems.map((item) => (
                        <motion.div
                            key={item.href}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Link
                                href={item.href}
                                className={`flex items-center space-x-2 py-2.5 px-4 rounded transition duration-200 ${pathname === item.href ? 'bg-primary text-white' : 'text-gray-600 hover:bg-primary/20'}`}
                                onClick={onClose}
                            >
                                <item.icon className="w-5 h-5" />
                                <span>{item.label}</span>
                            </Link>
                        </motion.div>
                    ))}
                </nav>
            </div>
            <div className="mt-auto">
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Link
                        href="/auth/signin"
                        className="flex items-center space-x-2 py-2.5 px-4 rounded transition duration-200 text-gray-600 hover:bg-gray-100"
                        onClick={onClose}
                    >
                        <LogOut className="w-5 h-5" />
                        <span>Logout</span>
                    </Link>
                </motion.div>
            </div>
        </div>
    );
};

export default SidebarContent;