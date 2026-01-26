let transactions = [];
let currentFilter = 'all';

const expenseList = document.getElementById('expenseList');
const totalIncomeEl = document.getElementById('totalIncome');
const totalExpenseEl = document.getElementById('totalExpense');
const balanceEl = document.getElementById('balance');
const form = document.getElementById('expenseForm');
const typeSelect = document.getElementById('type');
const categorySelect = document.getElementById('category');
const amountInput = document.getElementById('amount');
const descriptionInput = document.getElementById('description');


function initApp() {
  loadFromLocalStorage();
  eventListener();
  render();
  summary();
}

function render() {
  // Kosongkan List
  expenseList.innerHTML = '';
  
  const dataShow = applyFilter();
  
  // Bertahu jika belum ada data
  if (dataShow.length === 0) {
    expenseList.innerHTML = `<tr><td colspan="5" class="text-center">Belum ada transaksi</td></tr>`
  }
  
  // Buat elemen html, tentukan typenya lalu isi elemen html dengan data
  dataShow.forEach(transaction => {
    const row = document.createElement('tr');
    
    const amountClass = transaction.type === 'income' ? 'income' : 'expense';
    const amountPrefix = transaction.type === 'income' ? '+' : '-';
    
    row.innerHTML = `
      <td>${transaction.date}</td>
      <td>${transaction.category}</td>
      <td>${transaction.description}</td>
      <td class="${amountClass}">${amountPrefix}Rp${transaction.amount.toLocaleString()}</td>
      <td>
        <button class="delete-btn" data-id="${transaction.id}">
          Hapus
        </button>
      </td>`;
      
      expenseList.appendChild(row);
  });
  
  // event untuk tombol hapus di list
  document.querySelectorAll('.delete-btn').forEach(button => {
    button.addEventListener('click', function() {
      const id = parseInt(this.getAttribute('data-id'));
      deleteExpense(id);
    });
  });
}

function applyFilter() {
  if (currentFilter === 'all') {
    return transactions;
  }
  return transactions.filter(t => t.type === currentFilter);
}

function renderFilter(filter) {
  currentFilter = filter;
  
  document.querySelectorAll('.filter-btn').forEach(btn => {
    if (btn.dataset.filter === filter) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
  render();
}

function summary() {
  const result = transactions.reduce(
    (acc, t) => {
      if (t.type === 'income') {
        acc.income += t.amount;
      } else if (t.type === 'expense') {
        acc.expense += t.amount;
      }
      return acc;
    },
    { income: 0, expense: 0 }
  );

  const balance = result.income - result.expense;
  
  totalIncomeEl.textContent = `Rp${result.income.toLocaleString()}`;
  totalExpenseEl.textContent = `Rp${result.expense.toLocaleString()}`;
  balanceEl.textContent = `Rp${balance.toLocaleString()}`;
}

function addExpense(e) {
  e.preventDefault();
  const expenseData = {
    id: Date.now(),
    amount: parseFloat(amountInput.value),
    category: categorySelect.value,
    type: typeSelect.value,
    description: descriptionInput.value,
    date: new Date().toLocaleDateString('id-ID')
  };

  if (!expenseData.amount || expenseData.amount <= 0) {
    alert('Masukkan jumlah yang valid!')
    return;
  }
  
  transactions.push(expenseData);
  
  render();
  summary();
  saveToLocalStorage();
  
  form.reset();
  amountInput.focus();
}

function deleteExpense(id) {
  transactions = transactions.filter(transaction => transaction.id !== id);
  
  render();
  summary();
  saveToLocalStorage();
}

function saveToLocalStorage() {
  localStorage.setItem('Data', JSON.stringify(transactions));
}

function loadFromLocalStorage() {
  const saved = localStorage.getItem('Data');
  if (saved) {
    transactions = JSON.parse(saved);
  }
}

function eventListener() {
  form.addEventListener('submit', addExpense);
  
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const filter = this.dataset.filter;
      renderFilter(filter);
    });
  });
}

document.addEventListener('DOMContentLoaded', initApp);