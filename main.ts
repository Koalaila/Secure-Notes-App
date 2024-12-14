import { NotesManager } from "./notesManager";
import readlineSync from "readline-sync";

const manager = new NotesManager();

function mainMenu() {
  console.log("\nSecure Notes App");
  console.log("1. Add Note");
  console.log("2. List Notes");
  console.log("3. View Note");
  console.log("4. Delete Note");
  console.log("5. Exit");

  const choice = readlineSync.questionInt("\nChoose an option: ");

  switch (choice) {
    case 1:
      addNote();
      break;
    case 2:
      listNotes();
      break;
    case 3:
      viewNote();
      break;
    case 4:
      deleteNote();
      break;
    case 5:
      console.log("Goodbye!");
      process.exit(0);
    default:
      console.log("Invalid choice. Please try again.");
      mainMenu();
  }
}

function addNote() {
  const title = readlineSync.question("Enter the title of the note: ");
  const content = readlineSync.question("Enter the content of the note: ");
  manager.addNote(title, content);
  console.log("Note added successfully.");
  mainMenu();
}

function listNotes() {
  const notes = manager.listNotes();
  if (notes.length === 0) {
    console.log("No notes found.");
  } else {
    console.log("\nSaved Notes:");
    notes.forEach((note, index) => {
      console.log(`${index + 1}. ${note}`);
    });
  }
  mainMenu();
}

function viewNote() {
  const title = readlineSync.question("Enter the title of the note to view: ");
  const content = manager.getNoteContent(title);
  if (content) {
    console.log(`\nContent of "${title}":\n${content}`);
  } else {
    console.log("Note not found.");
  }
  mainMenu();
}

function deleteNote() {
  const title = readlineSync.question("Enter the title of the note to delete: ");
  if (manager.deleteNote(title)) {
    console.log("Note deleted successfully.");
  } else {
    console.log("Note not found.");
  }
  mainMenu();
}

// Start the app
const masterPassword = readlineSync.question("Set your master password: ", { hideEchoBack: true });
manager.initialize(masterPassword);
mainMenu();
