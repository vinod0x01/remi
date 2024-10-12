import logging
import os
from logging.handlers import RotatingFileHandler
import threading

class SingletonLogger:
  _instance = None
  _lock = threading.Lock()

  def __new__(cls, *args, **kwargs):
    if not cls._instance:
      with cls._lock:
        cls._instance = super(SingletonLogger, cls).__new__(cls)
        cls._instance._setup_logger("REMI")
    return cls._instance

  def _setup_logger(self, name):

    self.logger = logging.getLogger(name)

    if os.getenv("ENVIRONMENT") == "local":
      self.logger.setLevel(logging.DEBUG)
    else:
      self.logger.setLevel(logging.INFO)

      logs_location = os.path.join(
          os.path.dirname(os.path.dirname(os.path.dirname(os.path.realpath(__file__)))),
          "logs", "app.log"
      )

    file_handler = RotatingFileHandler(
        logs_location, maxBytes=2000, backupCount=5
    )
    console_handler = logging.StreamHandler()

    if os.getenv("ENVIRONMENT") == "local":
      file_handler.setLevel(logging.DEBUG)
      console_handler.setLevel(logging.DEBUG)
    else:
      file_handler.setLevel(logging.INFO)
      console_handler.setLevel(logging.INFO)

    formatter = logging.Formatter("%(asctime)s - %(name)s - %(levelname)s - %(message)s")

    file_handler.setFormatter(formatter)
    console_handler.setFormatter(formatter)

    self.logger.addHandler(file_handler)
    self.logger.addHandler(console_handler)

  def getLogger(self):
    return self.logger