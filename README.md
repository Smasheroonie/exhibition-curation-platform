# Exhibitly

## Project Overview

This project connects the V&A Museum API and Harvard Art Museum API into one convenient platform! You can browse, search and sort artworks, then create your own profile in order to save them in your own collections.

## Tech Choices

- **Programming Languages**: **TypeScript**.
- **API Integration**: **V&A Museum** and **Harvard Art Museum**
- **Hosting**: **Netlify**
- **React/Vite** for the frontend.
- **TanStack** for managing API calls from the frontend.
- **Supabase** database and authentication, allowing for creating an account and tracking collections.

## Setup

To clone the repository, start by clicking "Code" at the top of this page and copy the given URL. Then enter the following in your terminal:

```Bash
git clone https://github.com/Smasheroonie/exhibition-curation-platform.git
code exhibition-curation-platform
```

This will clone and open the new folder in VS Code.

Open your terminal in VS Code and run the following command to install dependencies:

```Bash
npm install
```

Create a .env file and add your own API key for Harvard Art Museums:

- https://harvardartmuseums.org/collections/api

```
VITE_HAM_KEY=<YOUR-KEY>
```

You can then run the local development server with the command:

```Bash
npm run dev
```

Ctrl + click the localhost link in the terminal to open in your browser.

Supabase integration, and interaction with user login restricted features can be seen on the hosted site:

- https://exhibitly-luke-goncalves.netlify.app

## Thank you for viewing my project!
