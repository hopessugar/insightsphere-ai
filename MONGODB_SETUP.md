# MongoDB Atlas Setup Guide

This guide will help you set up MongoDB Atlas for InsightSphere AI authentication and data persistence.

## Step 1: Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Sign up for a free account (no credit card required)
3. Verify your email address

## Step 2: Create a New Cluster

1. After logging in, click **"Build a Database"**
2. Choose the **FREE** tier (M0 Sandbox)
3. Select a cloud provider and region closest to your users
4. Name your cluster (e.g., `insightsphere-cluster`)
5. Click **"Create Cluster"** (this may take 3-5 minutes)

## Step 3: Configure Database Access

1. In the left sidebar, click **"Database Access"** under Security
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication method
4. Enter a username (e.g., `insightsphere-admin`)
5. Click **"Autogenerate Secure Password"** and **SAVE THIS PASSWORD**
6. Under "Database User Privileges", select **"Read and write to any database"**
7. Click **"Add User"**

## Step 4: Configure Network Access

1. In the left sidebar, click **"Network Access"** under Security
2. Click **"Add IP Address"**
3. For development, click **"Allow Access from Anywhere"** (0.0.0.0/0)
   - **Note**: For production, restrict this to your server's IP address
4. Click **"Confirm"**

## Step 5: Get Your Connection String

1. Go back to **"Database"** in the left sidebar
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. Select **"Python"** as the driver and version **"3.12 or later"**
5. Copy the connection string (it looks like this):
   ```
   mongodb+srv://<username>:<password>@cluster.mongodb.net/?retryWrites=true&w=majority
   ```

## Step 6: Update Your Backend .env File

1. Open `backend/.env`
2. Replace the `MONGODB_URI` value with your connection string
3. Replace `<username>` with your database username
4. Replace `<password>` with the password you saved earlier
5. Add the database name to the connection string:
   ```
   MONGODB_URI=mongodb+srv://insightsphere-admin:YOUR_PASSWORD@cluster.mongodb.net/insightsphere?retryWrites=true&w=majority
   ```

## Step 7: Generate a Strong JWT Secret Key

For production security, generate a strong JWT secret key:

### On Windows (PowerShell):
```powershell
# Generate a random 32-byte hex string
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 64 | ForEach-Object {[char]$_})
```

### On Linux/Mac:
```bash
openssl rand -hex 32
```

Update the `JWT_SECRET_KEY` in your `backend/.env` file with this generated key.

## Step 8: Verify Connection

Once you've updated your `.env` file, you can test the connection by running the backend:

```bash
cd backend
python app.py
```

If everything is configured correctly, you should see:
```
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

## Database Collections

The following collections will be automatically created when you use the application:

- **users** - User accounts and authentication data
- **mood_logs** - Daily mood tracking entries
- **wellness_plans** - Generated wellness plans
- **chat_conversations** - Therapy chat history

## Indexes

For optimal performance, the following indexes will be created:

```javascript
// Users collection
db.users.createIndex({ "email": 1 }, { unique: true })

// Mood logs collection
db.mood_logs.createIndex({ "user_id": 1, "date": -1 })

// Wellness plans collection
db.wellness_plans.createIndex({ "user_id": 1, "created_at": -1 })

// Chat conversations collection
db.chat_conversations.createIndex({ "user_id": 1, "updated_at": -1 })
```

These will be created automatically by the application.

## Troubleshooting

### Connection Timeout
- Check that your IP address is whitelisted in Network Access
- Verify your connection string is correct
- Ensure your internet connection is stable

### Authentication Failed
- Double-check your username and password
- Make sure you're using the database user credentials, not your Atlas account credentials
- Verify the password doesn't contain special characters that need URL encoding

### Database Not Found
- The database will be created automatically on first use
- Make sure the database name is included in your connection string

## Security Best Practices

1. **Never commit your .env file** - It's already in `.gitignore`
2. **Use strong passwords** - Let MongoDB generate them
3. **Restrict IP access in production** - Don't use 0.0.0.0/0
4. **Rotate your JWT secret** - Change it periodically
5. **Enable MongoDB Atlas monitoring** - Set up alerts for unusual activity

## Next Steps

After completing this setup:

1. Continue with task 2 in the implementation plan
2. The backend will automatically connect to MongoDB when it starts
3. User registration will create the first documents in your database

## Support

- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [MongoDB Python Driver (Motor) Documentation](https://motor.readthedocs.io/)
- [FastAPI with MongoDB Tutorial](https://www.mongodb.com/languages/python/pymongo-tutorial)
