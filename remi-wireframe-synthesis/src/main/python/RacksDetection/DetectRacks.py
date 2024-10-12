import os
import cv2
import imutils
import numpy as np
import utils.loadProperties as lp
import utils.localRunHelpers as lr
from logger.handler import SingletonLogger

logger = SingletonLogger().getLogger()

class DetectRacks:
  """
  This class has methods to process image and identify
  the bounding boxes for the storage spaces
  """
  def __init__(self):

    self.ENVIRONMENT=os.getenv("ENVIRONMENT", "local")
    logger.info(f"Running Environment is {self.ENVIRONMENT}")

    self.classProperties = lp.loadProperties(
        isSpecificClass=True,
        className=self.__class__.__name__
    )
    self.count = 0

  def findBoxes(self, img: np.ndarray):

    logger.info(f"Finding Frames")

    gray = img.copy()

    lr.showImage(gray, f"{self.__class__.__name__}_gray_image")

    blurred = cv2.GaussianBlur(gray, self.classProperties["blur"]["kernal"], self.classProperties["blur"]["sigmaX"])

    lr.showImage(blurred, f"{self.__class__.__name__}_blurred_image")

    edges = cv2.Canny(blurred, self.classProperties["edge"]["canny"]["tLower"],
                      self.classProperties["edge"]["canny"]["tUpper"])

    lr.showImage(edges, f"{self.__class__.__name__}_edges_image")

    dilated = cv2.dilate(edges.copy(), np.ones(self.classProperties["dilate"]["Kernel"], np.uint8), iterations=self.classProperties["dilate"]["iterations"])

    lr.showImage(edges, f"{self.__class__.__name__}_dilated_image")

    eroded = cv2.erode(dilated, np.ones(self.classProperties["erode"]["Kernel"], np.uint8), iterations=self.classProperties["erode"]["iterations"])

    lr.showImage(eroded, f"{self.__class__.__name__}_eroded_image")

    cnts = cv2.findContours(eroded.copy(), cv2.RETR_EXTERNAL,
                            cv2.CHAIN_APPROX_SIMPLE)
    cnts = imutils.grab_contours(cnts)

    minArea = self.classProperties["minArea"]

    img_copy = img.copy()
    obj_rects = []
    for c in cnts:

      area = cv2.contourArea(c)

      if area >= minArea:
        obj_rects.append(self.getRect(c.copy()))

        if self.ENVIRONMENT == "local":
          cv2.drawContours(img_copy, [c], -1, lr.get_cl(self.count), 1)
          self.count += 1
        else:
          cv2.drawContours(img_copy, [c], -1, (255, 0, 0), 1)

    lr.showImage(img_copy, "final")

    if self.ENVIRONMENT == "local":
      self.draw_rects(img, obj_rects)

    logger.info(f"total frames detected : {len(obj_rects)}")

    return obj_rects

  def getRect(self, points):
    reshaped_points = points.reshape(-1, 2)
    min_x = int(np.min(reshaped_points[:, 0]))
    min_y = int(np.min(reshaped_points[:, 1]))
    max_x = int(np.max(reshaped_points[:, 0]))
    max_y = int(np.max(reshaped_points[:, 1]))

    return [[min_x, min_y], [max_x, max_y]]

  def draw_rects(self, img, rectPoints):
    for rect in rectPoints:
      cv2.rectangle(img, rect[0], rect[1], self.classProperties["boundingBox"]["color"], self.classProperties["boundingBox"]["thickness"])
      lr.showImage(cv2.cvtColor(img, cv2.COLOR_RGB2BGR), "rects")