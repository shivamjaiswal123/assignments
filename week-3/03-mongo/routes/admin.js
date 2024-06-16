const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const { Admin, Course } = require("../db");
const router = Router();

// Admin Routes
router.post('/signup', (req, res) => {
    // Implement admin signup logic
    const username = req.body.username;
    const password = req.body.password;

    Admin.create({
        username,
        password
    })
    .then(() => {
        res.json({
            message: "Admin created successfully"
        })
    })


});

router.post('/courses', adminMiddleware, (req, res) => {
    // Implement course creation logic
    const title = req.body.title;
    const description = req.body.description;
    const imageLink = req.body.imageLink;
    const price = req.body.price

    Course.create({
        title,
        description,
        imageLink,
        price
    })
    .then((newCourse) => {
        res.json({
            message: "Course created successfully", courseId: newCourse._id
        })
    })

});

router.get('/courses', adminMiddleware, (req, res) => {
    // Implement fetching all courses logic
    Course.find()
    .then((allCourse) =>{
        res.json({
            courses: allCourse
        })
    })
});

module.exports = router;