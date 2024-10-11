'use client'

import React,{ useState } from 'react';
import { useGetUsersQuery } from '@/redux/features/user/userApi'; import { Search } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Avatar,AvatarFallback,AvatarImage } from "@/components/ui/avatar";
import { motion } from 'framer-motion';
import { Input } from "@/components/ui/input";
import Loading from '@/components/shared/Loading';
import { useDebounce } from '@/hooks/useDebounce';
import { Table,TableBody,TableCell,TableHead,TableHeader,TableRow } from "@/components/ui/table";

const UserManagement = () => {
    const [searchTerm,setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm,300);
    console.log(debouncedSearchTerm)
    const { data: users,isLoading,error } = useGetUsersQuery({ searchTerm: debouncedSearchTerm });


    if (error) {
        return <div className="text-center text-red-500 mt-8 text-xl">Error loading users</div>;
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="container mx-auto px-2 sm:px-4 py-4 sm:py-8"
        >
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-8 text-center text-primary">User Management</h1>

            <div className="mb-4 sm:mb-8">
                <div className="relative">
                    <Input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8 sm:pl-10 text-sm sm:text-base"
                    />
                    <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                </div>
            </div>

            {isLoading ? <Loading /> : (
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Posts</TableHead>
                                <TableHead>Followers</TableHead>
                                <TableHead>Following</TableHead>
                                <TableHead>Status</TableHead>
                                {/*<TableHead>Actions</TableHead>*/}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any*/}
                            {users?.data?.map((user: any) => (
                                <TableRow key={user._id}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center space-x-2">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={user.profilePicture} />
                                                <AvatarFallback>{user?.user?.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <span>{user?.user?.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{user?.user?.email}</TableCell>
                                    <TableCell>{user.posts?.length || 0}</TableCell>
                                    <TableCell>{user.followers?.length || 0}</TableCell>
                                    <TableCell>{user.following?.length || 0}</TableCell>
                                    <TableCell>
                                        <Badge variant={user.verified ? "secondary" : "outline"}>
                                            {user.verified ? "Verified" : "Unverified"}
                                        </Badge>
                                    </TableCell>

                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </motion.div>
    );
};

export default UserManagement;
