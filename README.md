# Travel Tips & Destination Guides Frontend

## Overview

This is the frontend application for the Travel Tips & Destination Guides platform named JourneyMate, a community-driven website for travel enthusiasts to share experiences, tips, and connect with fellow travelers. Built with Next.js and TypeScript, it offers a responsive and interactive user interface for seamless navigation and engagement.

## Live Demo

[Visit the live application](https://journeymateclient.vercel.app/)

## Video Overview

[Watch the project overview](https://drive.google.com/file/d/1tyOII1qXjuJzUDQ1zQgIkXCnp6us_Ovq/view?usp=sharing)

## Features

- User authentication (sign up, sign in, password recovery)
- User profiles with customization options
- News feed for browsing travel posts
- Create, edit, and delete travel posts
- Comment and voting system on posts
- User following functionality
- Premium content access
- Admin dashboard for content and user management
- Responsive design for various devices

## Technologies Used

- Next.js 14
- TypeScript
- Redux Toolkit for state management
- Tailwind CSS for styling
- Shadcn UI components
- Framer Motion for animations
- React Hook Form for form handling
- Zod for form validation
- Recharts for data visualization

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/your-repo/travel-tips-frontend.git
   cd travel-tips-frontend
   ```

2. Install dependencies:

   ```
   npm install
   ```

   or

   ```
   yarn install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add the following:

   ```
   NEXT_PUBLIC_API_URL=your_backend_api_url
   ```

4. Run the development server:

   ```
   npm run dev
   ```

   or

   ```
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

- `src/app`: Contains the main application pages and layouts
- `src/components`: Reusable React components
- `src/redux`: Redux store, slices, and API configurations
- `src/hooks`: Custom React hooks
- `src/lib`: Utility functions and helpers
- `src/assets`: Static assets like images and icons

## Key Components

- `Profile`: Displays user profile information and posts
- `PostCard`: Renders individual post details
- `CreatePostModal`: Modal for creating new posts
- `AboutUser`: Shows detailed user information
- `UserCard`: Displays user information in a card format

## Styling

The project uses Tailwind CSS for styling, with custom configurations in `tailwind.config.ts`. The global styles are defined in `src/app/globals.css`.

## Authentication and Authorization

User authentication is handled using JWT tokens. The `withAuth` higher-order component is used to protect routes that require authentication.

## State Management

Redux Toolkit is used for global state management, with API calls handled by RTK Query.

## Deployment

The frontend is configured for easy deployment on Vercel. Simply connect your GitHub repository to Vercel for automatic deployments.

## Credentials

For testing purposes, use the following credentials:

- **Admin**: web@programming-hero.com / 12345678
- **User**: user@gmail.com / 12345678
