function checkCashRegister(price, cash, cid) {
    let registerResponse = {
        status: '',
        change: [],
    };
    let changeDue = 0;

    // unpack the cid into till
    let till = [];
    cid.forEach(item => {
        till.push([item[0], item[1]]);
    });

    // If while making change we realize we don't have any combination of currency values to make change revert the till back to the original state;
    let tillBackup = [];
    till.forEach(item => {
        tillBackup.push([item[0], item[1]]);
    });

    // calculate till total
    let tillTotal = till.reduce((sum, currency) => {
        //round down and convert to float
        return parseFloat((sum + currency[1]).toFixed(2));
    }, 0);
    //calculate changeDue
    changeDue = cash - price;

    //scenario: if till in drawer is less than change due return {status: "INSUFFICIENT_FUNDS", change: []}

    if (changeDue > tillTotal) {
        registerResponse.status = 'INSUFFICIENT_FUNDS';

        //scenario: Return {status: "CLOSED", change: [...]} with cash-in-drawer as the value for the key change if it is equal to the change due.
    } else if (changeDue == tillTotal) {
        registerResponse.status = 'CLOSED';
    } else {
        registerResponse.status = 'OPEN';
    }

    //Actual function to make change
    function makeChange(totalDue, tillArray) {
        let remainingDue = totalDue;
        let changeToReturn = [];
        let currencyDict = {
            PENNY: 0.01,
            NICKEL: 0.05,
            DIME: 0.1,
            QUARTER: 0.25,
            ONE: 1,
            FIVE: 5,
            TEN: 10,
            TWENTY: 20,
            'ONE HUNDRED': 100,
        };

        // reverse the order of the till array to cycle from largest currency to smallest
        tillArray = tillArray.reverse();
        changeToReturn = [];
        tillArray.forEach((currency) => {
            let runningCurrencyTotal = 0;
            let canMakeChange = true;
            while (canMakeChange) {
                //all this must be true to use the current currency to make change:
                //1.the remaining Due must be >0
                //2.the total in the till for the current currency must be able to be incremented down by the currency decrement
                //3. the remainingDue - the current curency decrement must be >=  0

                if (
                    remainingDue > 0 &&
                    currency[1] - currencyDict[currency[0]] >= 0 &&
                    remainingDue - currencyDict[currency[0]] >= 0
                ) {
                    //reduce currency by proper increment
                    currency[1] -= currencyDict[currency[0]];
                    //reduce remaining due by decrement amount
                    remainingDue -= currencyDict[currency[0]];
                    //fix the penny off issue by always making remaining due be two decimal places
                    remainingDue = parseFloat(remainingDue.toFixed(2));
                    // add that increment to the running total
                    runningCurrencyTotal += currencyDict[currency[0]];
                } else {
                    // if none of the above are true exit the while loop
                    canMakeChange = false;
                }
            }

            //to avoid adding currencies with a zero value only push those with a running total greater than 0
            if (!runningCurrencyTotal <= 0) {
                let curencyArray = [currency[0], runningCurrencyTotal];
                changeToReturn.push(curencyArray);
            }
        });

        //final check for insufficient funds (if after attempting to make change we still have a remaining due)
        if (!remainingDue == 0) {
            registerResponse.status = 'INSUFFICIENT_FUNDS';
            changeToReturn = [];
            //reset till to original state
            till = tillBackup.slice("");
        }

        return changeToReturn;
    }
    // based on the response set the easy change values or run the makeChange Function
    switch (registerResponse.status) {
        case 'INSUFFICIENT_FUNDS':
            registerResponse.change = [];
            break;
        case 'CLOSED':
            registerResponse.change = till;
            break;
        case 'OPEN':
            registerResponse.change = makeChange(changeDue, till);
            break;
        default:
            break;
    }

    //check object details
    console.log("Register Status: ", registerResponse.status);
    console.log("Change Due: ", registerResponse.change);
    return registerResponse;
}

checkCashRegister(19.5, 20, [["PENNY", 0.01], ["NICKEL", 0], ["DIME", 0], ["QUARTER", 0], ["ONE", 0], ["FIVE", 0], ["TEN", 0], ["TWENTY", 0], ["ONE HUNDRED", 0]]);
