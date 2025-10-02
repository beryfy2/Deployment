# Beryfy Deployment Guide

This guide will help you deploy the Beryfy project with the backend on Render and frontend on Netlify.

## Project Structure

```
Beryfy/
├── backend/          # Node.js Express server
├── frontend/         # React + Vite application
└── DEPLOYMENT.md     # This file
```

## Prerequisites

- GitHub account
- Render account (free tier available)
- Netlify account (free tier available)
- MongoDB Atlas account (free tier available) or local MongoDB instance

## Backend Deployment on Render

### Step 1: Prepare Your Repository

1. Push your code to a GitHub repository
2. Ensure your backend folder contains all necessary files:
   - `server.js`
   - `package.json`
   - `render.yaml`

### Step 2: Deploy on Render

1. **Create New Web Service:**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Select your repository

2. **Configure Service:**
   - **Name:** `beryfy-backend` (or your preferred name)
   - **Environment:** `Node`
   - **Region:** Choose closest to your users
   - **Branch:** `main` (or your default branch)
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`

3. **Set Environment Variables:**
   Go to Environment tab and add:
   ```
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/beryfy
   FRONTEND_URL=https://your-netlify-app.netlify.app
   ```

4. **MongoDB Atlas Setup:**
   - Go to [MongoDB Atlas](https://cloud.mongodb.com/)
   - Create a free cluster
   - Create a database user
   - Whitelist your IP address (or use 0.0.0.0/0 for all IPs)
   - Get your connection string from "Connect" → "Connect your application"
   - Replace `<password>` with your database user password
   - Use this connection string for `MONGODB_URI`

5. **Deploy:**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Note your backend URL: `https://your-app-name.onrender.com`

### Step 3: Test Backend

Visit your backend URL to see: `{"message": "✅ Beryfy Backend Server is running!"}`

## Frontend Deployment on Netlify

### Step 1: Configure Environment Variables

1. **Create Production Environment File:**
   - In your local `frontend` folder, create `.env.production`
   - Add your backend URL:
   ```
   VITE_API_URL=https://your-render-app.onrender.com
   ```

### Step 2: Deploy on Netlify

1. **Connect Repository:**
   - Go to [Netlify Dashboard](https://app.netlify.com/)
   - Click "New site from Git"
   - Choose GitHub and select your repository

2. **Configure Build Settings:**
   - **Base directory:** `frontend`
   - **Build command:** `npm run build`
   - **Publish directory:** `frontend/dist`

3. **Set Environment Variables:**
   - Go to Site Settings → Environment Variables
   - Add:
   ```
   VITE_API_URL=https://your-render-app.onrender.com
   ```

4. **Deploy:**
   - Click "Deploy site"
   - Wait for build to complete
   - Note your frontend URL: `https://your-app-name.netlify.app`

### Step 3: Update Backend CORS

1. **Update Backend Environment:**
   - Go back to your Render dashboard
   - Update the `FRONTEND_URL` environment variable with your actual Netlify URL
   - Restart the service

## Post-Deployment Configuration

### Update URLs

1. **Backend CORS Configuration:**
   The backend is already configured to accept your frontend URL via the `FRONTEND_URL` environment variable.

2. **Frontend API Configuration:**
   The frontend automatically uses the production API URL when deployed.

### Custom Domain (Optional)

#### For Netlify (Frontend):
1. Go to Domain Settings in Netlify
2. Add your custom domain
3. Configure DNS records as instructed

#### For Render (Backend):
1. Go to Settings → Custom Domains
2. Add your API subdomain (e.g., `api.yourdomain.com`)
3. Update frontend environment variable accordingly

## Environment Variables Summary

### Backend (Render)
```
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/beryfy
FRONTEND_URL=https://your-netlify-app.netlify.app
```

### Frontend (Netlify)
```
VITE_API_URL=https://your-render-app.onrender.com
```

## Troubleshooting

### Common Issues

1. **CORS Errors:**
   - Ensure `FRONTEND_URL` in backend matches your Netlify URL exactly
   - Check that both HTTP and HTTPS are handled correctly

2. **Database Connection Issues:**
   - Verify MongoDB URI is correct
   - Check if IP address is whitelisted in MongoDB Atlas
   - Ensure database user has proper permissions
   - Check Render logs for database connection errors

3. **Build Failures:**
   - Check Node.js version compatibility
   - Verify all dependencies are in `package.json`
   - Review build logs for specific errors

4. **API Connection Issues:**
   - Verify `VITE_API_URL` is set correctly in Netlify
   - Check that backend is running and accessible
   - Test API endpoints directly

### Checking Logs

- **Render:** Dashboard → Your Service → Logs
- **Netlify:** Dashboard → Your Site → Functions (for build logs)

### Testing Deployment

1. **Backend Test:**
   ```bash
   curl https://your-render-app.onrender.com/
   ```

2. **Frontend Test:**
   - Visit your Netlify URL
   - Test contact form functionality
   - Check browser console for errors

3. **Database Test:**
   - Submit a contact form
   - Check MongoDB Atlas dashboard for new documents
   - Use GET /api/contacts to verify data is saved

## API Endpoints

The backend now provides the following endpoints:

### Public Endpoints
- `POST /api/contact` - Submit contact form
- `GET /api/health` - Health check

### Admin Endpoints (No authentication implemented yet)
- `GET /api/contacts` - Get all contact submissions with pagination
  - Query parameters: `page`, `limit`, `status`
  - Example: `/api/contacts?page=1&limit=10&status=new`
- `PATCH /api/contacts/:id/status` - Update contact status
  - Body: `{"status": "read|responded|archived"}`

### Contact Data Structure
```json
{
  "_id": "ObjectId",
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Project Inquiry",
  "message": "Hello, I need help with...",
  "status": "new",
  "ipAddress": "192.168.1.1",
  "userAgent": "Mozilla/5.0...",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

## Managing Contact Submissions

### Viewing Submissions
You can view contact submissions by:
1. **MongoDB Atlas Dashboard:** Browse collections directly
2. **API Endpoint:** GET `/api/contacts` for programmatic access
3. **Database Tools:** Use MongoDB Compass or similar tools

### Contact Status Management
Each contact has a status field:
- `new` - Just submitted (default)
- `read` - Viewed by admin
- `responded` - Response sent to client
- `archived` - Completed/closed

Update status via API:
```bash
curl -X PATCH https://your-render-app.onrender.com/api/contacts/CONTACT_ID/status \
  -H "Content-Type: application/json" \
  -d '{"status": "read"}'
```

## Monitoring and Maintenance

### Free Tier Limitations

- **Render:** Service sleeps after 15 minutes of inactivity
- **Netlify:** 100GB bandwidth per month

### Keeping Services Active

For Render free tier, consider:
- Using a service like UptimeRobot to ping your backend periodically
- Upgrading to paid plan for always-on service

## Security Considerations

1. **Environment Variables:**
   - Never commit `.env` files to version control
   - Use strong, unique passwords
   - Regularly rotate API keys and passwords

2. **CORS Configuration:**
   - Only allow your frontend domain
   - Avoid using wildcards in production

3. **Email Security:**
   - Use Gmail App Passwords, not regular passwords
   - Monitor for suspicious email activity

## Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review service logs for error messages
3. Verify all environment variables are set correctly
4. Test each service independently

## Deployment Checklist

- [ ] Backend deployed on Render
- [ ] Frontend deployed on Netlify
- [ ] Environment variables configured
- [ ] CORS settings updated
- [ ] Email functionality tested
- [ ] Contact form working end-to-end
- [ ] Custom domains configured (if applicable)
- [ ] SSL certificates active
- [ ] Performance monitoring set up

---

**Note:** Replace all placeholder URLs and credentials with your actual values throughout this deployment process.
