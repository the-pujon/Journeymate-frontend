/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import React,{ useState } from 'react';
import { useGetPostByIdQuery,useUpvotePostMutation,useDownvotePostMutation } from '@/redux/features/post/postApi';
import { useGetCommentsByPostIdQuery,useCreateCommentMutation,useEditCommentMutation,useDeleteCommentMutation,useVoteCommentMutation } from '@/redux/features/comment/commentApi';
import { useAppSelector } from '@/redux/hook';
import { selectCurrentUser } from '@/redux/features/auth/authSlice';
import Image from 'next/image';
import { format } from 'date-fns';
import { Avatar,AvatarFallback,AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ThumbsUp,ThumbsDown,MessageSquare,Calendar,RefreshCw,Share2,BookOpen,Users,Crown,Bookmark,Tag,Link2,Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card,CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from 'sonner';
import { Comment } from '@/components/shared/Comment';
import { Popover,PopoverContent,PopoverTrigger } from "@/components/ui/popover";
import Link from 'next/link';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import Loading from '@/components/shared/Loading';
import { motion } from 'framer-motion';
import { useGetVoteQuery } from '@/redux/features/vote/voteApi';

const PostDetailsPage = ({ params }: { params: { postId: string } }) => {
    const { data: postData,isLoading: isPostLoading } = useGetPostByIdQuery(params.postId);
    const { data: commentsData,isLoading: areCommentsLoading } = useGetCommentsByPostIdQuery(params.postId);
    const [createComment,{ isLoading: isCreatingComment }] = useCreateCommentMutation();
    const [editComment,{ isLoading: isEditingComment }] = useEditCommentMutation();
    const [deleteComment,{ isLoading: isDeletingComment }] = useDeleteCommentMutation();
    const [newComment,setNewComment] = useState('');
    const [replyingTo,setReplyingTo] = useState<string | null>(null);
    const [upvotePost,{ isLoading: isUpvotingPost }] = useUpvotePostMutation();
    const [downvotePost,{ isLoading: isDownvotingPost }] = useDownvotePostMutation();

    const { data: voteData,isLoading: isVotingPost } = useGetVoteQuery(params.postId);

    const currentUser = useAppSelector(selectCurrentUser);
    const currentUserId = currentUser?._id;

    if (isPostLoading || areCommentsLoading) {
        return <Loading />;
    }

    const post = postData?.data;
    const comments = commentsData?.data || [];

    if (!post) {
        return <div className="flex justify-center items-center h-screen">Post not found</div>;
    }

    const handleCreateComment = async () => {
        try {
            await createComment({ content: newComment,post: params.postId,parentComment: replyingTo }).unwrap();
            setNewComment('');
            setReplyingTo(null);
            toast.success("Comment posted successfully");
        } catch (error) {
            toast.error("Failed to post comment");
        }
    };

    const handleEditComment = async (commentId: string,content: string) => {
        try {
            await editComment({ commentId,data: { content } }).unwrap();
            toast.success("Comment updated successfully");
        } catch (error) {
            toast.error("Failed to update comment");
        }
    };

    const handleDeleteComment = async (commentId: string) => {
        try {
            await deleteComment({ commentId }).unwrap();
            toast.success("Comment deleted successfully");
        } catch (error) {
            toast.error("Failed to delete comment");
        }
    };



    const handleVote = async (voteType: 'up' | 'down') => {
        try {
            if (voteType === 'up') {
                await upvotePost(params.postId).unwrap();
                toast.success("Post upvoted successfully");
            } else {
                await downvotePost(params.postId).unwrap();
                toast.success("Post downvoted successfully");
            }
        } catch (error) {
            toast.error(`Failed to ${voteType}vote post`);
        }
    };

    const handleShare = async () => {
        const postUrl = `${window.location.origin}/posts/${params.postId}`;
        try {
            await navigator.clipboard.writeText(postUrl);
            toast.success("Link copied to clipboard!");
        } catch (err) {
            toast.error("Failed to copy link");
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0,y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 100
            }
        }
    };

    return (
        <motion.div
            className="min-h-screen"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <div className="container mx-auto px-4 py-6 sm:py-8 md:py-12 max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                    <motion.div className="lg:col-span-2" variants={itemVariants}>
                        <Card className="mb-6 sm:mb-8 overflow-hidden shadow-lg rounded-xl">
                            <CardContent className="p-0">
                                {post.image && post.image.length > 0 && (
                                    <div className="relative">
                                        {post.premium && (
                                            <div className="absolute top-2 left-2 bg-gradient-to-r from-secondary to-primary text-white px-3 py-1 text-xs rounded-full shadow-md z-10">
                                                <Crown className="h-3 w-3 inline-block mr-1" /> Premium
                                            </div>
                                        )}
                                        <Carousel className="w-full"
                                            plugins={[
                                                Autoplay({
                                                    delay: 2000,
                                                }),
                                            ]}
                                        >
                                            <CarouselContent>
                                                {post.image.map((img: string,index: number) => (
                                                    <CarouselItem key={index}>
                                                        <div className="relative h-[200px] sm:h-[300px] md:h-[400px] lg:h-[500px]">
                                                            <Image
                                                                src={img}
                                                                alt={`${post.title} - Image ${index + 1}`}
                                                                fill
                                                                className="object-cover"
                                                            />
                                                        </div>
                                                    </CarouselItem>
                                                ))}
                                            </CarouselContent>
                                            <CarouselPrevious />
                                            <CarouselNext />
                                        </Carousel>
                                        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-black to-transparent">
                                            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 text-white">{post.title}</h1>
                                            <div className="flex items-center space-x-4">
                                                <Avatar className="h-8 w-8 sm:h-10 sm:w-10 border-2 border-white">
                                                    <AvatarImage src={post.author.profilePicture || ''} alt={post.author.user.name} />
                                                    <AvatarFallback>{post.author.user.name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-semibold text-sm sm:text-base text-white">{post.author.user.name}</p>
                                                    <p className="text-xs sm:text-sm text-gray-300">{format(new Date(post.createdAt),'PPP')}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {post.image && post.image.length > 1 && (
                                    <div className="p-4 overflow-x-auto">
                                        <div className="flex space-x-2">
                                            {post.image.map((img: string,index: number) => (
                                                <div
                                                    key={index}
                                                    className="relative w-20 h-20 flex-shrink-0 cursor-pointer"
                                                >
                                                    <Image
                                                        src={img}
                                                        alt={`${post.title} - Thumbnail ${index + 1}`}
                                                        fill
                                                        className="object-cover rounded-md"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                <div className="p-4 sm:p-6 md:p-8">
                                    <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
                                        <Badge variant="outline" className="px-2 py-1 text-xs"><Bookmark className="h-3 w-3 mr-1" />{post.category}</Badge>
                                        {post.tags?.map((tag: string,index: number) => (
                                            <Badge key={index} variant="secondary" className="px-2 py-1 text-xs">
                                                <Tag className="h-3 w-3 mr-1" />
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                    <div className="reactQuillRichText max-w-none mb-6" dangerouslySetInnerHTML={{ __html: post.content }}></div>
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs sm:text-sm text-gray-500 mb-6">
                                        <span className="flex items-center mb-2 sm:mb-0"><Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1" /> Created: {format(new Date(post.createdAt),'PPP')}</span>
                                        <span className="flex items-center"><RefreshCw className="w-3 h-3 sm:w-4 sm:h-4 mr-1" /> Updated: {format(new Date(post.updatedAt),'PPP')}</span>
                                    </div>
                                    <Separator className="my-4 sm:my-6" />
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                                        <div className="flex flex-wrap items-center gap-2 mb-4 sm:mb-0">
                                            <Button
                                                variant="outline"
                                                className="flex items-center space-x-1"
                                                onClick={() => handleVote('up')}
                                                size="sm"
                                                disabled={voteData?.success && voteData?.data?.user === currentUserId && voteData?.data?.voteType === 'upvote'}

                                            >
                                                {
                                                    isUpvotingPost ? <Loader2 className="animate-spin" /> : <>
                                                        <ThumbsUp className={`w-3 h-3 sm:w-4 sm:h-4 ${voteData?.success && voteData?.data?.user === currentUserId && voteData?.data?.voteType === 'upvote' ? 'text-green-500' : ''}`} />
                                                        <span className="text-xs sm:text-sm">{post.upVotes}</span>
                                                    </>
                                                }
                                            </Button>
                                            <Button
                                                variant="outline"
                                                className="flex items-center space-x-1"
                                                onClick={() => handleVote('down')}
                                                size="sm"
                                                disabled={voteData?.success && voteData?.data?.user === currentUserId && voteData?.data?.voteType === 'downvote'}
                                            >
                                                {
                                                    isDownvotingPost ? <Loader2 className="animate-spin" /> : <>
                                                        <ThumbsDown className={`w-3 h-3 sm:w-4 sm:h-4  ${voteData?.success && voteData?.data?.user === currentUserId && voteData?.data?.voteType === 'downvote' ? 'text-red-500' : ''}`} />
                                                        <span className="text-xs sm:text-sm">{post.downVotes}</span>
                                                    </>
                                                }
                                            </Button>
                                            <Button variant="outline" className="flex items-center space-x-1" size="sm">
                                                <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4" />
                                                <span className="text-xs sm:text-sm">{post.totalComments}</span>
                                            </Button>
                                        </div>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button variant="outline" size="sm" className="flex items-center space-x-1">
                                                    <Share2 className="w-3 h-3 sm:w-4 sm:h-4" />
                                                    <span className="text-xs sm:text-sm">Share</span>
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-2">
                                                <div className="flex space-x-2">
                                                    <Button variant="outline" size="icon" onClick={() => handleShare()}>
                                                        <Link2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <motion.div variants={itemVariants}>
                            <Card className="mb-6 sm:mb-8 shadow-lg rounded-xl">
                                <CardContent className="p-4 sm:p-6">
                                    <h2 className="text-xl sm:text-2xl font-semibold mb-4">Comments</h2>
                                    <Textarea
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        placeholder={replyingTo ? "Write a reply..." : "Write a comment..."}
                                        className="mb-4"
                                    />
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                                        <Button
                                            disabled={isCreatingComment}
                                            onClick={handleCreateComment}
                                            className="w-full sm:w-auto bg-primary text-white hover:bg-primary-dark"
                                        >
                                            {isCreatingComment ? <Loader2 className="animate-spin " /> : replyingTo ? "Post Reply" : "Post Comment"}
                                        </Button>
                                        {replyingTo && (
                                            <Button variant="outline" onClick={() => setReplyingTo(null)} className="w-full sm:w-auto">
                                                Cancel Reply
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        <motion.div className="space-y-4 sm:space-y-6" variants={containerVariants}>
                            {comments.map((comment: any) => (
                                <motion.div key={comment._id} variants={itemVariants}>
                                    <Comment
                                        comment={comment}
                                        onReply={(commentId: string) => setReplyingTo(commentId)}
                                        onEdit={handleEditComment}
                                        onDelete={handleDeleteComment}
                                        currentUserId={currentUserId}
                                        isEditingComment={isEditingComment}
                                        isDeletingComment={isDeletingComment}
                                    />
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>

                    <motion.div className="lg:col-span-1" variants={itemVariants}>
                        <div className="sticky top-20 space-y-6">
                            <Card className="shadow-lg rounded-xl overflow-hidden">
                                <CardContent className="p-0">
                                    <div className="relative h-24 sm:h-32 bg-gradient-to-r from-primary to-primary-dark">
                                        <Image
                                            src={post.image[0]}
                                            alt={post.title}
                                            fill
                                            className="w-full object-cover rounded-t-xl"
                                        />
                                    </div>
                                    <div className="p-4 sm:p-6 -mt-12 sm:-mt-16">
                                        <Avatar className="h-20 w-20 sm:h-24 sm:w-24 border-4 border-white mb-4">
                                            <AvatarImage src={post.author.profilePicture || ''} alt={post.author.user.name} />
                                            <AvatarFallback>{post.author.user.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <Link href={`/profile/${post.author.user._id}`}>
                                            <h2 className="text-xl sm:text-2xl font-semibold mb-2">{post.author.user.name}</h2>
                                        </Link>
                                        <p className="text-xs sm:text-sm mb-4">{post.author.bio}</p>
                                        <div className="flex justify-between text-xs sm:text-sm text-gray-500 mb-4">
                                            <span className="flex items-center"><Users className="w-3 h-3 sm:w-4 sm:h-4 mr-1" /> {post.author.followers.length} followers</span>
                                            <span className="flex items-center"><BookOpen className="w-3 h-3 sm:w-4 sm:h-4 mr-1" /> {post.author.posts.length} posts</span>
                                        </div>
                                        {post.author.verified && (
                                            <Badge variant="secondary" className="w-full justify-center text-xs sm:text-sm">Verified Author</Badge>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

export default PostDetailsPage;