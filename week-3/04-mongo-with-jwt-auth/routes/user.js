const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
const { User, Course } = require("../db");
const jwt = require("jsonwebtoken");
const {JWT_SECRET} = require("../config");

// User Routes
router.post('/signup', (req, res) => {
    // Implement user signup logic
    const username = req.body.username;
    const password = req.body.password;

    User.create({
        username,
        password
    })
    .then( () => {
        res.json({
            message: "User created successfully"
        })
    })
});

router.post('/signin', (req, res) => {
    // Implement admin signup logic
    const username = req.body.username;
    const token = jwt.sign({username}, JWT_SECRET);
    res.json({
        token: token
    })
});

router.get('/courses', (req, res) => {
    // Implement listing all courses logic
    Course.find()
    .then((allCourse) =>{
        res.json({
            courses: allCourse
        })
    })
});

router.post('/courses/:courseId', userMiddleware, (req, res) => {
    // Implement course purchase logic
    const username = req.username;
    const courseId = req.params.courseId;

    User.updateOne( {username: username}, 
        {
            "$push": {
                purchasedCourses: courseId
            }
        })
        .then(() => {
            res.json({
                message: 'Course purchased successfully'
            })
        })

});

router.get('/purchasedCourses', userMiddleware, async (req, res) => {
    // Implement fetching purchased courses logic
    const username = req.username;
    const user = await User.findOne( { username } )

    // If user is not found, send a 404 response
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    const courses = await Course.find({
        _id: { "$in": user.purchasedCourses }
    });
    
    res.json({
        courses: courses
    });
});

module.exports = router