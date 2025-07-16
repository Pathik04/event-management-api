Event Management API

A RESTful API for managing events and user registrations using Node.js, Express, TypeScript, and PostgreSQL.



 Setup Instructions

1. Clone the repository
   
   git clone https://github.com/Pathik04/event-management-api.git
    event-management-api

2. Install dependencies


   npm install
   

3. Set up environment variables

Create an .env file and update values:

   
      .env

 # Database configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=event_api
DB_USER=your_db_user
DB_PASS=your_db_password

# Server port
PORT=3000

     

4. Run the PostgreSQL migrations

   
   psql -U your_user -d event_api -f src/db/migrations/001_create_users.sql
   psql -U your_user -d event_api -f src/db/migrations/002_create_events.sql
   

5. Start the server

   
   npm run dev
   



API Endpoints

| Method | Endpoint               | Description            |
| ------ | ---------------------- | ---------------------- |
| POST   | `/api/users`           | Create a new user      |
| POST   | `/events`              | Create a new event     |
| GET    | `/events/:id`          | Get event with users   |
| POST   | `/events/:id/register` | Register user to event |
| DELETE | `/events/:id/register` | Cancel registration    |
| GET    | `/events/upcoming`     | List upcoming events   |
| GET    | `/events/:id/stats`    | Event statistics       |



Example Requests

 Create a User


POST /api/users
Content-Type: application/json

{
  "name": "Sam",
  "email": "sam@gmail.com"
}

 Create an Event


POST /events
Content-Type: application/json

{
  "title": "Tech Conference",
  "at": "2025-08-01T10:00:00Z",
  "location": "Kolkata",
  "capacity": 100
}


Register User to Event


POST /events/1/register
Content-Type: application/json

{
  "userId": 1
}




