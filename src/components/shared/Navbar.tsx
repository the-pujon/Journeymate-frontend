'use client'

import React,{ useState,useRef,useEffect } from 'react';
import Link from 'next/link';
import { motion,AnimatePresence } from 'framer-motion';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Search,PlusCircle,Globe,Bell } from "lucide-react"
import { Avatar,AvatarFallback,AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const Navbar = () => {
    const [isSearchExpanded,setIsSearchExpanded] = useState(false);
    const [isDropdownOpen,setIsDropdownOpen] = useState(false);
    const navRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (!isDropdownOpen &&
                navRef.current && !navRef.current.contains(event.target as Node) &&
                searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsSearchExpanded(false);
            }
        };

        document.addEventListener('mousedown',handleClickOutside);
        return () => {
            document.removeEventListener('mousedown',handleClickOutside);
        };
    },[isDropdownOpen]);

    return (
        <motion.nav
            ref={navRef}
            className="bg-gradient-to-b from-primary to-secondary/60 text-white shadow-lg"
            initial={{ opacity: 0,y: -50 }}
            animate={{ opacity: 1,y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="container mx-auto py-4">
                <div className="flex justify-between items-center">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Link href="/" className="text-3xl font-bold flex items-center">
                            <Globe className="mr-2 h-8 w-8" />
                            JourneyMate
                        </Link>
                    </motion.div>
                    <div className="flex items-center space-x-4">
                        <AnimatePresence>
                            {!isSearchExpanded && (
                                <motion.div
                                    className="flex items-center space-x-4"
                                    initial={{ opacity: 0,x: 20 }}
                                    animate={{ opacity: 1,x: 0 }}
                                    exit={{ opacity: 0,x: 20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                        <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                                            <Bell className="h-5 w-5" />
                                        </Button>
                                    </motion.div>
                                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                        <Link href="/create-post" passHref>
                                            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                                                <PlusCircle className="mr-2 h-4 w-4" />
                                                Create
                                            </Button>
                                        </Link>
                                    </motion.div>
                                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Avatar className="cursor-pointer">
                                                    <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                                                    <AvatarFallback>CN</AvatarFallback>
                                                </Avatar>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem>Profile</DropdownMenuItem>
                                                <DropdownMenuItem>Settings</DropdownMenuItem>
                                                <DropdownMenuItem>Logout</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-white hover:bg-white/20"
                                onClick={() => setIsSearchExpanded(!isSearchExpanded)}
                            >
                                <Search className="h-5 w-5" />
                            </Button>
                        </motion.div>
                    </div>
                </div>
                <AnimatePresence>
                    {isSearchExpanded && (
                        <motion.div
                            ref={searchRef}
                            className="mt-4 flex items-center space-x-2"
                            initial={{ opacity: 0,height: 0 }}
                            animate={{ opacity: 1,height: 'auto' }}
                            exit={{ opacity: 0,height: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Input
                                type="text"
                                placeholder="Search adventures..."
                                className="flex-grow bg-white/10 border-none text-white placeholder-gray-300 focus:ring-2 focus:ring-white"
                            />
                            <Select onOpenChange={(open) => setIsDropdownOpen(open)}>
                                <SelectTrigger className="w-[120px] bg-white/10 border-none text-white focus:ring-2 focus:ring-white">
                                    <SelectValue placeholder="Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All</SelectItem>
                                    <SelectItem value="adventure">Adventure</SelectItem>
                                    <SelectItem value="culture">Culture</SelectItem>
                                    <SelectItem value="food">Food</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select onOpenChange={(open) => setIsDropdownOpen(open)}>
                                <SelectTrigger className="w-[120px] bg-white/10 border-none text-white focus:ring-2 focus:ring-white">
                                    <SelectValue placeholder="Sort by" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="recent">Most Recent</SelectItem>
                                    <SelectItem value="votes">Most Votes</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button variant="secondary">Search</Button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.nav>
    );
};

export default Navbar;
