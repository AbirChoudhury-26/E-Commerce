import jwt from 'jsonwebtoken';

export const generateToken = (user) => {
  // jwt.sign has 2 parameter mainly. First is Payload: The data such as UserID,roles etc & Second is :Secret Ket for signing the tokrn
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_KEY,
    {
      expiresIn: '2d',
    }
  );
};
