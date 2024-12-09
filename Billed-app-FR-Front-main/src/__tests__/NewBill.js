/* eslint-disable jest/no-mocks-import */
/**
 * @jest-environment jsdom
 */

import {screen} from "@testing-library/dom"
import "@testing-library/jest-dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import {localStorageMock} from "../__mocks__/localStorage.js"
import mockStore from "../__mocks__/store.js"
import {ROUTES_PATH} from "../constants/routes.js"
import router from "../app/Router.js"

jest.mock("../app/store", () => mockStore)

// créer et retourner nouvelle instance de NewBill
const setNewBill = () => {
  return new NewBill({
    document,
    onNavigate,
    store: mockStore,
    localStorage: window.localStorage,
  })
}

// render localStorage pour simuler un employé authentifié pour tous les tests de cette suite.
beforeAll(() => {
  Object.defineProperty(window, "localStorage", {
    value: localStorageMock,
  })

  window.localStorage.setItem(
      "user",
      JSON.stringify({
        type: "Employee",
        email: "a@a",
      })
  )
})

// naviguer vers la page NewBill avant chaque test
beforeEach(() => {
  const root = document.createElement("div")
  root.setAttribute("id", "root")
  document.body.append(root)
  router()

  document.body.innerHTML = NewBillUI()

  window.onNavigate(ROUTES_PATH.NewBill)
})

// nettoie la DOM = innerHTML vide
afterEach(() => {
  jest.resetAllMocks()
  document.body.innerHTML = ""
})


describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {

    // tester si l'icône email a la class "active-icon"
    test("Then newBill icon in vertical layout should be highlighted", () => {
      const windowIcon = screen.getByTestId("icon-mail")
      expect(windowIcon).toHaveClass("active-icon")
    })

  })
})