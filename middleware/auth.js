import jwt from 'jsonwebtoken';

function auth(req,res,next) {
    const token = req.cookies.token;

    if(!token)
    {
        return res.status(401).json({
            messege:'Unauthorized'
        })
    }

    try{
          const decoded = jwt.verify(token,process.env.JWT_SECRET);

          req.user = decoded;

          return next();
    }
    catch (err)
    {
        return res.status(401).json({
            messege:'Unauthorized'
        })    
    }
}

export default auth;