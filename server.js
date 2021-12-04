/*********************************************************************************
 * WEB700 – Assignment 06
 * I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
 * of this assignment has been copied manually or electronically from any other source
 * (including 3rd party web sites) or distributed to other students.
 *
 * Name: Pulkit Yadav Student ID: 122260219 Date: 03 December 2021
 *
 * Online (Heroku) Link: https://web007-assignment5.herokuapp.com/
 *
 ********************************************************************************/

const express = require("express");
const app = express();
const path = require("path");
const Data = require("./modules/collegeData");
const { engine } = require("express-handlebars");

app.engine(
  ".hbs",
  engine({
    extName: ".hbs",
    defaultLayout: "main",
    helpers: {
      navLink: function (url, options) {
        return (
          "<li" +
          (url == app.locals.activeRoute
            ? ' class="nav-item active" '
            : ' class="nav-item" ') +
          '><a class="nav-link" href="' +
          url +
          '">' +
          options.fn(this) +
          "</a></li>"
        );
      },
      equal: function (lvalue, rvalue, options) {
        if (arguments.length < 3)
          throw new Error("Handlebars Helper equal needs 2 parameters");
        if (lvalue != rvalue) {
          return options.inverse(this);
        } else {
          return options.fn(this);
        }
      },
    },
  })
);

app.set("view engine", ".hbs");

const HTTP_PORT = process.env.PORT || 8080;

app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));

app.use(function (req, res, next) {
  let route = req.baseUrl + req.path;
  app.locals.activeRoute = route == "/" ? "/" : route.replace(/\/$/, "");
  next();
});

app.post("/students/add", (req, res) => {
  Data.addStudent(req.body).then(() => {
    res.redirect("/students");
  });
});

app.post("/courses/add", (req, res) => {
  Data.addCourse(req.body)
    .then(() => {
      res.redirect("/courses");
    })
    .catch((err) => {
      res.json({ message: "no results" });
    });
});

app.post("/student/update", (req, res) => {
  Data.updateStudent(req.body)
    .then(() => {
      res.redirect("/students");
      console.log(req.body);
    })
    .catch(() => {
      res.json({ message: "Error" });
    });
});

app.post("/course/update", (req, res) => {
  Data.updateCourse(req.body)
    .then(() => {
      res.redirect("/courses");
    })
    .catch(() => {
      res.json({ message: "error" });
    });
});

app.get("/students", (req, res) => {
  if (req.query.course) {
    Data.getStudentsByCourse(req.query.course)
      .then((studentData) => {
        res.render("students", {
          students: studentData,
        });
      })
      .catch(() => {
        res.render("students", {
          message: "no results",
        });
      });
  } else {
    Data.getAllStudents()
      .then((data) => {
        if (data.length > 0) {
          res.render("students", { students: data });
        } else {
          res.render("students", { message: "no results" });
        }
      })
      .catch(() => {
        res.render("students", { message: "no results" });
      });
  }
});

app.get("/courses", (req, res) => {
  Data.getCourses()
    .then((coursesData) => {
      if (coursesData.length > 0) {
        res.render("courses", {
          courses: coursesData,
        });
      } else {
        res.render("courses", { message: "No results" });
      }
    })
    .catch(() => {
      res.status(500).render("courses", { message: "no results" });
    });
});

app.get("/student/:studentNum", (req, res) => {
  let viewData = {};
  Data.getStudentByNum(req.params.studentNum)
    .then((data) => {
      if (data) {
        viewData.student = data;
      } else {
        viewData.student = null;
      }
    })
    .catch(() => {
      viewData.student = null;
    })
    .then(Data.getCourses)
    .then((data) => {
      viewData.courses = data;
      for (let i = 0; i < viewData.courses.length; i++) {
        if (viewData.courses[i].courseId == viewData.student.course) {
          viewData.courses[i].selected = true;
        }
      }
    })
    .catch(() => {
      viewData.courses = [];
    })
    .then(() => {
      if (viewData.student == null) {
        res.status(404).send("Student Not Found");
      } else {
        res.render("student", { viewData: viewData });
      }
    });
});

app.get("/course/:id", (req, res) => {
  Data.getCourseById(req.params.id)
    .then((data) => {
      if (data == undefined) {
        res.status(404).send("Course Not Found");
      } else {
        res.render("course", {
          course: data,
        });
      }
    })
    .catch(() => {
      res.status(500).render("course", { message: "no results" });
    });
});

app.get("/course/delete/:id", (req, res) => {
  Data.deleteCourseById(req.params.id)
    .then(() => {
      res.redirect("/courses");
    })
    .catch(() => {
      res
        .status(500)
        .json({ message: "Unable to Remove Course / Course not found)" });
    });
});

app.get("/student/delete/:studentNum", (req, res) => {
  Data.deleteStudentByNum(req.params.studentNum)
    .then(() => {
      res.redirect("/students");
    })
    .catch(() => {
      res
        .status(500)
        .json({ message: "Unable to Remove Student / Student not found)" });
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
  Data.getCourses()
    .then((data) => {
      res.render("addStudent", { courses: data });
    })
    .catch(() => {
      res.render("addStudent", { courses: [] });
    });
});

app.get("/courses/add", (req, res) => {
  res.render("addCourse");
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
