const Employee = require('../model/Employee');

const getAllEmployees = async (req, res) => {
	const employees = await Employee.find({});
	if (!employees) return res.status(204).json({ message: 'No Employees Found' });
	return res.json(employees);
};
const createNewEmployee = async (req, res) => {
	if (!req.body.firstname || !req.body.lastname)
		return res.status(400).json({ message: 'firstname and lastname required' });

	try {
		const result = await Employee.create({
			firstName: req.body.firstname,
			lastName: req.body.lastname
		});
		return res.status(201).json(result);
	} catch (err) {
		return res.status(500).json({ message: 'error occured' });
	}
};
const updateEmployee = async (req, res) => {
	if (!req.body.id) return res.status(400).json({ message: 'id parameter is required' });
	const employee = await Employee.findOne({ _id: req.body.id }).exec();

	if (!employee)
		return res.status(204).json({ message: `No employees matches ID ${req.body.id}` });

	if (req.body.firstname) employee.firstName = req.body.firstname;
	if (req.body.lastname) employee.lastName = req.body.lastname;

	const result = await employee.save();
	return res.json(result);
};
const deleteEmployee = async (req, res) => {
	if (!req.body.id) return res.status(400).json({ message: 'id parameter is required' });

	const employee = await Employee.findOne({ _id: req.body.id }).exec();
	if (!employee)
		return res.status(204).json({ message: `No employees matches ID ${req.body.id}` });

	const result = await employee.deleteOne({ _id: req.params.id });
	res.json(result);
};
const getEmployee = async (req, res) => {
	console.log('emp');
	if (!req.params.id) return res.status(400).json({ message: 'id parameter is required' });

	const employee = await Employee.findOne({ _id: req.params.id }).exec();

	if (!employee)
		return res.status(204).json({ message: `No employees matches ID ${req.body.id}` });

	res.json(employee);
};
module.exports = {
	getAllEmployees,
	createNewEmployee,
	updateEmployee,
	deleteEmployee,
	getEmployee
};
