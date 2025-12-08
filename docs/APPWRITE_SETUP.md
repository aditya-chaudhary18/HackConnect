# Appwrite Setup Guide for HackConnect

This guide details how to configure the Appwrite project to support the HackConnect schema and functionality.

## 1. Project Initialization

1.  Log in to [Appwrite Cloud](https://cloud.appwrite.io/).
2.  Create a new project named **"HackConnect"**.
3.  Copy the **Project ID** and update `NEXT_PUBLIC_APPWRITE_PROJECT_ID` (frontend) and `APPWRITE_PROJECT_ID` (backend).

## 2. Authentication

1.  Go to **Auth** > **Settings**.
2.  Enable **Email/Password**.
3.  Enable **GitHub** (for developer login).
    *   You will need to create a GitHub OAuth App and provide the Client ID and Client Secret.

## 3. Database Setup

1.  Go to **Databases**.
2.  Create a database named **"HackConnect DB"**.
3.  Copy the **Database ID** to your `.env` files.

### Collections & Attributes

Create the following collections inside "HackConnect DB". After creating each, copy the **Collection ID** to your `.env` files.

#### A. Users (`users`)
*Stores extended user profile data.*

| Attribute | Type | Size/Details | Required | Array |
| :--- | :--- | :--- | :--- | :--- |
| `username` | String | 50 | Yes | No |
| `bio` | String | 500 | No | No |
| `avatar_url` | Url | - | No | No |
| `github_url` | Url | - | No | No |
| `skills` | String | 50 | No | **Yes** |
| `xp` | Integer | - | No | No |
| `reputation_score` | Float | - | No | No |
| `account_id` | String | 36 (Relation to Auth) | Yes | No |

#### B. Hackathons (`hackathons`)
*Stores hackathon event details.*

| Attribute | Type | Size/Details | Required | Array |
| :--- | :--- | :--- | :--- | :--- |
| `name` | String | 100 | Yes | No |
| `description` | String | 5000 | Yes | No |
| `start_date` | Datetime | - | Yes | No |
| `end_date` | Datetime | - | Yes | No |
| `location` | String | 100 | Yes | No |
| `image_url` | Url | - | No | No |
| `tags` | String | 50 | No | **Yes** |
| `prize_pool` | String | 100 | No | No |
| `registration_link` | Url | - | No | No |

#### C. Teams (`teams`)
*Stores team formation data.*

| Attribute | Type | Size/Details | Required | Array |
| :--- | :--- | :--- | :--- | :--- |
| `name` | String | 50 | Yes | No |
| `hackathon_id` | String | 36 (Relation) | Yes | No |
| `leader_id` | String | 36 (Relation) | Yes | No |
| `members` | String | 36 (User IDs) | Yes | **Yes** |
| `looking_for` | String | 50 (e.g. "Designer")| No | **Yes** |
| `status` | Enum | "open", "closed" | Yes | No |
| `project_repo` | Url | - | No | No |

#### D. Messages (`messages`)
*Stores realtime chat messages.*

| Attribute | Type | Size/Details | Required | Array |
| :--- | :--- | :--- | :--- | :--- |
| `team_id` | String | 36 (Relation) | Yes | No |
| `sender_id` | String | 36 (Relation) | Yes | No |
| `content` | String | 1000 | Yes | No |
| `type` | Enum | "text", "system" | Yes | No |

## 4. Storage (Buckets)

1.  Go to **Storage**.
2.  Create a bucket named **"Hackathon Images"**.
    *   **Permissions**: Role `Any` can `read`.
3.  Create a bucket named **"User Avatars"**.
    *   **Permissions**: Role `Any` can `read`.

## 5. API Keys (Backend)

1.  Go to **Overview** > **Integrations** > **API Keys**.
2.  Create a key named **"FastAPI Backend"**.
3.  Select the following scopes:
    *   `users.read`, `users.write`
    *   `teams.read`, `teams.write`
    *   `databases.read`, `databases.write`
    *   `collections.read`, `collections.write`
    *   `documents.read`, `documents.write`
    *   `files.read`, `files.write`
4.  Copy the **API Key Secret** to `backend/.env`.

## 6. Indexes (Optimization)

For better query performance, add these indexes in the **Databases** tab:

*   **Hackathons**:
    *   `idx_tags`: Key (`tags`), Type (`Fulltext`) - For searching by stack.
    *   `idx_date`: Key (`start_date`), Type (`Key`) - For sorting upcoming events.
*   **Teams**:
    *   `idx_hackathon`: Key (`hackathon_id`), Type (`Key`) - To list teams for an event.
    *   `idx_status`: Key (`status`), Type (`Key`) - To filter open teams.
