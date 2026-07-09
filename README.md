# CodeAlpha URL Shortener

A simple, lightweight, and beginner-friendly URL Shortener backend built using **Node.js**, **Express.js**, **MongoDB Atlas**, and **Mongoose**.

---

## Features
1. **POST `/shorten`**: Accepts a long URL in JSON format, validates it, generates a unique short code using `nanoid`, saves it in MongoDB, and returns the full shortened URL.
2. **GET `/:shortCode`**: Finds the corresponding original URL in the database using the short code and redirects the user with a `302 Found` status.
3. **GET `/urls`**: Fetches all shortened URLs stored in the database, ordered by latest.

---

## Folder Structure
```text
CodeAlpha_URLShortener/
├── models/
│   └── Url.js            # URL Schema definition using Mongoose
├── routes/
│   └── urlRoutes.js      # URL shortening, listing, and redirection endpoints
├── .env                  # Configuration for PORT and database URI (ignored by Git)
├── .env.example          # Sample environment file template
├── app.js                # Core entry point & server configuration
├── package.json          # Dependency list and dev/start scripts
└── README.md             # Project installation and usage instructions
```

---

## Installation & Setup

Follow these steps to run the application locally:

### 1. Clone or Open the Directory
Open your terminal in the `CodeAlpha_URLShortener` project folder:
```bash
cd CodeAlpha_URLShortener
```

### 2. Install Dependencies
Run the package manager installation command to download the required Node.js libraries:
```bash
npm install
```

### 3. Setup MongoDB Atlas Connection
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free tier database cluster if you don't have one.
2. Click **Connect** on your cluster, choose **Drivers**, and copy the connection string.
3. Open the `.env` file in the root of your project:
   - Paste the connection string into the `MONGODB_URI` field.
   - Replace `<password>` with your database user password.
   - Replace `<username>` with your database user.

Example `.env` configuration:
```env
PORT=5000
MONGODB_URI=mongodb+srv://admin:mysecurepassword@cluster0.abcde.mongodb.net/urlshortener?retryWrites=true&w=majority
```

### 4. Start the Application
Run the project in development mode using Nodemon (which automatically restarts the server on code changes):
```bash
npm run dev
```

You should see:
```text
🚀 Server started on port 5000
👉 Access URL Shortener API at http://localhost:5000
⚠️  WARNING: MONGODB_URI is not configured yet. (If .env has not been updated)
```
Once your `.env` contains your correct database credentials, the server will connect automatically:
```text
✅ Connected to MongoDB Atlas successfully.
```

---

## API Documentation & Examples

Below are standard HTTP requests you can send to test your local server.

### 1. Shorten a URL
- **Endpoint**: `POST http://localhost:5000/shorten`
- **Headers**: `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "originalUrl": "https://developer.mozilla.org/en-US/docs/Web/JavaScript"
  }
  ```
- **Example Response (`201 Created`)**:
  ```json
  {
    "message": "URL shortened successfully!",
    "originalUrl": "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
    "shortCode": "k9L3aB7x",
    "shortenedUrl": "http://localhost:5000/k9L3aB7x"
  }
  ```

---

### 2. Redirect from Short URL to Original
- **Endpoint**: `GET http://localhost:5000/:shortCode`
- **Example**: `GET http://localhost:5000/k9L3aB7x`
- **Behavior**: The server looks up `k9L3aB7x`, finds the original URL, and redirects you directly to the original URL. If the code does not exist, it returns:
  - **Response (`404 Not Found`)**:
    ```json
    {
      "error": "Shortened URL not found."
    }
    ```

---

### 3. List All Shortened URLs
- **Endpoint**: `GET http://localhost:5000/urls`
- **Example Response (`200 OK`)**:
  ```json
  [
    {
      "id": "64adfb...",
      "originalUrl": "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
      "shortCode": "k9L3aB7x",
      "shortenedUrl": "http://localhost:5000/k9L3aB7x",
      "createdAt": "2026-07-09T22:20:00.000Z"
    }
  ]
  ```

---

## Importing Postman Request Collection

To quickly import these requests into Postman:
1. Open **Postman**.
2. Click **Import** in the top-left corner.
3. Paste the following JSON text in the **Raw text** tab:

```json
{
  "info": {
    "name": "CodeAlpha URL Shortener",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Welcome Page",
      "request": {
        "method": "GET",
        "url": {
          "raw": "http://localhost:5000/",
          "protocol": "http",
          "host": ["localhost"],
          "port": "5000",
          "path": [""]
        }
      }
    },
    {
      "name": "Shorten URL",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json",
            "type": "text"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"originalUrl\": \"https://www.google.com\"\n}"
        },
        "url": {
          "raw": "http://localhost:5000/shorten",
          "protocol": "http",
          "host": ["localhost"],
          "port": "5000",
          "path": ["shorten"]
        }
      }
    },
    {
      "name": "Get All URLs",
      "request": {
        "method": "GET",
        "url": {
          "raw": "http://localhost:5000/urls",
          "protocol": "http",
          "host": ["localhost"],
          "port": "5000",
          "path": ["urls"]
        }
      }
    },
    {
      "name": "Redirect Short URL",
      "request": {
        "method": "GET",
        "url": {
          "raw": "http://localhost:5000/YOUR_SHORT_CODE_HERE",
          "protocol": "http",
          "host": ["localhost"],
          "port": "5000",
          "path": ["YOUR_SHORT_CODE_HERE"]
        }
      }
    }
  ]
}
```
