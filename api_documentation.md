# BC4P API Documentation

Base URL: `http://localhost:5000/api`

## Authentication

### User Registration
- **URL**: `/auth/register`
- **Method**: `POST`
- **Data required**:
  ```json
  {
    "name": "string",
    "phone": "string",
    "location": {
      "county": "string",
      "subCounty": "string",
      "specificArea": "string"
    }
  }
  ```
- **Response**: User object + JWT Token

### User Login (Contributor)
- **URL**: `/auth/login`
- **Method**: `POST`
- **Data required**: `{ "phone": "string" }`
- **Response**: User object + JWT Token

### Admin Login
- **URL**: `/auth/admin-login`
- **Method**: `POST`
- **Data required**: `{ "email": "string", "password": "string" }`
- **Response**: Admin user object + JWT Token

---

## Submissions

### Create Submission
- **URL**: `/submissions`
- **Method**: `POST`
- **Auth**: `Bearer <token>`
- **Content-Type**: `multipart/form-data`
- **Data required**:
  - `title`: string
  - `pillar`: Enum ('Cultural', 'Social', 'Economic', 'Environmental', 'Technical')
  - `category`: string
  - `description`: string (Rich Text)
  - `location`: JSON String
  - `metadata`: JSON String
  - `files`: File blobs (multiple)
  - `captions`: Array of strings (one per file)

### Get My Submissions
- **URL**: `/submissions/my`
- **Method**: `GET`
- **Auth**: `Bearer <token>`

---

## Admin APIs

### List Contributors
- **URL**: `/admin/users`
- **Method**: `GET`
- **Auth**: `Bearer <admin_token>`

### Dashboard Stats
- **URL**: `/admin/stats`
- **Method**: `GET`
- **Auth**: `Bearer <admin_token>`

### Review Submission (Update Status)
- **URL**: `/submissions/:id/status`
- **Method**: `PUT`
- **Auth**: `Bearer <admin_token>`
- **Data required**: `{ "status": "string", "adminNotes": "string" }`

### Export CSV
- **URL**: `/admin/export`
- **Method**: `GET`
- **Auth**: `Bearer <admin_token>`
