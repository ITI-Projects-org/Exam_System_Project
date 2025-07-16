# Exam System

A comprehensive online examination system built with .NET 9 Web API backend and Angular 20 frontend. This system allows teachers to create and manage exams, students to take exams, and provides a complete examination workflow with JWT authentication.

## 🎯 Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **User Management**: Separate roles for Students and Teachers with ASP.NET Identity
- **Exam Management**: Create, edit, and manage exams with multiple-choice questions
- **Student Portal**: Take exams, view results, and manage course enrollments
- **Teacher Portal**: Create exams, manage questions, assign students to exams
- **Course Management**: Assign courses to students and manage course content
- **Real-time Validation**: Client-side and server-side validation
- **Responsive Design**: Bootstrap-based responsive UI

## 🛠️ Tech Stack

### Backend (.NET 9 Web API)

- **Framework**: .NET 9 with ASP.NET Core Web API
- **Database**: SQL Server with Entity Framework Core 9.0.7
- **Authentication**: JWT Bearer tokens with ASP.NET Identity
- **ORM**: Entity Framework Core with Lazy Loading Proxies
- **Mapping**: AutoMapper 15.0.0
- **API Documentation**: OpenAPI/Swagger with SwaggerUI
- **Architecture Patterns**: Repository Pattern, Unit of Work Pattern

### Frontend (Angular 20)

- **Framework**: Angular 20 with Standalone Components
- **UI Framework**: Bootstrap 5.3.7 with Bootstrap Icons
- **HTTP Client**: Angular HttpClient with Interceptors
- **Routing**: Angular Router with Guards
- **State Management**: RxJS for reactive programming
- **Authentication**: JWT token handling with jwt-decode
- **Utilities**: date-fns for date manipulation
- **Build Tool**: Angular CLI with SSR support

## 📁 Project Structure

```
Exam_System/
├── backend/
│   ├── backend.sln
│   └── backend/
│       ├── Controllers/          # API Controllers
│       │   ├── AccountController.cs
│       │   ├── ExamController.cs
│       │   ├── StudentController.cs
│       │   └── TeacherController.cs
│       ├── DTOs/                 # Data Transfer Objects
│       ├── Models/               # Entity Models
│       │   ├── ApplicationUser.cs
│       │   ├── Student.cs
│       │   ├── Teacher.cs
│       │   ├── Course.cs
│       │   ├── Exam.cs
│       │   ├── Question.cs
│       │   ├── Option.cs
│       │   └── ExamSysContext.cs
│       ├── Repositories/         # Repository Pattern Implementation
│       │   ├── Interfaces/
│       │   └── Implementations/
│       ├── UnitOfWorks/          # Unit of Work Pattern
│       ├── MapperConfig/         # AutoMapper Configuration
│       └── Migrations/           # EF Core Migrations
└── frontend/
    └── src/
        └── app/
            ├── components/       # Reusable Components
            ├── pages/           # Page Components
            ├── services/        # HTTP Services
            ├── guards/          # Route Guards
            ├── interceptors/    # HTTP Interceptors
            ├── models/          # TypeScript Interfaces
            ├── layout/          # Layout Components
            └── shared/          # Shared Components
```

## 🏗️ Architecture & Design Patterns

### Backend Patterns

#### 1. Repository Pattern

- **Implementation**: Generic repository with specific repository implementations
- **Location**: `backend/Repositories/`
- **Benefits**: Abstraction layer over Entity Framework, testability, maintainability

```csharp
public class GenericRepository<T> : IGenericRepository<T> where T : class
{
    protected readonly ExamSysContext _context;
    // CRUD operations implementation
}
```

#### 2. Unit of Work Pattern

- **Implementation**: Centralized transaction management
- **Location**: `backend/UnitOfWorks/UnitOfWork.cs`
- **Benefits**: Ensures data consistency, manages multiple repositories

#### 3. Data Transfer Objects (DTOs)

- **Purpose**: Data encapsulation and API contract definition
- **Location**: `backend/DTOs/`
- **Benefits**: Security, versioning, reduced payload size

#### 4. AutoMapper Configuration

- **Purpose**: Object-to-object mapping
- **Location**: `backend/MapperConfig/MappingConfigurations.cs`
- **Benefits**: Reduces boilerplate code, maintains separation of concerns

### Frontend Patterns

#### 1. Standalone Components (Angular 20)

- **Implementation**: Modern Angular architecture without NgModules
- **Benefits**: Lazy loading, better tree-shaking, simplified structure

#### 2. Service-Oriented Architecture

- **Implementation**: HTTP services for API communication
- **Location**: `frontend/src/app/services/`
- **Benefits**: Reusability, separation of concerns, testability

#### 3. Guard Pattern

- **Implementation**: Route protection with `AuthGuard` and `StudentGuard`
- **Location**: `frontend/src/app/guards/`
- **Benefits**: Security, role-based access control

#### 4. Interceptor Pattern

- **Implementation**: HTTP request/response interception
- **Location**: `frontend/src/app/interceptors/auth-interceptor.ts`
- **Benefits**: Centralized token management, request/response transformation

## 🔐 Authentication & Authorization

### JWT Implementation

- **Token Generation**: Backend generates JWT tokens upon successful login
- **Token Storage**: Frontend stores tokens in localStorage
- **Token Validation**: Backend validates tokens using `JwtBearer` middleware
- **Role-based Access**: Different endpoints for Students and Teachers

### User Roles

- **Students**: Can take exams, view results, manage course enrollments
- **Teachers**: Can create exams, manage questions, assign students to exams

## 💾 Database Schema

### Core Entities

- **ApplicationUser**: Base user entity with ASP.NET Identity
- **Student**: Inherits from ApplicationUser
- **Teacher**: Inherits from ApplicationUser
- **Course**: Course entity managed by teachers
- **Exam**: Exam entity with questions
- **Question**: Multiple-choice questions
- **Option**: Answer options for questions

### Relationships

- **Student-Course**: Many-to-many relationship (`Stud_Course`)
- **Student-Exam**: Many-to-many relationship (`Stud_Exam`)
- **Student-Option**: Many-to-many relationship (`Stud_Option`)
- **Teacher-Course**: One-to-many relationship
- **Course-Exam**: One-to-many relationship
- **Exam-Question**: One-to-many relationship
- **Question-Option**: One-to-many relationship

## 🚀 Getting Started

### Prerequisites

- .NET 9 SDK
- Node.js (v18+)
- SQL Server
- Angular CLI

### Backend Setup

1. Navigate to backend directory:

   ```bash
   cd backend/backend
   ```

2. Restore NuGet packages:

   ```bash
   dotnet restore
   ```

3. Update connection string in `appsettings.json`:

   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "your-connection-string"
     },
     "JwtKey": "your-secret-key"
   }
   ```

4. Run migrations:

   ```bash
   dotnet ef database update
   ```

5. Run the application:
   ```bash
   dotnet run
   ```

### Frontend Setup

1. Navigate to frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Update API base URL in services (if needed)

4. Start the development server:
   ```bash
   npm start
   ```

## 📋 API Endpoints

### Authentication

- `POST /api/Account/register` - User registration
- `POST /api/Account/login` - User login

### Student Endpoints

- `GET /api/Student/{id}` - Get student details
- `GET /api/Student/courses/{studentId}` - Get student courses

### Teacher Endpoints

- `GET /api/Teacher/{id}` - Get teacher details
- `POST /api/Teacher/courses` - Create course

### Exam Endpoints

- `GET /api/Exam/{id}` - Get exam details
- `POST /api/Exam` - Create exam
- `PUT /api/Exam/{id}` - Update exam
- `DELETE /api/Exam/{id}` - Delete exam

## 🧪 Testing

### Backend Testing

- Unit tests can be added using xUnit framework
- Integration tests for API endpoints

### Frontend Testing

- Unit tests using Jasmine and Karma
- Run tests: `npm test`

## 🔧 Configuration

### Backend Configuration

- **Database**: Configure connection string in `appsettings.json`
- **JWT**: Set JWT secret key in `appsettings.json`
- **CORS**: Configured to allow Angular frontend
- **Identity**: Password requirements configured in `Program.cs`

### Frontend Configuration

- **API Base URL**: Update in service files
- **Routing**: Configure routes in `app.routes.ts`
- **Interceptors**: HTTP interceptors for token management

## 📝 Development Notes

### Backend

- Uses Entity Framework Core with Lazy Loading Proxies
- Database seeding functionality (commented out in `Program.cs`)
- Comprehensive error handling and logging
- OpenAPI/Swagger documentation available in development

### Frontend

- Uses Angular 20 with Standalone Components
- Implements SSR (Server-Side Rendering) support
- Bootstrap for responsive design
- TypeScript interfaces for type safety

## 🔄 Future Enhancements

- Real-time notifications
- Advanced reporting and analytics
- Question bank management
- Exam scheduling
- Mobile application
- Advanced security features

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

