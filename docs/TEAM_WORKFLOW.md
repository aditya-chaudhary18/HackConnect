# HackConnect — 12-Day Appwrite Plan (Summarized)

## Stack Overview (Appwrite Edition)
- Frontend: Next.js 15 + TypeScript — Fast, modern UI.
- BaaS (Core): Appwrite Cloud — Auth, Database, Storage, Realtime.
- Backend: FastAPI (Python) — Business logic, Matching, Gemini integration via Appwrite Python Admin SDK.
- UI Library: Shadcn/ui + Tailwind — Rapid, professional UI components.
- AI: Gemini API — Integrated within FastAPI service.

---

## Team Roles
- Ansh (Architect & Lead)
  - Project setup, Appwrite configuration (Database & Auth), matching algorithm, final integration.
- Navdeep (Frontend Lead)
  - UI screens (Login, Dashboard, Explore), Appwrite Client SDK integration for Realtime Chat.
- Harshit (Backend Lead)
  - FastAPI endpoints using the Appwrite Python SDK for teams, hackathons, and data logic.
- Aditya (Ops & QA)
  - Appwrite Console management (Collections/Attributes), seed data (dummy hackathons), testing.

---

## 12-Day Sprint Schedule

### Phase 1: Foundation (Days 1–3)
Goal: Appwrite is provisioned, repository is live, and a basic UI is available.
- Ansh:
  - Initialize the Next.js repository.
  - Set up the Appwrite project, database, and API keys.
  - Establish the FastAPI folder structure.
- Aditya & Harshit:
  - Define Appwrite Collections: Users, Hackathons, Teams, Messages.
  - Harshit: Install the `appwrite` Python package and connect FastAPI to Appwrite.
- Navdeep:
  - Implement the Navbar, Footer, and Hero using Shadcn.

### Phase 2: Auth & Discovery (Days 4–6)
Goal: GitHub authentication and hackathon discovery are functional.
- Ansh:
  - Implement Appwrite Auth in Next.js.
- Aditya:
  - Populate the database with 15–20 dummy hackathons and upload images to Appwrite Storage.
- Harshit:
  - Build `GET /recommendations` to fetch from Appwrite and filter by user tags.
- Navdeep:
  - Create the `/explore` page to present the data.

### Phase 3: Dream Team & Chat (Days 7–9)
Goal: Matchmaking and Realtime Chat are operational.
- Ansh:
  - Develop the matching algorithm in Python (aggregate users → compare skills → return matches).
- Navdeep:
  - Build the Chat UI using Appwrite `client.subscribe` for realtime capabilities.
- Harshit:
  - Implement `POST /join-team` for permissions and joining logic.
- Aditya:
  - Validate and stress-test the team creation flow.

### Phase 4: AI & Polish (Days 10–12)
Goal: Gemini integration and experience refinements.
- Harshit:
  - Create an endpoint: Hackathon description → Gemini → summary → save to Appwrite.
- Navdeep:
  - Add loading skeletons (shimmer) to improve perceived performance.
- Aditya:
  - Verify links, mobile responsiveness, and overall QA.
- Ansh:
  - Deploy the frontend to Vercel and the FastAPI backend to Render.

---

## Core Workflow

### 1) Database (Aditya)
- In the Appwrite Console, create Collections (e.g., `hackathons`) and define attributes:
  - `name` (string)
  - `date` (datetime)
  - `tags` (string array)
- Share relevant Collection IDs with Ansh and Harshit.

### 2) Backend (Harshit)
- FastAPI with Appwrite Python SDK:
```python
from appwrite.client import Client
from appwrite.services.databases import Databases
from fastapi import FastAPI

app = FastAPI()

client = Client()
client.set_endpoint('https://cloud.appwrite.io/v1')
client.set_project('YOUR_PROJECT_ID')
client.set_key('YOUR_API_KEY')

databases = Databases(client)

@app.post("/create-hackathon")
def create_hackathon(data: HackathonSchema):
    result = databases.create_document(
        database_id='...',
        collection_id='...',
        document_id='unique()',
        data=data.dict()
    )
    return result
```

### 3) Frontend (Navdeep)
- Use the Appwrite JS SDK directly for straightforward reads (e.g., messages).
- Call FastAPI for complex logic (recommendations, team joining, AI workflows).

---

## Day 1 Coordination
- Aditya will set up the Appwrite project (“HackConnect”) and share the Project ID with the team.
- Harshit will review `appwrite-python` documentation and prepare a simple connection script to verify access to the project.
- Navdeep will clone the initialized Next.js repository once it is pushed and begin implementing the base UI components.

---
