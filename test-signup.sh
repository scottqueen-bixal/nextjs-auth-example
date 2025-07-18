#!/bin/bash

# Test script to verify signup flow and duplicate email handling

echo "Testing signup flow and duplicate email handling..."
echo "=========================================="

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

# Test 1: Create a new user successfully
echo -e "\n1. Testing signup with new valid user..."
echo "Creating user: test@example.com"
curl -X POST \
  -H "Content-Type: application/json" \
  -H "X-API-Key: $API_KEY" \
  -d '{
    "first_name": "Test",
    "last_name": "User",
    "email": "test@example.com",
    "password": "TestPass123!"
  }' \
  $API_URL/users

# Test 2: Try to create the same user again (should get 409 error)
echo -e "\n\n2. Testing signup with duplicate email (should return 409)..."
echo "Attempting to create duplicate user: test@example.com"
curl -X POST \
  -H "Content-Type: application/json" \
  -H "X-API-Key: $API_KEY" \
  -d '{
    "first_name": "Another",
    "last_name": "User",
    "email": "test@example.com",
    "password": "DifferentPass456!"
  }' \
  $API_URL/users

# Test 3: Try to create user with existing email from seed data
echo -e "\n\n3. Testing signup with existing seeded email (should return 409)..."
echo "Attempting to create user with existing email: john@example.com"
curl -X POST \
  -H "Content-Type: application/json" \
  -H "X-API-Key: $API_KEY" \
  -d '{
    "first_name": "John",
    "last_name": "Duplicate",
    "email": "john@example.com",
    "password": "NewPassword789!"
  }' \
  $API_URL/users

# Test 4: Create another unique user successfully
echo -e "\n\n4. Testing signup with another new valid user..."
echo "Creating user: unique@example.com"
curl -X POST \
  -H "Content-Type: application/json" \
  -H "X-API-Key: $API_KEY" \
  -d '{
    "first_name": "Unique",
    "last_name": "User",
    "email": "unique@example.com",
    "password": "UniquePass321!"
  }' \
  $API_URL/users

# Test 5: Test validation errors (invalid email format)
echo -e "\n\n5. Testing signup with invalid email format..."
echo "Attempting to create user with invalid email: invalid-email"
curl -X POST \
  -H "Content-Type: application/json" \
  -H "X-API-Key: $API_KEY" \
  -d '{
    "first_name": "Invalid",
    "last_name": "Email",
    "email": "invalid-email",
    "password": "ValidPass123!"
  }' \
  $API_URL/users

# Test 6: Test validation errors (weak password)
echo -e "\n\n6. Testing signup with weak password..."
echo "Attempting to create user with weak password: weak@example.com"
curl -X POST \
  -H "Content-Type: application/json" \
  -H "X-API-Key: $API_KEY" \
  -d '{
    "first_name": "Weak",
    "last_name": "Password",
    "email": "weak@example.com",
    "password": "123"
  }' \
  $API_URL/users

# Test 7: Check all users to verify what was created
echo -e "\n\n7. Checking all users in the database..."
curl -H "X-API-Key: $API_KEY" \
  $API_URL/users

echo -e "\n\nSignup test completed!"
echo "=========================================="
echo "Expected results:"
echo "- Test 1: Should succeed (201 Created)"
echo "- Test 2: Should fail with 409 (duplicate email)"
echo "- Test 3: Should fail with 409 (duplicate email from seed)"
echo "- Test 4: Should succeed (201 Created)"
echo "- Test 5: Should fail with validation error (invalid email)"
echo "- Test 6: Should fail with validation error (weak password)"
echo "- Test 7: Should show all users including newly created ones"
