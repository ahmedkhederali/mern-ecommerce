const User = require("../models/userModel");
const Payment = require("../models/paymentModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userCtrl = {
  register: async (req, res) => {
    try {
      const { name, email, password } = req.body;
      //check if user Already exist in DB or not
      const user = await User.findOne({ email });
      //return this message if user exist in db
      if (user) return res.status(400).json({ msg: "This user Already Exist" });
      //check length of password
      if (password.length < 6)
        return res.status(400).json({ msg: "Password must be More Than 5" });
      // ecrypt password
      const passwordHash = await bcrypt.hash(password, 10);
      // Create new User But Didn't save in DB
      /*
                "newUser": {"role": 0, "cart": [], "_id": "6228032e130f29238827aaa9", "name": "ahmed","email": "ahmed@email.com", "password": "$2b$10$iCJ.UDQG2S7KuthFRd1Xlusx4JOCjXKIo/QxjHbzM.S5Y8J/TYVOe"}
            */
      const newUser = new User({
        name,
        email,
        password: passwordHash,
      });

      //To Save In DB U Can USed Create But this is anthor way
      await newUser.save();
      // create JWT For Authentication
      const accesstoken = createAccessToken({ id: newUser._id });
      const refreshtoken = createRefreshToken({ id: newUser._id });
      //HANDLE REFRESH TOKEN USING COOKIES
      res.cookie("refreshtoken", refreshtoken, {
        httpOnly: true, //avoid XSS (cross-site scripting) attacks, man-in-the-middle attacks, and XST (cross-site tracing) attacks.
        path: "/user/refresh_token",
        maxAge: 7 * 24 * 60 * 60 * 1000, // === 7 days
      });
      //console.log(req.cookies)
      res.status(200).json({ accesstoken });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) return res.status(500).json({ msg: "Enter Valid Email" });
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(500).json({ msg: "Incoorect Password" });
      //if login success create access Token And Refresh Token
      // create JWT For Authentication
      const accesstoken = createAccessToken({ id: user._id });
      const refreshtoken = createRefreshToken({ id: user._id });
      //HANDLE REFRESH TOKEN USING COOKIES
      res.cookie("refreshtoken", refreshtoken, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        Path: "/user/refresh_token",
      });
      // res.cookie("userData", refreshtoken)
      //  console.log(req.cookies)
      res.status(200).json({ accesstoken });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  logout: async (req, res) => {
    try {
      res.clearCookie("refreshtoken", { path: "/user/refresh_token" });
      return res.json({ msg: "Logged Out" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  refreshToken: (req, res) => {
    // console.log(req.cookies)
    try {
      const rf_token = req.cookies.refreshtoken;
      if (!rf_token)
        return res.status(400).json({ msg: "Please Login Or Register" });

      jwt.verify(rf_token, process.env.REFRESH_TOKEN, (err, user) => {
        if (err)
          return res.status(400).json({ msg: "Please Login Or Register" });
        const accesstoken = createAccessToken({ id: user.id });
        //console.log(user)
        res.status(200).json({ accesstoken });
      });
    } catch (error) {
      return res.status(400).json({ msg: "Please Login Or Register" });
    }
  },
  getUser: async (req, res) => {
    try {
      //console.log(req.user)   ===>{ id: '62281313dac06c2accc06ebf', iat: 1646799509, exp: 1646885909 }
      //select('-password')    ==> select all expect password
      const user = await User.findById(req.user.id).select("-password");
      if (!user)
        return res.status(404).json({ msg: "There is No User With This ID" });
      res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  addCart: async (req, res) => {
    try {
      const user = User.findById(req.user.id);
      if (!user)
        return res.status(400).json({ msg: "There is No User With This ID" });
      await User.findByIdAndUpdate(
        { _id: req.user.id },
        { cart: req.body.cart }
      );
      return res.status(200).json({ msg: "Add To Cart" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  history: async (req, res) => {
    try {
      const history = await Payment.find({ user_id: req.user.id });
      if (!history) return res.status(400).json({ msg: "There Is No History" });
      res.status(200).json(history);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
};
const createAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN, { expiresIn: "11m" });
};
const createRefreshToken = (user) => {
  return jwt.sign(user, process.env.REFRESH_TOKEN, { expiresIn: "7d" });
};
module.exports = userCtrl;
