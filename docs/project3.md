# Project 3: "The Persistent Greeting"

## Overview

You will modify your app so that every time someone clicks the button on your website, a counter is incremented and displayed to show the total number of visitors.

## What You Will Build

### 🗂️ Persistent Data Storage
- **DynamoDB Table**: A serverless database to store your counter

### ⚡ Lambda Function Enhancement
- Increments a counter in the database with each button click
- Returns the total number of visitors to the frontend

### 🌐 Dynamic Frontend
- Displays visitor count in real-time
- Shows: *"Hello! You are visitor number 42."*

## Architecture

```
User Button Click → API Gateway → Lambda Function
                                      ↓
                                  DynamoDB
                                      ↓
                                   Response
                                      ↓
                                Website Display
```

## How It Works

1. User clicks button on your website
2. Frontend sends request to API Gateway
3. Lambda function reads current counter from DynamoDB
4. Counter is incremented and saved back to database
5. Updated count is returned to the frontend
6. Website displays the new visitor number

## Key Features

- ✅ Persistent data storage
- ✅ Real-time counter updates
- ✅ Scalable serverless architecture
- ✅ Stateful application with state management
