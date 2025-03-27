// assets/js/transaction.js
async function simpanTransaksi() {
    const data = {
      studentId: document.getElementById('studentId').value,
      studentName: document.getElementById('studentName').value,
      amount: document.getElementById('amount').value,
      paymentMethod: document.getElementById('paymentMethod').value
    };
  
    try {
      await fetch(
        'https://script.google.com/macros/s/AKfycbz4Unnmz0lqoDQYO34so4diAo97V0irlhoYSgfDbr2QFwc4gb0XzCRJJ62gsFyy1i89/exec',
        {
          method: 'POST',
          mode: 'no-cors',
          body: JSON.stringify(data)
        }
      );
      
      alert('Data tersimpan!');
      document.getElementById('transactionForm').reset();
    } catch (error) {
      alert('Error: Cek console');
      console.error(error);
    }
  }
  
  // Event listener
  document.getElementById('transactionForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    simpanTransaksi();
  });
  // Fungsi tambah jenis pembayaran
document.getElementById('addPaymentType').addEventListener('click', () => {
    const container = document.getElementById('paymentTypesContainer');
    const newItem = document.createElement('div');
    newItem.className = 'payment-type-item';
    newItem.innerHTML = `
      <select name="paymentType" required>
        <option value="">Pilih jenis...</option>
        <option value="SPP">SPP</option>
        <option value="Uang Bangunan">Uang Bangunan</option>
      </select>
      <input type="number" name="paymentAmount" placeholder="Jumlah (Rp)" required>
      <button type="button" class="remove-payment-btn" onclick="this.parentElement.remove()">
        <i class="fas fa-times"></i>
      </button>
    `;
    container.appendChild(newItem);
  });