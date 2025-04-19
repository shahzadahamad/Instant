# Environment Setup Guide

This guide provides the necessary environment variables required to run the **Instant** social media platform.

---

## Backend Environment Variables
Create a `.env` file inside the `Backend` directory and add the following:

```env
PORT=your_port  # Example: 3000
MONGO_URL=your_mongodb_connection_string
MAILER_EMAIL=your_email
MAILER_PASSWORD=your_email_password
CORS_ORIGIN=https://localhost:5173
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
JWT_SECRET=your_jwt_secret
JWT_SECRET_2=your_jwt_secret_2
JWT_REFRESH_SECRET=your_jwt_refresh_secret
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=your_aws_region
AWS_BUCKET_NAME=your_aws_bucket_name
STRIPE_API_KEY=your_stripe_api_key
STRIPE_WEBHOOK_SECRET_KEY=your_stripe_webhook_secret
SUCCESS_URL=https://localhost:5173/verification-success
CANCEL_URL=https://localhost:5173/verification-failed

# API Routes
API_USER_AUTH=/api/auth
API_USER=/api/user
API_USER_MUSIC=/api/user/music
API_USER_POST=/api/user/post
API_USER_CHAT=/api/user/chats
API_USER_SUBSCRIPTION=/api/user/subscription
API_USER_SEARCH_HISTORY=/api/user/search-history
API_USER_STORY=/api/user/story

API_ADMIN=/api/admin
API_ADMIN_AUTH=/api/admin/auth
API_ADMIN_USER=/api/admin/users
API_ADMIN_MUSIC=/api/admin/music
API_ADMIN_SUBSCRIPTION=/api/admin/subscription
API_ADMIN_POST=/api/admin/post

API_WEBHOOK=/webhook
```

---

## Frontend Environment Variables
Create a `.env` file inside the `Frontend` directory and add the following:

```env
VITE_API_BASE_URL=http://localhost:your_port/api
VITE_ADMIN_BASE_URL=http://localhost:your_port/api/admin
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
VITE_SOCKET_URL=http://localhost:your_port
VITE_ZEGO_CLOUD_APP_ID=your_zegocloud_app_id
VITE_ZEGO_CLOUD_SERVER_SECRET=your_zegocloud_server_secret
```

---

## Setting Up Your Port
Replace `your_port` with your desired port number. Example:
- If running the backend on **port 3000**, set:
  ```env
  VITE_API_BASE_URL=http://localhost:3000/api
  VITE_ADMIN_BASE_URL=http://localhost:3000/api/admin
  VITE_SOCKET_URL=http://localhost:3000
  ```

---

## Final Steps
1. Create `.env` files in both `Backend` and `Frontend` directories.
2. Fill in the necessary credentials.
3. Restart the servers after setting up environment variables.

Now you're ready to run **Instant**! 🚀

