# Notification System Design

## Objective
->Notify mechanics about selected maintenance tasks.

## Architecture
->Event-driven microservices architecture.

## Flow
->Scheduler selects optimal tasks
->Event is pushed to message queue
->Notification service consumes event
->Sends email/SMS to mechanics

## Technologies
->Node.js
->Kafka / RabbitMQ
->Email/SMS APIs

## Scaling
->Horizontal scaling
->Load balancing
->Microservices separation