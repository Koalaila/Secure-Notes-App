import * as fs from "fs";
import * as crypto from "crypto";

const NOTES_FILE = "notes.json";

export class NotesManager {
  private encryptionKey: string = "";

  initialize(password: string) {
    this.encryptionKey = crypto.createHash("sha256").update(password).digest("hex");
    if (!fs.existsSync(NOTES_FILE)) {
      fs.writeFileSync(NOTES_FILE, JSON.stringify({}));
    }
  }

  private encrypt(content: string): string {
    const cipher = crypto.createCipheriv("aes-256-ctr", this.encryptionKey.slice(0, 32), "1234567890123456");
    return cipher.update(content, "utf8", "hex") + cipher.final("hex");
  }

  private decrypt(encrypted: string): string {
    const decipher = crypto.createDecipheriv("aes-256-ctr", this.encryptionKey.slice(0, 32), "1234567890123456");
    return decipher.update(encrypted, "hex", "utf8") + decipher.final("utf8");
  }

  addNote(title: string, content: string) {
    const notes = this.getNotes();
    notes[title] = this.encrypt(content);
    this.saveNotes(notes);
  }

  listNotes(): string[] {
    return Object.keys(this.getNotes());
  }

  getNoteContent(title: string): string | null {
    const notes = this.getNotes();
    if (notes[title]) {
      return this.decrypt(notes[title]);
    }
    return null;
  }

  deleteNote(title: string): boolean {
    const notes = this.getNotes();
    if (notes[title]) {
      delete notes[title];
      this.saveNotes(notes);
      return true;
    }
    return false;
  }

  private getNotes(): Record<string, string> {
    const data = fs.readFileSync(NOTES_FILE, "utf-8");
    return JSON.parse(data);
  }

  private saveNotes(notes: Record<string, string>) {
    fs.writeFileSync(NOTES_FILE, JSON.stringify(notes, null, 2));
  }
}
