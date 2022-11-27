console.log("Code in public/javascripts/index.js");

void (async function () {
  const data = await window.FAKE_DATA.get();
  let nameArray = data.map((e) => e.name); // get name array from data

  const editButtonValue = "<button class='button editButton'>Edit</button>";
  const changeButtonValue =
    "<button class='button changeButton'>Change</button>";
  const cancelButtonValue =
    "<button class='button cancelButton'>Cancel</button>";

  function capitalizeFirstLetter(string) {
    return string
      .toLowerCase()
      .split(" ")
      .map((e) => e.charAt(0).toUpperCase() + e.slice(1))
      .join(" ");
  }

  function validateName(string) {
    if (/^([a-zA-Z]{2}[a-zA-Z]*?\s)+([a-zA-Z]{2,})$/.test(string)) {
      return true;
    } else {
      alert("Invalid username!");
      return false;
    }
  }

  function chooseElement(e) {
    if (!$(e.target).is(":button")) {
      $("#input").val($(this).children(".dropdownParagraph").text());
      $(".dropdownRow").not($(this)).remove();
    }
  }

  function filter() {
    let result = nameArray.filter((e) =>
      e.toLowerCase().includes($("#input").val().toLowerCase())
    );

    return result.sort();
  }

  function editButtonEvent() {
    let buttonHolder = $(this).parent(); // get buttonHolder element

    buttonHolder.off("click", ".changeButton"); // remove old event on changeButton
    buttonHolder.off("click", ".cancelButton"); // remove old event on cancelButton
    $(".dropdownRow").off("click");

    buttonHolder.empty(); // remove edit button
    buttonHolder.append(changeButtonValue + cancelButtonValue); // add change, cancel button

    let dropdownParagraph = buttonHolder.siblings(".dropdownParagraph"); // get dropdownParagraph element

    let oldText = dropdownParagraph.text(); // get old text
    dropdownParagraph.replaceWith('<input class="dropdownInput"/>'); // replace with input tag
    let dropdownInput = buttonHolder.siblings(".dropdownInput"); // get dropdownInput element
    dropdownInput.val(oldText).focus(); // keep old text then focus

    buttonHolder.on("click", ".changeButton", function () {
      let newText = dropdownInput.val(); // get new text

      if (validateName(newText)) {
        let newValue = capitalizeFirstLetter(newText);
        dropdownInput.replaceWith(
          `<p class="dropdownParagraph font1-1">${newValue}</p>`
        );

        nameArray.splice(nameArray.indexOf(oldText), 1, newValue); // replace name in array

        buttonHolder.empty(); // delete change + cancel button
        buttonHolder.append(editButtonValue);

        dropdownInput.removeClass("error");

        $(".dropdownRow").off("click").on("click", chooseElement);
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

      $(".dropdownRow").off("click").on("click", chooseElement);
    });
  }

  $(document).ready(function () {
    $("body").on("click", function (e) {
      if (
        $(e.target).parentsUntil(".container").length < 2 &&
        !$(e.target).is(":button")
      ) {
        $("#dropdownHolder").empty().addClass("noneDisplay");
        $("#input").val("");
      }
    });

    $("#input").on("click", function () {
      $("#dropdownHolder").removeClass("noneDisplay");

      if ($("#dropdownHolder").children(".dropdownRow").length === 0) {
        // execute if no dropdownRow is existing
        $("#dropdownHolder").append(
          filter().map((e) => {
            return `<div class="dropdownRow">
                    <p class="dropdownParagraph font1-1">${e}</p>
                    <div class="buttonHolder">${editButtonValue}</div>
                  </div>`;
          })
        );
      }
      // $(".dropdownParagraph").on("click",chooseElement)
      $(".dropdownRow").off("click").on("click", chooseElement);
      $(".buttonHolder").on("click", ".editButton", editButtonEvent);
    });

    $("#input").on("keyup", function () {
      // set event when input changes

      $("#dropdownHolder")
        .empty() // remove old rows
        .append(
          filter().map((e) => {
            return `<div class="dropdownRow">
                    <p class="dropdownParagraph font1-1">${e}</p>
                      <div class="buttonHolder">
                        ${editButtonValue}
                      </div>
                  </div>`;
          })
        );
      // if no name is found
      if (filter().length === 0) {
        $("#dropdownHolder").append(
          `
            <div class="noDataRow font1-1">
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

              if (validateName(extensionText)) {
                nameArray.push(capitalizeFirstLetter(extensionText)); // insert new name into array
                // then back to beginning UI
                $("#dropdownHolder")
                  .empty()
                  .append(
                    "<div class='dropdownRow'><p class='dropdownParagraph font1-1'>" +
                      capitalizeFirstLetter(extensionText) +
                      "</p ><div class='buttonHolder'>" +
                      editButtonValue +
                      "</div></div>"
                  );

                $(".dropdownRow").off("click").on("click", chooseElement);
                $(".buttonHolder").on("click", ".editButton", editButtonEvent);
              } else {
                $("#extensionInput").addClass("error");
              }
            });
        });
      }

      $(".dropdownRow").off("click").on("click", chooseElement);
      $(".buttonHolder").on("click", ".editButton", editButtonEvent);
    });
  });
})();
