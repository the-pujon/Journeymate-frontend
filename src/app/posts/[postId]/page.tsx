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
import { ThumbsUp,ThumbsDown,MessageSquare,Calendar,RefreshCw,Share2,BookOpen,Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card,CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from 'sonner';
import { Comment } from '@/components/shared/Comment';

const PostDetailsPage = ({ params }: { params: { postId: string } }) => {
    const { data: postData,isLoading: isPostLoading } = useGetPostByIdQuery(params.postId);
    const { data: commentsData,isLoading: areCommentsLoading } = useGetCommentsByPostIdQuery(params.postId);
    const [createComment] = useCreateCommentMutation();
    const [editComment] = useEditCommentMutation();
    const [deleteComment] = useDeleteCommentMutation();
    const [voteComment] = useVoteCommentMutation();
    const [newComment,setNewComment] = useState('');
    const [replyingTo,setReplyingTo] = useState(null);
    const [upvotePost] = useUpvotePostMutation();
    const [downvotePost] = useDownvotePostMutation();

    const currentUser = useAppSelector(selectCurrentUser);
    const currentUserId = currentUser?._id;

    if (isPostLoading || areCommentsLoading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
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

    const handleEditComment = async (commentId,content) => {
        try {
            await editComment({ commentId,data: { content } }).unwrap();
            toast.success("Comment updated successfully");
        } catch (error) {
            toast.error("Failed to update comment");
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            await deleteComment({ commentId }).unwrap();
            toast.success("Comment deleted successfully");
        } catch (error) {
            toast.error("Failed to delete comment");
        }
    };

    const handleVoteComment = async (commentId,voteType) => {
        try {
            await voteComment({ commentId,voteType }).unwrap();
        } catch (error) {
            toast.error("Failed to vote comment");
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

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <Card className="mb-8 overflow-hidden shadow-xl rounded-xl">
                            <CardContent className="p-0">
                                {post.image && post.image.length > 0 && (
                                    <div className="relative">
                                        <Badge
                                            variant={post.premium ? "default" : "secondary"}
                                            className="absolute top-4 left-4 z-10 text-sm px-3 py-1"
                                        >
                                            {post.premium ? "Premium" : "Free"}
                                        </Badge>
                                        <Image
                                            src={post.image[0]}
                                            alt={post.title}
                                            width={1000}
                                            height={500}
                                            className="w-full h-[400px] lg:h-[500px] object-cover rounded-t-xl"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-60"></div>
                                        <div className="absolute bottom-0 left-0 p-6 text-white">
                                            <h1 className="text-4xl font-bold mb-2">{post.title}</h1>
                                            <div className="flex items-center space-x-4">
                                                <Avatar className="h-10 w-10 border-2 border-white">
                                                    <AvatarImage src={post.author.profilePicture || ''} alt={post.author.user.name} />
                                                    <AvatarFallback>{post.author.user.name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-semibold">{post.author.user.name}</p>
                                                    <p className="text-sm opacity-75">{format(new Date(post.createdAt),'PPP')}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div className="p-8">
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        <Badge variant="outline" className="px-3 py-1 text-sm">{post.category}</Badge>
                                        {post.tags?.map((tag,index) => (
                                            <Badge key={index} variant="secondary" className="px-3 py-1 text-sm">{tag}</Badge>
                                        ))}
                                    </div>
                                    <div className="prose max-w-none mb-6">{post.content}</div>
                                    <div className="flex justify-between items-center text-sm text-gray-500 mb-6">
                                        <span className="flex items-center"><Calendar className="w-4 h-4 mr-1" /> Created: {format(new Date(post.createdAt),'PPP')}</span>
                                        <span className="flex items-center"><RefreshCw className="w-4 h-4 mr-1" /> Updated: {format(new Date(post.updatedAt),'PPP')}</span>
                                    </div>
                                    <Separator className="my-6" />
                                    <div className="flex justify-between items-center">
                                        <div className="flex space-x-4">
                                            <Button
                                                variant="outline"
                                                className="flex items-center space-x-2"
                                                onClick={() => handleVote('up')}
                                            >
                                                <ThumbsUp className={`w-4 h-4 ${post.userVote === 'up' ? 'text-green-500' : ''}`} />
                                                <span>{post.upVotes}</span>
                                            </Button>
                                            <Button
                                                variant="outline"
                                                className="flex items-center space-x-2"
                                                onClick={() => handleVote('down')}
                                            >
                                                <ThumbsDown className={`w-4 h-4 ${post.userVote === 'down' ? 'text-red-500' : ''}`} />
                                                <span>{post.downVotes}</span>
                                            </Button>
                                            <Button variant="outline" className="flex items-center space-x-2">
                                                <MessageSquare className="w-4 h-4" />
                                                <span>{post.totalComments}</span>
                                            </Button>
                                        </div>
                                        <Button variant="outline" className="flex items-center space-x-2">
                                            <Share2 className="w-4 h-4" />
                                            <span>Share</span>
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="mb-8 shadow-lg rounded-xl">
                            <CardContent className="p-6">
                                <h2 className="text-2xl font-semibold mb-4">Comments</h2>
                                <Textarea
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder={replyingTo ? "Write a reply..." : "Write a comment..."}
                                    className="mb-4"
                                />
                                <div className="flex justify-between items-center">
                                    <Button onClick={handleCreateComment} className="bg-primary text-white hover:bg-primary-dark">
                                        {replyingTo ? "Post Reply" : "Post Comment"}
                                    </Button>
                                    {replyingTo && (
                                        <Button variant="outline" onClick={() => setReplyingTo(null)}>
                                            Cancel Reply
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <div className="space-y-4">
                            {comments.map((comment) => (
                                <Comment
                                    key={comment._id}
                                    comment={comment}
                                    onReply={(commentId) => setReplyingTo(commentId)}
                                    onEdit={handleEditComment}
                                    onDelete={handleDeleteComment}
                                    onVote={handleVoteComment}
                                    currentUserId={currentUserId}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="sticky top-4 space-y-6">
                            <Card className="shadow-lg rounded-xl overflow-hidden">
                                <CardContent className="p-0">
                                    <div className="relative h-32 bg-gradient-to-r from-primary to-primary-dark"></div>
                                    <div className="p-6 -mt-16">
                                        <Avatar className="h-24 w-24 border-4 border-white mb-4">
                                            <AvatarImage src={post.author.profilePicture || ''} alt={post.author.user.name} />
                                            <AvatarFallback>{post.author.user.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <h2 className="text-2xl font-semibold mb-2">{post.author.user.name}</h2>
                                        <p className="text-sm text-gray-500 mb-4">{post.author.user.email}</p>
                                        <p className="text-sm mb-4">{post.author.bio}</p>
                                        <div className="flex justify-between text-sm text-gray-500 mb-4">
                                            <span className="flex items-center"><Users className="w-4 h-4 mr-1" /> {post.author.followers.length} followers</span>
                                            <span className="flex items-center"><BookOpen className="w-4 h-4 mr-1" /> {post.author.posts.length} posts</span>
                                        </div>
                                        {post.author.verified && (
                                            <Badge variant="secondary" className="w-full justify-center">Verified Author</Badge>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostDetailsPage;
