let api = {};
const User = require("../models/user");
const QuizeInfo = require("../models/save");

const handleErrors = (error, res) => {
  let Errors = { email: "", password: "" };

  //signup errors
  if (error._message === `user validation failed`) {
    Object.values(error.errors).forEach(({ properties }) => {
      Errors[properties.path] = properties.message;
    });
  }

  if (error.code === 11000) {
    Errors.email = "email already exists";
  }

  //login error
  if (error.message === `invalid password`) {
    Errors.password = "invalid password";
  }

  if (error.message === `invalid email`) {
    Errors.email = "invalid email";
  }

  if (error.message === "invalid email or password") {
    Errors.msg = error.message;
  }

  res.json({ Errors });
};

api.post_signup = async (req, res) => {
  let { email } = req.body;

  try {
    const user = await User.create(req.body);

    if (user) {
      res.send({ done: 1, email });
    }
  } catch (error) {
    handleErrors(error, res);
  }
};

api.post_login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);

    if (user) {
      res.send({ done: 1, email });
    }
  } catch (error) {
    handleErrors(error, res);
  }
};

api.post_save = async (req, res) => {
  const { data, email } = req.body;

  try {
    let user = await User.findOne({ email });
    let found_ = await QuizeInfo.findOne({ email });

    if (found_) {
      let user_board = await QuizeInfo.findOneAndUpdate(
        { email },
        { data, user_data: user.data }
      );

      if (user_board) {
        sendJson("data_saved agin");
      }
    } else {
      const board_saved = await QuizeInfo.create({
        data,
        email,
        user_data: user.data,
      });

      if (board_saved) {
        sendJson("data_saved");
      }
    }

    function sendJson(data) {
      res.json({ data });
    }
  } catch (error) {
    res.json({ error });
  }
};

api.get_data = async (req, res) => {
  let email = req.params.email;

  try {
    let found_ = await QuizeInfo.find({ email });
    let user = await User.find({ email });

    if (found_ || user) {
      let { data } = user[0];

      sendJson({
        my_quize_info: found_.length > 0 ? found_[0].data : null,
        my_info: user.length > 0 ? data : null,
      });
    } else {
      Error("no data found!");
    }

    function sendJson(data) {
      res.json({ data });
    }
  } catch (error) {
    res.json({ error });
  }
};

api.get_board_data = async (req, res) => {
  try {
    let found_ = await QuizeInfo.find({});

    if (found_) {
      sendJson(found_);
    } else {
      Error("no data found!");
    }

    function sendJson(data) {
      res.json({ data });
    }
  } catch (error) {
    res.json({ error });
  }
};

api.delete_data = async (req, res) => {
  let email = req.params.email;
  let password = req.params.password;

  try {
    let data = await User.findOneAndDelete({ email, password });

    if (data) {
      res.status(200).json({ done: 1 });
    } else {
      throw Error("something went wrong!");
    }
  } catch (error) {
    res.status(500).json({ error });
  }
};

module.exports = api;
