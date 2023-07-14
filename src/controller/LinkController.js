const mongoose = require("mongoose");
const Util = require('./../help/index')

const { createAuthenInviteMember, findLink } = require("../model/LinkInvite.model");
const {  addMember } = require("../model/Project.model");



class LinkController {
  async sendLinkToInvite(req, res, next) {
    try {
      const {userId, projectId} = req.body;

      if( !userId ||!projectId) {
        return res.json( {status: false, message: 'Invalid data!!'})
      }

      const result = await createAuthenInviteMember(userId, projectId);

      if( result ) {
        const token = result.token;
        const link = 'localhost:5173' + `/authentication-join/?token=${token}`
        res.json( {status: true, message: 'Send link to invite successfully!!', link: link})
      
      }else {
          res.json( {status: false, message: 'Send link to invite failed!!'})
      }

    } catch (error) {
        console.error(error);
        next(error);
    }
  }

  async authenticationLinkInvite(req, res, next) {
    try {
        const {token, userId} = req.query;
        console.log({
          token, userId
        })
        if( !token ) {
            return res.json({status: false, message: 'Token is required'});
        }
        if ( userId == 'undefined') {
          return res.json({ status: false, message: 'UserId is required' });
        }
        
        if( !userId ) {
          return res.json({status: false, message: 'UserId is required'});
        }

        const link = await  findLink(token);

        if( link ) {
            const {projectId} = link;

            if(projectId) {
                const result = await addMember(userId, projectId);
                if( result) {
                    return res.json({status: true, message: 'Tham gia thanh cong! '});
                }else {
                    return res.json({status: false, message: 'Tham gia không thanh cong! '});
                }
            }else {
                return res.json({status: false, message: 'Token không hợp lệ! '});
            }

        }else{
            return res.json({status: false, message: 'Token không hợp lệ! '});
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
  }

 
}

module.exports = new LinkController();
