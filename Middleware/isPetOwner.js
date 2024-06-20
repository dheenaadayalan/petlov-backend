import User from "../Models/userModel.js";

export const isPetOwner = async (req, res, next) => {
    const userid = req.user.id;
    const userDetail = await User.findById(userid);
    const isPetOwner = userDetail.isPetOwner;
    if(isPetOwner){
        next();
    }else{
        res.status(403).json({message:'Unauthorized', isPetOwner:false})
    }
}