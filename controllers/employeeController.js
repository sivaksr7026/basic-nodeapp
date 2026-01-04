const Employeedb = require("../models/Employeedb");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTER
const registeremployee = async (req, res) => {
  try {
    const { username, email, password, role, phone } = req.body;
    if (!username || !email || !password || !phone) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    const existingEmployee = await Employeedb.findOne({ email });
    if (existingEmployee) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const employee = new Employeedb({ username, email, password: hashedPassword, role, phone });
    await employee.save();

    res.status(201).json({ message: "Registered successfully", employeeId: employee.id });
  } catch (error) {
    console.error("Create Employee Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// LOGIN
const loginemployee = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const employee = await Employeedb.findOne({ email });
    if (!employee) return res.status(400).json({ message: "Employee not found" });

    const isMatch = await bcrypt.compare(password, employee.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid password" });

    const payload = { user: { id: employee.id, role: employee.role } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.status(200).json({ message: "Login successful", token,user: {
    id: employee.id,
    username:employee.username,
    role: employee.role,
    email:employee.email,
    phone:employee.phone
  } });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Admin: Get all employees
const getAllEmployees = async (req, res) => {
  try {
    // Find all users with role 'employee'
    const employees = await Employeedb.find({ role: 'employee' }).select("-password");

    if (!employees || employees.length === 0) {
      return res.status(404).json({
        message: "No employees found"
      });
    }

    res.status(200).json(employees);

  } catch (error) {
    console.error("Get Employee Error:", error);
    res.status(500).json({
      message: "Server error"
    });
  }
};





const profileemployee = async (req, res) => {
  try {
    const employee = await Employeedb.findById(req.user.id).select('-password')

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" })
    }

    res.status(200).json(employee)
  } catch (error) {
    console.error("Profile error:", error)
    res.status(500).json({ message: "Server error" })
  }
}










// GET EMPLOYEE BY ID
const editemployee = async (req, res) => {
  try {
    const employee = await Employeedb
      .findById(req.params.id)
      .select("-password");

    if (!employee)
      return res.status(404).json({ message: "Employee not found" });

    res.status(200).json({ success: true, data: employee });
  } catch (error) {
    console.error("Get Employee Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// UPDATE EMPLOYEE
const updateemployee = async (req, res) => {
  try {
    const { username, email, phone } = req.body;

    const existingEmployee = await Employeedb.findOne({ email, _id: { $ne: req.params.id } });
    if (existingEmployee) return res.status(400).json({ message: "Email already exists" });

    const updatedEmployee = await Employeedb.findByIdAndUpdate(
      req.params.id,
      { username, email, phone },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedEmployee) return res.status(404).json({ message: "Employee not found" });
    res.status(200).json({ success: true, data: updatedEmployee });
  } catch (error) {
    console.error("Update Employee Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE EMPLOYEE
const deleteemployee = async (req, res) => {
  try {
    const employee = await Employeedb.findByIdAndDelete(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Employee deleted successfully",
    });
  } catch (error) {
    console.log("Delete employee error", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};



module.exports = {
  registeremployee,
  loginemployee,
  getAllEmployees,
  profileemployee,
  editemployee,
  updateemployee,
  deleteemployee,
};
