const validateRequest = (schema) => (req, res, next) => {
  try {
    // Parse and validate the request body
    schema.parse(req.body);
    next(); // Proceed if validation passes
  } catch (err) {
    res.status(400).json({
      status: "error",
      message: err.errors.map((e) => e.message).join(", "),
    });
  }
};

module.exports = validateRequest;
