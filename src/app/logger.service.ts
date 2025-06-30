import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class LoggerService {
  constructor(private http: HttpClient) {}

  info(message: string, data?: any) {
    console.log('[INFO]', message, data);
    this.http.post('/api/logs', {
      level: 'info',
      message,
      data,
      timestamp: new Date(),
    }).subscribe();
  }

  error(message: string, error?: any) {
    console.error('[ERROR]', message, error);
    this.http.post('/api/logs', {
      level: 'error',
      message,
      error,
      timestamp: new Date(),
    }).subscribe();
  }
}
