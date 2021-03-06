import Calc from "../functions/calc.js";
import OctoPrintClient from "../octoprint.js";

let printers = [];
let resetFile = function(id){
  let i = _.findIndex(printers, function(o) { return o._id == id; });
  OctoPrintClient.file(printers[i], printers[i].job.file.path, "load");
}
let rePrint = function(id){
    let i = _.findIndex(printers, function(o) { return o._id == id; });
    OctoPrintClient.file(printers[i], printers[i].job.file.path, "print");
}
let currentHarvest = document.querySelectorAll("[id^='currentHarvest-']");
currentHarvest.forEach(harvest => {
    harvest.addEventListener("click", e => {
        let id = harvest.id.split("-");
        resetFile(id[1]);
    })
})
let currentRestartPrint = document.querySelectorAll("[id^='restartCurrentPrint-']");
currentRestartPrint.forEach(harvest => {
    harvest.addEventListener("click", e => {
        let id = harvest.id.split("-");
        rePrint(id[1]);
    })
})
export default function currentOperations(
  currentOperations,
  currentOperationsCount,
  printerInfo
) {
    printers = printerInfo;
  if(currentOperations.length === 0){
    let currentCards = document.querySelectorAll("[id^='currentOpCard-']");
    currentCards.forEach(card => {
      card.remove();
    })
  }

 currentOperationsCount = currentOperationsCount;
  document.getElementById("completeCount").innerHTML =
    "Complete: " + currentOperationsCount.complete;
  document.getElementById("idleCount").innerHTML =
    "Idle: " + currentOperationsCount.idle;
  document.getElementById("activeCount").innerHTML =
    "Active: " + currentOperationsCount.active;
    document.getElementById("disconCount").innerHTML =
        "Disconnected: " + currentOperationsCount.disconnected;

  document.getElementById("offlineCount").innerHTML =
    "Offline: " + currentOperationsCount.offline;

  document.getElementById("farmProgress").innerHTML =
    currentOperationsCount.farmProgress + "%";
  document.getElementById(
    "farmProgress"
  ).style = `width: ${currentOperationsCount.farmProgress}%`;
  document.getElementById(
    "farmProgress"
  ).classList = `progress-bar progress-bar-striped bg-${currentOperationsCount.farmProgressColour}`;

  currentOperations = _.orderBy(currentOperations, ["progress"], ["desc"]);

  currentOperations.forEach((current, index) => {
    //Generate future time
    let currentDate = new Date(); 
    currentDate = currentDate.getTime(); 
    let futureDateString = new Date(currentDate + current.timeRemaining * 1000).toDateString()
    let futureTimeString = new Date(currentDate + current.timeRemaining * 1000).toTimeString()
    futureTimeString = futureTimeString.substring(0, 8);
    let dateComplete = futureDateString + ": " + futureTimeString;
    let finishedPrint = `<button id='currentHarvest-${current.index}' type='button' title="Clear your finished print from current operations" class='tag btn btn-success btn-sm mt-0 pt-0 pb-0'>Print Harvested?</button>`;
    let restartPrint = `<button id='restartCurrentPrint-${current.index}' type='button' title="Restart your current selected print" class='tag btn btn-warning btn-sm mt-0 pt-0 pb-0'>Restart Print</button>`
    //check if exists, create if not....
    if (document.getElementById("currentOpCard-" + current.index)) {
        if(current.progress === 100){
            document.getElementById("finishedPrint-"+current.index).classList.remove("d-none");
            document.getElementById("futureDate-"+current.index).classList.add("d-none");
            document.getElementById("currentRestart-"+current.index).classList.remove("d-none");
            document.getElementById("currentTime-"+current.index).classList.add("d-none");
            document.getElementById("currentProgressMain-"+current.index).classList.add("d-none");
        }else{
            document.getElementById("finishedPrint-"+current.index).classList.add("d-none");
            document.getElementById("futureDate-"+current.index).classList.remove("d-none");
            document.getElementById("currentRestart-"+current.index).classList.add("d-none");
            document.getElementById("currentTime-"+current.index).classList.remove("d-none");
            document.getElementById("currentProgressMain-"+current.index).classList.remove("d-none");
        }
      let progress = document.getElementById(
        "currentProgress-" + current.index
      );
      document.getElementById("currentTime-"+current.index).innerHTML = Calc.generateTime(current.timeRemaining);
      progress.style = `width: ${current.progress}%`;
      progress.innerHTML = current.progress + "%";
      progress.className = `progress-bar progress-bar-striped bg-${current.progressColour}`;

    } else {
      document.getElementById("currentOperationsBody").insertAdjacentHTML(
        "beforeend",
        `
                <div id="currentOpCard-${current.index}"
                class="card card-block text-white bg-secondary d-inline-block"
                style="min-width: 200px; max-width: 200px;"
              >
                  <div class="card-header pb-1 pt-1 pl-2 pr-2">
                     ${current.name}</div>
                  <div class="card-body  pb-0 pt-2 pl-2 pr-2">
                  <h6 id="currentRestart-${current.index}" class="pb-0 text-center d-none" style="font-size:0.6rem;">${restartPrint}</h6>
                  <h6 id="currentTime-${
                    current.index
                  }" class="pb-0 text-center" style="font-size:0.6rem;">${Calc.generateTime(
          current.timeRemaining
        )}</h6>
        <h6 id="futureDate-${current.index}" class="pb-0 text-center" style="font-size:0.6rem;"> ${dateComplete} </h6>
        <h6 id="finishedPrint-${current.index}" class="pb-0 text-center d-none" style="font-size:0.6rem;"> ${finishedPrint} </h6>
                    <div id="currentProgressMain-${current.index}" class="progress">
                      <div id="currentProgress-${current.index}"
                        class="progress-bar progress-bar-striped bg-${
                          current.progressColour
                        }"
                        role="progressbar"
                        style="width: ${current.progress}%"
                        aria-valuenow="${current.progress}"
                        aria-valuemin="0"
                        aria-valuemax="100"
                      >
                      ${current.progress}%
                      </div>
                    </div>
                  </div>
                </div>
                `
      );
        document.getElementById("currentHarvest-"+current.index).addEventListener("click", e => {
            let id =  document.getElementById("currentHarvest-"+current.index).id.split("-");
            resetFile(id[1]);
        })
        document.getElementById("restartCurrentPrint-"+current.index).addEventListener("click", e => {
            let id =  document.getElementById("restartCurrentPrint-"+current.index).id.split("-");
            rePrint(id[1]);
        })
    }

    document.getElementById(
      "currentOpCard-" + current.index
    ).style.order = index;
    let currentCards = document.querySelectorAll("[id^='currentOpCard-']");
    let curr = [];
    currentOperations.forEach(cur => {
      curr.push(cur.index);
    });
    let cards = [];
    currentCards.forEach(card => {
      let ca = card.id.split("-");
      cards.push(ca[1]);
    });
    let remove = _.difference(cards, curr);
    remove.forEach(rem => {
      document.getElementById("currentOpCard-" + rem).remove();
    });
  });
}
