FROM python:3.11-alpine

WORKDIR /usr/src/app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Ensure the script is executable
RUN chmod +x main.py

# Run the ingestion layer
CMD ["python", "-u", "./main.py"]
