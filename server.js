/*********************************************************************************
* WEB700 – Assignment 05
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Pulkit Yadav Student ID: 122260219 Date: 18 November 2021
*
* Online (Heroku) Link: https://web007-assignment5.herokuapp.com/
*
********************************************************************************/

const express = require("express");
const app = express();
const path = require("path");
const Data = require("./modules/collegeData");
const { engine } = require('express-handlebars');

app.engine(".hbs", engine({
  extName: ".hbs",
  defaultLayout: "main",
  helpers: {
    navLink: function(url, options){
      return '<li' +
      ((url == app.locals.activeRoute) ? ' class="nav-item active" ' : ' class="nav-item" ') +
      '><a class="nav-link" href="' + url + '">' + options.fn(this) + '</a></li>';
     },
     equal: function (lvalue, rvalue, options) {
      if (arguments.length < 3)
      throw new Error("Handlebars Helper equal needs 2 parameters");
      if (lvalue != rvalue) {
      return options.inverse(this);
      } else {
      return options.fn(this);
      }
     }
  }
}));

app.set("view engine", ".hbs");

const HTTP_PORT = process.env.PORT || 8080;

app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));

app.use(function(req,res,next){
  let route = req.baseUrl + req.path;
  app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
  next();
 });

app.post("/students/add", (req, res) => {
  Data.addStudent(req.body)
    .then(() => {
      res.redirect("/students");
    })
    .catch((err) => {
      res.json({ message: "no results" });
    });
});

app.post("/student/update", (req, res) => {
  Data.updateStudent(req.body)
  .then(()=>{
    res.redirect("/students");
    console.log(req.body)
  }).catch(()=>{
    res.json({ message: "Error"});
  })
 });

app.get("/students", (req, res) => {
  if (req.query.course) {
    Data.getStudentsByCourse(req.query.course)
      .then((coursedata) => {
        res.json(coursedata);
      })
      .catch((err) => {
        res.status(500).json({ message: "no results" });
      });
  } else {
    Data.getAllStudents()
      .then((studentsData) => {
        res.render("students", {
          students: studentsData
        });
      })
      .catch(() => {
        res.status(500).render("students", {message: "no results"});
      });
  }
});

// app.get("/tas", (req, res) => {
//   Data.getTAs()
//     .then((tas) => {
//       res.json(tas);
//     })
//     .catch(() => {
//       res.status(500).json({ message: "no results" });
//     });
// });

app.get("/courses", (req, res) => {
  Data.getCourses()
    .then((coursesData) => {
      res.render("courses", {
        courses: coursesData
      });
    })
    .catch(() => {
      res.status(500).render("courses", {message: "no results"});
    });
});

app.get("/student/:num", (req, res) => {
  Data.getStudentByNum(req.params.num)
    .then((data) => {
      res.render("student", { student: data });
    })
    .catch((err) => {
      res.status(500).render("student", {message: "no results"});
    });
});

app.get("/course/:id", (req, res) => {
  Data.getCourseById(req.params.id)
    .then((data) => {
      res.render("course", {
        course: data
      });
    })
    .catch((err) => {
      res.status(500).render("course", {message: "no results"});
    });
});

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/htmlDemo", (req, res) => {
  res.render("htmlDemo");
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/students/add", (req, res) => {
  res.render("addStudent");
});

app.use((req, res) => {
  res.status(404).send("Error 404: Page Not Found");
});

Data.initialize()
  .then(() => {
    app.listen(HTTP_PORT, () => {
      console.log("Server listening on " + HTTP_PORT);
    });
  })
  .catch((err) => {
    console.log("Sorry, not able to run the server.");
  });
