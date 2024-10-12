import os
import sys

os.environ[
  "PROPERTY_FILE_PATH"] = "/Users/vinodpatil/LAB/UPGRAD/Masters/FINAL_THESIS_WRITING/APP/remi-wireframe-synthesis/src/main/resources/properties.yaml"

# os.environ["ENVIRONMENT"] = "local"
ENVIRONMENT = os.getenv("ENVIRONMENT", "local")

module_paths = [
  "/Users/vinodpatil/LAB/UPGRAD/Masters/FINAL_THESIS_WRITING/APP/remi-wireframe-synthesis/src/main/python",
]

for module_path in module_paths:
  assert os.path.exists(
    module_path), f"module path {module_path} does not exist"

  if module_path not in sys.path:
    sys.path.append(module_path)

PROJECT_DIR = "/Users/vinodpatil/LAB/UPGRAD/Masters/FINAL_THESIS_WRITING/APP/remi-wireframe-synthesis"
IMG_MAIN_PATH = os.path.join(PROJECT_DIR, "src/main/resources/sampleImages/set1")
imageNames = ["p2.jpg"]

# rack detector driver
import cv2
import utils.loadProperties as lp
import utils.localRunHelpers as lr
from RacksDetection import DetectRacks


commonProps=lp.loadProperties(True,"Common")

def main():
  detector = DetectRacks.DetectRacks()
  for imageName in imageNames:
    imgPath = os.path.join(IMG_MAIN_PATH, imageName)
    img = cv2.imread(imgPath)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    if ENVIRONMENT == "local":
      lr.showImage(img, "initial")
    img = cv2.resize(img, commonProps["resizeKernal"], interpolation=cv2.INTER_AREA)
    if ENVIRONMENT == "local":
      lr.showImage(img, "resized")
    rectangles = detector.findBoxes(img)
    print(rectangles)

if __name__ == "__main__":
  main()