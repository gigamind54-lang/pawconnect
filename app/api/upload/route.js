import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file');

        if (!file) {
            return NextResponse.json(
                { error: 'No file provided' },
                { status: 400 }
            );
        }

        // Upload to Vercel Blob
        const blob = await put(file.name, file, {
            access: 'public',
            addRandomSuffix: true, // Prevents conflicts
        });

        return NextResponse.json({
            success: true,
            url: blob.url,
            downloadUrl: blob.downloadUrl,
            pathname: blob.pathname
        });

    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { error: 'Upload failed: ' + error.message },
            { status: 500 }
        );
    }
}
