# Modern Note-Taking App

A sleek and modern note-taking application built with Next.js, Firebase, and Tailwind CSS. Features include user authentication, real-time updates, dark/light theme, and organization with folders and tags.

## Live Demo
Visit the app: [https://giorgosmallis.github.io/Web-app/](https://giorgosmallis.github.io/Web-app/)

## Features

- 🔐 User Authentication with Firebase
- 🌓 Dark/Light Theme Toggle
- 📁 Folder Organization
- 🏷️ Tag Management
- 📝 Real-time Note Updates
- 🎨 Modern UI with Tailwind CSS
- 📱 Responsive Design

## Technologies Used

- Next.js 14
- Firebase (Authentication & Firestore)
- Tailwind CSS
- TypeScript
- React Context API

## Getting Started

1. Clone the repository
   ```bash
   git clone https://github.com/GiorgosMallis/Web-app.git
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file with your Firebase configuration:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

## Development

The app is built using modern web technologies and follows best practices:

- **Next.js**: For server-side rendering and static site generation
- **Firebase**: For authentication and real-time database
- **Tailwind CSS**: For responsive and modern UI design
- **TypeScript**: For type safety and better developer experience
- **Context API**: For state management

## License

MIT License
