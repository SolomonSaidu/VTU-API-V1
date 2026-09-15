const Validate = (schema) => {
  return (req, res, next) => {
    const value = schema.safeParse(req.body);

    if (!value.success)
      return res.status(400).json({
        status: "Failed",
        message: "Invalid details.",
        error: value.error.issues.map((issue) => issue.message),
      });

    req.body = value.data;
    next();
  };
};

export default Validate;
