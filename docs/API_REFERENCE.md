# SwipeBuddy — API Reference

**Base URL:** `https://your-render-app.onrender.com/api/v1`  
**Local URL:** `http://localhost:5000/api/v1`

> **Legend:** Fields marked with `*` (asterisk) are **mandatory**. All other fields are optional.

---

## Authentication

All protected endpoints require a **Bearer token** in the `Authorization` header:

```
Authorization: Bearer <token>
```

Tokens are obtained from `/auth/login` or `/auth/signup`.

---

## 1. Auth

> **No token required.** Rate-limited: 20 requests / 15 minutes per IP.

---

### POST `/auth/signup`
Register a new user.

#### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` * | `string` | ✅ Yes | User's full name |
| `email` * | `string` | ✅ Yes | Valid email address (must be unique) |
| `password` * | `string` | ✅ Yes | Plain-text password (hashed server-side) |
| `phone` | `string` | ❌ No | Phone number (e.g. `"9876543210"`) |

```json
{
  "name": "Aditya Sharma",
  "email": "aditya@example.com",
  "password": "password123",
  "phone": "9876543210"
}
```

#### Response `201`

| Field | Type | Description |
|-------|------|-------------|
| `success` | `boolean` | Always `true` on success |
| `data.user.id` | `string (uuid)` | Auto-generated user UUID |
| `data.user.name` | `string` | User name |
| `data.user.email` | `string` | Registered email |
| `data.user.phone` | `string \| null` | Phone number |
| `data.user.status` | `string` | Account status (`"active"`) |
| `data.user.created_at` | `string (ISO 8601)` | Timestamp of registration |
| `data.token` | `string` | JWT for subsequent requests |

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "name": "Aditya Sharma",
      "email": "aditya@example.com",
      "phone": "9876543210",
      "status": "active",
      "created_at": "2026-03-07T10:00:00.000Z"
    },
    "token": "<jwt>"
  }
}
```

#### Errors

| Status | Message |
|--------|---------|
| `400` | `Name, Email, and Password are required` |
| `400` | `Email already registered` |

---

### POST `/auth/login`
Login and receive a JWT token.

#### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email` * | `string` | ✅ Yes | Registered email address |
| `password` * | `string` | ✅ Yes | Account password |

```json
{
  "email": "aditya@example.com",
  "password": "password123"
}
```

#### Response `200`

| Field | Type | Description |
|-------|------|-------------|
| `success` | `boolean` | Always `true` on success |
| `data.user.id` | `string (uuid)` | User UUID |
| `data.user.name` | `string` | User name |
| `data.user.email` | `string` | User email |
| `data.token` | `string` | JWT for subsequent requests |

```json
{
  "success": true,
  "data": {
    "user": { "id": "uuid", "name": "Aditya Sharma", "email": "aditya@example.com" },
    "token": "<jwt>"
  }
}
```

#### Errors

| Status | Message |
|--------|---------|
| `400` | `Email and Password are required` |
| `401` | `Invalid credentials` |

---

## 2. Profile

> 🔒 All endpoints require `Authorization: Bearer <token>`.  
> Exception: `GET /profile/:id` is public.

---

### GET `/profile`
Get the logged-in user's full profile including jobs, education, and habits.

#### Response `200`

| Field | Type | Description |
|-------|------|-------------|
| `data.id` | `string (uuid)` | User UUID |
| `data.name` | `string` | Full name |
| `data.email` | `string` | Email address |
| `data.phone` | `string \| null` | Phone number |
| `data.age` | `number \| null` | Age in years |
| `data.gender` | `string \| null` | Gender (`"male"` \| `"female"` \| `"other"`) |
| `data.city` | `string \| null` | Current city |
| `data.state` | `string \| null` | Current state |
| `data.search_type` | `string \| null` | What user is looking for (`"flat"` \| `"flatmate"` \| `"both"`) |
| `data.is_published` | `boolean` | Whether profile is publicly visible |
| `data.profile_picture_url` | `string \| null` | URL of profile picture |
| `data.status` | `string` | Account status (`"active"`) |
| `data.created_at` | `string (ISO 8601)` | Account creation timestamp |
| `data.job_experiences` | `array` | List of job experience objects |
| `data.job_experiences[].id` | `string (uuid)` | Job record UUID |
| `data.job_experiences[].company_name` | `string \| null` | Free-text company name |
| `data.job_experiences[].position_name` | `string \| null` | Free-text position name |
| `data.job_experiences[].from_year` | `string \| null` | Start year (e.g. `"2022"`) |
| `data.job_experiences[].till_year` | `string \| null` | End year |
| `data.job_experiences[].currently_working` | `boolean` | Currently employed here |
| `data.job_experiences[].company` | `object \| null` | Linked master company record |
| `data.job_experiences[].position` | `object \| null` | Linked master position record |
| `data.education_experiences` | `array` | List of education objects |
| `data.education_experiences[].id` | `string (uuid)` | Education record UUID |
| `data.education_experiences[].institution_name` | `string \| null` | Free-text institution name |
| `data.education_experiences[].degree_name` | `string \| null` | Free-text degree name |
| `data.education_experiences[].start_year` | `string \| null` | Start year |
| `data.education_experiences[].end_year` | `string \| null` | End year |
| `data.education_experiences[].institution` | `object \| null` | Linked master institution |
| `data.education_experiences[].degree` | `object \| null` | Linked master degree |
| `data.user_habits` | `array` | My selected lifestyle habits |
| `data.user_habits[].id` | `string (uuid)` | Habit record UUID |
| `data.user_habits[].habit` | `object` | Habit details (`label`, `category`, `icon_name`) |
| `data.looking_for_habits` | `array` | Habits I want in a flatmate |

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Aditya Sharma",
    "email": "aditya@example.com",
    "phone": "9876543210",
    "age": 24,
    "gender": "male",
    "city": "Bengaluru",
    "state": "Karnataka",
    "search_type": "flat",
    "is_published": true,
    "profile_picture_url": null,
    "status": "active",
    "created_at": "2026-03-07T10:00:00.000Z",
    "job_experiences": [
      {
        "id": "uuid",
        "company_name": "Google",
        "position_name": "SDE",
        "from_year": "2022",
        "till_year": "2024",
        "currently_working": false,
        "company": { "id": "uuid", "name": "Google", "logo_url": null },
        "position": { "id": "uuid", "name": "SDE" }
      }
    ],
    "education_experiences": [
      {
        "id": "uuid",
        "institution_name": "IIT Delhi",
        "degree_name": "B.Tech",
        "start_year": "2018",
        "end_year": "2022",
        "institution": { "id": "uuid", "name": "IIT Delhi" },
        "degree": { "id": "uuid", "common_name": "B.Tech", "full_name": "Bachelor of Technology" }
      }
    ],
    "user_habits": [
      { "id": "uuid", "habit": { "id": "uuid", "label": "Vegetarian", "category": "eating", "icon_name": "salad" } }
    ],
    "looking_for_habits": []
  }
}
```

---

### PUT `/profile`
Update the logged-in user's profile fields. **All fields are optional** — send only what you want to change.

#### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | `string` | ❌ No | Full name |
| `age` | `number` | ❌ No | Age in years |
| `gender` | `string` | ❌ No | `"male"` \| `"female"` \| `"other"` |
| `city` | `string` | ❌ No | Current city |
| `state` | `string` | ❌ No | Current state / province |
| `search_type` | `string` | ❌ No | `"flat"` \| `"flatmate"` \| `"both"` |
| `is_published` | `boolean` | ❌ No | `true` to make profile discoverable publicly |

```json
{
  "name": "Aditya Sharma",
  "age": 24,
  "gender": "male",
  "city": "Bengaluru",
  "state": "Karnataka",
  "search_type": "flat",
  "is_published": true
}
```

#### Response `200`
Returns the updated user object (same shape as `GET /profile`, `password_hash` excluded).

#### Errors

| Status | Message |
|--------|---------|
| `401` | `Unauthorized` |
| `400` | Validation or database error message |

---

### GET `/profile/:id`
View another user's public profile. *(No token required)*

**Path param:** `:id` — UUID of the user.

#### Response `200`
Same shape as `GET /profile`.

#### Errors

| Status | Message |
|--------|---------|
| `404` | `Profile not found` |

---

### GET `/profile/jobs`
Get the current user's job experiences.

#### Response `200`

| Field | Type | Description |
|-------|------|-------------|
| `data[].id` | `string (uuid)` | Job experience UUID |
| `data[].company_name` | `string \| null` | Free-text company name fallback |
| `data[].position_name` | `string \| null` | Free-text position name fallback |
| `data[].from_year` | `string \| null` | Start year (e.g. `"2022"`) |
| `data[].till_year` | `string \| null` | End year |
| `data[].currently_working` | `boolean` | Is current job |
| `data[].display_order` | `number` | Sort order |
| `data[].status` | `string` | Record status (`"active"`) |
| `data[].company` | `object \| null` | Master company record |
| `data[].company.id` | `string (uuid)` | Company UUID |
| `data[].company.name` | `string` | Company name |
| `data[].company.logo_url` | `string \| null` | Logo image URL |
| `data[].position` | `object \| null` | Master position record |

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "company_name": "Google",
      "position_name": "SDE",
      "from_year": "2022",
      "till_year": "2024",
      "currently_working": false,
      "display_order": 1,
      "status": "active",
      "company": { "id": "uuid", "name": "Google", "logo_url": null },
      "position": null
    }
  ]
}
```

---

### POST `/profile/jobs`
Add a job experience entry.

#### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `company_id` | `string (uuid)` | ❌ No | UUID from `GET /master/companies`. Use this OR `company_name`. |
| `company_name` | `string` | ❌ No | Free-text fallback if company is not in master list. |
| `position_id` | `string (uuid)` | ❌ No | UUID from `GET /master/positions`. Use this OR `position_name`. |
| `position_name` | `string` | ❌ No | Free-text fallback if position is not in master list. |
| `from_year` | `string` | ❌ No | Start year (e.g. `"2022"`) |
| `till_year` | `string` | ❌ No | End year. Omit if `currently_working` is `true`. |
| `currently_working` | `boolean` | ❌ No | Set `true` if this is the current job |
| `display_order` | `number` | ❌ No | Sort order on profile (defaults to insertion order) |

> **Note:** Provide at least one of `company_id` or `company_name`. Same applies for position.  
> **Note:** Any fields not in this list are silently ignored by the server.

```json
{
  "company_id": "uuid-or-omit",
  "position_id": "uuid-or-omit",
  "company_name": "Google",
  "position_name": "SDE",
  "from_year": "2022",
  "till_year": "2024",
  "currently_working": false,
  "display_order": 1
}
```

#### Response `201`
Returns the created job experience object.

---

### PUT `/profile/jobs/:jobId`
Update a specific job experience. Send any subset of the fields from `POST /profile/jobs`.

**Path param:** `:jobId` — UUID of the job experience record.

#### Response `200`
Returns the count of updated records.

#### Errors

| Status | Message |
|--------|---------|
| `401` | `Unauthorized` |
| `400` | Error message |

---

### DELETE `/profile/jobs/:jobId`
Soft-delete a job (sets `status = 'deleted'` — data is not permanently removed).

**Path param:** `:jobId` — UUID of the job experience record.

#### Response `200`
```json
{ "success": true, "message": "Job deleted" }
```

---

### GET `/profile/education`
Get the current user's education history.

#### Response `200`

| Field | Type | Description |
|-------|------|-------------|
| `data[].id` | `string (uuid)` | Education record UUID |
| `data[].institution_name` | `string \| null` | Free-text institution name |
| `data[].degree_name` | `string \| null` | Free-text degree name |
| `data[].start_year` | `string \| null` | Start year (e.g. `"2018"`) |
| `data[].end_year` | `string \| null` | End year |
| `data[].display_order` | `number` | Sort order |
| `data[].status` | `string` | Record status (`"active"`) |
| `data[].institution` | `object \| null` | Master institution record |
| `data[].degree` | `object \| null` | Master degree record |
| `data[].degree.full_name` | `string` | e.g. `"Bachelor of Technology"` |
| `data[].degree.common_name` | `string` | e.g. `"B.Tech"` |

---

### POST `/profile/education`
Add an education entry.

#### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `institution_id` | `string (uuid)` | ❌ No | UUID from `GET /master/institutions`. Use this OR `institution_name`. |
| `institution_name` | `string` | ❌ No | Free-text fallback if institution is not in master list |
| `degree_id` | `string (uuid)` | ❌ No | UUID from `GET /master/degrees`. Use this OR `degree_name`. |
| `degree_name` | `string` | ❌ No | Free-text fallback if degree is not in master list |
| `start_year` | `string` | ❌ No | Start year (e.g. `"2018"`) |
| `end_year` | `string` | ❌ No | End year (e.g. `"2022"`) |
| `display_order` | `number` | ❌ No | Sort order on profile |

> **Note:** Any fields not in this list are silently ignored by the server.

```json
{
  "institution_id": "uuid-or-omit",
  "degree_id": "uuid-or-omit",
  "institution_name": "IIT Delhi",
  "degree_name": "B.Tech",
  "start_year": "2018",
  "end_year": "2022",
  "display_order": 1
}
```

#### Response `201`
Returns the created education object.

---

### PUT `/profile/education/:eduId`
Update an education entry. Send any subset of fields from `POST /profile/education`.

**Path param:** `:eduId` — UUID of the education record.

#### Response `200`
Returns count of updated records.

---

### DELETE `/profile/education/:eduId`
Soft-delete an education entry.

**Path param:** `:eduId` — UUID of the education record.

#### Response `200`
```json
{ "success": true, "message": "Education deleted" }
```

---

### GET `/profile/habits`
Get the current user's selected lifestyle habits.

#### Response `200`

| Field | Type | Description |
|-------|------|-------------|
| `data[].id` | `string (uuid)` | User habit record UUID |
| `data[].habit.id` | `string (uuid)` | Master habit UUID |
| `data[].habit.label` | `string` | Display label (e.g. `"Vegetarian"`) |
| `data[].habit.category` | `string` | Category (e.g. `"eating"`) |
| `data[].habit.icon_name` | `string` | Icon identifier (e.g. `"salad"`) |

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "habit": { "id": "uuid", "label": "Vegetarian", "category": "eating", "icon_name": "salad" }
    }
  ]
}
```

---

### PUT `/profile/habits`
**Replace** all of the user's habits in a single call. Existing habits are soft-deleted and replaced.

#### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `habit_ids` * | `string[]` | ✅ Yes | Array of habit UUIDs from `GET /master/habits`. Send `[]` to clear all. |

```json
{ "habit_ids": ["uuid1", "uuid2", "uuid3"] }
```

#### Response `200`
Returns the array of upserted habit records.

#### Errors

| Status | Message |
|--------|---------|
| `400` | `habit_ids must be an array` |

---

### GET `/profile/looking-for`
Get the flatmate habits the current user is looking for.

#### Response `200`
Same shape as `GET /profile/habits`.

---

### PUT `/profile/looking-for`
Replace the user's "looking for" flatmate habit preferences.

#### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `habit_ids` * | `string[]` | ✅ Yes | Array of habit UUIDs from `GET /master/habits`. Send `[]` to clear all. |

```json
{ "habit_ids": ["uuid1", "uuid2"] }
```

#### Response `200`
Returns the array of upserted looking-for habit records.

#### Errors

| Status | Message |
|--------|---------|
| `400` | `habit_ids must be an array` |

---

## 3. Master / Lookup Tables

> 🔒 All endpoints require `Authorization: Bearer <token>`.  
> These are **global reference tables** — use them to populate dropdowns, then send the selected `id` in profile/flat endpoints.

---

### GET `/master/degrees`

#### Response `200`

| Field | Type | Description |
|-------|------|-------------|
| `data[].id` | `string (uuid)` | Degree UUID |
| `data[].full_name` | `string` | e.g. `"Bachelor of Technology"` |
| `data[].common_name` | `string` | e.g. `"B.Tech"` |
| `data[].other_names` | `string[]` | Aliases (e.g. `["BTech"]`) |

```json
{
  "success": true,
  "data": [
    { "id": "uuid", "full_name": "Bachelor of Technology", "common_name": "B.Tech", "other_names": ["BTech"] }
  ]
}
```

---

### GET `/master/positions`
Returns all active job positions.

#### Response `200`

| Field | Type | Description |
|-------|------|-------------|
| `data[].id` | `string (uuid)` | Position UUID |
| `data[].name` | `string` | Position title (e.g. `"SDE"`, `"PM"`, `"Designer"`) |

---

### GET `/master/companies`
Returns all active companies.

#### Response `200`

| Field | Type | Description |
|-------|------|-------------|
| `data[].id` | `string (uuid)` | Company UUID |
| `data[].name` | `string` | Company name |
| `data[].logo_url` | `string \| null` | Logo image URL |
| `data[].website` | `string \| null` | Company website URL |

```json
{
  "success": true,
  "data": [
    { "id": "uuid", "name": "Google", "logo_url": "https://...", "website": "https://google.com" }
  ]
}
```

---

### GET `/master/institutions`
Returns all active educational institutions.

#### Response `200`

| Field | Type | Description |
|-------|------|-------------|
| `data[].id` | `string (uuid)` | Institution UUID |
| `data[].name` | `string` | Institution name (e.g. `"IIT Delhi"`) |

---

### GET `/master/habits`
Returns all active habits ordered by `display_order`.

#### Response `200`

| Field | Type | Description |
|-------|------|-------------|
| `data[].id` | `string (uuid)` | Habit UUID |
| `data[].category` | `string` | Habit category |
| `data[].label` | `string` | Display label (e.g. `"Vegetarian"`) |
| `data[].icon_name` | `string` | Icon identifier |
| `data[].display_order` | `number` | Sort order |

> **Categories:** `eating` | `smoking` | `drinking` | `schedule` | `fitness` | `social` | `cleanliness`

```json
{
  "success": true,
  "data": [
    { "id": "uuid", "category": "eating", "label": "Vegetarian", "icon_name": "salad", "display_order": 1 }
  ]
}
```

---

### GET `/master/amenities`
Returns all active amenities ordered by `display_order`.

#### Response `200`

| Field | Type | Description |
|-------|------|-------------|
| `data[].id` | `string (uuid)` | Amenity UUID |
| `data[].name` | `string` | Amenity name (e.g. `"AC"`, `"WiFi"`) |
| `data[].amenity_type` | `string` | `"room"` — in-room amenity \| `"common"` — shared area amenity |
| `data[].icon_name` | `string` | Icon identifier |
| `data[].display_order` | `number` | Sort order |

```json
{
  "success": true,
  "data": [
    { "id": "uuid", "name": "AC", "amenity_type": "room", "icon_name": "wind", "display_order": 1 }
  ]
}
```

---

## 4. Flats

> `GET /flats` and `GET /flats/:id` are **public** (no token required).  
> `POST /flats` requires 🔒 token. `user_id` is set automatically from the JWT — do not send it.

---

### GET `/flats`
List all published and active flat listings with full details.

#### Response `200`

| Field | Type | Description |
|-------|------|-------------|
| `data[].id` | `string (uuid)` | Flat UUID |
| `data[].address` | `string` | Street address |
| `data[].city` | `string` | City |
| `data[].state` | `string` | State |
| `data[].pincode` | `string` | PIN / ZIP code |
| `data[].latitude` | `number \| null` | GPS latitude |
| `data[].longitude` | `number \| null` | GPS longitude |
| `data[].furnishing_type` | `string` | `"furnished"` \| `"semifurnished"` \| `"unfurnished"` |
| `data[].description` | `string \| null` | Free-text description |
| `data[].is_published` | `boolean` | Whether listing is public |
| `data[].status` | `string` | `"active"` |
| `data[].user` | `object` | Listing owner (id, name, profile_picture_url) |
| `data[].rooms` | `array` | Room objects (see below) |
| `data[].rooms[].id` | `string (uuid)` | Room UUID |
| `data[].rooms[].room_type` | `string` | `"private"` \| `"shared"` |
| `data[].rooms[].rent` | `number` | Monthly rent (₹) |
| `data[].rooms[].security_deposit` | `number` | Security deposit (₹) |
| `data[].rooms[].brokerage` | `number` | Brokerage amount (₹, `0` if none) |
| `data[].rooms[].available_count` | `number` | Number of beds/spots available |
| `data[].rooms[].available_from` | `string (date)` | Availability date (`"YYYY-MM-DD"`) |
| `data[].rooms[].furnishing_type` | `string` | Room-level furnishing override |
| `data[].rooms[].room_amenities` | `array` | Amenities in this room |
| `data[].rooms[].media` | `array` | Room photos/videos |
| `data[].rooms[].media[].media_url` | `string` | Media file URL |
| `data[].rooms[].media[].media_type` | `string` | `"image"` \| `"video"` |
| `data[].common_amenities` | `array` | Shared area amenities |
| `data[].media` | `array` | Flat-level photos/videos |

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "address": "123 MG Road",
      "city": "Bengaluru",
      "state": "Karnataka",
      "pincode": "560001",
      "latitude": 12.9716,
      "longitude": 77.5946,
      "furnishing_type": "furnished",
      "description": "Awesome 3BHK near metro",
      "is_published": true,
      "status": "active",
      "user": { "id": "uuid", "name": "Aditya", "profile_picture_url": null },
      "rooms": [
        {
          "id": "uuid",
          "room_type": "private",
          "rent": 15000,
          "security_deposit": 30000,
          "brokerage": 0,
          "available_count": 1,
          "available_from": "2026-04-01",
          "furnishing_type": "furnished",
          "room_amenities": [
            { "amenity": { "name": "AC", "icon_name": "wind" } }
          ],
          "media": [{ "media_url": "https://...", "media_type": "image" }]
        }
      ],
      "common_amenities": [
        { "amenity": { "name": "WiFi", "icon_name": "wifi" } }
      ],
      "media": [{ "media_url": "https://...", "media_type": "image" }]
    }
  ]
}
```

---

### GET `/flats/:id`
Get a single flat by UUID.

**Path param:** `:id` — UUID of the flat.

#### Response `200`
Same shape as a single item from `GET /flats`.

#### Errors

| Status | Message |
|--------|---------|
| `404` | `Flat not found` |

---

### POST `/flats` 🔒
Create a new flat listing. `user_id` is injected automatically from the JWT; do **not** include it.

#### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `address` * | `string` | ✅ Yes | Street address |
| `city` * | `string` | ✅ Yes | City |
| `state` * | `string` | ✅ Yes | State / province |
| `pincode` | `string` | ❌ No | PIN / ZIP code |
| `latitude` | `number` | ❌ No | GPS latitude (decimal degrees) |
| `longitude` | `number` | ❌ No | GPS longitude (decimal degrees) |
| `furnishing_type` | `string` | ❌ No | `"furnished"` \| `"semifurnished"` \| `"unfurnished"` |
| `description` | `string` | ❌ No | Free-text description |
| `is_published` | `boolean` | ❌ No | `true` to make listing publicly visible (default: `false`) |

> **Note:** `user_id` is injected server-side from the JWT. Any `user_id` sent in the request body is ignored.

```json
{
  "address": "123 MG Road",
  "city": "Bengaluru",
  "state": "Karnataka",
  "pincode": "560001",
  "latitude": 12.9716,
  "longitude": 77.5946,
  "furnishing_type": "furnished",
  "description": "Spacious 3BHK near metro",
  "is_published": true
}
```

#### Response `201`
Returns the created flat object.

#### Errors

| Status | Message |
|--------|---------|
| `401` | `Unauthorized` |
| `500` | `address, city, and state are required` |

---

## 5. Matching *(Stub — In Development)*

> 🔒 Requires `Authorization: Bearer <token>`.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/matching` | Discover profiles/flats matching your preferences |
| `POST` | `/matching/swipe` | Swipe on a profile or flat |

These endpoints are currently stubs and will return placeholder responses until the matching engine is implemented.

---

## 6. Messaging *(Stub — In Development)*

> 🔒 Requires `Authorization: Bearer <token>`.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/messages` | List all conversations |
| `GET` | `/messages/:id` | Get messages for a specific conversation |

Real-time messaging is handled via **WebSocket (Socket.IO)**. See the WebSocket section below.

### WebSocket — Socket.IO

**Connection URL:** `ws://localhost:5000` (or your deployed URL, no `/api/v1` prefix)

Connect using `socket.io-client`:

```js
import { io } from 'socket.io-client';
const socket = io('https://your-render-app.onrender.com');
```

| Event | Direction | Description |
|-------|-----------|-------------|
| `connection` | Server → Client | Emitted when a socket successfully connects |
| `disconnect` | Server → Client | Emitted when the socket disconnects |

> Additional events (send message, join room, etc.) will be documented as the messaging module is built out.

---

## 7. Social *(Stub — In Development)*

> 🔒 Requires `Authorization: Bearer <token>`.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/social/saved-profiles` | Get profiles saved/bookmarked by the user |
| `POST` | `/social/reports` | Report a user |
| `GET` | `/social/blocks` | Get list of blocked users |

These endpoints are currently stubs and will return placeholder responses.

---

## 8. Error Format

All errors follow this shape:

```json
{ "success": false, "message": "Human-readable description" }
```

| Status | Meaning |
|--------|---------|
| `400` | Bad request / validation failure |
| `401` | Missing or invalid token |
| `403` | Forbidden — token valid but insufficient permissions |
| `404` | Resource not found |
| `429` | Rate limit exceeded (auth routes: 20 req / 15 min) |
| `500` | Internal server error |

---

## 9. Frontend Integration Tips

**Store the token after login/signup:**
```js
const { token } = response.data.data;
localStorage.setItem('token', token);
```

**Attach token to every request (Axios interceptor):**
```js
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers['Authorization'] = `Bearer ${token}`;
  return config;
});
```

**Habit selection flow:**
1. `GET /master/habits` → display all habits grouped by category
2. User selects habits → collect their `id`s
3. `PUT /profile/habits` with `{ "habit_ids": [...] }`

**Job / Education autocomplete flow:**
1. `GET /master/companies` + `GET /master/positions` → fill autocomplete dropdowns
2. On form submit → `POST /profile/jobs` with `company_id` + `position_id`
3. If company/position not in master list → pass `company_name` / `position_name` as free-text fallback

**Flat listing with amenities:**
1. `GET /master/amenities` → display amenities filtered by `amenity_type`
2. When creating flat → `POST /flats` first, then attach room/amenity data as those endpoints are added

---

## 10. Route Summary

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/auth/signup` | ❌ | Register |
| `POST` | `/auth/login` | ❌ | Login |
| `GET` | `/profile` | 🔒 | My full profile |
| `PUT` | `/profile` | 🔒 | Update my profile |
| `GET` | `/profile/:id` | ❌ | View any user's profile |
| `GET` | `/profile/jobs` | 🔒 | My job experiences |
| `POST` | `/profile/jobs` | 🔒 | Add job |
| `PUT` | `/profile/jobs/:jobId` | 🔒 | Update job |
| `DELETE` | `/profile/jobs/:jobId` | 🔒 | Soft-delete job |
| `GET` | `/profile/education` | 🔒 | My education history |
| `POST` | `/profile/education` | 🔒 | Add education |
| `PUT` | `/profile/education/:eduId` | 🔒 | Update education |
| `DELETE` | `/profile/education/:eduId` | 🔒 | Soft-delete education |
| `GET` | `/profile/habits` | 🔒 | My habits |
| `PUT` | `/profile/habits` | 🔒 | Replace my habits |
| `GET` | `/profile/looking-for` | 🔒 | My flatmate habit preferences |
| `PUT` | `/profile/looking-for` | 🔒 | Replace flatmate habit preferences |
| `GET` | `/master/degrees` | 🔒 | All degrees |
| `GET` | `/master/positions` | 🔒 | All positions |
| `GET` | `/master/companies` | 🔒 | All companies |
| `GET` | `/master/institutions` | 🔒 | All institutions |
| `GET` | `/master/habits` | 🔒 | All habits |
| `GET` | `/master/amenities` | 🔒 | All amenities |
| `GET` | `/flats` | ❌ | All published flats |
| `GET` | `/flats/:id` | ❌ | Single flat |
| `POST` | `/flats` | 🔒 | Create flat |
| `GET` | `/matching` | 🔒 | Discover (stub) |
| `POST` | `/matching/swipe` | 🔒 | Swipe (stub) |
| `GET` | `/messages` | 🔒 | Conversations (stub) |
| `GET` | `/messages/:id` | 🔒 | Conversation messages (stub) |
| `GET` | `/social/saved-profiles` | 🔒 | Saved profiles (stub) |
| `POST` | `/social/reports` | 🔒 | Report user (stub) |
| `GET` | `/social/blocks` | 🔒 | Blocked users (stub) |
