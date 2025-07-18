#!/bin/bash

# Test script to verify login flow works

echo "Testing login flow..."
echo "===================="

# Navigate to the script's directory (project root)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Load environment variables from .env file in project root
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
    echo "Loaded environment variables from .env"
else
    echo "Warning: .env file not found in project root, using default values"
fi

# Use environment variables or fallback to defaults
API_URL="${NEXT_PUBLIC_API_URL:-http://localhost:8000}"
API_KEY="${API_KEY:-dev-api-key-12345-change-in-production}"

echo "Using API_URL: $API_URL"
echo "Using API_KEY: $API_KEY"

# Test 1: Login with valid credentials
echo -e "\n1. Testing login with valid credentials..."
curl -X POST \
  -H "Content-Type: application/json" \
  -H "X-API-Key: $API_KEY" \
  -d '{"email": "john@example.com", "password": "password123"}' \
  $API_URL/user-auth

echo -e "\n\n2. Testing users endpoint..."
curl -H "X-API-Key: $API_KEY" \
  $API_URL/users

echo -e "\n\nTest completed!"
