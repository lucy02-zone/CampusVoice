const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        const storedRole = typeof req.user?.getDataValue === "function"
            ? req.user.getDataValue("role")
            : req.user?.role;
        const role = String(storedRole || "").trim().toUpperCase();
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
