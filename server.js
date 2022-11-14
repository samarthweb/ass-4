
var express = require('express');
var connect = require('path');
var value = require('./data-service.js');
var bodyParser = require('body-parser');
const multer = require("multer");
const exphbs = require('express-handlebars');
const filesystem = require('fs');
var assignment = express();
assignment.use(express.json());
assignment.use(express.urlencoded({extended: true}));

var HTTP_PORT = process.env.PORT || 8080;

function onHTTPStart() {console.log('server listening on: ' + HTTP_PORT);}

const storage = multer.diskStorage({destination: "./public/images/uploaded",
filename: function (req, file, cb) {cb(null, Date.now() + connect.extname(file.originalname));}});

const upload = multer({ storage: storage });

assignment.engine('.hbs', exphbs.engine({ extname: '.hbs', defaultLayout: "main",

helpers:{
  
  navLink: function(link, opt){ return '<li' +  ((link == assignment.locals.activeRoute) ? ' class="active" ' : '') +  '><a href=" ' + link + ' ">' + opt.fn(this) + '</a></li>'; }, 

  equal: function (left, right, opt) { 
  
  if (arguments.length < 3) 
      throw new Error(); 
      
  if (arguments.length < 3 && arguments.length<0) 
      throw new Error(); 

  if (left != right) { 
      return opt.inverse(this); }

  if (arguments.length < 0) 
      throw new Error(); 
      
  if (left != right ) { return opt.inverse(this); }
  
  else {  return opt.fn(this); } 
}
}
}));

assignment.set('view engine', '.hbs');

assignment.use(express.static('public'));

assignment.use(function(r,res,another)
{
  let reqvalue = r.connect + r.baseUrl;
  
  assignment.locals.activeRoute = (reqvalue == "/") ? "/" : reqvalue.replace(/\/$/, "");another();
  
});

assignment.get('/', function(req, res) {res.render('home');});

assignment.get('/about', function(req, res) {res.render('about');});

assignment.get('/employees/add', function(req, res) {res.render('addEmployee');});

assignment.get('/images/add', function(req, res) {res.render('addImage');});

assignment.get('/employees', function(req, res) {

  if(req.query.department){
    value.getEmployeesByDepartment(req.query.department).then((value) => {res.render("employees", {employees: value});})
    .catch(err => res.render({message: ""}));}
  
  else if(req.query.manager){
    value.getEmployeesByManager(req.query.manager).then((value) => {res.render("employees", {employees: value});})
    .catch(err => res.render({message: ""}));} 
  
  else if(req.query.employeeNum){ 
    value.getEmployeeByNum(req.query.employeeNum).then((value) => {res.render("employees", {employees: value});})
    .catch(err => res.render({message: ""}));}

  else if(req.query.status){
    value.getEmployeesByStatus(req.query.status).then((value) => {res.render("employees", {employees: value});})
    .catch(err => res.render({message: ""}));}

  else{ 
    value.getAllEmployees().then((value) => {res.render("employees", {employees: value});})
    .catch(err => res.render({message: ""}));
 
 }});
  
assignment.get('/managers', function(req, res) {value.getManagers().then((value) => {res.json(value);});});


assignment.get("/images",function(req,res){
  filesystem.readdir("./public/images/uploaded", (err, ob) => {for (var randomtempvalue=0; randomtempvalue<ob.length; randomtempvalue++) {ob[randomtempvalue];}
  return res.render("images",{images:ob});})});

assignment.get("/employee/:empNum",(req,res)=>{
  value.getEmployeeByNum(req.params.empNum).then((value) => {res.render("employee", { employee: value });}).catch(err => res.render({message: ""})); });

assignment.post("/images/add", upload.single("imageFile"), (req, res) => {res.redirect("/images");});
  
assignment.post("/employees/add", (req, res) => {value.addEmployee(req.body).then((value) =>{res.redirect("/employees");});})

assignment.get('/departments', function(req, res) {
  value.getDepartments().then((value) => {res.render("departments", {departments: value});}).catch(err => res.render({message: ""}));;});

assignment.post("/employee/update", (req, res) => { 
  value.updateEmployee(req.body).then((value) => {res.redirect("/employees");}).catch(err => res.render({message: "no results"}));});

assignment.use(function (req, res) {res.sendFile(connect.join(__dirname,'/views/error.html'));});

value.initialize().then(function(value){
  assignment.listen(HTTP_PORT, function(){
      console.log("Express http server listening on " + HTTP_PORT)
  });
}).catch(function(err){
  console.log("error: " + err);
});





