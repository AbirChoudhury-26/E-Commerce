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
      expiresIn: '3d',
    }
  );
};

// Using this Function as an Middleware in our OrderRoutes Page ,so to get the User Token in our On eof the fields in Order Post
export const isAuth=(req,res,next)=>{
   const authorization=req.headers.authorization;
   if(authorization)
   {

    const token= authorization.slice(7, authorization.length);  // Bearer XXXX
    
    jwt.verify(
      token,
      process.env.JWT_KEY,
      (err,decode)=>{
         if(err)
          {
            res.status(401).send(({message:err}));
          }
          else{
            req.user=decode;
            next();
          }
      }
    )
   }
   

   // Creating a Callback function
    
}