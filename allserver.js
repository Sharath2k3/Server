const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Replace '<password>' with your actual password
const password = 'QWlrFdE7emq77XcL';
const uri = `mongodb+srv://stsharath13:${password}@cluster0.u1n1dse.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Function to check the MongoDB connection
async function checkMongoDBConnection() {
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    console.log('Connected to MongoDB');

  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
  } finally {
    // Close the MongoDB connection
    await client.close();
  }
}

// Call the function to check the connection
checkMongoDBConnection();

const UserSchema = {
  username: String,
  password: String
};

const BlogSchema = {
  title: String,
  content: String
};

const ContactSchema = {
  name: String,
  email: String,
  from: String,
  to: String,
  message: String
};

// Login route
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    // Specify the database and collection
    const database = client.db('Thewebsite');
    const collection = database.collection('users');

    // Find user in the collection
    const user = await collection.findOne({ username });

    if (user) {
      if (user.password === password) {
        res.json("Login Successful");
      } else {
        res.json("Password Incorrect");
      }
    } else {
      res.json("Login Failed");
    }

  } catch (error) {
    console.error('Error during MongoDB operation:', error.message);
    res.status(500).json("Error during MongoDB operation");
  } finally {
    // Close the MongoDB connection
    await client.close();
  }
});

// Add blog post route
app.post("/add-blog", async (req, res) => {
  const { title, content } = req.body;

  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    // Specify the database and collection
    const database = client.db('Thewebsite');
    const collection = database.collection('blogs');

    // Insert new blog post
    await collection.insertOne({ title, content });

    res.json("Blog Post Created Successfully");

  } catch (error) {
    console.error('Error during MongoDB operation:', error.message);
    res.status(500).json("Error during MongoDB operation");
  } finally {
    // Close the MongoDB connection
    await client.close();
  }
});

// Remove blog post route
app.post("/remove-blog", async (req, res) => {
  const { title } = req.body;

  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    // Specify the database and collection
    const database = client.db('Thewebsite');
    const collection = database.collection('blogs');

    // Remove blog post
    await collection.findOneAndDelete({ title });

    res.json("Blog Removed Successfully");

  } catch (error) {
    console.error('Error during MongoDB operation:', error.message);
    res.status(500).json("Error during MongoDB operation");
  } finally {
    // Close the MongoDB connection
    await client.close();
  }
});

// Get all blogs route
app.get("/get-blogs", async (req, res) => {
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    // Specify the database and collection
    const database = client.db('Thewebsite');
    const collection = database.collection('blogs');

    // Fetch all blog posts
    const blogs = await collection.find({}, 'title content').toArray();

    res.json(blogs);

  } catch (error) {
    console.error('Error during MongoDB operation:', error.message);
    res.status(500).json("Error during MongoDB operation");
  } finally {
    // Close the MongoDB connection
    await client.close();
  }
});

// Contact route
app.post("/contact", async (req, res) => {
  const { name, email, from, to, message } = req.body;

  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    // Specify the database and collection
    const database = client.db('Thewebsite');
    const collection = database.collection('details');

    // Insert new contact details
    await collection.insertOne({ name, email, from, to, message });

    const recipientEmail = 'stsharath13@gmail.com';
    const emailSubject = 'New Contact Details';
    const emailMessage = `Name: ${name}\nEmail: ${email}\nFrom: ${from}\nTo: ${to}\nMessage: ${message}`;

    // Send email notification
    // (You need to implement the sendEmail function)

    res.json("Contact Details Saved Successfully");

  } catch (error) {
    console.error('Error during MongoDB operation:', error.message);
    res.status(500).json("Error during MongoDB operation");
  } finally {
    // Close the MongoDB connection
    await client.close();
  }
});

// Start the server
app.listen(3001, () => {
  console.log("Server is Running");
});
