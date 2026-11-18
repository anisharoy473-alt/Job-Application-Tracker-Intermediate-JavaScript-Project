// ==========================================
// GET DATA FROM LOCAL STORAGE
// ==========================================

let users = JSON.parse(localStorage.getItem("users")) || [];
let jobs = JSON.parse(localStorage.getItem("jobs")) || [];
let currentUser = JSON.parse(localStorage.getItem("currentUser"));


// ==========================================
// DEFAULT ADMIN ACCOUNT
// ==========================================

let adminExists = false;

for (let i = 0; i < users.length; i++) {

    if (users[i].email.toLowerCase() === "admin@demo.com") {

        users[i].name = "Admin";
        users[i].email = "admin@demo.com";
        users[i].password = "admin123";
        users[i].role = "admin";

        adminExists = true;
        break;
    }
}

if (!adminExists) {

    users.push({
        name: "Admin",
        email: "admin@demo.com",
        password: "admin123",
        role: "admin"
    });
}

localStorage.setItem("users", JSON.stringify(users));


// ==========================================
// DEFAULT USER ACCOUNT
// ==========================================

let demoUserExists = false;

for (let i = 0; i < users.length; i++) {

    if (users[i].email.toLowerCase() === "user@demo.com") {
        demoUserExists = true;
        break;
    }
}

if (!demoUserExists) {

    users.push({
        name: "Demo User",
        email: "user@demo.com",
        password: "user123",
        role: "user"
    });

    localStorage.setItem("users", JSON.stringify(users));
}


// ==========================================
// DEFAULT JOBS
// ==========================================

if (jobs.length === 0) {

    jobs = [

        {
            id: 1,
            title: "Frontend Developer",
            company: "Tech Solutions",
            location: "Kolkata",
            type: "Full Time",
            salary: "₹20,000 - ₹30,000",
            description: "We are looking for a beginner-friendly frontend developer.",
            requirements: "HTML, CSS, JavaScript",
            applicants: []
        },

        {
            id: 2,
            title: "Web Development Intern",
            company: "Creative Technologies",
            location: "Remote",
            type: "Internship",
            salary: "₹8,000 - ₹12,000",
            description: "Work with our development team on real-world web projects.",
            requirements: "HTML, CSS and basic JavaScript",
            applicants: []
        },

        {
            id: 3,
            title: "Java Developer",
            company: "Digital World",
            location: "Kolkata",
            type: "Full Time",
            salary: "₹18,000 - ₹25,000",
            description: "Join our software development team.",
            requirements: "Java, OOP and basic SQL",
            applicants: []
        }
    ];

    localStorage.setItem("jobs", JSON.stringify(jobs));
}


// ==========================================
// SAVE DATA
// ==========================================

function saveUsers() {

    localStorage.setItem("users", JSON.stringify(users));
}

function saveJobs() {

    localStorage.setItem("jobs", JSON.stringify(jobs));
}


// ==========================================
// LOGIN AND SIGNUP PAGE
// ==========================================

function showLogin() {

    document.getElementById("loginBox").style.display = "block";
    document.getElementById("signupBox").style.display = "none";

    document.getElementById("loginTab").classList.add("active");
    document.getElementById("signupTab").classList.remove("active");
}


function showSignup() {

    document.getElementById("loginBox").style.display = "none";
    document.getElementById("signupBox").style.display = "block";

    document.getElementById("signupTab").classList.add("active");
    document.getElementById("loginTab").classList.remove("active");
}


// ==========================================
// REGISTER NEW USER
// ==========================================

function registerUser(event) {

    event.preventDefault();

    let name = document.getElementById("signupName").value.trim();

    let email = document.getElementById("signupEmail").value.trim().toLowerCase();

    let password = document.getElementById("signupPassword").value;

    let confirmPassword = document.getElementById("confirmPassword").value;


    if (password !== confirmPassword) {

        alert("Passwords do not match!");
        return;
    }

    if (password.length < 6) {

        alert("Password must contain at least 6 characters.");
        return;
    }


    for (let i = 0; i < users.length; i++) {

        if (users[i].email.toLowerCase() === email) {

            alert("This email is already registered.");
            return;
        }
    }


    let newUser = {

        name: name,
        email: email,
        password: password,
        role: "user"
    };


    users.push(newUser);

    saveUsers();

    alert("Account created successfully! Please log in.");

    document.querySelector("#signupBox form").reset();

    showLogin();
}


// ==========================================
// LOGIN USER OR ADMIN
// ==========================================

function loginUser(event) {

    event.preventDefault();

    let email = document.getElementById("loginEmail").value.trim().toLowerCase();

    let password = document.getElementById("loginPassword").value;

    let role = document.getElementById("loginRole").value.trim().toLowerCase();


    if (role === "") {

        alert("Please select User or Admin.");
        return;
    }


    let foundUser = null;


    for (let i = 0; i < users.length; i++) {

        if (
            users[i].email.toLowerCase() === email &&
            users[i].password === password &&
            users[i].role.toLowerCase() === role
        ) {

            foundUser = users[i];
            break;
        }
    }


    if (foundUser === null) {

        alert("Invalid email, password or account type.");
        return;
    }


    localStorage.setItem("currentUser", JSON.stringify(foundUser));


    if (foundUser.role.toLowerCase() === "admin") {

        window.location.href = "admin.html";

    } else {

        window.location.href = "user.html";
    }
}


// ==========================================
// LOGOUT
// ==========================================

function logoutUser() {

    localStorage.removeItem("currentUser");

    window.location.href = "home.html";
}


// ==========================================
// CHECK ADMIN ACCESS
// ==========================================

function checkAdmin() {

    let loggedInUser = JSON.parse(localStorage.getItem("currentUser"));

    if (loggedInUser === null || loggedInUser.role.toLowerCase() !== "admin") {

        alert("Please log in as Admin.");

        window.location.href = "reg.html";

        return false;
    }

    return true;
}


// ==========================================
// CHECK USER ACCESS
// ==========================================

function checkUser() {

    let loggedInUser = JSON.parse(localStorage.getItem("currentUser"));

    if (loggedInUser === null || loggedInUser.role.toLowerCase() !== "user") {

        alert("Please log in as User.");

        window.location.href = "reg.html";

        return false;
    }

    return true;
}


// ==========================================
// ADMIN DASHBOARD
// ==========================================

function loadAdminDashboard() {

    if (!checkAdmin()) {
        return;
    }

    showAdminStats();

    showAdminJobs();

    showAdminUsers();
}


// ==========================================
// ADMIN STATISTICS
// ==========================================

function showAdminStats() {

    document.getElementById("totalJobs").innerText = jobs.length;

    let userCount = 0;

    let applicationCount = 0;


    for (let i = 0; i < users.length; i++) {

        if (users[i].role === "user") {

            userCount++;
        }
    }


    for (let i = 0; i < jobs.length; i++) {

        if (!jobs[i].applicants) {

            jobs[i].applicants = [];
        }

        applicationCount += jobs[i].applicants.length;
    }


    document.getElementById("totalUsers").innerText = userCount;

    document.getElementById("totalApplications").innerText = applicationCount;
}


// ==========================================
// ADMIN ADD JOB
// ==========================================

function addJob(event) {

    event.preventDefault();

    if (!checkAdmin()) {
        return;
    }


    let newJob = {

        id: new Date().getTime(),

        title: document.getElementById("jobTitle").value,

        company: document.getElementById("companyName").value,

        location: document.getElementById("jobLocation").value,

        type: document.getElementById("jobType").value,

        salary: document.getElementById("jobSalary").value,

        description: document.getElementById("jobDescription").value,

        requirements: document.getElementById("jobRequirements").value,

        applicants: []
    };


    jobs.push(newJob);

    saveJobs();

    alert("New job added successfully!");

    document.querySelector(".job-form").reset();

    showAdminStats();

    showAdminJobs();
}


// ==========================================
// ADMIN VIEW JOBS
// ==========================================

function showAdminJobs() {

    let jobList = document.getElementById("adminJobList");

    if (jobList === null) {
        return;
    }

    jobList.innerHTML = "";


    if (jobs.length === 0) {

        jobList.innerHTML = "<p>No jobs have been added yet.</p>";

        return;
    }


    for (let i = 0; i < jobs.length; i++) {

        let job = jobs[i];

        if (!job.applicants) {

            job.applicants = [];
        }


        jobList.innerHTML +=

            '<div class="admin-job">' +

            '<h3>' + job.title + '</h3>' +

            '<p><b>Company:</b> ' + job.company + '</p>' +

            '<p><b>Location:</b> ' + job.location + '</p>' +

            '<p><b>Job Type:</b> ' + job.type + '</p>' +

            '<p><b>Salary:</b> ' + job.salary + '</p>' +

            '<p><b>Description:</b> ' + job.description + '</p>' +

            '<p><b>Requirements:</b> ' + job.requirements + '</p>' +

            '<p><b>Applications:</b> ' + job.applicants.length + '</p>' +

            '<button class="delete-btn" onclick="deleteJob(' + job.id + ')">Delete Job</button>' +

            '</div>';
    }

    saveJobs();
}


// ==========================================
// ADMIN DELETE JOB
// ==========================================

function deleteJob(id) {

    if (!checkAdmin()) {
        return;
    }


    let confirmDelete = confirm("Are you sure you want to delete this job?");


    if (confirmDelete) {

        for (let i = 0; i < jobs.length; i++) {

            if (jobs[i].id == id) {

                jobs.splice(i, 1);

                break;
            }
        }


        saveJobs();

        showAdminJobs();

        showAdminStats();

        alert("Job deleted successfully.");
    }
}


// ==========================================
// ADMIN VIEW USERS
// ==========================================

function showAdminUsers() {

    let userList = document.getElementById("adminUserList");

    if (userList === null) {
        return;
    }

    userList.innerHTML = "";

    let registeredUsers = 0;


    for (let i = 0; i < users.length; i++) {

        if (users[i].role === "user") {

            registeredUsers++;


            userList.innerHTML +=

                '<div class="admin-user">' +

                '<h3>' + users[i].name + '</h3>' +

                '<p><b>Email:</b> ' + users[i].email + '</p>' +

                '<p><b>Account Type:</b> User</p>' +

                '<button class="delete-btn" onclick="deleteUser(\'' + users[i].email + '\')">Delete User</button>' +

                '</div>';
        }
    }


    if (registeredUsers === 0) {

        userList.innerHTML = "<p>No registered users found.</p>";
    }
}


// ==========================================
// ADMIN DELETE USER
// ==========================================

function deleteUser(email) {

    if (!checkAdmin()) {
        return;
    }


    let confirmDelete = confirm("Are you sure you want to delete this user?");


    if (confirmDelete) {

        for (let i = 0; i < users.length; i++) {

            if (users[i].email === email && users[i].role === "user") {

                users.splice(i, 1);

                break;
            }
        }


        for (let i = 0; i < jobs.length; i++) {

            if (!jobs[i].applicants) {

                jobs[i].applicants = [];
            }

            let applicantIndex = jobs[i].applicants.indexOf(email);

            if (applicantIndex !== -1) {

                jobs[i].applicants.splice(applicantIndex, 1);
            }
        }


        saveUsers();

        saveJobs();

        showAdminUsers();

        showAdminStats();

        showAdminJobs();

        alert("User deleted successfully.");
    }
}


// ==========================================
// USER DASHBOARD
// ==========================================

function loadUserDashboard() {

    if (!checkUser()) {
        return;
    }


    let loggedInUser = JSON.parse(localStorage.getItem("currentUser"));

    document.getElementById("welcomeUser").innerText = loggedInUser.name;

    document.getElementById("userName").innerText = loggedInUser.name;


    showUserStats();

    showUserJobs();

    showMyApplications();
}


// ==========================================
// USER STATISTICS
// ==========================================

function showUserStats() {

    let loggedInUser = JSON.parse(localStorage.getItem("currentUser"));

    let applied = 0;

    let interviews = 0;


    for (let i = 0; i < jobs.length; i++) {

        if (!jobs[i].applicants) {

            jobs[i].applicants = [];
        }


        if (jobs[i].applicants.indexOf(loggedInUser.email) !== -1) {

            applied++;

            if (jobs[i].status === "Interview") {

                interviews++;
            }
        }
    }


    document.getElementById("availableJobs").innerText = jobs.length;

    document.getElementById("appliedJobs").innerText = applied;

    document.getElementById("interviewJobs").innerText = interviews;
}


// ==========================================
// USER VIEW AND SEARCH JOBS
// ==========================================

function showUserJobs() {

    let jobList = document.getElementById("userJobList");

    if (jobList === null) {
        return;
    }


    let loggedInUser = JSON.parse(localStorage.getItem("currentUser"));

    let searchText = document.getElementById("jobSearch").value.toLowerCase();

    let statusFilter = document.getElementById("statusFilter").value;


    jobList.innerHTML = "";

    let foundJobs = 0;


    for (let i = 0; i < jobs.length; i++) {

        let job = jobs[i];

        if (!job.applicants) {

            job.applicants = [];
        }


        let title = String(job.title || "");

        let company = String(job.company || "");


        let alreadyApplied = job.applicants.indexOf(loggedInUser.email) !== -1;

        let jobStatus = alreadyApplied ? (job.status || "Applied") : "Not Applied";


        let matchesSearch = title.toLowerCase().includes(searchText) ||

                            company.toLowerCase().includes(searchText);


        let matchesStatus = false;


        if (statusFilter === "All") {

            matchesStatus = true;
        }

        else if (statusFilter === "Applied") {

            matchesStatus = alreadyApplied;
        }

        else {

            matchesStatus = alreadyApplied && job.status === statusFilter;
        }


        if (matchesSearch && matchesStatus) {

            foundJobs++;


            let buttonText = "Apply Now";

            let buttonAction = "applyJob(" + job.id + ")";


            if (alreadyApplied) {

                buttonText = "Already Applied";

                buttonAction = "";
            }


            jobList.innerHTML +=

                '<div class="job-card">' +

                '<h3>' + title + '</h3>' +

                '<p><b>Company:</b> ' + company + '</p>' +

                '<p><b>Location:</b> ' + (job.location || "Not specified") + '</p>' +

                '<p><b>Job Type:</b> ' + (job.type || "Not specified") + '</p>' +

                '<p><b>Salary:</b> ' + (job.salary || "Not specified") + '</p>' +

                '<p><b>Description:</b> ' + (job.description || "") + '</p>' +

                '<p><b>Requirements:</b> ' + (job.requirements || "") + '</p>' +

                '<p class="application-status">' + jobStatus + '</p>' +

                '<br>' +

                '<button onclick="' + buttonAction + '" ' +

                (alreadyApplied ? "disabled" : "") + '>' +

                buttonText +

                '</button>' +

                '</div>';
        }
    }


    if (foundJobs === 0) {

        jobList.innerHTML = "<p>No matching jobs found.</p>";
    }

    saveJobs();
}


// ==========================================
// USER APPLY FOR JOB
// ==========================================

function applyJob(id) {

    if (!checkUser()) {
        return;
    }


    let loggedInUser = JSON.parse(localStorage.getItem("currentUser"));


    for (let i = 0; i < jobs.length; i++) {

        if (jobs[i].id == id) {

            if (!jobs[i].applicants) {

                jobs[i].applicants = [];
            }


            if (jobs[i].applicants.indexOf(loggedInUser.email) !== -1) {

                alert("You have already applied for this job.");

                return;
            }


            jobs[i].applicants.push(loggedInUser.email);

            saveJobs();


            alert("Your application has been submitted successfully!");


            showUserStats();

            showUserJobs();

            showMyApplications();

            return;
        }
    }


    alert("Job not found.");
}


// ==========================================
// USER VIEW OWN APPLICATIONS
// ==========================================

function showMyApplications() {

    let loggedInUser = JSON.parse(localStorage.getItem("currentUser"));

    let applicationList = document.getElementById("myApplicationList");

    if (applicationList === null) {
        return;
    }

    applicationList.innerHTML = "";

    let found = false;


    for (let i = 0; i < jobs.length; i++) {

        if (!jobs[i].applicants) {

            jobs[i].applicants = [];
        }


        if (jobs[i].applicants.indexOf(loggedInUser.email) !== -1) {

            found = true;


            applicationList.innerHTML +=

                '<div class="job-card">' +

                '<h3>' + jobs[i].title + '</h3>' +

                '<p>' + jobs[i].company + '</p>' +

                '<p>Status: ' + (jobs[i].status || "Applied") + '</p>' +

                '<button onclick="deleteApplication(' + jobs[i].id + ')">' +

                'Delete Application' +

                '</button>' +

                '</div>';
        }
    }


    if (!found) {

        applicationList.innerHTML = "<p>You have not applied for any jobs yet.</p>";
    }
}


// ==========================================
// USER DELETE OWN APPLICATION
// ==========================================

function deleteApplication(id) {

    if (!checkUser()) {
        return;
    }


    let loggedInUser = JSON.parse(localStorage.getItem("currentUser"));

    let confirmDelete = confirm("Do you want to delete this application?");


    if (confirmDelete) {

        for (let i = 0; i < jobs.length; i++) {

            if (jobs[i].id == id) {

                if (!jobs[i].applicants) {

                    jobs[i].applicants = [];
                }


                let applicantIndex = jobs[i].applicants.indexOf(loggedInUser.email);


                if (applicantIndex !== -1) {

                    jobs[i].applicants.splice(applicantIndex, 1);

                    saveJobs();


                    showUserStats();

                    showUserJobs();

                    showMyApplications();


                    alert("Application deleted successfully.");

                    return;
                }
            }
        }


        alert("Application not found.");
    }
}