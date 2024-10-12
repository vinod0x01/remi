import sys
import os
from fastapi import FastAPI, HTTPException
from contextlib import asynccontextmanager
import py_eureka_client.eureka_client as eureka_client

def addModulePath():
  os.environ["PROPERTY_FILE_PATH"] = os.path.join(
      os.path.dirname(os.path.dirname(os.path.realpath(__file__))),
      "resources", "properties.yaml"
  )
  print(os.environ["PROPERTY_FILE_PATH"])
  module_paths = [os.path.abspath(os.curdir)]
  for module_path in module_paths:
    assert os.path.exists(
      module_path), f"module path {module_path} does not exist"
    if module_path not in sys.path:
      sys.path.append(module_path)

addModulePath()

from RacksDetection.DetectRacks import DetectRacks
import imageOperations.imageAltrations as img_alts
from models.ImageData import ImageData
from logger.handler import SingletonLogger

logger = SingletonLogger("REMI").getLogger()

logger.info(msg="Starting applicaiton...")

eureka_server = os.getenv("EUREKA_HOST_NAME", default="localhost")
eureka_port = os.environ.get("EUREKA_HOST_PORT", default="8761")
instance_host = os.environ.get("API_INSTANCE_HOST", default="localhost")
instance_port = os.environ.get("API_INSTANCE_PORT", default=8000)


@asynccontextmanager
async def startup(app: FastAPI):
  eureka_client.init(
      eureka_server=f"http://{eureka_server}:{eureka_port}/eureka/",
      app_name="Remi Wireframe",
      instance_port=instance_port,
      instance_host=instance_host,
      on_error=on_error
  )

def on_error(err_type: str, err: Exception):
  logger.error(err_type)
  logger.error(err)

app = FastAPI(lifespan=startup)

@app.get("/")
@app.get("/v1/home")
def home():
  logger.info("/v1/home")
  return {"message": "🐶 Welcome ©REMI APIS"}

@app.post("/v1/findBoxes")
async def findBoxes(imageData: ImageData):
  logger.info("/v1/findBoxes")
  try:
    img = img_alts.getNpArrayFromBytes(imageData.imageBase64)
    imgConverted = img_alts.resizeAndConvertToGray(img)
    detectRacks = DetectRacks()
    bounding_boxes = detectRacks.findBoxes(imgConverted)
    retImg = img_alts.resizeAndConvertToBase64(img)
    return {
      "message": f"wire frame finding is success",
      "image": retImg,
      "coordinates": bounding_boxes
    }

  except Exception as e:
    logger.error(f"Error parsing image {str(e)}")
    raise HTTPException(status_code=400, detail=f"Error Parsing image")

logger.info(msg="Application Started and Runnnig visit http://localhost:8000/v1/home")