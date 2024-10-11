/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { CheckCircle,Loader2,Users } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Avatar,AvatarFallback,AvatarImage } from "@/components/ui/avatar";
import { Card,CardContent,CardDescription,CardHeader,CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useFollowUserMutation,useUnfollowUserMutation } from '@/redux/features/user/userApi';
import { toast } from 'sonner';

interface UserCardProps {
    user: {
        _id: string;
        user: {
            name: string;
            email: string;
            _id: string;
        };
        profilePicture?: string;
        verified?: boolean;
        followers?: any[];
        following?: any[];
    };
    //onFollowToggle: (userId: string) => void;
    isFollowing: boolean;
}

const UserCard: React.FC<UserCardProps> = ({ user,isFollowing }) => {

    const [followUser,{ isLoading: followLoading }] = useFollowUserMutation();
    const [unfollowUser,{ isLoading: unfollowLoading }] = useUnfollowUserMutation();

    const followHandler = async (userId: string,isFollowing: boolean) => {
        try {
            if (isFollowing) {
                await unfollowUser({ unfollowId: userId });
                toast.success('Unfollowed successfully');
            } else {
                await followUser({ followId: userId });
                toast.success('Followed successfully');
            }
        } catch (error) {
            toast.error('Something went wrong');
            console.log(error);
        }
    };

    return (
        <Card className="mb-4">
            <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                    <div className="flex items-center space-x-4">
                        <Avatar>
                            <AvatarImage src={user?.profilePicture} alt={user?.user?.name} />
                            <AvatarFallback>{user?.user?.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="flex items-center space-x-2">
                                <CardTitle>{user?.user.name}</CardTitle>
                                {user?.verified && (
                                    <Badge variant="secondary">
                                        <CheckCircle className="w-3 h-3 mr-1" />
                                        Verified
                                    </Badge>
                                )}
                            </div>
                            <CardDescription>{user?.user.email}</CardDescription>
                        </div>
                    </div>
                    <Button
                        className="w-full sm:w-auto"
                        //onClick={() => onFollowToggle(user._id)}
                        onClick={() => followHandler(user?.user._id,isFollowing)}
                        disabled={followLoading || unfollowLoading}
                    >
                        {isFollowing ? 'Unfollow' : 'Follow'}
                        {followLoading || unfollowLoading && <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 ml-2 animate-spin" />}
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col sm:flex-row justify-between text-sm text-gray-500 space-y-2 sm:space-y-0">
                    <span className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {user?.followers?.length || 0} Followers
                    </span>
                    <span className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {user?.following?.length || 0} Following
                    </span>
                </div>
            </CardContent>
        </Card>
    );
};

export default UserCard;