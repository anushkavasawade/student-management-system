# Student Management System

## 1. Project Overview

The **Student Management System** is a web-based application designed to manage student records and course-related information. It provides a simple dashboard and features for viewing, searching, and managing student details.

This project also demonstrates the implementation of a **Continuous Integration and Continuous Deployment (CI/CD) pipeline** using GitHub Actions. The pipeline automates code validation, testing, building, and deployment.

## 2. Objectives

- Develop a simple and user-friendly Student Management System.
- Manage and view student records efficiently.
- Use GitHub for source code management and version control.
- Automate application checks and builds using GitHub Actions.
- Deploy the application automatically to GitHub Pages.
- Apply Agile principles to organize development into manageable tasks.

## 3. Features

- Student dashboard with summary information.
- View student records.
- Search and filter student details.
- Add, edit, and delete student records.
- View course-related information.
- Simple and user-friendly interface.
- Automated CI/CD workflow.
- Web hosting through GitHub Pages.

## 4. Technologies Used

| Technology | Purpose |
|---|---|
| HTML | Web page structure |
| CSS | Styling and layout |
| JavaScript | Application functionality |
| Node.js | Runtime and development tooling |
| pnpm | Dependency management |
| Git | Version control |
| GitHub | Source code repository |
| GitHub Actions | CI/CD automation |
| Prettier | Code formatting checks |
| GitHub Pages | Application deployment |

## 5. Project Links

- **GitHub Repository:** https://github.com/anushkavasawade/student-management-system
- **Live Website:** https://anushkavasawade.github.io/student-management-system/

## 6. Agile Development Plan

The project can be divided into small tasks using Agile methodology.

### User Stories

1. **View Students:** As a user, I want to view student records so that I can access student information easily.
2. **Add Students:** As a user, I want to add student details so that new records can be maintained.
3. **Search Students:** As a user, I want to search and filter student records so that I can find information quickly.
4. **Update Students:** As a user, I want to edit student details so that existing information can be corrected.
5. **Manage Courses:** As a user, I want to view course-related information so that I can understand the available course details.

### Sprint Planning

- **Sprint 1:** Plan the application and develop the dashboard.
- **Sprint 2:** Implement student record management and search features.
- **Sprint 3:** Configure automated testing, build checks, and deployment.

### Definition of Done

A task is considered complete when its implementation is finished, the relevant checks pass, the feature meets its acceptance criteria, and the changes are ready to integrate into the project.

## 7. CI/CD Pipeline

The project uses GitHub Actions to automate the development workflow.

### Pipeline Stages

1. **Source Code Management:** Developers push code to the GitHub repository.
2. **Checkout:** GitHub Actions retrieves the source code.
3. **Dependency Installation:** Required packages are installed using pnpm.
4. **Syntax Validation:** JavaScript syntax is checked.
5. **Automated Testing:** The configured automated test verifies basic dashboard rendering and sample student records.
6. **TypeScript Validation:** The TypeScript code is checked.
7. **Code Quality:** Prettier checks the formatting of the configured application files.
8. **Build:** The application is built for deployment.
9. **Deployment:** When the required checks pass for changes on the `main` branch, the workflow publishes the website to GitHub Pages.

The workflow is configured in:

`.github/workflows/ci-cd.yml`

### Workflow Trigger

The pipeline runs when code is pushed to the `main` branch, when a pull request targets `main`, or when the workflow is manually started.

Pull requests run the validation and build stages without deploying the website.

## 8. How to Run the Project Locally

### Prerequisites

- Node.js
- pnpm
- Git

### Steps

**Step 1: Clone the repository**

```bash
git clone https://github.com/anushkavasawade/student-management-system.git
```

**Step 2: Open the project folder**

```bash
cd student-management-system
```

**Step 3: Install dependencies**

```bash
pnpm install
```

**Step 4: Run the development server**

```bash
pnpm --filter @workspace/student-management dev
```

Follow the local URL displayed in the terminal to open the application.

## 9. Expected Benefits

- Reduces manual effort during validation and deployment.
- Helps identify errors early.
- Improves consistency in the build process.
- Supports version control and collaborative development.
- Makes the deployed application easier to update.

## 10. Future Enhancements

- User authentication and role-based access.
- Database integration for persistent student records.
- Student attendance and performance tracking.
- Report generation and export functionality.
- More comprehensive automated tests.

## 11. Conclusion

The Student Management System demonstrates the development of a basic student-record management application and the use of Agile principles in software development. By integrating GitHub Actions into the workflow, the project automates code checks, testing, building, and deployment to GitHub Pages. This demonstrates how CI/CD can reduce manual work and improve the reliability of software delivery.

## 12. Author

**Project:** Student Management System  
**Subject:** Agile Software Development  
**Academic Year:** 2026–2027
