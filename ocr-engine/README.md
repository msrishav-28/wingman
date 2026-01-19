# DeepSeek-OCR Microservice

This directory contains the Python microservice code for running **DeepSeek-OCR** on Modal (Serverless GPU).

## Prerequisites
1.  **Modal Account**: Sign up at [modal.com](https://modal.com).
2.  **HuggingFace Token**: Get one at [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens).

## Setup
1.  Install Modal CLI:
    ```bash
    pip install modal
    modal setup
    ```

2.  Add your HuggingFace token to Modal secrets:
    ```bash
    modal secret create huggingface HF_TOKEN=your_token_here
    ```

## Deployment
To deploy the service and get your public API URL:

```bash
modal deploy ocr_service.py
```

This will output a URL like: `https://yourusername--student-companion-ocr-scan.modal.run`

## Integration
Copy the URL and set it in your Next.js environment variables:

In `.env.local`:
```bash
MODAL_OCR_URL=https://yourusername--student-companion-ocr-scan.modal.run
```

The Next.js API route (`src/app/api/scan/route.ts`) will automatically use this URL.
