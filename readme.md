APIShield

APIShield is a containerized infrastructure project that demonstrates the API Gateway pattern in a production-style setup.

It isolates a Node.js backend behind an Nginx reverse proxy, ensuring that all incoming traffic is filtered, rate-limited, and controlled before reaching application logic.

The project focuses on security boundaries, deployability, and infrastructure-as-code using Docker and Docker Compose.

Architecture Overview

All services run on a private Docker network.
Only the Nginx gateway is exposed publicly.

Client
  ↓
Nginx Gateway (8080)
  ↓
Node.js Backend
  ↓
PostgreSQL / Redis

Services
1. Gateway (Nginx)

Role: Reverse Proxy and API Shield

Enforces rate limiting (5 requests/second)

Sanitizes and forwards headers

Performs health checks

Acts as the single public entry point

Exposed Port: 8080

2. Backend (Node.js / Express)

Role: Application logic

Not exposed to the host

Accessible only through the Nginx gateway

Logs requests to PostgreSQL

Increments a global request counter in Redis

3. Database (PostgreSQL)

Role: Persistent storage

Stores access logs

Uses a Docker volume (pg-data) for persistence

Accessible only within the Docker network

4. Cache (Redis)

Role: High-speed global counter

Tracks request hits

AOF persistence enabled to survive restarts

Internal-only service

Key Design Decisions

Single Entry Point: Only the gateway is reachable from outside

Service Isolation: Backend, database, and cache are never exposed

Infrastructure First: Features are minimal; system boundaries are the focus

Reproducibility: Entire stack starts with one command

Configuration via Environment Variables: No hardcoded secrets

Getting Started
Prerequisites

Docker

Docker Compose

Setup

Clone the repository:

git clone https://github.com/OUTLAWatlas/APIShield.git

cd APIShield


Start the system:

docker-compose up --build -d


Verify running services:

docker-compose ps

Testing the Gateway
1. Valid Request (Through Gateway)
curl http://localhost:8080/api/data


Expected response:

{
  "message": "APIShield Protected Response",
  "data_sources": {
    "postgres_logs": 12,
    "redis_hits": 12
  }
}

2. Security Test (Direct Access)

Attempt to bypass the gateway:

curl http://localhost:3000/api/data


Result:

Connection refused


The backend is correctly isolated.

3. Rate Limiting Test

Trigger Nginx rate limiting:

for i in {1..20}; do
  curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8080/api/data
done


Expected behavior:

Initial responses return 200

Excess requests return 503 Service Temporarily Unavailable

Technical Summary

Networking: Custom Docker bridge network

Persistence: Named Docker volumes for PostgreSQL and Redis

Configuration: Environment variables defined in docker-compose.yml

Deployment Model: Local, reproducible, containerized system

Project Scope

This project intentionally avoids:

Frontend development

Cloud deployment

Kubernetes

Feature-heavy application logic

The focus is on API boundaries, container networking, and deployability.
