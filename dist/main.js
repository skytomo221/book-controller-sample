/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/otamashelf-extension/dist/BookController.js":
/*!******************************************************************!*\
  !*** ./node_modules/otamashelf-extension/dist/BookController.js ***!
  \******************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\r\nvar __importDefault = (this && this.__importDefault) || function (mod) {\r\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\r\n};\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nconst Extension_1 = __importDefault(__webpack_require__(/*! ./Extension */ \"./node_modules/otamashelf-extension/dist/Extension.js\"));\r\nclass BookController extends Extension_1.default {\r\n}\r\nexports[\"default\"] = BookController;\r\n\n\n//# sourceURL=webpack://my-webpack-project/./node_modules/otamashelf-extension/dist/BookController.js?");

/***/ }),

/***/ "./node_modules/otamashelf-extension/dist/Extension.js":
/*!*************************************************************!*\
  !*** ./node_modules/otamashelf-extension/dist/Extension.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nclass Extension {\r\n}\r\nexports[\"default\"] = Extension;\r\n\n\n//# sourceURL=webpack://my-webpack-project/./node_modules/otamashelf-extension/dist/Extension.js?");

/***/ }),

/***/ "./node_modules/otamashelf-extension/dist/RemoteBookController.js":
/*!************************************************************************!*\
  !*** ./node_modules/otamashelf-extension/dist/RemoteBookController.js ***!
  \************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\r\nvar __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {\r\n    if (k2 === undefined) k2 = k;\r\n    var desc = Object.getOwnPropertyDescriptor(m, k);\r\n    if (!desc || (\"get\" in desc ? !m.__esModule : desc.writable || desc.configurable)) {\r\n      desc = { enumerable: true, get: function() { return m[k]; } };\r\n    }\r\n    Object.defineProperty(o, k2, desc);\r\n}) : (function(o, m, k, k2) {\r\n    if (k2 === undefined) k2 = k;\r\n    o[k2] = m[k];\r\n}));\r\nvar __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {\r\n    Object.defineProperty(o, \"default\", { enumerable: true, value: v });\r\n}) : function(o, v) {\r\n    o[\"default\"] = v;\r\n});\r\nvar __importStar = (this && this.__importStar) || function (mod) {\r\n    if (mod && mod.__esModule) return mod;\r\n    var result = {};\r\n    if (mod != null) for (var k in mod) if (k !== \"default\" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);\r\n    __setModuleDefault(result, mod);\r\n    return result;\r\n};\r\nvar __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\r\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\r\n    return new (P || (P = Promise))(function (resolve, reject) {\r\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\r\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\r\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\r\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\r\n    });\r\n};\r\nvar __importDefault = (this && this.__importDefault) || function (mod) {\r\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\r\n};\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nconst net = __importStar(__webpack_require__(/*! net */ \"net\"));\r\nconst BookController_1 = __importDefault(__webpack_require__(/*! ./BookController */ \"./node_modules/otamashelf-extension/dist/BookController.js\"));\r\nclass RemoteBookController extends BookController_1.default {\r\n    activate(port) {\r\n        const client = net.connect(port, 'localhost');\r\n        client.on('data', (buffer) => __awaiter(this, void 0, void 0, function* () {\r\n            const { action, data } = JSON.parse(buffer.toString());\r\n            const result = yield this.call(action, data);\r\n            client.write(JSON.stringify({ action, data: result }));\r\n        }));\r\n    }\r\n    call(action, data) {\r\n        switch (action) {\r\n            case 'properties':\r\n                return this.properties();\r\n            case 'createPage':\r\n                return this.createPage(data.templateId);\r\n            case 'deletePage':\r\n                return this.deletePage(data.id);\r\n            case 'readPage':\r\n                return this.readPage(data.id);\r\n            case 'readPages':\r\n                return this.readPages(data.ids);\r\n            case 'updatePage':\r\n                return this.updatePage(data.word);\r\n            case 'readSearchModes':\r\n                return this.readSearchModes();\r\n            case 'readSearchIndexes':\r\n                return this.readSearchIndexes(data.searchModeId);\r\n            case 'readTemplates':\r\n                return this.readTemplates();\r\n            case 'onClick':\r\n                return this.onClick(data.scriptm, data.id);\r\n            case 'newBook':\r\n                return this.newBook(data.path);\r\n            case 'load':\r\n                return this.load(data.path);\r\n            case 'save':\r\n                return this.save(data.path);\r\n            default:\r\n                return Promise.reject(new Error(`Unknown action: ${action}`));\r\n        }\r\n    }\r\n}\r\nexports[\"default\"] = RemoteBookController;\r\n\n\n//# sourceURL=webpack://my-webpack-project/./node_modules/otamashelf-extension/dist/RemoteBookController.js?");

/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ TsvController)\n/* harmony export */ });\n/* harmony import */ var node_fs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! node:fs */ \"node:fs\");\n/* harmony import */ var node_fs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(node_fs__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var otamashelf_extension_dist_RemoteBookController__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! otamashelf-extension/dist/RemoteBookController */ \"./node_modules/otamashelf-extension/dist/RemoteBookController.js\");\n/* harmony import */ var otamashelf_extension_dist_RemoteBookController__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(otamashelf_extension_dist_RemoteBookController__WEBPACK_IMPORTED_MODULE_1__);\nvar __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {\r\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\r\n    return new (P || (P = Promise))(function (resolve, reject) {\r\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\r\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\r\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\r\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\r\n    });\r\n};\r\n\r\n\r\nclass TsvController extends (otamashelf_extension_dist_RemoteBookController__WEBPACK_IMPORTED_MODULE_1___default()) {\r\n    constructor() {\r\n        super(...arguments);\r\n        this.dictionary = [];\r\n    }\r\n    properties() {\r\n        return __awaiter(this, void 0, void 0, function* () {\r\n            return {\r\n                name: \"Sample Controller\",\r\n                id: \"@skytomo221/sample-controller\",\r\n                version: \"0.1.0\",\r\n                type: \"book-controller\",\r\n                author: \"skytomo221\",\r\n                format: \"file\",\r\n                filters: [\r\n                    {\r\n                        name: \"カスタム形式\",\r\n                        extensions: [\"tsv\"],\r\n                    },\r\n                ],\r\n            };\r\n        });\r\n    }\r\n    static toWordCard(record) {\r\n        return {\r\n            id: record.id,\r\n            title: record.word,\r\n            entry: {\r\n                id: parseInt(record.id, 36),\r\n                form: record.word,\r\n            },\r\n            translations: [\r\n                {\r\n                    title: record.pos,\r\n                    forms: [record.meaning],\r\n                },\r\n            ],\r\n            tags: [],\r\n            contents: [],\r\n            variations: [],\r\n            relations: [],\r\n        };\r\n    }\r\n    static toIndexCard(record) {\r\n        return {\r\n            id: record.id,\r\n            title: record.word,\r\n        };\r\n    }\r\n    createPage() {\r\n        return __awaiter(this, void 0, void 0, function* () {\r\n            if (this.dictionary === undefined) {\r\n                throw new Error(\"dictionary is undefined\");\r\n            }\r\n            let newId = undefined;\r\n            while (!(newId && this.dictionary.find((record) => record.id === newId))) {\r\n                newId = Math.random().toString(36).slice(-8);\r\n            }\r\n            this.dictionary.push({\r\n                id: newId,\r\n                word: \"\",\r\n                pos: \"\",\r\n                meaning: \"\",\r\n            });\r\n            return newId.toString();\r\n        });\r\n    }\r\n    deletePage(id) {\r\n        return __awaiter(this, void 0, void 0, function* () {\r\n            if (this.dictionary === undefined) {\r\n                throw new Error(\"dictionary is undefined\");\r\n            }\r\n            this.dictionary = this.dictionary.filter((record) => record.id !== id);\r\n            return true;\r\n        });\r\n    }\r\n    readPage(id) {\r\n        return __awaiter(this, void 0, void 0, function* () {\r\n            if (this.dictionary === undefined) {\r\n                throw new Error(\"dictionary is undefined\");\r\n            }\r\n            const word = this.dictionary.find((record) => record.id === id);\r\n            if (!word) {\r\n                throw new Error(\"card not found\");\r\n            }\r\n            return TsvController.toWordCard(word);\r\n        });\r\n    }\r\n    readPages(ids) {\r\n        return __awaiter(this, void 0, void 0, function* () {\r\n            if (this.dictionary === undefined) {\r\n                throw new Error(\"dictionary is undefined\");\r\n            }\r\n            return this.dictionary\r\n                .filter((word) => ids.includes(word.id))\r\n                .map((word) => TsvController.toWordCard(word));\r\n        });\r\n    }\r\n    readTemplates() {\r\n        return __awaiter(this, void 0, void 0, function* () {\r\n            if (this.dictionary === undefined) {\r\n                throw new Error(\"dictionary is undefined\");\r\n            }\r\n            return [\r\n                {\r\n                    id: \"new-word\",\r\n                    name: \"新しく単語を作成する\",\r\n                },\r\n            ];\r\n        });\r\n    }\r\n    updatePage(word) {\r\n        return __awaiter(this, void 0, void 0, function* () {\r\n            if (this.dictionary === undefined) {\r\n                throw new Error(\"otm is undefined\");\r\n            }\r\n            this.dictionary.map((record) => record.id === word.id\r\n                ? Object.assign(Object.assign({}, record), { id: word.id, word: word.title }) : record);\r\n            return word.id;\r\n        });\r\n    }\r\n    // eslint-disable-next-line class-methods-use-this\r\n    readSearchModes() {\r\n        return __awaiter(this, void 0, void 0, function* () {\r\n            return [\"単語\", \"和訳\"];\r\n        });\r\n    }\r\n    readSearchIndexes(searchModeId) {\r\n        return __awaiter(this, void 0, void 0, function* () {\r\n            if (this.dictionary === undefined) {\r\n                throw new Error(\"dictionary is undefined\");\r\n            }\r\n            switch (searchModeId) {\r\n                case \"単語\":\r\n                    return this.dictionary.map((record) => ({\r\n                        id: record.id,\r\n                        targets: [record.word],\r\n                    }));\r\n                case \"和訳\":\r\n                    return this.dictionary.map((record) => ({\r\n                        id: record.id,\r\n                        targets: [record.meaning],\r\n                    }));\r\n                default:\r\n                    return [];\r\n            }\r\n        });\r\n    }\r\n    onClick(script, id) {\r\n        return __awaiter(this, void 0, void 0, function* () {\r\n            throw new Error(\"not implemented\");\r\n        });\r\n    }\r\n    newBook(path) {\r\n        return __awaiter(this, void 0, void 0, function* () {\r\n            this.dictionary = [];\r\n            yield this.save(path);\r\n            return this;\r\n        });\r\n    }\r\n    load(path) {\r\n        return __awaiter(this, void 0, void 0, function* () {\r\n            this.dictionary = node_fs__WEBPACK_IMPORTED_MODULE_0__.readFileSync(path)\r\n                .toString()\r\n                .split(\"\\n\")\r\n                .map((line) => {\r\n                let newId = Math.random().toString(36).slice(-8);\r\n                while (this.dictionary.some((record) => record.id === newId)) {\r\n                    console.log(\"newId\", newId);\r\n                    newId = Math.random().toString(36).slice(-8);\r\n                }\r\n                const record = line.split(\"\\t\");\r\n                return {\r\n                    id: newId,\r\n                    word: record[0],\r\n                    pos: record[1],\r\n                    meaning: record[2],\r\n                };\r\n            });\r\n            console.log(this.dictionary);\r\n            return this;\r\n        });\r\n    }\r\n    save(path) {\r\n        return __awaiter(this, void 0, void 0, function* () {\r\n            if (this.dictionary === undefined) {\r\n                throw new Error(\"dictionary is undefined\");\r\n            }\r\n            node_fs__WEBPACK_IMPORTED_MODULE_0__.writeFileSync(path, this.dictionary\r\n                .map((record) => `${record.word}\\t${record.pos}\\t${record.meaning}`)\r\n                .join(\"\\n\"));\r\n            return this;\r\n        });\r\n    }\r\n}\r\nnew TsvController().activate(Number(process.argv[2]));\r\n\n\n//# sourceURL=webpack://my-webpack-project/./src/index.ts?");

/***/ }),

/***/ "net":
/*!**********************!*\
  !*** external "net" ***!
  \**********************/
/***/ ((module) => {

module.exports = require("net");

/***/ }),

/***/ "node:fs":
/*!**************************!*\
  !*** external "node:fs" ***!
  \**************************/
/***/ ((module) => {

module.exports = require("node:fs");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.ts");
/******/ 	
/******/ })()
;