import Customer from "../models/customer.model.js";
import bcrypt from "bcrypt";
import generateToken from "../utils/generateToken.js";

//REGISTER USER
export const registerCustomer = async (req, res) => {
  try {
    const { fullName, email, password, phone } = req.body;

    if (!fullName || !email || !password || !phone) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const existingCustomer = await Customer.findOne({ email });

    if (existingCustomer) {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const customer = await Customer.create({
      fullName,
      email,
      password: hashedPassword,
      phone,
    });

    return res.status(201).json({
      success: true,
      message: "Customer registered successfully",
      customer: {
        _id: customer._id,
        fullName: customer.fullName,
        email: customer.email,
        phone: customer.phone,
      },
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

//LOGIN USER
export const loginCustomer = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const customer = await Customer.findOne({ email });

    if (!customer) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, customer.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = generateToken(customer._id);

    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      customerData: customer,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

//GET PROFILE
export const getMyProfile = async (req, res) => {
  try {
    return res.status(200).json(req.customer);
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

//LOGOUT
export const logOutCustomer = async (req, res) => {
  try {
    const isProduction = process.env.NODE_ENV === "production";

    res.clearCookie("token", {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
    });

    return res.status(201).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Both old and new Passwords are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must have atleast 6 characters",
      });
    }

    const customer = await Customer.findById(req.user._id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not Found",
      });
    }

    const isMatched = await bcrypt.compare(oldPassword, customer.password);
    if (!isMatched) {
      return res.status(400).json({
        status: false,
        message: "Incorrect old password",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    customer.password = newPassword;
    await customer.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
