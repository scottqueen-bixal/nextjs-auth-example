#!/bin/bash

# Test script to verify login flow works

echo "Testing login flow..."

# Test 1: Login with valid credentials
echo "1. Testing login with valid credentials..."
curl -X POST \
  -H "Content-Type: application/json" \
  -H "X-API-Key: dev-api-key-12345-change-in-production" \
  -d '{"email": "john@example.com", "password": "password123"}' \
  http://localhost:8000/user-auth

echo -e "\n\n2. Testing users endpoint..."
curl -H "X-API-Key: dev-api-key-12345-change-in-production" \
  http://localhost:8000/users

echo -e "\n\nTest completed!"
