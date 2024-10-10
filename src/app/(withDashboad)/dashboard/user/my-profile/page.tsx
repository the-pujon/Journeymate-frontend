'use client'

import React,{ useState } from 'react';
import { User,Settings,MapPin,Calendar,Link as LinkIcon,ChevronDown,ChevronUp,ThumbsUp,ThumbsDown,MessageCircle,Tag,Bookmark,CheckCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Tabs,TabsContent,TabsList,TabsTrigger } from "@/components/ui/tabs";
import { Avatar,AvatarFallback,AvatarImage } from "@/components/ui/avatar";
import { Card,CardContent,CardDescription,CardFooter,CardHeader,CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

// Updated dummy data to match the TUserProfile and TPost interfaces
const dummyUser = {
    _id: '123',
    user: {
        _id: 'user123',
        name: 'John Doe',
        email: 'john@example.com',
    },
    profilePicture: 'https://source.unsplash.com/random/100x100?face',
    bio: 'Passionate traveler | Photography enthusiast | Coffee lover',
    followers: [
        { userProfile: { _id: 'f1',name: 'Alice Smith',profilePicture: 'https://source.unsplash.com/random/100x100?woman' } },
        { userProfile: { _id: 'f2',name: 'Bob Johnson',profilePicture: 'https://source.unsplash.com/random/100x100?man' } },
    ],
    following: [
        { userProfile: { _id: 'g1',name: 'Emma Wilson',profilePicture: 'https://source.unsplash.com/random/100x100?girl' } },
        { userProfile: { _id: 'g2',name: 'Michael Brown',profilePicture: 'https://source.unsplash.com/random/100x100?boy' } },
    ],
    posts: [
        {
            post: {
                _id: '1',
                author: 'user123',
                title: 'Amazing sunset',
                content: 'Captured this breathtaking sunset at the beach today! The colors were absolutely stunning, painting the sky in vibrant hues of orange, pink, and purple. It\'s moments like these that remind me of the incredible beauty our world has to offer.',
                image: ['https://source.unsplash.com/random/800x600?sunset'],
                category: 'Nature',
                tags: ['sunset','beach','photography'],
                premium: false,
                upVotes: 120,
                downVotes: 5,
                totalComments: 18,
                createdAt: '2023-06-15'
            }
        },
        {
            post: {
                _id: '2',
                author: 'user123',
                title: 'City lights',
                content: 'Night walk through the bustling city streets. The energy is electric!',
                image: ['https://source.unsplash.com/random/800x600?city,night'],
                category: 'Urban',
                tags: ['city','night','lights'],
                premium: true,
                upVotes: 89,
                downVotes: 3,
                totalComments: 7,
                createdAt: '2023-06-10'
            }
        },
        {
            post: {
                _id: '3',
                author: 'user123',
                title: 'Mountain hike',
                content: 'Reached the summit after a challenging hike. The view was worth every step!',
                image: ['https://source.unsplash.com/random/800x600?mountain'],
                category: 'Adventure',
                tags: ['hiking','mountains','nature'],
                premium: false,
                upVotes: 156,
                downVotes: 2,
                totalComments: 24,
                createdAt: '2023-06-05'
            }
        },
    ],
    verified: true,
    verificationRequestDate: '2023-05-01',
    totalUpvotes: 365,
};

const MyProfile = () => {
    const [activeTab,setActiveTab] = useState('posts');
    const user = dummyUser;
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

    return (
        <div className="container mx-auto px-4 py-8">
            <Card className="mb-8">
                <CardHeader>
                    <div className="flex items-center space-x-4">
                        <Avatar className="w-24 h-24">
                            <AvatarImage src={user.profilePicture} alt={user.user.name} />
                            <AvatarFallback>{user.user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="flex items-center space-x-2">
                                <CardTitle className="text-2xl font-bold">{user.user.name}</CardTitle>
                                {user.verified && (
                                    <Badge variant="secondary">
                                        <CheckCircle className="w-4 h-4 mr-1" />
                                        Verified
                                    </Badge>
                                )}
                            </div>
                            <CardDescription>{user.user.email}</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="mb-4">{user.bio}</p>
                    <div className="flex space-x-4 text-sm text-gray-500">
                        <span className="flex items-center"><ThumbsUp className="w-4 h-4 mr-1" /> {user.totalUpvotes} Total Upvotes</span>
                        {user.verificationRequestDate && (
                            <span className="flex items-center"><Calendar className="w-4 h-4 mr-1" /> Verified since {new Date(user.verificationRequestDate).toLocaleDateString()}</span>
                        )}
                    </div>
                </CardContent>
                <CardFooter>
                    <div className="flex space-x-4">
                        <span><strong>{user.followers.length}</strong> Followers</span>
                        <span><strong>{user.following.length}</strong> Following</span>
                        <span><strong>{user.posts.length}</strong> Posts</span>
                    </div>
                </CardFooter>
            </Card>

            <Tabs defaultValue="posts" className="w-full">
                <TabsList>
                    <TabsTrigger value="posts" onClick={() => setActiveTab('posts')}>Posts</TabsTrigger>
                    <TabsTrigger value="followers" onClick={() => setActiveTab('followers')}>Followers</TabsTrigger>
                    <TabsTrigger value="following" onClick={() => setActiveTab('following')}>Following</TabsTrigger>
                </TabsList>
                <TabsContent value="posts">
                    {user.posts.map(({ post }) => (
                        <Card key={post._id} className="mb-6">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <Avatar>
                                            <AvatarImage src={user.profilePicture} alt={user.user.name} />
                                            <AvatarFallback>{user.user.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <CardTitle className="text-lg">{user.user.name}</CardTitle>
                                            <CardDescription>{new Date(post.createdAt).toLocaleDateString()}</CardDescription>
                                        </div>
                                    </div>
                                    {post.premium && (
                                        <Badge variant="secondary">
                                            <Bookmark className="w-4 h-4 mr-1" />
                                            Premium
                                        </Badge>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                                {post.image && post.image.length > 0 && (
                                    <img src={post.image[0]} alt={post.title} className="w-full h-64 object-cover mb-4 rounded-md" />
                                )}
                                <p className={`text-gray-600 ${expandedPosts.includes(post._id) ? '' : 'line-clamp-3'}`}>
                                    {post.content}
                                </p>
                                {post.content.length > 150 && (
                                    <Button
                                        variant="link"
                                        onClick={() => togglePostExpansion(post._id)}
                                        className="mt-2 p-0 h-auto font-semibold"
                                    >
                                        {expandedPosts.includes(post._id) ? 'Show less' : 'Read more'}
                                    </Button>
                                )}
                                <div className="mt-4 flex flex-wrap gap-2">
                                    <Badge>{post.category}</Badge>
                                    {post.tags?.map(tag => (
                                        <Badge key={tag} variant="outline">
                                            <Tag className="w-3 h-3 mr-1" />
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                            <CardFooter className="flex flex-col items-start">
                                <div className="flex items-center justify-between w-full mb-2">
                                    <div className="flex items-center space-x-4">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className={`flex items-center space-x-2 ${votedPosts[post._id] === 'up' ? 'text-green-500' : ''}`}
                                            onClick={() => handleVote(post._id,'up')}
                                        >
                                            <ThumbsUp className="h-5 w-5" />
                                            <span>{post.upVotes + (votedPosts[post._id] === 'up' ? 1 : 0)}</span>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className={`flex items-center space-x-2 ${votedPosts[post._id] === 'down' ? 'text-red-500' : ''}`}
                                            onClick={() => handleVote(post._id,'down')}
                                        >
                                            <ThumbsDown className="h-5 w-5" />
                                            <span>{post.downVotes + (votedPosts[post._id] === 'down' ? 1 : 0)}</span>
                                        </Button>
                                        <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                                            <MessageCircle className="h-5 w-5" />
                                            <span>{post.totalComments}</span>
                                        </Button>
                                    </div>
                                </div>
                                <Separator className="w-full" />
                            </CardFooter>
                        </Card>
                    ))}
                </TabsContent>
                <TabsContent value="followers">
                    {user.followers.map(({ userProfile }) => (
                        <Card key={userProfile._id} className="mb-4">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <Avatar>
                                            <AvatarImage src={userProfile.profilePicture} alt={userProfile.name} />
                                            <AvatarFallback>{userProfile.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <CardTitle>{userProfile.name}</CardTitle>
                                        </div>
                                    </div>
                                    <Button>Follow Back</Button>
                                </div>
                            </CardHeader>
                        </Card>
                    ))}
                </TabsContent>
                <TabsContent value="following">
                    {user.following.map(({ userProfile }) => (
                        <Card key={userProfile._id} className="mb-4">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <Avatar>
                                            <AvatarImage src={userProfile.profilePicture} alt={userProfile.name} />
                                            <AvatarFallback>{userProfile.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <CardTitle>{userProfile.name}</CardTitle>
                                        </div>
                                    </div>
                                    <Button variant="outline">Unfollow</Button>
                                </div>
                            </CardHeader>
                        </Card>
                    ))}
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default MyProfile;