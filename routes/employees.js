var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Employee = mongoose.model('Employee');
var LeaveStatusInfo = mongoose.model('LeaveStatusInfo');


// post method for inserting a employees in database
router.post("/", (req, res, next) => {
    Employee.findOne({ 'empid': req.body.empid }, (err, user) => {
        if (err) {
            return res.json({ message: err, class: 'danger' });
        }
        if (user) {
            return res.json({ message: 'employee Id is already in use.', class: 'danger' });
        }

        var empJoiningDate = new Date(req.body.empjoining);
        if (req.body.empjoining === "" || req.body.empjoining === undefined) {
            return res.json({ message: 'joining date error', class: 'danger' });
        }
        var empDOB = new Date(req.body.empdob);
        if (req.body.empdob === "" || req.body.empdob === undefined) {
            return res.json({ message: 'DOB error', class: 'danger' });
        }
        var today = new Date();
        var empAge = today.getFullYear() - empDOB.getFullYear();

        if (req.body.empfirstname === "" || req.body.empfirstname === undefined) {
            return res.json({ message: 'Name must be alphabet', class: 'danger' });
        }

        if (req.body.emplastname === "" || req.body.emplastname === undefined) {
            return res.json({ message: 'Name must be alphabet', class: 'danger' });
        }

        if (req.body.password === "" || req.body.password === undefined) {
            return res.json({ message: 'Password wrong', class: 'danger' });
        }

        if (empJoiningDate.getTime() < empDOB) {
            return res.json({ message: 'Date of joining is wrong', class: 'danger' });
        } else if (empAge < 18 || empAge > 58) {
            return res.json({ message: 'Date of joining is wrong', class: 'danger' });
        }

        var myData = new Employee();
        myData.empid = req.body.empid;
        myData.empfirstname = req.body.empfirstname;
        myData.empgender = req.body.empgender;
        myData.emplastname = req.body.emplastname;
        myData.empcity = req.body.empcity;
        myData.empdob = req.body.empdob;
        myData.empjoining = req.body.empjoining;
        myData.deptName = req.body.deptName;
        myData.password = req.body.password;
        myData.empaddress = req.body.empaddress;
        myData.empmobile = req.body.empmobile;
        myData.userType= req.body.userType;
        myData.save()
            .then(item => {
                Employee.find({}, (inner_err, data) => {
                    if (inner_err) {
                        res.json({ message: "No employee records found", error: inner_err })
                    }
                    else {
                        res.json({ data: data, message: "Employee successfully inserted", class: "success" });
                    }
                });

            })
            .catch(err => {
                res.status(400).json({ message: "error 404" });
            });
    });
});


// get method for getting all employees
router.get('/getemployees', (req, res, next) => {

     Employee.find({}, (err, data) => {
        if (err) {
            res.json({ msg: "No employee records found", error: err })
        }
        else {
            res.json({ data: data });
        }
    });

});

// get method for get employee by id for single employee
router.get('/employee/:id', function (req, res, next) {

    console.log(req.params.id);

     Employee.remove({ "_id": req.params.id }, function (err, data) {

        if (err) {
            res.json({ message: err });
        }

        if (res.status(200)) {
              Employee.find({}, function (inner_err, inner_data) {
                if (err) {
                    res.json({ msg: "No employee records found", error: inner_err })
                }
                else {
                    res.json({ data: inner_data });
                }
            });

        }
    });
});

// get method to update a employee record
router.get('/update/:id', (req, res, next) => {

       Employee.findById({ '_id': req.params.id }, (err, user) => {
        if (err) {
            return res.json({ message: err, class: 'danger' });
        }
        if (user) {
            return res.json({ user: user });
        }
    });
});


// post method for update a employee details
router.post('/update', (req, res, next) => {

       Employee.updateOne({ "_id": req.body._id }, { $set: req.body }, (err, result) => {
        if (err) { res.json({ message: err }) };
        if (res.status(200)) {
              Employee.find({}, (inner_err, data) => {
                if (inner_err) {
                    res.json({ message: "No employee records found", error: inner_err })
                }
                else {
                    res.json({ data: data, message: " updated successfully ", class: "success" });
                }
            });

        }
    });
});

// get method to view a employee details
router.get('/viewbyid/:id', (req, res, next) => {
      Employee.findById({ '_id': req.params.id }, (err, user) => {
        if (err) {
            return res.json({ message: err, class: 'danger' });
        }
        if (user) {
            return res.json({ user: user });
        }
    });
});

router.post("/apply-leave", (req, res, next) => {
    Employee.findOne({ 'empid': req.body.empid }, (err, user) => {
        if (err) {
            return res.json({ message: err, class: 'danger' });
        }
        var myData = new LeaveStatusInfo();
        myData.empid = req.body.empid;
        myData.fromDate = req.body.fromDate;
        myData.toDate = req.body.toDate;
        myData.leaveStatus = "PENDING_FOR_APPROVAL";
        if (req.body.fromDate === "" || req.body.fromDate === undefined) {
            return res.json({ message: 'from-date wrong', class: 'danger' });
        }
        if (req.body.toDate === "" || req.body.toDate === undefined) {
            return res.json({ message: 'to-date wrong', class: 'danger' });
        }
        var fromDate = new Date(req.body.fromDate);
        var toDate = new Date(req.body.toDate);
        var today = new Date();

        if (fromDate.getTime() <= today.getTime()) {
            res.status(400).json({ message: "error 404" });
        } else if (toDate.getTime() < fromDate.getTime()) {
            res.status(400).json({ message: "error 404" });
        } else {
            myData.save()
                .then(item => {
                    LeaveStatusInfo.find({ 'empid': req.body.empid }, (inner_err, data) => {
                        if (inner_err) {
                            res.json({ message: "No employee records found", error: inner_err })
                        }
                        else {
                            res.json({ data: data, message: "", class: "success" });
                        }
                    });
                })
                .catch(err => {
                    console.log(err);
                    res.status(400).json({ message: "error 404" });
                });
        }
    });
});
router.post("/approve", (req, res, next) => {
    Employee.findOne({ 'empid': req.body.empid }, (err, user) => {
        if (err) {
            return res.json({ message: err, class: 'danger' });
        }

        LeaveStatusInfo.updateOne({ "empid": req.body.empid }, { "leaveStatus" : "APPROVED" }, (err, result) => {
            if (err) { res.json({ message: err }) }
            if (res.status(200)) {
                Employee.find({ "empid": req.body.empid }, (inner_err, data) => {
                    if (inner_err) {
                        res.json({ message: "No employee records found", error: inner_err })
                    }
                    else {
                        res.json({ data: data, message: " updated successfully ", class: "success" });
                    }
                });
            }
        });
    });
});


router.post("/reject", (req, res, next) => {
    Employee.findOne({ 'empid': req.body.empid }, (err, user) => {
        if (err) {
            return res.json({ message: err, class: 'danger' });
        }

        LeaveStatusInfo.updateOne({ "empid": req.body.empid }, { "leaveStatus" : "REJECT" }, (err, result) => {
            if (err) { res.json({ message: err }) }
            if (res.status(200)) {
                Employee.find({ "empid": req.body.empid }, (inner_err, data) => {
                    if (inner_err) {
                        res.json({ message: "No employee records found", error: inner_err })
                    }
                    else {
                        res.json({ data: data, message: " updated successfully ", class: "success" });
                    }
                });
            }
        });
    });
});


module.exports = router;

