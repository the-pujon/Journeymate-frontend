'use client'

import React,{ useState,useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm,SubmitHandler } from 'react-hook-form';
import { useGetUserByIdQuery,useUpdateUserProfileMutation } from '@/redux/features/user/userApi';
import { useAppSelector } from '@/redux/hook';
import { selectCurrentUser } from '@/redux/features/auth/authSlice';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card,CardContent,CardDescription,CardFooter,CardHeader,CardTitle } from "@/components/ui/card";
import { Avatar,AvatarFallback,AvatarImage } from "@/components/ui/avatar";
import { toast } from 'sonner';
import { Camera,User,FileText,Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Loading from '@/components/shared/Loading';

interface EditProfileFormInputs {
    name: string;
    bio: string;
    profilePicture: FileList;
}

const EditProfile = () => {
    const router = useRouter();
    const currentUser = useAppSelector(selectCurrentUser);
    const userId = currentUser?._id;
    const [isImageUploading,setIsImageUploading] = useState(false);

    const { data: userProfile,isLoading,isError } = useGetUserByIdQuery(userId);
    const [updateUserProfile,{ isLoading: isUpdating }] = useUpdateUserProfileMutation();

    const { register,handleSubmit,setValue,watch } = useForm<EditProfileFormInputs>();
    const [previewImage,setPreviewImage] = useState<string | null>(null);

    useEffect(() => {
        if (userProfile) {
            setValue('name',userProfile.data.user.name);
            setValue('bio',userProfile.data.bio || '');
        }
    },[userProfile,setValue]);

    const watchProfilePicture = watch("profilePicture");

    useEffect(() => {
        if (watchProfilePicture && watchProfilePicture.length > 0) {
            const file = watchProfilePicture[0];
            setPreviewImage(URL.createObjectURL(file));
        }
    },[watchProfilePicture]);

    const uploadImageToImgBB = async (file: File): Promise<string> => {
        setIsImageUploading(true);
        const formData = new FormData();
        formData.append('image',file);

        try {
            const response = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,{
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to upload image');
            }

            const data = await response.json();
            return data.data.url;
        } catch (error) {
            console.error('Error uploading image to ImgBB:',error);
            throw new Error('Failed to upload image');
        } finally {
            setIsImageUploading(false);
        }
    };

    const onSubmit: SubmitHandler<EditProfileFormInputs> = async (data) => {
        try {
            let imageUrl = userProfile?.data.profilePicture;

            if (data.profilePicture && data.profilePicture.length > 0) {
                console.log("here")
                imageUrl = await uploadImageToImgBB(data.profilePicture[0]);
            }

            console.log("imageUrl",imageUrl)

            const updateData = {
                name: data.name,
                bio: data.bio,
                profilePicture: imageUrl,
            };

            console.log(updateData)

            await updateUserProfile({ id: userId,data: updateData }).unwrap();
            toast.success('Profile updated successfully');
            router.push('/dashboard/user/my-profile');
        } catch (error) {
            toast.error('Failed to update profile');
            console.error("error",error)
        }
    };

    const containerVariants = {
        hidden: { opacity: 0,y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: 'spring',
                damping: 20,
                stiffness: 100
            }
        },
    };

    const itemVariants = {
        hidden: { opacity: 0,x: -20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                type: 'spring',
                damping: 25,
                stiffness: 120
            }
        },
    };

    if (isLoading) return <Loading />;
    if (isError) return <div className="text-center text-red-500 mt-8">Error loading profile</div>;

    return (
        <motion.div
            className="container mx-auto px-0 sm:px-4 py-8 max-w-2xl"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <Card className="shadow-lg">
                <CardHeader className="text-center">
                    <motion.div variants={itemVariants}>
                        <CardTitle className="text-2xl font-bold">Edit Your Profile</CardTitle>
                        <CardDescription>Customize your profile information</CardDescription>
                    </motion.div>
                </CardHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <CardContent className="space-y-6">
                        <motion.div
                            className="flex flex-col items-center space-y-4"
                            variants={itemVariants}
                            initial="hidden"
                            animate="visible"
                            transition={{ delay: 0.1 }}
                        >
                            <div className="relative group">
                                <Avatar className="w-32 h-32 border-4 border-white shadow-lg group-hover:opacity-75 transition-opacity">
                                    <AvatarImage src={previewImage || userProfile?.data.profilePicture} alt="Profile picture" />
                                    <AvatarFallback>{userProfile?.data.user.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Camera className="text-white w-8 h-8" />
                                </div>
                            </div>
                            <Input
                                type="file"
                                accept="image/*"
                                {...register('profilePicture')}
                                className="hidden"
                                id="profilePicture"
                            />
                            <label htmlFor="profilePicture" className="cursor-pointer text-sm text-blue-500 hover:text-blue-600 transition-colors">
                                Change Profile Picture
                            </label>
                        </motion.div>
                        <motion.div
                            className="space-y-2"
                            variants={itemVariants}
                            initial="hidden"
                            animate="visible"
                            transition={{ delay: 0.2 }}
                        >
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 flex items-center">
                                <User className="w-4 h-4 mr-2" /> Name
                            </label>
                            <Input
                                id="name"
                                type="text"
                                {...register('name',{ required: 'Name is required' })}
                                className="w-full"
                            />
                        </motion.div>
                        <motion.div
                            className="space-y-2"
                            variants={itemVariants}
                            initial="hidden"
                            animate="visible"
                            transition={{ delay: 0.3 }}
                        >
                            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 flex items-center">
                                <FileText className="w-4 h-4 mr-2" /> Bio
                            </label>
                            <Textarea
                                id="bio"
                                {...register('bio')}
                                rows={4}
                                className="w-full"
                                placeholder="Tell us about yourself..."
                            />
                        </motion.div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                        <motion.div
                            variants={itemVariants}
                            initial="hidden"
                            animate="visible"
                            transition={{ delay: 0.4 }}
                        >
                            <Button
                                type="submit"
                                disabled={isUpdating || isImageUploading}
                                className="w-full sm:w-auto"
                            >
                                {isUpdating || isImageUploading ? (
                                    <div className="flex items-center justify-center">
                                        <Loader2 className="animate-spin mr-2" />Updating...
                                    </div>
                                ) : 'Update Profile'}
                            </Button>
                        </motion.div>
                    </CardFooter>
                </form>
            </Card>
        </motion.div>
    );
};

export default EditProfile;