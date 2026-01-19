import modal

# 1. Define the Image (The Environment)
# We use the specific dependencies required by DeepSeek-OCR
image = (
    modal.Image.debian_slim()
    .pip_install(
        "vllm==0.6.3.post1",  # Use stable version compatible with Vision
        "torch",
        "transformers",
        "pillow",
        "numpy"
    )
)

app = modal.App("student-companion-ocr")

# 2. Download the Model weights into the container image
# This prevents downloading it every time the app starts (Cold Start optimization)
with image.imports():
    from vllm import LLM, SamplingParams

@app.cls(
    gpu="A10G",  # Cheap & Fast
    image=image,
    secrets=[modal.Secret.from_name("huggingface")], # Access your HF token
    container_idle_timeout=300, # Keep GPU warm for 5 mins after use
    timeout=600, 
)
class OCRService:
    @modal.enter()
    def load_model(self):
        # This runs once when the container starts
        print("📥 Loading DeepSeek-OCR Model...")
        self.llm = LLM(
            model="deepseek-ai/DeepSeek-OCR",
            enforce_eager=True, # Often needed for specialized architectures
            trust_remote_code=True,
            gpu_memory_utilization=0.95 
        )
        self.sampling_params = SamplingParams(
            temperature=0.1,
            max_tokens=4096,
            skip_special_tokens=True
        )
        print("✅ Model Loaded!")

    @modal.method()
    def scan_image_url(self, image_url: str):
        from vllm import Inputs
        
        # Define the specific prompt for DeepSeek-OCR
        # <|grounding|> triggers the structured output mode
        prompt = "<image>\n<|grounding|>Convert the document to markdown."
        
        inputs = {
            "prompt": prompt,
            "multi_modal_data": {
                "image": image_url # vLLM handles URL downloading automatically
            },
        }
        
        outputs = self.llm.generate([inputs], sampling_params=self.sampling_params)
        generated_text = outputs[0].outputs[0].text
        return generated_text

# 3. Expose as a Web Endpoint
@app.function()
@modal.web_endpoint(method="POST")
def scan(item: dict):
    # This is the function your Next.js app will call
    url = item.get("image_url")
    if not url:
        return {"error": "No URL provided"}
    
    # Initialize the class and run
    service = OCRService()
    markdown = service.scan_image_url.remote(url)
    
    return {"markdown": markdown}
