// can use callback pattern (commented out) or db.serialize which will run db.each/db.run (maybe others) sequentially.

var sqlite3 = require('sqlite3');
var db = new sqlite3.Database('./Northwind.sl3')

// run in serial (not async);
db.serialize(function() {

  // db.run('', function() {
  //   console.log("===========");
  //   console.log("Categories");
  //   console.log("===========");
  // })

  // db.each('SELECT * FROM Categories', function (err, row) {
  //   console.log(row.Description.toString());
  // });

  // db.run('', function() {
  //   console.log("========");
  //   console.log("Products");
  //   console.log("========");
  // });

  // db.each('SELECT * FROM Products ' +
  //   'INNER JOIN Categories ' +
  //   'ON Products.CategoryID = Categories.CategoryID ' +
  //   'LIMIT 10', function (err, row) {
  //     console.log(row.ProductName + ' is a ' + row.CategoryName);
  //   });

  //  db.run('', function () {
  //   console.log("====================");
  //   console.log("Employee Supervisors");
  //   console.log("====================");
  //  });

  // db.each('SELECT Employees.LastName AS EmployeeLastName, Supervisors.LastName AS SupervisorLastName FROM Employees ' +
  //   'INNER JOIN Employees AS Supervisors ' +
  //   'ON Employees.ReportsTo = Supervisors.EmployeeID', function (err, row) {
  //     // console.log(row);
  //     console.log(row.EmployeeLastName + "'s supervisor is " + row.SupervisorLastName);
  //   });

  // db.run('', function () {
  //   console.log("====================");
  //   console.log("All Employee Supervisors");
  //   console.log("====================");
  // })

  // db.each('SELECT Employees.LastName AS EmployeeLastName, Supervisors.LastName AS SupervisorLastName FROM Employees ' +
  //   'LEFT OUTER JOIN Employees AS Supervisors ' +
  //   'ON Employees.ReportsTo = Supervisors.EmployeeID', function (err, row) {
  //     // console.log(row);
  //     var sup = row.SupervisorLastName ? row.SupervisorLastName: "none but God himself";
  //     console.log(row.EmployeeLastName + "'s supervisor is " + sup);
  //   })

  db.run('', function () {
    console.log("================");
    console.log("1. Create Table ");
    console.log("================");
  })

  db.run("DROP TABLE IF EXISTS CategoryFavorites");

  db.run("CREATE TABLE CategoryFavorites("
        + "FavoriteID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, "
        + "CategoryID INTEGER NOT NULL"
        + ")", function(err) {
          if (err) console.log(err);
        }
  );

  db.run('', function () {
    console.log("===============");
    console.log("2. Insert Data ");
    console.log("===============");
  })

  var insert = db.prepare("INSERT INTO CategoryFavorites (CategoryID) VALUES (?)");
  for (var i = 2; i <= 8; i+=2) {
    insert.run(i);
  }
  insert.finalize();

  db.run('', function () {
    console.log("============================================");
    console.log("3. Query for Favorite Category Descriptions ");
    console.log("============================================");
  })

  categoryDescriptionQuery();

  db.run('', function () {
    console.log("====================");
    console.log("4. Update Favorites ");
    console.log("====================");
  })

  db.run("UPDATE CategoryFavorites "
         + "SET CategoryID = 5 "
         + "WHERE FavoriteID = 2");

  db.run('', function () {
    console.log("=================================================");
    console.log("5. Query for Favorite Category Descriptions Redux");
    console.log("=================================================");
  })

  categoryDescriptionQuery();

  db.run('', function () {
    console.log("=======================================");
    console.log("6. Delete CategoryFavorites FavoriteID3");
    console.log("=======================================");
  })

  db.run(
    "DELETE FROM CategoryFavorites WHERE FavoriteID = 3"
  );

  db.run('', function () {
    console.log("===========================================");
    console.log("7. Inserting Another Row With CategoryID: 1");
    console.log("===========================================");
  })

  db.run(
    "INSERT INTO CategoryFavorites(CategoryID) VALUES (1)"
  );

  db.run('', function () {
    console.log("====================================================");
    console.log("8. Query for Favorite Category Descriptions Re-Redux");
    console.log("====================================================");
  })

  categoryDescriptionQuery();

});

db.close();

function categoryDescriptionQuery() {
  db.run('', function() {console.log("FavoriteID, Category Description\n" +
                                     "--------------------------------");
  });

  db.each("SELECT * FROM CategoryFavorites "
          + "INNER JOIN Categories "
          + "ON CategoryFavorites.CategoryID = Categories.CategoryID",
          function (err, row) {
            if (err) console.log(err);
            console.log(row.FavoriteID + ". " + row.Description.toString());
          })
}

// function getCategories(cb) {
//   db.each('SELECT * FROM Categories', function (err, row) {
//     console.log(row.Description.toString());
//   }, cb);
// }

// one way to chain an async operation is to not pass a cb in, but just have it fire off a cb upon completion (or you can specify which one to fire by passing it in).

// function getCategories() {
//   db.each('SELECT * FROM Categories', function (err, row) {
//     console.log(row.Description.toString());
//   }, cb);
// }

// function getProducts() {
//   console.log('Products');

//   db.each('SELECT * FROM Products ' +
//     'INNER JOIN Categories ' +
//     'ON Products.CategoryID = Categories.CategoryID ' +
//     'LIMIT 10', function (err, row) {
//       console.log(row.ProductName + ' is a ' + row.CategoryName);
//     });
// }

// function getEmployeeSupers() {
//   console.log("====================");
//   console.log("Employee Supervisors");
//   console.log("====================");
//   // #{Employee last name}'s supervisor is #{Supervisor Lastname}

//   // when you return rows, this doesn't distinguish between employee and supervisor;
//   // so if you retrieve two lastname fields, the latter will overwrite the former.
//   // although this query works in the shell, have to redefine here.
//   db.each('SELECT Employees.LastName AS EmployeeLastName, Supervisors.LastName AS SupervisorLastName FROM Employees ' +
//     'INNER JOIN Employees AS Supervisors ' +
//     'ON Employees.ReportsTo = Supervisors.EmployeeID', function (err, row) {
//       // console.log(row);
//       console.log(row.EmployeeLastName + "'s supervisor is " + row.SupervisorLastName);
//     });
// }

// function getAllEmployeeSupers() {
//   console.log("====================");
//   console.log("All Employee Supervisors");
//   console.log("====================");

//   db.each('SELECT Employees.LastName AS EmployeeLastName, Supervisors.LastName AS SupervisorLastName FROM Employees ' +
//     'LEFT OUTER JOIN Employees AS Supervisors ' +
//     'ON Employees.ReportsTo = Supervisors.EmployeeID', function (err, row) {
//       // console.log(row);
//       var sup = row.SupervisorLastName ? row.SupervisorLastName: "none but God himself";
//       console.log(row.EmployeeLastName + "'s supervisor is " + sup);
//     })
// }
