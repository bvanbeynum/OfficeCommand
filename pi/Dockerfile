FROM python:3.11-alpine

WORKDIR /usr/src/app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Application code should be mounted to /usr/src/app at runtime
# Run the ingestion layer
CMD ["python", "-u", "./main.py"]
