var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');



var  userSchema = new Schema({
        firstname:String,  
        lastname:String,
        email: String,
        gender: String,
        password:String ,
        dob: String,
        address:String,
        company:String,
        userType:String,
       });

var  employeeSchema = new Schema({
        empfirstname:String,  
        emplastname:String,
        empid: String,
        empgender: String,
        empmobile:String ,
        empdob: Date,
        empjoining: Date,
        deptName: String,
        password: String,
        empaddress:String,
        empcity:String,
        userType:String
       });

var leaveStatusInfoSchema = new Schema({
        empid: String,
        fromDate: Date,
        toDate: Date,
        leaveStatus: String
});

userSchema.methods.encryptPassword = function(password){
        return bcrypt.hashSync(password , bcrypt.genSaltSync(5), null);

}; 


userSchema.methods.validPassword = function(password){
        return bcrypt.compareSync(password, this.password);

}; 

var User = mongoose.model('User' , userSchema ,  'user');

var Employee = mongoose.model('Employee' , employeeSchema ,  'user');

var LeaveStatusInfo = mongoose.model('LeaveStatusInfo', leaveStatusInfoSchema, 'user');

module.exports = {
        User: User,
        Employee : Employee,
        LeaveStatusInfo: LeaveStatusInfo
}
       


 



