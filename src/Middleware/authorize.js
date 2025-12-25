export const authorization = (roles) => {
    return (req, res, next) => {
        if (roles.includes(req.role)) {
           return next();
        }
        return res.status(400).json({ success: false, message: 'permission denied' })
    }
}