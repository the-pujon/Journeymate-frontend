'use client'

import React from 'react';
import { Bell,Search,Menu,LogOut } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import img1 from "@/assets/images/signupImage.jpg"
import Image from 'next/image';
import { useGetUserByIdQuery } from '@/redux/features/user/userApi';
import { selectCurrentUser,signOut } from '@/redux/features/auth/authSlice';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '@/redux/hook';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export const DashboardNav = ({ onMenuClick }: { onMenuClick: () => void }) => {

    const currentUser = useSelector(selectCurrentUser);
    const dispatch = useAppDispatch()
    const router = useRouter()
    const { data } = useGetUserByIdQuery(currentUser?._id)


    const handleLogout = () => {
        dispatch(signOut())
        toast.success("Logged out successfully")
        router.push("/")
    }

    return (
        <nav className="bg-secondary/30 shadow-md py-4 px-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <Button variant="ghost" size="icon" className="md:hidden mr-4" onClick={onMenuClick}>
                        <Menu className="h-6 w-6" />
                    </Button>
                    <div className="relative hidden sm:block">
                        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            className="pl-8 w-64 sm:w-72"
                            type="text"
                            placeholder="Search..."
                        />
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="icon" className="relative">
                        <Bell className="h-5 w-5" />
                        <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">3</span>
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <div className="relative h-8 w-8 rounded-full border cursor-pointer">
                                <Image
                                    src={data?.data?.profilePicture || img1}
                                    className="h-8 w-8 rounded-full object-cover"
                                    alt="Your avatar"
                                    width={32}
                                    height={32}
                                />
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end" forceMount>
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">{data?.data?.user?.name}</p>
                                    <p className="text-xs leading-none text-muted-foreground">{data?.data?.user?.email}</p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />

                            <DropdownMenuSeparator />
                            <DropdownMenuItem >
                                <Button onClick={handleLogout} className="flex items-center" variant="ghost">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Log out</span>
                                </Button>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </nav>
    );
};
