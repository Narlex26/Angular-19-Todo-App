/// <reference types="cypress" />

// Commandes personnalisées pour les tests Member Management
import {environment} from '../../src/environments/environment';

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Intercepte toutes les API calls pour Member Management
       */
      interceptMemberAPIs(): Chainable<void>

      /**
       * Ouvre le formulaire d'ajout de membre
       */
      openAddMemberForm(): Chainable<void>

      /**
       * Remplit le formulaire membre avec les données fournies
       */
      fillMemberForm(member: { firstName: string; lastName: string; email: string }): Chainable<void>

      /**
       * Vérifie qu'un membre est affiché dans le tableau
       */
      verifyMemberInTable(member: { firstName: string; lastName: string; email: string }, index?: number): Chainable<void>

      /**
       * Ouvre le formulaire d'édition pour un membre spécifique
       */
      editMember(memberIndex: number): Chainable<void>

      /**
       * Supprime un membre avec confirmation
       */
      deleteMember(memberIndex: number, confirm: boolean): Chainable<void>
    }
  }
}

Cypress.Commands.add('interceptMemberAPIs', () => {
  const API_BASE_URL = environment.apiBaseUrl;
  const API_KEY = environment.API_KEY;
  cy.intercept(
    {
      method: 'GET',
      url: `${API_BASE_URL}/users`,
      headers: {
        'x-api-key': API_KEY
      }
    },
    { fixture: 'members.json' }
  ).as('getMembers');

  cy.intercept(
    {
      method: 'POST',
      url: `${API_BASE_URL}/users`,
      headers: {
        'x-api-key': API_KEY
      }
    },
    {
      statusCode: 201,
      body: { id: 4, firstName: 'Test', lastName: 'User', email: 'test@example.com' }
    }
  ).as('createMember');

  cy.intercept(
    {
      method: 'PUT',
      url: `${API_BASE_URL}/users/*`,
      headers: {
        'x-api-key': API_KEY
      }
    },
    { statusCode: 200 }
  ).as('updateMember');

  cy.intercept(
    {
      method: 'DELETE',
      url: `${API_BASE_URL}/users/*`,
      headers: {
        'x-api-key': API_KEY
      }
    },
    { statusCode: 200 }
  ).as('deleteMember');
});

Cypress.Commands.add('openAddMemberForm', () => {
  // S'assurer qu'aucune modal n'est ouverte avant de commencer
  cy.get('.modal').should('not.have.class', 'show');

  cy.get('.btn-primary').contains('ADD MEMBER').click();
  cy.get('.modal').should('have.class', 'show');
  cy.get('.modal-content h2').should('contain.text', 'Add Member');
});

Cypress.Commands.add('fillMemberForm', (member) => {
  // Attendre que le formulaire soit visible et prêt
  cy.get('.modal.show').should('be.visible');

  cy.get('input[formControlName="firstName"]').clear().type(member.firstName);
  cy.get('input[formControlName="lastName"]').clear().type(member.lastName);
  cy.get('input[formControlName="email"]').clear().type(member.email);

  // Attendre que le bouton soit activé (formulaire valide)
  cy.get('button[type="submit"]').should('not.be.disabled');
});

Cypress.Commands.add('verifyMemberInTable', (member, index = 0) => {
  cy.get('.member-table tbody tr').eq(index).within(() => {
    cy.get('td').eq(0).should('contain.text', member.lastName);
    cy.get('td').eq(1).should('contain.text', member.firstName);
    cy.get('td').eq(2).should('contain.text', member.email);
    cy.get('td').eq(3).find('button').should('have.length', 2);
  });
});

Cypress.Commands.add('editMember', (memberIndex) => {
  // S'assurer qu'aucune modal n'est ouverte avant de commencer
  cy.get('.modal').should('not.have.class', 'show');

  cy.get('.member-table tbody tr').eq(memberIndex).find('button[title="Update"]').click();
  cy.get('.modal').should('have.class', 'show');
  cy.get('.modal-content h2').should('contain.text', 'Update Member');
});

Cypress.Commands.add('deleteMember', (memberIndex, confirm) => {
  cy.window().then((win) => {
    cy.stub(win, 'confirm').returns(confirm);
  });

  cy.get('.member-table tbody tr').eq(memberIndex).find('button[title="Delete"]').click();
});

export {};
