'use client'

import React from 'react';
import { Card,CardContent,CardHeader,CardTitle } from "@/components/ui/card";
import { BarChart,Bar,XAxis,YAxis,CartesianGrid,Tooltip,Legend,ResponsiveContainer,LineChart,Line,PieChart,Pie,Cell,AreaChart,Area } from 'recharts';
import { ArrowUpIcon,ArrowDownIcon,UserIcon,CheckCircleIcon,StarIcon,FileText } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Avatar,AvatarFallback,AvatarImage } from "@/components/ui/avatar";

const monthlyPaymentsData = [
    { month: 'Jan',amount: 5000 },
    { month: 'Feb',amount: 6200 },
    { month: 'Mar',amount: 7800 },
    { month: 'Apr',amount: 8100 },
    { month: 'May',amount: 9000 },
    { month: 'Jun',amount: 10500 },
];

const userActivityData = [
    { month: 'Jan',activeUsers: 1000,newPosts: 500 },
    { month: 'Feb',activeUsers: 1200,newPosts: 600 },
    { month: 'Mar',activeUsers: 1500,newPosts: 750 },
    { month: 'Apr',activeUsers: 1800,newPosts: 900 },
    { month: 'May',activeUsers: 2000,newPosts: 1000 },
    { month: 'Jun',activeUsers: 2200,newPosts: 1100 },
];

const userTypeData = [
    { name: 'Free',value: 1850 },
    { name: 'Premium',value: 350 },
];

const COLORS = ['#0088FE','#00C49F','#FFBB28','#FF8042'];

const revenueData = [
    { month: 'Jan',revenue: 10000 },
    { month: 'Feb',revenue: 12000 },
    { month: 'Mar',revenue: 15000 },
    { month: 'Apr',revenue: 18000 },
    { month: 'May',revenue: 22000 },
    { month: 'Jun',revenue: 25000 },
];

const engagementData = [
    { day: 'Mon',engagement: 75 },
    { day: 'Tue',engagement: 80 },
    { day: 'Wed',engagement: 85 },
    { day: 'Thu',engagement: 90 },
    { day: 'Fri',engagement: 95 },
    { day: 'Sat',engagement: 88 },
    { day: 'Sun',engagement: 82 },
];

const Dashboard = () => {
    return (
        <div className="p-6 space-y-6 min-h-screen">
            <div className="flex justify-between items-center">
                <h1 className="text-4xl font-bold text-gray-800 dark:text-backbg-secondary/20">Dashboard Overview</h1>
                <Button variant="outline">Generate Report</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Users" value="2,200" change={5.2} icon={<UserIcon className="w-6 h-6" />} />
                <StatCard title="Total Posts" value="4,850" change={-2.1} icon={<FileText className="w-6 h-6" />} />
                <StatCard title="Verified Users" value="350" change={12.5} icon={<CheckCircleIcon className="w-6 h-6" />} />
                <StatCard title="Premium Posts" value="720" change={8.3} icon={<StarIcon className="w-6 h-6" />} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartCard title="Monthly Payments" chart={<PaymentsChart data={monthlyPaymentsData} />} />
                <ChartCard title="User Activity" chart={<ActivityChart data={userActivityData} />} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <ChartCard title="User Types" chart={<UserTypeChart data={userTypeData} />} />
                <ChartCard title="Revenue Growth" chart={<RevenueChart data={revenueData} />} />
                <ChartCard title="Daily Engagement" chart={<EngagementChart data={engagementData} />} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-secondary/20 dark:bg-gray-800 shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold text-gray-800 dark:text-backbg-secondary/20">Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ActivityList />
                    </CardContent>
                </Card>
                <Card className="bg-secondary/20 dark:bg-gray-800 shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold text-gray-800 dark:text-backbg-secondary/20">Top Performers</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <TopPerformers />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

const StatCard = ({ title,value,change,icon }) => (
    <Card className="bg-secondary/20 dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</CardTitle>
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
                {icon}
            </div>
        </CardHeader>
        <CardContent>
            <div className="text-3xl font-bold text-gray-900 dark:text-backbg-secondary/20">{value}</div>
            <div className="flex items-center mt-1">
                <ChangeIndicator change={change} />
                <p className="text-xs text-gray-500 dark:text-gray-400 ml-2">from last month</p>
            </div>
        </CardContent>
    </Card>
);

const ChangeIndicator = ({ change }) => (
    <div className={`flex items-center ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
        {change >= 0 ? <ArrowUpIcon className="w-4 h-4 mr-1" /> : <ArrowDownIcon className="w-4 h-4 mr-1" />}
        <span className="text-sm font-medium">{Math.abs(change)}%</span>
    </div>
);

const ChartCard = ({ title,chart }) => (
    <Card className="bg-secondary/20 dark:bg-gray-800 shadow-lg">
        <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-800 dark:text-backbg-secondary/20">{title}</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
            {chart}
        </CardContent>
    </Card>
);

const PaymentsChart = ({ data }) => (
    <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="amount" fill="#8884d8" />
        </BarChart>
    </ResponsiveContainer>
);

const ActivityChart = ({ data }) => (
    <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="activeUsers" stroke="#8884d8" />
            <Line type="monotone" dataKey="newPosts" stroke="#82ca9d" />
        </LineChart>
    </ResponsiveContainer>
);

const UserTypeChart = ({ data }) => (
    <ResponsiveContainer width="100%" height="100%">
        <PieChart>
            <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name,percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
                {data.map((entry,index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
            </Pie>
            <Tooltip />
        </PieChart>
    </ResponsiveContainer>
);

const RevenueChart = ({ data }) => (
    <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="revenue" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
        </AreaChart>
    </ResponsiveContainer>
);

const EngagementChart = ({ data }) => (
    <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="engagement" stroke="#82ca9d" strokeWidth={2} />
        </LineChart>
    </ResponsiveContainer>
);

const ActivityList = () => (
    <ul className="space-y-4">
        {[
            { user: "Alice",action: "created a new post",time: "2 minutes ago",avatar: "/avatars/alice.jpg" },
            { user: "Bob",action: "commented on 'How to improve your coding skills'",time: "15 minutes ago",avatar: "/avatars/bob.jpg" },
            { user: "Charlie",action: "upgraded to Premium",time: "1 hour ago",avatar: "/avatars/charlie.jpg" },
            { user: "Diana",action: "liked 5 posts",time: "3 hours ago",avatar: "/avatars/diana.jpg" },
        ].map((activity,index) => (
            <li key={index} className="flex items-center space-x-3 text-sm">
                <Avatar>
                    <AvatarImage src={activity.avatar} alt={activity.user} />
                    <AvatarFallback>{activity.user[0]}</AvatarFallback>
                </Avatar>
                <div>
                    <span className="font-semibold text-blue-600 dark:text-blue-400">{activity.user}</span>
                    <span className="text-gray-600 dark:text-gray-300"> {activity.action}</span>
                    <p className="text-xs text-gray-400 dark:text-gray-500">{activity.time}</p>
                </div>
            </li>
        ))}
    </ul>
);

const TopPerformers = () => (
    <ul className="space-y-4">
        {[
            { user: "Emma",posts: 120,likes: 1500,avatar: "/avatars/emma.jpg" },
            { user: "Liam",posts: 95,likes: 1200,avatar: "/avatars/liam.jpg" },
            { user: "Olivia",posts: 85,likes: 1100,avatar: "/avatars/olivia.jpg" },
        ].map((performer,index) => (
            <li key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <Avatar>
                        <AvatarImage src={performer.avatar} alt={performer.user} />
                        <AvatarFallback>{performer.user[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold text-gray-800 dark:text-backbg-secondary/20">{performer.user}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{performer.posts} posts</p>
                    </div>
                </div>
                <div className="flex items-center space-x-1 text-yellow-500">
                    <StarIcon className="w-5 h-5" />
                    <span>{performer.likes}</span>
                </div>
            </li>
        ))}
    </ul>
);

export default Dashboard;