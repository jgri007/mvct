let version = "© 2024 Guti (2024-10-08)";
let dHoy = new Date(); 

function inicio(){
    // TimeStamp + Nombre de la función (Para depuración)
    console.log(new Date().toLocaleString() + " - " + arguments.callee.name); 

    inicializar();
  }

function borraFiltros(){
    // TimeStamp + Nombre de la función (Para depuración)
    console.log(new Date().toLocaleString() + " - " + arguments.callee.name); 

    console.log("busco");
    inImporteDesde.value = 0;
    inImporteHasta.value = 999999;
    fSelTodas.checked = true;
    mTodos.checked = true;
    actualizaDatos();
}

function inicializar(){
    // TimeStamp + Nombre de la función (Para depuración)
    console.log(new Date().toLocaleString() + " - " + arguments.callee.name); 
  
    inTxBuscar.value = "";
    cambiaBBDD();
    inImporteDesde.value = 0;
    inImporteHasta.value = 999999;
    //fSel.checked = true;
    fSelTodas.checked = true;
    m35.checked = true;
}

function actualizaDatos() {
    // TimeStamp + Nombre de la función (Para depuración)
    console.log(new Date().toLocaleString() + " - " + arguments.callee.name); 
  
    var rFechaVal;
    var selector = document.querySelector('input[name="rFecha"]:checked'); 
    if(selector) rFechaVal=selector.value;
    fechas(rFechaVal);
    
    var nReg;
    var selector = document.querySelector('input[name="nRegistros"]:checked'); 
    if(selector) {
      nReg=selector.value;
      inNumRegistros.value = nReg;
    }
    
    buscar();

}

function buscar(){
    // TimeStamp + Nombre de la función (Para depuración)
    console.log(new Date().toLocaleString() + " - " + arguments.callee.name); 
  

    var buscado = inTxBuscar.value.toLowerCase();
    console.log(buscado);
    var aPalabras = buscado.split(","); // Array con las palabras a buscar

    var importeDesde = inImporteDesde.value;
    var importeHasta = inImporteHasta.value;

    var FechaDesde = inFechaDesde.valueAsNumber;
    var FechaHasta = inFechaHasta.valueAsNumber;

    console.log ("FechaDesde: ", FechaDesde);
    console.log ("FechaHasta: ", FechaHasta);
    //console.log ("Fecha: ", el.isodate);

    var movF = mov.filter(function (el) {
    return   (Object.values(el).toString().toLowerCase().search(aPalabras[0])+ 1)  // Busco la palabra 1
          && (Object.values(el).toString().toLowerCase().search(aPalabras[1])+ 1)  // Busco la palabra 2
          // && (Object.values(el).toString().toLowerCase().search(aPalabras[2])+ 1)  // Busco la palabra 3
          && (Math.abs(el.importeval) >= importeDesde) 
          && (Math.abs(el.importeval) <= importeHasta)
          && (fechaConvert(el.isodate)  >= FechaDesde) 
          && (fechaConvert(el.isodate)  <= FechaHasta)
      ;
    }); 

    mostrarMov(movF);
    //mostrarMov(mov);

}

function mostrarMov(m) {
    // TimeStamp + Nombre de la función (Para depuración)
    console.log(new Date().toLocaleString() + " - " + arguments.callee.name); 
    
    //alert("Registros: " + m.length);
    var total = 0;

    for (var i = 0; i< m.length; i++){
        total += m[i].importeval
    }

    // Esto es para la pantalla estrecha
    movs_div = document.getElementById('divMovimientos');
    movs_div.innerHTML = ""; // Borro todos los movimientos

    // Escribo el resumen para la pantalla estrecha
    movHTML = "<span class='movFecha' >" + (new Intl.NumberFormat('de-DE').format(m.length)) 
    + " movimientos" + "</span><span class='movImporte'>" + formatNumber(total) + "</span>";
    movimiento = document.createElement('div');
    movimiento.innerHTML = movHTML;
    movimiento.classList.add("movMovil");
    movs_div.appendChild(movimiento);
    
    // Esto es para la pantalla ancha
    var table = document.getElementById("tblMovimientos");
    for(var i = table.rows.length - 1; i > 0; i--){ // Borro los movimientos actuales
        table.deleteRow(i);
    }
    
    registrosListar = inNumRegistros.value;
    for (let i = 0; i < Math.min(registrosListar, m.length); i++) { // Escribo los movimientos

      // Esto es para la pantalla ancha
      var row = table.insertRow();
      row.insertCell(0).innerHTML = "<span class='movFecha'>" + m[i].isodate + "</span>";
      row.insertCell(1).innerHTML = m[i].account;
      row.insertCell(2).innerHTML = m[i].payee;
      row.insertCell(3).innerHTML = formatNumber(m[i].importeval);
      row.insertCell(4).innerHTML = m[i].category + ": " + m[i].subcategory;
      row.insertCell(5).innerHTML = m[i].wording;

      // Esto es para la pantalla estrecha
      movHTML = "<span class='movFecha'>" + m[i].isodate + "</span>" + formatNumber(m[i].importeval) 
              + "<br>" + m[i].account 
              + "<br>" + m[i].payee 
              + "<br>" + m[i].category + ": " + m[i].subcategory 
              + "<br>" + m[i].wording;
      movimiento = document.createElement('div');
      movimiento.innerHTML = movHTML;
      movimiento.classList.add("movMovil");
      movs_div.appendChild(movimiento);
    }

    // Esto es para la pantalla ancha
    // Escribo el resumen para la pantalla ancha
    row = table.insertRow();    // Escribo una fila de resumen
    row.insertCell(0).innerHTML = "Movimientos:";
    row.insertCell(1).innerHTML =  (new Intl.NumberFormat('de-DE').format(m.length));
    row.insertCell(2).innerHTML = "Importe Total:";
    row.insertCell(3).innerHTML = formatNumber(total);
    row.insertCell(4);
    row.insertCell(5);

}

function cambiaBBDD(){
    // TimeStamp + Nombre de la función (Para depuración)
    console.log(new Date().toLocaleString() + " - " + arguments.callee.name); 
  
    if (fs.checked) {
      mov = mvMios;
      fData = fDatamvMios;
      document.getElementById('divMovimientos').style.backgroundColor = "#f3faf0";
      document.getElementById('tblMovimientos').style.backgroundColor = "#f3faf0";


    } else {
      mov = mvYaya;
      fData = fDatamvYaya;
      // document.getElementById('Controles').style.backgroundColor = "HoneyDew";
      document.getElementById('divMovimientos').style.backgroundColor = "#f7f2e5";
      document.getElementById('tblMovimientos').style.backgroundColor = "#f7f2e5 ";
    }
    pie.innerHTML= fData;
    actualizaDatos();
}


// Formatea el número con separadores de miles
function formatNumber(num) {

    if (num >= 0) {
      fmt = "nPositivo"  // Clase para importes positivos
    }
    else {
      fmt = "nNegativo"    // Clase para importes negativos
    }
      
    var sHtml = "<span class='movImporte " + fmt + "'>"
      + (new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(num))
      + "</span>" ;

    // console.log(sHtml);
    return sHtml   
}

function fechas(sTxt){
    // TimeStamp + Nombre de la función (Para depuración)
    console.log(new Date().toLocaleString() + " - " + arguments.callee.name); 
  
  var fDesde;
  var fHasta;
  //alert(dHoy);
  
  switch (sTxt) {
  case "MesAct":  
    // Mes actual
      fDesde = new Date(dHoy.getFullYear(), dHoy.getMonth(),2);
      fHasta = new Date(dHoy.getFullYear(), dHoy.getMonth() + 1);
      break;
  case "AnoAct":  
    // Año actual
      fDesde = new Date(dHoy.getFullYear(), 0, 2);
      fHasta = new Date(dHoy.getFullYear(), 12, 1);
      break;
  case "MesTod":
    // Lo que va de mes
      fDesde = new Date(dHoy.getFullYear(), dHoy.getMonth(), 2);
      fHasta = dHoy;
      break;
  case "AnoTod":
    // Lo que va de año
      fDesde = new Date(dHoy.getFullYear(), 0, 2);
      fHasta = dHoy;
      break;
  case "MesAnt":  
    // Mes anterior
      fDesde = new Date(dHoy.getFullYear(), dHoy.getMonth()-1, 2);
      fHasta = new Date(dHoy.getFullYear(), dHoy.getMonth() , 1);
      break;
  case "AnoAnt":  
    // Año anterior
      fDesde = new Date(dHoy.getFullYear()-1, 0, 2);
      fHasta = new Date(dHoy.getFullYear()-1, 12 , 1);
      break;
  case "Ult30d":
    // >Últimos 30 días
      fDesde = new Date(dHoy.getFullYear(), dHoy.getMonth(), dHoy.getDate()-30);
      fHasta = dHoy;
      break;
  case "Ult03m":
    // >Últimos 3 meses
      fDesde = new Date(dHoy.getFullYear(), dHoy.getMonth()-3, dHoy.getDate()+1);
      fHasta = dHoy;
      break;
  case "Ult06m":
    // >Últimos 6 meses
      fDesde = new Date(dHoy.getFullYear(), dHoy.getMonth()-6, dHoy.getDate()+1);
      fHasta = dHoy;
      break;
  case "Ult12m":
    // >Últimos 12 meses
      fDesde = new Date(dHoy.getFullYear(), dHoy.getMonth()-12, dHoy.getDate()+1);
      fHasta = dHoy;
      break;
  case "Todas":
    // >Todas las fechas
      fDesde = new Date(1980,0,2);
      fHasta = new Date(2200,11,32);
      break;
  default:
      fDesde = new Date(1980,0,1);
      fHasta = new Date(dHoy.getFullYear(),11,31);
  }
  inFechaDesde.valueAsDate = fDesde; 
  inFechaHasta.valueAsDate = fHasta;
}

function fechaConvert(fxd){
    //Convierte la fecha f en formato aaaa-mm-dd a formato Date UTC ¡Importante lo de UTC para comparaciones!
    //console.log("Fxd:" , fxd);
    var arrFecha = fxd.split("-");
    var anno = arrFecha[0];
    var mes = arrFecha[1];
    var dia = arrFecha[2];
    var mydate =  Date.UTC(anno, mes - 1 , dia);
    //console.log("UTC", mydate);
    return mydate  
}


function fAnnoMesDia(f) {
    //Convierte la fecha f en formato dd/mm/aaaa a formato aaaammdd para ordenar
    var arrFecha = f.split("/")
    var anno = arrFecha[2];
    var mes = arrFecha[1];
    var dia = arrFecha[0];
    var mydate =  anno + mes + dia;
    //console.log(mydate);
    return mydate  
}

// Execute a function when the user presses a key on the keyboard
var input = document.getElementById("inTxBuscar");
    input.addEventListener("keypress", function(event) {
      // If the user presses the "Enter" key on the keyboard
    if (event.key === "Enter") {
      // Cancel the default action, if needed
      event.preventDefault();
      // Trigger the button element with a click
      //btBuscar.click();
      borraFiltros();
    }
});

function sortTable(n) {
  // TimeStamp + Nombre de la función (Para depuración)
  console.log(new Date().toLocaleString() + " - " + arguments.callee.name) ; 

  document.body.style.cursor = 'wait'

  var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
  table = document.getElementById("tblMovimientos");
  //console.log(table.rows.length);

  var nCols = table.rows[0].cells.length;
  for (i = 0; i < nCols ; i++) { // Quito las flechas de todas las cabeceras
    cabecera = table.rows[0].cells[i].innerHTML;
    cabecera = quitaFlechas(cabecera);
    table.rows[0].cells[i].innerHTML = cabecera
  }

  if (table.rows.length > 102) {
    console.log(new Date().toLocaleString() + " - " + arguments.callee.name); 
    alert ("No se pueden ordenar más de 100 movimientos");
    return;
  }

  switching = true;
  // Set the sorting direction to ascending:
  dir = "asc";

  /* Make a loop that will continue until
  no switching has been done: */
  while (switching) {
    // Start by saying: no switching is done:
    switching = false;
    rows = table.rows;
    /* Loop through all table rows (except the
    first, which contains table headers): */
    for (i = 1; i < (rows.length - 2); i++) {
      // Start by saying there should be no switching:
      shouldSwitch = false;
      /* Get the two elements you want to compare,
      one from current row and one from the next: */
      x = rows[i].getElementsByTagName("TD")[n];
      y = rows[i + 1].getElementsByTagName("TD")[n];
      xVal = x.innerText.toLowerCase();
      yVal = y.innerText.toLowerCase();

      // if (n == 0) {  // Fecha
      //   xVal = fAnnoMesDia(xVal);
      //   yVal = fAnnoMesDia(yVal);
      //   // console.log(new Date().toLocaleString() + " - " + arguments.callee.name + " COl:" + n + xVal + " , " + yVal) ; 
      // }
      
      if (n == 3) {  // Importe
        // console.log(new Date().toLocaleString() + " - " + arguments.callee.name + " COl:" + n + xVal + " , " + yVal) ; 
        xVal = parseFloat(xVal.replace(".",""));
        yVal = parseFloat(yVal.replace(".",""));
        // console.log(new Date().toLocaleString() + " - " + arguments.callee.name + " COl:" + n + xVal + " , " + yVal) ; 
      }

      /* Check if the two rows should switch place,
      based on the direction, asc or desc: */
      if (dir == "asc") {
        if (xVal > yVal) {
          // If so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      } else if (dir == "desc") {
        if (xVal < yVal) {
          // If so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      /* If a switch has been marked, make the switch
      and mark that a switch has been done: */
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      // Each time a switch is done, increase this count by 1:
      switchcount ++;
    } else {
      /* If no switching has been done AND the direction is "asc",
      set the direction to "desc" and run the while loop again. */
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
    document.body.style.cursor = 'default'
  }


  cabecera = table.rows[0].cells[n].innerHTML;
  if (dir == "asc") {
    rows[0].cells[n].innerHTML = cabecera + " &#8673";
  } else {
    rows[0].cells[n].innerHTML = cabecera + " &#8675";
  }

}

function quitaFlechas(txt) {
  var txtA = txt.split(' ');
  return txtA[0];
}

function seleccion() {
  console.log(new Date().toLocaleString() + " - " + arguments.callee.name); // TimeStamp + Nombre de la función (Para depuración)

  inTxBuscar.value = selector.value ;
  actualizaDatos();
}
