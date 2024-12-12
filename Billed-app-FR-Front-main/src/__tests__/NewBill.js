/* eslint-disable jest/no-mocks-import */
/**
 * @jest-environment jsdom
 */

import {fireEvent, screen} from "@testing-library/dom"
import "@testing-library/jest-dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import {localStorageMock} from "../__mocks__/localStorage.js"
import mockStore from "../__mocks__/store.js"
import {ROUTES_PATH} from "../constants/routes.js"
import router from "../app/Router.js"
import store from "../app/Store.js"

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

    // TEST : si l'icône email a la class "active-icon"
    test("Then newBill icon in vertical layout should be highlighted", () => {
      const windowIcon = screen.getByTestId("icon-mail")
      expect(windowIcon).toHaveClass("active-icon")
    })

  })
})

// Tester la longeur de Form
describe('When I am on NewBill Page', () => {
  // display newBill page
  test('Then the newBill page should be rendered', () => {
    // DOM construction
    document.body.innerHTML = NewBillUI()

    // expected result
    expect(screen.getAllByText('Envoyer une note de frais')).toBeTruthy()
  })

  // afficher 9 inputs length
  test('Then a form with nine fields should be rendered', () => {
    // DOM construction
    document.body.innerHTML = NewBillUI()

    // get DOM element
    const form = document.querySelector('form')

    // expected result
    expect(form.length).toEqual(9)
  })
})

// Tester le fileHandler
describe('When I am on NewBill Page and I add an attached file', () => {
  // handle attached file format
  test('Then the file handler should be run', () => {
    // DOM construction
    document.body.innerHTML = NewBillUI()

    // get DOM element
    const newBill = new NewBill({
      document,
      onNavigate,
      store: store,
      localStorage: window.localStorage,
    })

    // handle event
    const handleChangeFile = jest.fn(() => newBill.handleChangeFile)
    const attachedFile = screen.getByTestId('file')
    attachedFile.addEventListener('change', handleChangeFile)
    fireEvent.change(attachedFile, {
      target: {
        files: [new File(['file.txt'], 'file.txt', { type: 'text/txt' })],
      },
    })

    // expected result
    const numberOfFile = screen.getByTestId('file').files.length
    expect(numberOfFile).toEqual(1)
  })
})

// tester le submit de la form et la redirection a BillsUI.js
describe('WHEN I am on NewBill page and I submit a correct form', () => {
  // TEST : submit correct form and attached file
  test('THEN I should be redirected to Bills page', () => {
    // Mock the onNavigate function
    const onNavigate = jest.fn()

    // DOM construction
    document.body.innerHTML = NewBillUI()

    // get DOM element
    const newBillContainer = new NewBill({
      document,
      onNavigate,
      store: null,
      localStorage: window.localStorage,
    })

    // Populate form fields
    screen.getByTestId('expense-type').value = "Transports"
    screen.getByTestId('expense-name').value = "Vol test"
    screen.getByTestId('amount').value = 100
    screen.getByTestId('vat').value = 50
    screen.getByTestId('pct').value = 50
    screen.getByTestId('datepicker').value = "2024-12-06"

    // handle event submit attached file
    const handleSubmit = jest.fn(newBillContainer.handleSubmit)
    newBillContainer.fileName = 'image.jpg'

    // handle event submit form
    const newBillForm = screen.getByTestId('form-new-bill')
    newBillForm.addEventListener('submit', handleSubmit)
    fireEvent.submit(newBillForm)

    // expected results
    expect(handleSubmit).toHaveBeenCalled()
    expect(onNavigate).toHaveBeenCalledWith('#employee/bills')
  })
})