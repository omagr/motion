// this file is gonna be tied up everything together like the index.js but in more details and structured way 
import NoteAPI from "./noteAPI.js";
import NoteUI from "./noteUI.js"

export default class App {
    constructor(root) {
        this.notes = [],
            this.active_notes = null,
            this.view = new NoteUI(root, this._handlers());
        this._refresh_note();
    }
    _refresh_note() {
        // get all notes 
        const notes_array = NoteAPI.get_all_notes();
        // it will call the ui to update screen and show our notes 
        this._setNotes(notes_array);
        // if notes array is bgger than one then 
        if (notes_array.length > 0) {
            // [0] will give the most recent note 
            this._setActiveNote(notes_array[0])
        }
    }
    _setNotes(notes_array) {
        this.notes = notes_array;
        this.view._update_note_tabs(notes_array);
        this.view._check_visibility_for_screen_ui(notes_array.length > 0);
    }
    _setActiveNote(that_active_single_note) {
        this.active_notes = that_active_single_note;
        this.view._update_screen_ui(that_active_single_note);
    }
    _handlers() {
        return {
            // i need to select that note which is set as selected note 
            on_note_select: (that_note_id) => {
                // find that note fron note array which we give from screen UI 
                const selected_note = this.notes.find(that_note => that_note.id == that_note_id)
                // set that finded note to active note 
                this._setActiveNote(selected_note)
            },
            on_note_add: () => {
                const new_note = {
                    title: "",
                    body: ""
                }
                NoteAPI.save_current_note(new_note);
                this._refresh_note();
            },
            on_note_edit: (new_title, new_body) => {
                NoteAPI.save_current_note({
                    id: this.active_notes.id,
                    title: new_title,
                    body: new_body
                })
                this._refresh_note();
            },
            on_note_delete: (that_note_id) => {
                NoteAPI.delete_current_note(that_note_id);
                this._refresh_note();
            }
        };
    }
}