function checkCashRegister(price, cash, cid) {
    let change = [];
    let currencyDict = {
        PENNY: 0.01,
        NICKEL: 0.05,
        DIME: 0.1,
        QUARTER: 0.25,
        ONE: 1,
        FIVE: 5,
        TEN: 10,
        TWENTY: 20,
    };
    // unpack the cid into till
    let till = cid.splice('');

    // get till total
    let tillTotal = till.reduce((sum, currency) => {
        return sum + currency[1];
    }, 0);

    //round that stuff down
    tillTotal = tillTotal.toFixed(2);

    let statusAndChange = {};
    return change;
}

checkCashRegister(19.5, 20, [
    ['PENNY', 1.01],
    ['NICKEL', 2.05],
    ['DIME', 3.1],
    ['QUARTER', 4.25],
    ['ONE', 90],
    ['FIVE', 55],
    ['TEN', 20],
    ['TWENTY', 60],
    ['ONE HUNDRED', 100],
]);
