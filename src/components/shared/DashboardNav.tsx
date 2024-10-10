'use client'

import React from 'react';
import Link from 'next/link';
import { Bell,Search,Menu,User,Settings,HelpCircle,LogOut } from 'lucide-react';
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
import img1 from "@/assets/images/signup3.avif"
import Image from 'next/image';

export const DashboardNav = ({ onMenuClick }: { onMenuClick: () => void }) => {
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
                                    src={img1}
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
                                    <p className="text-sm font-medium leading-none">John Doe</p>
                                    <p className="text-xs leading-none text-muted-foreground">john.doe@example.com</p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link href="/dashboard/profile" className="flex items-center">
                                    <User className="mr-2 h-4 w-4" />
                                    <span>Profile</span>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href="/dashboard/settings" className="flex items-center">
                                    <Settings className="mr-2 h-4 w-4" />
                                    <span>Settings</span>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href="/dashboard/help" className="flex items-center">
                                    <HelpCircle className="mr-2 h-4 w-4" />
                                    <span>Help</span>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link href="/auth/signin" className="flex items-center">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Log out</span>
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </nav>
    );
};
