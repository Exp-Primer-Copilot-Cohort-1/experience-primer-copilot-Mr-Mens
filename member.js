function skillsMember() {
    var member = document.getElementById("member");
    var skills = document.getElementById("skills");
    var memberBtn = document.getElementById("memberBtn");
    var skillsBtn = document.getElementById("skillsBtn");
    if (member.style.display === "none") {
        member.style.display = "block";
        skills.style.display = "none";
        memberBtn.style.backgroundColor = "#f5f5f5";
        skillsBtn.style.backgroundColor = "#e5e5e5";
    }
}
