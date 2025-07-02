// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Configuration globale pour tous les tests
Cypress.on('uncaught:exception', (err, runnable) => {
  // Ignorer certaines erreurs qui ne sont pas critiques pour les tests
  if (err.message.includes('ResizeObserver loop limit exceeded')) {
    return false
  }
  return true
})

// Hook global - s'exécute avant chaque test
beforeEach(() => {
  // Nettoyer les interceptions précédentes
  cy.clearAllCookies()
  cy.clearAllLocalStorage()
  cy.clearAllSessionStorage()
})
