let show_navbar = document.querySelector(".sidebar");
let show_navbar_btn = document.querySelector(".bars");
let tab_list = document.querySelectorAll(".tabs");
let add_note_btn = document.querySelector(".add");
show_navbar_btn.addEventListener("click", () => {
  show_navbar.classList.add("showcase");
});
tab_list.forEach((element) =>
  element.addEventListener("click", () => {
    setTimeout(() => {
      show_navbar.classList.remove("showcase");
    }, 250);
  })
);
// add_note_btn.addEventListener("click", () => {
//   setTimeout(() => {
//     show_navbar.classList.remove("showcase");
//   }, 250);
// });
