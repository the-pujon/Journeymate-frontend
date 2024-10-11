import React from 'react';


import { Card,CardHeader,CardFooter,CardTitle,CardDescription } from "@/components/ui/card";
import { Avatar,AvatarImage,AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar,ThumbsUp,CheckCircle } from 'lucide-react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AboutUser = ({ userProfile }: { userProfile: any }) => {
    return (
        <div>
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
        </div>
    );
};

export default AboutUser;