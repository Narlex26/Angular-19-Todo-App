import { Routes } from '@angular/router';
import { MemberManagementComponent } from './member-management/member-management.component';
import { DragDropComponent } from './drag-drop/drag-drop.component';
import { TodoComponent } from './todo/todo.component';
import { WeatherComponent } from './components/weather/weather.component';
import { HangingGameComponent } from './hanging-game/hanging-game.component';

export const routes: Routes = [
  {path:'members', component:MemberManagementComponent,pathMatch:'full' },
  {path:'tasks', component:DragDropComponent,pathMatch:'full' },
  {path:'todos',component:TodoComponent,pathMatch:'full'},
  {path: '', redirectTo: 'todos', pathMatch: 'full' },
  {path:'weather',component:WeatherComponent,pathMatch:'full'},
  {path: 'guess-word', component:HangingGameComponent,pathMatch: 'full' },
  {path:'weather',component:WeatherComponent,pathMatch:'full'}
];
