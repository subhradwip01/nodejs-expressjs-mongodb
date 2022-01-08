exports.getFeed=(req,res,next)=>{
    res.status(200).json({
        posts:[{
            title:"First Post",
            constent:"This is the first"
        }]
    })
}

exports.createPost=(req,res,next)=>{
    const title=req.body.title;
    const content=req.body.content;
    res.status(201).json({
        message:"Post created succesfully",
        post:{
            id:new Date().toISOString(),
            title:title,
            content:content
        }
    })
}