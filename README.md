# Upwork Clone Backend

Small Express + MongoDB service that authenticates a single dashboard user and stores a per-user Upwork access token. Authentication uses HTTP-only cookies with JWTs to protect subsequent requests.

## Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Create a `.env` file** (same folder as `package.json`)
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://<user>:<pass>@cluster/db
   JWT_SECRET=super-secret-key
   JWT_EXPIRE=7d
   NODE_ENV=development
   ```
3. **Run the server**
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:5000`.

## Authentication Flow

- `loginUser` validates email/password against the single `User` document, generates a JWT, and stores it as an HTTP-only cookie named `token`.
- Protected routes use the `authenticate` middleware. It reads the cookie, verifies the JWT, fetches the user, and injects `req.user`/`req.userId`.

> Make sure your HTTP client (Postman/Thunder Client/fetch) is configured to **send and receive cookies** (enable *Send cookies* / `credentials: "include"`).

## Available APIs

### Auth

| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| `GET` | `/api/users/login` | `{ "email": "", "password": "" }` | Authenticates the user, sets the `token` cookie, returns success message. |

> Although the route uses `GET` (per current implementation), most clients can still send a JSON body. Change to `POST` in `routes/user.routes.js` if you prefer a conventional login method.

### Upwork Token (Protected — requires `token` cookie)

| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| `GET` | `/api/upwork-token` | — | Returns the Upwork token (`upwork_tok`) for the authenticated user. |
| `POST` | `/api/upwork-token` | `{ "upwork_tok": "" }` | Creates the token entry if it does not exist, or updates it if it does. |
| `PUT` | `/api/upwork-token` | `{ "upwork_tok": "" }` | Alias of POST — performs the same upsert behavior. |

### Responses

**Successful login**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "<also returned in HTTP-only cookie>"
}
```

**Fetch Upwork token**
```json
{
  "success": true,
  "data": {
    "upwork_tok": "token-value-or-null"
  }
}
```

**Save/Update Upwork token**
```json
{
  "success": true,
  "message": "Upwork token saved successfully",
  "data": {
    "upwork_tok": "token-value"
  }
}
```

## Project Structure

```
controllers/
|-- user.controller.js        # login logic + cookie generation
|-- upworkToken.controller.js # CRUD for Upwork tokens
middleware/
|-- auth.middleware.js        # JWT verification (reads cookie)
models/
|-- user.model.js             # Basic user credentials
|-- upworkToken.model.js      # Upwork token linked to userId
routes/
|-- user.routes.js            # /api/users
|-- upworkToken.routes.js     # /api/upwork-token
utils/
|-- jwt.util.js               # sign/verify helpers
|-- password.util.js          # hashing utilities
```

Feel free to extend the docs to include any future routes (e.g., logging out, refreshing tokens, Upwork API integrations, etc.).

