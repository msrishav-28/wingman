import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { imageUrl } = await req.json();

        if (!imageUrl) {
            return NextResponse.json({ error: 'Image URL required' }, { status: 400 });
        }

        // Call your Modal Endpoint
        // TODO: Replace with your actual deploy URL after running `modal deploy`
        const modalUrl = process.env.MODAL_OCR_URL || 'https://yourusername--student-companion-ocr-scan.modal.run';

        const modalResponse = await fetch(modalUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ image_url: imageUrl }),
        });

        if (!modalResponse.ok) {
            const errorText = await modalResponse.text();
            console.error('Modal Error:', errorText);
            throw new Error('Failed to process image');
        }

        const data = await modalResponse.json();

        // The data.markdown contains the perfect table/text from DeepSeek
        return NextResponse.json({ success: true, markdown: data.markdown });

    } catch (error) {
        console.error('OCR Route Error:', error);
        return NextResponse.json({ error: 'OCR Failed' }, { status: 500 });
    }
}
