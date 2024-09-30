"use client";

import { useEffect, useState } from "react";
import { Note, themeColor } from "../../../constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faSearch, faTrash } from "@fortawesome/free-solid-svg-icons";

export default function HomePage() {
  // const router = useRouter();
  let newNote: Note;
  const [onButtonHover, setOnButtonHover] = useState(false);
  const [allNotes, setAllNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [selectedNoteId, setSelectedNoteId] = useState<Number>();
  const [selectedNoteTitle, setSelectedNoteTitle] = useState("");
  const [selectedNoteData, setSelectedNoteData] = useState("");
  const [selectedNoteDate, setSelectedNoteDate] = useState("");
  const [prevNote, setPrevNote] = useState<Note>();
  const [searchText, setSearchText] = useState("");
  const [isNoteEdited, setIsNoteEdited] = useState<Boolean>();

  // function handleEditNote(title: string) {
  //   router.push(`/${title}`);
  // }

  function isNoteEditedFunc(_selectedNoteId: any) {
    let noteTocheck = allNotes.find((note) => note.id == _selectedNoteId);
    if (
      noteTocheck?.title != selectedNoteTitle ||
      noteTocheck?.data != selectedNoteData
    )
      return true;
    else return false;
  }

  function handleEditNote(_noteSelected: Note) {
    setPrevNote(
      selectedNoteId
        ? {
            id: Number(selectedNoteId),
            title: selectedNoteTitle,
            data: selectedNoteData,
            date: selectedNoteDate,
          }
        : prevNote
    );

    setIsNoteEdited(isNoteEditedFunc(selectedNoteId));

    setSelectedNoteId(_noteSelected.id);
    setSelectedNoteTitle(_noteSelected.title);
    setSelectedNoteData(_noteSelected.data);
    setSelectedNoteDate(_noteSelected.date);
  }

  function handleSearchNote(e: any) {
    setSearchText(e.target.value);
    const filteredNotes = allNotes.filter((note) =>
      note.title.toLowerCase().startsWith(e.target.value.toLowerCase())
    );
    setFilteredNotes(filteredNotes);
  }

  async function addNewNote() {
    try {
      const result = await fetch(`http://localhost:3000/api/note`, {
        method: "POST",
        body: JSON.stringify(newNote),
      });
      if (result.ok) {
        const _newNoteId = await result.json();
        handleEditNote({
          id: _newNoteId,
          title: "",
          data: "",
          date: Date(),
        });
      } else throw new Error("Failed to insert new note");
    } catch (error) {
      console.error("Error inserting new note", error);
    }
  }

  async function updateNote() {
    try {
      if (isNoteEdited) {
        const response = await fetch(
          `http://localhost:3000/api/note/${prevNote?.id}`,
          {
            method: "PUT",
            body: JSON.stringify(prevNote),
          }
        );
        if (response.ok) {
        } else throw new Error("Failed to update note");
      }
      getAllNotes();
    } catch (error) {
      console.error("Error updating the note:", error);
    }
  }

  async function deleteNote(_noteId: number) {
    try {
      const response = await fetch(
        `http://localhost:3000/api/note/${_noteId}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        getAllNotes();
      } else throw new Error("Failed to delete note");
    } catch (error) {
      console.error("Error deleting the note:", error);
    }
  }

  async function getAllNotes() {
    try {
      const response = await fetch("http://localhost:3000/api/getAllNotes");
      if (response.ok) {
        let _data: Note[] = (await response.json()) as Note[];
        setAllNotes(_data);
        _data.sort(
          (note1, note2) =>
            new Date(note2.date).getTime() - new Date(note1.date).getTime()
        );
        setFilteredNotes(_data);
      } else throw new Error("Failed to get notes");
    } catch (error) {
      console.error("Error getting notes:", error);
    }
  }

  useEffect(() => {
    // getAllNotes();
    updateNote();
  }, [prevNote]);

  return (
    <main
      // className="flex min-h-screen "
      style={{ padding: "24px", display: "flex", flexDirection: "row" }}
    >
      <div
        className="leftpane"
        style={{
          border: "solid",
          borderWidth: "1px",
          borderColor: "gray",
          borderRadius: "5px",
          paddingTop: "15px",
          paddingBottom: "15px",
          minHeight: "950px",
          flex: "25%",
        }}
      >
        <div
          className="app-header"
          style={{
            paddingBottom: "18px",
            paddingTop: "3px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            fontWeight: "bold",
            fontSize: "18px",
            paddingLeft: "14px",
            paddingRight: "14px",
            color: themeColor,
          }}
        >
          <h2>Notes</h2>
          <div className="new-note-div">
            <button
              className="new-note-button"
              style={{
                color: onButtonHover ? "white" : "grey",
              }}
              onMouseEnter={() => {
                setOnButtonHover(true);
              }}
              onMouseLeave={() => {
                setOnButtonHover(false);
              }}
              onClick={() => {
                addNewNote();
              }}
            >
              <FontAwesomeIcon icon={faEdit} />
            </button>
            {onButtonHover ? (
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: "normal",
                  position: "absolute",
                  left: "345px",
                  border: "solid",
                  borderWidth: "1px",
                  borderColor: "gray",
                  borderRadius: "5px",
                  width: "73px",
                  backgroundColor: "grey",
                  paddingTop: "4px",
                  paddingBottom: "4px",
                  paddingLeft: "8px",
                  marginTop: "5px",
                }}
              >
                New Note
              </div>
            ) : (
              <span></span>
            )}
          </div>
        </div>
        <div
          className="search-bar"
          style={{
            // backgroundColor: "blue",
            padding: "8px",
            display: "flex",
            flexDirection: "row",
            height: "39px",
            border: "solid",
            borderWidth: "1px",
            borderColor: "gray",
            borderRadius: "7px",
            marginLeft: "13px",
            marginRight: "13px",
            alignItems: "center",
          }}
        >
          <FontAwesomeIcon
            icon={faSearch}
            style={{
              width: "19px",
              height: "15px",
              color: "grey",
              marginRight: "5px",
            }}
          />
          <textarea
            className="search-text-area"
            style={{
              backgroundColor: "black",
              outline: "none",
              display: "flex",
              maxHeight: "100%",
              maxWidth: "100%",
              fontSize: "14px",
              marginTop: "1px",
              color: "ghostwhite",
            }}
            placeholder="Find a Note"
            value={searchText}
            onChange={(e) => handleSearchNote(e)}
          ></textarea>
        </div>
        <div className="notes-list" style={{ paddingTop: "13px" }}>
          {filteredNotes.map((note) => (
            <div key={note.id}>
              <div
                className="note-tile"
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <div
                  className="notes-section"
                  style={{
                    padding: "13px",
                    marginTop: "3px",
                  }}
                  onClick={() => handleEditNote(note)}
                >
                  <h2
                    className="notes-title"
                    style={{
                      fontSize: "15px",
                      paddingBottom: "2px",
                      paddingTop: "5px",
                      fontWeight: "bolder",
                      color: themeColor,
                    }}
                  >
                    {note.title}
                  </h2>
                  <h2
                    className="notes-data"
                    style={{
                      color: "#cccbcd",
                      fontSize: "14px",
                      paddingTop: "2px",
                      paddingBottom: "3px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: "250px",
                    }}
                  >
                    {note.data}
                  </h2>
                </div>

                <button
                  className="delete-button"
                  style={{
                    paddingRight: "25px",
                    paddingTop: "14px",
                  }}
                  onClick={() => deleteNote(note.id)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>

              <hr
                className="divider"
                style={{
                  border: "none",
                  borderTop: "solid",
                  borderWidth: "0.5px",
                  borderColor: "grey",
                }}
              />
            </div>
          ))}
        </div>
      </div>
      {selectedNoteId ? (
        <div
          className="rightpane"
          style={{
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            minHeight: "930px",
            paddingLeft: "45px",
            flex: "75%",
          }}
        >
          <>
            <textarea
              className="title-textarea"
              style={{
                backgroundColor: "black",
                border: "none",
                outline: "none",
                fontSize: "23px",
                fontWeight: "bold",
              }}
              placeholder="Your title"
              value={selectedNoteTitle}
              onChange={(e) => setSelectedNoteTitle(e.target.value)}
            ></textarea>
            <textarea
              className="description-textarea"
              style={{
                backgroundColor: "black",
                resize: "none",
                width: "auto",
                height: "auto",
                maxWidth: "100%",
                minWidth: "1100px",
                maxHeight: "100%",
                minHeight: "850px",
                overflowX: "hidden",
                boxSizing: "content-box",
                border: "none",
                outline: "none",
              }}
              placeholder="Description goes here"
              value={selectedNoteData}
              onChange={(e) => setSelectedNoteData(e.target.value)}
            ></textarea>
          </>
        </div>
      ) : (
        <div
          className="no-selected-notes"
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            paddingTop: "400px",
            fontSize: "28px",
            fontWeight: "bold",
            flex: "75%",
          }}
        >
          <h1>Welcome to Notes</h1>
        </div>
      )}
    </main>
  );
}
