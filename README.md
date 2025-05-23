# <p align="center">Instant</p>

Instant is a dynamic social media platform designed for real-time interaction, content sharing, and seamless user engagement.

## Features

### **User Profiles & Verification**
- Users get a profile upon signup.
- Follow/unfollow functionality.
- Private account settings for profile visibility.
- **Verification badges** through a **subscription plan via Stripe Payment Gateway**.

### **Post Management**
- Supports **images, videos, reels**, and user tagging.
- Users can **like, comment, share, archive** posts.
- **Personalized post suggestions** based on priority.
- **User search & explore page** for discovering content.

### **Live Chat & Calls**
- Real-time messaging using **Socket.IO**.
- Supports **personal & group chats**.
- **Media sharing, audio, and post sharing**.
- **Video/audio calls (WebRTC) and group calls (ZEGOCLOUD)**.

### **Live Notifications**
- Instant notifications for **likes, follows, comments, and unlikes**.
- Powered by **Socket.IO**.

### **Friend Suggestions**
- Intelligent recommendations based on **mutual friends** and **most-followed users**.

### **Story Management**
- Users can **create and share stories** to enhance engagement.

### **Admin Panel**
- **Admin Dashboard** – Overview of platform activities.
- **User Management** – View, verify, or restrict users.
- **Post Management** – Moderate and remove posts.
- **Music Management** – Admin can **add, list, and unlist** music on the platform.
- **Subscription Management** – Admin can manage **subscription plans and user subscriptions**.
- **Admin Profile** – Admins can update their own profiles.

## Tech Stack
- **Node, Express, React, TypeScript, MongoDB, Socket.IO, WebRTC, ZEGOCLOUD, Stripe, AWS S3, AWS EC2, AWS Rekognition**.

## Installation
```bash
# Clone the repository
git clone https://github.com/shahzadahamad/Instant.git

# Navigate to the backend directory
cd Backend

# Install backend dependencies
npm install

# Set up environment variables (Check out ENV_SETUP.md for details)
# Ensure you create a .env file in the backend directory

# Start the backend server
npm run dev

# Open a new terminal window and navigate to the frontend directory
cd ../Frontend

# Install frontend dependencies
npm install

# Set up environment variables (Check out ENV_SETUP.md for details)
# Ensure you create a .env file in the frontend directory

# Start the frontend server
npm run dev
