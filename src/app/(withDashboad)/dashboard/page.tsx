'use client'

import React from 'react';
import { ResponsiveContainer,PieChart,Pie,Cell,Tooltip,AreaChart,Area,XAxis,YAxis,CartesianGrid,BarChart,Bar,Legend } from 'recharts';
import { useGetUsersQuery } from '@/redux/features/user/userApi';
import { useGetPostsQuery } from '@/redux/features/post/postApi';
import { useGetPaymentsQuery } from '@/redux/features/payment/paymentApi';

// Define the COLORS array
const COLORS = ['#0088FE','#00C49F','#FFBB28','#FF8042','#8884d8','#82ca9d'];

const DashboardOverview = () => {
    const { data: usersData } = useGetUsersQuery({ searchTerm: "" });
    const { data: postsData } = useGetPostsQuery({});
    const { data: paymentsData } = useGetPaymentsQuery({});

    const users = usersData?.data || [];
    const posts = postsData?.data || [];
    const payments = paymentsData?.data || [];

    // User statistics
    const totalUsers = users.length;
    const verifiedUsers = users.filter(user => user.verified).length;
    const unverifiedUsers = totalUsers - verifiedUsers;
    const usersWithPosts = new Set(posts.map(post => post.author._id)).size;
    const usersWithoutPosts = totalUsers - usersWithPosts;

    const userPieData = [
        { name: 'Verified',value: verifiedUsers },
        { name: 'Unverified',value: unverifiedUsers },
    ];

    const userActivityData = [
        { name: 'With Posts',value: usersWithPosts },
        { name: 'Without Posts',value: usersWithoutPosts },
    ];

    // Post statistics
    const totalPosts = posts.length;
    const premiumPosts = posts.filter(post => post.premium).length;
    const regularPosts = totalPosts - premiumPosts;
    const totalComments = posts.reduce((sum,post) => sum + post.totalComments,0);
    const avgCommentsPerPost = totalPosts > 0 ? (totalComments / totalPosts).toFixed(2) : 0;

    const postPieData = [
        { name: 'Premium',value: premiumPosts },
        { name: 'Regular',value: regularPosts },
    ];

    const postEngagementData = posts.map(post => ({
        title: post.title.substring(0,20) + '...',
        upVotes: post.upVotes,
        downVotes: post.downVotes,
        comments: post.totalComments,
    })).sort((a,b) => (b.upVotes + b.comments) - (a.upVotes + a.comments)).slice(0,5);

    // Payment statistics
    const totalPayments = payments.length;
    const successfulPayments = payments.filter(payment => payment.status === 'success').length;
    const failedPayments = totalPayments - successfulPayments;
    const totalRevenue = payments.reduce((sum,payment) => payment.status === 'success' ? sum + payment.amount : sum,0);
    const avgTransactionValue = successfulPayments > 0 ? (totalRevenue / successfulPayments).toFixed(2) : 0;

    const paymentPieData = [
        { name: 'Successful',value: successfulPayments },
        { name: 'Failed',value: failedPayments },
    ];

    // Revenue chart data
    const revenueData = calculateRevenueData(payments);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <StatCard title="Total Users" value={totalUsers} />
                <StatCard title="Total Posts" value={totalPosts} />
                <StatCard title="Total Payments" value={totalPayments} />
                <StatCard title="Total Revenue" value={`$${totalRevenue}`} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                <PieChartCard title="User Verification" data={userPieData} />
                <PieChartCard title="Post Types" data={postPieData} />
                <PieChartCard title="Payment Status" data={paymentPieData} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">User Activity</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={userActivityData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="value" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">Top 5 Engaging Posts</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={postEngagementData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="title" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="upVotes" stackId="a" fill="#8884d8" />
                            <Bar dataKey="comments" stackId="a" fill="#82ca9d" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow mb-6">
                <h2 className="text-xl font-semibold mb-4">Revenue Overview</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Area type="monotone" dataKey="amount" stroke="#8884d8" fill="#8884d8" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Avg Comments/Post" value={avgCommentsPerPost} />
                <StatCard title="Verified Users %" value={`${((verifiedUsers / totalUsers) * 100).toFixed(2)}%`} />
                <StatCard title="Premium Posts %" value={`${((premiumPosts / totalPosts) * 100).toFixed(2)}%`} />
                <StatCard title="Avg Transaction Value" value={`$${avgTransactionValue}`} />
            </div>
        </div>
    );
};

const StatCard = ({ title,value }) => (
    <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <p className="text-3xl font-bold">{value}</p>
    </div>
);

const PieChartCard = ({ title,data }) => (
    <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <ResponsiveContainer width="100%" height={200}>
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
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
    </div>
);

const calculateRevenueData = (payments) => {
    const revenueByDate = payments.reduce((acc,payment) => {
        if (payment.status === 'success') {
            const date = new Date(payment.createdAt).toISOString().split('T')[0];
            acc[date] = (acc[date] || 0) + payment.amount;
        }
        return acc;
    },{});

    return Object.entries(revenueByDate)
        .map(([date,amount]) => ({ date,amount }))
        .sort((a,b) => new Date(a.date) - new Date(b.date));
};

export default DashboardOverview;
