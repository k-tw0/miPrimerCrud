/*
Nombre de la base de datos
Número de versión
Descripción del texto
Tamaño de la base de datos
Devolución de llamada de creación
*/
var nuevoId;
var db = openDatabase("itemDB", "1.0", "itemDB", 65535);

function limpiar() {
  document.getElementById("item").value = "";
  document.getElementById("precio").value = "";
}

//Funcionalidad de los botones
//Eliminar Registro
function eliminarRegistro() {
  $(document).one("click", 'button[type="button"]', function (event) {
    let id = this.id;
    var lista = [];
    $("#listaProductos").each(function () {
      var celdas = $(this).find("tr.Reg_" + id);
      celdas.each(function () {
        var registro = $(this).find("span.mid");
        registro.each(function () {
          lista.push($(this).html());
        });
      });
    });
    nuevoId = lista[0].substr(1);
    //alert(nuevoId);
    db.transaction(function (transaction) {
      var sql = "DELETE FROM products WHERE id=" + nuevoId + ";";
      transaction.executeSql(
        sql,
        undefined,
        function () {
          alert(
            "Registro borrado satisfactoriamente, Por favor actualice la tabla"
          );
        },
        function (transaction, err) {
          alert(err.message);
        }
      );
    });
  });
}

//Editar registro
function editar() {
  $(document).one("click", 'button[type="button"]', function (event) {
    let id = this.id;
    var lista = [];
    $("#listaProductos").each(function () {
      var celdas = $(this).find("tr.Reg_" + id);
      celdas.each(function () {
        var registro = $(this).find("span");
        registro.each(function () {
          lista.push($(this).html());
        });
      });
    });
    document.getElementById("item").value = lista[1];
    document.getElementById("precio").value = lista[2].slice(0, -5);
    nuevoId = lista[0].substr(1);
  });
}

/*
openDatabase : este método crea el objeto de la base de datos utilizando
una base de datos existente o creando una nueva.

transaction : este método nos brinda la capacidad de controlar
una transacción y realizar una confirmación o reversión según la situación.

executeSql : este método se utiliza para ejecutar una consulta SQL real.
*/
// aqui te enseñan como crear la tabla https://www.w3schools.com/sql/sql_create_table.asp
// se puede observar como la tabla no se crea a partir de las comillas y es lo unico que cambia
// entonces este lenguaje si aplica para todo, solamente tienes que entender un poco mejor javascript
$(function () {
  $("#crear").click(function () {
    db.transaction(function (transaction) {
      var sql =
        "CREATE TABLE products " +
        "(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, " +
        "item VARCHAR(100) NOT NULL, " +
        "precio DECIMAL(5,2) NOT NULL)";
      transaction.executeSql(
        //aqui hacemos la consulta de la transaccion sql
        sql,
        undefined,
        function () {
          alert("Tabla creada satisfactoriamente");
        },
        function (transaction, err) {
          alert(err.message);
        }
      );
    });
  });
  $("#listar").click(function () {
    cargarDatos();
  });
  function cargarDatos() {
    $("#listaProductos").children().remove();
    db.transaction(function (transaction) {
      var sql = "SELECT * FROM products ORDER BY id DESC";
      transaction.executeSql(
        sql,
        undefined,
        function (transaction, result) {
          if (result.rows.length) {
            $("#listaProductos").append(
              "<tr><th>Código</th><th>Producto</th><th>Precio</th><th></th><th></th></tr>"
            );
            for (var i = 0; i < result.rows.length; i++) {
              var row = result.rows.item(i);
              var item = row.item;
              var id = row.id;
              var precio = row.precio;
              $("#listaProductos").append(
                '<tr id="fila' +
                  id +
                  '" class="Reg_A' +
                  id +
                  '"><td><span class="mid">A' +
                  id +
                  "</span></td><td><span>" +
                  item +
                  "</span></td><td><span>" +
                  precio +
                  ' USD$</span></td><td><button type="button" id="A' +
                  id +
                  '" class="btn btn-success" onclick="editar()"><img src="img/bx-edit-alt.svg" /></button></td><td><button type="button" id="A' +
                  id +
                  '" class="btn btn-danger" onclick="eliminarRegistro()"><img src="img/bxs-eraser.svg" /></button></td></tr>'
              );
            }
          } else {
            $("#listaProductos").append(
              '<tr><td colspan="5" align="center">No existen registros de productos</td></tr>'
            );
          }
        },
        function (transaction, err) {
          alert(err.message);
        }
      );
    });
  }
  $("#insertar").click(function () {
    var item = $("#item").val();
    var precio = $("#precio").val();
    db.transaction(function (transaction) {
      var sql = "INSERT INTO products(item,precio) VALUES(?,?)";
      transaction.executeSql(
        sql,
        [item, precio],
        function () {},
        function (transaction, err) {
          alert(err.message);
        }
      );
    });
    limpiar();
    cargarDatos();
  });
  //Modificar un registro
  $("#modificar").click(function () {
    var nprod = $("#item").val();
    var nprecio = $("#precio").val();

    db.transaction(function (transaction) {
      var sql =
        "UPDATE products SET item='" +
        nprod +
        "', precio='" +
        nprecio +
        "' WHERE id=" +
        nuevoId +
        ";";
      transaction.executeSql(
        sql,
        undefined,
        function () {
          cargarDatos();
          limpiar();
        },
        function (transaction, err) {
          alert(err.message);
        }
      );
    });
  });

  // Para borrar toda la lista de Registros
  $("#borrarTodo").click(function () {
    if (
      !confirm(
        "Está seguro de borrar la tabla?, los datos se perderán permanentemente",
        ""
      )
    )
      return;
    db.transaction(function (transaction) {
      var sql = "DROP TABLE products";
      transaction.executeSql(
        sql,
        undefined,
        function () {
          alert(
            "Tabla borrada satisfactoriamente, Por favor, actualice la página"
          );
        },
        function (transaction, err) {
          alert(err.message);
        }
      );
    });
  });
});
