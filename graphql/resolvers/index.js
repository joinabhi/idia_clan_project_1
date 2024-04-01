const postsResolvers=require('./post')
const usersResolvers=require('./user')

module.exports={
    Query:{
        ...postsResolvers.Query,
        ...usersResolvers.Query
    
    },
    Mutation:{
       
    ...usersResolvers.Mutation,
    ...postsResolvers.Mutation,
    }
}