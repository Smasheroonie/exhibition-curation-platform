# Exhibition Curation Platform

## Project Overview

You’ve been invited by a coalition of museums and universities to develop a platform where users can explore virtual exhibitions from combined collections of antiquities and fine art. This platform will serve researchers, students, and art enthusiasts, providing a searchable and interactive experience of the collections.

## Minimum Viable Product (MVP)

The platform (web app or progressive web app) must include the following features:

1. Users can search artworks across collections from **at least two** different Museum or University APIs.
2. Allow users to browse artworks, from a list view, with "Previous" and "Next" page navigation options to prevent loading of too many items at once.
3. Users can filter and/or sort artworks to make it easier to navigate through larger lists of items.
4. Display images and essential details about each artwork individually.
5. Enable users to create, add items to, and remove items from, personal _exhibition collections_ of saved artworks. A single user can have multiple exhibition collections.
6. Users can view their exhibitions and the saved items within each collection.

Refer to [Completion and Submission Requirements](#completion-and-submission-requirements) for more details.

## Tech Choices

- **Programming Languages**: Use **JavaScript** or **TypeScript**.
- **API Integration**: Research and choose at least two free museum or university APIs to retrieve collection data. Be sure to sign up for any necessary developer accounts on free tiers.
- **Hosting**: Use a free distribution platform (e.g., GitHub Pages or Netlify).
- Implement **security best practices** (e.g. for handling of API keys).

The following technologies and tools are **suggestions**, not requirements:

- **React** for the frontend.
- **TanStack** for managing API calls from the frontend.
- **TypeScript** Express server.

## UI Requirements

- Design should be **responsive** and adapt well across various screen sizes.
- Ensure **accessibility** for users with disabilities (e.g., support screen readers, keyboard navigation).
- The UI should clearly provide feedback on interactions, display **errors** (e.g., failed requests or missing fields) and show loading states when content is being fetched.
- Design should intuitively guide users to search, view, and create curated exhibitions.

## Completion and Submission Requirements

The due date will be provided, but it will be no later than four weeks after starting the project.

Your project must fulfill the following criteria:

1. The project should be **hosted** and publicly accessible (from a web browser).
2. **README Documentation** should include:
   - A summary of the project
     - (you may consider recording a **video walkthrough** of your platform, highlighting key features. Host this video on a free platform (e.g., YouTube) and include a link in your README.)
   - Clear instructions on how to run the project locally, including setup steps (e.g., installing dependencies and configuring environment variables).
3. Meet the [MVP requirements](#minimum-viable-product-mvp) outlined above.

Failure to meet these requirements may result in project rejection.

## Optional Extensions

If you complete the MVP and have time for additional features, consider implementing the following:

1. **User Accounts**: Save curated exhibition collections within user profiles. Consider a back-end solution for securely storing data, and provide access to a whitelisted test account.
2. **Social Media Integration**: Allow users to share exhibitions or individual artworks.
3. **Cross-Platform Access**: Develop both a website and a mobile app.
4. **Advanced Search Options**: Enable multiple filters for more refined search criteria.