/* eslint-disable @typescript-eslint/no-explicit-any */
import React,{ useState } from 'react';
import { useForm,Controller } from 'react-hook-form';
import { Dialog,DialogContent,DialogHeader,DialogTitle,DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select,SelectContent,SelectItem,SelectTrigger,SelectValue } from "@/components/ui/select";
import { useCreatePostMutation } from '@/redux/features/post/postApi';
import { X,Image as ImageIcon,Tag,Globe,Loader2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { cn } from "@/lib/utils";
import dynamic from 'next/dynamic';

const ReactQuill = dynamic(() => import('react-quill'),{ ssr: false });
import 'react-quill/dist/quill.snow.css';
import { toast } from 'sonner';

// Add this interface to define the shape of your form values
interface FormValues {
    title: string;
    content: string;
    category: string;
    tags: string[];
    tagInput: string;
}

interface CreatePostModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen,onClose }) => {
    const [previewImages,setPreviewImages] = useState<string[]>([]);
    const [isImageUploading,setIsImageUploading] = useState(false);
    const [createPost,{ isLoading }] = useCreatePostMutation();
    const { control,handleSubmit,reset,setValue,watch } = useForm<FormValues>({
        defaultValues: {
            title: '',
            content: '',
            category: '',
            tags: [],
            tagInput: ''
        }
    });

    const tags = watch('tags');
    const tagInput = watch('tagInput');

    const onSubmit = async (data: any) => {
        setIsImageUploading(true);
        try {
            const imageUrls = await uploadImages(previewImages);
            const postData = { ...data,image: imageUrls,tags: data.tags };
            delete postData.tagInput;

            await createPost(postData).unwrap();
            toast.success('Post published successfully');
            onClose();
            reset();
            setPreviewImages([]);

        } catch (error) {
            console.error('Failed to create post:',error);
        }
        finally {
            setIsImageUploading(false);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImages(prev => [...prev,reader.result as string]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index: number) => {
        setPreviewImages(prev => prev.filter((_,i) => i !== index));
    };

    const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const value = tagInput.trim();
            if (value && !tags.includes(value)) {
                setValue('tags',[...tags,value]);
                setValue('tagInput','');
            }
        }
    };

    const removeTag = (tagToRemove: string) => {
        setValue('tags',tags.filter(tag => tag !== tagToRemove));
    };

    const uploadImages = async (images: string[]): Promise<string[]> => {

        const uploadPromises = images.map(async (image) => {
            const base64Image = image.split(',')[1];
            const formData = new FormData();
            formData.append('image',base64Image);

            const response = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,{
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            return data.data.url;
        });


        return Promise.all(uploadPromises);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] h-screen md:h-[85vh] p-0 overflow-y-auto">
                <DialogHeader className="p-6 bg-primary/80 text-white h-24">
                    <DialogTitle className="text-2xl font-bold flex items-center">
                        <Globe className="mr-2" />
                        Create a New Journey
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-10 sm:gap-6 p-6">
                    <div className="flex flex-col gap-10 sm:gap-6">
                        {/* Title field */}
                        <div>
                            <Label htmlFor="title" className="text-sm font-medium text-gray-700 dark:text-gray-300">Title</Label>
                            <Controller
                                name="title"
                                control={control}
                                rules={{ required: 'Title is required' }}
                                render={({ field,fieldState: { error } }) => (
                                    <div>
                                        <Input
                                            id="title"
                                            placeholder="Enter your journey title"
                                            {...field}
                                            className={cn(
                                                "mt-1 block w-full rounded-md border-gray-300 shadow-sm",
                                                error && "border-red-500"
                                            )}
                                        />
                                        {error && <p className="mt-1 text-sm text-red-600">{error.message}</p>}
                                    </div>
                                )}
                            />
                        </div>

                        {/* Content field with reduced height */}
                        <div>
                            <Label htmlFor="content" className="text-sm font-medium text-gray-700 dark:text-gray-300">Content</Label>
                            <Controller
                                name="content"
                                control={control}
                                rules={{ required: 'Content is required' }}
                                render={({ field,fieldState: { error } }) => (
                                    <div className="mt-1">
                                        <ReactQuill
                                            theme="snow"
                                            value={field.value}
                                            onChange={field.onChange}
                                            className={cn(
                                                "block w-full rounded-md border-gray-300 shadow-sm",
                                                error && "border-red-500",
                                                "h-32 sm:h-40"
                                            )}
                                            modules={{
                                                toolbar: [
                                                    ['bold','italic','underline','strike'],
                                                    [{ 'list': 'ordered' },{ 'list': 'bullet' }],
                                                    ['link'],
                                                    ['clean']
                                                ],
                                            }}
                                        />
                                        {error && <p className="mt-1 text-sm text-red-600">{error.message}</p>}
                                    </div>
                                )}
                            />
                        </div>

                        {/* Category and Tags fields */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-6">
                            <div>
                                <Label htmlFor="category" className="text-sm font-medium text-gray-700 dark:text-gray-300">Category</Label>
                                <Controller
                                    name="category"
                                    control={control}
                                    rules={{ required: 'Category is required' }}
                                    render={({ field,fieldState: { error } }) => (
                                        <div>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <SelectTrigger id="category" className={cn("mt-1",error && "border-red-500")}>
                                                    <SelectValue placeholder="Select a category" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">All</SelectItem>
                                                    <SelectItem value="adventure">Adventure</SelectItem>
                                                    <SelectItem value="traveling">Traveling</SelectItem>
                                                    <SelectItem value="tourism">Tourism</SelectItem>
                                                    <SelectItem value="business travel">Business Travel</SelectItem>
                                                    <SelectItem value="culture">Culture</SelectItem>
                                                    <SelectItem value="exploration">Exploration</SelectItem>
                                                    <SelectItem value="hiking">Hiking</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {error && <p className="mt-1 text-sm text-red-600">{error.message}</p>}
                                        </div>
                                    )}
                                />
                            </div>

                            <div>
                                <Label htmlFor="tags" className="text-sm font-medium text-gray-700 dark:text-gray-300">Tags</Label>
                                <div className="relative">
                                    <Tag className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                                    <Controller
                                        name="tagInput"
                                        control={control}
                                        render={({ field }) => (
                                            <Input
                                                id="tags"
                                                placeholder="Enter tags, press Enter to add"
                                                {...field}
                                                onKeyDown={handleTagInput}
                                                className="mt-1 pl-10 block w-full rounded-md border-gray-300 shadow-sm"
                                            />
                                        )}
                                    />
                                </div>
                                <div className="flex flex-wrap mt-2 gap-2">
                                    {tags.map((tag,index) => (
                                        <span key={index} className="bg-primary/20 text-primary text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-primary-900 dark:text-primary-300 flex items-center">
                                            {tag}
                                            <button type="button" onClick={() => removeTag(tag)} className="ml-1 text-primary hover:text-primary/80">
                                                <X size={14} />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="images" className="text-sm font-medium text-gray-700 dark:text-gray-300">Images</Label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                <div className="space-y-1 text-center">
                                    <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                                    <div className="flex text-sm text-gray-600">
                                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary/80 font-semibold focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                                            <span>Upload images</span>
                                            <Input id="file-upload" name="file-upload" type="file" className="sr-only" multiple onChange={handleImageChange} accept="image/*" />
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                                </div>
                            </div>
                        </div>

                        {previewImages.length > 0 && (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                                {previewImages.map((img,index) => (
                                    <div key={index} className="relative group">
                                        <img src={img} alt={`Preview ${index}`} className="w-full h-24 object-cover rounded-lg shadow-md" />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute top-1 right-1 bg-primary text-white rounded-full p-1 opacity-100 transition-opacity duration-200"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <DialogFooter className="sm:justify-end">
                        <Button type="button" variant="outline" onClick={onClose} className="mr-0 sm:mr-2 ">
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading || isImageUploading} className=" text-white mb-2 sm:mb-0">
                            {isLoading || isImageUploading ? <><Loader2 className="animate-spin mr-2" />Creating...</> : 'Create Journey'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default CreatePostModal;
