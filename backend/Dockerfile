# ============================
# Stage 1: Install dependencies
# ============================
FROM public.ecr.aws/lambda/python:3.10 AS builder

WORKDIR /app

# Copy only requirements first to leverage Docker layer caching
COPY requirements.txt .

# Install dependencies into /install (no pip cache)
RUN pip install --upgrade pip \
 && pip install --no-cache-dir --target=/install -r requirements.txt

# ============================
# Stage 2: Final AWS Lambda image
# ============================
FROM public.ecr.aws/lambda/python:3.10

WORKDIR /var/task

# Copy dependencies from builder stage
COPY --from=builder /install /var/task

# Copy only required application files (avoid extra context size)
COPY main.py ./
COPY models/ ./models/
COPY services/ ./services/

# Lambda entrypoint
CMD ["main.handler"]
