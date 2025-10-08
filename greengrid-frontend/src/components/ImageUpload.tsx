import React, { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import {
    Upload,
    X,
    Image as ImageIcon,
    Loader2,
    Brain
} from 'lucide-react';

interface UploadedImage {
    url: string;
    publicId: string;
    analysis?: {
        wasteType: string;
        severityLevel: string;
        environmentalImpact: number;
        recommendedAction: string;
        estimatedVolume: string;
        confidence: number;
    };
}

interface ImageUploadProps {
    onImagesUploaded: (images: UploadedImage[]) => void;
    maxImages?: number;
    existingImages?: UploadedImage[];
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
    onImagesUploaded,
    maxImages = 5,
    existingImages = []
}) => {
    const [images, setImages] = useState<UploadedImage[]>(existingImages);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (files: FileList | null) => {
        if (!files || files.length === 0) return;

        const remainingSlots = maxImages - images.length;
        const filesToUpload = Array.from(files).slice(0, remainingSlots);

        if (filesToUpload.length === 0) {
            alert(`Maximum ${maxImages} images allowed`);
            return;
        }

        await uploadImages(filesToUpload);
    };

    const uploadImages = async (files: File[]) => {
        setUploading(true);
        setUploadProgress(0);

        try {
            const formData = new FormData();
            files.forEach(file => {
                formData.append('images', file);
            });

            // Simulate progress
            const progressInterval = setInterval(() => {
                setUploadProgress(prev => Math.min(prev + 10, 90));
            }, 200);

            const response = await fetch('http://localhost:5000/api/upload/images', {
                method: 'POST',
                body: formData
            });

            clearInterval(progressInterval);
            setUploadProgress(100);

            const result = await response.json();

            if (result.success) {
                const newImages = [...images, ...result.images];
                setImages(newImages);
                onImagesUploaded(newImages);

                // Show success message
                console.log('✅ Images uploaded successfully:', result.images);
            } else {
                throw new Error(result.message);
            }

        } catch (error) {
            console.error('❌ Upload failed:', error);
            alert('Upload failed. Please try again.');
        } finally {
            setUploading(false);
            setUploadProgress(0);
        }
    };

    const removeImage = async (index: number) => {
        const imageToRemove = images[index];

        try {
            // Delete from Cloudinary
            await fetch(`http://localhost:5000/api/upload/images/${imageToRemove.publicId}`, {
                method: 'DELETE'
            });

            const newImages = images.filter((_, i) => i !== index);
            setImages(newImages);
            onImagesUploaded(newImages);
        } catch (error) {
            console.error('❌ Failed to delete image:', error);
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files) {
            handleFileSelect(e.dataTransfer.files);
        }
    };

    const getSeverityColor = (severity: string) => {
        switch (severity?.toLowerCase()) {
            case 'critical': return 'bg-red-100 text-red-800 border-red-200';
            case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'low': return 'bg-green-100 text-green-800 border-green-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <div className="space-y-4">
            {/* Upload Area */}
            <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragActive
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <div className="space-y-4">
                    <div className="flex justify-center">
                        {uploading ? (
                            <Loader2 className="w-12 h-12 animate-spin text-primary" />
                        ) : (
                            <Upload className="w-12 h-12 text-gray-400" />
                        )}
                    </div>

                    <div>
                        <h3 className="text-lg font-medium">
                            {uploading ? 'Uploading & Analyzing...' : 'Upload Waste Images'}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                            Drag and drop or click to select images (Max {maxImages} images, 5MB each)
                        </p>
                    </div>

                    {uploading && (
                        <div className="max-w-xs mx-auto">
                            <Progress value={uploadProgress} className="h-2" />
                            <p className="text-xs text-gray-500 mt-1">
                                {uploadProgress < 90 ? 'Uploading...' : 'AI Analysis in progress...'}
                            </p>
                        </div>
                    )}

                    {!uploading && (
                        <Button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={images.length >= maxImages}
                            className="gap-2"
                        >
                            <ImageIcon className="w-4 h-4" />
                            Select Images ({images.length}/{maxImages})
                        </Button>
                    )}

                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => handleFileSelect(e.target.files)}
                        className="hidden"
                    />
                </div>
            </div>

            {/* Uploaded Images */}
            {images.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {images.map((image, index) => (
                        <Card key={index} className="overflow-hidden">
                            <div className="relative">
                                <img
                                    src={image.url}
                                    alt={`Upload ${index + 1}`}
                                    className="w-full h-48 object-cover"
                                />
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    className="absolute top-2 right-2"
                                    onClick={() => removeImage(index)}
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>

                            {/* AI Analysis Results */}
                            {image.analysis && (
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Brain className="w-4 h-4 text-purple-600" />
                                        <span className="text-sm font-medium">AI Analysis</span>
                                        <Badge variant="outline" className="text-xs">
                                            {image.analysis.confidence}% confidence
                                        </Badge>
                                    </div>

                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span>Waste Type:</span>
                                            <Badge variant="secondary">
                                                {image.analysis.wasteType}
                                            </Badge>
                                        </div>

                                        <div className="flex justify-between">
                                            <span>Severity:</span>
                                            <Badge className={getSeverityColor(image.analysis.severityLevel)}>
                                                {image.analysis.severityLevel}
                                            </Badge>
                                        </div>

                                        <div className="flex justify-between">
                                            <span>Volume:</span>
                                            <span className="font-medium">{image.analysis.estimatedVolume}</span>
                                        </div>

                                        <div className="flex justify-between">
                                            <span>Impact:</span>
                                            <span className="font-medium">
                                                {image.analysis.environmentalImpact}/10
                                            </span>
                                        </div>

                                        <div className="mt-3 p-2 bg-gray-50 rounded text-xs">
                                            <strong>Recommendation:</strong> {image.analysis.recommendedAction}
                                        </div>
                                    </div>
                                </CardContent>
                            )}
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ImageUpload;
