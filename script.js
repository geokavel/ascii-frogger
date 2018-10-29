var timer;
var f_x, f_y;
var replaced;
var copy;


function setup() {
	document.body.onkeyup = function(e) {
  var a = document.activeElement;
  if (a !== controls && a !== data) hop(e.keyCode);
};
  stop();
  var rows = game.children;
  rows[0].innerHTML = "0WWWWWWWWW";
  load(logs, "L");
  rows[2].innerHTML = "0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
  load(cars, "V");
  rows[4].innerHTML = "0&nbsp;&nbsp;&nbsp;&nbsp;F&nbsp;&nbsp;&nbsp;&nbsp;";
  copy = game.innerHTML;
  save();

  f_x = 5;
  f_y = 9;
  replaced = " ";
}

function save() {
  data.value = "";
  for (var i = 1; i <= 9; i++) {
    data.value += getRow(i).textContent;
    if (i < 9) data.value += "\n";
  }
}

function extLoad() {
  stop();
  var rows = data.value.split("\n");
  replaced = " ";
  for (var i = 0; i < rows.length; i++) {
    var r = getRow(i + 1);
    r.innerHTML = rows[i].replace(/ /g, "&nbsp;");
    if (rows[i].indexOf("V") !== -1 || rows[i].indexOf("L") !== -1) r.className = "right";
    else if (rows[i].indexOf("v") !== -1 || rows[i].indexOf("l") !== -1) r.className = "left";
    var f = rows[i].indexOf("F");
    if (f !== -1) {
      f_y = i + 1;
      f_x = f;
    }
  }
  copy = game.innerHTML;
}


function reset() {
  stop();
  game.innerHTML = copy;
  f_x = 5;
  f_y = 9;
  replaced = " ";
}

function play() {
  if (!timer) {
    timer = setInterval(next, 1500);
  }
}

function stop() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}

function input(i) {
  var s = controls.value;
  if (i === 0) {
    stop();
    sub.disabled = true;
  }
  if (s[i] === "L") hop(65);
  else if (s[i] === "U") hop(87);
  else if (s[i] === "R") hop(68);
  else if (s[i] === "D") hop(83);
  next();
  if (i < s.length - 1) setTimeout(function() {
    input(i + 1);
  }, 750);
  else sub.disabled = false;
}

function load(part, code) {
  for (var r = 0; r < 3; r++) {
    var row = part.children[r];
    var s = "";
    var dir = r % 2;
    row.className = dir === 1 ? "right" : "left";
    s += Math.floor(Math.random() * 2) + 1;
    var end = 0;
    for (var c = 0; c < 9-end;) {
      var spaces = Math.min(9 - end - c , Math.floor(Math.random() * 2) + 2);
      if(c === 0 && end===0) {
        spaces = Math.floor(Math.random()*4);
        end = Math.max(0,2-spaces);
      }
      s += "&nbsp;".repeat(spaces);
      c += spaces;
      var type = "";
      var len = 0;
      var rand = Math.floor(Math.random() * 2);
      if (code === "L") {
        type = dir === 1 ? "L" : "l";
        len = rand + 3;
      } else {
        type = dir === 1 ? "V" : "v";
        len = rand + 1;
      }
      if (c + len > 9-end) continue;
      s += type.repeat(len);
      c += len;

    }
    row.innerHTML = s + "&nbsp;".repeat(end);
  }
}

function next() {
  move(logs);
  move(cars);
}

function move(part) {
  var rows = part.children;
  for (var i = 0; i < rows.length; i++) {
    var s = rows[i].textContent;
    var f = s.indexOf("F") !== -1;
    if (f) {
      replace(f_y, f_x, false);
      s = rows[i].textContent;
    }
    var speed = s[0];
    var stuff = s.substring(1);
    var v = vel(speed, rows[i].className);
    rows[i].textContent = s[0] + shift(stuff, speed, rows[i].className);
    if (f) {
      if (part === logs) {
        f_x += v;
        if (f_x < 1 || f_x > 9) {
          go(5 - f_x, f_y - 9);
          return;
        }
      }
      replace(f_y, f_x, true);
      s = rows[i].textContent.substring(1);
      var c = f_x + v;
      var t = "";
      if (c > 9) t = s.substring(f_x) + s.substring(0, c - 9);
      else if (c < 0) t = s.substring(0, f_x) + s.substring(9 + c);
      else t = v > 0 ? s.substring(f_x, c) : s.substring(c, f_x);
      if (t.indexOf("V") !== -1 || t.indexOf("v") !== -1) {
        go(5 - f_x, f_y - 9);
      }

    }



  }
}


function vel(mag, dir) {
  var d = dir === "right" ? 1 : -1;
  var m = parseInt(mag);
  return d * m;
}



function shift(s, n, d) {
  n = parseInt(n);
  for (var i = 0; i < n; i++) {
    if (d === "left") {
      s = s.substring(1) + s.substring(0, 1);
    } else {
      s = s.substring(s.length - 1) + s.substring(0, s.length - 1);
    }
  }
  return s;
}


function hop(k) {
  if (k === 65) go(-1, 0);
  else if (k === 87) go(0, 1);
  else if (k === 68) go(1, 0);
  else if (k === 83) go(0, -1);
}

function go(x, y) {


  replace(f_y, f_x, false);
  f_y -= y;
  f_x += x;
  replace(f_y, f_x, true);
  if (f_x < 1 || f_x > 9 || f_y > 9) {
    go(5 - f_x, f_y - 9);
    return;
  }



  if (f_y == 1) {
    alert("win!");
    go(5 - f_x, f_y - 9);
  }


}

function replace(y, x, f) {

  var row = getRow(y);
  if (!row) return false;

  var s = row.textContent;
  if (x < 1 || x >= s.length) return false;
  if (f) {
    replaced = s[x];
    if (replaced === "V" || replaced === "v" || (replaced.charCodeAt(0) === 160 && y < 5)) {
      go(5 - f_x, f_y - 9);

    } else {
      row.textContent = s.substring(0, x) + "F" + s.substring(x + 1);
    }
  } else {
    row.textContent = s.substring(0, x) + replaced + s.substring(x + 1);
  }

}

function getRow(y) {
  if (y < 1 || y > 9) return false;
  if (y === 1) return game.firstChild;
  if (y === 9) return game.lastChild;
  if (y > 5) return cars.children[y - 6];
  if (y < 5) return logs.children[y - 2];
  return game.children[2];
}