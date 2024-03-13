import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  selectedLanguage:string='en';

  onLanguageChange(){
    this.translate.use(this.selectedLanguage);
  }


  constructor(private translate: TranslateService, private http: HttpClient) {}

  setDefaultLanguage(){
    this.translate.setDefaultLang('en');
    this.translate.use('en');
  }

}
