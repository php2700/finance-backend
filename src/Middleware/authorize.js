export const authorization = (roles = []) => {
  return (req, res, next) => {
    if (!req.role) {
      return res.status(401).json({ message: 'Role not found' });
    }

    if (!roles.includes(req.role)) {
      return res
        .status(403)
        .json({ success: false, message: 'Permission denied' });
    }

    next();
  };
};
