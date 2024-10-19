const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json()); // To parse JSON body

// MongoDB Connection

mongoose.connect('mongodb://localhost:27017/login_db')
.then(() => console.log('Connected to the database.'))
.catch(err => console.error('Database connection failed:', err));

// User Schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

// Client Schema
const clientSchema = new mongoose.Schema({
    name: String,
    address: String,
    phone: String,
});

// Part Schema
const partSchema = new mongoose.Schema({
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },
    part_name: String,
    part_description: String,
});

// Property Schema
const propertySchema = new mongoose.Schema({
    partId: { type: mongoose.Schema.Types.ObjectId, ref: 'Part' },
    property_name: String,
    property_value: String,
});

// Models
const User = mongoose.model('Users', userSchema);
const Client = mongoose.model('Client', clientSchema);
const Part = mongoose.model('Part', partSchema);
const Property = mongoose.model('part_properties', propertySchema);

// Register route
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = new User({ username, password: hashedPassword });

    try {
        await user.save();
        res.json({ message: 'Registration successful' });
    } catch (err) {
        res.status(500).json({ message: 'Registration failed', error: err.message });
    }
});

// Login route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Incorrect username or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Incorrect username or password' });
        }

        res.json({ message: 'Login successful' });
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
});

// Change Password Endpoint
app.post('/change-password', async (req, res) => {
    const { username, newPassword } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(newPassword, user.password);
        if (isMatch) {
            return res.status(400).json({ message: 'Password already exists' });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
        res.json({ message: 'Password changed successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
});

// Add a new client along with parts and properties
app.post('/clients', async (req, res) => {
    const { client_name, address, phone, part_name, part_description, property_name, property_value } = req.body;

    try {
        // Insert into client
        const client = new Client({ name: client_name, address, phone });
        const savedClient = await client.save();

        // Insert into part
        const part = new Part({ clientId: savedClient._id, part_name, part_description });
        const savedPart = await part.save();

        // Insert into properties
        const property = new Property({ partId: savedPart._id, property_name, property_value });
        await property.save();

        res.json({ message: 'Data inserted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error inserting data', error: err.message });
    }
});

// Fetch All Clients Endpoint
app.get('/clients', async (req, res) => {
    try {
        const clients = await Client.find();
        res.json(clients);
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
});

app.get('/parts', async (req, res) => {
    try {
        console.log(Part);
        const parts = await Part.find();
        res.json(parts);
        
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
});
// Fetch Parts Data by Client ID Endpoint
app.get('/clients/:clientId/parts', async (req, res) => {
    const { clientId } = req.params;

    try {
        const parts = await Part.find({ clientId });
        res.json(parts);
        
        
       
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }

});

app.get('/part_properties', async (req, res) => {
    try {
        
        const part_properties = await Property.find();
        res.json(part_properties);
        
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
});

// Fetch Properties Data by Part ID Endpoint
app.get('/parts/:partId/properties', async (req, res) => {
    const { partId } = req.params;

    try {
        const properties = await Property.find({ partId });
        res.json(properties);
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
});

// Update Client and Parts
 app.put('/clients/:clientId/parts/:partId', async (req, res) => {
    const { clientId, partId } = req.params;

    //const clientObjectId = new mongoose.Types.ObjectId(clientId);
        //const partObjectId = new mongoose.Types.ObjectId(partId);

    
    //const clientId=1;
    //const partId=1;
    const { client_name, address, phone, part_name, part_description, property_name, property_value } = req.body;

    try {
        console.log(clientId);
        console.log(partId);
        const client = await Client.findOne({ client_id: clientId });
        const part = await Part.findOne({ part_id: partId });
        const property = await Property.findOne({property_name : property_name });
        console.log(part);
        console.log(client);
        console.log(client._id);
        // Update client data
        const newclientid = client._id;

        console.log(newclientid);
        const newpartid = part._id;

        const newproperty = property._id;

        await Client.updateOne({ _id: newclientid },  { $set:{ name: client_name, address, phone }});
        
        // Update part data
        await Part.updateOne({ _id: newpartid },  { $set:{ part_name, part_description }});

        // Update properties if needed
        await Property.updateOne({ _id: newproperty },  { $set:{ property_name, property_value }});

        res.json({ message: 'Data updated successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error updating data', error: err.message });
    }
});




// Delete Client by ID Endpoint
app.delete('/clients/:clientId', async (req, res) => {
    const { clientId } = req.params;

    try {
        // First, delete the associated properties
        await Property.deleteMany({ partId: { $in: await Part.find({ clientId }).select('_id') } });

        // Then, delete the associated parts
        await Part.deleteMany({ clientId });

        // Finally, delete the client
        await Client.deleteOne({ _id: clientId });

        res.json({ message: 'Client deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting client', error: err.message });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
}); 