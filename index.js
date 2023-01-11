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

const mysql = require("mysql2");
const inquirer = require("inquirer");
const prompt = inquirer.createPromptModule();
require("console.table");

const db = mysql.createConnection({
  user: "root",
  database: "employees_db",
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("MySQL connected");
});

// WHEN I start the application
// THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role

const displayAll = async (type, display) => {
  const results = await db.promise().query(`SELECT * FROM ${type}`);
  if (display) {
    console.table(results[0]);
    return init();
  }
  return results;
};

const insertInto = (type, data) => {
  db.query(`INSERT INTO ?? SET ?`, [type, data], (err) => {
    if (err) {
      throw err;
    }
    console.log("\nYour employee was added successfully\n");
    init();
  });
};

const generateOptions = (type, info, val, info2) => {
  if (info2) {
    return db
      .promise()
      .query(`SELECT CONCAT(??,' ', ??) AS name, ?? AS value FROM ??`, [
        info,
        info2,
        val,
        type,
      ]);
  }
  return db
    .promise()
    .query(`SELECT ?? AS name, ?? AS value FROM ??`, [info, val, type]);
};

const addEmployee = async () => {
  console.log("ADDING AN EMPLOYEE");
  const [roleOpt] = await generateOptions("roles", "title", "id");
  const [managerOpt] = await generateOptions(
    "employees",
    "first_name",
    "id",
    "last_name"
  );
  prompt([
    {
      name: "first_name",
      message: "Enter the employee's first name.",
    },
    {
      name: "last_name",
      message: "Enter the employee's last name.",
    },
    {
      type: "rawlist",
      name: "role_id",
      message: "Choose a role for this employee:",
      choices: roleOpt,
    },
    {
      type: "rawlist",
      name: "manager_id",
      message: "Choose a manager for this employee:",
      choices: managerOpt,
    },
  ]).then((answers) => {
    insertInto("employees", answers);
    console.log("Employee has been added!");
  });
};

const addDepartment = () => {
  console.log("ADDING A DEPARTMENT");
  prompt([
    {
      name: "name",
      message: "What is the name of the new department?",
    },
  ]).then((answers) => {
    insertInto("departments", answers);
    console.log("Department has been added!");
  });
};

const addRole = async () => {
  console.log("ADDING A ROLE");
  const [departmentOpt] = await generateOptions("departments", "name", "id");
  prompt([
    {
      name: "title",
      message: "What is the title of the new role?",
    },
    {
      name: "salary",
      message: "What is the salary of the new role?",
    },
    {
      type: "rawlist",
      name: "department_id",
      message: "Select the department that the new role belongs to:",
      choices: departmentOpt,
    },
  ]).then((answers) => {
    insertInto("roles", answers);
    console.log("Role has been added!");
  });
};

const updateRole = async () => {
  console.log("UPDATING EMPLOYEE ROLE");
  const [employeeOpt] = await generateOptions(
    "employees",
    "first_name",
    "id",
    "last_name"
  );
  const [roleOpt] = await generateOptions("roles", "title", "id");
  const [managerOpt] = await generateOptions(
    "employees",
    "first_name",
    "id",
    "last_name"
  );
  prompt([
    {
      type: "rawlist",
      name: "employeeId",
      message: "Select the employee who's role you would like to update:",
      choices: employeeOpt,
    },
    {
      type: "rawlist",
      name: "roleId",
      message: "Select their new role",
      choices: roleOpt,
    },
    {
      type: "rawlist",
      name: "managerId",
      message: "Select their new manager:",
      choices: managerOpt,
    },
  ]).then((answers) => {
    console.log(answers);
    const { employeeId, roleId, managerId } = answers;
    db.query(
      `UPDATE employees SET role_id = ${roleId}, manager_id = ${managerId} WHERE id = ${employeeId}`
    );
    console.log("Employee's role has been updated!");
    init();
  });
};

const init = () => {
  prompt([
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
  ]).then((answers) => {
    const { options } = answers;
    if (options === "View all departments") {
      displayAll("departments", true);
    } else if (options === "View all roles") {
      displayAll("roles", true);
    } else if (options === "View all employees") {
      displayAll("employees", true);
    } else if (options === "Add a department") {
      addDepartment();
    } else if (options === "Add a role") {
      addRole();
    } else if (options === "Add an employee") {
      addEmployee();
    } else if (options === "Update an employee role") {
      updateRole();
    } else {
      db.end();
    }
  });
};

init();
