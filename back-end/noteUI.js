export default class NoteUI {
  constructor(root,
    { on_note_select, on_note_add, on_note_delete, on_note_edit } = {}
  ) {
    // doing this to save take argument value 
    this.root = root;
    this.on_note_select = on_note_select;
    this.on_note_add = on_note_add;
    this.on_note_delete = on_note_delete;
    this.on_note_edit = on_note_edit;
    // re-render whole html again and agin after performing any operations 
    this.root.innerHTML = `
    <header class="nav">
        <nav>
          <div class="nav_title"><h1>motion.</h1></div>
          <ul class="nav_list">
            <li class="delete_btn" id="delete_btn">
              <a href="#" id="note_delete"
                ><i class="ri-close-circle-fill"></i
              ></a>
            </li>
            <li class="change_theme" id="change_theme">
              <a href="#" id="theme_change"
                ><i class="ri-contrast-2-line"></i
              ></a>
            </li>
            <li class="show_nav">
              <a href="#" id="nav_open_btn"><i class="ri-menu-line"></i></a>
            </li>
          </ul>
          <div class="nav_open">
            <div class="nav_open_operations">
              <div class="nav_open_title">
                <h1 class="nav_open_title_h1">my <span> motion </span></h1>
              </div>
              <div class="nav_open_search">
                <div class="nav_open_search_bar">
                  <i class="ri-search-2-line"></i>
                  <input
                    type="text"
                    class="nav_open_search_input"
                    placeholder="quick search"
                  />
                </div>
              </div>
              <div class="add_btn">
                <button class="button add" id="add_btn">add note</button>
              </div>
              <div class="notes_count">
                <h3 id="notes-count">recent notes (00).</h3>
              </div>
            </div>
            <div class="recent-notes">
            </div>
          </div>
        </nav>
      </header>
      <div class="main">
        <div class="note_address">
          <h2 id="address">quick-note / </h2>
        </div>
        <div class="note_title">
          <input id="title" class="title" type="text" placeholder="title..." />
        </div>
        <div class="note_body">
          <textarea
            contenteditable
            id="body"
            class="body"
            role="textbox"
            placeholder="here we go..."
          ></textarea>
        </div>
      </div>
      <div class="note_update">
        <h1 id="update"></h1>
      </div>
      <div class="ask_delete">
        <h3>do you really want to delete ?</h3>
        <h2 id="note_title_delete"></h2>
        <div class="ask_delete_btns">
          <i class="ri-checkbox-circle-fill" id="yes_delete"></i>
          <i class="ri-close-circle-fill" id="no_delete"></i>
        </div>
      </div>
    `;
    // --------------- javascripts for design. ---------------------------
    this.root.querySelector(".show_nav").addEventListener("click", () => {
      this.root.querySelector(".nav_open").classList.add("showcase");
    });
    this.root.querySelector("#delete_btn").addEventListener("click", () => {
      this.root.querySelector(".ask_delete").classList.add("ask_delete_show");
    })
    // --------------- javascripts for design. ---------------------------
    // defining important variables to play with them later 
    const add_note_btn = this.root.querySelector("#add_btn");
    const input_note_title = this.root.querySelector("#title");
    const input_note_body = this.root.querySelector("#body");
    // defining operations functions 
    add_note_btn.addEventListener("click", () => {
      this.on_note_add();
      // remove the showcase fron the open navbar
      /*
      note-1: if you try to run this function induvidullay it will run, idk why maybe it is getting the element from the root.
      */
      this.root.querySelector(".nav_open").classList.remove("showcase");
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
    <div class="note" data-note-id="${id}">
    <i class="ri-play-fill play"></i>
    <span>
    <h2 class="note-title" id="note-title"> ${title} </h2>
    <h4 class="note-body" id="note-body">
    ${body.substring(0, MAX_BODY_LENGTH)}${body.length > MAX_BODY_LENGTH ? "..." : ""}
    </h4>
    <h3 class="note-update" id="note-update">
    ${updated.toLocaleString(undefined, { dateStyle: "full", timeStyle: "short" })}
    </h3>
    </span>
    </div>
    `
  }
  // mehtod to update all the notes in recent note tab 
  _update_note_tabs(notes_array) {
    // notes_array is the array of all note that is in local storage
    // update the notes counts in open navbar
    this.root.querySelector("#notes-count").innerText = `
    recent notes (${notes_array.length >= 10 ? notes_array.length : "0" + notes_array.length})
    `;
    // taking note tab container from root
    const list_note_container = this.root.querySelector(".recent-notes");
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
    list_note_container.querySelectorAll(".note").forEach(single_note => {
      single_note.addEventListener("click", () => {
        this.on_note_select(single_note.dataset.noteId);
        // remove the showcase fron the open navbar
        /*
        note-1: if you try to run this function induvidullay it will not run, idk why maybe it is not getting the element from the root.
        */
        this.root.querySelector(".nav_open").classList.remove("showcase");
        // deleting note from getting the id of the note
        /*
        idk, i had spent more then a hour to understand how it is working here and not inside any function, delete funtion.
        */
        this.root.querySelector("#yes_delete").addEventListener("click", () => {
          this.on_note_delete(single_note.dataset.noteId);
          this.root.querySelector(".ask_delete").classList.remove("ask_delete_show");
        })
        this.root.querySelector("#no_delete").addEventListener("click", () => {
          this.root.querySelector(".ask_delete").classList.remove("ask_delete_show");
        })
      })
    })
    /*
    lol you really need to fix the issue of delete and the note ui.
    */
    if (notes_array.length === 0) {
      this.root.querySelector("#yes_delete").addEventListener("click", () => {
        this.root.querySelector(".ask_delete").classList.remove("ask_delete_show");
      })
      this.root.querySelector("#no_delete").addEventListener("click", () => {
        this.root.querySelector(".ask_delete").classList.remove("ask_delete_show");
      })
    }
  }
  // mehtod to update view UI of main screen
  _update_screen_ui(that_active_single_note) {
    // taking screen title and changing with current note title 
    this.root.querySelector("#title").value = that_active_single_note.title
    // taking screen body and changing with current note body 
    this.root.querySelector("#body").value = that_active_single_note.body
    // taking screen update and changing with current note update 
    this.root.querySelector("#update").innerText = new Date(that_active_single_note.updated).toLocaleString(undefined, { dateStyle: "full", timeStyle: "short" })
    that_active_single_note.updated.toLocaleString(undefined, { dateStyle: "full", timeStyle: "short" })
    // taking screen title and changing with current note address
    this.root.querySelector("#address").innerText = `quick-note / ${that_active_single_note.title}`
    // taking screen title and changing with current note asking name for delete
    this.root.querySelector("#note_title_delete").innerText = `${that_active_single_note.title}`
    // removing selected item css class from evry note tab
    this.root.querySelectorAll(".note").forEach(every_note => {
      every_note.classList.remove("active_note")
    });
    // adding selected item css class to selected note
    this.root.querySelector(`.note[data-note-id="${that_active_single_note.id}"]`).classList.add("active_note")
  }
  // mehtod to remove note things from screen if the note array is 0
  _check_visibility_for_screen_ui(visibility) {
    this.root.querySelector(".main").style.visibility = visibility ? "visible" : "hidden";
  }
}