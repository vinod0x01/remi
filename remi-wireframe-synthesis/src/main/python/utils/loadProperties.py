import yaml
import os
from logger.handler import SingletonLogger

logger = SingletonLogger().getLogger()

def loadProperties(isSpecificClass: bool = False, className: bool = None) -> dict:
  logger.info("loading property file")
  PROPERTY_FILE_PATH = os.getenv("PROPERTY_FILE_PATH")
  assert PROPERTY_FILE_PATH is not None, logger.critical(f"PROPERTY_FILE_PATH is not present in environemt")

  assert os.path.exists(PROPERTY_FILE_PATH), logger.critical(f"{PROPERTY_FILE_PATH} does not exists")
  assert os.path.isfile(PROPERTY_FILE_PATH), logger.critical(f"{PROPERTY_FILE_PATH} is not a file")
  properties = {}
  with open(PROPERTY_FILE_PATH, 'r') as stream:
    properties = yaml.safe_load(stream)
  if isSpecificClass:
    assert className is not None, logger.error("className not provided to load properties from property file")
    if className in properties.keys():
      return properties[className]

  return properties


