# CaptainSideRound2UGCplatform
# Mini UGC Platform

This project is a **User-Generated Content (UGC) Platform** built as part of a technical assessment task. It allows users to upload and view video content in an OTT-style layout. The platform is built using **Next.js** for the frontend and **Supabase** for backend functionalities, including database operations and file storage.

---

## Features

### Core Features
1. **Content Uploading**:
   - Users can upload videos along with a title and description.
   - Validations:
     - Title and description fields must not be empty.
     - Video file size is limited to **10 MB**.
   - On submission:
     - The video is uploaded to **Supabase Storage**.
     - Metadata (title, description, file URL) is saved in the **Supabase Database**.

2. **Content Display (Homepage)**:
   - A grid layout showcasing all uploaded videos.
   - Each item displays:
     - A thumbnail preview of the video.
     - Title and description.
   - Fully responsive design for desktop and mobile screens.

3. **Detail Page**:
   - Clicking on any item redirects to a detailed page displaying:
     - The full-size video.
     - Title and description.

4. **Search Functionality**:
   - A search bar at the top of the homepage allows users to search videos by title (case-insensitive).
   - Dynamically filters results as the user types.

5. **APIs**:
   - **POST `/api/upload-content`**: Upload video metadata to the Supabase database.
   - **GET `/api/fetch-content`**: Retrieve all video metadata from the database.
   - **GET `/api/search-content`**: Fetch videos matching the search query.

6. **Supabase Integration**:
   - **Database**:
     - Table: `Content`
       - Columns: `id`, `title`, `description`, `file_url`, `created_at`.
   - **Storage**:
     - Videos are stored in a Supabase storage bucket.
     - File URLs are saved in the database for retrieval.

---

## Optional Features (Implemented)
- **Loading Spinner**: Shows a spinner during file uploads or while fetching data.
- **Pagination**: Displays content in manageable chunks for large datasets.
- **Error Handling**:
  - Displays user-friendly error messages for validation failures or backend issues.
  - Ensures robust handling of edge cases like invalid file uploads and empty search results.
- **Enhanced UI/UX**:
  - Designed with **Tailwind CSS** for a modern, responsive interface.
  - Added animations for smooth transitions between pages.

---

## Technology Stack

- **Frontend**: [Next.js](https://nextjs.org/)
- **Backend/Database**: [Supabase](https://supabase.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)

---

## Setup Instructions

Follow these steps to run the project locally:

### Prerequisites
1. Node.js (v16 or later)
2. Supabase account
3. A Supabase project with the following setup:
   - A table named `Content` with the columns:
     - `id`: Auto-generated UUID
     - `title`: String
     - `description`: Text
     - `file_url`: String
     - `created_at`: Timestamp (auto-generated)
    
### Installation Instructions
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/mini-ugc-platform.git
   cd mini-ugc-platform


1. Install dependencies:  
   Run the following command to install all required dependencies:  
   ```bash
   npm install
Configure Supabase:

Create a .env.local file in the root directory.
Add the following credentials to the file:
env
Copy code
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
Run the development server:
Start the server locally using the following command:

bash
Copy code
npm run dev
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
