const errorHandler = (err, req, res, next) => {
  console.log("Error Handler:", err);

  if (err.code === 11000) {
    console.log("Duplicate Key Error");
    return res.status(409).send({
      message: "Email already exists. Please choose a different one.",
    });
  } else if (err.name === "ValidationError") {
    console.log("Validation Error");
    const errors = Object.keys(err.errors).map((key) => ({
      field: key,
      message: err.errors[key].message,
    }));
    return res.status(400).send({ errors });
  } else {
    console.error("Internal Server Error:", err);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

module.exports = errorHandler;
