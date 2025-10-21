
const addAmtInpt = document.querySelector('.amount-input-exp');
const addAmtInptBtm = document.querySelector('.add-button-exp');
const expenseItems = document.querySelectorAll('.expense-item');
const calcTotalExpense = document.querySelector('.calc-btn-exp');

const addBalInpt = document.querySelector('.amount-input-bal');
const addBalInptBtm = document.querySelector('.add-button-bal');
const calcTotalBalance = document.querySelector('.calc-btn-bal');
const initialBalAdd = document.querySelector('.total-output-bal #total-amount-output-bal');

const largeBalance = document.querySelectorAll('.balance-container h2');
const smallBalance = document.querySelectorAll('.balance-container-small h2');
const initialExpense = document.querySelector('.total-output-exp #total-amount-output-exp');

const calcContainer = document.querySelector('.calc-amt-content');
const calcContainerBal = document.querySelector('.calc-bal-content');
const transHistoryContainer = document.querySelector('.trans-history');
const logList = document.createElement('div');
const logListBal = document.createElement('div');
const logListHistory = document.createElement('div');

const date = new Date().toLocaleDateString();

const clearHistory = document.querySelector(".clearn-history");

calcContainer.appendChild(logList);
calcContainerBal.appendChild(logListBal);
transHistoryContainer.appendChild(logListHistory);


let totalAmt = 0;
let totalBal = 0;
let calcValue = 0;

if (localStorage.getItem('balance')) {
    calcValue = parseFloat(localStorage.getItem('balance'));
    updateBalanceDisplay(); 
}

expenseItems.forEach(item => {
    item.addEventListener('click', () => {
    const name = item.getAttribute('data-name');
    const amount = parseFloat(item.getAttribute('data-amount'));

    totalAmt += amount;

    let transactionSavedExpenseValue = {
        type: 'expense',
        name: name,
        amount: amount,
        date: date
    }

    let savedTransaction = JSON.parse(localStorage.getItem('transactions')) || [];
    savedTransaction.push(transactionSavedExpenseValue);
    localStorage.setItem('transactions', JSON.stringify(savedTransaction));

    const logEntry = document.createElement('p');
    logEntry.textContent = `Added: ${name} - ₱${amount.toFixed(2)}`;
    logEntry.style.fontWeight = 'bold';
    logEntry.style.fontSize = '20px';

    const hr = document.createElement('hr');
    
    logList.appendChild(logEntry);
    logList.appendChild(hr);

    updateBalanceInitial();
    updateHistoryDisplay();
    addToHistoryExpense(name, amount);


     });
    });

addAmtInptBtm.addEventListener('click', () => {
  const value = parseFloat(addAmtInpt.value);
  if (isNaN(value) || value <= 0) return;

  totalAmt += value;

  let transactionSavedExpenseValue = {
      type: 'custom-expense',
      amount: value,
      date: date
  }

    let savedTransaction = JSON.parse(localStorage.getItem('transactions')) || [];
    savedTransaction.push(transactionSavedExpenseValue);
    localStorage.setItem('transactions', JSON.stringify(savedTransaction));
    
  const entry = document.createElement('p');
  entry.textContent = `Entered Amount: ₱${value.toFixed(2)}`;
  entry.style.fontWeight = 'bold';
  entry.style.fontSize = '20px';

  const hr = document.createElement('hr');

  logList.appendChild(entry);
  logList.appendChild(hr);

  updateBalanceInitial();
  updateHistoryDisplay();
  addToHistoryExpenseCustom(value);

  addAmtInpt.value = '';
});

addBalInptBtm.addEventListener('click', () => {
    const valueBal = parseFloat(addBalInpt.value);
    if (isNaN(valueBal) || valueBal <= 0) return;

    totalBal += valueBal;

    let transactionSavedBalanceValue = {
      type: 'balance',
      name: '',
      amount: valueBal,
      date: date
  }
  
    let savedTransaction = JSON.parse(localStorage.getItem('transactions')) || [];
    savedTransaction.push(transactionSavedBalanceValue);
    localStorage.setItem('transactions', JSON.stringify(savedTransaction));

    const entryBal = document.createElement('p');
    entryBal.textContent = `Added Balance: Custom Amount ₱${valueBal.toFixed(2)}`;
    entryBal.style.fontWeight = 'bold';
    entryBal.style.fontSize = '20px';

    logListBal.appendChild(entryBal);
    updateBalancePreview();
    addBalInpt.value = '';

    updateHistoryDisplay();
    addToHistoryBalance(valueBal);
});

calcTotalExpense.addEventListener('click', () => {
    calcValue -= totalAmt;
    updateBalanceDisplay();

    logList.innerHTML = '';
    initialExpense.textContent = `P0.00`;   
    totalAmt = 0;
});

calcTotalBalance.addEventListener('click', () => {
    calcValue += totalBal;
    updateBalanceDisplay();

    logListBal.innerHTML = '';
    initialBalAdd.textContent = `P0.00`;   
    totalBal = 0;
});

// Functions

window.addEventListener('load', () => {
    const savedTransactions = JSON.parse(localStorage.getItem('transactions')) || [];

    savedTransactions.forEach(tx => {
        const entry = document.createElement('p');
        entry.textContent = `Added Expense: ${tx.name} - ₱${tx.amount.toFixed(2)} - ${tx.date}`;
        entry.style.padding = '10px';
        entry.style.borderRadius = '10px';
        entry.style.marginTop = '10px';
        entry.style.textAlign = 'center';

        if (tx.type === 'expense' || tx.type === 'custome-expense'){
            entry.style.backgroundColor = 'rgba(255, 126, 126, 1)';
            entry.textContent = `Added Expense: ${tx.name} - ₱${tx.amount.toFixed(2)} - ${tx.date}`;
        }

        else if (tx.type === 'custom-expense'){
            entry.style.backgroundColor = 'rgba(255, 126, 126, 1)';
            entry.textContent = `Added Expense: ₱${tx.amount.toFixed(2)} - ${tx.date}`;
        }

        else if (tx.type === 'balance') {
            entry.style.backgroundColor = 'rgba(36, 207, 38, 1)';
            entry.textContent = `Added Balance: ₱${tx.amount.toFixed(2)} - ${tx.date}`;
        }

        updateHistoryDisplay();
        logListHistory.appendChild(entry);
    })
});

function showPage(pageId) {
    const page = document.querySelectorAll('.pages');

    page.forEach(p => {
        p.style.display = 'none';
    });

    const target = document.getElementById(pageId);
    target.style.display = 'block';
}

function updateBalanceInitial() {
    initialExpense.textContent = `P${totalAmt.toFixed(2)}`;
}

function updateBalancePreview() {
    initialBalAdd.textContent = `P${totalBal.toFixed(2)}`;
}

function updateBalanceDisplay() {
    localStorage.setItem('balance', calcValue);

    largeBalance.forEach(bal => {
         bal.textContent = `P${calcValue.toFixed(2)}`;
    });

    smallBalance.forEach(bal => {
         bal.textContent = `P${calcValue.toFixed(2)}`;
    });
}

function updateHistoryDisplay() {
    const tempHistoryText = document.querySelector('.no-trans');

    tempHistoryText.textContent = '';
    transHistoryContainer.style.display = 'flex';
}

function addToHistoryExpense(name, amount) {
    const entryHistoryExpense = document.createElement('p');

    entryHistoryExpense.textContent = `Added Expense: ${name} - ₱${amount.toFixed(2)} - ${date}`;
    entryHistoryExpense.style.backgroundColor = 'rgba(255, 126, 126, 1)';
    entryHistoryExpense.style.padding = '10px';
    entryHistoryExpense.style.borderRadius = '10px';
    entryHistoryExpense.style.marginTop = '10px';
    entryHistoryExpense.style.textAlign = 'center';

    logListHistory.appendChild(entryHistoryExpense);
}

function addToHistoryExpenseCustom(value) {
    const entryHistoryExpenseCustom = document.createElement('p');

    entryHistoryExpenseCustom.textContent = `Added Expense: ₱${value.toFixed(2)} - ${date}`;
    entryHistoryExpenseCustom.style.backgroundColor = 'rgba(255, 126, 126, 1)';
    entryHistoryExpenseCustom.style.padding = '10px';
    entryHistoryExpenseCustom.style.borderRadius = '10px';
    entryHistoryExpenseCustom.style.marginTop = '10px';
    entryHistoryExpenseCustom.style.textAlign = 'center';

    logListHistory.appendChild(entryHistoryExpenseCustom);
}

function addToHistoryBalance(valueBal) {
    const entryHistoryBalance = document.createElement('p');

    entryHistoryBalance.textContent = `Added Balance: ₱${valueBal.toFixed(2)} - ${date}`;
    entryHistoryBalance.style.backgroundColor = 'rgba(36, 207, 38, 1)';
    entryHistoryBalance.style.padding = '10px';
    entryHistoryBalance.style.borderRadius = '10px';
    entryHistoryBalance.style.marginTop = '10px';
    entryHistoryBalance.style.textAlign = 'center';

    logListHistory.appendChild(entryHistoryBalance);
}

function clearTransactionHistory(){
    const tempHistoryText = document.querySelector('.no-trans');

    localStorage.removeItem('transactions');
    tempHistoryText.textContent = 'No Transactions Yet!';
    transHistoryContainer.style.display = 'none';
}