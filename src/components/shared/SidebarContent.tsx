'use client'

import React from 'react';
import Link from 'next/link';
import { usePathname,useRouter } from 'next/navigation';
import { Home,User,Pencil,Lock,LogOut,CheckCircle,FileText,Users,CreditCard,LayoutDashboard } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppDispatch,useAppSelector } from '@/redux/hook';
import { selectCurrentUser,signOut } from '@/redux/features/auth/authSlice';




const SidebarContent = ({ onClose }: { onClose?: () => void }) => {
    const pathname = usePathname();
    const router = useRouter();
    const dispatch = useAppDispatch();

    const handleLogout = () => {
        dispatch(signOut());
        router.push('/auth/signin');
    }

    const currentUser = useAppSelector(selectCurrentUser);
    const userRole = currentUser?.role;

    let navItems = [];

    if (userRole === 'admin') {
        navItems = [
            { href: '/',label: 'Home',icon: Home },
            { href: '/dashboard',label: 'Dashboard',icon: LayoutDashboard },
            { href: '/dashboard/user/my-profile',label: 'My Profile',icon: User },
            { href: '/dashboard/user/edit-profile',label: 'Update Profile',icon: Pencil },
            { href: '/dashboard/user/change-password',label: 'Change Password',icon: Lock },
            { href: '/dashboard/user/verify-user',label: 'Verify User',icon: CheckCircle },
            { href: '/dashboard/admin/content-management',label: 'Content Management',icon: FileText },
            { href: '/dashboard/admin/user-management',label: 'User Management',icon: Users },
            { href: '/dashboard/admin/payment-management',label: 'Payment Management',icon: CreditCard },
        ];

    }
    else {
        navItems = [
            { href: '/',label: 'Home',icon: Home },
            { href: '/dashboard/user/my-profile',label: 'My Profile',icon: User },
            { href: '/dashboard/user/edit-profile',label: 'Update Profile',icon: Pencil },
            { href: '/dashboard/user/change-password',label: 'Change Password',icon: Lock },
            { href: '/dashboard/user/verify-user',label: 'Verify User',icon: CheckCircle },
        ];

    }


    return (
        <div className="h-full flex flex-col justify-between min-h-[95vh]">
            <div>
                <div className="flex items-center justify-center mb-8">
                    <Link href="/" className="text-2xl font-bold text-primary mt-5 sm:mt-0 ">JourneyMate</Link>
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
                    <button
                        //href="/auth/signin"
                        className="w-full border-secondary border flex items-center space-x-2 py-2.5 px-4 rounded transition duration-200 text-gray-600 hover:bg-primary/20"
                        onClick={handleLogout}
                    >
                        <LogOut className="w-5 h-5" />
                        <span>Logout</span>
                    </button>
                </motion.div>
            </div>
        </div>
    );
};

export default SidebarContent;