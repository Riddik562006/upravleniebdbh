const express = require('express');
const path = require('path');
const sequelize = require('./config/database');
const { Family, FinOperation, InvestPortfolio, Vladeletc, BankDetails, PassportData } = require('./models');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Маршруты
app.get('/', async (req, res) => {
    try {
        const operations = await FinOperation.findAll();
        const portfolios = await InvestPortfolio.findAll();
        res.render('index', { operations, portfolios });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Маршруты для Family
app.get('/add-family', async (req, res) => {
    const operations = await FinOperation.findAll();
    const portfolios = await InvestPortfolio.findAll();
    res.render('add-family', { operations, portfolios });
});

app.post('/add-family', async (req, res) => {
    try {
        const { DoxodRasxodID, PortfolioID } = req.body;
        await Family.create({ DoxodRasxodID, PortfolioID });
        res.redirect('/');
    } catch (error) {
        console.error('Error adding family:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Маршруты для FinOperation
app.get('/add-operation', async (req, res) => {
    res.render('add-operation');
});

app.post('/add-operation', async (req, res) => {
    try {
        const { Date, Summa, Category } = req.body;
        await FinOperation.create({ Date, Summa, Category });
        res.redirect('/');
    } catch (error) {
        console.error('Error adding operation:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Маршруты для InvestPortfolio
app.get('/add-portfolio', async (req, res) => {
    res.render('add-portfolio');
});

app.post('/add-portfolio', async (req, res) => {
    try {
        const { Nazvanie, KolichestvoAkciy, Stoimost } = req.body;
        await InvestPortfolio.create({ Nazvanie, KolichestvoAkciy, Stoimost });
        res.redirect('/');
    } catch (error) {
        console.error('Error adding portfolio:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Маршруты для удаления
app.post('/delete-operation/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await FinOperation.destroy({ where: { FinOperationID: id } });
        res.redirect('/');
    } catch (error) {
        console.error('Error deleting operation:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/delete-portfolio/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await InvestPortfolio.destroy({ where: { InvestPortfolioID: id } });
        res.redirect('/');
    } catch (error) {
        console.error('Error deleting portfolio:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Синхронизация базы данных и запуск сервера
sequelize.sync({ force: true }).then(async () => {
    console.log('Database synchronized');
    
    // Добавление тестовых данных
    try {
        // Создаем финансовые операции
        const operation1 = await FinOperation.create({
            Date: new Date(),
            Summa: 1000.00,
            Category: 'Доход'
        });

        const operation2 = await FinOperation.create({
            Date: new Date(),
            Summa: -500.00,
            Category: 'Расход'
        });

        // Создаем инвестиционные портфели
        const portfolio1 = await InvestPortfolio.create({
            Nazvanie: 'Консервативный',
            KolichestvoAkciy: 100,
            Stoimost: 10000.00
        });

        const portfolio2 = await InvestPortfolio.create({
            Nazvanie: 'Рискованный',
            KolichestvoAkciy: 50,
            Stoimost: 5000.00
        });

        console.log('Test data created successfully');
    } catch (error) {
        console.error('Error creating test data:', error);
    }

    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
});