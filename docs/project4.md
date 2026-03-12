# Project 4: The "Members Only" Area (AWS Cognito)

## Overview

Currently, anyone in the world can click your button and increment your counter. In this project, you will add a **Sign-Up/Login flow** so that only registered users can access your API.

## What You Will Build

### 🔐 AWS Cognito User Pool
A managed directory for your users that handles:
- Password management
- Email verification
- Multi-factor authentication (MFA)

### 🚪 Cognito Authorizer
A "bouncer" for your API Gateway that:
- Checks if a user is logged in before letting them talk to your Lambda
- Validates authentication tokens before allowing access
- Protects your API endpoints from unauthorized users

### 🎨 Authentication UI
- Login form on your static website
- Sign-up flow for new users
- Secure authentication and session management

## Why This Is the Perfect Next Step

### 🔒 **Security**
You'll learn how to protect your cloud resources from unauthorized use. Not all API calls are created equal—some belong to your users, and some are from attackers.

### 🆔 **Identity**
You'll learn how to identify who is calling your API. Instead of just saying "Hello, Visitor!", you can now say "Hello, Samir!" and personalize the experience.

### 💼 **Standard Practice**
Almost every professional app requires a login system. Learning AWS Cognito is a high-value skill for any developer and a requirement in real-world development.

## The Architecture Change

### Frontend: User Authentication
```
User → Static Website → Sign-Up/Login Form → AWS Cognito
         ↓
    Receives JWT (JSON Web Token)
```

### API Call with Authorization
```
Frontend sends request with:
Authorization: Bearer <JWT_TOKEN>
         ↓
    API Gateway
```

### API Gateway: Token Verification
```
API Gateway automatically verifies the token with Cognito:
✅ If valid   → Lambda function runs
❌ If invalid → Returns 401 Unauthorized
         ↓
    Protect your resources from unauthorized use
```

## Complete Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        User Journey                         │
└─────────────────────────────────────────────────────────────┘

1. AUTHENTICATION
   User → Login Page → Cognito → JWT Token Issued

2. API REQUEST
   Frontend adds token to Authorization header
   
3. AUTHORIZATION
   API Gateway → Validates token with Cognito
   
4. EXECUTION
   ✅ Valid token   → Lambda executes → DynamoDB updated
   ❌ Invalid token → 401 Unauthorized returned
```

## Key Components

| Component | Purpose |
|-----------|---------|
| **Cognito User Pool** | User registration, authentication, and password management |
| **JWT Token** | Secure credential proving the user is authenticated |
| **Cognito Authorizer** | Validates tokens before allowing API access |
| **API Gateway** | Routes authenticated requests to Lambda |
| **Lambda** | Executes business logic only for authorized users |
| **DynamoDB** | Stores counter data associated with authenticated users |

## Key Features

- ✅ User registration and login with email verification
- ✅ Password security and validation
- ✅ Multi-factor authentication (MFA) support
- ✅ JWT-based API protection
- ✅ Automatic token verification with Cognito Authorizer
- ✅ Session management and token refresh
- ✅ 401 Unauthorized response for invalid tokens