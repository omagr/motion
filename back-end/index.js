import NoteAPI from "./noteAPI.js";
import Notes from "./noteAPI.js";
import View from "./noteUI.js";
import App from "./app.js";

const root = document.getElementById('app');
const app = new App(root);

// put .js at the end of noteAPI, don't let it just noteAPI
// import noteAPI from "./noteAPI.js";
// import Notes from "./noteAPI.js";
// import View from "./noteUI.js";
// const app = document.getElementById('app');
// const appUI = new View (app, {
//     on_note_add() {
//         console.log("add note")
//     },
//     on_note_edit(new_title, new_body) {
//         console.log(new_title)
//         console.log(new_body)
//     },
//     on_note_select(that_note_id) {
//         console.log(`selected note : ${that_note_id}`)
//     },
//     on_note_delete(that_note_id) {
//         console.log(`deleted note : ${that_note_id}`)
//     }
// })
// // noteAPI.save_current_note({
// //     title: "note-1",body: "Web3 is distinct from Tim Berners-Lee's 1999 concept for a semantic web.[19] In 2006, Berners-Lee described the semantic web as a component of Web 3.0, which is different than the term Web3 in blockchain contexts"
// // })
// console.log(Notes.get_all_notes())
// appUI._update_note_tabs(Notes.get_all_notes())
// appUI._update_screen_ui(Notes.get_all_notes()[0])