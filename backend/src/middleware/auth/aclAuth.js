'use strict';


function acl(action) {

    return (req, res, next)=>{
        console.log('user inside acl middleware',req.user.actions);
        try {

            if (req.user.actions.includes(action)) {
                next();

            }else{
                next('access denied from aclAuth');
            }
        } catch (error) {

        }
    }

}

module.exports =acl;