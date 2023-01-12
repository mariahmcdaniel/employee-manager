const mysql = require('mysql2');
const inquirer = require('inquirer');
const prompt = inquirer.createPromptModule();
require('console.table');

const db = mysql.createConnection({
  user: 'root',
  database: 'employees_db',
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('MySQL connected');
});

// WHEN I start the application
// THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role

const displayAll = async (type, display) => {
  const results = await db.promise().query(`SELECT * FROM ${type}`);
  if (display) {
    console.log(`\nAll ${type.toUpperCase()}\n`);
    console.table(results[0]);
    return init();
  }
  console.log(`\nAll ${type.toUpperCase()}\n`);
  return results;
};

displayAllEmployees = async () => {
  const sql = `SELECT employees.id, 
  employees.first_name, 
  employees.last_name, 
  roles.title, 
  roles.salary, 
  CONCAT(managers.first_name, managers.last_name) 
  AS managers FROM employees 
  JOIN roles 
  ON employees.role_id = roles.id 
  LEFT JOIN employees AS managers 
  ON employees.manager_id = managers.id`;
  const [allEmployees] = await db.promise().query(sql);
  console.table(allEmployees);
  init();
};

const insertInto = (type, data) => {
  db.query(`INSERT INTO ?? SET ?`, [type, data], (err) => {
    if (err) {
      throw err;
    }
    console.log('\nSUCCESS\n');
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
  console.log('ADDING AN EMPLOYEE');
  const [roleOpt] = await generateOptions('roles', 'title', 'id');
  const [managerOpt] = await generateOptions(
    'employees',
    'first_name',
    'id',
    'last_name'
  );
  prompt([
    {
      name: 'first_name',
      message: "Enter the employee's first name.",
    },
    {
      name: 'last_name',
      message: "Enter the employee's last name.",
    },
    {
      type: 'rawlist',
      name: 'role_id',
      message: 'Choose a role for this employee:',
      choices: roleOpt,
    },
    {
      type: 'rawlist',
      name: 'manager_id',
      message: 'Choose a manager for this employee:',
      choices: managerOpt,
    },
  ]).then((answers) => {
    insertInto('employees', answers);
    console.log('Employee has been added!');
  });
};

const addDepartment = () => {
  console.log('ADDING A DEPARTMENT');
  prompt([
    {
      name: 'name',
      message: 'What is the name of the new department?',
    },
  ]).then((answers) => {
    insertInto('departments', answers);
    console.log('\nDepartment has been added!\n');
  });
};

const addRole = async () => {
  console.log('ADDING A ROLE');
  const [departmentOpt] = await generateOptions('departments', 'name', 'id');
  prompt([
    {
      name: 'title',
      message: 'What is the title of the new role?',
    },
    {
      name: 'salary',
      message: 'What is the salary of the new role?',
    },
    {
      type: 'rawlist',
      name: 'department_id',
      message: 'Select the department that the new role belongs to:',
      choices: departmentOpt,
    },
  ]).then((answers) => {
    insertInto('roles', answers);
    console.log('\nRole has been added!\n');
  });
};

const updateRole = async () => {
  console.log('UPDATING EMPLOYEE ROLE');
  const [employeeOpt] = await generateOptions(
    'employees',
    'first_name',
    'id',
    'last_name'
  );
  const [roleOpt] = await generateOptions('roles', 'title', 'id');
  const [managerOpt] = await generateOptions(
    'employees',
    'first_name',
    'id',
    'last_name'
  );
  prompt([
    {
      type: 'rawlist',
      name: 'employeeId',
      message: "Select the employee who's role you would like to update:",
      choices: employeeOpt,
    },
    {
      type: 'rawlist',
      name: 'roleId',
      message: 'Select their new role',
      choices: roleOpt,
    },
    {
      type: 'rawlist',
      name: 'managerId',
      message: 'Select their new manager:',
      choices: managerOpt,
    },
  ]).then((answers) => {
    const { employeeId, roleId, managerId } = answers;
    db.query(
      `UPDATE employees SET role_id = ${roleId}, manager_id = ${managerId} WHERE id = ${employeeId}`
    );
    console.log("\nEmployee's role has been updated!\n");
    init();
  });
};

const init = () => {
  prompt([
    {
      type: 'rawlist',
      name: 'options',
      message: 'What would you like to do?',
      choices: [
        'View all departments',
        'View all roles',
        'View all employees',
        'Add a department',
        'Add a role',
        'Add an employee',
        'Update an employee role',
        'Quit',
      ],
    },
  ]).then((answers) => {
    const { options } = answers;
    if (options === 'View all departments') {
      displayAll('departments', true);
    } else if (options === 'View all roles') {
      displayAll('roles', true);
    } else if (options === 'View all employees') {
      displayAllEmployees();
    } else if (options === 'Add a department') {
      addDepartment();
    } else if (options === 'Add a role') {
      addRole();
    } else if (options === 'Add an employee') {
      addEmployee();
    } else if (options === 'Update an employee role') {
      updateRole();
    } else {
      console.log('Goodbye!');
      db.end();
    }
  });
};

init();
