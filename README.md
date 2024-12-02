# Mini UGC Platform

This project is a User-Generated Content (UGC) Platform built as part of a technical assessment task. It allows users to upload, view, and manage video content in an OTT-style layout. The platform is built using **Next.js** for the frontend and **Supabase** for backend functionalities, including user authentication, database operations, and file storage.

---

## Features

### Core Features

#### User Authentication:
- **Sign Up/Login**: Users can sign up and log in using either Email Provider or Google OAuth via Supabase authentication.
  
#### Access Control:
- **Unauthenticated users** can view all uploaded videos but cannot upload or perform any CRUD operations on videos.
- **Authenticated users** can upload videos and perform CRUD operations (Create, Read, Update, Delete) on their uploaded content.

#### Content Uploading:
- **Authenticated users** can upload videos with a title and description.
- **Validations**:
  - Title and description fields must not be empty.
  - Video file size is limited to 10 MB.
- **On submission**:
  - The video is uploaded to **Supabase Storage**.
  - Metadata (title, description, file URL) is saved in the **Supabase Database**.
  - Toast notifications are used to show messages (e.g., "Video successfully uploaded").

#### Content Display (Homepage):
- A grid layout showcasing all uploaded videos.
- Each item displays:
  - A thumbnail preview of the video.
  - Title and description.
- Fully responsive design for desktop and mobile screens.
- Users can search videos by title using a search bar at the top of the homepage.
- Real-time filtering occurs as the user types.

#### Detail Page:
- Clicking on any video redirects to a detailed page displaying:
  - The full-size video.
  - Title and description.

#### CRUD Operations for Authenticated Users:
- **Authenticated users** can update or delete videos they have uploaded.
  - Videos can be edited by changing the title, description, or replacing the video file.
  - Videos can be deleted from both the storage and the database.

#### APIs:
- **POST `/api/upload-content`**: Upload video metadata to the Supabase database.
- **GET `/api/fetch-content`**: Retrieve all video metadata from the database.
- **GET `/api/search-content`**: Fetch videos matching the search query.
- **PUT `/api/update-content`**: Update video metadata for authenticated users.
- **DELETE `/api/delete-content`**: Delete video metadata and associated storage for authenticated users.

#### Supabase Integration:
- **Database**:
  - Table: `Content`
  - Columns: `id`, `title`, `description`, `file_url`, `created_at`.
- **Storage**:
  - Videos are stored in a **Supabase storage** bucket.
  - File URLs are saved in the database for retrieval.
- **Authentication**:
  - Utilizes **Supabase’s Email & Password** and **Google OAuth** providers for user authentication.
  - Tokens are used to authenticate users and allow access to restricted features.

---

### Optional Features (Implemented)

- **Loading Spinner**: Shows a spinner during file uploads or while fetching data.
- **Pagination**: Displays content in manageable chunks for large datasets.
- **Error Handling**:
  - Displays user-friendly error messages for validation failures or backend issues.
  - Robust handling of edge cases like invalid file uploads, empty search results, and failed authentication attempts.
- **Toast Notifications**: Users receive toast messages for actions like successfully uploading a video, successfully updating a video, or encountering errors.
- **Enhanced UI/UX**:
  - Designed with **Tailwind CSS** for a modern, responsive interface.
  - Smooth page transitions with animations.

---

## Technology Stack

- **Frontend**: [Next.js](https://nextjs.org/)
- **Backend/Database**: [Supabase](https://supabase.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)

---

## Setup Instructions

Follow these steps to run the project locally:

### Prerequisites

1. **Node.js** (v16 or later)
2. **Supabase account**
3. A **Supabase project** with the following setup:
   - A table named `Content` with the columns:
     - `id`: Auto-generated UUID
     - `title`: String
     - `description`: Text
     - `file_url`: String
     - `created_at`: Timestamp (auto-generated)
4. Set up **Supabase authentication** with **Email Provider** and **Google OAuth**.

### Installation Instructions

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/mini-ugc-platform.git
   cd mini-ugc-platform
   Install dependencies:
2. **Run the following command to install all required dependencies:
    ```bash
     
     npm install
  
Configure Supabase:

Create a .env.local file in the root directory.
Add the following credentials to the file:
```bash

NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SUPABASE_GOOGLE_CLIENT_ID=your_google_client_id
NEXT_PUBLIC_SUPABASE_GOOGLE_REDIRECT_URL=your_google_redirect_url
```
Run the development server:
Start the server locally using the following command:

bash
```
npm run dev
```
Open the application in your browser:
Navigate to http://localhost:3000.

Challenges Faced
Supabase Integration:

Handling file uploads and ensuring URLs are securely stored in the database.
Resolved by following Supabase's official documentation for storage and database operations.
Search Optimization:

Initially faced issues with real-time search.
Resolved using Supabase's query capabilities for efficient filtering.
File Validation:

Ensured robust validation to handle file size and type restrictions gracefully.
User Authentication:

Integrated Supabase Authentication for both Email & Password and Google OAuth.
Ensured proper user flow, including access control for authenticated and unauthenticated users.



