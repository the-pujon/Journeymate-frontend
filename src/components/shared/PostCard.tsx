/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React,{ useState } from 'react';
import { ExternalLink,ThumbsUp,ThumbsDown,MessageCircle,Tag,Bookmark,Pencil,Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Avatar,AvatarFallback,AvatarImage } from "@/components/ui/avatar";
import { Card,CardContent,CardDescription,CardFooter,CardHeader,CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from 'next/link';
import { motion } from 'framer-motion';

// Define the props interface
interface PostCardProps {
    post: any; // Replace 'any' with a proper Post interface
    userProfile: any; // Replace 'any' with a proper UserProfile interface
    //expandedPosts: string[];
    //votedPosts: { [key: string]: 'up' | 'down' | null };
    //togglePostExpansion: (postId: string) => void;
    //handleVote: (postId: string,voteType: 'up' | 'down') => void;
    //handleEditPost: (postId: string) => void;
    //handleDeletePost: (postId: string) => void;
}


const PostCard: React.FC<PostCardProps> = ({
    post,
    userProfile,
    //expandedPosts,
    //votedPosts,
    //togglePostExpansion,
    //handleVote,
    //handleEditPost,
    //handleDeletePost
}) => {

    console.log(post);
    console.log(userProfile);
    //console.log(userProfile?.data?.profilePicture)

    const [expandedPosts,setExpandedPosts] = useState<string[]>([]);
    const [votedPosts,setVotedPosts] = useState<{ [key: string]: 'up' | 'down' | null }>({});


    const togglePostExpansion = (postId: string) => {
        setExpandedPosts(prev =>
            prev.includes(postId)
                ? prev.filter(id => id !== postId)
                : [...prev,postId]
        );
    };

    const handleVote = (postId: string,voteType: 'up' | 'down') => {
        setVotedPosts(prev => ({
            ...prev,
            [postId]: prev[postId] === voteType ? null : voteType
        }));
    };

    const handleEditPost = (postId: string) => {
        console.log(`Editing post ${postId}`);
    };

    const handleDeletePost = (postId: string) => {
        console.log(`Deleting post ${postId}`);
    };




    const cardVariants = {
        hidden: { opacity: 0,y: 20 },
        visible: { opacity: 1,y: 0,transition: { duration: 0.3 } },
        exit: { opacity: 0,y: -20,transition: { duration: 0.2 } }
    };

    const contentVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1,transition: { delay: 0.2,duration: 0.3 } }
    };

    return (
        <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
        >
            <Card className="mb-6">
                <CardHeader>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                        <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                            <Avatar>
                                <AvatarImage src={userProfile?.data?.profilePicture} alt={userProfile?.data?.user.name} />
                                <AvatarFallback>{userProfile?.data?.user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <CardTitle className="text-lg">{userProfile?.data?.user.name}</CardTitle>
                                <CardDescription>{new Date(post?.createdAt).toLocaleDateString()}</CardDescription>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            {post?.premium && (
                                <Badge variant="secondary">
                                    <Bookmark className="w-4 h-4 mr-1" />
                                    Premium
                                </Badge>
                            )}
                            <Button variant="ghost" size="icon" onClick={() => handleEditPost(post?._id)}>
                                <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDeletePost(post?._id)}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <motion.div variants={contentVariants}>
                        <h3 className="text-xl font-semibold mb-2">{post?.title}</h3>
                        {post?.image && post?.image?.length > 0 && (
                            <img src={post?.image[0]} alt={post?.title} className="w-full h-48 sm:h-64 object-cover mb-4 rounded-md" />
                        )}
                        <p className={`text-gray-600 ${expandedPosts.includes(post?._id) ? '' : 'line-clamp-3'}`}>
                            {post?.content}
                        </p>
                        {post?.content?.length > 150 && (
                            <Button
                                variant="link"
                                onClick={() => togglePostExpansion(post?._id)}
                                className="mt-2 p-0 h-auto font-semibold"
                            >
                                {expandedPosts.includes(post?._id) ? 'Show less' : 'Read more'}
                            </Button>
                        )}
                        <div className="mt-4 flex flex-wrap gap-2">
                            <Badge>{post?.category}</Badge>
                            {post?.tags?.map((tag: string) => (
                                <Badge key={tag} variant="outline">
                                    <Tag className="w-3 h-3 mr-1" />
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    </motion.div>
                </CardContent>
                <CardFooter>
                    <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex flex-wrap items-center gap-0 sm:gap-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                className={`flex items-center space-x-2 ${votedPosts[post?._id] === 'up' ? 'text-green-500' : ''}`}
                                onClick={() => handleVote(post?._id,'up')}
                            >
                                <ThumbsUp className="h-5 w-5" />
                                <span>{post?.upVotes + (votedPosts[post?._id] === 'up' ? 1 : 0)}</span>
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className={`flex items-center space-x-2 ${votedPosts[post?._id] === 'down' ? 'text-red-500' : ''}`}
                                onClick={() => handleVote(post?._id,'down')}
                            >
                                <ThumbsDown className="h-5 w-5" />
                                <span>{post?.downVotes + (votedPosts[post?._id] === 'down' ? 1 : 0)}</span>
                            </Button>
                            <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                                <MessageCircle className="h-5 w-5" />
                                <span>{post?.totalComments}</span>
                            </Button>
                        </div>
                        <Link href={`/dashboard/posts/${post?._id}`} className="w-full sm:w-auto">
                            <Button variant="outline" size="sm" className="w-full">
                                <ExternalLink className="h-4 w-4 mr-2" /> View Full Post
                            </Button>
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </motion.div>
    )
}

export default PostCard