const errorHandler = (err, req, res, next) => {
  console.log("Error Handler:", err);

  if (err.statusCode === 409) {
    console.log("Duplicate Key Error");
    return res.status(409).send({
      message: "Email already exists. Please choose a different one.",
    });
  }

  if (err.statusCode === 400) {
    console.log("Validation Error");
    const errors = Object.keys(err.errors).map((key) => ({
      field: key,
      message: err.errors[key].message,
    }));
    return res.status(400).send({ errors });
  }

  console.error("Internal Server Error:", err);
  return res.status(500).send({ message: "Internal Server Error" });
};

module.exports = { errorHandler };
