import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {environment} from '../../environments/environment';

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

  private readonly apiKey = environment.API_KEY;
  private readonly httpOptions = {
    headers: new HttpHeaders({
      'x-api-key': this.apiKey
    })
  };

  constructor(private http: HttpClient, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.loadMembers();

    this.memberForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  loadMembers(): void {
    this.http.get<Member[]>(`${environment.apiBaseUrl}/users`, this.httpOptions)
      .subscribe(data => {
        this.members = data;
      });
  }

  editMember(member: Member): void {
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
      this.http.delete(`${environment.apiBaseUrl}/users/${id}`, this.httpOptions)
        .subscribe(() => this.loadMembers());
    }
  }

  addMember(): void {
    this.editingMemberId = null;
    this.memberForm.reset();
    this.showForm = true;
  }

  submitForm(): void {
    const memberData = this.memberForm.value;

    if (this.editingMemberId) {
      // Update
      this.http.put(`${environment.apiBaseUrl}/users/${this.editingMemberId}`, memberData, this.httpOptions)
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
      this.http.post(`${environment.apiBaseUrl}/users`, memberData, this.httpOptions)
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
    if (error.status === 400 && error.error?.message) {
      this.errorMessage = error.error.message; // message venant du back
    } else {
      this.errorMessage = 'Une erreur est survenue. Veuillez réessayer.';
    }
  }

}
