/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React,{ useState } from 'react';
import { Avatar,AvatarFallback,AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { format } from 'date-fns';
import { Reply,Edit,Trash2,Loader2 } from "lucide-react";
import { motion,AnimatePresence } from 'framer-motion';

interface CommentProps {
    comment: any;
    onReply: (commentId: string) => void;
    onEdit: (commentId: string,content: string) => void;
    onDelete: (commentId: string) => void;
    depth?: number;
    currentUserId: string | undefined;
    isEditingComment: boolean;
    isDeletingComment: boolean;
}

export const Comment: React.FC<CommentProps> = ({
    comment,
    onReply,
    onEdit,
    onDelete,
    depth = 0,
    currentUserId,
    isEditingComment,
    isDeletingComment
}) => {
    const [isEditing,setIsEditing] = useState(false);
    const [editedContent,setEditedContent] = useState(comment.content);


    const isAuthor = comment.user === currentUserId;

    const commentVariants = {
        hidden: { opacity: 0,y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 100
            }
        },
        exit: {
            opacity: 0,
            y: -20,
            transition: {
                duration: 0.2
            }
        }
    };

    return (
        <motion.div
            className={`my-2 sm:my-4 ${depth > 0 ? 'ml-4 sm:ml-8 pl-2 sm:pl-4 border-l-2 border-gray-200' : ''}`}
            variants={commentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
        >
            <div className="flex items-start space-x-2 sm:space-x-4">
                <Avatar className="h-6 w-6 sm:h-8 sm:w-8">
                    <AvatarImage src={comment?.author?.profilePicture || ''} alt={comment?.author?.user?.name} />
                    <AvatarFallback>{comment?.author?.user?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-grow">
                    <div className="flex items-center space-x-2 mb-1">
                        <span className="font-semibold text-sm sm:text-base">{comment?.author?.user?.name}</span>
                        <span className="text-xs text-gray-500">{format(new Date(comment?.createdAt),'PPP')}</span>
                    </div>
                    <AnimatePresence mode="wait">
                        {isEditing ? (
                            <motion.div
                                key="editing"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <Textarea
                                    value={editedContent}
                                    onChange={(e) => setEditedContent(e.target.value)}
                                    className="mb-2 text-sm sm:text-base"
                                />
                            </motion.div>
                        ) : (
                            <motion.p
                                key="content"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="mb-2 text-gray-700 text-sm sm:text-base"
                            >
                                {comment.content}
                            </motion.p>
                        )}
                    </AnimatePresence>
                    <div className="flex flex-wrap items-center gap-0 sm:gap-4 text-xs sm:text-sm">
                        {depth === 0 && (
                            <Button variant="ghost" size="sm" onClick={() => onReply(comment._id)}>
                                <Reply className="w-3 h-3 sm:w-4 sm:h-4 mr-1" /> Reply
                            </Button>
                        )}
                        {isAuthor && (
                            <>
                                {isEditing ? (
                                    <>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                                onEdit(comment._id,editedContent);
                                                setIsEditing(false);
                                            }}
                                            disabled={isEditingComment}
                                        >
                                            {isEditingComment ? <Loader2 className="animate-spin" /> : 'Save'}
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setIsEditing(false)}
                                            disabled={isEditingComment}
                                        >
                                            Cancel
                                        </Button>
                                    </>
                                ) : (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setIsEditing(true)}
                                        disabled={isEditingComment}
                                    >
                                        <Edit className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                    </Button>
                                )}
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onDelete(comment._id)}
                                    disabled={isDeletingComment}
                                >
                                    {isDeletingComment ? <Loader2 className="animate-spin" /> : <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />}
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </div>
            <AnimatePresence>
                {comment.replies && comment.replies.map((reply: any) => (
                    <Comment
                        key={reply._id}
                        comment={reply}
                        onReply={onReply}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        depth={depth + 1}
                        currentUserId={currentUserId}
                        isEditingComment={isEditingComment}
                        isDeletingComment={isDeletingComment}
                    />
                ))}
            </AnimatePresence>
        </motion.div>
    );
};
