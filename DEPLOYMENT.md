# Deployment Instructions for robotjaol | Finance

This document provides step-by-step instructions on how to run the `robotjaol | Finance` application locally and deploy it to Vercel.

## 1. Prerequisites

Before you begin, ensure you have the following installed on your system:

-   **Node.js (v18 or higher)**: [https://nodejs.org/](https://nodejs.org/)
-   **pnpm**: You can install pnpm via npm: `npm install -g pnpm`
-   **Git**: [https://git-scm.com/](https://git-scm.com/)
-   **Vercel CLI**: Install globally using npm: `npm install -g vercel`

## 2. Local Setup and Running the Application

1.  **Extract the Project:**
    Unzip the `robotjaol-finance.zip` file to your desired directory.

2.  **Navigate to the Project Directory:**
    Open your terminal or command prompt and navigate into the extracted project folder:
    ```bash
    cd robotjaol-finance
    ```

3.  **Install Dependencies:**
    Install all the necessary project dependencies using pnpm:
    ```bash
    pnpm install
    ```

4.  **Run the Development Server:**
    Start the development server. This will typically open the application in your browser at `http://localhost:5173` (or another available port).
    ```bash
    pnpm run dev
    ```
    You can now interact with the application locally.

## 3. Deploying to Vercel

1.  **Login to Vercel (if not already logged in):**
    If you haven't logged in to Vercel via the CLI before, run:
    ```bash
    vercel login
    ```
    Follow the prompts to authenticate with your Vercel account.

2.  **Deploy the Project:**
    From within the `robotjaol-finance` project directory, run the Vercel deploy command:
    ```bash
    vercel
    ```
    Vercel will ask you a series of questions:
    -   `Set up and deploy “~/robotjaol-finance”?` **Y**
    -   `Which scope do you want to deploy to?` (Select your personal account or team)
    -   `Link to existing project?` **N** (Unless you have an existing Vercel project you want to link to)
    -   `What’s your project’s name?` (You can press Enter to accept `robotjaol-finance` or provide a custom name)
    -   `In which directory is your code located?` **.** (Press Enter for current directory)
    -   `Detected React: `**`./`** (Press Enter to confirm)
    -   `Want to override the build settings?` **N** (Unless you have custom build requirements)

    Vercel will then build and deploy your application. Once completed, it will provide you with a unique URL where your application is live.

3.  **Access Your Deployed Application:**
    Copy the provided URL from the Vercel CLI output and paste it into your web browser to access your permanently deployed `robotjaol | Finance` application.

## 4. Vercel Configuration (Optional)

For more advanced Vercel configurations, you can create a `vercel.json` file in the root of your project directory. Here's a basic example for a React application:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

This rewrite rule ensures that all requests are routed to `index.html`, which is common for single-page applications (SPAs) like React apps, allowing client-side routing to work correctly.

If you encounter any issues, please refer to the [Vercel Documentation](https://vercel.com/docs) or the `README.md` file in the project directory.

