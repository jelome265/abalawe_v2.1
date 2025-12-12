'use client'

import { useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface ProductGalleryProps {
    images: string[] | null
    name: string
}

export function ProductGallery({ images, name }: ProductGalleryProps) {
    const [selectedImage, setSelectedImage] = useState<string>(
        images && images.length > 0 ? images[0] : ''
    )

    if (!images || images.length === 0) {
        return (
            <div className="relative aspect-square overflow-hidden rounded-lg border bg-muted flex items-center justify-center">
                <span className="text-muted-foreground">No image available</span>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="relative aspect-square overflow-hidden rounded-lg border bg-background">
                <Image
                    src={selectedImage}
                    alt={name}
                    fill
                    className="object-contain"
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                />
            </div>
            {images.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                    {images.map((image, index) => (
                        <button
                            key={index}
                            className={cn(
                                "relative aspect-square w-20 flex-shrink-0 overflow-hidden rounded-md border bg-background hover:opacity-100 transition-all",
                                selectedImage === image ? "ring-2 ring-primary" : "opacity-70"
                            )}
                            onClick={() => setSelectedImage(image)}
                        >
                            <Image
                                src={image}
                                alt={`${name} thumbnail ${index + 1}`}
                                fill
                                className="object-cover"
                                sizes="80px"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
