# MySpot - Modular Monolith

A parking spot reservation system built with modular monolith architecture in .NET 10.

## Architecture Overview

MySpot demonstrates a modular monolith approach where the application is divided into loosely-coupled modules that communicate through well-defined interfaces.

### Modules

| Module | Description |
|--------|-------------|
| **Users** | User registration, authentication (JWT), and account management |
| **ParkingSpots** | Management of parking spots (CRUD operations) |
| **Availability** | Resource availability tracking and management |
| **Reservations** | Parking spot reservation logic and booking management |
| **Notifications** | Email notifications and communication |
| **Mapping** | Cross-module event mapping and translation |
| **Saga** | Distributed transaction coordination using Chronicle |

### Module Communication

Modules communicate through:
- **Shared Contracts** - Synchronous calls via shared interfaces (e.g., `IAvailabilityModuleApi`)
- **Events** - Asynchronous messaging via `IMessageBroker`
- **Module Requests** - Request/response patterns

## Getting Started

### Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- [Docker](https://www.docker.com/) (for PostgreSQL)
- [Node.js 18+](https://nodejs.org/) (for workshop app)

### Running the Application

#### Option 1: Run Everything Together

Use the workshop runner script to start all services:

```bash
./run-workshop.sh
```

This will start:
- PostgreSQL database (Docker)
- Backend API at `http://localhost:5000`
- Workshop frontend at `http://localhost:5173`
- Test runner API at `http://localhost:3001`

#### Option 2: Run Components Separately

**1. Start Infrastructure (PostgreSQL)**

```bash
docker-compose up -d
```

**2. Run Backend API**

```bash
cd src/Bootstrapper/MySpot.Bootstrapper
dotnet run
```

The API will be available at `http://localhost:5000`

**3. Run Workshop App** (for exercises)

```bash
cd workshops
npm install
npm run dev:all
```

The workshop app will be available at `http://localhost:5173`

### Running Tests

```bash
dotnet test
```

To run specific exercise tests:

```bash
dotnet test --filter "FullyQualifiedName~Exercise03"
```

## Project Structure

```
MySpot-Modular-Monolith/
├── src/
│   ├── Bootstrapper/              # Application entry point
│   │   └── MySpot.Bootstrapper/   # Main web host
│   ├── Modules/
│   │   ├── Availability/          # Resource availability module
│   │   │   ├── Api/              # HTTP endpoints
│   │   │   ├── Application/      # Use cases & handlers
│   │   │   ├── Infrastructure/   # Data access
│   │   │   └── Shared/           # Public contracts
│   │   ├── Mapping/              # Event mapping module
│   │   ├── Notifications/        # Notification module
│   │   ├── ParkingSpots/         # Parking spots module
│   │   ├── Reservations/         # Reservations module
│   │   ├── Saga/                 # Saga coordination
│   │   └── Users/                # Users module
│   └── Shared/
│       ├── MySpot.Shared.Abstractions/    # Shared interfaces
│       └── MySpot.Shared.Infrastructure/  # Shared implementations
├── tests/
│   └── MySpot.Workshops.Tests/    # Workshop exercise tests
├── workshops/                      # Workshop frontend app
│   ├── src/                       # React components
│   └── server/                    # Test runner server
├── docker-compose.yml             # Infrastructure setup
└── run-workshop.sh                # All-in-one runner
```

## API Endpoints

### Users
- `POST /sign-up` - Register new user
- `POST /sign-in` - Authenticate and get JWT token
- `GET /me` - Get current user (requires auth)
- `GET /users/{id}` - Get user by ID

### Parking Spots
- `GET /parking-spots` - List all parking spots
- `POST /parking-spots` - Add new parking spot
- `PUT /parking-spots/{id}` - Update parking spot
- `DELETE /parking-spots/{id}` - Delete parking spot

### Reservations
- `POST /reservations` - Make a reservation (requires auth)
- `DELETE /reservations/{id}` - Remove reservation (requires auth)

### Resources (Availability)
- `POST /resources` - Add new resource

### Notifications
- `POST /emails/send` - Send email notification

## Workshop Exercises

The workshop app provides interactive exercises to learn modular monolith patterns:

1. Start the workshop environment: `./run-workshop.sh`
2. Open `http://localhost:5173` in your browser
3. Select an exercise from the sidebar
4. Read the description and implement the solution
5. Click "Run Tests" to verify your implementation

### Available Exercises

| # | Title | Pattern |
|---|-------|---------|
| 3 | Shared Contracts | Synchronous module communication |

## Configuration

Configuration is managed through `appsettings.json` in the Bootstrapper project:

- **Database**: PostgreSQL connection string
- **JWT**: Token configuration for authentication
- **CORS**: Allowed origins for cross-origin requests
- **Logging**: Serilog configuration

## License

This project is for educational purposes as part of DevMentors workshops.
