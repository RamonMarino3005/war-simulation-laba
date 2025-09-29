# Authentication

## Table of Contents

- [Authentication Process](#authentication-process)
  - [Register](#register)
  - [Login](#login)
  - [Refresh](#refresh-token)

    
## Authentication Process

### Register

The API uses JWT authentication + refreshTokens managed by Redis. The steps for authentication are the following:

Send a POST request to `/auth/sing-up` with a body with:
- username: string with 3 - 15 characters
- email: valid email as defined by **WHATWG HTML standard**
- password: string with 8+ characters


Example:
```json

{
    "username": "Peter",
    "email": "test@example.com"
    "password": "12345678"
}

```

Example of response:
```
Registration Successful
```

### Login

Send a POST request to `/auth/login` with a body with the following properties:
- username
- password

Example:
```json
{
    "name": "Peter",
    "password": "12345678"
}
```

Example of response:

headers: 
```
{
  Set-Cookie: accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJlZWM2Yzk0Ni1mZTU4LTQwYzgtYjQyZi0yOWEyMDNmY2FlZjQiLCJlbWFpbCI6ImFkbWluQHdhci1zaW11bGF0aW9uLmNvbSIsInJvbGUiOiJhZG1pbiIsImV4cCI6MTc1OTc3NDExM30%3D.wxDU7POfuGo3BsDMdoHIJ4Va0acqiZ20pO%2FKBS2ky9w%3D; Max-Age=900; Path=/; Expires=Mon, 29 Sep 2025 18:23:33 GMT; HttpOnly; Secure; SameSite=Strict,refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJlZWM2Yzk0Ni1mZTU4LTQwYzgtYjQyZi0yOWEyMDNmY2FlZjQiLCJlbWFpbCI6ImFkbWluQHdhci1zaW11bGF0aW9uLmNvbSIsInJvbGUiOiJhZG1pbiIsImV4cCI6MTc1OTI1NTcxM30%3D.cKaUy%2BGPSfEJ8tN57YXsxGyjsJF6s3fyp61zm9GsoSk%3D; Max-Age=604800; Path=/; Expires=Mon, 06 Oct 2025 18:08:33 GMT; HttpOnly; Secure; SameSite=Strict
  Content-Type: application/json;
  charset=utf-8
}
```
body:
```json
{
   "message": "Login Successful",
   "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiVG9tYXMiLCJwYXNzd29yZCI6IlRlc3QxMjMifQ.W5-8IUmeh0a7WfnXA2hBhxRiWah5eKUppo3bRSWazfU",
   "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwZDhkNDhhMi0xM2ExLTRkOWMtYmQyZi02OWYxYzFhMjhjZDkiLCJlbWFpbCI6ImFkbWluQHdhci1zaW11bGF0aW9uLmNvbSIsInJvbGUiOiJhZG1pbiIsImV4cCI6MTc1OTI0MzY5N30=.VVweKxtwjZuQ8tA+483DpTkiffNzy3UIR/klxt0Cq/A="    
}
```

`accessToken`: JWT token that you will use for authentication. short life: default 1 day, customizable from `src/utils/jwt/JWTProvider`.  
`refreshToken`: JWT token that you will use to get a new `accessToken`. Long life: default 7d. customizable.

Send a GET request to `/auth/protected` or `auth/session` with the accessToken in the Authorization header or as a cookie to confirm that the authentication works.

Example of response:

Request:
`localhost:3000/auth/protected`:  
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJlZWM2Yzk0Ni1mZTU4LTQwYzgtYjQyZi0yOWEyMDNmY2FlZjQiLCJlbWFpbCI6ImFkbWluQHdhci1zaW11bGF0aW9uLmNvbSIsInJvbGUiOiJhZG1pbiIsImV4cCI6MTc1OTc3NDQ5Mn0=.z5VfJSwkmSwMEOC4axtxDF/FiPzAkJX6oX/k6oRC9Yg=

response:  
```json
{
  "message": "Access granted to protected route",
  "session": {
    "userId": "eec6c946-fe58-40c8-b42f-29a203fcaef4",
    "email": "admin@war-simulation.com",
    "role": "admin"
  }
}
```

Request:  
`localhost:3000/auth/session`:  
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJlZWM2Yzk0Ni1mZTU4LTQwYzgtYjQyZi0yOWEyMDNmY2FlZjQiLCJlbWFpbCI6ImFkbWluQHdhci1zaW11bGF0aW9uLmNvbSIsInJvbGUiOiJhZG1pbiIsImV4cCI6MTc1OTc3NDQ5Mn0=.z5VfJSwkmSwMEOC4axtxDF/FiPzAkJX6oX/k6oRC9Yg=
response :  
```json
{
  "status": "authenticated",
  "session": {
    "userId": "eec6c946-fe58-40c8-b42f-29a203fcaef4",
    "email": "admin@war-simulation.com",
    "role": "admin",
    "exp": 1759774492
  }
}
```
### Refresh Token

Send a POST request to `/auth/refresh` with the `refreshToken` in the `Authorization` header to get a new `accessToken`:

Request:
`localhost:3000/auth/refresh`  
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJlZWM2Yzk0Ni1mZTU4LTQwYzgtYjQyZi0yOWEyMDNmY2FlZjQiLCJlbWFpbCI6ImFkbWluQHdhci1zaW11bGF0aW9uLmNvbSIsInJvbGUiOiJhZG1pbiIsImV4cCI6MTc1OTI1NjM5OX0=.7fW7D9jVGnt81fs3Pqjbo1xtL4e5LDWKl6DsGzwmHrg=

Example of response:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJlZWM2Yzk0Ni1mZTU4LTQwYzgtYjQyZi0yOWEyMDNmY2FlZjQiLCJlbWFpbCI6ImFkbWluQHdhci1zaW11bGF0aW9uLmNvbSIsImV4cCI6MTc1OTc3NDgyMn0=.35V2B1k4qxeVWVqweM9h9c8vNi1IGnTpLe8EZ7l6Mbc="
}
```
