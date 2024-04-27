# import the inference-sdk
from inference_sdk import InferenceHTTPClient

# initialize the client
CLIENT = InferenceHTTPClient(
    api_url="https://detect.roboflow.com",
    api_key="QDbKOXh3RpVEGto84m05"
)

# infer on a local image
result = CLIENT.infer("slice-2.jpeg", model_id="proj-ex/1")

print(result['predicted_classes'])