import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/database.js";
import Contact from "./models/Contact.js";

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "http://127.0.0.1:5173",
            process.env.FRONTEND_URL || "https://your-netlify-app.netlify.app"
        ],
        credentials: true,
    })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Test route
app.get("/", (req, res) => {
    res.json({
        message: "✅ Beryfy Backend Server is running!",
        database: "MongoDB Connected",
        endpoints: {
            contact: "POST /api/contact - Submit contact form",
            contacts: "GET /api/contacts - Get all contacts (admin)",
            health: "GET /api/health - Health check"
        }
    });
});

// Health check route
app.get("/api/health", (req, res) => {
    res.json({
        status: "healthy",
        timestamp: new Date().toISOString(),
        database: "connected"
    });
});

// Contact form route - Save to MongoDB
app.post("/api/contact", async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        // Basic validation
        if (!name || !email || !subject || !message) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // Get client IP and User Agent for tracking
        const ipAddress = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            (req.connection.socket ? req.connection.socket.remoteAddress : null);

        const userAgent = req.headers['user-agent'];

        // Create new contact document
        const newContact = new Contact({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            subject: subject.trim(),
            message: message.trim(),
            ipAddress,
            userAgent
        });

        // Save to MongoDB
        const savedContact = await newContact.save();

        console.log(`✅ New contact form submission saved:`, {
            id: savedContact._id,
            name: savedContact.name,
            email: savedContact.email,
            subject: savedContact.subject,
            timestamp: savedContact.createdAt
        });

        res.status(201).json({
            success: true,
            message: "✅ Thank you! Your message has been received successfully. We'll get back to you soon.",
            contactId: savedContact._id
        });

    } catch (error) {
        console.error("❌ Error saving contact form:", error);

        // Handle validation errors
        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: validationErrors
            });
        }

        // Handle duplicate email (if you want to prevent spam)
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "A message from this email was recently submitted. Please wait before submitting again."
            });
        }

        res.status(500).json({
            success: false,
            message: "Failed to submit your message. Please try again later."
        });
    }
});

// Get all contacts (Admin route - you might want to add authentication)
app.get("/api/contacts", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const status = req.query.status;
        const skip = (page - 1) * limit;

        // Build query
        const query = {};
        if (status) {
            query.status = status;
        }

        // Get contacts with pagination
        const contacts = await Contact.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .select('-__v'); // Exclude version field

        // Get total count for pagination
        const total = await Contact.countDocuments(query);

        res.json({
            success: true,
            data: contacts,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        console.error("❌ Error fetching contacts:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch contacts"
        });
    }
});

// Update contact status (Admin route)
app.patch("/api/contacts/:id/status", async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['new', 'read', 'responded', 'archived'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status value"
            });
        }

        const updatedContact = await Contact.findByIdAndUpdate(
            id,
            { status },
            { new: true, runValidators: true }
        );

        if (!updatedContact) {
            return res.status(404).json({
                success: false,
                message: "Contact not found"
            });
        }

        res.json({
            success: true,
            message: "Contact status updated successfully",
            data: updatedContact
        });

    } catch (error) {
        console.error("❌ Error updating contact status:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update contact status"
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`\n🚀 Beryfy Backend Server is running at http://localhost:${PORT}\n`);
});