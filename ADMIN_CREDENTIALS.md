# Admin Login Credentials

## Default Admin Account

**Email:** `admin@learnwave.com`  
**Password:** `admin123`  
**Name:** Test Admin  
**Role:** ADMIN

## How to Login

1. Go to the login page: `http://localhost:3000/auth/login`
2. Enter the admin email: `admin@learnwave.com`
3. Enter the admin password: `admin123`
4. Click "Login"

## Admin Dashboard Access

After successful login, you will be redirected to the admin dashboard at:
`http://localhost:3000/admin`

## Admin Features

The admin dashboard provides access to:

- **User Management**: View and manage all platform users
- **Mentor Approvals**: Review and approve mentor applications
- **Analytics**: View platform statistics and usage metrics
- **Resource Management**: Manage study materials and resources
- **Announcements**: Send platform-wide notifications

## Security Notes

- Change the default password after first login
- Keep the admin credentials secure
- Use strong passwords for admin accounts
- Regularly review admin access logs

## Creating Additional Admins

To create additional admin users, you can use the API endpoint:

```
POST /api/admin/create-admin
Content-Type: application/json

{
  "email": "new-admin@example.com",
  "password": "securePassword123",
  "name": "Admin Name"
}
```

---

⚠️ **Important**: This file contains sensitive information. Remove or secure this file in production environments.