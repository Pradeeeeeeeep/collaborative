// Simple script to display student details

const student = {
    name: "Pradeep Kisku",
    rollNo: "CS2026-001",
    department: "Computer Science & Engineering",
    semester: "6th Semester",
    email: "pradeep@example.com"
};

function printStudentDetails(info) {
    console.log("=================================");
    console.log("        STUDENT DETAILS          ");
    console.log("=================================");
    console.log(`Name        : ${info.name}`);
    console.log(`Roll Number : ${info.rollNo}`);
    console.log(`Department  : ${info.department}`);
    console.log(`Semester    : ${info.semester}`);
    console.log(`Email       : ${info.email}`);
    console.log("=================================");
}

// Print details
printStudentDetails(student);
