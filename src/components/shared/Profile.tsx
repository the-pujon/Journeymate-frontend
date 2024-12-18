/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Tabs,TabsContent,TabsList,TabsTrigger } from "@/components/ui/tabs";
import { motion,AnimatePresence } from 'framer-motion';
import PostCard from '@/components/shared/PostCard';
import UserCard from '@/components/shared/UserCard';
import AboutUser from '@/components/shared/AboutUser';

const Profile = ({ userProfile,isMyProfile }: { userProfile: any,isMyProfile: boolean }) => {
    const cardVariants = {
        hidden: { opacity: 0,y: 20 },
        visible: { opacity: 1,y: 0,transition: { duration: 0.3 } },
        exit: { opacity: 0,y: -20,transition: { duration: 0.2 } }
    };
    return (
        <div className=" px-4 py-8 wrapper">
            <motion.div
                initial="hidden"
                animate="visible"
                variants={cardVariants}
            >
                <AboutUser userProfile={userProfile} />
            </motion.div>

            <Tabs defaultValue="posts" className="w-full">
                <TabsList>
                    <TabsTrigger value="posts">Posts</TabsTrigger>
                    <TabsTrigger value="followers">Followers</TabsTrigger>
                    <TabsTrigger value="following">Following</TabsTrigger>
                </TabsList>
                <AnimatePresence mode="popLayout">
                    <TabsContent value="posts" key="posts">
                        {userProfile?.data?.posts?.map(({ post }: { post: any },index: number) => (
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
                                    //key={post._id}
                                    post={post}
                                    userProfile={userProfile?.data}
                                    isMyProfile={isMyProfile}
                                />
                            </motion.div>
                        ))}
                    </TabsContent>
                    <TabsContent value="followers" key="followers">
                        {userProfile?.data?.followers?.map((follower: any,index: number) => (
                            <motion.div
                                //key={follower.userProfile._id}
                                key={index}
                                variants={cardVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                transition={{ delay: index * 0.1 }}
                            >


                                <UserCard
                                    user={follower.userProfile}
                                    //onFollowToggle={handleFollowToggle}
                                    isFollowing={false}
                                />
                            </motion.div>
                        ))}
                    </TabsContent>
                    <TabsContent value="following" key="following">
                        {userProfile?.data?.following?.map((following: any,index: number) => (
                            <motion.div
                                //key={following.userProfile._id}
                                key={index}
                                variants={cardVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                transition={{ delay: index * 0.1 }}
                            >
                                <UserCard
                                    user={following.userProfile}
                                    //onFollowToggle={handleFollowToggle}
                                    isFollowing={true}
                                />
                            </motion.div>
                        ))}
                    </TabsContent>
                </AnimatePresence>
            </Tabs>
        </div>
    );
};

export default Profile;