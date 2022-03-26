const Sequelize = require("sequelize");
var sequelize = new Sequelize(
  "d9kclgfp57jdk6",
  "vhwtigiknmpqbn",
  "2ba4b03a4639cf6e166555eb9270e1f562bda87aa9673981797b49b78f142939",
  {
    host: "ec2-54-147-76-191.compute-1.amazonaws.com",
    dialect: "postgres",
    port: 5432,
    dialectOptions: {
      ssl: { rejectUnauthorized: false },
    },
    query: { raw: true },
  }
);

const Student = sequelize.define("Student", {
  studentNum: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  firstName: Sequelize.STRING,
  lastName: Sequelize.STRING,
  email: Sequelize.STRING,
  addressStreet: Sequelize.STRING,
  addressCity: Sequelize.STRING,
  addressProvince: Sequelize.STRING,
  TA: Sequelize.BOOLEAN,
  status: Sequelize.STRING,
});

const Course = sequelize.define("Course", {
  courseId: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  courseCode: Sequelize.STRING,
  courseDescription: Sequelize.STRING,
});

Course.hasMany(Student, { foreignKey: "course" });

module.exports.initialize = function () {
  return new Promise((resolve, reject) => {
    sequelize
      .sync()
      .then(() => {
        resolve();
      })
      .catch(() => {
        reject("unable to sync the database");
      });
  });
};

module.exports.getAllStudents = function () {
  return new Promise((resolve, reject) => {
    Student.findAll()
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject("no results returned");
      });
  });
};

module.exports.getTAs = function () {
  return new Promise(function (resolve, reject) {
    Student.findAll({
      where: {
        TA: true,
      },
    })
      .then((data) => {
        resolve(data);
      })
      .catch(() => {
        reject("no results returned");
      });
  });
};

module.exports.getCourses = function () {
  return new Promise(function (resolve, reject) {
    Course.findAll()
      .then((data) => {
        resolve(data);
      })
      .catch(() => {
        reject("no results returned");
      });
  });
};

module.exports.getStudentsByCourse = function (courseData) {
  return new Promise(function (resolve, reject) {
    Student.findAll({
      where: {
        course: courseData,
      },
    })
      .then((data) => {
        resolve(data);
      })
      .catch(() => {
        reject("no results returned");
      });
  });
};

module.exports.getStudentByNum = function (num) {
  return new Promise((resolve, reject) => {
    Student.findAll({
      where: {
        studentNum: num,
      },
    })
      .then((data) => {
        resolve(data);
      })
      .catch(() => {
        reject("no results returned");
      });
  });
};

module.exports.getCourseById = function (num) {
  return new Promise((resolve, reject) => {
    Course.findAll({
      where: {
        courseId: num,
      },
    })
      .then((data) => {
        resolve(data);
      })
      .catch(() => {
        reject("no results returned");
      });
  });
};

module.exports.updateStudent = function (studentData) {
  studentData.TA = studentData.TA ? true : false;
  for (let i in studentData) {
    if (studentData[i] == "") {
      studentData[i] = null;
    }
  }
  return new Promise((resolve, reject) => {
    Student.update(studentData, {
      where: {
        studentNum: studentData.studentNum,
      },
    })
      .then(() => {
        resolve("Updated");
      })
      .catch(() => {
        reject("unable to update student");
      });
  });
};

module.exports.addCourse = function (courseData) {
  for (let i in courseData) {
    if (courseData[i] == "") {
      courseData[i] = null;
    }
  }
  return new Promise((resolve, reject) => {
    Course.create(courseData)
      .then(() => {
        resolve("Created");
      })
      .catch(() => {
        reject("unable to create course");
      });
  });
};

module.exports.addStudent = function (studentData) {
  studentData.TA = studentData.TA ? true : false;

  for (let i in studentData) {
    if (studentData[i] == "") {
      studentData[i] = null;
    }
  }

  return new Promise(function (resolve, reject) {
    Student.create(studentData)
      .then(() => {
        resolve("new student added");
      })
      .catch(() => {
        reject("unable to add new student");
      });
  });
};

module.exports.updateCourse = function (courseData) {
  for (let i in courseData) {
    if (courseData[i] == "") {
      courseData[i] = null;
    }
  }
  return new Promise((resolve, reject) => {
    Course.update(courseData, {
      where: {
        courseId: courseData.courseId,
      },
    })
      .then(() => {
        resolve("Updated");
      })
      .catch(() => {
        reject("unable to update course");
      });
  });
};

module.exports.deleteCourseById = function (id) {
  return new Promise((resolve, reject) => {
    Course.destroy({
      where: {
        courseId: id,
      },
    })
      .then(() => {
        resolve("destroyed");
      })
      .catch((err) => {
        reject(err);
      });
  });
};

module.exports.deleteStudentByNum = function (num) {
  return new Promise((resolve, reject) => {
    Student.destroy({
      where: {
        studentNum: num,
      },
    })
      .then(() => {
        resolve("destroyed");
      })
      .catch((err) => {
        reject(err);
      });
  });
};
