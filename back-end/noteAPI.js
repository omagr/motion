export default class noteAPI {
    static get_all_notes () {
        const notes_array = JSON.parse(localStorage.getItem("motion_notes") || "[]" )
        // sorting algorithim
        return notes_array.sort((a,b) => { return new Date(a.updated) > new Date(b.updated) ? -1 : 1});
    }
    static save_current_note (noteToSave) {
        // taking notes as a refrence 
        const notes_array = noteAPI.get_all_notes();
        // find the current note id with all the existing note ids 
        const exist_note = notes_array.find(note_id => note_id == noteToSave.id)
        // if it finds then 
        if (exist_note) {
            // update note title with the current note title 
            exist_note.title = noteToSave.title;
            // update note body with the current note body 
            exist_note.body = noteToSave.body;
            // update note date with the current note date 
            exist_note.updated = new Date().toISOString();
        } 
        // otherwise 
        else {
        // updating the notes from the parameter 
        noteToSave.id = Math.floor(Math.random() * 1000000);
        noteToSave.updated = new Date().toISOString();
        // updating notes array 
        notes_array.push(noteToSave)
        }
        // updating the stoirage key motion-notes 
        localStorage.setItem("motion_notes", JSON.stringify(notes_array))
    }
    static delete_current_note (id) {
        // taking notes as a refrence 
        const notes_array = noteAPI.get_all_notes();
        // delete that note by the mehtod of filter 
        /*
        this will remove that current note and store all other notes in update note array
        */
        const updated_notes_array =  notes_array.filter(every_note => every_note.id != id);
        // updating the stoirage key motion-notes 
        localStorage.setItem("motion_notes", JSON.stringify(updated_notes_array))
    }
}
