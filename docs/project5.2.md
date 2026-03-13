# Project 5 (Part 2): Private Gallery

## The Architecture

- **List API**: A new Lambda function that lists all files inside a user's private folder (private/{userId}/).
- **Download API**: A Lambda (or reuse your upload one) to generate GET Pre-signed URLs so the browser can securely display the images.
- **React Gallery**: A grid in your frontend that shows the user's files.

## What you are learning now:

- **S3 Prefix Filtering**: How to use "folders" in S3 (even though S3 doesn't technically have folders, only prefixes).
- **Data Mapping**: Transforming raw S3 data into a clean JSON list for your UI.
- **Read vs Write Permissions**: Distinguishing between who can upload versus who can see the directory. 