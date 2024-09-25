import DataTable from 'datatables.net-dt';
 
let table = new DataTable('#myTable', {
    // config options...
});

async function getData() {
    const url = "https://nekos.best/api/v2/endpoints";
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
  
      const json = await response.json();
      console.log(json);
    } catch (error) {
      console.error(error.message);
    }
  }

$(document).ready( function () {
    $('#myTable').DataTable();
} );
