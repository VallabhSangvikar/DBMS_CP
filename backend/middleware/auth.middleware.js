const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
  const token = req.headers['x-access-token'] || req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    req.userType = decoded.userType;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

exports.isStudent = (req, res, next) => {
  if (req.userType !== 'student') {
    return res.status(403).json({ message: 'Require Student Role' });
  }
  next();
};

exports.isFaculty = (req, res, next) => {
  if (req.userType !== 'faculty') {
    return res.status(403).json({ message: 'Require Faculty Role' });
  }
  next();
};

exports.isInstitute = (req, res, next) => {
  if (req.userType !== 'institute') {
    return res.status(403).json({ message: 'Require Institute Role' });
  }
  next();
};
