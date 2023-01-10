INSERT INTO departments (name)
VALUES 
('Sales and Marketing'),
('Human Resources'),
('Finance'),
('IT'),
('Operations');
      
INSERT INTO roles (title, salary, department_id)
VALUES 
('Sales Rep', 70000, 1),
('Brand Strategist', 75000, 1),
('Staffing Coordinator', 45000, 2),
('HR Manager', 65000, 2),
('Risk Analyst', 80000, 3),
('Finance Manager', 100000, 3),
('Software Engineer', 95000, 4),
('IT Support Manager', 70000, 4),
('Project Manager', 80000, 5),
('Director of Operations', 100000, 5);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES 
('Leslie', 'Brown', 1, 2),
('Margie', 'Thompson', 2, null),
('Harry', 'Fisher', 3, 4),
('Paul', 'Jones', 4, null),
('Tony', 'Martin', 5, 6),
('Jessica', 'Noble', 6, null),
('Tyler', 'Harrison', 7, 8),
('Krista', 'Sparks', 8, null),
('Ray', 'Smith', 9, 10),
('Tabitha', 'Whitman', 10, null);
