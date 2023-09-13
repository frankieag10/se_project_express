const errorHandler = (err, req, res, next) => {
  if (err.code === 11000) {
    return res.status(409).send({
      message: "Email already exists. Please choose a different one.",
    });
  } else if (err.name === "ValidationError") {
    const errors = Object.keys(err.errors).map((key) => ({
      field: key,
      message: err.errors[key].message,
    }));
    return res.status(400).send({ errors });
  } else {
    console.error(err);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

module.exports = { errorHandler };
