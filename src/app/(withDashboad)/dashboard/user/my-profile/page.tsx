'use client'

import React,{ useState } from 'react';
import { User,Settings,MapPin,Calendar,Link as LinkIcon,ChevronDown,ChevronUp,ThumbsUp,ThumbsDown,MessageCircle,Tag,Bookmark,CheckCircle,Users,ExternalLink,Pencil,Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Tabs,TabsContent,TabsList,TabsTrigger } from "@/components/ui/tabs";
import { Avatar,AvatarFallback,AvatarImage } from "@/components/ui/avatar";
import { Card,CardContent,CardDescription,CardFooter,CardHeader,CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import Link from 'next/link';
import { motion,AnimatePresence } from 'framer-motion';
import { useGetUserByIdQuery,useFollowUserMutation,useUnfollowUserMutation } from '@/redux/features/user/userApi';
//import { useSession } from 'next-auth/react';
import { useAppSelector } from '@/redux/hook';
import { selectCurrentUser } from '@/redux/features/auth/authSlice';
import PostCard from '@/components/shared/PostCard';

const MyProfile = () => {
    const [activeTab,setActiveTab] = useState('posts');
    const [expandedPosts,setExpandedPosts] = useState<string[]>([]);
    const [votedPosts,setVotedPosts] = useState<{ [key: string]: 'up' | 'down' | null }>({});

    const currentUser = useAppSelector(selectCurrentUser)
    const userId = currentUser?._id

    const { data: userProfile,isLoading,isError } = useGetUserByIdQuery(userId);
    const [followUser] = useFollowUserMutation();
    const [unfollowUser] = useUnfollowUserMutation();

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
        // Implement edit functionality here
        console.log(`Editing post ${postId}`);
    };

    const handleDeletePost = (postId: string) => {
        // Implement delete functionality here
        console.log(`Deleting post ${postId}`);
    };

    const handleFollowUser = async (followId: string) => {
        try {
            await followUser({ userId,followId }).unwrap();
        } catch (error) {
            console.error('Failed to follow user:',error);
        }
    };

    const handleUnfollowUser = async (unfollowId: string) => {
        try {
            await unfollowUser({ userId,unfollowId }).unwrap();
        } catch (error) {
            console.error('Failed to unfollow user:',error);
        }
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

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError || !userProfile) {
        return <div>Error loading profile</div>;
    }

    return (
        <div className=" px-4 py-8 wrapper">
            <motion.div
                initial="hidden"
                animate="visible"
                variants={cardVariants}
            >
                <Card className="mb-8">
                    <CardHeader>
                        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-4">
                            <Avatar className="w-24 h-24">
                                <AvatarImage src={userProfile?.data?.profilePicture} alt={userProfile?.data?.user?.name} />
                                <AvatarFallback>{userProfile?.data?.user?.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="text-center sm:text-left flex-grow">
                                <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-2 sm:space-y-0 sm:space-x-2">
                                    <CardTitle className="text-2xl font-bold">{userProfile?.data?.user?.name}</CardTitle>
                                    {userProfile?.data?.verified && (
                                        <Badge variant="secondary" className="mt-1 sm:mt-0">
                                            <CheckCircle className="w-4 h-4 mr-1" />
                                            Verified
                                        </Badge>
                                    )}
                                </div>
                                <CardDescription>{userProfile?.data?.user?.email}</CardDescription>
                                <p className="mt-2">{userProfile?.data?.bio}</p>
                                <div className="flex flex-wrap justify-center sm:justify-start gap-4 mt-2 text-sm text-gray-500">
                                    <span className="flex items-center"><ThumbsUp className="w-4 h-4 mr-1" /> {userProfile?.data?.totalUpvotes} Total Upvotes</span>
                                    {userProfile?.data?.verificationRequestDate && (
                                        <span className="flex items-center"><Calendar className="w-4 h-4 mr-1" /> Verified since {new Date(userProfile?.data?.verificationRequestDate).toLocaleDateString()}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardFooter>
                        <div className="flex flex-wrap justify-center sm:justify-start gap-4 w-full">
                            <span><strong>{userProfile?.data?.followers?.length || 0}</strong> Followers</span>
                            <span><strong>{userProfile?.data?.following?.length || 0}</strong> Following</span>
                            <span><strong>{userProfile?.data?.posts?.length || 0}</strong> Posts</span>
                        </div>
                    </CardFooter>
                </Card>
            </motion.div>

            <Tabs defaultValue="posts" className="w-full">
                <TabsList>
                    <TabsTrigger value="posts">Posts</TabsTrigger>
                    <TabsTrigger value="followers">Followers</TabsTrigger>
                    <TabsTrigger value="following">Following</TabsTrigger>
                </TabsList>
                <AnimatePresence mode="wait">
                    <TabsContent value="posts" key="posts">
                        {userProfile?.data?.posts?.map(({ post },index) => (
                            <motion.div
                                //key={post._id}
                                key={index}
                                variants={cardVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                transition={{ delay: index * 0.1 }}
                            >
                                <PostCard
                                    key={post._id}
                                    post={post}
                                    userProfile={userProfile.data}
                                    expandedPosts={expandedPosts}
                                    votedPosts={votedPosts}
                                    togglePostExpansion={togglePostExpansion}
                                    handleVote={handleVote}
                                    handleEditPost={handleEditPost}
                                    handleDeletePost={handleDeletePost}
                                />
                            </motion.div>
                        ))}
                    </TabsContent>
                    <TabsContent value="followers" key="followers">
                        {userProfile?.data?.followers?.map((follower,index) => (
                            <motion.div
                                //key={follower.userProfile._id}
                                key={index}
                                variants={cardVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                transition={{ delay: index * 0.1 }}
                            >
                                {/*<Card className="mb-4">
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-4">
                                                <Avatar>
                                                    <AvatarImage src={follower.userProfile.profilePicture} alt={follower.userProfile.user.name} />
                                                    <AvatarFallback>{follower.userProfile.user.name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <CardTitle>{follower.userProfile.user.name}</CardTitle>
                                                    <CardDescription>{follower.userProfile.user.email}</CardDescription>
                                                </div>
                                            </div>
                                            <Button
                                                variant="outline"
                                                onClick={() => handleUnfollowUser(follower.userProfile._id)}
                                            >
                                                Unfollow
                                            </Button>
                                        </div>
                                    </CardHeader>
                                </Card>*/}
                                <Card key={userProfile?.data?._id} className="mb-4">
                                    <CardHeader>
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                                            <div className="flex items-center space-x-4">
                                                <Avatar>
                                                    {/*<AvatarImage src={userProfile.profilePicture} alt={userProfile.name} />*/}
                                                    <AvatarFallback>{follower?.userProfile?.user?.name?.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="flex items-center space-x-2">
                                                        <CardTitle>{follower?.userProfile?.user?.name}</CardTitle>
                                                        {follower?.userProfile?.verified && (
                                                            <Badge variant="secondary">
                                                                <CheckCircle className="w-3 h-3 mr-1" />
                                                                Verified
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <CardDescription>{follower?.userProfile?.user?.email}</CardDescription>
                                                </div>
                                            </div>
                                            <Button className="w-full sm:w-auto">Follow Back</Button>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex flex-col sm:flex-row justify-between text-sm text-gray-500 space-y-2 sm:space-y-0">
                                            <span className="flex items-center">
                                                <Users className="w-4 h-4 mr-1" />
                                                {follower?.userProfile?.followers?.length} Followers
                                            </span>
                                            <span className="flex items-center">
                                                <Users className="w-4 h-4 mr-1" />
                                                {follower?.userProfile?.following?.length} Following
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </TabsContent>
                    <TabsContent value="following" key="following">
                        {userProfile?.data?.following?.map((following,index) => (
                            <motion.div
                                //key={following.userProfile._id}
                                key={index}
                                variants={cardVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card key={userProfile?.data?._id} className="mb-4">
                                    <CardHeader>
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                                            <div className="flex items-center space-x-4">
                                                <Avatar>
                                                    {/*<AvatarImage src={userProfile.profilePicture} alt={userProfile.name} />*/}
                                                    <AvatarFallback>{following?.userProfile?.user?.name?.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="flex items-center space-x-2">
                                                        <CardTitle>{following?.userProfile?.user?.name}</CardTitle>
                                                        {following?.userProfile?.verified && (
                                                            <Badge variant="secondary">
                                                                <CheckCircle className="w-3 h-3 mr-1" />
                                                                Verified
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <CardDescription>{following?.userProfile?.user?.email}</CardDescription>
                                                </div>
                                            </div>
                                            <Button className="w-full sm:w-auto">Follow Back</Button>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex flex-col sm:flex-row justify-between text-sm text-gray-500 space-y-2 sm:space-y-0">
                                            <span className="flex items-center">
                                                <Users className="w-4 h-4 mr-1" />
                                                {following?.userProfile?.followers?.length} Followers
                                            </span>
                                            <span className="flex items-center">
                                                <Users className="w-4 h-4 mr-1" />
                                                {following?.userProfile?.following?.length} Following
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </TabsContent>
                </AnimatePresence>
            </Tabs>
        </div>
    );
};


export default MyProfile;