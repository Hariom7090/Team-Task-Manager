const validateRequest = (req, res, next) => {
  try {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Title is required',
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};

export default validateRequest;