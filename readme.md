APIShield

APIShield is a Dockerized API gateway setup that demonstrates how a Node.js backend can be protected and exposed through a single controlled entry point.

The project focuses on infrastructure, isolation, and deployability, not application features.

What this project shows

API Gateway pattern using Nginx

Backend isolation behind a reverse proxy

Rate limiting and request control

Multi-service setup using Docker Compose

Architecture
Client
  ↓
Nginx Gateway (8080)
  ↓
Node.js API
  ↓
PostgreSQL + Redis


Only the gateway is accessible from outside the Docker network.

Services (quick view)

Nginx (Gateway)

Reverse proxy

Rate limiting (5 req/sec)

Public entry point

Node.js (Backend)

Internal-only service

Logs requests to Postgres

Tracks hits in Redis

PostgreSQL

Stores access logs

Persistent volume

Redis

Global request counter

AOF persistence enabled

Running the project
git clone https://github.com/OUTLAWatlas/APIShield.git
cd APIShield
docker-compose up --build

Testing
curl http://localhost:8080/api/data


Direct access to backend or database ports is blocked.

Rate limiting can be triggered by spamming the gateway.

Why this exists

Most student projects focus on features.

This one focuses on:

boundaries

reliability

how systems actually run

Scope (intentional limits)

No frontend

No cloud deployment

No Kubernetes

Next improvements

CI to build containers on push

Structured logging

Metrics / observability
