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
        { userProfile: { _id: 'f1',name: 'Alice Smith',email: 'alice@example.com',profilePicture: 'https://source.unsplash.com/random/100x100?woman',totalFollowers: 250,totalFollowing: 300,verified: true } },
        { userProfile: { _id: 'f2',name: 'Bob Johnson',email: 'bob@example.com',profilePicture: 'https://source.unsplash.com/random/100x100?man',totalFollowers: 180,totalFollowing: 220,verified: false } },
    ],
    following: [
        { userProfile: { _id: 'g1',name: 'Emma Wilson',email: 'emma@example.com',profilePicture: 'https://source.unsplash.com/random/100x100?girl',totalFollowers: 500,totalFollowing: 450,verified: true } },
        { userProfile: { _id: 'g2',name: 'Michael Brown',email: 'michael@example.com',profilePicture: 'https://source.unsplash.com/random/100x100?boy',totalFollowers: 320,totalFollowing: 280,verified: false } },
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

    const handleEditPost = (postId: string) => {
        // Implement edit functionality here
        console.log(`Editing post ${postId}`);
    };

    const handleDeletePost = (postId: string) => {
        // Implement delete functionality here
        console.log(`Deleting post ${postId}`);
    };

    return (
        <div className=" px-4 py-8 wrapper">
            <Card className="mb-8">
                <CardHeader>
                    <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-4">
                        <Avatar className="w-24 h-24">
                            <AvatarImage src={user.profilePicture} alt={user.user.name} />
                            <AvatarFallback>{user.user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="text-center sm:text-left flex-grow">
                            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-2 sm:space-y-0 sm:space-x-2">
                                <CardTitle className="text-2xl font-bold">{user.user.name}</CardTitle>
                                {user.verified && (
                                    <Badge variant="secondary" className="mt-1 sm:mt-0">
                                        <CheckCircle className="w-4 h-4 mr-1" />
                                        Verified
                                    </Badge>
                                )}
                            </div>
                            <CardDescription>{user.user.email}</CardDescription>
                            <p className="mt-2">{user.bio}</p>
                            <div className="flex flex-wrap justify-center sm:justify-start gap-4 mt-2 text-sm text-gray-500">
                                <span className="flex items-center"><ThumbsUp className="w-4 h-4 mr-1" /> {user.totalUpvotes} Total Upvotes</span>
                                {user.verificationRequestDate && (
                                    <span className="flex items-center"><Calendar className="w-4 h-4 mr-1" /> Verified since {new Date(user.verificationRequestDate).toLocaleDateString()}</span>
                                )}
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardFooter>
                    <div className="flex flex-wrap justify-center sm:justify-start gap-4 w-full">
                        <span><strong>{user.followers.length}</strong> Followers</span>
                        <span><strong>{user.following.length}</strong> Following</span>
                        <span><strong>{user.posts.length}</strong> Posts</span>
                    </div>
                </CardFooter>
            </Card>

            <Tabs defaultValue="posts" className="w-full">
                <TabsList>
                    <TabsTrigger value="posts">Posts</TabsTrigger>
                    <TabsTrigger value="followers">Followers</TabsTrigger>
                    <TabsTrigger value="following">Following</TabsTrigger>
                </TabsList>
                <TabsContent value="posts">
                    {user.posts.map(({ post }) => (
                        <Card key={post._id} className="mb-6">
                            <CardHeader>
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                                    <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                                        <Avatar>
                                            <AvatarImage src={user.profilePicture} alt={user.user.name} />
                                            <AvatarFallback>{user.user.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <CardTitle className="text-lg">{user.user.name}</CardTitle>
                                            <CardDescription>{new Date(post.createdAt).toLocaleDateString()}</CardDescription>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        {post.premium && (
                                            <Badge variant="secondary">
                                                <Bookmark className="w-4 h-4 mr-1" />
                                                Premium
                                            </Badge>
                                        )}
                                        <Button variant="ghost" size="icon" onClick={() => handleEditPost(post._id)}>
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => handleDeletePost(post._id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                                {post.image && post.image.length > 0 && (
                                    <img src={post.image[0]} alt={post.title} className="w-full h-48 sm:h-64 object-cover mb-4 rounded-md" />
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
                            <CardFooter>
                                <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                    <div className="flex flex-wrap items-center gap-0 sm:gap-2">
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
                                    <Link href={`/dashboard/posts/${post._id}`} className="w-full sm:w-auto">
                                        <Button variant="outline" size="sm" className="w-full">
                                            View Full Post
                                        </Button>
                                    </Link>
                                </div>
                            </CardFooter>
                        </Card>
                    ))}
                </TabsContent>
                <TabsContent value="followers">
                    {user.followers.map(({ userProfile }) => (
                        <Card key={userProfile._id} className="mb-4">
                            <CardHeader>
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                                    <div className="flex items-center space-x-4">
                                        <Avatar>
                                            <AvatarImage src={userProfile.profilePicture} alt={userProfile.name} />
                                            <AvatarFallback>{userProfile.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="flex items-center space-x-2">
                                                <CardTitle>{userProfile.name}</CardTitle>
                                                {userProfile.verified && (
                                                    <Badge variant="secondary">
                                                        <CheckCircle className="w-3 h-3 mr-1" />
                                                        Verified
                                                    </Badge>
                                                )}
                                            </div>
                                            <CardDescription>{userProfile.email}</CardDescription>
                                        </div>
                                    </div>
                                    <Button className="w-full sm:w-auto">Follow Back</Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-col sm:flex-row justify-between text-sm text-gray-500 space-y-2 sm:space-y-0">
                                    <span className="flex items-center">
                                        <Users className="w-4 h-4 mr-1" />
                                        {userProfile.totalFollowers} Followers
                                    </span>
                                    <span className="flex items-center">
                                        <Users className="w-4 h-4 mr-1" />
                                        {userProfile.totalFollowing} Following
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </TabsContent>
                <TabsContent value="following">
                    {user.following.map(({ userProfile }) => (
                        <Card key={userProfile._id} className="mb-4">
                            <CardHeader>
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                                    <div className="flex items-center space-x-4">
                                        <Avatar>
                                            <AvatarImage src={userProfile.profilePicture} alt={userProfile.name} />
                                            <AvatarFallback>{userProfile.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="flex items-center space-x-2">
                                                <CardTitle>{userProfile.name}</CardTitle>
                                                {userProfile.verified && (
                                                    <Badge variant="secondary">
                                                        <CheckCircle className="w-3 h-3 mr-1" />
                                                        Verified
                                                    </Badge>
                                                )}
                                            </div>
                                            <CardDescription>{userProfile.email}</CardDescription>
                                        </div>
                                    </div>
                                    <Button variant="outline" className="w-full sm:w-auto">Unfollow</Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-col sm:flex-row justify-between text-sm text-gray-500 space-y-2 sm:space-y-0">
                                    <span className="flex items-center">
                                        <Users className="w-4 h-4 mr-1" />
                                        {userProfile.totalFollowers} Followers
                                    </span>
                                    <span className="flex items-center">
                                        <Users className="w-4 h-4 mr-1" />
                                        {userProfile.totalFollowing} Following
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </TabsContent>
            </Tabs>
        </div>
    );
};


export default MyProfile;