const express = require('express')
const router = express.Router()
const post = require('../models/posts')

router.get('', async (req, res) => {
    const locals = {
        title: 'Node Blog',
        description:'Blog created with nodejs, express y mongodb'
    }
    try {
        const data = await post.find()
        res.render('index', {locals, data, currentRoute:'/'})
    } catch(error) {
        console.log(error)
    }
})

router.get('/post/:id', async (req, res) => {
    try {
        const locals = {
            title: 'Node Blog',
            description:'Blog created with nodejs, express y mongodb'
        }
        let slug = req.params.id
        const data = await post.findById({_id:slug})
        res.render('post', {locals, data, currentRoute:`/post/${slug}`})
    } catch(error) {
        console.log(error)
    }
})

router.post('/search', async (req, res) => {
    try {
        const locals = {
          title: "Search",
          description: "Simple Blog created with NodeJs, Express & MongoDb."
        }
    
        let searchTerm = req.body.searchTerm;
        const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "")
    
        const data = await post.find({
          $or: [
            { title: { $regex: new RegExp(searchNoSpecialChar, 'i') }},
            { body: { $regex: new RegExp(searchNoSpecialChar, 'i') }}
          ]
        });
    
        res.render("search", {data, locals, currentRoute: '/'});
    
      } catch (error) {
        console.log(error);
      }
})

router.get('/about', (req, res) => {
    res.render('about', {
        currentRoute:'/about'
    })
})

// use this function to add post to add a post as example
/*function insertPostData(){
    post.insertMany([
        {
            title:"Building a Blog",
            body: "This is the body text"
        },
    ])
}
insertPostData()*/

module.exports = router