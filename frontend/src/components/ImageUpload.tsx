"use client";

import { useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";
import { Loader2, Upload, X } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
    onUploadComplete: (url: string) => void;
    currentImage?: string;
    folder?: string;
    accept?: string;
}

export default function ImageUpload({
    onUploadComplete,
    currentImage,
    folder = "uploads",
    accept = "image/*"
}: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(currentImage || null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        // Check if Firebase Storage is configured
        if (!storage) {
            alert("Firebase Storage is not configured. Please add Firebase configuration to .env.local");
            return;
        }

        // Upload to Firebase
        setUploading(true);
        try {
            const timestamp = Date.now();
            const filename = `${folder}/${timestamp}_${file.name}`;
            const storageRef = ref(storage, filename);

            await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(storageRef);

            onUploadComplete(downloadURL);
        } catch (error) {
            console.error("Upload failed:", error);
            alert("Failed to upload image. Please check Firebase configuration.");
        } finally {
            setUploading(false);
        }
    };

    const clearImage = () => {
        setPreview(null);
        onUploadComplete("");
    };

    return (
        <div className="space-y-4">
            {preview ? (
                <div className="relative w-full h-48 rounded-xl overflow-hidden border-2 border-dashed border-gray-300">
                    <Image
                        src={preview}
                        alt="Preview"
                        fill
                        className="object-cover"
                    />
                    <button
                        onClick={clearImage}
                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            ) : (
                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-green-500 transition-colors bg-gray-50 hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="h-10 w-10 text-gray-400 mb-3" />
                        <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    </div>
                    <input
                        type="file"
                        className="hidden"
                        accept={accept}
                        onChange={handleFileChange}
                        disabled={uploading}
                    />
                </label>
            )}

            {uploading && (
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Uploading...
                </div>
            )}
        </div>
    );
}
