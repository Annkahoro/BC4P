# Implementation Plan - BC4P Data Collection Platform (MERN)

This plan outlines the technical approach for building the BC4P Data Collection Platform using the MERN stack (MongoDB, Express, React, Node.js), focusing on the Backend first.

## Tech Stack
*   **Backend**: Node.js & Express.
*   **Database**: MongoDB (Atlas).
*   **Media Storage**: Cloudinary (for multi-media documentation).

## Core Requirements
1.  **Specialized Auth**: Ordinary users (Name/Phone), Super Admin (Email/Pass).
2.  **Structured Workspaces**: 5 Pillars with section-based data collection.
3.  **Role-Based Access**: Contributors vs Admins.

## Progress
*   [x] Project Initialized
*   [x] Models Defined (User, Submission)
*   [x] Admin Seed Script Created
*   [x] Auth Routes (Register, Phone Login, Admin Login)
*   [x] Submission API (Multi-media + Metadata)
*   [ ] UI Enhancement - Password Visibility Toggle (Admin Login)
*   [ ] Responsive Optimization - Admin Dashboard & Sidebar for Mobile
