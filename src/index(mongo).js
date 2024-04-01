const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const collection = require("./config.js");
const swaggerUi = require('swagger-ui-express');
const specs = require('./swagger.json');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static('public'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.set('view engine', 'ejs');

const JWT_SECRET = 'This_is_not_crackable!@#$%^&*(';


app.get("/", (req, res) => {
    res.render('login');
});

app.get("/categories", authenticateToken, async (req, res) => {
    try {
        const categories = await extractUniqueCategories();
        console.log(categories); // Print categories to the console
        res.render('categories', { categories });
    } catch (error) {
        console.error('Error fetching categories:', error.message);
        res.status(500).send('Error fetching categories');
    }
});

app.get("/signup", (req, res) => {
    res.render("signup");
});

app.post("/signup", async (req, res) => {
    const data = {
        name: req.body.username,
        password: req.body.password
    };

    const existingUser = await collection.findOne({ name: data.name });

    if (existingUser) {
        res.send("User already exists. Please choose a different username.");
    } else {
        const saltround = 10;
        const hashedPassword = await bcrypt.hash(data.password, saltround);
        data.password = hashedPassword;
        await collection.insertMany(data);
        console.log("User registered successfully:", data);
        res.redirect('/');
    }
});

app.post("/login", async (req, res) => {
    try {
        const user = await collection.findOne({ name: req.body.username });

        if (!user) {
            res.send("Username not found");
            return;
        }

        const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isPasswordMatch) {
            res.send("Wrong password");
            return;
        }

        const accessToken = generateAccessToken({ username: user.name });

        res.cookie('accessToken', accessToken, { httpOnly: true });

        res.redirect("/categories");
    } catch (error) {
        console.error('Error logging in:', error.message);
        res.send("Invalid login details");
    }
});

app.post("/applyFilters", authenticateToken, async (req, res) => {
    const { category, limit } = req.body;
    console.log("Category:", category);
    console.log("Result Limit:", limit);

    try {
        const filteredData = await fetchFilteredData(category, limit);
        console.log(filteredData)
        res.json(filteredData);
    } catch (error) {
        console.error('Error applying filters:', error.message);
        res.status(500).send('Error applying filters');
    }
});


app.get('/authenticated', authenticateToken,(req, res) => {
    res.render('authenticated');
});

async function fetchFilteredData(category, limit) {
    try {
        const response = await axios.get('https://api.publicapis.org/entries', {
            params: {
                category: category,
                https: true
            }
        });

        let filteredData = response.data.entries.filter(entry => entry.Category.toLowerCase() === category.toLowerCase());

        if (!isNaN(limit) && limit > 0) {
            filteredData = filteredData.slice(0, limit);
        }

        return filteredData;
    } catch (error) {
        throw error;
    }
}
const axios = require('axios');

async function fetchCategoriesData() {
    try {
        const response = await axios.get('https://api.publicapis.org/entries');
        const categoriesData = response.data;
        return categoriesData;
    } catch (error) {
        console.error('Error fetching categories data:', error.message);
        throw error;
    }
}

async function extractUniqueCategories() {
    try {
        const categoriesData = await fetchCategoriesData();
        const uniqueCategories = {};

        categoriesData.entries.forEach(entry => {
            const category = entry.Category;
            uniqueCategories[category] = true;
        });

        const categoriesList = Object.keys(uniqueCategories);
        return categoriesList;
    } catch (error) {
        throw error;
    }
}


function generateAccessToken(user) {
    return jwt.sign(user, JWT_SECRET, { expiresIn: '1m' });
}

function authenticateToken(req, res, next) {
    const token = req.cookies.accessToken;

    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

const {Web3} = require('web3');
const web3 = new Web3('https://goerli.infura.io/v3/25f99dbc8c49498bbb654aaf1c980273');

async function getBalance(address) {
    try {
        const balance = await web3.eth.getBalance(address);
        return web3.utils.fromWei(balance, 'ether');
    } catch (error) {
        console.error('Error fetching balance:', error);
        throw error;
    }
}

const address = '0xc94770007dda54cF92009BFF0dE90c06F603a09f';
getBalance(address)
    .then(balance => {
        console.log('Balance:', balance);
    })
    .catch(error => {
        console.error('Error:', error);
    });

app.get('/ethereum-balance', authenticateToken, async (req, res) => {
    try {
        const address = '0xc94770007dda54cF92009BFF0dE90c06F603a09f'; 
        const balance = await getBalance(address);
        res.send(balance.toString()); 
    } catch (error) {
        console.error('Error fetching Ethereum balance:', error);
        res.status(500).send('Error fetching Ethereum balance');
    }
});

const port = 5000;
app.listen(process.env.PORT || port, () => {
    console.log(`Server is running on Port : ${port}`);
});

