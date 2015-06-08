function getCoeffient(eq) {
  // eq = -x -6x + x = -26
  // hapus semua spasi dan karakter setelah '=' (inklusif)
  // eq = -x-6x+x
  eq = eq.replace(/(\s|\=.*)/g, '');

  // sisipkan tanda + di depan -
  // eq = -x+-6x+x
  eq = eq.replace(/x\-/g, 'x\+\-');

  // jika sukunya hanya dituliskan x maka ubah jadi 1x
  // eq = -1x+-6x+1x
  eq = eq.replace(/\-x/g, '-1x');
  eq = eq.replace(/\+x/g, '+1x');
  eq = eq.replace(/(^x)/g, '1x');

  // hapus semua x
  // eq = -1+-6+1
  //eq = eq.replace(/x(?=[^0-9])$/g, 'x\+');
  
  eq = eq.replace(/x/g, '');
  console.log(eq);

  // simpan array coef yang dipisahkan dengan x
  // coef = ["-1", "-6", "1"]
  var coef = eq.split('+');

  return coef;
}

function getConstant(eq) {
  // hapus semua spasi dan karakter sebelum tanda = (inklusif)
  var constant = eq.replace(/(\s|.*\=)/g, '');

  return constant;
}

function getMatrixA() {
  var eqs = document.querySelectorAll('input');
  var matrixA = [];

  for (i = 0; i < eqs.length; i++) {
    matrixA[i] = getCoeffient(eqs[i].value);
  }

  return matrixA;
}

function getVectorB() {
  var eqs = document.querySelectorAll('input');
  var vectorB = [];

  for (i = 0; i < eqs.length; i++) {
    vectorB[i] = getConstant(eqs[i].value);
  }

  return vectorB;
}

function decompose(matrix) {
  var lu_matrix = matrix.slice();

  for (var k = 0; k < matrix.length-1; k++) { // moves down the matrix from one pivot row to the next, page 250

    for (var i = k+1; i < matrix.length; i++) { // moves below the pivot row to each of the subsequent rows where elimination is to take place
      
      var a_ik = Big(matrix[i][k]), a_kk = Big(matrix[k][k]);
      var factor = a_ik.div(a_kk);

      lu_matrix[i][k] = factor.toFixed(6); // simpan factor di bagian bawah matrix

      for (var j = k+1; j < matrix.length; j++) { // progresses across the columns to eliminate or transform the elements of a particular row

        var a_ij = Big(matrix[i][j]), a_kj = Big(matrix[k][j]);

        lu_matrix[i][j] = a_ij.minus(factor.times(a_kj)).toFixed(6);
      }
    }
  }

  return lu_matrix;
}

function fwSubstitute(lu_matrix, b) {
  var d = b.slice(); // copy matrix b ke d

  for (var i = 1; i < lu_matrix.length; i++) {
    var sum = Big(b[i]);

    for (var j = 0; j < i; j++) {
      var l_ij = Big( lu_matrix[i][j] );
      
      sum = sum.minus( l_ij.times(d[j]) );
    }

    d[i] = sum.toFixed(6);
  }
  return d;
}

function bwSubstitute(lu_matrix, d) {
  var len = lu_matrix.length;
  var x = [];
  x[len-1] = Big(d[len-1]).div(lu_matrix[len-1][len-1]).toFixed(6); // x3 = d3/a3,3 (untuk jumlah baris = 3)

  for (var i = len-2; i >= 0; i--) { // mundur untuk mendapatkan x2 dan x1
    var sum = Big(0);

    for (var j = i+1; j < len; j++) {
      var u_ij = Big( lu_matrix[i][j] );
      
      sum = sum.plus( u_ij.times(x[j]) );
    }

    x[i] = Big(d[i]).minus(sum).div( lu_matrix[i][i] ).toFixed(6);
  }

  return x;
}

function parse() {
  var a = getMatrixA();
  var b = getVectorB();

  printEq(a, b);

  var lu = decompose(a);
  var d = fwSubstitute(lu, b);
  var x = bwSubstitute(lu, d);
  document.querySelector('#output').innerHTML += x;
  printVector(x);
  
  console.log(lu);
  console.log(b);
  console.log(d);
  /*var eq = document.querySelector('input').value;
  var txt = getCoeffient(eq) + '<br />' + getConstant(eq);
  document.querySelector('output').innerHTML = txt;*/
}

function printEq(a, b) {
  var table = "<table>";
  for (var i = 0; i < a.length; i++) {
    table += "<tr>";
    for (var j = 0; j < a[i].length; j++) {
      table += "<td>" + a[i][j] + "</td>";
    }
    table += "<td>x<sub>" + (i+1) + "</sub></td>";
    table += "<td>" + b[i] + "</td>";
    table += "</tr>";
  }
  table += "</table>";
  console.log(table);
  document.querySelector('#output').innerHTML += "<br /><br />" + table;
}

function printVector(v) {
  var out = "";
  for (int i = 1; i < v.length; i++) {
    out += v[i] + "<br />";
  }
  document.querySelector('#output').innerHTML += "<br />" + out;
}

/*// misal x - x - 6x = -26
  // jika sukunya hanya dituliskan x maka ubah jadi 1x
  // jadi 1x -1x - 6x = -26
  
  // hapus semua spasi, tanda +, dan karakter setelah tanda = (inklusif)
  // jadi 1x-1x-6x
  eq = eq.replace(/(\s|\+|\=.*)/g, '');
  console.log(eq);
  
  eq = eq.replace(/([^0-9])x/g, '1x');
  console.log(eq);
  /*eq = eq.replace(/\-x/g, '-1x');
  eq = eq.replace(/(^x|[^0-9]x)/g, '1x');
  console.log(eq);
  // hapus x terakhir
  // jadi 1x-1x-6
  eq = eq.replace(/x$/, '');
  console.log(eq);
*/
