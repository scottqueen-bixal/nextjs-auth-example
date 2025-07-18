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
response=$(curl -s -X POST \
  -H "Content-Type: application/json" \
  -H "X-API-Key: $API_KEY" \
  -d '{"email": "john@example.com", "password": "password123"}' \
  $API_URL/user-auth)
echo "Response: $response"

# Test 2: Login with invalid email (should return "User not found")
echo -e "\n2. Testing login with invalid email (expecting 'User not found')..."
response=$(curl -s -w "HTTP_STATUS:%{http_code}" -X POST \
  -H "Content-Type: application/json" \
  -H "X-API-Key: $API_KEY" \
  -d '{"email": "nonexistent@example.com", "password": "password123"}' \
  $API_URL/user-auth)
http_status=$(echo $response | grep -o "HTTP_STATUS:[0-9]*" | cut -d: -f2)
response_body=$(echo $response | sed 's/HTTP_STATUS:[0-9]*$//')
echo "HTTP Status: $http_status"
echo "Response: $response_body"
if [[ $http_status == "404" && $response_body == *"User not found"* ]]; then
    echo "✅ PASS: Correct 404 error for invalid email"
else
    echo "❌ FAIL: Expected 404 with 'User not found' message"
fi

# Test 3: Login with valid email but wrong password (should return "Invalid password")
echo -e "\n3. Testing login with wrong password (expecting 'Invalid password')..."
response=$(curl -s -w "HTTP_STATUS:%{http_code}" -X POST \
  -H "Content-Type: application/json" \
  -H "X-API-Key: $API_KEY" \
  -d '{"email": "john@example.com", "password": "wrongpassword"}' \
  $API_URL/user-auth)
http_status=$(echo $response | grep -o "HTTP_STATUS:[0-9]*" | cut -d: -f2)
response_body=$(echo $response | sed 's/HTTP_STATUS:[0-9]*$//')
echo "HTTP Status: $http_status"
echo "Response: $response_body"
if [[ $http_status == "401" && $response_body == *"Invalid password"* ]]; then
    echo "✅ PASS: Correct 401 error for wrong password"
else
    echo "❌ FAIL: Expected 401 with 'Invalid password' message"
fi

# Test 4: Login with missing email field (should return 400)
echo -e "\n4. Testing login with missing email (expecting 400 error)..."
response=$(curl -s -w "HTTP_STATUS:%{http_code}" -X POST \
  -H "Content-Type: application/json" \
  -H "X-API-Key: $API_KEY" \
  -d '{"password": "password123"}' \
  $API_URL/user-auth)
http_status=$(echo $response | grep -o "HTTP_STATUS:[0-9]*" | cut -d: -f2)
response_body=$(echo $response | sed 's/HTTP_STATUS:[0-9]*$//')
echo "HTTP Status: $http_status"
echo "Response: $response_body"
if [[ $http_status == "400" && $response_body == *"Email and password are required"* ]]; then
    echo "✅ PASS: Correct 400 error for missing email"
else
    echo "❌ FAIL: Expected 400 with 'Email and password are required' message"
fi

# Test 5: Login with missing password field (should return 400)
echo -e "\n5. Testing login with missing password (expecting 400 error)..."
response=$(curl -s -w "HTTP_STATUS:%{http_code}" -X POST \
  -H "Content-Type: application/json" \
  -H "X-API-Key: $API_KEY" \
  -d '{"email": "john@example.com"}' \
  $API_URL/user-auth)
http_status=$(echo $response | grep -o "HTTP_STATUS:[0-9]*" | cut -d: -f2)
response_body=$(echo $response | sed 's/HTTP_STATUS:[0-9]*$//')
echo "HTTP Status: $http_status"
echo "Response: $response_body"
if [[ $http_status == "400" && $response_body == *"Email and password are required"* ]]; then
    echo "✅ PASS: Correct 400 error for missing password"
else
    echo "❌ FAIL: Expected 400 with 'Email and password are required' message"
fi

echo -e "\n\n6. Testing users endpoint..."
curl -H "X-API-Key: $API_KEY" \
  $API_URL/users

echo -e "\n\nTest completed!"
