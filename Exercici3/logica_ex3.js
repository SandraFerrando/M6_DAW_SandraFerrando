document.addEventListener('DOMContentLoaded', function() {
  const API_URL = 'https://nekos.best/api/v2/endpoints';
  let endpointsData = [];

  // Funció per carregar dades de l'API o del localStorage
  async function loadData() {
      const storedData = localStorage.getItem('endpointsData');
      if (storedData) {
          endpointsData = JSON.parse(storedData);
      } else {
          try {
              const response = await fetch(API_URL);
              const data = await response.json();
              //La línia de codi de baix pren les claus de l'objecte retornat per l'API i les converteix en un array d'objectes
              endpointsData = Object.keys(data).map(endpoint => ({ endpoint })); 
              localStorage.setItem('endpointsData', JSON.stringify(endpointsData));
          } catch (error) {
              console.error('Error en carregar les dades:', error);
              endpointsData = [];
          }
      }
      renderTable();
  }

  // Funció per renderitzar la taula
  function renderTable() {
      if ($.fn.DataTable.isDataTable('#endpointsTable')) {
          $('#endpointsTable').DataTable().destroy();
      }

      $('#endpointsTable').DataTable({
          data: endpointsData,
          columns: [
              { data: 'endpoint' },
              { 
                  data: null,
                  render: function(data, type, row, meta) {
                      return '<button class="delete-btn" data-index="' + meta.row + '">Eliminar</button>';
                  }
              }
          ],
          language: {
              url: '//cdn.datatables.net/plug-ins/1.10.24/i18n/Catalan.json'
          }
      });

      // Afegir event listener per als botons d'eliminar
      $('#endpointsTable').on('click', '.delete-btn', function() {
          const index = $(this).data('index');
          deleteEndpoint(index);
      });
  }

  // Funció per eliminar un endpoint
  function deleteEndpoint(index) {
      endpointsData.splice(index, 1);
      localStorage.setItem('endpointsData', JSON.stringify(endpointsData));
      renderTable();
  }

  // Iniciar l'aplicació
  loadData();
});
