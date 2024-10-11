'use client'
import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const fadeIn = {
    hidden: { opacity: 0,y: 20 },
    visible: { opacity: 1,y: 0 }
};

const stagger = {
    visible: { transition: { staggerChildren: 0.1 } }
};

const AboutPage = () => {
    return (
        <div className="bg-background min-h-screen relative">
            <div className="absolute inset-0 bg-[url('https://www.toptal.com/designers/subtlepatterns/uploads/leaves.png')] bg-repeat bg-fixed opacity-50"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-secondary/10"></div>
            <motion.div
                className="container mx-auto px-4 py-16 relative z-10"
                initial="hidden"
                animate="visible"
                variants={stagger}
            >
                <motion.h1
                    className="text-5xl md:text-6xl font-bold mb-12 text-center text-primary"
                    variants={fadeIn}
                >
                    About Travel Tips & Destination Guides
                </motion.h1>

                <motion.div
                    className="bg-secondary/20 backdrop-blur-md rounded-xl shadow-2xl p-8 mb-16"
                    variants={fadeIn}
                >
                    <p className="text-xl mb-6 text-gray-700 leading-relaxed">
                        Welcome to Travel Tips & Destination Guides, your dynamic community platform for travel enthusiasts! We're more than just a website – we're a thriving ecosystem where travelers connect, share, and inspire each other.
                    </p>
                    <div className="flex justify-center">
                        <Image src="https://images.unsplash.com/photo-1501785888041-af3ef285b470" alt="Travel landscape" width={1000} height={600} className="rounded-lg shadow-md hover:shadow-xl transition duration-300" />
                    </div>
                </motion.div>

                <motion.div
                    className="grid md:grid-cols-2 gap-12 mb-16"
                    variants={stagger}
                >
                    <motion.div
                        className="bg-white/80 backdrop-blur-md rounded-xl shadow-xl p-8"
                        variants={fadeIn}
                    >
                        <h2 className="text-3xl font-semibold mb-6 text-primary">Our Community Features</h2>
                        <ul className="space-y-4">
                            {['Post your travel stories, tips, and photos','Follow other travelers and build your network','Vote on helpful content to highlight the best insights','Comment and engage in discussions about destinations','Customize your profile to showcase your travel experiences'].map((item,index) => (
                                <motion.li key={index} className="flex items-center text-lg" variants={fadeIn}>
                                    <svg className="h-8 w-8 mr-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    {item}
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>

                    <motion.div
                        className="bg-secondary/20 backdrop-blur-md rounded-xl shadow-xl p-8"
                        variants={fadeIn}
                    >
                        <h2 className="text-3xl font-semibold mb-6 text-primary">Why Join Us?</h2>
                        <p className="mb-4 text-lg">Our platform is built for travelers, by travelers. Here, you can:</p>
                        <ul className="space-y-4">
                            {['Share your unique travel experiences and tips','Discover hidden gems and insider advice','Get inspired for your next adventure','Connect with a global community of explorers','Access premium content for deeper insights'].map((item,index) => (
                                <motion.li key={index} className="flex items-center text-lg" variants={fadeIn}>
                                    <svg className="h-8 w-8 mr-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                    {item}
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>
                </motion.div>

                <motion.div
                    className="mb-16 bg-primary text-white rounded-xl shadow-2xl p-10 bg-[url('https://www.toptal.com/designers/subtlepatterns/uploads/dot-grid.png')] bg-repeat"
                    variants={fadeIn}
                >
                    <h2 className="text-3xl font-semibold mb-6">How It Works</h2>
                    <motion.div
                        className="grid md:grid-cols-5 gap-4"
                        variants={stagger}
                    >
                        {['Sign up','Create profile','Post content','Engage','Grow network'].map((item,index) => (
                            <motion.div key={index} className="text-center" variants={fadeIn}>
                                <div className="bg-secondary/10 text-primary rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-2 text-2xl font-bold">{index + 1}</div>
                                <p className="text-lg">{item}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>

                <motion.div
                    className="grid md:grid-cols-2 gap-12 mb-16"
                    variants={stagger}
                >
                    <motion.div
                        className="bg-secondary/20 backdrop-blur-md rounded-xl shadow-xl p-8"
                        variants={fadeIn}
                    >
                        <h2 className="text-3xl font-semibold mb-6 text-primary">Our Mission</h2>
                        <p className="text-lg mb-4">
                            At Travel Tips & Destination Guides, we're on a mission to make travel more accessible, enjoyable, and enriching for everyone. We believe that by sharing our experiences and knowledge, we can help each other discover the world in new and exciting ways.
                        </p>
                        <Image src="https://images.unsplash.com/photo-1488646953014-85cb44e25828" alt="Our mission" width={500} height={300} className="rounded-lg shadow-md mx-auto" />
                    </motion.div>
                    <motion.div
                        className="bg-white/80 backdrop-blur-md rounded-xl shadow-xl p-8"
                        variants={fadeIn}
                    >
                        <h2 className="text-3xl font-semibold mb-6 text-primary">Community Impact</h2>
                        <p className="text-lg mb-4">
                            Our community has helped thousands of travelers plan better trips, avoid common pitfalls, and discover hidden gems across the globe. Join us and be part of this positive impact on the world of travel.
                        </p>
                        <Image src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f" alt="Community impact" width={500} height={300} className="rounded-lg shadow-md mx-auto" />
                    </motion.div>
                </motion.div>

                <motion.div
                    className="text-center mb-16"
                    variants={fadeIn}
                >
                    <h2 className="text-3xl font-semibold mb-6 text-primary">Featured Destinations</h2>
                    <div className="flex flex-wrap justify-center gap-4">
                        {['Paris','Tokyo','New York','Bali','Rome'].map((city,index) => (
                            <motion.div
                                key={index}
                                className="bg-white/80 backdrop-blur-md rounded-full px-6 py-2 text-lg font-semibold hover:bg-primary hover:text-white transition duration-300 shadow-md"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {city}
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                <motion.p
                    className="text-2xl italic mt-16 text-center font-semibold text-primary"
                    variants={fadeIn}
                    animate={{ opacity: [0.5,1,0.5] }}
                    transition={{ duration: 2,repeat: Infinity }}
                >
                    Join our community today and let's explore the world together, one post at a time!
                </motion.p>
            </motion.div>
        </div>
    );
};

export default AboutPage;
