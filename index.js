import { initializeApp }
    from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove }
    from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"
import { convertDate } from "./convertDate.js"

const appSettings = {
    databaseURL: "https://realtime-database-f4279-default-rtdb.firebaseio.com/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const endorsementListInDB = ref(database, "endorsements")

const inputFieldEl = document.getElementById("input-field")
const toFieldEl = document.getElementById("input-to")
const fromFieldEl = document.getElementById("input-from")
const publishButtonEl = document.getElementById("publish-button")
const endorsementsListEl = document.getElementById("endorsement-list")

publishButtonEl.addEventListener("click", function () {
    let inputObject = {
        comment: inputFieldEl.value,
        to: toFieldEl.value,
        from: fromFieldEl.value,
        timestamp: new Date().getTime()
    }
    inputObject.comment = inputFieldEl.value
    inputObject.to = toFieldEl.value
    inputObject.from = fromFieldEl.value
    if (inputObject.comment !== "" && inputObject.to !== "" && inputObject.from !== "") {
        push(endorsementListInDB, inputObject)
        clearInputFieldEl()
    }

})

onValue(endorsementListInDB, function (snapshot) {
    if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val())
        itemsArray.sort((a, b) => b[1].timestamp - a[1].timestamp)

        clearEndorsementsListEl()

        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i]
            appendItemToEndorsementsListEl(currentItem,)
        }
    } else {
        endorsementsListEl.innerHTML = "<li>No items in list</li>"
    }
})

function appendItemToEndorsementsListEl(item) {
    let itemID = item[0]
    let itemValue = item[1].comment
    let itemTo = item[1].to
    let itemFrom = item[1].from
    let itemDate = item[1].timestamp
    let date = convertDate(item[1].timestamp)

    let newEl = document.createElement("li")
    newEl.innerHTML = `<div className="commentContainer"> 
                        <p id="toDisplay">To ${itemTo}<p>
                        <p id="commentDisplay">${itemValue}</p>
                        <p id="fromDisplay">From ${itemFrom}</p>
                        <p id="dateDisplay">${date}</p>
                        <div>
                        `

    newEl.addEventListener("dblclick", () => {
        let itemLocationInDB = ref(database, `endorsements/${itemID}`)
        remove(itemLocationInDB)
    })

    endorsementsListEl.append(newEl)
}

function clearInputFieldEl() {
    inputFieldEl.value = ""
    toFieldEl.value = ""
    fromFieldEl.value = ""
}

function clearEndorsementsListEl() {
    endorsementsListEl.innerHTML = ""
}
