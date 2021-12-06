// catch the input changes and run functions
// (01) change txt file format from plain text to array
// (02) find the team mate in array
// (03) filter array as team mate founded
// (04) get project array work Days
// (05) draw table with team mate data
const selectElement = document.querySelector("input[type=file]");
selectElement.addEventListener("change", function () {
  const reader = new FileReader();
  reader.onload = function (e) {
    if (typeof e.target.result !== "undefined") {
      selectElement.value = "";
      const file = e.target.result;
      const toArray = txtFileToArray(file);
      const toFilter = toArray.reduce((a, e) => {
        a[e.ProjectID] = ++a[e.ProjectID] || 0;
        return a;
      }, {});
      const data = toArray.filter((e) => toFilter[e.ProjectID]);
      const days = yearToDays(data);
      const arr = groupByKey(days, "ProjectID");
      const merge = mergeArray(arr);
      const removeDup = removeDuplicate(merge);
      const draw = drawDataTable(removeDup);
    }
  };
  reader.readAsText(this.files[0]);
});

const txtFileToArray = (str, spliter = ",") => {
  const headers = str.slice(0, str.indexOf("\n")).split(spliter);
  const rows = str.slice(str.indexOf("\n") + 1).split("\n");
  const arr = rows.map(function (row) {
    const values = row.split(spliter);
    const el = headers.reduce(function (object, header, index) {
      object[header.trim()] = values[index].trim();
      return object;
    }, {});
    return el;
  });
  return arr;
};

const yearToDays = (data) => {
  const result = [];
  data.map((item, index) => {
    const toDay = new Date();
    const dateFrom = new Date(item.DateFrom).getTime();
    const dateTo =
      item.DateTo !== "NULL" ? new Date(item.DateTo).getTime() : toDay;
    let DifferenceInTime = dateTo - dateFrom;
    let DifferenceInDays = DifferenceInTime / (1000 * 3600 * 24);
    const empData = {
      EmpID: item.EmpID,
      ProjectID: item.ProjectID,
      Days: Math.floor(DifferenceInDays)
    };
    result.push(empData);
  });
  return result;
};

const groupByKey = (array, key) => {
  return array.reduce((hash, obj) => {
    if (obj[key] === undefined) return hash;
    return Object.assign(hash, {
      [obj[key]]: (hash[obj[key]] || []).concat(obj)
    });
  }, []);
};

const mergeArray = (array) => {
  let newArra = [];
  array.forEach((el, index) => {
    const mate = { ProjectID: index.toString(), EmpID: [], days: [] };
    el.map((item) => {
      if (item.ProjectID === mate.ProjectID) {
        mate.EmpID.push(item.EmpID);
        mate.days.push(item.Days);
        mate.ProjectID = index.toString();
        newArra.push(mate);
      }
    });
  });
  return newArra;
};

function removeDuplicate(array) {
  const filteredArr = array.reduce((acc, current) => {
    const x = acc.find((item) => item.ProjectID === current.ProjectID);
    if (!x) {
      return acc.concat([current]);
    } else {
      return acc;
    }
  }, []);
  return filteredArr;
}
const drawDataTable = (array) => {
  const table = document.createElement("table");
  let tableHeader = [
    "Employee ID#1",
    "Employee ID#2",
    "Project ID",
    "Days Worked"
  ];
  const thead = document.createElement("thead");
  const tbody = document.createElement("tbody");

  const tr = document.createElement("tr");
  tableHeader.forEach((header) => {
    let th = document.createElement("th");
    th.innerText = header;
    tr.append(th);
    thead.append(tr);
    table.append(thead);
  });
  array.map((el) => {
    let tr = document.createElement("tr");
    let emp1 = document.createElement("td");
    let emp2 = document.createElement("td");
    let project = document.createElement("td");
    let days = document.createElement("td");
    emp1.innerText = el.EmpID[0];
    emp2.innerText = el.EmpID[1];
    project.innerText = el.ProjectID;
    days.innerText = Math.max(...el.days) - Math.min(...el.days);
    tr.append(emp1);
    tr.append(emp2);
    tr.append(project);
    tr.append(days);
    tbody.append(tr);
    table.append(tbody);
  });
  document.getElementById("table").innerHTML = "";
  document.getElementById("table").appendChild(table);
};
