# Dockerfile
FROM public.ecr.aws/lambda/python:3.11

# Install system dependencies
RUN yum install -y git

# Copy and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt --extra-index-url https://download.pytorch.org/whl/cpu

# Copy application code
COPY . ${LAMBDA_TASK_ROOT}

# Set the handler for AWS Lambda
CMD ["main.handler"]
