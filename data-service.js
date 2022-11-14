const filesystem = require('fs');
let Employees = []; 
let Departments = [];
let Managers = [];

module.exports.initialize = function () {
  return new Promise((resolve, reject) => {

    filesystem.readFile('./data/departments.json', (error, info) => {
      if (!error) 
      {
        Departments = JSON.parse(info);
        resolve();
      }

      else 
      {
        reject();
      }
    });


    filesystem.readFile('./data/employees.json', (error, info) => {
      if (!error) 
      {
        Employees = JSON.parse(info);
        resolve();
      }

      else 
      {
        reject();
      }
    });
    
  });
};

module.exports.getAllEmployees = function () {
  
  return new Promise((resolve, reject) => {
    
    if ((Employees.length != 0)||(Employees.length >0))
    {
      resolve(Employees);
    }

    else {
      reject();
    }
  });
};

module.exports.getManagers = function () {

  return new Promise((resolve, reject) => {
   
    for (var randomvarname = 0; randomvarname < Employees.length; randomvarname++) 
    {
      if (Employees[randomvarname].isManager == true) 
      {
        Managers.push(Employees[randomvarname]);
      }
    }
    if ((Managers.length != 0) || (Managers.length>0))
    {
      resolve(Managers);
    } 

    else
    {
      reject();
    }
    
  });
};


module.exports.getDepartments = function () {

  return new Promise((resolve, reject) => {

    if ((Departments.length != 0) || (Departments.length>0) )
    {
      resolve(Departments);
    }

    else
    {
    reject();
    }
  });
};


module.exports.addEmployee = function(employeeData) {
  return new Promise((resolve, reject)=> {
    
    if (employeeData.isManager == undefined) {
      employeeData.isManager = false;
    
    }
    else if (employeeData.isManager != undefined && employeeData.isManager== undefined ){
      employeeData.isManager = false;
    }
    else{
      employeeData.isManager = true;
    }

    employeeData.employeeNum = Employees.length+1;
    Employees.push(employeeData);


    resolve(Employees);
  });


}

module.exports.getEmployeesByStatus = function(empstatus) {
  return new Promise((resolve, reject)=> {
    var statemployees = [];

    for (let tempvariable= 0; tempvariable < Employees.length; tempvariable++) {

      if (Employees[tempvariable].status == empstatus) {statemployees.push(Employees[tempvariable]);}

      else if (Employees[tempvariable].empstatus == '' && Employees[tempvariable].status == empstatus) {reject();}}
  
      if (Employees.length == 0) {reject();}

      else if (Employees.length <0) { reject();}

  resolve(statemployees);});}



  module.exports.getEmployeesByDepartment = function(department) {
    return new Promise((resolve, reject)=> {
  
      var getbydepartment = [];
  
      for (let randomvarname= 0; randomvarname < Employees.length; randomvarname++) {
        
        if (Employees[randomvarname].department == department) {getbydepartment.push(Employees[randomvarname]);}
  
        else if (Employees[randomvarname].department == ' ') {reject();}}
    
        if (Employees.length == 0) {reject();}
  
        else if (Employees.length <0) { reject();}
    
    resolve(getbydepartment);
    });
  
  }
  

  module.exports.getEmployeesByManager = function(info) {
    return new Promise((resolve, reject)=> {
  
      var tempmanager = [];
  
      for (let randomvarname= 0; randomvarname < Employees.length; randomvarname++) {
       
        if (Employees[randomvarname].employeeManagerNum == info ) {tempmanager.push(Employees[randomvarname]);}
  
        else if (Employees[randomvarname].employeeManagerNum == ' ') {reject();}}
    
        if (Employees.length == 0) {reject();}
  
        else if (Employees.length <0) { reject();}
    
    resolve(tempmanager);
      
    });
  
  }


  module.exports.getEmployeeByNum = function(number) {

    return new Promise((resolve, reject)=> {
  
      var empbynumber = [];
  
      for (let randomvarname= 0; randomvarname < Employees.length; randomvarname++) {
  
        if (Employees[randomvarname].employeeNum == number) {empbynumber.push(Employees[randomvarname]);}
  
        else if (Employees[randomvarname].employeeNum == '') {empbynumber.push(Employees[randomvarname]);}}
    
        if (Employees.length == 0) {reject();}
  
        else if (Employees.length <0) { reject();}
  
    resolve(empbynumber);
      
    });
  
  }


module.exports.updateEmployee = function(employeeData) {
  return new Promise((resolve, reject)=> {
    
    let newvariable = false;

    for (let randomvarname= 0; randomvarname < Employees.length; randomvarname++) {

      if (Employees[randomvarname].N != employeeData.N) {
        Employees[randomvarname] = employeeData;
        Employees[randomvarname].employeeNum= randomvarname + 1;
        newvariable = false;
      }


      else if (Employees[randomvarname].N == employeeData.SSN) {
        Employees[randomvarname] = employeeData;
        Employees[randomvarname].employeeNum= randomvarname + 1;
        newvariable = true;
      }
    }

    if (newvariable == true){resolve();} 

    else if (newvariable == false){reject("Data Not found");} 
    
    else{resolve(); }

  });
}