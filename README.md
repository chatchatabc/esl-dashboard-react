# ESL Dashboard React

This project is a dashboard for the ESL website. It will be used by admins, teachers, and students to manage their accounts, schedules, and classes.

## Getting Started

### Prerequisites

Just make sure you have [Node.js](https://nodejs.org/en/) (>= 18.0.0) installed. Everything else will be installed by the following steps.

### Installing

1. Clone the repo
   ```sh
   git clone https://github.com/chatchatabc/esl-dashboard-react.git
   ```
2. Clone the backend repo
   ```sh
   git clone https://github.com/chatchatabc/esl-backend-workers.git
   ```
   > Some of the resources that are being used by the frontend are stored in the backend repo. So, you need to clone the backend repo as well.
3. Open the project directory
   ```sh
   cd esl-dashboard-react
   ```
4. Install NPM packages
   ```sh
    npm install
   ```

### Running

1. Run the project
   ```sh
   npm run dev
   ```
2. Open the browser and go to http://localhost:3000

### Building

1. Build the project
   ```sh
   npm run build
   ```
2. The build files will be in the `dist` folder

### Deploying

1. Deploy the project
   ```sh
   npm run deploy
   ```
   > This will run the build command and deploy the build files to your cloudflare pages.

## Tech Stack

- [React](https://reactjs.org/): Frontend framework for building user interfaces
- [Redux](https://redux.js.org/): State management library for React
- [React Router](https://reactrouter.com/): Routing library for React
- [Vite](https://vitejs.dev/): Build tool
- [Tailwind CSS](https://tailwindcss.com/): CSS framework for styling
- [tRPC](https://trpc.io/): RPC framework for easy communication between frontend and backend
- [TypeScript](https://www.typescriptlang.org/): Programming language for static type checking
- [FullCalendar](https://fullcalendar.io/): Calendar library for React
- [Ant Design](https://ant.design/): UI library for React
- [Puppeteer](https://pptr.dev/): Headless browser for E2E testing
- [Vitest](https://vitest.dev/): Testing framework

## Project Structure

```
├── public/
│   └── images/
│       └── ...
├── src/
│   ├── application/
│   │   ├── assets/
│   │   │   └── ...
│   │   ├── components/
│   │   │   └── ...
│   │   ├── layouts/
│   │   │   └── ...
│   │   ├── pages/
│   │   │   └── ...
│   │   ├── routes/
│   │   │   └── ...
│   │   └── stores/
│   │       └── ...
│   ├── domain
│   │   ├── infras
│   │   │   └── ...
│   │   └── services
│   │       └── ...
│   ├── tests
│   │   └── ...
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   └── vite-env.d.ts
├── index.html
└── ...
```

### Definitions

- **Application**: The frontend application that users interact with directly
  - **Assets**: Static files such as icons, images, etc.
  - **Components**: Reusable components such as tables, forms, modals, etc.
  - **Layouts**: Layouts that are being reused across multiple pages
  - **Pages**: Pages that are being rendered by the router
  - **Routes**: Routes that are being used by the react router to render pages
  - **Stores**: Redux stores that are being used by the application
- **Domain**: The backend application that the frontend application uses to handle business logic
  - **Infras**: Infrastructure services such as trpc, axios, etc.
  - **Services**: Business logic services such as authentication, user, etc.
- **Tests**: Test files for the application
