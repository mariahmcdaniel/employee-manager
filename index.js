// Developers frequently have to create interfaces that allow non-developers to easily view and interact with information stored in databases. These interfaces are called content management systems (CMS). Your assignment this week is to build a command-line application from scratch to manage a company's employee database, using Node.js, Inquirer, and MySQL.

// Because this application won’t be deployed, you’ll also need to create a walkthrough video that demonstrates its functionality and all of the following acceptance criteria being met. You’ll need to submit a link to the video and add it to the README of your project.

// User Story
// AS A business owner
// I WANT to be able to view and manage the departments, roles, and employees in my company
// SO THAT I can organize and plan my business
// Acceptance Criteria
// GIVEN a command-line application that accepts user input
// WHEN I start the application
// THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
// WHEN I choose to view all departments
// THEN I am presented with a formatted table showing department names and department ids
// WHEN I choose to view all roles
// THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
// WHEN I choose to view all employees
// THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
// WHEN I choose to add a department
// THEN I am prompted to enter the name of the department and that department is added to the database
// WHEN I choose to add a role
// THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
// WHEN I choose to add an employee
// THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
// WHEN I choose to update an employee role
// THEN I am prompted to select an employee to update and their new role and this information is updated in the database

// your schema should contain the following three tables:

// department

// id: INT PRIMARY KEY
// name: VARCHAR(30) to hold department name

// role

// id: INT PRIMARY KEY
// title: VARCHAR(30) to hold role title
// salary: DECIMAL to hold role salary
// department_id: INT to hold reference to department role belongs to

// employee

// id: INT PRIMARY KEY
// first_name: VARCHAR(30) to hold employee first name
// last_name: VARCHAR(30) to hold employee last name
// role_id: INT to hold reference to employee role
// manager_id: INT to hold reference to another employee that is the manager of the current employee (null if the employee has no manager)

// You might want to use a separate file that contains functions for performing specific SQL queries you'll need to use. A constructor function or class could be helpful for organizing these. You might also want to include a seeds.sql file to pre-populate your database, making the development of individual features much easier.

// Bonus
// Try to add some additional functionality to your application, such as the ability to do the following:
// Update employee managers.
// View employees by manager.
// View employees by department.
// Delete departments, roles, and employees.
// View the total utilized budget of a department—in other words, the combined salaries of all employees in that department.

const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: null,
  database: "employees_db",
});

connection.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("MySQL connected");
});

// WHEN I start the application
// THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role

const startPrompt = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "options",
        message: "What would you like to do?",
        choices: [
          "View all departments",
          "View all roles",
          "View all employees",
          "Add a department",
          "Add a role",
          "Add an employee",
          "Update an employee role",
          "Quit",
        ],
      },
    ])
    .then((answers) => {
      const { options } = answers;
      if (options === "View all departments") {
        displayDepartments();
      } else if (options === "View all roles") {
        displayRoles();
      } else if (options === "View all employees") {
        displayEmployees();
      } else if (options === "Add a department") {
        addDepartment();
      } else if (options === "Add a role") {
        addRole();
      } else if (options === "Add an employee") {
        addEmployee();
      } else if (options === "Update an employee role") {
        updateRole();
      } else {
        con.end();
      }
    });
};

const displayDepartments = () => {
  console.log("DISPLAYING ALL DEPARTMENTS");
  let sql = `SELECT * FROM department`;
  connection.query(sql, (err, result) => {
    if (err) {
      throw err;
    }
    console.table(result);
  });
};

const displayRoles = () => {
  console.log("DISPLAYING ALL ROLES");
  let sql = `SELECT * FROM role`;
  connection.query(sql, (err, result) => {
    if (err) {
      throw err;
    }
    console.table(result);
  });
};

const displayEmployees = () => {
  console.log("DISPLAYING ALL EMPLOYEES");
  let sql = `SELECT * FROM employee`;
  connection.query(sql, (err, result) => {
    if (err) {
      throw err;
    }
    console.table(result);
  });
};

const addDepartment = () => {
  console.log("ADDING A DEPARTMENT");
};

const addRole = () => {
  console.log("ADDING A ROLE");
};

const addEmployee = () => {
  console.log("ADDING AN EMPLOYEE");
};

const updateRole = () => {
  console.log("UPDATING EMPLOYEE ROLE");
};

startPrompt();
