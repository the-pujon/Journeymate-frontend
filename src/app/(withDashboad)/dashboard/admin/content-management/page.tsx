'use client'

import React,{ useState,useEffect,useCallback } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useGetPostsQuery,useDeletePostMutation } from '@/redux/features/post/postApi';
import { Card,CardContent,CardDescription,CardFooter,CardHeader,CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertDialog,AlertDialogAction,AlertDialogCancel,AlertDialogContent,AlertDialogDescription,AlertDialogFooter,AlertDialogHeader,AlertDialogTitle,AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Loader2,Trash2,ThumbsUp,ThumbsDown,MessageSquare,Tag,Calendar,Bookmark,ExternalLink,Crown,Image as ImageIcon,Search } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from "@/components/ui/badge";
import { Avatar,AvatarFallback,AvatarImage } from "@/components/ui/avatar";
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import Loading from '@/components/shared/Loading';
import { Input } from "@/components/ui/input";
import { Select,SelectContent,SelectItem,SelectTrigger,SelectValue } from "@/components/ui/select";
import { useDebounce } from '@/hooks/useDebounce';
import { withAuth } from '@/components/auth/withAuth';


interface Post {
    _id: string;
    title: string;
    content: string;
    author: {
        user: {
            name: string;
        };
        profilePicture: string;
        verified: boolean;
    };
    category: string;
    createdAt: string;
    upVotes: number;
    downVotes: number;
    totalComments: number;
    image: string[];
    tags: string[];
    premium: boolean;
}

const ContentManagement = () => {
    const [searchTerm,setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm,300);
    const [category,setCategory] = useState('all');
    const [sortOrder,setSortOrder] = useState('desc');
    const [page,setPage] = useState(1);

    const [deletePost,{ isLoading: isDeleting }] = useDeletePostMutation();

    const { data: postsData,isLoading: postsLoading,isFetching,error } = useGetPostsQuery({
        searchTerm: debouncedSearchTerm,
        category,
        sortOrder: sortOrder || undefined,
        page,
        limit: 200,
    });

    useEffect(() => {
        setPage(1);
    },[debouncedSearchTerm,category,sortOrder]);

    const fetchMoreData = useCallback(() => {
        if (!isFetching && postsData?.data?.hasMore) {
            setPage(prevPage => prevPage + 1);
        }
    },[isFetching,postsData?.data?.hasMore]);

    if (postsLoading && page === 1) return <Loading />;

    if (error) {
        console.error("Error fetching posts:",error);
        return <div>Error: {JSON.stringify(error)}</div>;
    }

    const posts = postsData?.data?.posts || [];
    const hasMore = postsData?.data?.hasMore || false;

    const handleDeletePost = async (id: string) => {
        try {
            await deletePost(id).unwrap();
            toast.success('Post deleted successfully');
        } catch (error) {
            toast.error('Failed to delete post');
            console.error(error)
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="container mx-auto sm:px-4 py-8 sm:py-12"
        >
            <h1 className="text-3xl sm:text-4xl font-bold mb-8 sm:mb-12 text-center text-primary">Content Management</h1>

            <div className="mb-8 flex flex-col sm:flex-row gap-4">
                <div className="relative flex-grow">
                    <Input
                        type="text"
                        placeholder="Search posts..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                </div>
                <div className="flex flex-col sm:flex-row gap-4 sm:w-auto">
                    <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="adventure">Adventure</SelectItem>
                            <SelectItem value="traveling">Traveling</SelectItem>
                            <SelectItem value="tourism">Tourism</SelectItem>
                            <SelectItem value="business travel">Business Travel</SelectItem>
                            <SelectItem value="culture">Culture</SelectItem>
                            <SelectItem value="exploration">Exploration</SelectItem>
                            <SelectItem value="hiking">Hiking</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={sortOrder} onValueChange={setSortOrder}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="asc">Most Upvotes</SelectItem>
                            <SelectItem value="desc">Least Upvotes</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <InfiniteScroll
                dataLength={posts.length}
                next={fetchMoreData}
                hasMore={hasMore}
                loader={<Loading />}
                endMessage={
                    <p className="text-center mt-4">
                        <b>No more posts to load</b>
                    </p>
                }
            >
                <div className="grid gap-6 sm:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {posts.map((post: Post,index: number) => (
                        <motion.div
                            key={post._id || index}
                            initial={{ opacity: 0,y: 20 }}
                            animate={{ opacity: 1,y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Card className="flex flex-col h-full hover:shadow-xl transition-shadow duration-300 bg-card relative overflow-hidden">
                                {post.premium && (
                                    <div className="absolute top-0 left-0 bg-gradient-to-l from-secondary to-primary text-white px-3 py-1 text-xs rounded-br-md shadow-md z-10">
                                        <Crown className="h-3 w-3 inline-block mr-1" /> Premium
                                    </div>
                                )}
                                {post.image && post.image.length > 0 && (
                                    <div className="relative w-full h-40 sm:h-48 overflow-hidden">
                                        <Image
                                            src={post.image[0]}
                                            alt={post.title}
                                            layout="fill"
                                            objectFit="cover"
                                            className="transition-transform duration-300 hover:scale-105"
                                        />
                                    </div>
                                )}
                                <CardHeader className="pb-3">
                                    <div className="flex justify-between items-start mb-2">
                                        <CardTitle className="truncate text-lg sm:text-xl text-primary flex-grow pr-2">{post.title}</CardTitle>
                                        <Badge variant="secondary" className="ml-2 flex-shrink-0">
                                            <Bookmark className="h-3 w-3 mr-1" />
                                            {post.category}
                                        </Badge>
                                    </div>
                                    <CardDescription className="flex items-center mt-2">
                                        <Avatar className="h-6 w-6 mr-2">
                                            <AvatarImage src={post.author.profilePicture} />
                                            <AvatarFallback>{post.author.user?.name?.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <span className="text-xs sm:text-sm text-muted-foreground">{post.author.user?.name}</span>
                                        {post.author.verified && (
                                            <Badge variant="secondary" className="ml-2 text-xs">Verified</Badge>
                                        )}
                                    </CardDescription>
                                    <div className="text-xs text-muted-foreground mt-2 flex items-center">
                                        <Calendar className="h-3 w-3 mr-1" />
                                        {new Date(post.createdAt).toLocaleDateString()}
                                    </div>
                                </CardHeader>
                                <CardContent className="flex-grow">
                                    <p className="line-clamp-3 text-xs sm:text-sm text-card-foreground reactQuillRichText" dangerouslySetInnerHTML={{ __html: post.content }}></p>
                                    <div className="flex items-center mt-4 space-x-4 text-xs sm:text-sm text-muted-foreground">
                                        <span className="flex items-center">
                                            <ThumbsUp className="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-green-500" /> {post.upVotes}
                                        </span>
                                        <span className="flex items-center">
                                            <ThumbsDown className="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-red-500" /> {post.downVotes}
                                        </span>
                                        <span className="flex items-center">
                                            <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-blue-500" /> {post.totalComments}
                                        </span>
                                        {post.image && post.image.length > 1 && (
                                            <span className="flex items-center">
                                                <ImageIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-purple-500" /> {post.image.length}
                                            </span>
                                        )}
                                    </div>
                                    <div className="mt-4 flex flex-wrap">
                                        {post.tags && post.tags.map((tag: string,index: number) => (
                                            <Badge key={index} variant="outline" className="mr-2 mb-2 text-xs"><Tag className="h-3 w-3 mr-1" />{tag}</Badge>
                                        ))}
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-between items-center pt-4 border-t">
                                    <Button variant="secondary" size="sm" className="text-xs sm:text-sm">
                                        <Link href={`/posts/${post._id}`} className="flex items-center">
                                            <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                                            See Full Post
                                        </Link>
                                    </Button>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="destructive" size="sm" className="text-xs sm:text-sm">
                                                <Trash2 className="mr-2 h-3 w-3 sm:h-4 sm:w-4" /> Delete
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This action cannot be undone. This will permanently delete the post.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleDeletePost(post._id)}>
                                                    {isDeleting ? <Loader2 className="animate-spin mr-2" /> : null}
                                                    Delete
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </InfiniteScroll>
        </motion.div>
    );
};

export default withAuth(ContentManagement,['admin']);