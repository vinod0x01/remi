from pydantic import BaseModel

class ImageData(BaseModel):
  imageBase64: str