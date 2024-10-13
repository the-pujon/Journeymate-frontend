'use client'

import React from 'react';
import { motion } from 'framer-motion';
import { Card,CardHeader,CardTitle,CardDescription,CardContent,CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select,SelectTrigger,SelectValue,SelectContent,SelectItem } from "@/components/ui/select";
import { MapPin,Phone,Mail,Clock } from 'lucide-react';

const ContactPage = () => {
    return (
        <motion.div
            initial={{ opacity: 0,y: 20 }}
            animate={{ opacity: 1,y: 0 }}
            transition={{ duration: 0.5 }}
            className="container mx-auto py-12 px-4"
        >
            <h1 className="text-4xl font-bold text-center mb-8">Get in Touch</h1>
            <div className="grid md:grid-cols-2 gap-8">
                <motion.div
                    initial={{ opacity: 0,x: -20 }}
                    animate={{ opacity: 1,x: 0 }}
                    transition={{ duration: 0.5,delay: 0.2 }}
                >
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle>Contact Information</CardTitle>
                            <CardDescription>We&apos;re here to assist you with your travel inquiries!</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center space-x-3">
                                <MapPin className="text-blue-500" />
                                <span>123 Travel Street, Adventure City, 12345</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Phone className="text-green-500" />
                                <span>+1 (555) 123-4567</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Mail className="text-red-500" />
                                <span>support@traveltips.com</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Clock className="text-yellow-500" />
                                <span>Mon-Fri: 9AM-6PM (EST)</span>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <p className="text-sm text-gray-500">Follow us on social media for travel inspiration and updates!</p>
                        </CardFooter>
                    </Card>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0,x: 20 }}
                    animate={{ opacity: 1,x: 0 }}
                    transition={{ duration: 0.5,delay: 0.4 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle>Send Us a Message</CardTitle>
                            <CardDescription>We&apos;ll get back to you as soon as possible!</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form className="space-y-4">
                                <div className="space-y-2">
                                    <label htmlFor="name">Name</label>
                                    <Input id="name" placeholder="Your name" />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="email">Email</label>
                                    <Input id="email" type="email" placeholder="Your email address" />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="subject">Subject</label>
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a subject" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="general">General Inquiry</SelectItem>
                                            <SelectItem value="support">Technical Support</SelectItem>
                                            <SelectItem value="feedback">Feedback</SelectItem>
                                            <SelectItem value="partnership">Partnership Opportunities</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="message">Message</label>
                                    <Textarea id="message" placeholder="Your message or inquiry" />
                                </div>
                                <Button type="submit" className="w-full">Send Message</Button>
                            </form>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default ContactPage;
