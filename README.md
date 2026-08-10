# 🐕 Nemetjuhasz CMS

### Administrative Content Management System for Three of Us German Shepherds Foundation

[![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=flat-square&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vite.dev/)

A custom CMS built to let administrators manage the content of the
**Three of Us German Shepherds Foundation** website without modifying source code.

The system connects a React + TypeScript administration dashboard with
**Cloud Firestore, Firebase Storage, and Firebase Authentication**, allowing
content and media changes to be reflected dynamically on the public website.

### 🔗 Explore the Project

🌐 **[Live Website](https://nemetjuhasz.com/?lang=en)**  
🎥 **[Project Demos](https://drive.google.com/drive/folders/1t19KphA-svcIvQSAXssKu_PBzIKZYyuN?usp=sharing)**  
💻 **Admin CMS Source Code:** You are here

---

## ✨ What I Built

### 🧩 Dynamic CMS Architecture

I replaced hard-coded website content with administrator-managed sections stored
in Firestore.

The CMS supports multiple independently managed content types:

```text
Home
├── Hero
├── Features
├── Story
├── Breed
├── Fostering
├── Success Stories
└── Testimonials

Additional Management
├── Adoptable Pets
├── Adoption
├── Donations
├── Sponsors
├── Volunteers
└── About Us
```

Each content type has its own typed data model, management interface, and
Firestore operations.

---

### 🐕 Adoptable Pet Management

Administrators can:

- Create and update pet profiles
- Upload and manage multiple images
- Search existing pets
- Manage English and Hungarian descriptions
- Activate or deactivate pets from the public website
- Retrieve pets using Firestore ordering and cursor-based pagination

Pet images are uploaded to **Firebase Storage**, while their URLs and metadata
are maintained in **Cloud Firestore**.

```text
Admin Dashboard
      │
      ├── Pet Information
      ├── Bilingual Content
      ├── Images
      └── Visibility Status
              │
              ▼
        Firebase Services
              │
              ▼
       Public Website
```

---

### 🖼️ Image Upload & Preview Workflow

The CMS handles both single-image and multi-image content.

Administrators can select media and preview it before completing the content
workflow, making image-heavy sections easier to manage.

The application coordinates:

**File Selection → Preview → Firebase Storage → Download URL → Firestore → Website**

It also supports image replacement and deletion while keeping the associated
Firestore data synchronized.

---

### 👀 Content Preview System

Several CMS forms include dedicated preview components so administrators can
see how content will appear before publishing it.

This is particularly useful for sections such as:

- Hero content
- Success stories
- Testimonials
- Adoption content
- Donation content
- Sponsors
- Fostering

The preview system combines the administrator's current form state and selected
media to provide immediate visual feedback.

---

### 🌍 English / Hungarian Content Management

The website supports content in both **English and Hungarian**.

Instead of maintaining two independent websites, the CMS models localized
content within the same data structures.

Examples include:

```ts
englishTitle;
hungarianTitle;

contentEnglish;
contentHungarian;

bulletPointsEnglish;
bulletPointsHungarian;
```

This allows administrators to manage both language versions through the same
interface while the public website renders the appropriate content.

---

### 🔥 Firebase Integration

Firebase is used as the application's backend platform.

| Service                     | Purpose                                 |
| --------------------------- | --------------------------------------- |
| **Cloud Firestore**         | Dynamic website content and pet records |
| **Firebase Storage**        | Pet and website media                   |
| **Firebase Authentication** | Administrator authentication            |

Firestore service modules handle operations including:

- CRUD operations
- Ordered queries
- Server timestamps
- Cursor-based pagination
- Status updates
- Structured section-specific data

---

### 🔐 Administrative Access

The CMS includes authenticated administrative access and protected client-side
routes.

Unauthenticated users are redirected away from administrative pages.

> Client-side route protection is part of the UI access flow. Firebase security
> rules should remain the authoritative layer for protecting backend data.

---

## 🏗️ Application Structure

```text
src/
├── components/
│   ├── Loader
│   ├── ProtectedRoute
│   ├── Sidebar
│   └── ToggleSwitch
│
├── firebase/
│   ├── Firebase
│   ├── HomeService
│   ├── AdoptionService
│   ├── DonationService
│   ├── FosteringService
│   ├── SponsorService
│   ├── VolunteerService
│   ├── PetService
│   └── types
│
├── pages/
│   ├── about/
│   ├── donation/
│   ├── foster/
│   ├── home/
│   ├── pet/
│   ├── previews/
│   ├── sections/
│   └── volunteer/
│
└── styles/
```

The Firebase operations are separated into service modules instead of being
concentrated inside UI components, while TypeScript interfaces define the
different content structures handled throughout the application.

---

## 🛠️ Tech Stack

| Area                | Technologies            |
| ------------------- | ----------------------- |
| **Language**        | TypeScript              |
| **Frontend**        | React, SCSS, Bootstrap  |
| **Routing**         | React Router            |
| **Database**        | Cloud Firestore         |
| **Media Storage**   | Firebase Storage        |
| **Authentication**  | Firebase Authentication |
| **Build Tool**      | Vite                    |
| **Version Control** | Git, GitHub             |

---

## 🎥 Project Demonstrations

The demo archive contains recordings of the CMS being developed and tested,
including workflows such as:

- Adding and editing home-page sections
- Creating adoptable pet profiles
- Uploading pet images
- Controlling pet visibility
- Previewing content before saving
- Managing adoption and fostering content
- Managing sponsors and volunteers
- Updating donation content
- Verifying changes on the public-facing website

### ▶️ [Open Nemetjuhasz CMS Project Demos](https://drive.google.com/drive/folders/1t19KphA-svclvQSAXssKu_PBzlKZYyuN)

The folder is shared with view-only access.

---

## 🚀 Running Locally

### 1. Clone

```bash
git clone https://github.com/tuanh00/nemetjuhasz-admin.git
cd nemetjuhasz-admin
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure Firebase

Configure the Firebase project required by the application.

Private credentials, service-account keys, and environment secrets should not
be committed to the repository.

### 4. Start the application

```bash
npm run dev
```

---

## 💡 Project Context

This CMS was developed as part of my software development work for the
**Three of Us German Shepherds Foundation**.

The goal was not only to build website pages, but to give administrators a
practical way to maintain a content-heavy bilingual website themselves.

The project gave me hands-on experience designing reusable React components,
modeling different content structures with TypeScript, working with Firestore
and Firebase Storage, implementing media-management workflows, and connecting
an administrative application with a dynamic public-facing website.

---

## 👨‍💻 Author

**Huynh Tu Anh Chau**

[![Portfolio](https://img.shields.io/badge/Portfolio-Visit-000000?style=flat-square)](https://portfolio-tuanh.vercel.app/)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=flat-square&logo=linkedin)](https://www.linkedin.com/in/huynh-tu-anh-chau/)
[![GitHub](https://img.shields.io/badge/GitHub-tuanh00-181717?style=flat-square&logo=github)](https://github.com/tuanh00)
