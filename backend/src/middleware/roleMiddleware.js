const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        const role = String(req.user?.role || "").trim().toUpperCase();
        const normalizedAllowedRoles = allowedRoles.map((allowedRole) => String(allowedRole).trim().toUpperCase());
        if (!normalizedAllowedRoles.includes(role)) {
            return res.status(403).json({
                success: false,
                message: "Access denied",
            });
        }

        next();
    };
};

module.exports = authorize;
