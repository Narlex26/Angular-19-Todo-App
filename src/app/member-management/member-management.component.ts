import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoggerService } from '../logger.service'; // Assurez-vous que le chemin est correct

interface Member {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

@Component({
  selector: 'app-member-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './member-management.component.html',
  styleUrls: ['./member-management.component.css']
})
export class MemberManagementComponent implements OnInit {

  members: Member[] = [];
  memberForm!: FormGroup;
  editingMemberId: number | null = null;
  showForm = false;
  errorMessage: string = '';

  constructor(private http: HttpClient, private fb: FormBuilder, private logger: LoggerService) {}

  ngOnInit(): void {
    this.logger.info('Initialisation du composant de gestion des membres');
    this.loadMembers();

    this.memberForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  loadMembers(): void {
    this.logger.info('Demande de chargement des membres depuis le backend');
    this.http.get<Member[]>('http://localhost:3000/api/users')
      .subscribe({
        next: (data) => {
          this.members = data;
          this.logger.info(`Affichage de ${data.length} membres dans l’interface`);
        },
        error: (error) => {
          this.logger.error('Échec du chargement des membres', error);
        }
      });
  }

  editMember(member: Member): void {
    this.logger.info(`L’utilisateur édite le membre ${member.id}`, member);
    this.editingMemberId = member.id!;
    this.memberForm.setValue({
      firstName: member.firstName,
      lastName: member.lastName,
      email: member.email
    });
    this.showForm = true;
  }

  deleteMember(id: number): void {
    if (confirm('Supprimer ce membre ?')) {
      this.logger.info(`L’utilisateur a confirmé la suppression du membre ${id}`);

      this.http.delete(`http://localhost:3000/api/users/${id}`)
        .subscribe({
          next: () => {
            this.logger.info(`Suppression du membre ${id} déclenchée, mise à jour de l’affichage`);
            this.loadMembers();
          },
          error: (error) => {
            this.logger.error(`Erreur lors de la tentative de suppression du membre ${id}`, error);
          }
        });
    }
  }

  addMember(): void {
    this.logger.info('L’utilisateur a ouvert le formulaire pour ajouter un nouveau membre');
    this.editingMemberId = null;
    this.memberForm.reset();
    this.showForm = true;
  }

  submitForm(): void {
    const memberData = this.memberForm.value;

    if (this.editingMemberId) {
      // Update
      this.logger.info(`Soumission du formulaire pour mise à jour du membre ${this.editingMemberId}`, memberData);
      this.http.put(`http://localhost:3000/api/users/${this.editingMemberId}`, memberData)
        .subscribe({
          next: () => {
            this.loadMembers();
            this.memberForm.reset();
            this.editingMemberId = null;
            this.errorMessage = ''; // reset erreur
            this.showForm = false;  // fermer modale si utilisé
          },
          error: (error) => {
            this.handleError(error);
          }
        });
    } else {
      // Create
      this.logger.info('Soumission du formulaire pour création d’un nouveau membre', memberData);
      this.http.post(`http://localhost:3000/api/users`, memberData)
        .subscribe({
          next: () => {
            this.loadMembers();
            this.memberForm.reset();
            this.errorMessage = '';
            this.showForm = false;
          },
          error: (error) => {
            this.handleError(error);
          }
        });
    }
  }

  cancelEdit(): void {
    this.memberForm.reset();
    this.editingMemberId = null;
    this.showForm = false;
  }

  handleError(error: any) {
    // Exemple simple, adapter selon la structure de ton erreur backend
    this.logger.error('Erreur affichée à l’utilisateur après soumission du formulaire', error);
    if (error.status === 400 && error.error?.message) {
      this.errorMessage = error.error.message; // message venant du back
    } else {
      this.errorMessage = 'Une erreur est survenue. Veuillez réessayer.';
    }
  }

}
