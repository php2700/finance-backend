export const authorization = (roles) => {
  return (req, res, next) => {
    if (!req.role) {
      return res.status(401).json({ message: 'Role not found' });
    }
    if (roles.includes(req.role)) {
      return next();
    }
    return res
      .status(400)
      .json({ success: false, message: 'permission denied' });
  };
};
