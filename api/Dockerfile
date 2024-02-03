# Use an official, version-specific base image for Python
FROM python:3.10-slim

# Set the working directory inside the container to /api
WORKDIR /api

# Copy the backend requirement file into the container at /api
COPY ./requirements.txt /api/

# Install the required Python packages
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the backend application source code
COPY . /api/

# Download the NLTK packages
RUN python -m nltk.downloader punkt stopwords

# Command to run the application
CMD ["uvicorn", "index:app", "--host", "0.0.0.0"]
