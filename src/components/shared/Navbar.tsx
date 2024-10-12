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
import { Search,PlusCircle,Globe,Bell,Menu,HelpCircle,Info,X } from "lucide-react"
import { Avatar,AvatarFallback,AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setSearchTerm,setCategory,setSortOrder } from '@/redux/features/search/searchSlice';

const Navbar = () => {
    const [isSearchExpanded,setIsSearchExpanded] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [isDropdownOpen,setIsDropdownOpen] = useState(false);
    const [isMobileMenuOpen,setIsMobileMenuOpen] = useState(false);
    const navRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLDivElement>(null);
    const [searchInput,setSearchInput] = useState('');
    const [selectedCategory,setSelectedCategory] = useState('all');
    const [selectedSortOrder,setSelectedSortOrder] = useState('desc');
    const dispatch = useDispatch();
    const router = useRouter();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (!isDropdownOpen &&
                navRef.current && !navRef.current.contains(event.target as Node) &&
                searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsSearchExpanded(false);
                setIsMobileMenuOpen(false);
            }
        };

        document.addEventListener('mousedown',handleClickOutside);
        return () => {
            document.removeEventListener('mousedown',handleClickOutside);
        };
    },[isDropdownOpen]);

    const handleSearch = () => {
        dispatch(setSearchTerm(searchInput));
        dispatch(setCategory(selectedCategory));
        dispatch(setSortOrder(selectedSortOrder));
        setIsSearchExpanded(false);
        router.push('/');
    };

    return (
        <motion.nav
            ref={navRef}
            className="bg-gradient-to-b from-primary to-secondary/30 text-white backdrop-blur sticky top-0 z-50 self-start shadow-md"
            initial={{ opacity: 0,y: -50 }}
            animate={{ opacity: 1,y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Link href="/" className="text-2xl sm:text-3xl font-bold flex items-center">
                            <Globe className="mr-2 h-6 w-6 sm:h-8 sm:w-8" />
                            JourneyMate
                        </Link>
                    </motion.div>
                    <div className="flex items-center space-x-4">
                        <div className="hidden sm:flex items-center space-x-4">
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
                                            <Link href="/about" passHref>
                                                <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                                                    <Info className="mr-2 h-4 w-4" />
                                                    About
                                                </Button>
                                            </Link>
                                        </motion.div>
                                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                            <Link href="/support" passHref>
                                                <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                                                    <HelpCircle className="mr-2 h-4 w-4" />
                                                    Support
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
                        </div>
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
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="sm:hidden">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-white hover:bg-white/20"
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            >
                                {
                                    isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />
                                }
                            </Button>
                        </motion.div>
                    </div>
                </div>
                <AnimatePresence>
                    {isSearchExpanded && (
                        <motion.div
                            ref={searchRef}
                            className="mt-4 flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2"
                            initial={{ opacity: 0,height: 0 }}
                            animate={{ opacity: 1,height: 'auto' }}
                            exit={{ opacity: 0,height: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Input
                                type="text"
                                placeholder="Search adventures..."
                                className="w-full sm:w-auto flex-grow bg-white/10 border-none text-white placeholder-gray-300 focus:ring-2 focus:ring-white"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                            />
                            <Select onValueChange={(value) => setSelectedCategory(value)}>
                                <SelectTrigger className="w-full sm:w-[120px] bg-white/10 border-none text-white focus:ring-2 focus:ring-white">
                                    <SelectValue placeholder="Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All</SelectItem>
                                    <SelectItem value="adventure">Adventure</SelectItem>
                                    <SelectItem value="culture">Culture</SelectItem>
                                    <SelectItem value="food">Food</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select onValueChange={(value) => setSelectedSortOrder(value)}>
                                <SelectTrigger className="w-full sm:w-[120px] bg-white/10 border-none text-white focus:ring-2 focus:ring-white">
                                    <SelectValue placeholder="Sort by" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="asc">Most Votes</SelectItem>
                                    <SelectItem value="desc">Least Votes</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button variant="secondary" className="w-full sm:w-auto" onClick={handleSearch}>Search</Button>
                        </motion.div>
                    )}
                </AnimatePresence>
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            className="sm:hidden mt-4 flex flex-col space-y-2"
                            initial={{ opacity: 0,height: 0 }}
                            animate={{ opacity: 1,height: 'auto' }}
                            exit={{ opacity: 0,height: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Button variant="ghost" className="justify-start w-full">
                                <Bell className="mr-2 h-5 w-5" />
                                Notifications
                            </Button>
                            <Link href="/create-post" passHref>
                                <Button variant="ghost" className="justify-start w-full">
                                    <PlusCircle className="mr-2 h-5 w-5" />
                                    Create Post
                                </Button>
                            </Link>
                            <Link href="/about" passHref>
                                <Button variant="ghost" className="justify-start w-full">
                                    <Info className="mr-2 h-5 w-5" />
                                    About
                                </Button>
                            </Link>
                            <Link href="/support" passHref>
                                <Button variant="ghost" className="justify-start w-full">
                                    <HelpCircle className="mr-2 h-5 w-5" />
                                    Support
                                </Button>
                            </Link>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="justify-start w-full">
                                        <Avatar className="mr-2 h-5 w-5">
                                            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                                            <AvatarFallback>CN</AvatarFallback>
                                        </Avatar>
                                        Profile
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                        <Link href="/profile" className="flex w-full">Profile</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Link href="/dashboard" className="flex w-full">Dashboard</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>Logout</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.nav>
    );
};

export default Navbar;
