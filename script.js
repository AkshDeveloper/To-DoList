// Using ES module imports for Firebase CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import {
    getFirestore,
    collection,
    addDoc,
    doc,
    setDoc,
    deleteDoc,
    onSnapshot,
    updateDoc,
    query,
    orderBy
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

const inputBox = document.getElementById("task-input");
const addBtn = document.getElementById("add-task-button");
const taskList = document.getElementById("task-list");

// TODO: Replace the config below with your Firebase project's config
const firebaseConfig = {
    apiKey: "AIzaSyCM57WRQrT52k62D1_cd7GYI9aRaQq54Ls",
    authDomain: "sensihud-16b6a.firebaseapp.com",
    projectId: "sensihud-16b6a",
    storageBucket: "sensihud-16b6a.firebasestorage.app",
    messagingSenderId: "988455813123",
    appId: "1:988455813123:web:4075a26bb96d807a878e36"

};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Reference to tasks collection
const tasksCol = collection(db, "ToDoList");

// Create a new task in Firestore
async function addTask() {
    const taskText = inputBox.value.trim();
    if (taskText === "") return;

    try {
        await addDoc(tasksCol, {
            text: taskText,
            completed: false,
            createdAt: new Date()
        });
        inputBox.value = "";
    } catch (err) {
        console.error("Error adding task:", err);
        alert("Could not add task. Check console for details.");
    }
}

// Render a single task list item
function renderTask(docSnap) {
    const data = docSnap.data();
    const id = docSnap.id;

    const listItem = document.createElement("li");
    listItem.className = "task-item";

    const textSpan = document.createElement("span");
    textSpan.textContent = data.text;
    textSpan.className = data.completed ? "task-text completed" : "task-text";

    const controls = document.createElement("div");
    controls.className = "task-controls";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = !!data.completed;
    checkbox.className = "task-checkbox";
    checkbox.addEventListener("change", async () => {
        try {
            const taskDoc = doc(db, "tasks", id);
            await updateDoc(taskDoc, { completed: checkbox.checked });
        } catch (err) {
            console.error("Error updating task:", err);
        }
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.className = "delete-button";
    deleteBtn.addEventListener("click", async () => {
        try {
            const taskDoc = doc(db, "tasks", id);
            await deleteDoc(taskDoc);
        } catch (err) {
            console.error("Error deleting task:", err);
        }
    });

    controls.appendChild(deleteBtn);
    controls.appendChild(checkbox);

    listItem.appendChild(textSpan);
    listItem.appendChild(controls);

    return listItem;
}

// Listen for realtime updates and render list
const tasksQuery = query(tasksCol, orderBy("createdAt"));
onSnapshot(tasksQuery, (snapshot) => {
    // Clear list and re-render (simple approach)
    taskList.innerHTML = "";
    snapshot.forEach((docSnap) => {
        const li = renderTask(docSnap);
        taskList.appendChild(li);
    });
});

addBtn.addEventListener("click", addTask);
inputBox.addEventListener("keypress", function (event) {
    if (event.key === "Enter") addTask();
});


