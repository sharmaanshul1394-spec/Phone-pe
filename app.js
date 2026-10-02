const KEY = "demo_wallet";

let data = JSON.parse(localStorage.getItem(KEY)) || {
  balance: 200000,
  history: [],
  mobile: "",
  feedback: ""
};

function save(){
  localStorage.setItem(KEY, JSON.stringify(data));
}

function money(n){
  return "₹" + Number(n).toLocaleString("en-IN");
}

function openPage(id){

  document.querySelectorAll(".page")
    .forEach(x => x.classList.remove("active"));

  document.getElementById(id)
    .classList.add("active");

  if(id === "account"){
    document.getElementById("balance").textContent =
      money(data.balance);
  }

  if(id === "history"){
    showHistory();
  }

  window.scrollTo(0,0);
}


function buy(amount){

  if(data.balance < amount){
    alert("Insufficient demo balance.");
    return;
  }

  data.balance -= amount;

  data.history.unshift({
    type:"Demo Purchase",
    amount:amount,
    to:"Demo Store",
    time:new Date().toLocaleString("en-IN")
  });

  save();

  alert("Demo transaction recorded. No real payment was made.");

  openPage("history");
}


function sendMoney(){

  const recipient =
    document.getElementById("recipient").value.trim();

  const amount =
    Number(document.getElementById("amount").value);

  if(!recipient || !amount || amount < 1){
    alert("Enter a demo ID and valid amount.");
    return;
  }

  if(amount > data.balance){
    alert("Insufficient demo balance.");
    return;
  }

  data.balance -= amount;

  data.history.unshift({
    type:"Demo Sent",
    amount:amount,
    to:recipient,
    time:new Date().toLocaleString("en-IN")
  });

  save();

  document.getElementById("amount").value="";

  alert("Virtual demo money sent.");

  openPage("history");
}


function showHistory(){

  const box =
    document.getElementById("history");

  if(data.history.length === 0){
    box.innerHTML =
      "<p>No demo transactions yet.</p>";
    return;
  }

  box.innerHTML = data.history.map(x => `
    <div class="card">
      <b>${x.type}</b>
      <br>
      <small>${x.to}</small>
      <br>
      <small>${x.time}</small>
      <br>
      <strong>-${money(x.amount)}</strong>
    </div>
  `).join("");
}


function clearHistory(){

  if(confirm("Clear demo history?")){
    data.history = [];
    save();
    showHistory();
  }
}


function saveAccount(){

  data.mobile =
    document.getElementById("mobile").value;

  save();

  alert("Demo account saved.");
}


document.getElementById("image")
.addEventListener("change", function(){

  const file = this.files[0];

  if(!file) return;

  const reader = new FileReader();

  reader.onload = function(e){

    const img =
      document.getElementById("preview");

    img.src = e.target.result;
  };

  reader.readAsDataURL(file);
});


function removeImage(){

  document.getElementById("image").value="";
  document.getElementById("preview").src="";
}


function saveFeedback(){

  data.feedback =
    document.getElementById("feedback").value;

  save();

  document.getElementById("saved").textContent =
    "Feedback saved locally.";
}


if("serviceWorker" in navigator){

  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js");
  });

}
