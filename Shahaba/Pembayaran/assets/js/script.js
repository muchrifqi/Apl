    //PEMBAYARAN
    function filterStudents() {
      const jenjangFilter = document.getElementById('filterJenjang').value;
      const input = document.getElementById('nama');
      
      // Trigger event input untuk refresh hasil pencarian
      if (input.value.length > 1) {
          const event = new Event('input');
          input.dispatchEvent(event);
      }
  }
  
  // Modifikasi fungsi autocompleteName():
  function autocompleteName() {
      const input = document.getElementById('nama');
      const jenjangFilter = document.getElementById('filterJenjang').value;
      
      input.addEventListener('input', function() {
          // ... kode sebelumnya ...
          
          // Tambahkan filter jenjang
          let matches = studentsData.filter(student => 
              (student.nama.toLowerCase().includes(val) || 
              student.nis.toLowerCase().includes(val)) &&
              (jenjangFilter === '' || student.jenjang === jenjangFilter)
          );
          
          // ... tampilkan hasil ...
      });
  }