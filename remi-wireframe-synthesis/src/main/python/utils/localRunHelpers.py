import cv2
import os

# this is a temp method which need to be removed
def showImage(img, img_alt="img"):
  if os.getenv("ENVIRONMENT", "local") != "local":
    return

  cv2.imshow(img_alt, img)
  cv2.waitKey(0)
  cv2.destroyAllWindows()


def get_cl(count):
  cl = [
    (255, 255, 0), (0, 255, 255), (255, 0, 255), (255, 255, 255),
    (255, 127, 80), (100, 149, 237)
  ]
  return cl[count%len(cl)]