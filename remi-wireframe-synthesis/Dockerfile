FROM python:3.10-alpine
WORKDIR /app
RUN apk add --no-cache build-base libffi-dev openblas-dev &&  \
    pip install --upgrade pip setuptools wheel && \
    pip install imutils==0.5.4 && \
    pip install "fastapi[standard]" && \
    pip install opencv-python-headless==4.10.0.84 &&  \
    pip install numpy
RUN pip install py-eureka-client
COPY ./src/main/python /app/src/main/python
COPY ./src/main/resources /app/src/main/resources
RUN mkdir /app/src/main/logs
EXPOSE 8000
WORKDIR /app/src/main/python
CMD ["fastapi", "run", "main.py"]

