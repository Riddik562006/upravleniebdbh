const Family = require('./Family');
const FinOperation = require('./FinOperation');
const InvestPortfolio = require('./InvestPortfolio');
const Vladeletc = require('./Vladeletc');
const BankDetails = require('./BankDetails');
const PassportData = require('./PassportData');

// Установка связей
Family.belongsTo(FinOperation, { foreignKey: 'DoxodRasxodID' });
Family.belongsTo(InvestPortfolio, { foreignKey: 'PortfolioID' });

BankDetails.belongsTo(Vladeletc, { foreignKey: 'VladeletsID' });
Vladeletc.hasOne(PassportData);

module.exports = {
    Family,
    FinOperation,
    InvestPortfolio,
    Vladeletc,
    BankDetails,
    PassportData
};