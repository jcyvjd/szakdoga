import jwt from 'jsonwebtoken'

const generateTokenAndSetCookie = (userId, res) =>{
    const token = jwt.sign({userId},process.env.SECRET,{
        expiresIn: '3d'
    })

    res.cookie("jwt",token,{
        maxAge: 15 * 24 * 60 * 60 * 1000, //milisec love
        httpOnly: true,
        sameSite:"strict"
    })
}


export default generateTokenAndSetCookie
