
# Secure Account Dashboard

This project aims to create a dynamic chat website.

## Technologies Used
- FrontEnd : Next.js , Tailwind CSS , Vercel(deployment)
- Backend  : Node js , Render(deployment)
- Websocket : Socket.io

## Features

### User Authentication and Authorization:

- Implement user authentication and authorization.
- Users should be able to log in and log out securely.
- Implement two-factor authentication (2FA) for additional security.

### User Account Dashboard:

-  Allow users to view their login/logout activities, including device information and timestamps.
- Implement real-time updates using Socket.IO/Ws for user login/logout activities.

### Admin Dashboard (Optional But Recommended):

- Create an admin dashboard to monitor user activities.
- Admins should be able to view user login/logout activities and manage user accounts.

### Device Management:

- Provide users with the ability to revoke access from specific devices.


## Deployment

The project is deployed using:
- Frontend: Vercel
- Backend: Render

#### Project Deployed Link: [Live Site](https://secure-account-dashboard-with-real-time-monitoring.vercel.app/)

## Routes Used

- **Signup Page:** `/register`
- **Login Page:** `/`
- **User Dashboard:** `/dashboard/user`
- **Admin Dashboard:** `/dashboard/admin`

## How to Setup

Clone this repository
```bash
  git clone https://github.com/Mahikagarg09/Secure-Account-Dashboard-with-Real-Time-Monitoring

```

Navigate to the project directory
```bash
cd Secure-Account-Dashboard-with-Real-Time-Monitoring
```
Navigate to the client
```bash
cd client
```
Install dependencies
```bash
npm install
```
Configure environment variables for client side
```bash
NEXT_PUBLIC_ADMIN_ID
```
Start the server
```bash
npm run dev
```

Navigate to the server
```bash
cd client
```
Install dependencies
```bash
npm install
```
Configure environment variables for server
```bash
DB_CONNECT
EMAIL
PASSWORD
PORT
NEXT_PUBLIC_ADMIN_ID
```
Start the server
```bash
npm start
```

## Deployment Instructions

### Vercel Deployment
- Create an account on vercel
- Import your GitHub repository
- Choose your branch (usually main)
- Choose directory(client)
- Deploy

### Render Deployment
- Create an account on vercel
- Import your GitHub repository
- Choose your branch (usually main)
- Choose directory(server)
- Deploy


## Contributors 
[Mahika Garg](https://github.com/Mahikagarg09)