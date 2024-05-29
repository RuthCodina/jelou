const express = require('express')
const router = express.Router()
const post = require('../models/posts')
const user = require('../models/users')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const adminLayout = '../views/layouts/admin'
const jwtSecret = process.env.JWT_SECRET

/* logging verification*/
const authMiddleware = (req, res, next ) => {
    const token = req.cookies.token;
    if(!token) {
      return res.status(401).json( { message: 'Unauthorized'} );
    }
    try {
      const decoded = jwt.verify(token, jwtSecret);
      req.userId = decoded.userId;
      next();
    } catch(error) {
      res.status(401).json( { message: 'Unauthorized'} );
    }
  }

/* login page */ 
router.get('/admin', async (req, res) => {
    try {
      const locals = {
        title: "Admin",
        description: "Simple Blog created with NodeJs, Express & MongoDb."
      }
      res.render('admin/index', { locals, layout: adminLayout });
    } catch (error) {
      console.log(error.message);
    }
  });
  
  /* admin - logging */
 router.post('/admin', async (req, res) => {
    try {
      const { username, password } = req.body;
      const userExists = await user.findOne( { username } );
  
      if(!userExists) {
        return res.status(401).json( { message: "username doesn't exist" } );
      }

      const isPasswordValid = await bcrypt.compare(password, userExists.password);
  
      if(!isPasswordValid) {
        return res.status(401).json( { message: 'Invalid password' } );
      }

      const token = jwt.sign({ userId: user._id}, jwtSecret );
      res.cookie('token', token, { httpOnly: true });
      res.redirect('/dashboard');
    } catch (error) {
      console.log(error.message);
    }
  });

//admin - register 
router.post('/register', async (req, res) => {
    try {
      const { username, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      try {
        const newUser = new user ({ username, password:hashedPassword })
        const userCreated = await newUser.save();
        res.status(201).json({ message: 'User Created', user });
      } catch (error) {
        if(error.code === 11000) {
          res.status(409).json({ message: 'User already in use'});
        }
        console.log(error)
        res.status(500).json({ message: 'Internal server error'})
      }
    } catch (error) {
      console.log(error.message);
    }
  });


// Admin Dashboard
router.get('/dashboard', authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: 'Dashboard',
      description: 'Blog created with NodeJs, Express & MongoDb.'
    }

    const data = await post.find();
    res.render('admin/dashboard', {
      locals,
      data,
      layout: adminLayout
    });

  } catch (error) {
    console.log(error.message);
  }

});


//Add Post
router.get('/add-post', authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: 'Add Post',
      description: 'Simple Blog created with NodeJs, Express & MongoDb.'
    }

    const data = await post.find();
    res.render('admin/add-post', {
      locals,
      layout: adminLayout
    });

  } catch (error) {
    console.log(error);
  }
});

// Create Post
router.post('/add-post', authMiddleware, async (req, res) => {
  try {
    try {
      const newPost = new post({
        title: req.body.title,
        body: req.body.body
      });

      await post.create(newPost);
      res.redirect('/dashboard');
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error.message);
  }
});

//Edit post
router.get('/edit-post/:id', authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: "Edit Post",
      description: "Free NodeJs User Management System",
    };
    const data = await post.findOne({ _id: req.params.id });
    res.render('admin/edit-post', {
      locals,
      data,
      layout: adminLayout
    })
  } catch (error) {
    console.log(error.message);
  }
});

router.put('/edit-post/:id', authMiddleware, async (req, res) => {
  try {
    await post.findByIdAndUpdate(req.params.id, {
      title: req.body.title,
      body: req.body.body,
      updatedAt: Date.now()
    });
    res.redirect(`/edit-post/${req.params.id}`);
  } catch (error) {
    console.log(error.message);
  }
});

//Delete post
router.delete('/delete-post/:id', authMiddleware, async (req, res) => {
  try {
    await post.deleteOne( { _id: req.params.id } );
    res.redirect('/dashboard');
  } catch (error) {
    console.log(error.message);
  }
});


// Logout
router.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/');
});

module.exports = router