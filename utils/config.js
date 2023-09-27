const { JWT_SECRET = "eaglestoken" } = process.env;

/*const handleError = (req, res, error) => {
  console.error(`error is : ${error}`);
  if (error.name === "ValidationError") {
    res.status(ERROR_400).send({
      message: "Passed invalid data !",
    });
  } else if (error.name === "CastError") {
    res.status(ERROR_400).send({
      message: "Passed id is invalid",
    });
  } else if (error.name === "DocumentNotFoundError") {
    res.status(ERROR_404).send({
      message: "Data is not found",
    });
  } else {
    res.status(ERROR_500).send({
      message: "An error has occurred on the server.",
    });
  }
};
*/
module.exports = {
  JWT_SECRET,
};
