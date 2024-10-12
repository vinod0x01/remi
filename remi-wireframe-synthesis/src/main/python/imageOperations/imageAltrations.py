import cv2
import numpy as np
import base64
import utils.loadProperties as lp
from logger.handler import SingletonLogger

logger = SingletonLogger().getLogger()
commonProps = lp.loadProperties(True, "Common")

def resizeAndConvertToGray(img: np.ndarray) -> np.ndarray:
  logger.info("resizing and converting image")
  img = resizeImage(img)
  img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
  return img

def resizeImage(img: np.ndarray) -> np.ndarray:
  logger.info("Resizing image")
  logger.debug(f"Recieved image : {img.shape}")
  img = cv2.imdecode(img, cv2.IMREAD_COLOR)
  img = cv2.resize(img, commonProps["resizeKernal"],
                   interpolation=cv2.INTER_AREA)
  return img

def resizeAndConvertToBase64(img: np.ndarray) -> np.ndarray:
  logger.info("converting image to base64")
  img = resizeImage(img)
  # converting resized image to bytes
  success, buffer = cv2.imencode(".jpg", img)
  if not success:
    msg = "Failed to encode image"
    logger.error(msg)
    raise ValueError(msg)
  byteStream = buffer.tobytes()
  base64Encoded = base64.b64encode(byteStream).decode("utf-8")
  return base64Encoded

def getNpArrayFromBytes(imageBase64: str):
  logger.info("parsing base64 string to image")
  imageBytes = base64.b64decode(imageBase64)
  img = np.frombuffer(imageBytes, dtype=np.uint8)
  return img

def combineImagesHorizontally(images: list) -> np.ndarray:
  logger.info("Stiching images to single view")
  combinedImage = np.hstack(images)
  return combinedImage