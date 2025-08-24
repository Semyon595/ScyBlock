(window["webpackJsonpGUI"] = window["webpackJsonpGUI"] || []).push([["addon-entry-search-sprites"],{

/***/ "./node_modules/css-loader/index.js!./src/addons/addons/search-sprites/search-bar.css":
/*!***********************************************************************************!*\
  !*** ./node_modules/css-loader!./src/addons/addons/search-sprites/search-bar.css ***!
  \***********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../../../node_modules/css-loader/lib/css-base.js */ "./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "[class*=\"sprite-selector_items-wrapper_\"] {\r\n  padding-bottom: 4.75rem;\r\n}\r\n\r\n.sa-search-sprites-container {\r\n  position: absolute;\r\n  z-index: 21; /* above workspace scrollbar in small stage mode */\r\n  bottom: 0.75rem;\r\n  display: flex;\r\n  width: 2.75rem;\r\n  height: 2.75rem;\r\n  background-color: var(--looks-secondary);\r\n  box-shadow: 0 0 0 4px var(--looks-transparent);\r\n  border-radius: 1.375rem;\r\n  transition:\r\n    width 0.25s,\r\n    background-color 0.25s,\r\n    box-shadow 0.5s;\r\n}\r\n\r\n[dir=\"ltr\"] .sa-search-sprites-container {\r\n  right: 4.75rem;\r\n}\r\n\r\n[dir=\"rtl\"] .sa-search-sprites-container {\r\n  left: 4.75rem;\r\n}\r\n\r\n.sa-search-sprites-container:hover,\r\n.sa-search-sprites-container:focus-within,\r\n.sa-search-sprites-container:not(.sa-search-sprites-empty) {\r\n  width: max(12rem, calc(100% - 5.75rem));\r\n  background-color: var(--input-background);\r\n}\r\n\r\n.sa-search-sprites-container:focus-within {\r\n  box-shadow: 0 0 0 6px var(--looks-transparent);\r\n}\r\n\r\ninput.sa-search-sprites-box {\r\n  width: 100%;\r\n  height: 100%;\r\n  box-sizing: border-box;\r\n  padding: 0;\r\n  padding-inline-start: 2.75rem; /* space for icon */\r\n  background-color: transparent;\r\n  border: 0px;\r\n  border-radius: 1.375rem;\r\n  outline: none;\r\n  color: var(--text-primary);\r\n  font-size: 0.875rem;\r\n  transition: padding 0.25s;\r\n}\r\n\r\n.sa-search-sprites-container:hover input.sa-search-sprites-box,\r\n.sa-search-sprites-container:focus-within input.sa-search-sprites-box,\r\n.sa-search-sprites-container:not(.sa-search-sprites-empty) input.sa-search-sprites-box {\r\n  padding-inline-end: 2.75rem; /* space for reset button */\r\n}\r\n\r\ninput.sa-search-sprites-box::placeholder {\r\n  color: var(--text-primary);\r\n  opacity: 0;\r\n  transition: opacity 0.25s;\r\n}\r\n\r\n.sa-search-sprites-container:hover input.sa-search-sprites-box::placeholder,\r\n.sa-search-sprites-container:focus-within input.sa-search-sprites-box::placeholder,\r\n.sa-search-sprites-container:not(.sa-search-sprites-empty) input.sa-search-sprites-box::placeholder {\r\n  opacity: 0.5;\r\n}\r\n\r\n.sa-search-sprites-icon {\r\n  position: absolute;\r\n  width: 2.75rem;\r\n  height: 2.75rem;\r\n  padding: 0.625rem;\r\n  filter: brightness(0) invert(1);\r\n  pointer-events: none;\r\n}\r\n\r\n[dir=\"ltr\"] .sa-search-sprites-icon {\r\n  left: 0;\r\n}\r\n\r\n[dir=\"rtl\"] .sa-search-sprites-icon {\r\n  right: 0;\r\n}\r\n\r\n.sa-search-sprites-container:hover .sa-search-sprites-icon,\r\n.sa-search-sprites-container:focus-within .sa-search-sprites-icon,\r\n.sa-search-sprites-container:not(.sa-search-sprites-empty) .sa-search-sprites-icon {\r\n  filter: none;\r\n}\r\n\r\n.sa-search-sprites-reset {\r\n  display: none;\r\n  margin: 0;\r\n  width: 2.75rem;\r\n  height: 2.75rem;\r\n  padding: 0;\r\n  justify-content: center;\r\n  align-items: center;\r\n  background: none;\r\n  border: none;\r\n  border-radius: 50%;\r\n  outline: none;\r\n  cursor: pointer;\r\n  position: absolute;\r\n}\r\n\r\n[dir=\"ltr\"] .sa-search-sprites-reset {\r\n  right: 0;\r\n}\r\n\r\n[dir=\"rtl\"] .sa-search-sprites-reset {\r\n  left: 0;\r\n}\r\n\r\n.sa-search-sprites-box:not(:placeholder-shown) ~ .sa-search-sprites-reset {\r\n  display: flex;\r\n}\r\n\r\n.sa-search-sprites-reset img {\r\n  width: 0.5rem;\r\n  height: 0.5rem;\r\n}\r\n\r\n.sa-search-sprites-reset:hover img {\r\n  transform: scale(1.2);\r\n}\r\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/url-loader/dist/cjs.js!./src/addons/addons/search-sprites/reset-icon.svg":
/*!***********************************************************************************************!*\
  !*** ./node_modules/url-loader/dist/cjs.js!./src/addons/addons/search-sprites/reset-icon.svg ***!
  \***********************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("data:image/svg+xml;base64,PHN2ZwogICB3aWR0aD0iOSIKICAgaGVpZ2h0PSI4IgogICB2ZXJzaW9uPSIxLjEiCiAgIGlkPSJzdmcxIgogICB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxkZWZzCiAgICAgaWQ9ImRlZnMxIiAvPgogIDxwYXRoCiAgICAgZmlsbD0ibm9uZSIKICAgICBzdHJva2U9IiM0Qzk3RkYiCiAgICAgc3Ryb2tlLXdpZHRoPSIyIgogICAgIGQ9Ik0gMSw3LjMzMyA3LjMzMywxIE0gMSwxIDcuMzMzLDcuMzMzIgogICAgIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIKICAgICBzdHJva2UtbGluZWpvaW49InJvdW5kIgogICAgIGlkPSJwYXRoMSIKICAgICBzdHlsZT0ic3Ryb2tlOiM1NzVlNzU7c3Ryb2tlLW9wYWNpdHk6MSIgLz4KPC9zdmc+Cg==");

/***/ }),

/***/ "./node_modules/url-loader/dist/cjs.js!./src/addons/addons/search-sprites/search-icon.svg":
/*!************************************************************************************************!*\
  !*** ./node_modules/url-loader/dist/cjs.js!./src/addons/addons/search-sprites/search-icon.svg ***!
  \************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("data:image/svg+xml;base64,PHN2ZwogICB3aWR0aD0iMjAiCiAgIGhlaWdodD0iMjAiCiAgIHZlcnNpb249IjEuMSIKICAgaWQ9InN2ZzEiCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sbnM6c3ZnPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPGRlZnMKICAgICBpZD0iZGVmczEiIC8+CiAgPHBhdGgKICAgICBmaWxsPSIjODU1Q0Q2IgogICAgIGZpbGwtcnVsZT0iZXZlbm9kZCIKICAgICBkPSJtIDkuMDksNS4yODIgYSAzLjgxNiwzLjgxNiAwIDAgMSAzLjgwNCwzLjgwNiBjIDAsMi4xIC0xLjcyLDMuODA1IC0zLjgwNSwzLjgwNSBBIDMuODA3LDMuODA3IDAgMCAxIDUuMjg0LDkuMDg4IGMgMCwtMi4xIDEuNzA1LC0zLjgwNiAzLjgwNSwtMy44MDYgbSA3LjU3OSw5Ljc3MiAtMi4xMjIsLTIuMTIzIGMgLTAuMjQ1LC0wLjI0NiAtMC4yNzksLTAuNjIgLTAuMTExLC0wLjkyNSAwLjg1MiwtMS41NzkgMS4wNiwtMy41OTMgMC4xNDQsLTUuNTY4IGEgNS45NDksNS45NDkgMCAwIDAgLTMuODY3LC0zLjIyOSA2LjEwNCw2LjEwNCAwIDAgMCAtNy42MSw3LjAxNyBjIDAuNDAzLDIuMjIzIDIuMTAxLDQuMDkzIDQuMjczLDQuNzA4IGEgNi4wOCw2LjA4IDAgMCAwIDQuNjE3LC0wLjUgMC43NzgsMC43NzggMCAwIDEgMC45MjgsMC4xMSBsIDIuMTM2LDIuMTI0IGMgMC4yMTMsMC4yMjggMC41MDIsMC4zMzUgMC44MDcsMC4zMzUgMC4yODksMCAwLjU3OCwtMC4xMDcgMC44MDUsLTAuMzM1IGEgMS4xNDYsMS4xNDYgMCAwIDAgMCwtMS42MTQiCiAgICAgaWQ9InBhdGgxIgogICAgIHN0eWxlPSJmaWxsOiM1NzVlNzU7ZmlsbC1vcGFjaXR5OjEiIC8+Cjwvc3ZnPgo=");

/***/ }),

/***/ "./src/addons/addons/search-sprites/_runtime_entry.js":
/*!************************************************************!*\
  !*** ./src/addons/addons/search-sprites/_runtime_entry.js ***!
  \************************************************************/
/*! exports provided: resources */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "resources", function() { return resources; });
/* harmony import */ var _userscript_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./userscript.js */ "./src/addons/addons/search-sprites/userscript.js");
/* harmony import */ var _css_loader_search_bar_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! css-loader!./search-bar.css */ "./node_modules/css-loader/index.js!./src/addons/addons/search-sprites/search-bar.css");
/* harmony import */ var _css_loader_search_bar_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_css_loader_search_bar_css__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _url_loader_reset_icon_svg__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! url-loader!./reset-icon.svg */ "./node_modules/url-loader/dist/cjs.js!./src/addons/addons/search-sprites/reset-icon.svg");
/* harmony import */ var _url_loader_search_icon_svg__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! url-loader!./search-icon.svg */ "./node_modules/url-loader/dist/cjs.js!./src/addons/addons/search-sprites/search-icon.svg");
/* generated by pull.js */




const resources = {
  "userscript.js": _userscript_js__WEBPACK_IMPORTED_MODULE_0__["default"],
  "search-bar.css": _css_loader_search_bar_css__WEBPACK_IMPORTED_MODULE_1___default.a,
  "reset-icon.svg": _url_loader_reset_icon_svg__WEBPACK_IMPORTED_MODULE_2__["default"],
  "search-icon.svg": _url_loader_search_icon_svg__WEBPACK_IMPORTED_MODULE_3__["default"]
};

/***/ }),

/***/ "./src/addons/addons/search-sprites/userscript.js":
/*!********************************************************!*\
  !*** ./src/addons/addons/search-sprites/userscript.js ***!
  \********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (async function (_ref) {
  let {
    addon,
    console,
    msg
  } = _ref;
  let spritesContainer;
  let spriteSelectorContainer;
  const container = document.createElement("div");
  container.className = "sa-search-sprites-container sa-search-sprites-empty";
  addon.tab.displayNoneWhileDisabled(container);
  const searchBox = document.createElement("input");
  searchBox.className = "sa-search-sprites-box";
  searchBox.placeholder = msg("placeholder");
  searchBox.autocomplete = "off";
  // search might make more sense, but browsers treat them special in ways that this addon does not handle,
  // so just leave it as a text input. Also note that Scratch uses type=text for its own search inputs in
  // the libraries, so this fits right in.
  searchBox.type = "text";
  const search = query => {
    if (!spritesContainer) return;
    query = query.toLowerCase();
    const containsQuery = str => str.toLowerCase().includes(query);
    for (const sprite of spritesContainer.children) {
      const visible = !query || containsQuery(sprite.children[0].children[1].innerText) || containsQuery(sprite.children[0].children[2].children[0].innerText) && sprite.children[0].classList.contains("sa-folders-folder");
      sprite.style.display = visible ? "" : "none";
    }
  };
  searchBox.addEventListener("input", e => {
    container.classList.toggle("sa-search-sprites-empty", !e.target.value);
    search(e.target.value);
  });
  const searchIcon = document.createElement("img");
  searchIcon.className = "sa-search-sprites-icon";
  searchIcon.src = addon.self.getResource("/search-icon.svg") /* rewritten by pull.js */;
  searchIcon.alt = "";
  searchIcon.draggable = false;
  const reset = () => {
    search("");
    searchBox.value = "";
    container.classList.add("sa-search-sprites-empty");
  };
  const resetButton = document.createElement("button");
  resetButton.className = "sa-search-sprites-reset";
  resetButton.addEventListener("click", () => {
    reset();
    searchBox.focus();
  });
  addon.self.addEventListener("disabled", reset);
  const resetIcon = document.createElement("img");
  resetIcon.src = addon.self.getResource("/reset-icon.svg") /* rewritten by pull.js */;
  resetIcon.alt = msg("clear");
  resetIcon.draggable = false;
  resetButton.appendChild(resetIcon);
  container.appendChild(searchBox);
  container.appendChild(searchIcon);
  container.appendChild(resetButton);
  while (true) {
    await addon.tab.waitForElement("div[class^='sprite-selector_items-wrapper']", {
      markAsSeen: true,
      reduxEvents: ["scratch-gui/mode/SET_PLAYER", "fontsLoaded/SET_FONTS_LOADED", "scratch-gui/locales/SELECT_LOCALE"],
      reduxCondition: state => !state.scratchGui.mode.isPlayerOnly
    });
    spritesContainer = document.querySelector('[class^="sprite-selector_items-wrapper"]');
    spriteSelectorContainer = document.querySelector('[class^="sprite-selector_sprite-selector"]');
    const addButton = document.querySelector('[class*="sprite-selector_add-button"]');
    spriteSelectorContainer.insertBefore(container, addButton);
    reset(); // Clear search box after going outside then inside
  }
});

/***/ })

}]);
//# sourceMappingURL=addon-entry-search-sprites.js.map