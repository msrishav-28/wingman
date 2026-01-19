---
description: How to deploy the Python OCR Microservice to Modal
---

# Deploying OCR Service to Modal

Your project uses a specialized Python microservice for DeepSeek-OCR to avoid heavy client-side processing. This service is hosted on **Modal**.

### Prerequisites
- A [Modal Account](https://modal.com).
- Python installed locally.
- `modal` CLI installed (`pip install modal`).

### Steps

1.  **Authenticate Modal**:
    Runs the interactive authentication flow.
    ```bash
    modal token new
    ```

2.  **Navigate to OCR Engine**:
    ```bash
    cd ocr-engine
    ```

3.  **Deploy the Service**:
    This command will build the Docker image, setup the GPU, and expose the webhook.
    ```bash
    modal deploy ocr_service.py
    ```

4.  **Get the URL**:
    - After deployment, Modal will print a URL (ending in `.modal.run`).
    - **COPY this URL**.

5.  **Update Frontend Config**:
    - Take the copied URL.
    - Add it as `MODAL_OCR_URL` in your **Vercel Environment Variables** (and local `.env.local` for testing).

### Verification
- Send a `POST` request to your Modal URL with a JSON body `{"image_url": "..."}` to verify it returns markdown.
