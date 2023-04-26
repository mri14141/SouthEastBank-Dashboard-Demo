/* Selectors */
const depositAmount = document.querySelector('.deposit-amount');
const withdrawAmount = document.querySelector('.withdraw-amount');
const currentAmount = document.querySelector('.current-amount');
const historyUl = document.querySelector('.history ul');

const submitDeposit = document.querySelector('.deposit-form');
const submitWithdraw = document.querySelector('.withdraw-form');

const historyFilter = document.querySelector('.history-filter');

/* Set Data To Local Storage */
function setDataToLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

/* Dummy Transactions */
const dummyTrans = [
  {
    trxid: randomTrxId(),
    text: 'Deposit',
    amount: 50000,
    currentTime: new Date().toLocaleString(),
  },
  {
    trxid: randomTrxId(),
    text: 'Withdraw',
    amount: -5000,
    currentTime: new Date().toLocaleString(),
  },
];

/* Transactions */
const transactions =
  JSON.parse(localStorage.getItem('transactions')) || dummyTrans;

/* Random TrxId */
function randomTrxId() {
  return `TrxID${Math.round(Math.random() * 10000000000)}`;
}

/* Number With Commas Function */
function numberWithCommas(num) {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}

/* Deposit Money */
function depositMoney(e) {
  e.preventDefault();

  const value = +this.querySelector('input').value.trim();

  if (!value) {
    alert('Please set a amount!');
  } else if (value < 0) {
    alert('Negative number is not allowed!');
  } else {
    const transaction = {
      trxid: randomTrxId(),
      text: 'Deposit',
      amount: value,
      currentTime: new Date().toLocaleString(),
    };
    transactions.unshift(transaction);
    // Update DOM
    displayHistory(transactions);
    updateMoney(transactions);
    // Set Data To Local Storage
    setDataToLocalStorage();
  }
  // Reset Input
  this.reset();
}

/* Withdraw Money */
function withdrawMoney(e) {
  e.preventDefault();

  const value = +this.querySelector('input').value.trim();

  const currentMoney = transactions
    .map((transaction) => transaction.amount)
    .reduce((total, amount) => total + amount);

  if (!value) {
    alert('Please set a amount!');
  } else if (value < 0) {
    alert('Negative number is not allowed!');
  } else if (value > currentMoney) {
    alert('You do not have enough money to withdraw!');
  } else {
    const transaction = {
      trxid: randomTrxId(),
      text: 'Withdraw',
      amount: -value,
      currentTime: new Date().toLocaleString(),
    };
    transactions.unshift(transaction);
    // Update DOM
    displayHistory(transactions);
    updateMoney(transactions);
    // Set Data To Local Storage
    setDataToLocalStorage();
  }
  // Reset Input
  this.reset();
}

/* Display History */
function displayHistory(transactions) {
  historyUl.innerHTML = transactions
    .map((transaction, index) => {
      return /* html */ `
        <li data-index=${index} class="history-item text-white p-2 my-3 rounded ${
        transaction.amount < 0 ? 'minus' : 'plus'
      }">
          <span>${transaction.text}</span>
          <span class="float-end">${numberWithCommas(
            Number(Math.abs(transaction.amount)).toFixed(2)
          )} TK</span>
          <span class="d-block w-100 trxid">${transaction.trxid}</span>
          <span class="d-block w-100 transaction-time ">Time: ${
            transaction.currentTime
          }</span>
        </li>
    `;
    })
    .join('');
}

/* Update Money */
function updateMoney(transactions) {
  // All Amounts
  const amounts = transactions.map((transaction) => transaction.amount);

  // Deposit Money
  const depositMoney = amounts
    .filter((amount) => amount > 0)
    .reduce((total, amount) => total + amount);
  depositAmount.innerHTML = `${numberWithCommas(depositMoney.toFixed(2))} TK`;

  // Withdraw Money
  const withdrawMoney = amounts
    .filter((amount) => amount < 0)
    .reduce((total, amount) => total + amount);
  withdrawAmount.innerHTML = `${numberWithCommas(
    Math.abs(withdrawMoney).toFixed(2)
  )} TK`;

  // Current Money
  const currentMoney = amounts.reduce((total, amount) => total + amount);
  currentAmount.innerHTML = `${numberWithCommas(currentMoney.toFixed(2))} TK`;

  // Set Data To Local Storage
  setDataToLocalStorage();
}

/* Init */
function init() {
  displayHistory(transactions);
  updateMoney(transactions);
  // Set Data To Local Storage
  setDataToLocalStorage();
}

init();

/* Deposit Money */
submitDeposit.addEventListener('submit', depositMoney);

/* Withdraw Money */
submitWithdraw.addEventListener('submit', withdrawMoney);

/* History Filter */
historyFilter.addEventListener('keyup', searchedTransactions);

function searchedTransactions(e) {
  let filterText = historyFilter.value.trim().toLowerCase();
  let items = historyUl.getElementsByTagName('li');
  Array.from(items).forEach(function (item) {
    let itemText = item.textContent.toLowerCase();
    if (itemText.indexOf(filterText) != -1) {
      item.style = 'display: block !important';
    } else {
      item.style = 'display: none !important';
    }
  });
}
