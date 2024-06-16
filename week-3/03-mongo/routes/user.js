const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
const { User, Course } = require("../db");

// User Routes
router.post('/signup', (req, res) => {
    // Implement user signup logic
    const username = req.body.username;
    const password = req.body.password;

    User.create({
        username,
        password
    })
    .then((user) => {
        res.json({
            message: 'User created successfully'
        })
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
    const courseId = req.params.courseId;
    const username = req.headers.username;

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

router.get('/purchasedCourses', userMiddleware, (req, res) => {
    // Implement fetching purchased courses logic
    // not working
    const username = req.headers.username;
    console.log(username)
    const user = User.findOne( { username } )
    Course.find({
        _id:{
            "$in": user.purchasedCourses
        }
    })
    .then((course) => {
        res.json({
            courses: course
        })
    })
});

module.exports = router