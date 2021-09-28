const url =
  "https://gist.githubusercontent.com/josejbocanegra/b1873c6b7e732144355bb1627b6895ed/raw/d91df4c8093c23c41dce6292d5c1ffce0f01a68b/newDatalog.json";

function populateEventstable(data) {
  let index = 1;
  data.forEach((element) => {
    const tableBody = document
      .getElementById("idTable")
      .getElementsByTagName("tbody")[0];
    const newRow = tableBody.insertRow();

    if (element.squirrel) newRow.className = "table-danger";

    newRow.innerHTML =
      "<td>" +
      index +
      "</td><td>" +
      element.events +
      "</td><td>" +
      element.squirrel +
      "</td>";

    index = index + 1;
  });
}

function generateCorrelationTable(data) {
  let listEvents = [];
  data.forEach((element) => {
    let eventos = element.events;
    listEvents = listEvents.concat(eventos);
  });
  listEvents = [...new Set(listEvents)];
  //let index = 1;
  listEvents.forEach((event) => {
    let TP = 0;
    let TN = 0;
    let FP = 0;
    let FN = 0;
    data.forEach((element) => {
      let eventos = element.events;
      if (eventos.includes(event)) {
        if (element.squirrel) {
          //TP
          TP = TP+1
        } else {
          //FN
          FN = FN+1
        }
      } else {
        if (element.squirrel) {
          //FP
          FP = FP+1
        } else {
          //TN
          TN = TN+1
        }
      }
    });

    let correlation = MCC(TP, TN, FP, FN);

    const tableBody = document
      .getElementById("idTable2")
      .getElementsByTagName("tbody")[0];
    const newRow = tableBody.insertRow();

    newRow.innerHTML =
      "<td>" +
      event +
      "</td><td>" +
      correlation +
      "</td>";

    //index = index + 1;
  });
}

function MCC(TP, TN, FP, FN) {
  let numerador = TP * TN - FP * FN;
  let denominador = Math.sqrt((TP + FP) * (TP + FN) * (TN + FP) * (TN + FN));

  return numerador / denominador;
}

//https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_sort_table_number
function sortTable() {
  var table, rows, switching, i, x, y, shouldSwitch;
  table = document.getElementById("idTable2");
  switching = true;
  while (switching) {
    switching = false;
    rows = table.rows;
    for (i = 1; i < (rows.length - 1); i++) {
      shouldSwitch = false;
      x = rows[i].getElementsByTagName("TD")[1];
      y = rows[i + 1].getElementsByTagName("TD")[1];
      if (Number(x.innerHTML) < Number(y.innerHTML)) {
        shouldSwitch = true;
        break;
      }
    }
    if (shouldSwitch) {
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
    }
  }
}

fetch(url)
  .then((res) => res.json())
  .then((data) => {
    populateEventstable(data);
    generateCorrelationTable(data);
    sortTable();
    numerateTable();
  });