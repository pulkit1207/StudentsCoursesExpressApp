class Data {
  constructor(students, courses) {
    this.students = students;
    this.courses = courses;
  }
}

var dataCollection = [];
const fs = require("fs");
const { resolve } = require("path");

var courseDataFromFile = [];
var studentDataFromFile = [];

module.exports.initialize = function () {
  return new Promise(function (resolve, reject) {
    fs.readFile("./data/courses.json", "utf-8", function (err, data1) {
      if (err) {
        reject("unable to read courses.json");
      }
      courseDataFromFile = JSON.parse(data1);

      fs.readFile("./data/students.json", "utf-8", function (err, data2) {
        if (err) {
          reject("unable to read students.json");
        }
        studentDataFromFile = JSON.parse(data2);
        resolve();
      });
    });
  });
};

dataCollection = new Data(studentDataFromFile, courseDataFromFile);

module.exports.getAllStudents = function () {
  return new Promise(function (resolve, reject) {
    if (studentDataFromFile.length == 0) {
      reject("no results returned");
    } else {
      resolve(studentDataFromFile);
    }
  });
};

module.exports.getTAs = function () {
  return new Promise(function (resolve, reject) {
    var taArray = [];
    if (studentDataFromFile.length == 0) {
      reject("no results returned");
    } else {
      for (i = 0; i < studentDataFromFile.length; i++) {
        if (studentDataFromFile[i].TA == true) {
          taArray.push(studentDataFromFile[i]);
        }
        resolve(taArray);
      }
    }
  });
};

module.exports.getCourses = function () {
  return new Promise(function (resolve, reject) {
    if (studentDataFromFile.length == 0) {
      reject("no results returned");
    } else {
      resolve(courseDataFromFile);
    }
  });
};

module.exports.getStudentsByCourse = function (course1) {
  return new Promise((resolve, reject) => {
    var j = 0;
    let arrStudents = [];
    for (i = 0; i < studentDataFromFile.length; i++) {
      if (studentDataFromFile[i].course == course1) {
        arrStudents[j] = studentDataFromFile[i];
        j++;
      }
    }
    if (arrStudents != 0) {
      resolve(arrStudents);
    } else {
      reject("no results returned");
    }
  });
};

module.exports.getStudentByNum = function (num) {
  return new Promise((resolve, reject) => {
    var student = null;
    for (i = 0; i < studentDataFromFile.length; i++) {
      if (studentDataFromFile[i].studentNum == num) {
        student = studentDataFromFile[i];
        break;
      }
    }
    if (student) {
      resolve(student);
    } else {
      reject("no results returned");
    }
  });
};

module.exports.addStudent = function (studentData) {
  return new Promise((resolve, reject) => {
    if (studentData) {
      if (studentData.TA == undefined) {
        studentData.TA = false;
      } else {
        studentData.TA = true;
      }
      studentData.studentNum = studentDataFromFile.length + 1;
      studentDataFromFile.push(studentData);
      resolve(studentDataFromFile);
    } else {
      reject("no results returned");
    }
  });
};

module.exports.getCourseById = function (num) {
  return new Promise((resolve, reject) => {
    var course = null;
    for (i = 0; i < courseDataFromFile.length; i++) {
      if (courseDataFromFile[i].courseId == num) {
        course = courseDataFromFile[i];
        break;
      }
    }
    if (course) {
      resolve(course);
    } else {
      reject("query returned 0 results");
    }
  });
};

module.exports.updateStudent = function (studentData) {
  return new Promise((resolve, reject) => {
    if (studentData) {
      if (studentData.TA == undefined) {
        studentData.TA = false;
      } else {
        studentData.TA = true;
      }
      for (i = 0; i < studentDataFromFile.length; i++) {
        if (studentDataFromFile[i].studentNum == studentData.studentNum) {
          studentDataFromFile[i] = studentData;
          resolve();
        }
      }
    }
  });
};
