/**
 * Role-based access control middleware
 * Used to restrict access to certain routes based on user role
 */

// Check if user has one of the specified roles
const hasRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }
    
    if (roles.includes(req.user.role)) {
      return next();
    }
    
    return res.status(403).json({
      success: false,
      message: 'Access denied. Insufficient permissions.'
    });
  };
};

// Role-specific middleware
const isPharmacy = (req, res, next) => {
  return hasRole(['pharmacy', 'admin'])(req, res, next);
};

const isDistributor = (req, res, next) => {
  return hasRole(['distributor', 'admin'])(req, res, next);
};

const isAdmin = (req, res, next) => {
  return hasRole(['admin'])(req, res, next);
};

module.exports = {
  hasRole,
  isPharmacy,
  isDistributor,
  isAdmin
};
