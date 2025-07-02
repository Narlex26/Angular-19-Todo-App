describe('Member Management E2E Tests', () => {
  beforeEach(() => {
    cy.interceptMemberAPIs();
    cy.visit('/users');
    cy.wait('@getMembers');
    // S'assurer qu'aucune modal n'est ouverte au début
    cy.get('.modal').should('not.have.class', 'show');
  });

  describe('Gestion des membres', () => {
    it('devrait créer un nouveau membre', () => {
      const newMember = {
        firstName: 'Nouveau',
        lastName: 'Membre',
        email: 'nouveau.membre@example.com'
      };

      cy.openAddMemberForm();
      cy.fillMemberForm(newMember);
      cy.get('button[type="submit"]').click();

      cy.wait('@createMember');
      // Attendre que la modal se ferme
      cy.get('.modal').should('not.have.class', 'show');
    });

    it('devrait éditer un membre existant', () => {
      const updatedMember = {
        firstName: 'Jean-Modifié',
        lastName: 'Dupont-Modifié',
        email: 'jean.modifie@example.com'
      };

      cy.editMember(0);
      cy.fillMemberForm(updatedMember);
      cy.get('button[type="submit"]').click();

      cy.wait('@updateMember');
      // Attendre que la modal se ferme
      cy.get('.modal').should('not.have.class', 'show');
    });

    it('devrait supprimer un membre avec confirmation', () => {
      cy.deleteMember(0, true);
      cy.wait('@deleteMember');
    });

    it('devrait annuler la suppression d\'un membre', () => {
      cy.deleteMember(0, false);
      cy.get('@deleteMember.all').should('have.length', 0);
    });

    it('devrait vérifier qu\'un membre est correctement affiché', () => {
      cy.verifyMemberInTable({
        firstName: 'Jean',
        lastName: 'Dupont',
        email: 'jean.dupont@example.com'
      }, 0);
    });
  });

  describe('Flux complets', () => {
    it('devrait effectuer un cycle complet CRUD', () => {
      // Vérifier l'état initial
      cy.get('.member-table tbody tr').should('have.length', 3);

      // Créer un nouveau membre
      const newMember = {
        firstName: 'Test',
        lastName: 'CRUD',
        email: 'test.crud@example.com'
      };

      cy.openAddMemberForm();
      cy.fillMemberForm(newMember);
      cy.get('button[type="submit"]').click();
      cy.wait('@createMember');
      // Attendre que la modal se ferme avant de continuer
      cy.get('.modal').should('not.have.class', 'show');

      // Éditer le membre
      cy.editMember(0);
      cy.fillMemberForm({
        firstName: 'Test-Édité',
        lastName: 'CRUD-Édité',
        email: 'test.crud.edited@example.com'
      });
      cy.get('button[type="submit"]').click();
      cy.wait('@updateMember');
      // Attendre que la modal se ferme avant de continuer
      cy.get('.modal').should('not.have.class', 'show');

      // Supprimer le membre
      cy.deleteMember(0, true);
      cy.wait('@deleteMember');
    });

    it('devrait gérer plusieurs membres consécutivement', () => {
      const membres = [
        { firstName: 'Alice', lastName: 'Wonderland', email: 'alice@example.com' },
        { firstName: 'Bob', lastName: 'Builder', email: 'bob@example.com' },
        { firstName: 'Charlie', lastName: 'Brown', email: 'charlie@example.com' }
      ];

      membres.forEach((membre, index) => {
        cy.openAddMemberForm();
        cy.fillMemberForm(membre);
        cy.get('button[type="submit"]').click();
        cy.wait('@createMember');
        // Attendre que la modal se ferme avant de continuer avec le membre suivant
        cy.get('.modal').should('not.have.class', 'show');
      });
    });
  });
});
