let transactions = [];
let currentFilter = 'all';
let currentDateFilter = {
  start: null,
  end: null
};
// let dateRange = {
//   start: null,
//   end: null
// };
// let currentYear = new Date().getFullYear();
// let currentMonth = new Date().getMonth();

const categories = {
  income: ['Gaji', 'Bonus', 'Transfer', 'Investasi', 'Komisi'],
  expense: ['Makan', 'Transportasi', 'Tagihan', 'Hiburan', 'lainnya']
};

const expenseList = document.getElementById('expenseList');
const totalIncomeEl = document.getElementById('totalIncome');
const totalExpenseEl = document.getElementById('totalExpense');
const balanceEl = document.getElementById('balance');
const form = document.getElementById('expenseForm');
const typeSelect = document.getElementById('type');
const categorySelect = document.getElementById('category');
const amountInput = document.getElementById('amount');
const descriptionInput = document.getElementById('description');
const dateInput = document.getElementById('date');


function initApp() {
  loadFromLocalStorage();
  eventListener();
  renderCategoryOption(typeSelect.value);
  render();
  summary();
  
  const datePicker = flatpickr('#dateRange', {
    mode: 'range',
    dateFormat: 'Y-m-d',
    maxRange: 31,
    onChange: (dates) => {
      if (dates.length === 2) {
        currentDateFilter = {
          start: dates[0].toISOString().slice(0, 10),
          end: dates[1].toISOString().slice(0, 10)
        };
        render();
      }
    }
  });
}

//===== Data Visualization =====
function render() {
  // Kosongkan List
  expenseList.innerHTML = '';
  
  const dataShow = applyFilter();
  
  // Bertahu jika belum ada data
  if (dataShow.length === 0) {
    expenseList.innerHTML = `<tr><td colspan="5" class="text-center">Belum ada transaksi</td></tr>`
    return;
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
  
  balanceEl.className = balance >= 0 ? 'balance-positive' : 'balance-negative';
}

// function summary() {
//   const result = {income: 0, expense: 0}
  
//   transactions.forEach(t => {
//     if (t.type === 'income') {
//       result.income += t.amount;
//     } else if (t.type === 'expense') {
//       result.expense += t.amount;
//     }
//   });
  
//   const balance = result.income - result.expense;
  
//   totalIncomeEl.textContent = `Rp${result.income.toLocaleString()}`;
//   totalExpenseEl.textContent = `Rp${result.expense.toLocaleString()}`;
//   balanceEl.textContent = `Rp${balance.toLocaleString()}`;
  
//   balanceEl.className = balance >= 0 ? 'balance-positive' : 'balance-negative';
// }

function renderCategoryOption(type) {
  categorySelect.innerHTML = '';
  
  categories[type].forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    categorySelect.appendChild(option);
  });
}

//===== Data Manipulation =====
function applyFilter() {
  let data = transactions;
  if (currentFilter && currentFilter !== 'all') {
    data = data.filter(t => t.type === currentFilter);
  }
  if (currentDateFilter?.start && currentDateFilter?.end) {
    data = data.filter(t =>
      t.date >= currentDateFilter.start &&
      t.date <= currentDateFilter.end
    );
  }
  return data;
}

function addExpense(e) {
  e.preventDefault();
  const expenseData = {
    id: Date.now(),
    amount: parseFloat(amountInput.value),
    category: categorySelect.value,
    type: typeSelect.value,
    description: descriptionInput.value,
    date: dateInput.value || new Date().toISOString().slice(0, 10)
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

//===== Data Saving =====
function saveToLocalStorage() {
  localStorage.setItem('Data', JSON.stringify(transactions));
}

function loadFromLocalStorage() {
  const saved = localStorage.getItem('Data');
  if (saved) {
    transactions = JSON.parse(saved);
  }
}

//===== Even Listener =====
function eventListener() {
  form.addEventListener('submit', addExpense);
  
  // Filter all, income, expense
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const filter = this.dataset.filter;
      renderFilter(filter);
    });
  });
  
  // Input tanggal
  typeSelect.addEventListener('change', function () {
    renderCategoryOption(this.value);
  });
  
  // Riset tanggal filter
  document.getElementById('resetDateFilter')
    .addEventListener('click', () => {
      currentDateFilter = { start: null, end: null };
      render();
      datePicker.clear();
    });
}

document.addEventListener('DOMContentLoaded', initApp);