# 🐾 Purrfect Paws

> A modern, full-stack pet adoption platform built to streamline the connection between shelters and future pet parents.

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/4ac8147f-58e1-4924-838e-1d5587ada63e" />


## 📖 About The Project

**Purrfect Paws** solves the problem of outdated, manual adoption processes. It provides a seamless digital experience where users can browse cats, filter by preferences, and submit applications online.

It features a comprehensive **Role-Based Access Control (RBAC)** system:
*   **Adopters** can browse, favorite, and apply for pets.
*   **Admins (Shelters)** have a dedicated dashboard to manage listings, review applications, and approve adoptions.

## 🛠️ Tech Stack

This project uses the **Next.js App Router** architecture combined with powerful cloud services.

*   **Frontend:** Next.js 14, React, TypeScript, Tailwind CSS
*   **Backend:** Next.js API Routes (Serverless Functions)
*   **Database:** MongoDB Atlas (NoSQL)
*   **Authentication:** Supabase Auth (Email/Password & Social)
*   **Cloud Storage:** Supabase Storage (Image hosting)
*   **Email Services:** Resend API (Transactional emails)
*   **Deployment:** Vercel

## ✨ Key Features

### 🐱 For Adopters
*   **Interactive Gallery:** Responsive grid layout with filtering (Kitten vs. Adult).
*   **Detailed Profiles:** Dynamic routing to view cat details, medical history, and status.
*   **Smart Authentication:** Secure Login/Signup with personalized dashboards.
*   **Adoption Flow:** "Cute Warning" modal for non-logged-in users.
*   **Application Tracking:** A "My Dashboard" view to check the status of submitted applications.

### 🛡️ For Admins (Shelter)
*   **Admin Dashboard:** A secured route (`/admin`) visible only to authorized personnel.
*   **CMS Capabilities:** Form to add new cats with image uploading directly to Supabase.
*   **Application Management:** View, Approve, or Reject adoption applications.
*   **Automated Status Sync:** Approving an application automatically marks the cat as "Adopted" in the database.

## 🚀 Getting Started

Follow these steps to run the project locally.

### Prerequisites
*   Node.js (v18+)
*   npm

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/your-username/purrfect-paws.git
    cd purrfect-paws
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**
    Create a `.env.local` file in the root directory and add your keys:

    ```bash
    # MongoDB Connection
    MONGODB_URI=your_mongodb_connection_string

    # Supabase (Auth & Storage)
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

    # Resend (Email Service)
    RESEND_API_KEY=your_resend_api_key
    ```

4.  **Run the application**
    ```bash
    npm run dev
    ```

5.  **Open in Browser**
    Visit `http://localhost:3000`

## 📂 Project Structure

```bash
/app
  ├── /admin        # Protected Admin Dashboard & Add Cat forms
  ├── /api          # Backend API Routes (Cats, Applications, Auth)
  ├── /auth         # Auth callbacks
  ├── /cats         # Dynamic Cat Profile Pages
  ├── /dashboard    # User Dashboard
  ├── layout.tsx    # Root layout with Smart Header
  └── page.tsx      # Homepage with Hero & Filter
/components         # Reusable UI (CatCard, AdoptButton, Header)
/lib                # Database & Supabase Clients
/types              # TypeScript Interfaces
