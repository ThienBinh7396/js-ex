console.log("Code in public/javascripts/index.js");

void (async function () {
  const data = await window.FAKE_DATA.get();
  let nameArray = data.map((e) => e.name); // get name array from data

  const editButtonValue =
    "<button class='button editButton'>" + "Edit" + "</button>";
  const changeButtonValue =
    "<button class='button changeButton'>" + "Change" + "</button>";
  const cancelButtonValue =
    "<button class='button cancelButton'>" + "Cancel" + "</button>";

  function capitalizeFirstLetter(string) {
    return string
      .toLowerCase()
      .split(" ")
      .map((e) => e.charAt(0).toUpperCase() + e.slice(1))
      .join(" ");
  }

  function checkValidatedName(string) {
    let checkText = string.split(" ");

    // check length
    if (checkText.length > 1) {
      // check syntax
      for (let e of checkText) {
        if (/^[(a-zA-Z)]{2,}$/.test(e) === false) {
          alert("Invalid username!");
          return false;
        }
      }
    } else {
      alert("Invalid username!");
      return false;
    }

    // check existence
    for (let e of nameArray) {
      if (e.toLowerCase() === string.toLowerCase()) {
        alert("Username already exists");
        return false;
      }
    }

    return true;
  }

  function editButtonEvent() {
    let buttonHolder = $(this).parent(); // get buttonHolder element

    buttonHolder.off("click", ".changeButton"); // remove old event on changeButton
    buttonHolder.off("click", ".cancelButton"); // remove old event on cancelButton

    buttonHolder.empty(); // remove edit button
    buttonHolder.append(changeButtonValue + cancelButtonValue); // add change, cancel button

    let dropdownParagraph = buttonHolder.siblings(".dropdownParagraph"); // get dropdownParagraph element

    let oldText = dropdownParagraph.text(); // get old text
    dropdownParagraph.replaceWith('<input class="dropdownInput"/>'); // replace with input tag
    let dropdownInput = buttonHolder.siblings(".dropdownInput"); // get dropdownInput element
    dropdownInput.val(oldText).focus(); // keep old text then focus

    buttonHolder.on("click", ".changeButton", function () {
      let newText = dropdownInput.val(); // get new text
      let isValidated = checkValidatedName(newText);

      if (isValidated === true) {
        let newValue = capitalizeFirstLetter(newText);
        dropdownInput.replaceWith(
          `<p class="dropdownParagraph font1-1">${newValue}</p>`
        );

        nameArray.splice(nameArray.indexOf(oldText), 1); // remove old name in array
        nameArray.push(newValue); // insert new name into array

        buttonHolder.empty(); // delete change + cancel button
        buttonHolder.append(editButtonValue);
        isValidated = false;
        dropdownInput.removeClass("error");
      } else {
        dropdownInput.addClass("error");
      }
    });

    buttonHolder.on("click", ".cancelButton", function () {
      dropdownInput.replaceWith(
        `<p class="dropdownParagraph font1-1">${oldText}</p>`
      );
      buttonHolder.empty(); // delete change + cancel button
      buttonHolder.append(editButtonValue);
    });
  }

  $(document).ready(function () {
    $("#input").on("click", function () {
      $("#dropdownHolder").removeClass("noneDisplay");

      nameArray.sort();

      $("#dropdownHolder").append(
        nameArray.map((e) => {
          return `<div class="dropdownRow">
                    <p class="dropdownParagraph font1-1">${e}</p>
                    <div class="buttonHolder">${editButtonValue}</div>
                  </div>`;
        })
      );

      $(".buttonHolder").on("click", ".editButton", editButtonEvent);
    });

    $("#input").on("keyup", function () {
      // set event when input changes
      nameArray.sort();

      let result = nameArray.filter((e) =>
        e.toLowerCase().includes($("#input").val().toLowerCase())
      );

      $("#dropdownHolder")
        .empty() // remove old rows
        .append(
          result.map((e) => {
            return `<div class="dropdownRow">
                    <p class="dropdownParagraph font1-1">${e}</p>
                      <div class="buttonHolder">
                        ${editButtonValue}
                      </div>
                  </div>`;
          })
        );
      // if no name is found
      if (result.length === 0) {
        $("#dropdownHolder").append(
          `
            <div class="dropdownRow font1-1">
              No data found
            </div>
            <div class="extensionRow font1-1">
              <button class="button" id="addButton">Add new data<button>
            </div>
          `
        );

        $("#addButton").on("click", function () {
          // set event when click add button
          $(this).before("<input id='extensionInput' class='font1-1'/>");
          $("#extensionInput").val($("#input").val()).focus();

          $("#addButton")
            .off("click") // remove event after first click
            .on("click", function () {
              // then add new event on second click
              let extensionText = $("#extensionInput").val();
              let isValidated = checkValidatedName(extensionText);

              if (isValidated) {
                nameArray.push(capitalizeFirstLetter(extensionText)); // insert new name into array
                // then back to beginning UI
                $("#dropdownHolder").empty().addClass("noneDisplay");
                $("#input").val("");
              } else {
                $("#extensionInput").addClass("error");
              }
            });
        });
      }

      $(".buttonHolder").on("click", ".editButton", editButtonEvent);
    });
  });
})();
