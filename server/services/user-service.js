
import User from "../models/user";

module.exports = class UserService {

    getUsers = async ()=>{ 
        const users = await User.find({});
        return users.reduce((acc,user) =>{
            return [ ...acc,
            {
                id: user._id,
                name: user.name,
                age:user.age
            }];
        }, []);
    };
    getUser = async (req) => {
        const user = await User.findById(req.params.id) ;
       return {
           name: user.name,
           age: user.age,
           id: user._id
       };
    }
    addUser = async (req) =>{
        const user = await User.create(req.body);
        return {
            name:user.name,
            age:user.age,
            id: user._id
        };
    }

    deleteUser = async (req) => await User.deleteOne({_id: req.params.id});
    

    editUser = async (req) =>{
        await User.findByIdAndUpdate(
            { _id: req.body.id },
            {
                name:req.body.name,
                age: req.body.age
            },
            {
                useFindAndModify: false
            }
        );
        return req.body;
    }

}