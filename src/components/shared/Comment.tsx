"use client"

import React,{ useState } from 'react';
import { Avatar,AvatarFallback,AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { format } from 'date-fns';
import { toast } from 'sonner';
import { ThumbsUp,ThumbsDown,Reply,Edit,Trash2 } from "lucide-react";

export const Comment = ({ comment,onReply,onEdit,onDelete,onVote,depth = 0,currentUserId }) => {
    const [isEditing,setIsEditing] = useState(false);
    const [editedContent,setEditedContent] = useState(comment.content);

    const handleVote = async (voteType) => {
        try {
            await onVote(comment._id,voteType);
            toast.success(`${voteType === 'up' ? 'Upvoted' : 'Downvoted'} comment`);
        } catch (error) {
            toast.error("Failed to vote comment");
        }
    };

    const isAuthor = comment.user === currentUserId;

    return (
        <div className={`my-2 sm:my-4 ${depth > 0 ? 'ml-4 sm:ml-8 pl-2 sm:pl-4 border-l-2 border-gray-200' : ''}`}>
            <div className="flex items-start space-x-2 sm:space-x-4">
                <Avatar className="h-6 w-6 sm:h-8 sm:w-8">
                    <AvatarImage src={comment?.author?.avatar || ''} alt={comment?.author?.name} />
                    <AvatarFallback>{comment?.author?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-grow">
                    <div className="flex items-center space-x-2 mb-1">
                        <span className="font-semibold text-sm sm:text-base">{comment?.author?.name}</span>
                        <span className="text-xs text-gray-500">{format(new Date(comment?.createdAt),'PPP')}</span>
                    </div>
                    {isEditing ? (
                        <Textarea
                            value={editedContent}
                            onChange={(e) => setEditedContent(e.target.value)}
                            className="mb-2 text-sm sm:text-base"
                        />
                    ) : (
                        <p className="mb-2 text-gray-700 text-sm sm:text-base">{comment.content}</p>
                    )}
                    <div className="flex flex-wrap items-center gap-0 sm:gap-4 text-xs sm:text-sm">
                        <Button variant="ghost" size="sm" onClick={() => handleVote('up')}>
                            <ThumbsUp className={`w-3 h-3 sm:w-4 sm:h-4 mr-1 ${comment.userVote === 'up' ? 'text-green-500' : ''}`} /> {comment.upVotes}
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleVote('down')}>
                            <ThumbsDown className={`w-3 h-3 sm:w-4 sm:h-4 mr-1 ${comment.userVote === 'down' ? 'text-red-500' : ''}`} /> {comment.downVotes}
                        </Button>
                        {depth === 0 && (
                            <Button variant="ghost" size="sm" onClick={() => onReply(comment._id)}>
                                <Reply className="w-3 h-3 sm:w-4 sm:h-4 mr-1" /> Reply
                            </Button>
                        )}
                        {isAuthor && (
                            <>
                                {isEditing ? (
                                    <>
                                        <Button variant="ghost" size="sm" onClick={() => {
                                            onEdit(comment._id,editedContent);
                                            setIsEditing(false);
                                        }}>
                                            Save
                                        </Button>
                                        <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>
                                            Cancel
                                        </Button>
                                    </>
                                ) : (
                                    <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
                                        <Edit className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                    </Button>
                                )}
                                <Button variant="ghost" size="sm" onClick={() => onDelete(comment._id)}>
                                    <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </div>
            {comment.replies && comment.replies.map((reply) => (
                <Comment
                    key={reply._id}
                    comment={reply}
                    onReply={onReply}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onVote={onVote}
                    depth={depth + 1}
                    currentUserId={currentUserId}
                />
            ))}
        </div>
    );
};
