export default class NoteUI {
  constructor (root, 
    { on_note_select, on_note_add, on_note_delete, on_note_edit } = { }
    ) {
    // doing this to save take argument value 
    this.root = root;
    this.on_note_select = on_note_select;
    this.on_note_add = on_note_add;
    this.on_note_delete = on_note_delete;
    this.on_note_edit = on_note_edit;
    // re-render whole html again and agin after performing any operations 
    this.root.innerHTML = `
    <!-- sidebar  -->
    <div class="sidebar section">
      <h1 class="sidebar_name"> omag's <span> motion </span> </h1>
      <div class="sidebar-search">
        <i class="ri-search-2-line"></i>
        <input type="text" class="sidebar_input" placeholder="quick search" />
      </div>
      <button class="button add" id="add_btn">
        add note
      </button>
      <div class="recent-tabs">
      </div>
    </div>
    <!-- mainbar -->
    <section class="mainbar"
      <div class="address">
        <h2>quick-note/introduction-to-web-3</h2>
        <i class="ri-menu-line bars"></i>
      </div>
      <div class="mainbar-content">
        <!-- delete button  -->
        <div class="dlt-btn">
          <button class="button delete" type="submit">
            <i class="ri-delete-bin-2-line"></i>
          </button>
        </div>
        <!-- text area  -->
        <div class="content">
          <input class="heading" type="text" placeholder="what's title 🗒" id="note_title">
          <textarea contenteditable class="discription" role="textbox" placeholder="here be go 🖋" id="note_body"></textarea>
        </div>
        <!-- date and edit button  -->
        <div class="data-div">
          <!-- edit button  -->
          <div class="add-btn">
            <button class="button edit" type="submit">
              <i class="ri-pen-nib-line"></i>
            </button>
          </div>
          <!-- date  -->
        <h2 class="date" id="date">12:00, tuesday 23 april 2022</h2>
        </div>
      </div>
    </section>
    `;
    // defining important variables to play with them later 
    const add_note_btn = this.root.querySelector("#add_btn");
    const input_note_title = this.root.querySelector("#note_title");
    const input_note_body = this.root.querySelector("#note_body");
    // defining operations functions 
    add_note_btn.addEventListener("click", () => {
      this.on_note_add();
    });
    [input_note_title, input_note_body].forEach(inputFeild => {
      inputFeild.addEventListener("blur", () => {
        // on exiting any of both input feild upadte their values 
        const updated_title = input_note_title.value.trim();
        const updated_body = input_note_body.value.trim();
        // and give as parameter to edit mehtod 
        this.on_note_edit(updated_title, updated_body)
      })
    });
    // so its gonna be by default false for screen as long as we have notes to show in screen 
    this._check_visibility_for_screen_ui(false)
  }
  
  // mehtod to create single note tab ui 
  _create_list_html_note(id, title, body, updated) {
    // limit for body to show in left side tabs 
    const MAX_BODY_LENGTH = 60;
    // returning a blue print of tab html ui to create all recent note tabs 
    return `
    <div class="tabs" tabindex="1" data-note-id="${id}" >
    <i class="ri-play-fill play"></i>
    <span>
    <h2 class="note-title" id="note-title">
    ${title}
    </h2>
    <h4 class="note-body"  id="note-body">
    ${body.substring(0,MAX_BODY_LENGTH)}${body.length > MAX_BODY_LENGTH ?"...":""}
    </h4>
    <h6 class="note-date"  id="note-date">
    ${updated.toLocaleString(undefined, {dateStyle: "full", timeStyle: "short"})}
    </h6>
    </span>
    </div>
    `
  }
  // mehtod to update all the notes in recent note tab 
  _update_note_tabs(notes_array) {
    // notes_array is the array of all note that is in local storage 
    // taking note tab container from root
    const list_note_container = this.root.querySelector(".recent-tabs");
    // cleaing that note complety
    list_note_container.innerHTML = "";

    // updating note tab with all the notes
    for (const single_note of notes_array) {
      // giving parameter from array to the create tab ui mehtod
      const html = this._create_list_html_note(single_note.id, single_note.title, single_note.body, new Date(single_note.updated))
      // updating the html of note tab container
      list_note_container.insertAdjacentHTML("beforeend", html);
    }
    // add/delete event for selecting induvidual note from tab
    list_note_container.querySelectorAll(".tabs").forEach(single_note => {
      single_note.addEventListener("click", () => {
        this.on_note_select(single_note.dataset.noteId)
      })
      // deleting event for selecting induvidual note from tab
      single_note.addEventListener("dblclick", () => {
        const ask_for_delete = confirm("are you sure to that delete?");
        if (ask_for_delete) {
          this.on_note_delete(single_note.dataset.noteId)
        }
      })
    })
  }
  // mehtod to update view UI of main screen
  _update_screen_ui (that_active_single_note) {
    // taking screen title and changing with current note title 
    this.root.querySelector(".heading").value = that_active_single_note.title
    // taking screen body and changing with current note body 
    this.root.querySelector(".discription").value = that_active_single_note.body
    // removing selected item css class from evry note tab
    this.root.querySelectorAll(".tabs").forEach(every_note => { every_note.classList.remove("select-tab")});
    // adding selected item css class to selected note
    this.root.querySelector(`.tabs[data-note-id="${that_active_single_note.id}"]`).classList.add("select-tab")
  }
  // mehtod to remove note things from screen if the note array is 0
  _check_visibility_for_screen_ui(visibility) {
    this.root.querySelector(".mainbar-content").style.visibility = visibility ? "visible" : "hidden";
  }
}