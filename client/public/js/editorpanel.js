let articleObj = {
  title: "title",
  topic: "topic",
  symptoms: "symptoms",
  desofSym: "desofSym",
  symFile: "symFile",
  diagnosis: "diagnosis",
  remedies: "remedies",
  remediesFile: "remediesFile",
  adverse: "adverse",
  prevention: "prevention",
  cause: "cause",
  stages: "stages",
  stagesFile: "stagesFile",
  sideEffect: "sideEffect",
  consequences: "consequences",
  QA: "QA",
  ref: "ref",
  uID: "uID",
  duId: "duId",
};

function updateValue(key, value) {
  $("#" + key).html(value || "This field is empty");
  articleObj[key] = value;
}

(function detectChange(key) {
  let input = "#" + key + "-input";
  $(input).change(function () {
    updateValue(key, $(input).val());
  });
  $(input).keyup(function () {
    updateValue(key, $(input).val());
  });
  return arguments.callee;
})("title")("topic")("symptoms")("desofSym")("symFile")("diagnosis")(
  "remedies"
)("remediesFile")("adverse")("prevention")("cause")("stages")("stagesFile")(
  "sideEffect"
)("consequences")("QA")("ref")("uID")("duId"); //Self calling function

// function theimage() {
//   var filename = document.getElementById("file-id").value;
//   document.getElementById("file-path").value = filename;
//   alert(filename);
// }

// var fileInput = document.getElementById("symFile-input");
// var fileList = [];

// fileInput.addEventListener("change", function (e) {
//   fileList = [];
//   for (var i = 0; fileInput.files.length; i++) {
//     fileList.push(fileInput.files[i]);
//   }
// });
